/**
 * Draws PDF document header
 */

import { jsPDF } from 'jspdf';
import { FONT_SIZE, TEXT_COLOR, SPACING } from './constants';

/**
 * Draws the document header with title and subtitle
 */
export function drawHeader(doc: jsPDF, pageWidth: number): number {
  let y = SPACING.SECTION_MARGIN + 3; // Start slightly lower

  // Title
  doc.setFontSize(FONT_SIZE.TITLE);
  doc.setTextColor(...TEXT_COLOR.PRIMARY);
  doc.text('Campimetry Test Results', pageWidth / 2, y, { align: 'center' });
  y += SPACING.AFTER_TITLE;

  // Subtitle
  doc.setFontSize(FONT_SIZE.SUBTITLE);
  doc.setTextColor(...TEXT_COLOR.SECONDARY);
  doc.text('Visual Field Examination Report', pageWidth / 2, y, { align: 'center' });
  y += SPACING.AFTER_SUBTITLE;

  return y;
}
