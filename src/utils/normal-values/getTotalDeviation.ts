import { getAgeNormalSensitivity } from './getAgeNormalSensitivity';

/**
 * Вычисляет общее отклонение (измеренное - нормальное)
 * @param measured - Измеренная чувствительность в dB
 * @param eccentricity - Расстояние от центра в градусах
 * @param age - Возраст пациента (опционально)
 * @returns Общее отклонение в dB
 */
export function getTotalDeviation(measured: number, eccentricity: number, age?: number): number {
  const normal = getAgeNormalSensitivity(eccentricity, age);
  return measured - normal;
}
