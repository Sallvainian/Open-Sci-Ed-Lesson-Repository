import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHealthCheck } from './useHealthCheck';
import * as apiClient from '@/lib/api/client';

// Create wrapper for TanStack Query
function createWrapper(): React.FC<{ children: React.ReactNode }> {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
      },
    },
  });

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };

  return Wrapper;
}

describe('useHealthCheck', () => {
  it('should fetch health check data successfully', async () => {
    const mockHealthData = {
      status: 'ok',
      timestamp: '2025-10-03T12:00:00Z',
    };

    vi.spyOn(apiClient, 'apiClient').mockResolvedValue(mockHealthData);

    const { result } = renderHook(() => useHealthCheck(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockHealthData);
    expect(apiClient.apiClient).toHaveBeenCalledWith('/api/health');
  });

  it('should use correct query configuration', () => {
    const mockSpy = vi.spyOn(apiClient, 'apiClient').mockResolvedValue({
      status: 'ok',
      timestamp: '2025-10-03',
    });

    renderHook(() => useHealthCheck(), {
      wrapper: createWrapper(),
    });

    // Verify API client called with correct endpoint
    expect(mockSpy).toHaveBeenCalledWith('/api/health');
  });
});
