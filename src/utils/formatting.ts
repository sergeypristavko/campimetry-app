/**
 * Утилиты форматирования данных для отображения
 */

import { TestStatistics } from '../types';
import { statisticThresholds, colors } from '../styles/theme';

/**
 * Форматирует длительность в минуты:секунды
 * @param ms - Длительность в миллисекундах
 * @returns Строка формата "M:SS"
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Форматирует дату на русском языке
 * @param date - Дата или ISO-строка даты
 * @returns Отформатированная дата
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU');
}

/**
 * Форматирует время на русском языке
 * @param date - Дата или ISO-строка даты
 * @returns Отформатированное время (ЧЧ:ММ)
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Форматирует полную дату на русском языке
 * @param date - Дата или ISO-строка даты
 * @returns Отформатированная дата (например, "15 января 2024")
 */
export function formatFullDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Возвращает цвет для значения MD
 * @param md - Значение Mean Deviation
 * @returns Hex-код цвета
 */
export function getMDColor(md: number): string {
  if (md >= statisticThresholds.MD.good) return colors.success;
  if (md >= statisticThresholds.MD.moderate) return colors.warning;
  return colors.danger;
}

/**
 * Возвращает цвет для значения PSD
 * @param psd - Значение Pattern Standard Deviation
 * @returns Hex-код цвета
 */
export function getPSDColor(psd: number): string {
  if (psd <= statisticThresholds.PSD.good) return colors.success;
  if (psd <= statisticThresholds.PSD.moderate) return colors.warning;
  return colors.danger;
}

/**
 * Возвращает цвет для значения VFI
 * @param vfi - Значение Visual Field Index (0-100)
 * @returns Hex-код цвета
 */
export function getVFIColor(vfi: number): string {
  if (vfi >= statisticThresholds.VFI.good) return colors.success;
  if (vfi >= statisticThresholds.VFI.moderate) return colors.warning;
  return colors.danger;
}

/**
 * Возвращает цвет для любой статистики
 * @param statistic - Название статистики ('MD' | 'PSD' | 'VFI')
 * @param value - Значение статистики
 * @returns Hex-код цвета
 */
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

/** Цвета GHT */
const GHT_COLORS: Record<GHTType, string> = {
  'within normal': colors.success,
  'borderline': colors.warning,
  'outside normal': colors.danger,
  'general reduction': colors.danger,
  'abnormally high': colors.danger,
};

/**
 * Возвращает русскую метку для значения GHT
 * @param ght - Значение GHT
 * @returns Локализованная метка
 */
export function getGHTLabel(ght: GHTType): string {
  return GHT_LABELS[ght];
}

/**
 * Возвращает цвет для значения GHT
 * @param ght - Значение GHT
 * @returns Hex-код цвета
 */
export function getGHTColor(ght: GHTType): string {
  return GHT_COLORS[ght];
}

/**
 * Форматирует значение MD со знаком
 * @param md - Значение Mean Deviation
 * @param decimals - Количество знаков после запятой
 * @returns Отформатированная строка
 */
export function formatMD(md: number, decimals: number = 2): string {
  const prefix = md > 0 ? '+' : '';
  return `${prefix}${md.toFixed(decimals)}`;
}
