"""Focused tests for APW durable paid-call spend controls."""

from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import pytest

from services.durable_spend import (
    InMemoryDurableSpendStore,
    SpendDecision,
    SupabaseRpcDurableSpendStore,
    privacy_safe_client_bucket,
)
from services.public_chat import PublicChatService


PUBLIC_CONTEXT = {
    "source": "apw-public-website",
    "page": "/apw",
    "client_request_id": "trusted-peer",
}


def _reserve(
    store: InMemoryDurableSpendStore,
    *,
    client: str = "client-a",
    call_limit: int = 5,
    token_limit: int = 5000,
    estimated_tokens: int = 100,
    client_limit: int = 5,
):
    return store.reserve(
        budget_day="2026-07-28",
        client_bucket=client,
        call_limit=call_limit,
        token_limit=token_limit,
        estimated_tokens=estimated_tokens,
        client_limit=client_limit,
    )


def test_concurrent_reservations_cannot_exceed_call_limit():
    store = InMemoryDurableSpendStore()
    with ThreadPoolExecutor(max_workers=20) as executor:
        decisions = list(
            executor.map(
                lambda _: _reserve(
                    store,
                    client="shared-client",
                    call_limit=5,
                    client_limit=20,
                ),
                range(20),
            )
        )
    permitted = [decision for decision in decisions if decision.permitted]
    blocked = [decision for decision in decisions if not decision.permitted]
    assert len(permitted) == 5
    assert len(blocked) == 15
    assert {
        decision.reason for decision in blocked
    } == {"durable_daily_call_limit_reached"}


def test_atomic_token_reservation_prevents_overspend():
    store = InMemoryDurableSpendStore()
    first = _reserve(
        store,
        estimated_tokens=300,
        token_limit=500,
    )
    second = _reserve(
        store,
        estimated_tokens=300,
        token_limit=500,
    )
    assert first.permitted is True
    assert second.permitted is False
    assert second.reason == "durable_daily_token_limit_reached"


def test_client_limit_does_not_consume_global_budget_when_blocked():
    store = InMemoryDurableSpendStore()
    first = _reserve(store, client_limit=1)
    second = _reserve(store, client_limit=1)
    other = _reserve(store, client="client-b", client_limit=1)
    assert first.permitted is True
    assert second.reason == "client_rate_limit_reached"
    assert other.permitted is True
    assert other.reserved_calls == 2


def test_provider_failure_releases_reservation_and_opens_circuit():
    store = InMemoryDurableSpendStore()
    for _ in range(3):
        decision = _reserve(store)
        assert decision.permitted is True
        assert decision.reservation_id is not None
        store.reconcile_failure(decision.reservation_id)
    blocked = _reserve(store)
    assert blocked.permitted is False
    assert blocked.reason == "paid_call_circuit_open"
    assert blocked.reserved_calls == 0
    assert blocked.reserved_tokens == 0


def test_failure_releases_client_bucket_capacity():
    store = InMemoryDurableSpendStore()
    first = _reserve(store, client_limit=1)
    assert first.reservation_id is not None
    store.reconcile_failure(first.reservation_id)
    second = _reserve(store, client_limit=1)
    assert second.permitted is True


def test_success_resets_consecutive_failure_streak():
    store = InMemoryDurableSpendStore()
    for _ in range(2):
        failed = _reserve(store)
        assert failed.reservation_id is not None
        store.reconcile_failure(failed.reservation_id)
    succeeded = _reserve(store)
    assert succeeded.reservation_id is not None
    store.reconcile_success(succeeded.reservation_id, 20)
    failed_after_success = _reserve(store)
    assert failed_after_success.reservation_id is not None
    store.reconcile_failure(failed_after_success.reservation_id)
    next_decision = _reserve(store)
    assert next_decision.permitted is True


def test_success_reconciles_estimate_to_actual_usage():
    store = InMemoryDurableSpendStore()
    decision = _reserve(store, estimated_tokens=300)
    assert decision.reservation_id is not None
    store.reconcile_success(decision.reservation_id, 42)
    next_decision = _reserve(store, estimated_tokens=100)
    assert next_decision.reserved_tokens == 142


def test_unknown_or_duplicate_reconciliation_fails_closed():
    store = InMemoryDurableSpendStore()
    with pytest.raises(RuntimeError):
        store.reconcile_success("missing", 1)
    decision = _reserve(store)
    assert decision.reservation_id is not None
    store.reconcile_failure(decision.reservation_id)
    with pytest.raises(RuntimeError):
        store.reconcile_failure(decision.reservation_id)


def test_supabase_adapter_rejects_unreconciled_rpc(monkeypatch):
    store = SupabaseRpcDurableSpendStore(
        "https://example.supabase.co",
        "test-service-key",
    )
    monkeypatch.setattr(
        store,
        "_rpc",
        lambda *args, **kwargs: {"reconciled": False},
    )
    with pytest.raises(RuntimeError):
        store.reconcile_success("reservation", 10)
    with pytest.raises(RuntimeError):
        store.reconcile_failure("reservation")


def test_privacy_safe_bucket_is_keyed_and_non_reversible(monkeypatch):
    monkeypatch.setenv(
        "MATURION_PUBLIC_CHAT_CLIENT_HASH_SECRET",
        "unit-test-secret",
    )
    raw_identifier = "203.0.113.55|browser-value"
    bucket = privacy_safe_client_bucket(raw_identifier)
    assert len(bucket) == 24
    assert raw_identifier not in bucket
    assert "203.0.113.55" not in bucket
    assert bucket == privacy_safe_client_bucket(raw_identifier)


class CapturingStore(InMemoryDurableSpendStore):
    def __init__(self) -> None:
        super().__init__()
        self.estimated_tokens = 0

    def reserve(self, **kwargs) -> SpendDecision:
        self.estimated_tokens = int(kwargs["estimated_tokens"])
        return SpendDecision(
            False,
            "durable_daily_token_limit_reached",
            None,
            str(kwargs["budget_day"]),
            0,
            0,
            "closed",
            str(kwargs["client_bucket"]),
        )


def test_runtime_reserves_prompt_and_completion_upper_bound(monkeypatch):
    monkeypatch.setenv("APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED", "true")
    monkeypatch.setenv("MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED", "true")
    monkeypatch.setenv(
        "MATURION_PUBLIC_CHAT_CLIENT_HASH_SECRET",
        "unit-test-secret",
    )
    store = CapturingStore()
    service = PublicChatService(usage_store=store)
    result = service.answer(
        "How does APW onboarding work?",
        [{"role": "user", "content": "Earlier context"}],
        PUBLIC_CONTEXT,
    )
    assert result["containment_reason"] == "durable_daily_token_limit_reached"
    assert store.estimated_tokens > service._max_output_tokens


def test_router_does_not_trust_forwarded_for_header():
    router_source = (
        Path(__file__).resolve().parents[1] / "routers" / "ai_routes.py"
    ).read_text(encoding="utf-8")
    assert "x-forwarded-for" not in router_source.lower()
