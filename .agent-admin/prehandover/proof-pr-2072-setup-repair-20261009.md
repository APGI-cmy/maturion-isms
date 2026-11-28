# Preparatory evidence — PR2072 setup repair

STATUS: STOP_AND_FIX
AUTHOR: APGI-cmy via authorized Codex proxy
RECORDED_AT: 2026-10-09T06:54:11Z
SUBSTANTIVE_SOURCE_SHA: f0d4209541ce0addfef72753314cb1fbc459111e
PARENT_JOB: job-CS2-AUTOMATION-W1-W2-20261008
REVIEW_ASSIGNMENT: issue2073
TARGET_BRANCH: codex/clarify-copilot-setup-authority-20261008

This immutable publication snapshot is preparatory evidence. It does not authorize handover, ECAP admission, final IAA submission, merge, deployment or activation. The source SHA identifies the tested substantive tree before the administrative publication; the publication commit is recorded externally in the PR comment. Current-head acceptance must inspect the real administrative delta without adding commits to reproduce this document's own SHA.

## Source and behavioral validation
The reviewed source changes three files: legacy setup declaration removal, supported setup workflow declaration removal, and bot-writer comments. Foreman recorded task-source QP PASS at https://github.com/APGI-cmy/maturion-isms/pull/2074#issuecomment-6059955248.
Setup retains contents: read, workflow_dispatch, checkout and bootstrap validation. Bot-writer executable behavior is unchanged. This is not evidence that a provider grants protected-file authoring access.

Run37775683802/job113305806192 executed the setup workflow on the exact substantive SHA and branch:
https://github.com/APGI-cmy/maturion-isms/actions/runs/37775683802/job/113305806192
Live run, job steps and decoded logs were inspected before this publication. Checkout succeeded; dependencies resolved; syntax, 21-contract lookup/discovery, required agent IDs, server boot and SIGTERM checks passed; logs end with All tests passed.
The governance-main run37774890473 is not this submission's execution evidence.

## Gate inventory and status
gate_set_checked:
  - copilot-setup-steps
  - CodeQL
  - agent-contract/iaa-assurance-token
  - agent-contract/cs2-authorization
  - agent-contract/actor-authority
  - agent-contract/authority-check
  - watchdog/gap2-ready-pr-missing-prebrief
  - agent-contract-format/placeholder-check
  - agent-contract-format/yaml-validation
  - governance/alignment
  - agent-contract-format/verdict
  - merge-gate/verdict
  - agent-contract/self-modification-prevention
  - governance/artifact-path-enforcement
  - stop-and-fix/enforcement
  - producer/next-action-guidance
  - Supabase Preview
  - Vercel Preview Comments
  - Scan for deprecated Actions versions
  - watchdog/gap1-no-pr-for-branch
  - cs2/pit-controller
  - iaa-prebrief-gate
  - preflight/injection-intake-current
  - copilot/retry-stopped-sessions
  - Classify PR Type
  - agent-contract-format/detect
  - watchdog/canon-file-ceiling
  - watchdog/gap2a-prebrief-gate
  - watchdog/gap3-prehandover-pending-token
  - agent-contract/diff-report
  - session-memory-check
  - scope-declaration-check
  - foreman-implementation-check
  - wave-record-count-check
  - preflight/iaa-prebrief-contract-alignment
  - preflight/ecap-admin-boundary-gate
  - preflight/phase-1-evidence
  - Analyze (javascript-typescript)
  - builder-involvement-check
  - preflight/merge-gate-required-checks-alignment
  - Analyze (python)
  - preflight/delegation-order-gate
  - preflight/wave7-governance-validation
  - Test Quality / stub-detection-check
  - preflight/foreman-prehandover-lane-gate

The source API returned 50 check-run records; selecting the newest record for each exact name produces 45 names: 33 SUCCESS and 12 SKIPPED. Repeated historical records are not separate acceptance obligations. Skipped checks are not PASS. The JSON preserves these outcomes, exact IDs, SHA and links. No API-reported failed/pending check was present in this source snapshot; final administrative/assurance obligations remain unresolved.

| Named check | Actual conclusion | ID | Evidence |
|---|---|---|---|
| copilot-setup-steps | SUCCESS | 113305806192 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37775683802/job/113305806192) |
| CodeQL | SUCCESS | 113207567083 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/runs/113207567083) |
| agent-contract/iaa-assurance-token | SKIPPED | 113207376269 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933791/job/113207376269) |
| agent-contract/cs2-authorization | SKIPPED | 113207375488 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933791/job/113207375488) |
| agent-contract/actor-authority | SKIPPED | 113207375390 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933791/job/113207375390) |
| agent-contract/authority-check | SUCCESS | 113207374247 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933791/job/113207374247) |
| watchdog/gap2-ready-pr-missing-prebrief | SKIPPED | 113207370044 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933679/job/113207370044) |
| agent-contract-format/placeholder-check | SKIPPED | 113207359891 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933740/job/113207359891) |
| agent-contract-format/yaml-validation | SKIPPED | 113207358942 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933740/job/113207358942) |
| governance/alignment | SKIPPED | 113207358156 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933810/job/113207358156) |
| agent-contract-format/verdict | SUCCESS | 113207357813 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933740/job/113207357813) |
| merge-gate/verdict | SUCCESS | 113207356266 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933810/job/113207356266) |
| agent-contract/self-modification-prevention | SUCCESS | 113207356214 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933810/job/113207356214) |
| governance/artifact-path-enforcement | SUCCESS | 113207356180 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933810/job/113207356180) |
| stop-and-fix/enforcement | SUCCESS | 113207356110 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933810/job/113207356110) |
| producer/next-action-guidance | SKIPPED | 113207353851 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933705/job/113207353851) |
| Supabase Preview | SKIPPED | 113207340352 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/runs/113207340352) |
| Vercel Preview Comments | SUCCESS | 113207318382 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/runs/113207318382) |
| Scan for deprecated Actions versions | SUCCESS | 113207304077 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933687/job/113207304077) |
| watchdog/gap1-no-pr-for-branch | SKIPPED | 113207303763 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933679/job/113207303763) |
| cs2/pit-controller | SUCCESS | 113207303602 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933823/job/113207303602) |
| iaa-prebrief-gate | SKIPPED | 113207303471 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933721/job/113207303471) |
| preflight/injection-intake-current | SKIPPED | 113207303055 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933656/job/113207303055) |
| copilot/retry-stopped-sessions | SUCCESS | 113207302862 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933872/job/113207302862) |
| Classify PR Type | SUCCESS | 113207302553 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933810/job/113207302553) |
| agent-contract-format/detect | SUCCESS | 113207302394 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933740/job/113207302394) |
| watchdog/canon-file-ceiling | SUCCESS | 113207302346 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933679/job/113207302346) |
| watchdog/gap2a-prebrief-gate | SUCCESS | 113207302311 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933679/job/113207302311) |
| watchdog/gap3-prehandover-pending-token | SUCCESS | 113207301973 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933679/job/113207301973) |
| agent-contract/diff-report | SUCCESS | 113207301960 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933791/job/113207301960) |
| session-memory-check | SUCCESS | 113207300887 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933694/job/113207300887) |
| scope-declaration-check | SUCCESS | 113207300843 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933694/job/113207300843) |
| foreman-implementation-check | SUCCESS | 113207300841 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933694/job/113207300841) |
| wave-record-count-check | SUCCESS | 113207300763 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933694/job/113207300763) |
| preflight/iaa-prebrief-contract-alignment | SUCCESS | 113207300527 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933690/job/113207300527) |
| preflight/ecap-admin-boundary-gate | SUCCESS | 113207300512 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933634/job/113207300512) |
| preflight/phase-1-evidence | SUCCESS | 113207300443 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933656/job/113207300443) |
| Analyze (javascript-typescript) | SUCCESS | 113207300394 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933649/job/113207300394) |
| builder-involvement-check | SUCCESS | 113207300385 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933694/job/113207300385) |
| preflight/merge-gate-required-checks-alignment | SUCCESS | 113207300372 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933682/job/113207300372) |
| Analyze (python) | SUCCESS | 113207300217 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933649/job/113207300217) |
| preflight/delegation-order-gate | SUCCESS | 113207300094 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933636/job/113207300094) |
| preflight/wave7-governance-validation | SUCCESS | 113207300007 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933613/job/113207300007) |
| Test Quality / stub-detection-check | SUCCESS | 113207299860 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933549/job/113207299860) |
| preflight/foreman-prehandover-lane-gate | SUCCESS | 113207299706 | [actual job/check](https://github.com/APGI-cmy/maturion-isms/actions/runs/37745933578/job/113207299706) |

## Required-check mappings
Manifest: .agent-admin/control/merge-gate-required-checks.json.
Its six workflow-backed required names were observed SUCCESS. governance/alignment was SKIPPED, not accepted as PASS.
Retained names absent from this API snapshot:
- preflight/iaa-prebrief-existence
- preflight/iaa-token-self-certification
- preflight/hfmc-ripple-presence
- preflight/evidence-exactness
- preflight/iaa-final-assurance
- preflight/ecap-admin-ceremony
- preflight/scope-declaration-parity
- preflight/mmm-pr-admin

Those absent names are recorded as FAIL with explicit MISSING state in the canonical gate schema's summary, which permits PASS/FAIL/SKIPPED. The manifest retains legacy/external names pending mapping/validation; their absence must be reconciled by Foreman to actual controls/artifacts, not deleted or silently waived. A generic automated checkpoint that calls skipped or absent names passing is not final assurance.

## Schema validation provenance
Gate JSON shape comes from the canonical repository's executable schema:
https://github.com/APGI-cmy/maturion-foreman-governance/blob/68f3f0525060ec7115414af16b0931e54fae1344/governance/executable/schemas/gate_results.schema.json
Canonical schema blob: 9f8a5649f65f054a484fd10c090f5cae801fe999.
The consumer repository has evidence examples and requires schema validation but does not carry this gate-summary schema. Use this pinned canonical schema without modifying governance or accepting an incompatible ECAP-validation schema.
Canonical Draft7 schema validation passed locally with a date-time format checker. Exact scope comparison passed for nine paths using the repository script with a local Windows stdout CRLF-normalization adapter; the repository script was unchanged. An independent Python set comparison also passed. The policy language scan passed. These validations do not prove substantive QA or independent acceptance.

## Administrative admission and role boundaries
Scope/task/RCA/improvement records are part of this publication. ECAP acceptance and IAA record/token are absent. No Foreman-wide parity PASS is claimed, and no final control artifact is asserted.
The earlier IAA rejection and ECAP halt are retained through attributed reports at https://github.com/APGI-cmy/maturion-isms/pull/2074#issuecomment-6057903034. IAA must establish the canonical chronology truthfully; this later snapshot is not a pre-build pre-brief.
No role session ID is invented. Proxy publishing chat: 01a0c811-d0a9-7bc0-a4a8-a6957d7d4146.

## Deployment surface enumeration
The changed setup workflow bootstraps an ephemeral Linux validation environment; it does not deploy a product. The bot-writer has comment changes and is not executed by this repair. No deploy workflow, database, application API or frontend data hook changes; deployment checklist and data-wiring trace are inapplicable to this diff, subject to independent assessment.

## Ripple and cross-agent assessment
Copilot setup consumers: blanket declared session mode removed; actual authority continues to derive from selected contract and approved issue.
Read-constrained roles: no expansion of their permitted paths.
CodexAdvisor: setup execution does not prove provider authoring access.
Foreman/ECAP/IAA: existing supervisory, administrative and independent verdict ownership preserved.
Generic CS2 runtime and W1/W2 controls: not implemented or activated by this patch.

## Publication and further review
All six preparatory artifacts are published together on the existing source branch through an atomic commit/ref update. No assurance path is written by the proxy. Actual publication SHA and post-publication diff are recorded in the PR discussion after verification.
Foreman next assesses this changed bundle and resolves admission/mapping/chronology. ECAP then prepares within its workspace as applicable, and independent IAA assesses the actual submitted evidence after admission. A rejection keeps STOP_AND_FIX and repair ownership.
