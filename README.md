# UI Portfolio

Personal UI design portfolio built with React and Vite. It presents five visual case studies with an editorial layout, playful motion, and a custom animated cursor.

## Stack

- React + TypeScript
- Vite
- GSAP
- Lenis
- CSS design tokens

## Development

```bash
pnpm install
pnpm dev
```

The local development server is usually available at `http://localhost:5173`.


## Adding projects

Project content is defined in `src/App.tsx`. Update the project list and its matching artwork class in `src/App.css`. Replace the CSS artwork with real project imagery when the final assets are available.

## Motion

GSAP controls the entrance animation and custom cursor trail. Lenis provides smooth scrolling. Motion is disabled or reduced when the user prefers reduced motion or uses a touch device.

## Local guidance

Project-specific workflows and skill references are documented in `AGENTS.md` and `.agents/skills/`.
