/**
 * Вычисляет размер стимула в пикселях
 */

import { GoldmannSizes, AppSettings } from '@/types';

/**
 * Вычисляет размер стимула в пикселях
 *
 * @param goldmannSize - Размер по Гольдману (I-V)
 * @param pixelsPerDegree - Количество пикселей на градус
 * @returns Размер стимула в пикселях (минимум 4px)
 */
export function calculateStimulusSizePx(
  goldmannSize: AppSettings['stimulusSizeGoldmann'],
  pixelsPerDegree: number
): number {
  const sizeDegrees = GoldmannSizes[goldmannSize];
  return Math.max(4, Math.round(sizeDegrees * pixelsPerDegree));
}
