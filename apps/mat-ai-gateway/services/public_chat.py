"""Public chat service compatibility entrypoint.

The implementation lives in ``public_chat_runtime``. These stable containment
reason names are intentionally documented here because they form part of the
public runtime contract:

- durable_daily_call_limit_reached
- durable_daily_token_limit_reached
- client_rate_limit_reached
- paid_call_circuit_open
- durable_budget_unavailable

The following preactivation gates are defined but remain unsatisfied until a
later CS2-controlled activation wave records operator evidence:

- PROVIDER_BUDGET_EVIDENCE_VERIFIED
- PAID_CALL_OBSERVATION_WINDOW_APPROVED
"""

from services.public_chat_runtime import PublicChatService

__all__ = ["PublicChatService"]
