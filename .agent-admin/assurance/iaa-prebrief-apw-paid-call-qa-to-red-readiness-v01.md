# IAA Pre-Flight Brief — APW Paid-Call QA-to-RED Readiness v0.1

IAA_PREFLIGHT_BRIEF
PR: #1976
WAVE: APW-PAID-CALL-QA-TO-RED-READINESS-V01
BRANCH: apw-paid-call-readiness-v01
WAVE_TASKS_PATH: .agent-admin/prs/pr-1976/wave-current-tasks.md
WAVE_TASKS_COMMIT: 19d037b20f3a710c5ee26ad8d417d356d6f1faa6
CURRENT_HEAD_SHA: GITHUB_PR_HEAD_SHA
AUTHORITY: CS2 — Johan Ras
CS2_DECISION: AUTHORISE_APW_PAID_CALL_QA_TO_RED_READINESS_WAVE
DATE: 2026-07-27

## Expected QA scope

- Prove paid calls remain impossible unless the explicit paid-call flag is enabled.
- Prove the current process-local counter is not accepted as the final production budget control.
- Define executable RED contracts for a shared persistent usage ledger.
- Define executable RED contracts for atomic call and token reservation under concurrency.
- Prove limits remain effective across process restart, worker replacement and multiple replicas.
- Define per-client anonymous abuse controls without logging raw IP addresses, prompts or answers.
- Define a durable fail-closed circuit breaker shared across workers.
- Define provider-failure behaviour that records failure and safely releases or reconciles reservations.
- Define route-safe telemetry for call-limit, token-limit, client-rate-limit and circuit-open containment.
- Preserve all existing zero-call privacy paths, the `gpt-4o-mini` allowlist, output ceilings and Maturion final-response authority.

## Expected RED cases

- No durable shared usage store or atomic reservation interface exists.
- Restarting a process resets the effective call budget.
- Parallel workers can each spend the full local limit.
- Concurrent requests can race past call or token ceilings.
- Anonymous clients have no bounded request window.
- The circuit breaker is local, absent or fail-open.
- Provider errors leave inaccurate budget state or permit uncontrolled retry cost.
- Telemetry lacks safe durable budget fields or leaks sensitive content.
- Existing privacy and zero-token containment paths regress.

## Stop conditions

- Stop if any test or fixture enables real paid model calls.
- Stop if live Render, Vercel, Supabase or OpenAI settings are changed.
- Stop if production or staging data is mutated.
- Stop if tests weaken the private-request classifier, model allowlist or output ceiling.
- Stop if tests log raw prompts, answers, credentials, secrets, bearer tokens or raw client identifiers.
- Stop if QA work implements the production runtime instead of specifying the missing contract.
- Stop if an implementation builder is appointed before independent IAA passes this QA lane.

## Foreman instructions

- Enforce task set → IAA prebrief → QA-builder appointment → QA contract/tests order.
- Appoint only a bounded `qa-builder` for executable RED coverage and fixtures.
- Keep `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false` throughout this wave.
- Require one-to-one traceability from each RED ID to an executable test.
- Require RED failures to result from absent durable capability, not syntax, import, environment or fixture defects.
- Require existing public-chat regression tests to remain GREEN.
- Obtain independent final IAA before proposing any runtime-builder appointment.

## IAA will QA

- commit ancestry and delegation order;
- complete RED inventory and one-to-one executable mapping;
- restart, concurrency, replica, per-client and circuit-breaker coverage;
- safe reservation and provider-failure semantics;
- zero harness failures and preserved GREEN regression;
- no infrastructure, environment or production mutation;
- no paid call enablement;
- preservation of privacy routing and Maturion authority.

RESULT: PREFLIGHT_BRIEF_COMPLETE
