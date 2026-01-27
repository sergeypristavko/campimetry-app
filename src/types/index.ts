/**
 * Типы данных приложения кампиметрии
 */

/** Тестируемый глаз */
export type Eye = 'OD' | 'OS';

/** Паттерн сетки тестовых точек */
export type GridPattern = '24-2' | '10-2' | '30-2';

/** Стратегия тестирования */
export type TestStrategy = 'suprathreshold' | 'threshold';

/** Точка тестирования в сетке */
export interface TestPoint {
  id: string;
  x: number; // градусы от центра
  y: number; // градусы от центра
  eccentricity: number; // расстояние от центра в градусах
  isBlindSpot?: boolean; // находится в области слепого пятна
}

/** Результат одиночного предъявления стимула */
export interface StimulusResult {
  pointId: string;
  intensity: number; // dB
  seen: boolean;
  reactionTime?: number; // мс
  timestamp: number;
}

/** Результат измерения порога для точки */
export interface ThresholdResult {
  pointId: string;
  threshold: number; // dB (0-40)
  deviation: number; // отклонение от возрастной нормы
  totalDeviation: number;
  patternDeviation: number;
  presentations: number; // количество предъявлений
}

/** Показатели надёжности теста */
export interface ReliabilityIndices {
  fixationLosses: number; // потери фиксации
  fixationLossesTotal: number;
  falsePositives: number; // ложноположительные
  falsePositivesTotal: number;
  falseNegatives: number; // ложноотрицательные
  falseNegativesTotal: number;
}

/** Статистические показатели теста */
export interface TestStatistics {
  MD: number; // Mean Deviation (среднее отклонение)
  PSD: number; // Pattern Standard Deviation (паттерн-стандартное отклонение)
  VFI: number; // Visual Field Index (индекс поля зрения, 0-100%)
  GHT?: 'within normal' | 'borderline' | 'outside normal' | 'general reduction' | 'abnormally high';
}

/** Полная запись сессии тестирования */
export interface TestSession {
  id: string;
  date: string; // ISO формат
  eye: Eye;
  pattern: GridPattern;
  strategy: TestStrategy;
  duration: number; // мс
  results: ThresholdResult[];
  reliability: ReliabilityIndices;
  statistics: TestStatistics;
  patientAge?: number;
  notes?: string;
}

/** Данные калибровки экрана */
export interface Calibration {
  pixelsPerDegree: number; // пикселей на градус
  screenDistance: number; // см
  dpi: number; // точек на дюйм
  timestamp: number;
}

/** Настройки приложения */
export interface AppSettings {
  stimulusSizeGoldmann: 'I' | 'II' | 'III' | 'IV' | 'V'; // размер по Гольдману
  stimulusColor: string; // цвет стимула
  backgroundColor: string; // цвет фона
  stimulusDuration: number; // длительность в мс
  responseTimeout: number; // таймаут ответа в мс
  soundEnabled: boolean; // звуковое сопровождение
}

/** Типы экранов навигации */
export type Screen =
  | 'home'
  | 'calibration'
  | 'settings'
  | 'instruction'
  | 'test'
  | 'results'
  | 'history';

/** Состояние алгоритма staircase */
export interface StaircaseState {
  pointId: string;
  currentIntensity: number; // текущая интенсивность в dB
  step: number; // текущий шаг в dB
  reversals: number; // количество реверсий
  lastDirection: 'up' | 'down' | null; // последнее направление
  responses: { intensity: number; seen: boolean }[]; // история ответов
  threshold: number | null; // вычисленный порог
  isComplete: boolean; // алгоритм завершён
}

/** Размеры стимулов по Гольдману в градусах */
export const GoldmannSizes: Record<AppSettings['stimulusSizeGoldmann'], number> = {
  I: 0.108,
  II: 0.217,
  III: 0.431,
  IV: 0.862,
  V: 1.724,
};

/** Нормативное значение чувствительности по эксцентриситету (упрощённо) */
export interface NormalValue {
  eccentricity: number;
  sensitivity: number; // dB
}
