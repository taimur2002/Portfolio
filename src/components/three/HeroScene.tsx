"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive 3D particle sphere used as the hero backdrop.
 *
 * Raw three.js (no react-three-fiber) so there's no react-reconciler version to
 * keep in lockstep with React 19 / Next 16 — three is a pure JS lib. The module
 * is dynamically imported inside the effect so it ships as its own client chunk
 * loaded after first paint, and never touches the server bundle.
 *
 * Performance model — engineered to never drop a frame on any device:
 *  - 100% GPU-driven motion: the sphere breathes/rotates entirely in the vertex
 *    shader, so there is zero per-frame CPU vertex work and zero per-frame
 *    allocation (no GC pauses).
 *  - Fill cost stripped: no MSAA, no depth/stencil buffers, hard DPR cap,
 *    `mediump` fragment precision.
 *  - Adaptive quality: a lightweight FPS monitor auto-degrades DPR → point
 *    count → target-FPS the moment it detects sustained slow frames, so weak
 *    hardware stays smooth instead of janky.
 *  - Only runs when it can help: paused off-screen and while the tab is hidden;
 *    skipped entirely under Save-Data or a software (major-perf-caveat) GL
 *    context; honours `prefers-reduced-motion` (single static frame).
 *  - No first-frame stall: shaders are pre-compiled with `compileAsync`, and
 *    init itself is deferred to an idle slot.
 *  - Degrades to nothing (the CSS wash behind it carries the look) if WebGL or
 *    three fails to load.
 */

type ThreeModule = typeof import("three");

type PerfNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

// Brand accents as raw sRGB triplets (globals.css --color-accent*). Kept out of
// THREE.Color so the RawShaderMaterial can write them straight to the buffer
// without linear<->sRGB colour-management surprises.
const PALETTE: [number, number, number][] = [
  [16 / 255, 185 / 255, 129 / 255], // #10b981 emerald
  [20 / 255, 184 / 255, 166 / 255], // #14b8a6 teal
  [6 / 255, 182 / 255, 212 / 255], // #06b6d4 cyan
];

/** Sample the 3-stop palette at t ∈ [0,1]. */
function paletteAt(t: number): [number, number, number] {
  const clamped = Math.min(Math.max(t, 0), 1);
  const seg = clamped * (PALETTE.length - 1);
  const i = Math.min(Math.floor(seg), PALETTE.length - 2);
  const f = seg - i;
  const a = PALETTE[i];
  const b = PALETTE[i + 1];
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
}

// Simplex 3D noise — Ian McEwan, Ashima Arts (MIT). Drives the surface wobble.
const SNOISE_GLSL = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const VERTEX_SHADER = /* glsl */ `
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uSize;
uniform float uDpr;
uniform float uAmp;
attribute vec3 position;
attribute float aScale;
attribute vec3 aColor;
varying vec3 vColor;
varying float vAlpha;
${SNOISE_GLSL}
void main() {
  vColor = aColor;
  vec3 dir = normalize(position);
  float n = snoise(position * 0.5 + vec3(0.0, 0.0, uTime));
  vec3 displaced = position + dir * n * uAmp;
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * aScale * uDpr * (1.0 / -mvPosition.z);
  // Nearer points read a touch stronger — cheap depth cue.
  vAlpha = clamp((9.0 - (-mvPosition.z)) / 6.0, 0.15, 1.0);
}
`;

const FRAGMENT_SHADER = /* glsl */ `
precision mediump float;
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  // Squared falloff gives a bright core with a soft halo, which is what reads
  // as a glow once the material blends additively onto the dark canvas.
  float soft = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor, soft * soft * vAlpha * uOpacity);
}
`;

const RADIUS = 2.2;

/** Build the scene into `container`; returns a teardown fn (never throws). */
function init(THREE: ThreeModule, container: HTMLDivElement): () => void {
  const noop = () => {};

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Respect Data Saver — don't spend a byte or a watt on decoration.
  const nav = navigator as PerfNavigator;
  if (nav.connection?.saveData) return noop;

  // Device tier → sensible starting quality (adaptive monitor only lowers it).
  let width = container.clientWidth || 1;
  let height = container.clientHeight || 1;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = nav.deviceMemory ?? 4;
  const mobile = width < 768;
  const weak = mobile || cores <= 4 || memory <= 4;

  const count = weak ? 1800 : 4000;
  const dprCap = weak ? 1.25 : 1.5;
  let frameInterval = 1000 / (weak ? 30 : 60);

  let renderer: import("three").WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // soft-alpha discs — MSAA buys nothing, costs fill
      depth: false, // depthTest is off, so we never need a depth buffer
      stencil: false,
      powerPreference: "low-power",
      // Refuse a software (SwiftShader) context — it renders but janks. Better
      // to fall through to the static CSS wash than to ship a laggy canvas.
      failIfMajorPerformanceCaveat: true,
    });
  } catch {
    return noop; // no acceptable GL context — CSS wash carries the look
  }

  const baseDpr = Math.min(window.devicePixelRatio || 1, dprCap);
  renderer.setPixelRatio(baseDpr);
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(width, height, false);

  const canvas = renderer.domElement;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 6.5);

  // --- Geometry ------------------------------------------------------------
  // Fibonacci sphere for even coverage, then a Fisher–Yates shuffle so that any
  // *prefix* of the buffer is itself a uniform subset — lets the adaptive
  // monitor thin the cloud via draw-range without leaving a bald patch.
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // 1 → -1
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * RADIUS;
    positions[i * 3 + 1] = y * RADIUS;
    positions[i * 3 + 2] = Math.sin(theta) * r * RADIUS;
    const t = (y + 1) / 2 + (Math.sin(i * 12.9898) * 0.5) * 0.18;
    const [cr, cg, cb] = paletteAt(t);
    colors[i * 3] = cr;
    colors[i * 3 + 1] = cg;
    colors[i * 3 + 2] = cb;
    scales[i] = 0.55 + (Math.sin(i * 78.233) * 0.5 + 0.5) * 1.0;
  }
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    for (let k = 0; k < 3; k++) {
      const pi = i * 3 + k;
      const pj = j * 3 + k;
      let tmp = positions[pi];
      positions[pi] = positions[pj];
      positions[pj] = tmp;
      tmp = colors[pi];
      colors[pi] = colors[pj];
      colors[pj] = tmp;
    }
    const ts = scales[i];
    scales[i] = scales[j];
    scales[j] = ts;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), RADIUS * 1.5);

  const material = new THREE.RawShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 30 },
      uDpr: { value: baseDpr },
      uAmp: { value: 0.34 },
      uOpacity: { value: 0.85 },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    // Additive on the dark canvas: overlapping particles accumulate into light.
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false; // always on-screen while we render → skip the test
  scene.add(points);

  // --- Responsive layout ---------------------------------------------------
  // Cache the viewport so pointer parallax never reads layout on mousemove.
  let vw = window.innerWidth || 1;
  let vh = window.innerHeight || 1;
  function layout() {
    width = container.clientWidth || 1;
    height = container.clientHeight || 1;
    vw = window.innerWidth || 1;
    vh = window.innerHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const isMobile = width < 768;
    points.position.x = isMobile ? 0 : 1.7;
    points.position.y = isMobile ? 0.15 : 0.35;
    points.scale.setScalar(Math.min(Math.max(width / 1100, 0.62), 1.15));
  }
  layout();

  // --- Pointer parallax (smoothed, allocation-free) ------------------------
  const pointerTarget = { x: 0, y: 0 };
  const pointerCurrent = { x: 0, y: 0 };
  const onPointerMove = (e: PointerEvent) => {
    pointerTarget.x = (e.clientX / vw) * 2 - 1;
    pointerTarget.y = (e.clientY / vh) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  // Own clock: elapsed seconds accumulated from the rAF timestamp. Advances
  // only on rendered frames (so pausing freezes time with no resume-jump) and
  // is delta-capped, so a throttled tab can't fast-forward the animation.
  let elapsed = 0;
  function renderFrame() {
    const t = elapsed;
    material.uniforms.uTime.value = t * 0.22;
    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.05;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.05;
    points.rotation.y = t * 0.05 + pointerCurrent.x * 0.35;
    points.rotation.x = pointerCurrent.y * 0.2;
    renderer.render(scene, camera);
  }

  // --- Adaptive quality ----------------------------------------------------
  // Watch the *actual* gap between rendered frames (EMA). If it runs well over
  // the target for a sustained window, step quality down: DPR, then point
  // count, then target-FPS. Monotonic (never steps back up) so it can't
  // oscillate. This is what makes it lag-free on hardware we can't predict.
  let quality = 0;
  function applyDpr(scale: number) {
    const d = Math.max(0.75, Math.min(baseDpr * scale, baseDpr));
    renderer.setPixelRatio(d);
    renderer.setSize(width, height, false);
    material.uniforms.uDpr.value = d;
  }
  function degrade() {
    if (quality >= 3) return;
    quality++;
    if (quality === 1) applyDpr(0.8);
    else if (quality === 2) geometry.setDrawRange(0, Math.floor(count * 0.6));
    else if (quality === 3) {
      frameInterval = 1000 / 20;
      applyDpr(0.7);
    }
  }

  // --- Frame loop (throttled, self-scheduling) -----------------------------
  let rafId = 0;
  let running = false;
  let ready = false; // shaders compiled
  let intersecting = false;
  let contextLost = false;
  let destroyed = false;
  let lastRender = 0;
  let lastEval = 0;
  let emaDelta = frameInterval;
  let warmedUp = false;

  function loop(now: number) {
    if (!running) return;
    rafId = requestAnimationFrame(loop);
    if (now - lastRender < frameInterval - 1) return;
    const delta = lastRender ? now - lastRender : frameInterval;
    lastRender = now;
    emaDelta += (delta - emaDelta) * 0.1;
    elapsed += Math.min(delta, 100) / 1000; // capped so a throttled tab can't jump
    renderFrame();
    if (now - lastEval > 2000) {
      lastEval = now;
      if (warmedUp && emaDelta > frameInterval * 1.45) degrade();
      warmedUp = true; // skip the first window (load/compile spikes)
    }
  }
  function start() {
    if (running || reducedMotion || contextLost) return;
    running = true;
    lastRender = 0;
    lastEval = 0;
    emaDelta = frameInterval;
    warmedUp = false;
    rafId = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }
  function sync() {
    if (ready && intersecting && !document.hidden && !contextLost) start();
    else stop();
  }

  // --- Visibility / lifecycle wiring ---------------------------------------
  const io = new IntersectionObserver(
    ([entry]) => {
      intersecting = entry.isIntersecting;
      sync();
    },
    { threshold: 0, rootMargin: "120px" },
  );
  io.observe(container);

  const onVisibility = () => sync();
  document.addEventListener("visibilitychange", onVisibility);

  const ro = new ResizeObserver(() => {
    layout();
    if (ready && !running) renderFrame(); // keep the static frame correct
  });
  ro.observe(container);

  const onContextLost = (e: Event) => {
    e.preventDefault(); // allow restoration; meanwhile stop cleanly
    contextLost = true;
    stop();
  };
  const onContextRestored = () => {
    contextLost = false;
    sync();
  };
  canvas.addEventListener("webglcontextlost", onContextLost as EventListener);
  canvas.addEventListener(
    "webglcontextrestored",
    onContextRestored as EventListener,
  );

  // --- Pre-warm shaders, then go -------------------------------------------
  // compileAsync uses KHR_parallel_shader_compile where available so the first
  // rendered frame never stalls compiling the program.
  Promise.resolve(renderer.compileAsync(scene, camera))
    .catch(() => {})
    .then(() => {
      if (destroyed) return;
      ready = true;
      renderFrame(); // paint one frame immediately (no blank flash)
      sync(); // then run only if actually on-screen
    });

  return () => {
    destroyed = true;
    stop();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener(
      "webglcontextlost",
      onContextLost as EventListener,
    );
    canvas.removeEventListener(
      "webglcontextrestored",
      onContextRestored as EventListener,
    );
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    if (canvas.parentNode === container) container.removeChild(canvas);
  };
}

export function HeroScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let teardown: (() => void) | undefined;
    let scheduleId: number | undefined;

    import("three")
      .then((THREE) => {
        if (disposed) return;
        // Defer WebGL init (buffer build + shader compile) to an idle slot so it
        // never competes with the hero's entrance animation or first paint.
        const boot = () => {
          if (!disposed) teardown = init(THREE, container);
        };
        const w = window as IdleWindow;
        scheduleId = w.requestIdleCallback
          ? w.requestIdleCallback(boot, { timeout: 800 })
          : window.setTimeout(boot, 200);
      })
      .catch(() => {
        /* WebGL / three unavailable — the CSS wash behind us carries the look. */
      });

    return () => {
      disposed = true;
      if (scheduleId !== undefined) {
        // Only one of these matches the id's pool; the other is a harmless no-op.
        (window as IdleWindow).cancelIdleCallback?.(scheduleId);
        window.clearTimeout(scheduleId);
      }
      teardown?.();
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden />;
}
