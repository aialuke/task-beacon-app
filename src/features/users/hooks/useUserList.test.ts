import { renderHook, act } from '@testing-library/react-hooks';
import { useUserList } from './useUserList';
import * as api from '@/integrations/supabase/api/users.api';

describe('useUserList', () => {
  it('fetches users successfully', async () => {
    const users = [{ id: '1', email: 'a@test.com' }];
    vi.spyOn(api, 'getAllUsers').mockResolvedValue({ data: users, error: null });
    const { result, waitForNextUpdate } = renderHook(() => useUserList());
    await waitForNextUpdate();
    expect(result.current.users).toEqual(users);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    vi.spyOn(api, 'getAllUsers').mockResolvedValue({ data: null, error: new Error('fail') });
    const { result, waitForNextUpdate } = renderHook(() => useUserList());
    await waitForNextUpdate();
    expect(result.current.users).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('fail');
  });
}); 