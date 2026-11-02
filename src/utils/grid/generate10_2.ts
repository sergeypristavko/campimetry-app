/**
 * Паттерн 10-2: 68 точек с шагом 2°, охват ±10° от центра
 * Тест макулярной области для детального исследования центрального зрения
 */

import { TestPoint } from '../../types';
import { generatePattern } from './generatePattern';

export function generate10_2Pattern(): TestPoint[] {
  return generatePattern({
    maxCoord: 10,
    step: 2,
    maxEccentricity: 11,
    axisOffset: 1,
  });
}
