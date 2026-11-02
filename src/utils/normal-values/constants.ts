/**
 * Константы для расчёта нормативных значений чувствительности
 */

export interface NormalValuesByEccentricity {
  [key: number]: number;
}

/**
 * Базовая нормальная чувствительность по эксцентриситету (для возраста 30 лет)
 * Значения указаны в децибелах (dB)
 */
export const baseSensitivityByEccentricity: NormalValuesByEccentricity = {
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
export const AGE_BASELINE = 30;

/** Коррекция чувствительности: ~0.7 dB снижения за каждые 10 лет после 20 */
export const AGE_CORRECTION_PER_DECADE = 0.7;
