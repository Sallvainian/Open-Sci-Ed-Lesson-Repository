# Database Schema

## PostgreSQL Schema (Prisma)

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

## Database Indexes

**Performance-Critical Indexes**:

1. `lessons.unit_id` - Fast lesson lookup by unit (Library View)
2. `lessons.scheduled_date` - Fast chronological ordering (Calendar View)
3. `lessons.status` - Filter by lesson status
4. `units.discipline_id` - Fast unit lookup by discipline
5. `resources.lesson_id` - Fast resource lookup by lesson

## Data Migration Strategy

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
