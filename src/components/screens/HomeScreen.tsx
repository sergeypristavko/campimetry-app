import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Screen } from '../../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  isCalibrated: boolean;
  sessionsCount: number;
}

/**
 * Главный экран приложения
 */
export function HomeScreen({ onNavigate, isCalibrated, sessionsCount }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-background text-gray-200 p-10 font-sans">
      <div className="max-w-xl mx-auto">
        <h1 className="text-center mb-4 text-3xl font-bold">Кампиметрия</h1>
        <p className="text-center mb-10 text-white/60 text-sm">
          Исследование поля зрения
        </p>

        <Card>
          <div className="flex flex-col gap-4">
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
                <span className="bg-primary px-2 py-0.5 rounded-xl text-xs ml-2">
                  {sessionsCount}
                </span>
              )}
            </Button>
          </div>
        </Card>

        <Card title="О программе">
          <p className="leading-relaxed mb-4 text-white/80">
            Программа для исследования полей зрения методом статической периметрии.
            Позволяет выявить дефекты поля зрения при различных заболеваниях глаз.
          </p>
          <div className="text-sm text-white/60 mb-4">
            <div className="mb-2">
              <strong>Доступные паттерны:</strong> 24-2, 10-2, 30-2
            </div>
            <div className="mb-2">
              <strong>Стратегии:</strong> пороговая, надпороговая
            </div>
            <div>
              <strong>Статистика:</strong> MD, PSD, VFI
            </div>
          </div>
          <a
            href="docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Продуктовая документация
          </a>
        </Card>

        <Card className="bg-[#2d1f1f] border border-[#5c2323]">
          <div className="text-[13px] text-danger">
            <strong>Внимание!</strong> Данное приложение предназначено только для
            ознакомительных и образовательных целей. Оно не является медицинским
            устройством и не может заменить профессиональную диагностику у
            врача-офтальмолога.
          </div>
        </Card>

        {!isCalibrated && (
          <div className="text-center p-4 bg-gray-800 rounded-lg mt-5">
            <div className="text-sm text-warning mb-2">Требуется калибровка</div>
            <div className="text-xs text-white/50">
              Для точного отображения стимулов необходимо выполнить калибровку экрана
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
