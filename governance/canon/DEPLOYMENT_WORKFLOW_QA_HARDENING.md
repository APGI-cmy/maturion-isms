# Deployment Workflow QA Hardening Canon

**Version**: 1.0.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Type**: Canon — Tier 1 Governance Rule
**Effective Date**: 2026-04-27
**Layer-Down Status**: PUBLIC_API
**Applies To**: All agents producing deployment-workflow PRs; Foreman QP; IAA final audit; all PREHANDOVER proofs for deployment-surface waves
**Issue**: maturion-isms#1479

---

## 1. Purpose

This canon establishes mandatory QA and handover requirements for any PR that:

- modifies a GitHub Actions deployment workflow (`.github/workflows/deploy-*.yml`);
- introduces or changes CI steps that interact with live infrastructure (Supabase, Vercel, cloud services);
- adds, removes, or reorders deployment jobs or migration steps; or
- creates new helper scripts invoked from a deployment workflow.

Recurring misses in deployment-workflow waves — including silent psql→API migration regressions (PR #1473/#1475), missing gate confirmations, and PREHANDOVER proofs lacking enumerated deployment surfaces — make this hardening mandatory. It closes the gap between application-code QA rigour and deployment-infrastructure QA rigour.

---

## 2. Definitions

| Term | Definition |
|------|-----------|
| **Deployment surface** | Any live-infrastructure target touched by a workflow: a Supabase project (identified by `SUPABASE_PROJECT_REF`), a Vercel deployment target, a cloud storage bucket, a secret/env-var namespace, or any external service endpoint. |
| **Deployment-workflow PR** | Any PR whose diff includes at least one file matching `.github/workflows/deploy-*.yml` or `.github/scripts/` files invoked from a deployment workflow. |
| **Deployment Gate** | The CI workflow run triggered by a deployment-workflow PR; this includes migration dry-runs, schema-verification jobs, and health-check steps. |
| **Deployment Surface Enumeration** | The mandatory PREHANDOVER section listing each deployment surface affected by the wave and the evidence class confirming each surface's final state. |

---

## 3. Core Rules

### 3.1 — DEPLOYMENT-GATE-BLOCKING (Rule D-001)

**A deployment-workflow PR MUST NOT be merged without a confirmed Deployment Gate result.**

- If the deployment workflow is triggered: the CI run MUST achieve a green status before merge.
- If the deployment workflow is NOT triggered (e.g. no matching path filter): this must be explicitly stated in the PREHANDOVER proof under `## Deployment Surface Enumeration` with a `gate_triggered: false` declaration and a documented justification.
- Foreman QP MUST verify the gate status at every deployment-workflow QP evaluation.
- Violation class: `INC-DEPLOYMENT-GATE-SKIP-001`

### 3.2 — DEPLOYMENT-SURFACE-ENUMERATION-MANDATORY (Rule D-002)

**Every PREHANDOVER proof for a deployment-workflow PR MUST include a `## Deployment Surface Enumeration` section.**

This section MUST:

1. List every deployment surface touched or potentially affected.
2. Declare the `evidence_type` for each surface's validation (STATIC_CODE / CI_TEST / CONFIG / LIVE_RUNTIME / LIVE_E2E).
3. Declare the gate status for each surface (PASS / SKIP-JUSTIFIED / TRIGGERED-FAIL).
4. Include the CI run reference (URL or "N/A — gate not triggered") for each live-infrastructure surface.

Absence of this section in a PREHANDOVER proof for a deployment-workflow PR is a **producer-side defect** caught at Foreman QP and IAA final audit. Violation class: `INC-DEPLOYMENT-SURFACE-MISSING-001`

### 3.3 — MIGRATION-EXECUTION-PATH-VERIFICATION (Rule D-003)

**Any wave that modifies deployment-workflow migration steps MUST verify the actual execution path in CI.**

- If a migration step was changed from one execution method (e.g. direct `psql`) to another (e.g. Management API), the CI run MUST confirm the new path executes without error on the target Supabase project.
- A static-code review alone (confirming the YAML change is present) does NOT satisfy this requirement.
- Required `evidence_type`: `CI_TEST` at minimum; `LIVE_RUNTIME` preferred.
- Violation class: `INC-MIGRATION-PATH-UNVERIFIED-001`

### 3.4 — HELPER-SCRIPT-CONTRACT-COMPLIANCE (Rule D-004)

**Any helper script invoked from a deployment workflow MUST comply with the following contract before the PR is merged:**

- HTTP response handling: accept 200, 201, and 204 as success; treat all other codes as hard failures with `::error::` output.
- Connection parameters: use `--connect-timeout 10 --max-time 60` on all `curl` invocations.
- Temporary file hygiene: clean up tmpfiles via `trap "rm -f '$tmpfile'" RETURN` or equivalent.
- Input validation: validate required environment variables (`SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, etc.) with `::error::` on missing values.

Foreman QP MUST verify helper-script compliance at static-code review for any wave touching `.github/scripts/` files. Violation class: `INC-HELPER-SCRIPT-CONTRACT-001`

### 3.5 — DEPLOYMENT-CHECKLIST-MANDATORY (Rule D-005)

**All deployment-workflow PRs MUST be validated against `governance/checklists/deployment-workflow-qa-checklist.md` before PREHANDOVER.**

Checklist completion evidence MUST appear in either:
- the PREHANDOVER proof directly (embedded checklist table), or
- a linked checklist file committed on the same branch.

Foreman QP MUST confirm checklist completion. IAA MUST verify checklist presence at final audit. Violation class: `INC-DEPLOYMENT-CHECKLIST-MISSING-001`

---

## 4. Evidence Fidelity Requirements

The following matrix defines the minimum required evidence fidelity for deployment-workflow PRs. These requirements are non-negotiable and cannot be satisfied by lower-fidelity evidence classes.

| Check | Minimum Evidence Type | Rationale |
|-------|----------------------|-----------|
| Migration step executes without error | `CI_TEST` | Static code review cannot confirm runtime execution |
| Schema tables exist post-migration | `CI_TEST` | Presence in SQL file ≠ applied migration |
| Helper script HTTP handling | `STATIC_CODE` | Code review is sufficient for contract compliance |
| Deployment surface gate (Vercel, Supabase) | `LIVE_RUNTIME` | Live confirmation required; CI run alone is insufficient for production surfaces |
| Environment variable presence | `CI_TEST` | `env-var-audit` job output required |

---

## 5. Anti-Regression Obligations

### 5.1 Cross-references

This canon extends the existing evidence-type discipline established in:
- `governance/canon/TEMPORAL_AND_EVIDENCE_INTEGRITY_CANON.md` — Rules E-001/E-002/E-003
- FAIL-ONLY-ONCE Rules A-040 (TEMPORAL-AUDIT-AT-QP) and A-041 (EVIDENCE-TYPE-CLASSIFICATION-AT-QP)
- FAIL-ONLY-ONCE Rule A-042 (DEPLOYMENT-WORKFLOW-QA-MANDATORY)

No rule in this canon supersedes or conflicts with the above. Where overlap exists, both sets of rules apply.

### 5.2 Prior-Wave Incident Traceability

| Incident | Root Cause | Rule Closed |
|----------|-----------|-------------|
| PR #1473 — psql migration steps silently failed on GitHub-hosted runners | Migration execution path not verified in CI; no Deployment Surface Enumeration in PREHANDOVER | D-003 |
| PR #1475 — protected migration workflow still used unreachable psql | QP evaluation did not require LIVE_RUNTIME evidence for migration path | D-003, D-001 |
| Multiple waves — PREHANDOVER proofs missing deployment surface detail | No mandatory PREHANDOVER section requiring deployment surface enumeration | D-002 |

---

## 6. Applicability

This canon applies to all deployment-workflow PRs merged after 2026-04-27. It is enforced:

- at Foreman QP evaluation (Phase 3 Step 3.5);
- at IAA final audit (Phase 4 IAA-FINAL); and
- at the `preflight/evidence-exactness` CI gate for SCOPE_DECLARATION compliance.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Living Agent System**: v6.2.0
**Canon ref**: `governance/canon/DEPLOYMENT_WORKFLOW_QA_HARDENING.md`
**FAIL-ONLY-ONCE cross-ref**: A-042
**Related checklist**: `governance/checklists/deployment-workflow-qa-checklist.md`
