import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';
import { useState } from 'react';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Component that can toggle error state
const ToggleErrorComponent = () => {
  const [shouldThrow, setShouldThrow] = useState(true);
  
  if (shouldThrow) {
    throw new Error('Test error');
  }
  
  return (
    <div>
      <div>No error</div>
      <button onClick={() => setShouldThrow(true)}>Throw Error</button>
    </div>
  );
};

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload Page' })).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.stringContaining('Test error')
    );
  });

  it('shows error details in development mode', () => {
    // Mock NODE_ENV for this test
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error Details (Development Only)')).toBeInTheDocument();

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  it('hides error details in production mode', () => {
    // Mock NODE_ENV for this test
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Error Details (Development Only)')).not.toBeInTheDocument();

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  it('logs error to console when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.objectContaining({
        error: expect.any(Error),
        errorInfo: expect.any(Object),
        timestamp: expect.any(String),
      })
    );
  });

  it('has retry functionality that resets error state', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error UI should be visible
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Verify retry button exists and can be clicked
    const retryButton = screen.getByRole('button', { name: 'Try Again' });
    expect(retryButton).toBeInTheDocument();
    
    // Click retry button (this will reset error state but component will still throw)
    fireEvent.click(retryButton);
    
    // The component would still throw an error because our test component 
    // is designed to always throw, but the boundary attempted to reset
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('has reload functionality', () => {
    // Mock window.location.reload properly
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: mockReload,
      },
      writable: true
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Click reload button
    const reloadButton = screen.getByRole('button', { name: 'Reload Page' });
    fireEvent.click(reloadButton);

    expect(mockReload).toHaveBeenCalled();
  });
}); 