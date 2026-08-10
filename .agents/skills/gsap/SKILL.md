---
name: gsap
description: Design, implement, review, and debug GSAP animation in this React portfolio, including timelines, reusable motion patterns, React refs and cleanup, ScrollTrigger, Lenis synchronization, reduced-motion behavior, and GSAP-driven Three.js transforms. Use whenever adding or modifying motion, scroll-linked sequences, page/project transitions, hover interactions, text/image reveals, or animation performance.
metadata:
  project: creative-portfolio
  stack: React, GSAP, ScrollTrigger, Lenis, Three.js
  version: "1.0"
---

# GSAP

Use GSAP as the primary animation engine for this portfolio. Motion should feel authored and cohesive rather than like unrelated effects attached to components.

The implementation should favor timelines, scoped React integration, predictable cleanup, transform-based animation, and one coherent scroll/timing architecture.

## Default motion language

Use these as project defaults unless a specific interaction requires different timing.

### Duration

- micro interaction: `0.18–0.3s`
- hover / control transition: `0.25–0.4s`
- standard reveal: `0.5–0.75s`
- section / project transition: `0.7–1.1s`
- large cinematic transition: `1.0–1.6s`, only when the user is not waiting for input

Default general duration:

```js
0.6
```

Do not make every tween `1s`. Duration should reflect distance, visual mass, and interaction urgency.

### Easing

Default choices:

- entrance: `power3.out`
- general UI: `power2.out`
- reversible state transition: `power2.inOut`
- exit: `power2.in`
- cinematic transform: `power3.inOut`
- elastic/back easing: only for explicitly playful interactions

Avoid mixing many easing families in one section.

### Stagger

Typical values:

- characters: `0.01–0.03`
- words: `0.025–0.06`
- UI/list items: `0.04–0.09`
- large project cards: `0.08–0.15`

Prefer intentional stagger order (`from`, `grid`, function-based) over mechanically delaying everything in DOM order.

## Global defaults

Do not blindly set global defaults if third-party or isolated animations may depend on different behavior. Prefer defaults on a project timeline or animation factory:

```js
const tl = gsap.timeline({
  defaults: {
    duration: 0.6,
    ease: "power3.out",
  },
});
```

Use a shared motion constants module if the same values repeat across the codebase.

## React integration

Prefer `@gsap/react` and `useGSAP()` when the package is available.

Register plugins once in the application/module architecture:

```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
```

### Scoped component pattern

```jsx
function ProjectIntro() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from("[data-reveal]", {
        yPercent: 20,
        autoAlpha: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: "power3.out",
      });
    },
    { scope: root }
  );

  return <section ref={root}>...</section>;
}
```

Rules:

- scope selector strings to a component/container;
- use refs for unique imperative targets;
- do not query the entire document from each component;
- do not create timelines during render;
- do not store tweened frame-by-frame values in React state;
- let GSAP mutate animation properties directly when React does not need that value for rendering.

### Cleanup

`useGSAP()` / GSAP context should own cleanup of GSAP-created animations and ScrollTriggers.

When not using `useGSAP`, use `gsap.context()` and revert it:

```jsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // animations
  }, root);

  return () => ctx.revert();
}, []);
```

For event handlers that create GSAP objects after the main hook runs, use the context-safe pattern provided by `useGSAP` rather than leaving orphan tweens/ScrollTriggers.

## Timeline rules

Use a timeline when animations belong to one conceptual sequence.

Prefer:

```js
const tl = gsap.timeline();

tl.from(title, { yPercent: 100, autoAlpha: 0 })
  .from(media, { scale: 1.06, autoAlpha: 0 }, "<0.1")
  .from(meta, { y: 12, autoAlpha: 0 }, "<0.15");
```

Over unrelated tweens with hard-coded delays.

Use labels or position parameters for semantic sequencing. Avoid delay arithmetic that becomes fragile after edits.

## Transform-first animation

For high-frequency movement prefer:

- `x`, `y`, `xPercent`, `yPercent`;
- `scale`, `scaleX`, `scaleY`;
- `rotation`;
- `opacity` / `autoAlpha`.

Avoid continuously animating layout-heavy properties such as width, height, top, left, or large filter/blur values unless the visual requirement justifies and profiling confirms the cost is acceptable.

Use `autoAlpha` when visibility should track opacity.

## Initial-state strategy

Avoid first-frame flashes.

Options:

- CSS sets the safe initial visual state and GSAP reveals it;
- `gsap.set()` establishes the initial transform before play;
- `fromTo()` is used when both endpoints must be explicit.

Do not hide core content indefinitely if JavaScript fails. For essential text, prefer progressively enhanced animation rather than inaccessible `opacity: 0` defaults with no fallback.

## ScrollTrigger

Use ScrollTrigger for scroll-linked or viewport-triggered behavior. Do not hand-roll scroll listeners for behavior ScrollTrigger already models well.

### Basic reveal

```js
gsap.from(element, {
  y: 40,
  autoAlpha: 0,
  duration: 0.7,
  ease: "power3.out",
  scrollTrigger: {
    trigger: element,
    start: "top 85%",
    once: true,
  },
});
```

### Scrubbed timeline

```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top top",
    end: "+=120%",
    scrub: true,
    pin: true,
    invalidateOnRefresh: true,
  },
});
```

Rules:

- attach one ScrollTrigger to the owning timeline when possible;
- use `scrub` only when animation should track scroll position;
- use triggered playback for narrative reveals that should complete independently;
- use pinning deliberately; excessive pinning makes the page feel trapped;
- use `invalidateOnRefresh` for viewport-derived values;
- use function values for measurements that must be recalculated;
- call `ScrollTrigger.refresh()` after meaningful asynchronous layout changes, not every frame;
- never leave markers enabled in production.

## Lenis + ScrollTrigger

The portfolio should have one intentional smooth-scroll clock.

Canonical synchronization pattern:

```js
const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

const updateLenis = (time) => {
  lenis.raf(time * 1000);
};

gsap.ticker.add(updateLenis);
gsap.ticker.lagSmoothing(0);
```

Cleanup when the owner is destroyed:

```js
gsap.ticker.remove(updateLenis);
lenis.destroy();
```

Important:

- GSAP ticker time is seconds; Lenis `raf` expects milliseconds in this integration.
- Do not also run an independent `requestAnimationFrame` loop for the same Lenis instance.
- Do not write Lenis scroll position into React state on every frame.
- When content size changes significantly, make sure ScrollTrigger measurements are refreshed.
- Test anchors, keyboard scroll, touch, nested scroll containers, and modal scroll-lock behavior.

## `prefers-reduced-motion`

Motion is an enhancement, not a requirement for accessing content.

Use a media query/helper:

```js
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
```

Or use `gsap.matchMedia()` to keep motion variants inside GSAP lifecycle management.

Reduced-motion behavior should generally:

- remove large parallax travel;
- remove continuous drift/rotation;
- replace scrubbed storytelling with stable content states;
- avoid aggressive scaling/zooming;
- drastically shorten or remove stagger;
- keep necessary state transitions immediate or subtle;
- never hide content because its entrance animation was skipped.

Do not merely multiply every duration by `0.5`; decide what motion is non-essential.

## Responsive animation

Use `gsap.matchMedia()` when timeline structure differs by viewport/input type.

```js
const mm = gsap.matchMedia();

mm.add("(min-width: 900px)", () => {
  // desktop-only timeline
});

mm.add("(max-width: 899px)", () => {
  // mobile-safe motion
});
```

Prefer simpler motion on mobile when travel distance, pinning, hover assumptions, or WebGL cost no longer fit the layout.

## Reusable interaction patterns

### 1. Masked text reveal

Use an overflow-hidden wrapper and animate the inner text with `yPercent`. Keep final text semantics intact.

```js
gsap.from(lines, {
  yPercent: 110,
  stagger: 0.05,
  duration: 0.75,
  ease: "power3.out",
});
```

### 2. Media reveal

Prefer clip-path only when the paint cost is acceptable; otherwise reveal via transform on a clipped wrapper.

```js
const tl = gsap.timeline();
tl.from(wrapper, { scaleY: 0, transformOrigin: "bottom" })
  .from(image, { scale: 1.08 }, "<");
```

### 3. Magnetic / pointer interaction

- read pointer coordinates;
- map to a small transform range;
- use `gsap.quickTo()` for repeated updates;
- reset on pointer leave;
- disable or simplify for coarse pointers.

```js
const xTo = gsap.quickTo(node, "x", { duration: 0.35, ease: "power3" });
const yTo = gsap.quickTo(node, "y", { duration: 0.35, ease: "power3" });
```

### 4. Project hover preview

- animate only the active preview;
- avoid mounting/decoding every large media asset on first hover;
- make hover additive, not the only path to project information;
- on touch, use tap/visible state instead.

### 5. Cursor/follower

Use quick setters/`quickTo` and transforms. Do not update React state on pointermove. Disable the custom cursor on coarse pointers unless there is a compelling tested reason.

### 6. Route/project transition

Create a single transition controller/timeline rather than scattering exit delays among project components. Separate “cover”, content swap, and “reveal” phases.

## GSAP + Three.js

GSAP can tween numeric properties on Three.js objects directly:

```js
gsap.to(mesh.rotation, {
  y: Math.PI * 2,
  duration: 1.4,
  ease: "power3.inOut",
});

gsap.to(camera.position, {
  z: 4,
  duration: 1,
  ease: "power2.inOut",
});
```

For scroll-linked 3D:

- let ScrollTrigger/GSAP update object transforms;
- let the Three.js render loop render current state;
- avoid creating a second animation system for the same transform;
- animate parent groups/pivots when that produces cleaner model control;
- keep render-loop allocations near zero;
- coordinate 3D quality/performance with the `threejs` skill.

## Debugging checklist

When an animation misbehaves, check in this order:

1. Is the target actually present when the timeline is created?
2. Is the selector scoped correctly?
3. Is a React rerender replacing/resetting the animated node?
4. Is the effect/timeline being created more than once?
5. Is cleanup happening on unmount/remount?
6. Is ScrollTrigger measuring before fonts/images/layout settle?
7. Is Lenis synchronized to ScrollTrigger?
8. Are multiple RAF/ticker loops competing?
9. Is CSS transition/animation fighting GSAP on the same property?
10. Does the reduced-motion or responsive branch override it?
11. For Three.js, is the render loop active after GSAP changes the object?

Use ScrollTrigger markers only during debugging.

## Review checklist

- [ ] Animation has a clear visual/interaction purpose.
- [ ] Durations and easing fit the project motion language.
- [ ] Related tweens use a timeline.
- [ ] React selectors are scoped or refs are used.
- [ ] All timelines/ScrollTriggers/listeners are cleaned up.
- [ ] No frame-by-frame React state updates.
- [ ] Lenis and ScrollTrigger share one timing architecture.
- [ ] Reduced-motion behavior is coherent.
- [ ] Mobile/touch behavior is intentionally handled.
- [ ] No content depends exclusively on motion to exist.
- [ ] Transform-first properties are used for continuous movement.
- [ ] No duplicate GSAP/RAF loop exists.
- [ ] ScrollTrigger refresh occurs only when needed.
- [ ] Three.js tweens do not allocate new scene resources per frame.

## Output format for GSAP reviews

For each finding:

`[P0|P1|P2|P3] title — file:line — behavior — root cause — concrete fix`

When implementing a new animation, return:

1. **Intent** — what the motion communicates.
2. **Timeline** — the sequence in plain language.
3. **Implementation** — scoped GSAP code.
4. **Responsive/reduced-motion behavior**.
5. **Cleanup/performance notes**.

## Avoid

- long chains of `setTimeout`/delays instead of timelines;
- global selectors inside reusable React components;
- `useEffect` timelines without cleanup;
- animation state copied into React every frame;
- competing CSS transitions on GSAP-owned properties;
- multiple Lenis RAF loops;
- `ScrollTrigger.refresh()` inside scroll/ticker callbacks;
- excessive scrub/pin simply because ScrollTrigger supports it;
- huge blur/filter animations without profiling;
- animations that leave content invisible when JavaScript or motion is disabled.
