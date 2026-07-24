"""Public chat service for Maturion."""

from __future__ import annotations

import os
import re
from datetime import date
from typing import Any

from openai import OpenAI

from services.apw_request_policy import requires_private_context
from services.apw_specialist_stubs import APWSpecialistRedTestStubs


_TEST_OPENAI_KEY = "test-openai-key-fixture"
_SAFE_PAGE_PATTERN = re.compile(r"^/[A-Za-z0-9/_-]{0,119}$")
_APW_INTEGRATION_FLAG = "APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED"
_PAID_CALLS_FLAG = "MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED"
_MODEL_ENV = "MATURION_PUBLIC_CHAT_MODEL"
_MAX_OUTPUT_ENV = "MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS"
_DAILY_CALL_LIMIT_ENV = "MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT"
_ALLOWED_MODELS = {"gpt-4o-mini"}
_DEFAULT_MODEL = "gpt-4o-mini"
_DEFAULT_MAX_OUTPUT_TOKENS = 300
_MAX_ALLOWED_OUTPUT_TOKENS = 500
_DEFAULT_DAILY_CALL_LIMIT = 100


class PublicChatService:
    """Generate public Maturion guidance for the APW chat widget."""

    def __init__(self) -> None:
        self._client: OpenAI | None = None
        self._model = self._resolve_model()
        self._max_output_tokens = self._resolve_max_output_tokens()
        self._daily_call_limit = self._resolve_daily_call_limit()
        self._usage_day = date.today()
        self._paid_call_count = 0
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
        route = apw_result.get("route")

        paid_call_permitted, containment_reason = self._paid_call_permitted(route)
        if paid_call_permitted:
            messages = self._build_messages(clean_message, history or [], page, apw_result)
            answer, usage = self._complete(messages)
            self._record_paid_call()
            response_mode = "paid_model"
        else:
            answer = self._static_response(apw_result)
            usage = {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
            response_mode = "static_containment"

        return {
            "answer": answer,
            "source": "maturion-public-chat",
            "page": page,
            "history_count": len(history or []),
            "received_length": len(clean_message),
            "model": self._model if paid_call_permitted else "none",
            "response_mode": response_mode,
            "containment_reason": containment_reason,
            "prompt_tokens": usage["prompt_tokens"],
            "completion_tokens": usage["completion_tokens"],
            "total_tokens": usage["total_tokens"],
            "apw_specialist_route": route,
        }

    def _complete(self, messages: list[dict[str, str]]) -> tuple[str, dict[str, int]]:
        if self._use_static_test_response():
            return (
                "Maturion can help with APGI, loss prevention, maturity, APGI Hub, "
                "training, risk, assurance and next steps.",
                {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
            )

        try:
            response = self._get_client().chat.completions.create(
                model=self._model,
                messages=messages,
                temperature=0.3,
                max_tokens=self._max_output_tokens,
            )
        except Exception as exc:
            raise RuntimeError("public chat runtime unavailable") from exc

        content = response.choices[0].message.content or ""
        usage_obj = getattr(response, "usage", None)
        usage = {
            "prompt_tokens": int(getattr(usage_obj, "prompt_tokens", 0) or 0),
            "completion_tokens": int(getattr(usage_obj, "completion_tokens", 0) or 0),
            "total_tokens": int(getattr(usage_obj, "total_tokens", 0) or 0),
        }
        return (
            content.strip() or "Maturion could not generate a response just now.",
            usage,
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

    @staticmethod
    def _paid_calls_enabled() -> bool:
        return os.environ.get(_PAID_CALLS_FLAG, "").strip().lower() in {
            "1",
            "true",
            "yes",
            "on",
        }

    @staticmethod
    def _resolve_model() -> str:
        requested = os.environ.get(_MODEL_ENV, _DEFAULT_MODEL).strip()
        return requested if requested in _ALLOWED_MODELS else _DEFAULT_MODEL

    @staticmethod
    def _resolve_max_output_tokens() -> int:
        raw = os.environ.get(_MAX_OUTPUT_ENV, str(_DEFAULT_MAX_OUTPUT_TOKENS))
        try:
            value = int(raw)
        except ValueError:
            value = _DEFAULT_MAX_OUTPUT_TOKENS
        return max(1, min(value, _MAX_ALLOWED_OUTPUT_TOKENS))

    @staticmethod
    def _resolve_daily_call_limit() -> int:
        raw = os.environ.get(_DAILY_CALL_LIMIT_ENV, str(_DEFAULT_DAILY_CALL_LIMIT))
        try:
            value = int(raw)
        except ValueError:
            value = _DEFAULT_DAILY_CALL_LIMIT
        return max(0, value)

    def _paid_call_permitted(self, route: str | None) -> tuple[bool, str]:
        if route == "apw_integration_disabled":
            return False, "integration_disabled"
        if route == "maturion_only":
            return False, "restricted_request_static_response"
        if not self._paid_calls_enabled():
            return False, "paid_calls_disabled"
        if not self._within_daily_budget():
            return False, "daily_call_limit_reached"
        return True, "paid_call_permitted"

    def _within_daily_budget(self) -> bool:
        today = date.today()
        if today != self._usage_day:
            self._usage_day = today
            self._paid_call_count = 0
        return self._paid_call_count < self._daily_call_limit

    def _record_paid_call(self) -> None:
        self._paid_call_count += 1

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
                    "You are Maturion, APGI's public website AI guidance layer. "
                    "Help visitors understand APGI, loss prevention, organisational "
                    "maturity, APGI Hub, training, risk, assurance, implementation "
                    "pathways, and next steps. Keep responses concise, practical, "
                    "and public-safe. Do not claim access to private ISMS workspaces, "
                    "client records, or live customer data. If a question needs private "
                    "context, invite the visitor to contact APGI or use the governed "
                    "APGI Hub pathway. Maturion always provides the final public answer."
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
        return any(term in lower for term in public_terms) and not requires_private_context(
            message
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
    def _static_response(apw_result: dict[str, Any]) -> str:
        route = apw_result.get("route")
        if route == "maturion_only":
            return (
                "Maturion cannot access or disclose private, client, customer, account, "
                "record, credential, token, secret, or internal configuration information. "
                "Please contact APGI directly or use the governed APGI Hub pathway."
            )
        if route == "apw_specialist_internal_draft_candidate":
            draft = apw_result.get("draft") or {}
            points = draft.get("answer_points") or []
            first_point = str(points[0]) if points else "APW can explain public APGI pathways."
            return (
                f"Maturion final answer: {first_point} This response is based on public "
                "APW information only and is not an activation decision."
            )
        return (
            "Maturion can provide public guidance about APGI, training, risk, assurance, "
            "organisational maturity, and the APGI Hub."
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
