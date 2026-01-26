
interface FixationCrossProps {
  size?: number;
  color?: string;
  thickness?: number;
}

export function FixationCross({
  size = 20,
  color = '#000',
  thickness = 2,
}: FixationCrossProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
      }}
    >
      {/* Vertical line */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: thickness,
          backgroundColor: color,
          transform: 'translateX(-50%)',
        }}
      />
      {/* Horizontal line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: thickness,
          backgroundColor: color,
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  );
}
