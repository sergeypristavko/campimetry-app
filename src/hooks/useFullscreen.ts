/**
 * Хук для управления полноэкранным режимом
 * Поддерживает различные браузерные API с вендорными префиксами
 */

import { useState, useEffect, useCallback, RefObject } from 'react';

interface UseFullscreenReturn {
  isFullscreen: boolean;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: () => Promise<void>;
  isSupported: boolean;
}

export function useFullscreen(elementRef?: RefObject<HTMLElement | null>): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Проверяем поддержку полноэкранного режима
  const isSupported = Boolean(
    typeof document !== 'undefined' &&
      (document.fullscreenEnabled ||
        (document as unknown as { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled ||
        (document as unknown as { mozFullScreenEnabled?: boolean }).mozFullScreenEnabled ||
        (document as unknown as { msFullscreenEnabled?: boolean }).msFullscreenEnabled)
  );

  // Обновляем состояние при изменении полноэкранного режима
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
        (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement;

      setIsFullscreen(!!fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Входим в полноэкранный режим
  const enterFullscreen = useCallback(async () => {
    const element = elementRef?.current || document.documentElement;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (
        (element as unknown as { webkitRequestFullscreen?: () => Promise<void> })
          .webkitRequestFullscreen
      ) {
        await (
          element as unknown as { webkitRequestFullscreen: () => Promise<void> }
        ).webkitRequestFullscreen();
      } else if (
        (element as unknown as { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen
      ) {
        await (
          element as unknown as { mozRequestFullScreen: () => Promise<void> }
        ).mozRequestFullScreen();
      } else if (
        (element as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen
      ) {
        await (
          element as unknown as { msRequestFullscreen: () => Promise<void> }
        ).msRequestFullscreen();
      }
    } catch {
      // Игнорируем ошибки входа в полноэкранный режим
    }
  }, [elementRef]);

  // Выходим из полноэкранного режима
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (
        (document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen
      ) {
        await (
          document as unknown as { webkitExitFullscreen: () => Promise<void> }
        ).webkitExitFullscreen();
      } else if (
        (document as unknown as { mozCancelFullScreen?: () => Promise<void> }).mozCancelFullScreen
      ) {
        await (
          document as unknown as { mozCancelFullScreen: () => Promise<void> }
        ).mozCancelFullScreen();
      } else if (
        (document as unknown as { msExitFullscreen?: () => Promise<void> }).msExitFullscreen
      ) {
        await (document as unknown as { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
      }
    } catch {
      // Игнорируем ошибки выхода из полноэкранного режима
    }
  }, []);

  // Переключаем полноэкранный режим
  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isSupported,
  };
}
