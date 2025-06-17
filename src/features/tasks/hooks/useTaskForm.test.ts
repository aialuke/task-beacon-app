import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useTaskForm } from './useTaskForm';

describe('useTaskForm', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTaskForm());

    expect(result.current.title).toBe('');
    expect(result.current.description).toBe('');
    expect(result.current.dueDate).toBe('');
    expect(result.current.url).toBe('');
    expect(result.current.assigneeId).toBe('');
    expect(result.current.isValid).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should initialize with provided initial values', () => {
    const initialValues = {
      initialTitle: 'Test Task',
      initialDescription: 'Test Description',
      initialDueDate: '2024-12-31',
      initialUrl: 'https://example.com',
      initialAssigneeId: 'user-123',
    };

    const { result } = renderHook(() => useTaskForm(initialValues));

    expect(result.current.title).toBe('Test Task');
    expect(result.current.description).toBe('Test Description');
    expect(result.current.dueDate).toBe('2024-12-31');
    expect(result.current.url).toBe('https://example.com');
    expect(result.current.assigneeId).toBe('user-123');
  });

  it('should update title and validate form', () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.setTitle('Test Task');
    });

    expect(result.current.title).toBe('Test Task');
    expect(result.current.isValid).toBe(true);
  });

  it('should update multiple fields using setFieldValue', () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.setFieldValue('title', 'New Title');
      result.current.setFieldValue('description', 'New Description');
      result.current.setFieldValue('dueDate', '2024-12-31');
    });

    expect(result.current.title).toBe('New Title');
    expect(result.current.description).toBe('New Description');
    expect(result.current.dueDate).toBe('2024-12-31');
  });

  it('should handle form submission successfully', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useTaskForm({ onSubmit: mockOnSubmit })
    );

    act(() => {
      result.current.setTitle('Test Task');
      result.current.setDescription('Test Description');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description',
      dueDate: '',
      url: '',
      assigneeId: '',
    });
  });

  it('should not submit when form is invalid', async () => {
    const mockOnSubmit = vi.fn();
    const { result } = renderHook(() =>
      useTaskForm({ onSubmit: mockOnSubmit })
    );

    // Don't set title, making form invalid
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should handle submission errors gracefully', async () => {
    const mockOnSubmit = vi
      .fn()
      .mockRejectedValue(new Error('Submission failed'));
    const { result } = renderHook(() =>
      useTaskForm({ onSubmit: mockOnSubmit })
    );

    act(() => {
      result.current.setTitle('Test Task');
    });

    // The handleSubmit function should catch errors internally and reset isSubmitting
    await act(async () => {
      // Don't expect this to throw since errors are handled internally
      await expect(result.current.handleSubmit()).resolves.toBeUndefined();
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should reset form state', () => {
    const mockOnClose = vi.fn();
    const { result } = renderHook(() =>
      useTaskForm({
        initialTitle: 'Initial Title',
        onClose: mockOnClose,
      })
    );

    act(() => {
      result.current.setTitle('Changed Title');
      result.current.setDescription('Some description');
    });

    act(() => {
      result.current.resetFormState();
    });

    expect(result.current.title).toBe('Initial Title');
    expect(result.current.description).toBe('');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should return correct task data', () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.setTitle('Test Task');
      result.current.setDescription('Test Description');
      result.current.setDueDate('2024-12-31');
      result.current.setUrl('https://example.com');
      result.current.setAssigneeId('user-123');
    });

    const taskData = result.current.getTaskData();

    expect(taskData).toEqual({
      title: 'Test Task',
      description: 'Test Description',
      due_date: '2024-12-31',
      photo_url: null,
      url_link: 'https://example.com',
      assignee_id: 'user-123',
    });
  });

  it('should handle empty optional fields in task data', () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.setTitle('Test Task');
    });

    const taskData = result.current.getTaskData();

    expect(taskData).toEqual({
      title: 'Test Task',
      description: undefined,
      due_date: undefined,
      photo_url: null,
      url_link: undefined,
      assignee_id: undefined,
    });
  });
});
