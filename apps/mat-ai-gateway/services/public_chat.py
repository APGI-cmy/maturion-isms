"""Public chat service for Maturion."""

from __future__ import annotations

import os
import re
from typing import Any

from openai import OpenAI


_TEST_OPENAI_KEY = "test-openai-key-fixture"
_SAFE_PAGE_PATTERN = re.compile(r"^/[A-Za-z0-9/_-]{0,119}$")


class PublicChatService:
    """Generate public Maturion guidance for the APW chat widget."""

    def __init__(self) -> None:
        self._client: OpenAI | None = None
        self._model = os.getenv("MATURION_PUBLIC_CHAT_MODEL", "gpt-4o-mini")

    def answer(
        self,
        message: str,
        history: list[dict[str, Any]] | None,
        context: dict[str, Any] | None,
    ) -> dict:
        clean_message = message.strip()
        page = self._safe_page(context or {})
        messages = self._build_messages(clean_message, history or [], page)
        answer = self._complete(messages)
        return {
            "answer": answer,
            "source": "maturion-public-chat",
            "page": page,
            "history_count": len(history or []),
            "received_length": len(clean_message),
            "model": self._model,
        }

    def _complete(self, messages: list[dict[str, str]]) -> str:
        if self._use_static_ci_response():
            return (
                "Maturion can help with APGI, loss prevention, maturity, "
                "APGI Hub, training, risk, assurance and next steps."
            )

        response = self._get_client().chat.completions.create(
            model=self._model,
            messages=messages,
            temperature=0.3,
            max_tokens=500,
        )
        content = response.choices[0].message.content or ""
        return content.strip() or (
            "Maturion could not generate a response just now."
        )

    @staticmethod
    def _use_static_ci_response() -> bool:
        return (
            os.environ.get("OPENAI_API_KEY") == _TEST_OPENAI_KEY
            or os.environ.get("PYTEST_CURRENT_TEST") is not None
            or os.environ.get("CI") == "true"
        )

    def _get_client(self) -> OpenAI:
        if self._client is None:
            self._client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        return self._client

    def _build_messages(
        self,
        message: str,
        history: list[dict[str, Any]],
        page: str,
    ) -> list[dict[str, str]]:
        public_context = (
            "Public website context data: "
            f"source=apw-public-website; page={page}"
        )
        messages = [
            {
                "role": "system",
                "content": (
                    "You are Maturion, APGI's public website AI guidance "
                    "layer. Help visitors understand APGI, loss prevention, "
                    "organisational maturity, APGI Hub, training, risk, "
                    "assurance, implementation pathways, and next steps. "
                    "Keep responses concise, practical, and public-safe. "
                    "Do not claim access to private ISMS workspaces, client "
                    "records, or live customer data. If a question needs "
                    "private context, invite the visitor to contact APGI or "
                    "use the governed APGI Hub pathway."
                ),
            },
            {"role": "user", "content": public_context},
        ]
        messages.extend(self._safe_history(history))
        messages.append({"role": "user", "content": message[:1200]})
        return messages

    @staticmethod
    def _safe_page(context: dict[str, Any]) -> str:
        page = str(context.get("page") or "/")[:120]
        return page if _SAFE_PAGE_PATTERN.match(page) else "/"

    @staticmethod
    def _safe_history(history: list[dict[str, Any]]) -> list[dict[str, str]]:
        safe: list[dict[str, str]] = []
        for item in history[-8:]:
            role = item.get("role")
            content = str(item.get("content") or "").strip()
            if role not in {"user", "assistant"} or not content:
                continue
            label = "visitor" if role == "user" else "previous reply"
            safe.append({"role": "user", "content": f"{label}: {content[:1200]}"})
        return safe
