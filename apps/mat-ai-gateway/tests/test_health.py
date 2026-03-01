"""
test_health.py — RED gate test: /health endpoint.

Architecture: modules/mat/02-architecture/deployment-architecture.md §3.3
  "Health Check: GET /health endpoint with 5 s timeout"

Contract: This test MUST fail (RED) until api-builder delivers main.py
with a /health route returning {"status": "ok"}.
"""

from __future__ import annotations


class TestHealthEndpoint:
    """Tests for the /health liveness endpoint."""

    def test_health_returns_200(self, test_client):
        """
        GET /health must respond with HTTP 200 OK.

        The health check is the first signal that the container is alive and
        accepting traffic (ECS / Cloud Run readiness probe).
        """
        response = test_client.get("/health")
        assert response.status_code == 200, (
            f"Expected HTTP 200 from /health, got {response.status_code}. "
            f"Body: {response.text!r}"
        )

    def test_health_returns_json_status_ok(self, test_client):
        """
        GET /health must return JSON body {"status": "ok"}.

        Downstream ECS health-check scripts parse this payload verbatim;
        any deviation (e.g. {"status": "healthy"}) will cause deployment failures.
        """
        response = test_client.get("/health")
        assert response.headers["content-type"].startswith("application/json"), (
            "Content-Type must be application/json. "
            f"Got: {response.headers.get('content-type')!r}"
        )
        body = response.json()
        assert "status" in body, (
            f"Response JSON must contain 'status' key. Got: {body!r}"
        )
        assert body["status"] == "ok", (
            f"Expected status='ok', got status={body['status']!r}. "
            "The health check contract requires the exact string 'ok'."
        )

    def test_health_no_auth_required(self, test_client):
        """
        GET /health must be accessible without authentication headers.

        Infrastructure probes do not supply JWT tokens; any auth guard on
        this endpoint would cause cyclic liveness failures.
        """
        # Deliberately omit Authorization / X-API-Key headers
        response = test_client.get("/health")
        assert response.status_code != 401, (
            "Health endpoint must not require authentication. "
            "Got HTTP 401 — remove auth dependency from /health."
        )
        assert response.status_code != 403, (
            "Health endpoint must not require authorisation. "
            "Got HTTP 403 — remove auth/permission guard from /health."
        )
