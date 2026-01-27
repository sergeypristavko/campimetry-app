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

/**
 * Экран настроек теста
 */
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

  const eyeButtonClass = (selected: boolean) =>
    `flex-1 p-5 text-base font-bold rounded-lg cursor-pointer transition-all text-white ${
      selected
        ? 'border-2 border-primary bg-primary/20'
        : 'border-2 border-transparent bg-secondary'
    }`;

  const patternButtonClass = (selected: boolean) =>
    `p-4 text-left rounded-lg cursor-pointer transition-all text-white ${
      selected
        ? 'border-2 border-primary bg-primary/20'
        : 'border-2 border-transparent bg-secondary'
    }`;

  const strategyButtonClass = (selected: boolean) =>
    `flex-1 p-4 text-center rounded-lg cursor-pointer text-white ${
      selected
        ? 'border-2 border-primary bg-primary/20'
        : 'border-2 border-transparent bg-secondary'
    }`;

  return (
    <div className="min-h-screen bg-background text-gray-200 p-10 font-sans">
      <div className="max-w-xl mx-auto">
        <Button variant="ghost" onClick={() => onNavigate('home')} className="mb-5">
          &larr; Назад
        </Button>

        <h1 className="text-center mb-8 text-2xl font-bold">Настройки теста</h1>

        <Card title="Тестируемый глаз">
          <div className="flex gap-3">
            <button onClick={() => setEye('OD')} className={eyeButtonClass(eye === 'OD')}>
              <div className="text-2xl mb-1">OD</div>
              <div className="text-xs opacity-70">Правый глаз</div>
            </button>
            <button onClick={() => setEye('OS')} className={eyeButtonClass(eye === 'OS')}>
              <div className="text-2xl mb-1">OS</div>
              <div className="text-xs opacity-70">Левый глаз</div>
            </button>
          </div>
        </Card>

        <Card title="Паттерн тестирования">
          <div className="flex flex-col gap-2">
            {(['24-2', '10-2', '30-2'] as GridPattern[]).map(p => {
              const info = getPatternInfo(p);
              return (
                <button
                  key={p}
                  onClick={() => setPattern(p)}
                  className={patternButtonClass(pattern === p)}
                >
                  <div className="font-bold mb-1">{p}</div>
                  <div className="text-xs opacity-70">
                    {info.description} ({info.points} точек)
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card title="Стратегия">
          <div className="flex gap-3">
            <button
              onClick={() => setStrategy('threshold')}
              className={strategyButtonClass(strategy === 'threshold')}
            >
              <div className="font-bold mb-1">Пороговая</div>
              <div className="text-[11px] opacity-70">Точное измерение порога</div>
            </button>
            <button
              onClick={() => setStrategy('suprathreshold')}
              className={strategyButtonClass(strategy === 'suprathreshold')}
            >
              <div className="font-bold mb-1">Надпороговая</div>
              <div className="text-[11px] opacity-70">Быстрый скрининг</div>
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
            className="w-full p-3 text-base rounded-lg border-none bg-secondary text-white"
          />
          <div className="text-xs text-white/50 mt-2">
            Используется для расчёта возрастных норм
          </div>
        </Card>

        <Card title="Параметры стимула">
          <div className="grid gap-4">
            <div>
              <label className="block mb-2 text-sm">Размер стимула (Goldmann):</label>
              <select
                value={settings.stimulusSizeGoldmann}
                onChange={e =>
                  updateSettings({
                    stimulusSizeGoldmann: e.target.value as AppSettings['stimulusSizeGoldmann'],
                  })
                }
                className="w-full p-2.5 text-base rounded-md border-none bg-secondary text-gray-200"
              >
                <option value="I">I (0.108°)</option>
                <option value="II">II (0.217°)</option>
                <option value="III">III (0.431°) - стандарт</option>
                <option value="IV">IV (0.862°)</option>
                <option value="V">V (1.724°)</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Длительность стимула: {settings.stimulusDuration} мс
              </label>
              <input
                type="range"
                min="100"
                max="500"
                step="50"
                value={settings.stimulusDuration}
                onChange={e => updateSettings({ stimulusDuration: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Время ожидания ответа: {settings.responseTimeout} мс
              </label>
              <input
                type="range"
                min="1000"
                max="3000"
                step="100"
                value={settings.responseTimeout}
                onChange={e => updateSettings({ responseTimeout: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        <div className="p-4 bg-white/5 rounded-lg mb-5 text-sm">
          <div className="mb-2">
            <strong>Выбранные параметры:</strong>
          </div>
          <div className="text-white/70">
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
