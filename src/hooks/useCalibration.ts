import { useState, useEffect, useCallback } from 'react';
import { Calibration } from '../types';
import {
  calculateDPI,
  calculatePixelsPerDegree,
  getDefaultCardWidthPx,
  cardWidthFromDPI,
  CARD_ASPECT_RATIO,
  CREDIT_CARD_WIDTH_MM,
  CREDIT_CARD_HEIGHT_MM,
} from '../utils/calibration';

const STORAGE_KEY = 'campimetry_calibration';

interface UseCalibrationReturn {
  calibration: Calibration | null;
  isCalibrated: boolean;
  cardWidthPx: number;
  setCardWidthPx: (width: number) => void;
  screenDistance: number;
  setScreenDistance: (distance: number) => void;
  saveCalibration: () => void;
  clearCalibration: () => void;
  dpi: number;
  pixelsPerDegree: number;
  degreesToPixels: (degrees: number) => number;
  pixelsToDegrees: (pixels: number) => number;
}

/**
 * Хук для управления калибровкой экрана
 * Обеспечивает точное соответствие между пикселями и градусами угла зрения
 */
export function useCalibration(): UseCalibrationReturn {
  const defaultCardWidthPx = getDefaultCardWidthPx();

  const [calibration, setCalibration] = useState<Calibration | null>(null);
  const [cardWidthPx, setCardWidthPx] = useState(defaultCardWidthPx);
  const [screenDistance, setScreenDistance] = useState(50);

  // Загрузка калибровки из localStorage при монтировании
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Calibration;
        setCalibration(parsed);
        setCardWidthPx(cardWidthFromDPI(parsed.dpi));
        setScreenDistance(parsed.screenDistance);
      }
    } catch {
      // Игнорируем ошибки парсинга
    }
  }, []);

  // Вычисленные значения
  const dpi = calculateDPI(cardWidthPx);
  const pixelsPerDegree = calculatePixelsPerDegree(cardWidthPx, screenDistance);

  const saveCalibration = useCallback(() => {
    const newCalibration: Calibration = {
      pixelsPerDegree,
      screenDistance,
      dpi,
      timestamp: Date.now(),
    };

    setCalibration(newCalibration);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCalibration));
  }, [pixelsPerDegree, screenDistance, dpi]);

  const clearCalibration = useCallback(() => {
    setCalibration(null);
    localStorage.removeItem(STORAGE_KEY);
    setCardWidthPx(defaultCardWidthPx);
    setScreenDistance(50);
  }, [defaultCardWidthPx]);

  const degreesToPixels = useCallback(
    (degrees: number): number => degrees * pixelsPerDegree,
    [pixelsPerDegree]
  );

  const pixelsToDegrees = useCallback(
    (pixels: number): number => {
      if (pixelsPerDegree === 0) return 0;
      return pixels / pixelsPerDegree;
    },
    [pixelsPerDegree]
  );

  return {
    calibration,
    isCalibrated: calibration !== null,
    cardWidthPx,
    setCardWidthPx,
    screenDistance,
    setScreenDistance,
    saveCalibration,
    clearCalibration,
    dpi: Math.round(dpi),
    pixelsPerDegree,
    degreesToPixels,
    pixelsToDegrees,
  };
}

// Реэкспорт констант для обратной совместимости
export { CARD_ASPECT_RATIO, CREDIT_CARD_WIDTH_MM as CARD_WIDTH_MM, CREDIT_CARD_HEIGHT_MM as CARD_HEIGHT_MM };
