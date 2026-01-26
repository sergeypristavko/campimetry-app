import { useState, useCallback } from 'react';
import { Screen, Eye, GridPattern, TestStrategy, TestSession } from './types';
import { useCalibration } from './hooks/useCalibration';
import { useStorage } from './hooks/useStorage';
import { useFullscreen } from './hooks/useFullscreen';
import { useTest } from './hooks/useTest';
import { HomeScreen } from './components/screens/HomeScreen';
import { CalibrationScreen } from './components/screens/CalibrationScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { InstructionScreen } from './components/screens/InstructionScreen';
import { TestScreen } from './components/screens/TestScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [testConfig, setTestConfig] = useState<{
    eye: Eye;
    pattern: GridPattern;
    strategy: TestStrategy;
    age?: number;
  }>({
    eye: 'OD',
    pattern: '24-2',
    strategy: 'threshold',
  });
  const [completedSession, setCompletedSession] = useState<TestSession | null>(null);

  // Hooks
  const calibration = useCalibration();
  const storage = useStorage();
  const fullscreen = useFullscreen();

  // Handle test completion
  const handleTestComplete = useCallback((session: TestSession) => {
    setCompletedSession(session);
    setScreen('results');
    fullscreen.exitFullscreen();
  }, [fullscreen]);

  // Test hook - only used during test
  const test = useTest({
    eye: testConfig.eye,
    pattern: testConfig.pattern,
    strategy: testConfig.strategy,
    settings: storage.settings,
    pixelsPerDegree: calibration.pixelsPerDegree,
    patientAge: testConfig.age,
    onComplete: handleTestComplete,
  });

  // Handle start test from settings
  const handleConfigureTest = (eye: Eye, pattern: GridPattern, strategy: TestStrategy, age?: number) => {
    setTestConfig({ eye, pattern, strategy, age });
  };

  // Handle start test from instruction
  const handleStartTest = useCallback(() => {
    test.startTest();
    setScreen('test');
  }, [test]);

  // Handle save session
  const handleSaveSession = useCallback((session: TestSession) => {
    storage.addSession(session);
  }, [storage]);

  // Navigation
  const navigate = useCallback((newScreen: Screen) => {
    setScreen(newScreen);
  }, []);

  // Render current screen
  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          onNavigate={navigate}
          isCalibrated={calibration.isCalibrated}
          sessionsCount={storage.sessions.length}
        />
      );

    case 'calibration':
      return (
        <CalibrationScreen
          onNavigate={navigate}
          cardWidthPx={calibration.cardWidthPx}
          setCardWidthPx={calibration.setCardWidthPx}
          screenDistance={calibration.screenDistance}
          setScreenDistance={calibration.setScreenDistance}
          dpi={calibration.dpi}
          pixelsPerDegree={calibration.pixelsPerDegree}
          saveCalibration={calibration.saveCalibration}
        />
      );

    case 'settings':
      return (
        <SettingsScreen
          onNavigate={navigate}
          settings={storage.settings}
          updateSettings={storage.updateSettings}
          onStartTest={handleConfigureTest}
        />
      );

    case 'instruction':
      return (
        <InstructionScreen
          onNavigate={navigate}
          eye={testConfig.eye}
          screenDistance={calibration.screenDistance}
          onStartTest={handleStartTest}
        />
      );

    case 'test':
      return (
        <TestScreen
          eye={testConfig.eye}
          settings={storage.settings}
          isRunning={test.isRunning}
          isPaused={test.isPaused}
          showStimulus={test.showStimulus}
          stimulusX={test.stimulusX}
          stimulusY={test.stimulusY}
          stimulusOpacity={test.stimulusOpacity}
          progress={test.progress}
          completedPoints={test.completedPoints}
          totalPoints={test.totalPoints}
          pixelsPerDegree={calibration.pixelsPerDegree}
          onResponse={test.recordResponse}
          onPause={test.pauseTest}
          onResume={test.resumeTest}
          onAbort={() => {
            test.abortTest();
            fullscreen.exitFullscreen();
            navigate('home');
          }}
          enterFullscreen={fullscreen.enterFullscreen}
          isFullscreen={fullscreen.isFullscreen}
        />
      );

    case 'results':
      if (!completedSession) {
        navigate('home');
        return null;
      }
      return (
        <ResultsScreen
          session={completedSession}
          onNavigate={navigate}
          onSaveSession={handleSaveSession}
        />
      );

    case 'history':
      return (
        <HistoryScreen
          sessions={storage.sessions}
          onNavigate={navigate}
          onDeleteSession={storage.deleteSession}
          onClearAll={storage.clearAllSessions}
        />
      );

    default:
      return null;
  }
}

export default App;
