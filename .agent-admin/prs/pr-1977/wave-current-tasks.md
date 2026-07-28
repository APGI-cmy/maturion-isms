# PR #1977 Wave Current Tasks

PR: #1977
WAVE: APW-DURABLE-PAID-CALL-RUNTIME-IMPLEMENTATION-V01
STATUS: IMPLEMENTED_TO_GREEN — QP_ECAP_PASS — FINAL_IAA_PASS — GOVERNANCE_PATH_NORMALIZED — MERGE_GATE_RERUN_REQUIRED
CS2_AUTHORITY: Johan Ras
CS2_DECISION: AUTHORISE_APW_DURABLE_PAID_CALL_RUNTIME_IMPLEMENTATION_WAVE
DATE: 2026-07-28

IAA_PREFLIGHT_PATH: .agent-admin/assurance/iaa-prebrief-apw-durable-paid-call-runtime-v01.md
IAA_PREFLIGHT_COMMIT: 47b9ef55322fcfbf68be31fe972e976ce25bb552
BUILDER_APPOINTMENT_PATH: .agent-admin/builder-appointments/apw-durable-paid-call-runtime-v0.1.md
BUILDER_APPOINTMENT_COMMIT: 53ed397d3af85325e9ed544ec48b922474b5648c
RUNTIME_CORE_COMMIT: 648a61977e03b3908c5515b10717e5618b93f0a0
GATE_DETECTED_FIRST_IMPLEMENTATION_COMMIT: ed54be17febbc14b8f8dcef41706fe4c3c8066b8
QP_ECAP_COMMIT: 5f78b1c84bd91688d2eecc0dc4729ca748a0a2fb
FINAL_IAA_COMMIT: f8bbf983e703a13163c4d8e24f0b5093fc26c0af
FINAL_IAA_PATH: .agent-admin/assurance/iaa-wave-record-apw-durable-paid-call-runtime-pr-1977-final-20260728.md
FINAL_IAA_TOKEN: IAA-APW-DURABLE-PAID-CALL-RUNTIME-1977-20260728-PASS
REVIEW_REMEDIATION_IAA_PATH: .agent-admin/assurance/iaa-token-apw-durable-paid-call-runtime-pr-1977-review-remediation-20260728.md
REVIEW_REMEDIATION_IAA_TOKEN: IAA-APW-DURABLE-PAID-CALL-RUNTIME-1977-REVIEW-20260728-PASS
GOVERNANCE_ARTIFACT_PATH_REPAIR: 74e32f42b8b812c12450116d8e5c78b64535303b

## Authorised sequence

1. Commit this PR-scoped task set.
2. Commit the canonical independent IAA pre-flight brief.
3. Appoint the bounded runtime builder only after the prebrief exists.
4. Implement the durable usage authority, atomic reservations, privacy-safe client limiter, shared circuit breaker, provider-failure reconciliation and safe telemetry in later commits.
5. Add migration and deployment artefacts without applying them to any live environment.
6. Build APW-RED-PAID-001..016 to GREEN.
7. Preserve all existing public-chat regression tests and zero-cost containment behaviour.
8. Complete Foreman QP and ECAP evidence.
9. Freeze the implementation head and obtain independent final IAA.
10. Normalize assurance artifact paths when the Merge Gate Interface path taxonomy rejects legacy assurance filenames.
11. Return to CS2 before deployment, infrastructure mutation or paid-call activation.

## Active tasks

- [x] Record explicit CS2 authorisation.
- [x] Confirm PR #1976 merged with final IAA PASS.
- [x] Confirm production remains in zero-cost containment mode.
- [x] Confirm `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false` remains mandatory.
- [x] Commit canonical independent IAA prebrief.
- [x] Appoint bounded runtime builder.
- [x] Implement shared persistent usage authority and atomic reservation flow.
- [x] Implement privacy-safe per-client limiter and shared fail-closed circuit breaker.
- [x] Implement provider-failure reconciliation and route-safe telemetry.
- [x] Add unapplied database migration and operator configuration contract.
- [x] Build APW-RED-PAID-001..016 to GREEN.
- [x] Run the full existing gateway regression suite.
- [x] Complete QP and ECAP.
- [x] Obtain independent final IAA.
- [x] Normalize final IAA evidence into one approved `iaa-wave-record-*` path.
- [x] Normalize review-remediation IAA evidence into an approved `iaa-token-*` path.
- [ ] Rerun exact-head merge gates after governance artifact path repair.

## Runtime delivery requirements

- one shared durable budget authority across restarts, workers and replicas;
- atomic call and token reservation before provider invocation;
- durable daily call and token ceilings;
- privacy-safe anonymous-client rate limiting using non-reversible keyed hashes;
- shared fail-closed circuit breaker;
- provider-failure reservation reconciliation;
- safe containment reasons for call, token and circuit limits;
- telemetry limited to non-sensitive budget metadata;
- provider-budget evidence and bounded observation-window gates;
- no raw prompt, answer, IP address, credential, secret, token or environment value in logs.

## Strict boundary

This wave authorises repository implementation only. It does not authorise applying a migration, changing Supabase, Render, Vercel or OpenAI configuration, deploying any branch, enabling paid calls, accessing private or tenant data, broadening the model allowlist or changing Maturion final public-response authority.

The required live state remains:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```
