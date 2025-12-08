COURSE_CRAFTER_FRONTEND_COMPONENT_MAP_v1.0.md

Maturion Course Crafter – Frontend Component Architecture
Version 1.0

0. PURPOSE

This document defines the complete frontend component architecture for Course Crafter.

It ensures:

A one-time build

Predictable component hierarchy

Zero UI drift

Zero architectural ambiguity

Perfect separation of presentation vs. logic

Complete alignment with backend edge functions

Consistency across Engines 1–4

Foreman enforcement compliance

All components listed here are authoritative.
No additional components may be introduced without updating this document.

1. GLOBAL UI STRUCTURE
1.1 Root Layout
<AppRoot>
   <TopBar>  — settings, watchdog, QA, foreman chat
   <EngineTabs>  — E1, E2, E3, E4
   <EnginePage>  — selected engine workspace
</AppRoot>

1.2 Visual Theme — “Factory Metaphor”

Tabs styled as “factory machine modules”

Left-side wizard panel = conveyor belt

Right-side content panel = production bay

Consistent iconography

Light/dark mode support

All branding adjustable per project

2. TOP-LEVEL COMPONENTS
2.1 <AppRoot>

Purpose:

Loads user/org context

Loads current project state

Routes to engines

Dependencies:

/cc/projects/list

/cc/watchdog/status

2.2 <TopBar>

Contains:

Settings menu

AI model selector (future)

Watchdog indicator

QA indicator

Foreman Chat button

Subcomponents:

<TopBarSettingsMenu>

<WatchdogIndicator>

<QAStatusIndicator>

<ForemanChatLauncher>

2.3 <EngineTabs>

Tabs:

Engine 1 – Voice-Over

Engine 2 – Video Factory

Engine 3 – Book Factory

Engine 4 – E-Learning Factory

Each tab routes to <EngineXWorkspace>.

3. SHARED SYSTEM COMPONENTS

These components are used across all engines.

3.1 <ProjectSelector>

Used to select or create a Project.

APIs:

/cc/projects/list

/cc/projects/create

3.2 <CourseHierarchyTree>

Displays LU → Module → Lesson tree.

APIs:

/cc/hierarchy/:project_id/full-tree

3.3 <ContentWizardPanel>

Left-side wizard navigation (step list).

Props:

steps: [
 {id, title, completed, current},
 ... 
]
onStepSelect(stepId)

3.4 <ContentWorkspace>

Right-side panel which loads the active step.

3.5 <FileUploadManager>

Generic upload component.

APIs:

/cc/uploads/:lesson_id/source

Supports:

PPTX

MP4

DOCX

PDF

Images

YouTube links (uses modal)

3.6 <SceneSegmentTable>

Displays scenes and segments in grid view.

Columns:

Scene

Segment

Script Text

Thumbnail

Duration

Gap

Controls (edit, reorder)

APIs:

/cc/engine1/:lesson_id/plan

/cc/engine1/:lesson_id/update-plan

/cc/engine2/:lesson_id/update-script

3.7 <AudioPreviewPlayer>

Lightweight player for voice segments.

3.8 <VideoPreviewPlayer>

Preview of rendered video.

Input:

asset file path from backend

3.9 <AIPromptEditor>

Used in script, prompt, and content creation.

Inputs:

Text input

Inline chat-like assistance

Provides:

Rewrite

Summarise

Extend

Simplify

Adjust style

Insert example

APIs:

/cc/ai/llm

3.10 <BrandTemplatePreview>

Renders brand template options for selection.

APIs:

/cc/templates/:project_id/list

3.11 <RenderJobStatus>

Polls render jobs.

APIs:

/cc/render/job/:job_id

3.12 <InteractionBuilder>

Flexible editor for Engine 4 interactions.

Supports:

Timeline editor

Hotspot editor

Accordion editor

Quiz builder

APIs:

/cc/interactions/...

4. ENGINE 1 — VOICE-OVER WORKSPACE
4.0 <Engine1Workspace>

Loads engine-specific wizard steps and content.

Steps:

Project & Lesson Setup

Contextualise

Feed the Beast (Uploads)

Plan Segments

Voice & Render

STEP 1 COMPONENTS
4.1 <E1ProjectSetupPanel>

Project selector

Lesson selection

Structure creation forms

APIs:

/cc/projects/create

/cc/hierarchy/...

STEP 2 COMPONENTS
4.2 <E1ContextualisationPanel>

Free text context input

File uploads for context

APIs:

/cc/context/:project_id/update

/cc/context/:project_id/upload-doc

STEP 3 COMPONENTS
4.3 <E1SourceUploadPanel>

File fields:

PPTX

MP4

YouTube links

Uses <FileUploadManager>.

STEP 4 COMPONENTS
4.4 <E1SegmentPlanningPanel>

Contains:

<SceneSegmentTable>

<ThumbnailViewer>

<SegmentTimingEditor>

<SegmentReorderControls> (drag & drop)

APIs:

/cc/engine1/:lesson_id/parse-ppt

/cc/engine1/:lesson_id/plan

/cc/engine1/:lesson_id/update-plan

STEP 5 COMPONENTS
4.5 <E1VoiceSelectionPanel>

Voice dropdown (gender, accent)

Sample play

Segment-level TTS preview

4.6 <E1RenderPanel>

Render button

<RenderJobStatus>

<VideoPreviewPlayer>

APIs:

/cc/engine1/:lesson_id/generate-voice

/cc/engine1/:lesson_id/render-video

5. ENGINE 2 — VIDEO FACTORY WORKSPACE (v1)
5.0 <Engine2Workspace>

Steps:

Setup

Context + Target Population

Script Outline

Visual Plan (Prompts + Images)

Branding Template

Video Effects & Settings

Render Preview & Publish

STEP 1
5.1 <E2ProjectSetupPanel>

Same as E1 but engine-specific metadata included.

STEP 2
5.2 <E2ContextTargetPanel>

Fields:

Domain

Level

Audience

Region

Language

Plus <FileUploadManager> for reference docs.

APIs:

/cc/context/:project_id/update

/cc/uploads/:lesson_id/source

STEP 3
5.3 <E2ScriptOutlinePanel>

Contains:

<AIPromptEditor>

<SceneList>

<SceneEditor>

APIs:

/cc/engine2/:lesson_id/generate-outline

/cc/engine2/:lesson_id/update-script

STEP 4
5.4 <E2VisualPlanPanel>

Contains:

<PromptEditor>

<PromptListViewer>

<ImageGenerationPanel>

<ImageVariantCarousel>

<ImageSelectionGrid>

APIs:

/cc/engine2/:lesson_id/generate-prompts

/cc/engine2/:lesson_id/generate-images

STEP 5
5.5 <E2BrandingPanel>

Components:

<BrandColorPicker>

<LogoUploader>

<BrandTemplatePreview>

APIs:

/cc/templates/create

/cc/templates/update

STEP 6
5.6 <E2VideoSettingsPanel>

Contains:

Transition selectors

Cinematic toggle (disabled in v1)

Word-highlighting toggle

Timing controls

STEP 7
5.7 <E2RenderPanel>

Contains:

Voice selection dropdown

Render button

<RenderJobStatus>

<VideoPreviewPlayer>

APIs:

/cc/engine2/:lesson_id/render-video

6. ENGINE 3 — BOOK FACTORY WORKSPACE
6.0 <Engine3Workspace>

Steps:

Book Outline

Edit Sections

Design & Assets

Render

6.1 <E3OutlinePanel>

Creates initial book structure.

APIs:

/cc/engine3/:project_id/outline

6.2 <E3SectionEditorPanel>

Markdown editor

Inline AI assistance

Image placement view

Mapping to LU/module/lesson

APIs:

/cc/engine3/:project_id/update-section

6.3 <E3DesignPanel>

Book template selection

Layout preview

6.4 <E3RenderPanel>

Uses:

<RenderJobStatus>

<DocumentPreviewViewer>

APIs:

/cc/engine3/:project_id/render-book

7. ENGINE 4 — E-LEARNING FACTORY WORKSPACE
7.0 <Engine4Workspace>

Steps:

Activity Plan

Interaction Builder

Quiz Builder

SCORM Render

STEP 1
7.1 <E4ActivityPlanPanel>

Lists outcomes & assigned activities

Maps from Engine 3 book sections

STEP 2
7.2 <E4InteractionBuilderPanel>

Contains <InteractionBuilder>:

Hotspots

Timelines

Accordions

Slides

Media

APIs:

/cc/interactions/create

/cc/interactions/update

STEP 3
7.3 <E4QuizBuilderPanel>

Contains:

<QuestionList>

<QuestionEditor>

<OptionEditor>

APIs:

/cc/interactions/...

/cc/quizzes/...

STEP 4
7.4 <E4ScormRenderPanel>

SCORM version selector

Render button

<RenderJobStatus>

SCORM download link

APIs:

/cc/engine4/:lesson_id/render-scorm

8. SHARED UI UTILITIES
8.1 <NotificationToast>

System-wide notifications.

8.2 <Breadcrumbs>

Optional.

8.3 <LoadingSpinner>

Used in all async panels.

8.4 <ConfirmationModal>

Used for destructive actions.

8.5 <AIDiagnosticsPanel>

Shows token counts, cost, latency (optional dev mode).

9. COMPONENT-TO-API MAPPING TABLE (Quick Reference)
Component	API	Purpose
E1ProjectSetupPanel	/cc/projects/*	Create/select project
E1ContextualisationPanel	/cc/context/*	Save context
E1SourceUploadPanel	/cc/uploads/*	Upload PPT/MP4
E1SegmentPlanningPanel	/cc/engine1/*	Create + edit segments
E1RenderPanel	/cc/engine1/render-video	Final E1 output
E2ScriptOutlinePanel	/cc/engine2/generate-outline	Scene structure
E2VisualPlanPanel	/cc/engine2/generate-images	Images
E2BrandingPanel	/cc/templates/*	Branding
E2RenderPanel	/cc/engine2/render-video	Final E2 output
E3SectionEditorPanel	/cc/engine3/update-section	Book editing
E3RenderPanel	/cc/engine3/render-book	PDF/eBook
E4InteractionBuilderPanel	/cc/interactions/*	Interactive elements
E4ScormRenderPanel	/cc/engine4/render-scorm	SCORM output
10. ARCHITECTURAL RULES
10.1 No Business Logic in Components

All logic resides in Edge Functions.

10.2 No external API calls in components

Everything goes via internal API client layer.

10.3 No hidden state

All state handled via React Query or explicit component state.

10.4 No UI drift

All UI must match upcoming wireframes exactly.

✔ END OF COURSE_CRAFTER_FRONTEND_COMPONENT_MAP_v1.0.md