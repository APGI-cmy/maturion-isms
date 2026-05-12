# PIT — App Description → Architecture Traceability

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | Traceability Matrix — App Description § AD-01–AD-24 → Architecture |
| Version | v1.0 |
| Status | **COMPLETE** |
| Derived From | `modules/pit/00-app-description/app-description.md` v1.0 (CS2 Approved 2026-05-06, ref: maturion-isms#1540) |
| Architecture Artifact | `modules/pit/04-architecture/architecture.md` v1.0 (Stage 5, maturion-isms#1611) |
| Author | foreman-v2-agent (POLC-Orchestration mode) |
| Date | 2026-05-12 |
| Issue | maturion-isms#1611 — PIT Stage 5 Architecture reconciliation |
| Authority | `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.1.0 |

> **Governance Notice**: This traceability matrix satisfies the Stage 5 Architecture gate requirement to demonstrate full coverage of all App Description mandatory sections (§AD-01–§AD-24) by the Stage 5 Architecture artifact. Merge of Stage 5 Architecture remains blocked until CS2 gate-passes this package. Build Authorization remains **NOT CLEARED**.

---

## 1. Coverage Matrix — §AD-01 through §AD-24

**Allowed status values**:
- `COVERED` — Architecture explicitly addresses the AD requirement
- `NOT_APPLICABLE_WITH_JUSTIFICATION` — AD requirement does not apply at Stage 5 architecture gate
- `BLOCKING_GAP` — Architecture does not address the AD requirement and must be fixed before merge

| §AD ID | App Description Requirement | Architecture Coverage Section/Artifact | Status | Notes / N/A Justification |
|---|---|---|---|---|
| §AD-01 | Build Lifecycle Stages — PIT build must follow the canonical 12-stage model in order | `architecture.md` §0 (Document Purpose and Derivation Statement), §25 (Build Authorization Statement), Stage 5 status header | COVERED | Architecture is Stage 5 artifact produced in order. §25 explicitly states Build Authorization NOT CLEARED; Stage 6 blocked until CS2 gate-pass. Derivation chain from Stages 1–4 is declared in §0 and status header. |
| §AD-02 | Requirements Derivation Chain — architecture must derive from App Description → UX → FRS → TRS → Architecture in order, with "Derived from" statements | `architecture.md` §0, status header (Derived From rows for Stages 1–4) | COVERED | §0 contains explicit derivation statement: derived from App Description v1.0, UX Wiring Spec v0.2 (CS2 re-confirmed), FRS v0.2-hardened (CS2 re-confirmed), TRS v0.2-draft (CS2 approved maturion-isms#1604). `trs-to-architecture-traceability.md` provides full TRS → Architecture mapping for all 126 requirements. |
| §AD-03 | Technology Stack — baseline technology/pattern established; TRS responsible for final versions and deployment constraints | `architecture.md` §1 (Runtime and Tech Stack Architecture) | COVERED | §1 confirms: React 18 + TypeScript (SPA), Supabase (PostgreSQL + Auth + Edge Functions + Storage), Vercel (deployment). §1.3 records architecture decisions confirmed at Stage 5. |
| §AD-04 | Deliverable Artifacts — all deliverable artifacts for each stage are defined | `architecture.md` §25 (Build Authorization Statement), `stage5-architecture-reconciliation.md` | COVERED | Stage 5 artifacts are: `architecture.md`, `stage5-architecture-reconciliation.md`, `trs-to-architecture-traceability.md`, `timeline-engine-architecture-decision.md`, and this matrix. `stage5-architecture-reconciliation.md` §7 lists all artifacts with status. |
| §AD-05 | Component Definition of Done — each component must meet the DoD before handover | `architecture.md` §21 (Quality Gate Architecture) | COVERED | §21 defines hard gates and quality criteria that must be satisfied before Stage 6 (QA-to-Red) can proceed. No component is treated as done until CS2 gate-pass of Stage 5. |
| §AD-06 | Test-First Guarantee — QA-to-Red must be produced before any build begins; testing cannot follow implementation | `architecture.md` §21 (Quality Gate Architecture), §25 (Build Authorization Statement) | COVERED | §21 explicitly states QA-to-Red (Stage 6) is the next required stage. §25 states Build Authorization NOT CLEARED. Architecture defines QA hooks in §10.11 (Timeline QA Hooks) and §16 (QA Dashboard Architecture) to enable QA-to-Red derivation. |
| §AD-07 | Physical Verification Gate — architecture must be verifiable through CI and physical inspection | `architecture.md` §21, `stage5-architecture-reconciliation.md` §1–§7 | COVERED | Stage 5 reconciliation checklist in `stage5-architecture-reconciliation.md` covers 6 verification dimensions: scope boundary, derivation, requirement coverage, assumption resolution, artifact completeness, and gate readiness. All items verified. |
| §AD-08 | PBFAG Checklist Requirements — architecture must address PBFAG pre-conditions | `architecture.md` §21 (Quality Gate Architecture) | COVERED | §21.3 states PBFAG is Stage 7 (blocked until Stages 5–6 are CS2-approved). Architecture includes PBFAG-relevant sections: RLS (§7), Auth (§4), API contracts (§8), deployment (§19), accessibility (§20). Stage 6 QA-to-Red will derive PBFAG pre-conditions from this architecture. |
| §AD-09 | Agent Authority Chain — agent/system responsibilities and authority boundaries must be defined | `architecture.md` §22 (MMM Carry-Forward Controls Architecture), §9 (AIMC Integration Architecture) | COVERED | §9 defines zero-tolerance AIMC gateway enforcement and human approval contracts. §22 carries forward MMM controls including POLC boundary and build authorization chain. Build authorization authority chain is explicit: App Description → Stage 5 Architecture → CS2 gate-pass → Stage 6. |
| §AD-10 | Schema-to-Hook Validation — schema tables must be hookable for UI state and validation | `architecture.md` §6 (Data Model Architecture), §8 (API and Edge Function Architecture) | COVERED | §6 defines all 13 confirmed tables with relationships and referential integrity. §8 defines API layer boundaries ensuring schema access is through Supabase client + typed Edge Functions. All tables have RLS (§7). Hook patterns derive from schema definitions. |
| §AD-11 | Table Pathway Audit — all data pathways from UI to DB must be traceable | `architecture.md` §6 (Data Model), §7 (RLS), §8 (API/Edge Functions), §3 (Routing) | COVERED | Full pathway: Route (§3) → ProtectedRoute auth check (§3.2) → Supabase client SDK query (§8.1) → RLS filter (§7) → DB table (§6). All 13 tables are covered. Edge Functions provide server-side pathway for complex operations (§8.2). |
| §AD-12 | RLS Audit Gate — all tables must have RLS enabled; architecture must define RLS policy patterns | `architecture.md` §7 (RLS Policy Architecture) | COVERED | §7 is dedicated entirely to RLS. §7.1 states: RLS enabled on all tables is a hard gate with zero exceptions. §7.2 provides org-scoped RLS policy pattern for all 13 tables. RLS test coverage is a QA gate (§21). |
| §AD-13 | Auth Wiring Checklist — authentication wiring from UI to Supabase Auth must be explicit | `architecture.md` §4 (Authentication Architecture), §5 (Role and Access Control Architecture) | COVERED | §4 defines full auth flow: Supabase Auth → session store → AuthContext → ProtectedRoute guard. §5 defines role storage (profiles table), navigation gating, and permission-denied pattern. Auth wiring covers login, logout, session persistence, and role-based access. |
| §AD-14 | AI Integration Requirements — AI capability integration points and constraints must be defined | `architecture.md` §9 (AIMC Integration Architecture) | COVERED | §9 defines 4 architecture subsections: zero-tolerance gateway enforcement, AIMC proxy pattern, human approval contract (PIT-TR-054), and AIMC capability map (PIT-TR-053). All AI operations must pass through AIMC gateway. No direct AI API calls from PIT UI. |
| §AD-15 | Edge Function Registry — all Edge Functions must be catalogued with triggers and responsibilities | `architecture.md` §8.2 (Edge Function Catalogue) | COVERED | §8.2 lists all 10 confirmed Edge Functions with name, trigger, and purpose: `validate_invitation`, `accept_invitation`, `generate_report`, `watchdog_evaluation`, `send_notification_email`, `compute_progress_rollup`, `pit-task-advisor`, `pit-portfolio-risk`, `pit-escalation-advisor`, and `pit-report-summary`. Each has defined route, auth requirement, and purpose. |
| §AD-16 | Deployment Wave — deployment target, platform, and constraints must be explicit | `architecture.md` §19 (Deployment and Runtime Architecture) | COVERED | §19 is the dedicated deployment section. Declares Vercel as deployment target (A-009 closed/binding), Vite build configuration (React SPA), environment variables, CI/CD pipeline, and zero-downtime deployment architecture. Platform constraints (serverless, 50 MB evidence limit) are explicit. |
| §AD-17 | Secret Naming Convention — secrets and environment variables must follow a defined naming convention | `architecture.md` §19 (Deployment and Runtime Architecture) | COVERED | §19 includes environment variable architecture with Supabase URL/anon key and AI service credentials. All client-side secrets follow Vite environment variable pattern (`VITE_*` for client-side, standard for server-side/Edge Function). |
| §AD-18 | Deployment Runbook — the steps to deploy must be documented at architecture level | `architecture.md` §19 (Deployment and Runtime Architecture) | COVERED | §19 defines deployment pipeline: branch push → Vercel preview deployment → CS2 approval → production deployment. Zero-downtime pattern via Vercel atomic deployments (React SPA + Vite build). Rollback via Vercel instant rollback. Stage 6 QA-to-Red will derive detailed deployment test cases from this architecture. |
| §AD-19 | Notification / UX Patterns — notification and UX feedback patterns must be defined | `architecture.md` §12 (Notification System Architecture), §2.2 (Five-State UI Contract) | COVERED | §12 defines notification architecture: real-time via Supabase Realtime subscriptions, email via Edge Function, in-app notification centre. §2.2 (L-003) defines five-state UI contract: Loading / Empty / Populated / Error / No-Permission across all screens. |
| §AD-20 | Shared State Architecture — shared/global state management must be defined | `architecture.md` §2.1 (Root Provider Hierarchy), §2.2 (Five-State UI Contract) | COVERED | §2.1 defines the full React Context provider hierarchy: `AuthContext` → `OrgContext` → `ProjectContext` → `NotificationContext`. Context boundaries and consumption patterns are defined. No ad-hoc global state outside provider hierarchy. |
| §AD-21 | API Authentication — all API endpoints must use authenticated patterns; unauthenticated access is prohibited | `architecture.md` §4 (Authentication Architecture), §7 (RLS), §8 (API and Edge Function Architecture) | COVERED | §8.1 defines API layer boundary: all Supabase client calls carry the user's JWT automatically. RLS (§7) enforces org-scoped access at DB level. Edge Functions (§8.2) verify session JWT before execution. No unauthenticated API endpoint exists. |
| §AD-22 | Audit Log Design — all state-changing operations must produce an audit log entry | `architecture.md` §15 (Audit Log Architecture), §8.3 (Audit Insert Pattern) | COVERED | §15 defines the `audit_log` table and insert pattern for all state-changing operations. §8.3 defines the Edge Function audit insert contract (PIT-TR-049). Audit covers project/milestone/deliverable/task CRUD, status changes, evidence uploads, and permission changes. |
| §AD-23 | Tracker Update Requirement — the Build Progress Tracker must be updated at each stage gate | `modules/pit/BUILD_PROGRESS_TRACKER.md` Stage 5 section | COVERED | `BUILD_PROGRESS_TRACKER.md` is updated for Stage 5: §5 Architecture row reflects RECONCILIATION_COMPLETE / READY_FOR_CS2_REVIEW. All Stage 1–4 rows show CS2-approved/re-confirmed status. Next action: CS2 review and gate-pass, then Stage 6 begins. |
| §AD-24 | State Persistence Specification — how state persists across sessions and page reloads must be defined | `architecture.md` §2.1 (Root Provider Hierarchy), §6 (Data Model Architecture) | COVERED | §2.1 defines session persistence via Supabase Auth session (localStorage by default). Application state persists in Supabase PostgreSQL (§6) — all projects, milestones, deliverables, tasks, evidence, and audit logs are durable. Context is re-hydrated from DB on mount. No ephemeral state is relied upon across page reloads. |

---

## 2. Summary

| Status | Count |
|---|---|
| COVERED | 24 |
| NOT_APPLICABLE_WITH_JUSTIFICATION | 0 |
| BLOCKING_GAP | 0 |
| **Total** | **24** |

**All 24 §AD requirements are COVERED. No blocking gaps.**

---

## 3. Coverage Confidence Assessment

Each §AD requirement is addressed either:
- **Directly** by a named architecture section (§1–§25 of `architecture.md`), or
- **Indirectly** through cross-artifact coverage (`stage5-architecture-reconciliation.md`, `trs-to-architecture-traceability.md`, `timeline-engine-architecture-decision.md`, `BUILD_PROGRESS_TRACKER.md`)

No §AD requirement relies on a future stage artifact. All coverage is available in the Stage 5 package committed under PR #1612 (governing issue maturion-isms#1611).

---

## 4. Gate Readiness

- [x] All §AD-01–§AD-24 rows populated
- [x] No BLOCKING_GAP rows
- [x] Cross-reference to architecture sections is specific (section number cited)
- [x] Coverage is traceable without interpretation
- [x] Build Authorization remains NOT CLEARED pending CS2 gate-pass

**This matrix satisfies the Stage 5 Architecture gate requirement for App Description → Architecture coverage.**

---

*Authority: `governance/canon/ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` v1.4, `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.1.0*
*Governance: CS2 (Johan Ras / @APGI-cmy) — Issue: maturion-isms#1611*
