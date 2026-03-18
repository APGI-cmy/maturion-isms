"""
test_wave19_startup.py — RED gate test for Wave 19: T-W19-016

Wave    : Wave 19 — MAT Criteria Parsing Holistic Repair
Branch  : copilot/wave-19-holistic-mat-criteria-repair
Issue   : maturion-isms#1135 (wave-gov-mat-criteria-repair-1135)
Task ID : T-W19A-010 (qa-builder Batch A)
Producing Agent: qa-builder

IAA Pre-Brief: .agent-admin/assurance/iaa-prebrief-wave19-criteria-parsing-repair.md
Gap Register : modules/mat/00-app-description/CRITERIA-PARSING-GAP-REGISTER.md

── Gap → Test ID Mapping ────────────────────────────────────────────────────
  GAP-PARSE-011  SUPABASE_STORAGE_URL not validated at AI Gateway startup.
    When SUPABASE_STORAGE_URL is absent or empty, the SSRF mitigation guard is
    disabled because the URL base is never set. Requests are not blocked by the
    trusted-base validation, allowing arbitrary URL fetches.

  → T-W19-016:  AI Gateway startup with SUPABASE_STORAGE_URL='' raises ValueError

── RED STATE (before Wave 19 api-builder Batch C fix) ───────────────────────
  T-W19-016  FAIL  services/parsing.py does NOT validate SUPABASE_STORAGE_URL
                   at startup/import time. When the env var is absent or empty,
                   no exception is raised — the module silently starts with an
                   empty SUPABASE_STORAGE_URL, bypassing SSRF mitigation.

── GREEN STATE (after api-builder T-W19C-008 fix) ───────────────────────────
  T-W19-016  PASS  services/parsing.py raises ValueError (or equivalent) at
                   import/startup time when SUPABASE_STORAGE_URL is empty.

── Architecture reference ────────────────────────────────────────────────────
  modules/mat/02-architecture/system-architecture.md §2.3 (Security: SSRF)
  GAP-PARSE-011: SUPABASE_STORAGE_URL='' disables SSRF mitigation guard
  WAVE-19-PLAN-PROPOSAL.md T-W19C-008

Authority: foreman-v2-agent delegation T-W19A-010
"""

from __future__ import annotations

import importlib
import os
import sys
from pathlib import Path

import pytest

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

_PARSING_MODULE = "services.parsing"
_APP_ROOT = str(Path(__file__).parent.parent.resolve())

# All env vars that the AI Gateway requires at startup (except the one under test)
_BASELINE_ENV: dict[str, str] = {
    "OPENAI_API_KEY": "test-openai-key-wave19-fixture",
    "SUPABASE_URL": "https://test-project.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "test-service-role-key-wave19-fixture",
}

# The env var under test for T-W19-016
_TARGET_VAR = "SUPABASE_STORAGE_URL"

# Acceptable exception types for startup validation failure
_ACCEPTABLE_STARTUP_EXCEPTIONS = (ValueError, RuntimeError, OSError, SystemExit)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _purge_parsing_module() -> None:
    """Remove cached parsing module so each test gets a fresh import."""
    to_delete = [key for key in sys.modules if key == _PARSING_MODULE or key.startswith(_PARSING_MODULE + ".")]
    for key in to_delete:
        del sys.modules[key]


def _import_parsing_with_env(env_overrides: dict[str, str | None]) -> None:
    """
    Attempt to import services.parsing with a manipulated environment.

    ``env_overrides`` maps var name → value (or None to unset the var).
    The original environment is restored after the import attempt.
    """
    if _APP_ROOT not in sys.path:
        sys.path.insert(0, _APP_ROOT)

    # Snapshot and apply overrides
    original: dict[str, str | None] = {}
    for key, value in env_overrides.items():
        original[key] = os.environ.get(key)
        if value is None:
            os.environ.pop(key, None)
        else:
            os.environ[key] = value

    try:
        _purge_parsing_module()
        importlib.import_module(_PARSING_MODULE)
    finally:
        # Always restore environment
        for key, orig_value in original.items():
            if orig_value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = orig_value
        _purge_parsing_module()


# ---------------------------------------------------------------------------
# T-W19-016: SUPABASE_STORAGE_URL='' → ValueError at startup
# ---------------------------------------------------------------------------


class TestSUPABASEStorageUrlStartupValidation:
    """
    T-W19-016 — GAP-PARSE-011:

    services/parsing.py MUST raise an explicit error at import/startup time
    when SUPABASE_STORAGE_URL is empty or absent.

    Rationale
    ---------
    The AI Gateway builds the trusted storage URL from SUPABASE_STORAGE_URL to
    implement SSRF mitigation: only signed URLs whose base matches the trusted
    SUPABASE_STORAGE_URL are accepted. If SUPABASE_STORAGE_URL is empty string,
    the guard is disabled — any URL is accepted, opening an SSRF vector.

    Current behaviour (RED)
    -----------------------
    parsing.py module-level:
      SUPABASE_STORAGE_URL = os.environ.get("SUPABASE_STORAGE_URL", "").rstrip("/")
    No validation follows. The module imports silently with SUPABASE_STORAGE_URL = "".
    The SSRF mitigation is silently disabled.

    Required behaviour (GREEN — after api-builder T-W19C-008)
    ----------------------------------------------------------
    parsing.py must include startup validation:
      _supabase_storage_url = os.environ.get("SUPABASE_STORAGE_URL", "").rstrip("/")
      if not _supabase_storage_url:
          raise ValueError(
              "SUPABASE_STORAGE_URL environment variable is required. "
              "Set it to the Supabase Storage base URL to enable SSRF mitigation."
          )

    Authority: GAP-PARSE-011, WAVE-19-PLAN-PROPOSAL.md T-W19C-008
    """

    def test_empty_supabase_storage_url_raises_at_startup(self, monkeypatch):
        """
        T-W19-016 — RED gate:

        When SUPABASE_STORAGE_URL is set to an empty string, importing
        services.parsing must raise ValueError (or equivalent startup error).

        This test is RED until api-builder implements startup validation in
        services/parsing.py (T-W19C-008).
        """
        # Set all baseline vars so other startup checks don't interfere
        for key, value in _BASELINE_ENV.items():
            monkeypatch.setenv(key, value)

        # Set the target var to empty string (the "not configured" case)
        monkeypatch.setenv(_TARGET_VAR, "")

        caught_exception: BaseException | None = None
        try:
            _import_parsing_with_env({_TARGET_VAR: ""})
        except BaseException as exc:  # noqa: BLE001
            caught_exception = exc

        assert caught_exception is not None, (
            f"[T-W19-016] RED: Importing services.parsing with {_TARGET_VAR}='' "
            "did NOT raise any exception.\n"
            "services/parsing.py silently starts with SUPABASE_STORAGE_URL='' "
            "which disables SSRF mitigation — the AI Gateway will accept any URL "
            "as a valid document source.\n\n"
            "api-builder MUST add startup validation (T-W19C-008):\n"
            "  _supabase_storage_url = os.environ.get('SUPABASE_STORAGE_URL', '').rstrip('/')\n"
            "  if not _supabase_storage_url:\n"
            "      raise ValueError(\n"
            "          'SUPABASE_STORAGE_URL environment variable is required. '\n"
            "          'Set it to the Supabase Storage base URL (SSRF mitigation).'\n"
            "      )\n\n"
            "Without this guard, ANY URL can be fetched by the AI Gateway, "
            "not just URLs from the trusted Supabase Storage bucket."
        )

        # Verify it's an acceptable exception type (not a common unrelated error)
        exc_type_name = type(caught_exception).__name__
        # Exclude common unrelated errors that would indicate a code bug rather than
        # intentional startup validation: NameError, AttributeError, ImportError, KeyError
        _unrelated_errors = (NameError, AttributeError, ImportError, KeyError, TypeError)
        if isinstance(caught_exception, _unrelated_errors):
            pytest.fail(
                f"[T-W19-016] Unrelated {exc_type_name} raised instead of startup validation error.\n"
                f"Exception: {caught_exception}\n"
                "This likely indicates a code bug, not missing SUPABASE_STORAGE_URL validation.\n"
                "Expected: ValueError, RuntimeError, OSError, SystemExit, or pydantic.ValidationError\n"
                "with a message referencing SUPABASE_STORAGE_URL."
            )
        is_acceptable = (
            isinstance(caught_exception, _ACCEPTABLE_STARTUP_EXCEPTIONS)
            or "ValidationError" in exc_type_name  # pydantic
        )
        assert is_acceptable, (
            f"[T-W19-016] Unexpected exception type: {exc_type_name}: {caught_exception}\n"
            "Expected: ValueError, RuntimeError, OSError, SystemExit, or pydantic.ValidationError\n"
            "The app should raise an explicit, descriptive startup error when "
            "SUPABASE_STORAGE_URL is empty."
        )

    def test_absent_supabase_storage_url_raises_at_startup(self, monkeypatch):
        """
        T-W19-016 (variant) — RED gate:

        When SUPABASE_STORAGE_URL is completely absent from the environment,
        importing services.parsing must raise ValueError (or equivalent).

        This covers the case where the env var was never set (common in local
        development environments and CI without the var configured).
        """
        # Set all baseline vars
        for key, value in _BASELINE_ENV.items():
            monkeypatch.setenv(key, value)

        # Remove SUPABASE_STORAGE_URL entirely
        monkeypatch.delenv(_TARGET_VAR, raising=False)

        caught_exception: BaseException | None = None
        try:
            _import_parsing_with_env({_TARGET_VAR: None})
        except BaseException as exc:  # noqa: BLE001
            caught_exception = exc

        assert caught_exception is not None, (
            f"[T-W19-016] RED: Importing services.parsing with {_TARGET_VAR} absent "
            "did NOT raise any exception.\n"
            "services/parsing.py must raise at startup when SUPABASE_STORAGE_URL is not set.\n\n"
            "api-builder MUST add startup validation (T-W19C-008):\n"
            "  if not os.environ.get('SUPABASE_STORAGE_URL', '').strip():\n"
            "      raise ValueError('SUPABASE_STORAGE_URL is required')"
        )

    def test_error_message_mentions_supabase_storage_url(self, monkeypatch):
        """
        T-W19-016 (error message quality) — RED gate:

        The error raised for missing SUPABASE_STORAGE_URL must mention the
        variable name so operators can diagnose misconfiguration from logs.
        """
        for key, value in _BASELINE_ENV.items():
            monkeypatch.setenv(key, value)

        monkeypatch.setenv(_TARGET_VAR, "")

        caught_exception: BaseException | None = None
        try:
            _import_parsing_with_env({_TARGET_VAR: ""})
        except BaseException as exc:  # noqa: BLE001
            caught_exception = exc

        if caught_exception is None:
            pytest.fail(
                f"[T-W19-016] No exception raised for {_TARGET_VAR}=''. "
                "The startup validation does not exist — "
                "test_empty_supabase_storage_url_raises_at_startup catches the primary RED gate, "
                "but this test verifies that when an exception IS raised, it mentions the variable name."
            )

        error_repr = str(caught_exception).lower()
        var_lower = _TARGET_VAR.lower()
        # Accept: "supabase_storage_url", "supabase storage url", "storage_url", etc.
        var_partial = "storage_url"

        assert var_lower in error_repr or var_partial in error_repr, (
            f"[T-W19-016] Error raised for missing {_TARGET_VAR} does not mention "
            "the variable name.\n"
            f"Error message: {str(caught_exception)!r}\n"
            "The error must name the missing variable so operators can diagnose "
            "configuration problems from logs without reading source code.\n"
            f"Example: raise ValueError('{_TARGET_VAR} is required for SSRF mitigation')"
        )

    def test_valid_supabase_storage_url_allows_startup(self, monkeypatch):
        """
        T-W19-016 (positive control):

        When SUPABASE_STORAGE_URL is set to a non-empty value, services.parsing
        must import successfully.

        If this test fails, the startup validation has a bug that blocks valid
        configurations.
        """
        for key, value in _BASELINE_ENV.items():
            monkeypatch.setenv(key, value)

        valid_url = "https://test-project.supabase.co/storage/v1"
        monkeypatch.setenv(_TARGET_VAR, valid_url)

        try:
            _import_parsing_with_env({_TARGET_VAR: valid_url})
        except Exception as exc:  # noqa: BLE001
            # Allow "other" startup errors unrelated to SUPABASE_STORAGE_URL
            # (e.g., OpenAI client import errors in test env)
            exc_msg = str(exc).lower()
            if "storage_url" in exc_msg or "supabase_storage" in exc_msg:
                pytest.fail(
                    f"[T-W19-016] services.parsing failed to start even with a valid "
                    f"{_TARGET_VAR}.\nException: {type(exc).__name__}: {exc}\n"
                    "The startup validation must ONLY reject empty/absent SUPABASE_STORAGE_URL, "
                    "not valid non-empty values."
                )
            # Other exceptions (unrelated to SUPABASE_STORAGE_URL) are acceptable in test env
