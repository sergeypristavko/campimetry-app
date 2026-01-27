interface StimulusProps {
  x: number; // пиксели от центра
  y: number; // пиксели от центра
  size: number; // диаметр в пикселях
  color: string;
  opacity: number; // 0-1
  visible: boolean;
}

/**
 * Визуальный стимул (тестовая точка)
 */
export function Stimulus({ x, y, size, color, opacity, visible }: StimulusProps) {
  if (!visible) return null;

  return (
    <div
      className="absolute rounded-full transition-opacity duration-50 z-[1]"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        backgroundColor: color,
        opacity,
        boxShadow: `0 0 ${size / 2}px ${color}`,
      }}
    />
  );
}
