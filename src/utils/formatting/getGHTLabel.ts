/**
 * Возвращает русскую метку для значения GHT
 */

import { TestStatistics } from '../../types';

/** Тип GHT из статистики */
type GHTType = NonNullable<TestStatistics['GHT']>;

/** Метки GHT на русском языке */
const GHT_LABELS: Record<GHTType, string> = {
  'within normal': 'В пределах нормы',
  'borderline': 'Пограничный',
  'outside normal': 'За пределами нормы',
  'general reduction': 'Общее снижение',
  'abnormally high': 'Аномально высокий',
};

/**
 * @param ght - Значение GHT
 * @returns Локализованная метка
 */
export function getGHTLabel(ght: GHTType): string {
  return GHT_LABELS[ght];
}
