Below is the COURSE_CRAFTER_IMPLEMENTATION_GUIDE_v1.0.md, written at the same Foreman-grade, One-Time-Build aligned level of completeness as the WRAC and Risk Assessment implementation guides.

This guide is built for:

The Foreman (architectural oversight)

Co-Pilot Builders (actual implementers)

QA teams (verification pipeline)

Future contributors (ensures zero drift)

It consolidates all of Course Crafter into:

A single onboarding guide

A complete implementation philosophy

A step-by-step blueprint

Strict rules and governance

All cross-module dependencies

All required technologies and guardrails

This is the “master execution manual” for building Course Crafter v1.0.

COURSE_CRAFTER_IMPLEMENTATION_GUIDE_v1.0.md

Build Execution Manual – Architecture, Standards, Governance & Delivery
Version 1.0
Aligned with the Maturion One-Time Build Philosophy

0. PURPOSE

This guide instructs how Course Crafter must be built.

It consolidates all foundational documents:

True North

DB Schema

Edge Functions

Component Map

Wireframes

QA Plan

Export Spec

Sprint Plan

It gives the Foreman and Co-Pilot teams:

The exact build sequence

The architecture rules

Acceptable technologies

Required constraints

Stability guarantees

Test and release criteria

This document MUST be read before any coding begins.

1. SYSTEM OVERVIEW (EXECUTIVE SUMMARY)

Course Crafter is a four-engine AI-powered content manufacturing environment:

Engine 1 – Voice-Over Factory
Engine 2 – Video Factory (v1 images, v2 cinematic, v3 3D)
Engine 3 – Book & Manual Factory
Engine 4 – E-Learning (SCORM) Factory


Each engine is independent but shares:

A unified hierarchy (Project → LU → Module → Lesson → Scene → Segment)

A unified asset system

A unified AI gateway

A unified render pipeline

A unified export system

Everything is governed by:

The Course Crafter True North (non-negotiable)

Strict QA enforcement

Immutable workflows

Foreman oversight

This guarantees a future-proof, scalable, maintainable, zero-regression platform.

2. IMPLEMENTATION PRINCIPLES
2.1 One-Time Build (No Legacy)

No shortcuts

No tech debt

No “temporary fixes”

No hardcoded values

No UI improvisation

2.2 True North Alignment

All code must reflect the architecture exactly.

2.3 Zero Regression

Every fix requires a test

Every new feature requires QA approval

No silent API changes

2.4 Predictability Over Complexity

Simple solutions preferred if results are equal.

2.5 AI-First Execution

Maximize automation:

Auto-parsing

Auto-planning

Auto-prompts

Auto-branding

Auto-export

The human user MUST feel that the system does 80% of the work.

3. ARCHITECTURAL STACK
3.1 Backend

Node.js / Deno / Bun (recommended)

Edge functions (serverless)

Postgres with RLS

Cloud storage for assets

Worker queue (BullMQ, Cloudflare Queues, etc.)

3.2 Frontend

React + TypeScript

TailwindCSS

Headless UI components

React Query (server state)

Zustand or Jotai (local state)

3.3 Workers

FFMPEG-based video rendering

OCR/PPTX extract

TTS synthesis

Image generation

PDF/book rendering

SCORM packaging

3.4 AI Models

LLM (GPT-4.x baseline, upgradable)

Image (OpenAI, Pika, or diffusions, upgradable)

TTS (Azure/OpenAI TTS)

Video (future: Sora, Luma, Runway)

Everything must create a “model routing layer” for future expansion.

4. IMPORTANT GLOBAL FLOWS

Before implementation begins, all developers must memorize the three key flows:

4.1 Content Manufacturing Flow
1. Upload content
2. AI parses → scenes & segments
3. AI drafts scripts
4. AI drafts prompts
5. AI generates images
6. AI generates audio
7. Worker compiles final output (video/book/scorm)
8. User reviews, approves, exports

4.2 Hierarchy Flow
Project → Learning Units → Modules → Lessons → Scenes → Segments


This is the backbone.
If the hierarchy breaks → the entire system collapses.

4.3 Export Flow

Each engine outputs files → exports → LMS.

E1 → MP4 (voice-over)
E2 → MP4 (branded)
E3 → PDF/ePub (book)
E4 → ZIP (SCORM)
Global → Thinkific metadata + asset bundles

5. IMPLEMENTATION STAGES (HIGH-LEVEL)

These correspond to the Sprint Plan:

Stage 1 – Infrastructure  
Stage 2 – Hierarchy & Context  
Stage 3 – Upload & Parsing  
Stage 4 – Engine 1  
Stage 5 – Engine 2  
Stage 6 – Engine 3  
Stage 7 – Engine 4  
Stage 8 – Export System  
Stage 9 – QA / UAT  
Stage 10 – Release

6. DETAILED IMPLEMENTATION STEPS (DEVELOPER-LEVEL)

These are the exact steps the builder must follow.

6.1 Build Foundation

Apply DB schema migration

Implement RLS for all tables

Implement AI gateway

Implement file storage adapters

Implement worker queue

Implement skeleton APIs

Implement system logging

Gate: QA signs off DB + RLS + AI gateway.

6.2 Implement Course Hierarchy

Create project CRUD

Add LU, Module, Lesson CRUD

Implement /full-tree endpoint

Build left-pane hierarchy UI

Bind hierarchy to project selector

Gate: Foreman verifies hierarchy fidelity.

6.3 Implement Upload Engine

Implement file upload endpoint

Build upload UI

Implement PPTX parser

Implement MP4 parser

Validate file types

Gate: QA verifies parsing accuracy.

6.4 Implement Engine 1

Backend:

PPT → scenes → segments

Segment editing

TTS generation

MP4 render job

Frontend:

Scene/segment table

Editor modals

Render panel

Worker:

Stitch audio + MP4

Gate: Foreman validates E1 video correctness.

6.5 Implement Engine 2

Backend:

Outline generator

Prompt generator

Image generator

Brand profiles

Render pipeline

Frontend:

Script outline UI

Visual plan UI

Brand template UI

Effects panel

Worker:

Assemble images + audio + transitions

Gate: Foreman reviews brand compliance.

6.6 Implement Engine 3 (Book Factory)

Backend:

Outline generator

Markdown section CRUD

PDF generator

Frontend:

Section editor

Book design UI

Worker:

Render PDF

Inject images

Gate: QA checks PDF integrity.

6.7 Implement Engine 4 (SCORM)

Backend:

Interaction CRUD

Quiz CRUD

SCORM build job

Frontend:

Interaction Builder

Quiz Builder

Worker:

Manifest builder

HTML slide generator

Gate: Test in SCORM Cloud + Thinkific.

6.8 Implement Export System

Backend:

/export/* endpoints

Metadata generation

ZIP bundling

Thinkific export

Frontend:

Export panel

Download manager

Worker:

Integrity hash generation

Gate: End-to-end packaging approved.

7. CROSS-ENGINE RULES (NON-NEGOTIABLE)
7.1 No engine may define its own file structure

All engines must use the unified asset system.

7.2 All engines must store:

Raw input

Processed output

Metadata

Version numbers

7.3 All engines must support re-rendering

A user can regenerate video/book/SCORM at any time.

7.4 All engines must respect:

Brand profiles

Context

Target audience

These must not drift.

8. TESTING REQUIREMENTS

Every feature must pass:

Unit tests

Integration tests

Contract tests

Rendering tests

AI quality tests

Load tests

At minimum:

80% backend coverage

70% frontend coverage

100% critical-path coverage

Critical path = E1 → E2 → E3 → E4 → Global Export.

9. PERFORMANCE REQUIREMENTS
Rendering performance (minimum baselines)

Engine 1 video: < 3 minutes

Engine 2 video: < 8 minutes

Book: < 30 seconds

SCORM: < 2 minutes

UI performance

Initial load < 2 seconds

Engine switch < 200ms

Segment editing < 100ms

Prompt generation < 1 second

10. SECURITY REQUIREMENTS

All assets protected via RLS

All exports checked for safe MIME

All uploads sandboxed

No user-provided JS allowed

No raw AI prompt injection allowed

11. WATCHDOG & HEALTH MONITORING

The system must monitor:

Queue depth

Worker failures

AI costs

Render errors

Missing assets

Schema anomalies

Foreman must review weekly.

12. DEPLOYMENT STEPS

Run migrations

Deploy edge functions

Deploy frontend

Deploy workers

Configure storage buckets

Run smoke tests

Run full regression test

Approve release

Activate monitoring

13. HANDOVER REQUIREMENTS

Upon completion, developers must deliver:

All code

Diagram set

Migration scripts

Model routing policies

Render pipeline documentation

Complete test suite

CHANGELOG v1.0

Known issues list

Future roadmap suggestions

14. MAINTENANCE & UPGRADES

Future upgrades (v2+):

Engine 2 cinematic mode

Engine 2 full 3D video generation

Engine 3 audiobook generation

Engine 4 xAPI / TinCan support

AI review assistant

Skills Portal integration

Upgrades require:

New version folders

Full regression

Foreman approval

Documentation updates

15. CHANGE CONTROL

No changes accepted unless:

True North updated

All architecture docs updated

QA updated

Change logged

Foreman approval

✔ END OF COURSE_CRAFTER_IMPLEMENTATION_GUIDE_v1.0.md