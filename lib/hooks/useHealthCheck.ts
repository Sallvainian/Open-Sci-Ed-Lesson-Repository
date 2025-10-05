import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiClient, HealthCheckResponse } from '@/lib/api/client';

/**
 * Example TanStack Query hook for API health check
 *
 * Demonstrates API client usage with useQuery
 */
export function useHealthCheck(): UseQueryResult<HealthCheckResponse, Error> {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient<HealthCheckResponse>('/api/health'),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 3, // Retry failed requests 3 times
  });
}
