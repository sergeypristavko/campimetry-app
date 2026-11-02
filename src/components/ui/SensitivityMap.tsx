import { ThresholdResult, TestPoint, GridPattern, Eye } from '../../types';
import { getThresholdColor, getDeviationColor } from '../../utils/colors';
import { getPattern } from '../../utils/grid';

interface SensitivityMapProps {
  results: ThresholdResult[];
  pattern: GridPattern;
  eye: Eye;
  showThresholds?: boolean; // true = показать dB, false = показать отклонение
  size?: number;
}

/**
 * Карта чувствительности поля зрения
 */
export function SensitivityMap({
  results,
  pattern,
  eye,
  showThresholds = true,
  size = 400,
}: SensitivityMapProps) {
  const points = getPattern(pattern);

  // Создаём карту результатов по ID точки
  const resultMap = new Map<string, ThresholdResult>();
  results.forEach(r => resultMap.set(r.pointId, r));

  // Масштаб на основе паттерна
  const maxDegrees = pattern === '10-2' ? 12 : pattern === '30-2' ? 33 : 27;
  const scale = size / 2 / maxDegrees;

  // Преобразование координат точки в экранные
  const pointToScreen = (point: TestPoint) => {
    // Для OD x без изменений, для OS зеркалим для анатомического вида
    const xMultiplier = eye === 'OS' ? -1 : 1;
    return {
      x: size / 2 + point.x * xMultiplier * scale,
      y: size / 2 - point.y * scale,
    };
  };

  return (
    <div
      className="relative rounded-full overflow-hidden mx-auto bg-secondary"
      style={{ width: size, height: size }}
    >
      {/* Концентрические круги */}
      {[10, 20, 30]
        .filter(r => r <= maxDegrees)
        .map(degrees => (
          <div
            key={degrees}
            className="absolute border border-white/15 rounded-full"
            style={{
              left: size / 2 - degrees * scale,
              top: size / 2 - degrees * scale,
              width: degrees * 2 * scale,
              height: degrees * 2 * scale,
            }}
          />
        ))}

      {/* Оси */}
      <div
        className="absolute bg-white/15"
        style={{
          left: size / 2,
          top: size * 0.1,
          bottom: size * 0.1,
          width: 1,
        }}
      />
      <div
        className="absolute bg-white/15"
        style={{
          top: size / 2,
          left: size * 0.1,
          right: size * 0.1,
          height: 1,
        }}
      />

      {/* Центральная точка фиксации */}
      <div
        className="absolute bg-white rounded-full"
        style={{
          left: size / 2 - 4,
          top: size / 2 - 4,
          width: 8,
          height: 8,
        }}
      />

      {/* Индикатор слепого пятна */}
      <div
        className="absolute border-2 border-dashed border-white/30 rounded-full"
        style={{
          left: size / 2 + (eye === 'OD' ? 15 : -15) * scale - 8,
          top: size / 2 + 1.5 * scale - 8,
          width: 16,
          height: 16,
        }}
        title="Слепое пятно"
      />

      {/* Точки результатов */}
      {points.map(point => {
        const result = resultMap.get(point.id);
        const { x, y } = pointToScreen(point);
        const pointSize = 24;

        if (!result) {
          return (
            <div
              key={point.id}
              className="absolute rounded flex items-center justify-center text-[9px] text-white/50 bg-gray-500/50"
              style={{
                left: x - pointSize / 2,
                top: y - pointSize / 2,
                width: pointSize,
                height: pointSize,
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
            className="absolute rounded flex items-center justify-center text-[10px] font-bold text-black cursor-pointer"
            style={{
              left: x - pointSize / 2,
              top: y - pointSize / 2,
              width: pointSize,
              height: pointSize,
              backgroundColor: color,
            }}
            title={`(${point.x}°, ${point.y}°)\nПорог: ${result.threshold} dB\nОтклонение: ${result.totalDeviation} dB`}
          >
            {value}
          </div>
        );
      })}

      {/* Метки направлений */}
      <div
        className="absolute text-[10px] text-white/50 -translate-x-1/2"
        style={{ top: 4, left: size / 2 }}
      >
        Верх
      </div>
      <div
        className="absolute text-[10px] text-white/50 -translate-x-1/2"
        style={{ bottom: 4, left: size / 2 }}
      >
        Низ
      </div>
      <div
        className="absolute text-[10px] text-white/50 -translate-y-1/2"
        style={{ left: 4, top: size / 2 }}
      >
        {eye === 'OD' ? 'Нос' : 'Висок'}
      </div>
      <div
        className="absolute text-[10px] text-white/50 -translate-y-1/2"
        style={{ right: 4, top: size / 2 }}
      >
        {eye === 'OD' ? 'Висок' : 'Нос'}
      </div>
    </div>
  );
}

/**
 * Легенда цветовой шкалы
 */
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
    <div className="mt-4">
      <div className="text-xs text-white/70 mb-2">{label}</div>
      <div className="flex gap-2 flex-wrap">
        {scale.map(item => (
          <div key={item.value} className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] text-white/70">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
