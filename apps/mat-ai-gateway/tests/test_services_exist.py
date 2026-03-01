"""
test_services_exist.py — RED gate test: service module existence and structure.

Architecture: modules/mat/02-architecture/system-architecture.md §3.4 (AI Services)

Each service module must:
1. Be importable from the `services` sub-package.
2. Expose at least one public class or callable (not an empty module).

Contract: These tests MUST fail (RED) until api-builder creates
  apps/mat-ai-gateway/services/__init__.py
  apps/mat-ai-gateway/services/parsing.py
  apps/mat-ai-gateway/services/scoring.py
  apps/mat-ai-gateway/services/transcription.py
  apps/mat-ai-gateway/services/reporting.py
  apps/mat-ai-gateway/services/image_analysis.py
"""

from __future__ import annotations

import importlib
import inspect
import sys
import types

import pytest

# ---------------------------------------------------------------------------
# Required service modules (name → human description for assertion messages)
# ---------------------------------------------------------------------------
_SERVICE_MODULES: dict[str, str] = {
    "services.parsing": "Document Parsing (GPT-4 Turbo, PDF/DOCX → structured criteria JSON)",
    "services.scoring": "Maturity Scoring (GPT-4 Turbo, evidence+criteria → maturity level)",
    "services.transcription": "Transcription (Whisper, audio → timestamped transcript)",
    "services.reporting": "Report Generation (GPT-4 Turbo, audit data → DOCX/PDF/JSON report)",
    "services.image_analysis": "Image Analysis (GPT-4 Vision, photo evidence → description+compliance)",
}


def _load_service(module_name: str, app_root: str) -> types.ModuleType:
    """Import a service module from the gateway package root."""
    if app_root not in sys.path:
        sys.path.insert(0, app_root)

    # Ensure fresh import so stale failures don't mask real ones
    for cached in list(sys.modules):
        if cached == module_name or cached.startswith(module_name + "."):
            del sys.modules[cached]

    return importlib.import_module(module_name)


def _app_root() -> str:
    import pathlib
    return str(pathlib.Path(__file__).parent.parent.resolve())


def _public_members(module: types.ModuleType) -> list[str]:
    """Return names of public (non-dunder) attributes in the module."""
    result = []
    for name in dir(module):
        if name.startswith("_"):
            continue
        attr = getattr(module, name)
        if inspect.isclass(attr) or callable(attr):
            result.append(name)
    return result


# ---------------------------------------------------------------------------
# Parametrised import tests
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("module_name,description", list(_SERVICE_MODULES.items()))
def test_service_module_is_importable(module_name: str, description: str):
    """
    Each AI service module must be importable without errors.

    Failure here means the file is missing or contains a syntax/import error.
    """
    try:
        _load_service(module_name, _app_root())
    except ModuleNotFoundError as exc:
        pytest.fail(
            f"Service module '{module_name}' ({description}) could not be imported.\n"
            f"ModuleNotFoundError: {exc}\n"
            "api-builder must create this module before this gate can turn GREEN."
        )
    except ImportError as exc:
        pytest.fail(
            f"Service module '{module_name}' ({description}) raised ImportError: {exc}"
        )


@pytest.mark.parametrize("module_name,description", list(_SERVICE_MODULES.items()))
def test_service_module_has_public_members(module_name: str, description: str):
    """
    Each service module must expose at least one public class or callable.

    An empty module (or one with only private/_dunder members) does not satisfy
    the architectural contract: each service must provide a concrete interface
    that the AI Gateway router can dispatch to.
    """
    try:
        mod = _load_service(module_name, _app_root())
    except (ModuleNotFoundError, ImportError) as exc:
        pytest.fail(
            f"Cannot verify public members — module '{module_name}' failed to import: {exc}"
        )

    public = _public_members(mod)
    assert len(public) > 0, (
        f"Service module '{module_name}' ({description}) is empty.\n"
        f"It must expose at least one public class or callable.\n"
        f"Current public members: {public!r}"
    )


@pytest.mark.parametrize("module_name,description", list(_SERVICE_MODULES.items()))
def test_service_module_has_class_or_function(module_name: str, description: str):
    """
    Each service module must contain at least one class or top-level function
    (not just module-level constants or re-exported names).

    This enforces that actual service logic exists, not just a pass-through stub.
    """
    try:
        mod = _load_service(module_name, _app_root())
    except (ModuleNotFoundError, ImportError) as exc:
        pytest.fail(
            f"Cannot verify structure — module '{module_name}' failed to import: {exc}"
        )

    has_class = False
    has_function = False
    for name in dir(mod):
        if name.startswith("_"):
            continue
        attr = getattr(mod, name)
        if inspect.isclass(attr):
            has_class = True
            break
        if inspect.isfunction(attr):
            has_function = True

    assert has_class or has_function, (
        f"Service module '{module_name}' ({description}) must define at least one class "
        f"or function at module level.\n"
        f"Detected attributes: {[n for n in dir(mod) if not n.startswith('_')]!r}\n"
        "A module with only imported constants or pass stubs is insufficient."
    )
