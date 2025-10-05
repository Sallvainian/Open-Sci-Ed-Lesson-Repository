# Backend Architecture

## API Route Structure

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

## Service Layer Pattern

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

## File Upload Handling

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

## Background Jobs (Future)

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
