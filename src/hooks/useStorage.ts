/**
 * Хук для работы с локальным хранилищем
 * Управляет сессиями тестирования и настройками приложения
 */

import { useState, useEffect, useCallback } from 'react';
import { TestSession, AppSettings } from '../types';

const SESSIONS_KEY = 'campimetry_sessions';
const SETTINGS_KEY = 'campimetry_settings';

/** Настройки по умолчанию */
const defaultSettings: AppSettings = {
  stimulusSizeGoldmann: 'III',
  stimulusColor: '#ffffff',
  backgroundColor: '#808080',
  stimulusDuration: 300,
  responseTimeout: 2000,
  soundEnabled: false,
};

interface UseStorageReturn {
  // Сессии
  sessions: TestSession[];
  addSession: (session: TestSession) => void;
  deleteSession: (id: string) => void;
  getSession: (id: string) => TestSession | undefined;
  clearAllSessions: () => void;
  // Настройки
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

export function useStorage(): UseStorageReturn {
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Загрузка данных из localStorage при монтировании
  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem(SESSIONS_KEY);
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }

      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
      }
    } catch {
      // Игнорируем ошибки парсинга
    }
  }, []);

  // Сохранение сессий в localStorage
  const saveSessions = useCallback((newSessions: TestSession[]) => {
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(newSessions));
    } catch {
      // Игнорируем ошибки сохранения
    }
  }, []);

  // Сохранение настроек в localStorage
  const saveSettings = useCallback((newSettings: AppSettings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch {
      // Игнорируем ошибки сохранения
    }
  }, []);

  // Добавление новой сессии
  const addSession = useCallback(
    (session: TestSession) => {
      setSessions(prev => {
        const newSessions = [session, ...prev];
        saveSessions(newSessions);
        return newSessions;
      });
    },
    [saveSessions]
  );

  // Удаление сессии
  const deleteSession = useCallback(
    (id: string) => {
      setSessions(prev => {
        const newSessions = prev.filter(s => s.id !== id);
        saveSessions(newSessions);
        return newSessions;
      });
    },
    [saveSessions]
  );

  // Получение сессии по ID
  const getSession = useCallback(
    (id: string): TestSession | undefined => {
      return sessions.find(s => s.id === id);
    },
    [sessions]
  );

  // Очистка всех сессий
  const clearAllSessions = useCallback(() => {
    setSessions([]);
    localStorage.removeItem(SESSIONS_KEY);
  }, []);

  // Обновление настроек
  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      setSettings(prev => {
        const newSettings = { ...prev, ...updates };
        saveSettings(newSettings);
        return newSettings;
      });
    },
    [saveSettings]
  );

  // Сброс настроек к значениям по умолчанию
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
  }, [saveSettings]);

  return {
    sessions,
    addSession,
    deleteSession,
    getSession,
    clearAllSessions,
    settings,
    updateSettings,
    resetSettings,
  };
}

/**
 * Генерирует уникальный ID для сессии
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Экспортирует сессию в JSON-файл
 */
export function exportSession(session: TestSession): void {
  const dataStr = JSON.stringify(session, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `campimetry_${session.eye}_${session.date.split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Экспортирует все сессии в JSON-файл
 */
export function exportAllSessions(sessions: TestSession[]): void {
  const dataStr = JSON.stringify(sessions, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `campimetry_all_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
