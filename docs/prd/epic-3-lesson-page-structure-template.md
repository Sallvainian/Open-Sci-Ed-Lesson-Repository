# Epic 3: Lesson Page Structure & Template

**Epic Goal:** Build the complete lesson page template with all required sections in consistent, structured format. Deliver fully functional lesson detail pages displaying all content properly with inline editing capabilities and automatic save. This epic establishes the core user experience for viewing and editing lesson content, ensuring every lesson follows the same predictable structure.

## Story 3.1: Lesson Detail Page Template Layout

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

## Story 3.2: Inline Editing for Text Sections

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

## Story 3.3: Auto-Save Functionality

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

## Story 3.4: Standards Section with Multi-Item Support

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

## Story 3.5: Learning Objectives Section

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

## Story 3.6: Student-Friendly Goals Section

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

## Story 3.7: Teaching Approach Section with Rich Text

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

## Story 3.8: Lesson Status Management

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
