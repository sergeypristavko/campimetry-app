/**
 * Форматирует дату на русском языке
 * @param date - Дата или ISO-строка даты
 * @returns Отформатированная дата
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU');
}
