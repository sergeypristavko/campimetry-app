// Age-normal sensitivity values based on eccentricity
// Simplified model based on published normative data
// Values are in dB

interface NormalValuesByEccentricity {
  [key: number]: number;
}

// Base normal sensitivity by eccentricity (for age 30)
const baseSensitivityByEccentricity: NormalValuesByEccentricity = {
  0: 34,   // fovea (not tested)
  3: 32,   // near fovea
  5: 31,
  7: 30,
  9: 29,
  10: 29,
  12: 28,
  15: 27,
  18: 26,
  21: 25,
  24: 24,
  27: 23,
  30: 22,
};

// Age correction factor: sensitivity decreases ~0.7 dB per decade after age 20
const AGE_BASELINE = 30;
const AGE_CORRECTION_PER_DECADE = 0.7;

// Get normal sensitivity for a given eccentricity and age
export function getAgeNormalSensitivity(eccentricity: number, age?: number): number {
  // Find the closest eccentricity values
  const eccentricities = Object.keys(baseSensitivityByEccentricity).map(Number).sort((a, b) => a - b);

  let baseSensitivity: number;

  if (eccentricity <= eccentricities[0]) {
    baseSensitivity = baseSensitivityByEccentricity[eccentricities[0]];
  } else if (eccentricity >= eccentricities[eccentricities.length - 1]) {
    baseSensitivity = baseSensitivityByEccentricity[eccentricities[eccentricities.length - 1]];
  } else {
    // Interpolate between two closest values
    let lowerEcc = eccentricities[0];
    let upperEcc = eccentricities[eccentricities.length - 1];

    for (let i = 0; i < eccentricities.length - 1; i++) {
      if (eccentricity >= eccentricities[i] && eccentricity <= eccentricities[i + 1]) {
        lowerEcc = eccentricities[i];
        upperEcc = eccentricities[i + 1];
        break;
      }
    }

    const lowerSens = baseSensitivityByEccentricity[lowerEcc];
    const upperSens = baseSensitivityByEccentricity[upperEcc];
    const ratio = (eccentricity - lowerEcc) / (upperEcc - lowerEcc);
    baseSensitivity = lowerSens + (upperSens - lowerSens) * ratio;
  }

  // Apply age correction
  const patientAge = age ?? AGE_BASELINE;
  const ageCorrection = ((patientAge - AGE_BASELINE) / 10) * AGE_CORRECTION_PER_DECADE;

  return Math.round(baseSensitivity - ageCorrection);
}

// Get total deviation (measured - normal)
export function getTotalDeviation(measured: number, eccentricity: number, age?: number): number {
  const normal = getAgeNormalSensitivity(eccentricity, age);
  return measured - normal;
}

// Pattern deviation is calculated as total deviation minus the 85th percentile of total deviations
// This helps identify localized defects vs generalized depression
export function calculatePatternDeviations(
  results: { threshold: number; eccentricity: number }[],
  age?: number
): number[] {
  // Calculate total deviations
  const totalDeviations = results.map(r =>
    getTotalDeviation(r.threshold, r.eccentricity, age)
  );

  // Find the 7th highest value (approximately 85th percentile for 54 points)
  const sortedTD = [...totalDeviations].sort((a, b) => b - a);
  const percentileIndex = Math.floor(sortedTD.length * 0.15);
  const generalHeight = sortedTD[percentileIndex] || 0;

  // Pattern deviation = total deviation - general height
  return totalDeviations.map(td => td - generalHeight);
}

// Weights for VFI calculation based on eccentricity
// Central points weighted more heavily
export function getVFIWeight(eccentricity: number): number {
  if (eccentricity <= 5) return 1.0;
  if (eccentricity <= 10) return 0.8;
  if (eccentricity <= 15) return 0.6;
  if (eccentricity <= 20) return 0.4;
  if (eccentricity <= 25) return 0.3;
  return 0.2;
}

// Probability levels for defect classification
export function getDefectProbability(deviation: number): string {
  if (deviation >= -1) return 'normal';
  if (deviation >= -5) return 'p<5%';
  if (deviation >= -10) return 'p<2%';
  if (deviation >= -15) return 'p<1%';
  return 'p<0.5%';
}

// Color for deviation display
export function getDeviationColor(deviation: number): string {
  if (deviation >= -1) return '#4ade80';  // green - normal
  if (deviation >= -5) return '#a3e635';  // lime - slight
  if (deviation >= -10) return '#facc15'; // yellow - mild
  if (deviation >= -15) return '#fb923c'; // orange - moderate
  if (deviation >= -20) return '#f87171'; // red - severe
  return '#991b1b'; // dark red - very severe
}

// Threshold color for sensitivity map
export function getThresholdColor(threshold: number): string {
  if (threshold >= 30) return '#22c55e';  // green - excellent
  if (threshold >= 25) return '#84cc16';  // lime - good
  if (threshold >= 20) return '#eab308';  // yellow - fair
  if (threshold >= 15) return '#f97316';  // orange - reduced
  if (threshold >= 10) return '#ef4444';  // red - low
  if (threshold >= 5) return '#dc2626';   // dark red - very low
  return '#7f1d1d'; // very dark red - severe loss
}
