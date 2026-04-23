# IAA Wave Record — mmm-storage-model-codification-20260422

**Agent**: independent-assurance-agent v6.2.0 (contract v2.9.0)
**Wave**: mmm-storage-model-codification-20260422
**Issue**: maturion-isms#1458 — Resolve and codify MMM storage bucket model from legacy MAT requirements vs legacy MAT implementation drift
**Branch**: copilot/resolve-mmm-storage-model-drift
**Date created**: 2026-04-22
**CS2 Authorization**: CONFIRMED — issue #1458 opened by CS2 (@APGI-cmy)
**Adoption phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## PRE-BRIEF

**Invocation type**: PRE-BRIEF (Phase 0)
**Date**: 2026-04-22
**Triggered by**: Foreman wave-current-tasks.md + scope declaration committed on branch `copilot/resolve-mmm-storage-model-drift`
**ceremony_admin_appointed**: PENDING (not yet appointed — ACR-01–11 checks deferred to final audit session when appointment is confirmed)

---

### Qualifying Tasks

All 5 wave tasks qualify for IAA oversight. Classification applied per `iaa-trigger-table.md` §Decision Flow:

| # | Task | Artifact Path | Trigger Condition | Category |
|---|------|---------------|-------------------|----------|
| T1 | Architecture Decision Record (ADR) | `modules/MMM/storage-model-decision.md` | Modifies module-level architecture/stage artifact (Stage 5 evidence) → PRE_BUILD_STAGE_MODEL | **PRE_BUILD_STAGE_MODEL** |
| T2 | Migration: audio MIME fix | `supabase/migrations/20260422000001_mmm_evidence_audio_mime_fix.sql` | MMM build-phase schema deliverable; advances Stage 12 | **PRE_BUILD_STAGE_MODEL** |
| T3 | Migration: RLS hardening | `supabase/migrations/20260422000002_mmm_evidence_rls_hardening.sql` | MMM build-phase schema deliverable; advances Stage 12; NBR-002 active | **PRE_BUILD_STAGE_MODEL** |
| T4 | Red QA tests: audio MIME coverage | `modules/MMM/tests/B1-schema/b1-schema.test.ts` | Stage 6 (QA-to-Red) deliverable; modifies module test suite | **PRE_BUILD_STAGE_MODEL** |
| T5 | BUILD_PROGRESS_TRACKER.md update | `modules/MMM/BUILD_PROGRESS_TRACKER.md` | Explicit PRE_BUILD_STAGE_MODEL trigger (iaa-trigger-table.md Step 8) | **PRE_BUILD_STAGE_MODEL** |

**Primary trigger**: Step 8 (`modules/MMM/BUILD_PROGRESS_TRACKER.md`) — PRE_BUILD_STAGE_MODEL. IAA = MANDATORY.

---

### Applicable Overlay

**Primary**: `PRE_BUILD_GATES` — OVL-PBG-001 through OVL-PBG-016

Stage-readiness view (pre-brief obligation per trigger table §PRE_BUILD_STAGE_MODEL):

| MMM Pre-Build Stage | Stage Name | Status at Wave Start |
|---------------------|------------|----------------------|
| Stage 1 | App Description | COMPLETE (prior waves) |
| Stage 2 | UX Workflow & Wiring Spec | COMPLETE (prior waves) |
| Stage 3 | FRS | COMPLETE (prior waves) |
| Stage 4 | TRS | COMPLETE (prior waves) |
| Stage 5 | Architecture | ADVANCING — ADR being added as codification artifact this wave |
| Stage 6 | QA-to-Red | ADVANCING — Red QA tests being added for audio MIME coverage |
| Stage 7 | PBFAG | — |
| Stage 8 | Implementation Plan | — |
| Stage 9 | Builder Checklist | — |
| Stage 10 | IAA Pre-Brief | ACTIVE (this document) |
| Stage 11 | Builder Appointment | — |
| Stage 12 | Build | ADVANCING — schema migrations being added this wave |

**Note**: Stage 5 ADR and Stage 12 migrations are advancing concurrently within this wave. IAA final audit must verify all advancing stages have complete gate evidence before issuing ASSURANCE-TOKEN.

---

### Anti-Regression Obligations

**YES — FUNCTIONAL-BEHAVIOUR-REGISTRY obligations apply.**

| Registry Entry | Relevance | Mandatory Check at Final Audit |
|---------------|-----------|-------------------------------|
| **NBR-002** — Supabase RLS Silently Blocks Write for Non-Owner | ACTIVE — T3 (`20260422000002_mmm_evidence_rls_hardening.sql`) adds org-level path isolation RLS policies to `mmm-evidence` bucket. Must verify that all roles expected to write to `mmm-evidence` are covered by the RLS write policies, and that app code checks for write errors. | **MANDATORY** — IAA must inspect RLS policy definitions and confirm write role coverage |
| **NBR-001** — TanStack Query Mutation Cache Invalidation | NOT APPLICABLE — no frontend mutation code in scope | N/A |
| **NBR-003** — Zustand Store State Reset | NOT APPLICABLE — no Zustand store changes in scope | N/A |

**FAIL-ONLY-ONCE obligations at final audit:**

| Rule | Obligation |
|------|-----------|
| **A-036** (Temporal Integrity) | All factual claims in ADR and PREHANDOVER proof must be present-tense accurate. No future-dated completions. IAA must challenge any claim that an event "was completed" if evidence does not support it at audit time. |
| **A-037** (Evidence-Type Discipline) | Stage completion claims must be supported by evidence matching the claim type. Code-merge evidence alone cannot satisfy deployment or live-system verification items. |
| **A-033** (CORE-018 git verification) | PREHANDOVER proof must be verified with `git ls-files --error-unmatch`, not just disk presence. |
| **A-034** / **A-035** (FUNCTIONAL-BEHAVIOUR-REGISTRY + niggle-pattern-library) | NBR-002 must be applied against all RLS migration changes. Niggle pattern library must be checked for Supabase storage bucket patterns. |
| **A-021** (Commit and Push Before IAA Invocation) | All artifacts must be committed and pushed on the branch before final IAA invocation. |
| **A-022** (Re-Evaluate Trigger Categories) | IAA must re-evaluate trigger table at final audit against actual PR diff, not just declared scope. |

---

### Scope Blockers

**No blockers declared at pre-brief stage.**

Observations:
- Scope is well-bounded: ADR + 2 migrations + 1 test file + BUILD_PROGRESS_TRACKER update. No canon/governance file changes, no CI workflow changes, no agent contract changes.
- RLS hardening migration (T3) requires NBR-002 anti-regression check at final audit — this is a known obligation, not a blocker.
- `ceremony_admin_appointed: PENDING` — when appointed, ACR-01 through ACR-11 checks will apply at final audit. The final IAA session must confirm appointment status and execute ACR checks if ECAP is involved.
- No mixed AGENT_CONTRACT or CANON_GOVERNANCE triggers detected — PREHANDOVER proof and session memory are GOVERNANCE_AUDIT artifacts (exempt when isolated) but will be included in the final PR with build artifacts, meaning the PRE_BUILD_STAGE_MODEL overlay governs.

---

### PREHANDOVER Structure Obligations

At final audit, the PREHANDOVER proof bundle MUST contain (at minimum):

1. **Stage progression evidence**: For each advancing stage (5, 6, 12) — committed artifact path + git SHA confirming the deliverable is present on the branch.
2. **ADR substantiveness** (OVL-PBG — Stage 5): The ADR must document the storage model decision rationale, the two canonical buckets, and why legacy MAT buckets are superseded.
3. **Migration evidence** (OVL-PBG — Stage 12): Both migrations committed and parseable SQL; audio MIME types listed explicitly; RLS policy covers all expected write roles.
4. **QA test RED state** (OVL-PBG — Stage 6): Tests must be committed in RED state (failing before implementation). Evidence: test run output or CI log showing tests fail against current DB state.
5. **NBR-002 compliance**: PREHANDOVER must confirm which roles are permitted to write to `mmm-evidence`, with explicit RLS policy text cited.
6. **No future-dated claims** (A-036): All "COMPLETE" status marks must reference past/present evidence, not anticipated outcomes.
7. **IAA audit token reference**: Pre-populated expected reference in format `IAA-session-[NNN]-mmm-storage-model-codification-20260422-PASS` per A-029/§4.3b architecture.
8. **Files changed count**: Must match actual `git diff --name-only origin/main...HEAD` count at time of PREHANDOVER commit (A-026, A-028).

---

## TOKEN

*(Reserved — populated by IAA after final audit ASSURANCE-TOKEN is issued.)*

---

## REJECTION_HISTORY

### R-001 — 2026-04-23

**Verdict**: REJECTION-PACKAGE
**Token reference**: IAA-session-mmm-storage-model-codification-20260422-REJECT-R1
**Session ID**: session-mmm-storage-model-codification-20260422
**PR**: #1460 | **Wave**: mmm-storage-model-codification-20260422 | **Branch**: copilot/resolve-mmm-storage-model-drift
**Invoked by**: Foreman (CS2 authority)
**Checks run**: 23 substance + ceremony checks — 3 FAIL, 20 PASS
**SUBSTANTIVE STATUS**: All substantive deliverables PASS (ADR, migrations, tests, tracker — locally reviewed). Failures are CEREMONY only.

---

#### F-001 — A-021 (FAIL-ONLY-ONCE) / CORE-020: PREHANDOVER proof not pushed to GitHub

**Finding**: 2 ceremony commits were committed locally but NOT pushed to `origin/copilot/resolve-mmm-storage-model-drift` before IAA invocation. Branch at GitHub (f05c5670) is 2 commits behind local HEAD (88781e79). GitHub API returns HTTP 404 for all 3 ceremony file paths:
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-storage-model-codification-20260422.md` → 404
- `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-mmm-storage-model-codification-20260422.md` → 404
- `.agent-workspace/foreman-v2/memory/session-mmm-storage-model-codification-20260422.md` → 404

Per A-021: GitHub API is the authoritative evidence check. Local commits do not constitute pushed evidence.

**Fix required**: `git push origin copilot/resolve-mmm-storage-model-drift` to push commits ef8176f6 and 88781e79.

**Classification**: Ceremony — Systemic (recurring A-021 pattern; prevention action: Foreman pre-IAA gate must include `git log --oneline origin/copilot/resolve-mmm-storage-model-drift..HEAD` to confirm zero unpushed commits before invoking IAA)

---

#### F-002 — ACR-01 (Auto-Reject): ECAP reconciliation summary absent from GitHub PR bundle

**Finding**: The ECAP reconciliation summary (C1–C5 complete, per §4.3e of PREHANDOVER) is embedded in the PREHANDOVER proof. Since the PREHANDOVER is not pushed to GitHub (F-001 root cause), the ECAP reconciliation summary is entirely absent from the GitHub-accessible Tier 3 proof bundle. `ceremony_admin_appointed: true` → ACR-01 through ACR-11 apply without exception.

**Fix required**: Same as F-001 (git push). The reconciliation summary will become GitHub-accessible once PREHANDOVER is pushed.

**Classification**: Ceremony (shares root cause with F-001)

---

#### F-003 — A-026 (FAIL-ONLY-ONCE): governance/scope-declaration.md not updated for current wave

**Finding**: `governance/scope-declaration.md` on branch `copilot/resolve-mmm-storage-model-drift` still contains content from wave `mmm-stage12-build-execution-20260420` (PR #1429, `FILES_CHANGED: 107`, branch `copilot/mmm-stage-12-build-execution-evidence`). The current wave `mmm-storage-model-codification-20260422` is entirely absent. ECAP session memory flagged this as a Foreman responsibility; it was not completed before IAA invocation.

**Fix required**: Update `governance/scope-declaration.md` with current wave content. The PR diff at push-time will contain 13 files:
```
.agent-admin/assurance/iaa-wave-record-mmm-storage-model-codification-20260422.md
.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-mmm-storage-model-codification-20260422.md
.agent-workspace/execution-ceremony-admin-agent/bundles/session-mmm-storage-model-codification-20260422.md
.agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-storage-model-codification-20260422.md
.agent-workspace/foreman-v2/memory/session-mmm-storage-model-codification-20260422.md
.agent-workspace/foreman-v2/personal/scope-declaration-wave-mmm-storage-model-codification-20260422.md
.agent-workspace/foreman-v2/personal/wave-current-tasks.md
modules/MMM/BUILD_PROGRESS_TRACKER.md
modules/MMM/storage-model-decision.md
modules/MMM/tests/B1-schema/b1-schema.test.ts
supabase/migrations/20260420000004_mmm_storage_buckets.sql
supabase/migrations/20260422000001_mmm_evidence_audio_mime_fix.sql
supabase/migrations/20260422000002_mmm_evidence_rls_hardening.sql
```
Note: `supabase/migrations/20260420000004_mmm_storage_buckets.sql` appears in the GitHub PR diff but is absent from `approved_artifact_paths` in the wave-scoped scope declaration. Add it to both the global scope declaration and the wave-scoped scope declaration.

**Classification**: Ceremony — Systemic (recurring across waves; prevention action: add `governance/scope-declaration.md` update as a mandatory, explicit Foreman pre-IAA gate checklist step)

---

**Resolution path** (all 3 failures share a simple resolution sequence):
1. `git push origin copilot/resolve-mmm-storage-model-drift` — resolves F-001 + F-002
2. Update `governance/scope-declaration.md` for current wave (13 files listed above), commit, push — resolves F-003
3. Add `supabase/migrations/20260420000004_mmm_storage_buckets.sql` to wave-scoped scope declaration (`approved_artifact_paths`), commit, push
4. Re-invoke IAA

**Systemic prevention actions registered (no-repeat mandate)**:
- Pre-IAA gate must verify pushed state: `git log --oneline origin/copilot/resolve-mmm-storage-model-drift..HEAD` must return empty
- `governance/scope-declaration.md` update added as mandatory named Foreman pre-IAA gate step
