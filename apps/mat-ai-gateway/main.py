"""
main.py — MAT AI Gateway FastAPI application entry point.

Architecture reference: modules/mat/02-architecture/system-architecture.md §3.3
Deployment reference:   modules/mat/02-architecture/deployment-architecture.md §3.3
"""

from __future__ import annotations

import os
import secrets
from typing import Any

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------------------------------------------------------
# Startup validation — raise immediately if required env vars are absent.
# This must happen at module import time so container health probes catch
# mis-configuration before any request is served.
# ---------------------------------------------------------------------------
_REQUIRED_ENV_VARS = (
    "OPENAI_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
)

for _var in _REQUIRED_ENV_VARS:
    if not os.environ.get(_var):
        raise RuntimeError(
            f"Required environment variable '{_var}' is not set. "
            f"Please configure {_var} before starting the MAT AI Gateway."
        )

# ---------------------------------------------------------------------------
# Application factory
# ---------------------------------------------------------------------------
app = FastAPI(
    title="MAT AI Gateway",
    version="1.0.0",
    description="MAT AI Gateway — Python FastAPI microservice for AI-powered compliance operations.",
)

# CORS — allow all origins in dev; configurable via CORS_ORIGINS env var in production.
# When CORS_ORIGINS is unset or "*", credentials are disabled (browser security requirement
# for wildcard origins). When explicit origins are provided, credentials are allowed.
_raw_cors_origins = os.environ.get("CORS_ORIGINS")
if not _raw_cors_origins or _raw_cors_origins.strip() == "*":
    _cors_origins: list[str] = ["*"]
    _cors_allow_credentials = False
else:
    _cors_origins = [
        origin.strip()
        for origin in _raw_cors_origins.split(",")
        if origin.strip()
    ]
    _cors_allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=_cors_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
from routers.ai_routes import router as ai_router  # noqa: E402
from routers.kuc_routes import router as kuc_router  # noqa: E402

app.include_router(ai_router)
app.include_router(kuc_router)


# ---------------------------------------------------------------------------
# MCP auth + endpoint
# ---------------------------------------------------------------------------
_MCP_UNAUTHORIZED = HTTPException(status_code=401, detail="Unauthorized.")


def _require_mcp_bearer(authorization: str | None) -> None:
    """Require bearer authorization for MCP endpoints."""
    expected = os.environ.get("MCP_TOKEN")
    if not expected:
        raise HTTPException(
            status_code=503,
            detail="MCP auth is not configured on server.",
        )

    if not authorization:
        raise _MCP_UNAUTHORIZED

    scheme, _, token = authorization.strip().partition(" ")
    token = token.strip()
    if scheme.lower() != "bearer" or not token:
        raise _MCP_UNAUTHORIZED

    if not secrets.compare_digest(token, expected):
        raise _MCP_UNAUTHORIZED


def _mcp_error_response(req_id: Any, code: int, message: str) -> dict[str, Any]:
    return {
        "jsonrpc": "2.0",
        "id": req_id,
        "error": {
            "code": code,
            "message": message,
        },
    }


@app.post("/mcp")
async def mcp_endpoint(
    payload: dict[str, Any],
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    """Minimal MCP-compatible JSON-RPC endpoint for agent bootstrap."""
    _require_mcp_bearer(authorization)

    req_id = payload.get("id")
    method = payload.get("method")
    if not method:
        return _mcp_error_response(req_id, -32600, "Invalid Request: missing method")

    if method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "tools": [
                    {
                        "name": "agent_bootstrap",
                        "description": "Load a governed agent contract by agent_id.",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "agent_id": {"type": "string"},
                            },
                            "required": ["agent_id"],
                            "additionalProperties": False,
                        },
                    }
                ]
            },
        }

    if method != "tools/call":
        return _mcp_error_response(req_id, -32601, f"Method '{method}' not implemented.")

    params = payload.get("params") or {}
    tool_name = params.get("name")
    arguments = params.get("arguments") or {}

    if not tool_name:
        return _mcp_error_response(req_id, -32602, "Invalid params: missing tool name.")

    if tool_name != "agent_bootstrap":
        return _mcp_error_response(req_id, -32601, f"Unknown tool '{tool_name}'.")

    return {
        "jsonrpc": "2.0",
        "id": req_id,
        "result": {
            "content": [
                {
                    "type": "json",
                    "json": {
                        "ok": True,
                        "tool": "agent_bootstrap",
                        "arguments": arguments,
                        "message": "MCP endpoint is live; bootstrap backend is not wired in this service.",
                    },
                }
            ]
        },
    }


@app.get("/mcp")
async def mcp_probe(
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    """Authenticated probe endpoint for MCP availability checks."""
    _require_mcp_bearer(authorization)
    return {
        "status": "ok",
        "service": "mcp",
        "tools": ["agent_bootstrap"],
    }


# ---------------------------------------------------------------------------
# Health endpoint — no authentication required
# ---------------------------------------------------------------------------
@app.get("/health")
def health() -> dict:
    """Liveness probe — returns {"status": "ok"}."""
    return {"status": "ok"}
