# MMM Document Control Baseline

**Version**: 1.0.0  
**Date**: 2026-04-13  
**Status**: ACTIVE  
**Authority**: CS2 (Johan Ras / @APGI-cmy) via maturion-isms#1358  
**Produced By**: foreman-v2-agent (session-mmm-doc-normalization-20260413)  
**Last Updated By**: foreman-v2-agent (wave: mmm-doc-normalization, issue #1358)

---

## Purpose

This document establishes the canonical classification of all MMM pre-build documents and
defines the maintenance protocol that applies after every future MMM issue, wave, or approval.

It replaces the previous implicit document hierarchy with an explicit, maintained, and
enforceable classification. This ensures:

1. CS2 knows exactly which documents to monitor for live MMM progress
2. Foreman and builders know which documents must be updated after each wave
3. Stale content is treated as a governance defect
4. Historical and reference documents are clearly distinguished from live control documents

---

## Document Classification

### Category Definitions

| Category | Meaning | Update Required? |
|----------|---------|-----------------|
| **Live Control Document** | Actively governs current MMM state. Must be updated immediately after every stage change, wave completion, or approval. Stale content in a live control document is a governance defect. | YES — mandatory after every MMM issue |
| **Live Specification Artifact** | Contains the formal specification for a completed or in-progress stage. Updated only when the specification itself is amended. Read during FRS/TRS derivation. | ONLY when specification is amended |
| **Historical Traceability** | Records decisions, closure notes, or outcomes that are complete and unlikely to change. Retained for audit trail and derivation traceability. Not updated unless an error is discovered. | ONLY if factual error found |
| **Reference Strategy** | Strategic vision and intent documents. Inform design decisions but do not directly control operational sequencing. Updated only on CS2 direction. | ONLY on CS2 direction |
| **Ongoing Improvement Tracker** | Contains improvement items and prerequisite waves that are tracked independently of MMM stage progression. Updated when improvement items are completed. | YES — when tracked items change |

---

### MMM Document Registry

| Document | Path | Category | Primary Monitor | Notes |
|----------|------|----------|----------------|-------|
| **BUILD_PROGRESS_TRACKER.md** | `modules/MMM/BUILD_PROGRESS_TRACKER.md` | **Live Control Document** | CS2 | **PRIMARY** — This is the main live progress dashboard. Must be updated after every MMM stage issue, wave completion, or approval. |
| **UX Workflow & Wiring Spec** | `modules/MMM/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` | **Live Specification Artifact** | CS2 (review) / Foreman (derivation) | Stage 2 output. Feeds FRS/TRS derivation. Current version v0.1.0 (produced 2026-04-13, pending CS2 approval). |
| **Harvest Map** | `modules/MMM/harvest-map/harvest-map.md` | **Live Control Document** | CS2 / Foreman | Convergence control artifact. Must be updated when capabilities transition states (ACTIVE_SOURCE → PARALLEL_RUN → etc.) or when open questions are answered. Current version v0.2.1. |
| **MMM Strategy** | `modules/MMM/MMM_strategy.md` | **Reference Strategy** | CS2 | Strategic vision document (v0.1.0, DRAFT). Informs design decisions. Not directly updated by wave work unless CS2 directs a strategy revision. |
| **App Description** | `modules/MMM/00-app-description/MMM_app_description.md` | **Live Specification Artifact** | CS2 | Stage 1 output. CS2-approved (v0.5.0, #1298, 2026-04-08). Stage 1 FORMALLY CLOSED. |
| **LKIAC Carry-Over Closure Note** | `modules/MMM/_readiness/lkiac-carryover-closure-note.md` | **Historical Traceability** | N/A | Records CL-3.5 and CL-13 carry-over resolution (v1.0.0, 2026-04-13). Complete — no further updates expected unless a new LKIAC carry-over is discovered. |
| **Pre-MMM Upgrade Strategy** | `Maturion/strategy/PRE_MMM_IMPLEMENTATION_UPGRADE_STRATEGY.md` | **Ongoing Improvement Tracker** | CS2 / Foreman | Mixed-role document: the original Stage 2 gating content is now retained as historical traceability, but this registry classifies it by its still-active function as the tracker for remaining PS-waves (PS-C, PS-D, PS-E, PS-G, PS-H, PS-I). Update only the outstanding improvement items/status; do not revise the fulfilled gating history except to correct factual errors. Version v1.1.0. |
| **This Document** | `modules/MMM/_readiness/mmm-document-control-baseline.md` | **Live Control Document** | CS2 / Foreman | Document classification and maintenance protocol. Updated when documents are reclassified or when the maintenance protocol is amended. |

---

## CS2 Monitoring Recommendation

CS2 should primarily monitor these documents for live MMM progress:

1. **`BUILD_PROGRESS_TRACKER.md`** — Primary dashboard. Shows current stage, blockers, next steps, and governance compliance.
2. **`harvest-map/harvest-map.md`** — Convergence control. Shows capability ownership, source-state transitions, and open questions.
3. **This document** (`mmm-document-control-baseline.md`) — Meta-control. Shows which documents are live vs historical.

For stage specification review:
- Review `ux-workflow-wiring-spec.md` (Stage 2) before approving Stage 2
- Review FRS when Stage 3 is produced
- Review TRS when Stage 4 is produced

---

## Mandatory Questions — Answers

Per maturion-isms#1358, the following questions are explicitly answered:

### 1. Which MMM documents are the live operational source of truth right now?

- `BUILD_PROGRESS_TRACKER.md` — stage progress, blockers, next steps
- `harvest-map/harvest-map.md` — convergence control, capability ownership
- `mmm-document-control-baseline.md` — document classification and maintenance protocol

### 2. Which MMM documents are now partially stale but still useful as traceability records?

- `lkiac-carryover-closure-note.md` — complete and current, but historical (no further updates expected)

### 3. Which blocker sections are superseded by current MMM progress?

- `PRE_MMM_IMPLEMENTATION_UPGRADE_STRATEGY.md` Section 2 blockers BLK-1/2/3/5/6 are all ✅ RESOLVED
- BLK-4 remains ⏳ OPEN but is non-blocking for MMM stage progression
- The document's primary gating purpose (blocking Stage 2) has been fulfilled

### 4. Which document should CS2 use as the main live progress monitor?

- **`BUILD_PROGRESS_TRACKER.md`** — This is the designated primary live control document

### 5. What exact update rule should apply after every future MMM issue?

- See §Document Maintenance Protocol below

### 6. Which MMM documents must be updated as a mandatory part of every future stage closure or approval?

- `BUILD_PROGRESS_TRACKER.md` — ALWAYS
- `harvest-map/harvest-map.md` — when capability state transitions or open questions are affected
- `mmm-document-control-baseline.md` — when document roles change
- The relevant stage specification artifact — when the stage specification is produced or amended

---

## Document Maintenance Protocol

### Update Rule

Every MMM issue (stage issue, wave, approval, or readiness change) MUST update the relevant
live control documents before the issue can be considered complete. Specifically:

| Event | Documents to Update | Mandatory? |
|-------|--------------------|-----------|
| **Stage completion / production** | `BUILD_PROGRESS_TRACKER.md` — update stage status, completion date, notes | YES |
| **Stage CS2 approval** | `BUILD_PROGRESS_TRACKER.md` — update approval date, approved-by, next steps | YES |
| **Wave completion** | `BUILD_PROGRESS_TRACKER.md` — if stage status changed | YES |
| **Blocker resolved** | `BUILD_PROGRESS_TRACKER.md` — update blockers section | YES |
| **Open question answered** | `harvest-map/harvest-map.md` — update OQ register | YES |
| **Capability state transition** | `harvest-map/harvest-map.md` — update source-state column | YES |
| **Document role change** | `mmm-document-control-baseline.md` — update registry | YES |
| **Readiness/closure change** | Relevant readiness document + `BUILD_PROGRESS_TRACKER.md` | YES |

### Enforcement Mechanism

1. **Every MMM issue MUST state which live control documents were updated** in the issue
   resolution or PREHANDOVER proof.
2. **No MMM stage may be considered complete** until the designated live documents have been
   updated to reflect the new state.
3. **Stale tracker/state text must be treated as a governance defect** — identified during
   the next Foreman wave and corrected immediately.
4. **The Foreman is responsible** for enforcing this update discipline during every MMM
   POLC-Orchestration wave.

### Traceability

Each update to a live control document MUST include:
- The wave or issue reference that triggered the update
- The date of the update
- The agent or person who made the update

This ensures auditability and prevents undocumented changes.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-13 | Initial document classification baseline created per maturion-isms#1358. All MMM documents classified. Maintenance protocol established. |

---

*Authority: CS2 (Johan Ras / @APGI-cmy) | Issue: maturion-isms#1358*  
*Produced: 2026-04-13 | Status: ACTIVE*  
*Wave: mmm-doc-normalization | Session: session-mmm-doc-normalization-20260413*
