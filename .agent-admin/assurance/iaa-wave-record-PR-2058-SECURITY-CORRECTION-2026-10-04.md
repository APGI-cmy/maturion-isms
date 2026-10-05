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
