Below is the full, Foreman-grade, One-Time-Build compliant COURSE_CRAFTER_EXPORT_SPEC_v1.0.md.
It mirrors the quality and structure of WRAC_EXPORT_SPEC and integrates all four Engines (E1–E4) into a unified export system.

This document defines:

All exportable artefacts

Export formats

Folder structures

Metadata structures

LMS compatibility rules

File naming conventions

Validation requirements

Cross-engine alignment

Future upgrade hooks

This is the authoritative reference for all Course Crafter exports.

COURSE_CRAFTER_EXPORT_SPEC_v1.0.md

Export Formats, Structures, Metadata & Validation Requirements
Version 1.0
Aligned with:

COURSE_CRAFTER_TRUE_NORTH_v1.0.md

COURSE_CRAFTER_DATABASE_SCHEMA_v1.0.md

COURSE_CRAFTER_EDGE_FUNCTIONS_v1.0.md

COURSE_CRAFTER_FRONTEND_COMPONENT_MAP_v1.0.md

COURSE_CRAFTER_WIREFRAMES_v1.0.md

COURSE_CRAFTER_QA_IMPLEMENTATION_PLAN_v1.1.md

0. PURPOSE

This specification defines:

All output file types that Course Crafter can produce

Export formats for each Engine (E1–E4)

Required metadata

Folder hierarchy

Naming conventions

LMS and publishing compatibility

Validation rules and checks

Packaging for ZIP downloads

Versioning and integrity protections

Exports must be predictable, consistent, LMS-ready, standards-compliant, and reproducible.

No implementation may diverge from this export spec.

1. EXPORT TYPES OVERVIEW

Course Crafter exports the following artefacts:

Engine 1 (E1): Voice-over Video (MP4)
Engine 2 (E2): Branded Instructional Video (MP4)
Engine 3 (E3): Course Book / Manual (PDF, ePub, HTML)
Engine 4 (E4): SCORM E-Learning Package (ZIP)
Global: Course Metadata Bundle
Global: Asset Package ZIP (All media files)
Global: Thinkific / LMS Import Package
Global: Job Logs / Render Metadata (JSON)


Each export type has:

Naming conventions

Folder structure

Versioning

Metadata manifest

Validation rules

2. GENERAL NAMING CONVENTIONS
2.1 File Naming Format
{project_code}_{lesson_code}_{version}.{extension}

Example:
HRA101_L1.2_v3.mp4
HRA101_BOOK_v1.pdf
HRA101_ELEARNING_v2.zip


If project code not set:

{project_name_slug}_{lesson_code}_{version}.{ext}

2.2 Version Numbering

v1 = First export

Increment by +1 for each new render job

Version stored in cc_assets.version

If asset is replaced, version increments.

3. FOLDER STRUCTURE (GLOBAL)

When a user downloads a full export package, structure must be:

{project_code}/
   metadata/
      project.json
      lessons.json
      render_jobs.json
      manifest.json

   videos/
      engine1/
      engine2/

   book/
      pdf/
      epub/
      html/

   scorm/
      lesson_X/
        imsmanifest.xml
        assets/
        slides/
        scripts/

   assets/
      images/
      audio/
      thumbnails/
      branding/
      logos/

   logs/
      ai_calls.json
      render_jobs.json

4. EXPORT TYPE: ENGINE 1 VOICE-OVER VIDEO
4.1 Format

MP4

H.264

1920×1080 minimum

AAC audio

30fps

4.2 Naming
{project_code}_{lesson_code}_E1_v{version}.mp4

4.3 Contents

Original visual track from uploaded MP4

AI-generated voiceover

Synchronized timing blocks

“End of Lesson” slide appended

4.4 Metadata (JSON)
{
  "engine": "E1",
  "project_id": "...",
  "lesson_id": "...",
  "version": 3,
  "duration_seconds": 342,
  "render_time": "2025-01-10T12:33:12Z",
  "voice_profile": "en_male_1",
  "script_segments": [
     {"segment_id":"...","duration":3.5,"gap":0.5}
  ]
}

5. EXPORT TYPE: ENGINE 2 VIDEO (BRANDED VIDEO)
5.1 Format

MP4, H.264

1920×1080

Branded backgrounds

AI-generated images per scene

TTS with optional highlighting

5.2 Naming
{project_code}_{lesson_code}_E2_v{version}.mp4

5.3 Metadata
{
  "engine": "E2",
  "brand_profile_id": "...",
  "template_id": "...",
  "image_assets": [...],
  "script_segments": [...],
  "audio_tracks": [...],
  "duration_seconds": 410
}

6. EXPORT TYPE: ENGINE 3 BOOK / MANUAL
6.1 Formats

PDF (primary)

ePub (optional)

HTML single-page or multi-page (optional)

6.2 Naming
{project_code}_BOOK_v{version}.pdf

6.3 Structure (PDF)
Front Cover
Title Page
Copyright Page
Table of Contents
Chapters (mapped to course structure)
Appendices
Bibliography (optional)
Glossary (optional)

6.4 Metadata
{
  "engine": "E3",
  "project_id": "...",
  "sections": [
      {"section_id":"...","mapped_to":"lesson","id":"..."}
  ]
}

7. EXPORT TYPE: ENGINE 4 SCORM PACKAGE
7.1 Format

ZIP package containing:

imsmanifest.xml

/assets/

/scripts/

/slides/

SCORM metadata

Supports:

SCORM 1.2 (default)

SCORM 2004 2nd Edition

7.2 Naming
{project_code}_{lesson_code}_SCORM_v{version}.zip

7.3 Required Files
imsmanifest.xml
index.html
player.js
scenes.json
assets/
    images/
    audio/
slides/
    slide_1.html
    slide_2.html

7.4 Metadata
{
  "engine": "E4",
  "lesson_id": "...",
  "scorm_version": "1.2",
  "interactions": [...],
  "quizzes": [...],
  "duration_estimate_seconds": 600
}

8. EXPORT TYPE: COURSE METADATA BUNDLE
8.1 File
metadata/project.json


Includes:

Project settings

Target audience

Context documents list

Learning hierarchy

Lesson metadata

9. EXPORT TYPE: ALL-ASSET PACKAGE ZIP
9.1 Structure
assets/
    images/
    audio/
    video/
    branding/
    thumbnails/
    raw_uploads/

9.2 Contents

All items from cc_assets table

Maintaining original paths

10. EXPORT TYPE: THINKIFIC / LMS EXPORT
10.1 Metadata File Required
lessons.json

Example:
[
  {
    "lesson_code": "L1.1",
    "title": "Introduction to Rights",
    "video": "HRA101_L1.1_E2_v2.mp4",
    "ebook":"HRA101_BOOK_v3.pdf",
    "scorm":"HRA101_L1.1_SCORM_v1.zip"
  }
]

10.2 Validation

All referenced files must exist

Titles must match hierarchy

Order must match sequence

11. EXPORT MANIFEST (GLOBAL)

Every export package must include:

metadata/manifest.json

Format
{
  "export_version": "v1.0",
  "generated_at": "2025-01-10T12:00:00Z",
  "project": {...},
  "lessons": [...],
  "assets_count": 142,
  "videos": [...],
  "books": [...],
  "scorm_packages": [...],
  "integrity": {
      "hash_algorithm": "SHA256",
      "hash": "abc123..."
  }
}

12. INTEGRITY CHECK REQUIREMENTS

All exported files must be validated for:

File existence

Correct MIME

Correct file size (>0)

Render job success

Hash match

Hash is stored in metadata for later validation.

13. QUALITY VALIDATION (EXPORT-SPECIFIC)
Mandatory:

Video playback test

SCORM validator pass

PDF opens without warnings

All images load in slides

All audio files readable

Branding applied correctly

No missing lessons

Folder structure exact match

No orphan assets

These tie directly into QA v1.1.

14. EXCEPTIONS

No deviation from this export-spec is allowed unless:

True North is updated

Component Map updated

QA plan updated

Changelog updated

Foreman approves

✔ END OF COURSE_CRAFTER_EXPORT_SPEC_v1.0.md