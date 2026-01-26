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
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a2e',
        color: '#eee',
        padding: '40px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Button variant="ghost" onClick={() => onNavigate('home')} style={{ marginBottom: '20px' }}>
          &larr; Назад
        </Button>

        <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Калибровка экрана</h1>

        <Card title="Шаг 1: Размер экрана">
          <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.7)' }}>
            Приложите банковскую карту к экрану и подгоните размер прямоугольника так,
            чтобы он точно совпадал с размером карты.
          </p>

          {/* Credit card reference */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: cardWidthPx,
                height: cardHeightPx,
                border: '3px solid #e94560',
                borderRadius: '12px',
                backgroundColor: 'rgba(233, 69, 96, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                transition: 'all 0.1s',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                {CARD_WIDTH_MM} x {CARD_HEIGHT_MM} мм
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                Кредитная карта
              </div>
            </div>
          </div>

          {/* Width slider */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Ширина: {cardWidthPx} px
            </label>
            <input
              type="range"
              min="200"
              max="500"
              value={cardWidthPx}
              onChange={e => setCardWidthPx(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div
            style={{
              padding: '12px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          >
            Определённый DPI: <strong>{dpi}</strong> точек/дюйм
          </div>
        </Card>

        <Card title="Шаг 2: Расстояние до экрана">
          <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.7)' }}>
            Укажите расстояние, на котором вы будете находиться от экрана во время теста.
            Рекомендуемое расстояние: 30-50 см.
          </p>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Расстояние: {screenDistance} см
            </label>
            <input
              type="range"
              min="20"
              max="100"
              value={screenDistance}
              onChange={e => setScreenDistance(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <div
              style={{
                padding: '12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                Пикселей на градус
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {pixelsPerDegree.toFixed(1)}
              </div>
            </div>
            <div
              style={{
                padding: '12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                Размер 1° в пикселях
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {Math.round(pixelsPerDegree)} px
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
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
