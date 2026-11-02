/**
 * Draws visual field maps section (threshold and deviation)
 */

import { jsPDF } from 'jspdf';
import { TestSession } from '../../types';
import { drawSensitivityMap } from './drawSensitivityMap';
import { drawLegend } from './drawLegend';
import {
  FONT_SIZE,
  TEXT_COLOR,
  SPACING,
  LINE_WIDTH,
  PAGE_MARGIN,
  MAP,
} from './constants';

/**
 * Draws the visual field maps section
 */
export function drawVisualFieldMaps(
  doc: jsPDF,
  session: TestSession,
  pageWidth: number,
  startY: number
): number {
  let y = startY;

  // Section header
  doc.setFontSize(FONT_SIZE.SECTION_HEADER);
  doc.setTextColor(...TEXT_COLOR.PRIMARY);
  doc.text('Visual Field Maps', PAGE_MARGIN, y);
  y += 2;
  doc.setLineWidth(LINE_WIDTH.SECTION_DIVIDER);
  doc.line(PAGE_MARGIN, y, pageWidth - PAGE_MARGIN, y);
  y += SPACING.AFTER_SECTION_HEADER;

  const mapSize = MAP.SIZE;

  // Threshold map (left)
  doc.setFontSize(FONT_SIZE.MAP_LABEL);
  doc.text('Threshold (dB)', PAGE_MARGIN + mapSize / 2, y, { align: 'center' });
  y += 3;
  const thresholdY = y;
  drawSensitivityMap(doc, session, PAGE_MARGIN, y, mapSize, true);
  drawLegend(doc, PAGE_MARGIN + mapSize + MAP.LEGEND_OFFSET, y, true);

  // Deviation map (right)
  const deviationMapX = pageWidth / 2 + 5;
  doc.text('Total Deviation (dB)', deviationMapX + mapSize / 2, thresholdY - 3, {
    align: 'center',
  });
  drawSensitivityMap(doc, session, deviationMapX, thresholdY, mapSize, false);
  drawLegend(doc, deviationMapX + mapSize + MAP.LEGEND_OFFSET, thresholdY, false);

  y += mapSize + SPACING.AFTER_SUBTITLE;

  return y;
}
