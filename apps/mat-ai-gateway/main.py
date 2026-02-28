"""
main.py — MAT AI Gateway FastAPI application entry point.

Architecture reference: modules/mat/02-architecture/system-architecture.md §3.3
Deployment reference:   modules/mat/02-architecture/deployment-architecture.md §3.3
"""

from __future__ import annotations

import os

from fastapi import FastAPI
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

# CORS — allow all origins in dev; configurable via CORS_ORIGINS env var in production
_cors_origins: list[str] = os.environ.get("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins if _cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
from routers.ai_routes import router as ai_router  # noqa: E402

app.include_router(ai_router)


# ---------------------------------------------------------------------------
# Health endpoint — no authentication required
# ---------------------------------------------------------------------------
@app.get("/health")
def health() -> dict:
    """Liveness probe — returns {"status": "ok"}."""
    return {"status": "ok"}
