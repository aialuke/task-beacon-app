
import { useState, useEffect } from 'react';

interface MobileViewportState {
  keyboardVisible: boolean;
  viewportHeight: number;
  availableHeight: number;
  keyboardHeight: number;
  safeAreaTop: number;
  safeAreaBottom: number;
}

export function useMobileViewport(): MobileViewportState {
  const [state, setState] = useState<MobileViewportState>({
    keyboardVisible: false,
    viewportHeight: window.innerHeight,
    availableHeight: window.innerHeight,
    keyboardHeight: 0,
    safeAreaTop: 0,
    safeAreaBottom: 0,
  });

  useEffect(() => {
    let initialHeight = window.innerHeight;
    
    const updateViewportState = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const screenHeight = window.innerHeight;
      const keyboardHeight = Math.max(0, screenHeight - currentHeight);
      const keyboardVisible = keyboardHeight > 150; // Threshold for keyboard detection
      
      // Calculate available height above keyboard with padding
      const availableHeight = keyboardVisible ? currentHeight - 80 : currentHeight;
      
      setState({
        keyboardVisible,
        viewportHeight: currentHeight,
        availableHeight,
        keyboardHeight,
        safeAreaTop: parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0,
        safeAreaBottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0,
      });
    };

    const handleResize = () => {
      updateViewportState();
    };

    const handleVisualViewportChange = () => {
      updateViewportState();
    };

    // Listen for viewport changes
    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
      window.visualViewport.addEventListener('scroll', handleVisualViewportChange);
    }

    // Initial setup
    updateViewportState();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
        window.visualViewport.removeEventListener('scroll', handleVisualViewportChange);
      }
    };
  }, []);

  return state;
}
