/**
 * Преобразует интенсивность в dB в линейную шкалу (0-1) для CSS opacity
 * 0 dB = максимальная яркость (opacity 1.0)
 * 40 dB = минимальная яркость (opacity ~0.08)
 */
export function intensityToLinear(intensityDb: number): number {
  const maxDb = 40;
  const normalizedDb = Math.max(0, Math.min(maxDb, intensityDb));
  const minOpacity = 0.08;
  const maxOpacity = 1.0;
  return maxOpacity - (normalizedDb / maxDb) * (maxOpacity - minOpacity);
}
