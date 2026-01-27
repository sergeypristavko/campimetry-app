/**
 * Утилиты для калибровки экрана
 * Чистые функции для расчёта DPI и пикселей на градус
 */

/** Ширина кредитной карты в мм (стандарт ISO/IEC 7810) */
export const CREDIT_CARD_WIDTH_MM = 85.6;

/** Высота кредитной карты в мм */
export const CREDIT_CARD_HEIGHT_MM = 53.98;

/** Соотношение сторон кредитной карты */
export const CARD_ASPECT_RATIO = CREDIT_CARD_HEIGHT_MM / CREDIT_CARD_WIDTH_MM;

/** Миллиметров в дюйме */
const MM_PER_INCH = 25.4;

/**
 * Вычисляет DPI экрана на основе измеренной ширины карты в пикселях
 * @param cardWidthPx - Ширина кредитной карты в пикселях
 * @returns DPI экрана (точек на дюйм)
 */
export function calculateDPI(cardWidthPx: number): number {
  return (cardWidthPx / CREDIT_CARD_WIDTH_MM) * MM_PER_INCH;
}

/**
 * Вычисляет количество пикселей на один градус угла зрения
 * Формула: pixelsPerDegree = distance_px × tan(1°)
 * где distance_px = distance_cm × (dpi / 2.54)
 *
 * @param cardWidthPx - Ширина кредитной карты в пикселях (для расчёта DPI)
 * @param screenDistanceCm - Расстояние от глаза до экрана в сантиметрах
 * @returns Количество пикселей на градус угла зрения
 */
export function calculatePixelsPerDegree(
  cardWidthPx: number,
  screenDistanceCm: number
): number {
  const dpi = calculateDPI(cardWidthPx);
  const distanceInPixels = screenDistanceCm * (dpi / 2.54);
  return distanceInPixels * Math.tan(Math.PI / 180);
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
