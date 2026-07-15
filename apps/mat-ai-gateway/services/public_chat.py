"""Public chat service for Maturion."""

from __future__ import annotations

import os
import re
from typing import Any

from openai import OpenAI

from services.apw_specialist_stubs import APWSpecialistRedTestStubs


_TEST_OPENAI_KEY = "test-openai-key-fixture"
_SAFE_PAGE_PATTERN = re.compile(r"^/[A-Za-z0-9/_-]{0,119}$")
_APW_INTEGRATION_FLAG = "APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED"


class PublicChatService:
    """Generate public Maturion guidance for the APW chat widget."""

    def __init__(self) -> None:
        self._client: OpenAI | None = None
        self._model = os.getenv("MATURION_PUBLIC_CHAT_MODEL", "gpt-4o-mini")
        self._apw_specialist = APWSpecialistRedTestStubs()

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
        messages = self._build_messages(clean_message, history or [], page, apw_result)
        answer = self._complete(messages, apw_result)
        return {
            "answer": answer,
            "source": "maturion-public-chat",
            "page": page,
            "history_count": len(history or []),
            "received_length": len(clean_message),
            "model": self._model,
            "apw_specialist_route": apw_result.get("route"),
        }

    def _complete(
        self,
        messages: list[dict[str, str]],
        apw_result: dict[str, Any] | None = None,
    ) -> str:
        if self._use_static_test_response():
            route = apw_result.get("route") if apw_result else None
            if route == "apw_specialist_internal_draft_candidate":
                return self._static_apw_specialist_response(apw_result or {})
            return (
                "Maturion can help with APGI, loss prevention, maturity, "
                "APGI Hub, training, risk, assurance and next steps."
            )

        try:
            response = self._get_client().chat.completions.create(
                model=self._model,
                messages=messages,
                temperature=0.3,
                max_tokens=500,
            )
        except Exception as exc:
            raise RuntimeError("public chat runtime unavailable") from exc
        content = response.choices[0].message.content or ""
        return content.strip() or (
            "Maturion could not generate a response just now."
        )

    @staticmethod
    def _use_static_test_response() -> bool:
        return (
            os.environ.get("OPENAI_API_KEY") == _TEST_OPENAI_KEY
            or os.environ.get("PYTEST_CURRENT_TEST") is not None
        )

    @staticmethod
    def _apw_integration_enabled() -> bool:
        return os.environ.get(_APW_INTEGRATION_FLAG, "").strip().lower() in {
            "1",
            "true",
            "yes",
            "on",
        }

    def _get_client(self) -> OpenAI:
        if self._client is None:
            self._client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        return self._client

    def _build_messages(
        self,
        message: str,
        history: list[dict[str, Any]],
        page: str,
        apw_result: dict[str, Any] | None = None,
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
                    "use the governed APGI Hub pathway. Maturion always "
                    "provides the final public answer."
                ),
            },
            {"role": "user", "content": public_context},
        ]
        if apw_result and apw_result.get("draft"):
            messages.append(
                {
                    "role": "user",
                    "content": self._apw_draft_context(apw_result),
                }
            )
        messages.extend(self._safe_history(history))
        messages.append({"role": "user", "content": message[:1200]})
        return messages

    def _try_apw_specialist_route(
        self,
        message: str,
        page: str,
        context: dict[str, Any],
    ) -> dict[str, Any]:
        if not self._apw_integration_enabled():
            return {"route": "apw_integration_disabled"}
        if not self._is_public_apw_question(message, page, context):
            return {"route": "maturion_only"}

        result = self._apw_specialist.build_internal_draft(
            message,
            self._public_apw_context_envelope(),
            self._public_apw_registry_record(),
            [self._public_apw_source(page)],
        )
        decision = result["route_decision"]
        result["route"] = decision.route
        return result

    @staticmethod
    def _is_public_apw_question(
        message: str,
        page: str,
        context: dict[str, Any],
    ) -> bool:
        lower = f"{message} {page} {context.get('source', '')}".lower()
        public_terms = (
            "apw",
            "apgi",
            "onboarding",
            "public website",
            "demo",
            "hub",
            "maturion",
        )
        private_terms = (
            "tenant audit",
            "customer configuration",
            "incident evidence",
            "investigation record",
            "internal governance",
            "environment variable",
            "environment-variable",
            "env var",
            "credential",
            "api key",
            "access token",
            "service token",
            "bearer token",
            "token",
            "password",
            "secret",
            "internal configuration",
            "configuration detail",
            "cs2 approval",
            "runtime registry internals",
        )
        return any(term in lower for term in public_terms) and not any(
            term in lower for term in private_terms
        )

    @staticmethod
    def _public_apw_context_envelope() -> dict[str, Any]:
        return {
            "app": "APW",
            "embodiment": "public-web",
            "permission_scope": "public",
            "user": {
                "authenticated": False,
                "id": None,
                "organisation_id": None,
                "tenant_id": None,
            },
            "knowledge_scope": {
                "subject_allowed": True,
                "app_context_allowed": True,
                "framework_context_allowed": False,
                "tenant_context_allowed": False,
                "memory_allowed": False,
            },
        }

    @staticmethod
    def _public_apw_registry_record() -> dict[str, Any]:
        return {
            "runtime_agent_id": "apw-specialist",
            "status": "ACTIVE",
            "orchestrator": "maturion",
            "allowed_apps": ["APW"],
            "allowed_embodiments": ["public-web"],
            "allowed_permission_scopes": ["public"],
            "allowed_knowledge_planes": ["subject", "app_context", "user_session"],
        }

    @staticmethod
    def _public_apw_source(page: str) -> dict[str, Any]:
        return {
            "source_id": f"apw-public-website:{page}",
            "visibility": "public",
            "public_safe": True,
            "retrieval_allowed": True,
            "requires_authentication": False,
            "requires_tenant_match": False,
            "tenant_id": None,
            "status": "current",
        }

    @staticmethod
    def _apw_draft_context(apw_result: dict[str, Any]) -> str:
        draft = apw_result.get("draft") or {}
        points = "; ".join(str(item) for item in draft.get("answer_points", []))
        source_limitations = draft.get("source_limitations", [])
        limitations = "; ".join(str(item) for item in source_limitations)
        notes = "; ".join(str(item) for item in draft.get("safety_notes", []))
        return (
            "Internal APW draft support for Maturion final synthesis: "
            f"points={points}; limitations={limitations}; safety={notes}"
        )[:1200]

    @staticmethod
    def _static_apw_specialist_response(apw_result: dict[str, Any]) -> str:
        draft = apw_result.get("draft") or {}
        points = draft.get("answer_points") or []
        fallback = "APW can explain public APGI pathways."
        first_point = str(points[0]) if points else fallback
        return (
            f"Maturion final answer: {first_point} "
            "This response is based on public APW information only and is "
            "not an activation decision."
        )

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
