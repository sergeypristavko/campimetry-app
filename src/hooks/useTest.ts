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
  GoldmannSizes,
} from '../types';
import {
  getPattern,
  markBlindSpotPoints,
  shufflePoints,
} from '../utils/gridPatterns';
import {
  initializeStaircase,
  processResponse,
  staircaseToThresholdResult,
  getSuprathresholdIntensity,
  intensityToLinear,
} from '../utils/algorithms';
import { calculateStatistics } from '../utils/statistics';
import { generateSessionId } from './useStorage';

// Check if stimulus position overlaps with UI elements
// Returns true if the point should be skipped
function isInUIZone(
  stimulusX: number,
  stimulusY: number,
  stimulusSize: number
): boolean {
  // Get screen dimensions
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const halfWidth = screenWidth / 2;
  const halfHeight = screenHeight / 2;

  // Convert stimulus position to screen coordinates (from center)
  const screenX = halfWidth + stimulusX;
  const screenY = halfHeight + stimulusY;

  // UI zones (with padding for stimulus size)
  const padding = stimulusSize + 20;

  // Top-left: "ESC - пауза" (~100x30px at top:10, left:10)
  const topLeftZone = {
    left: 0,
    top: 0,
    right: 120 + padding,
    bottom: 50 + padding,
  };

  // Top-right: "OD (правый) - X/Y" (~180x40px at top:10, right:10)
  const topRightZone = {
    left: screenWidth - 200 - padding,
    top: 0,
    right: screenWidth,
    bottom: 50 + padding,
  };

  // Progress bar at very top
  const progressBarZone = {
    left: 0,
    top: 0,
    right: screenWidth,
    bottom: 6 + padding,
  };

  // Bottom center: instructions
  const bottomZone = {
    left: halfWidth - 300,
    top: screenHeight - 60 - padding,
    right: halfWidth + 300,
    bottom: screenHeight,
  };

  // Check if stimulus center is in any zone
  const inZone = (zone: { left: number; top: number; right: number; bottom: number }) =>
    screenX >= zone.left && screenX <= zone.right &&
    screenY >= zone.top && screenY <= zone.bottom;

  return inZone(topLeftZone) || inZone(topRightZone) || inZone(progressBarZone) || inZone(bottomZone);
}

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

export function useTest({
  eye,
  pattern,
  strategy,
  settings,
  pixelsPerDegree,
  patientAge,
  onComplete,
}: UseTestProps): UseTestReturn {
  // State for UI updates
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showStimulus, setShowStimulus] = useState(false);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [completedPoints, setCompletedPoints] = useState(0);
  const [testPoints, setTestPoints] = useState<TestPoint[]>([]);
  const [currentIntensity, setCurrentIntensity] = useState(24);
  const [reliability, setReliability] = useState<ReliabilityIndices>({
    fixationLosses: 0,
    fixationLossesTotal: 0,
    falsePositives: 0,
    falsePositivesTotal: 0,
    falseNegatives: 0,
    falseNegativesTotal: 0,
  });

  // Refs for callback access (avoid stale closures)
  const testPointsRef = useRef<TestPoint[]>([]);
  const staircasesRef = useRef<Map<string, StaircaseState>>(new Map());
  const resultsRef = useRef<ThresholdResult[]>([]);
  const currentPointIndexRef = useRef(0);
  const completedPointsRef = useRef(0);
  const isRunningRef = useRef(false);
  const isPausedRef = useRef(false);
  const reliabilityRef = useRef<ReliabilityIndices>(reliability);

  // Timing refs
  const stimulusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interStimulusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const awaitingResponseRef = useRef(false);

  // Function refs to avoid stale closures
  const handleResponseRef = useRef<(seen: boolean) => void>(() => {});

  // Sync refs with state
  useEffect(() => { reliabilityRef.current = reliability; }, [reliability]);

  // Current point
  const currentPoint = testPoints[currentPointIndex] || null;

  // Calculate stimulus position
  const stimulusX = currentPoint ? currentPoint.x * pixelsPerDegree : 0;
  const stimulusY = currentPoint ? -currentPoint.y * pixelsPerDegree : 0;

  // Calculate opacity
  const stimulusOpacity = intensityToLinear(currentIntensity);

  // Progress
  const totalPoints = testPoints.length;
  const progress = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0;

  // Clear timeouts
  const clearAllTimeouts = useCallback(() => {
    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (responseTimeoutRef.current) clearTimeout(responseTimeoutRef.current);
    if (interStimulusTimeoutRef.current) clearTimeout(interStimulusTimeoutRef.current);
  }, []);

  // Complete test
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

  // Show next stimulus
  const showNextStimulus = useCallback(() => {
    console.log('[showNextStimulus] called, isPaused:', isPausedRef.current, 'isRunning:', isRunningRef.current);
    if (isPausedRef.current || !isRunningRef.current) {
      console.log('[showNextStimulus] early return - paused or not running');
      return;
    }

    const points = testPointsRef.current;
    const idx = currentPointIndexRef.current;
    console.log('[showNextStimulus] idx:', idx, 'total points:', points.length);

    // Check if test is complete
    if (idx >= points.length) {
      console.log('[showNextStimulus] test complete, calling completeTest');
      completeTest();
      return;
    }

    const point = points[idx];
    console.log('[showNextStimulus] point:', point?.id);
    const staircase = staircasesRef.current.get(point.id);
    if (!staircase) {
      // Skip this point if staircase not found (shouldn't happen, but handle gracefully)
      console.warn(`Staircase not found for point ${point.id}, skipping`);
      currentPointIndexRef.current += 1;
      setCurrentPointIndex(currentPointIndexRef.current);
      // Schedule next stimulus
      interStimulusTimeoutRef.current = setTimeout(() => {
        showNextStimulus();
      }, 100);
      return;
    }

    // Update intensity display
    setCurrentIntensity(staircase.currentIntensity);

    // Show stimulus
    setShowStimulus(true);
    awaitingResponseRef.current = true;

    // Hide stimulus after duration
    stimulusTimeoutRef.current = setTimeout(() => {
      setShowStimulus(false);
    }, settings.stimulusDuration);

    // Timeout if no response - use ref to avoid stale closure
    responseTimeoutRef.current = setTimeout(() => {
      if (awaitingResponseRef.current) {
        handleResponseRef.current(false);
      }
    }, settings.responseTimeout);
  }, [settings.stimulusDuration, settings.responseTimeout, completeTest]);

  // Handle response
  const handleResponse = useCallback((seen: boolean) => {
    console.log('[handleResponse] called, seen:', seen, 'awaiting:', awaitingResponseRef.current, 'isRunning:', isRunningRef.current);
    if (!awaitingResponseRef.current || !isRunningRef.current) {
      console.log('[handleResponse] early return - not awaiting or not running');
      return;
    }

    clearAllTimeouts();
    awaitingResponseRef.current = false;
    setShowStimulus(false);

    const points = testPointsRef.current;
    const idx = currentPointIndexRef.current;
    const point = points[idx];
    if (!point) {
      // No more points, schedule next (will complete test)
      interStimulusTimeoutRef.current = setTimeout(() => {
        showNextStimulus();
      }, 100);
      return;
    }

    const staircase = staircasesRef.current.get(point.id);
    if (!staircase) {
      // Skip this point and move to next
      console.warn(`Staircase not found for point ${point.id} in handleResponse, skipping`);
      currentPointIndexRef.current += 1;
      setCurrentPointIndex(currentPointIndexRef.current);
      interStimulusTimeoutRef.current = setTimeout(() => {
        showNextStimulus();
      }, 100);
      return;
    }

    if (strategy === 'threshold') {
      // Update staircase
      const updatedStaircase = processResponse(staircase, seen);
      staircasesRef.current.set(point.id, updatedStaircase);

      if (updatedStaircase.isComplete) {
        // Point is done
        const result = staircaseToThresholdResult(updatedStaircase, point, patientAge);
        resultsRef.current.push(result);

        completedPointsRef.current += 1;
        setCompletedPoints(completedPointsRef.current);

        currentPointIndexRef.current += 1;
        setCurrentPointIndex(currentPointIndexRef.current);
      } else {
        // Update intensity for next presentation of same point
        setCurrentIntensity(updatedStaircase.currentIntensity);
      }
    } else {
      // Suprathreshold
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

    // Schedule next stimulus
    interStimulusTimeoutRef.current = setTimeout(() => {
      showNextStimulus();
    }, 500 + Math.random() * 500);
  }, [strategy, patientAge, clearAllTimeouts, showNextStimulus]);

  // Keep handleResponseRef in sync with handleResponse
  useEffect(() => {
    handleResponseRef.current = handleResponse;
  }, [handleResponse]);

  // Public record response
  const recordResponse = useCallback((seen: boolean) => {
    handleResponse(seen);
  }, [handleResponse]);

  // Start test
  const startTest = useCallback(() => {
    // Calculate stimulus size for UI zone filtering
    const stimulusSizeDegrees = GoldmannSizes[settings.stimulusSizeGoldmann];
    const stimulusSizePx = Math.max(4, Math.round(stimulusSizeDegrees * pixelsPerDegree));

    // Generate points
    let points = getPattern(pattern);
    points = markBlindSpotPoints(points, eye);

    // Filter out points that would appear in UI zones
    points = points.filter(point => {
      const stimulusX = point.x * pixelsPerDegree;
      const stimulusY = -point.y * pixelsPerDegree;
      return !isInUIZone(stimulusX, stimulusY, stimulusSizePx);
    });

    points = shufflePoints(points);

    // Initialize staircases
    const newStaircases = new Map<string, StaircaseState>();
    points.forEach(point => {
      newStaircases.set(point.id, initializeStaircase(point));
    });

    // Set refs
    testPointsRef.current = points;
    staircasesRef.current = newStaircases;
    resultsRef.current = [];
    currentPointIndexRef.current = 0;
    completedPointsRef.current = 0;
    isRunningRef.current = true;
    isPausedRef.current = false;

    // Set state
    setTestPoints(points);
    setCurrentPointIndex(0);
    setCompletedPoints(0);
    setCurrentIntensity(24);
    setReliability({
      fixationLosses: 0,
      fixationLossesTotal: 0,
      falsePositives: 0,
      falsePositivesTotal: 0,
      falseNegatives: 0,
      falseNegativesTotal: 0,
    });

    startTimeRef.current = Date.now();
    setIsRunning(true);
    setIsPaused(false);

    // Start first stimulus
    setTimeout(() => {
      showNextStimulus();
    }, 1000);
  }, [pattern, eye, settings.stimulusSizeGoldmann, pixelsPerDegree, showNextStimulus]);

  // Pause
  const pauseTest = useCallback(() => {
    isPausedRef.current = true;
    setIsPaused(true);
    clearAllTimeouts();
  }, [clearAllTimeouts]);

  // Resume
  const resumeTest = useCallback(() => {
    isPausedRef.current = false;
    setIsPaused(false);
    setTimeout(() => {
      showNextStimulus();
    }, 1000);
  }, [showNextStimulus]);

  // Abort
  const abortTest = useCallback(() => {
    clearAllTimeouts();
    isRunningRef.current = false;
    isPausedRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    awaitingResponseRef.current = false;
  }, [clearAllTimeouts]);

  // Cleanup
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
    stimulusX,
    stimulusY,
  };
}
