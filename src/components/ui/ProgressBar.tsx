interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  showLabel?: boolean;
}

/**
 * Полоса прогресса с анимацией
 */
export function ProgressBar({
  progress,
  height = 4,
  backgroundColor = 'rgba(0,0,0,0.3)',
  fillColor = '#4ade80',
  showLabel = false,
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full">
      <div
        className="w-full overflow-hidden"
        style={{
          height,
          backgroundColor,
          borderRadius: height / 2,
        }}
      >
        <div
          className="h-full transition-[width] duration-300 ease-out"
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: fillColor,
          }}
        />
      </div>
      {showLabel && (
        <div className="text-center mt-1 text-xs text-white/70">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
}
