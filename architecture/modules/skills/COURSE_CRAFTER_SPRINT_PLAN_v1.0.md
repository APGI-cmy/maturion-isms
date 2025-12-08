Below is the full COURSE_CRAFTER_SPRINT_PLAN_v1.0.md, written in the same format and depth as the Risk Assessment and WRAC sprint plans.
It is structured for direct handover to the Foreman and Co-Pilot Builder teams and is aligned to:

True North

DB Schema

Edge Functions

Frontend Component Map

Wireframes

QA Plan

Export Spec

This is a complete, multi-sprint delivery plan for Engines 1–4, full backend, full frontend, AI integration, worker pipelines, SCORM, book generator, and export subsystems.

COURSE_CRAFTER_SPRINT_PLAN_v1.0.md

Multi-Sprint Delivery Blueprint — Course Crafter Module
Version 1.0
Aligned with All Course Crafter v1.0 Standards

0. PURPOSE

This sprint plan defines:

The complete development roadmap

Sprint structure and timelines

Dependencies between engines

Backend, frontend, AI, and worker tasks

QA gates for each sprint

Delivery criteria

Cross-team integration requirements

Foreman oversight rules

This plan ensures:

Zero architectural drift

Predictable delivery

Strict True North adherence

Incremental, testable build steps

Full system coherence across Engines 1–4

1. SPRINT STRUCTURE OVERVIEW

Course Crafter is delivered in 10 sprints, each 2 weeks long.

Sprint 1: Foundations & Infrastructure
Sprint 2: Project + Hierarchy Engine
Sprint 3: Upload & Parsing System
Sprint 4: Engine 1 (Voice-Over) Core
Sprint 5: Engine 1 Completion
Sprint 6: Engine 2 (Video Factory) Core
Sprint 7: Engine 2 Completion
Sprint 8: Engine 3 (Book Factory)
Sprint 9: Engine 4 (SCORM Builder)
Sprint 10: Full Export System, QA, and UAT


Each sprint has:

Objectives

Deliverables

Backend tasks

Frontend tasks

Worker/AI tasks

Data layer tasks

QA requirements

Acceptance criteria

2. SPRINT 1 – FOUNDATIONS & INFRASTRUCTURE
Objectives

Establish the platform foundation required to support all engines.

Deliverables

Base DB schema (empty framework)

Auth integration

RLS foundation

File storage system

Worker queue setup

AI Gateway basic functioning

Base project structure in frontend

Backend Tasks

Create empty schema namespaces

Implement global RLS (org_id-based)

Implement /cc/ai/llm, /cc/ai/tts, /cc/ai/image scaffolds

Worker queue skeleton

Logging infrastructure (cc_ai_calls, cc_activity_log)

Frontend Tasks

<AppRoot>

<TopBar> + watchdog + QA indicators

<EngineTabs>

Project switcher

AI/Worker Tasks

Provision TTS baseline model

Provision image model (free-tier)

Setup simulation for video render worker

QA Requirements

DB migrations test

RLS smoke tests

Worker queue health

Acceptance Criteria

Core system boots

RLS protects all CC tables

AI gateway responds successfully

UI loads and shows empty welcome state

3. SPRINT 2 – PROJECT & HIERARCHY MODULE
Objectives

Implement creation and navigation of project/course hierarchy.

Deliverables

Full CRUD for:

Projects

Learning Units

Modules

Lessons

Hierarchy viewer tree

Project metadata editor

Backend Tasks

/cc/projects/*

/cc/hierarchy/*

Context storage table (cc_project_context)

Frontend Tasks

<ProjectSelector>

<CourseHierarchyTree>

Setup wizard scaffolding

QA Requirements

CRUD regression API tests

Hierarchy RLS enforcement

Context saving tests

Acceptance Criteria

Projects and lessons can be created, edited, stored

UI tree reflects actual DB structure

4. SPRINT 3 – SOURCE UPLOAD & PARSING
Objectives

Create the file ingestion pipeline for all engines.

Deliverables

File upload engine

PPTX parser

MP4 parser stub

YouTube ingestion

Document parsing (context)

Backend Tasks

/cc/uploads/:lesson_id/source

Parse jobs

Save files to storage + DB

Extract PPTX text + slides

Extract MP4 timestamps

Frontend Tasks

<FileUploadManager>

Source management screen

QA Requirements

File type validation

MIME detection

Max upload size tests

Acceptance Criteria

User can upload PPTX/MP4/PDF/DOCX

System parses PPTX into scenes/segments

5. SPRINT 4 – ENGINE 1 (CORE) – VOICE-OVER FACTORY
Objectives

Build the core of Engine 1.

Deliverables

Scene + Segment storage

Segment editing

Voice generation

Partial render pipeline

Backend Tasks

/cc/engine1/parse-ppt

/cc/engine1/plan

/cc/engine1/update-plan

/cc/engine1/generate-voice

Frontend Tasks

<E1SegmentPlanningPanel>

<SceneSegmentTable>

<AudioPreviewPlayer>

Worker Tasks

Segment-level TTS worker

Partial MP4 assembly

QA Requirements

Segment extraction accuracy

TTS consistency tests

Script vs. duration alignment

Acceptance Criteria

Engine 1 can produce voice-only prototype video

6. SPRINT 5 – ENGINE 1 COMPLETION
Objectives

Finish Engine 1 to production readiness.

Deliverables

Final render pipeline

End-of-lesson slide insertion

Voice normalization

All Engine 1 QA tests

Backend Tasks

/cc/engine1/render-video

Frontend Tasks

<E1VoiceSelectionPanel>

<E1RenderPanel> + job tracker

Worker Tasks

Full MP4 assembly

FFMPEG pipeline

QA Requirements

MP4 playback test

Duration correctness

Audio normalization

Acceptance Criteria

Final Engine 1 videos ready for LMS upload

7. SPRINT 6 – ENGINE 2 (CORE) – VIDEO FACTORY
Objectives

Implement Engine 2’s structural pipeline.

Deliverables

Script outline generator

Prompt generator

Image generator integration

Brand profile system

Backend Tasks

/cc/engine2/generate-outline

/cc/engine2/update-script

/cc/engine2/generate-prompts

Brand profile CRUD

Frontend Tasks

<E2ScriptOutlinePanel>

<E2VisualPlanPanel>

<BrandTemplatePreview>

Worker Tasks

Image generation worker

Asset pipeline

QA Requirements

Scene-outline accuracy

Prompt quality tests

Brand profile validation

Acceptance Criteria

Engine 2 can plan scenes + generate images

8. SPRINT 7 – ENGINE 2 COMPLETION
Objectives

Finish Engine 2’s video generation pipeline.

Deliverables

Full branded video rendering (v1)

Transitions

TTS + audio sync

Final MP4 export

Backend Tasks

/cc/engine2/render-video

Frontend Tasks

<E2EffectsPanel>

<E2RenderPanel>

Worker Tasks

Full timeline synthesis

Image sequencing

Transitions + brand overlay

QA Requirements

Timing correctness

Brand compliance

Audio synchronization tests

Acceptance Criteria

Engine 2 videos ready for LMS upload

9. SPRINT 8 – ENGINE 3 (BOOK FACTORY)
Objectives

Generate professional course books.

Deliverables

Outline generation

Markdown editor

PDF/ePub render pipeline

Asset embedding

Backend Tasks

/cc/engine3/outline

/cc/engine3/update-section

/cc/engine3/render-book

Frontend Tasks

<E3SectionEditorPanel>

<E3DesignPanel>

Worker Tasks

PDF generator

Image embedding

QA Requirements

Pagination

Markdown validity

No missing images

Acceptance Criteria

Books export successfully in PDF

10. SPRINT 9 – ENGINE 4 (SCORM BUILDER)
Objectives

Create interactive e-learning modules.

Deliverables

Interaction editor

Quiz builder

SCORM render pipeline

Assets bundling

Backend Tasks

/cc/interactions/*

/cc/engine4/*

Frontend Tasks

<E4InteractionBuilderPanel>

<E4QuizBuilderPanel>

Worker Tasks

SCORM manifest builder

Slide HTML generator

QA Requirements

SCORM 1.2 validation

Interaction fidelity

Asset loading tests

Acceptance Criteria

SCORM packages load in standard LMS (Moodle/Thinkific/etc.)

11. SPRINT 10 – EXPORTS, QA, FINAL POLISH
Objectives

Complete overall system and integrations.

Deliverables

Full export system

Metadata builders

Global export ZIP packages

Thinkific/LMS metadata export

Final QA battery

Watchdog alerts

Changelog and documentation freeze

Backend Tasks

/cc/export/*

Frontend Tasks

Export panels

Download UIs

Worker Tasks

Integrity hash generator

ZIP packaging

QA Requirements

Full regression suite

Performance tests

Load tests

End-to-end scenario validation

Acceptance Criteria

Course Crafter v1.0 fully deployable

All Engines functional

All exports validated

All QA tests passed

Foreman sign-off

12. FOREMAN REVIEW POINTS

Foreman must review and approve at the end of:

Sprint 1 (Foundations)

Sprint 3 (Uploads & Parsing)

Sprint 5 (Engine 1 Complete)

Sprint 7 (Engine 2 Complete)

Sprint 8 (Book Factory Complete)

Sprint 9 (SCORM Complete)

Sprint 10 Final Integration

No sprint may close without Foreman sign-off.

13. RISKS & MITIGATION
13.1 AI Model Drift

Mitigation:

Snapshot prompts

QA baseline comparisons

13.2 Worker Queue Overload

Mitigation:

Render throttling

Parallelism control

13.3 Asset Explosion (storage)

Mitigation:

Prune old versions

Compress assets

13.4 SCORM LMS incompatibility

Mitigation:

Test in Moodle, SCORM Cloud, Thinkific

✔ END OF COURSE_CRAFTER_SPRINT_PLAN_v1.0.md