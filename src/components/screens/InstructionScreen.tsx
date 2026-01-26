import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Screen, Eye } from '../../types';

interface InstructionScreenProps {
  onNavigate: (screen: Screen) => void;
  eye: Eye;
  screenDistance: number;
  onStartTest: () => void;
}

export function InstructionScreen({
  onNavigate,
  eye,
  screenDistance,
  onStartTest,
}: InstructionScreenProps) {
  const otherEye = eye === 'OD' ? 'левый' : 'правый';

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
        <Button variant="ghost" onClick={() => onNavigate('settings')} style={{ marginBottom: '20px' }}>
          &larr; Назад
        </Button>

        <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Инструкция</h1>

        <Card>
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: 'rgba(233, 69, 96, 0.1)',
              borderRadius: '8px',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '8px' }}>
              Тестируемый глаз
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {eye === 'OD' ? 'Правый (OD)' : 'Левый (OS)'}
            </div>
          </div>
        </Card>

        <Card title="Подготовка">
          <ol
            style={{
              lineHeight: '2',
              paddingLeft: '24px',
              margin: 0,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            <li>
              <strong>Закройте {otherEye} глаз</strong> или используйте повязку
            </li>
            <li>
              Расположитесь на расстоянии <strong>{screenDistance} см</strong> от экрана
            </li>
            <li>
              Убедитесь, что в комнате приглушённое освещение
            </li>
            <li>
              Снимите очки, если носите, или используйте контактные линзы
            </li>
          </ol>
        </Card>

        <Card title="Во время теста">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px',
                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(74, 222, 128, 0.3)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#4ade80',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                +
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  Смотрите на крестик в центре
                </div>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>
                  Не переводите взгляд на появляющиеся стимулы
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px',
                backgroundColor: 'rgba(233, 69, 96, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(233, 69, 96, 0.3)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#e94560',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  flexShrink: 0,
                }}
              >
                Space
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  Нажимайте пробел при обнаружении стимула
                </div>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>
                  Также можно кликнуть мышью в любом месте экрана
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: '1.6',
            }}
          >
            <p style={{ marginBottom: '12px' }}>
              Стимулы будут появляться в разных частях поля зрения. Некоторые из них
              будут очень слабыми и трудно различимыми — это нормально.
            </p>
            <p style={{ margin: 0 }}>
              Тест можно поставить на паузу в любой момент, нажав клавишу <kbd
                style={{
                  backgroundColor: '#0f3460',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                Escape
              </kbd>
            </p>
          </div>
        </Card>

        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={onStartTest}
          style={{ marginTop: '20px' }}
        >
          Начать тест
        </Button>
      </div>
    </div>
  );
}
