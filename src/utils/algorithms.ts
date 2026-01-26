import { StaircaseState, TestPoint, ThresholdResult } from '../types';
import { getAgeNormalSensitivity } from './normalValues';

// 4-2 Staircase algorithm constants
const INITIAL_INTENSITY = 24; // dB
const LARGE_STEP = 4; // dB
const SMALL_STEP = 2; // dB
const REQUIRED_REVERSALS = 2;
const MAX_PRESENTATIONS = 10;
const MIN_INTENSITY = 0;
const MAX_INTENSITY = 40;

// Initialize staircase for a point
export function initializeStaircase(point: TestPoint): StaircaseState {
  return {
    pointId: point.id,
    currentIntensity: INITIAL_INTENSITY,
    step: LARGE_STEP,
    reversals: 0,
    lastDirection: null,
    responses: [],
    threshold: null,
    isComplete: false,
  };
}

// Process a response and update staircase state
export function processResponse(state: StaircaseState, seen: boolean): StaircaseState {
  const newResponses = [...state.responses, { intensity: state.currentIntensity, seen }];

  // Determine new direction
  const newDirection: 'up' | 'down' = seen ? 'down' : 'up';

  // Check for reversal
  let newReversals = state.reversals;
  let newStep = state.step;

  if (state.lastDirection !== null && state.lastDirection !== newDirection) {
    newReversals++;
    // Switch to small step after first reversal
    if (newReversals >= 1) {
      newStep = SMALL_STEP;
    }
  }

  // Check if complete
  if (newReversals >= REQUIRED_REVERSALS || newResponses.length >= MAX_PRESENTATIONS) {
    // Calculate threshold from last few responses
    const threshold = calculateThreshold(newResponses);
    return {
      ...state,
      responses: newResponses,
      reversals: newReversals,
      lastDirection: newDirection,
      threshold,
      isComplete: true,
    };
  }

  // Calculate new intensity
  let newIntensity = state.currentIntensity;
  if (seen) {
    // Decrease intensity (make dimmer = harder to see)
    newIntensity = Math.max(MIN_INTENSITY, state.currentIntensity - newStep);
  } else {
    // Increase intensity (make brighter = easier to see)
    newIntensity = Math.min(MAX_INTENSITY, state.currentIntensity + newStep);
  }

  return {
    ...state,
    currentIntensity: newIntensity,
    step: newStep,
    reversals: newReversals,
    lastDirection: newDirection,
    responses: newResponses,
    threshold: null,
    isComplete: false,
  };
}

// Calculate threshold from responses
function calculateThreshold(responses: { intensity: number; seen: boolean }[]): number {
  if (responses.length === 0) return INITIAL_INTENSITY;

  // Find reversal points and average them
  const reversalIntensities: number[] = [];

  for (let i = 1; i < responses.length; i++) {
    const prevSeen = responses[i - 1].seen;
    const currSeen = responses[i].seen;

    if (prevSeen !== currSeen) {
      // Average the two intensities around the reversal
      reversalIntensities.push((responses[i - 1].intensity + responses[i].intensity) / 2);
    }
  }

  if (reversalIntensities.length > 0) {
    // Average the reversal points
    return Math.round(
      reversalIntensities.reduce((sum, val) => sum + val, 0) / reversalIntensities.length
    );
  }

  // Fallback: use the last intensity
  const lastSeen = responses[responses.length - 1].seen;
  const lastIntensity = responses[responses.length - 1].intensity;

  if (lastSeen) {
    return lastIntensity;
  } else {
    return Math.min(MAX_INTENSITY, lastIntensity + SMALL_STEP);
  }
}

// Convert staircase result to threshold result
export function staircaseToThresholdResult(
  state: StaircaseState,
  point: TestPoint,
  patientAge?: number
): ThresholdResult {
  const threshold = state.threshold ?? INITIAL_INTENSITY;
  const normalSensitivity = getAgeNormalSensitivity(point.eccentricity, patientAge);
  const totalDeviation = threshold - normalSensitivity;

  return {
    pointId: state.pointId,
    threshold,
    deviation: totalDeviation,
    totalDeviation,
    patternDeviation: 0, // Will be calculated after all points are done
    presentations: state.responses.length,
  };
}

// Suprathreshold test - single intensity presentation
export function getSuprathresholdIntensity(eccentricity: number, patientAge?: number): number {
  const normalSensitivity = getAgeNormalSensitivity(eccentricity, patientAge);
  // Show stimulus 6 dB above threshold (should be easily seen by normal eye)
  return Math.min(MAX_INTENSITY, normalSensitivity + 6);
}

// Calculate intensity in linear units for display (0-1 scale for CSS opacity)
export function intensityToLinear(intensityDb: number): number {
  // For screen display, map dB to visible opacity range
  // 0 dB = brightest (opacity 1.0), 40 dB = dimmest (opacity ~0.1)
  // Use a more gradual scale suitable for monitors
  const maxDb = 40;
  const normalizedDb = Math.max(0, Math.min(maxDb, intensityDb));
  // Linear mapping: higher dB = lower opacity, but keep minimum visible
  const minOpacity = 0.08;
  const maxOpacity = 1.0;
  return maxOpacity - (normalizedDb / maxDb) * (maxOpacity - minOpacity);
}

// Convert linear intensity to dB
export function linearToIntensity(linear: number): number {
  // Inverse of intensityToLinear
  const clampedLinear = Math.max(0.0001, Math.min(1, linear));
  return Math.round(-10 * Math.log10(clampedLinear));
}
