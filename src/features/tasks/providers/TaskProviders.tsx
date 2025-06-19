// === EXTERNAL LIBRARIES ===
import type { ReactNode } from 'react';

// === FEATURE CONTEXTS ===
import { TaskDataContextProvider } from '../context/TaskDataContext';
import { TaskUIContextProvider } from '../context/TaskUIContext';

interface TaskProvidersProps {
  children: ReactNode;
}

/**
 * Simplified task providers - Step 2.4 Revised
 *
 * Provides both task data and UI state contexts using standard patterns.
 * Removed complex unified system in favor of proven React patterns.
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
