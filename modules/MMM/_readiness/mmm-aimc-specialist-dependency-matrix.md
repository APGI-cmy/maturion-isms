# MMM ↔ AIMC Specialist Dependency Matrix

**Artifact Type**: Bridge Definition — D1  
**Module**: MMM — Maturity Model Management  
**Status**: BRIDGE-DEFINITION — Pre-Stage-8 readiness input  
**Version**: 1.0.0  
**Date**: 2026-04-17  
**Wave**: mmm-aimc-convergence-bridge-20260417  
**Issue**: maturion-isms#1383  
**Produced By**: mat-specialist (delegated by foreman-v2-agent)  
**IAA Audit Token**: IAA-session-mmm-aimc-convergence-bridge-20260417-PASS  
**Upstream Authority**:  
- `modules/MMM/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.1.0 (17 journeys)  
- `modules/MMM/02-frs/functional-requirements.md` (FR-001–FR-080)  
- `modules/MMM/harvest-map/harvest-map.md` v0.3.0  
- `Maturion/strategy/Maturion_agent_usage_escalation_strategy.md` v2.0.1  

---

## Purpose

This matrix explicitly identifies, for every MMM workflow / feature area derived from the 17 UX journeys, the AIMC service or specialist dependency, the dependency type, ownership boundaries, and the pre- vs post-CL-12c posture.

This is a **bridge-definition artifact only**. It does not claim that any AIMC specialist is implemented or that CL-12c integration is active.

---

## Column Definitions

| Column | Meaning |
|--------|---------|
| **MMM Workflow / Feature Area** | The named MMM workflow or feature, with journey reference |
| **Consuming Stage / Artifact Ref** | Where in the MMM artifact chain this is governed |
| **AIMC Service / Specialist Dependency** | The AIMC endpoint or specialist function required |
| **Dependency Type** | advisory / draft-assist / structured-recommendation / gated / live-runtime |
| **Ownership** | MMM-owned / AIMC-owned / KUC-owned / PIT-owned / shared-by-contract |
| **Pre-CL-12c Allowed Posture** | What MMM may assume before live AIMC integration is lawful |
| **Post-CL-12c Expected Posture** | What MMM expects when CL-12c integration is live |
| **Human-Approval Requirement** | Per strategy §8 H-class (H-1 through H-4) |
| **Notes / Forward Dependency** | Open items, forward dependencies, constraints |

---

## Dependency Matrix — All 17 UX Journeys

| # | MMM Workflow / Feature Area | Journey Ref | Consuming Stage / Artifact Ref | AIMC Service / Specialist Dependency | Dependency Type | Ownership | Pre-CL-12c Allowed Posture | Post-CL-12c Expected Posture | Human-Approval Requirement | Notes / Forward Dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Landing & attraction — static content display | J-01 | UX §2; FRS FR-001 | None — no AI interaction required | None | MMM-owned | No AI dependency; static/CMS content | Same | None | No AIMC dependency in J-01 |
| 2 | Free assessment — response collection | J-02 (steps 3.1–3.5) | UX §3; FRS FR-002–FR-005 | None for data collection | None | MMM-owned | Offline safe; no AIMC required for submission | Same | None | Assessment data persisted locally before AIMC call |
| 3 | Free assessment — AI interpretation of result | J-02 (step 3.5 AI interpret) | UX §3 wiring; FRS FR-005; Architecture §A6.1 | `POST /api/ai/assessment-interpret` → AIMC (assessment-interpret specialist) | structured-recommendation | AIMC-owned (routing); MMM-owned (display + gate) | Fallback: display raw result without AI interpretation if AIMC unavailable (circuit breaker) | Live AIMC interpretation; displayed as H-3 advisory to user | H-3: recommendation — human confirms interpretation | Strategy §8.6: assessment-interpret = H-3. Circuit breaker per TRS TR-009. |
| 4 | Subscription & sign-up | J-03 | UX §4; FRS FR-006–FR-008 | None — auth provider only | None | MMM-owned (auth via Supabase Auth) | No AIMC dependency | Same | None | No AI in subscription flow |
| 5 | Organisation onboarding — context capture | J-04 (steps 5.1–5.6) | UX §5; FRS FR-009–FR-012 | None for data capture; context stored for AI use in J-07 | None (data capture only) | MMM-owned | No AIMC required; context persisted for later use | Same | None | Org context is AIMC input pre-condition for J-07 |
| 6 | Framework-origin fork decision | J-05 | UX §6; FRS FR-013 | None | None | MMM-owned | No AIMC dependency | Same | None | Fork decision is client-side; no AI |
| 7 | Verbatim upload — KUC ingestion (Mode A) | J-06 (steps 7.1–7.2) | UX §7; FRS FR-014–FR-016; Harvest MT-01 | `POST /api/upload/framework-source` → KUC | live-runtime | KUC-owned (ingestion); MMM-owned (upload trigger) | Pre-CL-12c: KUC must be independently operational; MMM cannot stub this call | KUC live and operational; document stored and classified | None (upload/storage — no AI gate at this step) | LG-02 harvest row: KUC is canonical owner. CL-3.5 RESOLVED confirms KUC readiness path. |
| 8 | Verbatim upload — AI framework parsing (Mode A) | J-06 (steps 7.3–7.7) | UX §7; FRS FR-016–FR-021; Architecture §A6.1 | `POST /api/ai/framework-parse` → AIMC (framework-parse specialist) | draft-assist | AIMC-owned (parsing); MMM-owned (review gate + compile) | Pre-CL-12c: No live AIMC call allowed. Parsed preview must be human-authored or deferred. | AIMC live; parsed structure returned; MMM presents for human review before compile | H-2: draft-assist — human must review all parsed output before compile | Strategy §8.3: H-2 rules. No hallucination rule (App Desc §12.3). MT-01 harvest row. Requires CL-12c before live. |
| 9 | New criteria creation — AI framework generation (Mode B) | J-07 | UX §8; FRS FR-022–FR-030; Harvest LG-01 | `POST /api/ai/framework-generate` → AIMC (framework-generate specialist) | draft-assist | AIMC-owned (generation); MMM-owned (review + compile gate) | Pre-CL-12c: No live AIMC call. Framework generation unavailable or deferred; human-manual entry only. | AIMC live; full Domain→MPS→Criteria structure generated; MMM presents each level for review | H-2: draft-assist — human reviews each domain, MPS, criteria before compile | Strategy §8.3. AI altering mechanism via `framework-alter` also H-2. LG-01 harvest: Redesign at destination. |
| 10 | Framework alteration (edit/recompile within J-07) | J-07 (AI alter mechanism) | UX §8.8; FRS FR-029; Architecture §A6.1 | `POST /api/ai/framework-alter` → AIMC (framework-alter specialist) | draft-assist | AIMC-owned (alteration); MMM-owned (gate) | Pre-CL-12c: Alter unavailable; user edits directly | AIMC live; altered output presented as new draft | H-2: draft-assist | Strategy §8.6. Applies per domain, MPS, criteria level. |
| 11 | Framework review & approval — three-tier workflow | J-08 | UX §9; FRS FR-031–FR-036; Harvest RR-04 | No AIMC call in approval workflow itself; AI input already gated in J-06/J-07 | None (governance workflow) | MMM-owned | No AIMC dependency in approval workflow | Same | Human approval mandatory at each tier (governance, not AI gate) | Approval workflow is MMM-governed per RR-04 (Adopt as-is). No AI in approval steps. |
| 12 | Publication & activation | J-09 | UX §10; FRS FR-037–FR-039; Harvest RR-06 | None | None | MMM-owned | No AIMC dependency | Same | None | Dashboard activation is MMM-internal; no AI required |
| 13 | Criterion drill-down — evidence evaluation | J-10 (AI evaluation step) | UX §11; FRS FR-043–FR-047; Harvest MT-03, MT-04 | `POST /api/ai/evidence-evaluate` → AIMC (evidence-evaluate specialist) | structured-recommendation | AIMC-owned (evaluation); MMM-owned (confirm/override gate) | Pre-CL-12c: No live AIMC evaluate. Manual scoring only; human assigns score directly. | AIMC live; score proposal returned; human confirms or overrides | H-3: recommendation — human must confirm before maturity_scores record created | Strategy §8.4: H-3 rules H-3-04 bars auto-approval. MT-03/MT-04 harvest rows. |
| 14 | Criterion drill-down — KUC evidence upload | J-10 (upload step 11.4) | UX §11 wiring; FRS FR-040–FR-042; Harvest MT-03 | `POST /api/upload/evidence` → KUC | live-runtime | KUC-owned (ingestion); MMM-owned (upload trigger) | Pre-CL-12c: KUC must be independently live. MMM cannot stub upload. | KUC live; evidence stored with evidence metadata | None (storage step; AI evaluation is separate) | LG-02 + evidence-source ingestion path. Framework-source vs evidence-source distinction per harvest map §Ingestion. |
| 15 | Audit workbench / walkabout — offline evidence capture | J-11 | UX §12; FRS FR-048; TRS TR-039–TR-042; Harvest MT-02, MT-05 | `POST /api/ai/evidence-evaluate` → AIMC (batch evaluate on sync) | structured-recommendation | AIMC-owned (batch eval); MMM-owned (sync trigger + gate) | Pre-CL-12c: Offline capture works without AIMC. Batch AI evaluation deferred until AIMC live. Human scores manually. | AIMC live; batch evaluation on sync reconnect; score proposals reviewed by human | H-3 for each score proposal post-sync | TRS TR-039–TR-042: CONNECTIVITY-REQUIRED with Queue-and-Sync. OQ-001 resolved. MT-02/MT-05 harvest rows. |
| 16 | Findings & recommendations — AI recommendation | J-12 (step 13.3) | UX §13; FRS FR-049–FR-051; Harvest MT-06 | `POST /api/ai/recommend` → AIMC (recommend specialist) | structured-recommendation | AIMC-owned (recommendation); MMM-owned (accept/modify/reject gate) | Pre-CL-12c: No live AI recommend. Findings created manually; recommendations written by human. | AIMC live; recommendation returned for each finding; human accepts/modifies/rejects | H-3: recommendation — human must decide before recommendation becomes active | Strategy §8.4 H-3-03: rejected recommendations recorded in audit trail. MT-06 harvest row. |
| 17 | Output fork — Report generation | J-13 | UX §14; FRS FR-052–FR-055; Harvest MT-07 | No AIMC call at report generation step; AI inputs already gated in upstream journeys | None (report service) | MMM-owned | No AIMC dependency at report step | Same | None | Report derives from the shared findings model (App Desc §19.1). |
| 18 | Output fork — PIT export | J-14 | UX §15; FRS FR-049, FR-054; Harvest RR-07 | None for export itself; PIT is a separate system | None (boundary contract) | MMM-owned (export); PIT-owned (import + execution) | No AIMC dependency in export workflow | Same | Human confirms export before send | MMM→PIT interface contract: POST /api/pit-export/:id/send. FRS FR-049/FR-054. Harvest RR-07. |
| 19 | Live dashboard — scoring & display | J-15 | UX §16; FRS FR-056–FR-060; Harvest RR-05, RR-06 | No direct AIMC call at dashboard display; scores derived from confirmed maturity_scores | None (read layer) | MMM-owned | No AIMC dependency in dashboard display | Same | None | Dashboard consumes confirmed scores only (already H-3 gated in J-10/J-11). Scoring engine RR-05 (Adapt). |
| 20 | Roles, invitations & permissions | J-16 | UX §17; FRS FR-061–FR-064; Harvest RR-08 | None | None | MMM-owned | No AIMC dependency | Same | None | Pure governance/auth workflow. RR-08 harvest row. |
| 21 | AI interactions — contextual chat | J-17 (18.1, 18.4) | UX §18; FRS FR-065–FR-068; Architecture §A6.1 | `POST /api/ai/chat` and `POST /api/ai/explain` → AIMC (chat/explain specialists) | advisory | AIMC-owned (response); MMM-owned (display) | Pre-CL-12c: Chat/explain unavailable or stub response. Graceful degradation required. | AIMC live; chat and explain return H-1 informational responses; displayed directly | H-1: informational — no approval gate; may display directly | Strategy §8.2 H-1-01: still passes Guardian gate. Strategy §8.6. |
| 22 | AI interactions — tutorial system | J-17 (18.2–18.4) | UX §18; App Desc §14.5 | Pre-loaded static help content; `POST /api/ai/explain` for guided mode | advisory (guided) | MMM-owned (static help); AIMC-owned (explain) | Pre-CL-12c: Static help works without AIMC; guided "Ask Maturion" deferred | AIMC live; guided explanation via explain endpoint | H-1: informational | Hover/click help is static MMM content. "Ask Maturion" routes via AIMC. |

---

## Dependency Type Definitions

| Type | Meaning |
|------|---------|
| **advisory** | AIMC provides H-1 informational output; MMM displays without approval gate |
| **draft-assist** | AIMC provides H-2 draft content; MMM must present for human review before persisting as active |
| **structured-recommendation** | AIMC provides H-3 recommendation; MMM must gate with explicit human approval before activating |
| **gated** | AIMC provides H-4 operational output; hard gate mandatory — may not auto-activate downstream effects |
| **live-runtime** | Non-AI service dependency (KUC) required at runtime; AIMC is not the actor but the downstream AIMC call depends on this step |
| **None** | No AIMC dependency in this feature area |

---

## AIMC Endpoint Summary

| AIMC Endpoint | Journeys Using It | Dependency Type | H-Class |
|---|---|---|---|
| `POST /api/ai/assessment-interpret` | J-02 | structured-recommendation | H-3 |
| `POST /api/ai/framework-parse` | J-06 (Mode A) | draft-assist | H-2 |
| `POST /api/ai/framework-generate` | J-07 (Mode B) | draft-assist | H-2 |
| `POST /api/ai/framework-alter` | J-07 (AI alter) | draft-assist | H-2 |
| `POST /api/ai/evidence-evaluate` | J-10, J-11 | structured-recommendation | H-3 |
| `POST /api/ai/recommend` | J-12 | structured-recommendation | H-3 |
| `POST /api/ai/chat` | J-17 | advisory | H-1 |
| `POST /api/ai/explain` | J-17 | advisory | H-1 |
| `POST /api/upload/*` → KUC | J-06, J-10, J-11 | live-runtime | N/A (KUC) |

---

## Ownership Summary

| Ownership Category | Applies To |
|---|---|
| **MMM-owned** | All display, gate enforcement, fallback handling, persistence decisions, PIT export, approval workflows |
| **AIMC-owned** | Provider selection, specialist routing, validation gates, knowledge source management, AI governance |
| **KUC-owned** | Document upload, ingestion, storage, classification (within AIMC scope) |
| **PIT-owned** | Implementation plan import, plan execution lifecycle |
| **shared-by-contract** | MMM→AIMC API boundary (frozen in Architecture §A6.1); MMM→PIT interface contract (FRS FR-049/FR-054) |

---

## Pre-CL-12c vs Post-CL-12c Posture Summary

| Feature Area | Pre-CL-12c Allowed Posture | Post-CL-12c Expected Posture |
|---|---|---|
| Static content, approval workflows, dashboard, PIT export, auth | Fully operational — no AIMC dependency | Same |
| KUC upload (framework-source, evidence) | KUC must be independently live; MMM calls KUC directly | Same (KUC remains independent of CL-12c) |
| AI chat, explain (H-1) | Unavailable or graceful degradation; static help only | Live; H-1 responses displayed directly |
| AI assessment-interpret, evidence-evaluate, recommend (H-3) | Unavailable; human manual scoring/recommendation | Live; proposals gated by H-3 human confirmation |
| AI framework-parse, framework-generate, framework-alter (H-2) | Unavailable; human-manual framework entry only | Live; draft output gated by H-2 human review |

---

**Document Control**  
This is a bridge-definition artifact (D1 of 5). It does not claim Stage 8 has started, Stage 5/6/7 are CS2-approved, or that CL-12c integration is currently lawful.
