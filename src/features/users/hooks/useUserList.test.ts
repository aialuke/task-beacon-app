
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserList } from './useUserList';
import { UserService } from '@/lib/api';
import type { User } from '@/types';

// Create test query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

describe('useUserList', () => {
  it('fetches users successfully', async () => {
    const users: User[] = [{
      id: '1',
      email: 'a@test.com',
      name: 'Test User',
      role: 'user',
      avatar_url: 'https://example.com/avatar.jpg',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }];
    
    vi.spyOn(UserService, 'getAll').mockResolvedValue({ 
      success: true, 
      data: users, 
      error: null 
    });
    
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(QueryClientProvider, { client: queryClient }, children)
    );
    
    const { result } = renderHook(() => useUserList(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.users).toEqual(users);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('handles fetch error', async () => {
    vi.spyOn(UserService, 'getAll').mockResolvedValue({ 
      success: false, 
      data: null, 
      error: { name: 'Error', message: 'fail' } 
    });
    
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(QueryClientProvider, { client: queryClient }, children)
    );
    
    const { result } = renderHook(() => useUserList(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.users).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('fail');
    });
  });
});
