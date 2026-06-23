"""Tests for the public Maturion chat endpoint."""

from __future__ import annotations

from routers import ai_routes


def test_public_chat_returns_answer(test_client, monkeypatch):
    def fake_answer(message, history, context):
        return {
            "answer": f"Received: {message}",
            "source": "test",
        }

    monkeypatch.setattr(ai_routes._public_chat, "answer", fake_answer)

    response = test_client.post(
        "/api/v1/public-chat",
        json={
            "message": "What does APGI do?",
            "history": [],
            "context": {"source": "apw-public-website", "page": "/"},
        },
    )

    assert response.status_code == 200
    assert response.json()["answer"] == "Received: What does APGI do?"


def test_public_chat_rejects_empty_message(test_client):
    response = test_client.post(
        "/api/v1/public-chat",
        json={"message": "   ", "history": [], "context": {}},
    )

    assert response.status_code == 422
