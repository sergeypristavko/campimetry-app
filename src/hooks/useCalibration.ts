import { useState, useEffect, useCallback } from 'react';
import { Calibration } from '../types';

const STORAGE_KEY = 'campimetry_calibration';
const CREDIT_CARD_WIDTH_MM = 85.6;
const CREDIT_CARD_HEIGHT_MM = 53.98;
const MM_PER_INCH = 25.4;

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

export function useCalibration(): UseCalibrationReturn {
  // Default card width based on common screen DPI (~96)
  const defaultCardWidthPx = Math.round((CREDIT_CARD_WIDTH_MM / MM_PER_INCH) * 96);

  const [calibration, setCalibration] = useState<Calibration | null>(null);
  const [cardWidthPx, setCardWidthPx] = useState(defaultCardWidthPx);
  const [screenDistance, setScreenDistance] = useState(50); // Default 50cm

  // Load calibration from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Calibration;
        setCalibration(parsed);

        // Reconstruct card width from DPI
        const restoredCardWidth = (CREDIT_CARD_WIDTH_MM / MM_PER_INCH) * parsed.dpi;
        setCardWidthPx(Math.round(restoredCardWidth));
        setScreenDistance(parsed.screenDistance);
      }
    } catch (e) {
      console.error('Failed to load calibration:', e);
    }
  }, []);

  // Calculate DPI from card width
  const dpi = (cardWidthPx / CREDIT_CARD_WIDTH_MM) * MM_PER_INCH;

  // Calculate pixels per degree based on viewing distance
  // Using: tan(1°) * distance_in_pixels = pixels_per_degree
  // distance_in_pixels = distance_cm * (dpi / 2.54)
  const distanceInPixels = screenDistance * (dpi / 2.54);
  const pixelsPerDegree = distanceInPixels * Math.tan((Math.PI / 180));

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
    (degrees: number): number => {
      return degrees * pixelsPerDegree;
    },
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

// Export card dimensions for UI
export const CARD_ASPECT_RATIO = CREDIT_CARD_HEIGHT_MM / CREDIT_CARD_WIDTH_MM;
export const CARD_WIDTH_MM = CREDIT_CARD_WIDTH_MM;
export const CARD_HEIGHT_MM = CREDIT_CARD_HEIGHT_MM;
