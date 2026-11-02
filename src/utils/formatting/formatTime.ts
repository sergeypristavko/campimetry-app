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
