/**
 * Возвращает уровень вероятности для классификации дефекта
 * @param deviation - Отклонение от нормы в dB
 * @returns Уровень статистической значимости
 */
export function getDefectProbability(deviation: number): string {
  if (deviation >= -1) return 'normal';
  if (deviation >= -5) return 'p<5%';
  if (deviation >= -10) return 'p<2%';
  if (deviation >= -15) return 'p<1%';
  return 'p<0.5%';
}
