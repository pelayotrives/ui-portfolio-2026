---
name: frontend-optimization
description: Audit and optimize frontend performance for this creative React portfolio, with special attention to GSAP, Lenis, Three.js, assets, fonts, bundle size, initial loading, runtime smoothness, Core Web Vitals, and performance budgets. Use when profiling slow loads, animation jank, large bundles, heavy media, scroll performance, WebGL cost, or before shipping performance-sensitive frontend changes.
metadata:
  project: creative-portfolio
  stack: React, GSAP, Lenis, Three.js
  version: "1.0"
---

# Frontend Optimization

Use this skill to measure, diagnose, and improve performance without flattening the visual character of the portfolio. Treat motion, smooth scrolling, large imagery, and 3D as product features that must be budgeted rather than removed by default.

## Core principles

1. Measure before changing code.
2. Separate network/loading cost from runtime/rendering cost.
3. Fix the highest user-visible bottleneck first.
4. Preserve visual fidelity unless the measured cost clearly justifies degradation.
5. Prefer architectural wins over micro-optimizations.
6. Never claim an improvement without comparing before/after measurements under equivalent conditions.
7. Optimize the critical path first; lazy-load enhancement layers such as non-critical 3D scenes.

## Measurement methodology

### 1. Establish the test context

Before profiling, record:

- production or development build;
- route / view under test;
- viewport size;
- device class;
- CPU/network throttling, if any;
- cache state: cold or warm;
- whether animations and smooth scroll are enabled;
- whether the 3D scene has loaded;
- commit or branch being measured.

Prefer production builds. Development mode, React Strict Mode behavior, source maps, and unminified code can distort results.

### 2. Measure loading performance

Use, when available:

- Chrome DevTools Performance panel;
- Lighthouse in a production build;
- Network panel with cache disabled for cold-load analysis;
- Coverage panel for unused JS/CSS;
- bundle visualizer appropriate to the project bundler;
- React DevTools Profiler for component work;
- `web-vitals` or field telemetry when the project exposes real-user data.

Record at minimum:

- LCP;
- INP or interaction latency evidence;
- CLS;
- total transferred JS, CSS, fonts, images, video, and 3D assets;
- critical-path JS transferred size;
- number of initial requests;
- long tasks > 50 ms;
- main-thread scripting time;
- layout / style recalculation hotspots.

### 3. Measure animation/runtime performance

For animation-heavy sections inspect:

- frame rate and frame-time spikes;
- long tasks around scroll or pointer interactions;
- forced synchronous layout;
- excessive React renders during animation;
- repeated ScrollTrigger refreshes;
- duplicate RAF/ticker loops;
- excessive paint areas;
- GPU-heavy filters, blur, shadows, masks, or oversized composited layers;
- WebGL draw calls, triangle count, texture memory, and device pixel ratio.

A visually smooth desktop result is not sufficient. Re-test on a constrained/mobile profile.

## Performance budgets

Treat these as **project defaults**, not universal web standards. Change them only with a documented reason.

### Core Web Vitals targets

- LCP: `<= 2.5 s`
- INP: `<= 200 ms`
- CLS: `<= 0.1`

Aim to meet these at the 75th percentile when field data exists.

### Portfolio loading budgets

For the initial visible portfolio shell:

- critical-path compressed JS: target `<= 200 KB`;
- critical-path compressed CSS: target `<= 50 KB`;
- critical fonts before first meaningful render: ideally `<= 2 files`;
- avoid loading Three.js scene code in the initial chunk unless the scene is immediately visible and essential;
- no non-visible project video or high-resolution imagery should block LCP;
- avoid an initial full-page payload composed of every project asset merely because the UI is an SPA.

For 3D enhancement chunks:

- load asynchronously when possible;
- report JS and model/texture cost separately;
- apply an explicit quality strategy for mobile and high-DPR screens.

If an existing implementation already exceeds a budget substantially, first target a meaningful incremental improvement rather than forcing arbitrary breakage to hit the number in one change.

## Asset optimization

### Images

- Identify the actual LCP asset first.
- Do not lazy-load the LCP image.
- Ensure the LCP image is discoverable without waiting for client JavaScript where architecture allows.
- Use responsive `srcset` / `sizes` when applicable.
- Prefer AVIF/WebP when they materially reduce bytes without visible quality loss.
- Store dimensions or aspect ratio to prevent layout shift.
- Lazy-load offscreen project imagery.
- Do not ship desktop-resolution assets to small mobile containers.
- For decorative animation frames or textures, evaluate whether CSS, SVG, canvas, or procedural rendering is cheaper than raster sequences.

### Video

- Do not preload full non-critical videos.
- Prefer metadata or no preload for offscreen media.
- Use poster frames where appropriate.
- Pause playback when invisible if continuous playback has no product value.

### 3D assets

- Prefer glTF/GLB for authored models.
- Evaluate Draco / Meshopt geometry compression and KTX2/Basis textures when asset size warrants it.
- Reduce texture resolution based on actual display size.
- Avoid loading hidden variants or unused animation clips.
- Track decompressed GPU texture cost, not only `.glb` transfer size.

## Font optimization

- Inventory every font family, weight, style, and variable axis actually used.
- Prefer WOFF2.
- Remove unused weights/styles.
- Prefer a variable font when it reduces the real payload and does not introduce unnecessary axes.
- Use `font-display` deliberately.
- Preload only truly critical fonts; over-preloading competes with LCP resources.
- Subset fonts when glyph coverage is unnecessarily broad.
- Confirm fallback metrics do not cause visible layout shift.
- Avoid using typography animation techniques that force repeated layout when transform/clip-based alternatives exist.

## Bundle optimization

1. Inspect the dependency graph and actual chunks before deleting packages.
2. Separate framework/runtime code from project-specific code.
3. Identify duplicate dependencies or multiple libraries solving the same problem.
4. Prefer direct imports when the package supports tree-shaking.
5. Dynamically import expensive features that are not required for the initial view.
6. Keep Three.js, model loaders, post-processing, or scene-specific helpers out of the critical chunk when possible.
7. Do not lazy-load tiny components merely to create many network waterfalls.
8. Check whether animation plugins are registered/imported only where needed while respecting library requirements.
9. Inspect source maps or visualizer output to verify the suspected dependency is actually expensive.

## React performance

React should orchestrate UI state; GSAP/Three.js should own per-frame mutation where appropriate.

Check for:

- state updates inside scroll, pointermove, or animation ticks;
- component rerenders caused by high-frequency values;
- unstable object/array/function props on expensive subtrees;
- unnecessarily broad context updates;
- heavy synchronous work during mount;
- duplicate effects in development being mistaken for production behavior;
- DOM measurement mixed repeatedly with DOM writes;
- creating timelines/scenes on every render;
- failure to clean up listeners, observers, timelines, textures, or render loops.

Prefer refs for high-frequency imperative animation values. Do not add `useMemo`, `useCallback`, or `memo` without evidence that they reduce meaningful work.

## GSAP performance

- Prefer transforms (`x`, `y`, `scale`, `rotation`) and opacity/`autoAlpha` over layout-affecting properties for continuous motion.
- Use timelines instead of chains of independent delayed tweens when sequencing related motion.
- Scope selectors and clean timelines/ScrollTriggers on unmount.
- Avoid creating a ScrollTrigger on every tiny element when batching or one timeline can express the same result.
- Avoid animating expensive filters or large blurred layers continuously unless measured acceptable.
- Do not call `ScrollTrigger.refresh()` on every scroll frame.
- Refresh after meaningful layout changes, font/media loading, or scene changes that alter trigger geometry.
- Ensure only one intentional timing loop drives Lenis/GSAP synchronization.

## Lenis performance

- Keep a single primary Lenis instance unless multiple scroll containers are a deliberate requirement.
- Do not mirror scroll position into React state every frame.
- Synchronize ScrollTrigger from Lenis rather than running unrelated competing loops.
- Stop or destroy Lenis cleanly when its owner unmounts.
- Test native input, keyboard navigation, anchor links, touch, and nested scroll areas after optimization.

## Three.js performance

Measure before simplifying the art direction.

Inspect:

- renderer count — prefer one renderer/context for a coherent scene architecture;
- draw calls;
- triangles/vertices;
- material count;
- texture count and dimensions;
- shader/postprocessing passes;
- device pixel ratio;
- shadow map resolution and number of shadow-casting lights;
- transparent objects / overdraw;
- scene graph node count;
- allocations inside the render loop.

Prefer, when applicable:

- shared geometries/materials;
- `InstancedMesh` for repeated objects;
- merged geometry for static repeated geometry;
- frustum culling;
- lower DPR on constrained devices;
- simpler materials on mobile;
- rendering on demand for static scenes;
- pausing scenes when fully offscreen;
- disposing geometries, materials, textures, render targets, and loaders/resources when no longer used.

Do not allocate new vectors, colors, geometries, or materials every frame if reusable scratch objects will work.

## Initial-load strategy for this portfolio

Recommended priority order:

1. HTML/UI shell and critical CSS.
2. Hero typography and LCP media.
3. Essential interaction JS.
4. GSAP/Lenis code required by above-the-fold motion.
5. First visible project media.
6. Remaining project assets near viewport.
7. Three.js and heavy scene assets unless immediately essential.
8. Non-critical media and experimental effects.

Preserve the SPA feel while avoiding an “everything before first paint” architecture.

## Verification checklist

Before declaring the task complete:

- [ ] Compared production build before vs after.
- [ ] Used equivalent viewport, throttling, and cache conditions.
- [ ] Recorded LCP, INP evidence, and CLS.
- [ ] Checked transferred JS/CSS/font/media/3D sizes.
- [ ] Checked main-thread long tasks.
- [ ] Checked animation frame stability while scrolling.
- [ ] Checked at least one mobile/constrained profile.
- [ ] Confirmed no new visual regression.
- [ ] Confirmed reduced-motion behavior still works.
- [ ] Confirmed Lenis and ScrollTrigger stay synchronized.
- [ ] Confirmed React effects/listeners/timelines are cleaned up.
- [ ] Confirmed Three.js resources and loops are cleaned up when applicable.
- [ ] Confirmed no new CLS from fonts/media/canvas sizing.
- [ ] Documented any intentional budget exception.

## Result format

Return findings in this order.

### Performance summary

One paragraph describing the primary bottleneck and user-visible consequence.

### Measurements

| Metric | Before | After / Current | Budget | Status |
|---|---:|---:|---:|---|
| LCP | | | <= 2.5 s | |
| INP | | | <= 200 ms | |
| CLS | | | <= 0.1 | |
| Critical JS | | | <= 200 KB compressed | |
| Long tasks | | | minimize | |

Use `N/A` rather than inventing unavailable measurements.

### Findings

For each finding:

`[P0|P1|P2|P3] Title — evidence — impact — recommended change — expected validation`

Priority meaning:

- `P0`: blocks use or causes severe regression/crash.
- `P1`: major loading/jank/Core Web Vitals issue.
- `P2`: meaningful improvement with moderate user impact.
- `P3`: polish or preventative optimization.

### Files to change

Reference exact file paths and line ranges when available.

### Verification

List the exact checks used after the change. Never write “performance improved” without measurements or clearly labelled observational evidence.

## Avoid

- optimizing development-mode artifacts;
- replacing GSAP/Lenis/Three.js solely because they appear in the bundle;
- arbitrary memoization;
- sacrificing the project’s signature motion without measurement;
- lazy-loading the LCP image;
- preloading every font or asset;
- multiple unmanaged animation loops;
- storing frame-by-frame animation values in React state;
- retaining WebGL resources after scene teardown;
- reporting Lighthouse score alone as the performance result.
