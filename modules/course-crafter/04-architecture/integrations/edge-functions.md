COURSE_CRAFTER_EDGE_FUNCTIONS_v1.0.md

Maturion Course Crafter – Edge Functions & API Specification
Version 1.0

Aligned with:

COURSE_CRAFTER_TRUE_NORTH_v1.0.md

COURSE_CRAFTER_DATABASE_SCHEMA_v1.0.md

COURSE_CRAFTER_QA_IMPLEMENTATION_PLAN_v1.1 (pending)

Maturion One-Time Build Philosophy

0. PURPOSE

This document specifies all backend Edge Functions required to implement Course Crafter:

Project & lesson management

Upload pipelines

Parsing & AI resequencing

Script generation

Timing and segment planning

Branding & template management

Image generation

Voice-over generation

Video rendering pipelines (Engine 1 & Engine 2 v1)

Book rendering (Engine 3)

SCORM/Interactive rendering (Engine 4)

AI gateway and telemetry

Job orchestration

Worker queue integration

Export pipeline

Watchdog & diagnostic endpoints

This is the authoritative interface contract between:

The database

The frontend

The AI model layer

The job runner / renderer

Builders must not create any API beyond what is defined here.

1. HIGH-LEVEL STRUCTURE

All Course Crafter Edge Functions are grouped by functional domain:

/cc/projects           → project lifecycle
/cc/hierarchy          → LU, modules, lessons
/cc/context            → contextualisation
/cc/uploads            → source uploads
/cc/engine1            → voice-over factory
/cc/engine2            → video factory
/cc/engine3            → book/manual factory
/cc/engine4            → e-learning factory
/cc/ai                 → AI gateway
/cc/render             → video/book/SCORM job execution
/cc/assets             → asset management
/cc/templates          → branding & templates
/cc/interactions       → e-learning interactions
/cc/export             → exports for LMS
/cc/logs               → AI calls & event logs
/cc/watchdog           → health, diagnostics, cost


All functions use:

Authenticated calls

RLS enforced by org_id and project_id

Common JSON envelope:

{
  "ok": true | false,
  "data": { ... },
  "error": { "code": "CC-xxxx", "message": "" }
}

2. PROJECT MANAGEMENT
2.1 POST /cc/projects/create

Create a new course project.

Input
{
  "name": "Human Rights Awareness",
  "code": "HRA-101",
  "description": "...",
  "default_language": "en"
}

Output

Project record

2.2 GET /cc/projects/list

List all projects for the user/org.

Output

Array of {id, name, code, status, created_at, updated_at}

2.3 GET /cc/projects/:project_id

Full project metadata.

2.4 POST /cc/projects/:project_id/update

Update metadata (name, code, description, language).

2.5 POST /cc/projects/:project_id/delete

Soft-delete project; cascade archive tasks.

3. COURSE HIERARCHY MANAGEMENT
3.1 POST /cc/hierarchy/learning-unit/create
3.2 POST /cc/hierarchy/module/create
3.3 POST /cc/hierarchy/lesson/create

All follow the same pattern:

Input
{
  "project_id": "...",
  "parent_id": "...", // optional for modules
  "title": "Learning Unit 1",
  "sequence": 1
}

Output

Created record

3.4 GET /cc/hierarchy/:project_id/full-tree

Returns full hierarchical structure:

{
  "project": { ... },
  "learning_units": [
      {
        "id": "...",
        "modules": [
           {
              "id": "...",
              "lessons": [...]
           }
        ]
      }
  ]
}


Used by frontend to populate wizard navigation.

4. CONTEXTUALISATION
4.1 POST /cc/context/:project_id/update
Input
{
  "raw_text": "...",
  "audience_level": "intro",
  "audience_role": "operator",
  "region": "africa",
  "domain": "security",
  "language": "en"
}

Output

Updated context record

4.2 POST /cc/context/:project_id/upload-doc

Uploads PDFs, DOCX, PPTX, TXT for AI context.

Output

Stored file metadata

Parsed summary via AI (async)

5. SOURCE UPLOADS
5.1 POST /cc/uploads/:lesson_id/source

Accepts:

PPTX

MP4

DOCX/PDF

Reference images

YouTube URL (special case)

Output

cc_source_files entry

File path

Asynchronous parse job (if needed)

6. ENGINE 1 — VOICE-OVER FACTORY
6.1 POST /cc/engine1/:lesson_id/parse-ppt

Extract scenes, segments, timings from PPT.

Output

Scenes + segments in JSON

Database entries created in cc_scenes, cc_segments

6.2 POST /cc/engine1/:lesson_id/parse-mp4

Extract timing clues (optional refinement).

6.3 GET /cc/engine1/:lesson_id/plan

Returns:

All segments

Extracted script text

Thumbnail references

Auto-estimated durations

Editable metadata

6.4 POST /cc/engine1/:lesson_id/update-plan

Updates:

Segment text

Timings

Sequence

Gap durations

Segment merge/split operations

6.5 POST /cc/engine1/:lesson_id/generate-voice

Creates voice tracks for each segment.

Input:
{
  "voice_profile": "en_male_neutral_1"
}

Output:

Voice tracks stored in cc_voice_tracks

Asset references recorded in cc_assets

6.6 POST /cc/engine1/:lesson_id/render-video

Creates render job:

cc_video_render_jobs:
  engine = "e1"
  version_label = "v1_voice_over"
  job_state = "queued"


Worker composes:

Original MP4 visuals

AI-generated voice tracks

Output:

Final MP4 in cc_assets with role = "final_video"

7. ENGINE 2 — VIDEO FACTORY (v1)
7.1 POST /cc/engine2/:lesson_id/generate-outline

Reads:

Source files

Context

Lesson metadata

Outputs:

Scene list

High-level descriptions

Proposed script segments

7.2 POST /cc/engine2/:lesson_id/update-script

Stores:

Updated script segments

Scene-level text

Resolves into entries in cc_scripts

7.3 POST /cc/engine2/:lesson_id/generate-prompts

For each scene:

Creates image prompt (LLM)

Stores in cc_scripts.metadata or separate table (future)

7.4 POST /cc/engine2/:lesson_id/generate-images
Input:
{
  "scene_id": "...",
  "prompt": "flat illustration of ..."
}

Output:

Calls AI gateway → generates image

Stores variants in cc_assets (image type)

Marks selected image as is_active = true

7.5 POST /cc/engine2/:lesson_id/set-brand-profile

Sets brand template:

{
  "brand_profile_id": "...",
  "template_choice": "template_2"
}


Stored in lesson metadata or project defaults.

7.6 POST /cc/engine2/:lesson_id/render-video

Creates render job:

engine = "e2"
version_label = "v1_still_transitions"
job_state = "queued"


Worker:

Fetches scripts

Fetches image assets

Fetches brand template

Generates per-scene audio

Calls FFMPEG to assemble final video

Stores result in:

cc_assets → role final_video

8. ENGINE 3 — BOOK & MANUAL FACTORY
8.1 POST /cc/engine3/:project_id/outline

Generates:

Book chapter structure

Mapped onto LU → Module → Lesson

Summaries and chapter titles

8.2 POST /cc/engine3/:project_id/update-section

Edits:

content_markdown

sequence

mapping relationship

8.3 POST /cc/engine3/:project_id/render-book

Creates:

cc_book_render_jobs:
  job_state = queued


Worker:

Compiles markdown/HTML

Embeds images

Applies book template

Renders PDF & eBook

Stores in cc_assets

9. ENGINE 4 — E-LEARNING FACTORY
9.1 POST /cc/engine4/:lesson_id/create-interaction
Input:
{
  "interaction_type": "hotspot",
  "title": "...",
  "config": {...}
}


Creates entry in cc_interactions.

9.2 POST /cc/engine4/:lesson_id/update-interaction

Updates config.

9.3 POST /cc/engine4/:lesson_id/add-quiz-question

Adds question to cc_quiz_questions.

9.4 POST /cc/engine4/:lesson_id/render-scorm

Creates:

cc_scorm_render_jobs:
  job_state = queued


Worker:

Builds SCORM manifest

Renders HTML5 slides

Embeds videos, images, audio

Zips package

Stores as asset with role = "scorm_package"

10. AI GATEWAY

Unified interface for ALL AI calls.

10.1 POST /cc/ai/llm
Input:
{
  "model": "gpt-4.1",
  "prompt": "...",
  "context": {...}
}

Output:

LLM response

Cost metadata

Logged in cc_ai_calls

10.2 POST /cc/ai/tts
Input:
{
  "script_id": "...",
  "voice_profile": "..."
}

Output:

Audio file path

Asset reference

10.3 POST /cc/ai/image
Input:
{
  "prompt": "...",
  "style": "flat",
  "scene_id": "..."
}

10.4 POST /cc/ai/video (future)

Handles cinematic / 3D video generation.

11. RENDER WORKERS & JOBS

These functions interact with worker queue.

11.1 POST /cc/render/job/:job_id/start

Called by worker when starting.

11.2 POST /cc/render/job/:job_id/complete

Attach:

result_asset_id

metadata

11.3 POST /cc/render/job/:job_id/fail

Attach:

error_message

stack trace (internal only)

12. ASSET MANAGEMENT
12.1 GET /cc/assets/:lesson_id/list

List all lesson assets (images, audio, video, templates).

12.2 POST /cc/assets/:asset_id/set-active

Marks version as active.

12.3 POST /cc/assets/:asset_id/delete

Soft delete.

13. BRAND TEMPLATES
13.1 POST /cc/templates/create
13.2 POST /cc/templates/update
13.3 GET /cc/templates/:project_id/list
14. EXPORTS
14.1 GET /cc/export/:project_id/thinkific-metadata

Returns:

{
  "course_title": "...",
  "lesson_list": [...],
  "final_videos": [...]
}

14.2 GET /cc/export/:project_id/assets-zip

Bundle all assets.

14.3 GET /cc/export/:lesson_id/scorm

Return generated SCORM package.

15. LOGGING & WATCHDOG
15.1 GET /cc/logs/ai/:project_id

Filter by engine / call type.

15.2 GET /cc/logs/events/:project_id

Frontend event log.

15.3 GET /cc/watchdog/status

Returns:

{
  "render_queue_depth": ...,
  "avg_job_duration": ...,
  "cost_today": ...,
  "errors_today": ..
}

16. ERROR CODES

Standard format:
CC-xxxx

Examples:

CC-0001 – invalid project id

CC-0101 – PPT parse error

CC-0203 – video assembly failed

CC-0302 – AI call failed

CC-0402 – SCORM build error

✔ END OF COURSE_CRAFTER_EDGE_FUNCTIONS_v1.0.md