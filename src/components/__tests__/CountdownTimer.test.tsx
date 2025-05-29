import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CountdownTimer from '../CountdownTimer';
import { TaskStatus } from '@/types';

// Mock the TaskUIContext
vi.mock('@/features/tasks/context/TaskUIContext', () => ({
  useTaskUIContext: () => ({
    isMobile: false
  })
}));

// Mock useCountdown hook
vi.mock('@/hooks/useCountdown', () => ({
  useCountdown: () => ({
    timeDisplay: '5',
    dashOffset: 50,
    tooltipContent: 'Due in 5 days',
    ariaLabel: 'Task timer: 5 days remaining'
  })
}));

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders timer with pending status', () => {
    render(
      <CountdownTimer 
        dueDate="2025-06-05T10:00:00Z" 
        status="pending" 
        size={48}
        priority="medium"
      />
    );

    expect(screen.getByRole('timer')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders checkmark for completed tasks', () => {
    vi.doMock('@/hooks/useCountdown', () => ({
      useCountdown: () => ({
        timeDisplay: '',
        dashOffset: 0,
        tooltipContent: 'Task completed',
        ariaLabel: 'Task timer: Completed'
      })
    }));

    render(
      <CountdownTimer 
        dueDate="2025-06-05T10:00:00Z" 
        status="complete" 
        size={48}
        priority="medium"
      />
    );

    const svg = screen.getByRole('timer').querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies correct size and priority styling', () => {
    render(
      <CountdownTimer 
        dueDate="2025-06-05T10:00:00Z" 
        status="pending" 
        size={64}
        priority="high"
      />
    );

    const timer = screen.getByRole('timer');
    expect(timer).toHaveStyle({ width: '76.8px', height: '76.8px' }); // 64 * 1.2 for high priority
  });

  it('handles null due date gracefully', () => {
    render(
      <CountdownTimer 
        dueDate={null} 
        status="pending" 
        size={48}
        priority="medium"
      />
    );

    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <CountdownTimer 
        dueDate="2025-06-05T10:00:00Z" 
        status="pending" 
        size={48}
        priority="medium"
      />
    );

    const timer = screen.getByRole('timer');
    expect(timer).toHaveAttribute('tabIndex', '0');
    expect(timer).toHaveAttribute('aria-label', 'Task timer: 5 days remaining');
  });
});
