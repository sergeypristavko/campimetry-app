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

## Context Management

Use subagents for long-running or exploratory tasks to avoid polluting main context.

**When to use subagents:**
- Codebase exploration and research
- Investigation and debugging
- Parallel independent work

**When NOT to use:**
- Quick file edits
- Tasks needing user interaction
- Simple lookups

## Never

- Add `// @ts-nocheck` to files
- Add `Co-Authored-By` to commits
- Leave commented-out code
- Leave `console.log` or debug statements
- Introduce test regressions (all existing tests must pass)

## Code Quality

- **Hooks should contain minimal logic** - Extract complex logic into pure helper functions
- **Prefer pure functions** - Easier to test, reason about, and reuse
- **Keep functions small** - Functions should do one thing; if it's hard to name, it's doing too much
- **Keep files focused** - Split large files into smaller, single-purpose modules

## Philosophy

Code quality over velocity. Every component should be reusable, accessible, and properly typed. Leave the codebase better than you found it.
