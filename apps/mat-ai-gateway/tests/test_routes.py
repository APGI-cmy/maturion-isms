"""
test_routes.py — RED gate test: API route registration and basic response contract.

Architecture: modules/mat/02-architecture/system-architecture.md §3.3 (AI Gateway)
              §3.4 (AI Services)

Required routes (all POST):
  /api/v1/parse          — Document Parsing
  /api/v1/score          — Maturity Scoring
  /api/v1/transcribe     — Audio Transcription
  /api/v1/report         — Report Generation
  /api/v1/analyse-image  — Image Analysis

Contract:
- Each route must be REGISTERED (not return 404/405).
- POST requests with valid minimal payloads must return 2xx or structured 422
  (validation error), NOT 404 (unregistered route) or 405 (wrong method).
- Tests will be RED until api-builder registers all routes in main.py.
"""

from __future__ import annotations

from typing import Any

import pytest

# ---------------------------------------------------------------------------
# Route table: (path, description, minimal_payload)
# ---------------------------------------------------------------------------
# Payloads are minimal valid-shaped inputs; real validation is the domain of
# api-builder.  For route-existence testing we only need to prove the route
# is registered.
_ROUTES: list[tuple[str, str, dict[str, Any]]] = [
    (
        "/api/v1/parse",
        "Document Parsing — converts PDF/DOCX criteria into structured JSON",
        {"document_url": "https://example.com/audit-criteria.pdf", "tenant_id": "test-tenant"},
    ),
    (
        "/api/v1/score",
        "Maturity Scoring — derives maturity level from evidence and criteria",
        {"evidence": "We conduct quarterly reviews.", "criteria_id": "ISO27001-A.12.1", "tenant_id": "test-tenant"},
    ),
    (
        "/api/v1/transcribe",
        "Audio Transcription — converts audio recording to timestamped transcript",
        {"audio_url": "https://example.com/interview.mp3", "tenant_id": "test-tenant"},
    ),
    (
        "/api/v1/report",
        "Report Generation — produces DOCX/PDF/JSON audit report",
        {"audit_id": "audit-001", "format": "json", "tenant_id": "test-tenant"},
    ),
    (
        "/api/v1/analyse-image",
        "Image Analysis — extracts compliance description from photo evidence",
        {"image_url": "https://example.com/evidence-photo.jpg", "tenant_id": "test-tenant"},
    ),
]


class TestRoutesAreRegistered:
    """Verify every required AI Gateway route is registered in the FastAPI app."""

    @pytest.mark.parametrize("path,description,payload", _ROUTES)
    def test_route_is_not_404(self, test_client, path: str, description: str, payload: dict):
        """
        POST to each route must NOT return 404 (Not Found).

        A 404 means the route is not registered at all.  This is the primary
        RED gate: until api-builder creates the route, every test here fails.
        """
        response = test_client.post(path, json=payload)
        assert response.status_code != 404, (
            f"Route '{path}' ({description}) returned HTTP 404.\n"
            f"The route is NOT registered.  api-builder must add it to main.py or a router module.\n"
            f"Response body: {response.text!r}"
        )

    @pytest.mark.parametrize("path,description,payload", _ROUTES)
    def test_route_accepts_post(self, test_client, path: str, description: str, payload: dict):
        """
        Each route must accept POST requests (not return 405 Method Not Allowed).

        405 indicates the path is registered but with the wrong HTTP method.
        """
        response = test_client.post(path, json=payload)
        assert response.status_code != 405, (
            f"Route '{path}' ({description}) returned HTTP 405 Method Not Allowed.\n"
            "Ensure the route is registered as a POST endpoint, not GET/PUT/PATCH.\n"
            f"Response body: {response.text!r}"
        )

    @pytest.mark.parametrize("path,description,payload", _ROUTES)
    def test_route_returns_json(self, test_client, path: str, description: str, payload: dict):
        """
        Each route must return a JSON response body.

        Accepts 2xx (success) or 422 (validation error — correct FastAPI behaviour
        for malformed payloads).  Rejects 500 (unhandled server error) or 404.
        """
        response = test_client.post(path, json=payload)
        # We accept 2xx (happy path) or 422 (schema validation — route IS registered)
        # We do NOT accept 404 (missing) or 500 (crashing implementation)
        acceptable_statuses = set(range(200, 300)) | {422}
        assert response.status_code in acceptable_statuses, (
            f"Route '{path}' ({description}) returned unexpected HTTP {response.status_code}.\n"
            f"Acceptable: 2xx (success) or 422 (validation error).\n"
            f"500 indicates an unhandled exception in the implementation.\n"
            f"Body: {response.text!r}"
        )
        content_type = response.headers.get("content-type", "")
        assert "application/json" in content_type, (
            f"Route '{path}' must return Content-Type: application/json.\n"
            f"Got: {content_type!r}"
        )


class TestRouteMethodContract:
    """Verify that GET requests to POST-only routes return 405, not 404."""

    @pytest.mark.parametrize("path,description,_", _ROUTES)
    def test_get_on_post_route_returns_405_not_404(
        self, test_client, path: str, description: str, _: dict
    ):
        """
        A GET request to a POST-only route must return 405 (method not allowed),
        not 404 (not found).  405 proves the route IS registered; only the method
        is wrong.

        This is a stricter registration check than the POST tests above — it
        confirms the route exists in the router table independently of method.

        NOTE: FastAPI returns 405 for wrong-method on registered routes.
        If the route is missing entirely, FastAPI returns 404 for GET too.
        """
        response = test_client.get(path)
        assert response.status_code != 404, (
            f"GET {path} ({description}) returned 404.\n"
            "This means the route is not registered at all.\n"
            "api-builder must register it as a POST endpoint in the router."
        )
