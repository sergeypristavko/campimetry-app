/**
 * Вспомогательные функции для работы с точками сетки
 */

/**
 * Генерирует уникальный ID для точки
 * @param x - X-координата в градусах
 * @param y - Y-координата в градусах
 * @returns Строковый ID вида "x:y"
 */
export function pointId(x: number, y: number): string {
  return `${x}:${y}`;
}

/**
 * Вычисляет эксцентриситет точки (расстояние от центра в градусах)
 * @param x - X-координата в градусах
 * @param y - Y-координата в градусах
 * @returns Расстояние от центра
 */
export function eccentricity(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

/**
 * Проверяет, находится ли точка в области слепого пятна
 * Слепое пятно расположено примерно в 15° темпорально и 1.5° ниже горизонтали
 * @param x - X-координата в градусах
 * @param y - Y-координата в градусах
 * @param isRightEye - true для правого глаза (OD)
 * @returns true если точка находится в области слепого пятна
 */
export function isBlindSpotRegion(x: number, y: number, isRightEye: boolean): boolean {
  // Для правого глаза (OD): слепое пятно справа (+x)
  // Для левого глаза (OS): слепое пятно слева (-x)
  const blindSpotX = isRightEye ? 15 : -15;
  const blindSpotY = -1.5;
  const distance = Math.sqrt(Math.pow(x - blindSpotX, 2) + Math.pow(y - blindSpotY, 2));
  return distance < 5; // Радиус слепого пятна примерно 5 градусов
}
