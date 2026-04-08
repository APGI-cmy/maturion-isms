COURSE_CRAFTER_DATABASE_SCHEMA_v1.0.md

Maturion Course Crafter – Database & Data Model Specification
Version 1.0

Aligned with:

COURSE_CRAFTER_TRUE_NORTH_v1.0.md

COURSE_CRAFTER_ARCHITECTURE_v0.1.md (superseded for schema)

COURSE_CRAFTER_QA_IMPLEMENTATION_PLAN_v0.1.md (to be upgraded to v1.1)

0. Purpose

This document defines the logical database schema for the Course Crafter module.

It specifies:

All tables, their purpose and relationships

Primary keys, foreign keys, and key constraints

Core indexes and uniqueness rules

Versioning and asset referencing patterns

Engine-specific data structures (E1–E4)

Pipeline/job tables for rendering, AI calls and monitoring

RLS / tenancy and permission boundaries (conceptual)

This is the authoritative reference for:

DB migrations

Backend API & Edge Function implementation

QA tests for data integrity

Foreman’s schema drift checks

No table or column may be added in implementation without being added here.

1. Conventions

PK: id (UUID or numeric, depending on tech stack; assume UUID logically).

FK: <referenced_table>_id naming pattern.

Timestamps: created_at, updated_at (UTC).

Soft delete: deleted_at (nullable).

Tenant / Company: org_id (foreign key to global organisation table outside this module).

Boolean flags: is_... or has_....

Enumerations: status, engine_type, asset_type, job_state, etc., constrained by CHECKs/ENUMs.

2. Core Hierarchy Tables

These tables define the course hierarchy:
Project (Course) → Learning Unit → Module → Lesson → Scene → Segment.

2.1 cc_projects

Represents a Course / Project.

Column	Type	Notes
id (PK)	UUID	Unique project ID
org_id (FK)	UUID	Tenant / company
name	TEXT	Course / project name
code	TEXT	Optional short code (e.g. “HRA-101”)
description	TEXT	High-level description
status	TEXT	Enum: draft, in_progress, ready_for_export, archived
default_language	TEXT	e.g. en, future multi-language support
created_by	UUID	User who created
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
deleted_at	TIMESTAMP	nullable

Indexes:

idx_cc_projects_org_id

idx_cc_projects_code_unique (unique per org)

2.2 cc_learning_units

Maps to Learning Units in the course.

Column	Type	Notes
id (PK)	UUID	
project_id FK	UUID	→ cc_projects.id
title	TEXT	
description	TEXT	
sequence	INT	Ordering within project
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
deleted_at	TIMESTAMP	nullable

Index:

idx_cc_learning_units_project_id_sequence

2.3 cc_modules

Modules inside a Learning Unit.

Column	Type	Notes
id (PK)	UUID	
project_id FK	UUID	(denormalised for fast access)
learning_unit_id (FK)	UUID	→ cc_learning_units.id
title	TEXT	
description	TEXT	
sequence	INT	Ordering within LU
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
deleted_at	TIMESTAMP	nullable

Index:

idx_cc_modules_learning_unit_id_sequence

2.4 cc_lessons

Represents a single Lesson (usually corresponds to a video or interaction).

Column	Type	Notes
id (PK)	UUID	
project_id FK	UUID	
learning_unit_id (FK)	UUID	optional direct reference
module_id (FK)	UUID	→ cc_modules.id
title	TEXT	e.g. “History of Human Rights”
code	TEXT	e.g. L1.1
objective	TEXT	Lesson-level learning objective
engine_flags	JSONB	Which engines this lesson has been processed by: { "e1": true, "e2": false, ... }
status	TEXT	Enum: draft, in_design, rendering, ready, archived
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
deleted_at	TIMESTAMP	nullable

Index:

idx_cc_lessons_module_sequence (include sequence column if needed)

2.5 cc_scenes

Sub-division of a lesson into conceptual scenes.

Column	Type	Notes
id (PK)	UUID	
lesson_id (FK)	UUID	
title	TEXT	optional
description	TEXT	conceptual explanation
sequence	INT	ordering in lesson
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
deleted_at	TIMESTAMP	nullable

Index:

idx_cc_scenes_lesson_id_sequence

2.6 cc_segments

Lowest-level unit – corresponds to a single script + visual + timing block.

Column	Type	Notes
id (PK)	UUID	
scene_id (FK)	UUID	
lesson_id (FK)	UUID	redundant for quick filtering
source_type	TEXT	Enum: ppt_slide, ppt_animation, text, youtube, other_video
source_ref	TEXT	Slide index, timestamp, or reference ID
sequence	INT	order within scene
script_text	TEXT	final approved script text for this segment
on_screen_duration	NUMERIC	seconds – how long it stays visible
gap_after	NUMERIC	seconds pause before next segment
is_youtube_embed	BOOLEAN	true if this segment is a full YouTube insertion
youtube_url	TEXT	nullable
status	TEXT	draft, approved
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
deleted_at	TIMESTAMP	nullable

Index:

idx_cc_segments_scene_id_sequence

3. Context & Target Population
3.1 cc_project_context

High-level contextualisation used by Engines.

Column	Type	Notes
id (PK)	UUID	
project_id FK	UUID	
raw_text	TEXT	narrative context
audience_level	TEXT	intro, intermediate, advanced
audience_role	TEXT	operator, supervisor, manager, executive, mixed
region	TEXT	africa, global, etc.
domain	TEXT	e.g. security_risk_management
language	TEXT	default language
metadata	JSONB	additional flags
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
3.2 cc_project_documents

Context documents uploaded for a project.

Column	Type	Notes
id (PK)	UUID	
project_id (FK)	UUID	
file_path	TEXT	storage location
file_type	TEXT	pdf, docx, pptx, txt
title	TEXT	human-friendly name
description	TEXT	optional
parsed_status	TEXT	pending, parsed, failed
parsed_summary	TEXT	AI-generated summary
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
4. Source Uploads & Assets
4.1 cc_source_files

Generalised container for uploaded raw source files.

Column	Type	Notes
id (PK)	UUID	
project_id (FK)	UUID	
lesson_id (FK)	UUID	nullable
file_path	TEXT	
file_type	TEXT	pptx, mp4, docx, pdf, image, audio
purpose	TEXT	engine1_ppt, engine1_mp4, engine2_reference, engine3_ref, etc.
size_bytes	BIGINT	
checksum	TEXT	for dedupe/integrity
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
4.2 cc_assets

Master table for all generated or imported assets.

Column	Type	Notes
id (PK)	UUID	
project_id (FK)	UUID	
lesson_id (FK)	UUID	nullable
scene_id (FK)	UUID	nullable
segment_id (FK)	UUID	nullable
engine	TEXT	e1, e2, e3, e4
asset_type	TEXT	image, audio, video, book, document, scorm_package, template
role	TEXT	e.g. hero_image, background, voiceover, final_video, book_pdf
file_path	TEXT	storage reference
mime_type	TEXT	
metadata	JSONB	width, height, duration, model used etc.
version	INT	starts at 1, increments on replacement
is_active	BOOLEAN	only one active per (role, segment)
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
deleted_at	TIMESTAMP	

Indexes:

idx_cc_assets_project_lesson

idx_cc_assets_segment_role_active

4.3 cc_asset_versions

Optional extension if we need full history separate from the active view.

Column	Type	Notes
id (PK)	UUID	
asset_id (FK)	UUID	→ cc_assets.id
file_path	TEXT	
version	INT	
created_at	TIMESTAMP	
metadata	JSONB	snapshot

(This may be omitted if we treat cc_assets as versioned directly.)

5. Script & Voice Tables
5.1 cc_scripts

Represents scripted text at segment or scene level.

Column	Type	Notes
id (PK)	UUID	
project_id (FK)	UUID	
lesson_id (FK)	UUID	
scene_id (FK)	UUID	
segment_id (FK)	UUID	
engine	TEXT	e1, e2, e3
draft_text	TEXT	initial AI draft
final_text	TEXT	approved text
status	TEXT	draft, review, approved
created_by	UUID	user who last edited
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
5.2 cc_voice_tracks

Stores TTS outputs per segment or scene.

Column	Type	Notes
id (PK)	UUID	
project_id (FK)	UUID	
lesson_id (FK)	UUID	
scene_id (FK)	UUID	nullable
segment_id (FK)	UUID	
script_id (FK)	UUID	→ cc_scripts.id
file_path	TEXT	storage reference
voice_profile	TEXT	e.g. en_male_neutral_1
duration_seconds	NUMERIC	
tts_provider	TEXT	e.g. azure, gcp, openai
status	TEXT	generated, approved, rejected
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
6. Branding & Templates
6.1 cc_brand_profiles

Brand configurations per project or tenant.

Column	Type	Notes
id (PK)	UUID	
org_id (FK)	UUID	
project_id FK	UUID	nullable (project-specific or global)
name	TEXT	
primary_color	TEXT	HEX or similar
secondary_color	TEXT	HEX
logo_asset_id	UUID	FK → cc_assets.id
typography	JSONB	fonts, sizes, etc.
style_prefs	JSONB	{"tone": "corporate", "layout": "left_text_right_image"}
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
6.2 cc_brand_templates

Concrete layout templates used in Engine 2 & 4.

Column	Type	Notes
id (PK)	UUID	
brand_profile_id (FK)	UUID	
name	TEXT	
description	TEXT	
template_type	TEXT	video_scene, slide, ebook_page, etc.
layout_config	JSONB	positions for text, image, logo, etc.
preview_asset_id	UUID	optional preview image asset
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
7. Rendering & Job Pipelines
7.1 cc_video_render_jobs

Tracks render jobs for Engine 1 & 2 (and later 3D).

Column	Type	Notes
id (PK)	UUID	
project_id (FK)	UUID	
lesson_id (FK)	UUID	
engine	TEXT	e1, e2
version_label	TEXT	e.g. v1, v2_cinematic, v3_3d
job_state	TEXT	queued, in_progress, succeeded, failed, cancelled
requested_by	UUID	user
requested_at	TIMESTAMP	
started_at	TIMESTAMP	nullable
completed_at	TIMESTAMP	nullable
result_asset_id	UUID	FK → cc_assets.id (final video)
error_message	TEXT	if failed
job_metadata	JSONB	model info, cost estimate
created_at	TIMESTAMP	
updated_at	TIMESTAMP	

Index:

idx_cc_video_render_jobs_lesson_state

7.2 cc_book_render_jobs

For Engine 3 book/manual generation.

Column	Type	Notes
id (PK)	UUID	
project_id (FK)	UUID	
job_state	TEXT	as above
requested_by	UUID	
requested_at	TIMESTAMP	
completed_at	TIMESTAMP	
result_asset_id	UUID	FK → cc_assets.id (PDF/eBook)
error_message	TEXT	
metadata	JSONB	layout choices, etc.
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
7.3 cc_scorm_render_jobs

For Engine 4 interactive module packages.

Column	Type	Notes
id (PK)	UUID	
project_id (FK)	UUID	
lesson_id (FK)	UUID	optional (module-level vs lesson-level)
job_state	TEXT	
requested_by	UUID	
requested_at	TIMESTAMP	
completed_at	TIMESTAMP	
result_asset_id	UUID	FK → cc_assets.id (SCORM ZIP / HTML5 package)
error_message	TEXT	
metadata	JSONB	SCORM version, etc.
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
8. Engine 3 – Book / Content Structure

We keep Engine 3 structure simple but powerful.

8.1 cc_book_structures

Per project, describes the high-level book.

Column	Type	Notes
id (PK)	UUID	
project_id (FK)	UUID	
title	TEXT	Book title
subtitle	TEXT	
status	TEXT	draft, in_edit, ready
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
8.2 cc_book_sections

Sections/chapters within a book, mapped back to course hierarchy.

Column	Type	Notes
id (PK)	UUID	
book_id (FK)	UUID	
level	INT	1=chapter, 2=subsection, etc.
title	TEXT	
content_markdown	TEXT	main text content in markdown/HTML
mapping_type	TEXT	learning_unit, module, lesson, custom
mapping_id	UUID	id of LU/module/lesson (nullable if custom)
sequence	INT	ordering
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
9. Engine 4 – Interactions & Activities
9.1 cc_interactions

Generic interaction definition for Engine 4.

Column	Type	Notes
id (PK)	UUID	
lesson_id (FK)	UUID	
project_id (FK)	UUID	
interaction_type	TEXT	timeline, hotspot, accordion, quiz, upload_task, etc.
title	TEXT	
description	TEXT	
config	JSONB	type-specific config (e.g. steps, coordinates, labels)
sequence	INT	within lesson
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
9.2 cc_quiz_questions

If we want structured quiz definitions (reusable for external LMS).

Column	Type	Notes
id (PK)	UUID	
lesson_id (FK)	UUID	
project_id (FK)	UUID	
interaction_id FK	UUID	optional, link to parent interaction
question_text	TEXT	
question_type	TEXT	mcq_single, mcq_multi, true_false, short_answer
options	JSONB	for MCQ
correct_answers	JSONB	indices or text
feedback	JSONB	feedback per option
sequence	INT	
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
10. AI Gateway & Logging
10.1 cc_ai_calls

Tracks all AI-related calls (LLM, TTS, image, video).

Column	Type	Notes
id (PK)	UUID	
project_id (FK)	UUID	
lesson_id (FK)	UUID	nullable
engine	TEXT	e1, e2, e3, e4, global
call_type	TEXT	llm_script, llm_outline, tts, image, video, parse
provider	TEXT	model provider
model_name	TEXT	e.g. gpt-4.x, dalle-3, etc.
input_tokens	INT	approx where relevant
output_tokens	INT	approx where relevant
request_payload	JSONB	truncated or hashed for privacy
response_meta	JSONB	cost, latency, etc.
status	TEXT	success, failed
error_message	TEXT	nullable
created_at	TIMESTAMP	
10.2 cc_activity_log

High-level event log for user & system actions.

Column	Type	Notes
id (PK)	UUID	
org_id (FK)	UUID	
project_id (FK)	UUID	nullable
lesson_id (FK)	UUID	nullable
user_id	UUID	nullable (system events)
event_type	TEXT	project_created, engine1_plan_approved, render_started, render_failed, etc.
event_payload	JSONB	context info
created_at	TIMESTAMP	
11. Tenancy & RLS (Conceptual)

All core tables that hold project content or assets must be RLS-protected by:

org_id (for shared global multi-tenant environment), and/or

A join from project_id → cc_projects.org_id.

Policies:

Users can only access projects for which they have explicit membership or role mapping.

Engine jobs, AI calls, logs are filtered by project_id and org_id as needed.

Actual RLS definitions live in the platform-level schema, but this doc defines the required columns and assumptions.

12. Indexing & Performance Notes

Baseline index rules:

Every FK has an index.

Composite indexes on:

(project_id, lesson_id, scene_id, segment_id) in cc_assets, cc_scripts, cc_voice_tracks.

(project_id, job_state) in job tables.

Consider partial indexes on:

is_active = true for cc_assets.

13. Schema Stability & Change Control

Any change to these tables requires:

Update to this schema file

Update to COURSE_CRAFTER_QA_IMPLEMENTATION_PLAN

Update to COURSE_CRAFTER_EDGE_FUNCTIONS

Changelog entry in COURSE_CRAFTER_CHANGELOG_v1.x

No ad-hoc fields, no “quick columns” are allowed.

✔ End of COURSE_CRAFTER_DATABASE_SCHEMA_v1.0.md