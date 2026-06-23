"""Tests for the public Maturion chat endpoint."""

from __future__ import annotations


def test_public_chat_returns_answer(test_client):
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


def test_public_chat_rejects_empty_message(test_client):
    response = test_client.post(
        "/api/v1/public-chat",
        json={"message": "   ", "history": [], "context": {}},
    )

    assert response.status_code == 422
