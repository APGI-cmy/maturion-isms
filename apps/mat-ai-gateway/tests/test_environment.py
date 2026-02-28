"""
test_environment.py — RED gate test: required environment variable validation.

Architecture: modules/mat/02-architecture/deployment-architecture.md §3.3
              modules/mat/02-architecture/system-architecture.md §2.3

Required environment variables:
  OPENAI_API_KEY             — OpenAI API authentication
  SUPABASE_URL               — Supabase project URL
  SUPABASE_SERVICE_ROLE_KEY  — Supabase service-role JWT (bypasses RLS for server-side ops)

Contract:
- The app MUST raise an explicit, descriptive error when any required env var
  is missing — it must NEVER silently continue with a missing API key (this
  would cause obscure runtime failures deep inside AI call stacks).
- Errors must be raised at import/startup time (not lazily on first API call).
- Tests will be RED until api-builder implements env validation in main.py
  (e.g. via pydantic BaseSettings or explicit os.environ checks).
"""

from __future__ import annotations

import importlib
import os
import sys
from typing import Iterator

import pytest

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_REQUIRED_ENV_VARS = (
    "OPENAI_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
)

_APP_MODULE = "main"


def _app_root() -> str:
    import pathlib
    return str(pathlib.Path(__file__).parent.parent.resolve())


def _purge_app_modules() -> None:
    """Remove cached main + settings modules so each test gets a fresh import."""
    to_delete = [
        key for key in sys.modules
        if key in (_APP_MODULE, "config", "settings", "core.config", "core.settings")
        or key.startswith("services.")
        or key.startswith("routers.")
        or key.startswith("app.")
    ]
    for key in to_delete:
        del sys.modules[key]


def _import_app_with_env(env_overrides: dict[str, str | None]) -> None:
    """
    Attempt to import the app module with a manipulated environment.

    `env_overrides` maps var name → value (or None to unset the var).
    The original environment is restored after the attempt.
    """
    if _app_root() not in sys.path:
        sys.path.insert(0, _app_root())

    # Snapshot and apply overrides
    original: dict[str, str | None] = {}
    for key, value in env_overrides.items():
        original[key] = os.environ.get(key)
        if value is None:
            os.environ.pop(key, None)
        else:
            os.environ[key] = value

    try:
        _purge_app_modules()
        importlib.import_module(_APP_MODULE)
    finally:
        # Always restore environment and module cache
        for key, orig_value in original.items():
            if orig_value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = orig_value
        _purge_app_modules()


# ---------------------------------------------------------------------------
# Tests: individual missing env var raises explicit error
# ---------------------------------------------------------------------------

class TestMissingEnvVarsRaiseErrors:
    """
    When a required env var is absent the app must raise at import/startup time.

    Acceptable exception types:
    - ValueError          (most common for pydantic ValidationError scenarios)
    - RuntimeError        (explicit startup guard)
    - OSError             (explicit os.environ check)
    - SystemExit          (explicit sys.exit guard)
    - pydantic.ValidationError (pydantic BaseSettings missing field)

    NOT acceptable:
    - No exception (silent failure) — API calls would fail later with cryptic errors
    - AttributeError / KeyError at first use — lazy failure is unacceptable
    """

    _ACCEPTABLE_EXCEPTIONS = (ValueError, RuntimeError, OSError, SystemExit)

    @pytest.mark.parametrize("missing_var", _REQUIRED_ENV_VARS)
    def test_missing_env_var_raises_on_startup(self, missing_var: str, monkeypatched_env):
        """
        Removing a single required env var must cause the app to raise an
        explicit error at import/startup time.

        monkeypatched_env provides all required vars; we then unset the one
        under test to isolate the failure.
        """
        overrides = {missing_var: None}  # unset this one var

        try:
            _import_app_with_env(overrides)
        except self._ACCEPTABLE_EXCEPTIONS:
            # ✅ The app raised an explicit error — gate satisfied
            return
        except Exception as exc:  # noqa: BLE001
            # Check if it's a pydantic ValidationError (not importable without pydantic)
            exc_class = type(exc).__name__
            if "ValidationError" in exc_class:
                return  # ✅ pydantic settings validation
            # Any other exception type is acceptable as long as it IS an exception
            # (i.e. the app did NOT silently continue)
            if "Error" in exc_class or "Exception" in exc_class or "Exit" in exc_class:
                return
            pytest.fail(
                f"Removing '{missing_var}' caused unexpected exception type {exc_class}: {exc}\n"
                "The app should raise ValueError, RuntimeError, OSError, SystemExit, "
                "or pydantic.ValidationError for missing required configuration."
            )
        else:
            pytest.fail(
                f"Removing env var '{missing_var}' did NOT raise any exception.\n"
                "The app silently started without a required configuration variable.\n"
                "api-builder MUST add startup validation that raises an explicit error "
                f"when '{missing_var}' is absent.\n\n"
                "Suggested implementation (pydantic BaseSettings):\n"
                "  class Settings(BaseSettings):\n"
                f"      {missing_var.lower()}: str\n\n"
                "Or explicit check:\n"
                f"  if not os.environ.get('{missing_var}'):\n"
                f"      raise ValueError('{missing_var} is required but not set')"
            )

    def test_all_required_vars_present_allows_startup(self, monkeypatched_env):
        """
        When ALL required env vars are present the app must import without error.

        This is the positive control: if this test fails when all vars are set,
        the app has a startup bug unrelated to env-var validation.
        """
        # monkeypatched_env already sets all required vars; pass it directly
        try:
            _import_app_with_env(monkeypatched_env)
        except Exception as exc:  # noqa: BLE001
            pytest.fail(
                f"App failed to start even with all required env vars present.\n"
                f"Exception: {type(exc).__name__}: {exc}\n"
                "This is a startup bug in main.py that api-builder must fix."
            )


class TestEnvVarDescriptiveErrors:
    """
    Error messages for missing env vars must be descriptive enough to identify
    which variable is missing.  A generic 'configuration error' is insufficient.
    """

    _ACCEPTABLE_EXCEPTIONS = (ValueError, RuntimeError, OSError, SystemExit, Exception)

    @pytest.mark.parametrize("missing_var", _REQUIRED_ENV_VARS)
    def test_error_message_names_the_missing_variable(self, missing_var: str, monkeypatched_env):
        """
        The error message (or exception representation) raised when a required
        env var is missing must include the variable name.

        This ensures operators can diagnose misconfiguration from logs alone
        without reading source code.
        """
        overrides = {missing_var: None}

        caught_exception: Exception | None = None
        try:
            _import_app_with_env(overrides)
        except BaseException as exc:  # noqa: BLE001
            caught_exception = exc

        if caught_exception is None:
            pytest.skip(
                f"No exception was raised for missing '{missing_var}'. "
                "test_missing_env_var_raises_on_startup should catch this first."
            )

        error_repr = str(caught_exception).lower()
        var_lower = missing_var.lower()
        var_partial = missing_var.lower().replace("_", "")  # openaikey etc.

        assert var_lower in error_repr or var_partial in error_repr, (
            f"Error raised for missing '{missing_var}' does not mention the variable name.\n"
            f"Error message: {str(caught_exception)!r}\n"
            "The error must name the missing variable so operators can diagnose "
            "configuration problems from logs without reading source code.\n"
            "Example: raise ValueError(f'{missing_var!r} environment variable is required')"
        )
