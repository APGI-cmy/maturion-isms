COURSE_CRAFTER_QA_IMPLEMENTATION_PLAN_v1.1.md

Quality Assurance & Implementation Governance Blueprint
Version 1.1
Aligned with: True North 1.0, DB Schema 1.0, Edge Functions 1.0, Component Map 1.0, Wireframes 1.0

0. PURPOSE

This document defines the complete quality assurance approach for the Course Crafter module:

Quality gates

Test procedures

Automated regression validation

AI-output consistency checking

UI validation rules

Schema integrity tests

Worker/render pipeline tests

Asset verification

SCORM compliance tests

Book format checks

Performance baselines

Foreman oversight procedures

This plan ensures:

✔ Predictable delivery
✔ Zero drift from True North
✔ No UI fragmentation
✔ No API divergence
✔ Strict adherence to Maturion Build Philosophy

1. QA PRINCIPLES (MANDATORY)

Single Source of Truth

All logic flows from True North & Edge Functions.

No developer may improvise or “patch”.

Strict Component Contracting

Every UI component maps to exactly one API flow.

Every API must return predictable schemas.

Immutable Workflows

Wizard steps cannot be changed without updating this file.

Deterministic AI Outputs Where Required

Voice consistency enforced across segments.

Style templates enforced for prompts.

Variation allowed only where flagged.

Strict Version Control

Every change to any module:
→ requires updating this file
→ requires updating CHANGELOG
→ requires backward compatibility check.

No Hardcoded Values

Everything configurable via project or global settings.

2. QA SCOPE (FULL SYSTEM)

This QA plan covers all layers of Course Crafter:

Frontend UI
Frontend Components
API / Edge Functions
Database Schema / RLS
File Upload & Parsing
AI Gateway (LLM, TTS, Image, Video)
Engines 1–4 Pipelines
Branding & Template System
Render Workers & Queues
Asset Management & Versioning
Book/Manual Generator
SCORM Builder
Exports (Videos, SCORM, Metadata)
Performance & Stability
Security & Permissions
Watchdog Monitoring

3. QA STRUCTURE OVERVIEW
Unit Tests (per component)
Integration Tests (per engine)
Regression Tests (system-wide)
Contract Tests (API schemas)
Scenario Tests (Workflows)
Performance Tests
AI Quality Tests
Render Consistency Tests
File Integrity Tests
Human Review Workflows
Foreman Oversight & Audits


Each test category has mandatory coverage below.

4. DATABASE QA
4.1 Migration Testing

Must pass:

Schema creation test

Up migration test

Down migration test

Backward compatibility validation

4.2 Primary & Foreign Key Integrity

System auto-tests:

Required foreign keys exist

No orphaned records

No missing parent objects

4.3 RLS Enforcement

Every table is tested for:

No cross-org leakage

No access without project membership

No write operations when lacking permissions

4.4 Index Health

Automated audit:

All FK columns are indexed

Composite indexes match query patterns

No unused indexes

5. FRONTEND QA
5.1 Component Rendering Tests

For each component:

Renders without errors

Accepts all props defined in the Component Map

Emits all events correctly

Does not contain business logic

5.2 Wizard Navigation Tests

Validates:

Step order cannot change

Step transitions work

Steps lock correctly until prerequisites complete

5.3 File Upload QA

Accepts only supported file types

Validates file size limits

Displays parsing errors correctly

Handles YouTube references gracefully

5.4 Form Validation QA

Required fields enforced

Input formatting enforced

AI-assist availability

6. API QA
6.1 Schema Contract Tests

Every API must have a JSON schema snapshot

Snapshot diff detection prevents unapproved changes

Schema version increments required for changes

6.2 Error Code Enforcement

All API errors must conform to:

CC-xxxx


Tests ensure:

No raw errors exposed

No stack traces returned to users

6.3 Performance QA

All CRUD endpoints must respond < 300ms

Render job queue submission < 150ms

Large uploads must not block UI

7. AI QA
7.1 Prompt-Stability Tests

Checks:

For deterministic-required tasks (E1 scripts, E2 prompts):

Prompts produce stable outputs given same seed

For creative tasks (E3/E4):

Style variations within expected boundaries

No off-topic content

7.2 TTS QA

Voice continuity across segments

No clipping or cutting

Correct pronunciation of acronyms and terms

Volume normalization enforced

7.3 Image QA

Tests:

Resolution minimum 1024×1024

Correct style (flat vs cinematic vs photorealistic)

Correct safe content filters

Color palettes match brand rules

7.4 Video QA (Engine 1 & 2)

Frame stitching integrity

No corrupted frames

Transitions correct

Duration matches script + timing rules

Word highlighting syncs with voice (where applicable)

7.5 Book QA (Engine 3)

All chapters generated

Markdown syntax valid

Image embedding correct

No blank pages or empty sections

7.6 SCORM QA (Engine 4)

Valid manifest

LMS-compatible navigation

Interaction components render correctly

Quizzes score and track correctly

8. ENGINE-SPECIFIC QA
8.1 Engine 1 — Voice-Over

Test Cases:

PPT parsing success/failure

Segment extraction accuracy ±0.2 sec

TTS generation for all segments

Gap/duration adjustments persist

Final MP4 integrates original animations

8.2 Engine 2 — Video Factory

Test Cases:

Scene outline matches uploaded content

Prompt generation relevant and correct

All image variants appear

Brand templates render correctly

Voice + image + timings produce valid MP4

8.3 Engine 3 — Book Factory

Test Cases:

Outline hierarchy correct

Mapping to LU/Module/Lesson correct

Markdown validated

PDF renders with correct pagination

8.4 Engine 4 — E-Learning Factory

Test Cases:

Interaction editor components load

Hotspots register correctly

Quizzes grade correctly

SCORM package loads in standard LMS

9. WORKER JOB QA
9.1 Render Job Lifecycle Tests

Every job must pass:

queued → in_progress → succeeded|failed


Enforce max-runtime thresholds

Accurate progress reporting (must monotonic increase)

Failures must produce actionable error messages

9.2 Asset Verification

After rendering:

File exists

File readable

Duration > 1 sec

Correct MIME type

Correct metadata stored

10. EXPORT QA
10.1 Thinkific/LMS Metadata

Lesson sequencing correct

Video paths valid

Titles match project hierarchy

10.2 Asset Export ZIP

No missing files

No duplicates

Correct folder structure

10.3 SCORM Export

Manifest passes SCORM validator

All assets linked correctly

11. WATCHDOG QA

Ensures:

Render queue not stalled

API error rate < 1%

AI cost anomalies flagged

Storage anomalies flagged

Schema drift detection active

12. HUMAN REVIEW WORKFLOWS
12.1 Foreman Review Gates

Foreman must review:

All DB migrations

All new API endpoints

All schema changes

All complex wiring changes

All new model integrations

All UI workflows

12.2 Mandatory Manual QA Cases:

A full Engine 1 → Engine 2 → Engine 3 workflow

A full Engine 4 SCORM build

A book + SCORM export cross-check

Random sample of 5 lessons rendered end-to-end

13. REGRESSION TEST SUITE
13.1 Automated Nightly Tests

Covers:

100% API endpoints

100% DB integrations

100% render job flows

100% AI gateway flows

Scene/segment planning

Export flows

13.2 Snapshot Tests

Snapshots include:

API schemas

Component tree

Wireframe structure

Branding templates

Render pipeline manifests

Any change requires:

Foreman approval

Changelog update

14. PERFORMANCE & LOAD QA
14.1 Rendering Throughput

E1 video: < 3 min

E2 video: < 8 min

E3 book: < 30 sec

E4 SCORM package: < 2 min

14.2 Concurrency Tests

50 concurrent video jobs

100 concurrent TTS requests

1000 image generation tasks across multiple scenes

15. SECURITY QA
15.1 File Upload Security

File type validation

Virus scan

MIME mismatch detection

15.2 Secret/Key Handling

No keys in frontend

No logging of sensitive data

15.3 RLS Enforcement Tests

User cannot access another org’s project

Asset downloads are permission protected

16. RELEASE MANAGEMENT QA
16.1 Pre-Release Checklist

All migrations tested

All schemas validated

All APIs covered

Render jobs tested

SCORM tested in real LMS

Books tested in Adobe Reader + browser PDF viewer

Foreman signs off

16.2 Post-Release Monitoring

Watchdog anomaly detection

Log review

AI cost review

Error rate monitoring

17. CHANGE CONTROL

Any change requires:

Update to:

True North

Database Schema

Edge Functions

Component Map

Wireframes

QA Plan

Foreman review

Version increment

Changelog entry

Regression test re-run

No exceptions.

✔ END OF COURSE_CRAFTER_QA_IMPLEMENTATION_PLAN_v1.1.md