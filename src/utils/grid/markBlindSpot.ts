/**
 * Отмечает точки, попадающие в область слепого пятна
 */

import { TestPoint, Eye } from '../../types';
import { isBlindSpotRegion } from './helpers';

export function markBlindSpotPoints(points: TestPoint[], eye: Eye): TestPoint[] {
  const isRightEye = eye === 'OD';
  return points.map(point => ({
    ...point,
    isBlindSpot: isBlindSpotRegion(point.x, point.y, isRightEye),
  }));
}
