# Epic 4: Dual Navigation System

**Epic Goal:** Implement both conceptual navigation (Library View: hierarchical Discipline → Unit → Lesson browsing) and chronological navigation (Calendar View: pacing guide teaching sequence), with seamless mode switching. Deliver complete navigation experience allowing users to find lessons using either mental model, including breadcrumb trails, previous/next controls, related lesson links, and clear indication of current location. This epic fulfills the core requirement for dual navigation supporting different planning contexts.

## Story 4.1: Library View - Discipline and Unit Browser

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

## Story 4.2: Calendar View - Chronological Sequence

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

## Story 4.3: Pacing Guide Sequence Management

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

## Story 4.4: Navigation Mode Toggle

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

## Story 4.5: Lesson Detail Page Navigation Enhancements

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

## Story 4.6: Related Lessons Links

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

## Story 4.7: Quick Navigation Between Sequential Lessons

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
