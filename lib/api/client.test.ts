import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, ApiError } from './client';

describe('apiClient', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should make successful API call and return JSON', async () => {
    const mockData = { status: 'ok', timestamp: '2025-10-03' };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await apiClient('/api/health');

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/health',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should handle 4xx errors with JSON error message', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ message: 'Resource not found' }),
    });

    await expect(apiClient('/api/missing')).rejects.toThrow(ApiError);
    await expect(apiClient('/api/missing')).rejects.toThrow('Resource not found');

    try {
      await apiClient('/api/missing');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(404);
      expect((error as ApiError).statusText).toBe('Not Found');
    }
  });

  it('should handle 5xx errors with default message', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });

    try {
      await apiClient('/api/error');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toContain('HTTP 500');
      expect((error as ApiError).status).toBe(500);
    }
  });

  it('should handle network errors', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new TypeError('Failed to fetch'));

    try {
      await apiClient('/api/test');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toBe('Network error - check your connection');
      expect((error as ApiError).status).toBe(0);
    }
  });

  it('should pass custom headers', async () => {
    const mockData = { data: 'test' };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await apiClient('/api/test', {
      headers: {
        Authorization: 'Bearer token123',
        'Content-Type': 'application/json',
      },
    });

    const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
    expect(calls[0][0]).toBe('http://localhost:3000/api/test');
    expect(calls[0][1]).toMatchObject({
      headers: {
        Authorization: 'Bearer token123',
        'Content-Type': 'application/json',
      },
    });
  });

  it('should support POST requests with body', async () => {
    const mockData = { id: 1, name: 'Test' };
    const requestBody = { name: 'Test' };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await apiClient('/api/create', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/create',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requestBody),
      })
    );
  });
});
