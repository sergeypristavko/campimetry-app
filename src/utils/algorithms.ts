/**
 * Алгоритмы тестирования порога чувствительности
 * Реализация алгоритма staircase 4-2 для пороговой стратегии
 */

import { StaircaseState, TestPoint, ThresholdResult } from '../types';
import { getAgeNormalSensitivity } from './normalValues';

// Константы алгоритма staircase 4-2
const INITIAL_INTENSITY = 24; // начальная интенсивность в dB
const LARGE_STEP = 4; // большой шаг в dB
const SMALL_STEP = 2; // малый шаг в dB
const REQUIRED_REVERSALS = 2; // требуемое количество реверсий
const MAX_PRESENTATIONS = 10; // максимальное количество предъявлений
const MIN_INTENSITY = 0; // минимальная интенсивность
const MAX_INTENSITY = 40; // максимальная интенсивность

/**
 * Инициализирует состояние staircase для точки
 * @param point - Точка теста
 * @returns Начальное состояние staircase
 */
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

/**
 * Обрабатывает ответ пациента и обновляет состояние staircase
 * @param state - Текущее состояние
 * @param seen - Видел ли пациент стимул
 * @returns Обновлённое состояние
 */
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

/**
 * Вычисляет порог на основе ответов
 * Усредняет интенсивности в точках реверсии
 */
function calculateThreshold(responses: { intensity: number; seen: boolean }[]): number {
  if (responses.length === 0) return INITIAL_INTENSITY;

  // Находим точки реверсии и усредняем их
  const reversalIntensities: number[] = [];

  for (let i = 1; i < responses.length; i++) {
    const prevSeen = responses[i - 1].seen;
    const currSeen = responses[i].seen;

    if (prevSeen !== currSeen) {
      // Усредняем интенсивности около точки реверсии
      reversalIntensities.push((responses[i - 1].intensity + responses[i].intensity) / 2);
    }
  }

  if (reversalIntensities.length > 0) {
    return Math.round(
      reversalIntensities.reduce((sum, val) => sum + val, 0) / reversalIntensities.length
    );
  }

  // Запасной вариант: используем последнюю интенсивность
  const lastSeen = responses[responses.length - 1].seen;
  const lastIntensity = responses[responses.length - 1].intensity;

  if (lastSeen) {
    return lastIntensity;
  } else {
    return Math.min(MAX_INTENSITY, lastIntensity + SMALL_STEP);
  }
}

/**
 * Преобразует результат staircase в результат измерения порога
 */
export function staircaseToThresholdResult(
  state: StaircaseState,
  point: TestPoint,
  patientAge?: number
): ThresholdResult {
  const threshold = state.threshold ?? INITIAL_INTENSITY;
  const normalSensitivity = getAgeNormalSensitivity(point.eccentricity, patientAge);
  const totalDeviation = threshold - normalSensitivity;

  return {
    pointId: state.pointId,
    threshold,
    deviation: totalDeviation,
    totalDeviation,
    patternDeviation: 0, // Рассчитывается после завершения всех точек
    presentations: state.responses.length,
  };
}

/**
 * Возвращает интенсивность для надпороговой стратегии
 * Стимул показывается на 6 dB выше ожидаемого порога
 */
export function getSuprathresholdIntensity(eccentricity: number, patientAge?: number): number {
  const normalSensitivity = getAgeNormalSensitivity(eccentricity, patientAge);
  return Math.min(MAX_INTENSITY, normalSensitivity + 6);
}

/**
 * Преобразует интенсивность в dB в линейную шкалу (0-1) для CSS opacity
 * 0 dB = максимальная яркость (opacity 1.0)
 * 40 dB = минимальная яркость (opacity ~0.08)
 */
export function intensityToLinear(intensityDb: number): number {
  const maxDb = 40;
  const normalizedDb = Math.max(0, Math.min(maxDb, intensityDb));
  const minOpacity = 0.08;
  const maxOpacity = 1.0;
  return maxOpacity - (normalizedDb / maxDb) * (maxOpacity - minOpacity);
}

/**
 * Преобразует линейную интенсивность обратно в dB
 */
export function linearToIntensity(linear: number): number {
  const clampedLinear = Math.max(0.0001, Math.min(1, linear));
  return Math.round(-10 * Math.log10(clampedLinear));
}
