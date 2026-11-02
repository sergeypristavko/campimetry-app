/**
 * Вычисляет результат теста полуполей Глаукомы (Glaucoma Hemifield Test, GHT)
 * Сравнивает верхнюю и нижнюю половины поля зрения
 */

import { ThresholdResult, TestStatistics } from '../../types';
import { getTotalDeviation } from '../normal-values';

export function calculateGHT(
  results: ThresholdResult[],
  eccentricities: Map<string, number>,
  age?: number
): TestStatistics['GHT'] {
  const superior: number[] = [];
  const inferior: number[] = [];

  for (const result of results) {
    const ecc = eccentricities.get(result.pointId) ?? 10;
    const [, yStr] = result.pointId.split(':');
    const y = parseFloat(yStr);

    const deviation = getTotalDeviation(result.threshold, ecc, age);

    if (y > 0) {
      superior.push(deviation);
    } else if (y < 0) {
      inferior.push(deviation);
    }
  }

  if (superior.length === 0 || inferior.length === 0) {
    return 'within normal';
  }

  const superiorMean = superior.reduce((a, b) => a + b, 0) / superior.length;
  const inferiorMean = inferior.reduce((a, b) => a + b, 0) / inferior.length;

  const asymmetry = Math.abs(superiorMean - inferiorMean);
  const overallMean = (superiorMean + inferiorMean) / 2;

  // Упрощённые пороговые значения
  if (overallMean >= 2) {
    return 'abnormally high';
  }
  if (overallMean < -8 && asymmetry < 3) {
    return 'general reduction';
  }
  if (asymmetry > 5 || Math.min(superiorMean, inferiorMean) < -6) {
    return 'outside normal';
  }
  if (asymmetry > 3 || Math.min(superiorMean, inferiorMean) < -4) {
    return 'borderline';
  }

  return 'within normal';
}
