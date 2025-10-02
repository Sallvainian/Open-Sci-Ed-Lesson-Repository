# Epic 2: Content Data Model & Basic CRUD

**Epic Goal:** Implement the complete three-level content hierarchy data model with full CRUD operations for Disciplines, Units, and Lessons. Deliver functional but minimal UI for creating lessons and viewing them in a simple list, validating the data model and relationships work correctly before building sophisticated navigation. This epic establishes data foundation and proves end-to-end content management capability.

## Story 2.1: Discipline and Unit Management API

As a developer,
I want API endpoints for managing Disciplines and Units,
so that the hierarchical content structure foundation exists for lesson organization.

**Acceptance Criteria:**

1. Backend endpoints implemented: GET /api/disciplines (list all), POST /api/disciplines (create new)
2. Backend endpoints implemented: GET /api/units (list all for discipline), POST /api/units (create new)
3. POST /api/disciplines accepts JSON: {"name": "Physical Science"} and returns created discipline with ID
4. POST /api/units accepts JSON: {"name": "Forces and Motion", "disciplineId": 1} and returns created unit with ID
5. GET /api/units accepts query parameter ?disciplineId=1 to filter units by discipline
6. Disciplines and Units include automatic timestamps (createdAt, updatedAt)
7. Duplicate discipline or unit names within same discipline are prevented; API returns 400 Bad Request with error message
8. API returns 404 Not Found for non-existent discipline or unit IDs
9. All endpoints require valid authentication; return 401 Unauthorized if not authenticated
10. Endpoints successfully create and retrieve disciplines and units via API testing tool (Postman/Insomnia) or automated tests

## Story 2.2: Lesson Data Model and API

As a developer,
I want comprehensive lesson data model with CRUD API endpoints,
so that lesson content can be created, stored, and retrieved with all required fields.

**Acceptance Criteria:**

1. Lesson database table includes fields: id, unitId (foreign key), lessonNumber, lessonName, createdAt, updatedAt
2. Lesson table includes text fields: standards, objectives, studentFriendlyGoals, teachingApproach (all nullable, can be populated later)
3. Lesson table includes status field (enum: draft, complete, needs_review) with default value "draft"
4. Backend endpoints implemented: GET /api/lessons (list all for unit), POST /api/lessons (create), GET /api/lessons/:id (retrieve single)
5. POST /api/lessons accepts JSON with required fields (unitId, lessonNumber, lessonName) and optional content fields
6. POST /api/lessons returns 400 Bad Request if required fields missing or invalid
7. GET /api/lessons?unitId=1 returns array of all lessons for specified unit, ordered by lessonNumber ascending
8. GET /api/lessons/:id returns complete lesson object including all fields and associated unit information
9. Lessons within same unit must have unique lessonNumber; duplicate causes 400 Bad Request with clear error message
10. All lesson endpoints require authentication; return 401 if not authenticated

## Story 2.3: Lesson Update and Delete Operations

As a developer,
I want lesson update and delete API endpoints,
so that lesson content can be modified and removed when needed.

**Acceptance Criteria:**

1. Backend endpoint implemented: PUT /api/lessons/:id (update lesson)
2. Backend endpoint implemented: DELETE /api/lessons/:id (delete lesson)
3. PUT /api/lessons/:id accepts partial JSON (any fields to update) and returns updated lesson object
4. PUT updates updatedAt timestamp automatically
5. PUT validates data types and constraints; returns 400 Bad Request for invalid data
6. PUT returns 404 Not Found for non-existent lesson ID
7. DELETE /api/lessons/:id removes lesson from database and returns 204 No Content on success
8. DELETE returns 404 Not Found for non-existent lesson ID
9. Deleting a lesson does not affect other lessons in the same unit
10. All endpoints require authentication; return 401 if not authenticated
11. Update and delete operations persist correctly; subsequent GET requests reflect changes

## Story 2.4: Simple Lesson List View UI

As a user,
I want to see a list of all lessons with basic information,
so that I can verify lessons exist in the system and select one to view details.

**Acceptance Criteria:**

1. New page route created: /lessons displaying list of all lessons
2. Navigation header includes link to "Lessons" that navigates to /lessons page
3. Page fetches all lessons via GET /api/lessons on load
4. Each lesson displays: lesson number, lesson name, unit name, status badge (draft/complete/needs_review)
5. Lessons grouped by Unit with Unit name as section header
6. Empty state message displayed if no lessons exist: "No lessons yet. Add your first lesson!"
7. Loading state displayed while fetching lessons: "Loading lessons..."
8. Error state displayed if API request fails: "Failed to load lessons. Please try again."
9. Page is responsive on desktop and tablet viewports
10. Page loads and displays lesson list within 3 seconds

## Story 2.5: Add New Lesson Form

As a user,
I want to create a new lesson by filling out a simple form,
so that I can add lessons to my repository for organization.

**Acceptance Criteria:**

1. New page route created: /lessons/new with "Add New Lesson" form
2. Navigation header includes "Add Lesson" link navigating to /lessons/new
3. Form includes fields: Discipline (dropdown), Unit (dropdown), Lesson Number (number input), Lesson Name (text input)
4. Discipline dropdown populated from GET /api/disciplines
5. Unit dropdown populated based on selected Discipline via GET /api/units?disciplineId=X
6. Unit dropdown disabled until Discipline selected; updates when Discipline changes
7. All fields are required; form displays validation errors if submitted incomplete
8. "Save Lesson" button submits form via POST /api/lessons
9. Successful save navigates to lesson list page (/lessons) with success message: "Lesson added successfully"
10. Failed save displays error message without losing form data: "Failed to create lesson: <error detail>"
11. "Cancel" button navigates back to lesson list page without saving
12. Form is responsive on desktop and tablet viewports

## Story 2.6: Lesson Detail View (Read-Only)

As a user,
I want to view complete details of a lesson on a dedicated page,
so that I can see all lesson information including currently empty content fields.

**Acceptance Criteria:**

1. New page route created: /lessons/:id displaying single lesson details
2. Lesson list page updated: clicking any lesson navigates to /lessons/:id for that lesson
3. Page fetches lesson data via GET /api/lessons/:id on load
4. Page displays all lesson fields in structured layout: Lesson Name (heading), Unit and Discipline (subtitle), Lesson Number, Status
5. Page displays content sections with labels even if empty: Standards, Objectives, Student-Friendly Goals, Teaching Approach
6. Empty content sections display placeholder text: "Not yet added" in lighter color/style
7. Page includes "Back to Lessons" link navigating to /lessons list page
8. Loading state displayed while fetching: "Loading lesson..."
9. Error state displayed if lesson not found: "Lesson not found" with link back to lessons list
10. Page is responsive on desktop and tablet viewports
11. Page loads lesson details within 2 seconds

## Story 2.7: Populate Initial Disciplines and Units

As a user,
I want the three science disciplines and initial units pre-populated,
so that I can immediately start adding lessons without manual discipline/unit creation.

**Acceptance Criteria:**

1. Database seed script or migration created to populate initial data
2. Three disciplines created: "Physical Science", "Life Science", "Earth and Space Science"
3. At least one sample unit created per discipline for testing: e.g., "Forces and Motion" (Physical Science), "Ecosystems" (Life Science), "Solar System" (Earth and Space)
4. Seed script is idempotent (can be run multiple times without creating duplicates)
5. Seed script can be executed via command: npm run db:seed or equivalent
6. Seed script runs automatically during initial deployment or database setup
7. Discipline and Unit dropdowns in "Add New Lesson" form display pre-populated data after seed
8. Documentation updated explaining how to add additional units if needed (for future expansion)

---
