# External APIs and Services

## Supabase

**Services Used**:

1. **PostgreSQL Database**
   - Connection URL from environment variable
   - Connection pooling via Prisma
   - Automatic backups (Supabase managed)

2. **Storage (File Hosting)**
   - Bucket: `lesson-resources`
   - Public access for authenticated users
   - Signed URLs for downloads
   - File size limit: 50MB per file (configurable)

3. **Authentication** (Future Feature)
   - Email/password authentication
   - Session management
   - Row-level security policies

**Environment Variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx  # Client-side key
SUPABASE_SERVICE_KEY=xxx            # Server-side key (API routes only)
DATABASE_URL=postgresql://xxx        # Prisma connection string
```

## Vercel

**Services Used**:

1. **Hosting & CDN**
   - Automatic deployments from GitHub
   - Edge functions for API routes
   - Static asset optimization
   - Image optimization (next/image)

2. **Analytics** (Optional)
   - Web Vitals tracking
   - Performance monitoring
   - Usage analytics

**Environment Variables** (Vercel Dashboard):

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Future External APIs

**Not in MVP**, but potential future integrations:

- **OpenAI API**: AI-assisted lesson summary generation
- **SendGrid**: Email notifications for lesson reminders
- **Google Drive API**: Import lessons from Drive folders

---
