/**
 * Константы темы приложения
 * Цветовая палитра синхронизирована с tailwind.config.js
 */

export const colors = {
  primary: '#e94560',
  secondary: '#0f3460',
  background: '#1a1a2e',
  surface: '#16213e',
  success: '#4ade80',
  warning: '#facc15',
  danger: '#f87171',
  dangerDark: '#dc2626',
  white: '#ffffff',
  text: {
    primary: '#eeeeee',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.5)',
  },
} as const;

/**
 * Пороговые значения для цветовой индикации статистик
 */
export const statisticThresholds = {
  MD: {
    good: -2,
    moderate: -6,
  },
  PSD: {
    good: 2,
    moderate: 4,
  },
  VFI: {
    good: 95,
    moderate: 80,
  },
} as const;

/**
 * Цвета для шкалы чувствительности (порог в dB)
 */
export const thresholdColorScale = [
  { min: 30, color: '#22c55e' },
  { min: 25, color: '#84cc16' },
  { min: 20, color: '#eab308' },
  { min: 15, color: '#f97316' },
  { min: 10, color: '#ef4444' },
  { min: 0, color: '#7f1d1d' },
] as const;

/**
 * Цвета для шкалы отклонений (deviation в dB)
 */
export const deviationColorScale = [
  { min: -2, color: '#4ade80' },
  { min: -5, color: '#a3e635' },
  { min: -10, color: '#facc15' },
  { min: -15, color: '#fb923c' },
  { min: -20, color: '#f87171' },
  { min: -Infinity, color: '#991b1b' },
] as const;
