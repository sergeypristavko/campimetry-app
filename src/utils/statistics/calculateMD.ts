/**
 * Вычисляет среднее отклонение (Mean Deviation, MD)
 * Среднее значение отклонений от возрастной нормы по всем точкам
 */

import { ThresholdResult } from '../../types';
import { getTotalDeviation } from '../normal-values';

export function calculateMD(
  results: ThresholdResult[],
  eccentricities: Map<string, number>,
  age?: number
): number {
  if (results.length === 0) return 0;

  const totalDeviations = results.map(r => {
    const ecc = eccentricities.get(r.pointId) ?? 10;
    return getTotalDeviation(r.threshold, ecc, age);
  });

  const sum = totalDeviations.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / totalDeviations.length) * 100) / 100;
}
