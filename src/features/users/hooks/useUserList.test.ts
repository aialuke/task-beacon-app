import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useUserList } from './useUserList';
import { UserService } from '@/lib/api';
import type { User } from '@/types';

describe('useUserList', () => {
  it('fetches users successfully', async () => {
    const users: User[] = [{
      id: '1',
      email: 'a@test.com',
      role: 'user',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }];
    vi.spyOn(UserService, 'getAll').mockResolvedValue({ success: true, data: users, error: null });
    const { result } = renderHook(() => useUserList());
    await waitFor(() => {
      expect(result.current.users).toEqual(users);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('handles fetch error', async () => {
    vi.spyOn(UserService, 'getAll').mockResolvedValue({ success: false, data: null, error: { name: 'Error', message: 'fail' } });
    const { result } = renderHook(() => useUserList());
    await waitFor(() => {
      expect(result.current.users).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('fail');
    });
  });
});
