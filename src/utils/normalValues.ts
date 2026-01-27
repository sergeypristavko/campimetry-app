/**
 * Нормативные значения чувствительности поля зрения
 * Упрощённая модель на основе опубликованных нормативных данных
 * Значения указаны в децибелах (dB)
 */

interface NormalValuesByEccentricity {
  [key: number]: number;
}

/**
 * Базовая нормальная чувствительность по эксцентриситету (для возраста 30 лет)
 */
const baseSensitivityByEccentricity: NormalValuesByEccentricity = {
  0: 34, // фовеа (не тестируется)
  3: 32, // парафовеа
  5: 31,
  7: 30,
  9: 29,
  10: 29,
  12: 28,
  15: 27,
  18: 26,
  21: 25,
  24: 24,
  27: 23,
  30: 22,
};

/** Базовый возраст для расчёта поправки */
const AGE_BASELINE = 30;

/** Коррекция чувствительности: ~0.7 dB снижения за каждые 10 лет после 20 */
const AGE_CORRECTION_PER_DECADE = 0.7;

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

/**
 * Вычисляет общее отклонение (измеренное - нормальное)
 */
export function getTotalDeviation(measured: number, eccentricity: number, age?: number): number {
  const normal = getAgeNormalSensitivity(eccentricity, age);
  return measured - normal;
}

/**
 * Вычисляет паттерн-отклонения
 * Паттерн-отклонение = общее отклонение минус 85-й процентиль общих отклонений
 * Это помогает выявить локализованные дефекты vs общее снижение
 */
export function calculatePatternDeviations(
  results: { threshold: number; eccentricity: number }[],
  age?: number
): number[] {
  // Вычисляем общие отклонения
  const totalDeviations = results.map(r => getTotalDeviation(r.threshold, r.eccentricity, age));

  // Находим 7-е наибольшее значение (примерно 85-й процентиль для 54 точек)
  const sortedTD = [...totalDeviations].sort((a, b) => b - a);
  const percentileIndex = Math.floor(sortedTD.length * 0.15);
  const generalHeight = sortedTD[percentileIndex] || 0;

  // Паттерн-отклонение = общее отклонение - общая высота
  return totalDeviations.map(td => td - generalHeight);
}

/**
 * Возвращает вес точки для расчёта VFI в зависимости от эксцентриситета
 * Центральные точки имеют больший вес
 */
export function getVFIWeight(eccentricity: number): number {
  if (eccentricity <= 5) return 1.0;
  if (eccentricity <= 10) return 0.8;
  if (eccentricity <= 15) return 0.6;
  if (eccentricity <= 20) return 0.4;
  if (eccentricity <= 25) return 0.3;
  return 0.2;
}

/**
 * Возвращает уровень вероятности для классификации дефекта
 */
export function getDefectProbability(deviation: number): string {
  if (deviation >= -1) return 'normal';
  if (deviation >= -5) return 'p<5%';
  if (deviation >= -10) return 'p<2%';
  if (deviation >= -15) return 'p<1%';
  return 'p<0.5%';
}

/**
 * Возвращает цвет для отображения отклонения
 */
export function getDeviationColor(deviation: number): string {
  if (deviation >= -1) return '#4ade80'; // зелёный - норма
  if (deviation >= -5) return '#a3e635'; // салатовый - незначительное
  if (deviation >= -10) return '#facc15'; // жёлтый - лёгкое
  if (deviation >= -15) return '#fb923c'; // оранжевый - умеренное
  if (deviation >= -20) return '#f87171'; // красный - выраженное
  return '#991b1b'; // тёмно-красный - тяжёлое
}

/**
 * Возвращает цвет для отображения порога чувствительности
 */
export function getThresholdColor(threshold: number): string {
  if (threshold >= 30) return '#22c55e'; // зелёный - отлично
  if (threshold >= 25) return '#84cc16'; // салатовый - хорошо
  if (threshold >= 20) return '#eab308'; // жёлтый - удовлетворительно
  if (threshold >= 15) return '#f97316'; // оранжевый - снижено
  if (threshold >= 10) return '#ef4444'; // красный - низко
  if (threshold >= 5) return '#dc2626'; // тёмно-красный - очень низко
  return '#7f1d1d'; // бордовый - тяжёлая потеря
}
