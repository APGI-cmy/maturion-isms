# Deployment Workflow QA Checklist

**Version**: 1.0.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Type**: Governance Checklist — Tier 1 Enforcement
**Effective Date**: 2026-04-27
**Canon ref**: `governance/canon/DEPLOYMENT_WORKFLOW_QA_HARDENING.md`
**Applies To**: All deployment-workflow PRs (any PR modifying `.github/workflows/deploy-*.yml` or `.github/scripts/` files invoked from a deployment workflow)
**Owner**: Foreman QP (per-PR completion) / IAA (final-audit verification)

---

## Instructions

Complete every section in order. Mark each item `[x]` when confirmed, or `[N/A]` with a documented justification when genuinely not applicable. Any `[ ]` (incomplete) item renders the PREHANDOVER proof non-compliant.

---

## Section 1: Deployment Gate Status (Rule D-001)

| # | Check | Status | Evidence / Notes |
|---|-------|--------|-----------------|
| 1.1 | Deployment workflow CI run triggered (or explicitly declared not triggered) | `[ ]` | |
| 1.2 | If triggered — CI run achieved green status | `[ ]` / `[N/A]` | CI run URL: |
| 1.3 | If NOT triggered — gate-not-triggered justification documented in PREHANDOVER `## Deployment Surface Enumeration` | `[ ]` / `[N/A]` | |
| 1.4 | No deployment job marked as `continue-on-error: true` without explicit CS2 approval | `[ ]` | |

**Gate status**: `[ ]` PASS / `[ ]` FAIL / `[ ]` N/A (justified)

---

## Section 2: Deployment Surface Enumeration (Rule D-002)

Enumerate ALL deployment surfaces touched or potentially affected by this PR.

| # | Surface | Surface Type | Evidence Type | Gate Status | CI Run / Notes |
|---|---------|-------------|--------------|------------|----------------|
| 2.1 | | `Supabase / Vercel / Secret / Other` | `STATIC_CODE / CI_TEST / CONFIG / LIVE_RUNTIME / LIVE_E2E` | `PASS / SKIP-JUSTIFIED / TRIGGERED-FAIL` | |
| 2.2 | | | | | |
| 2.3 | | | | | |

> Add rows as needed. If no deployment surfaces are touched, state explicitly: `No deployment surfaces touched — N/A with justification: [reason]`

**PREHANDOVER `## Deployment Surface Enumeration` section present and populated**: `[ ]` YES / `[ ]` N/A (justified)

---

## Section 3: Migration Execution Path Verification (Rule D-003)

Complete this section if the PR modifies any migration execution step in a deployment workflow.

| # | Check | Status | Evidence / Notes |
|---|-------|--------|-----------------|
| 3.1 | Migration execution method identified (psql / Management API / other) | `[ ]` / `[N/A]` | Method: |
| 3.2 | If execution method changed — new path verified in CI (not just static code review) | `[ ]` / `[N/A]` | CI run ref: |
| 3.3 | Schema verification job confirms tables/views exist post-migration | `[ ]` / `[N/A]` | CI step: |
| 3.4 | Evidence type declared for each migration step (`CI_TEST` minimum) | `[ ]` / `[N/A]` | |
| 3.5 | No `LIVE_RUNTIME` or `LIVE_E2E` items satisfied by static code or merged-PR reference alone | `[ ]` | |

**Migration path verification**: `[ ]` PASS / `[ ]` NOT APPLICABLE (no migration changes)

---

## Section 4: Helper Script Contract Compliance (Rule D-004)

Complete this section if the PR modifies any `.github/scripts/` file invoked from a deployment workflow.

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 4.1 | HTTP 200, 201, and 204 all accepted as success | `[ ]` / `[N/A]` | |
| 4.2 | All other HTTP codes treated as hard failures with `::error::` output | `[ ]` / `[N/A]` | |
| 4.3 | `--connect-timeout 10 --max-time 60` present on all `curl` invocations | `[ ]` / `[N/A]` | |
| 4.4 | Tmpfile cleanup via `trap "rm -f '$tmpfile'" RETURN` or equivalent | `[ ]` / `[N/A]` | |
| 4.5 | Required environment variables validated with `::error::` on missing values | `[ ]` / `[N/A]` | Vars: |
| 4.6 | No helper script accepts success on HTTP 200 only (204 empty-body case handled) | `[ ]` / `[N/A]` | |

**Helper script compliance**: `[ ]` PASS / `[ ]` NOT APPLICABLE (no helper script changes)

---

## Section 5: Evidence Fidelity Verification (Rules D-003, A-041)

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 5.1 | Every deployment/migration checklist item declares an explicit `evidence_type` label | `[ ]` | |
| 5.2 | No LIVE_RUNTIME/LIVE_E2E item is satisfied by static code review or merged-PR reference | `[ ]` | |
| 5.3 | CI_TEST items cite an actual CI step or run, not just code presence | `[ ]` | |
| 5.4 | Temporal integrity confirmed — no future-dated completion claims (A-040) | `[ ]` | |

**Evidence fidelity**: `[ ]` PASS

---

## Section 6: PREHANDOVER Proof Completeness (Rule D-005)

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 6.1 | PREHANDOVER proof includes `## Deployment Surface Enumeration` section | `[ ]` | |
| 6.2 | All deployment-surface rows populated (no blank evidence cells) | `[ ]` | |
| 6.3 | Gate 6 (Deployment Gate Confirmation) in PREHANDOVER proof completed | `[ ]` | |
| 6.4 | `## Ripple/Cross-Agent Assessment` section present and populated (HFMC-01) | `[ ]` | |
| 6.5 | CANON_INVENTORY.json updated if new canon files introduced | `[ ]` / `[N/A]` | |
| 6.6 | SCOPE_DECLARATION.md lists all files changed including new deployment scripts | `[ ]` | |
| 6.7 | `preflight/evidence-exactness` gate passes locally | `[ ]` | |

**PREHANDOVER completeness**: `[ ]` PASS

---

## Section 7: Final Sign-Off

| Check | Status |
|-------|--------|
| All Section 1–6 items marked `[x]` or `[N/A]` with justification | `[ ]` |
| No items left blank or marked `[ ]` (incomplete) | `[ ]` |
| Checklist completion committed to branch before IAA invocation | `[ ]` |
| Foreman QP sign-off: | `[ ]` APPROVED / `[ ]` REFERRED |

---

**Authority**: `governance/canon/DEPLOYMENT_WORKFLOW_QA_HARDENING.md` v1.0.0
**Living Agent System**: v6.2.0
**Version**: 1.0.0
**Effective Date**: 2026-04-27
