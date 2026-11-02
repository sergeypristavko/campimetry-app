/**
 * Вычисляет паттерн-стандартное отклонение (Pattern Standard Deviation, PSD)
 * Измеряет локализованную потерю поля зрения
 */

import { ThresholdResult } from '../../types';
import { calculatePatternDeviations } from '../normal-values';

export function calculatePSD(
  results: ThresholdResult[],
  eccentricities: Map<string, number>,
  age?: number
): number {
  if (results.length < 2) return 0;

  const dataForPD = results.map(r => ({
    threshold: r.threshold,
    eccentricity: eccentricities.get(r.pointId) ?? 10,
  }));

  const patternDeviations = calculatePatternDeviations(dataForPD, age);

  // Вычисляем стандартное отклонение паттерн-отклонений
  const mean = patternDeviations.reduce((sum, v) => sum + v, 0) / patternDeviations.length;
  const squaredDiffs = patternDeviations.map(v => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / patternDeviations.length;

  return Math.round(Math.sqrt(variance) * 100) / 100;
}
