COURSE CRAFTER MODULE ARCHITECTURE — Version 0.1
For Engines 1 & 2 (with scaffolding for Engines 3 & 4)
Aligned with Maturion True North v1.1
0. Purpose

The Course Crafter module enables users to design professional training content at scale.
It covers two immediate engines:

Engine 1 — Add voice-over to existing MP4 videos

Engine 2 — Create new branded explainer videos from PPT/PDF/Docs

Future engines will include:

Engine 3 — Book/Manual creation from course content

Engine 4 — E-learning/SCORM interactive course creation

This document defines the module architecture, UX flow, data model, AI model routing, render pipelines, UI components, wiring, QA rules, and Watchdog requirements.

This is the authoritative architecture Foreman enforces.

1. Module Overview

Course Crafter is a subsystem inside Maturion, using:

React + Tailwind + shadcn (shared UI)

Supabase (Auth, Storage, Postgres, Edge Functions)

Central AI Gateway (maturion-ai)

Additional media-processing tools

It uses project → unit → module → lesson hierarchy where each lesson corresponds to a video (Engine 1 or Engine 2).

2. High-Level User Goals

Course Crafter must allow a user to:

✔ Engine 1

Transform any existing MP4 (converted from PPT) into a professionally narrated training video with AI voice-over and perfect timing sync.

✔ Engine 2

Create brand-new explainer videos from PPT/PDF/Word/text, using:

AI-generated scripts

AI-generated images

Branded visual templates

Still-image transitions (for v1)

AI-synthesized voiceover (TTS)

Smooth transitions/overlays

Export to MP4 for Thinkific or SCORM

✔ Engine 3 (future — prepare foundation)

Generate course manuals/books based on content and research.

✔ Engine 4 (future — prepare foundation)

Convert course content into interactive e-learning activities (timelines, cycles, hotspots, quizzes, etc.).

3. Module Structure & Navigation
3.1 Top Navigation Bar

Course Crafter logo

Settings (AI models, default voices, templates)

QA

Watchdog

Health Check

Foreman Chat (developer backoffice)

3.2 Engine Tabs

Factory-styled tabs (horizontal):

Engine 1 – Voice-Over Factory

Engine 2 – Video Factory

Engine 3 (greyed)

Engine 4 (greyed)

3.3 Left-Side Wizard Navigation (per Engine)

Each engine has a multi-step wizard:

Step 1 – Project Setup

Step 2 – Context

Step 3 – Upload Materials

Step 4 – Plan

Step 5 – Voice/Brand

Step 6 – Effects

Step 7 – Render

4. Data Model
4.1 Tables
course_projects
Field	Type	Notes
id	uuid	PK
owner_id	uuid	Supabase auth user
name	text	Course name
description	text	Optional
created_at	timestamp	
learning_units

| Field | Type | Notes |
| id | uuid | PK |
| project_id | uuid | FK |
| name | text | Unit name |
| order_index | int | Sort order |

modules

| Field | Type | Notes |
| id | uuid | PK |
| learning_unit_id | uuid | FK |
| name | text | Module name |
| order_index | int | |

lessons

| Field | Type | Notes |
| id | uuid | PK |
| module_id | uuid | FK |
| name | text | Name of the lesson |
| engine_type | int | 1 or 2 |
| status | text | draft/planned/rendered |
| final_video_asset_id | uuid | FK to assets |

assets

| Field | Type | Notes |
| id | uuid | PK |
| lesson_id | uuid | FK |
| type | text | ppt/pdf/mp4/image/audio/etc |
| url | text | Storage URL |
| metadata | jsonb | timings, thumbnails |

segments

| Field | Type | Notes |
| id | uuid | PK |
| lesson_id | uuid | FK |
| number | int | segment index |
| start_time | float | sec |
| end_time | float | sec |
| display_duration | float | |
| gap_after | float | |
| script_text | text | extracted or generated |
| thumbnail_asset_id | uuid | FK |
| voice_asset_id | uuid | audio |
| is_youtube | boolean | default false |

course_templates

| Field | Type |
| name | text |
| colors | json |
| logo_asset_id | uuid |
| layout | json |
| allowed_transitions | text[] |

video_jobs

| id | uuid |
| lesson_id | uuid |
| engine | int |
| status | text |
| logs | text |
| created_at | timestamp | |

5. AI Routing (Section 17 Integration)
Engine 1 Routing
Task	Model
PPT/MP4 parsing	GPT-4o
Script extraction	GPT-4o
Non-creative rewriting	GPT-4o
Segment planning	GPT-4o
Voice generation	TTS engine (OpenAI TTS preferred)
Timing adjustment logic	GPT-4o
Engine 2 Routing
Task	Model
Content analysis	GPT-5
Script writing	GPT-5
Image prompt creation	GPT-5
Draft image generation	Free model (Stable Diffusion)
Final image generation	DALL·E / OpenAI
Audience tailoring	GPT-5
Transition selection	GPT-4o
Voice generation	TTS engine
Rendering Routing

Hybrid (Option C):

Client-side:

Engine 1 audio-over-write

Server-side:

Engine 2 video compositing

6. Engine 1 Workflow — Deep Specification
Step 1 – Create Project

UI: form to add course, units, modules, lessons

Backend: insert rows

Foreman QA: enforce naming rules (no duplicates, clear structure)

Step 2 – Contextualise

Text field + file upload

Saved as project context

AI uses context for tone, pacing, emphasis

QA: context must exist before Step 4 unlocks

Step 3 – Upload Materials

Upload MP4 + PPT

Optional other documents

Backend extracts thumbnails

QA: must have MP4 + PPT or reject

Step 4 – Plan Segments

AI generates:

segments

script per segment (from PPT or OCR)

thumbnail

durations

UI actions:

reorder segments

edit text (warning if diverging too far)

preview voice

adjust timings

lock YouTube segments

QA checks:

No empty script

No missing thumbnails

Segments cover entire video duration

Step 5 – Voice selection & timing

Choose global voice

Optional segment override

TTS preview

QA: voice assigned to all segments

Step 6 – Render (client-side)

FFmpeg.wasm merges:

original video visuals

new audio track

Preview created

Step 7 – Save video

Upload final MP4

Update lesson → status: rendered

7. Engine 2 Workflow — Deep Specification
Step 1 – Create Project

Identical to Engine 1.

Step 2 – Contextualise + Audience Profile

New selectors:

industry

region

job level

cultural tone

Stored in project_audience_profile.

QA ensures these fields exist.

Step 3 – Upload content

User uploads:

PPT

PDF

DOCX

MP4

free text instructions

AI parses content → extracts structure.

QA:

at least one content source must be uploaded

Step 4 – Create Plan

AI produces:

Segment list

Proposed scripts

Image prompts

User can:

edit scripts

regenerate prompts

generate images

reorder segments

preview transitions

QA checks:

Each segment must have:

script

image (or prompt)

duration

No empty segments

Step 5 – Branding

User uploads:

logo

primary/secondary colours

AI generates 3 templates.

User selects 1–3 templates as “course templates.”

QA:

template must be selected

transitions must match allowed transitions list

Step 6 – Effects Refinement

User chooses:

transitions

text overlay positions

global intro/outro

permitted effect set (Option C – template-based)

QA:

transitions must be from template library only

no overlapping text zones

Step 7 – Render (server-side)

Video compositing pipeline:

Generate TTS per segment

Assemble scenes:

template background

segment images

overlay text

Apply transitions

Export MP4

Store result in assets

Update lesson status

8. UI Layout Specification
Top Bar

Module name

Settings

QA

Watchdog

Help (chat with Foreman)

Engine Tabs (factory style)

Engine tabs styled like industrial selectors

Visual identity: metallic, grid-style, functional, “factory workflow” aesthetic

Left Sidebar Wizard

Step numbers, nested steps (1.1, 1.2)

Steps can be revisited at any time

Green checkmark when completed

Grey for incomplete

Main Content Area

Changes per step:

File upload components

Timeline view

Segment editor

Image preview grid

Branding editor

Video preview player

9. Integration Points With Future Engines
9.1 Engine 3 (Book Engine)

Reuses:

Scripts from Engine 2

Images generated from Engine 2

Adds:

AI book/manual generator

Editable pages with embedded AI

Book asset final output

9.2 Engine 4 (Interactive Course Engine)

Reuses:

Engine 3 structured content

All images

All scripts

Adds:

Interactive elements (timelines, hotspots, quizzes)

SCORM export

Thinkific-native course export

10. QA Requirements (Foreman-Controlled)
Engine 1 QA

MP4 + PPT required

Segment plan covers 100% of video duration

No missing scripts

TTS preview works

All segments have timing

Audio/video sync tolerance < 0.2s

Final MP4 exists and is playable

Engine 2 QA

Audience profile complete

Content uploaded

Each segment has script + image + duration

Templates selected

Assets linked correctly

Only template-based transitions used

Render completes successfully

Final MP4 exists and is playable

Model Routing QA

Simple questions → GPT-4.1-mini

Content analysis → GPT-5

Image prompts → GPT-5

Draft images → Free model

Final images → DALL·E

Video effects → template-based routing

Security QA

No unscanned file types

PDFs/docx sanitized

No executable uploads

No prompt injection via scripts

Watchdog Alerts

Render failures

Missing assets

Model misrouting

Long API response times

11. Foreman Responsibilities

Validate all architecture before build

Maintain model routing (Section 17)

Maintain template library

Manage QA evolution

Approve upgrades from still-image videos → cinematic videos (future)

12. Versioning

This document is Course Crafter Architecture v0.1.

Changes require:

Foreman proposal

Johan approval

QA updates

Version increment (0.2, 0.3, 1.0)

✔ END OF COURSE_CRAFTER_ARCHITECTURE_v0.1.md