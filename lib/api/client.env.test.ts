import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Environment variable configuration tests
 *
 * Tests that API client correctly reads NEXT_PUBLIC_APP_URL
 */
describe('API Client Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    global.fetch = vi.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.resetAllMocks();
  });

  it('should use default localhost:3000 when NEXT_PUBLIC_APP_URL is not set', async () => {
    delete process.env.NEXT_PUBLIC_APP_URL;

    // Dynamic import to get fresh module with current env
    const { apiClient } = await import('./client');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    await apiClient('/api/test');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/test', expect.any(Object));
  });

  it('should use NEXT_PUBLIC_APP_URL when set to localhost:3001', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3001';

    // Dynamic import to get fresh module with current env
    const { apiClient } = await import('./client');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    await apiClient('/api/test');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/test', expect.any(Object));
  });

  it('should use NEXT_PUBLIC_APP_URL when set to production URL', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://api.example.com';

    // Dynamic import to get fresh module with current env
    const { apiClient } = await import('./client');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    await apiClient('/api/health');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/api/health',
      expect.any(Object)
    );
  });
});
