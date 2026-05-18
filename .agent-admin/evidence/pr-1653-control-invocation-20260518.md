# PR #1653 — Control Mechanism Invocation Report

CURRENT_HEAD_SHA: 2f26f0f1d1c985b644588a9bd94ac485c11feff6
BRANCH: copilot/locate-import-legacy-configuration
DATE: 2026-05-18

## ECAP invocation

ECAP_CLASSIFICATION: ADMIN_REJECTION_NOTICE (HALT-004 readiness brief incomplete + failing controls present)
AFFECTED_PRODUCT_JOURNEY: MMM framework upload/generate → review page → compile action → compile success/error handling → legacy framework workspace handoff → framework_id preservation
FAILED_AFFECTED_GATES:
- MMM Live Dashboard Diagnosis / Verify Mode A/B/C (run 26023472267, job 76490920440)
- Preflight Evidence Gate / preflight/product-delivery-gates (run 26023472188, job 76490688039)
- Preflight Evidence Gate / preflight/iaa-final-assurance (run 26023472188, job 76490687830)
- Preflight Evidence Gate / preflight/scope-declaration-parity (run 26023472188, job 76490687825)
- POLC Boundary Validation / builder-involvement-check (run 26023472288, job 76490687942)
- POLC Boundary Validation / foreman-implementation-check (run 26023472288, job 76490688002)
CONTROL_RESULT: REJECTED_BACK_TO_PRODUCER (equivalent STOP_AND_FIX posture)
HANDOVER_ALLOWED: no
REQUIRED_NEXT_ACTION: remediate all failed affected gates, re-run gates to PASS, then re-submit for assurance cycle.

## IAA invocation

IAA_FINAL_ASSURANCE: CURRENT_STATE_ASSESSED_AT_HEAD_SHA_2f26f0f1d1c985b644588a9bd94ac485c11feff6
AFFECTED_JOURNEY_REVIEWED: MMM review page Compile CTA → legacy workspace redirect (/assessment/framework?framework_id=<id>) across Mode A/B/C
MODE_A_B_C_VERIFICATION_STATUS: FAIL — Mode A/B/C compile success/error banner timed out; FUNCTIONAL_PASS: no (run 26023472267, job 76490920440)
PRODUCT_DELIVERY_GATE_STATUS: FAIL — Functional delivery evidence missing (.functional-delivery/pr-1653.md) (run 26023472188, job 76490688039)
SCOPE_DECLARATION_STATUS: FAIL — missing .agent-admin/scope-declarations/pr-1653.md (run 26023472188, job 76490687825)
POLC_STATUS: FAIL — builder-involvement-check and foreman-implementation-check both failed (run 26023472288, jobs 76490687942, 76490688002)
IAA_VERDICT: REJECTION-PACKAGE (STOP_AND_FIX)
HANDOVER_ALLOWED: no
REQUIRED_NEXT_ACTION: add missing functional-delivery evidence + per-PR scope declaration + current PR-specific IAA final assurance token + resolve POLC role/delegation evidence; then re-invoke IAA final assurance.

## Producer-side gate inspection

PRODUCER_SIDE_GATE_INSPECTION:
CURRENT_HEAD_SHA: 2f26f0f1d1c985b644588a9bd94ac485c11feff6
AFFECTED_GATES_RUN_OR_INSPECTED:
- gate: MMM Live Dashboard Diagnosis / Verify Mode A/B/C
  status: FAIL
  evidence: https://github.com/APGI-cmy/maturion-isms/actions/runs/26023472267/job/76490920440
- gate: Preflight Evidence Gate / preflight/product-delivery-gates
  status: FAIL
  evidence: https://github.com/APGI-cmy/maturion-isms/actions/runs/26023472188/job/76490688039
- gate: Preflight Evidence Gate / preflight/iaa-final-assurance
  status: FAIL
  evidence: https://github.com/APGI-cmy/maturion-isms/actions/runs/26023472188/job/76490687830
- gate: Preflight Evidence Gate / preflight/scope-declaration-parity
  status: FAIL
  evidence: https://github.com/APGI-cmy/maturion-isms/actions/runs/26023472188/job/76490687825
- gate: POLC Boundary Validation / builder-involvement-check
  status: FAIL
  evidence: https://github.com/APGI-cmy/maturion-isms/actions/runs/26023472288/job/76490687942
- gate: POLC Boundary Validation / foreman-implementation-check
  status: FAIL
  evidence: https://github.com/APGI-cmy/maturion-isms/actions/runs/26023472288/job/76490688002
FAILED_AFFECTED_GATES:
- Verify Mode A/B/C
- preflight/product-delivery-gates
- preflight/iaa-final-assurance
- preflight/scope-declaration-parity
- builder-involvement-check
- foreman-implementation-check
REPAIR_WITHIN_AGENT_AUTHORITY: yes
RESULT: STOP_AND_FIX
HANDOVER_ALLOWED: no

## Injection compliance report

INJECTION_COMPLIANCE_REPORT:
INJECTION_SOURCE: CS2 comment on PR #1653
REQUIRED_INSTRUCTIONS_EXTRACTED:
- invoke ECAP before product fixes
- invoke IAA before product fixes
- inspect affected product journey gates
- do not claim handover while affected gates are failing
- classify failed affected gates as STOP_AND_FIX unless outside authority/sandbox
FAILED_AFFECTED_GATES:
- Verify Mode A/B/C
- preflight/product-delivery-gates
- preflight/iaa-final-assurance
- preflight/scope-declaration-parity
- builder-involvement-check
- foreman-implementation-check
UNCHECKED_REQUIRED_ITEMS: none
UNAUTHORIZED_DEVIATIONS: none
RESULT: STOP_AND_FIX
HANDOVER_ALLOWED: no

## Source excerpts used in inspection

- Verify Mode A/B/C log excerpts: MODE_A_RESULT/ MODE_B_RESULT/ MODE_C_RESULT timeouts and FUNCTIONAL_PASS: no from run 26023472267 job 76490920440.
- preflight/scope-declaration-parity excerpt: "Per-PR scope declaration not found. Expected: .agent-admin/scope-declarations/pr-1653.md".
- preflight/iaa-final-assurance excerpt: "No current PR-specific IAA final assurance token found in .agent-admin/assurance/".
- preflight/product-delivery-gates excerpt: "Functional delivery evidence missing. Required default path: .functional-delivery/pr-1653.md".
- builder-involvement-check excerpt: "S-023 GATE FAIL — No IAA pre-brief artifact found.".
- foreman-implementation-check excerpt: "POLC GATE FAIL — UNRESOLVED ROLE".
