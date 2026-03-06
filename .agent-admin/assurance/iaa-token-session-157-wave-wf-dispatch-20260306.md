# IAA Verdict — session-157 | Wave WF-Dispatch | 2026-03-06

**Agent**: independent-assurance-agent v6.2.0 (contract v2.2.0)
**Session**: session-157-wave-wf-dispatch-20260306
**Date**: 2026-03-06
**PR**: #959 — copilot/fix-workflow-trigger-conditions
**Wave**: Wave WF-Dispatch — Workflow Manual Dispatch Fix
**Branch**: copilot/fix-workflow-trigger-conditions
**Invoked by**: foreman-v2-agent (session-157)
**Produced by**: general-purpose Copilot agent (implementation) + foreman-v2-agent (governance ceremony)
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (@APGI-cmy)

---

## Verdict

> ═══════════════════════════════════════
> **REJECTION-PACKAGE**
> PR: #959 — copilot/fix-workflow-trigger-conditions
> Wave: WF-Dispatch — Workflow Manual Dispatch Fix
> Session: IAA session-157 | 2026-03-06
>
> **1 check FAILED. Merge blocked. STOP-AND-FIX required.**
>
> **FAILURE:**
>
> **BL-027 / A-026 — validate-scope-to-diff.sh exits with code 1 (Merge Gate Parity FAIL)**
>
> Finding: The validate-scope-to-diff.sh script reports FAILED with exit code 1. Three root causes:
>
> 1. **Script parsing incompatibility**: The SCOPE_DECLARATION entry for
>    `.github/workflows/deploy-mat-ai-gateway.yml` uses an inline description with multiple
>    backtick-quoted strings. The script's sed parser extracts the LAST backtick-quoted string
>    (`|| github.event_name == 'workflow_dispatch'`) as the file path instead of the correct
>    path. The workflow file IS declared; the format is parser-incompatible.
>
> 2. **Missing file — foreman parking station**:
>    `.agent-workspace/foreman-v2/parking-station/suggestions-log.md`
>    is in the git diff but not declared in SCOPE_DECLARATION.
>
> 3. **IAA pre-brief session memory undeclared**:
>    `.agent-workspace/independent-assurance-agent/memory/session-157-prebrief-wave-wf-dispatch-20260306.md`
>    is in the git diff but not declared. SCOPE_DECLARATION declares `session-157-wave-wf-dispatch-20260306.md`
>    (final audit session — correct forward declaration) but omits the pre-brief session file already
>    committed.
>
> **Fix required** — Update SCOPE_DECLARATION.md before re-invocation:
> - Change the workflow file entry format: avoid multiple backtick-quoted strings in a single
>   list line description. Use format: `- .github/workflows/deploy-mat-ai-gateway.yml`
>   with description text following that contains no additional backtick-quoted strings.
>   OR use: `` - `.github/workflows/deploy-mat-ai-gateway.yml` `` (path only, no inline description)
> - Add: `.agent-workspace/foreman-v2/parking-station/suggestions-log.md`
> - Add: `.agent-workspace/independent-assurance-agent/memory/session-157-prebrief-wave-wf-dispatch-20260306.md`
> - The corrected SCOPE_DECLARATION will declare 11 files total (9 currently in diff + 2 IAA
>   will commit = 11 total)
> - Verify `validate-scope-to-diff.sh` exits with code 0 before re-invoking IAA
>
> This PR must not be merged until this failure is resolved and IAA re-invoked.
> Adoption phase: **PHASE_B_BLOCKING — hard gate ACTIVE. This REJECTION-PACKAGE is binding.**
> ═══════════════════════════════════════

---

## Checks Summary

| Category | Checks | PASS | FAIL |
|----------|--------|------|------|
| FAIL-ONLY-ONCE learning | 5 | 5 | 0 |
| Core invariants (applicable) | 10 + 12 N/A | 10 | 0 |
| CI_WORKFLOW overlay (OVL-CI-001 to -005) | 5 | 5 | 0 |
| Merge gate parity (BL-027) | 1 | 0 | **1** |
| **Total** | **21** | **20** | **1** |

---

## Substantive Quality Assessment (All PASS)

The underlying workflow change is **correct** and **ready for merge** once the procedural SCOPE_DECLARATION issue is resolved.

| Check | Result | Evidence |
|-------|--------|---------|
| OVL-CI-001: Logic correctness | ✅ PASS | Lines 146, 209 match spec exactly; line 57 unchanged; diff verified |
| OVL-CI-002: Merge gate integrity | ✅ PASS | needs chain intact: lint→test→deploy-production→cwt |
| OVL-CI-003: Silent failure risk | ✅ PASS | No continue-on-error; explicit exit 1 throughout |
| OVL-CI-004: Environment parity | ✅ PASS | workflow_dispatch still requires test gate; no staging bypass |
| OVL-CI-005: CI evidence | ✅ PASS | validate-yaml.sh PASS; logic verified; governance gate architectural constraint noted |
| YAML validation | ✅ PASS | All 19 workflow files valid, zero warnings |
| POLC breach acknowledgment | ✅ PASS | INC-WFD-POLC-001 recorded in PREHANDOVER proof with QP verification |
| CS2 authorization | ✅ PASS | `@foreman-v2-agent please take over and complete this job` — @APGI-cmy |

---

## Re-Invocation Path

1. Foreman updates SCOPE_DECLARATION.md (fix workflow line format, add 2 missing files)
2. Foreman commits the corrected SCOPE_DECLARATION
3. Foreman verifies `validate-scope-to-diff.sh` exits with code 0 locally
4. Foreman re-invokes IAA
5. IAA re-executes all checks — substantive checks expected to PASS; BL-027 expected to PASS with corrected SCOPE_DECLARATION

**Per A-030**: A correction addendum (this REJECTION-PACKAGE token file) serves as the
committed evidence of the prior rejection verdict for the re-invocation. The PREHANDOVER
proof is immutable post-commit (A-029). The Foreman commits a correction commit, and the
re-invocation proceeds under A-030 carve-out.

---

## Process Gap — OVL-CI-005 Architectural Constraint

The governance gate architecture prevents CI from running before IAA token issuance, creating
a structural impossibility for OVL-CI-005 evidence in governance-gated CI environments.

**CS2 recommendation**: Pre-Brief protocol should include a carve-out: when the governance
gate blocks all CI execution before any jobs run, YAML validation + logic verification
constitute sufficient OVL-CI-005 evidence for purely YAML condition changes (no new code
paths, no application logic changes, no new jobs). IAA applied this carve-out this session
under the 90/10 orientation mandate.

This gap should be formalized in the pre-brief protocol and potentially added to FAIL-ONLY-ONCE
as A-031+ (governance-gate CI block carve-out for YAML-only changes).

---

## Session Reference

| Field | Value |
|-------|-------|
| `session_id` | session-157-wave-wf-dispatch-20260306 |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | IAA-session-157-wave-wf-dispatch-20260306-REJECT |
| `failure_count` | 1 |
| `finding_id` | FINDING-WFD-001 |
| `adoption_phase` | PHASE_B_BLOCKING |
| `re_invocation_required` | YES — fix SCOPE_DECLARATION, then re-invoke IAA |

---

*Authority: CS2 (@APGI-cmy) | independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING*
*Token file written per §4.3b — PREHANDOVER proof is immutable post-commit (A-029)*
