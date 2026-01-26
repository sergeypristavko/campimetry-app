import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SensitivityMap, ColorScaleLegend } from '../ui/SensitivityMap';
import { Screen, TestSession } from '../../types';
import {
  interpretMD,
  interpretPSD,
  interpretVFI,
  formatReliabilityPercent,
  isReliabilityAcceptable,
} from '../../utils/statistics';
import { exportSessionToPDF } from '../../utils/pdfExport';

interface ResultsScreenProps {
  session: TestSession;
  onNavigate: (screen: Screen) => void;
  onSaveSession: (session: TestSession) => void;
}

export function ResultsScreen({ session, onNavigate, onSaveSession }: ResultsScreenProps) {
  const [showThresholds, setShowThresholds] = useState(true);
  const [saved, setSaved] = useState(false);

  const { statistics, reliability } = session;
  const reliabilityOk = isReliabilityAcceptable(reliability);

  const handleSave = () => {
    onSaveSession(session);
    setSaved(true);
  };

  const handleExport = () => {
    exportSessionToPDF(session);
  };

  const duration = Math.round(session.duration / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

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
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Результаты теста</h1>

        {/* Summary cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <Card style={{ textAlign: 'center', marginBottom: 0 }}>
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Глаз</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {session.eye}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.6 }}>
              {session.eye === 'OD' ? 'Правый' : 'Левый'}
            </div>
          </Card>

          <Card style={{ textAlign: 'center', marginBottom: 0 }}>
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Паттерн</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {session.pattern}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.6 }}>
              {session.results.length} точек
            </div>
          </Card>

          <Card style={{ textAlign: 'center', marginBottom: 0 }}>
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>
              Длительность
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.6 }}>мин:сек</div>
          </Card>

          <Card style={{ textAlign: 'center', marginBottom: 0 }}>
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Дата</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {new Date(session.date).toLocaleDateString('ru-RU')}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.6 }}>
              {new Date(session.date).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </Card>
        </div>

        {/* Statistics */}
        <Card title="Статистика">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
          >
            <div
              style={{
                padding: '20px',
                backgroundColor: '#0f3460',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>
                MD (Mean Deviation)
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: statistics.MD >= -2 ? '#4ade80' : statistics.MD >= -6 ? '#facc15' : '#f87171',
                }}
              >
                {statistics.MD > 0 ? '+' : ''}{statistics.MD.toFixed(2)}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
                {interpretMD(statistics.MD)}
              </div>
            </div>

            <div
              style={{
                padding: '20px',
                backgroundColor: '#0f3460',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>
                PSD (Pattern Std Dev)
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: statistics.PSD <= 2 ? '#4ade80' : statistics.PSD <= 4 ? '#facc15' : '#f87171',
                }}
              >
                {statistics.PSD.toFixed(2)}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
                {interpretPSD(statistics.PSD)}
              </div>
            </div>

            <div
              style={{
                padding: '20px',
                backgroundColor: '#0f3460',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>
                VFI (Visual Field Index)
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: statistics.VFI >= 95 ? '#4ade80' : statistics.VFI >= 80 ? '#facc15' : '#f87171',
                }}
              >
                {statistics.VFI}%
              </div>
              <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
                {interpretVFI(statistics.VFI)}
              </div>
            </div>
          </div>

          {statistics.GHT && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <span style={{ opacity: 0.6 }}>GHT: </span>
              <span
                style={{
                  fontWeight: 'bold',
                  color:
                    statistics.GHT === 'within normal'
                      ? '#4ade80'
                      : statistics.GHT === 'borderline'
                      ? '#facc15'
                      : '#f87171',
                }}
              >
                {statistics.GHT === 'within normal' && 'В пределах нормы'}
                {statistics.GHT === 'borderline' && 'Пограничный'}
                {statistics.GHT === 'outside normal' && 'За пределами нормы'}
                {statistics.GHT === 'general reduction' && 'Общее снижение'}
                {statistics.GHT === 'abnormally high' && 'Аномально высокий'}
              </span>
            </div>
          )}
        </Card>

        {/* Reliability */}
        <Card title="Показатели надёжности">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '12px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', opacity: 0.6 }}>Потери фиксации</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {reliability.fixationLosses}/{reliability.fixationLossesTotal}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.5 }}>
                {formatReliabilityPercent(reliability.fixationLosses, reliability.fixationLossesTotal)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', opacity: 0.6 }}>Ложноположительные</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {reliability.falsePositives}/{reliability.falsePositivesTotal}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.5 }}>
                {formatReliabilityPercent(reliability.falsePositives, reliability.falsePositivesTotal)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', opacity: 0.6 }}>Ложноотрицательные</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {reliability.falseNegatives}/{reliability.falseNegativesTotal}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.5 }}>
                {formatReliabilityPercent(reliability.falseNegatives, reliability.falseNegativesTotal)}
              </div>
            </div>
          </div>

          {!reliabilityOk && (
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: 'rgba(248, 113, 113, 0.1)',
                border: '1px solid rgba(248, 113, 113, 0.3)',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#f87171',
              }}
            >
              Показатели надёжности ниже нормы. Результаты теста могут быть неточными.
            </div>
          )}
        </Card>

        {/* Sensitivity Map */}
        <Card title="Карта поля зрения">
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowThresholds(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: showThresholds ? '#e94560' : '#0f3460',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Чувствительность
              </button>
              <button
                onClick={() => setShowThresholds(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: !showThresholds ? '#e94560' : '#0f3460',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Отклонение
              </button>
            </div>
          </div>

          <SensitivityMap
            results={session.results}
            pattern={session.pattern}
            eye={session.eye}
            showThresholds={showThresholds}
            size={Math.min(500, window.innerWidth - 100)}
          />

          <ColorScaleLegend showThresholds={showThresholds} />
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <Button variant="secondary" fullWidth onClick={() => onNavigate('home')}>
            На главную
          </Button>
          <Button
            variant={saved ? 'ghost' : 'primary'}
            fullWidth
            onClick={handleSave}
            disabled={saved}
          >
            {saved ? 'Сохранено' : 'Сохранить'}
          </Button>
          <Button variant="secondary" fullWidth onClick={handleExport}>
            Экспорт PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
