/**
 * Возвращает цвет для любой статистики
 * @param statistic - Название статистики ('MD' | 'PSD' | 'VFI')
 * @param value - Значение статистики
 * @returns Hex-код цвета
 */

import { statisticThresholds, colors } from '../../styles/theme';
import { getMDColor } from './getMDColor';
import { getPSDColor } from './getPSDColor';
import { getVFIColor } from './getVFIColor';

export function getStatisticColor(
  statistic: keyof typeof statisticThresholds,
  value: number
): string {
  switch (statistic) {
    case 'MD':
      return getMDColor(value);
    case 'PSD':
      return getPSDColor(value);
    case 'VFI':
      return getVFIColor(value);
    default:
      return colors.text.primary;
  }
}
