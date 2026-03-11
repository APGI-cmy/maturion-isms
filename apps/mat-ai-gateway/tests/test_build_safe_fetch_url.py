"""
test_build_safe_fetch_url.py — Unit tests for _build_safe_fetch_url.

Tests T-BSFU-001 through T-BSFU-005 verify that the path-deduplication
logic in _build_safe_fetch_url prevents the /storage/v1/storage/v1/...
double-path bug confirmed in live error logs (issue: 404 on every document
fetch).

Live error URL observed:
  https://ujucvyyspfxlxlfdamda.supabase.co/storage/v1/storage/v1/object/sign/...
"""

from __future__ import annotations

import importlib
import sys
import types

import pytest

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

_SIGNED_URL = (
    "https://ujucvyyspfxlxlfdamda.supabase.co"
    "/storage/v1/object/sign/audit-documents"
    "/102dd192-d777-483c-9681-0801dcbac281"
    "/criteria/afa6083a-0fce-4ee0-aac9-b01188764d5f"
    "/1773049379738-LDCS%20structure%20and%20criteria.docx"
    "?token=abc123"
)

_STORAGE_URL_WITH_PREFIX = "https://ujucvyyspfxlxlfdamda.supabase.co/storage/v1"
_STORAGE_URL_NO_PREFIX = "https://ujucvyyspfxlxlfdamda.supabase.co"

_EXPECTED_RESULT = (
    "https://ujucvyyspfxlxlfdamda.supabase.co"
    "/storage/v1/object/sign/audit-documents"
    "/102dd192-d777-483c-9681-0801dcbac281"
    "/criteria/afa6083a-0fce-4ee0-aac9-b01188764d5f"
    "/1773049379738-LDCS%20structure%20and%20criteria.docx"
    "?token=abc123"
)


def _make_stub(name: str, **attrs) -> types.ModuleType:
    """Create a minimal stub module with the given attributes."""
    mod = types.ModuleType(name)
    for k, v in attrs.items():
        setattr(mod, k, v)
    return mod


def _install_stubs():
    """
    Install lightweight stubs for production deps that are not available in
    the test/CI environment (PyPDF2 and openai).  All other dependencies
    (fastapi, httpx, docx, pydantic) are genuinely installed and must NOT be
    stubbed to avoid corrupting the shared test session.
    """
    # PyPDF2 — only PdfReader is referenced at import time
    if "PyPDF2" not in sys.modules:
        pypdf2 = _make_stub("PyPDF2", PdfReader=type("PdfReader", (), {}))
        sys.modules["PyPDF2"] = pypdf2

    # openai — only OpenAI class is referenced at import time
    if "openai" not in sys.modules:
        sys.modules["openai"] = _make_stub("openai", OpenAI=type("OpenAI", (), {}))


@pytest.fixture()
def build_safe_fetch_url(monkeypatch):
    """Return the _build_safe_fetch_url function, re-imported fresh so that
    SUPABASE_STORAGE_URL can be patched per-test via monkeypatch.setenv."""
    package_root = str(
        (__import__("pathlib").Path(__file__).parent.parent).resolve()
    )
    if package_root not in sys.path:
        sys.path.insert(0, package_root)

    _install_stubs()

    def _get_fn(storage_url: str):
        monkeypatch.setenv("SUPABASE_STORAGE_URL", storage_url)
        # Force re-import so module-level SUPABASE_STORAGE_URL is re-read.
        # Clear all services.* and services cached modules to avoid stale state.
        for cached in list(sys.modules):
            if cached.split(".")[0] == "services":
                del sys.modules[cached]
        mod = importlib.import_module("services.parsing")
        return mod._build_safe_fetch_url

    return _get_fn


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

class TestBuildSafeFetchUrl:
    """Unit tests for _build_safe_fetch_url path-deduplication fix."""

    def test_t_bsfu_001_no_doubled_storage_v1(self, build_safe_fetch_url):
        """
        T-BSFU-001: When SUPABASE_STORAGE_URL contains /storage/v1 and the
        signed URL path also starts with /storage/v1, the result must NOT
        contain /storage/v1/storage/v1.
        """
        fn = build_safe_fetch_url(_STORAGE_URL_WITH_PREFIX)
        result = fn(_SIGNED_URL)
        assert "/storage/v1/storage/v1" not in result, (
            f"Double path prefix detected in URL: {result!r}"
        )

    def test_t_bsfu_002_result_starts_with_supabase_storage_url(self, build_safe_fetch_url):
        """
        T-BSFU-002: The result must start with the value of SUPABASE_STORAGE_URL.
        """
        fn = build_safe_fetch_url(_STORAGE_URL_WITH_PREFIX)
        result = fn(_SIGNED_URL)
        assert result.startswith(_STORAGE_URL_WITH_PREFIX), (
            f"Result {result!r} does not start with SUPABASE_STORAGE_URL "
            f"{_STORAGE_URL_WITH_PREFIX!r}"
        )

    def test_t_bsfu_003_query_string_preserved(self, build_safe_fetch_url):
        """
        T-BSFU-003: The query string (signed token) must be preserved exactly
        in the output.
        """
        fn = build_safe_fetch_url(_STORAGE_URL_WITH_PREFIX)
        result = fn(_SIGNED_URL)
        assert result.endswith("?token=abc123"), (
            f"Query string not preserved in result: {result!r}"
        )

    def test_t_bsfu_004_no_prefix_in_base_url(self, build_safe_fetch_url):
        """
        T-BSFU-004: When SUPABASE_STORAGE_URL has no path prefix (just the
        host), the full signed URL path is appended correctly without
        duplication.
        """
        fn = build_safe_fetch_url(_STORAGE_URL_NO_PREFIX)
        result = fn(_SIGNED_URL)
        assert "/storage/v1/storage/v1" not in result, (
            f"Unexpected duplication in result: {result!r}"
        )
        assert "/storage/v1/object/sign/" in result, (
            f"Expected /storage/v1/object/sign/ in result: {result!r}"
        )
        assert result.startswith(_STORAGE_URL_NO_PREFIX), (
            f"Result {result!r} does not start with base URL "
            f"{_STORAGE_URL_NO_PREFIX!r}"
        )

    def test_t_bsfu_005_url_encoded_spaces_preserved(self, build_safe_fetch_url):
        """
        T-BSFU-005: Filenames with spaces (URL-encoded as %20) are preserved
        correctly in the output.
        """
        fn = build_safe_fetch_url(_STORAGE_URL_WITH_PREFIX)
        result = fn(_SIGNED_URL)
        assert "%20" in result, (
            f"URL-encoded spaces (%20) not preserved in result: {result!r}"
        )
        assert "LDCS%20structure%20and%20criteria.docx" in result, (
            f"Encoded filename not found in result: {result!r}"
        )

    def test_t_bsfu_full_expected_url(self, build_safe_fetch_url):
        """
        Integration: result must exactly match the expected corrected URL
        from the live error fixture.
        """
        fn = build_safe_fetch_url(_STORAGE_URL_WITH_PREFIX)
        result = fn(_SIGNED_URL)
        assert result == _EXPECTED_RESULT, (
            f"Result URL mismatch.\n  Got:      {result!r}\n  Expected: {_EXPECTED_RESULT!r}"
        )
