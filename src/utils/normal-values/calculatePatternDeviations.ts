import { getTotalDeviation } from './getTotalDeviation';

/**
 * Вычисляет паттерн-отклонения
 * Паттерн-отклонение = общее отклонение минус 85-й процентиль общих отклонений
 * Это помогает выявить локализованные дефекты vs общее снижение
 * @param results - Массив результатов с порогом и эксцентриситетом
 * @param age - Возраст пациента (опционально)
 * @returns Массив паттерн-отклонений в dB
 */
export function calculatePatternDeviations(
  results: { threshold: number; eccentricity: number }[],
  age?: number
): number[] {
  // Вычисляем общие отклонения
  const totalDeviations = results.map(r => getTotalDeviation(r.threshold, r.eccentricity, age));

  // Находим 7-е наибольшее значение (примерно 85-й процентиль для 54 точек)
  const sortedTD = [...totalDeviations].sort((a, b) => b - a);
  const percentileIndex = Math.floor(sortedTD.length * 0.15);
  const generalHeight = sortedTD[percentileIndex] || 0;

  // Паттерн-отклонение = общее отклонение - общая высота
  return totalDeviations.map(td => td - generalHeight);
}
