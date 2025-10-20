# Story 1.1: Define JSON Data Schema and Structure

Status: Ready

## Story

As a **developer**,
I want **a well-defined JSON schema for curriculum data**,
so that **I can structure lesson content consistently and enable efficient data loading**.

## Acceptance Criteria

1. JSON schema defines three-level hierarchy: Disciplines → Units → Lessons
2. Discipline object includes: id, name, slug, description, iconName, color, unitCount
3. Unit object includes: id, title, disciplineSlug, lessonCount, estimatedDuration, description
4. Lesson object includes:
   - Basic info: id, title, disciplineId, disciplineSlug, unitId, unitTitle, duration
   - Content: objectives (WALTs), materials list, sequence (5E phases), teachingGuidance
   - Resources: array of resource links with type, title, url
   - Metadata: standards alignment, audience tags (teacher/student/both)
5. Schema documented with TypeScript interfaces in `lib/types/lesson.ts`
6. Schema validation script created using Zod and tested
7. Initial data files created for 3-5 units across all three disciplines
8. Data structure supports future expansion without breaking changes (audience tagging for FR-12)

## Tasks / Subtasks

- [ ] Task 1: Define TypeScript Type Definitions (AC: 1-5)
  - [ ] Subtask 1.1: Create `lib/types/lesson.ts` file
  - [ ] Subtask 1.2: Define Discipline, Unit, Lesson, LessonMaterial, LessonPhase, TeachingGuidance, Resource interfaces
  - [ ] Subtask 1.3: Add audience tagging fields (`'teacher' | 'student' | 'both'`) to support future student-facing views (FR-12)
  - [ ] Subtask 1.4: Document all type definitions with JSDoc comments

- [ ] Task 2: Create JSON Data Files (AC: 7)
  - [ ] Subtask 2.1: Create `data/disciplines.json` with 3 disciplines (Life Science, Earth & Space Science, Physical Science)
  - [ ] Subtask 2.2: Create `data/units.json` with initial 3-5 units distributed across disciplines
  - [ ] Subtask 2.3: Create `data/lessons/` directory
  - [ ] Subtask 2.4: Create 3-5 example lesson JSON files (e.g., lesson-8.1.2.json) following the schema
  - [ ] Subtask 2.5: Ensure all lesson data includes audience tags where applicable

- [ ] Task 3: Implement Data Loader Utilities (AC: 5)
  - [ ] Subtask 3.1: Create `lib/data/loader.ts` file
  - [ ] Subtask 3.2: Implement `getAllDisciplines()` function
  - [ ] Subtask 3.3: Implement `getDisciplineBySlug()` function
  - [ ] Subtask 3.4: Implement `getUnitsByDiscipline()` function
  - [ ] Subtask 3.5: Implement `getUnitById()` function
  - [ ] Subtask 3.6: Implement `getLesson()` async function with dynamic import
  - [ ] Subtask 3.7: Implement `getLessonIdsByUnit()` function for SSG
  - [ ] Subtask 3.8: Implement `getAllLessons()` function for static param generation

- [ ] Task 4: Create Schema Validation Script (AC: 6)
  - [ ] Subtask 4.1: Install Zod dependency: `pnpm add zod`
  - [ ] Subtask 4.2: Create `scripts/validate-data.ts` file
  - [ ] Subtask 4.3: Define Zod schemas matching TypeScript interfaces
  - [ ] Subtask 4.4: Implement validation function for disciplines.json
  - [ ] Subtask 4.5: Implement validation function for units.json
  - [ ] Subtask 4.6: Implement validation function for all lesson JSON files
  - [ ] Subtask 4.7: Add validation script to package.json: `"validate-data": "tsx scripts/validate-data.ts"`
  - [ ] Subtask 4.8: Add pre-build hook: `"prebuild": "pnpm validate-data"`

- [ ] Task 5: Documentation and Testing (AC: 5, 6, 8)
  - [ ] Subtask 5.1: Document JSON schema structure in tech-spec-epic-1.md (already exists)
  - [ ] Subtask 5.2: Create example JSON files with comments explaining each field
  - [ ] Subtask 5.3: Run validation script and verify all data files pass
  - [ ] Subtask 5.4: Test data loader utilities with sample data
  - [ ] Subtask 5.5: Verify TypeScript type checking passes with no errors
  - [ ] Subtask 5.6: Confirm schema supports future audience-based filtering (Epic 4, FR-12)

## Dev Notes

### Architecture Patterns and Constraints

**Data Storage Approach:**
- Static JSON files in `data/` directory (no database for MVP)
- Each discipline, unit, and lesson is version-controlled in Git
- JSON structure designed for Static Site Generation (SSG) in Next.js 15
- Data loaded at build time via `generateStaticParams()` for optimal performance

**Type Safety:**
- TypeScript strict mode enabled for maximum type safety
- All data structures strictly typed to prevent runtime errors
- Zod provides runtime validation to catch data integrity issues

**Future-Proofing (FR-12 Student-Facing View Support):**
- All relevant types include optional `audience` field: `'teacher' | 'student' | 'both'`
- Defaults to `'both'` for most content, `'teacher'` for teaching guidance
- Enables Phase 3 student interface without schema changes
- Components in Epic 2 will respect audience tags via view mode props

**Performance Considerations:**
- Disciplines and units loaded as single JSON files (fast parsing)
- Individual lesson files loaded dynamically to enable code splitting
- Build-time static generation ensures zero runtime data fetching
- Target: <3s initial load, <500ms navigation (NFR-1, NFR-2)

### Project Structure Notes

**Directory Organization:**
```
lib/
├── types/          # TypeScript interfaces (Story 1.1)
│   └── lesson.ts
├── data/           # Data loader utilities (Story 1.1)
│   └── loader.ts
└── utils/          # General utilities

data/               # Static JSON data (Story 1.1)
├── disciplines.json
├── units.json
└── lessons/
    ├── lesson-6.1.1.json
    ├── lesson-8.1.2.json
    └── ...

scripts/            # Build and validation scripts
└── validate-data.ts
```

**Alignment with Unified Project Structure:**
- Follows Next.js 15 App Router conventions
- Data directory at project root for easy Git management
- Library code in `lib/` following Next.js best practices
- Scripts directory for development tooling

### Testing Standards Summary

**Unit Testing (Vitest):**
- Test data loader functions with sample data
- Verify type definitions compile without errors
- Test validation script catches invalid data

**Manual Validation:**
- Run `pnpm validate-data` to verify all JSON files
- Inspect TypeScript compilation output: `pnpm typecheck`
- Verify data loader functions return expected structures

**Integration Testing (Next.js Build):**
- Verify `next build` succeeds with data files
- Confirm static routes generated for all disciplines/units/lessons
- Check build output for data loading errors

### References

**Source Documents:**
- [PRD.md] §Requirements → FR-5: Static Data Structure with JSON Backend
- [PRD.md] §Requirements → FR-12: Student-Facing View Foundation (audience tagging)
- [solution-architecture.md] §2.4 Data Fetching Approach (JSON structure and loading patterns)
- [solution-architecture.md] §3.1 TypeScript Type Definitions (complete type schema)
- [tech-spec-epic-1.md] §3.1 Story 1.1: Define JSON Data Schema and Structure (detailed implementation)
- [epics.md] Epic 1 → Story 1.1: Technical notes and acceptance criteria

**Related Stories:**
- Story 1.2: Implement Client-Side Routing (depends on this schema)
- Story 1.5: Create Lesson Detail Page (uses Lesson type)
- Story 2.1-2.4: Lesson content components (consume data types)
- Story 4.1: Refactor Lesson Data Schema for Modular Sections (extends this schema)

**Technology Stack:**
- Next.js 15 with App Router (static site generation)
- TypeScript 5.x (strict mode)
- Zod 3.x (runtime validation)
- pnpm 9.x (package manager)

**Data Schema Version:** 1.0 (supports future expansion with audience tagging)

## Dev Agent Record

### Context Reference

- `docs/stories/story-context-1.1.xml` (Generated: 2025-10-14)

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

### File List
