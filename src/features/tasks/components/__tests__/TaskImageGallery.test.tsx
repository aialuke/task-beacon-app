import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import type { Task } from '@/types';

import { TaskImageGallery } from '../display/TaskImageGallery';

// Mock the image preview hook
vi.mock('../hooks/useImagePreview', () => ({
  useImagePreview: () => ({
    isPreviewOpen: false,
    previewImageUrl: null,
    openPreview: vi.fn(),
    closePreview: vi.fn(),
  }),
}));

describe('TaskImageGallery', () => {
  const mockTask: Task = {
    id: 'test-id',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    photo_url: 'https://example.com/image.jpg',
    url_link: null,
    due_date: null,
    owner_id: 'user-1',
    assignee_id: null,
    parent_task_id: null,
    parent_task: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  it('renders image when photo_url is provided', () => {
    render(<TaskImageGallery task={mockTask} />);

    const image = screen.getByRole('img', { name: /task image/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('does not render when no photo_url is provided', () => {
    const taskWithoutImage = { ...mockTask, photo_url: null };
    const { container } = render(<TaskImageGallery task={taskWithoutImage} />);

    expect(container.firstChild).toBeNull();
  });

  it('applies correct accessibility attributes', () => {
    render(<TaskImageGallery task={mockTask} />);

    const button = screen.getByRole('button', { name: /view task image/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'View task image');
  });
});
