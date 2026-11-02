/**
 * Проверяет, пересекается ли позиция стимула с UI-элементами
 */

import { UIZone } from './types';
import { getUIZones } from './getUIZones';

/**
 * Проверяет, находится ли точка внутри заданной зоны
 */
function isPointInZone(x: number, y: number, zone: UIZone): boolean {
  return x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom;
}

/**
 * Проверяет, пересекается ли позиция стимула с UI-элементами
 * Возвращает true, если точку следует пропустить
 *
 * @param stimulusX - X-координата стимула относительно центра экрана (пиксели)
 * @param stimulusY - Y-координата стимула относительно центра экрана (пиксели)
 * @param stimulusSize - Размер стимула в пикселях
 * @param screenWidth - Ширина экрана в пикселях
 * @param screenHeight - Высота экрана в пикселях
 * @returns true, если стимул пересекается с UI-зоной
 */
export function isInUIZone(
  stimulusX: number,
  stimulusY: number,
  stimulusSize: number,
  screenWidth: number = window.innerWidth,
  screenHeight: number = window.innerHeight
): boolean {
  const halfWidth = screenWidth / 2;
  const halfHeight = screenHeight / 2;

  // Преобразуем координаты стимула в экранные (от левого верхнего угла)
  const screenX = halfWidth + stimulusX;
  const screenY = halfHeight + stimulusY;

  const zones = getUIZones(screenWidth, screenHeight, stimulusSize);

  return zones.some((zone) => isPointInZone(screenX, screenY, zone));
}
