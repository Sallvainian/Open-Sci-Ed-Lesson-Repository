# Requirements

## Functional

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

## Non Functional

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
