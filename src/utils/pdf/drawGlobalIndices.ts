/**
 * Draws global indices section (MD, PSD, VFI, GHT)
 */

import { jsPDF } from 'jspdf';
import { TestSession } from '../../types';
import { interpretMD, interpretPSD, interpretVFI } from '../statistics';
import {
  FONT_SIZE,
  TEXT_COLOR,
  SPACING,
  LINE_WIDTH,
  PAGE_MARGIN,
  STAT_COLORS,
} from './constants';

/**
 * Draws the global indices section
 */
export function drawGlobalIndices(
  doc: jsPDF,
  session: TestSession,
  pageWidth: number,
  startY: number
): number {
  let y = startY;

  // Section header
  doc.setFontSize(FONT_SIZE.SECTION_HEADER);
  doc.setTextColor(...TEXT_COLOR.PRIMARY);
  doc.text('Global Indices', PAGE_MARGIN, y);
  y += 2;
  doc.setLineWidth(LINE_WIDTH.SECTION_DIVIDER);
  doc.line(PAGE_MARGIN, y, pageWidth - PAGE_MARGIN, y);
  y += SPACING.AFTER_SECTION_HEADER;

  const { statistics } = session;
  const col1 = PAGE_MARGIN;

  // MD
  doc.setFontSize(FONT_SIZE.BODY);
  const mdColor =
    statistics.MD >= -2
      ? STAT_COLORS.MD.GOOD
      : statistics.MD >= -6
        ? STAT_COLORS.MD.MODERATE
        : STAT_COLORS.MD.POOR;
  doc.setTextColor(...TEXT_COLOR.PRIMARY);
  doc.text('MD (Mean Deviation):', col1, y);
  doc.setTextColor(...mdColor);
  doc.text(`${statistics.MD > 0 ? '+' : ''}${statistics.MD.toFixed(2)} dB`, col1 + 50, y);
  doc.setTextColor(...TEXT_COLOR.SECONDARY);
  doc.setFontSize(FONT_SIZE.SMALL);
  doc.text(interpretMD(statistics.MD), col1 + 75, y);
  y += SPACING.LINE_HEIGHT;

  // PSD
  doc.setFontSize(FONT_SIZE.BODY);
  const psdColor =
    statistics.PSD <= 2
      ? STAT_COLORS.PSD.GOOD
      : statistics.PSD <= 4
        ? STAT_COLORS.PSD.MODERATE
        : STAT_COLORS.PSD.POOR;
  doc.setTextColor(...TEXT_COLOR.PRIMARY);
  doc.text('PSD (Pattern Std Dev):', col1, y);
  doc.setTextColor(...psdColor);
  doc.text(`${statistics.PSD.toFixed(2)} dB`, col1 + 50, y);
  doc.setTextColor(...TEXT_COLOR.SECONDARY);
  doc.setFontSize(FONT_SIZE.SMALL);
  doc.text(interpretPSD(statistics.PSD), col1 + 75, y);
  y += SPACING.LINE_HEIGHT;

  // VFI
  doc.setFontSize(FONT_SIZE.BODY);
  const vfiColor =
    statistics.VFI >= 95
      ? STAT_COLORS.VFI.GOOD
      : statistics.VFI >= 80
        ? STAT_COLORS.VFI.MODERATE
        : STAT_COLORS.VFI.POOR;
  doc.setTextColor(...TEXT_COLOR.PRIMARY);
  doc.text('VFI (Visual Field Index):', col1, y);
  doc.setTextColor(...vfiColor);
  doc.text(`${statistics.VFI}%`, col1 + 50, y);
  doc.setTextColor(...TEXT_COLOR.SECONDARY);
  doc.setFontSize(FONT_SIZE.SMALL);
  doc.text(interpretVFI(statistics.VFI), col1 + 75, y);
  y += SPACING.LINE_HEIGHT;

  // GHT
  if (statistics.GHT) {
    doc.setFontSize(FONT_SIZE.BODY);
    doc.setTextColor(...TEXT_COLOR.PRIMARY);
    doc.text('GHT:', col1, y);
    const ghtText = {
      'within normal': 'Within Normal Limits',
      borderline: 'Borderline',
      'outside normal': 'Outside Normal Limits',
      'general reduction': 'General Reduction of Sensitivity',
      'abnormally high': 'Abnormally High Sensitivity',
    }[statistics.GHT];
    doc.text(ghtText || statistics.GHT, col1 + 50, y);
  }
  y += SPACING.SECTION_MARGIN;

  return y;
}
