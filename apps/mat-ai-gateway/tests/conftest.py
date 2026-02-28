"""
conftest.py — pytest fixtures for MAT AI Gateway tests.

Provides:
- test_client: FastAPI TestClient with the app under test.
- Monkeypatched required environment variables so tests are fully
  isolated from the host environment and never require live credentials.

Architecture reference: modules/mat/02-architecture/system-architecture.md §2.3
Deployment reference:   modules/mat/02-architecture/deployment-architecture.md §3.3
"""

from __future__ import annotations

import importlib
import os
import sys

import pytest

# ---------------------------------------------------------------------------
# Required environment variables (must be patched before app import)
# ---------------------------------------------------------------------------
_REQUIRED_ENV_VARS: dict[str, str] = {
    "OPENAI_API_KEY": "test-openai-key-fixture",
    "SUPABASE_URL": "https://test-project.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "test-supabase-service-role-key-fixture",
}

_APP_MODULE = "main"
_APP_PACKAGE_ROOT = str(
    (
        __import__("pathlib").Path(__file__).parent.parent
    ).resolve()
)


@pytest.fixture(scope="session", autouse=True)
def _patch_env_vars_session() -> None:
    """
    Session-scoped fixture: inject required env vars before any module-level
    import of the FastAPI app occurs.  Restores originals at session teardown.
    """
    original: dict[str, str | None] = {k: os.environ.get(k) for k in _REQUIRED_ENV_VARS}
    os.environ.update(_REQUIRED_ENV_VARS)
    yield
    for key, value in original.items():
        if value is None:
            os.environ.pop(key, None)
        else:
            os.environ[key] = value


@pytest.fixture(scope="session")
def app():
    """
    Import and return the FastAPI application instance.

    The app is expected to live at apps/mat-ai-gateway/main.py and expose
    a module-level `app` object (FastAPI instance).

    This fixture will FAIL (ImportError / ModuleNotFoundError) until
    api-builder delivers the implementation — which is the intended RED state.
    """
    if _APP_PACKAGE_ROOT not in sys.path:
        sys.path.insert(0, _APP_PACKAGE_ROOT)

    # Force re-import in case a previous test run cached a broken state
    if _APP_MODULE in sys.modules:
        del sys.modules[_APP_MODULE]

    module = importlib.import_module(_APP_MODULE)

    assert hasattr(module, "app"), (
        "main.py must expose a FastAPI instance named 'app'. "
        "Found attributes: " + str(dir(module))
    )
    return module.app


@pytest.fixture(scope="session")
def test_client(app):
    """
    Return a FastAPI TestClient bound to the app under test.

    Uses httpx as the underlying transport (FastAPI TestClient default).
    """
    from fastapi.testclient import TestClient

    with TestClient(app, raise_server_exceptions=True) as client:
        yield client


@pytest.fixture()
def monkeypatched_env(monkeypatch):
    """
    Function-scoped convenience fixture: applies all required env var patches
    via pytest's monkeypatch (safe for function-scoped use alongside the
    session-scoped autouse fixture).
    """
    for key, value in _REQUIRED_ENV_VARS.items():
        monkeypatch.setenv(key, value)
    return _REQUIRED_ENV_VARS
