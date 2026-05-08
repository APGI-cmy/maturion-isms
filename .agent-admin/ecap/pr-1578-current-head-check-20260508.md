# ECAP Current-Head Gate Snapshot — PR #1578

CURRENT_HEAD_SHA: d7ef408dda70bc9d59b899be1822fc6403618f40
PASSING_CHECKS:
- preflight/evidence-exactness
- preflight/ecap-admin-ceremony
- preflight/mmm-pr-admin
- preflight/gate-changing-pr-rule
- preflight/phase-1-evidence
- preflight/iaa-prebrief-existence
- preflight/hfmc-ripple-presence
- POLC Boundary Validation / scope-declaration-check
- POLC Boundary Validation / session-memory-check

FAILING_CHECKS:
- handover-claim/check-current-head
- preflight/product-delivery-gates
- preflight/scope-declaration-parity
- preflight/iaa-final-assurance
- POLC Boundary Validation / foreman-implementation-check
- POLC Boundary Validation / builder-involvement-check

PENDING_CHECKS:
- Addressing comment on PR #1578 (dynamic workflow run still in progress when snapshot captured)

MISSING_CHECKS:
- none

HANDOVER_ALLOWED: no
HANDOVER_STATE: STOP_AND_FIX
RCA_REQUIRED: yes
