/**
 * Возвращает интенсивность для надпороговой стратегии
 * Стимул показывается на 6 dB выше ожидаемого порога
 */

import { getAgeNormalSensitivity } from '../normal-values';
import { MAX_INTENSITY } from './constants';

export function getSuprathresholdIntensity(eccentricity: number, patientAge?: number): number {
  const normalSensitivity = getAgeNormalSensitivity(eccentricity, patientAge);
  return Math.min(MAX_INTENSITY, normalSensitivity + 6);
}
