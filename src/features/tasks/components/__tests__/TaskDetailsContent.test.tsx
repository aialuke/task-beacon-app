import { screen, describe, it, expect, renderWithProviders } from '@/test';
import type { Task } from '@/types';

import { MemoryRouter } from 'react-router-dom';

import TaskDetailsContent from '../display/TaskDetailsContent';

const renderWithRouterAndProviders = (component: React.ReactElement) => {
  return renderWithProviders(<MemoryRouter>{component}</MemoryRouter>);
};

describe('TaskDetailsContent', () => {
  const mockTask: Task = {
    id: 'test-id',
    title: 'Test Task',
    description: 'This is a test task description',
    status: 'pending',
    photo_url: null,
    url_link: 'https://example.com',
    due_date: null,
    owner_id: 'user-1',
    assignee_id: null,
    parent_task_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  it('renders task description when provided', () => {
    renderWithRouterAndProviders(
      <TaskDetailsContent task={mockTask} isExpanded={true} />
    );

    expect(
      screen.getByText('This is a test task description')
    ).toBeInTheDocument();
  });

  it('renders URL link when provided', () => {
    renderWithRouterAndProviders(
      <TaskDetailsContent task={mockTask} isExpanded={true} />
    );

    const linkButton = screen.getByRole('button', {
      name: /open external link/i,
    });
    expect(linkButton).toBeInTheDocument();
  });

  it('handles task without description gracefully', () => {
    const taskWithoutDescription = { ...mockTask, description: null };
    renderWithRouterAndProviders(
      <TaskDetailsContent task={taskWithoutDescription} isExpanded={true} />
    );

    expect(
      screen.queryByText('This is a test task description')
    ).not.toBeInTheDocument();
  });

  it('handles task without URL link gracefully', () => {
    const taskWithoutUrl = { ...mockTask, url_link: null };
    renderWithRouterAndProviders(
      <TaskDetailsContent task={taskWithoutUrl} isExpanded={true} />
    );

    expect(
      screen.queryByRole('button', { name: /open external link/i })
    ).not.toBeInTheDocument();
  });
});
