/**
 * Генерация паттернов сетки тестовых точек
 * Поддерживаемые паттерны: 24-2, 10-2, 30-2
 */

import { TestPoint, GridPattern } from '../types';

/**
 * Генерирует уникальный ID для точки
 */
function pointId(x: number, y: number): string {
  return `${x}:${y}`;
}

/**
 * Вычисляет эксцентриситет точки (расстояние от центра в градусах)
 */
function eccentricity(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

/**
 * Проверяет, находится ли точка в области слепого пятна
 * Слепое пятно расположено примерно в 15° темпорально и 1.5° ниже горизонтали
 * @param x - X-координата в градусах
 * @param y - Y-координата в градусах
 * @param isRightEye - true для правого глаза (OD)
 */
function isBlindSpotRegion(x: number, y: number, isRightEye: boolean): boolean {
  // Для правого глаза (OD): слепое пятно справа (+x)
  // Для левого глаза (OS): слепое пятно слева (-x)
  const blindSpotX = isRightEye ? 15 : -15;
  const blindSpotY = -1.5;
  const distance = Math.sqrt(Math.pow(x - blindSpotX, 2) + Math.pow(y - blindSpotY, 2));
  return distance < 5; // Радиус слепого пятна примерно 5 градусов
}

/**
 * Паттерн 24-2: 54 точки с шагом 6°, охват ±24° от центра
 * Стандартный тест для диагностики глаукомы
 */
export function generate24_2Pattern(): TestPoint[] {
  const points: TestPoint[] = [];
  const step = 6;

  for (let x = -24; x <= 24; x += step) {
    for (let y = -24; y <= 24; y += step) {
      const ecc = eccentricity(x, y);

      // Пропускаем центральную точку и точки вне основного поля
      if (ecc === 0 || ecc > 27) continue;

      // Пропускаем точки в крайних углах
      if (Math.abs(x) === 24 && Math.abs(y) === 24) continue;

      if (x === 0 || y === 0) {
        // На осях используем смещённый паттерн
        if (x === 0 && y !== 0) {
          points.push({
            id: pointId(3, y),
            x: 3,
            y,
            eccentricity: eccentricity(3, y),
          });
          points.push({
            id: pointId(-3, y),
            x: -3,
            y,
            eccentricity: eccentricity(-3, y),
          });
        } else if (y === 0 && x !== 0) {
          points.push({
            id: pointId(x, 3),
            x,
            y: 3,
            eccentricity: eccentricity(x, 3),
          });
          points.push({
            id: pointId(x, -3),
            x,
            y: -3,
            eccentricity: eccentricity(x, -3),
          });
        }
      } else {
        points.push({
          id: pointId(x, y),
          x,
          y,
          eccentricity: ecc,
        });
      }
    }
  }

  // Удаляем дубликаты по ID
  const uniquePoints = Array.from(new Map(points.map(p => [p.id, p])).values());

  return uniquePoints;
}

/**
 * Паттерн 10-2: 68 точек с шагом 2°, охват ±10° от центра
 * Тест макулярной области для детального исследования центрального зрения
 */
export function generate10_2Pattern(): TestPoint[] {
  const points: TestPoint[] = [];
  const step = 2;

  for (let x = -10; x <= 10; x += step) {
    for (let y = -10; y <= 10; y += step) {
      const ecc = eccentricity(x, y);

      // Пропускаем центральную точку
      if (ecc === 0) continue;

      // Пропускаем точки за пределами 10°
      if (ecc > 11) continue;

      // Добавляем смещение для точек на осях
      if (x === 0 && y !== 0) {
        points.push({
          id: pointId(1, y),
          x: 1,
          y,
          eccentricity: eccentricity(1, y),
        });
        points.push({
          id: pointId(-1, y),
          x: -1,
          y,
          eccentricity: eccentricity(-1, y),
        });
      } else if (y === 0 && x !== 0) {
        points.push({
          id: pointId(x, 1),
          x,
          y: 1,
          eccentricity: eccentricity(x, 1),
        });
        points.push({
          id: pointId(x, -1),
          x,
          y: -1,
          eccentricity: eccentricity(x, -1),
        });
      } else {
        points.push({
          id: pointId(x, y),
          x,
          y,
          eccentricity: ecc,
        });
      }
    }
  }

  // Удаляем дубликаты
  const uniquePoints = Array.from(new Map(points.map(p => [p.id, p])).values());

  return uniquePoints;
}

/**
 * Паттерн 30-2: 76 точек с шагом 6°, охват ±30° от центра
 * Расширенный тест для исследования периферического поля зрения
 */
export function generate30_2Pattern(): TestPoint[] {
  const points: TestPoint[] = [];
  const step = 6;

  for (let x = -30; x <= 30; x += step) {
    for (let y = -30; y <= 30; y += step) {
      const ecc = eccentricity(x, y);

      // Пропускаем центральную точку и слишком далёкие точки
      if (ecc === 0 || ecc > 33) continue;

      // Добавляем смещение для точек на осях
      if (x === 0 && y !== 0) {
        points.push({
          id: pointId(3, y),
          x: 3,
          y,
          eccentricity: eccentricity(3, y),
        });
        points.push({
          id: pointId(-3, y),
          x: -3,
          y,
          eccentricity: eccentricity(-3, y),
        });
      } else if (y === 0 && x !== 0) {
        points.push({
          id: pointId(x, 3),
          x,
          y: 3,
          eccentricity: eccentricity(x, 3),
        });
        points.push({
          id: pointId(x, -3),
          x,
          y: -3,
          eccentricity: eccentricity(x, -3),
        });
      } else {
        points.push({
          id: pointId(x, y),
          x,
          y,
          eccentricity: ecc,
        });
      }
    }
  }

  // Удаляем дубликаты
  const uniquePoints = Array.from(new Map(points.map(p => [p.id, p])).values());

  return uniquePoints;
}

/**
 * Возвращает паттерн по имени
 */
export function getPattern(pattern: GridPattern): TestPoint[] {
  switch (pattern) {
    case '24-2':
      return generate24_2Pattern();
    case '10-2':
      return generate10_2Pattern();
    case '30-2':
      return generate30_2Pattern();
    default:
      return generate24_2Pattern();
  }
}

/**
 * Отмечает точки, попадающие в область слепого пятна
 */
export function markBlindSpotPoints(points: TestPoint[], eye: 'OD' | 'OS'): TestPoint[] {
  const isRightEye = eye === 'OD';
  return points.map(point => ({
    ...point,
    isBlindSpot: isBlindSpotRegion(point.x, point.y, isRightEye),
  }));
}

/**
 * Перемешивает точки для случайного порядка предъявления
 * Использует алгоритм Фишера-Йетса
 */
export function shufflePoints(points: TestPoint[]): TestPoint[] {
  const shuffled = [...points];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Возвращает информацию о паттерне
 */
export function getPatternInfo(pattern: GridPattern): { points: number; description: string } {
  switch (pattern) {
    case '24-2':
      return { points: 54, description: 'Стандартный тест центрального поля (24°)' };
    case '10-2':
      return { points: 68, description: 'Тест макулярной области (10°)' };
    case '30-2':
      return { points: 76, description: 'Расширенный тест поля зрения (30°)' };
    default:
      return { points: 54, description: 'Стандартный тест' };
  }
}
