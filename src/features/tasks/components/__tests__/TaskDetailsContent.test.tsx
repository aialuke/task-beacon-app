import { renderWithProviders, screen } from '@/test/test-utils.tsx';
import { describe, it, expect } from 'vitest';

import type { Task } from '@/types';

import TaskDetailsContent from '../display/TaskDetailsContent';

describe('TaskDetailsContent', () => {
  const mockTask: Task = {
    id: 'test-id',
    title: 'Test Task',
    description: 'This is a test description',
    status: 'pending',
    photo_url: null,
    url_link: 'https://example.com',
    due_date: '2024-12-31T23:59:59Z',
    owner_id: 'user-1',
    assignee_id: null,
    parent_task_id: null,
    parent_task: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  it('renders task description when provided', () => {
    renderWithProviders(<TaskDetailsContent task={mockTask} />);

    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('renders URL link when provided', () => {
    renderWithProviders(<TaskDetailsContent task={mockTask} />);

    const link = screen.getByRole('link', { name: 'https://example.com' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('handles task without description gracefully', () => {
    const taskWithoutDescription = { ...mockTask, description: null };
    renderWithProviders(<TaskDetailsContent task={taskWithoutDescription} />);

    expect(
      screen.queryByText('This is a test description')
    ).not.toBeInTheDocument();
  });

  it('handles task without URL link gracefully', () => {
    const taskWithoutUrl = { ...mockTask, url_link: null };
    renderWithProviders(<TaskDetailsContent task={taskWithoutUrl} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
