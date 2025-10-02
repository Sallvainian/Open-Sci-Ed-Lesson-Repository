# Epic List

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
