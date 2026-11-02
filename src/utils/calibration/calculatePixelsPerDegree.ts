/**
 * Вычисляет количество пикселей на один градус угла зрения
 */

import { calculateDPI } from './calculateDPI';

/**
 * Вычисляет количество пикселей на один градус угла зрения
 * Формула: pixelsPerDegree = distance_px × tan(1°)
 * где distance_px = distance_cm × (dpi / 2.54)
 *
 * @param cardWidthPx - Ширина кредитной карты в пикселях (для расчёта DPI)
 * @param screenDistanceCm - Расстояние от глаза до экрана в сантиметрах
 * @returns Количество пикселей на градус угла зрения
 */
export function calculatePixelsPerDegree(
  cardWidthPx: number,
  screenDistanceCm: number
): number {
  const dpi = calculateDPI(cardWidthPx);
  const distanceInPixels = screenDistanceCm * (dpi / 2.54);
  return distanceInPixels * Math.tan(Math.PI / 180);
}
