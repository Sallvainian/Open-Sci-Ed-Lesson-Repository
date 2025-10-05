# Open Science Education Lesson Repository - Fullstack Architecture

**Document Version:** 1.0
**Date:** 2025-10-01
**Author:** Architect Agent (Winston)
**Status:** Draft

---

## Table of Contents

1. [Introduction](#introduction)
2. [High Level Architecture](#high-level-architecture)
3. [Technology Stack](#technology-stack)
4. [Data Models](#data-models)
5. [API Specification](#api-specification)
6. [Component Architecture](#component-architecture)
7. [External APIs and Services](#external-apis-and-services)
8. [Core Workflows](#core-workflows)
9. [Database Schema](#database-schema)
10. [Frontend Architecture](#frontend-architecture)
11. [Backend Architecture](#backend-architecture)
12. [Unified Project Structure](#unified-project-structure)
13. [Development Workflow](#development-workflow)
14. [Deployment Architecture](#deployment-architecture)
15. [Security and Performance](#security-and-performance)
16. [Testing Strategy](#testing-strategy)
17. [Coding Standards](#coding-standards)
18. [Error Handling and Logging](#error-handling-and-logging)
19. [Monitoring and Observability](#monitoring-and-observability)

---

## Introduction

### Purpose

This document defines the complete technical architecture for the **Open Science Education Lesson Repository**, a web-based lesson planning workflow tool designed to organize OpenSciEd science curriculum materials. The system enables early-career science teachers to quickly find lesson content, teaching approaches, standards, objectives, and resources in under 30 seconds.

### Architectural Goals

- **Single-User Optimization**: Personal planning tool for individual teacher workflow
- **Fast Material Retrieval**: <30 second target for finding complete lesson materials
- **Cost-Effective Hosting**: Target <$20/month operational costs
- **Content Organization Focus**: 90% organization, 10% creation
- **Professional Educational Design**: Calm, reference library aesthetic
- **Dual Navigation Support**: Both conceptual (Discipline→Unit→Lesson) and chronological (pacing guide) access patterns

### Key Success Metrics

- Navigation clicks to target lesson: ≤3 clicks
- Page load time: <3 seconds
- File viewer loading: <2 seconds for documents up to 10MB
- Search results: <1 second
- System uptime: 99.9% during school hours (7am-5pm local time)

---

## High Level Architecture

### System Overview

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

### Architectural Pattern

**Monolithic Monorepo Architecture**

- Single Next.js application combining frontend and backend
- API routes colocated with frontend code
- Shared types and utilities in common package
- Simplified deployment and local development

### Platform Choice: Vercel + Supabase

**Rationale**:

- **Vercel**: Optimized for Next.js, zero-config deployment, <$20/month hobby tier, excellent performance
- **Supabase**: PostgreSQL + file storage + auth, generous free tier, cost-effective scaling
- **Single-User Scale**: Both platforms handle single-user workload efficiently within free/low-cost tiers
- **Developer Experience**: Minimal infrastructure management, focus on application logic

---

## Technology Stack

### Complete Stack Table

| Layer                   | Technology              | Version | Rationale                                                             |
| ----------------------- | ----------------------- | ------- | --------------------------------------------------------------------- |
| **Frontend Framework**  | Next.js                 | 14.x    | React framework with SSR/SSG, optimized for performance, excellent DX |
| **UI Language**         | TypeScript              | 5.x     | Type safety for data models, better IDE support, fewer runtime errors |
| **UI Library**          | React                   | 18.x    | Industry standard, large ecosystem, component-based architecture      |
| **Component Library**   | Chakra UI               | 2.x     | Accessible by default, WCAG 2.1 AA compliant, professional styling    |
| **State Management**    | TanStack Query          | 5.x     | Server state management, caching, automatic refetching                |
| **Client State**        | Zustand                 | 4.x     | Lightweight local state (navigation mode, UI preferences)             |
| **Routing**             | Next.js App Router      | 14.x    | Built-in file-based routing, server components, layouts               |
| **Styling**             | Chakra UI + CSS Modules | -       | Component library + custom styles where needed                        |
| **Forms**               | React Hook Form         | 7.x     | Performance-focused form handling, validation                         |
| **Validation**          | Zod                     | 3.x     | Runtime validation, TypeScript type inference                         |
| **Icons**               | Lucide React            | 0.x     | Modern icon set, tree-shakeable                                       |
| **File Viewing**        | react-pdf + Custom      | -       | PDF rendering, PPTX/DOCX viewers                                      |
| **Backend Framework**   | Next.js API Routes      | 14.x    | Serverless functions, colocated with frontend                         |
| **Backend Language**    | TypeScript              | 5.x     | Shared types with frontend, type-safe APIs                            |
| **Database**            | PostgreSQL              | 15.x    | Relational data model, JSONB for flexibility, mature ecosystem        |
| **Database ORM**        | Prisma                  | 5.x     | Type-safe queries, schema migrations, excellent DX                    |
| **Database Provider**   | Supabase                | -       | Managed PostgreSQL, auto-scaling, generous free tier                  |
| **File Storage**        | Supabase Storage        | -       | S3-compatible, integrated auth, <$20/month target                     |
| **Authentication**      | Supabase Auth           | -       | (Future) Built-in auth, social providers support                      |
| **API Style**           | REST                    | -       | Simple, well-understood, sufficient for MVP                           |
| **Deployment Platform** | Vercel                  | -       | Zero-config Next.js deployment, edge functions, CDN                   |
| **Version Control**     | Git + GitHub            | -       | Standard version control, CI/CD integration                           |
| **Package Manager**     | pnpm                    | 8.x     | Fast, efficient, workspace support                                    |
| **Build Tool**          | Next.js Built-in        | -       | Webpack/Turbopack optimized builds                                    |
| **Testing - Unit**      | Vitest                  | 1.x     | Fast, ESM-native, compatible with React Testing Library               |
| **Testing - Component** | React Testing Library   | 14.x    | User-centric testing, accessibility-focused                           |
| **Testing - E2E**       | Playwright              | 1.x     | Cross-browser testing, reliable, fast                                 |
| **Linting**             | ESLint                  | 8.x     | Code quality, Next.js config, accessibility plugins                   |
| **Formatting**          | Prettier                | 3.x     | Consistent code style, automatic formatting                           |
| **Type Checking**       | TypeScript Compiler     | 5.x     | Static type validation                                                |
| **CI/CD**               | Vercel + GitHub Actions | -       | Automated testing, preview deployments                                |
| **Monitoring**          | Vercel Analytics        | -       | Performance monitoring, Web Vitals tracking                           |
| **Error Tracking**      | Console + Future Sentry | -       | Start with logging, upgrade as needed                                 |

### Technology Decision Rationale

**Frontend Stack (Next.js + React + TypeScript + Chakra UI)**:

- Next.js provides SSR/SSG for fast initial loads and SEO
- TypeScript prevents runtime errors with lesson data models
- Chakra UI delivers WCAG 2.1 AA accessibility out of the box
- TanStack Query handles server state caching for fast navigation

**Backend Stack (Next.js API Routes + Prisma + PostgreSQL)**:

- API Routes eliminate need for separate backend server (cost savings)
- Prisma provides type-safe database access matching frontend types
- PostgreSQL handles hierarchical content structure efficiently
- Supabase provides managed database + file storage in one platform

**Deployment (Vercel + Supabase)**:

- Vercel's hobby tier supports single-user workload within <$20/month budget
- Supabase free tier includes 500MB database + 1GB file storage
- Both platforms offer automatic scaling if user base grows
- Combined infrastructure management time: ~1 hour/month

---

## Data Models

### Core Entities

#### Discipline

```typescript
interface Discipline {
  id: string; // UUID primary key
  name: string; // "Physical Science", "Life Science", "Earth and Space Science"
  description: string | null; // Optional overview text
  displayOrder: number; // Sort order for UI display
  createdAt: Date;
  updatedAt: Date;
}
```

#### Unit

```typescript
interface Unit {
  id: string; // UUID primary key
  disciplineId: string; // Foreign key to Discipline
  name: string; // "8.1 Forces and Motion"
  description: string | null; // Optional unit overview
  displayOrder: number; // Sort order within discipline
  estimatedLessons: number; // Expected number of lessons
  createdAt: Date;
  updatedAt: Date;

  // Relations
  discipline?: Discipline; // Parent discipline
  lessons?: Lesson[]; // Child lessons
}
```

#### Lesson

```typescript
interface Lesson {
  id: string; // UUID primary key
  unitId: string; // Foreign key to Unit

  // Basic Info
  name: string; // "Lesson 1: Investigating Contact Forces"
  lessonNumber: number; // Sequential number within unit
  displayOrder: number; // Sort order (supports custom reordering)

  // Pacing Guide (Chronological Navigation)
  scheduledDate: Date | null; // When lesson is planned to be taught
  completedDate: Date | null; // When lesson was actually taught
  status: LessonStatus; // upcoming | in_progress | completed | needs_review

  // Content (Lesson Page Template Fields)
  standards: string[]; // Educational standards (NGSS, etc.)
  objectives: string[]; // Learning objectives
  studentTargets: string[]; // "We are learning to..." statements
  teachingApproach: string; // Methodology description (markdown)
  teacherNotes: string | null; // Personal notes (markdown)

  // Metadata
  estimatedDuration: number; // Minutes (e.g., 50 for single period)
  createdAt: Date;
  updatedAt: Date;

  // Relations
  unit?: Unit; // Parent unit
  resources?: Resource[]; // Associated files and materials
}

type LessonStatus = 'upcoming' | 'in_progress' | 'completed' | 'needs_review';
```

#### Resource

```typescript
interface Resource {
  id: string; // UUID primary key
  lessonId: string; // Foreign key to Lesson

  // File Info
  name: string; // Display name
  description: string | null; // Optional description
  type: ResourceType; // Type of resource
  fileUrl: string; // Supabase Storage URL
  fileSize: number; // Bytes
  mimeType: string; // MIME type

  // Organization
  category: ResourceCategory; // slides | handouts | experiments | videos | teacher_guides
  displayOrder: number; // Sort order within lesson

  // Metadata
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  lesson?: Lesson; // Parent lesson
}

type ResourceType = 'pdf' | 'pptx' | 'docx' | 'video' | 'image' | 'link' | 'other';
type ResourceCategory =
  | 'slides'
  | 'handouts'
  | 'experiments'
  | 'videos'
  | 'teacher_guides'
  | 'other';
```

### Entity Relationships

```
Discipline (1) ──────┐
                     │
                     ▼
                  Unit (N) ──────┐
                                 │
                                 ▼
                              Lesson (N) ──────┐
                                               │
                                               ▼
                                            Resource (N)
```

### Shared Types

```typescript
// API Response Wrapper
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Search Result
interface SearchResult {
  lesson: Lesson;
  unit: Unit;
  discipline: Discipline;
  matchType: 'name' | 'standards' | 'objectives' | 'content';
  snippet: string;
  relevanceScore: number;
}

// Navigation Mode
type NavigationMode = 'library' | 'calendar';

// User Preferences (for future use)
interface UserPreferences {
  defaultNavigationMode: NavigationMode;
  theme: 'light' | 'dark' | 'system';
  compactView: boolean;
}
```

---

## API Specification

### REST API Endpoints

#### Discipline Endpoints

```http
GET /api/disciplines
```

- **Description**: List all disciplines with optional unit counts
- **Query Params**: `include_units` (boolean)
- **Response**: `ApiResponse<Discipline[]>`
- **Use Case**: Populate Library View navigation

```http
GET /api/disciplines/:id
```

- **Description**: Get single discipline with nested units
- **Response**: `ApiResponse<Discipline & { units: Unit[] }>`
- **Use Case**: Discipline detail page

#### Unit Endpoints

```http
GET /api/units
```

- **Description**: List units with filtering
- **Query Params**: `discipline_id` (string), `include_lessons` (boolean)
- **Response**: `ApiResponse<Unit[]>`
- **Use Case**: Filter units by discipline

```http
GET /api/units/:id
```

- **Description**: Get single unit with nested lessons
- **Response**: `ApiResponse<Unit & { lessons: Lesson[] }>`
- **Use Case**: Unit detail page, Library View

```http
POST /api/units
```

- **Description**: Create new unit (admin)
- **Body**: `Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>`
- **Response**: `ApiResponse<Unit>`
- **Use Case**: Add new curriculum unit

```http
PUT /api/units/:id
```

- **Description**: Update unit metadata
- **Body**: `Partial<Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>>`
- **Response**: `ApiResponse<Unit>`
- **Use Case**: Edit unit details

#### Lesson Endpoints

```http
GET /api/lessons
```

- **Description**: List lessons with filtering and sorting
- **Query Params**:
  - `unit_id` (string)
  - `status` (LessonStatus)
  - `scheduled_after` (ISO date)
  - `scheduled_before` (ISO date)
  - `sort` ('display_order' | 'scheduled_date' | 'name')
  - `include_resources` (boolean)
- **Response**: `ApiResponse<Lesson[]>`
- **Use Case**: Calendar View, upcoming lessons widget

```http
GET /api/lessons/:id
```

- **Description**: Get single lesson with all details
- **Response**: `ApiResponse<Lesson & { unit: Unit, discipline: Discipline, resources: Resource[] }>`
- **Use Case**: Lesson Detail Page (primary use case)

```http
POST /api/lessons
```

- **Description**: Create new lesson
- **Body**: `Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>`
- **Response**: `ApiResponse<Lesson>`
- **Use Case**: Add New Lesson Form

```http
PUT /api/lessons/:id
```

- **Description**: Update lesson (full or partial)
- **Body**: `Partial<Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>>`
- **Response**: `ApiResponse<Lesson>`
- **Use Case**: Inline editing on Lesson Detail Page

```http
PATCH /api/lessons/:id/status
```

- **Description**: Update lesson status only
- **Body**: `{ status: LessonStatus, completedDate?: Date }`
- **Response**: `ApiResponse<Lesson>`
- **Use Case**: Quick status toggle

```http
DELETE /api/lessons/:id
```

- **Description**: Delete lesson (soft delete recommended)
- **Response**: `ApiResponse<{ success: boolean }>`
- **Use Case**: Remove obsolete lessons

#### Resource Endpoints

```http
GET /api/resources
```

- **Description**: List resources with filtering
- **Query Params**: `lesson_id` (string), `category` (ResourceCategory)
- **Response**: `ApiResponse<Resource[]>`
- **Use Case**: Fetch resources for lesson

```http
GET /api/resources/:id
```

- **Description**: Get single resource metadata
- **Response**: `ApiResponse<Resource>`
- **Use Case**: Resource details before download

```http
POST /api/resources
```

- **Description**: Upload new resource
- **Body**: `multipart/form-data` with file + metadata
- **Response**: `ApiResponse<Resource>`
- **Use Case**: Add resource to lesson

```http
PUT /api/resources/:id
```

- **Description**: Update resource metadata
- **Body**: `Partial<Omit<Resource, 'id' | 'fileUrl' | 'uploadedAt'>>`
- **Response**: `ApiResponse<Resource>`
- **Use Case**: Rename file, change category

```http
DELETE /api/resources/:id
```

- **Description**: Delete resource (removes file from storage)
- **Response**: `ApiResponse<{ success: boolean }>`
- **Use Case**: Remove outdated materials

```http
GET /api/resources/:id/download
```

- **Description**: Generate signed download URL
- **Response**: `ApiResponse<{ downloadUrl: string, expiresAt: Date }>`
- **Use Case**: Secure file downloads

#### Search Endpoint

```http
GET /api/search
```

- **Description**: Full-text search across lessons
- **Query Params**:
  - `q` (string, required) - search query
  - `discipline_id` (string, optional)
  - `unit_id` (string, optional)
  - `limit` (number, default 20)
- **Response**: `ApiResponse<SearchResult[]>`
- **Use Case**: Search Results Page
- **Search Fields**: lesson.name, standards, objectives, teachingApproach, teacherNotes

#### Calendar Endpoints

```http
GET /api/calendar
```

- **Description**: Get lessons organized by scheduled dates
- **Query Params**:
  - `start_date` (ISO date, required)
  - `end_date` (ISO date, required)
- **Response**: `ApiResponse<Record<string, Lesson[]>>`
- **Use Case**: Calendar View, pacing guide

```http
GET /api/calendar/upcoming
```

- **Description**: Get next N upcoming lessons
- **Query Params**: `limit` (number, default 5)
- **Response**: `ApiResponse<Lesson[]>`
- **Use Case**: Home Dashboard upcoming lessons widget

### API Error Responses

```typescript
interface ApiError {
  error: string; // Error code (e.g., "NOT_FOUND", "VALIDATION_ERROR")
  message: string; // Human-readable message
  details?: any; // Additional context (validation errors, etc.)
  statusCode: number; // HTTP status code
}
```

**Standard Error Codes**:

- `400 BAD_REQUEST` - Invalid request parameters
- `404 NOT_FOUND` - Resource not found
- `422 VALIDATION_ERROR` - Data validation failed
- `500 INTERNAL_ERROR` - Server error

---

## Component Architecture

### Frontend Components

#### Page Components

1. **HomePage** (`app/page.tsx`)
   - Dashboard with upcoming lessons widget
   - Quick navigation to Library/Calendar views
   - Search bar prominent
   - Recent lessons accessed

2. **LibraryViewPage** (`app/library/page.tsx`)
   - Three-column layout (Discipline | Unit | Lesson)
   - State management for selected discipline/unit
   - Lesson list with status badges

3. **CalendarViewPage** (`app/calendar/page.tsx`)
   - Chronological lesson timeline
   - Date context indicators
   - Filter by date range

4. **LessonDetailPage** (`app/lessons/[id]/page.tsx`)
   - Consistent lesson template display
   - Inline editing for all fields
   - Resource viewer embeds
   - Breadcrumb navigation

5. **SearchResultsPage** (`app/search/page.tsx`)
   - Grouped results by Discipline/Unit
   - Context snippets with highlights
   - Filter by discipline/unit

6. **AddLessonPage** (`app/lessons/new/page.tsx`)
   - Form with lesson template fields
   - Unit selection dropdown
   - Standards and objectives multi-input
   - File upload area

#### Layout Components

1. **RootLayout** (`app/layout.tsx`)
   - Global header with navigation
   - Chakra UI ThemeProvider
   - TanStack QueryClientProvider
   - Navigation mode switcher

2. **Header** (`components/layout/Header.tsx`)
   - Logo/title
   - Search bar
   - Library/Calendar toggle
   - (Future: User profile)

3. **Breadcrumbs** (`components/layout/Breadcrumbs.tsx`)
   - Dynamic breadcrumb trail
   - Navigation mode indicator
   - Discipline > Unit > Lesson path

#### Feature Components

1. **LessonCard** (`components/lessons/LessonCard.tsx`)

   ```tsx
   interface LessonCardProps {
     lesson: Lesson;
     unit: Unit;
     showUnitInfo?: boolean;
     compact?: boolean;
     onClick?: () => void;
   }
   ```

   - Status badge
   - Completeness indicator
   - Scheduled date (if set)
   - Quick actions (edit, view)

2. **FileViewerEmbed** (`components/resources/FileViewerEmbed.tsx`)

   ```tsx
   interface FileViewerEmbedProps {
     resource: Resource;
     height?: string;
   }
   ```

   - PDF viewer (react-pdf)
   - PPTX viewer (iframe or custom)
   - DOCX viewer (iframe or custom)
   - Video player
   - Download fallback

3. **CollapsibleSection** (`components/common/CollapsibleSection.tsx`)

   ```tsx
   interface CollapsibleSectionProps {
     title: string;
     defaultOpen?: boolean;
     children: React.ReactNode;
   }
   ```

   - Expandable lesson page sections
   - Persistence of expand/collapse state
   - Smooth animation

4. **StatusBadge** (`components/lessons/StatusBadge.tsx`)

   ```tsx
   interface StatusBadgeProps {
     status: LessonStatus;
     size?: 'sm' | 'md' | 'lg';
   }
   ```

   - Color-coded status indicators
   - Upcoming: blue
   - In Progress: orange
   - Completed: green
   - Needs Review: yellow

5. **NavigationModeSwitcher** (`components/navigation/NavigationModeSwitcher.tsx`)

   ```tsx
   interface NavigationModeSwitcherProps {
     currentMode: NavigationMode;
     onChange: (mode: NavigationMode) => void;
   }
   ```

   - Toggle between Library/Calendar views
   - Icon + label
   - Persists preference to localStorage

6. **UpcomingLessonsWidget** (`components/dashboard/UpcomingLessonsWidget.tsx`)
   - Lists next 5 upcoming lessons
   - Date indicators
   - Quick link to each lesson
   - "View All" link to Calendar View

7. **ResourceList** (`components/resources/ResourceList.tsx`)

   ```tsx
   interface ResourceListProps {
     resources: Resource[];
     lessonId: string;
     editable?: boolean;
   }
   ```

   - Categorized resource display
   - Inline file viewer toggle
   - Upload new resource button
   - Reorder drag-and-drop (future)

8. **SearchBar** (`components/search/SearchBar.tsx`)

   ```tsx
   interface SearchBarProps {
     onSearch: (query: string) => void;
     placeholder?: string;
   }
   ```

   - Debounced search input
   - Clear button
   - Recent searches dropdown (future)

#### Form Components

1. **LessonForm** (`components/forms/LessonForm.tsx`)

   ```tsx
   interface LessonFormProps {
     lesson?: Lesson; // Undefined for create, present for edit
     unitId?: string; // Pre-selected unit (for create)
     onSubmit: (data: LessonFormData) => void;
     onCancel: () => void;
   }
   ```

   - React Hook Form + Zod validation
   - All lesson template fields
   - Standards/objectives dynamic array input
   - Rich text editor for teaching approach

2. **ResourceUploadForm** (`components/forms/ResourceUploadForm.tsx`)

   ```tsx
   interface ResourceUploadFormProps {
     lessonId: string;
     onUploadComplete: (resource: Resource) => void;
   }
   ```

   - File drag-and-drop
   - Category selection
   - Description field
   - Upload progress indicator

### Backend Components (API Route Handlers)

1. **Database Client** (`lib/db/client.ts`)

   ```typescript
   import { PrismaClient } from '@prisma/client';

   export const prisma = new PrismaClient({
     log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
   });
   ```

2. **Supabase Storage Client** (`lib/storage/client.ts`)

   ```typescript
   import { createClient } from '@supabase/supabase-js';

   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_KEY!
   );
   ```

3. **API Error Handler** (`lib/api/errorHandler.ts`)

   ```typescript
   export function handleApiError(error: unknown): ApiError {
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
       // Handle database errors
     }
     // Handle other error types
   }
   ```

4. **Validation Schemas** (`lib/validation/schemas.ts`)

   ```typescript
   import { z } from 'zod';

   export const createLessonSchema = z.object({
     unitId: z.string().uuid(),
     name: z.string().min(1).max(200),
     lessonNumber: z.number().int().positive(),
     standards: z.array(z.string()),
     // ... other fields
   });
   ```

5. **File Upload Handler** (`lib/storage/uploadHandler.ts`)

   ```typescript
   export async function uploadResourceFile(
     file: File,
     lessonId: string
   ): Promise<{ fileUrl: string; fileSize: number; mimeType: string }> {
     // Upload to Supabase Storage
     // Return metadata
   }
   ```

6. **Search Service** (`lib/search/searchService.ts`)
   ```typescript
   export async function searchLessons(
     query: string,
     filters?: { disciplineId?: string; unitId?: string }
   ): Promise<SearchResult[]> {
     // Full-text search using Prisma + PostgreSQL
     // Return ranked results
   }
   ```

---

## External APIs and Services

### Supabase

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

### Vercel

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

### Future External APIs

**Not in MVP**, but potential future integrations:

- **OpenAI API**: AI-assisted lesson summary generation
- **SendGrid**: Email notifications for lesson reminders
- **Google Drive API**: Import lessons from Drive folders

---

## Core Workflows

### Workflow 1: Find Tomorrow's Lesson Materials (Primary Use Case)

**User Goal**: Teacher needs to quickly access complete materials for tomorrow's lesson

**Steps**:

1. User opens application (HomePage)
2. Dashboard shows "Upcoming Lessons" widget
3. User clicks on tomorrow's lesson card
4. System navigates to Lesson Detail Page
5. Page displays:
   - Standards and objectives
   - Teaching approach
   - All resources with inline viewers
6. User reviews materials, clicks resource to view inline
7. **Success**: User found complete materials in <30 seconds

**Technical Flow**:

```typescript
// 1. HomePage fetches upcoming lessons
const { data: upcomingLessons } = useQuery({
  queryKey: ['lessons', 'upcoming'],
  queryFn: () => fetch('/api/calendar/upcoming?limit=5').then(r => r.json())
});

// 2. User clicks lesson card
router.push(`/lessons/${lesson.id}`);

// 3. Lesson Detail Page fetches full lesson data
const { data: lessonData } = useQuery({
  queryKey: ['lessons', lessonId],
  queryFn: () => fetch(`/api/lessons/${lessonId}`).then(r => r.json()),
  staleTime: 5 * 60 * 1000  // Cache for 5 minutes
});

// 4. Resources render with inline viewers
<FileViewerEmbed resource={resource} height="600px" />
```

### Workflow 2: Browse and Discover Lesson by Concept

**User Goal**: Teacher wants to find a lesson about "contact forces" in the Physical Science curriculum

**Steps**:

1. User clicks "Library View" in header navigation
2. System displays three-column layout:
   - Column 1: Disciplines (Physical Science selected by default)
   - Column 2: Units in Physical Science
   - Column 3: Empty (awaiting unit selection)
3. User clicks "8.1 Forces and Motion" unit
4. Column 3 populates with lessons in that unit
5. User scans lesson names, finds "Lesson 1: Investigating Contact Forces"
6. User clicks lesson card
7. System navigates to Lesson Detail Page
8. **Success**: User discovered relevant lesson through conceptual navigation

**Technical Flow**:

```typescript
// 1. LibraryViewPage maintains selection state
const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

// 2. Fetch disciplines
const { data: disciplines } = useQuery({
  queryKey: ['disciplines'],
  queryFn: () => fetch('/api/disciplines').then((r) => r.json()),
});

// 3. Fetch units when discipline selected
const { data: units } = useQuery({
  queryKey: ['units', selectedDiscipline],
  queryFn: () => fetch(`/api/units?discipline_id=${selectedDiscipline}`).then((r) => r.json()),
  enabled: !!selectedDiscipline,
});

// 4. Fetch lessons when unit selected
const { data: lessons } = useQuery({
  queryKey: ['lessons', selectedUnit],
  queryFn: () => fetch(`/api/lessons?unit_id=${selectedUnit}`).then((r) => r.json()),
  enabled: !!selectedUnit,
});
```

### Workflow 3: Add New Lesson to Repository

**User Goal**: Teacher wants to add a new lesson to the repository with complete template information

**Steps**:

1. User navigates to desired unit in Library View
2. User clicks "Add New Lesson" button
3. System displays Add Lesson Form with unit pre-selected
4. User fills in lesson template fields:
   - Lesson name and number
   - Standards (multi-select or text input)
   - Learning objectives (dynamic list)
   - Student-friendly targets ("We are learning to...")
   - Teaching approach (rich text)
   - Scheduled date
5. User uploads resources (PDFs, slides, handouts)
6. User clicks "Save Lesson"
7. System validates data, creates lesson record, uploads files
8. System navigates to newly created Lesson Detail Page
9. **Success**: New lesson added with complete information

**Technical Flow**:

```typescript
// 1. Add Lesson Form with React Hook Form
const form = useForm<LessonFormData>({
  resolver: zodResolver(createLessonSchema),
  defaultValues: {
    unitId: preselectedUnitId,
    standards: [],
    objectives: [],
    studentTargets: [],
  },
});

// 2. Submit handler
const onSubmit = async (data: LessonFormData) => {
  // Create lesson
  const response = await fetch('/api/lessons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const newLesson = await response.json();

  // Upload resources (if any)
  for (const file of uploadedFiles) {
    await uploadResource(newLesson.data.id, file);
  }

  // Navigate to new lesson
  router.push(`/lessons/${newLesson.data.id}`);
};

// 3. API Route Handler
export async function POST(request: Request) {
  const body = await request.json();
  const validated = createLessonSchema.parse(body);

  const lesson = await prisma.lesson.create({
    data: {
      ...validated,
      status: 'upcoming',
      displayOrder: await getNextDisplayOrder(validated.unitId),
    },
  });

  return Response.json({ data: lesson });
}
```

### Workflow 4: Search for Lesson by Keyword

**User Goal**: Teacher wants to find all lessons related to "Newton's Laws"

**Steps**:

1. User enters "Newton's Laws" in search bar (header or homepage)
2. System debounces input (500ms) and triggers search
3. System navigates to Search Results Page
4. Page displays:
   - Number of results
   - Results grouped by Discipline/Unit
   - Context snippets with keyword highlights
   - Relevance scores
5. User clicks on a result
6. System navigates to Lesson Detail Page
7. **Success**: User found relevant lessons through keyword search

**Technical Flow**:

```typescript
// 1. SearchBar with debounced input
const debouncedSearch = useDebouncedCallback((query: string) => {
  router.push(`/search?q=${encodeURIComponent(query)}`);
}, 500);

// 2. Search Results Page
const searchParams = useSearchParams();
const query = searchParams.get('q');

const { data: results } = useQuery({
  queryKey: ['search', query],
  queryFn: () => fetch(`/api/search?q=${encodeURIComponent(query!)}`).then((r) => r.json()),
  enabled: !!query,
});

// 3. API Route Handler with full-text search
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const results = await prisma.lesson.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { standards: { hasSome: [query] } },
        { objectives: { hasSome: [query] } },
        { teachingApproach: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      unit: {
        include: { discipline: true },
      },
    },
  });

  // Transform to SearchResult format
  const searchResults: SearchResult[] = results.map((lesson) => ({
    lesson,
    unit: lesson.unit,
    discipline: lesson.unit.discipline,
    matchType: determineMatchType(lesson, query),
    snippet: generateSnippet(lesson, query),
    relevanceScore: calculateRelevance(lesson, query),
  }));

  return Response.json({ data: searchResults });
}
```

---

## Database Schema

### PostgreSQL Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Discipline {
  id           String   @id @default(uuid())
  name         String   @unique
  description  String?
  displayOrder Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  units        Unit[]

  @@map("disciplines")
}

model Unit {
  id               String   @id @default(uuid())
  disciplineId     String   @map("discipline_id")
  name             String
  description      String?
  displayOrder     Int      @default(0)
  estimatedLessons Int      @default(0) @map("estimated_lessons")
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  discipline       Discipline @relation(fields: [disciplineId], references: [id], onDelete: Cascade)
  lessons          Lesson[]

  @@map("units")
  @@index([disciplineId])
}

model Lesson {
  id               String       @id @default(uuid())
  unitId           String       @map("unit_id")
  name             String
  lessonNumber     Int          @map("lesson_number")
  displayOrder     Int          @default(0) @map("display_order")

  // Pacing Guide
  scheduledDate    DateTime?    @map("scheduled_date")
  completedDate    DateTime?    @map("completed_date")
  status           LessonStatus @default(upcoming)

  // Content
  standards        String[]
  objectives       String[]
  studentTargets   String[]     @map("student_targets")
  teachingApproach String       @map("teaching_approach") @db.Text
  teacherNotes     String?      @map("teacher_notes") @db.Text

  // Metadata
  estimatedDuration Int?        @map("estimated_duration")
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  unit             Unit         @relation(fields: [unitId], references: [id], onDelete: Cascade)
  resources        Resource[]

  @@map("lessons")
  @@index([unitId])
  @@index([scheduledDate])
  @@index([status])
}

enum LessonStatus {
  upcoming
  in_progress
  completed
  needs_review
}

model Resource {
  id          String           @id @default(uuid())
  lessonId    String           @map("lesson_id")
  name        String
  description String?
  type        ResourceType
  fileUrl     String           @map("file_url")
  fileSize    Int              @map("file_size")
  mimeType    String           @map("mime_type")
  category    ResourceCategory
  displayOrder Int             @default(0) @map("display_order")
  uploadedAt  DateTime         @default(now()) @map("uploaded_at")
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  lesson      Lesson           @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@map("resources")
  @@index([lessonId])
  @@index([category])
}

enum ResourceType {
  pdf
  pptx
  docx
  video
  image
  link
  other
}

enum ResourceCategory {
  slides
  handouts
  experiments
  videos
  teacher_guides
  other
}
```

### Database Indexes

**Performance-Critical Indexes**:

1. `lessons.unit_id` - Fast lesson lookup by unit (Library View)
2. `lessons.scheduled_date` - Fast chronological ordering (Calendar View)
3. `lessons.status` - Filter by lesson status
4. `units.discipline_id` - Fast unit lookup by discipline
5. `resources.lesson_id` - Fast resource lookup by lesson

### Data Migration Strategy

**Initial Seed Data**:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed disciplines
  const physicalScience = await prisma.discipline.create({
    data: {
      name: 'Physical Science',
      description: 'Study of matter, energy, and forces',
      displayOrder: 1,
    },
  });

  const lifeScience = await prisma.discipline.create({
    data: {
      name: 'Life Science',
      description: 'Study of living organisms',
      displayOrder: 2,
    },
  });

  const earthSpace = await prisma.discipline.create({
    data: {
      name: 'Earth and Space Science',
      description: 'Study of Earth systems and space',
      displayOrder: 3,
    },
  });

  // Seed sample unit
  const forcesUnit = await prisma.unit.create({
    data: {
      disciplineId: physicalScience.id,
      name: '8.1 Forces and Motion',
      description: 'Investigating contact and non-contact forces',
      displayOrder: 1,
      estimatedLessons: 12,
    },
  });

  // Seed sample lesson
  await prisma.lesson.create({
    data: {
      unitId: forcesUnit.id,
      name: 'Lesson 1: Investigating Contact Forces',
      lessonNumber: 1,
      displayOrder: 1,
      status: 'upcoming',
      standards: ['MS-PS2-1', 'MS-PS2-2'],
      objectives: ['Understand types of contact forces', 'Measure force magnitude and direction'],
      studentTargets: [
        'We are learning to identify contact forces in everyday situations',
        'We are learning to measure forces using appropriate tools',
      ],
      teachingApproach: 'Students will conduct hands-on experiments...',
      estimatedDuration: 50,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
```

---

## Frontend Architecture

### App Router Structure

```
app/
├── layout.tsx                     # Root layout with providers
├── page.tsx                       # HomePage (dashboard)
├── globals.css                    # Global styles
├── calendar/
│   └── page.tsx                   # CalendarViewPage
├── library/
│   └── page.tsx                   # LibraryViewPage
├── lessons/
│   ├── [id]/
│   │   └── page.tsx               # LessonDetailPage (dynamic route)
│   └── new/
│       └── page.tsx               # AddLessonPage
├── search/
│   └── page.tsx                   # SearchResultsPage
└── api/                           # API routes (backend)
    ├── disciplines/
    │   ├── route.ts               # GET /api/disciplines
    │   └── [id]/
    │       └── route.ts           # GET /api/disciplines/:id
    ├── units/
    │   ├── route.ts               # GET /api/units
    │   └── [id]/
    │       └── route.ts           # GET/PUT /api/units/:id
    ├── lessons/
    │   ├── route.ts               # GET/POST /api/lessons
    │   └── [id]/
    │       ├── route.ts           # GET/PUT/DELETE /api/lessons/:id
    │       └── status/
    │           └── route.ts       # PATCH /api/lessons/:id/status
    ├── resources/
    │   ├── route.ts               # GET/POST /api/resources
    │   └── [id]/
    │       ├── route.ts           # GET/PUT/DELETE /api/resources/:id
    │       └── download/
    │           └── route.ts       # GET /api/resources/:id/download
    ├── search/
    │   └── route.ts               # GET /api/search
    └── calendar/
        ├── route.ts               # GET /api/calendar
        └── upcoming/
            └── route.ts           # GET /api/calendar/upcoming
```

### State Management Strategy

**Server State (TanStack Query)**:

- All data fetching from API
- Automatic caching and refetching
- Optimistic updates for mutations
- Background refetching for stale data

**Client State (Zustand)**:

```typescript
// stores/navigationStore.ts
interface NavigationState {
  mode: NavigationMode;
  setMode: (mode: NavigationMode) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  mode: 'library', // Default mode
  setMode: (mode) => set({ mode }),
}));
```

**Local Storage**:

- Navigation mode preference
- Recent searches
- UI preferences (compact view, etc.)

### Data Fetching Patterns

**Page-Level Data Fetching** (Server Components):

```typescript
// app/lessons/[id]/page.tsx
export default async function LessonDetailPage({ params }: { params: { id: string } }) {
  // Fetch initial data on server
  const lesson = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/lessons/${params.id}`)
    .then(r => r.json());

  return <LessonDetailClient initialData={lesson} />;
}
```

**Client-Side Data Fetching** (useQuery):

```typescript
// Client component
function LessonDetailClient({ initialData }: { initialData: Lesson }) {
  const {
    data: lesson,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['lessons', initialData.id],
    queryFn: () => fetch(`/api/lessons/${initialData.id}`).then((r) => r.json()),
    initialData,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Render lesson detail UI
}
```

**Mutations with Optimistic Updates**:

```typescript
const updateLessonMutation = useMutation({
  mutationFn: (data: Partial<Lesson>) =>
    fetch(`/api/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['lessons', lessonId]);

    // Snapshot previous value
    const previousLesson = queryClient.getQueryData(['lessons', lessonId]);

    // Optimistically update
    queryClient.setQueryData(['lessons', lessonId], (old: Lesson) => ({
      ...old,
      ...newData,
    }));

    return { previousLesson };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['lessons', lessonId], context?.previousLesson);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries(['lessons', lessonId]);
  },
});
```

### Routing and Navigation

**Programmatic Navigation**:

```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();

// Navigate to lesson detail
router.push(`/lessons/${lesson.id}`);

// Navigate with search params
router.push(`/search?q=${encodeURIComponent(query)}`);

// Navigate back
router.back();
```

**Link Components** (Prefetching):

```typescript
import Link from 'next/link';

<Link href={`/lessons/${lesson.id}`} prefetch={true}>
  {lesson.name}
</Link>
```

### Performance Optimizations

1. **Server Components by Default**
   - Most pages use React Server Components
   - Reduces client-side JavaScript
   - Faster initial page loads

2. **Code Splitting**
   - Dynamic imports for heavy components

   ```typescript
   const FileViewerEmbed = dynamic(() => import('@/components/resources/FileViewerEmbed'), {
     loading: () => <Spinner />,
     ssr: false
   });
   ```

3. **Image Optimization**

   ```typescript
   import Image from 'next/image';

   <Image
     src="/logo.png"
     alt="Logo"
     width={200}
     height={100}
     priority={true}  // For above-the-fold images
   />
   ```

4. **Route Caching**
   - Static routes cached at CDN edge
   - Dynamic routes use ISR (Incremental Static Regeneration)

   ```typescript
   export const revalidate = 60; // Revalidate every 60 seconds
   ```

5. **Bundle Analysis**
   ```bash
   ANALYZE=true npm run build  # Analyze bundle sizes
   ```

---

## Backend Architecture

### API Route Structure

**Example: Lesson API Route**

```typescript
// app/api/lessons/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { handleApiError } from '@/lib/api/errorHandler';
import { updateLessonSchema } from '@/lib/validation/schemas';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        unit: {
          include: { discipline: true },
        },
        resources: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: lesson });
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(apiError, { status: apiError.statusCode });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const validated = updateLessonSchema.parse(body);

    const updatedLesson = await prisma.lesson.update({
      where: { id: params.id },
      data: validated,
      include: {
        unit: {
          include: { discipline: true },
        },
        resources: true,
      },
    });

    return NextResponse.json({ data: updatedLesson });
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(apiError, { status: apiError.statusCode });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.lesson.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(apiError, { status: apiError.statusCode });
  }
}
```

### Service Layer Pattern

**Example: Search Service**

```typescript
// lib/search/searchService.ts
import { prisma } from '@/lib/db/client';
import type { SearchResult } from '@/types';

export async function searchLessons(
  query: string,
  filters?: {
    disciplineId?: string;
    unitId?: string;
    limit?: number;
  }
): Promise<SearchResult[]> {
  const { disciplineId, unitId, limit = 20 } = filters || {};

  const lessons = await prisma.lesson.findMany({
    where: {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { standards: { hasSome: [query] } },
            { objectives: { hasSome: [query] } },
            { teachingApproach: { contains: query, mode: 'insensitive' } },
            { teacherNotes: { contains: query, mode: 'insensitive' } },
          ],
        },
        unitId ? { unitId } : {},
        disciplineId ? { unit: { disciplineId } } : {},
      ],
    },
    include: {
      unit: {
        include: { discipline: true },
      },
    },
    take: limit,
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return lessons.map((lesson) => ({
    lesson,
    unit: lesson.unit,
    discipline: lesson.unit.discipline,
    matchType: determineMatchType(lesson, query),
    snippet: generateSnippet(lesson, query),
    relevanceScore: calculateRelevance(lesson, query),
  }));
}

function determineMatchType(lesson: Lesson, query: string): SearchResult['matchType'] {
  const lowerQuery = query.toLowerCase();
  if (lesson.name.toLowerCase().includes(lowerQuery)) return 'name';
  if (lesson.standards.some((s) => s.toLowerCase().includes(lowerQuery))) return 'standards';
  if (lesson.objectives.some((o) => o.toLowerCase().includes(lowerQuery))) return 'objectives';
  return 'content';
}

function generateSnippet(lesson: Lesson, query: string, maxLength: number = 150): string {
  const text = lesson.teachingApproach || '';
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return text.substring(0, maxLength) + '...';
  }

  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + query.length + 100);
  const snippet = text.substring(start, end);

  return (start > 0 ? '...' : '') + snippet + (end < text.length ? '...' : '');
}

function calculateRelevance(lesson: Lesson, query: string): number {
  let score = 0;
  const lowerQuery = query.toLowerCase();

  // Name match (highest weight)
  if (lesson.name.toLowerCase().includes(lowerQuery)) score += 10;

  // Standards match
  if (lesson.standards.some((s) => s.toLowerCase().includes(lowerQuery))) score += 5;

  // Objectives match
  if (lesson.objectives.some((o) => o.toLowerCase().includes(lowerQuery))) score += 3;

  // Content match (lowest weight)
  if (lesson.teachingApproach?.toLowerCase().includes(lowerQuery)) score += 1;

  return score;
}
```

### File Upload Handling

```typescript
// lib/storage/uploadHandler.ts
import { supabase } from '@/lib/storage/client';
import { nanoid } from 'nanoid';

export async function uploadResourceFile(
  file: File,
  lessonId: string
): Promise<{
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}> {
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${lessonId}/${nanoid()}.${fileExt}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage.from('lesson-resources').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from('lesson-resources').getPublicUrl(fileName);

  return {
    fileUrl: urlData.publicUrl,
    fileSize: file.size,
    mimeType: file.type,
  };
}

export async function deleteResourceFile(fileUrl: string): Promise<void> {
  // Extract file path from URL
  const urlParts = fileUrl.split('/');
  const fileName = urlParts.slice(-2).join('/'); // lessonId/fileId.ext

  const { error } = await supabase.storage.from('lesson-resources').remove([fileName]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}
```

### Background Jobs (Future)

**Not in MVP**, but architecture supports future background jobs:

```typescript
// lib/jobs/scheduleLesson.ts
export async function scheduleLessonReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const upcomingLessons = await prisma.lesson.findMany({
    where: {
      scheduledDate: {
        gte: tomorrow,
        lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
      },
      status: 'upcoming',
    },
  });

  // Send reminders (email, notification, etc.)
}
```

---

## Unified Project Structure

```
open-science-ed-lesson-repository/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Run tests on PRs
│       └── deploy.yml                # Deploy to Vercel
├── .next/                            # Next.js build output (gitignored)
├── .vscode/
│   └── settings.json                 # VS Code workspace settings
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # HomePage
│   ├── globals.css                   # Global styles
│   ├── api/                          # API routes (backend)
│   │   ├── disciplines/
│   │   ├── units/
│   │   ├── lessons/
│   │   ├── resources/
│   │   ├── search/
│   │   └── calendar/
│   ├── calendar/
│   │   └── page.tsx
│   ├── library/
│   │   └── page.tsx
│   ├── lessons/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── new/
│   │       └── page.tsx
│   └── search/
│       └── page.tsx
├── components/                       # React components
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Spinner.tsx
│   │   └── CollapsibleSection.tsx
│   ├── dashboard/
│   │   └── UpcomingLessonsWidget.tsx
│   ├── forms/
│   │   ├── LessonForm.tsx
│   │   └── ResourceUploadForm.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Breadcrumbs.tsx
│   ├── lessons/
│   │   ├── LessonCard.tsx
│   │   └── StatusBadge.tsx
│   ├── navigation/
│   │   └── NavigationModeSwitcher.tsx
│   ├── resources/
│   │   ├── FileViewerEmbed.tsx
│   │   └── ResourceList.tsx
│   └── search/
│       └── SearchBar.tsx
├── lib/                              # Backend utilities
│   ├── api/
│   │   └── errorHandler.ts
│   ├── db/
│   │   └── client.ts                 # Prisma client
│   ├── storage/
│   │   ├── client.ts                 # Supabase client
│   │   └── uploadHandler.ts
│   ├── search/
│   │   └── searchService.ts
│   └── validation/
│       └── schemas.ts                # Zod schemas
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Database migrations
│   └── seed.ts                       # Seed data script
├── public/                           # Static assets
│   ├── favicon.ico
│   └── images/
├── stores/                           # Zustand stores
│   └── navigationStore.ts
├── styles/                           # Additional styles
│   └── theme.ts                      # Chakra UI theme customization
├── types/                            # TypeScript type definitions
│   ├── index.ts
│   └── api.ts
├── .env.local                        # Environment variables (gitignored)
├── .env.example                      # Example env vars template
├── .eslintrc.json                    # ESLint config
├── .prettierrc                       # Prettier config
├── next.config.js                    # Next.js config
├── package.json                      # Dependencies and scripts
├── pnpm-lock.yaml                    # Lockfile
├── tsconfig.json                     # TypeScript config
└── README.md                         # Project documentation
```

### Key Files Explained

**`package.json`**:

```json
{
  "name": "open-science-ed-lesson-repository",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:e2e": "playwright test",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@chakra-ui/react": "^2.8.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@prisma/client": "^5.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "@tanstack/react-query": "^5.0.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "nanoid": "^5.0.0",
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.0",
    "react-pdf": "^7.5.0",
    "zod": "^3.22.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@tanstack/react-query-devtools": "^5.0.0",
    "@testing-library/react": "^14.0.0",
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.52.0",
    "eslint-config-next": "14.0.0",
    "prettier": "^3.0.0",
    "prisma": "^5.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.2.0",
    "vitest": "^1.0.0"
  }
}
```

**`.env.example`**:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lesson_repository"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_KEY="your-service-key"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**`tsconfig.json`**:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Development Workflow

### Local Development Setup

**Prerequisites**:

- Node.js 18.x or higher
- pnpm 8.x
- PostgreSQL 17.x (or Supabase account)

**Initial Setup**:

```bash
# 1. Clone repository
git clone <repo-url>
cd open-science-ed-lesson-repository

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Initialize database
pnpm db:push          # Push Prisma schema to database
pnpm db:seed          # Seed with sample data

# 5. Start development server
pnpm dev              # Runs on http://localhost:3000
```

### Development Commands

```bash
# Development
pnpm dev              # Start Next.js dev server with hot reload

# Build
pnpm build            # Production build
pnpm start            # Start production server

# Database
pnpm db:push          # Push schema changes (development)
pnpm db:migrate       # Create and run migration (production)
pnpm db:seed          # Run seed script
pnpm db:studio        # Open Prisma Studio (database GUI)

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript type checking

# Testing
pnpm test             # Run unit tests with Vitest
pnpm test:e2e         # Run Playwright E2E tests
```

### Git Workflow

**Branch Strategy**:

```
main                  # Production-ready code
└── develop           # Integration branch (optional for single developer)
    └── feature/*     # Feature branches
    └── fix/*         # Bug fix branches
```

**Commit Convention**:

```
feat: Add lesson search functionality
fix: Correct file upload error handling
docs: Update architecture documentation
style: Format code with Prettier
refactor: Simplify search service logic
test: Add tests for lesson API routes
chore: Update dependencies
```

**Example Workflow**:

```bash
# 1. Create feature branch
git checkout -b feature/calendar-view

# 2. Make changes, commit frequently
git add .
git commit -m "feat: Add calendar view page"

# 3. Push to GitHub
git push origin feature/calendar-view

# 4. Open Pull Request
# GitHub Actions will run tests automatically

# 5. Merge after approval
# Vercel will deploy automatically
```

### Code Review Checklist

- [ ] TypeScript types are correct and comprehensive
- [ ] Zod schemas validate all user inputs
- [ ] Error handling is comprehensive
- [ ] Loading states are shown for async operations
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Performance targets achieved (<3s page load)
- [ ] Tests added for new functionality
- [ ] Documentation updated if needed
- [ ] No console.log statements in production code
- [ ] Environment variables properly configured

---

## Deployment Architecture

### Vercel Deployment

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

### Supabase Configuration

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

### CI/CD Pipeline

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

### Monitoring and Alerts

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

## Security and Performance

### Security Measures

**Input Validation**:

- All API inputs validated with Zod schemas
- SQL injection prevention via Prisma (parameterized queries)
- XSS prevention via React's built-in escaping

**File Upload Security**:

- File type validation (whitelist: pdf, pptx, docx, jpg, png, mp4)
- File size limits (50MB max per file)
- Virus scanning (future enhancement)
- Signed URLs for downloads

**Environment Variables**:

- Never commit `.env.local` to Git
- Use Vercel secrets for production
- Rotate API keys regularly

**Authentication** (Future):

- Supabase Auth with email/password
- Row-level security policies
- Session management with JWT

### Performance Targets

| Metric                        | Target     | Measurement                  |
| ----------------------------- | ---------- | ---------------------------- |
| **Page Load (Homepage)**      | <3 seconds | Lighthouse, Vercel Analytics |
| **Page Load (Lesson Detail)** | <3 seconds | Lighthouse, Vercel Analytics |
| **File Viewer Load**          | <2 seconds | Custom timing API            |
| **Search Results**            | <1 second  | API response time monitoring |
| **Interaction Response**      | <100ms     | User interaction timing      |
| **Animation Frame Rate**      | 60 FPS     | Chrome DevTools Performance  |

### Performance Optimizations

**Frontend**:

1. **Code Splitting**: Dynamic imports for heavy components
2. **Image Optimization**: next/image with automatic WebP conversion
3. **Font Optimization**: next/font with self-hosted fonts
4. **Lazy Loading**: Defer non-critical components
5. **Prefetching**: Link prefetching for likely navigations
6. **Caching**: TanStack Query caching for API responses

**Backend**:

1. **Database Indexing**: Indexes on foreign keys and query filters
2. **Query Optimization**: Include only necessary relations
3. **Connection Pooling**: Prisma connection pooling
4. **CDN Caching**: Vercel Edge Network for static assets
5. **API Response Compression**: Automatic gzip compression

**File Storage**:

1. **CDN Delivery**: Supabase Storage with CDN
2. **Image Resizing**: On-the-fly image transformation
3. **Lazy Loading**: Load resources on-demand, not all at once

---

## Testing Strategy

### Unit Testing (Vitest)

**Test Coverage Goals**:

- API route handlers: 80%+
- Service functions: 80%+
- Utility functions: 90%+
- React components: 70%+

**Example Unit Test**:

```typescript
// lib/search/searchService.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { searchLessons } from './searchService';

describe('searchLessons', () => {
  beforeEach(async () => {
    // Seed test database
  });

  it('should return lessons matching query in name', async () => {
    const results = await searchLessons('Forces');

    expect(results).toHaveLength(3);
    expect(results[0].matchType).toBe('name');
    expect(results[0].lesson.name).toContain('Forces');
  });

  it('should filter by discipline', async () => {
    const results = await searchLessons('Energy', {
      disciplineId: 'physical-science-id',
    });

    expect(results.every((r) => r.discipline.id === 'physical-science-id')).toBe(true);
  });
});
```

### Component Testing (React Testing Library)

**Testing Philosophy**:

- Test user interactions, not implementation details
- Focus on accessibility
- Use semantic queries (getByRole, getByLabelText)

**Example Component Test**:

```typescript
// components/lessons/LessonCard.test.tsx
import { render, screen } from '@testing-library/react';
import { LessonCard } from './LessonCard';

describe('LessonCard', () => {
  const mockLesson = {
    id: '1',
    name: 'Lesson 1: Forces',
    status: 'upcoming',
    scheduledDate: new Date('2025-10-02'),
    // ... other fields
  };

  it('should display lesson name', () => {
    render(<LessonCard lesson={mockLesson} unit={mockUnit} />);

    expect(screen.getByText('Lesson 1: Forces')).toBeInTheDocument();
  });

  it('should display status badge', () => {
    render(<LessonCard lesson={mockLesson} unit={mockUnit} />);

    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('should be keyboard accessible', () => {
    render(<LessonCard lesson={mockLesson} unit={mockUnit} />);

    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('tabIndex', '0');
  });
});
```

### E2E Testing (Playwright)

**Critical User Flows**:

1. Find tomorrow's lesson materials (primary use case)
2. Browse and discover lesson by concept
3. Add new lesson to repository
4. Search for lesson by keyword

**Example E2E Test**:

```typescript
// tests/e2e/find-lesson.spec.ts
import { test, expect } from '@playwright/test';

test("teacher can find tomorrow's lesson materials", async ({ page }) => {
  await page.goto('http://localhost:3000');

  // 1. Homepage loads with upcoming lessons
  await expect(page.getByRole('heading', { name: 'Upcoming Lessons' })).toBeVisible();

  // 2. Click on tomorrow's lesson
  await page.getByText('Lesson 2: Net Forces').click();

  // 3. Lesson detail page loads
  await expect(page.getByRole('heading', { name: 'Lesson 2: Net Forces' })).toBeVisible();

  // 4. Verify all template sections are present
  await expect(page.getByText('Standards')).toBeVisible();
  await expect(page.getByText('Learning Objectives')).toBeVisible();
  await expect(page.getByText('We are learning to')).toBeVisible();
  await expect(page.getByText('Teaching Approach')).toBeVisible();
  await expect(page.getByText('Resources')).toBeVisible();

  // 5. Verify resources are listed
  await expect(page.getByText('Lesson 2 Slides.pptx')).toBeVisible();

  // 6. Click resource to view inline
  await page.getByText('Lesson 2 Slides.pptx').click();
  await expect(page.locator('iframe[title="File Viewer"]')).toBeVisible();

  // Success: Found materials in <30 seconds (manual timing)
});
```

### Testing Commands

```bash
# Unit tests
pnpm test                # Run all unit tests
pnpm test --watch        # Watch mode
pnpm test --coverage     # Generate coverage report

# E2E tests
pnpm test:e2e            # Run all E2E tests
pnpm test:e2e --ui       # Open Playwright UI
pnpm test:e2e --debug    # Debug mode
```

---

## Coding Standards

### TypeScript Standards

**Type Annotations**:

- Always use explicit types for function parameters and return types
- Use type inference for variable declarations
- Prefer interfaces over type aliases for object shapes
- Use `unknown` instead of `any` when type is truly unknown

**Example**:

```typescript
// ✅ Good
interface LessonFormData {
  name: string;
  unitId: string;
  standards: string[];
}

function createLesson(data: LessonFormData): Promise<Lesson> {
  // Implementation
}

// ❌ Avoid
function createLesson(data: any): any {
  // Implementation
}
```

### React Best Practices

**Component Structure**:

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useLessonQuery } from '@/hooks/useLessonQuery';

// 2. Type definitions
interface LessonDetailProps {
  lessonId: string;
}

// 3. Component
export function LessonDetail({ lessonId }: LessonDetailProps) {
  // 4. Hooks (in order: state, queries, mutations, effects)
  const [isEditing, setIsEditing] = useState(false);
  const { data: lesson, isLoading } = useLessonQuery(lessonId);

  // 5. Event handlers
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 6. Conditional returns
  if (isLoading) return <Spinner />;
  if (!lesson) return <NotFound />;

  // 7. Main render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

**Naming Conventions**:

- Components: PascalCase (`LessonCard`)
- Functions: camelCase (`createLesson`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- Files: kebab-case (`lesson-card.tsx`) or PascalCase for components
- Hooks: camelCase with `use` prefix (`useLessonQuery`)

### API Route Standards

**Consistent Structure**:

```typescript
// 1. Imports
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { handleApiError } from '@/lib/api/errorHandler';

// 2. Type definitions
interface RouteParams {
  params: { id: string };
}

// 3. HTTP method handlers
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // 4. Input validation
    const { id } = params;

    // 5. Business logic
    const data = await prisma.lesson.findUnique({ where: { id } });

    // 6. Response
    return NextResponse.json({ data });
  } catch (error) {
    // 7. Error handling
    return NextResponse.json(handleApiError(error));
  }
}
```

### Code Formatting

**Prettier Configuration** (`.prettierrc`):

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

**ESLint Configuration** (`.eslintrc.json`):

```json
{
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended", "prettier"],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

---

## Error Handling and Logging

### Error Handling Strategy

**Client-Side Error Boundaries**:

```typescript
// components/common/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error boundary caught error:', error, errorInfo);
    // Future: Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**API Error Handler**:

```typescript
// lib/api/errorHandler.ts
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export interface ApiError {
  error: string;
  message: string;
  details?: any;
  statusCode: number;
}

export function handleApiError(error: unknown): ApiError {
  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return {
        error: 'CONFLICT',
        message: 'A resource with that identifier already exists',
        statusCode: 409,
      };
    }
    if (error.code === 'P2025') {
      return {
        error: 'NOT_FOUND',
        message: 'The requested resource was not found',
        statusCode: 404,
      };
    }
  }

  // Validation errors
  if (error instanceof ZodError) {
    return {
      error: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: error.errors,
      statusCode: 422,
    };
  }

  // Generic errors
  if (error instanceof Error) {
    return {
      error: 'INTERNAL_ERROR',
      message: error.message,
      statusCode: 500,
    };
  }

  // Unknown errors
  return {
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500,
  };
}
```

### Logging Strategy

**Development Logging**:

```typescript
// lib/logger.ts
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, error?: Error, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, error, ...args);
    // Future: Send to error tracking service
  },
};
```

**API Request Logging**:

```typescript
// middleware.ts (Next.js middleware)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const start = Date.now();

  // Log request
  console.log(`[${request.method}] ${request.url}`);

  const response = NextResponse.next();

  // Log response time
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`);

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

---

## Monitoring and Observability

### Performance Monitoring

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

### Health Checks

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

### Usage Analytics (Future)

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

## Summary

This architecture document provides a complete technical blueprint for the **Open Science Education Lesson Repository**. The design prioritizes:

1. **Single-User Optimization**: Cost-effective stack (<$20/month) with Vercel + Supabase
2. **Fast Material Retrieval**: <30 second target via dual navigation and search
3. **Professional Educational Design**: WCAG 2.1 AA accessible, calm reference library aesthetic
4. **Developer Experience**: Modern stack (Next.js, TypeScript, Prisma) with excellent tooling
5. **Maintainability**: Clear patterns, comprehensive testing, good documentation

### Next Steps After Architecture Approval

1. **Create Git Repository**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Project architecture"
   ```

2. **Set Up Supabase Project**
   - Create database
   - Configure storage bucket
   - Copy connection strings to `.env.local`

3. **Initialize Codebase**

   ```bash
   pnpm install
   pnpm db:push
   pnpm db:seed
   pnpm dev
   ```

4. **Begin Development** (Epic 1: Foundation)
   - Set up Next.js project structure
   - Configure Prisma and database
   - Create basic layout and navigation
   - Implement HomePage with dashboard

5. **Deploy Preview**
   - Connect GitHub to Vercel
   - Configure environment variables
   - Deploy first preview

**Architect Sign-Off**: This architecture is ready for implementation and meets all PRD requirements with appropriate technical decisions for a single-user educational planning tool.

---

**End of Architecture Document**
