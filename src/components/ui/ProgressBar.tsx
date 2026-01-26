
interface ProgressBarProps {
  progress: number;  // 0-100
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  progress,
  height = 4,
  backgroundColor = 'rgba(0,0,0,0.3)',
  fillColor = '#4ade80',
  showLabel = false,
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          height,
          backgroundColor,
          borderRadius: height / 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clampedProgress}%`,
            height: '100%',
            backgroundColor: fillColor,
            transition: 'width 0.3s ease-out',
          }}
        />
      </div>
      {showLabel && (
        <div
          style={{
            textAlign: 'center',
            marginTop: '4px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
}
