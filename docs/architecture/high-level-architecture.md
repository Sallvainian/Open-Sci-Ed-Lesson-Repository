# High Level Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User (Science Teacher)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Web Browser (Client)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ React App    │  │ TanStack     │  │ File Viewer  │     │
│  │ (Next.js)    │  │ Query        │  │ Components   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Next.js API Routes (Backend)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Lesson API   │  │ File API     │  │ Search API   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  PostgreSQL Database     │  │  File Storage (S3)       │
│  (Supabase)              │  │  (Supabase Storage)      │
│  - Disciplines           │  │  - PDFs                  │
│  - Units                 │  │  - Slide Decks           │
│  - Lessons               │  │  - Documents             │
│  - Resources             │  │  - Videos                │
└──────────────────────────┘  └──────────────────────────┘
```

## Architectural Pattern

**Monolithic Monorepo Architecture**

- Single Next.js application combining frontend and backend
- API routes colocated with frontend code
- Shared types and utilities in common package
- Simplified deployment and local development

## Platform Choice: Vercel + Supabase

**Rationale**:

- **Vercel**: Optimized for Next.js, zero-config deployment, <$20/month hobby tier, excellent performance
- **Supabase**: PostgreSQL + file storage + auth, generous free tier, cost-effective scaling
- **Single-User Scale**: Both platforms handle single-user workload efficiently within free/low-cost tiers
- **Developer Experience**: Minimal infrastructure management, focus on application logic

---
