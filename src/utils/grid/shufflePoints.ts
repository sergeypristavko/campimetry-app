/**
 * Перемешивает точки для случайного порядка предъявления
 * Использует алгоритм Фишера-Йетса
 */

import { TestPoint } from '../../types';

export function shufflePoints(points: TestPoint[]): TestPoint[] {
  const shuffled = [...points];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
