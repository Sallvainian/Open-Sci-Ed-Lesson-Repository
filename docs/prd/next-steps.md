# Next Steps

## UX Expert Prompt

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

## Architect Prompt

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
