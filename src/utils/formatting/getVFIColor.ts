/**
 * Возвращает цвет для значения VFI
 * @param vfi - Значение Visual Field Index (0-100)
 * @returns Hex-код цвета
 */

import { statisticThresholds, colors } from '../../styles/theme';

export function getVFIColor(vfi: number): string {
  if (vfi >= statisticThresholds.VFI.good) return colors.success;
  if (vfi >= statisticThresholds.VFI.moderate) return colors.warning;
  return colors.danger;
}
