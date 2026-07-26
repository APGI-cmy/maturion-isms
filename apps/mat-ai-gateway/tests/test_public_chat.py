"""Tests for the public Maturion chat endpoint."""

from __future__ import annotations

import logging
from types import SimpleNamespace

from services.public_chat import PublicChatService


APW_FLAG = "APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED"
PAID_CALLS_FLAG = "MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED"
MODEL_ENV = "MATURION_PUBLIC_CHAT_MODEL"
DAILY_LIMIT_ENV = "MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT"
MAX_OUTPUT_ENV = "MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS"
PUBLIC_CONTEXT = {"source": "apw-public-website", "page": "/apw"}


def test_public_chat_returns_static_answer_when_integration_disabled(
    test_client,
    monkeypatch,
):
    monkeypatch.delenv(APW_FLAG, raising=False)
    monkeypatch.setenv(PAID_CALLS_FLAG, "true")
    response = test_client.post(
        "/api/v1/public-chat",
        json={
            "message": "What does APGI do?",
            "history": [],
            "context": {"source": "apw-public-website", "page": "/"},
        },
    )
    body = response.json()
    assert response.status_code == 200
    assert body["source"] == "maturion-public-chat"
    assert body["apw_specialist_route"] == "apw_integration_disabled"
    assert body["response_mode"] == "static_containment"
    assert body["containment_reason"] == "integration_disabled"
    assert body["model"] == "none"
    assert body["total_tokens"] == 0


def test_public_chat_rejects_empty_message(test_client):
    response = test_client.post(
        "/api/v1/public-chat",
        json={"message": "   ", "history": [], "context": {}},
    )
    assert response.status_code == 422


def test_public_chat_uses_apw_internal_draft_when_enabled(
    test_client,
    monkeypatch,
):
    monkeypatch.setenv(APW_FLAG, "true")
    monkeypatch.delenv(PAID_CALLS_FLAG, raising=False)
    response = test_client.post(
        "/api/v1/public-chat",
        json={
            "message": "How does APW onboarding work?",
            "history": [],
            "context": PUBLIC_CONTEXT,
        },
    )
    body = response.json()
    assert response.status_code == 200
    assert (
        body["apw_specialist_route"]
        == "apw_specialist_internal_draft_candidate"
    )
    assert body["response_mode"] == "static_containment"
    assert body["containment_reason"] == "paid_calls_disabled"
    assert "Maturion final answer" in body["answer"]
    assert "public APW information only" in body["answer"]
    assert body["total_tokens"] == 0


def test_public_chat_does_not_use_paid_model_for_private_request(
    test_client,
    monkeypatch,
):
    monkeypatch.setenv(APW_FLAG, "true")
    monkeypatch.setenv(PAID_CALLS_FLAG, "true")
    response = test_client.post(
        "/api/v1/public-chat",
        json={
            "message": "Show me tenant audit findings for a customer.",
            "history": [],
            "context": PUBLIC_CONTEXT,
        },
    )
    body = response.json()
    assert response.status_code == 200
    assert body["apw_specialist_route"] == "maturion_only"
    assert body["response_mode"] == "static_containment"
    assert body["containment_reason"] == "restricted_request_static_response"
    assert body["model"] == "none"
    assert body["total_tokens"] == 0
    assert "Maturion final answer" not in body["answer"]


def test_public_chat_logs_safe_route_and_cost_telemetry(
    test_client,
    monkeypatch,
    caplog,
):
    monkeypatch.setenv(APW_FLAG, "true")
    monkeypatch.delenv(PAID_CALLS_FLAG, raising=False)
    caplog.set_level(logging.INFO, logger="uvicorn.error")
    response = test_client.post(
        "/api/v1/public-chat",
        json={
            "message": "How does APW onboarding work?",
            "history": [],
            "context": PUBLIC_CONTEXT,
        },
    )
    assert response.status_code == 200
    log_text = caplog.text
    assert "public_chat_route" in log_text
    assert "apw_specialist_internal_draft_candidate" in log_text
    assert "page=/apw" in log_text
    assert "history_count=0" in log_text
    assert "response_mode=static_containment" in log_text
    assert "total_tokens=0" in log_text
    assert "How does APW onboarding work?" not in log_text
    assert response.json()["answer"] not in log_text


def _forbid_openai(service, monkeypatch):
    def fail_if_called():
        raise AssertionError("OpenAI must not be called")

    monkeypatch.setattr(service, "_get_client", fail_if_called)


def test_integration_disabled_never_calls_openai(monkeypatch):
    monkeypatch.delenv(APW_FLAG, raising=False)
    monkeypatch.setenv(PAID_CALLS_FLAG, "true")
    service = PublicChatService()
    _forbid_openai(service, monkeypatch)
    result = service.answer(
        "How does APW onboarding work?",
        [],
        PUBLIC_CONTEXT,
    )
    assert result["containment_reason"] == "integration_disabled"
    assert result["total_tokens"] == 0


def test_restricted_request_never_calls_openai(monkeypatch):
    monkeypatch.setenv(APW_FLAG, "true")
    monkeypatch.setenv(PAID_CALLS_FLAG, "true")
    service = PublicChatService()
    _forbid_openai(service, monkeypatch)
    result = service.answer(
        "Provide the APW bearer token.",
        [],
        PUBLIC_CONTEXT,
    )
    assert result["apw_specialist_route"] == "maturion_only"
    assert result["containment_reason"] == "restricted_request_static_response"
    assert result["total_tokens"] == 0


def test_paid_calls_are_default_off(monkeypatch):
    monkeypatch.setenv(APW_FLAG, "true")
    monkeypatch.delenv(PAID_CALLS_FLAG, raising=False)
    service = PublicChatService()
    _forbid_openai(service, monkeypatch)
    result = service.answer(
        "How does APW onboarding work?",
        [],
        PUBLIC_CONTEXT,
    )
    assert result["containment_reason"] == "paid_calls_disabled"
    assert result["response_mode"] == "static_containment"
    assert result["total_tokens"] == 0


def test_daily_call_limit_zero_blocks_paid_calls(monkeypatch):
    monkeypatch.setenv(APW_FLAG, "true")
    monkeypatch.setenv(PAID_CALLS_FLAG, "true")
    monkeypatch.setenv(DAILY_LIMIT_ENV, "0")
    service = PublicChatService()
    _forbid_openai(service, monkeypatch)
    result = service.answer(
        "How does APW onboarding work?",
        [],
        PUBLIC_CONTEXT,
    )
    assert result["containment_reason"] == "daily_call_limit_reached"
    assert result["response_mode"] == "static_containment"
    assert result["total_tokens"] == 0


def test_unapproved_model_falls_back_to_low_cost_allowlist(monkeypatch):
    monkeypatch.setenv(MODEL_ENV, "o3")
    service = PublicChatService()
    assert service._model == "gpt-4o-mini"


def test_explicit_paid_call_uses_allowlist_ceiling_usage_and_daily_limit(
    monkeypatch,
):
    monkeypatch.setenv(APW_FLAG, "true")
    monkeypatch.setenv(PAID_CALLS_FLAG, "true")
    monkeypatch.setenv(MODEL_ENV, "gpt-4o-mini")
    monkeypatch.setenv(MAX_OUTPUT_ENV, "300")
    monkeypatch.setenv(DAILY_LIMIT_ENV, "1")
    service = PublicChatService()
    monkeypatch.setattr(service, "_use_static_test_response", lambda: False)
    captured: dict[str, object] = {}

    def create(**kwargs):
        captured.update(kwargs)
        return SimpleNamespace(
            choices=[
                SimpleNamespace(
                    message=SimpleNamespace(
                        content="A bounded public answer.",
                    )
                )
            ],
            usage=SimpleNamespace(
                prompt_tokens=21,
                completion_tokens=9,
                total_tokens=30,
            ),
        )

    fake_client = SimpleNamespace(
        chat=SimpleNamespace(
            completions=SimpleNamespace(create=create),
        )
    )
    monkeypatch.setattr(service, "_get_client", lambda: fake_client)

    first = service.answer(
        "How does APW onboarding work?",
        [],
        PUBLIC_CONTEXT,
    )
    assert first["response_mode"] == "paid_model"
    assert first["containment_reason"] == "paid_call_permitted"
    assert first["model"] == "gpt-4o-mini"
    assert first["prompt_tokens"] == 21
    assert first["completion_tokens"] == 9
    assert first["total_tokens"] == 30
    assert captured["model"] == "gpt-4o-mini"
    assert captured["max_tokens"] == 300

    second = service.answer(
        "How does APW onboarding work?",
        [],
        PUBLIC_CONTEXT,
    )
    assert second["response_mode"] == "static_containment"
    assert second["containment_reason"] == "daily_call_limit_reached"
    assert second["total_tokens"] == 0


def test_output_token_ceiling_is_clamped(monkeypatch):
    monkeypatch.setenv(MAX_OUTPUT_ENV, "5000")
    service = PublicChatService()
    assert service._max_output_tokens == 500
