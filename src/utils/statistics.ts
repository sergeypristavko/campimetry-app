/**
 * Расчёт статистических показателей теста поля зрения
 * MD, PSD, VFI, GHT и показатели надёжности
 */

import { ThresholdResult, TestStatistics, ReliabilityIndices } from '../types';
import {
  getTotalDeviation,
  calculatePatternDeviations,
  getVFIWeight,
  getAgeNormalSensitivity,
} from './normalValues';

/**
 * Вычисляет среднее отклонение (Mean Deviation, MD)
 * Среднее значение отклонений от возрастной нормы по всем точкам
 */
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

/**
 * Вычисляет паттерн-стандартное отклонение (Pattern Standard Deviation, PSD)
 * Измеряет локализованную потерю поля зрения
 */
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

/**
 * Вычисляет индекс поля зрения (Visual Field Index, VFI)
 * Процент сохранённого поля зрения с весом к центру
 */
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

/**
 * Вычисляет результат теста полуполей Глаукомы (Glaucoma Hemifield Test, GHT)
 * Сравнивает верхнюю и нижнюю половины поля зрения
 */
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

/**
 * Вычисляет все статистические показатели
 */
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

/**
 * Формирует объект показателей надёжности
 */
export function calculateReliability(
  fixationLosses: number,
  fixationLossesTotal: number,
  falsePositives: number,
  falsePositivesTotal: number,
  falseNegatives: number,
  falseNegativesTotal: number
): ReliabilityIndices {
  return {
    fixationLosses,
    fixationLossesTotal,
    falsePositives,
    falsePositivesTotal,
    falseNegatives,
    falseNegativesTotal,
  };
}

/**
 * Проверяет, находятся ли показатели надёжности в допустимых пределах
 * Порог: менее 33% для каждого показателя
 */
export function isReliabilityAcceptable(reliability: ReliabilityIndices): boolean {
  const fixationLossRate =
    reliability.fixationLossesTotal > 0
      ? reliability.fixationLosses / reliability.fixationLossesTotal
      : 0;
  const falsePositiveRate =
    reliability.falsePositivesTotal > 0
      ? reliability.falsePositives / reliability.falsePositivesTotal
      : 0;
  const falseNegativeRate =
    reliability.falseNegativesTotal > 0
      ? reliability.falseNegatives / reliability.falseNegativesTotal
      : 0;

  return fixationLossRate < 0.33 && falsePositiveRate < 0.33 && falseNegativeRate < 0.33;
}

/**
 * Форматирует показатель надёжности как процент
 */
export function formatReliabilityPercent(count: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((count / total) * 100)}%`;
}

/**
 * Интерпретация значения MD
 */
export function interpretMD(md: number): string {
  if (md >= -2) return 'В пределах нормы';
  if (md >= -6) return 'Лёгкое снижение';
  if (md >= -12) return 'Умеренное снижение';
  if (md >= -20) return 'Выраженное снижение';
  return 'Тяжёлое снижение';
}

/**
 * Интерпретация значения PSD
 */
export function interpretPSD(psd: number): string {
  if (psd <= 2) return 'В пределах нормы';
  if (psd <= 4) return 'Незначительная локализация';
  if (psd <= 6) return 'Умеренная локализация';
  return 'Выраженная локализация';
}

/**
 * Интерпретация значения VFI
 */
export function interpretVFI(vfi: number): string {
  if (vfi >= 95) return 'Норма';
  if (vfi >= 80) return 'Лёгкие изменения';
  if (vfi >= 60) return 'Умеренные изменения';
  if (vfi >= 40) return 'Выраженные изменения';
  return 'Тяжёлые изменения';
}
