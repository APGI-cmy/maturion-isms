# IAA Wave Record — PR-2058-SECURITY-CORRECTION

## PRE-BRIEF

**Authoritative task record:** `.agent-admin/prs/pr-2058/wave-current-tasks.md`  
**PR:** [#2058 — Add explicit application Data API grants before Supabase's October change](https://github.com/APGI-cmy/maturion-isms/pull/2058)  
**Work item / wave:** `PR-2058-SECURITY-CORRECTION`  
**Branch:** `codex/explicit-data-api-grants-20260923`  
**Submitted head:** `9a537ee785ba24e1f9f57737e8c5fa15388e9aa7`  
**ceremony_admin_appointed:** Not specified in the authoritative task record; no appointment is inferred.

**CS2 historical delegation-order exception:** The task record cites CS2 comments `5978432262` and `5979407372`. Existing implementation commits predate the exception; no historical pre-brief, builder appointment, or strict commit order is claimed. The exception does not waive security changes, focused regression tests, independent assurance, or CS2 merge review.

Qualifying tasks:
1. **PR2058-SEC-01** — Trace MMM/PIT helper definitions, execution security, RLS references, and client/RPC callers; remove authenticated grants to public MMM helpers and prevent unauthorized PIT helper RPC-oracle use with a private/non-exposed schema where supported by the trace, while preserving RLS evaluation and approved RPC write paths.
2. **PR2058-SEC-02 (evidence-table scope)** — Establish from DDL and application use whether `public.evidence_submissions` is a supported Data API table; if confirmed, add precise authenticated/service-role grants, no anon grant, and exercise it in fixture/coverage.
3. **PR2058-SEC-02 (assertion/documentation scope)** — Preserve the PostgreSQL multi-privilege `has_table_privilege` assertion and cite authoritative PostgreSQL documentation.

Applicable overlay: **BUILD_DELIVERABLE (T2 schema/API), with PRODUCT_BUILD_ASSURANCE applicable to the backend/data-access security correction.**

Anti-regression obligations: **Yes** — apply FUNCTIONAL-BEHAVIOUR-REGISTRY **NBR-002** to verify expected authorized writes and prevent silent RLS/write-path regressions; apply **NBR-005** where DDL and application table use are coupled, verifying the actual schema/use relationship rather than relying on mocks.

This canonical pre-brief records the current bounded security correction; it does not claim to predate the historical implementation. Its head binding intentionally names the stable reviewed security submission, not this artifact-correction commit.

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "PR-2058-SECURITY-CORRECTION"
  pr: "#2058"
  issue: "#2058 — Add explicit application Data API grants before Supabase's October change"
  branch: "codex/explicit-data-api-grants-20260923"
  current_head_sha: "a676496b20a7d861370e17faababcf610b15e30e"
  work_item_id: "PR-2058-SECURITY-CORRECTION"
  qualifying_tasks:
    - task_id: "PR2058-SEC-01"
      summary: "Trace and secure the MMM and PIT organisation/role helpers: preserve public MMM helper revocations, route PIT RLS evaluation through app_private, deny direct public RPC-oracle access, and preserve approved PIT project write RPCs."
      assurance_category: "DATABASE_ACCESS_SECURITY"
    - task_id: "PR2058-SEC-02"
      summary: "Verify supported evidence_submissions use and RLS; grant only the reviewed authenticated/service-role privileges, test the actual Wave 16.6 DDL and organisation isolation, and retain the documented PostgreSQL multi-privilege assertion."
      assurance_category: "DATABASE_ACCESS_REGRESSION"
  required_build_gates:
    - "Focused Data API grants regression passes against the disposable PostgreSQL 17 replay, including access coverage, RLS isolation, idempotency, future-table privacy, and atomic refusal when RLS is disabled."
    - "CodeQL and secret scanning report no findings for the reviewed change."
    - "Independent final assurance and CS2 review remain required; no production deployment is authorized by this pre-brief."
    - "The historical delegation-order check remains technically red and is accepted only under CS2's one-time PR-scoped exception; do not fabricate or backdate ordering evidence."
  expected_qa_scope:
    - "Verify authenticated callers cannot execute public MMM or PIT helper functions, including via effective PUBLIC privileges."
    - "Verify app_private helper execution remains available for RLS and every affected policy keeps equivalent predicates."
    - "Verify unauthorized users cannot probe arbitrary PIT organisation membership/roles through RPC, while authorized and unauthorized controlled project RPC paths behave as reviewed."
    - "Verify evidence_submissions authenticated SELECT/INSERT/UPDATE isolation, service-role SELECT/INSERT access, and absence of anonymous grants using the real legacy DDL."
    - "Verify the PostgreSQL comma-separated has_table_privilege assertion and its PostgreSQL 17 documentation citation are retained."
  high_risk_failure_modes:
    - "A public SECURITY DEFINER helper remains executable through PostgREST RPC or exposes arbitrary organisation membership/role results."
    - "Policy helper rewriting changes RLS semantics, breaks private helper execution, or bypasses the controlled PIT project RPC boundary."
    - "evidence_submissions grants permit cross-organisation reads/writes, anonymous access, or privileges beyond its reviewed policy/backend paths."
    - "Migration replay, idempotency, future-table privacy, or atomic refusal fails under the automatic-grants-disabled fixture."
    - "Historical implementation ordering is represented as proven despite predating this current correction's pre-brief/appointment sequence."
  required_builder_evidence:
    - "Source trace of each public MMM/PIT helper definition, security mode, RLS references, ACLs, and client/RPC callers."
    - "Disposable PostgreSQL 17 regression output showing 89 migrations replayed and all four focused PASS milestones."
    - "Assertions covering public-helper non-callability, private policy helper execution, PIT RPC authorization, evidence_submissions isolation, and its exact table privileges."
    - "PostgreSQL 17 documentation citation for comma-separated privilege semantics: https://www.postgresql.org/docs/17/functions-info.html#FUNCTIONS-INFO-ACCESS"
    - "Confirmation that no hosted database was changed and that the existing production migration workflow remains the deployment path."
  required_foreman_qp_checks:
    - "Review the complete current security diff for minimal scope, least privilege, migration ordering, policy semantic preservation, and absence of fabricated historical evidence."
    - "Confirm regression assertions test successful authorized operations as well as denied cross-organisation and direct-helper operations."
    - "Confirm CI test, CodeQL, secret-scan, review, and required-check states are accurately reported for the stable reviewed head."
    - "Keep QP, ECAP, IAA, delegation-order, and merge-readiness claims distinct; do not represent CS2's exception as a green gate."
  ecap_required: true
  ecap_expected_artifacts:
    - ".agent-admin/prs/pr-2058/wave-current-tasks.md"
    - ".agent-admin/scope-declarations/pr-2058.md"
    - ".agent-admin/assurance/iaa-wave-record-PR-2058-SECURITY-CORRECTION-2026-10-04.md"
    - "Commit-state and scope validation for the current PR-bound administrative artifacts."
  final_iaa_focus:
    - "Verify the reviewed security submission is exactly a676496b20a7d861370e17faababcf610b15e30e and the pre-brief does not bind itself to its later artifact commit."
    - "Independently verify public MMM/PIT helper RPC denial, private RLS helper execution, and preservation of authorized PIT project RPC behavior."
    - "Independently verify evidence_submissions grants, actual DDL coverage, tenant isolation, and no anonymous access."
    - "Review the 89-migration regression evidence, PostgreSQL privilege citation, CodeQL/secret-scan outcomes, deployment boundary, and truthful CS2 historical-order exception."
  result: PREFLIGHT_BRIEF_COMPLETE
```
