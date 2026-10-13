# Butterfly Garden / Gderot

A Hebrew, right-to-left web presentation based on the seven-slide PowerPoint in this project. Built with React, Vite, Tailwind CSS v4, and Lucide. Fonts are bundled locally.

## Presentation experience

Thirteen full-viewport scenes preserve the original message while separating dense topics into readable moments. Click or tap the content, use the next control, or press Space, Enter, ArrowLeft, ArrowUp, ArrowDown, PageUp, or PageDown to move forward one scene. ArrowRight moves back one scene, matching Hebrew reading direction. The previous-slide button also moves back one scene and is disabled on the opening scene. The progress segments fill from right to left and update in both directions. The final scene remains visible until navigating back. No scrolling, internal tabs, filters, dialogs, or timed auto-advancement are required. Fullscreen is an independent optional control.

Native View Transitions animate scene changes where supported, with CSS content-entry animations as the fallback. Staggered reveals, photographic motion, lifecycle imagery, growing lines, and animated butterflies run without extra clicks. Reduced-motion preferences disable visual motion. A short input guard prevents double-clicks or held keys from skipping scenes.

The hatching scene has a dedicated one-shot sequence: the chrysalis dissolves as the butterfly photograph opens outward, followed by seven butterflies flying from the image. Returning to the scene replays the sequence. Reduced-motion users see the complete photograph immediately, without the chrysalis overlay or flight effects.

## Development

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

## Vercel

Import the project into Vercel and select **Vite**. Use `npm run build` as the build command and `dist` as the output directory. No environment variables or backend are required. The presentation uses local scene state, not client-side routes; old section hashes are ignored and a reload starts at the opening scene.

## Content and assets

See [PRESENTATION-ANALYSIS.md](PRESENTATION-ANALYSIS.md) for the source inventory and redesign decisions. Original extracted images and crop intermediates are in `source-assets`; only optimized WebP images are in `public/assets`. The website uses individual visual assets, not slide screenshots. The PowerPoint remains unchanged.

To regenerate assets on Windows, run `./scripts/prepare-assets.ps1` in PowerShell, then `npm run assets`.

## Browser checks

```sh
npx playwright install chromium
npm run build
npm test
```

Tests run against the production preview and cover all thirteen scenes on desktop/mobile, forward clicks and keyboard controls, previous-button navigation and boundaries, RTL progress, held-key and double-click protection, touch input, fullscreen independence, image loading, runtime errors, text fitting without scrolling, and reduced motion. Layout checks include 320x568, 375x667, 768x1024, 1024x700, and 1920x1080 viewports. Screenshots of every desktop/mobile scene and failure traces are written to `test-results`.

Node 22 or later is recommended. This workspace's validation used a portable Node installation in `%LOCALAPPDATA%/parparim-tools` because Node was not on the machine PATH. That installation is not required on Vercel.

The project is a proposal, not an operational garden. No dates, metrics, funding commitments, or contact details have been invented. The closing scene identifies the original project team. The presentation does not collect or submit personal information.