/**
 * Возвращает паттерн по имени
 */

import { TestPoint, GridPattern } from '../../types';
import { generate24_2Pattern } from './generate24_2';
import { generate10_2Pattern } from './generate10_2';
import { generate30_2Pattern } from './generate30_2';

export function getPattern(pattern: GridPattern): TestPoint[] {
  switch (pattern) {
    case '24-2':
      return generate24_2Pattern();
    case '10-2':
      return generate10_2Pattern();
    case '30-2':
      return generate30_2Pattern();
    default:
      return generate24_2Pattern();
  }
}
