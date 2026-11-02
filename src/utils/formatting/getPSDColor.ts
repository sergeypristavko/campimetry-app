/**
 * Возвращает цвет для значения PSD
 * @param psd - Значение Pattern Standard Deviation
 * @returns Hex-код цвета
 */

import { statisticThresholds, colors } from '../../styles/theme';

export function getPSDColor(psd: number): string {
  if (psd <= statisticThresholds.PSD.good) return colors.success;
  if (psd <= statisticThresholds.PSD.moderate) return colors.warning;
  return colors.danger;
}
