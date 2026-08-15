# AI Development Rules & Tech Stack Guidelines

This document establishes the architecture, technology stack, and library usage guidelines for the **Word Builder Mobile Game** application.

---

## 🚀 Tech Stack Overview

- **Framework & Language**: React 19 with TypeScript (~5.8) in strict mode.
- **Build Tool & Bundler**: Vite 6 using `@vitejs/plugin-react` with `@tailwindcss/vite`.
- **Styling**: Tailwind CSS v4 with utility-first classes and responsive landscape layout handling.
- **Animation**: `motion` (`motion/react` v12) for smooth physics, springs, drag gestures, and particle bursts.
- **Icons**: `lucide-react` for clean, consistent UI iconography.
- **Celebration & Particles**: `canvas-confetti` for victory fanfare and completion effects.
- **Audio & Speech Engine**: Native Web Audio API (Oscillator/Gain synthesis) paired with the Web SpeechSynthesis API (`SpeechSynthesisUtterance`) providing Hindi kid-voice audio narration without external audio assets.
- **Responsive Landscape Shell**: `LandscapeWrapper` with mobile orientation detection, rotation guidance, and fullscreen API integration.

---

## 📦 Library & Tool Usage Rules

### 1. Animations & Motion
- **Library**: `motion/react` (`import { motion, AnimatePresence } from 'motion/react'`).
- **Rule**: Use `motion` for layout transitions, enter/exit animations, hover/tap scales, and particle popping effects.
- **Avoid**: Do not import from `framer-motion` directly (use `motion/react`). Avoid heavy raw CSS keyframe animations when `motion` can achieve physics-based spring animations.

### 2. Icons
- **Library**: `lucide-react`.
- **Rule**: Always use `lucide-react` for all UI icons (e.g., `Sparkles`, `Trophy`, `RotateCcw`, `Volume2`, `VolumeX`, `Home`, `Play`, `Check`).
- **Rule**: Standardize icon styling with Tailwind color and sizing classes (e.g., `w-4 h-4 text-yellow-300`).

### 3. Audio & Voice Narration
- **Module**: `src/utils/audio.ts` (the `sounds` singleton).
- **Rule**: All audio feedback (chimes, pops, error tones, fanfare, Hindi letter & word narration) must be triggered via `sounds.*` methods.
- **Rule**: Always pass the `soundEnabled: boolean` parameter to every audio helper to respect user mute preferences.
- **Rule**: Do not add large audio MP3/WAV files to the repository unless requested; rely on synthesized Web Audio and native browser SpeechSynthesis.

### 4. Styling & Theming
- **Library**: Tailwind CSS v4.
- **Rule**: Follow the vibrant game color palette featuring high-contrast game cards (e.g., red tiles with white/yellow borders, sky-blue action buttons, gold accents, and green nature backgrounds).
- **Rule**: Always support mobile landscape orientation (`h-screen`, `overflow-hidden`, compact padding on mobile viewports `sm:`, `md:`).

### 5. Drag & Drop and Touch Interactions
- **Rule**: Combine HTML5 Drag and Drop (`draggable`, `onDragStart`, `onDragOver`, `onDrop`) with tap/pointer fallback events (`onClick`, `onPointerDown`, `onPointerMove`, `onPointerUp`) so that all games function smoothly on both touchscreens and desktop mice.

### 6. State Management & Component Design
- **Rule**: Keep components modular, focused, and under 200 lines where possible.
- **Rule**: Game modes must remain decoupled under `src/components/` and configured through types in `src/types.ts`.
- **Rule**: Common state (score, active mode, sound status) should be managed at the top-level `src/App.tsx` or encapsulated within stage components.

---

## 🎮 Game Modes Structure
1. **WORD_BUILDER** (`LeftPrefixRows`, `DropBox`, `RightSuffixColumn`): 4x4 matrix prefix + suffix tile matching with word explosion.
2. **FILL_BLANK** (`FillInTheBlankStage`): Interactive missing alphabet slot filling with dual option columns.
3. **BALLOON_POP** (`BalloonPopStage`): Floating balloon physics with circular progress ring and target letter voice prompts.
4. **CLICK_LETTER** (`ClickLetterStage`): Category-based letter pronunciation boards (Swar, Vyanjan, English).
5. **MATCH_WORD** (`MatchWordStage`): Interactive drag-to-draw SVG line connector matching letters to 3D object cards.