import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { 
  renderWithProviders,
  renderWithAllProviders,
  renderWithTaskProviders,
  createMockContextValue,
  waitForContextUpdate,
  createContextValueTracker,
} from '../context-helpers';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTaskDataContext } from '@/features/tasks/context/TaskDataContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Example component that uses auth context
function AuthTestComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (user) return <div>Welcome, {user.email}</div>;
  return <div>Please log in</div>;
}

// Example component that uses theme context
function ThemeTestComponent() {
  const { theme, actualTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="actual-theme">{actualTheme}</span>
    </div>
  );
}

// Example component that uses task context
function TaskTestComponent() {
  const { tasks, isLoading, error } = useTaskDataContext();
  
  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <span data-testid="task-count">{tasks.length}</span>
      {tasks.map(task => (
        <div key={task.id} data-testid={`task-${task.id}`}>
          {task.title}
        </div>
      ))}
    </div>
  );
}

describe('Context Testing Helpers', () => {
  describe('renderWithProviders', () => {
    it('should render with theme provider only', () => {
      renderWithProviders(<ThemeTestComponent />, {
        includeTheme: true,
      });
      
      expect(screen.getByTestId('theme')).toBeInTheDocument();
      expect(screen.getByTestId('actual-theme')).toBeInTheDocument();
    });

    it('should render with multiple providers', () => {
      renderWithProviders(<ThemeTestComponent />, {
        includeTheme: true,
        includeRouter: true,
      });
      
      expect(screen.getByTestId('theme')).toBeInTheDocument();
    });
  });

  describe('renderWithTaskProviders', () => {
    it('should render task components with task providers', () => {
      renderWithTaskProviders(<TaskTestComponent />);
      
      // TaskDataContext provides empty array by default through useTaskQueries
      expect(screen.getByTestId('task-count')).toHaveTextContent('0');
    });
  });

  describe('context value utilities', () => {
    it('should create mock context values', () => {
      const defaultUser = { id: '1', email: 'test@example.com' };
      const mockValue = createMockContextValue(defaultUser, { 
        email: 'override@example.com' 
      });
      
      expect(mockValue).toEqual({
        id: '1',
        email: 'override@example.com',
      });
    });

    it('should track context value changes', () => {
      const tracker = createContextValueTracker<string>();
      
      tracker.track('initial');
      tracker.track('updated');
      tracker.track('final');
      
      expect(tracker.getValues()).toEqual(['initial', 'updated', 'final']);
      expect(tracker.getLastValue()).toBe('final');
      expect(tracker.count()).toBe(3);
      
      tracker.clear();
      expect(tracker.count()).toBe(0);
    });
  });

  describe('async context updates', () => {
    it('should wait for context updates', async () => {
      let value = 'initial';
      
      // Simulate async context update
      setTimeout(() => {
        value = 'updated';
      }, 0);
      
      await waitForContextUpdate();
      expect(value).toBe('updated');
    });
  });
});

// Example test showing error boundary testing
describe('Context Error Handling', () => {
  it('should handle context provider errors gracefully', () => {
    // Component that throws an error
    function ErrorComponent(): JSX.Element {
      throw new Error('Test error');
    }

    renderWithAllProviders(<ErrorComponent />);
    
    // The error boundary should catch and display the error
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});

// Example test showing context hook error handling
describe('Context Hook Validation', () => {
  it('should throw error when hook used outside provider', () => {
    function TestComponent() {
      useTaskDataContext(); // This should throw
      return <div>Should not render</div>;
    }

    expect(() => {
      renderWithProviders(<TestComponent />); // No task providers
    }).toThrow('useTaskDataContext must be used within a TaskDataContextProvider');
  });
});

// Example performance test
describe('Context Performance', () => {
  it('should not cause unnecessary re-renders', () => {
    let renderCount = 0;
    
    function CountingComponent() {
      renderCount++;
      const { theme } = useTheme();
      return <div>{theme}</div>;
    }

    const { rerender } = renderWithProviders(<CountingComponent />, {
      includeTheme: true,
    });

    expect(renderCount).toBe(1);
    
    // Re-render with same props should not cause context re-render
    rerender(<CountingComponent />);
    expect(renderCount).toBe(2); // Expected due to rerender call
  });
});
// CodeRabbit review
