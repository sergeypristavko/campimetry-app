/**
 * Утилиты для расчёта параметров стимула
 */

import { TestPoint, GoldmannSizes, AppSettings } from '../types';

/**
 * Вычисляет размер стимула в пикселях
 *
 * @param goldmannSize - Размер по Гольдману (I-V)
 * @param pixelsPerDegree - Количество пикселей на градус
 * @returns Размер стимула в пикселях (минимум 4px)
 */
export function calculateStimulusSizePx(
  goldmannSize: AppSettings['stimulusSizeGoldmann'],
  pixelsPerDegree: number
): number {
  const sizeDegrees = GoldmannSizes[goldmannSize];
  return Math.max(4, Math.round(sizeDegrees * pixelsPerDegree));
}

/**
 * Вычисляет позицию стимула в пикселях относительно центра экрана
 *
 * @param point - Точка теста с координатами в градусах
 * @param pixelsPerDegree - Количество пикселей на градус
 * @returns Координаты в пикселях {x, y} относительно центра экрана
 */
export function calculateStimulusPosition(
  point: TestPoint,
  pixelsPerDegree: number
): { x: number; y: number } {
  return {
    x: point.x * pixelsPerDegree,
    // Инвертируем Y, так как в экранных координатах Y растёт вниз
    y: -point.y * pixelsPerDegree,
  };
}

/**
 * Вычисляет позицию стимула на экране (от левого верхнего угла)
 *
 * @param point - Точка теста с координатами в градусах
 * @param pixelsPerDegree - Количество пикселей на градус
 * @param screenWidth - Ширина экрана в пикселях
 * @param screenHeight - Высота экрана в пикселях
 * @returns Абсолютные координаты на экране
 */
export function calculateScreenPosition(
  point: TestPoint,
  pixelsPerDegree: number,
  screenWidth: number,
  screenHeight: number
): { x: number; y: number } {
  const relativePos = calculateStimulusPosition(point, pixelsPerDegree);
  return {
    x: screenWidth / 2 + relativePos.x,
    y: screenHeight / 2 + relativePos.y,
  };
}
