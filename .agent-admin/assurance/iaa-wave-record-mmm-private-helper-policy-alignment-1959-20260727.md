# IAA Wave Record — MMM Private-Helper RLS Policy Alignment

**Action:** PRE-BRIEF  
**Wave:** mmm-private-helper-policy-alignment-1959  
**Issue:** #1959  
**PR:** #1973  
**Branch:** fix/issue-1959-private-helper-policy-alignment  
**PR head reviewed:** f394cc44b864ebbf5cf5be51bff8f67a0e90a417  
**IAA role:** independent-assurance-agent  
**Date:** 2026-07-27  

The automated PR comment carrying the task set from PR #1893 is stale, unrelated to this wave, and non-authoritative. The sole authoritative task source for this pre-brief is .agent-admin/prs/pr-1973/wave-current-tasks.md at the reviewed PR head.

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "mmm-private-helper-policy-alignment-1959"
  pr: 1973
  issue: "#1959 — MMM Private-Helper RLS Policy Alignment"
  branch: "fix/issue-1959-private-helper-policy-alignment"
  qualifying_tasks:
    - task_id: "RLS-1959-01"
      summary: "Freeze the seven-policy inventory, private-helper grant boundary and exact non-scope."
      assurance_category: "SECURITY_ARCHITECTURE / GOVERNANCE_EVIDENCE"
    - task_id: "RLS-1959-02"
      summary: "Create the PR-scoped manifest, scope declaration and active task carriers."
      assurance_category: "GOVERNANCE_EVIDENCE"
    - task_id: "RLS-1959-03"
      summary: "Independently classify the wave and write the canonical IAA pre-brief into the declared wave record."
      assurance_category: "SECURITY_ASSURANCE / GOVERNANCE_EVIDENCE"
    - task_id: "RLS-1959-04"
      summary: "Record a bounded schema-builder appointment and PR-scoped delegation order."
      assurance_category: "DELEGATION / GOVERNANCE_EVIDENCE"
    - task_id: "RLS-1959-05"
      summary: "Author one idempotent migration recreating only the seven named policies with app_private.mmm_current_user_org_id()."
      assurance_category: "DATABASE_SCHEMA / RLS_SECURITY"
    - task_id: "RLS-1959-06"
      summary: "Implement structural tests for all seven private-helper references and unchanged hardened helper grants."
      assurance_category: "DATABASE_QA / SECURITY_QA"
    - task_id: "RLS-1959-07"
      summary: "Implement authenticated same-organisation, cross-organisation and anonymous criteria, descriptor and storage-path tests without service_role masking."
      assurance_category: "RLS_SECURITY / TENANT_ISOLATION"
    - task_id: "RLS-1959-08"
      summary: "Run focused and regression suites, complete Foreman QP and ECAP, freeze the current head and obtain independent final IAA."
      assurance_category: "QUALITY / ADMINISTRATION / INDEPENDENT_ASSURANCE"
    - task_id: "RLS-1959-09"
      summary: "Complete CS2 review and merge, governed migration deployment, read-only live verification and Issue #1959 closure."
      assurance_category: "MERGE / DEPLOYMENT_ASSURANCE"
    - task_id: "RLS-1959-10"
      summary: "Reconcile the MMM tracker for PRs #1958 and #1962 and prepare the separate Issue #1961 build-to-GREEN lane after Issue #1959 closure."
      assurance_category: "SUCCESSOR_CONTROL"
  required_build_gates:
    - "The canonical PR #1973 pre-brief must be committed before schema-builder appointment or delegation."
    - "The bounded schema-builder appointment and PR-scoped delegation order must be committed before any migration or test implementation."
    - "Repository implementation must remain limited to one idempotent migration affecting exactly the seven named policies and focused executable tests."
    - "Structural checks must prove all seven policies use app_private.mmm_current_user_org_id() and none use an unqualified or public helper."
    - "Authenticated same-organisation success, cross-organisation denial and anonymous denial must be exercised through actual RLS identities without service_role masking."
    - "Existing descriptor live-closure and merged approval QA-to-RED authority must remain green."
    - "Focused tests, regression suites and exact-head hosted checks must pass."
    - "Foreman QP must pass before ECAP administrative validation."
    - "ECAP must validate scope, lineage, delegation and evidence administration before final assurance."
    - "Independent final IAA must pass on the frozen head before CS2 merge review."
    - "Database deployment and live verification must remain blocked until CS2 merge and governed deployment authority."
  expected_qa_scope:
    - "Prove exactly seven intended policies change and no other policy, helper body, helper grant or generic privilege changes."
    - "Prove every resulting policy expression contains app_private.mmm_current_user_org_id()."
    - "Prove no resulting policy expression contains an unqualified or public.mmm_current_user_org_id() call."
    - "Prove authenticated retains only the intended app_private schema usage and private-helper execution capabilities."
    - "Prove anon cannot use or execute the private helpers."
    - "Prove neither anon nor authenticated receives execution on the legacy public helpers."
    - "Prove authenticated same-organisation criteria update, descriptor insert and update, and evidence-storage operations evaluate without 42501."
    - "Prove authenticated cross-organisation operations remain denied across all affected table and storage paths."
    - "Prove anonymous operations remain denied."
    - "Prove tenant-path tests use actual authenticated and anonymous identities rather than service_role."
    - "Prove migration reapplication is safe or deterministically idempotent."
    - "Prove existing descriptor closure and merged approval QA-to-RED suites remain green."
    - "After governed deployment, perform read-only live inspection of Supabase project ujucvyyspfxlxlfdamda."
  high_risk_failure_modes:
    - "The stale automated PR comment carrying PR #1893 tasks is treated as authority instead of the PR #1973 task carrier."
    - "Schema-builder appointment or implementation occurs before the canonical pre-brief."
    - "A legacy public helper is re-exposed to authenticated or anon."
    - "A private-helper body, search path, grant or schema privilege is weakened or broadened."
    - "A migration changes any policy beyond the seven-policy inventory."
    - "Existing policy actions, roles, bucket predicates, path predicates or same-organisation semantics drift during recreation."
    - "Same-organisation success is demonstrated only through service_role or another RLS-bypass credential."
    - "Cross-organisation or anonymous denial weakens."
    - "Tests are skipped, vacuous, non-executable or weaken merged RED authority."
    - "The migration is non-idempotent or unsafe to reapply."
    - "Supabase is mutated directly before CS2 merge and governed deployment authority."
    - "Merge, deployment, issue closure or successor-lane progression occurs before required QP, ECAP and independent final IAA."
  required_builder_evidence:
    - "A commit-order record proving appointment and delegation preceded the first migration or test implementation."
    - "The single migration path and an exact before-and-after inventory of the seven recreated policies."
    - "Evidence that existing policy actions, roles, bucket predicates, path predicates and same-organisation semantics were preserved."
    - "Structural test output proving seven private-helper references, zero unqualified or public-helper references and unchanged hardened grants."
    - "Executable authenticated same-organisation, cross-organisation and anonymous test output for criteria, descriptor and evidence-storage paths."
    - "Evidence identifying the actual authenticated and anonymous test identities and proving service_role was not substituted for tenant-path verification."
    - "Migration idempotency or deterministic safe-reapplication evidence."
    - "Focused and regression test commands with complete results, including descriptor live-closure and approval QA-to-RED suites."
    - "Exact changed-file inventory proving no unrelated schema, policy, helper, application, Edge Function or infrastructure path changed."
    - "A declaration that no direct Supabase mutation occurred during repository implementation."
  required_foreman_qp_checks:
    - "Verify the canonical pre-brief preceded the schema-builder appointment and implementation."
    - "Verify appointment and delegation are bounded to repository migration and test authorship only."
    - "Verify exact parity between the seven-policy authority, migration contents, tests and changed-file inventory."
    - "Verify no helper body, helper grant, generic privilege or unrelated policy changed."
    - "Verify same-organisation success and cross-organisation and anonymous denial use actual RLS identities without service_role masking."
    - "Verify existing policy actions, roles, bucket predicates, path predicates and same-organisation semantics are preserved."
    - "Verify migration idempotency and complete executable test evidence."
    - "Verify descriptor live-closure and approval QA-to-RED regressions remain green."
    - "Verify the PR manifest, scope declaration, active task carrier and implementation file count remain synchronized."
    - "Verify exact-head hosted checks are complete and green before ECAP and final IAA."
    - "Verify no merge, deployment, live-mutation or issue-closure claim is made prematurely."
  ecap_required: true
  ecap_expected_artifacts:
    - ".admin/prs/pr-1973.json"
    - ".agent-admin/scope-declarations/issue-1959.md"
    - ".agent-admin/scope-declarations/pr-1973.md"
    - ".agent-admin/prs/pr-1973/wave-current-tasks.md"
    - ".agent-admin/assurance/iaa-wave-record-mmm-private-helper-policy-alignment-1959-20260727.md"
    - ".agent-admin/builder-appointments/issue-1959-schema-builder.md"
    - ".agent-admin/control/delegation-orders/pr-1973.json"
    - "Exact migration and focused-test path inventory recorded in the PR-scoped manifest and scope declaration."
    - "PR-scoped Foreman QP, session-memory, prehandover and exact-head hosted-check evidence required by the live gates."
    - "Administrative lineage proving pre-brief, appointment, implementation, QP, ECAP and final-IAA ordering."
  final_iaa_focus:
    - "Confirm the effective implementation changes exactly the seven authorized policies and no others."
    - "Confirm all seven policies call app_private.mmm_current_user_org_id() and none call an unqualified or public helper."
    - "Confirm the hardened private-helper and legacy public-helper grant boundaries remain unchanged."
    - "Challenge authenticated same-organisation success evidence for criteria, descriptor and evidence-storage paths, including absence of 42501."
    - "Challenge authenticated cross-organisation and anonymous denial evidence across every affected table and storage path."
    - "Confirm no tenant-isolation conclusion relies on service_role or another RLS-bypass credential."
    - "Confirm policy actions, roles, bucket predicates, path predicates and same-organisation semantics were preserved."
    - "Confirm migration idempotency and focused and regression suites are executable and green."
    - "Confirm exact-head scope parity, hosted checks, QP, ECAP and prehandover evidence are complete and coherent."
    - "Confirm no direct database mutation, premature deployment, self-assurance or unauthorized successor-work implementation occurred."
    - "Preserve CS2-only merge authority and require governed post-merge deployment and read-only live verification before Issue #1959 closure."
  result: PREFLIGHT_BRIEF_COMPLETE


### IAA PRE-BRIEF CORRECTION ADDENDUM — Delegation-order artifact timing

**Scope of correction:** Sequencing of the PR-scoped machine delegation-order artifact only.  
**Authority checked:** `.agent-admin/control/schemas/delegation-order.schema.json` and `.agent-admin/control/overlays/WAVE3_DELEGATION_ORDER_GATE.md`.

The earlier wording requiring both the bounded appointment and the finalized PR-scoped delegation-order JSON before implementation is superseded only to the following extent:

1. The canonical IAA pre-brief must be committed first.
2. The bounded schema-builder appointment must be recorded in its own later commit.
3. The first migration or test implementation must occur in a distinct commit strictly after the appointment commit.
4. Only after that first implementation commit exists may `.agent-admin/control/delegation-orders/pr-1973.json` be finalized and committed.
5. The machine delegation-order artifact must record:
   - the exact 40-hex pre-brief commit SHA;
   - the exact 40-hex builder-appointment commit SHA;
   - the exact 40-hex first implementation commit SHA detected from the implementation-like changed files;
   - the remaining schema-required fields.
6. The machine proof must demonstrate:
   - `prebrief_commit_sha` is a strict ancestor of `builder_appointment_commit_sha`;
   - `builder_appointment_commit_sha` is a strict ancestor of `first_implementation_commit_sha`;
   - all three SHAs are distinct;
   - `first_implementation_commit_sha` equals the gate-detected first implementation commit;
   - `first_implementation_commit_sha` is an ancestor of the current PR head.
7. The finalized machine delegation-order proof must be committed after the first implementation commit and before Foreman QP or handover.
8. Same-commit pre-brief/appointment, appointment/implementation, placeholder SHAs, synthetic SHAs, and retrospective appointment evidence remain prohibited.

For RLS-1959-04, “appointment and delegation” must therefore be interpreted as two ordered controls:

- the human-readable bounded appointment/delegation instruction is committed before implementation; and
- the schema-valid machine delegation-order proof is committed after the first implementation commit becomes identifiable.

No other qualifying-task classification, build gate, QA obligation, evidence requirement, ECAP requirement or final-IAA focus is changed by this addendum.
