# AI Startup Roadmap

Standalone React + TypeScript + Vite source for the Myanmar-language AI Startup Roadmap. It preserves the original responsive interface, 8-stage navigation, Focus Finder, tabbed learning content, checklists, progress tracking, reset action, and browser-local progress saving.

## Requirements

- Node.js 20.19 or newer (Node.js 22 LTS recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The deployable static output is written to `dist/`.

## Deploy

### GitHub Pages

1. Create a GitHub repository and upload this project's contents.
2. Push to the `main` branch.
3. In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. The included workflow builds and publishes the site automatically.

The Vite base path is relative, so both user/organization pages and project pages work without editing the repository name in configuration.

### Cloudflare Pages

1. Import the GitHub repository in Cloudflare Pages.
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Node.js version: `22`

### Vercel

Import the repository. The included `vercel.json` selects the Vite build and `dist` output automatically.

### Netlify

Import the repository. The included `netlify.toml` supplies the build command, publish directory, and SPA fallback.

## Project structure

```text
src/App.tsx              Main roadmap application and content
src/components/ui/       Reusable Button, Checkbox, Progress, and Tabs
src/lib/utils.ts         CSS class utilities
src/styles.css           Global theme and Tailwind CSS entry
public/favicon.svg       Site icon
vendor/                  Vendored UI stylesheet and license
.github/workflows/       GitHub Pages deployment workflow
```

## Data and privacy

The app has no backend, database, analytics, or ChatGPT Sites dependency. Checklist progress is stored only in the visitor's browser using `localStorage` under the key `startup-roadmap-progress`.
