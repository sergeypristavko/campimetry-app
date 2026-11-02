/**
 * Обрабатывает ответ пациента и обновляет состояние staircase
 */

import { StaircaseState } from '../../types';
import {
  REQUIRED_REVERSALS,
  MAX_PRESENTATIONS,
  SMALL_STEP,
  MIN_INTENSITY,
  MAX_INTENSITY,
} from './constants';
import { calculateThreshold } from './calculateThreshold';

export function processResponse(state: StaircaseState, seen: boolean): StaircaseState {
  const newResponses = [...state.responses, { intensity: state.currentIntensity, seen }];

  // Определяем направление изменения интенсивности
  const newDirection: 'up' | 'down' = seen ? 'down' : 'up';

  // Проверяем реверсию (смена направления)
  let newReversals = state.reversals;
  let newStep = state.step;

  if (state.lastDirection !== null && state.lastDirection !== newDirection) {
    newReversals++;
    // После первой реверсии переключаемся на малый шаг
    if (newReversals >= 1) {
      newStep = SMALL_STEP;
    }
  }

  // Проверяем завершение алгоритма
  if (newReversals >= REQUIRED_REVERSALS || newResponses.length >= MAX_PRESENTATIONS) {
    const threshold = calculateThreshold(newResponses);
    return {
      ...state,
      responses: newResponses,
      reversals: newReversals,
      lastDirection: newDirection,
      threshold,
      isComplete: true,
    };
  }

  // Вычисляем новую интенсивность
  let newIntensity = state.currentIntensity;
  if (seen) {
    // Уменьшаем интенсивность (делаем тусклее = сложнее увидеть)
    newIntensity = Math.max(MIN_INTENSITY, state.currentIntensity - newStep);
  } else {
    // Увеличиваем интенсивность (делаем ярче = легче увидеть)
    newIntensity = Math.min(MAX_INTENSITY, state.currentIntensity + newStep);
  }

  return {
    ...state,
    currentIntensity: newIntensity,
    step: newStep,
    reversals: newReversals,
    lastDirection: newDirection,
    responses: newResponses,
    threshold: null,
    isComplete: false,
  };
}
