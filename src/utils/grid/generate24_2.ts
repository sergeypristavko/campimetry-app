/**
 * Паттерн 24-2: 54 точки с шагом 6°, охват ±24° от центра
 * Стандартный тест для диагностики глаукомы
 */

import { TestPoint } from '../../types';
import { generatePattern } from './generatePattern';

export function generate24_2Pattern(): TestPoint[] {
  return generatePattern({
    maxCoord: 24,
    step: 6,
    maxEccentricity: 27,
    axisOffset: 3,
    shouldInclude: (x, y) => {
      // Пропускаем точки в крайних углах
      return !(Math.abs(x) === 24 && Math.abs(y) === 24);
    },
  });
}
