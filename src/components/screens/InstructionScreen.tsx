import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Screen, Eye } from '../../types';

interface InstructionScreenProps {
  onNavigate: (screen: Screen) => void;
  eye: Eye;
  screenDistance: number;
  onStartTest: () => void;
}

/**
 * Экран инструкций перед тестом
 */
export function InstructionScreen({
  onNavigate,
  eye,
  screenDistance,
  onStartTest,
}: InstructionScreenProps) {
  const otherEye = eye === 'OD' ? 'левый' : 'правый';

  return (
    <div className="min-h-screen bg-background text-gray-200 p-10 font-sans">
      <div className="max-w-xl mx-auto">
        <Button variant="ghost" onClick={() => onNavigate('settings')} className="mb-5">
          &larr; Назад
        </Button>

        <h1 className="text-center mb-8 text-2xl font-bold">Инструкция</h1>

        <Card>
          <div className="text-center p-5 bg-primary/10 rounded-lg mb-6">
            <div className="text-sm opacity-70 mb-2">Тестируемый глаз</div>
            <div className="text-3xl font-bold">
              {eye === 'OD' ? 'Правый (OD)' : 'Левый (OS)'}
            </div>
          </div>
        </Card>

        <Card title="Подготовка">
          <ol className="leading-8 pl-6 m-0 text-white/90 list-decimal">
            <li>
              <strong>Закройте {otherEye} глаз</strong> или используйте повязку
            </li>
            <li>
              Расположитесь на расстоянии <strong>{screenDistance} см</strong> от экрана
            </li>
            <li>Убедитесь, что в комнате приглушённое освещение</li>
            <li>Снимите очки, если носите, или используйте контактные линзы</li>
          </ol>
        </Card>

        <Card title="Во время теста">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 p-4 bg-success/10 rounded-lg border border-success/30">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-lg flex-shrink-0">
                +
              </div>
              <div>
                <div className="font-bold mb-1">Смотрите на крестик в центре</div>
                <div className="text-[13px] opacity-80">
                  Не переводите взгляд на появляющиеся стимулы
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-primary/10 rounded-lg border border-primary/30">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-xs flex-shrink-0">
                Space
              </div>
              <div>
                <div className="font-bold mb-1">Нажимайте пробел при обнаружении стимула</div>
                <div className="text-[13px] opacity-80">
                  Также можно кликнуть мышью в любом месте экрана
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-sm text-white/70 leading-relaxed">
            <p className="mb-3">
              Стимулы будут появляться в разных частях поля зрения. Некоторые из них
              будут очень слабыми и трудно различимыми — это нормально.
            </p>
            <p className="m-0">
              Тест можно поставить на паузу в любой момент, нажав клавишу{' '}
              <kbd className="bg-secondary px-1.5 py-0.5 rounded text-xs">Escape</kbd>
            </p>
          </div>
        </Card>

        <Button variant="primary" fullWidth size="lg" onClick={onStartTest} className="mt-5">
          Начать тест
        </Button>
      </div>
    </div>
  );
}
