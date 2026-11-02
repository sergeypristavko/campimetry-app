/**
 * Draws color scale legend
 */

import { jsPDF } from 'jspdf';
import {
  FONT_SIZE,
  LEGEND,
  THRESHOLD_SCALE_ITEMS,
  DEVIATION_SCALE_ITEMS,
} from './constants';

/**
 * Draws the color scale legend
 */
export function drawLegend(
  doc: jsPDF,
  x: number,
  y: number,
  showThresholds: boolean
): void {
  doc.setFontSize(FONT_SIZE.SMALL);
  doc.setTextColor(0, 0, 0);
  doc.text('dB', x, y);

  const items = showThresholds ? THRESHOLD_SCALE_ITEMS : DEVIATION_SCALE_ITEMS;

  items.forEach((item, i) => {
    const itemY = y + LEGEND.ITEM_OFFSET + i * LEGEND.ITEM_HEIGHT;
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.rect(x, itemY, LEGEND.SQUARE_SIZE, LEGEND.SQUARE_SIZE, 'F');
    doc.setFontSize(FONT_SIZE.TINY);
    doc.text(item.value, x + LEGEND.TEXT_OFFSET, itemY + 3);
  });
}
