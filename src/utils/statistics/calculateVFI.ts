/**
 * Вычисляет индекс поля зрения (Visual Field Index, VFI)
 * Процент сохранённого поля зрения с весом к центру
 */

import { ThresholdResult } from '../../types';
import { getVFIWeight, getAgeNormalSensitivity } from '../normal-values';

export function calculateVFI(
  results: ThresholdResult[],
  eccentricities: Map<string, number>,
  age?: number
): number {
  if (results.length === 0) return 100;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const result of results) {
    const ecc = eccentricities.get(result.pointId) ?? 10;
    const weight = getVFIWeight(ecc);
    const normalSens = getAgeNormalSensitivity(ecc, age);

    // Процент сохранённой чувствительности (0-100%)
    const percentPreserved = Math.max(0, Math.min(100, (result.threshold / normalSens) * 100));

    weightedSum += percentPreserved * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 100;

  return Math.round(weightedSum / totalWeight);
}
