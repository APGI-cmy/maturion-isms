# IAA Wave Record — harden-deploy-mmm-supabase-migrations

**Wave**: harden-deploy-mmm-supabase-migrations
**Date**: 2026-04-27
**Branch**: copilot/harden-deploy-mmm-supabase-migrations
**Issue**: maturion-isms — Foreman: harden Deploy MMM Supabase Migrations workflow end-to-end until it passes
**Ceremony Admin Appointed**: NO
**IAA Session**: session-075-20260427

---

## PRE-BRIEF

**Generated**: 2026-04-27
**IAA Session**: session-075-20260427
**Trigger**: `action: "PRE-BRIEF"` — Phase 0 invocation (no Phase 1–4 assurance executed)

### Qualifying Tasks

| # | Task | Trigger Category | IAA Required? |
|---|------|-----------------|---------------|
| 1 | Modify `.github/workflows/deploy-mmm-supabase-migrations.yml` — replace `supabase link` + `supabase db push` with Supabase Management API (`apply-migrations-via-api.py --migrations-dir supabase/migrations/ --tracking-table mmm_native_migrations`); remove `Setup Supabase CLI` step | CI_WORKFLOW | YES — MANDATORY |
| 2 | Governance ceremony artifacts: wave-current-tasks.md, SCOPE_DECLARATION.md, PREHANDOVER proof, session memory, IAA wave record | GOVERNANCE_AUDIT (supporting ceremony) | Exempt in isolation; covered by CI_WORKFLOW PR ceremony obligation |

**Qualifying tasks**: 1 CI_WORKFLOW task + governance ceremony artifacts (exempt; covered under CI_WORKFLOW wave ceremony obligation)
**Total IAA-qualifying PRs expected**: 1

### Applicable Overlay

**Primary category**: CI_WORKFLOW
**Trigger path**: Step 3 in classification flow — `.github/workflows/deploy-mmm-supabase-migrations.yml` is being modified (matches `deploy-*.yml` deployment workflow pattern)
**Overlay**: CI_WORKFLOW (OVL-CI-001 through OVL-CI-006)
**Additional mandatory overlay**: DEPLOYMENT_WORKFLOW_QA_HARDENING D-001 through D-005 (per FAIL-ONLY-ONCE A-042 — this wave modifies a `deploy-*.yml` workflow)
**Classification**: unambiguous — CI_WORKFLOW (DEPLOYMENT_WORKFLOW_QA subset active)

### Anti-Regression Obligations

**Anti-regression obligations**: YES

| Rule | Source | What to Check |
|------|--------|--------------|
| A-042 | DEPLOYMENT_WORKFLOW_QA_HARDENING.md + FAIL-ONLY-ONCE | D-001 through D-005 apply to all `deploy-*.yml` PRs. Checklist required, deployment surface enumeration required, migration execution path CI_TEST evidence required. |
| A-037 | FAIL-ONLY-ONCE 2.8.0 | Evidence-type discipline — migration execution path cannot be satisfied by static code review alone; CI_TEST minimum (D-003); LIVE_RUNTIME required for production surface gate (§4 evidence fidelity matrix). |
| A-033 | FAIL-ONLY-ONCE 2.6.0 | All CORE-018 artifact checks (PREHANDOVER, session memory) must use `git ls-tree HEAD` verification — disk presence alone is insufficient. |
| D-003 (INC-MIGRATION-PATH-UNVERIFIED-001) | DEPLOYMENT_WORKFLOW_QA_HARDENING §3.3, §5.2 | Root cause of prior failures PR #1473 and #1475. New MMM-native migration execution path MUST be verified via CI_TEST, not static code review. |

**FUNCTIONAL-BEHAVIOUR-REGISTRY ref**: NBR-001 through NBR-005 — not directly applicable (CI_WORKFLOW category, not BUILD/AAWP_MAT). IAA will confirm at Step 3.1 at final audit.

### Scope Blockers Declared

| ID | Blocker | Severity | Resolution Path |
|----|---------|----------|----------------|
| SB-001 | FAIL-ONLY-ONCE A-039 through A-042 referenced in DEPLOYMENT_WORKFLOW_QA_HARDENING.md §5.1 were added in wave harden-qa-deployment-workflow-20260427 (PR #1480). That wave's PR is pending CS2 merge approval (not yet in main). The current branch's FAIL-ONLY-ONCE.md is at v2.9.0 with A-038 as last entry. IAA will apply D-001–D-005 obligations via canon reference (DEPLOYMENT_WORKFLOW_QA_HARDENING.md is committed and active) regardless of FAIL-ONLY-ONCE number. LOW impact — does not block this wave. | LOW | No blocking action required. Apply D-001–D-005 via canon. |
| SB-002 | D-003 requires CI_TEST evidence that the new migration execution path (Management API) executes without error on the target Supabase project. The workflow is `workflow_dispatch` only (manual trigger, production environment). The PR CI run will NOT automatically trigger the deployment workflow. Foreman must either: (a) execute the workflow manually on a staging/test project and cite the run, or (b) declare `gate_triggered: false` with documented justification and accept the evidence fidelity gap notation in the PREHANDOVER. Evidence type gap: CI_TEST can be satisfied by a manual workflow run; LIVE_RUNTIME requires the production run. | MEDIUM | Foreman must pre-plan evidence strategy for D-003 before PREHANDOVER. |
| SB-003 | Confirm `apply-migrations-via-api.py --tracking-table mmm_native_migrations` does not conflict with any existing tracking table of the same name in the target Supabase project. The script creates the table with `CREATE TABLE IF NOT EXISTS` so the concern is name collision with legacy data. | LOW | Builder must verify tracking table name uniqueness before implementing. IAA will verify at final audit. |

**SB-001 status**: RESOLVED — no blocking action required (canon reference sufficient)
**SB-002 status**: OPEN — Foreman must declare evidence strategy in PREHANDOVER
**SB-003 status**: OPEN — Builder must confirm at implementation; IAA verifies at final audit

### PREHANDOVER Structure — Mandatory Sections

Per CI_WORKFLOW overlay + DEPLOYMENT_WORKFLOW_QA_HARDENING D-002 and D-005, the PREHANDOVER proof MUST contain:

```
## Header
- session_id: session-075-20260427
- pr_reviewed: [PR number — to be filled]
- branch: copilot/harden-deploy-mmm-supabase-migrations
- wave: harden-deploy-mmm-supabase-migrations
- iaa_audit_token: PENDING (per A-029 §4.3b)
- ceremony_admin_appointed: NO

## Scope Declaration
- Files changed (enumerated with purpose)
- files_changed_count: [N]

## Deployment Surface Enumeration  ← MANDATORY per D-002 (absence = INC-DEPLOYMENT-SURFACE-MISSING-001 auto-reject)
- Surface: MMM Supabase project (SUPABASE_PROJECT_REF)
- Surface type: Supabase
- Evidence type: [CI_TEST / LIVE_RUNTIME]
- Gate status: [PASS / SKIP-JUSTIFIED / TRIGGERED-FAIL]
- CI run ref: [URL or "gate_triggered: false — justification: ..."]

## Deployment Gate Status (D-001)
- gate_triggered: [true/false]
- If triggered: CI run URL + green status confirmation
- If not triggered: explicit justification + gate_triggered: false declaration

## Migration Execution Path Verification (D-003)
- Old path: supabase link + supabase db push (SASL auth failure — network unreachable)
- New path: apply-migrations-via-api.py --migrations-dir supabase/migrations/ --tracking-table mmm_native_migrations
- evidence_type: CI_TEST (minimum)
- CI evidence: [step output / run URL]

## Helper Script Contract Compliance (D-004)
- If .github/scripts/ files modified: complete per D-004 contract
- If no helper script changes: declare N/A

## Evidence Fidelity (A-037 + D-005 §4)
- Per-item evidence_type declarations
- No LIVE_RUNTIME/LIVE_E2E item satisfied by static code

## Deployment Workflow QA Checklist Completion (D-005)
- Path to completed checklist OR embedded checklist table
- governance/checklists/deployment-workflow-qa-checklist.md completion reference

## CI Check Run Evidence (OVL-CI-005)
- CI workflow run status for PR CI run
- workflow run URL

## Merge Gate Parity
- gate_set_checked: [list all gates]
- Per-gate states: GREEN / FAIL
- merge_gate_parity: PASS / FAIL
```

### Evidence Requirements for Final IAA Audit

| Requirement | Source Rule | Evidence Type | Notes |
|-------------|------------|--------------|-------|
| New migration execution path executes without error | D-003 | CI_TEST minimum; LIVE_RUNTIME preferred | Cannot be satisfied by static code review alone (A-037) |
| Schema verification confirms mmm_native tables exist post-migration | D-003 §3.3 | CI_TEST | schema-verification job output |
| PREHANDOVER includes `## Deployment Surface Enumeration` | D-002 | Artifact review | Absence = auto-reject |
| Deployment gate confirmed | D-001 | CI_TEST / LIVE_RUNTIME | Green CI run or documented gate_triggered: false |
| Deployment checklist completed | D-005 | Artifact review | deployment-workflow-qa-checklist.md filled |
| Workflow policy correctness | OVL-CI-001 | STATIC_CODE | YAML diff review — does new step match intent? |
| Secret/env validation | OVL-CI-002 | STATIC_CODE | SUPABASE_ACCESS_TOKEN + SUPABASE_PROJECT_REF validated before script invocation |
| No interactive prompts in new path | OVL-CI-003 | STATIC_CODE | `supabase db push` removed (interactive SASL prompt eliminated); Management API is non-interactive |
| apply-migrations-via-api.py --tracking-table mmm_native_migrations — table name uniqueness | SB-003 | STATIC_CODE / CONFIG | Builder must confirm; IAA verifies |
| Setup Supabase CLI step removed (no unused steps) | OVL-CI-001 | STATIC_CODE | supabase/setup-cli@v1 should not appear in final YAML |
| FAIL-ONLY-ONCE A-001 (IAA invocation evidence present) | A-001 | Artifact review | This pre-brief + session memory = evidence |
| Git-committed artifacts (A-033) | A-033 | git ls-tree HEAD | All PREHANDOVER and session memory files committed |

---

## TOKEN

*To be populated after IAA final audit — PENDING resolution of REJECTION-001 below.*

---

## REJECTION_HISTORY

### REJECTION-001 — IAA Final Audit — 2026-04-27

**IAA Session**: session-076-20260427 (final audit; pre-brief was session-075-20260427)
**Date**: 2026-04-27
**Auditor**: independent-assurance-agent v6.2.0

**Verdict**: REJECTION-PACKAGE — 1 check FAILED

**Finding**:

| ID | Finding | Fix Required | Classification |
|----|---------|-------------|----------------|
| OVL-CI-005 | PREHANDOVER proof does not explicitly invoke the OVL-CI-005 S-033 Inherent Limitation Exception. The `## CI Check Run Evidence (OVL-CI-005)` section (declared mandatory in pre-brief PREHANDOVER structure) is absent. Three required S-033 substitutes — (1) YAML syntax validation evidence, (2) pattern parity evidence citing proven equivalent run URLs, (3) `workflow_dispatch` retention confirmation — are present implicitly across other PREHANDOVER sections but NOT assembled as a labeled exception invocation as required by OVL-CI-005: "The PREHANDOVER proof MUST explicitly invoke this exception clause with justification." | Add to the PR branch a supplementary committed document (wave record addendum or new CI-evidence file) explicitly invoking the OVL-CI-005 S-033 exception with ALL THREE labeled substitutes. PREHANDOVER is read-only post-commit (A-029); evidence goes in a new file. Update SCOPE_DECLARATION.md to include the new file AND the two undeclared files already in the diff (suggestions-log.md, IAA session-075 pre-brief memory). Then re-invoke IAA for final audit. | CEREMONY |

**OBSERVATION (not blocking — HFMC-02 CI enforcement will catch)**:
SCOPE_DECLARATION.md lists 8 files; PR diff contains 10 files. Missing:
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md`
- `.agent-workspace/independent-assurance-agent/memory/session-075-20260427.md`
HFMC-02 CI gate will block merge until parity is restored. Foreman must update SCOPE_DECLARATION alongside the OVL-CI-005 evidence fix.

**Checks run**: 13 | PASS: 12 | FAIL: 1
**Pre-populated ASSURANCE-TOKEN invalidated**: `IAA-session-075-harden-deploy-mmm-supabase-migrations-20260427-PASS` is INVALIDATED. New token to be issued after re-invocation.

**Prevention action**: For CI_WORKFLOW waves where the modified workflow is `workflow_dispatch`-only, pre-brief MUST flag OVL-CI-005 S-033 invocation as a mandatory PREHANDOVER section. Add dedicated `## CI Check Run Evidence (OVL-CI-005 S-033 Exception)` template to CI_WORKFLOW PREHANDOVER guidance. Promote to FAIL-ONLY-ONCE upon second occurrence.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Agent**: independent-assurance-agent v6.2.0
**Adoption Phase**: PHASE_B_BLOCKING
