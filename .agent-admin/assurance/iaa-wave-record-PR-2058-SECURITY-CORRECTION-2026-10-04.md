# IAA Wave Record — PR-2058-SECURITY-CORRECTION

## PRE-BRIEF

**Authoritative task record:** `.agent-admin/prs/pr-2058/wave-current-tasks.md`
**PR:** [#2058 — Add explicit application Data API grants before Supabase's October change](https://github.com/APGI-cmy/maturion-isms/pull/2058)
**Work item / wave:** `PR-2058-SECURITY-CORRECTION`
**Branch:** `codex/explicit-data-api-grants-20260923`
**Reviewed substantive head:** `1eb903588c0bfc090925cdceb7414fddcccc615b`
**ceremony_admin_appointed:** Not specified in the authoritative task record; no appointment is inferred.

**CS2 historical delegation-order exception:** The task record cites CS2 comments `5978432262` and `5979407372`. Existing implementation commits predate the exception; no historical pre-brief, builder appointment, or strict commit order is claimed. The exception does not waive security changes, focused regression tests, independent assurance, or CS2 merge review.

Qualifying tasks:
1. **PR2058-SEC-01** — Trace MMM/PIT helper definitions, execution security, RLS references, and client/RPC callers; preserve public MMM helper revocations and prevent unauthorized PIT helper RPC-oracle use while preserving RLS evaluation and approved RPC write paths.
2. **PR2058-SEC-02** — Apply the fixed least-privilege Data API allowlist and verify it with the focused 88-migration PostgreSQL 17 regression; exclude Wave 16.6 and `public.evidence_submissions`, and retain the PostgreSQL multi-privilege `has_table_privilege` assertion with its authoritative documentation citation.

Applicable overlay: **BUILD_DELIVERABLE (T2 schema/API), with PRODUCT_BUILD_ASSURANCE applicable to the backend/data-access security correction.**

Anti-regression obligations: **Yes** — apply FUNCTIONAL-BEHAVIOUR-REGISTRY **NBR-002** to verify expected authorized writes and prevent silent RLS/write-path regressions; apply **NBR-005** where DDL and application table use are coupled, verifying the actual schema/use relationship rather than relying on mocks.

This canonical pre-brief records the current bounded security correction; it does not claim to predate the historical implementation. The current scope covers 88 in-scope migrations. Wave 16.6 and `public.evidence_submissions` are excluded from the allowlist, replay, fixture, coverage, and supported-use claims; the separately unresolved legacy consumer/DDL mismatch is outside this PR's scope. Its head binding intentionally names the stable reviewed substantive submission, not this artifact-correction commit.

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "PR-2058-SECURITY-CORRECTION"
  pr: "#2058"
  issue: "#2058 — Add explicit application Data API grants before Supabase's October change"
  branch: "codex/explicit-data-api-grants-20260923"
  current_head_sha: "1eb903588c0bfc090925cdceb7414fddcccc615b"
  work_item_id: "PR-2058-SECURITY-CORRECTION"
  qualifying_tasks:
    - task_id: "PR2058-SEC-01"
      summary: "Trace and secure the MMM and PIT organisation/role helpers: preserve public MMM helper revocations, route PIT RLS evaluation through app_private, deny direct public RPC-oracle access, and preserve approved PIT project write RPCs."
      assurance_category: "DATABASE_ACCESS_SECURITY"
    - task_id: "PR2058-SEC-02"
      summary: "Verify the fixed least-privilege Data API allowlist with the focused 88-migration PostgreSQL 17 regression; exclude Wave 16.6 and evidence_submissions and retain the documented PostgreSQL multi-privilege assertion."
      assurance_category: "DATABASE_ACCESS_REGRESSION"
  required_build_gates:
    - "Focused Data API grants regression passes against the disposable PostgreSQL 17 replay, including access coverage, RLS isolation, idempotency, future-table privacy, and atomic refusal when RLS is disabled."
    - "CodeQL and secret scanning report no findings for the reviewed change."
    - "Independent final assurance and CS2 review remain required; no production deployment is authorized by this pre-brief."
    - "The historical delegation-order check remains technically red and is accepted only under CS2's one-time PR-scoped exception; do not fabricate or backdate ordering evidence."
    - "Wave 16.6 and evidence_submissions remain excluded from the 88-migration replay and supported-use claims; the existing legacy consumer/DDL mismatch remains separately unresolved and out of scope."
  expected_qa_scope:
    - "Verify authenticated callers cannot execute public MMM or PIT helper functions, including via effective PUBLIC privileges."
    - "Verify app_private helper execution remains available for RLS and every affected policy keeps equivalent predicates."
    - "Verify unauthorized users cannot probe arbitrary PIT organisation membership/roles through RPC, while authorized and unauthorized controlled project RPC paths behave as reviewed."
    - "Verify the replay covers exactly 88 in-scope migrations and excludes Wave 16.6/evidence_submissions from grant, fixture, and access-coverage assertions."
    - "Verify the PostgreSQL comma-separated has_table_privilege assertion and its PostgreSQL 17 documentation citation are retained."
  high_risk_failure_modes:
    - "A public SECURITY DEFINER helper remains executable through PostgREST RPC or exposes arbitrary organisation membership/role results."
    - "Policy helper rewriting changes RLS semantics, breaks private helper execution, or bypasses the controlled PIT project RPC boundary."
    - "The narrowed scope is inaccurately represented as granting, testing, or supporting evidence_submissions or Wave 16.6."
    - "The known evidence_submissions legacy consumer/DDL mismatch is mistaken as fixed or in-scope by this PR."
    - "Migration replay, idempotency, future-table privacy, or atomic refusal fails under the automatic-grants-disabled fixture."
    - "Historical implementation ordering is represented as proven despite predating this current correction's pre-brief/appointment sequence."
  required_builder_evidence:
    - "Source trace of each public MMM/PIT helper definition, security mode, RLS references, ACLs, and client/RPC callers."
    - "Disposable PostgreSQL 17 regression output showing 88 in-scope migrations replayed and all four focused PASS milestones."
    - "Assertions covering public-helper non-callability, private policy helper execution, PIT RPC authorization, and the exact reviewed allowlist, with Wave 16.6/evidence_submissions excluded."
    - "PostgreSQL 17 documentation citation for comma-separated privilege semantics: https://www.postgresql.org/docs/17/functions-info.html#FUNCTIONS-INFO-ACCESS"
    - "Confirmation that no hosted database was changed and that the existing production migration workflow remains the deployment path."
  required_foreman_qp_checks:
    - "Review the complete current security diff for minimal scope, least privilege, migration ordering, policy semantic preservation, and absence of fabricated historical evidence."
    - "Confirm regression assertions test successful authorized operations as well as denied cross-organisation and direct-helper operations."
    - "Confirm CI test, CodeQL, secret-scan, review, and required-check states are accurately reported for the stable narrowed substantive head; QP and independent final IAA remain pending."
    - "Keep QP, ECAP, IAA, delegation-order, and merge-readiness claims distinct; do not represent CS2's exception as a green gate."
  ecap_required: true
  ecap_expected_artifacts:
    - ".agent-admin/prs/pr-2058/wave-current-tasks.md"
    - ".agent-admin/scope-declarations/pr-2058.md"
    - ".agent-admin/assurance/iaa-wave-record-PR-2058-SECURITY-CORRECTION-2026-10-04.md"
    - "Commit-state and scope validation for the current PR-bound administrative artifacts."
  final_iaa_focus:
    - "Verify the reviewed substantive submission is exactly 1eb903588c0bfc090925cdceb7414fddcccc615b and the pre-brief does not bind itself to its later artifact commit."
    - "Independently verify public MMM/PIT helper RPC denial, private RLS helper execution, and preservation of authorized PIT project RPC behavior."
    - "Verify Wave 16.6/evidence_submissions are excluded from the current allowlist, replay, fixtures, coverage, and supported-use claims; do not treat the known legacy consumer/DDL mismatch as repaired."
    - "Review the 88-migration regression evidence, PostgreSQL privilege citation, CodeQL/secret-scan outcomes, deployment boundary, and truthful CS2 historical-order exception."
  result: PREFLIGHT_BRIEF_COMPLETE
```

## Scope Supersession Note — 2026-10-04

The earlier IAA rejection below remains unchanged historical evidence for the former scope. Its `evidence_submissions`/Wave 16.6 finding applied to the prior grant and fixture claims; it is not a current-scope failure because the narrowed PR excludes that table and migration. The underlying legacy consumer/DDL mismatch remains unresolved and out of scope. This note records no new IAA result.

  ## IAA Assurance Verdict — 2026-10-04

  **Invocation:** PR #2058 — Add explicit application Data API grants before Supabase's October change
  **Invoked by:** CS2, comment 5979939030
  **Produced by:** `schema-builder` (builder class)
  **Ceremony-admin:** NO — `ceremony_admin_appointed` is absent from the authoritative task record; no appointment is inferred.
  **Independence:** CONFIRMED — IAA did not produce or contribute to the reviewed changes.
  **STOP-AND-FIX:** ACTIVE
  **Primary category:** `CI_WORKFLOW` (the actual PR diff includes `.github/workflows/data-api-grants.yml`); the bounded T2 database/security correction was additionally evaluated under `BUILD_DELIVERABLE` and `PRODUCT_BUILD_ASSURANCE`.
  **Reviewed security submission:** `a676496b20a7d861370e17faababcf610b15e30e`
  **Artifact/current branch head at invocation:** `0222c7ed6503b93110c29d2502b0d9425990d472`; the intervening change from the reviewed security submission is confined to this wave-record artifact. No security-code drift was found.

  ### FAIL-ONLY-ONCE and core checks

  - A-001/A-002: Not applicable; this is not an agent-contract PR. No class-exemption claim was found.
  - A-032: **FAIL** — the schema-to-consumer cross-check found a non-existent column in existing application callers; details below.
  - A-034/A-035: Applied. NBR-002 and NBR-005 were reviewed; relevant Supabase RLS/write-path coverage is present, while the NBR-005 column-mismatch pattern recurs.
  - CORE-020: **PASS** — verdict is based on independently inspected, bound evidence; no evidence-only HEAD refresh was requested.
  - CORE-021: **PASS** — the identified failures result in rejection, not a partial pass.
  - CORE-026: **PASS** — acceptance-criteria evidence matrix is recorded below.
  - CORE-027: **FAIL** — the independent risk challenge is complete; the answer to whether a reasonable production owner would accept the application-supported evidence path as merge-ready is NO while the confirmed schema mismatch remains.

  ### Acceptance-criteria evidence matrix

  | Criterion | Independent evidence | Result |
  |---|---|---|
  | Explicit least-privilege allowlist for current application tables/views; protect RLS and security-invoker view assumptions | `supabase/migrations/20260923124227_explicit_data_api_grants.sql` (fixed `VALUES` allowlist, object-kind/RLS/view checks); `supabase/tests/data-api-grants-coverage.sql`; Data API grants run [37201708261](https://github.com/APGI-cmy/maturion-isms/actions/runs/37201708261), job 111434570990 | PASS |
  | Additive behavior; preserve existing policies/defaults; reject unprotected objects; skip absent partial-deployment objects; keep future tables private | Migration transaction and checks; `scripts/test-data-api-grants.py` snapshots normalized policies/defaults, replays twice, checks a future table and atomic refusal; CI log records all four PASS milestones | PASS |
  | PIT projects/source_links remain SELECT-only for authenticated clients; preserve approved controlled RPC writes and deny cross-organisation operations | Migration allowlist; `supabase/tests/data-api-grants-access.sql` asserts table ACLs and exercises successful authorized create/update plus rejected cross-organisation call; disposable PostgreSQL replay passed | PASS |
  | Do not expose public MMM/PIT organisation/role helpers; retain private RLS helper execution | Migration rewrites policies to `app_private`, denies PIT helper EXECUTE to PUBLIC/anon/authenticated/service_role and does not restore MMM PUBLIC/anon grants. Access regression tests authenticated/anon denial; an independent disposable-PostgreSQL replay additionally verified service_role denial. | PASS |
  | Keep anonymous access limited to the existing free-assessment path and exclude migration tracking tables | Migration allowlist; access regression asserts free-assessment anon access and no anon profile/evidence access; tracking tables are excluded from grant/coverage paths | PASS |
  | Grant and test `evidence_submissions` only for its reviewed policy contract, using the actual Wave 16.6 DDL | Migration grants authenticated SELECT/INSERT/UPDATE and service_role SELECT/INSERT, no anon; access test replays the actual DDL and exercises tenant-isolated reads/writes. However, the consumer-to-DDL column contract does not pass (see blocking finding). | FAIL |
  | Retain PostgreSQL comma-list privilege assertion and official citation | `supabase/tests/data-api-grants-access.sql` retains the `has_table_privilege(..., 'INSERT,UPDATE,DELETE')` assertion and PostgreSQL 17 documentation URL | PASS |
  | Fresh migration replay and duplicate-trigger idempotence; no live deployment | Data API workflow log confirms 89 migrations replayed on disposable PostgreSQL 17; trigger diff only adds `DROP TRIGGER IF EXISTS` before the existing definitions. No production deployment workflow was run; docs retain the protected deployment path. | PASS |

  ### Overlay results

  **CI_WORKFLOW:** OVL-CI-001 PASS (path-filtered workflow runs the regression); OVL-CI-002 PASS (no required merge gate is removed or softened); OVL-CI-003 PASS (test-runner nonzero exits raise/fail the job); OVL-CI-004 PASS (workflow uses a disposable PostgreSQL 17 test environment and makes no environment-equivalence claim); **OVL-CI-005 FAIL** — CI run evidence exists, but there is no active PR-scoped PREHANDOVER proof containing its run URL/log. The applicable overlay requires that evidence in PREHANDOVER. No PREHANDOVER artifact was created, per the invocation instruction.

  **BUILD_DELIVERABLE / PRODUCT_BUILD_ASSURANCE:** BD-000-A FAIL (the PR/issue lacks the required promised-user-journey declaration for the changed Data API behavior); BD-000-B FAIL (source trace reaches a caller/DDL column mismatch); BD-000-C PASS (cross-organisation and denied-path cases are explicitly exercised); **BD-000-D FAIL** (database denial is tested, but no consumer/UI failure-state evidence exists for the affected journey). BD-001 PASS; BD-002 PASS; **BD-003 FAIL**; **BD-004 FAIL**; **BD-005 FAIL**; **BD-006 FAIL**; BD-007 PASS; BD-008 PASS; BD-009 FAIL; BD-010 PASS; BD-011 PASS; BD-012 PASS; BD-013 PASS; BD-014 PASS; BD-015 PASS; BD-016 PASS; BD-017 PASS; BD-018 PASS; BD-019 PASS; BD-020 PASS; BD-021 PASS; BD-022 PASS; BD-023 PASS; BD-024 PASS.

  **Security/source trace:** `supabase/migrations/20260608000001_pit_w82_access_foundation.sql` defines the PIT SECURITY DEFINER helpers; `supabase/migrations/20260723141559_pit_slice4_rpc_only_mutation_boundary.sql` retains the approved project RPC callers; `apps/isms-portal/src/lib/supabasePitProjectClient.ts` calls those RPCs. The grant migration's private helpers preserve the reviewed predicates, and the disposable replay exercises authorized and denied RPC cases.

  **Blocking schema-column finding — A-032 / NBR-005 (Substantive; Systemic):** The actual table DDL at `apps/maturion-maturity-legacy/supabase/migrations/20260310000001_wave16_6_schema_audit_completeness.sql:158-197` defines `organisation_id`. Its comment at lines 151-156 expressly says legacy callers using `organization_id` must be updated. Existing consumer code still uses the American spelling, including `apps/maturion-maturity-legacy/src/components/admin/EvidenceSubmissionInterface.tsx:81-88` and `apps/maturion-maturity-legacy/supabase/functions/test-data-sources-api/index.ts:105-115`. The submitted SQL regression uses the real column, so it validates database grants/RLS but does not validate those application consumers. This is pre-existing and outside the authorized product-file scope, but it is directly relevant to the PR's claim that `evidence_submissions` is a supported application path and triggers the active A-032 rule. The security ACL statements themselves are least-privilege; this mismatch nevertheless blocks assurance of the bounded supported-use criterion and the product-build wiring checks.

  **Required action before assurance can pass:** In a separately authorized correction, align every existing `evidence_submissions` caller to the actual DDL (or formally remove that table's supported-use claim and scope), and add a schema-to-consumer regression that fails on this spelling mismatch. Upstream prevention: enforce schema-derived application column-contract checks in CI for legacy Supabase consumers (NBR-005 recurrence).

  ### Independent Risk Challenge (CORE-027)

  1. **What could still fail after merge?** Existing UI/API consumers can still fail when querying/inserting `evidence_submissions` because they use a column absent from the DDL.
  2. **What evidence would prove it does not fail?** A schema-to-consumer column contract check and an end-to-end or direct consumer-path test against the actual Wave 16.6 DDL.
  3. **Is that evidence present?** No. The disposable test validates database-role grants and RLS using the correctly spelled DDL column; it does not execute or validate the legacy consumers.
  4. **Is there a contradiction?** Yes. The task scope calls this supported application use, while the DDL comment records the consumers' spelling mismatch and the consumer code still has it.
  5. **Would a reasonable production owner accept this as merge-ready?** No for the supported `evidence_submissions` application path. The database grant security behavior is verified, but that does not establish the claimed consumer wiring.

  ### Merge-gate parity and truthful status

  - Local parity: scope declaration exactly matches the 11-file PR diff; governance JSON validation and local merge-gate/stop-and-fix checks passed.
  - Current-head CI: Data API grants run 37201708261/job 111434570990 **success** (89 migrations and all four logged PASS milestones); CodeQL check 111434717633 **success**. `merge-gate/verdict`, `governance/alignment`, and `stop-and-fix/enforcement` are **success**.
  - `preflight/delegation-order-gate` remains **technically red**. CS2 comment 5979822573 is a one-time PR-specific exception for historical ordering only; it is not reported as a passing gate and does not waive the findings above. No live database change/deployment is claimed.
  - `ceremony_admin_appointed` is absent from the authoritative task record; ACR-01–16 are therefore not invoked.

  **Tally:** 38 checks: 27 PASS, 11 FAIL.
  **Adoption phase:** PHASE_B_BLOCKING.

  ## REJECTION_HISTORY

  ### 2026-10-04 — Final assurance rejection

  - **Finding:** A-032/NBR-005 evidence-submission consumer/DDL column mismatch; BUILD_DELIVERABLE schema/wiring checks fail. OVL-CI-005 also fails because the active PR bundle lacks the required PREHANDOVER proof carrying CI evidence; no such artifact was created under the invocation's restriction.
  - **Fix required:** Correct or formally remove the `evidence_submissions` supported-use claim under separately authorized scope, add schema-to-consumer regression coverage, and provide the required workflow CI evidence through the authorized PREHANDOVER ceremony.
  - **Classification:** Substantive and Systemic (column mismatch); Ceremony (missing CI evidence in PREHANDOVER).
  - **Systemic prevention:** CI enforcement of schema-derived application column contracts for legacy Supabase consumers.
  - **Merge status:** BLOCKED. No token issued.

  ## IAA Session Memory (embedded in the existing wave record; no new artifact file)

  - session_id: session-1297
  - pr_reviewed: PR #2058 — Add explicit application Data API grants before Supabase's October change
  - overlay_applied: CI_WORKFLOW + AAWP_MAT (BUILD_DELIVERABLE / PRODUCT_BUILD_ASSURANCE)
  - verdict: REJECTION-PACKAGE
  - checks_run: 38 substance checks: 27 PASS, 11 FAIL
  - learning_note: NBR-005 column mismatch recurred in an existing legacy evidence consumer; require CI-enforced schema-to-consumer column parity.

### 2026-10-05 — Final assurance, narrowed security scope

- **Invocation:** PR #2058, “Add explicit application Data API grants before Supabase's October change”; invoked by CS2; produced by `schema-builder` (builder class). ECAP-001 appointment for the scoped admin artifacts is recorded in the authoritative task record; ACR-01–16 were applied.
- **Independence:** CONFIRMED. IAA did not produce or contribute to the reviewed security changes.
- **Category:** `CI_WORKFLOW`, with the mandatory BUILD_DELIVERABLE / PRODUCT_BUILD_ASSURANCE evaluation for the T2 database/API security correction.
- **Bound head:** substantive security submission `1eb903588c0bfc090925cdceb7414fddcccc615b`. Carrier/current reviewed PR head at invocation: `2ac1f4840703fd72ecf78c94bf741fd9c8fea04e`. The carrier commit is administrative; substantive security files are unchanged between these commits.
- **Evidence reviewed:** `.agent-admin/prehandover/proof-pr-2058-data-api-grants-20261005.md`; this canonical wave record; `.agent-admin/prs/pr-2058/wave-current-tasks.md`; the substantive migration, access/coverage tests, test harness, and workflow at the bound security head.

#### Evidence and acceptance-criteria matrix

| Criterion | Evidence independently verified | Result |
|---|---|---|
| Preserve least-privilege grants, RLS policy semantics, MMM helper revocations, private PIT RLS helper execution, and controlled PIT RPC writes | Bound migration and PIT RPC source; access SQL assertions; Data API run [37203866742](https://github.com/APGI-cmy/maturion-isms/actions/runs/37203866742) on `1eb9035…` | PASS |
| Keep the narrowed scope to 88 in-scope migrations; exclude Wave 16.6 and `public.evidence_submissions`; retain the documented comma-list privilege assertion | Bound migration/tests and task record; run 37203866742/job 111440899125; current carrier rerun [37276025504](https://github.com/APGI-cmy/maturion-isms/actions/runs/37276025504), job 111653118697, on `2ac1f48…` | PASS |
| CI workflow executes the focused regression; CodeQL and secret scan report no findings | Workflow definition and successful run 37276025504; CodeQL check 111653347420 succeeded on carrier head; this session's secret scan reported no secrets in the 15 changed files | PASS |
| No live database deployment or unsupported readiness claim | Current CI carrier explicitly states no live deployment and no handover/readiness claim | PASS |
| Complete product-facing user journey and deployed-preview functional proof under PRODUCT_BUILD_ASSURANCE | PR description/task artifacts do not declare the required promised-user-journey block; no authenticated deployed-preview invocation, response, or user-visible success/failure evidence is present. Disposable PostgreSQL CI and preview status checks do not prove that journey. | FAIL |

The former-scope `evidence_submissions` finding is **not** carried forward: the table and Wave 16.6 are excluded in the current migration, replay, fixtures, coverage, and supported-use claims. The historical delegation-order gate remains technically FAIL under CS2 comment `5979822573`; it is not counted as PASS, waived, or reclassified.

#### Check results

- **FAIL-ONLY-ONCE:** A-001 PRESENT; A-002 CONFIRMED/not an agent-contract PR; A-032 PASS for the bounded scope; A-034/NBR-002 applied; A-035 no relevant stack-specific niggle; A-039 matrix complete; A-040 evidence-type boundary applied; A-041 diff-first classification matches; A-042 FAIL (risk challenge questions 3 and 5 are NO); A-043 PASS.
- **CORE:** CORE-020 PASS; CORE-021 PASS (finding results in rejection); CORE-026 PASS (matrix above); CORE-027 FAIL.
- **CI_WORKFLOW:** OVL-CI-001 through OVL-CI-005 PASS. The active PREHANDOVER bundle and current carrier contain CI evidence; this resolves the prior OVL-CI-005 finding for the former invocation.
- **BUILD_DELIVERABLE:** BD-000-A FAIL (no promised user journey declaration); BD-000-B FAIL (journey cannot be traced end-to-end from the declaration/evidence); BD-000-C PASS (unauthorized and cross-organisation cases are exercised); BD-000-D FAIL (no consumer-visible failure-state evidence). BD-001 through BD-024 PASS or not applicable to this schema/security-only diff. Functional Fitness: FFA-01 through FFA-05 PASS; FFA-06 FAIL because CI-only database evidence does not prove the deployed user journey.
- **PRODUCT_BUILD_ASSURANCE:** journey gate FAIL; CTA/schema/cross-function/async/visible-state/publish/dashboard gates PASS or not applicable to the changed surface; deployed-preview proof gate FAIL. Split result: `ADMIN_PASS: yes`, `CODE_PASS: yes`, `FUNCTIONAL_PASS: no`, `VERDICT: FAIL`.
- **ACR-01–16:** PASS. The ECAP reconciliation summary, gate set, current count reconciliation, artifact paths, and non-completion/pending status are evidenced; no final-state contradiction is found.
- **Local merge-gate parity:** `merge-gate/verdict` PASS; `governance/alignment` PASS; `stop-and-fix/enforcement` PASS. The separate `preflight/delegation-order-gate` remains technically FAIL as described above.
- **Tally:** 81 checks — 73 PASS, 8 FAIL. The eight failures are A-042, CORE-027, BD-000-A, BD-000-B, BD-000-D, PRODUCT_BUILD_ASSURANCE journey, PRODUCT_BUILD_ASSURANCE deployed-preview proof, and FFA-06.
- **Independent Risk Challenge:** (1) The live API/user journey could still fail at the deployed boundary despite the SQL regression. (2) Proof requires an authenticated preview/live journey with API invocation and visible success/failure states. (3) That evidence is absent; current evidence is disposable PostgreSQL CI and preview status only. (4) The product-build assurance requirement for live functional proof is not satisfied by the explicit no-live-deployment boundary. (5) A reasonable production owner cannot accept the functional journey as proven. **FAIL.**
- **Failure classification:** Substantive evidence/functional-assurance failure. No current-scope `evidence_submissions` defect is asserted. No new recurring pattern is promoted; recent learning was reviewed and the former-scope mismatch remains excluded.
- **Required action:** Do not deploy under this authorization. Before re-invocation, obtain the required authenticated deployed-preview journey evidence under separate authorization, or obtain a committed CS2-approved resolution of the applicable assurance scope/evidence requirement. Do not change the historical delegation-order disposition or the excluded table scope.
- **Adoption phase:** PHASE_B_BLOCKING. Merge remains blocked; no token issued.
- **IAA_REJECTION_NOTICE:** `RCA_REVIEW: REFER_BACK` (if RCA applies); `HANDOVER_ALLOWED: no`; `RESULT: REJECTED_BACK_TO_PRODUCER`.

## REJECTION_HISTORY — 2026-10-05 CS2-directed independent reassessment

### Invocation and classification

- **Invocation:** PR #2058, “Add explicit application Data API grants before Supabase's October change”; CS2 comment `5991445916`.
- **Producing agent/class:** `schema-builder`, builder class. **Ceremony-admin:** YES — ECAP-001 appointment is explicit in `.agent-workspace/foreman-v2/personal/scope-declaration-wave-pr-2058-data-api-grants-20261005.md`.
- **Independence:** CONFIRMED. IAA did not produce or contribute to the reviewed security implementation.
- **Bound heads:** substantive security head `1eb903588c0bfc090925cdceb7414fddcccc615b`; current PR/admin head reviewed `b9bb4eef66c32b51869187fa88ec354813505871`. Security conclusions bind to the stable substantive head; current-head workflow evidence is independently tied to `b9bb4ee…`. No exact-current-HEAD refresh is requested.
- **Detected PR classes:** `DATABASE_MIGRATION` and `SECURITY_REMEDIATION` from the migration/access-control changes; `CI_WORKFLOW` from `.github/workflows/data-api-grants.yml`. The remaining paths are documentation and assurance/administrative evidence. No runtime UI/API source file changed.
- **IAA category:** `CI_WORKFLOW` (mandatory trigger), with the applicable database/security BUILD_DELIVERABLE checks.

### Class routing and product-build scope

The class-specific evidence profile in `CS2_GOVERNED_BUILD_GATE_CLASS_ROUTING_CANON.md` §§5.2–5.3 controls. Its §§5.2 and 5.3 make CTA maps and full UI-journey proof advisory unless runtime UI/API files changed. `LIVE_FUNCTIONAL_VERIFICATION_CANON.md` §3.2 also exempts pure schema migrations without UI impact from the LFV package requirement. The PR description's `USER_CAN_COMPLETE_JOURNEY: Unverified` is an explicit non-pass, not a functional-pass or completed-delivery claim. PRODUCT_BUILD_ASSURANCE was considered for the changed database/data-access behaviour, but neither the missing deployed preview nor the absent full UI journey is a hard blocker for this detected class. No `FUNCTIONAL_PASS` is issued or claimed. The former-scope `evidence_submissions`/Wave 16.6 and 89-migration findings remain historical and are not carried forward.

### Current database/security evidence

| Check | Independent evidence | Result |
|---|---|---|
| 88-migration disposable PostgreSQL 17 replay | Local execution and current-head Data API grants run [37277113597](https://github.com/APGI-cmy/maturion-isms/actions/runs/37277113597), job `111656476537`; log reports exactly 88 migrations and all four focused PASS milestones. The runner excludes the pre-seeded Wave 16.6 migration and the grant migration under test. | PASS |
| Fixed allowlist, object/RLS guards, and security-invoker views | `supabase/migrations/20260923124227_explicit_data_api_grants.sql` validates listed object kinds, requires RLS for listed tables and `security_invoker=true` for listed views; no automatic/default grants or blanket anonymous grants are introduced. | PASS |
| Public helper denial and private RLS helper access | Access SQL tests authenticated direct invocation denial for public PIT/MMM helpers (effective PUBLIC rights included), anon denial, authenticated `app_private` schema/function privileges, and policy requalification. Migration explicitly revokes public PIT helper execution from PUBLIC/anon/authenticated/service_role and retains the earlier MMM PUBLIC/anon revocations. | PASS |
| PIT `projects`/`source_links` boundary and controlled RPCs | Access SQL checks SELECT-only authenticated table privileges using the PostgreSQL 17 multi-privilege assertion and citation; authorized create/update RPCs succeed and a cross-organisation create is denied. | PASS |
| Exercised organisation isolation and anonymous boundary | Regression reads/writes demonstrate MMM cross-organisation isolation; PIT cross-organisation RPC denial is exercised. The allowlist grants anon only on `mmm_free_assessments`; assertions cover private profiles/approval tables and helper boundaries. | PASS |
| Idempotency, future-table privacy, atomic refusal | Runner compares policy/default/relation snapshots, reapplies the migration, checks an unlisted future table remains private to anon/authenticated/service_role, and confirms an RLS-disabled allowlisted table causes transactional refusal without state change. | PASS |
| PIT Data API SELECT/RLS tenant-isolation execution | `data-api-grants-access.sql` inspects SELECT ACLs and policy helper text/privileges, and exercises PIT RPC writes, but does not issue an authenticated `SELECT` against `public.projects` or `public.source_links` with two-organisation rows. The existing MMM isolation query does not execute the changed PIT policies. | FAIL |
| CodeQL and secret scan | CodeQL run [37277113658](https://github.com/APGI-cmy/maturion-isms/actions/runs/37277113658) succeeded on `b9bb4ee…`; the secret scanner reported no secrets in the 16 current changed paths. | PASS |
| Deployment boundary | No production database deployment occurred. `supabase/DATA_API_GRANTS.md` retains the protected manual deployment path and pending-migration review; preview checks are not treated as production evidence. | PASS |

**Substantive finding — PIT RLS read-path proof (Substantive):** The current security suite does not execute the affected PIT `projects`/`source_links` SELECT policies as an authenticated role, so it does not prove that the requalified `app_private.pit_is_org_member` helper both executes through those policies and filters cross-organisation rows. This is distinct from the advisory deployed UI journey. Hard authority: the task record's focused regression requirement for RLS isolation (`.agent-admin/prs/pr-2058/wave-current-tasks.md`, “Wave completion gate”); the scope declaration's expected verification that existing RLS paths continue to work; and `CS2_GOVERNED_BUILD_GATE_CLASS_ROUTING_CANON.md` §§5.2–5.3, requiring equivalent database validation, verification SQL/results, and affected-flow smoke/security evidence. **Required fix:** add a focused disposable-PostgreSQL assertion with rows in two organisations; as authenticated Org A, prove its own project/source-link rows are visible and Org B rows are not, while retaining the successful/denied RPC cases; rerun the 88-migration suite. A deployed-preview/UI journey is not required to close this finding.

### Ceremony checks

The current PR diff against base contains 16 paths. `.agent-admin/scope-declarations/pr-2058.md` declares `FILES_CHANGED: 15` and its frozen inventory omits `.agent-workspace/independent-assurance-agent/memory/session-1298-20261005.md`. The active task record says the count was reconciled, while the ECAP PREHANDOVER/session artifacts expressly record R07/R11 as unresolved. These are current artifacts and the discrepancy remains in the current head.

- **ACR-04 / ACR-07 — FAIL (Ceremony; Systemic):** stale changed-file count and path inventory; fix by reconciling the scope declaration and active bundle to the exact current PR diff. Because the discrepancy was already explicitly surfaced in ECAP R07/R11 and remains unresolved, upstream prevention is CI enforcement that compares declared scope paths/counts to the authoritative PR diff.
- **ACR-12 — FAIL (Ceremony):** active task/scope records claim the count reconciliation is complete while the ECAP return artifacts say the same count/path reconciliation is unresolved.

Other ACR checks: ACR-01–03 PASS; ACR-05–06 PASS; ACR-08–11 PASS; ACR-13–16 PASS. ECAP reconciliation summary and named `gate_set_checked` are present; no token or final-complete claim is asserted. The scope/count findings are not a reason to alter prior historical findings.

### CI and gate status

- Current-head Data API grants run `37277113597` and CodeQL run `37277113658`: success.
- Current-head `merge-gate/verdict`, `governance/alignment`, and `stop-and-fix/enforcement`: success in Merge Gate Interface run `37277111131`; local JSON and stop-and-fix evidence probes passed.
- The only completed current-head workflow failure found is `Builder Delegation Order Gate` run `37277113600`. It remains technically FAIL. CS2 comment `5979822573` is disclosed as the one-time PR-scoped acceptance of the historical ordering failure only; it is not a PASS and does not waive security evidence, this reassessment, or CS2 review. The skipped duplicate preflight run is not a failure.
- **FAIL-ONLY-ONCE:** A-001 invocation evidence PRESENT (CS2 comment `5991445916`); A-002 CONFIRMED (not an agent-contract PR; no class-exemption claim).
- **CORE-020:** PASS. **CORE-021:** FAIL because the substantive and ceremony findings require rejection.
- **OVL-CI-001–005:** PASS; the modified workflow executed successfully and current CI evidence is present. The workflow is isolated to disposable PostgreSQL and does not claim production/environment equivalence.
- **Tally:** 33 checks — 28 PASS, 5 FAIL (CORE-021; PIT SELECT/RLS execution; ACR-04; ACR-07; ACR-12).
- **Adoption phase:** PHASE_B_BLOCKING.

### Binary verdict

**REJECTION-PACKAGE — PR #2058.** Merge remains blocked. The full UI journey/live-preview evidence is advisory for this class and is not a failure. The hard failures are the PIT Data API SELECT/RLS validation gap and the three applicable ECAP count/path/coherence checks above. No assurance token, sign-off label, or merge-readiness claim is issued.

`IAA_REJECTION_NOTICE`: `RCA_REVIEW: REFER_BACK` (where RCA applies); `HANDOVER_ALLOWED: no`; `RESULT: REJECTED_BACK_TO_PRODUCER`.

## IAA Session Memory — embedded append

- session_id: session-1299
- pr_reviewed: PR #2058 — Add explicit application Data API grants before Supabase's October change
- overlay_applied: CI_WORKFLOW + BUILD_DELIVERABLE / PRODUCT_BUILD_ASSURANCE (class-routed database/security scope)
- verdict: REJECTION-PACKAGE
- checks_run: 33 substance checks: 28 PASS, 5 FAIL
- learning_note: Recurrent scope count/path reconciliation remained unresolved after ECAP R07/R11; require CI-enforced exact diff-to-scope validation.

### 2026-10-05 — CS2-authorized independent reassessment

**Invocation:** PR #2058, “Add explicit application Data API grants before Supabase's October change”; authorized by CS2 comment `5991592978`. Reviewed by the independent-assurance-agent runtime, independent of the producing `schema-builder` (builder class). This is the IAA reviewer identity; no numeric IAA session identifier is asserted. **Ceremony-admin: YES**, per the appointment and `ceremony_admin_appointed: true` in `.agent-workspace/foreman-v2/personal/scope-declaration-wave-pr-2058-data-api-grants-20261005.md`.

**Bound heads:** substantive security head `1eb903588c0bfc090925cdceb7414fddcccc615b`; administrative/current PR head `6fe46ccc7bd70b061254a5c43ed8fc4e7c46f0da`. The migration, tests, runner, workflow, documentation, and trigger migration are unchanged between those heads. No exact-current-head refresh was requested.

**Diff-first class decision:** the PR changes database migrations, SQL/Python database-access tests, the grants workflow, documentation, and assurance/administrative records. It changes no runtime UI/API source file. The applicable classes are `DATABASE_MIGRATION` and `SECURITY_REMEDIATION`, with `CI_WORKFLOW` overlay for `.github/workflows/data-api-grants.yml`; IAA trigger category is `CI_WORKFLOW`. The diff has 16 paths.

#### Class-routed evidence matrix

| Criterion | Primary evidence inspected | Result |
|---|---|---|
| Fixed allowlist; object-kind/RLS/security-invoker guards; no automatic/default or blanket anonymous grants | `supabase/migrations/20260923124227_explicit_data_api_grants.sql:13-148`; `supabase/tests/data-api-grants-coverage.sql`; disposable replay | PASS |
| Migration purpose, security finding, and exact mitigation | PR description; `.agent-admin/prs/pr-2058/wave-current-tasks.md`; migration `:150-340` | PASS |
| Equivalent database validation for preview migration pass | `scripts/test-data-api-grants.py`; current Data API run [37289794725](https://github.com/APGI-cmy/maturion-isms/actions/runs/37289794725), job `111697253669`, on `6fe46ccc7bd70b061254a5c43ed8fc4e7c46f0da`; locally reran the script successfully. Disposable, network-isolated Supabase PostgreSQL 17.6.1 replayed exactly 88 in-scope migrations with automatic grants disabled, reproduced missing grants, applied/reapplied the repair, and passed the four logged milestones. This is equivalent database validation under §5.2; it is not hosted API/browser or production evidence. | PASS |
| RLS predicate and database-state preservation; idempotency, future-table denial, atomic refusal when RLS is off | Runner snapshots normalized policies/default ACLs/relations; applies twice; tests future private table and transactional refusal | PASS |
| PIT helper hardening and approved write boundary | Access SQL `:43-105, :116-165`; migration `:195-340`; controlled RPC migration `20260723141559_pit_slice4_rpc_only_mutation_boundary.sql:5-215`. Authenticated calls to public PIT/MMM helpers are denied; private helper grants and policy rewrites are present; approved create/update RPCs succeed and unauthorized cross-org create is denied. Direct project/source-link DML is denied by effective privilege assertions; the PostgreSQL multi-privilege assertion and documentation citation are retained. | PASS |
| Authenticated PIT `projects` and `source_links` SELECT tenant isolation | `supabase/tests/support/grants-bootstrap.sql:14-26` seeds two PIT organisations/memberships/roles but no PIT project/source-link rows. `data-api-grants-access.sql:34-41` exercises MMM framework/approval isolation; `:69-105` exercises PIT RPC writes, not authenticated PIT SELECT. The SQL contains no authenticated `SELECT` against `public.projects` or `public.source_links`. The generic CI “row isolation” milestone therefore does not prove the changed PIT SELECT policies. Existing policies in `20260722102655_pit_stage12_slice4_project_persistence.sql:68-116` filter projects and source links through `pit_is_org_member`; the new migration requalifies those policy calls, but their two-organisation row behavior is not executed. | **FAIL** |
| Exclusion of Wave 16.6 and `public.evidence_submissions` | Fixed grant values omit the table; runner excludes `20260310000001_wave16_6_schema_audit_completeness.sql`; fixture/coverage omit it; `supabase/DATA_API_GRANTS.md:42-50` explicitly records the unresolved legacy consumer/DDL mismatch and no supported-use claim | PASS |
| Deployment boundary and post-merge checks | `supabase/DATA_API_GRANTS.md:60-71` requires the protected manual migration workflow and pending-queue review; no production database was changed. However, no explicit post-merge deployment/smoke-test sequence or post-merge security re-check checklist is present for verifying deployed role grants and the affected PIT read path. Class canon §§5.2–5.3 require these checklists. | **FAIL** |
| CS2 risk acceptance for the security-remediation class | Reviewed CS2 comments `5991592978` (assessment instructions) and `5979822573` (historical delegation-order exception only), the task record, scope, and ECAP return. No explicit CS2 acceptance of residual security risk is evidenced; comment `5979822573` expressly does not waive security or testing. | **FAIL** |
| Current CI/security check state | Data API run `37289794725` and CodeQL run `37289795377` succeeded on administrative head `6fe46ccc7bd70b061254a5c43ed8fc4e7c46f0da`. Current `merge-gate/verdict`, `governance/alignment`, and `stop-and-fix/enforcement` checks succeeded. `copilot` remained in progress at retrieval. `preflight/delegation-order-gate` run `37289795002` failed because `.agent-admin/control/delegation-orders/pr-2058.json` is absent. | PASS — status reported truthfully |
| UI journey / LFV applicability | Actual diff has no runtime UI/API change and claims no `FUNCTIONAL_PASS`. Class-routing canon §§5.2–5.3 makes full UI journey proof advisory for this scope; LFV canon §3.2 exempts pure schema migrations without UI impact. This is not a preview-journey failure; no preview credentials or journey were required. | PASS |
| Historical delegation-order exception | Current failed run `37289795002` and its log confirm the gate remains technically failed. CS2 comment `5979822573` accepts only the historical ordering failure; it is not reported as a green gate or a security waiver. | PASS — exception applied narrowly |

#### Workflow overlay and retained core checks

- **OVL-CI-001–005: PASS.** The path-filtered workflow invokes the regression runner; it does not weaken merge gates or swallow test failures; disposable PostgreSQL limitations are documented; the current run passed and CI evidence is present in the PREHANDOVER carrier. CI evidence is not treated as production/live evidence.
- **CORE-020: PASS.** Evidence was inspected directly; unverified PIT row isolation is failed rather than assumed.
- **CORE-021: FAIL.** The identified class-applicable failures require rejection.
- **FAIL-ONLY-ONCE:** A-001 invocation evidence is present (CS2 comment `5991592978`); A-002 is confirmed/not applicable (not an agent-contract PR); A-032 does not recur in this narrowed scope because Wave 16.6/`evidence_submissions` is excluded; NBR-002 was applied to the preserved PIT RPC write path; relevant Supabase RLS patterns were reviewed. A-039 acceptance-criteria matrix is recorded above. A-040 is satisfied: database CI is used only as database evidence, not as live runtime evidence. A-041 diff-first classification is based on the actual 16-path diff. **A-042 risk challenge is complete and supports rejection:** (1) PIT cross-organisation reads could remain exposed or authorized reads could fail after policy helper requalification; (2) authenticated Org A/Org B project and source-link SELECT assertions against seeded rows would establish behavior; (3) that evidence is absent; (4) generic “row isolation” CI wording and the exact SQL differ, and scope/task/ECAP count statements conflict; (5) a production owner cannot accept the PIT isolation claim without the missing query evidence. No NBR-005 column mismatch is carried forward because the relevant table/migration is excluded and no app write path changed.

#### ECAP/admin checks

- **ACR-01–03: PASS; ACR-04: FAIL; ACR-05–06: PASS; ACR-07: FAIL; ACR-08–11: PASS; ACR-12: FAIL; ACR-13–16: PASS.**
- **ACR-04 / ACR-07 — FAIL (Ceremony/Systemic):** the actual PR diff and current delegation-order workflow log each report 16 changed paths. `.agent-admin/scope-declarations/pr-2058.md` declares `FILES_CHANGED: 15` and its frozen path inventory omits `.agent-workspace/independent-assurance-agent/memory/session-1298-20261005.md`. The task record's claimed 14+1 reconciliation therefore does not describe the actual current head.
- **ACR-12 — FAIL (Ceremony/Systemic):** the task record states that the path count is reconciled; ECAP PREHANDOVER/session records R07/R11 as unresolved; the current diff confirms 16 paths against the 15-path declaration. These active records conflict on the same scope-count dimension.
- **Systemic prevention:** enforce exact declared-path/count comparison against the PR diff in CI before acceptance; do not resolve by refreshing SHA or editing the immutable PREHANDOVER proof.
- The ECAP reconciliation summary and named `gate_set_checked` are present. Pending final IAA/CS2 status is not represented as complete. All referenced artifacts exist. The delegation-order result remains `FAIL`.

#### Merge-gate parity

- `merge-gate/verdict`: PASS — current-head GitHub check succeeded; locally checked the active root PREHANDOVER evidence path and the conditional tracker validator (`Gate not applicable`).
- `governance/alignment`: PASS — local JSON checks for `CANON_INVENTORY.json` and `sync_state.json` succeeded; current-head check succeeded.
- `stop-and-fix/enforcement`: PASS — local PREHANDOVER evidence check and current-head check succeeded.
- `preflight/delegation-order-gate`: **FAIL**, not included as PASS in parity; the CS2 exception remains limited to the historical ordering defect.

**Tally:** 47 checks — 39 PASS, 8 FAIL. Failures: A-042; CORE-021; PIT authenticated SELECT/RLS tenant-isolation evidence; missing post-merge deployment/smoke/security re-check checklist; missing explicit CS2 security-risk acceptance; ACR-04; ACR-07; ACR-12.

**Failure classifications and required actions**

1. **PIT SELECT/RLS evidence — Substantive:** add a disposable-PostgreSQL test with projects and source links in two organisations. Under authenticated Org A, assert its own rows are visible and Org B rows are absent; retain the current denied direct-write and approved/denied RPC assertions; rerun the exact 88-migration regression. Owner: producing schema-builder, under Foreman supervision.
2. **Post-merge checklist — Ceremony/assurance:** add an explicit bounded deployment, affected-flow smoke-test, and post-merge security re-check checklist covering the protected migration path and verification of authenticated PIT reads/grants. Owner: Foreman/producer within authorized scope; no production deployment is authorized by this review.
3. **CS2 security-risk acceptance — Assurance:** obtain explicit CS2 disposition of the security risk for the narrowed scope; the historical ordering exception is not that disposition. Owner: CS2.
4. **ACR-04/07/12 — Ceremony/Systemic:** reconcile the active scope declaration and task/ECAP status against the exact 16-path diff, preserving the authorized current head and immutable PREHANDOVER carrier. Structural prevention: CI exact diff-to-scope path/count enforcement.

No LFV/class-routing canon conflict is found for this diff: the class-specific profile controls and UI-journey evidence is advisory because runtime UI/API files did not change. No preview identity was requested. No live production deployment occurred.

**REJECTION-PACKAGE — PR #2058.** Eight checks failed. STOP-AND-FIX applies; no assurance token is issued. This is the IAA decision only, not a Foreman readiness or CS2 merge decision.

`IAA_REJECTION_NOTICE`: `RCA_REVIEW: REFER_BACK` (where RCA applies); `HANDOVER_ALLOWED: no`; `RESULT: REJECTED_BACK_TO_PRODUCER`.
