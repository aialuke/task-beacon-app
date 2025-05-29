import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TimerRing from '../TimerRing';
import { TaskStatus } from '@/types';

describe('TimerRing', () => {
  const defaultProps = {
    size: 48,
    radius: 20,
    circumference: 125.66,
    strokeDashoffset: 50,
    status: 'pending' as TaskStatus,
  };

  it('renders SVG with correct dimensions', () => {
    const { container } = render(<TimerRing {...defaultProps} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '48');
    expect(svg).toHaveAttribute('height', '48');
    expect(svg).toHaveAttribute('viewBox', '0 0 48 48');
  });

  it('renders background and progress circles', () => {
    const { container } = render(<TimerRing {...defaultProps} />);

    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(2); // Background + progress circle
  });

  it('applies correct gradient for pending status', () => {
    const { container } = render(
      <TimerRing {...defaultProps} status="pending" />
    );

    const progressCircle = container.querySelector(
      'circle[stroke="url(#gradientPending)"]'
    );
    expect(progressCircle).toBeInTheDocument();
  });

  it('applies correct gradient for overdue status', () => {
    const { container } = render(
      <TimerRing {...defaultProps} status="overdue" />
    );

    const progressCircle = container.querySelector(
      'circle[stroke="url(#gradientOverdue)"]'
    );
    expect(progressCircle).toBeInTheDocument();
  });

  it('applies correct gradient for complete status', () => {
    const { container } = render(
      <TimerRing {...defaultProps} status="complete" />
    );

    const progressCircle = container.querySelector(
      'circle[stroke="url(#gradientComplete)"]'
    );
    expect(progressCircle).toBeInTheDocument();
  });

  it('has proper stroke width for overdue status', () => {
    const { container } = render(
      <TimerRing {...defaultProps} status="overdue" />
    );

    const progressCircle = container.querySelector(
      'circle[stroke="url(#gradientOverdue)"]'
    );
    expect(progressCircle).toHaveStyle({ strokeWidth: '5px' });
  });

  it('includes gradient definitions', () => {
    const { container } = render(<TimerRing {...defaultProps} />);

    expect(container.querySelector('#gradientPending')).toBeInTheDocument();
    expect(container.querySelector('#gradientOverdue')).toBeInTheDocument();
    expect(container.querySelector('#gradientComplete')).toBeInTheDocument();
  });
});
