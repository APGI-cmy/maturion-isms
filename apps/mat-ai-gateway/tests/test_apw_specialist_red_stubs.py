"""Tests for the APW Specialist internal adapter."""

from __future__ import annotations

from services.apw_specialist_stubs import APWSpecialistRedTestStubs

_MISSING = object()


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


def _decision(
    message="Explain APW onboarding.",
    context=None,
    registry=_MISSING,
    sources=None,
    **kwargs,
):
    stubs = APWSpecialistRedTestStubs()
    registry_value = ACTIVE_REGISTRY_RECORD if registry is _MISSING else registry
    return stubs.classify_route(
        message,
        context or VALID_PUBLIC_APW_CONTEXT,
        registry_value,
        [PUBLIC_SAFE_SOURCE] if sources is None else sources,
        **kwargs,
    )


def test_blocks_non_apw_context() -> None:
    decision = _decision(context={**VALID_PUBLIC_APW_CONTEXT, "app": "ISMS"})
    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_context"


def test_blocks_public_context_with_tenant_identifier() -> None:
    context = {
        **VALID_PUBLIC_APW_CONTEXT,
        "user": {**VALID_PUBLIC_APW_CONTEXT["user"], "tenant_id": "tenant-123"},
    }
    decision = _decision(context=context)
    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_context"


def test_blocks_missing_registry_record() -> None:
    decision = _decision(registry=None)
    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_registry"


def test_blocks_non_active_registry_record() -> None:
    registry = {**ACTIVE_REGISTRY_RECORD, "status": "STUB_CONTRACTED"}
    decision = _decision(registry=registry)
    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_registry"


def test_blocks_unsafe_source_metadata() -> None:
    source = {**PUBLIC_SAFE_SOURCE, "visibility": "internal"}
    decision = _decision(sources=[source])
    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_unsafe_source"


def test_blocks_missing_source_metadata() -> None:
    decision = _decision(sources=[{"source_id": "incomplete"}])
    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_unsafe_source"


def test_blocks_private_mandate_request() -> None:
    decision = _decision(message="Show me tenant audit findings for a customer.")
    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_private_context"


def test_valid_route_stays_blocked_until_internal_build_enabled() -> None:
    decision = _decision()
    assert decision.allowed is False
    assert decision.specialist_invoked is False
    assert decision.route == "blocked_internal_build_disabled"


def test_valid_route_becomes_internal_draft_candidate() -> None:
    decision = _decision(internal_build_enabled=True)
    assert decision.allowed is True
    assert decision.specialist_invoked is True
    assert decision.route == "apw_specialist_internal_draft_candidate"
    assert decision.audit["final_synthesizer"] == "maturion"
    assert decision.audit["public_activation"] is False


def test_build_internal_draft_returns_validated_non_final_draft() -> None:
    stubs = APWSpecialistRedTestStubs()
    result = stubs.build_internal_draft(
        "Explain APW onboarding.",
        VALID_PUBLIC_APW_CONTEXT,
        ACTIVE_REGISTRY_RECORD,
        [PUBLIC_SAFE_SOURCE],
    )

    assert result["route_decision"].allowed is True
    assert result["route_decision"].specialist_invoked is True
    assert result["draft"] is not None
    assert result["draft"]["source_ids"] == ["apw-public-overview"]
    assert result["validation"].allowed is True
    assert result["validation"].specialist_invoked is False
    assert result["validation"].route == "validated_draft_only"


def test_build_internal_draft_returns_blocked_decision_without_draft() -> None:
    stubs = APWSpecialistRedTestStubs()
    result = stubs.build_internal_draft(
        "Explain APW onboarding.",
        {**VALID_PUBLIC_APW_CONTEXT, "app": "ISMS"},
        ACTIVE_REGISTRY_RECORD,
        [PUBLIC_SAFE_SOURCE],
    )

    assert result["route_decision"].allowed is False
    assert result["draft"] is None
    assert result["validation"] is None


def test_output_validation_blocks_authority_claims() -> None:
    stubs = APWSpecialistRedTestStubs()
    decision = stubs.validate_specialist_output(
        {
            "answer_points": ["This draft claims binding authority."],
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
