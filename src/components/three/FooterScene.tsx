"use client";

import { useEffect, useRef } from "react";

/**
 * Glowing particle constellation for the dark footer — the visual bookend to
 * the hero sphere. A small field of accent-coloured nodes drifts slowly and
 * links up with nearby neighbours; on the near-black footer, additive blending
 * turns them into soft neon glows (something the light hero couldn't do).
 *
 * Same "never lags" engine as HeroScene:
 *  - Tiny node count (≤80), so the per-frame drift + link rebuild is a fraction
 *    of a millisecond on the CPU; points and lines render additively on the GPU.
 *  - Adaptive quality (DPR → FPS) driven by a rolling frame-time average.
 *  - Paused off-screen / tab-hidden; skipped under Save-Data or a software GL
 *    context; honours prefers-reduced-motion (one static frame).
 *  - Deferred init (idle) + compileAsync, full dispose on unmount.
 *  - Falls back to nothing (the footer's own glow shows) if WebGL is missing.
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

// Brand accents as raw sRGB triplets (globals.css --color-accent*).
const PALETTE: [number, number, number][] = [
  [249 / 255, 115 / 255, 22 / 255], // #f97316 orange
  [244 / 255, 88 / 255, 43 / 255], // #f4582b orange-red
  [239 / 255, 68 / 255, 68 / 255], // #ef4444 red
];

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

const POINT_VERT = /* glsl */ `
precision mediump float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uSize;
uniform float uDpr;
attribute vec3 position;
attribute float aScale;
attribute vec3 aColor;
varying vec3 vColor;
void main() {
  vColor = aColor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aScale * uDpr * (1.0 / -mv.z);
}
`;

const POINT_FRAG = /* glsl */ `
precision mediump float;
uniform float uOpacity;
varying vec3 vColor;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  // Bright core, soft glow falloff — reads as neon under additive blending.
  float core = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor, core * core * uOpacity);
}
`;

/** Build the constellation into `container`; returns a teardown fn (never throws). */
function init(THREE: ThreeModule, container: HTMLDivElement): () => void {
  const noop = () => {};

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const nav = navigator as PerfNavigator;
  if (nav.connection?.saveData) return noop;

  let width = container.clientWidth || 1;
  let height = container.clientHeight || 1;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = nav.deviceMemory ?? 4;
  const weak = width < 768 || cores <= 4 || memory <= 4;

  const N = weak ? 42 : 80;
  // Cap sized well above the realistic link count so it's effectively never
  // hit. Truncating links against a low cap is what made connections blink in
  // and out: as nodes drifted, which links survived the cap kept flipping.
  const MAX_SEG = weak ? 240 : 700;
  const LINK_DIST = weak ? 1.9 : 1.5; // world units; keeps link count in budget
  const dprCap = weak ? 1.25 : 1.5;
  let frameInterval = 1000 / (weak ? 30 : 60);

  let renderer: import("three").WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      failIfMajorPerformanceCaveat: true,
    });
  } catch {
    return noop;
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
  const CAM_Z = 6;
  camera.position.set(0, 0, CAM_Z);
  const group = new THREE.Group();
  scene.add(group);

  // Visible half-extents at the node plane (z≈0) — keeps drift inside frame.
  let halfH = Math.tan((45 * Math.PI) / 360) * CAM_Z;
  let halfW = halfH * (width / height);
  const Z_RANGE = 1.1;

  // --- Node state (CPU-simulated; N is tiny so this is ~free) --------------
  const nodePos = new Float32Array(N * 3);
  const nodeVel = new Float32Array(N * 3);
  const nodeColor = new Float32Array(N * 3);
  const nodeScale = new Float32Array(N);
  const seed = (n: number) => Math.sin(n) * 0.5 + 0.5;
  for (let i = 0; i < N; i++) {
    nodePos[i * 3] = (Math.random() * 2 - 1) * halfW * 0.95;
    nodePos[i * 3 + 1] = (Math.random() * 2 - 1) * halfH * 0.95;
    nodePos[i * 3 + 2] = (Math.random() * 2 - 1) * Z_RANGE;
    const sp = 0.12; // world units / sec
    nodeVel[i * 3] = (Math.random() * 2 - 1) * sp;
    nodeVel[i * 3 + 1] = (Math.random() * 2 - 1) * sp;
    nodeVel[i * 3 + 2] = (Math.random() * 2 - 1) * sp * 0.4;
    const [cr, cg, cb] = paletteAt(seed(i * 3.1));
    nodeColor[i * 3] = cr;
    nodeColor[i * 3 + 1] = cg;
    nodeColor[i * 3 + 2] = cb;
    nodeScale[i] = 0.7 + seed(i * 7.3) * 1.1;
  }

  // --- Points --------------------------------------------------------------
  const pointGeo = new THREE.BufferGeometry();
  const pointPosAttr = new THREE.BufferAttribute(nodePos, 3);
  pointPosAttr.setUsage(THREE.DynamicDrawUsage);
  pointGeo.setAttribute("position", pointPosAttr);
  pointGeo.setAttribute("aColor", new THREE.BufferAttribute(nodeColor, 3));
  pointGeo.setAttribute("aScale", new THREE.BufferAttribute(nodeScale, 1));

  const pointMat = new THREE.RawShaderMaterial({
    uniforms: {
      uSize: { value: weak ? 26 : 30 },
      uDpr: { value: baseDpr },
      uOpacity: { value: 0.95 },
    },
    vertexShader: POINT_VERT,
    fragmentShader: POINT_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const pointCloud = new THREE.Points(pointGeo, pointMat);
  pointCloud.frustumCulled = false;
  group.add(pointCloud);

  // --- Links (rebuilt each frame from node proximity) ----------------------
  const linePos = new Float32Array(MAX_SEG * 2 * 3);
  const lineCol = new Float32Array(MAX_SEG * 2 * 3);
  const lineGeo = new THREE.BufferGeometry();
  const linePosAttr = new THREE.BufferAttribute(linePos, 3);
  const lineColAttr = new THREE.BufferAttribute(lineCol, 3);
  linePosAttr.setUsage(THREE.DynamicDrawUsage);
  lineColAttr.setUsage(THREE.DynamicDrawUsage);
  lineGeo.setAttribute("position", linePosAttr);
  lineGeo.setAttribute("color", lineColAttr);
  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  lines.frustumCulled = false;
  group.add(lines);

  // --- Simulation ----------------------------------------------------------
  const linkDist2 = LINK_DIST * LINK_DIST;
  function stepSim(dt: number) {
    // Drift + bounce inside the visible box.
    for (let i = 0; i < N; i++) {
      const ix = i * 3;
      let x = nodePos[ix] + nodeVel[ix] * dt;
      let y = nodePos[ix + 1] + nodeVel[ix + 1] * dt;
      let z = nodePos[ix + 2] + nodeVel[ix + 2] * dt;
      if (x > halfW || x < -halfW) {
        nodeVel[ix] = -nodeVel[ix];
        x = Math.max(-halfW, Math.min(halfW, x));
      }
      if (y > halfH || y < -halfH) {
        nodeVel[ix + 1] = -nodeVel[ix + 1];
        y = Math.max(-halfH, Math.min(halfH, y));
      }
      if (z > Z_RANGE || z < -Z_RANGE) {
        nodeVel[ix + 2] = -nodeVel[ix + 2];
        z = Math.max(-Z_RANGE, Math.min(Z_RANGE, z));
      }
      nodePos[ix] = x;
      nodePos[ix + 1] = y;
      nodePos[ix + 2] = z;
    }
    pointPosAttr.needsUpdate = true;

    // Rebuild links (O(N²), N≤80 → trivial). Additive blending means "fade" is
    // just a dimmer colour, so far/weaker links melt into the black backdrop.
    let seg = 0;
    for (let i = 0; i < N && seg < MAX_SEG; i++) {
      const ix = i * 3;
      for (let j = i + 1; j < N && seg < MAX_SEG; j++) {
        const jx = j * 3;
        const dx = nodePos[ix] - nodePos[jx];
        const dy = nodePos[ix + 1] - nodePos[jx + 1];
        const dz = nodePos[ix + 2] - nodePos[jx + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 > linkDist2) continue;
        // Smoothstep the brightness so a link eases in/out at the threshold
        // (zero slope at the cutoff) instead of popping on at ~full intensity.
        const f = 1 - Math.sqrt(d2) / LINK_DIST;
        const fade = f * f * (3 - 2 * f) * 0.5; // eased link brightness
        const p = seg * 6;
        linePos[p] = nodePos[ix];
        linePos[p + 1] = nodePos[ix + 1];
        linePos[p + 2] = nodePos[ix + 2];
        linePos[p + 3] = nodePos[jx];
        linePos[p + 4] = nodePos[jx + 1];
        linePos[p + 5] = nodePos[jx + 2];
        // Blend the two node colours, scaled by fade, on both endpoints.
        for (let k = 0; k < 3; k++) {
          const c = (nodeColor[ix + k] + nodeColor[jx + k]) * 0.5 * fade;
          lineCol[p + k] = c;
          lineCol[p + 3 + k] = c;
        }
        seg++;
      }
    }
    lineGeo.setDrawRange(0, seg * 2);
    linePosAttr.needsUpdate = true;
    lineColAttr.needsUpdate = true;
  }

  // --- Pointer parallax ----------------------------------------------------
  let vw = window.innerWidth || 1;
  let vh = window.innerHeight || 1;
  const pTarget = { x: 0, y: 0 };
  const pCurrent = { x: 0, y: 0 };
  const onPointerMove = (e: PointerEvent) => {
    pTarget.x = (e.clientX / vw) * 2 - 1;
    pTarget.y = (e.clientY / vh) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  function renderFrame() {
    pCurrent.x += (pTarget.x - pCurrent.x) * 0.04;
    pCurrent.y += (pTarget.y - pCurrent.y) * 0.04;
    group.rotation.y = pCurrent.x * 0.18;
    group.rotation.x = pCurrent.y * 0.12;
    renderer.render(scene, camera);
  }

  function layout() {
    width = container.clientWidth || 1;
    height = container.clientHeight || 1;
    vw = window.innerWidth || 1;
    vh = window.innerHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    halfH = Math.tan((45 * Math.PI) / 360) * CAM_Z;
    halfW = halfH * (width / height);
  }
  layout();

  // --- Adaptive quality (DPR → FPS) ----------------------------------------
  let quality = 0;
  function applyDpr(scale: number) {
    const d = Math.max(0.75, Math.min(baseDpr * scale, baseDpr));
    renderer.setPixelRatio(d);
    renderer.setSize(width, height, false);
    pointMat.uniforms.uDpr.value = d;
  }
  function degrade() {
    if (quality >= 2) return;
    quality++;
    if (quality === 1) applyDpr(0.8);
    else if (quality === 2) frameInterval = 1000 / (weak ? 20 : 30);
  }

  // --- Loop + lifecycle ----------------------------------------------------
  let rafId = 0;
  let running = false;
  let ready = false;
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
    stepSim(Math.min(delta, 100) / 1000);
    renderFrame();
    if (now - lastEval > 2000) {
      lastEval = now;
      if (warmedUp && emaDelta > frameInterval * 1.45) degrade();
      warmedUp = true;
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
    if (ready && !running) {
      stepSim(0);
      renderFrame();
    }
  });
  ro.observe(container);

  const onContextLost = (e: Event) => {
    e.preventDefault();
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

  Promise.resolve(renderer.compileAsync(scene, camera))
    .catch(() => {})
    .then(() => {
      if (destroyed) return;
      ready = true;
      stepSim(0);
      renderFrame();
      sync();
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
    pointGeo.dispose();
    pointMat.dispose();
    lineGeo.dispose();
    lineMat.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    if (canvas.parentNode === container) container.removeChild(canvas);
  };
}

export function FooterScene({ className }: { className?: string }) {
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
        const boot = () => {
          if (!disposed) teardown = init(THREE, container);
        };
        const w = window as IdleWindow;
        scheduleId = w.requestIdleCallback
          ? w.requestIdleCallback(boot, { timeout: 800 })
          : window.setTimeout(boot, 200);
      })
      .catch(() => {});

    return () => {
      disposed = true;
      if (scheduleId !== undefined) {
        (window as IdleWindow).cancelIdleCallback?.(scheduleId);
        window.clearTimeout(scheduleId);
      }
      teardown?.();
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden />;
}
