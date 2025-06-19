// === EXTERNAL LIBRARIES ===
import type { ReactNode } from 'react';

// === FEATURE CONTEXTS ===
import { TaskDataContextProvider } from '../context/TaskDataContext';
import { TaskUIContextProvider } from '../context/TaskUIContext';

interface TaskProvidersProps {
  children: ReactNode;
}

/**
 * Optimized task providers - Phase 2 Refactored
 *
 * Provides selective context provision to prevent unnecessary re-renders.
 * Data and UI contexts are separated to isolate UI-only components from data changes.
 */
export function TaskProviders({ children }: TaskProvidersProps) {
  return (
    <TaskDataContextProvider>
      <TaskUIContextProvider>
        {children}
      </TaskUIContextProvider>
    </TaskDataContextProvider>
  );
}

/**
 * UI-only task provider for components that don't need data context
 * Prevents unnecessary re-renders when data changes but UI state doesn't
 */
export function TaskUIProvider({ children }: TaskProvidersProps) {
  return (
    <TaskUIContextProvider>
      {children}
    </TaskUIContextProvider>
  );
}

/**
 * Data-only task provider for components that don't need UI context
 * Prevents unnecessary re-renders when UI state changes but data doesn't
 */
export function TaskDataProvider({ children }: TaskProvidersProps) {
  return (
    <TaskDataContextProvider>
      {children}
    </TaskDataContextProvider>
  );
}

// Removed unused convenience functions (useTaskFiltering, withTaskProviders)
// Components should use contexts directly for better clarity
