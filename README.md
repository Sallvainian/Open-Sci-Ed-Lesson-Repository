# Open Science Ed Lesson Repository

A web-based lesson planning and resource management tool for organizing OpenSciEd science curriculum materials.

## Overview

This application helps science teachers organize OpenSciEd curriculum materials into a structured, easily navigable repository. It provides:

- **Hierarchical Organization**: Discipline → Unit → Lesson structure
- **Dual Navigation**: Browse by conceptual units or chronological pacing
- **Consistent Lesson Templates**: Standards, objectives, teaching approaches, and resources
- **Resource Hosting**: In-app file storage for quick access to lesson materials
- **Fast Search**: Locate complete lesson materials in under 30 seconds

## Prerequisites

- **Node.js**: 18.x or higher
- **pnpm**: 8.x or higher
- **PostgreSQL**: 15.x (for production) or Supabase account

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy the environment template:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

**Backend/Database:**

- `DATABASE_URL`: Your PostgreSQL connection string
- `SUPABASE_SERVICE_KEY`: Your Supabase service key (keep secret!)

**Frontend/Public:**

- `NEXT_PUBLIC_APP_URL`: Application base URL (default: `http://localhost:3000`)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser

### 3. Initialize Database

**Quick Setup** (development):

```bash
pnpm db:push    # Push schema to database
pnpm db:seed    # Populate with sample data
```

**Production Setup** (with migrations):

```bash
pnpm db:migrate # Create and run migrations
pnpm db:seed    # Populate with sample data
```

**Convenience Command**:

```bash
# Combined setup (push + seed)
pnpm db:push && pnpm db:seed
```

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend API

The application includes a REST API built with Next.js API Routes. The API is automatically started with the development server.

### Health Check Endpoint

Test if the API server is running:

```bash
curl http://localhost:3000/api/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-10-03T23:43:23.704Z"
}
```

### API Features

- **CORS Configuration**: Configured for local development (localhost:3000, localhost:3001)
- **Request Logging**: All API requests are logged with method, path, status, and response time
- **Error Handling**: Consistent error response format across all endpoints
- **Environment Configuration**: Configurable port via `PORT` environment variable (defaults to 3000)

## Frontend Application

The frontend is built with Next.js 14 App Router, React 18, and Chakra UI for a modern, accessible user interface.

### Frontend Stack

- **Framework**: Next.js 14.x with App Router
- **UI Library**: React 18.x
- **Component Library**: Chakra UI 2.x (WCAG 2.1 AA compliant)
- **State Management**: TanStack Query 5.x for server state, Zustand 4.x for client state
- **Styling**: Chakra UI + CSS Modules
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

### Frontend Features

- **Server Components**: Optimized rendering with React Server Components
- **API Client**: Configured fetch wrapper with error handling (`lib/api/client.ts`)
- **TanStack Query**: Automatic caching, refetching, and state management for server data
- **Chakra UI Theme**: Customizable theme with brand colors and typography scales
- **Hot Module Replacement**: Fast refresh during development
- **TypeScript**: Full type safety across frontend code

### API Client Usage

The frontend includes a configured API client for making backend requests:

```typescript
import { apiClient } from '@/lib/api/client';

// Simple GET request
const data = await apiClient<ResponseType>('/api/endpoint');

// With TanStack Query hook
import { useQuery } from '@tanstack/react-query';

function useData() {
  return useQuery({
    queryKey: ['data'],
    queryFn: () => apiClient<DataType>('/api/data'),
  });
}
```

The API client automatically:

- Uses `NEXT_PUBLIC_APP_URL` environment variable for base URL
- Handles network errors, 4xx, and 5xx responses
- Parses JSON responses
- Throws structured `ApiError` for error handling

### Troubleshooting

**Frontend Issues:**

_Page not loading or blank screen:_

- Check browser console for JavaScript errors
- Ensure all dependencies installed: `pnpm install`
- Clear Next.js cache: `rm -rf .next` and restart dev server
- Verify `NEXT_PUBLIC_APP_URL` is set correctly in `.env.local`

_Chakra UI styles not applying:_

- Ensure Chakra providers are in place (check `app/providers.tsx`)
- Clear browser cache and hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- Check for CSS conflicts in browser DevTools

_API calls failing with network errors:_

- Verify `NEXT_PUBLIC_APP_URL` matches your development server URL
- Check browser console for specific error messages
- Ensure backend API is running (check `/api/health` endpoint)
- Verify CORS configuration allows your frontend origin

_TypeScript errors during development:_

- Run `pnpm type-check` to see all errors
- Ensure `@types/*` packages are installed
- Restart TypeScript server in your IDE

**Backend Issues:**

_API not responding:_

- Ensure development server is running: `pnpm dev`
- Check server logs for errors in terminal
- Verify no port conflicts (default: 3000)

_CORS errors:_

- Ensure frontend is running on allowed origin (localhost:3000 or localhost:3001)
- Check browser console for specific CORS error details

_Database connection errors:_

- Verify `DATABASE_URL` is set in `.env.local`
- Test database connection: `pnpm db:studio`

## Available Scripts

- `pnpm dev` - Start Next.js development server (frontend + API)
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint checks
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript compiler checks
- `pnpm test` - Run unit tests with Vitest
- `pnpm test:e2e` - Run E2E tests with Playwright
- `pnpm db:push` - Push database schema changes (development)
- `pnpm db:migrate` - Create and run database migrations (production)
- `pnpm db:seed` - Populate database with sample data
- `pnpm db:studio` - Open Prisma Studio database GUI

## Architecture

This is a full-stack Next.js 14 application built with:

- **Frontend**: React 18, TypeScript 5, Chakra UI 2
- **Backend**: Next.js API Routes (serverless)
- **Database**: PostgreSQL 15 with Prisma 5 ORM
- **Hosting**: Vercel (frontend) + Supabase (database)

For detailed architecture documentation, see [`docs/architecture/`](docs/architecture/).

## Project Structure

```
├── app/              # Next.js App Router pages and API routes
├── components/       # React components
├── lib/              # Backend utilities and business logic
├── prisma/           # Database schema and migrations
├── public/           # Static assets
├── stores/           # Zustand state management
├── styles/           # Global styles and themes
├── types/            # TypeScript type definitions
└── docs/             # Project documentation
```

## Development Workflow

1. Create a feature branch from `main`
2. Make changes following the coding standards in [`docs/architecture/coding-standards.md`](docs/architecture/coding-standards.md)
3. Run tests and linting before committing
4. Create a pull request for review

Pre-commit hooks automatically run linting and formatting checks.

## Database Setup

### Local PostgreSQL

```bash
# Install PostgreSQL 15
# macOS: brew install postgresql@15
# Ubuntu: sudo apt install postgresql-15

# Create database
createdb lesson_repository

# Configure .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/lesson_repository"
```

### Supabase (Recommended)

1. Create a project at [supabase.com](https://supabase.com)
2. Copy connection string from Project Settings → Database
3. Add to `.env.local`:

```env
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

### Troubleshooting

**Error: `Environment variable not found: DATABASE_URL`**

- Ensure `.env.local` exists with `DATABASE_URL` set
- Restart development server after adding environment variables

**Error: `Connection refused`**

- Verify PostgreSQL is running: `pg_isready`
- Check connection string format and credentials

**Migration conflicts**

- Reset development database: `pnpm db:push --force-reset`
- Production: Use `pnpm db:migrate` for version-controlled changes

## License

Private - Educational Use Only

## Contact

For questions or support, contact the project maintainer.
