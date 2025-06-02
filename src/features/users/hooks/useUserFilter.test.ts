import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useUserFilter } from './useUserFilter';
import type { User } from '@/types';

describe('useUserFilter', () => {
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'user',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      role: 'user',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  it('filters users by search term', () => {
    const { result } = renderHook(() => useUserFilter(mockUsers, 'John'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('John Doe');
  });

  it('returns all users when search term is empty', () => {
    const { result } = renderHook(() => useUserFilter(mockUsers, ''));
    expect(result.current).toHaveLength(2);
  });

  it('filters by email', () => {
    const { result } = renderHook(() => useUserFilter(mockUsers, 'jane@'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].email).toBe('jane@example.com');
  });

  it('respects limit parameter', () => {
    const { result } = renderHook(() => useUserFilter(mockUsers, '', 1));
    expect(result.current).toHaveLength(1);
  });
});

