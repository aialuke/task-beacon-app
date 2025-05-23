
import React, { createContext, useContext, ReactNode } from 'react';

// Style object that will be consistently applied across components
const borderRadiusStyles = {
  borderRadius: 'var(--border-radius-xl)',
  borderWidth: '1px'
};

// Create a context with the styles
const BorderRadiusContext = createContext(borderRadiusStyles);

// Provider component
export function BorderRadiusProvider({ children }: { children: ReactNode }) {
  return (
    <BorderRadiusContext.Provider value={borderRadiusStyles}>
      {children}
    </BorderRadiusContext.Provider>
  );
}

// Custom hook to use the border radius styles
export function useBorderRadius() {
  return useContext(BorderRadiusContext);
}

// Utility function to apply border radius to any element
export function withRoundedBorders(style: React.CSSProperties = {}): React.CSSProperties {
  return {
    ...style,
    ...borderRadiusStyles
  };
}
