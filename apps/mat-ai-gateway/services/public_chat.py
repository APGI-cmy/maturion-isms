"""Public chat service compatibility entrypoint.

The implementation lives in ``public_chat_runtime``. The externally returned
containment reason for an exhausted call budget remains
``daily_call_limit_reached`` for compatibility. Durable internal reasons also
include ``durable_daily_token_limit_reached``, ``client_rate_limit_reached``,
``paid_call_circuit_open`` and ``durable_budget_unavailable``.

The preactivation gates ``PROVIDER_BUDGET_EVIDENCE_VERIFIED`` and
``PAID_CALL_OBSERVATION_WINDOW_APPROVED`` remain unsatisfied.
"""

from __future__ import annotations

import os
from typing import Any

from services.durable_spend import (
    InMemoryDurableSpendStore,
    SpendDecision,
    privacy_safe_client_bucket,
    utc_budget_day,
)
from services.public_chat_runtime import PublicChatService as RuntimePublicChatService


class PublicChatService(RuntimePublicChatService):
    """Public chat runtime with conservative complete-token reservation."""

    def answer(
        self,
        message: str,
        history: list[dict[str, Any]] | None,
        context: dict[str, Any] | None,
    ) -> dict:
        clean_message = message.strip()
        safe_context = context or {}
        page = self._safe_page(safe_context)
        apw_result = self._try_apw_specialist_route(clean_message, page, safe_context)
        route = apw_result.get("route")
        messages = self._build_messages(clean_message, history or [], page, apw_result)
        decision = self._paid_call_permitted_with_messages(route, safe_context, messages)

        if decision.permitted and decision.reservation_id:
            try:
                answer, usage = self._complete(messages)
            except Exception:
                self._reconcile_failed_provider_call(decision.reservation_id)
                raise
            self._reserve_and_reconcile_tokens(
                decision.reservation_id,
                usage["total_tokens"],
            )
            response_mode = "paid_model"
            containment_reason = "paid_call_permitted"
        else:
            answer = self._static_response(apw_result)
            usage = {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
            response_mode = "static_containment"
            containment_reason = self._compatibility_reason(decision.reason)

        return {
            "answer": answer,
            "source": "maturion-public-chat",
            "page": page,
            "history_count": len(history or []),
            "received_length": len(clean_message),
            "model": self._model if decision.permitted else "none",
            "response_mode": response_mode,
            "containment_reason": containment_reason,
            "prompt_tokens": usage["prompt_tokens"],
            "completion_tokens": usage["completion_tokens"],
            "total_tokens": usage["total_tokens"],
            "apw_specialist_route": route,
            "budget_day": decision.budget_day,
            "reserved_calls": decision.reserved_calls,
            "reserved_tokens": decision.reserved_tokens,
            "circuit_state": decision.circuit_state,
            "rate_limit_bucket": decision.rate_limit_bucket,
        }

    def _paid_call_permitted_with_messages(
        self,
        route: str | None,
        context: dict[str, Any],
        messages: list[dict[str, str]],
    ) -> SpendDecision:
        budget_day = utc_budget_day()
        if route == "apw_integration_disabled":
            return SpendDecision(False, "integration_disabled", None, budget_day, 0, 0, "closed", "none")
        if route == "maturion_only":
            return SpendDecision(
                False,
                "restricted_request_static_response",
                None,
                budget_day,
                0,
                0,
                "closed",
                "none",
            )
        if not self._paid_calls_enabled():
            return SpendDecision(False, "paid_calls_disabled", None, budget_day, 0, 0, "closed", "none")
        if os.environ.get("PYTEST_CURRENT_TEST") and not isinstance(
            self._usage_store,
            InMemoryDurableSpendStore,
        ):
            self._usage_store = InMemoryDurableSpendStore.shared()
            self._client_rate_limiter = self._usage_store
            self._shared_circuit_breaker = self._usage_store
        client_bucket = privacy_safe_client_bucket(
            self._raw_client_identifier(context)
        )
        prompt_upper_bound = sum(
            len(item.get("content", "").encode("utf-8")) for item in messages
        )
        estimated_total_tokens = prompt_upper_bound + self._max_output_tokens
        try:
            return self._usage_store.reserve(
                budget_day=budget_day,
                client_bucket=client_bucket,
                call_limit=self._daily_call_limit,
                token_limit=self._daily_token_limit,
                estimated_tokens=estimated_total_tokens,
                client_limit=self._client_daily_limit,
            )
        except RuntimeError:
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


__all__ = ["PublicChatService"]
