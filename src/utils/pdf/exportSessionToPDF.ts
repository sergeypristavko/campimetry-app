/**
 * Main PDF export orchestrator
 */

import { jsPDF } from 'jspdf';
import { TestSession } from '../../types';
import { drawHeader } from './drawHeader';
import { drawTestInfo } from './drawTestInfo';
import { drawGlobalIndices } from './drawGlobalIndices';
import { drawReliability } from './drawReliability';
import { drawVisualFieldMaps } from './drawVisualFieldMaps';
import { FONT_SIZE, TEXT_COLOR, SPACING } from './constants';

/**
 * Exports test session to PDF file
 */
export function exportSessionToPDF(session: TestSession): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 0;

  // Draw header
  currentY = drawHeader(doc, pageWidth);

  // Draw test information
  currentY = drawTestInfo(doc, session, pageWidth, currentY);

  // Draw global indices
  currentY = drawGlobalIndices(doc, session, pageWidth, currentY);

  // Draw reliability indices
  currentY = drawReliability(doc, session, pageWidth, currentY);

  // Draw visual field maps
  currentY = drawVisualFieldMaps(doc, session, pageWidth, currentY);

  // Draw footer
  doc.setFontSize(FONT_SIZE.SMALL);
  doc.setTextColor(...TEXT_COLOR.MUTED);
  doc.text(
    'This report is for screening purposes only. Consult an ophthalmologist for diagnosis.',
    pageWidth / 2,
    pageHeight - SPACING.FOOTER_OFFSET,
    { align: 'center' }
  );

  // Save file
  const filename = `campimetry_${session.eye}_${session.date.split('T')[0]}.pdf`;
  doc.save(filename);
}
