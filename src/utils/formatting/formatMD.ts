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
