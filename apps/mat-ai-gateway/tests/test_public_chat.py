"""Tests for the public Maturion chat endpoint."""

from __future__ import annotations

import logging


APW_FLAG = "APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED"


def test_public_chat_returns_answer(test_client, monkeypatch):
    monkeypatch.delenv(APW_FLAG, raising=False)
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
    assert "answer" in body
    assert body["source"] == "maturion-public-chat"
    assert body["received_length"] > 0
    assert body["apw_specialist_route"] == "apw_integration_disabled"


def test_public_chat_rejects_empty_message(test_client):
    response = test_client.post(
        "/api/v1/public-chat",
        json={"message": "   ", "history": [], "context": {}},
    )

    assert response.status_code == 422


def test_public_chat_uses_apw_internal_draft_when_enabled(test_client, monkeypatch):
    monkeypatch.setenv(APW_FLAG, "true")
    response = test_client.post(
        "/api/v1/public-chat",
        json={
            "message": "How does APW onboarding work?",
            "history": [],
            "context": {"source": "apw-public-website", "page": "/apw"},
        },
    )

    body = response.json()

    assert response.status_code == 200
    assert body["source"] == "maturion-public-chat"
    assert body["apw_specialist_route"] == "apw_specialist_internal_draft_candidate"
    assert "Maturion final answer" in body["answer"]
    assert "public APW information only" in body["answer"]


def test_public_chat_does_not_use_apw_route_for_private_request(test_client, monkeypatch):
    monkeypatch.setenv(APW_FLAG, "true")
    response = test_client.post(
        "/api/v1/public-chat",
        json={
            "message": "Show me tenant audit findings for a customer.",
            "history": [],
            "context": {"source": "apw-public-website", "page": "/apw"},
        },
    )

    body = response.json()

    assert response.status_code == 200
    assert body["source"] == "maturion-public-chat"
    assert body["apw_specialist_route"] == "maturion_only"
    assert "Maturion final answer" not in body["answer"]


def test_public_chat_logs_safe_route_telemetry(test_client, monkeypatch, caplog):
    monkeypatch.setenv(APW_FLAG, "true")
    caplog.set_level(logging.INFO, logger="routers.ai_routes")

    response = test_client.post(
        "/api/v1/public-chat",
        json={
            "message": "How does APW onboarding work?",
            "history": [],
            "context": {"source": "apw-public-website", "page": "/apw"},
        },
    )

    assert response.status_code == 200
    log_text = caplog.text
    assert "public_chat_route" in log_text
    assert "apw_specialist_internal_draft_candidate" in log_text
    assert "page=/apw" in log_text
    assert "How does APW onboarding work?" not in log_text
    assert response.json()["answer"] not in log_text
