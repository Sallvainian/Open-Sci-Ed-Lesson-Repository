import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { prisma } from '@/lib/db/client';

// Mock Prisma client
vi.mock('@/lib/db/client', () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

describe('GET /api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful database query by default
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '?column?': 1 }]);
  });

  it('should return 200 OK status code', async () => {
    const response = await GET();

    expect(response.status).toBe(200);
  });

  it('should return correct JSON structure', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
  });

  it('should return status "ok"', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.status).toBe('ok');
  });

  it('should return timestamp in valid ISO-8601 format', async () => {
    const response = await GET();
    const data = await response.json();

    // Validate ISO-8601 format
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    expect(data.timestamp).toMatch(isoRegex);

    // Ensure it's a valid date
    const date = new Date(data.timestamp);
    expect(date.toString()).not.toBe('Invalid Date');
  });

  it('should return recent timestamp (within 1 second)', async () => {
    const before = Date.now();
    const response = await GET();
    const after = Date.now();
    const data = await response.json();

    const responseTime = new Date(data.timestamp).getTime();
    expect(responseTime).toBeGreaterThanOrEqual(before);
    expect(responseTime).toBeLessThanOrEqual(after);
  });

  describe('Error Handling', () => {
    it('should return 503 when database query fails (1.9-INT-001)', async () => {
      // Mock database connection failure
      vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error('Connection refused'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.status).toBe('unhealthy');
      expect(data.timestamp).toBeDefined();
      expect(data.error).toBe('Connection refused');

      // Verify timestamp is in ISO-8601 format
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      expect(data.timestamp).toMatch(isoRegex);
    });

    it('should handle non-Error objects (1.9-INT-002)', async () => {
      // Mock rejection with non-Error object
      vi.mocked(prisma.$queryRaw).mockRejectedValueOnce('String error');

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.status).toBe('unhealthy');
      expect(data.timestamp).toBeDefined();
      expect(data.error).toBe('Unknown error');
    });
  });
});
