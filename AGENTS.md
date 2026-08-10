# Sample AGENTS.md file

This repository is Pelayo Trives' UI portfolio SPA. Local skills live in `.agents/skills/` and should be consulted whenever a task matches their specialty.

## Local skills

- `.agents/skills/threejs/SKILL.md` — use for Three.js scenes, 3D interfaces, cameras, lighting, materials, loaders, and canvas lifecycle.
- `.agents/skills/gsap/SKILL.md` — always use for GSAP, Lenis, timelines, cursor effects, scroll motion, reveals, transitions, and animation cleanup.
- `.agents/skills/frontend-review/SKILL.md` — use for technical frontend design reviews covering hierarchy, composition, typography, color, responsive behavior, and accessibility.
- `.agents/skills/frontend-optimization/SKILL.md` — use for performance work involving bundles, assets, rendering, Core Web Vitals, animation cost, memory, or mobile performance.

Read the relevant skill before editing. If a task spans multiple areas, use every matching skill in the order that best fits the work. These skills are the project-specific source of truth and should be expanded over time with verified patterns rather than guesses.

## Dev environment tips

- Run `pnpm install` to install dependencies and `pnpm dev` to start Vite.
- Check the `name` field in `package.json` before assuming which package is being edited.
- Keep design decisions in the existing tokens and avoid introducing colors or fonts without justification.
- Use the local skills listed above for their matching tasks; do not skip them because a global skill has a similar name.
- Use `react-doctor` whenever possible after React changes: `npx -y react-doctor@latest . --verbose --scope changed`.

## Testing instructions

- Run `pnpm run build` to check TypeScript and the production bundle.
- Run `pnpm run lint` before handing off changes.
- Add or update tests for behavior changes when the project introduces them.
- After moving files or changing imports, run build and lint again.

## PR instructions

- Recommended title: `[ui-portfolio-2026] <Title>`.
- Run `pnpm run lint`, `pnpm run build`, and `pnpm test` when available before opening a PR.
- Keep animations accessible with `prefers-reduced-motion` and verify layouts on mobile.
