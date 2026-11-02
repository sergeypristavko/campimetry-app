import { useEffect, useCallback, useRef } from 'react';
import { FixationCross } from '../ui/FixationCross';
import { Stimulus } from '../ui/Stimulus';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { Eye, AppSettings } from '../../types';
import { calculateStimulusSizePx } from '../../utils/stimulus';

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

/**
 * Экран проведения теста
 */
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

  // Размер стимула в пикселях
  const stimulusSizePx = calculateStimulusSizePx(settings.stimulusSizeGoldmann, pixelsPerDegree);

  // Обработка клавиатуры
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

  // Обработка клика
  const handleClick = useCallback(() => {
    if (isRunning && !isPaused) {
      onResponse(true);
    }
  }, [isRunning, isPaused, onResponse]);

  // Установка обработчиков
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Автоматический переход в полноэкранный режим
  useEffect(() => {
    if (!isFullscreen) {
      enterFullscreen();
    }
  }, []);

  // Экран паузы
  if (isPaused) {
    return (
      <div className="w-screen h-screen bg-background flex flex-col items-center justify-center font-sans">
        <h2 className="text-white mb-6 text-2xl">Тест приостановлен</h2>
        <p className="text-white/60 mb-8">
          Выполнено {completedPoints} из {totalPoints} точек ({Math.round(progress)}%)
        </p>
        <div className="flex gap-4">
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
      className="w-screen h-screen relative cursor-none overflow-hidden select-none"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      {/* Полоса прогресса */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <ProgressBar progress={progress} fillColor="#4ade80" />
      </div>

      {/* Информационный оверлей */}
      <div className="absolute top-2.5 right-2.5 px-4 py-2 bg-black/50 text-white rounded text-sm z-10">
        {eye === 'OD' ? 'OD (правый)' : 'OS (левый)'} — {completedPoints}/{totalPoints}
      </div>

      {/* Подсказка паузы */}
      <div className="absolute top-2.5 left-2.5 px-2 py-1 bg-black/30 text-white/50 rounded text-xs z-10">
        ESC — пауза
      </div>

      {/* Крестик фиксации */}
      <FixationCross size={24} color="#000" thickness={2} />

      {/* Стимул */}
      <Stimulus
        x={stimulusX}
        y={stimulusY}
        size={stimulusSizePx}
        color={settings.stimulusColor}
        opacity={stimulusOpacity}
        visible={showStimulus}
      />

      {/* Инструкция внизу */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-black/40 text-sm text-center z-10">
        Смотрите на крестик. Нажмите пробел или кликните, когда увидите вспышку.
      </div>
    </div>
  );
}
