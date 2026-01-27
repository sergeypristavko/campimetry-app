import { useState, useCallback, useRef, useEffect } from 'react';
import {
  TestPoint,
  ThresholdResult,
  ReliabilityIndices,
  TestSession,
  Eye,
  GridPattern,
  TestStrategy,
  StaircaseState,
  AppSettings,
} from '../types';
import { getPattern, markBlindSpotPoints, shufflePoints } from '../utils/gridPatterns';
import {
  initializeStaircase,
  processResponse,
  staircaseToThresholdResult,
  getSuprathresholdIntensity,
  intensityToLinear,
} from '../utils/algorithms';
import { calculateStatistics } from '../utils/statistics';
import { generateSessionId } from './useStorage';
import { isInUIZone } from '../utils/uiZoneDetection';
import { calculateStimulusSizePx, calculateStimulusPosition } from '../utils/stimulusCalculations';

interface UseTestProps {
  eye: Eye;
  pattern: GridPattern;
  strategy: TestStrategy;
  settings: AppSettings;
  pixelsPerDegree: number;
  patientAge?: number;
  onComplete: (session: TestSession) => void;
}

interface UseTestReturn {
  isRunning: boolean;
  isPaused: boolean;
  currentPoint: TestPoint | null;
  currentIntensity: number;
  showStimulus: boolean;
  progress: number;
  totalPoints: number;
  completedPoints: number;
  startTest: () => void;
  pauseTest: () => void;
  resumeTest: () => void;
  abortTest: () => void;
  recordResponse: (seen: boolean) => void;
  reliability: ReliabilityIndices;
  stimulusOpacity: number;
  stimulusX: number;
  stimulusY: number;
}

const INITIAL_RELIABILITY: ReliabilityIndices = {
  fixationLosses: 0,
  fixationLossesTotal: 0,
  falsePositives: 0,
  falsePositivesTotal: 0,
  falseNegatives: 0,
  falseNegativesTotal: 0,
};

/**
 * Хук для управления процессом тестирования поля зрения
 * Реализует алгоритм staircase для пороговой стратегии
 */
export function useTest({
  eye,
  pattern,
  strategy,
  settings,
  pixelsPerDegree,
  patientAge,
  onComplete,
}: UseTestProps): UseTestReturn {
  // Состояние для обновления UI
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showStimulus, setShowStimulus] = useState(false);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [completedPoints, setCompletedPoints] = useState(0);
  const [testPoints, setTestPoints] = useState<TestPoint[]>([]);
  const [currentIntensity, setCurrentIntensity] = useState(24);
  const [reliability, setReliability] = useState<ReliabilityIndices>(INITIAL_RELIABILITY);

  // Рефы для доступа из колбэков (избегаем stale closures)
  const testPointsRef = useRef<TestPoint[]>([]);
  const staircasesRef = useRef<Map<string, StaircaseState>>(new Map());
  const resultsRef = useRef<ThresholdResult[]>([]);
  const currentPointIndexRef = useRef(0);
  const completedPointsRef = useRef(0);
  const isRunningRef = useRef(false);
  const isPausedRef = useRef(false);
  const reliabilityRef = useRef<ReliabilityIndices>(reliability);

  // Рефы для таймеров
  const stimulusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interStimulusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const awaitingResponseRef = useRef(false);

  // Реф для функции обработки ответа
  const handleResponseRef = useRef<(seen: boolean) => void>(() => {});

  // Синхронизация рефов с состоянием
  useEffect(() => {
    reliabilityRef.current = reliability;
  }, [reliability]);

  // Текущая точка
  const currentPoint = testPoints[currentPointIndex] || null;

  // Позиция стимула
  const stimulusPosition = currentPoint
    ? calculateStimulusPosition(currentPoint, pixelsPerDegree)
    : { x: 0, y: 0 };

  // Прозрачность стимула (на основе интенсивности)
  const stimulusOpacity = intensityToLinear(currentIntensity);

  // Прогресс
  const totalPoints = testPoints.length;
  const progress = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0;

  // Очистка таймеров
  const clearAllTimeouts = useCallback(() => {
    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (responseTimeoutRef.current) clearTimeout(responseTimeoutRef.current);
    if (interStimulusTimeoutRef.current) clearTimeout(interStimulusTimeoutRef.current);
  }, []);

  // Завершение теста
  const completeTest = useCallback(() => {
    const points = testPointsRef.current;
    const results = resultsRef.current;

    const eccentricities = new Map<string, number>();
    points.forEach(p => eccentricities.set(p.id, p.eccentricity));

    const stats = calculateStatistics(results, eccentricities, patientAge);
    const duration = Date.now() - startTimeRef.current;

    const session: TestSession = {
      id: generateSessionId(),
      date: new Date().toISOString(),
      eye,
      pattern,
      strategy,
      duration,
      results,
      reliability: reliabilityRef.current,
      statistics: stats,
      patientAge,
    };

    setIsRunning(false);
    isRunningRef.current = false;
    onComplete(session);
  }, [eye, pattern, strategy, patientAge, onComplete]);

  // Показ следующего стимула
  const showNextStimulus = useCallback(() => {
    if (isPausedRef.current || !isRunningRef.current) return;

    const points = testPointsRef.current;
    const idx = currentPointIndexRef.current;

    // Проверка завершения теста
    if (idx >= points.length) {
      completeTest();
      return;
    }

    const point = points[idx];
    const staircase = staircasesRef.current.get(point.id);

    if (!staircase) {
      // Пропускаем точку без staircase (не должно происходить)
      currentPointIndexRef.current += 1;
      setCurrentPointIndex(currentPointIndexRef.current);
      interStimulusTimeoutRef.current = setTimeout(showNextStimulus, 100);
      return;
    }

    // Обновляем интенсивность
    setCurrentIntensity(staircase.currentIntensity);

    // Показываем стимул
    setShowStimulus(true);
    awaitingResponseRef.current = true;

    // Скрываем стимул после заданной длительности
    stimulusTimeoutRef.current = setTimeout(() => {
      setShowStimulus(false);
    }, settings.stimulusDuration);

    // Таймаут ожидания ответа
    responseTimeoutRef.current = setTimeout(() => {
      if (awaitingResponseRef.current) {
        handleResponseRef.current(false);
      }
    }, settings.responseTimeout);
  }, [settings.stimulusDuration, settings.responseTimeout, completeTest]);

  // Обработка ответа
  const handleResponse = useCallback(
    (seen: boolean) => {
      if (!awaitingResponseRef.current || !isRunningRef.current) return;

      clearAllTimeouts();
      awaitingResponseRef.current = false;
      setShowStimulus(false);

      const points = testPointsRef.current;
      const idx = currentPointIndexRef.current;
      const point = points[idx];

      if (!point) {
        interStimulusTimeoutRef.current = setTimeout(showNextStimulus, 100);
        return;
      }

      const staircase = staircasesRef.current.get(point.id);

      if (!staircase) {
        currentPointIndexRef.current += 1;
        setCurrentPointIndex(currentPointIndexRef.current);
        interStimulusTimeoutRef.current = setTimeout(showNextStimulus, 100);
        return;
      }

      if (strategy === 'threshold') {
        // Обновляем staircase
        const updatedStaircase = processResponse(staircase, seen);
        staircasesRef.current.set(point.id, updatedStaircase);

        if (updatedStaircase.isComplete) {
          // Точка завершена
          const result = staircaseToThresholdResult(updatedStaircase, point, patientAge);
          resultsRef.current.push(result);

          completedPointsRef.current += 1;
          setCompletedPoints(completedPointsRef.current);

          currentPointIndexRef.current += 1;
          setCurrentPointIndex(currentPointIndexRef.current);
        } else {
          // Обновляем интенсивность для следующего предъявления
          setCurrentIntensity(updatedStaircase.currentIntensity);
        }
      } else {
        // Надпороговая стратегия
        const threshold = seen ? getSuprathresholdIntensity(point.eccentricity, patientAge) : 0;
        const result: ThresholdResult = {
          pointId: point.id,
          threshold,
          deviation: 0,
          totalDeviation: 0,
          patternDeviation: 0,
          presentations: 1,
        };
        resultsRef.current.push(result);

        completedPointsRef.current += 1;
        setCompletedPoints(completedPointsRef.current);

        currentPointIndexRef.current += 1;
        setCurrentPointIndex(currentPointIndexRef.current);
      }

      // Планируем следующий стимул с рандомной задержкой
      interStimulusTimeoutRef.current = setTimeout(showNextStimulus, 500 + Math.random() * 500);
    },
    [strategy, patientAge, clearAllTimeouts, showNextStimulus]
  );

  // Синхронизация рефа с функцией обработки ответа
  useEffect(() => {
    handleResponseRef.current = handleResponse;
  }, [handleResponse]);

  // Публичная функция записи ответа
  const recordResponse = useCallback(
    (seen: boolean) => handleResponse(seen),
    [handleResponse]
  );

  // Запуск теста
  const startTest = useCallback(() => {
    const stimulusSizePx = calculateStimulusSizePx(settings.stimulusSizeGoldmann, pixelsPerDegree);

    // Генерация точек
    let points = getPattern(pattern);
    points = markBlindSpotPoints(points, eye);

    // Фильтрация точек, пересекающихся с UI-элементами
    points = points.filter(point => {
      const pos = calculateStimulusPosition(point, pixelsPerDegree);
      return !isInUIZone(pos.x, pos.y, stimulusSizePx);
    });

    points = shufflePoints(points);

    // Инициализация staircase для каждой точки
    const newStaircases = new Map<string, StaircaseState>();
    points.forEach(point => {
      newStaircases.set(point.id, initializeStaircase(point));
    });

    // Установка рефов
    testPointsRef.current = points;
    staircasesRef.current = newStaircases;
    resultsRef.current = [];
    currentPointIndexRef.current = 0;
    completedPointsRef.current = 0;
    isRunningRef.current = true;
    isPausedRef.current = false;

    // Установка состояния
    setTestPoints(points);
    setCurrentPointIndex(0);
    setCompletedPoints(0);
    setCurrentIntensity(24);
    setReliability(INITIAL_RELIABILITY);

    startTimeRef.current = Date.now();
    setIsRunning(true);
    setIsPaused(false);

    // Запуск первого стимула с задержкой
    setTimeout(showNextStimulus, 1000);
  }, [pattern, eye, settings.stimulusSizeGoldmann, pixelsPerDegree, showNextStimulus]);

  // Пауза
  const pauseTest = useCallback(() => {
    isPausedRef.current = true;
    setIsPaused(true);
    clearAllTimeouts();
  }, [clearAllTimeouts]);

  // Возобновление
  const resumeTest = useCallback(() => {
    isPausedRef.current = false;
    setIsPaused(false);
    setTimeout(showNextStimulus, 1000);
  }, [showNextStimulus]);

  // Прерывание
  const abortTest = useCallback(() => {
    clearAllTimeouts();
    isRunningRef.current = false;
    isPausedRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    awaitingResponseRef.current = false;
  }, [clearAllTimeouts]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  return {
    isRunning,
    isPaused,
    currentPoint,
    currentIntensity,
    showStimulus,
    progress,
    totalPoints,
    completedPoints,
    startTest,
    pauseTest,
    resumeTest,
    abortTest,
    recordResponse,
    reliability,
    stimulusOpacity,
    stimulusX: stimulusPosition.x,
    stimulusY: stimulusPosition.y,
  };
}
