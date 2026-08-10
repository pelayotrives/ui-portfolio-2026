---
name: frontend-review
description: Review the visual frontend quality of this creative portfolio. Audit composition, hierarchy, rhythm, typography, color, contrast, component states, responsive behavior, and visual accessibility; distinguish objective design defects from subjective preferences; and return prioritized findings with exact file and line references when available. Use for UI/design QA, visual polish, responsive audits, accessibility review, and pre-release frontend review.
metadata:
  project: creative-portfolio
  focus: visual-design-review
  version: "1.0"
---

# Frontend Review

Review the implementation as a designed experience, not merely as valid code. The portfolio is intentionally expressive, motion-heavy, and presentation-led; do not force generic SaaS conventions onto it. Preserve deliberate asymmetry, oversized type, cinematic pacing, unusual grids, and experimental interactions when they are coherent and usable.

## Review order

Review in this sequence:

1. composition and hierarchy;
2. spacing and rhythm;
3. typography;
4. color and contrast;
5. interaction states;
6. responsive behavior;
7. visual accessibility;
8. motion-related visual issues;
9. consistency across projects/sections.

Do not start by nitpicking individual pixels before assessing the page as a whole.

## Evidence hierarchy

Prefer evidence in this order:

1. visible broken behavior or content loss;
2. mismatch with an existing design system/token/pattern in the repository;
3. accessibility or readability failure;
4. inconsistent behavior between equivalent components;
5. implementation that clearly breaks hierarchy or layout intent;
6. subjective aesthetic preference.

Only the first five should normally become defects. Subjective taste should be labelled as an optional suggestion.

## Composition checklist

Check:

- clear primary focal point per viewport;
- deliberate balance of positive and negative space;
- alignment relationships across sections;
- repeated visual anchors;
- grouping through proximity;
- project imagery not competing accidentally with navigation or labels;
- no awkward tangencies between text, images, canvas, borders, and viewport edges;
- cropped media looks intentional at target breakpoints;
- decorative layers do not obscure actionable/content layers;
- pinned/animated sections maintain a readable composition throughout their timeline.

Flag a problem when composition obscures meaning, produces accidental collisions, or breaks an established system. Do not flag unusual composition merely because it is unconventional.

## Hierarchy checklist

Check whether a user can quickly distinguish:

- page/portfolio identity;
- project title;
- project metadata;
- primary navigation;
- current/active project;
- supporting description;
- interactive affordances;
- decorative text.

Look for hierarchy conflicts caused by:

- similar size/weight across unrelated levels;
- insufficient contrast;
- too many simultaneous focal points;
- animation drawing attention to secondary content over primary content;
- persistent navigation overpowering project content;
- z-index/overlap mistakes.

## Rhythm and spacing checklist

Evaluate rhythm across the entire scroll sequence:

- section-to-section spacing;
- repeated title/media gaps;
- vertical cadence;
- edge padding;
- grid gutters;
- text measure;
- intentional dense vs quiet moments;
- consistency of spacing tokens where a system exists.

Prefer relative relationships over arbitrary pixel uniformity. A creative portfolio may intentionally change rhythm between projects; require coherence, not sameness.

## Typography review

Check:

- family and fallback stack;
- weight availability vs synthetic weights;
- font loading behavior;
- type scale;
- line height;
- letter spacing;
- line length;
- capitalization consistency;
- optical alignment;
- widows/orphans when visually disruptive;
- truncation/overflow;
- variable-font axis use, if applicable;
- text legibility over moving imagery or WebGL backgrounds.

For animated text:

- ensure split text does not permanently damage semantics or selection when avoidable;
- ensure transforms do not create unreadable intermediate states for too long;
- ensure text remains usable when motion is reduced;
- avoid clipping ascenders/descenders accidentally.

## Color and contrast

Review:

- foreground/background contrast;
- text over imagery/video/canvas;
- muted metadata;
- hover/focus/active states;
- disabled state clarity;
- selected/current project state;
- contrast when blending modes or opacity are animated;
- contrast at both ends of color transitions.

Do not treat every low-contrast decorative element as a failure. Prioritize meaningful text, controls, focus indicators, and state communication.

When exact contrast needs verification, calculate it instead of estimating visually.

## State review

Interactive elements should have intentional states where applicable:

- default;
- hover;
- focus-visible;
- active/pressed;
- selected/current;
- disabled;
- loading;
- error;
- reduced-motion alternative.

On touch devices, do not make critical information available only on hover.

## Responsive audit

Test representative widths rather than only named device presets.

At minimum inspect:

- narrow mobile: ~320–375 px;
- modern mobile: ~390–430 px;
- tablet / small landscape: ~768–1024 px;
- laptop: ~1280–1440 px;
- wide desktop: >= 1600 px.

Also drag through intermediate widths to reveal breakpoint cliffs.

Check:

- horizontal overflow;
- accidental clipping;
- project ordering;
- title wrapping;
- nav collisions;
- media crop;
- sticky/pinned section behavior;
- viewport-height assumptions;
- mobile browser dynamic viewport behavior;
- touch targets;
- canvas sizing;
- orientation changes;
- typography scale interpolation;
- pointer-only interactions;
- WebGL fallback/quality behavior if present.

A breakpoint is justified by a layout failure, not by a device brand.

## Visual accessibility

Check visually relevant accessibility concerns:

- focus indicator is visible and not clipped;
- keyboard focus order matches visual order;
- controls are recognizable as interactive;
- color is not the sole state indicator when meaning matters;
- text remains legible under reduced transparency / unusual backgrounds;
- motion does not become the only way to reveal essential content;
- `prefers-reduced-motion` produces a coherent static or reduced version;
- zoom to 200% does not make essential content unusable;
- large text does not overlap irrecoverably;
- canvas/WebGL decoration does not replace semantic HTML content.

This skill is a visual audit, not a complete semantic/accessibility audit. If semantic ARIA, DOM, or screen-reader behavior requires deeper review, state that separately.

## Motion as part of design review

Inspect animation for visual purpose:

- entrance order reinforces hierarchy;
- duration matches information density;
- stagger creates rhythm rather than delay fatigue;
- scroll-linked movement does not detach content from its reading order;
- parallax depth is coherent;
- hover motion communicates interactivity;
- transitions preserve spatial continuity;
- pinned sections release cleanly;
- animation endpoints land on intentional alignment values;
- no flashing/flicker caused by initial-state setup.

Do not call motion “too much” without identifying the specific readability, responsiveness, orientation, or interaction cost.

## Design issue vs subjective preference

Classify every finding.

### Objective / actionable issue

Use when at least one is true:

- content overlaps, clips, disappears, or becomes unreadable;
- layout breaks at a reproducible viewport;
- accessibility contrast/state requirement is missed;
- equivalent components behave inconsistently without a clear reason;
- implementation conflicts with defined tokens/components/specs;
- visual hierarchy makes primary content materially harder to understand;
- animation creates a reproducible usability problem;
- the implementation differs from an available approved reference.

### Probable design issue

Use when there is strong visual evidence but no formal reference, for example:

- accidental-looking spacing;
- visibly unbalanced composition;
- a typography relationship that breaks surrounding rhythm;
- inconsistent optical alignment.

Explain the evidence.

### Subjective suggestion

Use for personal taste such as:

- preferring a different typeface;
- making a deliberately large title smaller without a usability reason;
- changing a coherent color palette because another palette feels nicer;
- removing asymmetry solely to make the page conventional.

Never present subjective suggestions as defects.

## File and line references

When source is available:

- cite the narrowest relevant file and line range;
- reference the owning component rather than generated CSS/output;
- include related token/style files when the root cause lives there;
- if a visual issue comes from runtime animation setup, reference both the component and animation definition if distinct.

Preferred notation:

`src/components/ProjectHero.tsx:42-61`

If line numbers are unavailable, use the exact file and component/function name. Never invent line numbers.

## Priority system

- `P0` — unusable/broken content, severe accessibility blocker, or viewport-wide failure.
- `P1` — prominent visual/interaction defect affecting core portfolio experience.
- `P2` — noticeable consistency, responsive, hierarchy, or polish issue.
- `P3` — minor polish.
- `Suggestion` — subjective/optional direction, not a defect.

## Findings format

Return the review as:

### Summary

2–5 sentences describing the overall visual quality and the dominant issue pattern. Do not bury critical issues in general praise.

### Prioritized findings

For every finding use:

`[P1] Short title`

- **Evidence:** what is visibly/reproducibly wrong.
- **Location:** `path/to/file.tsx:line-line` and viewport/state.
- **Why it matters:** hierarchy, readability, consistency, accessibility, responsiveness, etc.
- **Recommendation:** a concrete fix while preserving the intended art direction.
- **Classification:** objective issue / probable design issue / subjective suggestion.

### Responsive matrix

| Width | Status | Main issue |
|---|---|---|
| 320–375 | | |
| 390–430 | | |
| 768–1024 | | |
| 1280–1440 | | |
| 1600+ | | |

Only fill with observed evidence.

### What is working

Include a short section identifying patterns worth preserving, especially if a proposed fix could accidentally flatten them.

## Avoid

- generic “make it cleaner” recommendations;
- redesigning the whole portfolio when reviewing one defect;
- treating personal preference as objective UX fact;
- assuming desktop hover behavior works on touch;
- judging only one screenshot when the layout is animated/responsive;
- suggesting uniform spacing everywhere in an intentionally rhythmic editorial layout;
- changing a unique visual device solely because it differs from common SaaS conventions;
- invented file/line references.
