# Deployment Architecture

## Vercel Deployment

**Automatic Deployments**:

- **Production**: Automatically deploys `main` branch
- **Preview**: Creates preview URL for every PR
- **Development**: Deploys `develop` branch to staging URL (optional)

**Vercel Configuration** (`vercel.json`):

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "SUPABASE_SERVICE_KEY": "@supabase_service_key"
  }
}
```

**Environment Variables** (Vercel Dashboard):

- Configure production secrets via Vercel dashboard
- Use different Supabase project for staging/production
- Ensure all API keys are stored as Vercel secrets

## Supabase Configuration

**Database Setup**:

1. Create Supabase project
2. Copy connection string to `DATABASE_URL`
3. Run initial migration: `pnpm db:migrate`
4. Run seed script: `pnpm db:seed`

**Storage Setup**:

1. Create storage bucket: `lesson-resources`
2. Configure bucket policies:

   ```sql
   -- Allow public read access
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'lesson-resources');

   -- Allow authenticated uploads (future)
   CREATE POLICY "Authenticated uploads"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'lesson-resources' AND auth.role() = 'authenticated');
   ```

## CI/CD Pipeline

**GitHub Actions** (`.github/workflows/ci.yml`):

```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Type check
        run: pnpm type-check

      - name: Lint
        run: pnpm lint

      - name: Run unit tests
        run: pnpm test

      - name: Build
        run: pnpm build
```

**Deployment Flow**:

```
1. Developer pushes to feature branch
2. GitHub Actions runs CI (type check, lint, test, build)
3. Developer opens PR to main
4. Vercel creates preview deployment
5. Code review and approval
6. Merge to main
7. Vercel deploys to production automatically
8. Supabase database migrations run (if needed)
```

## Monitoring and Alerts

**Vercel Analytics**:

- Web Vitals tracking (LCP, FID, CLS)
- Real User Monitoring (RUM)
- Performance budgets

**Supabase Monitoring**:

- Database performance metrics
- Storage usage
- API request logs

**Error Tracking** (Future: Sentry):

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

---
