/**
 * Преобразует результат staircase в результат измерения порога
 */

import { StaircaseState, TestPoint, ThresholdResult } from '../../types';
import { getAgeNormalSensitivity } from '../normal-values';
import { INITIAL_INTENSITY } from './constants';

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
