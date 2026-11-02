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
