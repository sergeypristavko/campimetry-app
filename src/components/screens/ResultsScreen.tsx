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
import { exportSessionToPDF } from '../../utils/pdf';
import {
  formatDuration,
  formatDate,
  formatTime,
  getMDColor,
  getPSDColor,
  getVFIColor,
  getGHTLabel,
  getGHTColor,
  formatMD,
} from '../../utils/formatting';

interface ResultsScreenProps {
  session: TestSession;
  onNavigate: (screen: Screen) => void;
  onSaveSession: (session: TestSession) => void;
}

/**
 * Экран результатов теста
 */
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

  const duration = formatDuration(session.duration);

  return (
    <div className="min-h-screen bg-background text-gray-200 p-10 font-sans">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-center mb-8 text-2xl font-bold">Результаты теста</h1>

        {/* Карточки сводки */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mb-6">
          <Card className="text-center !mb-0">
            <div className="text-xs opacity-60 mb-1">Глаз</div>
            <div className="text-3xl font-bold">{session.eye}</div>
            <div className="text-xs opacity-60">
              {session.eye === 'OD' ? 'Правый' : 'Левый'}
            </div>
          </Card>

          <Card className="text-center !mb-0">
            <div className="text-xs opacity-60 mb-1">Паттерн</div>
            <div className="text-3xl font-bold">{session.pattern}</div>
            <div className="text-xs opacity-60">{session.results.length} точек</div>
          </Card>

          <Card className="text-center !mb-0">
            <div className="text-xs opacity-60 mb-1">Длительность</div>
            <div className="text-3xl font-bold">{duration}</div>
            <div className="text-xs opacity-60">мин:сек</div>
          </Card>

          <Card className="text-center !mb-0">
            <div className="text-xs opacity-60 mb-1">Дата</div>
            <div className="text-xl font-bold">{formatDate(session.date)}</div>
            <div className="text-xs opacity-60">{formatTime(session.date)}</div>
          </Card>
        </div>

        {/* Статистика */}
        <Card title="Статистика">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-5 bg-secondary rounded-lg text-center">
              <div className="text-xs opacity-60 mb-2">MD (Mean Deviation)</div>
              <div className="text-3xl font-bold" style={{ color: getMDColor(statistics.MD) }}>
                {formatMD(statistics.MD)}
              </div>
              <div className="text-[11px] opacity-70 mt-1">{interpretMD(statistics.MD)}</div>
            </div>

            <div className="p-5 bg-secondary rounded-lg text-center">
              <div className="text-xs opacity-60 mb-2">PSD (Pattern Std Dev)</div>
              <div className="text-3xl font-bold" style={{ color: getPSDColor(statistics.PSD) }}>
                {statistics.PSD.toFixed(2)}
              </div>
              <div className="text-[11px] opacity-70 mt-1">{interpretPSD(statistics.PSD)}</div>
            </div>

            <div className="p-5 bg-secondary rounded-lg text-center">
              <div className="text-xs opacity-60 mb-2">VFI (Visual Field Index)</div>
              <div className="text-3xl font-bold" style={{ color: getVFIColor(statistics.VFI) }}>
                {statistics.VFI}%
              </div>
              <div className="text-[11px] opacity-70 mt-1">{interpretVFI(statistics.VFI)}</div>
            </div>
          </div>

          {statistics.GHT && (
            <div className="mt-4 p-3 bg-white/5 rounded-lg text-center">
              <span className="opacity-60">GHT: </span>
              <span className="font-bold" style={{ color: getGHTColor(statistics.GHT) }}>
                {getGHTLabel(statistics.GHT)}
              </span>
            </div>
          )}
        </Card>

        {/* Надёжность */}
        <Card title="Показатели надёжности">
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="text-xs opacity-60">Потери фиксации</div>
              <div className="text-lg font-bold">
                {reliability.fixationLosses}/{reliability.fixationLossesTotal}
              </div>
              <div className="text-[11px] opacity-50">
                {formatReliabilityPercent(reliability.fixationLosses, reliability.fixationLossesTotal)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs opacity-60">Ложноположительные</div>
              <div className="text-lg font-bold">
                {reliability.falsePositives}/{reliability.falsePositivesTotal}
              </div>
              <div className="text-[11px] opacity-50">
                {formatReliabilityPercent(reliability.falsePositives, reliability.falsePositivesTotal)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs opacity-60">Ложноотрицательные</div>
              <div className="text-lg font-bold">
                {reliability.falseNegatives}/{reliability.falseNegativesTotal}
              </div>
              <div className="text-[11px] opacity-50">
                {formatReliabilityPercent(reliability.falseNegatives, reliability.falseNegativesTotal)}
              </div>
            </div>
          </div>

          {!reliabilityOk && (
            <div className="p-2 px-3 bg-danger/10 border border-danger/30 rounded text-xs text-danger">
              Показатели надёжности ниже нормы. Результаты теста могут быть неточными.
            </div>
          )}
        </Card>

        {/* Карта поля зрения */}
        <Card title="Карта поля зрения">
          <div className="mb-4">
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowThresholds(true)}
                className={`px-4 py-2 text-white border-none rounded cursor-pointer ${
                  showThresholds ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                Чувствительность
              </button>
              <button
                onClick={() => setShowThresholds(false)}
                className={`px-4 py-2 text-white border-none rounded cursor-pointer ${
                  !showThresholds ? 'bg-primary' : 'bg-secondary'
                }`}
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

        {/* Действия */}
        <div className="flex gap-4 mt-6">
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
