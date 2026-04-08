COURSE_CRAFTER_WIREFRAMES_v1.0.md

Maturion Course Crafter – ASCII Wireframe Specification
Version 1.0

0. PURPOSE

This file defines the ASCII wireframes for the entire Course Crafter UI:

Root application layout

Engine selection & navigation

All 4 engine workspaces

Every wizard step for Engine 1 & 2 (v1)

Layouts for Engine 3 & 4

Shared screens (project selection, uploader, previewers, etc.)

Wireframes represent structure, not final visual design.

These diagrams form the binding UI structure for the Frontend Component Map.

1. ROOT APPLICATION LAYOUT
+--------------------------------------------------------------------------------------------------+
|  TOP BAR: Settings | Watchdog | QA | Foreman Chat | User                                           |
+--------------------------------------------------------------------------------------------------+
|  ENGINE TABS: [ Engine 1 ] [ Engine 2 ] [ Engine 3 ] [ Engine 4 ]                                 |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|  |---------------------- LEFT WIZARD PANEL --------------------|  |-----------------------------| |
|  | Step 1                                                    >|  |         WORKSPACE            | |
|  | Step 2                                                    >|  |   (Engine X dynamic area)    | |
|  | Step 3                                                    >|  |                               | |
|  | Step 4                                                    >|  |                               | |
|  | Step 5                                                    >|  |                               | |
|  |-------------------------------------------------------------|  |-------------------------------| |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+

2. GLOBAL PROJECT SELECTION
+--------------------------------------+
|   SELECT OR CREATE PROJECT           |
+--------------------------------------+
|  [ Existing Projects ▼ ]             |
|                                      |
|  Project Name: [_________________]   |
|  Code:         [___________]         |
|  Language:     [ en ▼ ]              |
|                                      |
|  ( Create Project )                  |
|--------------------------------------|
|  Course Hierarchy Tree               |
|  - Learning Unit 1                   |
|     - Module A                       |
|        - Lesson A1                   |
|        - Lesson A2                   |
|  - Learning Unit 2                   |
|     - Module B                       |
+--------------------------------------+

3. ENGINE 1 — VOICE-OVER STUDIO (v1)
ENGINE 1 — Workspace Layout
+--------------------------------------------------------------------------------------------------+
| ENGINE 1 – VOICE-OVER FACTORY                                                                    |
+--------------------------------------------------------------------------------------------------+
| |---------------- WIZARD ----------------|  |---------------------- WORKSPACE ------------------| |
| | 1. Setup Project/Lesson               >|  | (Dynamic content based on step)                   | |
| | 2. Contextualise                      >|  |                                                   | |
| | 3. Upload PPT/MP4                     >|  |                                                   | |
| | 4. Segment Planning                   >|  |                                                   | |
| | 5. Voice & Render                     >|  |                                                   | |
| |----------------------------------------|  |---------------------------------------------------| |
+--------------------------------------------------------------------------------------------------+

STEP 1 — Project Setup
+----------------------------- ENGINE 1 - STEP 1: SETUP -------------------------------+
| Project: [Select ▼] (or Create New)                                                  |
|                                                                                      |
| Course Hierarchy:                                                                    |
|   Learning Unit: [LU1 ▼]                                                             |
|   Module:       [Module A ▼]                                                         |
|   Lesson:       [Lesson 1 ▼]                                                         |
|                                                                                      |
| ( Create Lesson )                                                                    |
+--------------------------------------------------------------------------------------+

STEP 2 — Contextualisation
+----------------------------- ENGINE 1 - STEP 2: CONTEXTUALISATION -------------------+
| Context Free Text                                                                    |
| -----------------------------------------------------------------------------------  |
| |                                                                                  | |
| |  (Provide course background, target domain, purpose for voice-over)              | |
| |                                                                                  | |
| -----------------------------------------------------------------------------------  |
|                                                                                      |
| Upload Reference Documents: [ Upload PDF / DOCX ]                                    |
+--------------------------------------------------------------------------------------+

STEP 3 — Upload Sources
+----------------------------- ENGINE 1 - STEP 3: UPLOAD SOURCES ----------------------+
| Upload PPTX: [ Choose File ]                                                         |
| Upload MP4:  [ Choose File ]                                                         |
| Add YouTube Reference (Optional): [ https://... ]  ( Add )                           |
|                                                                                      |
| Uploaded Files:                                                                      |
|  - lesson1.pptx ✔                                                                    |
|  - lesson1.mp4 ✔                                                                     |
|  - yt_insert_1 ✔                                                                     |
+--------------------------------------------------------------------------------------+

STEP 4 — Segment Planning
+----------------------------- ENGINE 1 - STEP 4: SEGMENT PLANNING --------------------+
| Scenes & Segments Table                                                              |
| -----------------------------------------------------------------------------------  |
| Scene | Seg | Thumbnail | Script Text                     | Duration | Gap | Edit    |
|--------------------------------------------------------------------------------------|
|   1   | 1   | [img]     | "Human rights are..."           | 3.5 sec  | 0.5 |  ✎       |
|   1   | 2   | [img]     | "Historically derived from..."  | 4.0 sec  | 1.0 |  ✎       |
|   2   | 1   | [img]     | "See this YouTube reference"    | full vid | 2.0 |  ✎       |
|--------------------------------------------------------------------------------------|
| [ Reorder Segments ] [ Preview Segment ]                                              |
+--------------------------------------------------------------------------------------+


Segment edit modal:

+----------- EDIT SEGMENT ------------+
| Script Text: [....................] |
| Duration:   [ 3.5 ] sec            |
| Gap After:  [ 1.0 ] sec            |
|-------------------------------------|
| Thumbnail Preview                   |
+-------------------------------------+
|            ( Save ) ( Cancel )      |
+-------------------------------------+

STEP 5 — Voice & Render
+--------------------------- ENGINE 1 - STEP 5: VOICE & RENDER ------------------------+
| Voice Selection: [ en_male_neutral_1 ▼ ]                                             |
| Playback Test: ( ▶️ Play Sample )                                                    |
|                                                                                      |
| [ Generate Voice for All Segments ]                                                  |
|                                                                                      |
| Final Rendering:                                                                     |
|  ( Render Video )                                                                    |
|                                                                                      |
| Job Status: [••••••••••□□□□□□□□] 45%                                                 |
| Final Preview: ( ▶️ Play Video )                                                     |
+--------------------------------------------------------------------------------------+

4. ENGINE 2 — VIDEO FACTORY (v1)
ENGINE 2 — Workspace Layout
+--------------------------------------------------------------------------------------------------+
| ENGINE 2 – VIDEO FACTORY                                                                         |
+--------------------------------------------------------------------------------------------------+
| |---------------- WIZARD ----------------|  |----------------------- WORKSPACE ------------------||
| | 1. Setup Project/Lesson               >|  |                                                     | |
| | 2. Context + Target Audience          >|  |                                                     | |
| | 3. Script Outline                     >|  |                                                     | |
| | 4. Visual Plan (Prompts & Images)     >|  |                                                     | |
| | 5. Branding Template                  >|  |                                                     | |
| | 6. Effects & Settings                 >|  |                                                     | |
| | 7. Render                             >|  |                                                     | |
+--------------------------------------------------------------------------------------------------+

STEP 2 — Context + Target Population
+------------------------- ENGINE 2 - STEP 2: CONTEXT & TARGET ------------------------+
| Context Free Text:                                                                     |
| ------------------------------------------------------------------------------------   |
| | "This course teaches human rights awareness..."                                    | |
| ------------------------------------------------------------------------------------   |
|                                                                                       |
| Target Audience:                                                                      |
|   Industry:          [ Security ▼ ]                                                   |
|   Level:             [ Intro ▼ ]                                                      |
|   Region:            [ Africa ▼ ]                                                     |
|   Language:          [ English ▼ ]                                                    |
|                                                                                       |
| Upload Reference Docs: [ Upload ]                                                     |
+---------------------------------------------------------------------------------------+

STEP 3 — Script Outline
+----------------------------- ENGINE 2 - STEP 3: SCRIPT OUTLINE -----------------------+
| Scenes:                                                                               |
| ------------------------------------------------------------------------------------- |
| [1] Introduction                                                                      |
| [2] Origins of Rights                                                                 |
| [3] Case Study                                                                        |
| ------------------------------------------------------------------------------------- |
|                                                                                       |
| Script Editor for Selected Scene:                                                     |
| ------------------------------------------------------------------------------------- |
| |  [ AI Prompt Editor ]                                                             | |
| |  Generate | Summarise | Expand | Adjust Tone                                      | |
| ------------------------------------------------------------------------------------- |
|                                                                                       |
| Scene Text:                                                                           |
| ------------------------------------------------------------------------------------- |
| | "Human rights originated..."                                                      | |
| ------------------------------------------------------------------------------------- |
+---------------------------------------------------------------------------------------+

STEP 4 — Visual Plan
+----------------------- ENGINE 2 - STEP 4: VISUAL PLAN --------------------------------+
| Scene List (left)     | Prompt + Image Panel (right)                                   |
|------------------------|--------------------------------------------------------------|
| [1] Introduction       | Prompt: [ "Flat illustration of ..." ] [Generate Prompt]     |
| [2] Origins of Rights  |                                                              |
| [3] Case Study         | Generated Image Variants:                                    |
|                        |  +--------+   +--------+   +--------+                        |
|                        |  | img1   |   | img2   |   | img3   |                        |
|                        |  +--------+   +--------+   +--------+                        |
|                        |  ( Select Active Image )                                     |
+----------------------------------------------------------------------------------------+

STEP 5 — Branding Template
+----------------------- ENGINE 2 - STEP 5: BRANDING TEMPLATE --------------------------+
| Uploaded Logo: [logo.png]                                                             |
|                                                                                       |
| Primary Color:   [ #004A9F ]                                                          |
| Secondary Color: [ #E5F1FF ]                                                          |
|                                                                                       |
| Template Options:                                                                      |
|  +----------------------+   +----------------------+------+                           |
|  | Template A Preview  |   | Template B Preview  | Use |                           |
|  +----------------------+   +----------------------+-----+                           |
+----------------------------------------------------------------------------------------+

STEP 6 — Video Effects
+------------------------ ENGINE 2 - STEP 6: EFFECTS & SETTINGS -------------------------+
| Transitions: [ Fade ▼ ]                                                               |
| Scene Duration Rules: [ Auto ] [ Manual ]                                             |
| Highlight Words: ( X ) Off                                                            |
| Cinematic Mode: [Disabled in v1]                                                      |
|                                                                                       |
| Test Scene Preview: (▶️ Play)                                                         |
+----------------------------------------------------------------------------------------+

STEP 7 — Render
+---------------------------- ENGINE 2 - STEP 7: RENDER --------------------------------+
| Voice Profile: [ en_female_soft_1 ▼ ]                                                 |
| ( Generate Voice )                                                                    |
|                                                                                       |
| ( Render Final Video )                                                                |
| Job Status: [■■■■■■■■■■□□□□□□] 60%                                                    |
|                                                                                       |
| Final Video Preview: (▶️ Play)                                                        |
+----------------------------------------------------------------------------------------+

5. ENGINE 3 — BOOK FACTORY
+------------------------------------------------------------------------------------------------+
| ENGINE 3 – BOOK / MANUAL FACTORY                                                               |
+------------------------------------------------------------------------------------------------+
| Steps: [1. Outline] [2. Edit Sections] [3. Design] [4. Render]                                |
+------------------------------------------------------------------------------------------------+
| LEFT: Book Contents Tree         | RIGHT: Section Editor                                       |
|----------------------------------|--------------------------------------------------------------|
|  Book Title: Human Rights Guide  | [Markdown Editor]                                            |
|   Chapter 1                      | ------------------------------------------------------------ |
|     - Section 1.1                | | # Origins of Rights                                      | |
|     - Section 1.2                | | Human rights evolved from...                            | |
|   Chapter 2                      | ------------------------------------------------------------ |
|----------------------------------|--------------------------------------------------------------|
| [Add Section] [Delete] [Reorder] | ( AI Assist )  ( Insert Image ) ( Save )                    |
+------------------------------------------------------------------------------------------------+

6. ENGINE 4 — E-LEARNING FACTORY
+------------------------------------------------------------------------------------------------+
| ENGINE 4 – INTERACTIVE E-LEARNING FACTORY                                                      |
+------------------------------------------------------------------------------------------------+
| Steps: [1. Activity Plan] [2. Interaction Builder] [3. Quiz Builder] [4. SCORM Render]         |
+------------------------------------------------------------------------------------------------+
| LEFT: Outcome → Activity Map         | RIGHT: Interaction Builder                            |
|--------------------------------------|--------------------------------------------------------|
| Outcome 1:                           | Interaction Type: [ Hotspot ▼ ]                       |
|   - Hotspot Activity (Edit)          | ------------------------------------------------------ |
|   - Upload Task (Edit)               | | Hotspot Editor Canvas                             | |
| Outcome 2:                           | |  +-----+  +-----+  +-----+                         | |
|   - Timeline (Edit)                  | |  | #1  |  | #2  |  | #3  |                         | |
|--------------------------------------|--------------------------------------------------------|
| (Add Activity)                       | ( Save Interaction )                                   |
+------------------------------------------------------------------------------------------------+

7. GLOBAL COMPONENTS & MODALS
Asset Preview Modal
+-------------------------+
|  ASSET PREVIEW          |
+-------------------------+
| [ Image / Audio / Video ] 
|                         |
| ( Replace )  ( Delete ) |
+-------------------------+

Render Job Status Modal
+-------------------------------+
|   RENDER JOB STATUS           |
+-------------------------------+
| Job: #cc-job-2024-0102        |
| Engine: E2                    |
| State: In Progress            |
| Progress: [■■■■■■□□□□] 45%    |
| ETA: 2m 30s                   |
| Logs:                         |
|   - Downloading assets        |
|   - Generating transitions    |
|   - Encoding video            |
+-------------------------------+

8. MOBILE RESPONSIVE STRUCTURE

The following screens collapse into a single vertical wizard on mobile:

Left panel becomes a collapsible drawer

Workspace sits below the step selector

Tables convert to stacked cards

Media previews scale dynamically

9. UI RULES & RESTRICTIONS
9.1 No nested scrollbars

Panels scroll independently; avoid nesting.

9.2 Wizard steps are immutable

Order may not be altered without modifying this document.

9.3 All AI editors must support:

Inline rewrite

Regenerate

Adjust style

Add examples

Undo/redo

9.4 Every preview (audio, image, video) must support:

Replace

Delete

Versioning

Active selection

✔ END OF COURSE_CRAFTER_WIREFRAMES_v1.0.md