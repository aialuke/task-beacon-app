import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import UnifiedErrorBoundary from './UnifiedErrorBoundary';

// Component that throws an error for testing
function ThrowError(): React.ReactElement {
  throw new Error('Test error');
}

function WorkingComponent() {
  return <div>Working component</div>;
}

// Mock console.error to avoid noise in test output
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

describe('UnifiedErrorBoundary', () => {
  it('should render children when no error occurs', () => {
    render(
      <UnifiedErrorBoundary>
        <WorkingComponent />
      </UnifiedErrorBoundary>,
    );

    expect(screen.getByText('Working component')).toBeInTheDocument();
  });

  it('should render error UI when error occurs', () => {
    render(
      <UnifiedErrorBoundary>
        <ThrowError />
      </UnifiedErrorBoundary>,
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <UnifiedErrorBoundary fallback={customFallback}>
        <ThrowError />
      </UnifiedErrorBoundary>,
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should render page variant with correct styling', () => {
    render(
      <UnifiedErrorBoundary variant="page">
        <ThrowError />
      </UnifiedErrorBoundary>,
    );

    expect(screen.getByText(/application error/i)).toBeInTheDocument();
  });

  it('should render inline variant with correct styling', () => {
    render(
      <UnifiedErrorBoundary variant="inline">
        <ThrowError />
      </UnifiedErrorBoundary>,
    );

    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });

  it('should render custom title when provided', () => {
    const customTitle = 'Custom Error Title';

    render(
      <UnifiedErrorBoundary title={customTitle}>
        <ThrowError />
      </UnifiedErrorBoundary>,
    );

    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const onErrorMock = vi.fn();

    render(
      <UnifiedErrorBoundary onError={onErrorMock}>
        <ThrowError />
      </UnifiedErrorBoundary>,
    );

    expect(onErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      }),
    );
  });

  it('should reset error state when retry button is clicked', () => {
    let shouldThrow = true;

    function ConditionalThrowError() {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>Component recovered</div>;
    }

    const { rerender } = render(
      <UnifiedErrorBoundary>
        <ConditionalThrowError />
      </UnifiedErrorBoundary>,
    );

    // Error should be shown
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    // Stop throwing error
    shouldThrow = false;

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /try again/i });
    retryButton.click();

    // Re-render with the same component
    rerender(
      <UnifiedErrorBoundary>
        <ConditionalThrowError />
      </UnifiedErrorBoundary>,
    );

    // Component should recover
    expect(screen.getByText('Component recovered')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const customClass = 'custom-error-class';

    render(
      <UnifiedErrorBoundary className={customClass}>
        <ThrowError />
      </UnifiedErrorBoundary>,
    );

    // The className is applied to the outermost container div that contains the error UI
    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    const errorContainer = tryAgainButton.closest(
      '[class*="custom-error-class"]',
    );
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveClass(customClass);
  });
});
