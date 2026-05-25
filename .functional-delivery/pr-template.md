# Functional Delivery Evidence Template

Use this file as the baseline for product-facing PR evidence.

```
PR: #<number>
Issue: #<number>
Current head SHA reviewed: <git rev-parse HEAD>
PROMISED_USER_JOURNEY: <end-to-end journey description>
ENTRY_POINT: <starting screen/route/action>
FINAL_EXPECTED_STATE: <meaningful completed state>
USER_CAN_COMPLETE_JOURNEY: yes/no
Product/user journey: <journey summary>
User journey tested: yes/no
CTA_MAP: present/missing
CTA/API map: present/missing
BACKEND_CAPABILITY_MAP: present/missing
Backend target proof: present/missing
SCHEMA_CONTRACT_CHECK: present/missing
CROSS_FUNCTION_COMPATIBILITY_CHECK: present/missing
ASYNC_JOB_CHECK: present/missing
VISIBLE_STATE_CHECK: present/missing
DEPLOYED_PREVIEW_CHECK: present/missing
DASHBOARD_OR_STATE_REFLECTION_CHECK: present/missing
Screenshots or recording: present/missing
Preview/live URL: <url or n/a>
Pass/fail result: <pass|fail|partial>
KNOWN_PARTIALS: <none or list>
Known partials: <none or list>
Known limitations: <none or list>
CS2_PARTIAL_ACCEPTANCE: yes/no/not_applicable
CS2_WAIVER_QUOTE: "<explicit CS2 waiver text>" or not_applicable
Partial scope accepted by CS2: yes/no/not_applicable
Builder QA functional report reference: <path/url>
ECAP/admin-gate report reference: <path/url>
IAA final assurance reference: <path/url>
BUILD_TO_RED_TEST_REFERENCE: <T-MMM-S6-### list for this wave>
BUILDER_APPOINTMENT_REFERENCE: <modules/MMM/10-builder-appointment/builder-contract.md section ...>
ROLE_ASSIGNMENT_REFERENCE: <path/url to wave role assignment evidence>

ADMIN_PASS: yes/no
FUNCTIONAL_PASS: yes/no
VERDICT: FULL_FUNCTIONAL_DELIVERY | PARTIAL_FUNCTIONAL_DELIVERY | ADMIN_ONLY | FAIL
MERGE_STATUS_IF_PARTIAL: BLOCKED_BY_DEFAULT | CS2_WAIVER_QUOTED
# Optional alias for compatibility with existing templates/gates:
FULL_FUNCTIONAL_DELIVERY_VERDICT: FULL_FUNCTIONAL_DELIVERY | PARTIAL_FUNCTIONAL_DELIVERY | ADMIN_ONLY | FAIL
```

## Mandatory Split Verdict Consistency

- `FUNCTIONAL_PASS: yes` requires `VERDICT: FULL_FUNCTIONAL_DELIVERY`.
- If `KNOWN_PARTIALS` is not `none`, `FUNCTIONAL_PASS` must be `no`.
- `FULL_FUNCTIONAL_DELIVERY` cannot coexist with `pending`, `outstanding`, `not verified`, or unresolved partial language.
- If partial delivery is claimed, include explicit CS2 waiver quote under `CS2_WAIVER_QUOTE`.
- `PARTIAL_FUNCTIONAL_DELIVERY` is non-mergeable by default. Only explicit quoted CS2 acceptance can remove that block.
- IAA verdict/evidence must remain bound to current PR head SHA; if head changes, re-run IAA and refresh evidence.
- Functional evidence must include explicit `BUILD_TO_RED_TEST_REFERENCE`,
  `BUILDER_APPOINTMENT_REFERENCE`, and `ROLE_ASSIGNMENT_REFERENCE` fields.
- Enforcement reference: `.github/scripts/validate-product-delivery-gates.sh`.

## Rejection Package Shape (for failed functional delivery)

```text
REJECTION-PACKAGE
Functional verdict: no
Blocking finding:
Evidence:
Why this fails the promised workflow:
Required fix:
Required proof before re-invocation:
```

## CTA/API Mapping Table (minimum)

| CTA / visible action | User intent | UI route/component | Backend/API/Edge target | Data/storage object | Success state | Failure state | Evidence |
|---|---|---|---|---|---|---|---|
| <cta> | <intent> | <route/component> | <target> | <storage> | <success> | <failure> | <proof> |
