/**
 * Вычисляет DPI экрана
 */

import { CREDIT_CARD_WIDTH_MM, MM_PER_INCH } from './constants';

/**
 * Вычисляет DPI экрана на основе измеренной ширины карты в пикселях
 * @param cardWidthPx - Ширина кредитной карты в пикселях
 * @returns DPI экрана (точек на дюйм)
 */
export function calculateDPI(cardWidthPx: number): number {
  return (cardWidthPx / CREDIT_CARD_WIDTH_MM) * MM_PER_INCH;
}

/**
 * Вычисляет ширину карты в пикселях по умолчанию
 * Предполагает типичный DPI экрана ~96
 * @returns Ширина карты в пикселях
 */
export function getDefaultCardWidthPx(): number {
  return Math.round((CREDIT_CARD_WIDTH_MM / MM_PER_INCH) * 96);
}

/**
 * Восстанавливает ширину карты в пикселях из сохранённого DPI
 * @param dpi - Сохранённое значение DPI
 * @returns Ширина карты в пикселях
 */
export function cardWidthFromDPI(dpi: number): number {
  return Math.round((CREDIT_CARD_WIDTH_MM / MM_PER_INCH) * dpi);
}
