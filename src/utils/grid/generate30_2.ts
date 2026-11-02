/**
 * Паттерн 30-2: 76 точек с шагом 6°, охват ±30° от центра
 * Расширенный тест для исследования периферического поля зрения
 */

import { TestPoint } from '../../types';
import { generatePattern } from './generatePattern';

export function generate30_2Pattern(): TestPoint[] {
  return generatePattern({
    maxCoord: 30,
    step: 6,
    maxEccentricity: 33,
    axisOffset: 3,
  });
}
