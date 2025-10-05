# Technical Assumptions

## Repository Structure: Monorepo

The project will use a **monorepo structure** containing both frontend and backend code within a single repository. This decision supports:

- Simplified dependency management and version coordination between frontend/backend
- Easier code sharing for shared types, utilities, and validation logic
- Single CI/CD pipeline for entire application stack
- Better developer experience for single-developer project (no repository switching)
- Atomic commits that span frontend and backend changes

The monorepo will likely use workspaces (npm/yarn workspaces or similar) to separate frontend and backend packages while maintaining unified dependency management.

## Service Architecture

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

## Testing Requirements

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

## Additional Technical Assumptions and Requests

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
