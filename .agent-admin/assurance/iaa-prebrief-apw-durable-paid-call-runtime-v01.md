# Independent IAA Pre-Flight Brief — APW Durable Paid-Call Runtime v0.1

IAA_PREFLIGHT_BRIEF
PR: #1977
WAVE: APW-DURABLE-PAID-CALL-RUNTIME-IMPLEMENTATION-V01
BRANCH: apw-durable-paid-call-runtime-v01
WAVE_TASKS_PATH: .agent-admin/prs/pr-1977/wave-current-tasks.md
WAVE_TASKS_COMMIT: e107208f6408f90ef42efc466af891f89d9aabb3
CURRENT_HEAD_SHA: GITHUB_PR_HEAD_SHA
AUTHORITY: CS2 — Johan Ras
CS2_DECISION: AUTHORISE_APW_DURABLE_PAID_CALL_RUNTIME_IMPLEMENTATION_WAVE
DATE: 2026-07-28

## Expected implementation scope

- Replace the process-local paid-call counter as authoritative budget control.
- Provide a shared durable usage-store abstraction backed by PostgreSQL/Supabase RPC in deployed environments and a deterministic in-memory test adapter only for isolated tests.
- Reserve call and estimated token capacity atomically before provider invocation.
- Reconcile actual usage after success and release or record reservations after provider failure.
- Enforce daily call and token limits across restarts, workers and replicas.
- Enforce privacy-safe anonymous-client request limits through keyed, non-reversible client fingerprints.
- Provide a shared fail-closed circuit breaker.
- Return deterministic static containment when durable controls are unavailable or a limit is reached.
- Emit route-safe numeric and categorical telemetry only.
- Preserve all existing restricted-request, flag-off, model allowlist, output ceiling and Maturion final-answer controls.
- Add an unapplied SQL migration and operator configuration contract.

## Required GREEN outcomes

- `APW-RED-PAID-001..016` pass.
- Existing public-chat and full gateway tests remain GREEN.
- No test makes a live provider call or mutates a live environment.
- Missing or invalid durable-store configuration fails closed while paid calls remain disabled by default.
- Concurrent reservation tests prove call and token ceilings cannot be overspent.
- Restart and multiple-service-instance tests prove shared state.
- Provider failure tests prove reservations are reconciled safely.
- Telemetry tests prove prompts, answers, raw client identifiers, credentials and secrets are absent.

## Stop conditions

- Stop if paid calls are enabled in any environment.
- Stop if a migration or infrastructure change is applied live.
- Stop if implementation requires service-role credentials in client-visible code.
- Stop if a raw IP address, prompt, answer, credential, secret or bearer token can enter logs or persisted budget records.
- Stop if budget enforcement is process-local, race-prone or fail-open.
- Stop if restricted/private routing or Maturion final public-response authority changes.
- Stop if the model allowlist expands beyond `gpt-4o-mini`.
- Stop if provider budget evidence or observation-window approval is represented as already granted.

## IAA will QA

- strict task set → prebrief → builder appointment → first implementation ancestry;
- correctness of the persistent schema and atomic RPC semantics;
- fail-closed behaviour when the durable authority is unavailable;
- concurrency, restart, worker and replica safety;
- client privacy and keyed hashing;
- provider-failure reconciliation;
- safe telemetry and no sensitive persistence;
- complete RED-to-GREEN traceability;
- regression preservation;
- no deployment, environment mutation or paid-call activation.

## Foreman instructions

- Appoint one bounded runtime builder only after this prebrief commit.
- Keep migration creation and runtime implementation in commits after appointment.
- Keep `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false` throughout this PR.
- Require an explicit operator handover for unapplied migration and secrets/configuration.
- Require QP, ECAP and independent final IAA before any deployment proposal.

RESULT: PREFLIGHT_BRIEF_COMPLETE
