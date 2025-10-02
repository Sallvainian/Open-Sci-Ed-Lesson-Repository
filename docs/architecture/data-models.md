# Data Models

## Core Entities

### Discipline

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

### Unit

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

### Lesson

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

### Resource

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

## Entity Relationships

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

## Shared Types

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
