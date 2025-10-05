# Open Science Education Lesson Repository Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Reduce science lesson planning time by 40% through efficient content organization and instant material access
- Achieve <30 second retrieval time for any upcoming lesson's complete materials and teaching resources
- Establish a structured, predictable lesson planning workflow that eliminates content preparation surprises
- Organize one full OpenSciEd unit (8-12 lessons minimum) with complete lesson pages following consistent template structure
- Create dual navigation system supporting both conceptual browsing (Discipline → Unit → Lesson) and chronological sequencing (pacing guide order)
- Enable confident, well-prepared science instruction through comprehensive, accessible lesson material repository

### Background Context

The Open Science Education Lesson Repository addresses a critical challenge facing early-career science teachers: information overload from comprehensive curriculum materials like OpenSciEd. While OpenSciEd provides excellent content, its sheer volume creates significant barriers to efficient lesson planning. Teachers spend excessive time navigating multiple platforms and searching through scattered resources, which undermines the foundation of effective instruction. This tool recognizes that "good teaching requires good planning" and that the solution is not more content creation, but better content organization.

This project focuses 90% on organizing existing materials and 10% on creation capabilities, deliberately simplifying scope to solve the core problem: making everything findable without extensive searching. The tool supports the reality that teachers think about lessons in two ways—conceptually (by discipline and unit) and chronologically (by teaching sequence)—requiring flexible navigation that accommodates both mental models. By providing structured hierarchy, consistent lesson page templates, and hosted resources within a single platform, the repository transforms overwhelming curriculum volume into a curated, accessible planning workflow tailored to individual teaching practice.

### Change Log

| Date       | Version | Description                                                            | Author          |
| ---------- | ------- | ---------------------------------------------------------------------- | --------------- |
| 2025-10-01 | 1.0     | Initial PRD draft created from Project Brief and Brainstorming Session | PM Agent (John) |

---

## Requirements

### Functional

- **FR1:** The system shall organize content in a three-level hierarchy: Discipline → Unit → Lesson, with Physical Science, Life Science, and Earth and Space Science as the primary disciplines
- **FR2:** Each lesson page shall follow a consistent template structure including: lesson name/title, educational standards, student objectives, student-friendly "We are learning to" statements, teaching approach/methodology, and resources section
- **FR3:** The system shall provide conceptual navigation allowing users to browse from Discipline level down through Units to individual Lessons with clear hierarchical relationships
- **FR4:** The system shall provide chronological navigation displaying lessons in teaching sequence order as defined by the pacing guide, independent of conceptual hierarchy
- **FR5:** Users shall be able to switch between conceptual and chronological navigation modes seamlessly from any lesson page
- **FR6:** The system shall support uploading and hosting PDF files, slide decks (PPTX), and document files (DOCX) associated with each lesson
- **FR7:** The system shall provide embedded viewers for uploaded files (PDF, PPTX, DOCX) allowing users to preview content without downloading
- **FR8:** Users shall be able to search across lesson names, educational standards, and learning objectives with results returned in <1 second
- **FR9:** The system shall provide "Add New Lesson" functionality that creates a new lesson page with all template sections pre-populated as empty fields
- **FR10:** Each lesson page shall support linking to related lessons (prerequisites, follow-up lessons, parallel lessons in other disciplines)
- **FR11:** The system shall display all lessons within a unit with quick navigation between sequential lessons (Previous/Next buttons)
- **FR12:** Users shall be able to mark lessons with status indicators (upcoming, in progress, completed, needs review)
- **FR13:** The chronological navigation view shall display lesson sequence numbers and maintain position within the pacing guide calendar
- **FR14:** The system shall preserve all entered content automatically without requiring manual save actions
- **FR15:** Users shall be able to edit any lesson page section inline with immediate persistence of changes

### Non Functional

- **NFR1:** Page load time for any lesson page shall be <3 seconds on standard broadband connection (25 Mbps)
- **NFR2:** File viewer loading time shall be <2 seconds for documents up to 10MB in size
- **NFR3:** Search results shall be returned in <1 second for queries across the entire curriculum database
- **NFR4:** The system shall support modern browsers (Chrome, Firefox, Safari, Edge) released within the last 2 years; Internet Explorer 11 is not required
- **NFR5:** The system shall be responsive and usable on desktop and tablet devices (minimum viewport width 768px); mobile phone optimization is not required for MVP
- **NFR6:** The system shall maintain 99.9% uptime during school hours (7am-5pm local time, Monday-Friday)
- **NFR7:** The system shall perform automated daily backups of all database content and uploaded files with 30-day retention
- **NFR8:** The system shall support concurrent file uploads with at least 5 files uploadable simultaneously
- **NFR9:** The system shall handle file storage for minimum 100 lesson pages with average 5 files per lesson (500 total files) without performance degradation
- **NFR10:** The system shall use HTTPS for all connections to protect data in transit
- **NFR11:** The system shall provide clear error messages when file uploads fail, including specific reasons (file too large, unsupported format, etc.)
- **NFR12:** The system shall maintain user session for minimum 8 hours without requiring re-authentication
- **NFR13:** Hosting costs shall target <$20/month for single-user deployment using cloud hosting services
- **NFR14:** The system shall support recovery from backup within 1 hour in case of data loss or corruption

---

## User Interface Design Goals

### Overall UX Vision

The interface should feel like a professional reference library rather than a complex software application. Visual design emphasizes clarity, quick scanning, and immediate access to information without unnecessary clicks. The aesthetic should convey organization, reliability, and calm—supporting focused planning rather than adding cognitive load. Navigation should be self-evident, with the current location always clear and next actions obvious. The tool should feel like a natural extension of the teaching workflow, not a separate system to master.

### Key Interaction Paradigms

**Two-Mode Navigation:** Users toggle between "Library View" (conceptual hierarchy: browse by discipline/unit) and "Calendar View" (chronological sequence: pacing guide order). The active mode is always visually indicated, and switching between modes preserves context (switching from Lesson 8.1.3 in Library View opens Lesson 8.1.3 in Calendar View).

**Lesson Page Consistency:** Every lesson page follows identical section ordering and structure, creating predictable scanning patterns. Sections can be collapsed/expanded, but order never changes. Empty sections are visible but clearly marked as "Not yet added," encouraging completion while showing progress.

**Quick Navigation:** From any lesson page, users can jump to related lessons (previous/next in sequence, related lessons in other units) with single-click actions. Breadcrumb navigation shows current location in hierarchy and provides instant jump-back capability.

**Inline Editing:** All content is editable in place—click any section to edit, changes save automatically. No separate "edit mode" or form views. This supports quick updates during planning without mode switching.

### Core Screens and Views

**Home/Dashboard Screen:** Provides immediate access to both navigation modes (Library and Calendar entry points), displays recently accessed lessons, shows upcoming lessons based on pacing guide, and provides global search bar. Shows high-level content coverage status (how many lessons are fully populated vs. incomplete).

**Library View (Conceptual Navigation):** Three-panel layout showing Discipline list (left), Unit list for selected discipline (middle), and Lesson list for selected unit (right). Selecting a lesson navigates to the Lesson Detail Page. Visual indicators show content completeness for each item.

**Calendar View (Chronological Navigation):** Linear timeline or calendar grid showing teaching sequence. Each lesson is numbered sequentially (Day 1, Day 2, etc.) with lesson title displayed. Current date or teaching position is clearly highlighted. Clicking any lesson opens the Lesson Detail Page.

**Lesson Detail Page:** Single-page view with all lesson sections displayed vertically in consistent order: Lesson Title/Name, Standards, Learning Objectives, Student-Friendly Goals ("We are learning to"), Teaching Approach/Methodology, Resources (with embedded file viewers or download links), and Related Lessons. Navigation controls (Previous Lesson, Next Lesson, Back to Library/Calendar) are always visible. Lesson position within unit and overall sequence is shown.

**Add New Lesson Page:** Simple form pre-populated with template structure. User fills in Discipline, Unit, Lesson Name, and optionally completes other sections. "Save and View" creates the lesson page immediately. Alternatively, "Save and Add Another" creates the lesson and clears form for rapid entry.

**Search Results Page:** List of matching lessons with context snippets showing where search term appears (in lesson name, standard, objective). Results are grouped by Discipline/Unit for context. Clicking any result navigates to that Lesson Detail Page.

### Accessibility: WCAG AA

The system shall meet WCAG 2.1 Level AA standards including:

- Sufficient color contrast for all text (minimum 4.5:1 for normal text, 3:1 for large text)
- Keyboard navigation support for all interactive elements with visible focus indicators
- Semantic HTML structure with proper heading hierarchy and ARIA labels where needed
- Alt text for any informational images or icons
- Responsive text sizing supporting browser zoom to 200% without loss of functionality
- Form inputs with associated labels and clear error messaging

### Branding

The UI should convey professional educational context with clean, modern aesthetics. Visual design should avoid playful or consumer-app styling—this is a professional tool for educators. Specific branding elements to be determined based on user's preferred UI stack example, but general guidance includes:

- Clean, sans-serif typography for readability
- Generous whitespace and clear visual hierarchy
- Color palette emphasizing neutrals with accent color for interactive elements
- Professional iconography (simple, clear, recognizable)
- Consistent spacing and alignment throughout

### Target Device and Platforms: Web Responsive

Primary platform is web-based application accessible via desktop and tablet browsers. Responsive design supports minimum viewport width of 768px (tablet landscape). The application prioritizes desktop/laptop usage during planning sessions but should degrade gracefully on tablets. Mobile phone support (viewports <768px) is not required for MVP—this is a planning tool used at desks, not on-the-go. Target browsers: Chrome, Firefox, Safari, Edge (current versions and up to 2 years prior).

---

## Technical Assumptions

### Repository Structure: Monorepo

The project will use a **monorepo structure** containing both frontend and backend code within a single repository. This decision supports:

- Simplified dependency management and version coordination between frontend/backend
- Easier code sharing for shared types, utilities, and validation logic
- Single CI/CD pipeline for entire application stack
- Better developer experience for single-developer project (no repository switching)
- Atomic commits that span frontend and backend changes

The monorepo will likely use workspaces (npm/yarn workspaces or similar) to separate frontend and backend packages while maintaining unified dependency management.

### Service Architecture

**Monolith with Modular Structure**

The application will follow a monolithic architecture with clear internal module boundaries rather than microservices. This approach is appropriate because:

- MVP scope is limited and well-defined (lesson content management)
- Single-user deployment doesn't require independent scaling of components
- Simplified deployment and operations for personal tool
- Faster development velocity without distributed system complexity
- Easier data consistency without cross-service coordination

The backend will be structured with clear separation between:

- API/routing layer (handles HTTP requests/responses)
- Business logic layer (content management, file handling)
- Data access layer (database operations, file storage operations)

If the application scales to multi-user in future, the modular structure supports extracting services as needed without complete rewrite.

### Testing Requirements

**Unit + Integration Testing with Manual E2E**

The testing strategy prioritizes:

**Unit Testing (Required):**

- Business logic functions and utilities
- Data validation and transformation logic
- Helper functions and shared utilities
- Target: >80% coverage for critical business logic

**Integration Testing (Required):**

- API endpoint testing with database interactions
- File upload and storage operations
- Search functionality across database
- Content hierarchy navigation logic
- Target: All critical user paths covered

**End-to-End Testing (Manual):**

- Manual testing of complete user workflows during development
- Automated E2E tests not required for MVP due to single-user scope and rapid iteration needs
- Manual test checklist maintained for regression testing before releases

**Testing Philosophy:**

- Tests should be meaningful and catch real bugs, not just achieve coverage numbers
- Integration tests more valuable than excessive unit test mocking for this application type
- Manual testing acceptable for UI workflows in single-user MVP context
- Automated testing investment increases if moving to multi-user/production deployment

**Test Execution:**

- Tests must be runnable locally without complex setup
- CI/CD pipeline runs all automated tests on every commit
- Failed tests block merging to main branch

### Additional Technical Assumptions and Requests

**Technology Stack Selection:**

- Frontend framework and UI stack to be determined based on user's preferred example (TBD - awaiting user input)
- Backend language/framework to be chosen for compatibility with frontend choice and file handling capabilities (likely Node.js/Express or Python/FastAPI)
- Database to be PostgreSQL or SQLite depending on hosting choice and data complexity needs

**File Storage Architecture:**

- Files stored in cloud object storage (AWS S3, Cloudflare R2, or similar) for durability and CDN capabilities
- File metadata tracked in database with references to storage URLs
- Support for files up to 50MB per file (accommodates large slide decks and PDF documents)
- File upload directly from browser to storage (presigned URLs) to avoid server bandwidth limitations

**Development Environment:**

- Local development environment should be simple to set up (single command to start full stack)
- Hot reloading for both frontend and backend during development
- Database migrations tracked in version control for schema evolution
- Environment configuration via .env files (not committed to repo)

**Deployment and Hosting:**

- Cloud hosting preferred for reliability and minimal maintenance (Vercel, Netlify, Railway, Render, or similar)
- Automated deployment from main branch via CI/CD
- Separate staging environment not required for MVP (deploy directly to production)
- Database backups automated by hosting provider or scheduled backup scripts
- Target hosting cost <$20/month for single-user scale

**Security Considerations:**

- Basic password authentication sufficient for MVP (single user)
- HTTPS enforced for all connections
- Database credentials and API keys stored as environment variables, never in code
- Regular security updates for dependencies (automated via Dependabot or similar)

**Development Tooling:**

- ESLint/Prettier for code formatting and linting
- TypeScript preferred if JavaScript-based stack chosen for type safety
- Git hooks for pre-commit checks (linting, formatting, tests)
- Clear documentation for setup, development workflow, and deployment

**Content Migration Strategy:**

- Initial content entry will be manual (no bulk import for MVP)
- Lesson page template structure supports copy-paste from existing materials
- File upload via UI for associating resources with lessons
- Future enhancement: Google Drive import automation (post-MVP)

---

## Epic List

The following epics represent the sequential development path for the MVP, with each epic delivering end-to-end, deployable functionality:

**Epic 1: Foundation & Core Infrastructure**
Establish project foundation with application setup, basic hosting, and initial "hello world" deployment. While focusing on infrastructure, deliver a simple but functional landing page confirming the application is live and accessible. This epic includes repository initialization, CI/CD pipeline configuration, database setup, and hosting configuration to enable all future development.

**Epic 2: Content Data Model & Basic CRUD**
Implement the three-level content hierarchy (Discipline → Unit → Lesson) with full database schema, data access layer, and basic API endpoints for creating, reading, updating, and deleting lessons. Deliver a functional but minimal UI for adding lessons and viewing them, validating the data model works correctly end-to-end before building complex navigation.

**Epic 3: Lesson Page Structure & Template**
Build the complete lesson page template with all required sections (standards, objectives, teaching approach, resources) and consistent structure across all lessons. Deliver fully functional lesson detail pages displaying all content in proper format, with inline editing capabilities and automatic save functionality. This establishes the core user experience for lesson content.

**Epic 4: Dual Navigation System**
Implement both conceptual navigation (Library View: Discipline → Unit → Lesson browsing) and chronological navigation (Calendar View: pacing guide sequence), with seamless switching between modes. Deliver complete navigation experience allowing users to find lessons by either mental model, including breadcrumb trails, previous/next lesson controls, and related lesson links.

**Epic 5: File Upload & Resource Management**
Add file upload capabilities with cloud storage integration, embedded file viewers for PDFs and documents, and resource association with lessons. Deliver complete file management workflow from upload through display, enabling users to store all lesson materials within the application for instant access.

**Epic 6: Search & Quick Access Features**
Implement search functionality across lesson names, standards, and objectives with fast results (<1 second), plus "Add New Lesson" workflow with template pre-population. Deliver final user-facing features that complete the planning workflow: finding lessons quickly via search and adding new lessons efficiently.

---

## Epic 1: Foundation & Core Infrastructure

**Epic Goal:** Establish the technical foundation for the project with repository setup, database initialization, basic authentication, CI/CD pipeline, hosting configuration, and a minimal deployed landing page confirming infrastructure is functional. This epic delivers project scaffolding and core services while demonstrating end-to-end deployment capability.

### Story 1.1: Project Repository Initialization

As a developer,
I want the project repository initialized with proper structure, tooling, and initial configuration,
so that development can proceed with consistent standards and all team members (future) have a clear starting point.

**Acceptance Criteria:**

1. Git repository created with appropriate .gitignore for chosen tech stack
2. Monorepo structure established with clear separation between frontend and backend workspaces
3. Package manager configuration (npm/yarn workspaces or equivalent) implemented and functional
4. README.md created with project overview, setup instructions, and basic architecture diagram
5. Development tooling configured: ESLint, Prettier, pre-commit hooks for linting and formatting
6. Environment variable template files created (.env.example) for local development configuration
7. Basic project documentation structure created in /docs directory
8. All configuration files committed and repository ready for first development work

### Story 1.2: Database Setup and Schema Foundation

As a developer,
I want the database system configured with initial schema for core entities,
so that data persistence is available for content storage and the basic data model is validated.

**Acceptance Criteria:**

1. Database system selected and documented in README (PostgreSQL or SQLite based on hosting choice)
2. Database connection configuration implemented with environment variable support
3. Migration system initialized (e.g., Knex.js, Prisma, or similar) for schema version control
4. Initial migration created with tables for Disciplines, Units, Lessons with proper relationships
5. Database includes basic fields: id, name, timestamps (created_at, updated_at)
6. Foreign key constraints properly set up between tables (Unit → Discipline, Lesson → Unit)
7. Local database can be initialized with single command (npm run db:setup or equivalent)
8. Database connection tested via simple CLI script or test that confirms connectivity and basic CRUD operations

### Story 1.3: Backend API Foundation

As a developer,
I want a basic backend API server configured with health check endpoint,
so that the backend infrastructure is operational and deployable for further feature development.

**Acceptance Criteria:**

1. Backend framework initialized (Node.js/Express, Python/FastAPI, or chosen framework)
2. Server starts successfully on configurable port via environment variable
3. Health check endpoint implemented (GET /api/health) returning JSON: {"status": "ok", "timestamp": "<ISO-datetime>"}
4. CORS configuration implemented for local frontend development
5. Basic error handling middleware implemented for catching and logging server errors
6. Request logging middleware added for debugging (logs method, path, status code, response time)
7. Server can be started locally with single command (npm run dev:backend or equivalent)
8. Health check endpoint successfully returns 200 OK when server is running

### Story 1.4: Frontend Application Foundation

As a developer,
I want the frontend application initialized with routing and basic layout,
so that the UI framework is operational and ready for feature implementation.

**Acceptance Criteria:**

1. Frontend framework initialized based on user's preferred tech stack (React, Vue, or similar)
2. Development server starts successfully with hot-reloading enabled
3. Basic routing configured with at least home route (/)
4. Base application layout component created with header, main content area, and footer placeholders
5. Global styling foundation established (CSS reset, base typography, color variables)
6. API client utility configured for making requests to backend with error handling
7. Environment variable support for API base URL (allows different backends for dev/staging/prod)
8. Frontend can be started locally with single command (npm run dev:frontend or equivalent)
9. Application renders successfully in browser at localhost with "Welcome" or placeholder content

### Story 1.5: Basic Authentication Implementation

As a user,
I want to log in to the application with username and password,
so that my lesson content is protected and only accessible to me.

**Acceptance Criteria:**

1. Login page created with username/password form fields
2. Backend endpoint implemented: POST /api/auth/login accepting username/password
3. Password securely hashed and validated against stored credential (single hardcoded user acceptable for MVP)
4. Authentication successful returns JWT token or session ID with appropriate expiration (8 hours)
5. Frontend stores authentication token securely (httpOnly cookie or localStorage with appropriate security)
6. Protected API routes require valid authentication token; return 401 Unauthorized if missing or invalid
7. Frontend redirects unauthenticated users to login page when accessing protected routes
8. Logout functionality implemented clearing authentication token (endpoint: POST /api/auth/logout)
9. User remains authenticated across browser refresh for duration of token validity
10. Login with correct credentials grants access; incorrect credentials return clear error message

### Story 1.6: CI/CD Pipeline Configuration

As a developer,
I want automated CI/CD pipeline that runs tests and deploys to production,
so that code changes are validated automatically and deployments are consistent and reliable.

**Acceptance Criteria:**

1. CI/CD platform configured (GitHub Actions, GitLab CI, or chosen platform)
2. CI pipeline runs on every push to main branch and all pull requests
3. CI pipeline executes: linting (ESLint), formatting check (Prettier), unit tests (if any exist yet)
4. CI pipeline blocks merge if any checks fail
5. CD pipeline triggers automatic deployment to hosting platform on successful main branch merge
6. Deployment includes both frontend and backend components
7. Environment variables for production configured in hosting platform (not exposed in repository)
8. Deployment status visible in repository (GitHub commit status, badges, or similar)
9. Failed deployments send notification or alert (email, Slack, or platform notification)
10. Deployment process documented in README with manual rollback procedure

### Story 1.7: Hosting and Production Environment Setup

As a user,
I want the application deployed to a publicly accessible URL,
so that I can access my lesson planning tool from any internet-connected device.

**Acceptance Criteria:**

1. Hosting platform selected and configured (Vercel, Netlify, Railway, Render, or similar)
2. Database hosted on platform supporting provider or separate database hosting service (e.g., Railway PostgreSQL, Supabase, PlanetScale)
3. Production environment variables configured securely on hosting platform (database URL, auth secret, etc.)
4. Application accessible via HTTPS at stable URL (custom domain not required for MVP; hosting provider subdomain acceptable)
5. Database migrations run automatically during deployment or via manual command
6. Application health check endpoint (GET /api/health) returns 200 OK in production environment
7. Frontend successfully loads and displays login page in production
8. Backend API endpoints accessible from frontend in production (CORS configured correctly)
9. Automated daily backups configured for production database (via hosting provider feature or scheduled task)
10. Application remains accessible and functional after deployment with no critical errors in logs

### Story 1.8: Landing Page with Navigation Foundation

As a user,
I want to see a welcoming landing page after login with basic navigation structure,
so that I know the application is working and understand where to go next.

**Acceptance Criteria:**

1. Landing page (/) displays after successful login with welcome message
2. Navigation header includes application name/logo and placeholder navigation menu
3. Landing page content includes brief description of tool purpose: "Organize your OpenSciEd science lessons"
4. Placeholder buttons or links for future features: "Library View", "Calendar View", "Add New Lesson"
5. Clicking placeholder navigation elements displays "Coming soon" message (functionality in later epics)
6. Footer includes basic information: current logged-in user, logout button
7. Page is responsive and displays correctly on desktop (1920px) and tablet (768px) viewports
8. Page loads in <2 seconds on standard broadband connection
9. Navigation header persists across all future pages (implemented in base layout component)
10. User can logout from landing page and is redirected to login page

---

## Epic 2: Content Data Model & Basic CRUD

**Epic Goal:** Implement the complete three-level content hierarchy data model with full CRUD operations for Disciplines, Units, and Lessons. Deliver functional but minimal UI for creating lessons and viewing them in a simple list, validating the data model and relationships work correctly before building sophisticated navigation. This epic establishes data foundation and proves end-to-end content management capability.

### Story 2.1: Discipline and Unit Management API

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

### Story 2.2: Lesson Data Model and API

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

### Story 2.3: Lesson Update and Delete Operations

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

### Story 2.4: Simple Lesson List View UI

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

### Story 2.5: Add New Lesson Form

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

### Story 2.6: Lesson Detail View (Read-Only)

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

### Story 2.7: Populate Initial Disciplines and Units

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

## Epic 3: Lesson Page Structure & Template

**Epic Goal:** Build the complete lesson page template with all required sections in consistent, structured format. Deliver fully functional lesson detail pages displaying all content properly with inline editing capabilities and automatic save. This epic establishes the core user experience for viewing and editing lesson content, ensuring every lesson follows the same predictable structure.

### Story 3.1: Lesson Detail Page Template Layout

As a user,
I want to see lesson content organized in consistent sections with clear structure,
so that I can quickly scan any lesson and find the information I need in predictable locations.

**Acceptance Criteria:**

1. Lesson detail page redesigned with structured template layout (replaces simple read-only view from Epic 2)
2. Page displays sections in fixed order: Title/Name, Standards, Learning Objectives, Student-Friendly Goals ("We are learning to"), Teaching Approach/Methodology, Resources (placeholder for now), Related Lessons (placeholder)
3. Each section has clear heading and visual separation (whitespace, border, or card styling)
4. Section headings use consistent typography hierarchy (h2 for section titles)
5. Empty sections display placeholder text: "Click to add <section name>" in lighter style
6. Page includes metadata header showing: Discipline, Unit, Lesson Number, Status badge
7. Page maintains existing navigation: Back to Lessons link, breadcrumb showing Discipline > Unit > Lesson Name
8. Page is responsive and sections stack vertically on tablet viewports
9. All sections visible on page load without scrolling excessively (reasonable page length)
10. Page layout matches overall application styling and branding from Epic 1

### Story 3.2: Inline Editing for Text Sections

As a user,
I want to edit lesson content directly on the lesson page by clicking any section,
so that I can update lesson information quickly without navigating to separate edit forms.

**Acceptance Criteria:**

1. All text sections (Standards, Objectives, Student-Friendly Goals, Teaching Approach) support inline editing
2. Clicking empty section with "Click to add" placeholder switches to edit mode with text input area
3. Clicking existing content in any section switches to edit mode with current content pre-populated
4. Edit mode displays textarea or rich text editor (depending on section - textarea acceptable for MVP)
5. Edit mode shows "Save" and "Cancel" buttons below text area
6. Clicking "Save" sends PUT /api/lessons/:id with updated section content
7. Successful save replaces edit mode with updated display content and shows brief success indicator ("Saved" badge, checkmark)
8. Clicking "Cancel" reverts to display mode without saving changes
9. Failed save displays error message without losing entered content: "Save failed: <error detail>"
10. Only one section is editable at a time; clicking different section while editing prompts to save or cancel current edit
11. Edit mode is responsive on tablet viewports with textarea expanding to full width

### Story 3.3: Auto-Save Functionality

As a user,
I want lesson changes to save automatically after I stop typing,
so that I don't lose work and don't have to manually click save constantly.

**Acceptance Criteria:**

1. Auto-save triggers automatically 2 seconds after user stops typing in any text field
2. Auto-save indicator appears during save operation: "Saving..." text or spinner near edited section
3. Auto-save success shows brief confirmation: "Saved" indicator with checkmark that fades after 1 second
4. Auto-save failure displays error message: "Auto-save failed. Changes not saved." with "Retry" button
5. User can continue editing while auto-save is in progress without interruption
6. Multiple rapid edits to different sections batch into single save request when possible
7. Explicit "Save" button still works and triggers immediate save overriding auto-save delay
8. Auto-save respects unsaved changes; doesn't overwrite with stale data if multiple clients eventually (single-user MVP acceptable, but design prevents race conditions)
9. Network errors during auto-save are handled gracefully with retry mechanism (3 attempts with exponential backoff)
10. Page leaving/refresh prompts user if unsaved changes exist: "You have unsaved changes. Are you sure you want to leave?"

### Story 3.4: Standards Section with Multi-Item Support

As a user,
I want to add multiple educational standards to a lesson with proper formatting,
so that each lesson clearly identifies which standards it addresses.

**Acceptance Criteria:**

1. Standards section supports adding multiple standard entries (e.g., "NGSS MS-PS2-1", "NGSS MS-PS2-2")
2. Each standard entry displays as separate item in a list format
3. "Add Standard" button in section allows adding new standard entry
4. Each standard entry has inline edit capability and delete button (small X icon)
5. Standard entries can be plain text or formatted (e.g., "NGSS MS-PS2-1: Motion and Stability")
6. Empty standards section displays: "No standards added yet. Click to add."
7. Adding first standard immediately shows it in list; subsequent additions append to list
8. Deleting standard shows confirmation prompt: "Remove this standard?" with Yes/No options
9. Standard changes (add, edit, delete) trigger auto-save after 2 second delay
10. Standards display in order added (chronological); reordering not required for MVP
11. At least 10 standards can be added to single lesson without UI breaking or performance issues

### Story 3.5: Learning Objectives Section

As a user,
I want to add clear learning objectives that describe what students will learn,
so that each lesson has well-defined educational goals.

**Acceptance Criteria:**

1. Learning Objectives section displays as bulleted or numbered list
2. Section supports adding multiple objectives with "Add Objective" button
3. Each objective displays on separate line in list format
4. Each objective has inline edit capability and delete button
5. Empty section displays: "No learning objectives added yet. Click to add."
6. Objectives can be text entries (e.g., "Students will understand the relationship between force and motion")
7. Deleting objective shows confirmation: "Remove this objective?" with Yes/No
8. Objective changes trigger auto-save after 2 second delay
9. Objectives display in order added; reordering not required for MVP
10. At least 10 objectives can be added without UI issues

### Story 3.6: Student-Friendly Goals Section

As a user,
I want to create student-friendly "We are learning to" statements,
so that students can understand lesson goals in accessible language.

**Acceptance Criteria:**

1. Student-Friendly Goals section displays list of "We are learning to" statements
2. Section supports adding multiple goals with "Add Goal" button
3. Each goal entry automatically prefixed with "We are learning to" in display (user enters completion phrase)
4. Example placeholder in empty goal entry: "identify patterns in motion" or "explain how forces affect movement"
5. Each goal has inline edit and delete capability
6. Empty section displays: "No student-friendly goals added yet. Click to add."
7. Deleting goal shows confirmation: "Remove this goal?"
8. Goal changes trigger auto-save after 2 second delay
9. Goals display in order added; reordering not required for MVP
10. At least 8 goals can be added without UI issues
11. Goals are visually distinct from Learning Objectives (different styling, clear section separation)

### Story 3.7: Teaching Approach Section with Rich Text

As a user,
I want to describe the teaching methodology and approach for each lesson,
so that I have guidance on how to deliver the lesson effectively.

**Acceptance Criteria:**

1. Teaching Approach section displays larger text area for longer-form content
2. Section supports basic text formatting: paragraphs, bold, italic, lists (rich text editor or Markdown acceptable)
3. Empty section displays: "Click to add teaching approach and methodology"
4. Inline editing switches to larger text editor (minimum 200px height) when clicked
5. Editor supports multiple paragraphs and line breaks
6. Content saves with formatting preserved when displayed (bold stays bold, lists stay lists)
7. Section auto-saves after 2 seconds of no typing
8. Section displays formatted content in readable layout matching overall page style
9. Section handles long content (500+ words) without breaking layout or performance issues
10. "Clear" button allows removing all content with confirmation: "Clear all teaching approach content?"

### Story 3.8: Lesson Status Management

As a user,
I want to change lesson status to track completion and review needs,
so that I know which lessons are ready and which need more work.

**Acceptance Criteria:**

1. Lesson status badge displays prominently in metadata header: Draft (gray), Complete (green), Needs Review (yellow/orange)
2. Clicking status badge opens dropdown or modal with status options: Draft, Complete, Needs Review
3. Selecting new status immediately updates lesson via PUT /api/lessons/:id with new status value
4. Status change shows brief confirmation: "Status updated to <new status>"
5. Status change fails gracefully with error message if API request fails
6. Status visible in lesson list page (from Epic 2) so users can filter or scan lesson states
7. Default status for new lessons is "Draft"
8. Status persists correctly; refreshing page maintains selected status
9. Status change logged with timestamp in lesson updatedAt field
10. Future enhancement placeholder: filter lessons by status in list view (implementation in Epic 6)

---

## Epic 4: Dual Navigation System

**Epic Goal:** Implement both conceptual navigation (Library View: hierarchical Discipline → Unit → Lesson browsing) and chronological navigation (Calendar View: pacing guide teaching sequence), with seamless mode switching. Deliver complete navigation experience allowing users to find lessons using either mental model, including breadcrumb trails, previous/next controls, related lesson links, and clear indication of current location. This epic fulfills the core requirement for dual navigation supporting different planning contexts.

### Story 4.1: Library View - Discipline and Unit Browser

As a user,
I want to browse lessons by discipline and unit in a hierarchical structure,
so that I can find lessons conceptually by topic area.

**Acceptance Criteria:**

1. New page route created: /library displaying Library View interface
2. Navigation header includes "Library View" link navigating to /library
3. Page layout shows three-panel or accordion structure: Disciplines list (left/top), Units list (middle), Lessons list (right/bottom)
4. Disciplines list populated from GET /api/disciplines showing all disciplines
5. Clicking discipline loads units for that discipline via GET /api/units?disciplineId=X in Units panel
6. Units panel displays "Select a discipline" message until discipline selected
7. Clicking unit loads lessons for that unit via GET /api/lessons?unitId=X in Lessons panel
8. Lessons panel displays "Select a unit" message until unit selected
9. Clicking lesson navigates to lesson detail page (/lessons/:id)
10. Selected discipline, unit, and lesson visually highlighted in respective panels (background color, border, or bold text)
11. Page is responsive: panels stack vertically on tablet viewports
12. Page loads initial disciplines within 2 seconds; unit and lesson lists load within 1 second after selection

### Story 4.2: Calendar View - Chronological Sequence

As a user,
I want to view lessons in chronological teaching order following my pacing guide,
so that I can see what I'm teaching next regardless of discipline or unit boundaries.

**Acceptance Criteria:**

1. New page route created: /calendar displaying Calendar View interface
2. Navigation header includes "Calendar View" link navigating to /calendar
3. Page displays lessons in sequential order based on pacing guide sequence (initially by lesson number across all units)
4. Each lesson displays: sequence number (Day 1, Day 2, etc.), lesson name, unit name (context), discipline name
5. Lessons displayed as cards or list items in vertical timeline or grid layout
6. Current teaching position highlighted if determinable (initially: first lesson with status "Draft" or "Needs Review")
7. Clicking lesson navigates to lesson detail page (/lessons/:id)
8. Empty state displays if no lessons exist: "No lessons in pacing guide yet. Add lessons to see sequence."
9. Page loads and displays lesson sequence within 3 seconds
10. Page is responsive: cards/items adjust to single column on tablet viewports

### Story 4.3: Pacing Guide Sequence Management

As a user,
I want to define the chronological teaching order for lessons across all disciplines,
so that Calendar View shows the correct sequence I actually teach.

**Acceptance Criteria:**

1. Lesson data model updated to include sequenceNumber field (nullable integer, unique across all lessons)
2. API endpoint implemented: PUT /api/lessons/:id/sequence accepting {"sequenceNumber": <number>}
3. Calendar View orders lessons by sequenceNumber ascending; lessons without sequenceNumber appear at end
4. Calendar View displays "Configure Sequence" button opening sequence editor modal or page
5. Sequence editor lists all lessons with drag-and-drop or number input for reordering
6. Saving sequence editor updates all lesson sequenceNumbers via batch API call
7. Lessons within same unit can have non-contiguous sequence numbers (e.g., Unit 8 lesson on Day 5, Unit 9 lesson on Day 6, Unit 8 lesson on Day 7)
8. Duplicate sequence numbers prevented; assignment shows error: "Day <number> already assigned to another lesson"
9. Sequence changes persist correctly; Calendar View immediately reflects new order after save
10. "Add to Pacing Guide" button on lesson detail page allows assigning sequence number if not yet set

### Story 4.4: Navigation Mode Toggle

As a user,
I want to switch between Library View and Calendar View easily from anywhere in the app,
so that I can use whichever navigation mode fits my current planning context.

**Acceptance Criteria:**

1. Navigation header includes toggle or tabs: "Library View" and "Calendar View" with active mode highlighted
2. Clicking inactive mode switches to that mode immediately (navigates to /library or /calendar)
3. Current mode visually indicated with active state styling (bold text, underline, background color, or border)
4. Mode toggle accessible from all pages (lesson detail, list, add lesson)
5. Switching modes preserves context when possible: switching from Lesson Detail returns to appropriate view with that lesson's context visible
6. URL changes reflect current mode: /library or /calendar
7. Accessing /lessons (old list page from Epic 2) redirects to /library (Library View becomes primary list interface)
8. Mode preference persists in session: refreshing page maintains last selected mode
9. Toggle is responsive and clear on both desktop and tablet viewports
10. Switching modes completes within 1 second (page navigation time)

### Story 4.5: Lesson Detail Page Navigation Enhancements

As a user,
I want clear navigation from lesson detail page back to my current view mode,
so that I can return to browsing without losing my place.

**Acceptance Criteria:**

1. Lesson detail page includes "Back to Library" or "Back to Calendar" link depending on referrer (last navigation mode used)
2. Clicking back link navigates to appropriate view (/library or /calendar) with lesson's context pre-selected
3. Library View back navigation selects lesson's discipline and unit automatically, showing lessons list with target lesson visible
4. Calendar View back navigation scrolls to lesson's position in sequence automatically
5. Breadcrumb navigation updated to reflect current mode: "Library > [Discipline] > [Unit] > [Lesson]" or "Calendar > Day [X] > [Lesson]"
6. Breadcrumb links are functional: clicking discipline or unit in breadcrumb navigates to that level in Library View
7. "Previous Lesson" and "Next Lesson" buttons added to lesson detail page
8. Previous/Next buttons navigate based on current mode: conceptual order (within unit) if from Library, chronological order (sequence) if from Calendar
9. Previous button disabled if current lesson is first in sequence/unit; Next button disabled if last
10. All navigation changes complete within 1 second

### Story 4.6: Related Lessons Links

As a user,
I want to see and access related lessons (prerequisites, follow-ups, parallel lessons in other disciplines),
so that I can understand lesson relationships and navigate between connected content.

**Acceptance Criteria:**

1. Lesson data model updated to support relationships: prerequisiteLessons (array of lesson IDs), followUpLessons (array of lesson IDs)
2. Lesson detail page displays "Related Lessons" section near top or bottom of page
3. Section shows three subsections: Prerequisites, Follow-up Lessons, Parallel Lessons (if any exist for each)
4. Each related lesson displays as clickable link: lesson name with unit name as subtitle
5. Clicking related lesson link navigates to that lesson's detail page
6. Empty related lessons sections display: "No prerequisites" / "No follow-up lessons" / "No parallel lessons"
7. Lesson edit capability added: "Edit Related Lessons" button opens modal or inline editor
8. Editor allows searching and selecting lessons by name to add as prerequisites or follow-ups
9. Parallel lessons automatically detected: lessons with same sequenceNumber (teaching on same day) in different units
10. Related lessons links maintain navigation context: returning from related lesson navigates back correctly

### Story 4.7: Quick Navigation Between Sequential Lessons

As a user,
I want to quickly move through lessons in sequence with keyboard shortcuts or prominent buttons,
so that I can review multiple lessons rapidly during planning.

**Acceptance Criteria:**

1. Lesson detail page displays large Previous/Next navigation buttons (not just small links)
2. Buttons positioned prominently: top right corner or floating navigation bar at bottom of page
3. Previous button includes lesson name preview in tooltip or subtitle: "Previous: [Lesson Name]"
4. Next button includes lesson name preview: "Next: [Lesson Name]"
5. Keyboard shortcuts implemented: Left arrow key = Previous lesson, Right arrow key = Next lesson
6. Keyboard shortcuts work when focus is anywhere on page (not just in text editing areas)
7. Keyboard shortcuts prevented when user is actively editing text (editing mode disables shortcuts)
8. Navigating to previous/next lesson scrolls page to top automatically
9. Previous/Next navigation follows current mode context (conceptual vs chronological)
10. Navigation feels immediate: lesson transition completes within 1 second with smooth loading indicator if needed

---

## Epic 5: File Upload & Resource Management

**Epic Goal:** Add comprehensive file upload capabilities with cloud storage integration, embedded file viewers for PDFs and documents, and resource association with lessons. Deliver complete file management workflow from upload through display, enabling users to store all lesson materials within the application for instant access. This epic fulfills the "hosted resources" requirement allowing teachers to consolidate materials in one place.

### Story 5.1: File Upload Infrastructure and Storage

As a developer,
I want cloud file storage configured with upload capabilities from browser,
so that users can upload lesson resource files and they are stored reliably.

**Acceptance Criteria:**

1. Cloud storage service integrated (AWS S3, Cloudflare R2, Backblaze B2, or similar) with credentials configured in environment variables
2. File upload API endpoint implemented: POST /api/lessons/:lessonId/files accepting multipart/form-data
3. Endpoint supports files up to 50MB per file
4. Endpoint validates file types: PDF (.pdf), PowerPoint (.pptx, .ppt), Word documents (.docx, .doc) only; rejects others with 400 Bad Request
5. Uploaded file stored in cloud storage with unique filename (UUID or hash-based to prevent collisions)
6. File metadata saved in database: id, lessonId (foreign key), originalFilename, storedFilename, fileSize, fileType (MIME type), uploadedAt timestamp
7. Successful upload returns JSON with file metadata including public URL for accessing file
8. Failed upload returns clear error: file too large, unsupported type, storage error, etc.
9. File upload endpoint requires authentication; return 401 if not authenticated
10. Files are stored securely with appropriate access controls (public read if no authentication needed for viewing, or presigned URLs for temporary access)

### Story 5.2: File Upload UI Component

As a user,
I want to upload files from my computer to associate with a lesson,
so that all lesson materials are stored together and easily accessible.

**Acceptance Criteria:**

1. Lesson detail page Resources section updated with "Upload File" button or drag-and-drop area
2. Clicking "Upload File" opens file picker dialog (browser native input type="file")
3. File picker restricts to accepted types: PDF, PPTX, PPT, DOCX, DOC (accept attribute configured)
4. Drag-and-drop area accepts files dragged from desktop; displays "Drop file here" message on hover
5. Multiple files can be selected or dropped simultaneously (up to 5 files at once)
6. Upload progress indicator displays for each file: progress bar, percentage, or spinner with "Uploading <filename>..."
7. Successful upload shows confirmation: "File uploaded successfully" with checkmark icon
8. Failed upload shows error: "Failed to upload <filename>: <reason>" in red text
9. Uploaded files immediately appear in Resources section list without page refresh
10. Upload button disabled during active upload to prevent duplicate submissions
11. File size limit (50MB) enforced in UI; files exceeding limit show error before upload attempt: "File too large. Maximum size: 50MB"

### Story 5.3: Resource List Display on Lesson Page

As a user,
I want to see all uploaded files for a lesson in an organized list,
so that I know what materials are available and can access them quickly.

**Acceptance Criteria:**

1. Lesson detail page Resources section displays list of all associated files
2. File list fetched via GET /api/lessons/:lessonId/files on page load
3. Each file displays: original filename, file type icon (PDF, PPTX, DOCX), file size (formatted: KB, MB), upload date
4. Files sorted by upload date descending (most recent first)
5. Empty resources section displays: "No files uploaded yet. Upload your first resource."
6. Each file entry has "View" button to open embedded viewer (Story 5.4)
7. Each file entry has "Download" link to download original file
8. Each file entry has "Delete" button (icon: trash can or X) to remove file
9. Resources section is collapsible with section heading "Resources (X files)" showing count
10. Section layout is responsive: file list stacks vertically on tablet viewports

### Story 5.4: Embedded File Viewers

As a user,
I want to preview uploaded files directly on the lesson page without downloading,
so that I can quickly check content without leaving the application.

**Acceptance Criteria:**

1. Clicking "View" button on PDF file opens embedded PDF viewer in modal or inline expansion
2. PDF viewer displays full document with scroll capability
3. PDF viewer includes basic controls: zoom in/out, fit to width, download button
4. Clicking "View" button on PPTX/PPT file opens embedded PowerPoint viewer (using Office Online viewer, Google Docs viewer, or similar embedded iframe)
5. PowerPoint viewer displays slides with navigation controls (if supported by viewer service)
6. Clicking "View" button on DOCX/DOC file opens embedded Word document viewer (using Office Online viewer, Google Docs viewer, or similar)
7. Word viewer displays formatted document with scroll capability
8. All viewers include "Close" button to dismiss and return to lesson page
9. Viewer modal/expansion is responsive: scales appropriately on tablet viewports
10. Viewer loading shows spinner or "Loading document..." message while content loads
11. Viewer error handling: if document fails to load, display error message: "Unable to preview this file. Try downloading instead." with download button

### Story 5.5: File Deletion and Management

As a user,
I want to delete uploaded files that are no longer needed,
so that I can keep lesson resources current and remove outdated materials.

**Acceptance Criteria:**

1. Clicking "Delete" button on file shows confirmation modal: "Are you sure you want to delete <filename>? This cannot be undone."
2. Confirmation modal has "Cancel" and "Delete" buttons
3. Clicking "Delete" in confirmation calls DELETE /api/lessons/:lessonId/files/:fileId
4. API endpoint removes file from cloud storage and deletes metadata from database
5. Successful deletion removes file from Resources list immediately without page refresh
6. Successful deletion shows brief confirmation: "File deleted" message
7. Failed deletion shows error: "Failed to delete file: <reason>" and file remains in list
8. Deleted files cannot be recovered (permanent deletion confirmed in UI messaging)
9. Deleting file while viewer is open closes viewer automatically
10. File deletion requires authentication; return 401 if not authenticated

### Story 5.6: Bulk File Operations

As a user,
I want to upload multiple files at once and manage files in batch,
so that I can efficiently organize many resources without repetitive individual uploads.

**Acceptance Criteria:**

1. File upload UI supports selecting multiple files (5 files maximum per batch)
2. Drag-and-drop area accepts multiple files simultaneously
3. Each file in batch shows individual upload progress
4. Failed files in batch do not cancel other uploads; each file handled independently
5. Batch upload completion shows summary: "Uploaded 4 of 5 files successfully. 1 failed." with details on failures
6. Resources list includes "Select Multiple" checkbox mode for bulk actions
7. Clicking "Select Multiple" enables checkboxes next to each file in list
8. Selecting multiple files enables "Delete Selected" button
9. "Delete Selected" shows confirmation: "Delete X selected files?" with count
10. Bulk delete processes all selected files with summary: "Deleted X files successfully" or "Failed to delete Y of X files"
11. "Select All" and "Deselect All" options available in checkbox mode
12. Exiting checkbox mode (clicking "Done" or "Cancel") deselects all files and hides checkboxes

### Story 5.7: File Type Icons and Visual Indicators

As a user,
I want clear visual indicators showing file types and status,
so that I can quickly identify document types without reading filenames.

**Acceptance Criteria:**

1. PDF files display red PDF icon or badge
2. PowerPoint files display orange/red PowerPoint icon or PPTX badge
3. Word documents display blue Word icon or DOCX badge
4. Icons positioned consistently (left of filename) in resources list
5. File size displayed in human-readable format: "1.2 MB", "345 KB"
6. Large files (>10 MB) have size displayed in bold or warning color to indicate potentially slow loading
7. Upload date formatted relative: "Today", "Yesterday", "3 days ago", or "Sep 29, 2025" for older files
8. Files currently being viewed have visual indicator (highlighted background or "Currently viewing" badge)
9. Failed uploads display error icon (red X or warning triangle) with error tooltip on hover
10. All icons and indicators are accessible with appropriate alt text or ARIA labels

---

## Epic 6: Search & Quick Access Features

**Epic Goal:** Implement comprehensive search functionality across lesson names, standards, and objectives with fast results (<1 second), plus streamlined "Add New Lesson" workflow with template pre-population. Deliver final user-facing features completing the planning workflow: finding lessons quickly via search when exact location is unknown, and adding new lessons efficiently to expand the repository. This epic delivers the last essential MVP features for full workflow coverage.

### Story 6.1: Global Search Implementation

As a user,
I want to search for lessons by name, standard, or objective from any page,
so that I can find specific content quickly without navigating through hierarchy.

**Acceptance Criteria:**

1. Global search bar added to navigation header, visible on all pages
2. Search bar displays placeholder text: "Search lessons, standards, objectives..."
3. Backend API endpoint implemented: GET /api/search?q=<query> searching across lesson names, standards, objectives, teaching approach fields
4. Search executes automatically after user stops typing for 300ms (debounced input)
5. Search is case-insensitive and supports partial matching (searching "force" finds "Forces and Motion")
6. Search results appear in dropdown below search bar showing top 10 matches
7. Each result displays: lesson name (bold), unit name, matching context snippet (text surrounding match)
8. Clicking search result navigates to lesson detail page for that lesson
9. Pressing Enter in search bar with results navigates to first result or dedicated search results page
10. Empty search query clears results dropdown
11. No results message displays: "No lessons found matching '<query>'" if search returns empty
12. Search completes and displays results within 1 second of query submission

### Story 6.2: Advanced Search Results Page

As a user,
I want to see comprehensive search results on a dedicated page with filtering,
so that I can explore all matches when many lessons contain my search term.

**Acceptance Criteria:**

1. Dedicated search results page created: /search?q=<query>
2. Pressing Enter in global search bar navigates to search results page with full results
3. Page displays search query prominently: "Search results for '<query>'" as heading
4. Results list shows all matching lessons (not limited to top 10 like dropdown)
5. Each result displays: lesson name (clickable link), unit name, discipline name, matching context (text snippet with search term highlighted)
6. Results grouped by discipline with collapsible sections
7. Results count displayed: "Found X lessons matching '<query>'"
8. Sidebar filter options: filter by Discipline (checkboxes), filter by Status (Draft, Complete, Needs Review)
9. Applying filters updates results list without page reload (client-side filtering acceptable for MVP)
10. "Clear Filters" button resets all filters to show all results
11. Empty results shows: "No lessons found. Try different search terms or remove filters."
12. Search results page loads within 2 seconds; filtering updates within 500ms

### Story 6.3: Search Highlighting and Context

As a user,
I want search terms highlighted in results and context,
so that I can see exactly where my search term appears in each lesson.

**Acceptance Criteria:**

1. Search term highlighted in yellow or bold within context snippets in search results
2. Context snippet shows 50 characters before and after match, with ellipsis (...) for truncation
3. Multiple matches in same lesson show all contexts or best match (most relevant section)
4. Lesson detail page accessed from search results shows search term highlighted on page (if feasible, or just scrolls to section)
5. Highlighting is case-insensitive (searching "Force" highlights "force", "Force", "FORCE")
6. Multi-word search terms highlight each word individually
7. Exact phrase search supported using quotes: searching "force and motion" highlights exact phrase
8. Highlighting remains visible for 3 seconds after page load, then fades out (subtle indication without permanent distraction)
9. Highlighting works correctly with special characters in search query (HTML escaping handled properly)
10. Highlighting accessible: highlighted text has sufficient contrast and is identified in screen reader context

### Story 6.4: Recent Searches and Search History

As a user,
I want to see my recent searches and quickly re-run them,
so that I can return to frequently accessed lessons without retyping search queries.

**Acceptance Criteria:**

1. Recent searches stored in browser localStorage (up to 10 most recent queries)
2. Clicking search bar (focus) displays recent searches dropdown if any exist
3. Recent searches list shows queries in reverse chronological order (most recent first)
4. Each recent search entry is clickable and re-executes that search immediately
5. Recent searches dropdown shows "Clear History" link at bottom
6. Clicking "Clear History" removes all recent searches from storage and hides dropdown
7. Recent searches persist across browser sessions (remain after closing/reopening browser)
8. Duplicate searches don't create duplicate history entries; duplicate moves query to top of list
9. Search history dropdown design matches global search results dropdown styling
10. Recent searches dropdown dismissed when clicking outside search area or pressing Escape key

### Story 6.5: Streamlined Add Lesson Workflow

As a user,
I want a faster way to add lessons with smart defaults,
so that I can quickly populate my repository without repetitive form-filling.

**Acceptance Criteria:**

1. "Add Lesson" button added to lesson list views (Library View, Calendar View) with prominent position
2. Clicking "Add Lesson" opens modal or side panel (not full page navigation) with Add Lesson form
3. Form includes: Discipline (dropdown), Unit (dropdown), Lesson Number (auto-suggested), Lesson Name (text input)
4. Lesson Number auto-suggested as next sequential number within selected unit (e.g., if unit has lessons 1-5, suggests 6)
5. User can override suggested lesson number if needed
6. If accessed from Library View with discipline/unit selected, those fields pre-populated in form
7. All other lesson fields (standards, objectives, etc.) left empty for later completion
8. "Create and Open" button creates lesson and immediately navigates to lesson detail page for editing
9. "Create and Add Another" button creates lesson, shows success message, clears form for another entry
10. "Cancel" button closes modal without creating lesson
11. Modal/panel is responsive on tablet viewports
12. Successful lesson creation shows confirmation: "Lesson created: <Lesson Name>" with link to view

### Story 6.6: Quick Add from Calendar View

As a user,
I want to add a lesson directly into a specific sequence position in Calendar View,
so that I can build my pacing guide in chronological order easily.

**Acceptance Criteria:**

1. Calendar View displays "Add Lesson" button or plus icon between existing lessons or at end of sequence
2. Clicking "Add Lesson" in Calendar View opens Add Lesson modal with sequenceNumber pre-filled
3. Sequence number matches position where button was clicked (e.g., clicking between Day 5 and Day 6 suggests Day 5.5 or prompts to insert at Day 6)
4. Creating lesson from Calendar View automatically assigns sequence number based on insertion point
5. New lesson appears immediately in Calendar View at correct position without page refresh
6. Existing lessons' sequence numbers adjust automatically if insertion creates numbering conflict (e.g., inserting at Day 6 shifts old Day 6 to Day 7)
7. Modal includes note: "This lesson will be added to your pacing guide at Day <X>"
8. After creation, user can edit lesson details immediately (link to lesson detail page)
9. Quick Add from Calendar maintains chronological context: returning to Calendar View after editing shows new lesson in correct position
10. Multiple quick adds in succession work correctly with sequence numbers incrementing logically

### Story 6.7: Lesson Duplication Feature

As a user,
I want to duplicate an existing lesson as a starting template,
so that I can create similar lessons quickly without re-entering common content.

**Acceptance Criteria:**

1. Lesson detail page includes "Duplicate Lesson" button or menu option
2. Clicking "Duplicate" opens modal confirming duplication: "Create a copy of '<Lesson Name>'?"
3. Modal allows editing: New Lesson Name, New Unit (dropdown), New Lesson Number
4. New lesson name defaults to "<Original Name> (Copy)"
5. "Create Duplicate" button creates new lesson copying all content fields: standards, objectives, goals, teaching approach
6. Duplicate lesson does NOT copy uploaded files (files are unique to original lesson)
7. Note in modal explains: "Files will not be duplicated. You can upload files separately to the new lesson."
8. Successful duplication navigates to new lesson's detail page for editing
9. Duplicate lesson has status set to "Draft" regardless of original lesson status
10. Duplicate lesson is not automatically added to pacing guide (sequenceNumber null) unless user specifies

### Story 6.8: Keyboard Shortcuts and Power User Features

As a user,
I want keyboard shortcuts for common actions,
so that I can navigate and manage lessons more efficiently.

**Acceptance Criteria:**

1. Global keyboard shortcut: "/" focuses search bar from any page
2. Search bar shortcuts: Escape clears search and closes results dropdown
3. Search results shortcuts: Arrow keys navigate through results, Enter opens selected result
4. Lesson detail page shortcuts: "e" enters edit mode for current focused section (when not already editing)
5. Lesson detail page shortcuts: Escape cancels edit mode without saving
6. Navigation shortcuts: "g l" goes to Library View, "g c" goes to Calendar View (Gmail-style shortcuts)
7. Lesson list shortcuts: "j" and "k" navigate down/up through lesson list, Enter opens selected lesson
8. Keyboard shortcuts documented in help modal or page accessible via "?" key
9. Help modal shows all available shortcuts grouped by context (Global, Search, Lesson Page, Navigation)
10. Shortcuts don't trigger when user is actively typing in text input or editing content
11. Visual indicators show when shortcuts are available (subtle "Press / to search" hint near search bar)

---

## Checklist Results Report

### Executive Summary

**Overall PRD Completeness:** 92%
**MVP Scope Assessment:** Just Right - Focused and achievable scope with clear deliverables
**Readiness for Architecture Phase:** Ready - Comprehensive technical foundation with clear constraints
**Critical Concerns:** Minor gaps in operational requirements and deployment specifics; no blockers identified

### Category Analysis

| Category                         | Status  | Critical Issues                                                       |
| -------------------------------- | ------- | --------------------------------------------------------------------- |
| 1. Problem Definition & Context  | PASS    | None - well-articulated with user research foundation                 |
| 2. MVP Scope Definition          | PASS    | None - clear boundaries with rationale documented                     |
| 3. User Experience Requirements  | PASS    | None - comprehensive UX vision with dual navigation                   |
| 4. Functional Requirements       | PASS    | None - 15 functional requirements with clear testability              |
| 5. Non-Functional Requirements   | PASS    | None - performance, reliability, and security covered                 |
| 6. Epic & Story Structure        | PASS    | None - sequential epics with complete acceptance criteria             |
| 7. Technical Guidance            | PARTIAL | Missing: specific technology stack recommendations pending user input |
| 8. Cross-Functional Requirements | PARTIAL | Incomplete: deployment automation details, monitoring specifics       |
| 9. Clarity & Communication       | PASS    | None - well-structured with consistent terminology                    |

**Overall Assessment:** 9/9 categories evaluated; 7 PASS, 2 PARTIAL, 0 FAIL

### Top Issues by Priority

**BLOCKERS:** None identified

**HIGH Priority:**

1. **Technology Stack Selection Required** - Frontend framework and backend language not yet determined; awaiting user's preferred UI stack example. This decision blocks detailed architecture design but doesn't prevent PRD approval.
   - _Action:_ User to provide UI stack reference; Architect to evaluate and recommend specific technologies
   - _Impact:_ Affects technical architecture document and implementation timeline estimates

**MEDIUM Priority:**

1. **Deployment Automation Details** - CI/CD pipeline described at high level; specific automation scripts and deployment procedures need documentation
   - _Action:_ Architect to define deployment workflow and create runbooks during architecture phase
   - _Impact:_ Affects DevOps story implementation in Epic 1

2. **Monitoring and Alerting Strategy** - Uptime requirements specified (99.9% during school hours) but monitoring approach not detailed
   - _Action:_ Architect to specify monitoring tools and alert thresholds as part of operational architecture
   - _Impact:_ Affects observability story in Epic 1

3. **Data Migration from Existing Materials** - Manual content entry planned for MVP; no bulk import workflow defined
   - _Action:_ Documented as post-MVP enhancement; acceptable for initial scope
   - _Impact:_ Increases initial setup time but doesn't affect technical feasibility

**LOW Priority:**

1. **Backup Recovery Testing** - Automated backups specified but recovery procedure testing not explicitly required in acceptance criteria
   - _Action:_ Add testing backup recovery to Epic 1 Story 1.7 or operational checklist
   - _Impact:_ Minor; doesn't affect MVP launch but important for production confidence

2. **Browser Compatibility Testing** - Modern browsers specified but no explicit cross-browser testing acceptance criteria
   - _Action:_ Add browser compatibility verification to story acceptance criteria where UI-heavy
   - _Impact:_ Minor; can be addressed during QA phase

### MVP Scope Assessment

**Features Appropriately Scoped for MVP:**

- Three-level content hierarchy (Discipline → Unit → Lesson) - core organizational structure
- Dual navigation (Library View and Calendar View) - addresses key user workflow need
- Lesson page template with consistent structure - foundation for predictable planning
- File upload and embedded viewers - eliminates external dependency on Google Drive
- Search functionality - completes quick access requirement
- Single-user authentication - sufficient for MVP validation

**No Features Recommended for Cutting:**
All included features directly address the core problem (information overload) and support the primary value proposition (instant findability). Each epic delivers independently deployable value.

**No Missing Essential Features Identified:**
MVP scope covers all critical user workflows identified in brainstorming session and project brief. Post-MVP enhancements (Google Drive import, collaboration) appropriately deferred.

**Complexity Concerns:**

1. **Dual Navigation Coordination** - Epic 4 requires careful state management to keep Library and Calendar views synchronized; complexity is manageable but needs attention during architecture
2. **File Storage Integration** - Epic 5 involves cloud storage configuration and embedded viewers; well-scoped but third-party dependencies require fallback planning
3. **Search Performance** - Epic 6 requires <1 second search response; acceptable with proper database indexing but needs verification with realistic data volume

**Timeline Realism:**
Estimated 6-8 weeks for 6 epics (approximately 1-1.5 weeks per epic for single developer) is realistic given:

- Clear acceptance criteria reducing ambiguity
- Sequential epic structure minimizing rework
- Manageable story sizes (mostly 2-4 hours of focused work each)
- MVP scope avoids complex features (no real-time collaboration, no advanced analytics)

### Technical Readiness

**Clarity of Technical Constraints:**

- ✅ **Well-Defined:** Repository structure (monorepo), service architecture (monolith), testing strategy (unit + integration, manual E2E)
- ✅ **Well-Defined:** Performance targets (page load <3s, search <1s, file upload <2s)
- ✅ **Well-Defined:** Hosting constraints (<$20/month budget, cloud hosting preferred)
- ⚠️ **Pending User Input:** Frontend framework, backend language, UI component library
- ⚠️ **Needs Architecture Detail:** Database choice (PostgreSQL vs SQLite), file storage service (S3 vs R2 vs alternatives)

**Identified Technical Risks:**

1. **File Upload Reliability** - Large file uploads (up to 50MB) may timeout on slow connections
   - _Mitigation:_ Implement resumable uploads or chunked upload strategy
2. **Embedded File Viewer Compatibility** - Third-party viewers (Office Online, Google Docs Viewer) may have reliability issues
   - _Mitigation:_ Provide fallback to direct download if viewer fails; consider self-hosted viewer library (PDF.js)
3. **Search Performance at Scale** - <1 second search requirement may be challenging with 100+ lessons and full-text search
   - _Mitigation:_ Database indexing on searchable fields; consider Elasticsearch or similar if performance issues arise

**Areas Needing Architect Investigation:**

1. **Frontend Technology Stack** - Evaluate user's preferred UI example and recommend specific framework (React, Vue, Svelte, etc.) with component library
2. **Database Design** - Choose between PostgreSQL (robust, relational) vs SQLite (simple, file-based) based on hosting environment and scalability needs
3. **File Storage Architecture** - Select cloud storage provider (AWS S3, Cloudflare R2, Backblaze B2) based on cost, performance, and CDN requirements
4. **Authentication Strategy** - Decide between JWT tokens (stateless) vs session-based auth (stateful) and implement secure password hashing (bcrypt, argon2)
5. **Deployment Automation** - Design CI/CD pipeline specifics: GitHub Actions vs GitLab CI, deployment triggers, environment management, rollback procedures

### Recommendations

**Immediate Actions for User:**

1. **Provide UI Stack Reference** - Share link or example of preferred design system/framework to guide technology selection
2. **Confirm OpenSciEd Materials Access** - Verify you have rights to store and organize OpenSciEd content in personal tool (copyright/licensing check)
3. **Review and Approve PRD** - Confirm all requirements accurately reflect your vision and workflow needs

**Next Steps for Architect:**

1. **Technology Stack Selection** - Evaluate user's UI preference, recommend frontend framework, backend language, database, and hosting platform with rationale
2. **Architecture Document Creation** - Design detailed technical architecture including data models, API specifications, deployment architecture, security approach
3. **Epic 1 Detailed Planning** - Break down infrastructure setup stories with specific technology choices and configuration steps
4. **Risk Mitigation Planning** - Address identified technical risks (file uploads, embedded viewers, search performance) with specific implementation strategies

**PRD Refinement Suggestions (Optional Enhancements):**

1. **Add Backup Recovery Testing** - Include explicit acceptance criteria for testing backup restoration in Epic 1
2. **Specify Error Monitoring** - Add story in Epic 1 for error tracking and monitoring setup (Sentry, LogRocket, or similar)
3. **Define Browser Compatibility Matrix** - Document specific browser versions to test in Technical Assumptions section
4. **Add Performance Monitoring** - Include acceptance criteria for implementing performance monitoring in Epic 1 or 6

**Quality Improvements:**

1. ✅ **Acceptance Criteria Quality** - Well-defined, testable criteria for all stories
2. ✅ **Story Sequencing** - Logical order with clear dependencies
3. ✅ **Epic Scope** - Each epic delivers cohesive, deployable functionality
4. ✅ **User Story Format** - Consistent "As a <user>, I want <action>, so that <benefit>" structure

### Final Decision

**✅ READY FOR ARCHITECT**

The PRD is comprehensive, well-structured, and provides sufficient clarity for architectural design to begin. The two PARTIAL categories (Technical Guidance and Cross-Functional Requirements) contain gaps that are appropriately addressed during architecture phase, not PRD phase. The pending technology stack selection is explicitly documented as awaiting user input and doesn't block architecture planning—the Architect can proceed with technology evaluation and recommendation as first architecture task.

**Confidence Level:** High - This PRD successfully translates brainstorming insights and project brief into detailed, actionable requirements with clear MVP scope, comprehensive user stories, and testable acceptance criteria. The development team can proceed with confidence.

---

## Next Steps

### UX Expert Prompt

**Context:** This PRD defines the Open Science Education Lesson Repository, a web-based lesson planning tool for organizing OpenSciEd science curriculum materials. The tool requires dual navigation modes (conceptual hierarchy and chronological sequence), consistent lesson page templates, and file management capabilities.

**Task:** Create a comprehensive UX/UI architecture document including:

1. **Wireframes and User Flows:** Design wireframes for all core screens identified in UI Design Goals section: Home/Dashboard, Library View, Calendar View, Lesson Detail Page, Add New Lesson modal, Search Results. Create user flow diagrams for primary workflows: browsing by discipline/unit, navigating chronologically, adding new lessons, uploading files, and searching.

2. **Information Architecture:** Define detailed site map, navigation patterns, and content hierarchy visualization showing relationships between Disciplines, Units, and Lessons in both navigation modes.

3. **Component Library Specification:** Recommend or design component library (if custom) including: navigation components, form inputs, file upload UI, search interface, lesson page sections, buttons, and modals. Ensure WCAG AA accessibility compliance.

4. **Visual Design Direction:** Establish color palette, typography scale, spacing system, and iconography aligned with professional educational context described in Branding section. Provide design tokens or style guide foundation.

5. **Responsive Design Strategy:** Specify breakpoints and layout adaptations for desktop (1920px), laptop (1366px), and tablet (768px) viewports. Document how key interfaces adapt at each breakpoint.

**Key Requirements from PRD:**

- Dual navigation modes must be visually distinct with clear mode indication
- Lesson page structure must be consistent across all lessons with predictable section ordering
- Inline editing should feel seamless without mode switching
- File upload and embedded viewers need intuitive, non-technical interfaces
- Search must be globally accessible and provide instant feedback

**Deliverable:** UX Architecture document ready for developer implementation with all wireframes, flows, and design specifications documented.

### Architect Prompt

**Context:** This PRD defines requirements for the Open Science Education Lesson Repository, a single-user web application for organizing OpenSciEd science curriculum. The system requires hierarchical content storage (Discipline → Unit → Lesson), file upload/hosting, dual navigation modes, and search capabilities.

**Task:** Create a comprehensive technical architecture document including:

1. **Technology Stack Recommendation:** Evaluate user's preferred UI stack reference (when provided) and recommend: frontend framework with rationale, backend language/framework, database system (PostgreSQL vs SQLite), cloud hosting platform, file storage service. Document trade-offs and justification for each choice.

2. **System Architecture Design:** Define overall system architecture with component diagrams showing: frontend application structure, backend API architecture, database schema, file storage integration, authentication flow, and deployment architecture.

3. **Database Schema:** Design complete relational schema for Disciplines, Units, Lessons, Files tables with foreign key relationships, indexes for search performance, and migration strategy. Include ER diagram.

4. **API Specification:** Document RESTful API endpoints for all functionality across 6 epics with request/response schemas, error handling patterns, and authentication requirements. Consider OpenAPI/Swagger specification.

5. **File Storage Architecture:** Design file upload workflow including client-to-cloud direct upload (presigned URLs), file metadata tracking, embedded viewer implementation strategy, and CDN considerations.

6. **Security Architecture:** Define authentication mechanism (JWT vs sessions), password hashing approach, HTTPS enforcement, API security (CORS, rate limiting), and secure credential management.

7. **Deployment and CI/CD:** Specify deployment pipeline, environment configuration strategy, database migration approach, backup procedures, and rollback plan.

8. **Performance Strategy:** Address search indexing for <1 second requirement, page load optimization for <3 second target, and file upload reliability for large files (50MB).

**Key Technical Constraints from PRD:**

- Monorepo structure with workspace separation
- Monolithic architecture with modular internal structure
- Unit + Integration testing (not full E2E automation for MVP)
- Hosting budget <$20/month for single-user deployment
- WCAG AA accessibility compliance
- Support for modern browsers (Chrome, Firefox, Safari, Edge) only

**Deliverable:** Technical Architecture document ready to guide Epic 1 implementation with all technology decisions documented and development setup instructions provided.
