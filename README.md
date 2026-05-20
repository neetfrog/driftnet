# DriftNet

A browser-based internet wandering experience built with React and Vite.

DriftNet lets you explore a curated collection of interesting, nostalgic, weird, and 3AM-ready websites. Use filters to narrow by mood, decade, topic, and type, or hit Drift to jump to a random destination.

## Features

- Curated site discovery with mood, decade, and topic filters
- Random "drift" navigation to explore new corners of the web
- Saved site list and drift history tracking
- Infinite scroll for browsing more sites
- 3AM theme toggle with late-night visual styling
- Responsive, immersive UI with glitch effects and neon-dark styling

## Tech Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS 4
- lucide-react icons
- clsx + tailwind-merge for utility class composition

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local Vite URL shown in the terminal.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

- `src/App.tsx` — main application logic and UI state
- `src/data/sites.ts` — curated site list, moods, decades and topic definitions
- `src/components/` — UI components for cards, filters, history, and overlays
- `src/index.css` — global styles and Tailwind imports
- `vite.config.ts` — Vite configuration

## Notes

This project is intended as a creative browser-based experience for discovering and exploring curated web destinations. The site list is stored locally in `src/data/sites.ts` and can be extended with new entries.
