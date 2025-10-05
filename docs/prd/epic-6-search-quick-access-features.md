# Epic 6: Search & Quick Access Features

**Epic Goal:** Implement comprehensive search functionality across lesson names, standards, and objectives with fast results (<1 second), plus streamlined "Add New Lesson" workflow with template pre-population. Deliver final user-facing features completing the planning workflow: finding lessons quickly via search when exact location is unknown, and adding new lessons efficiently to expand the repository. This epic delivers the last essential MVP features for full workflow coverage.

## Story 6.1: Global Search Implementation

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

## Story 6.2: Advanced Search Results Page

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

## Story 6.3: Search Highlighting and Context

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

## Story 6.4: Recent Searches and Search History

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

## Story 6.5: Streamlined Add Lesson Workflow

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

## Story 6.6: Quick Add from Calendar View

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

## Story 6.7: Lesson Duplication Feature

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

## Story 6.8: Keyboard Shortcuts and Power User Features

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
