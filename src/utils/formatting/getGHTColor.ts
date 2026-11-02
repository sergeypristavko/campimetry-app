/**
 * Возвращает цвет для значения GHT
 */

import { TestStatistics } from '../../types';
import { colors } from '../../styles/theme';

/** Тип GHT из статистики */
type GHTType = NonNullable<TestStatistics['GHT']>;

/** Цвета GHT */
const GHT_COLORS: Record<GHTType, string> = {
  'within normal': colors.success,
  'borderline': colors.warning,
  'outside normal': colors.danger,
  'general reduction': colors.danger,
  'abnormally high': colors.danger,
};

/**
 * @param ght - Значение GHT
 * @returns Hex-код цвета
 */
export function getGHTColor(ght: GHTType): string {
  return GHT_COLORS[ght];
}
