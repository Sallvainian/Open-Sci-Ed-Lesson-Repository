# Monitoring and Observability

## Performance Monitoring

**Web Vitals Tracking**:

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
```

**Custom Performance Tracking**:

```typescript
// lib/monitoring/performance.ts
export function trackPerformance(metricName: string, duration: number) {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(`${metricName}-end`);
    performance.measure(metricName, `${metricName}-start`, `${metricName}-end`);

    // Send to analytics
    console.log(`[PERFORMANCE] ${metricName}: ${duration}ms`);
  }
}

// Usage
export function usePerformanceTracking(metricName: string) {
  useEffect(() => {
    const start = performance.now();

    return () => {
      const duration = performance.now() - start;
      trackPerformance(metricName, duration);
    };
  }, [metricName]);
}
```

## Health Checks

**API Health Endpoint**:

```typescript
// app/api/health/route.ts
import { prisma } from '@/lib/db/client';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
        storage: 'ok', // Future: Check Supabase Storage
      },
    });
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
```

## Usage Analytics (Future)

**Event Tracking**:

```typescript
// lib/analytics/events.ts
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // Future: Send to analytics service (PostHog, Mixpanel, etc.)
  console.log('[ANALYTICS]', eventName, properties);
}

// Usage examples
trackEvent('lesson_viewed', { lessonId: '123', disciplineName: 'Physical Science' });
trackEvent('resource_downloaded', { resourceType: 'pdf', lessonId: '123' });
trackEvent('search_performed', { query: 'forces', resultsCount: 5 });
```

---
