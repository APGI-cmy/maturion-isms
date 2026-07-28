"""Durable, fail-closed spend controls for APW public chat.

The production adapter delegates reservation and reconciliation operations to
atomic PostgreSQL RPCs. The in-memory adapter exists only for deterministic
unit tests and shares state across service instances in the current process.
No prompt, answer, raw client identifier, credential, or secret is persisted.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import threading
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Protocol


@dataclass(frozen=True)
class SpendDecision:
    permitted: bool
    reason: str
    reservation_id: str | None
    budget_day: str
    reserved_calls: int
    reserved_tokens: int
    circuit_state: str
    rate_limit_bucket: str


class DurableSpendStore(Protocol):
    def reserve(
        self,
        *,
        budget_day: str,
        client_bucket: str,
        call_limit: int,
        token_limit: int,
        estimated_tokens: int,
        client_limit: int,
    ) -> SpendDecision: ...

    def reconcile_success(
        self,
        reservation_id: str,
        actual_tokens: int,
    ) -> None: ...

    def reconcile_failure(self, reservation_id: str) -> None: ...


class InMemoryDurableSpendStore:
    """Thread-safe shared adapter for tests only."""

    _shared: "InMemoryDurableSpendStore | None" = None
    _shared_lock = threading.Lock()

    @classmethod
    def shared(cls) -> "InMemoryDurableSpendStore":
        with cls._shared_lock:
            if cls._shared is None:
                cls._shared = cls()
            return cls._shared

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._days: dict[str, dict[str, object]] = {}
        self._sequence = 0

    def reset(self) -> None:
        with self._lock:
            self._days.clear()
            self._sequence = 0

    def reserve(
        self,
        *,
        budget_day: str,
        client_bucket: str,
        call_limit: int,
        token_limit: int,
        estimated_tokens: int,
        client_limit: int,
    ) -> SpendDecision:
        with self._lock:
            state = self._days.setdefault(
                budget_day,
                {
                    "calls": 0,
                    "tokens": 0,
                    "clients": {},
                    "circuit": "closed",
                    "reservations": {},
                    "failures": 0,
                },
            )
            calls = int(state["calls"])
            tokens = int(state["tokens"])
            clients = state["clients"]
            assert isinstance(clients, dict)
            circuit = str(state["circuit"])
            client_count = int(clients.get(client_bucket, 0))

            if circuit != "closed":
                return self._decision(
                    False,
                    "paid_call_circuit_open",
                    None,
                    budget_day,
                    state,
                    client_bucket,
                )
            if client_count >= client_limit:
                return self._decision(
                    False,
                    "client_rate_limit_reached",
                    None,
                    budget_day,
                    state,
                    client_bucket,
                )
            if calls >= call_limit:
                return self._decision(
                    False,
                    "durable_daily_call_limit_reached",
                    None,
                    budget_day,
                    state,
                    client_bucket,
                )
            if tokens + estimated_tokens > token_limit:
                return self._decision(
                    False,
                    "durable_daily_token_limit_reached",
                    None,
                    budget_day,
                    state,
                    client_bucket,
                )

            self._sequence += 1
            reservation_id = f"mem-{budget_day}-{self._sequence}"
            state["calls"] = calls + 1
            state["tokens"] = tokens + estimated_tokens
            clients[client_bucket] = client_count + 1
            reservations = state["reservations"]
            assert isinstance(reservations, dict)
            reservations[reservation_id] = {
                "estimated_tokens": estimated_tokens,
                "client_bucket": client_bucket,
            }
            return self._decision(
                True,
                "paid_call_permitted",
                reservation_id,
                budget_day,
                state,
                client_bucket,
            )

    def reconcile_success(
        self,
        reservation_id: str,
        actual_tokens: int,
    ) -> None:
        with self._lock:
            state, reserved, _ = self._find_reservation(reservation_id)
            if state is None:
                raise RuntimeError("unknown or reconciled spend reservation")
            state["tokens"] = max(
                0,
                int(state["tokens"]) - reserved + max(0, actual_tokens),
            )
            state["failures"] = 0
            reservations = state["reservations"]
            assert isinstance(reservations, dict)
            reservations.pop(reservation_id, None)

    def reconcile_failure(self, reservation_id: str) -> None:
        with self._lock:
            state, reserved, client_bucket = self._find_reservation(
                reservation_id
            )
            if state is None or client_bucket is None:
                raise RuntimeError("unknown or reconciled spend reservation")
            state["calls"] = max(0, int(state["calls"]) - 1)
            state["tokens"] = max(0, int(state["tokens"]) - reserved)
            clients = state["clients"]
            assert isinstance(clients, dict)
            clients[client_bucket] = max(
                0,
                int(clients.get(client_bucket, 0)) - 1,
            )
            state["failures"] = int(state["failures"]) + 1
            if int(state["failures"]) >= 3:
                state["circuit"] = "open"
            reservations = state["reservations"]
            assert isinstance(reservations, dict)
            reservations.pop(reservation_id, None)

    def _find_reservation(
        self,
        reservation_id: str,
    ) -> tuple[dict[str, object] | None, int, str | None]:
        for state in self._days.values():
            reservations = state["reservations"]
            assert isinstance(reservations, dict)
            record = reservations.get(reservation_id)
            if isinstance(record, dict):
                return (
                    state,
                    int(record["estimated_tokens"]),
                    str(record["client_bucket"]),
                )
        return None, 0, None

    @staticmethod
    def _decision(
        permitted: bool,
        reason: str,
        reservation_id: str | None,
        budget_day: str,
        state: dict[str, object],
        client_bucket: str,
    ) -> SpendDecision:
        return SpendDecision(
            permitted=permitted,
            reason=reason,
            reservation_id=reservation_id,
            budget_day=budget_day,
            reserved_calls=int(state["calls"]),
            reserved_tokens=int(state["tokens"]),
            circuit_state=str(state["circuit"]),
            rate_limit_bucket=client_bucket,
        )


class SupabaseRpcDurableSpendStore:
    """Production adapter using server-side atomic PostgreSQL RPCs."""

    def __init__(
        self,
        base_url: str,
        service_role_key: str,
        timeout_seconds: float = 5.0,
    ) -> None:
        self._base_url = base_url.rstrip("/")
        self._service_role_key = service_role_key
        self._timeout_seconds = timeout_seconds

    def reserve(
        self,
        *,
        budget_day: str,
        client_bucket: str,
        call_limit: int,
        token_limit: int,
        estimated_tokens: int,
        client_limit: int,
    ) -> SpendDecision:
        payload = self._rpc(
            "apw_reserve_paid_call",
            {
                "p_budget_day": budget_day,
                "p_client_bucket": client_bucket,
                "p_call_limit": call_limit,
                "p_token_limit": token_limit,
                "p_estimated_tokens": estimated_tokens,
                "p_client_limit": client_limit,
            },
        )
        return SpendDecision(
            permitted=bool(payload.get("permitted")),
            reason=str(
                payload.get("reason") or "durable_budget_unavailable"
            ),
            reservation_id=payload.get("reservation_id"),
            budget_day=str(payload.get("budget_day") or budget_day),
            reserved_calls=int(payload.get("reserved_calls") or 0),
            reserved_tokens=int(payload.get("reserved_tokens") or 0),
            circuit_state=str(payload.get("circuit_state") or "open"),
            rate_limit_bucket=client_bucket,
        )

    def reconcile_success(
        self,
        reservation_id: str,
        actual_tokens: int,
    ) -> None:
        payload = self._rpc(
            "apw_reconcile_paid_call_success",
            {
                "p_reservation_id": reservation_id,
                "p_actual_tokens": max(0, actual_tokens),
            },
        )
        self._require_reconciled(payload)

    def reconcile_failure(self, reservation_id: str) -> None:
        payload = self._rpc(
            "apw_reconcile_paid_call_failure",
            {"p_reservation_id": reservation_id},
        )
        self._require_reconciled(payload)

    @staticmethod
    def _require_reconciled(payload: dict[str, object]) -> None:
        if payload.get("reconciled") is not True:
            raise RuntimeError("durable spend reservation was not reconciled")

    def _rpc(
        self,
        function_name: str,
        payload: dict[str, object],
    ) -> dict[str, object]:
        request = urllib.request.Request(
            f"{self._base_url}/rest/v1/rpc/{function_name}",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self._service_role_key}",
                "apikey": self._service_role_key,
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(
                request,
                timeout=self._timeout_seconds,
            ) as response:
                decoded = json.loads(response.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, ValueError) as exc:
            raise RuntimeError(
                "durable spend authority unavailable"
            ) from exc
        if isinstance(decoded, list):
            decoded = decoded[0] if decoded else {}
        if not isinstance(decoded, dict):
            raise RuntimeError("invalid durable spend authority response")
        return decoded


class UnavailableDurableSpendStore:
    """Fail-closed adapter used when deployed configuration is incomplete."""

    def reserve(self, **kwargs: object) -> SpendDecision:
        budget_day = str(kwargs.get("budget_day") or utc_budget_day())
        client_bucket = str(
            kwargs.get("client_bucket") or "unavailable"
        )
        return SpendDecision(
            False,
            "durable_budget_unavailable",
            None,
            budget_day,
            0,
            0,
            "open",
            client_bucket,
        )

    def reconcile_success(
        self,
        reservation_id: str,
        actual_tokens: int,
    ) -> None:
        raise RuntimeError("durable spend authority unavailable")

    def reconcile_failure(self, reservation_id: str) -> None:
        raise RuntimeError("durable spend authority unavailable")


def build_usage_store() -> DurableSpendStore:
    is_test = (
        os.environ.get("PYTEST_CURRENT_TEST") is not None
        or os.environ.get("OPENAI_API_KEY") == "test-openai-key-fixture"
    )
    if is_test:
        return InMemoryDurableSpendStore.shared()
    base_url = os.environ.get("SUPABASE_URL", "").strip()
    service_key = os.environ.get(
        "SUPABASE_SERVICE_ROLE_KEY",
        "",
    ).strip()
    if base_url and service_key:
        return SupabaseRpcDurableSpendStore(base_url, service_key)
    return UnavailableDurableSpendStore()


def privacy_safe_client_bucket(raw_identifier: str) -> str:
    secret = os.environ.get(
        "MATURION_PUBLIC_CHAT_CLIENT_HASH_SECRET",
        "",
    ).encode("utf-8")
    if not secret:
        secret = (
            b"test-only-client-hash-key"
            if os.environ.get("PYTEST_CURRENT_TEST")
            else b""
        )
    if not secret or not raw_identifier.strip():
        return "unavailable"
    digest = hmac.new(
        secret,
        raw_identifier.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return digest[:24]


def utc_budget_day() -> str:
    return datetime.now(timezone.utc).date().isoformat()
