import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SensitivityMap } from '../ui/SensitivityMap';
import { Screen, TestSession } from '../../types';
import { exportSession, exportAllSessions } from '../../hooks/useStorage';
import {
  formatDuration,
  formatDate,
  formatTime,
  formatFullDate,
  getMDColor,
  getVFIColor,
  formatMD,
} from '../../utils/formatting';

interface HistoryScreenProps {
  sessions: TestSession[];
  onNavigate: (screen: Screen) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
}

/**
 * Экран истории тестов
 */
export function HistoryScreen({
  sessions,
  onNavigate,
  onDeleteSession,
  onClearAll,
}: HistoryScreenProps) {
  const [selectedSession, setSelectedSession] = useState<TestSession | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleDelete = (id: string) => {
    if (window.confirm('Удалить этот тест?')) {
      onDeleteSession(id);
      if (selectedSession?.id === id) {
        setSelectedSession(null);
      }
    }
  };

  const handleClearAll = () => {
    if (confirmClear) {
      onClearAll();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  // Детальный просмотр сессии
  if (selectedSession) {
    return (
      <div className="min-h-screen bg-background text-gray-200 p-10 font-sans">
        <div className="max-w-[800px] mx-auto">
          <Button variant="ghost" onClick={() => setSelectedSession(null)} className="mb-5">
            &larr; Назад к списку
          </Button>

          <h1 className="mb-6 text-2xl font-bold">
            {selectedSession.eye} — {formatDate(selectedSession.date)}
          </h1>

          {/* Статистика */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <Card className="text-center !mb-0 !p-4">
              <div className="text-[11px] opacity-60">Паттерн</div>
              <div className="text-xl font-bold">{selectedSession.pattern}</div>
            </Card>
            <Card className="text-center !mb-0 !p-4">
              <div className="text-[11px] opacity-60">MD</div>
              <div
                className="text-xl font-bold"
                style={{ color: getMDColor(selectedSession.statistics.MD) }}
              >
                {formatMD(selectedSession.statistics.MD, 1)}
              </div>
            </Card>
            <Card className="text-center !mb-0 !p-4">
              <div className="text-[11px] opacity-60">PSD</div>
              <div className="text-xl font-bold">
                {selectedSession.statistics.PSD.toFixed(1)}
              </div>
            </Card>
            <Card className="text-center !mb-0 !p-4">
              <div className="text-[11px] opacity-60">VFI</div>
              <div
                className="text-xl font-bold"
                style={{ color: getVFIColor(selectedSession.statistics.VFI) }}
              >
                {selectedSession.statistics.VFI}%
              </div>
            </Card>
          </div>

          {/* Карта */}
          <Card title="Карта поля зрения">
            <SensitivityMap
              results={selectedSession.results}
              pattern={selectedSession.pattern}
              eye={selectedSession.eye}
              size={Math.min(450, window.innerWidth - 100)}
            />
          </Card>

          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => exportSession(selectedSession)}>
              Экспорт JSON
            </Button>
            <Button variant="danger" onClick={() => handleDelete(selectedSession.id)}>
              Удалить
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Список сессий
  return (
    <div className="min-h-screen bg-background text-gray-200 p-10 font-sans">
      <div className="max-w-[800px] mx-auto">
        <Button variant="ghost" onClick={() => onNavigate('home')} className="mb-5">
          &larr; Назад
        </Button>

        <div className="flex justify-between items-center mb-8">
          <h1 className="m-0 text-2xl font-bold">История тестов</h1>
          {sessions.length > 0 && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => exportAllSessions(sessions)}>
                Экспорт всех
              </Button>
              <Button
                variant={confirmClear ? 'danger' : 'ghost'}
                size="sm"
                onClick={handleClearAll}
              >
                {confirmClear ? 'Подтвердить удаление' : 'Очистить всё'}
              </Button>
            </div>
          )}
        </div>

        {sessions.length === 0 ? (
          <Card>
            <div className="text-center p-10 text-white/50">
              <div className="text-5xl mb-4">-</div>
              <div>История тестов пуста</div>
              <Button variant="primary" onClick={() => onNavigate('settings')} className="mt-6">
                Начать первый тест
              </Button>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map(session => {
              const duration = formatDuration(session.duration);

              return (
                <Card
                  key={session.id}
                  className="!mb-0 cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <div
                    onClick={() => setSelectedSession(session)}
                    className="grid grid-cols-[60px_1fr_auto] gap-4 items-center"
                  >
                    <div className="w-[60px] h-[60px] rounded-lg bg-secondary flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold">{session.eye}</div>
                      <div className="text-[10px] opacity-60">{session.pattern}</div>
                    </div>

                    <div>
                      <div className="font-bold mb-1">{formatFullDate(session.date)}</div>
                      <div className="text-xs text-white/60">
                        {formatTime(session.date)} • {duration} мин
                        {session.patientAge && ` • Возраст: ${session.patientAge}`}
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className="text-xl font-bold"
                        style={{ color: getMDColor(session.statistics.MD) }}
                      >
                        MD: {formatMD(session.statistics.MD, 1)}
                      </div>
                      <div className="text-[11px] opacity-60">
                        VFI: {session.statistics.VFI}%
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
