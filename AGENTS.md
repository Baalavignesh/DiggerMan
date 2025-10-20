# Repository Guidelines

## Project Structure & Module Organization
`src/main.tsx` registers the TheDigger custom post, loads helpers such as `src/createPost.tsx`, and is the single source of truth for Devvit-side messaging in `src/message.ts`. The React webview lives under `webapp/src` and builds into `webroot/`, which is the directory Devvit actually ships (hashed JS in `webroot/assets`, fonts, sounds, and `index.html`). Place static files that should copy as-is in `webapp/public`, and leave the top-level `assets/` folder for future shared packages.

## Build, Test, and Development Commands
- `npm install` — install project dependencies.
- `npm run web:dev` — run the webpack dev server on `http://localhost:5173` with live reload of the webview.
- `npm run web:build` — emit a production bundle into `webroot/` (cleans old assets, hashes filenames, copies `public/`).
- `npm run web:watch` — watch mode that rebuilds `webroot/` for Devvit testing without restarting the server.

## Coding Style & Naming Conventions
Keep TypeScript strict: prefer explicit interfaces, discriminated unions, and shared types from `src/message.ts`. Match the existing two-space indentation, name React components with PascalCase, and keep hooks/utilities in camelCase. When you add utilities or constants, colocate them with their consumer module to avoid inflating the main bundle.

## Testing Guidelines
Automated testing is not wired up yet; rely on manual playthroughs via `npm run web:dev`, covering save/load, biome progression, and audio fallbacks. Any message-contract change demands a quick verification from both the Devvit logs and the webview console to ensure `GameState` still serializes cleanly. New automated tests should prefer React Testing Library or lightweight hook tests, and document the command here before making it part of CI expectations.

## Commit & Pull Request Guidelines
Commits in this repo use short, imperative, sentence-case subjects (for example, `Add achievement system and UI components for tracking progress`), so continue that style and keep each commit scoped. Pull requests should summarize gameplay impact, list manual test steps or screenshots/GIFs, and call out any new Redis keys or `REACT_APP_*` variables. Before requesting review, run `npm run web:build` so reviewers see the updated `webroot/` artefacts.

## Webview Packaging Tips
Devvit only reads `webroot/`, so rerun the build whenever fonts, sounds, or templates move. Spot-check the generated `webroot/index.html` in a plain browser to catch obvious regressions before pushing.
