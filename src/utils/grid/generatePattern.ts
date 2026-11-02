/**
 * Общая логика генерации паттернов сетки
 */

import { TestPoint } from '../../types';
import { pointId, eccentricity } from './helpers';

export interface PatternConfig {
  /** Максимальная координата по осям (±maxCoord) */
  maxCoord: number;
  /** Шаг между точками в градусах */
  step: number;
  /** Максимальный эксцентриситет точки */
  maxEccentricity: number;
  /** Смещение для точек на осях */
  axisOffset: number;
  /** Функция проверки, включать ли точку (опционально) */
  shouldInclude?: (x: number, y: number, ecc: number) => boolean;
}

/**
 * Генерирует паттерн точек по заданной конфигурации
 * Убирает дублирование логики между 24-2, 10-2 и 30-2
 */
export function generatePattern(config: PatternConfig): TestPoint[] {
  const points: TestPoint[] = [];
  const { maxCoord, step, maxEccentricity, axisOffset, shouldInclude } = config;

  for (let x = -maxCoord; x <= maxCoord; x += step) {
    for (let y = -maxCoord; y <= maxCoord; y += step) {
      const ecc = eccentricity(x, y);

      // Пропускаем центральную точку
      if (ecc === 0) continue;

      // Пропускаем точки за пределами максимального эксцентриситета
      if (ecc > maxEccentricity) continue;

      // Дополнительная проверка (например, для углов в 24-2)
      if (shouldInclude && !shouldInclude(x, y, ecc)) continue;

      // Добавляем смещение для точек на осях
      if (x === 0 && y !== 0) {
        points.push({
          id: pointId(axisOffset, y),
          x: axisOffset,
          y,
          eccentricity: eccentricity(axisOffset, y),
        });
        points.push({
          id: pointId(-axisOffset, y),
          x: -axisOffset,
          y,
          eccentricity: eccentricity(-axisOffset, y),
        });
      } else if (y === 0 && x !== 0) {
        points.push({
          id: pointId(x, axisOffset),
          x,
          y: axisOffset,
          eccentricity: eccentricity(x, axisOffset),
        });
        points.push({
          id: pointId(x, -axisOffset),
          x,
          y: -axisOffset,
          eccentricity: eccentricity(x, -axisOffset),
        });
      } else {
        points.push({
          id: pointId(x, y),
          x,
          y,
          eccentricity: ecc,
        });
      }
    }
  }

  // Удаляем дубликаты по ID
  const uniquePoints = Array.from(new Map(points.map(p => [p.id, p])).values());

  return uniquePoints;
}
