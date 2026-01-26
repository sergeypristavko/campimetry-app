import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Screen, Eye, GridPattern, TestStrategy, AppSettings } from '../../types';
import { getPatternInfo } from '../../utils/gridPatterns';

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  onStartTest: (eye: Eye, pattern: GridPattern, strategy: TestStrategy, age?: number) => void;
}

export function SettingsScreen({
  onNavigate,
  settings,
  updateSettings,
  onStartTest,
}: SettingsScreenProps) {
  const [eye, setEye] = useState<Eye>('OD');
  const [pattern, setPattern] = useState<GridPattern>('24-2');
  const [strategy, setStrategy] = useState<TestStrategy>('threshold');
  const [patientAge, setPatientAge] = useState<string>('');

  const patternInfo = getPatternInfo(pattern);

  const handleStart = () => {
    const age = patientAge ? parseInt(patientAge, 10) : undefined;
    onStartTest(eye, pattern, strategy, age);
    onNavigate('instruction');
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
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Button variant="ghost" onClick={() => onNavigate('home')} style={{ marginBottom: '20px' }}>
          &larr; Назад
        </Button>

        <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Настройки теста</h1>

        <Card title="Тестируемый глаз">
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setEye('OD')}
              style={{
                flex: 1,
                padding: '20px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: eye === 'OD' ? '2px solid #e94560' : '2px solid transparent',
                borderRadius: '8px',
                backgroundColor: eye === 'OD' ? 'rgba(233, 69, 96, 0.2)' : '#0f3460',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>OD</div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>Правый глаз</div>
            </button>
            <button
              onClick={() => setEye('OS')}
              style={{
                flex: 1,
                padding: '20px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: eye === 'OS' ? '2px solid #e94560' : '2px solid transparent',
                borderRadius: '8px',
                backgroundColor: eye === 'OS' ? 'rgba(233, 69, 96, 0.2)' : '#0f3460',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>OS</div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>Левый глаз</div>
            </button>
          </div>
        </Card>

        <Card title="Паттерн тестирования">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(['24-2', '10-2', '30-2'] as GridPattern[]).map(p => {
              const info = getPatternInfo(p);
              return (
                <button
                  key={p}
                  onClick={() => setPattern(p)}
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    border: pattern === p ? '2px solid #e94560' : '2px solid transparent',
                    borderRadius: '8px',
                    backgroundColor: pattern === p ? 'rgba(233, 69, 96, 0.2)' : '#0f3460',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{p}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {info.description} ({info.points} точек)
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card title="Стратегия">
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setStrategy('threshold')}
              style={{
                flex: 1,
                padding: '16px',
                textAlign: 'center',
                border: strategy === 'threshold' ? '2px solid #e94560' : '2px solid transparent',
                borderRadius: '8px',
                backgroundColor: strategy === 'threshold' ? 'rgba(233, 69, 96, 0.2)' : '#0f3460',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Пороговая</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>Точное измерение порога</div>
            </button>
            <button
              onClick={() => setStrategy('suprathreshold')}
              style={{
                flex: 1,
                padding: '16px',
                textAlign: 'center',
                border: strategy === 'suprathreshold' ? '2px solid #e94560' : '2px solid transparent',
                borderRadius: '8px',
                backgroundColor: strategy === 'suprathreshold' ? 'rgba(233, 69, 96, 0.2)' : '#0f3460',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Надпороговая</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>Быстрый скрининг</div>
            </button>
          </div>
        </Card>

        <Card title="Возраст пациента (опционально)">
          <input
            type="number"
            min="5"
            max="100"
            placeholder="Возраст в годах"
            value={patientAge}
            onChange={e => setPatientAge(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#0f3460',
              color: '#fff',
            }}
          />
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
            Используется для расчёта возрастных норм
          </div>
        </Card>

        <Card title="Параметры стимула">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Размер стимула (Goldmann):
              </label>
              <select
                value={settings.stimulusSizeGoldmann}
                onChange={e =>
                  updateSettings({
                    stimulusSizeGoldmann: e.target.value as AppSettings['stimulusSizeGoldmann'],
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#0f3460',
                  color: '#eee',
                }}
              >
                <option value="I">I (0.108°)</option>
                <option value="II">II (0.217°)</option>
                <option value="III">III (0.431°) - стандарт</option>
                <option value="IV">IV (0.862°)</option>
                <option value="V">V (1.724°)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Длительность стимула: {settings.stimulusDuration} мс
              </label>
              <input
                type="range"
                min="100"
                max="500"
                step="50"
                value={settings.stimulusDuration}
                onChange={e => updateSettings({ stimulusDuration: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Время ожидания ответа: {settings.responseTimeout} мс
              </label>
              <input
                type="range"
                min="1000"
                max="3000"
                step="100"
                value={settings.responseTimeout}
                onChange={e => updateSettings({ responseTimeout: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </Card>

        <div
          style={{
            padding: '16px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <strong>Выбранные параметры:</strong>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)' }}>
            {eye === 'OD' ? 'Правый' : 'Левый'} глаз, паттерн {pattern}, {patternInfo.points} точек
          </div>
        </div>

        <Button variant="primary" fullWidth size="lg" onClick={handleStart}>
          Продолжить
        </Button>
      </div>
    </div>
  );
}
