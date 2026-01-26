// Eye types
export type Eye = 'OD' | 'OS';

// Grid pattern types
export type GridPattern = '24-2' | '10-2' | '30-2';

// Test strategy types
export type TestStrategy = 'suprathreshold' | 'threshold';

// Test point in the grid
export interface TestPoint {
  id: string;
  x: number;  // degrees from center
  y: number;  // degrees from center
  eccentricity: number;  // distance from center in degrees
  isBlindSpot?: boolean;
}

// Single stimulus presentation result
export interface StimulusResult {
  pointId: string;
  intensity: number;  // dB
  seen: boolean;
  reactionTime?: number;  // ms
  timestamp: number;
}

// Threshold measurement for a point
export interface ThresholdResult {
  pointId: string;
  threshold: number;  // dB (0-40)
  deviation: number;  // deviation from age-normal
  totalDeviation: number;
  patternDeviation: number;
  presentations: number;
}

// Reliability indices
export interface ReliabilityIndices {
  fixationLosses: number;
  fixationLossesTotal: number;
  falsePositives: number;
  falsePositivesTotal: number;
  falseNegatives: number;
  falseNegativesTotal: number;
}

// Test statistics
export interface TestStatistics {
  MD: number;  // Mean Deviation
  PSD: number;  // Pattern Standard Deviation
  VFI: number;  // Visual Field Index (0-100%)
  GHT?: 'within normal' | 'borderline' | 'outside normal' | 'general reduction' | 'abnormally high';
}

// Complete test session
export interface TestSession {
  id: string;
  date: string;
  eye: Eye;
  pattern: GridPattern;
  strategy: TestStrategy;
  duration: number;  // ms
  results: ThresholdResult[];
  reliability: ReliabilityIndices;
  statistics: TestStatistics;
  patientAge?: number;
  notes?: string;
}

// Calibration data
export interface Calibration {
  pixelsPerDegree: number;
  screenDistance: number;  // cm
  dpi: number;
  timestamp: number;
}

// App settings
export interface AppSettings {
  stimulusSizeGoldmann: 'I' | 'II' | 'III' | 'IV' | 'V';
  stimulusColor: string;
  backgroundColor: string;
  stimulusDuration: number;  // ms
  responseTimeout: number;  // ms
  soundEnabled: boolean;
}

// Navigation screen types
export type Screen =
  | 'home'
  | 'calibration'
  | 'settings'
  | 'instruction'
  | 'test'
  | 'results'
  | 'history';

// Staircase state for threshold algorithm
export interface StaircaseState {
  pointId: string;
  currentIntensity: number;
  step: number;
  reversals: number;
  lastDirection: 'up' | 'down' | null;
  responses: { intensity: number; seen: boolean }[];
  threshold: number | null;
  isComplete: boolean;
}

// Goldmann stimulus sizes in degrees
export const GoldmannSizes: Record<AppSettings['stimulusSizeGoldmann'], number> = {
  'I': 0.108,
  'II': 0.217,
  'III': 0.431,
  'IV': 0.862,
  'V': 1.724,
};

// Age-normal sensitivity values by eccentricity (simplified)
export interface NormalValue {
  eccentricity: number;
  sensitivity: number;  // dB
}
