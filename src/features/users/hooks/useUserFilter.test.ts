import { useUserFilter } from './useUserFilter';
import { renderHook } from '@testing-library/react-hooks';

describe('useUserFilter', () => {
  const users = [
    { id: '1', email: 'a@test.com', name: 'Alice' },
    { id: '2', email: 'b@test.com', name: 'Bob' },
    { id: '3', email: 'c@test.com', name: 'Carol' },
  ];

  it('returns all users if searchTerm is empty', () => {
    const { result } = renderHook(() => useUserFilter(users, '', 2));
    expect(result.current.length).toBe(2);
  });

  it('filters users by name', () => {
    const { result } = renderHook(() => useUserFilter(users, 'bob', 10));
    expect(result.current).toEqual([
      { id: '2', email: 'b@test.com', name: 'Bob' },
    ]);
  });

  it('filters users by email', () => {
    const { result } = renderHook(() => useUserFilter(users, 'c@test.com', 10));
    expect(result.current).toEqual([
      { id: '3', email: 'c@test.com', name: 'Carol' },
    ]);
  });
});

