/**
 * Возвращает информацию о паттерне
 */

import { GridPattern } from '../../types';

export function getPatternInfo(pattern: GridPattern): { points: number; description: string } {
  switch (pattern) {
    case '24-2':
      return { points: 54, description: 'Стандартный тест центрального поля (24°)' };
    case '10-2':
      return { points: 68, description: 'Тест макулярной области (10°)' };
    case '30-2':
      return { points: 76, description: 'Расширенный тест поля зрения (30°)' };
    default:
      return { points: 54, description: 'Стандартный тест' };
  }
}
