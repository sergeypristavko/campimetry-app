import { useEffect, useCallback, useRef } from 'react';
import { FixationCross } from '../ui/FixationCross';
import { Stimulus } from '../ui/Stimulus';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { Eye, AppSettings, GoldmannSizes } from '../../types';

interface TestScreenProps {
  eye: Eye;
  settings: AppSettings;
  isRunning: boolean;
  isPaused: boolean;
  showStimulus: boolean;
  stimulusX: number;
  stimulusY: number;
  stimulusOpacity: number;
  progress: number;
  completedPoints: number;
  totalPoints: number;
  pixelsPerDegree: number;
  onResponse: (seen: boolean) => void;
  onPause: () => void;
  onResume: () => void;
  onAbort: () => void;
  enterFullscreen: () => Promise<void>;
  isFullscreen: boolean;
}

export function TestScreen({
  eye,
  settings,
  isRunning,
  isPaused,
  showStimulus,
  stimulusX,
  stimulusY,
  stimulusOpacity,
  progress,
  completedPoints,
  totalPoints,
  pixelsPerDegree,
  onResponse,
  onPause,
  onResume,
  onAbort,
  enterFullscreen,
  isFullscreen,
}: TestScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate stimulus size in pixels
  const stimulusSizeDegrees = GoldmannSizes[settings.stimulusSizeGoldmann];
  const stimulusSizePx = Math.max(4, Math.round(stimulusSizeDegrees * pixelsPerDegree));

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning && !isPaused) {
          onResponse(true);
        }
      } else if (e.code === 'Escape') {
        e.preventDefault();
        if (isRunning) {
          if (isPaused) {
            onResume();
          } else {
            onPause();
          }
        }
      }
    },
    [isRunning, isPaused, onResponse, onPause, onResume]
  );

  // Handle click
  const handleClick = useCallback(() => {
    if (isRunning && !isPaused) {
      onResponse(true);
    }
  }, [isRunning, isPaused, onResponse]);

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Auto-enter fullscreen on mount
  useEffect(() => {
    if (!isFullscreen) {
      enterFullscreen();
    }
  }, []);

  if (isPaused) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#1a1a2e',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h2 style={{ color: '#fff', marginBottom: '24px' }}>Тест приостановлен</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
          Выполнено {completedPoints} из {totalPoints} точек ({Math.round(progress)}%)
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button variant="primary" size="lg" onClick={onResume}>
            Продолжить
          </Button>
          <Button variant="danger" size="lg" onClick={onAbort}>
            Прервать тест
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: settings.backgroundColor,
        position: 'relative',
        cursor: 'none',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <ProgressBar progress={progress} fillColor="#4ade80" />
      </div>

      {/* Info overlay */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '8px 16px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          borderRadius: '4px',
          fontSize: '14px',
          zIndex: 10,
        }}
      >
        {eye === 'OD' ? 'OD (правый)' : 'OS (левый)'} — {completedPoints}/{totalPoints}
      </div>

      {/* Pause hint */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '4px 8px',
          backgroundColor: 'rgba(0,0,0,0.3)',
          color: 'rgba(255,255,255,0.5)',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 10,
        }}
      >
        ESC — пауза
      </div>

      {/* Fixation cross */}
      <FixationCross size={24} color="#000" thickness={2} />

      {/* Stimulus */}
      <Stimulus
        x={stimulusX}
        y={stimulusY}
        size={stimulusSizePx}
        color={settings.stimulusColor}
        opacity={stimulusOpacity}
        visible={showStimulus}
      />

      {/* Instructions at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(0,0,0,0.4)',
          fontSize: '14px',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        Смотрите на крестик. Нажмите пробел или кликните, когда увидите вспышку.
      </div>
    </div>
  );
}
