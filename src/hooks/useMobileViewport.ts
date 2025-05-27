
import { useState, useEffect } from 'react';

interface MobileViewportState {
  keyboardVisible: boolean;
  viewportHeight: number;
  safeAreaTop: number;
  safeAreaBottom: number;
}

export function useMobileViewport(): MobileViewportState {
  const [state, setState] = useState<MobileViewportState>({
    keyboardVisible: false,
    viewportHeight: window.innerHeight,
    safeAreaTop: 0,
    safeAreaBottom: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const keyboardVisible = currentHeight < state.viewportHeight * 0.75;
      
      setState(prev => ({
        ...prev,
        keyboardVisible,
        viewportHeight: currentHeight,
        safeAreaTop: parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0,
        safeAreaBottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0,
      }));
    };

    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        const keyboardVisible = window.visualViewport.height < window.innerHeight * 0.75;
        setState(prev => ({
          ...prev,
          keyboardVisible,
          viewportHeight: window.visualViewport.height,
        }));
      }
    };

    // Listen for viewport changes
    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    }

    // Initial setup
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      }
    };
  }, [state.viewportHeight]);

  return state;
}
