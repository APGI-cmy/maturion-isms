COURSE_CRAFTER_TRUE_NORTH_v1.0.md

Maturion Course Crafter – True North Architecture
Version 1.0

Aligned with and superseding:

COURSE_CRAFTER_ARCHITECTURE_v0.1.md 

COURSE_CRAFTER_ARCHITECTURE_v0.1

COURSE_CRAFTER_QA_IMPLEMENTATION_PLAN_v0.1.md 

COURSE_CRAFTER_QA_IMPLEMENTATIO…

0. Purpose

Course Crafter is a full video course factory:
raw course material, PowerPoints, scripts, ideas and reference docs go in →
voice-over videos, explainer videos, books/manuals, and interactive e-learning modules come out.

This True North defines:

The core domain model (projects, courses, units, modules, lessons, scenes, segments, assets)

The four engines (E1–E4) and how they interact

The AI model stack & routing layer

The rendering & asset pipelines

The wizard-style UX (factory line)

The tech constraints for v1 (low-cost, free-tier friendly)

The extension hooks for cinematic and full 3D video later

Integration with Skills Portal, external LMS (e.g. Thinkific), and future Maturion modules

This document is the authoritative reference for Foreman, Builder agents, QA, and future maintainers.

1. High-Level Vision
1.1 What Course Crafter Is

A multi-engine content production plant with a factory metaphor:

Engine 1 – Voice-Over Factory for existing PPT→MP4 lessons

Engine 2 – Video Factory for AI-manufactured branded videos

v1: still images + transitions

v2: cinematic motion

v3: full 3D videos (future)

Engine 3 – Book/Manual Factory for structured learner guides and books

Engine 4 – E-learning Factory for interactive SCORM-style modules

A system that:

Keeps all assets linked (scripts, images, scenes, videos, quiz metadata)

Allows cross-engine reuse (Engine 3 content → Engine 4 interactions, Engine 2 images → Engine 4 visuals)

Feeds directly into Maturion Skills Portal as the backbone of your future LMS.

1.2 What Course Crafter Is Not (v1)

Not a full Thinkific replacement yet, but designed to become one.

Not a real-time game engine (no custom 3D engine; we integrate with external video/3D models).

Not a one-off experiment — it must be sustainable and upgradable.

2. Roles & Users

Course Author (you, subject-matter experts)

Creates projects, uploads material, approves scripts, images, videos

Instructional Designer (could also be you)

Shapes learning outcomes, learner activities, assessment structures

AI Engines (through model gateway)

LLMs: outline, script, prompts, interactions

TTS: voices

Image models: stills, diagrams

Video models: future cinematic & 3D

Foreman

Oversees architecture, QA, monitors pipelines and costs

Builder Agents

Implement backend, frontend, pipeline logic as per this True North

Learners (future)

Consume output via Skills Portal, Thinkific, or external LMS.

3. Domain Model
3.1 Hierarchical Content Structure

We define a strict hierarchy, consistent across all engines:

Project (maps 1:1 to a Course)

Course (alias: Project)

LearningUnit (LU)

Module

Lesson (a single instructional segment, typically one video)

Scene (logical part of the lesson – describes one conceptual chunk)

Segment (technical element for rendering – precise timed voice + visual asset)

Key rules:

Engine 1 & 2 operate mainly at Lesson → Scene → Segment level.

Engine 3 operates at Course → LU → Module → Lesson/Section textual structure.

Engine 4 operates at Module → Lesson → Interaction/Activity.

3.2 Asset Types

SourcePpt – uploaded PPT

SourceMp4 – original MP4 version of PPT

SourceDoc – Word/PDF/notes

SourceWebRef – YouTube links, references

ScriptSegment – generated/approved text for each segment

VoiceTrack – TTS audio per segment or per scene

VisualAsset

StaticImage – PNG/JPEG

AnimatedGif

GeneratedVideoClip

BrandTemplate – background, overlays, logo, colour scheme

VideoRenderJob – final assembly instructions

BookLayout – structured content and image placements

InteractionDefinition – for Engine 4 (quiz, hotspot, timeline, etc.)

All assets are versioned, and cross-referenced with their parent Lesson and Engine.

4. Engine Overview & Interactions
4.1 Engine 1 – Voice-Over Factory

Purpose: Convert existing PPT/MP4 animated lessons into voice-over videos without changing visuals.

Input: PPT + MP4 (same lesson), optional YouTube clips.

Process:

Parse slides and timings from PPT/MP4.

For each segment: extract on-screen text as script.

Sync script to visual timing; allow small timing adjustments.

Generate TTS audio for each segment in selected voice.

Insert YouTube or external video segments where present, with AI-generated intro lines.

Output:

New MP4 with voice-over, same visual structure and animations.

Guarantee:

Text shown in the animation is exactly what is spoken (no paraphrasing).

4.2 Engine 2 – Video Factory

Purpose: Build brand-new explainer videos from raw material.

Three capability tiers (same architecture, different pipelines):

Engine 2 v1 – Stills + Smooth Transitions (CURRENT TARGET)

Input: PPT / DOC / PDF / MP4 / text + context + target audience.

Output: Video composed of static images, text overlays, transitions, TTS voice.

Engine 2 v2 – Cinematic Motion (Future)

Uses cinematic video models, animated scenes, moving camera, etc.

Engine 2 v3 – Full 3D Videos (Future)

Integrates advanced 3D/physics/cinematic models.

Acts more like 3D scene/storyboard generator.

Shared logic:

AI-based course context understanding.

Script drafting per scene.

Image prompt generation per scene.

Generated images (or video clips) consistent with:

branding,

target audience,

cultural appropriateness,

learning outcomes.

Branding layer added (logo, colours, layout).

Video effects & transitions applied.

4.3 Engine 3 – Book/Manual Factory

Purpose: Turn course content into high-quality learner guides and commercial books.

Input: Verified course structure + RA research + SME notes + Engine 2 scripts/images.

Output:

A structured book/manual:

Chapters (LUs)

Sections (Modules)

Subsections (Lessons)

Embedded images

Styled layouts for:

Print-ready PDF (Amazon)

eBook formats

On-platform “reference” view

Key features:

Inline AI editing panel:

“Rewrite this section”

“Add a practical example”

“Suggest an illustration”

Image placement & prompt generation integrated with the same image models used in Engine 2 (asset reuse).

Book becomes canonical textual content for the course → Engine 4.

4.4 Engine 4 – E-learning Factory

Purpose: Build interactive online courses (SCORM-style or equivalent), using content from Engine 3 and assets from Engine 2.

Input: Book/manual content, images, Engine 2 videos, instructions about learner activities & assessment.

Output:

Interactive modules: slides, interactions, activities, quizzes, upload tasks, links to other tools.

SCORM/HTML5 compatible packages for external LMS.

Native content objects for future Maturion Skills Portal.

Interaction types:

Step/Timeline

Circular/cyclic processes

Annotated graphics / hotspots

Hierarchies (pyramids, concentric circles)

Tabs, accordions, catalogues

FAQ, glossary

Embedded videos

Upload areas for assignments

Links to external tools (e.g. Risk Management module)

5. Technical Architecture
5.1 High-Level Components

Frontend

React app with the “Factory” UI:

Top bar: global settings, Watchdog, QA, Foreman chat

Engine tabs: 1–4

Left wizards, right content & preview panes

Backend (APIs & Edge Functions)

Project & content management

Asset storage & referencing

Pipeline orchestration (render jobs, state machines)

AI model gateway calls (LLM, TTS, image, video)

Integration endpoints (Thinkific/export, Skills Portal)

Worker / Rendering Layer

Long-running jobs (video assembly, image generation, book rendering)

Queues for job scheduling & retries

FFMPEG or equivalent for compositing in v1

External APIs for future 3D video rendering

Storage Layer

Object storage for:

Raw uploads

Generated images

Audio tracks

Rendered videos

Book PDFs

SCORM packages

AI Gateway

Single point for LLM, TTS, image, and video model calls

Model routing:

Free tier first

Fallback to secondary models

Upgrade to premium on config

Monitoring & Watchdog

Logs, metrics, costs

Alerts for failed jobs, high costs, long queue times.

6. Engine Workflows (Wizard Steps)
6.1 Engine 1 – Voice-Over (Wizard)

Step 1 – Create Project & Lesson Structure

Define:

Project (Course) name

Learning Units

Modules

Lessons (each lesson = one video)

Structure saved and re-usable across engines.

Step 2 – Contextualise

Free-text course context (learning outcomes, domain).

Optionally upload:

Course outline

Background documents

Stored as project context.

Step 3 – Feed the Beast (Source Uploads)

Upload PPT + MP4 for selected lesson.

Optional: YouTube URLs or other external video references.

Step 4 – Segment & Plan

System:

Parses PPT/MP4 and detects segments:

Scenes where slide content changes.

For each segment:

Extracts on-screen text = script.

Shows thumbnail representing the slide (including GIFs, images).

Estimates duration.

User sees for each segment:

Script text

Thumbnail

Voice-over duration test button (play)

Adjustable timing:

On-screen duration

Gap between segments

For YouTube segments:

Thumbnail + AI-generated intro line.

User actions:

Edit script (if needed – but only superficially; ideally keep identical).

Adjust timings.

Re-order segments if needed (drag & drop).

Approve plan.

Step 5 – Voice Selection & Rendering

Choose:

Voice type (gender, accent, tone)

Pace & energy (calm, energetic, neutral)

Render pipeline triggered:

Generate per-segment audio.

Composite audio with original MP4 visuals using timing plan.

Preview video within app.

If approved:

Save final MP4 to lesson path.

Mark engine 1 complete for this lesson.

6.2 Engine 2 – Video Factory (v1 in detail)

Step 1 – Project & Lesson Setup

Same structure as Engine 1 (reuse).

Step 2 – Context & Target Population

Context fields:

Course level (intro, advanced)

Domain (security, leadership, etc.)

Target region (Africa, global, etc.)

Language (English for now, multi-language later)

Audience: operator / supervisor / manager / exec

Free text notes.

Upload:

PPT / DOCX / PDF / MP4 / notes.

Step 3 – Script & Scene Plan

AI:

Reads all sources + context.

Proposes:

Lesson-level script outline:

Scenes (e.g. scene 1 intro, scene 2 concept, scene 3 example)

Script text for each scene, broken into segments as needed.

User:

Reviews & edits script:

Accept, modify, add, delete scenes

Confirms scene ordering.

Step 4 – Image Prompts & Visual Plan

For each scene:

AI proposes:

Image prompt (e.g. “A high-angle view of a mine security control room, clean and modern, flat illustration style”)

Visual style: simple, flat, semi-realistic etc.

User:

Edits prompt as needed

Clicks “Generate image”

System:

Calls image model

Shows 2–4 variants (configurable)

User selects final image per scene.

Step 5 – Branding Template

User provides or chooses:

Primary & secondary brand colours

Logo upload

Tone: corporate, playful, neutral

Layout preference: left text / right image, etc.

AI generates 2–3 branded templates based on these inputs.

User selects one template for the lesson, with option to override for specific scenes.

Step 6 – Video Assembly Settings

Toggle:

v1: “Stills + smooth transitions” (only option in v1.0)

(Future toggles for cinematic / 3D)

Transition style: fade, slide, zoom, etc.

Text behaviour:

Full-sentence display

Optional word highlighting while reading.

Step 7 – Voice-Over & Preview

Choose voice (similar to Engine 1).

System:

Generates audio per scene.

Composes video via FFMPEG-like pipeline:

Template + branded background

Scene images

Text overlays

Voice audio

Transitions & simple effects.

User:

Previews video

Marks segments for re-render (script, image or both)

Once approved:

Save final MP4

Mark & tag as “Engine 2 v1” asset.

Future v2/v3 (Cinematic & 3D)

Same high-level pipeline, but:

Instead of static images, we call cinematic/3D video models.

New asset type: GeneratedVideoClip.

Assembly for more complex rendering.

6.3 Engine 3 – Book & Manual (Overview)

We don’t need full detail now, but we fix its position:

Input: confirmed course outlines, Engine 2 script & images, extra research.

Output: book/manual with:

Clear headings

Structured chapters

Inline graphics

Space for exercises and notes.

Workflow:

Outline → Draft → SME + AI edit loop → Design → Export (PDF/eBook).

Text and image choices persist as canonical reference for Engine 4.

6.4 Engine 4 – E-learning (Overview)

Takes content from Engine 3 and videos from Engines 1–2.

Adds interactions and activities according to a Learner Activity Specification:

Each outcome → one or more learning activities.

Each activity → interaction type (timeline, hotspot, etc.) + assessment.

Output:

On-platform interactive course

Or SCORM package for external LMS.

7. AI Model Strategy
7.1 Model Types

LLM:

Course outlines, scripts, prompts, interaction design, book structure.

TTS (Text-to-Speech):

Multiple voices, languages later.

Image Generation:

Stills & diagrams (Engine 2 + 3).

Video Generation:

Future video & 3D (Engine 2 v2/v3).

OCR/Parsing:

PPT, PDF, DOCX ingestion.

7.2 Model Routing

Default: low-cost/free-tier models.

Configurable per tenant/project:

“Standard mode” (free/cheap)

“Premium cinematic”

“3D advanced”

Central AI gateway handles:

Provider selection

Rate-limits

Cost tracking

Retries

Fallbacks.

8. Integrations
8.1 Skills Portal (Future Backbone)

Course Crafter will eventually become the authoring backend for the Skills Portal:

Engine outputs define:

Course manifests

Module structures

Resources

Assessments

Skills Portal consumes those, manages:

Enrolment

Tracking

Pathways

Certification.

8.2 External LMS (Thinkific, etc.)

v1 integration is mostly manual:

Export videos & meta (titles, descriptions, durations).

Export quiz blueprints / question banks.

Export SCORM-style packages for interactive courses later.

9. Non-Functional Requirements

Performance:

UI snappy, heavy jobs handled asynchronously.

Resilience:

Job queue with retries; failures logged with detailed context.

Cost Control:

Default pipeline uses cheapest model combination.

Each render logs estimated & actual cost.

Accessibility:

Support subtitles, transcripts, colour contrast rules.

Auditability:

Every AI-generated output has a source record & context snapshot.

10. Watchdog & QA Hooks

Watchdog monitors:

Job failure rates

Render times

Cost trends per project

QA:

Test harnesses per engine:

Input fixtures

Expected structures

No broken references

Regression checks as new models are plugged in.

11. Things We Would Have Missed If We Didn’t Think Hard

These are the points your question implicitly touches: “Is there a better way? Are we missing steps?”

We’ve now explicitly included:

Asset Versioning & Reuse

So Engine 3 & 4 can reuse Engine 2 images and scripts without duplication.

Strict Hierarchy (Course → LU → Module → Lesson → Scene → Segment)

Avoids chaos when we start cross-referencing between engines.

Separation Between “Control” and “Implementation” (borrowed from your risk thinking)

Script, images, layout decisions = “Design”

Render jobs = “Implementation”

Output assets = “Evidence”

Pluggable Model Architecture

So we don’t get stuck to one video or image vendor.

Cost-Aware Design from Day 1

v1 uses simple pipelines you can afford now.

v2/v3 are upgrades, not rewrites.

Skills Portal Integration Path

Ensures we don’t paint ourselves into a corner when we build the portal later.

Pipeline-Oriented Design

Everything is jobs and states, so nothing gets lost or tangled.

12. True North Summary

Course Crafter is now clearly defined as:

A multi-engine factory with:

Strict content hierarchy

Clean asset model

Pluggable AI stack

Clear wizard flows

Built to:

Start small (Engine 1 + Engine 2 v1)

Scale to:

Cinematic & 3D video

Full books

Interactive e-learning

Deep LMS integration

This True North is now stable enough to hand to:

Foreman

Backend Builders

Frontend Builders

QA

Future AI agents.