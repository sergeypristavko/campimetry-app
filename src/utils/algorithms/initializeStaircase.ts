/**
 * Инициализирует состояние staircase для точки
 */

import { StaircaseState, TestPoint } from '../../types';
import { INITIAL_INTENSITY, LARGE_STEP } from './constants';

export function initializeStaircase(point: TestPoint): StaircaseState {
  return {
    pointId: point.id,
    currentIntensity: INITIAL_INTENSITY,
    step: LARGE_STEP,
    reversals: 0,
    lastDirection: null,
    responses: [],
    threshold: null,
    isComplete: false,
  };
}
