# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web application for campimetry testing (visual field examination) that allows users to self-test their visual field at home. The app detects scotomas (blind spots) for screening purposes related to glaucoma, macular degeneration, and neurological conditions.

**Language:** All code is in Russian specification, but code/comments are in English.

## Commands

```bash
npm run dev          # Start development server
npm run build        # TypeScript check + Vite build
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking only
npm run preview      # Preview production build
```

## Architecture

### State Management

The app uses a screen-based navigation pattern without a router. `App.tsx` manages:
- Current screen state (`Screen` type: home, calibration, settings, instruction, test, results, history)
- Test configuration (eye, pattern, strategy)
- Completed session data

All state flows through App.tsx which orchestrates between screens and custom hooks.

### Core Hooks

- **`useTest`** (`src/hooks/useTest.ts`): Main test execution logic using a staircase algorithm for threshold testing. Manages stimulus presentation timing, response handling, and calculates final statistics.
- **`useCalibration`** (`src/hooks/useCalibration.ts`): Screen calibration for accurate visual angle calculations (pixels per degree).
- **`useStorage`** (`src/hooks/useStorage.ts`): LocalStorage persistence for calibration data, settings, and test sessions.
- **`useFullscreen`** (`src/hooks/useFullscreen.ts`): Fullscreen API wrapper for distraction-free testing.

### Test Algorithm Flow

1. Generate test points from grid pattern (24-2, 10-2, or 30-2)
2. Mark blind spot points based on tested eye
3. Shuffle points for random presentation
4. For each point, run staircase algorithm (threshold strategy) or single presentation (suprathreshold)
5. Calculate statistics: MD (Mean Deviation), PSD (Pattern Standard Deviation), VFI (Visual Field Index)

### Key Types (`src/types/index.ts`)

- `TestPoint`: Grid coordinates in visual degrees
- `StaircaseState`: Threshold algorithm state tracking
- `ThresholdResult`: Final measured sensitivity per point
- `TestSession`: Complete test record with results and statistics

### Build Configuration

Uses `vite-plugin-singlefile` to bundle everything into a single HTML file for offline/portable use. Path alias `@/*` maps to `./src/*`.
