/**
 * Преобразует линейную интенсивность обратно в dB
 */
export function linearToIntensity(linear: number): number {
  const clampedLinear = Math.max(0.0001, Math.min(1, linear));
  return Math.round(-10 * Math.log10(clampedLinear));
}
