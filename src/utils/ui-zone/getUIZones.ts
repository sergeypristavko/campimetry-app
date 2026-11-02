/**
 * Создаёт список UI-зон, с которыми не должен пересекаться стимул
 */

import { UIZone } from './types';

/**
 * Создаёт список UI-зон, с которыми не должен пересекаться стимул
 *
 * @param screenWidth - Ширина экрана в пикселях
 * @param screenHeight - Высота экрана в пикселях
 * @param stimulusSize - Размер стимула в пикселях
 * @returns Массив UI-зон
 */
export function getUIZones(
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
