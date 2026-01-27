/**
 * Утилиты для определения UI-зон экрана
 * Используется для фильтрации точек теста, которые перекрываются с элементами интерфейса
 */

/**
 * Прямоугольная зона на экране
 */
export interface UIZone {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Создаёт список UI-зон, с которыми не должен пересекаться стимул
 *
 * @param screenWidth - Ширина экрана в пикселях
 * @param screenHeight - Высота экрана в пикселях
 * @param stimulusSize - Размер стимула в пикселях
 * @returns Массив UI-зон
 */
export function createUIZones(
  screenWidth: number,
  screenHeight: number,
  stimulusSize: number
): UIZone[] {
  const halfWidth = screenWidth / 2;
  const padding = stimulusSize + 20;

  return [
    // Верхний левый угол: "ESC - пауза" (~100x30px)
    {
      left: 0,
      top: 0,
      right: 120 + padding,
      bottom: 50 + padding,
    },
    // Верхний правый угол: "OD (правый) - X/Y" (~180x40px)
    {
      left: screenWidth - 200 - padding,
      top: 0,
      right: screenWidth,
      bottom: 50 + padding,
    },
    // Полоса прогресса вверху
    {
      left: 0,
      top: 0,
      right: screenWidth,
      bottom: 6 + padding,
    },
    // Нижняя инструкция по центру
    {
      left: halfWidth - 300,
      top: screenHeight - 60 - padding,
      right: halfWidth + 300,
      bottom: screenHeight,
    },
  ];
}

/**
 * Проверяет, находится ли точка внутри заданной зоны
 */
function isPointInZone(
  x: number,
  y: number,
  zone: UIZone
): boolean {
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

  const zones = createUIZones(screenWidth, screenHeight, stimulusSize);

  return zones.some(zone => isPointInZone(screenX, screenY, zone));
}
