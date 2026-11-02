/**
 * Draws sensitivity map on PDF
 */

import { jsPDF } from 'jspdf';
import { TestSession } from '../../types';
import { getPattern } from '../grid';
import { getThresholdColorRGB, getDeviationColorRGB } from '../colors';
import { MAP, GRID_COLOR, BACKGROUND_COLOR, FONT_SIZE } from './constants';

/**
 * Draws a sensitivity map (threshold or deviation)
 */
export function drawSensitivityMap(
  doc: jsPDF,
  session: TestSession,
  x: number,
  y: number,
  size: number,
  showThresholds: boolean
): void {
  const pattern = getPattern(session.pattern);
  const resultsMap = new Map(session.results.map(r => [r.pointId, r]));

  // Determine pattern boundaries
  let maxCoord = 24;
  if (session.pattern === '10-2') maxCoord = 10;
  if (session.pattern === '30-2') maxCoord = 30;

  const scale = size / (maxCoord * 2 + 10);
  const centerX = x + size / 2;
  const centerY = y + size / 2;

  // Draw background
  doc.setFillColor(...BACKGROUND_COLOR.MAP);
  doc.rect(x, y, size, size, 'F');

  // Draw grid lines
  doc.setDrawColor(...GRID_COLOR.LINES);
  doc.setLineWidth(MAP.GRID_LINE_WIDTH);
  for (let i = -maxCoord; i <= maxCoord; i += 6) {
    const px = centerX + i * scale;
    const py = centerY - i * scale;
    doc.line(px, y, px, y + size);
    doc.line(x, py, x + size, py);
  }

  // Draw axes
  doc.setDrawColor(...GRID_COLOR.AXES);
  doc.setLineWidth(MAP.AXIS_LINE_WIDTH);
  doc.line(centerX, y, centerX, y + size);
  doc.line(x, centerY, x + size, centerY);

  // Draw fixation point
  doc.setFillColor(...GRID_COLOR.FIXATION);
  doc.circle(centerX, centerY, MAP.FIXATION_RADIUS, 'F');

  // Draw test points
  pattern.forEach(point => {
    const result = resultsMap.get(point.id);
    if (!result) return;

    const px = centerX + point.x * scale;
    const py = centerY - point.y * scale;

    const value = showThresholds ? result.threshold : result.totalDeviation;
    const color = showThresholds ? getThresholdColorRGB(value) : getDeviationColorRGB(value);

    doc.setFillColor(color[0], color[1], color[2]);
    doc.circle(px, py, MAP.POINT_RADIUS, 'F');

    // Draw value text
    doc.setFontSize(FONT_SIZE.MAP_VALUE);
    doc.setTextColor(...GRID_COLOR.FIXATION);
    const text = Math.round(value).toString();
    doc.text(text, px, py + 1.5, { align: 'center' });
  });

  // Draw blind spot marker for tested eye
  const blindSpotX = session.eye === 'OD' ? 15 : -15;
  const bsX = centerX + blindSpotX * scale;
  const bsY = centerY + 1.5 * scale;
  doc.setDrawColor(...GRID_COLOR.BLIND_SPOT);
  doc.setLineWidth(MAP.BLIND_SPOT_LINE_WIDTH);
  doc.circle(bsX, bsY, MAP.BLIND_SPOT_RADIUS, 'S');
}
