# APW Paid-Call Durable Spend QA-to-RED Inventory v0.1

**Artifact ID**: APW-PAID-CALL-DURABLE-SPEND-RED-001  
**Version**: 0.1.0  
**Status**: EXECUTABLE RED CONTRACT  
**Authority**: CS2 — Johan Ras  
**PR**: #1976  
**Repository**: `APGI-cmy/maturion-isms`  
**Last Updated**: 2026-07-27

## Contract boundary

These tests specify the missing durable safeguards required before paid APW public-chat calls may be considered. They do not authorise implementation, infrastructure changes or paid calls.

## One-to-one executable inventory

| RED ID | Required future capability | Executable test |
|---|---|---|
| APW-RED-PAID-001 | No process-local counter may be the authoritative budget | `test_no_process_local_counter_as_authoritative_budget` |
| APW-RED-PAID-002 | Shared persistent usage-store interface | `test_shared_usage_store_interface_exists` |
| APW-RED-PAID-003 | Atomic call reservation before provider invocation | `test_atomic_call_reservation_interface_exists` |
| APW-RED-PAID-004 | Atomic token reservation and reconciliation | `test_atomic_token_reservation_interface_exists` |
| APW-RED-PAID-005 | Restart-safe daily budget state | `test_budget_state_is_external_to_service_instance` |
| APW-RED-PAID-006 | Multi-worker/replica-safe shared enforcement | `test_budget_control_is_shared_across_instances` |
| APW-RED-PAID-007 | Privacy-safe per-client rate limiting | `test_privacy_safe_client_rate_limiter_exists` |
| APW-RED-PAID-008 | Shared fail-closed circuit breaker | `test_shared_circuit_breaker_interface_exists` |
| APW-RED-PAID-009 | Provider failure releases/reconciles reservation | `test_provider_failure_reconciliation_interface_exists` |
| APW-RED-PAID-010 | Durable call-limit containment reason | `test_durable_call_limit_containment_reason_defined` |
| APW-RED-PAID-011 | Durable token-limit containment reason | `test_durable_token_limit_containment_reason_defined` |
| APW-RED-PAID-012 | Client-rate-limit containment reason | `test_client_rate_limit_containment_reason_defined` |
| APW-RED-PAID-013 | Circuit-open containment reason | `test_circuit_open_containment_reason_defined` |
| APW-RED-PAID-014 | Durable telemetry includes reservation/budget identifiers without sensitive content | `test_route_safe_durable_budget_telemetry_contract_exists` |
| APW-RED-PAID-015 | Provider-side budget evidence gate before enablement | `test_provider_budget_evidence_gate_exists` |
| APW-RED-PAID-016 | Bounded production observation-window contract | `test_paid_call_observation_window_contract_exists` |

## Expected current result

All 16 cases must be collected and must fail because the durable capability is not yet implemented.

Harness failures are prohibited. The run must contain no syntax errors, import failures, missing fixture failures, network calls or live environment dependencies.

## Existing GREEN regression

The existing public-chat test suite remains authoritative for:

- integration-disabled zero-call behaviour;
- restricted-request zero-call behaviour;
- paid calls default-off;
- `gpt-4o-mini` allowlisting;
- output-token clamping;
- process-local limit behaviour as an interim containment control;
- safe telemetry without prompt or answer content.

Those existing tests must remain GREEN while this new durable-control suite remains RED.
