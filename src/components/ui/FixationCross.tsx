interface FixationCrossProps {
  size?: number;
  color?: string;
  thickness?: number;
}

/**
 * Крестик фиксации в центре экрана
 */
export function FixationCross({
  size = 20,
  color = '#000',
  thickness = 2,
}: FixationCrossProps) {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: size, height: size }}
    >
      {/* Вертикальная линия */}
      <div
        className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
        style={{ width: thickness, backgroundColor: color }}
      />
      {/* Горизонтальная линия */}
      <div
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
        style={{ height: thickness, backgroundColor: color }}
      />
    </div>
  );
}
