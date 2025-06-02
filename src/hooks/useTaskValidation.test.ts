import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTaskValidation } from './useTaskValidation';

describe('useTaskValidation', () => {
  it('validates a valid task', () => {
    const { result } = renderHook(() => useTaskValidation());
    const validTask = { title: 'Test', description: '', url_link: '', due_date: '' };
    const validation = result.current.validateTask(validTask);
    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  it('invalidates a task with empty title', () => {
    const { result } = renderHook(() => useTaskValidation());
    const invalidTask = { title: '', description: '', url_link: '', due_date: '' };
    const validation = result.current.validateTask(invalidTask);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
}); 