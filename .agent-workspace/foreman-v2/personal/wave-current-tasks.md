# Wave Current Tasks — F-D3-002 JWT Bearer Remediation

wave: wave-f-d3-002-jwt-bearer-remediation-20260407
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-wave-f-d3-002-jwt-bearer-remediation-20260407.md

## Active Wave: wave-f-d3-002-jwt-bearer-remediation-20260407

### Wave Description
Security remediation wave. Addressing finding F-D3-002 from audit CL-11-D3:
The JWT Bearer auth path on POST /api/ai/feedback/approve accepts any 3-part token
without signature or identity verification. Remediation: Remove JWT Bearer path entirely,
require x-arc-token exclusively (Option B).

CS2 Authorization: Issue #1272 opened by @APGI-cmy (CS2) and assigns foreman-v2-agent.
Issue title: "[Remediation] POST /api/ai/feedback/approve — enforce CS2 identity on JWT Bearer path (F-D3-002)"
Audit artifact: .agent-workspace/audit/CL-11-D3-arc-approval-403-audit-20260405.md

### Tasks
- [x] T-01: IAA Pre-Brief invoked — PHASE_B_BLOCKING (not exempt, code changes)
- [x] T-02: IAA pre-brief artifact committed: .agent-admin/assurance/iaa-prebrief-wave-f-d3-002-jwt-bearer-remediation-20260407.md
- [x] T-03: wave-current-tasks.md updated for this wave
- [x] T-04: api-builder delegated to implement security fix (commit a25f310)
- [x] T-05: QP evaluation of builder deliverable — PASS (3/3 GREEN)
- [x] T-06: PREHANDOVER proof written: .agent-admin/prehandover/PREHANDOVER_PROOF_session-057-wave-f-d3-002-20260407.md
- [x] T-07: IAA Phase 2-4 audit token received: IAA-session-057-wave-f-d3-002-jwt-bearer-remediation-20260407-PASS
- [x] T-08: Merge gate released — awaiting CS2 (@APGI-cmy) merge approval

### Wave Category
BUILD_DELIVERABLE — security remediation to AI Centre API endpoint.
Changes: api/ai/feedback/approve.ts (remove JWT Bearer path), api/ai/feedback/approve.test.ts (add 403 test for JWT Bearer)
