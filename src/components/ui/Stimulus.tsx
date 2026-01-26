
interface StimulusProps {
  x: number;  // pixels from center
  y: number;  // pixels from center
  size: number;  // diameter in pixels
  color: string;
  opacity: number;  // 0-1
  visible: boolean;
}

export function Stimulus({ x, y, size, color, opacity, visible }: StimulusProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        opacity,
        boxShadow: `0 0 ${size / 2}px ${color}`,
        transition: 'opacity 0.05s',
        zIndex: 1,
      }}
    />
  );
}
