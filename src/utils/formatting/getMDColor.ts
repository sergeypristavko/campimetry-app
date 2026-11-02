/**
 * Возвращает цвет для значения MD
 * @param md - Значение Mean Deviation
 * @returns Hex-код цвета
 */

import { statisticThresholds, colors } from '../../styles/theme';

export function getMDColor(md: number): string {
  if (md >= statisticThresholds.MD.good) return colors.success;
  if (md >= statisticThresholds.MD.moderate) return colors.warning;
  return colors.danger;
}
