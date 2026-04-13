# IAA Pre-Brief — Wave opojd-comment-only-copilot-20260408

**Wave**: opojd-comment-only-copilot-20260408
**Issue**: maturion-isms#1286 — "Uninterrupted OPOJD delivery"
**Branch**: copilot/fix-uninterrupted-opojd-delivery
**IAA Version**: 6.2.0 / Contract 2.4.0
**Adoption Phase**: PHASE_B_BLOCKING (hard gate ACTIVE)
**Authority**: CS2 (Johan Ras / @APGI-cmy — confirmed issue opener)
**Date**: 2026-04-08
**Status**: PRE-BRIEF COMPLETE — COMMITTED

---

## Invocation Mode

PRE-BRIEF (Phase 0 only — Phases 2–4 NOT executed this session)

---

## 1. Trigger Categories

| Category | Status | Trigger Path |
|----------|--------|--------------|
| **CI_WORKFLOW** | ✅ ACTIVE — MANDATORY | Both OPOJD-001 and OPOJD-002 modify/create `.github/workflows/**` files. Hard trigger per trigger table §Step 3. |
| AGENT_CONTRACT | ❌ NOT TRIGGERED | No `.github/agents/**` files modified. |
| CANON_GOVERNANCE | ❌ NOT TRIGGERED | No `governance/canon/**` files modified. |
| AAWP_MAT | ❌ NOT TRIGGERED | No application build deliverables. |

---

## 2. Qualifying Tasks

| Task ID | Description | Files Affected | Classification |
|---------|-------------|----------------|----------------|
| OPOJD-001 | Modify `copilot-setup-steps.yml`: remove write-back assumption, remove fallback token, change `contents: write` → `contents: read`, add comment-only preflight env vars | `.github/workflows/copilot-setup-steps.yml` | **CI_WORKFLOW — QUALIFYING** |
| OPOJD-002 | Create `maturion-bot-writer.yml`: explicit write permissions, no `github.token` fallback, fail-fast if `MATURION_BOT_TOKEN` unavailable | `.github/workflows/maturion-bot-writer.yml` (NEW) | **CI_WORKFLOW — QUALIFYING** |
| OPOJD-003 | Keep `copilot-push-intercept.yml` as-is | `.github/workflows/copilot-push-intercept.yml` | **NO CHANGE — NOT QUALIFYING** |

---

## 3. Scope Blockers

| Blocker ID | Description | Blocking Rule |
|-----------|-------------|---------------|
| **SB-001** | Stale `REQ-TU-001`, `REQ-TU-002`, `REQ-TU-004` comment references in `copilot-setup-steps.yml` must be removed — they reference write operation policies that no longer apply. | OVL-CI-001 |
| **SB-002** | `Configure git identity for bot operations` step must be removed from `copilot-setup-steps.yml` and placed only in `maturion-bot-writer.yml`. | OVL-CI-001 |
| **SB-003** | Fallback token pattern `${{ secrets.MATURION_BOT_TOKEN \|\| github.token }}` must be completely absent from `copilot-setup-steps.yml`. | OVL-CI-001 / OVL-CI-003 |
| **SB-004** | `maturion-bot-writer.yml` must implement hard fail-fast when `MATURION_BOT_TOKEN` is absent. Silent skip is NOT acceptable. | OVL-CI-003 |
| **SB-005** | The three preflight env var declarations (`COPILOT_SESSION_MODE=COMMENT_ONLY`, `PUSH_DISABLED_INTENTIONAL=true`, `OUTPUT_MODE=PR_COMMENT_OR_ARTIFACT`) must appear in a workflow-level `env:` block or as a dedicated named step that exports to `$GITHUB_ENV`. | OVL-CI-001 |
| **SB-006** | `maturion-bot-writer.yml` must have explicit `permissions: contents: write` AND a comment stating the intentional separation from the comment-only Copilot workflow. | OVL-CI-001 |

---

## 4. FFA Checks Applicable

> **BUILD_DELIVERABLE overlay does NOT apply.** No FFA-01 through FFA-06. No BD-000 user journey trace. This is CI governance, not application behaviour delivery.

### Universal Ceremony Gate (CERT)

| Check ID | Pass Condition |
|----------|----------------|
| CERT-001 | PREHANDOVER proof exists |
| CERT-002 | Session memory exists |
| CERT-003 | `fail_only_once_attested: true` in session memory |
| CERT-004 | `iaa_audit_token` field in PREHANDOVER proof |

### CI_WORKFLOW Overlay

| Check ID | What IAA Will Verify |
|----------|---------------------|
| OVL-CI-001 | Workflow policy correctness — comment-only model implemented |
| OVL-CI-002 | Merge gate integrity — no existing gate weakened |
| OVL-CI-003 | Silent failure risk — `maturion-bot-writer.yml` fails visibly |
| OVL-CI-004 | Environment parity — consistent behaviour regardless of token presence |
| OVL-CI-005 | CI evidence (S-033 exception applies — see §5) |

---

## 5. OVL-CI-005 S-033 Exception Pre-Declaration

Both workflow files trigger on `workflow_dispatch: {}` only. A pre-merge CI run URL cannot be produced.

**Three required substitutes in PREHANDOVER**:
1. `actionlint` / `yamllint` clean run on both files (output verbatim)
2. Pattern parity comparison against existing approved workflow with CI run URL
3. Explicit confirmation `workflow_dispatch: {}` present in both files

---

## 6. Evidence Artifacts Required at Handover

| Artifact | Path |
|----------|------|
| IAA Pre-Brief | `.agent-admin/assurance/iaa-prebrief-wave1286-opojd-20260408.md` ← this file |
| PREHANDOVER Proof | `.agent-admin/assurance/PREHANDOVER-session-160-wave-opojd-20260408.md` |
| Session Memory | `.agent-workspace/foreman-v2/memory/session-160-opojd-comment-only-20260408.md` |
| IAA Token File | `.agent-admin/assurance/iaa-token-session-160-opojd-comment-only-20260408.md` (written by IAA) |
| actionlint output | Included verbatim in PREHANDOVER |
| Pattern parity evidence | Included in PREHANDOVER |
| `workflow_dispatch` confirmation | Explicit statement in PREHANDOVER |

---

## 7. Pre-Brief Verdict

```
PRE-BRIEF STATUS: COMPLETE
Wave: opojd-comment-only-copilot-20260408
Issue: maturion-isms#1286
IAA Category: CI_WORKFLOW — MANDATORY
Qualifying Tasks: OPOJD-001, OPOJD-002
Scope Blockers Identified: 6 (SB-001 through SB-006)
OVL-CI-005 Exception: S-033 APPLIES — three substitutes required in PREHANDOVER
FFA BUILD_DELIVERABLE: NOT APPLICABLE
Adoption Phase: PHASE_B_BLOCKING
Builder may proceed AFTER this Pre-Brief is committed.
```

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0 | Contract 2.4.0
**PHASE_B_BLOCKING: ACTIVE**
