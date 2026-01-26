import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Screen } from '../../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  isCalibrated: boolean;
  sessionsCount: number;
}

export function HomeScreen({ onNavigate, isCalibrated, sessionsCount }: HomeScreenProps) {
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
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '32px' }}>
          Кампиметрия
        </h1>
        <p
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px',
          }}
        >
          Исследование поля зрения
        </p>

        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => onNavigate(isCalibrated ? 'settings' : 'calibration')}
            >
              {isCalibrated ? 'Начать тест' : 'Калибровка экрана'}
            </Button>

            {isCalibrated && (
              <Button
                variant="secondary"
                fullWidth
                onClick={() => onNavigate('calibration')}
              >
                Перекалибровать экран
              </Button>
            )}

            <Button
              variant="secondary"
              fullWidth
              onClick={() => onNavigate('history')}
            >
              История тестов
              {sessionsCount > 0 && (
                <span
                  style={{
                    backgroundColor: '#e94560',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    marginLeft: '8px',
                  }}
                >
                  {sessionsCount}
                </span>
              )}
            </Button>
          </div>
        </Card>

        <Card title="О программе">
          <p style={{ lineHeight: '1.6', marginBottom: '16px', color: 'rgba(255,255,255,0.8)' }}>
            Программа для исследования полей зрения методом статической периметрии.
            Позволяет выявить дефекты поля зрения при различных заболеваниях глаз.
          </p>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Доступные паттерны:</strong> 24-2, 10-2, 30-2
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Стратегии:</strong> пороговая, надпороговая
            </div>
            <div>
              <strong>Статистика:</strong> MD, PSD, VFI
            </div>
          </div>
        </Card>

        <Card
          style={{
            backgroundColor: '#2d1f1f',
            border: '1px solid #5c2323',
          }}
        >
          <div style={{ fontSize: '13px', color: '#f87171' }}>
            <strong>Внимание!</strong> Данное приложение предназначено только для
            ознакомительных и образовательных целей. Оно не является медицинским
            устройством и не может заменить профессиональную диагностику у
            врача-офтальмолога.
          </div>
        </Card>

        {!isCalibrated && (
          <div
            style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: '#1f2937',
              borderRadius: '8px',
              marginTop: '20px',
            }}
          >
            <div style={{ fontSize: '14px', color: '#facc15', marginBottom: '8px' }}>
              Требуется калибровка
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              Для точного отображения стимулов необходимо выполнить калибровку экрана
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
