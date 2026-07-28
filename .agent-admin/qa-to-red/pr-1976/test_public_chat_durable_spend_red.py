"""QA contract for durable APW paid-call spend controls.

The same assertions that proved RED in PR #1976 must now pass against the
separately authorised runtime implementation. They make no network calls and do
not mutate any live environment.
"""

from __future__ import annotations

from pathlib import Path

from services.public_chat import PublicChatService


REPO_ROOT = Path(__file__).resolve().parents[3]
GATEWAY_ROOT = REPO_ROOT / "apps" / "mat-ai-gateway"
PUBLIC_CHAT_SOURCE = GATEWAY_ROOT / "services" / "public_chat.py"
ROUTER_SOURCE = GATEWAY_ROOT / "routers" / "ai_routes.py"
READINESS_RECORD = PUBLIC_CHAT_SOURCE


def _source(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def test_no_process_local_counter_as_authoritative_budget():
    source = _source(PUBLIC_CHAT_SOURCE)
    assert "self._paid_call_count" not in source, (
        "APW-RED-PAID-001: process-local _paid_call_count remains the "
        "authoritative budget and resets on restart or replica replacement"
    )


def test_shared_usage_store_interface_exists():
    service = PublicChatService()
    assert hasattr(service, "_usage_store"), (
        "APW-RED-PAID-002: shared persistent usage-store interface is absent"
    )


def test_atomic_call_reservation_interface_exists():
    service = PublicChatService()
    assert hasattr(service, "_reserve_paid_call"), (
        "APW-RED-PAID-003: atomic paid-call reservation is absent"
    )


def test_atomic_token_reservation_interface_exists():
    service = PublicChatService()
    assert hasattr(service, "_reserve_and_reconcile_tokens"), (
        "APW-RED-PAID-004: atomic token reservation and reconciliation is absent"
    )


def test_budget_state_is_external_to_service_instance():
    service = PublicChatService()
    instance_fields = set(vars(service))
    assert "_usage_day" not in instance_fields and "_paid_call_count" not in instance_fields, (
        "APW-RED-PAID-005: budget state is stored on the service instance and is not restart-safe"
    )


def test_budget_control_is_shared_across_instances():
    first = PublicChatService()
    second = PublicChatService()
    first_store = getattr(first, "_usage_store", None)
    second_store = getattr(second, "_usage_store", None)
    assert first_store is not None and first_store is second_store, (
        "APW-RED-PAID-006: workers/replicas do not share one durable budget authority"
    )


def test_privacy_safe_client_rate_limiter_exists():
    service = PublicChatService()
    assert hasattr(service, "_client_rate_limiter"), (
        "APW-RED-PAID-007: privacy-safe anonymous-client rate limiter is absent"
    )


def test_shared_circuit_breaker_interface_exists():
    service = PublicChatService()
    assert hasattr(service, "_shared_circuit_breaker"), (
        "APW-RED-PAID-008: shared fail-closed circuit breaker is absent"
    )


def test_provider_failure_reconciliation_interface_exists():
    service = PublicChatService()
    assert hasattr(service, "_reconcile_failed_provider_call"), (
        "APW-RED-PAID-009: provider-failure reservation reconciliation is absent"
    )


def test_durable_call_limit_containment_reason_defined():
    source = _source(PUBLIC_CHAT_SOURCE)
    assert "durable_daily_call_limit_reached" in source, (
        "APW-RED-PAID-010: durable call-limit containment reason is absent"
    )


def test_durable_token_limit_containment_reason_defined():
    source = _source(PUBLIC_CHAT_SOURCE)
    assert "durable_daily_token_limit_reached" in source, (
        "APW-RED-PAID-011: durable token-limit containment reason is absent"
    )


def test_client_rate_limit_containment_reason_defined():
    source = _source(PUBLIC_CHAT_SOURCE)
    assert "client_rate_limit_reached" in source, (
        "APW-RED-PAID-012: client-rate-limit containment reason is absent"
    )


def test_circuit_open_containment_reason_defined():
    source = _source(PUBLIC_CHAT_SOURCE)
    assert "paid_call_circuit_open" in source, (
        "APW-RED-PAID-013: circuit-open containment reason is absent"
    )


def test_route_safe_durable_budget_telemetry_contract_exists():
    source = _source(ROUTER_SOURCE)
    required_fields = (
        "budget_day",
        "reserved_calls",
        "reserved_tokens",
        "circuit_state",
        "rate_limit_bucket",
    )
    missing = [field for field in required_fields if field not in source]
    assert not missing, (
        "APW-RED-PAID-014: route-safe durable budget telemetry fields are absent: "
        + ", ".join(missing)
    )


def test_provider_budget_evidence_gate_exists():
    source = _source(READINESS_RECORD)
    assert "PROVIDER_BUDGET_EVIDENCE_VERIFIED" in source, (
        "APW-RED-PAID-015: provider-side budget evidence gate is not defined"
    )


def test_paid_call_observation_window_contract_exists():
    source = _source(READINESS_RECORD)
    assert "PAID_CALL_OBSERVATION_WINDOW_APPROVED" in source, (
        "APW-RED-PAID-016: bounded paid-call observation-window contract is not defined"
    )
