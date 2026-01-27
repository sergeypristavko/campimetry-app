import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Screen } from '../../types';
import { CARD_ASPECT_RATIO, CARD_WIDTH_MM, CARD_HEIGHT_MM } from '../../hooks/useCalibration';

interface CalibrationScreenProps {
  onNavigate: (screen: Screen) => void;
  cardWidthPx: number;
  setCardWidthPx: (width: number) => void;
  screenDistance: number;
  setScreenDistance: (distance: number) => void;
  dpi: number;
  pixelsPerDegree: number;
  saveCalibration: () => void;
}

/**
 * Экран калибровки экрана
 */
export function CalibrationScreen({
  onNavigate,
  cardWidthPx,
  setCardWidthPx,
  screenDistance,
  setScreenDistance,
  dpi,
  pixelsPerDegree,
  saveCalibration,
}: CalibrationScreenProps) {
  const cardHeightPx = Math.round(cardWidthPx * CARD_ASPECT_RATIO);

  const handleSave = () => {
    saveCalibration();
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-background text-gray-200 p-10 font-sans">
      <div className="max-w-[700px] mx-auto">
        <Button variant="ghost" onClick={() => onNavigate('home')} className="mb-5">
          &larr; Назад
        </Button>

        <h1 className="text-center mb-8 text-2xl font-bold">Калибровка экрана</h1>

        <Card title="Шаг 1: Размер экрана">
          <p className="mb-5 text-white/70">
            Приложите банковскую карту к экрану и подгоните размер прямоугольника так,
            чтобы он точно совпадал с размером карты.
          </p>

          {/* Референс кредитной карты */}
          <div className="flex justify-center mb-6">
            <div
              className="border-[3px] border-primary rounded-xl bg-primary/10 flex items-center justify-center flex-col transition-all duration-100"
              style={{ width: cardWidthPx, height: cardHeightPx }}
            >
              <div className="text-sm font-bold mb-1">
                {CARD_WIDTH_MM} x {CARD_HEIGHT_MM} мм
              </div>
              <div className="text-xs text-white/50">Кредитная карта</div>
            </div>
          </div>

          {/* Слайдер ширины */}
          <div className="mb-4">
            <label className="block mb-2">Ширина: {cardWidthPx} px</label>
            <input
              type="range"
              min="200"
              max="500"
              value={cardWidthPx}
              onChange={e => setCardWidthPx(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="p-3 bg-white/5 rounded-lg text-sm">
            Определённый DPI: <strong>{dpi}</strong> точек/дюйм
          </div>
        </Card>

        <Card title="Шаг 2: Расстояние до экрана">
          <p className="mb-5 text-white/70">
            Укажите расстояние, на котором вы будете находиться от экрана во время теста.
            Рекомендуемое расстояние: 30-50 см.
          </p>

          <div className="mb-4">
            <label className="block mb-2">Расстояние: {screenDistance} см</label>
            <input
              type="range"
              min="20"
              max="100"
              value={screenDistance}
              onChange={e => setScreenDistance(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-lg text-center">
              <div className="text-xs text-white/50">Пикселей на градус</div>
              <div className="text-xl font-bold">{pixelsPerDegree.toFixed(1)}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg text-center">
              <div className="text-xs text-white/50">Размер 1° в пикселях</div>
              <div className="text-xl font-bold">{Math.round(pixelsPerDegree)} px</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-sm text-white/60 mb-4">
            <strong>Важно:</strong> Калибровка влияет на точность измерений. После
            калибровки поддерживайте указанное расстояние до экрана во время теста.
          </div>

          <Button variant="primary" fullWidth size="lg" onClick={handleSave}>
            Сохранить калибровку
          </Button>
        </Card>
      </div>
    </div>
  );
}
