# Component Architecture

## Frontend Components

### Page Components

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

### Layout Components

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

### Feature Components

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

### Form Components

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

## Backend Components (API Route Handlers)

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
