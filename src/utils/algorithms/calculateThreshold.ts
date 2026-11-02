/**
 * Вычисляет порог на основе ответов
 * Усредняет интенсивности в точках реверсии
 */

import { INITIAL_INTENSITY, MAX_INTENSITY, SMALL_STEP } from './constants';

export function calculateThreshold(responses: { intensity: number; seen: boolean }[]): number {
  if (responses.length === 0) return INITIAL_INTENSITY;

  // Находим точки реверсии и усредняем их
  const reversalIntensities: number[] = [];

  for (let i = 1; i < responses.length; i++) {
    const prevSeen = responses[i - 1].seen;
    const currSeen = responses[i].seen;

    if (prevSeen !== currSeen) {
      // Усредняем интенсивности около точки реверсии
      reversalIntensities.push((responses[i - 1].intensity + responses[i].intensity) / 2);
    }
  }

  if (reversalIntensities.length > 0) {
    return Math.round(
      reversalIntensities.reduce((sum, val) => sum + val, 0) / reversalIntensities.length
    );
  }

  // Запасной вариант: используем последнюю интенсивность
  const lastSeen = responses[responses.length - 1].seen;
  const lastIntensity = responses[responses.length - 1].intensity;

  if (lastSeen) {
    return lastIntensity;
  } else {
    return Math.min(MAX_INTENSITY, lastIntensity + SMALL_STEP);
  }
}
