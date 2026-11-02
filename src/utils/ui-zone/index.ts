/**
 * Утилиты для определения UI-зон экрана
 * Используется для фильтрации точек теста, которые перекрываются с элементами интерфейса
 */

export type { UIZone } from './types';
export { getUIZones } from './getUIZones';
export { isInUIZone } from './isInUIZone';
