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
      <TaskUIContextProvider>{children}</TaskUIContextProvider>
    </TaskDataContextProvider>
  );
}

// Removed unused convenience functions (useTaskFiltering, withTaskProviders)
// Components should use contexts directly for better clarity
