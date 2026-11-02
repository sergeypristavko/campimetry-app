/**
 * Функции для работы с показателями надёжности теста
 */

import { ReliabilityIndices } from '../../types';

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
