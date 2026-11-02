import {
  baseSensitivityByEccentricity,
  AGE_BASELINE,
  AGE_CORRECTION_PER_DECADE,
} from './constants';

/**
 * Возвращает нормальную чувствительность для заданного эксцентриситета и возраста
 * @param eccentricity - Расстояние от центра в градусах
 * @param age - Возраст пациента (опционально)
 * @returns Нормальная чувствительность в dB
 */
export function getAgeNormalSensitivity(eccentricity: number, age?: number): number {
  // Находим ближайшие значения эксцентриситета
  const eccentricities = Object.keys(baseSensitivityByEccentricity)
    .map(Number)
    .sort((a, b) => a - b);

  let baseSensitivity: number;

  if (eccentricity <= eccentricities[0]) {
    baseSensitivity = baseSensitivityByEccentricity[eccentricities[0]];
  } else if (eccentricity >= eccentricities[eccentricities.length - 1]) {
    baseSensitivity = baseSensitivityByEccentricity[eccentricities[eccentricities.length - 1]];
  } else {
    // Интерполируем между двумя ближайшими значениями
    let lowerEcc = eccentricities[0];
    let upperEcc = eccentricities[eccentricities.length - 1];

    for (let i = 0; i < eccentricities.length - 1; i++) {
      if (eccentricity >= eccentricities[i] && eccentricity <= eccentricities[i + 1]) {
        lowerEcc = eccentricities[i];
        upperEcc = eccentricities[i + 1];
        break;
      }
    }

    const lowerSens = baseSensitivityByEccentricity[lowerEcc];
    const upperSens = baseSensitivityByEccentricity[upperEcc];
    const ratio = (eccentricity - lowerEcc) / (upperEcc - lowerEcc);
    baseSensitivity = lowerSens + (upperSens - lowerSens) * ratio;
  }

  // Применяем возрастную коррекцию
  const patientAge = age ?? AGE_BASELINE;
  const ageCorrection = ((patientAge - AGE_BASELINE) / 10) * AGE_CORRECTION_PER_DECADE;

  return Math.round(baseSensitivity - ageCorrection);
}
