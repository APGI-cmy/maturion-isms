# Builder Appointment — APW AI Cost Containment and Model Routing v0.1

**Appointment ID**: APW-AI-COST-CONTAINMENT-BUILDER-001  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-07-23  
**Branch**: `apw-ai-cost-containment-model-routing-v01`

## Appointment

The builder is appointed to implement a bounded remediation for the public Maturion/APW chat runtime.

## In scope

- default-off paid public-chat model calls;
- zero-cost static responses when APW integration is disabled;
- zero-cost static responses for private, confidential, client, customer, account, record, token, credential, secret and internal-configuration requests;
- strict low-cost model allowlisting;
- output-token and daily-call ceilings;
- safe numeric usage telemetry;
- regression tests proving containment paths perform zero paid model calls;
- operator configuration documentation.

## Out of scope

- production activation;
- changing any Render, Vercel or Supabase environment;
- enabling paid calls;
- adding new data sources or retrieval capabilities;
- altering Maturion final-response authority;
- broad provider migration beyond the public-chat containment boundary.

## Mandatory controls

1. `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false` must result in zero paid public-chat model calls.
2. Restricted requests must result in zero paid public-chat model calls.
3. Paid calls must require explicit `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=true`.
4. Only approved low-cost model identifiers may be used.
5. Telemetry must never include prompt or answer content.
6. No production change may be included in the PR.

## Handover evidence

- passing unit and regression tests;
- changed-file review;
- CI and governance gate results;
- explicit confirmation that no environment was changed.
