import { ThresholdResult, TestPoint, GridPattern, Eye } from '../../types';
import { getThresholdColor, getDeviationColor } from '../../utils/normalValues';
import { getPattern } from '../../utils/gridPatterns';

interface SensitivityMapProps {
  results: ThresholdResult[];
  pattern: GridPattern;
  eye: Eye;
  showThresholds?: boolean;  // true = show dB values, false = show deviation
  size?: number;
}

export function SensitivityMap({
  results,
  pattern,
  eye,
  showThresholds = true,
  size = 400,
}: SensitivityMapProps) {
  const points = getPattern(pattern);

  // Create a map of results by point ID
  const resultMap = new Map<string, ThresholdResult>();
  results.forEach(r => resultMap.set(r.pointId, r));

  // Calculate scale based on pattern
  const maxDegrees = pattern === '10-2' ? 12 : pattern === '30-2' ? 33 : 27;
  const scale = (size / 2) / maxDegrees;

  // Map point to screen coordinates
  const pointToScreen = (point: TestPoint) => {
    // For right eye (OD), x is normal
    // For left eye (OS), x should be mirrored to show anatomical view
    const xMultiplier = eye === 'OS' ? -1 : 1;
    return {
      x: size / 2 + point.x * xMultiplier * scale,
      y: size / 2 - point.y * scale, // Invert Y for screen coordinates
    };
  };

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        backgroundColor: '#0f3460',
        borderRadius: '50%',
        overflow: 'hidden',
        margin: '0 auto',
      }}
    >
      {/* Concentric circles */}
      {[10, 20, 30].filter(r => r <= maxDegrees).map(degrees => (
        <div
          key={degrees}
          style={{
            position: 'absolute',
            left: size / 2 - degrees * scale,
            top: size / 2 - degrees * scale,
            width: degrees * 2 * scale,
            height: degrees * 2 * scale,
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%',
          }}
        />
      ))}

      {/* Axis lines */}
      <div
        style={{
          position: 'absolute',
          left: size / 2,
          top: size * 0.1,
          bottom: size * 0.1,
          width: '1px',
          backgroundColor: 'rgba(255,255,255,0.15)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: size / 2,
          left: size * 0.1,
          right: size * 0.1,
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.15)',
        }}
      />

      {/* Center fixation point */}
      <div
        style={{
          position: 'absolute',
          left: size / 2 - 4,
          top: size / 2 - 4,
          width: 8,
          height: 8,
          backgroundColor: '#fff',
          borderRadius: '50%',
        }}
      />

      {/* Blind spot indicator (for OD on right, OS on left) */}
      <div
        style={{
          position: 'absolute',
          left: size / 2 + (eye === 'OD' ? 15 : -15) * scale - 8,
          top: size / 2 + 1.5 * scale - 8,
          width: 16,
          height: 16,
          border: '2px dashed rgba(255,255,255,0.3)',
          borderRadius: '50%',
        }}
        title="Слепое пятно"
      />

      {/* Result points */}
      {points.map(point => {
        const result = resultMap.get(point.id);
        const { x, y } = pointToScreen(point);
        const pointSize = 24;

        if (!result) {
          // No result for this point
          return (
            <div
              key={point.id}
              style={{
                position: 'absolute',
                left: x - pointSize / 2,
                top: y - pointSize / 2,
                width: pointSize,
                height: pointSize,
                borderRadius: '4px',
                backgroundColor: 'rgba(100,100,100,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                color: 'rgba(255,255,255,0.5)',
              }}
              title={`(${point.x}°, ${point.y}°)`}
            >
              -
            </div>
          );
        }

        const color = showThresholds
          ? getThresholdColor(result.threshold)
          : getDeviationColor(result.totalDeviation);
        const value = showThresholds ? result.threshold : result.totalDeviation;

        return (
          <div
            key={point.id}
            style={{
              position: 'absolute',
              left: x - pointSize / 2,
              top: y - pointSize / 2,
              width: pointSize,
              height: pointSize,
              borderRadius: '4px',
              backgroundColor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#000',
              cursor: 'pointer',
            }}
            title={`(${point.x}°, ${point.y}°)\nПорог: ${result.threshold} dB\nОтклонение: ${result.totalDeviation} dB`}
          >
            {value}
          </div>
        );
      })}

      {/* Labels */}
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: size / 2,
          transform: 'translateX(-50%)',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        Верх
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 4,
          left: size / 2,
          transform: 'translateX(-50%)',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        Низ
      </div>
      <div
        style={{
          position: 'absolute',
          left: 4,
          top: size / 2,
          transform: 'translateY(-50%)',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        {eye === 'OD' ? 'Нос' : 'Висок'}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 4,
          top: size / 2,
          transform: 'translateY(-50%)',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        {eye === 'OD' ? 'Висок' : 'Нос'}
      </div>
    </div>
  );
}

// Color scale legend
export function ColorScaleLegend({ showThresholds = true }: { showThresholds?: boolean }) {
  const thresholdScale = [
    { value: '30+', color: '#22c55e' },
    { value: '25-29', color: '#84cc16' },
    { value: '20-24', color: '#eab308' },
    { value: '15-19', color: '#f97316' },
    { value: '10-14', color: '#ef4444' },
    { value: '<10', color: '#7f1d1d' },
  ];

  const deviationScale = [
    { value: '>-2', color: '#4ade80' },
    { value: '-2 to -5', color: '#a3e635' },
    { value: '-5 to -10', color: '#facc15' },
    { value: '-10 to -15', color: '#fb923c' },
    { value: '-15 to -20', color: '#f87171' },
    { value: '<-20', color: '#991b1b' },
  ];

  const scale = showThresholds ? thresholdScale : deviationScale;
  const label = showThresholds ? 'Чувствительность (dB)' : 'Отклонение от нормы (dB)';

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {scale.map(item => (
          <div key={item.value} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: item.color,
                borderRadius: '2px',
              }}
            />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
