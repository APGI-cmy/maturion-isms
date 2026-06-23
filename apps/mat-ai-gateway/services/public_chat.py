"""Public chat service for Maturion."""

from __future__ import annotations

from typing import Any


class PublicChatService:
    """Generate a bounded public response for the APW chat widget."""

    def answer(
        self,
        message: str,
        history: list[dict[str, Any]] | None,
        context: dict[str, Any] | None,
    ) -> dict:
        clean_message = message.strip()
        page = str((context or {}).get("page") or "/")[:120]
        history_count = len(history or [])
        answer = (
            "Maturion can help with APGI, loss prevention, maturity, APGI Hub, "
            "training, risk, assurance and next steps. Your question was received. "
            "For detailed engagement support, please contact APGI."
        )
        return {
            "answer": answer,
            "source": "maturion-public-chat",
            "page": page,
            "history_count": history_count,
            "received_length": len(clean_message),
        }
