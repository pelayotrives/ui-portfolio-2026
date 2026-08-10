---
name: threejs
description: Create, integrate, animate, review, and optimize Three.js scenes for this React creative portfolio, with strong emphasis on procedural 3D modeling, glTF assets, GSAP-driven transforms, Lenis/ScrollTrigger scroll synchronization, rendering architecture, responsive quality, resource cleanup, and GPU performance. Use whenever adding 3D objects, WebGL scenes, shaders, model interactions, scroll-driven camera/object motion, or optimizing existing Three.js work.
metadata:
  project: creative-portfolio
  stack: React, Three.js, GSAP, ScrollTrigger, Lenis
  version: "1.0"
---

# Three.js

Three.js in this portfolio is a visual design system layer, not a standalone demo. Every scene should integrate with composition, typography, scroll rhythm, interaction, and frontend performance.

Default to direct Three.js APIs unless the existing project already uses a renderer abstraction such as React Three Fiber. Do not introduce an additional rendering framework solely for convenience without a concrete architectural benefit.

## Core rules

1. Define the visual role of the scene before creating geometry.
2. Separate scene setup, asset creation/loading, animation state, rendering, resize, and cleanup.
3. Use GSAP for authored timeline/interaction transitions and Three.js for rendering.
4. Avoid two animation systems fighting over the same property.
5. Keep per-frame allocation extremely low.
6. Design quality tiers for mobile/high-DPR/constrained devices.
7. Dispose GPU resources explicitly.
8. Treat model and texture memory as performance budget items.
9. Prefer one renderer/context for one coherent experience.
10. 3D must never make portfolio content inaccessible when WebGL or motion is unavailable.

## Scene planning

Before implementation define:

- purpose: decoration, hero identity, project visualization, interaction, transition, background, or data display;
- visibility: above fold, scroll section, hover-only, route transition, persistent background;
- camera behavior;
- object hierarchy/pivots;
- lighting strategy;
- material style;
- interaction inputs: scroll, pointer, hover, click, time;
- mobile fallback/quality tier;
- reduced-motion behavior;
- loading strategy;
- teardown lifecycle.

Do not begin with a high-poly model if the effect can be achieved procedurally with simple geometry/materials.

## Scene architecture

Keep responsibilities explicit. A scene module should conceptually own:

```txt
createRenderer
createScene
createCamera
createLights
createObjects / loadAssets
bindInteractions
resize
render/update
dispose
```

In React, mount the canvas into a ref and initialize the Three.js scene in an effect/lifecycle hook. Do not create renderer/scene/material instances during every component render.

## Renderer setup

Typical direct Three.js setup:

```js
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});

renderer.setSize(width, height, false);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

Treat the `2` DPR cap as a starting point, not a rule. A complex scene may need `1–1.5` on mobile; a simple hero object may support more.

Prefer `renderer.setAnimationLoop()` for the primary render loop:

```js
renderer.setAnimationLoop(render);
```

On teardown:

```js
renderer.setAnimationLoop(null);
```

Do not create several full-window renderers for effects that could share one renderer/scene architecture.

## Camera

Use a `PerspectiveCamera` for most portfolio hero/product-style scenes.

Keep camera tuning responsive:

- recalculate aspect on resize;
- update projection matrix after aspect/FOV changes;
- avoid fixed `z` assumptions that crop content at narrow widths;
- use object bounds or viewport-aware framing for authored models.

When animating the camera, consider animating a parent rig or target object rather than directly coupling every effect to `camera.position`.

Suggested hierarchy:

```txt
scene
└── cameraRig
    └── camera
```

This makes scroll motion, pointer parallax, and transition offsets composable.

## Procedural modeling workflow

For geometric/abstract portfolio objects, model in stages.

### 1. Blockout

Use primitive geometries to establish:

- silhouette;
- scale;
- proportion;
- pivot points;
- camera framing.

Do not start with detail.

### 2. Structure

Create logical groups:

```txt
root
├── body
├── accent
├── detailGroup
└── interactionPivot
```

Choose pivots based on how GSAP will animate the object.

### 3. Form

Refine with:

- merged primitives;
- custom `BufferGeometry` where justified;
- curves/tubes;
- instancing for repetition;
- vertex deformation or shaders for procedural motion.

### 4. Material

Use the cheapest material that produces the required look.

- `MeshBasicMaterial` for unlit graphic objects;
- `MeshStandardMaterial` for common physically based lighting;
- `MeshPhysicalMaterial` only when features such as transmission, clearcoat, iridescence, etc. visibly matter;
- custom shaders only when standard materials cannot express the effect efficiently.

Avoid expensive material features simply because they exist.

### 5. Lighting

Start with the minimum number of lights.

For designed portfolio objects:

- one key light;
- subtle fill/rim if needed;
- environment lighting where appropriate.

Shadows are expensive. Enable them only when they materially add depth.

## glTF / GLB assets

Use `GLTFLoader` for glTF 2.0 assets.

```js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const gltf = await loader.loadAsync("/models/object.glb");
scene.add(gltf.scene);
```

When justified, evaluate:

- Draco compression;
- Meshopt compression;
- KTX2/Basis texture compression;
- lower texture resolution;
- removal of unused nodes/materials/animation clips.

Do not assume a small `.glb` means a small GPU footprint. Compressed texture files expand when used unless a GPU-compressed texture format is used.

## GSAP integration

GSAP is the default authored animation layer.

### Animate object transforms

```js
gsap.to(mesh.position, {
  y: 0.8,
  duration: 1,
  ease: "power3.inOut",
});

gsap.to(mesh.rotation, {
  y: Math.PI,
  duration: 1.2,
  ease: "power3.inOut",
});
```

### Animate material values

```js
gsap.to(material, {
  opacity: 1,
  duration: 0.6,
});
```

For colors, animate an intermediary value or directly tween compatible numeric color channels carefully; keep the approach predictable and avoid creating new `Color` objects every frame.

### Animate shader uniforms

```js
gsap.to(material.uniforms.uProgress, {
  value: 1,
  duration: 1.2,
  ease: "power2.inOut",
});
```

### Prefer animation rigs

Instead of mixing every effect on one mesh:

```txt
rootGroup        <- route/section transition
└── scrollGroup  <- ScrollTrigger movement
    └── hoverGroup <- pointer interaction
        └── mesh
```

Each animation source owns a different transform layer. This prevents scroll, hover, and transition tweens from overwriting each other.

## ScrollTrigger + Lenis + 3D

Use one scroll source and one rendering loop.

Architecture:

```txt
Lenis scroll
  -> ScrollTrigger.update()
  -> GSAP updates Three.js object/camera values
  -> renderer animation loop draws current scene state
```

Do not create a second custom scroll interpolation layer inside Three.js.

Example:

```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});

tl.to(object.rotation, { y: Math.PI * 1.5, ease: "none" }, 0)
  .to(cameraRig.position, { z: -1.5, ease: "none" }, 0);
```

For scrubbed animation use `ease: "none"` unless eased scroll mapping is deliberately desired; Lenis already shapes the perceived scrolling motion.

## Render loop

Keep the render loop small:

```js
function render(time) {
  // update only truly continuous effects
  material.uniforms.uTime.value = time * 0.001;
  renderer.render(scene, camera);
}
```

Do not:

- construct geometries/materials/textures every frame;
- call React state setters every frame;
- repeatedly query DOM layout every frame;
- create new Vector2/Vector3/Color/Matrix objects unnecessarily inside hot paths;
- rebuild scene hierarchy during scroll.

Reuse scratch vectors/objects.

## Continuous vs on-demand rendering

Use continuous rendering when the scene contains:

- shader time animation;
- continuous rotation/noise;
- damping/physics;
- animation mixer playback;
- pointer smoothing that evolves every frame.

Consider on-demand rendering when the scene is static except for discrete interactions. Request a render after:

- GSAP updates;
- resize;
- asset load;
- control interaction.

For this portfolio, a continuous loop can be justified, but pause or stop it when a heavy scene is fully offscreen if no persistent visual effect is needed.

## AnimationMixer vs GSAP

Use Three.js `AnimationMixer` for animation clips embedded in glTF assets, especially skeletal/morph animation.

Use GSAP for:

- camera rigs;
- object transforms;
- material/uniform transitions;
- scroll-linked state;
- UI-to-3D synchronization;
- authored project transitions.

They can coexist. The render loop updates `AnimationMixer`; GSAP updates independent properties. Avoid having both systems own the same transform channels.

## Pointer interaction

Normalize pointer coordinates to NDC:

```js
pointer.x = (event.clientX / width) * 2 - 1;
pointer.y = -(event.clientY / height) * 2 + 1;
```

For simple hero parallax, avoid raycasting if direct normalized coordinates are sufficient.

Use raycasting only when actual object picking is required.

For smooth pointer-follow motion, tween a rig target or use damped interpolation. Do not create a new GSAP tween on every `pointermove`; use `gsap.quickTo()`, quick setters, or a target value consumed by the render loop.

## Responsive quality tiers

3D quality should respond to capability/layout, not just viewport width.

Possible knobs:

- DPR cap;
- geometry segments;
- shadow resolution;
- number of lights;
- postprocessing passes;
- texture resolution;
- particle count;
- instance count;
- shader complexity;
- render frequency.

Suggested baseline:

### Desktop / strong device

- DPR up to ~2 if profiling supports it;
- full materials/effects;
- standard particle/instance count.

### Mobile / constrained

- DPR ~1–1.5;
- lower geometry/particle counts;
- smaller textures;
- reduced shadows/postprocessing;
- less scroll-driven camera travel;
- no pointer-only behavior.

Never serve a blank canvas simply because a device receives the reduced tier.

## Reduced motion

When `prefers-reduced-motion: reduce`:

- stop perpetual camera/object drift where non-essential;
- replace scrubbed rotations/zooms with a stable pose;
- keep scene visible if it contributes to composition;
- preserve functional click/tap state changes with minimal motion;
- avoid rapid depth changes.

A static hero render is usually preferable to removing the scene entirely unless GPU cost itself is the issue.

## Resize handling

On container/window resize:

```js
const width = container.clientWidth;
const height = container.clientHeight;

camera.aspect = width / height;
camera.updateProjectionMatrix();
renderer.setSize(width, height, false);
```

Prefer `ResizeObserver` for component-contained canvases.

Avoid resizing the drawing buffer repeatedly during scroll when the actual container dimensions have not changed.

## Performance checklist

Inspect:

- draw calls;
- triangles;
- points/lines;
- geometry count;
- texture count;
- texture dimensions;
- material count;
- renderer DPR;
- shadows;
- post-processing;
- transparent overdraw;
- frame-time spikes;
- memory growth after navigating between projects.

Use renderer diagnostics such as `renderer.info` when appropriate.

### Reduce draw calls

When objects repeat:

1. share geometry/material first;
2. consider `InstancedMesh` when instances need separate transforms;
3. consider merged geometry for static objects that no longer need independent transforms.

Do not merge everything blindly; merged geometry reduces independent control and can hurt culling granularity.

## Resource disposal

Three.js GPU resources are not automatically reclaimed like ordinary JS objects.

On teardown, dispose resources created/owned by the scene:

```js
geometry.dispose();
material.dispose();
texture.dispose();
renderTarget.dispose();
renderer.dispose();
```

For loaded model hierarchies, traverse and dispose owned geometries/materials/textures carefully. Avoid disposing shared global assets that another scene still uses.

Also remove:

- resize/pointer listeners;
- observers;
- GSAP timelines/ScrollTriggers;
- Lenis-specific listeners if owned here;
- animation loops;
- canvas DOM nodes when appropriate.

If `ImageBitmap`-backed textures are involved, be aware that bitmap lifecycle may require explicit handling beyond ordinary garbage collection.

## React cleanup pattern

Conceptual pattern:

```jsx
useEffect(() => {
  const sceneApi = createScene(containerRef.current);

  return () => {
    sceneApi.dispose();
  };
}, []);
```

`dispose()` should be a first-class part of the scene API, not an afterthought scattered across the component.

## Visual modeling criteria

A 3D object is ready only when these are intentional:

- silhouette;
- proportions;
- pivot/rotation origin;
- camera framing;
- material response;
- lighting direction;
- background interaction;
- scale relative to typography/UI;
- entry/exit pose;
- mobile pose;
- reduced-motion pose.

Avoid adding micro-detail that is invisible at the final camera distance.

## Integration with the DOM

DOM and WebGL should share a composition.

- align canvas bounds deliberately to the layout;
- establish z-index/pointer-events rules explicitly;
- keep semantic text/buttons in DOM when possible;
- use the canvas as visual enhancement rather than replacing accessible content;
- coordinate 3D focal point with project title/grid rather than centering every object by default.

For DOM-to-3D synchronization, define one normalized progress value or shared timeline rather than many unrelated scroll listeners.

## Debugging checklist

If the scene is blank:

1. renderer canvas mounted?
2. renderer size non-zero?
3. camera aspect/projection valid?
4. object in front of camera?
5. material requires lights but none exist?
6. object scale reasonable?
7. asset actually loaded?
8. render loop active?
9. alpha/background making object visually disappear?
10. WebGL/context error in console?

If animation is wrong:

1. verify pivot/group hierarchy;
2. verify GSAP and AnimationMixer are not writing the same channel;
3. verify ScrollTrigger timing after layout load;
4. verify Lenis integration;
5. verify render loop runs while properties change;
6. verify responsive/reduced-motion branch;
7. verify quaternion vs Euler assumptions for complex rotations.

If performance is poor:

1. lower DPR temporarily to identify fill-rate bottleneck;
2. inspect draw calls and triangles;
3. disable shadows/postprocessing;
4. inspect oversized textures;
5. pause offscreen scene;
6. reduce transparent overdraw;
7. inspect allocations inside loop;
8. check whether multiple renderers/loops exist;
9. simplify shader/material only after identifying the expensive stage.

## Output format

When implementing a scene, return:

### Scene contract

- visual purpose;
- container/viewport behavior;
- camera;
- object hierarchy;
- materials/lights;
- interaction sources;
- mobile tier;
- reduced-motion behavior;
- loading strategy;
- cleanup strategy.

### Animation map

| Source | Target | Property | Owner |
|---|---|---|---|
| Scroll | `scrollGroup` | rotation.y | GSAP/ScrollTrigger |
| Pointer | `hoverGroup` | x/y rotation | quickTo/render loop |
| Route | `rootGroup` | scale/position | GSAP timeline |

Use this map to prevent ownership conflicts.

### Performance notes

Report estimated/observed heavy resources, renderer DPR, draw calls if measured, and any deliberate quality reductions.

### Files changed

Reference exact file paths and line ranges when available.

## Final checklist

- [ ] Scene has a defined purpose in the composition.
- [ ] Renderer is created once per intended scene architecture.
- [ ] Canvas resizes correctly.
- [ ] DPR is capped/adaptive.
- [ ] Object hierarchy supports independent scroll/hover/transition motion.
- [ ] GSAP owns authored transforms; no competing animation owner.
- [ ] Lenis/ScrollTrigger integration uses one scroll clock.
- [ ] Per-frame allocations are minimized.
- [ ] Mobile quality is intentionally reduced where needed.
- [ ] Reduced-motion mode is coherent.
- [ ] Text/content remains semantic outside canvas when appropriate.
- [ ] Heavy 3D assets are lazy-loaded when non-critical.
- [ ] Geometries/materials/textures/render targets are disposed.
- [ ] Listeners/observers/timelines/render loops are removed on teardown.
- [ ] Performance has been checked on a constrained profile.

## Avoid

- creating the renderer or geometries during React render;
- one WebGL renderer per decorative object;
- full device DPR by default on every device;
- complex shadows/postprocessing before visual need is proven;
- huge textures because source artwork is high resolution;
- new vectors/materials/geometries inside the frame loop;
- raycasting for simple pointer parallax;
- a new tween on every pointermove;
- GSAP and AnimationMixer controlling the same transform channel;
- mixing independent RAF loops for Lenis, GSAP, and Three.js without a deliberate architecture;
- failing to dispose GPU resources after project/scene changes;
- making essential portfolio content exist only inside WebGL.
