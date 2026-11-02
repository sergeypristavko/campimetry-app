/**
 * Draws test information section
 */

import { jsPDF } from 'jspdf';
import { TestSession } from '../../types';
import { FONT_SIZE, TEXT_COLOR, SPACING, LINE_WIDTH, PAGE_MARGIN } from './constants';

/**
 * Draws the test information section
 */
export function drawTestInfo(
  doc: jsPDF,
  session: TestSession,
  pageWidth: number,
  startY: number
): number {
  let y = startY;

  // Section header
  doc.setFontSize(FONT_SIZE.SECTION_HEADER);
  doc.setTextColor(...TEXT_COLOR.PRIMARY);
  doc.text('Test Information', PAGE_MARGIN, y);
  y += 2;
  doc.setLineWidth(LINE_WIDTH.SECTION_DIVIDER);
  doc.line(PAGE_MARGIN, y, pageWidth - PAGE_MARGIN, y);
  y += SPACING.AFTER_SECTION_HEADER;

  // Format date and time
  const testDate = new Date(session.date);
  const dateStr = testDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = testDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Format duration
  const duration = Math.round(session.duration / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  // Column positions
  const col1 = PAGE_MARGIN;
  const col2 = pageWidth / 2;

  doc.setFontSize(FONT_SIZE.BODY);

  // Row 1
  doc.text(`Eye: ${session.eye} (${session.eye === 'OD' ? 'Right' : 'Left'})`, col1, y);
  doc.text(`Date: ${dateStr}`, col2, y);
  y += SPACING.LINE_HEIGHT;

  // Row 2
  doc.text(`Pattern: ${session.pattern}`, col1, y);
  doc.text(`Time: ${timeStr}`, col2, y);
  y += SPACING.LINE_HEIGHT;

  // Row 3
  doc.text(`Strategy: ${session.strategy}`, col1, y);
  doc.text(`Duration: ${minutes}:${seconds.toString().padStart(2, '0')}`, col2, y);
  y += SPACING.LINE_HEIGHT;

  // Row 4
  doc.text(`Points tested: ${session.results.length}`, col1, y);
  if (session.patientAge) {
    doc.text(`Patient age: ${session.patientAge}`, col2, y);
  }
  y += SPACING.SECTION_MARGIN;

  return y;
}
