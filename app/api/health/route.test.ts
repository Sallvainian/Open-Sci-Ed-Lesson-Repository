import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/health', () => {
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
});
