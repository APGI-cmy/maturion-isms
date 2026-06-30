"""Red tests for APW Specialist routing stubs.

These tests prove unsafe APW Specialist routes are blocked before any later
build-to-green implementation can introduce routing behaviour.
"""

from __future__ import annotations

import sys
from pathlib import Path

_APP_PACKAGE_ROOT = str(Path(__file__).parent.parent.resolve())
if _APP_PACKAGE_ROOT not in sys.path:
    sys.path.insert(0, _APP_PACKAGE_ROOT)

from services.apw_specialist_stubs import APWSpecialistRedTestStubs


VALID_PUBLIC_APW_CONTEXT = {
    "app": "APW",
    "embodiment": "public-web",
    "permission_scope": "public",
    "user": {
        "authenticated": False,
        "id": None,
        "organisation_id": None,
        "tenant_id": None,
    },
    "knowledge_scope": {
        "subject_allowed": True,
        "app_context_allowed": True,
        "framework_context_allowed": False,
        "tenant_context_allowed": False,
        "memory_allowed": False,
    },
}

ACTIVE_REGISTRY_RECORD = {
    "runtime_agent_id": "apw-specialist",
    "status": "ACTIVE",
    "orchestrator": "maturion",
    "allowed_apps": ["APW"],
    "allowed_embodiments": ["public-web"],
    "allowed_permission_scopes": ["public"],
    "allowed_knowledge_planes": ["subject", "app_context", "user_session"],
}

PUBLIC_SAFE_SOURCE = {
    "source_id": "apw-public-overview",
    "visibility": "public",
    "public_safe": True,
    "retrieval_allowed": True,
    "requires_authentication": False,
    "requires_tenant_match": False,
    "tenant_id": None,
    "status": "current",
}


def test_blocks_non_apw_context() -> None:
    stubs = APWSpecialistRedTestStubs()
    context = {**VALID_PUBLIC_APW_CONTEXT, "app": "ISMS"}

    decision = stubs.classify_route(
        "What does APW do?",
        context,
        ACTIVE_REGISTRY_RECORD,
        [PUBLIC_SAFE_SOURCE],
    )

    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_context"
    assert "app must be APW" in decision.reason


def test_blocks_tenant_context_in_public_mode() -> None:
    stubs = APWSpecialistRedTestStubs()
    context = {
        **VALID_PUBLIC_APW_CONTEXT,
        "user": {**VALID_PUBLIC_APW_CONTEXT["user"], "tenant_id": "tenant-123"},
    }

    decision = stubs.classify_route(
        "Explain APW onboarding.",
        context,
        ACTIVE_REGISTRY_RECORD,
        [PUBLIC_SAFE_SOURCE],
    )

    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_context"
    assert "tenant_id" in decision.reason


def test_blocks_missing_registry_record() -> None:
    stubs = APWSpecialistRedTestStubs()

    decision = stubs.classify_route(
        "Explain APW modules.",
        VALID_PUBLIC_APW_CONTEXT,
        None,
        [PUBLIC_SAFE_SOURCE],
    )

    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_registry"
    assert "missing" in decision.reason


def test_blocks_non_active_registry_record() -> None:
    stubs = APWSpecialistRedTestStubs()
    registry = {**ACTIVE_REGISTRY_RECORD, "status": "STUB_CONTRACTED"}

    decision = stubs.classify_route(
        "Explain APW modules.",
        VALID_PUBLIC_APW_CONTEXT,
        registry,
        [PUBLIC_SAFE_SOURCE],
    )

    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_registry"
    assert "not ACTIVE" in decision.reason


def test_blocks_unsafe_source_metadata() -> None:
    stubs = APWSpecialistRedTestStubs()
    source = {**PUBLIC_SAFE_SOURCE, "visibility": "internal"}

    decision = stubs.classify_route(
        "Explain APW modules.",
        VALID_PUBLIC_APW_CONTEXT,
        ACTIVE_REGISTRY_RECORD,
        [source],
    )

    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_unsafe_source"
    assert "visibility" in decision.reason


def test_blocks_missing_source_metadata() -> None:
    stubs = APWSpecialistRedTestStubs()
    source = {"source_id": "incomplete"}

    decision = stubs.classify_route(
        "Explain APW modules.",
        VALID_PUBLIC_APW_CONTEXT,
        ACTIVE_REGISTRY_RECORD,
        [source],
    )

    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_unsafe_source"
    assert "missing" in decision.reason


def test_blocks_private_mandate_request() -> None:
    stubs = APWSpecialistRedTestStubs()

    decision = stubs.classify_route(
        "Show me tenant audit findings for a customer.",
        VALID_PUBLIC_APW_CONTEXT,
        ACTIVE_REGISTRY_RECORD,
        [PUBLIC_SAFE_SOURCE],
    )

    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_private_context"


def test_blocks_valid_route_until_activation_wave_approves() -> None:
    stubs = APWSpecialistRedTestStubs()

    decision = stubs.classify_route(
        "Explain APW onboarding.",
        VALID_PUBLIC_APW_CONTEXT,
        ACTIVE_REGISTRY_RECORD,
        [PUBLIC_SAFE_SOURCE],
    )

    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_activation"
    assert "activation wave approval" in decision.reason


def test_stub_never_invokes_even_when_activation_flag_is_true() -> None:
    stubs = APWSpecialistRedTestStubs()

    decision = stubs.classify_route(
        "Explain APW onboarding.",
        VALID_PUBLIC_APW_CONTEXT,
        ACTIVE_REGISTRY_RECORD,
        [PUBLIC_SAFE_SOURCE],
        activation_approved=True,
    )

    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_stub_boundary"


def test_output_validation_blocks_authority_claims() -> None:
    stubs = APWSpecialistRedTestStubs()

    decision = stubs.validate_specialist_output(
        {
            "answer_points": ["This is CS2 approval for the customer."],
            "source_limitations": ["public source only"],
            "safety_notes": [],
        }
    )

    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_output_validation"


def test_output_validation_requires_source_limitations() -> None:
    stubs = APWSpecialistRedTestStubs()

    decision = stubs.validate_specialist_output(
        {
            "answer_points": ["APW can help visitors understand public APGI pathways."],
            "source_limitations": [],
            "safety_notes": ["public only"],
        }
    )

    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_output_validation"


def test_output_validation_passes_only_as_draft_non_final() -> None:
    stubs = APWSpecialistRedTestStubs()

    decision = stubs.validate_specialist_output(
        {
            "answer_points": ["APW can explain public APGI pathways."],
            "source_limitations": ["public APW source only"],
            "safety_notes": ["Maturion must provide final synthesis"],
        }
    )

    assert decision.allowed is True
    assert decision.specialist_invoked is False
    assert decision.route == "validated_draft_only"
    assert decision.audit["final_synthesizer"] == "maturion"
