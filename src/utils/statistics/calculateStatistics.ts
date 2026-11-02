/**
 * Вычисляет все статистические показатели
 */

import { ThresholdResult, TestStatistics } from '../../types';
import { calculateMD } from './calculateMD';
import { calculatePSD } from './calculatePSD';
import { calculateVFI } from './calculateVFI';
import { calculateGHT } from './calculateGHT';

export function calculateStatistics(
  results: ThresholdResult[],
  eccentricities: Map<string, number>,
  age?: number
): TestStatistics {
  return {
    MD: calculateMD(results, eccentricities, age),
    PSD: calculatePSD(results, eccentricities, age),
    VFI: calculateVFI(results, eccentricities, age),
    GHT: calculateGHT(results, eccentricities, age),
  };
}
