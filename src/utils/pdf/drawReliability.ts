/**
 * Draws reliability indices section
 */

import { jsPDF } from 'jspdf';
import { TestSession } from '../../types';
import { formatReliabilityPercent } from '../statistics';
import {
  FONT_SIZE,
  TEXT_COLOR,
  SPACING,
  LINE_WIDTH,
  PAGE_MARGIN,
} from './constants';

/**
 * Draws the reliability indices section
 */
export function drawReliability(
  doc: jsPDF,
  session: TestSession,
  pageWidth: number,
  startY: number
): number {
  let y = startY;

  // Section header
  doc.setFontSize(FONT_SIZE.SECTION_HEADER);
  doc.setTextColor(...TEXT_COLOR.PRIMARY);
  doc.text('Reliability Indices', PAGE_MARGIN, y);
  y += 2;
  doc.setLineWidth(LINE_WIDTH.SECTION_DIVIDER);
  doc.line(PAGE_MARGIN, y, pageWidth - PAGE_MARGIN, y);
  y += SPACING.AFTER_SECTION_HEADER;

  const { reliability } = session;
  const col1 = PAGE_MARGIN;

  doc.setFontSize(FONT_SIZE.BODY);

  // Fixation Losses
  doc.text('Fixation Losses:', col1, y);
  doc.text(
    `${reliability.fixationLosses}/${reliability.fixationLossesTotal} (${formatReliabilityPercent(reliability.fixationLosses, reliability.fixationLossesTotal)})`,
    col1 + 40,
    y
  );
  y += SPACING.LINE_HEIGHT;

  // False Positives
  doc.text('False Positives:', col1, y);
  doc.text(
    `${reliability.falsePositives}/${reliability.falsePositivesTotal} (${formatReliabilityPercent(reliability.falsePositives, reliability.falsePositivesTotal)})`,
    col1 + 40,
    y
  );
  y += SPACING.LINE_HEIGHT;

  // False Negatives
  doc.text('False Negatives:', col1, y);
  doc.text(
    `${reliability.falseNegatives}/${reliability.falseNegativesTotal} (${formatReliabilityPercent(reliability.falseNegatives, reliability.falseNegativesTotal)})`,
    col1 + 40,
    y
  );
  y += SPACING.AFTER_SUBTITLE;

  return y;
}
