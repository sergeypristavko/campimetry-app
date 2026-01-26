import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SensitivityMap } from '../ui/SensitivityMap';
import { Screen, TestSession } from '../../types';
import { exportSession, exportAllSessions } from '../../hooks/useStorage';

interface HistoryScreenProps {
  sessions: TestSession[];
  onNavigate: (screen: Screen) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
}

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

  if (selectedSession) {
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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Button
            variant="ghost"
            onClick={() => setSelectedSession(null)}
            style={{ marginBottom: '20px' }}
          >
            &larr; Назад к списку
          </Button>

          <h1 style={{ marginBottom: '24px' }}>
            {selectedSession.eye} — {new Date(selectedSession.date).toLocaleDateString('ru-RU')}
          </h1>

          {/* Statistics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <Card style={{ textAlign: 'center', marginBottom: 0, padding: '16px' }}>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>Паттерн</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedSession.pattern}</div>
            </Card>
            <Card style={{ textAlign: 'center', marginBottom: 0, padding: '16px' }}>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>MD</div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color:
                    selectedSession.statistics.MD >= -2
                      ? '#4ade80'
                      : selectedSession.statistics.MD >= -6
                      ? '#facc15'
                      : '#f87171',
                }}
              >
                {selectedSession.statistics.MD > 0 ? '+' : ''}
                {selectedSession.statistics.MD.toFixed(1)}
              </div>
            </Card>
            <Card style={{ textAlign: 'center', marginBottom: 0, padding: '16px' }}>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>PSD</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {selectedSession.statistics.PSD.toFixed(1)}
              </div>
            </Card>
            <Card style={{ textAlign: 'center', marginBottom: 0, padding: '16px' }}>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>VFI</div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color:
                    selectedSession.statistics.VFI >= 95
                      ? '#4ade80'
                      : selectedSession.statistics.VFI >= 80
                      ? '#facc15'
                      : '#f87171',
                }}
              >
                {selectedSession.statistics.VFI}%
              </div>
            </Card>
          </div>

          {/* Map */}
          <Card title="Карта поля зрения">
            <SensitivityMap
              results={selectedSession.results}
              pattern={selectedSession.pattern}
              eye={selectedSession.eye}
              size={Math.min(450, window.innerWidth - 100)}
            />
          </Card>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => exportSession(selectedSession)}
            >
              Экспорт JSON
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(selectedSession.id)}
            >
              Удалить
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Button variant="ghost" onClick={() => onNavigate('home')} style={{ marginBottom: '20px' }}>
          &larr; Назад
        </Button>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <h1 style={{ margin: 0 }}>История тестов</h1>
          {sessions.length > 0 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => exportAllSessions(sessions)}
              >
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
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                <span role="img" aria-label="empty">
                  -
                </span>
              </div>
              <div>История тестов пуста</div>
              <Button
                variant="primary"
                onClick={() => onNavigate('settings')}
                style={{ marginTop: '24px' }}
              >
                Начать первый тест
              </Button>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sessions.map(session => {
              const date = new Date(session.date);
              const duration = Math.round(session.duration / 1000);
              const minutes = Math.floor(duration / 60);
              const seconds = duration % 60;

              return (
                <Card
                  key={session.id}
                  style={{
                    marginBottom: 0,
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                  }}
                >
                  <div
                    onClick={() => setSelectedSession(session)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr auto',
                      gap: '16px',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        backgroundColor: '#0f3460',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{session.eye}</div>
                      <div style={{ fontSize: '10px', opacity: 0.6 }}>{session.pattern}</div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {date.toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                        {date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} •{' '}
                        {minutes}:{seconds.toString().padStart(2, '0')} мин
                        {session.patientAge && ` • Возраст: ${session.patientAge}`}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color:
                            session.statistics.MD >= -2
                              ? '#4ade80'
                              : session.statistics.MD >= -6
                              ? '#facc15'
                              : '#f87171',
                        }}
                      >
                        MD: {session.statistics.MD > 0 ? '+' : ''}
                        {session.statistics.MD.toFixed(1)}
                      </div>
                      <div style={{ fontSize: '11px', opacity: 0.6 }}>
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
