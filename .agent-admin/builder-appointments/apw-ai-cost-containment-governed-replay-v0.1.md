# Builder Appointment — APW AI Cost Containment Governed Replay v0.1

**Appointment ID**: APW-AI-COST-CONTAINMENT-GOVERNED-REPLAY-001  
**Authority**: CS2 — Johan Ras  
**PR**: #1967  
**Branch**: `apw-ai-cost-containment-governed-replay-v01`  
**Prebrief commit**: `64cf00df21d90c4d2941ba1d8491f72ccbca0256`

## Appointment

The builder is appointed to replay the bounded APW public-chat cost-containment remediation after PR #1966 failed delegation-order governance.

## In scope

- default-off paid public-chat model calls;
- zero paid model calls when APW integration is disabled;
- zero paid model calls for private and restricted requests;
- explicit paid-call enablement gate;
- `gpt-4o-mini` allowlist enforcement;
- output-token and process-local daily-call ceilings;
- safe numeric usage telemetry;
- regression tests proving containment;
- operator configuration documentation.

## Out of scope

- production activation;
- environment mutation;
- provider migration beyond public-chat containment;
- new retrieval or data sources;
- changing Maturion final-response authority.

## Mandatory controls

1. Implementation may begin only after this appointment commit.
2. `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false` must cause zero paid model calls.
3. Restricted requests must cause zero paid model calls.
4. Paid calls require `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=true`.
5. Only `gpt-4o-mini` may be selected by this runtime.
6. Telemetry must exclude prompt and answer content.
7. No production or environment change may be included.

## Handover evidence

- implementation commit after this appointment;
- regression-test commit;
- PR-scoped delegation order;
- green governance, security and deployment checks;
- full proxy review before merge.
