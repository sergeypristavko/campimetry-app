/**
 * Утилиты для калибровки экрана
 * Чистые функции для расчёта DPI и пикселей на градус
 */

export {
  CREDIT_CARD_WIDTH_MM,
  CREDIT_CARD_HEIGHT_MM,
  CARD_ASPECT_RATIO,
  MM_PER_INCH,
} from './constants';
export {
  calculateDPI,
  getDefaultCardWidthPx,
  cardWidthFromDPI,
} from './calculateDPI';
export { calculatePixelsPerDegree } from './calculatePixelsPerDegree';
