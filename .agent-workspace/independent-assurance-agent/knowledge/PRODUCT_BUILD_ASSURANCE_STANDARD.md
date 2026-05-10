# Product Build Assurance Standard (IAA)

**Agent**: independent-assurance-agent  
**Version**: 1.0.0  
**Status**: ACTIVE — MANDATORY  
**Last Updated**: 2026-05-10  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Issue Anchor**: APGI-cmy/maturion-isms#1590

---

## Purpose

This standard defines the mandatory assurance model for product-facing BUILD/T2 PRs.

Central question:

> If CS2 opens the deployed or preview build and performs the promised workflow, does it work completely?

If the answer is anything other than **yes**, IAA must issue a **REJECTION-PACKAGE** or a clearly non-mergeable **PARTIAL_FUNCTIONAL_DELIVERY** verdict.

Admin and ceremony checks remain required but are secondary. Functional delivery is primary.

---

## Mandatory Applicability

IAA MUST load and apply this standard when any of the following is true:

- PR is product-facing BUILD or T2
- PR changes UI/backend/API workflow behaviour
- PR claims functional delivery, full delivery, partial delivery, handover, or product fix
- PR includes `.functional-delivery/pr-<PR>.md`

---

## Mandatory Functional Gates

### 1) Promised user journey gate

Required evidence block:

- `PROMISED_USER_JOURNEY:`
- `ENTRY_POINT:`
- `FINAL_EXPECTED_STATE:`
- `USER_CAN_COMPLETE_JOURNEY: yes/no`

Rule: if `USER_CAN_COMPLETE_JOURNEY` is `no`, then `FUNCTIONAL_PASS` must be `no`.

### 2) CTA-to-capability gate

For each visible action/CTA in scope:

- UI component
- Visible button/action
- Backend target
- Request body
- Response body
- Auth/role model
- Success state
- Failure state
- Next route/state
- Evidence

### 3) Schema contract gate

For each Supabase operation in the functional path (`select/insert/upsert/update/delete`):

- TABLE
- OPERATION
- COLUMNS_READ
- COLUMNS_WRITTEN
- MIGRATION_COLUMNS_MATCH: yes/no
- REQUIRED_NOT_NULL_FIELDS_SATISFIED: yes/no
- CHECK_CONSTRAINT_VALUES_VALID: yes/no
- RELATIONSHIP_KEYS_VALID: yes/no

### 4) Cross-function compatibility gate

For each upstream/downstream handoff:

- UPSTREAM_STEP
- UPSTREAM_OUTPUT
- DOWNSTREAM_STEP
- DOWNSTREAM_EXPECTED_INPUT
- COMPATIBLE: yes/no
- EVIDENCE

### 5) Async/pending-state gate

For queued/pending/processing jobs, verify:

- where user sees status
- how status refreshes
- completion behavior
- failure behavior
- next CTA unlock
- linkage to parent entity

### 6) Visible state gate

For every user action:

- Idle state visible: yes/no
- Disabled/precondition state correct: yes/no
- Loading state visible: yes/no
- Success state visible: yes/no
- Failure state visible: yes/no
- Backend error surfaced safely: yes/no
- Retry or next action visible: yes/no

### 7) Compile/publish precondition gate

Lifecycle CTAs must enforce prerequisites with visible explanation and backend enforcement.

### 8) Dashboard/state reflection gate

Verify state before and after action and user-visible reflection:

- Dashboard/list/status reflects action: yes/no
- Permission failure distinguishable from runtime failure: yes/no
- Valid empty state present: yes/no

### 9) Deployed preview proof gate

Local tests or CI alone are insufficient for full functional delivery.

Minimum proof:

- preview/live URL
- current reviewed head SHA
- authenticated role used
- screenshots/recording
- CTA/API map
- backend invocation evidence
- function logs/traces
- success/loading/failure evidence
- dashboard/state reflection evidence

If missing, `FUNCTIONAL_PASS` must be `no`.

---

## Split Verdict Discipline

Required fields:

- `ADMIN_PASS: yes/no`
- `FUNCTIONAL_PASS: yes/no`
- `VERDICT: FULL_FUNCTIONAL_DELIVERY | PARTIAL_FUNCTIONAL_DELIVERY | ADMIN_ONLY | FAIL`

Rules:

- `FUNCTIONAL_PASS: yes` requires `VERDICT: FULL_FUNCTIONAL_DELIVERY`
- Any unresolved functional defect requires `FUNCTIONAL_PASS: no`
- Partial scope is non-mergeable unless CS2 explicit waiver is committed and quoted
- Language such as "code quality PASS", "technically correct", "no regressions", "ready for handover" is prohibited when `FUNCTIONAL_PASS: no`

---

## Rejection Package Format (mandatory)

Every product-build rejection must use:

```text
REJECTION-PACKAGE
Functional verdict: no
Blocking finding:
Evidence:
Why this fails the promised workflow:
Required fix:
Required proof before re-invocation:
```

No vague "please verify". No unresolved functional finding is waivable by IAA.

