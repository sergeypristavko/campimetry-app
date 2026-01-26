import { TestPoint, GridPattern } from '../types';

// Generate unique ID for a point
function pointId(x: number, y: number): string {
  return `${x}:${y}`;
}

// Calculate eccentricity from center
function eccentricity(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

// Check if point is in the blind spot region (approximately 15° temporal, 1.5° below horizontal)
function isBlindSpotRegion(x: number, y: number, isRightEye: boolean): boolean {
  // Blind spot is at approximately 15° temporal from fixation
  // For right eye (OD): blind spot is to the right (+x)
  // For left eye (OS): blind spot is to the left (-x)
  const blindSpotX = isRightEye ? 15 : -15;
  const blindSpotY = -1.5;
  const distance = Math.sqrt(Math.pow(x - blindSpotX, 2) + Math.pow(y - blindSpotY, 2));
  return distance < 5; // Blind spot radius approximately 5 degrees
}

// 24-2 pattern: 54 points, 6° intervals, ±24° from center
export function generate24_2Pattern(): TestPoint[] {
  const points: TestPoint[] = [];
  const step = 6;

  for (let x = -24; x <= 24; x += step) {
    for (let y = -24; y <= 24; y += step) {
      const ecc = eccentricity(x, y);

      // Skip center point and points outside the main field
      if (ecc === 0 || ecc > 27) continue;

      // Skip points in the extreme corners
      if (Math.abs(x) === 24 && Math.abs(y) === 24) continue;

      if (x === 0 || y === 0) {
        // On axes, use offset pattern
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

  // Remove duplicates based on ID
  const uniquePoints = Array.from(new Map(points.map(p => [p.id, p])).values());

  return uniquePoints;
}

// 10-2 pattern: 68 points, 2° intervals, ±10° from center (macular)
export function generate10_2Pattern(): TestPoint[] {
  const points: TestPoint[] = [];
  const step = 2;

  for (let x = -10; x <= 10; x += step) {
    for (let y = -10; y <= 10; y += step) {
      const ecc = eccentricity(x, y);

      // Skip center point
      if (ecc === 0) continue;

      // Skip points outside 10 degrees
      if (ecc > 11) continue;

      // Add offset for points on axes
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

  // Remove duplicates
  const uniquePoints = Array.from(new Map(points.map(p => [p.id, p])).values());

  return uniquePoints;
}

// 30-2 pattern: 76 points, 6° intervals, ±30° from center
export function generate30_2Pattern(): TestPoint[] {
  const points: TestPoint[] = [];
  const step = 6;

  for (let x = -30; x <= 30; x += step) {
    for (let y = -30; y <= 30; y += step) {
      const ecc = eccentricity(x, y);

      // Skip center point and points too far out
      if (ecc === 0 || ecc > 33) continue;

      // Add offset for points on axes
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

  // Remove duplicates
  const uniquePoints = Array.from(new Map(points.map(p => [p.id, p])).values());

  return uniquePoints;
}

// Get pattern by name
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

// Mark blind spot points for a given eye
export function markBlindSpotPoints(points: TestPoint[], eye: 'OD' | 'OS'): TestPoint[] {
  const isRightEye = eye === 'OD';
  return points.map(point => ({
    ...point,
    isBlindSpot: isBlindSpotRegion(point.x, point.y, isRightEye),
  }));
}

// Shuffle points for random presentation order
export function shufflePoints(points: TestPoint[]): TestPoint[] {
  const shuffled = [...points];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get pattern info
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
