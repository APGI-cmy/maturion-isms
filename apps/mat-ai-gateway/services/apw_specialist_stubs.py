"""APW Specialist internal adapter.

Batch 6 turns the Batch 5 red-test stubs into an internal build-to-green
adapter. It remains deterministic and local: no OpenAI, Supabase, vector
search, public endpoint wiring, production registry mutation, or activation.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from services.apw_request_policy import requires_private_context


@dataclass(frozen=True)
class RouteDecision:
    """A minimal route decision used by APW Specialist tests."""

    route: str
    allowed: bool
    specialist_invoked: bool
    reason: str
    audit: dict[str, Any] = field(default_factory=dict)


class APWSpecialistRedTestStubs:
    """Internal APW Specialist adapter for Batch 6 build-to-green."""

    specialist_id = "apw-specialist"
    final_synthesizer = "maturion"

    def classify_route(
        self,
        message: str,
        context_envelope: dict[str, Any],
        registry_record: dict[str, Any] | None,
        candidate_sources: list[dict[str, Any]] | None,
        *,
        internal_build_enabled: bool = False,
    ) -> RouteDecision:
        """Classify a public APW request without public activation."""

        context_error = self._validate_public_apw_context(context_envelope)
        if context_error:
            return self._blocked("blocked_context", context_error, context_envelope)

        if requires_private_context(message):
            return self._blocked(
                "blocked_private_context",
                "request requires non-public APW context",
                context_envelope,
            )

        registry_error = self._validate_registry(registry_record)
        if registry_error:
            return self._blocked("blocked_registry", registry_error, context_envelope)

        filter_error = self._validate_public_sources(candidate_sources or [])
        if filter_error:
            return self._blocked("blocked_unsafe_source", filter_error, context_envelope)

        if not internal_build_enabled:
            return self._blocked(
                "blocked_internal_build_disabled",
                "internal build-to-green flag is required before draft support",
                context_envelope,
            )

        return RouteDecision(
            route="apw_specialist_internal_draft_candidate",
            allowed=True,
            specialist_invoked=True,
            reason="valid public APW request is eligible for internal draft support",
            audit=self._audit(context_envelope),
        )

    def build_internal_draft(
        self,
        message: str,
        context_envelope: dict[str, Any],
        registry_record: dict[str, Any] | None,
        candidate_sources: list[dict[str, Any]] | None,
    ) -> dict[str, Any]:
        """Build deterministic internal draft support for Maturion."""

        decision = self.classify_route(
            message,
            context_envelope,
            registry_record,
            candidate_sources,
            internal_build_enabled=True,
        )
        if not decision.allowed:
            return {
                "route_decision": decision,
                "draft": None,
                "validation": None,
            }

        source_ids = [str(source.get("source_id")) for source in candidate_sources or []]
        draft = {
            "answer_points": [
                "APW can explain public APGI pathways and onboarding steps.",
                "APW can guide visitors to public information and approved handoff options.",
            ],
            "source_limitations": [
                "Draft is limited to public APW context and approved public sources.",
                "Tenant, account, audit and private records are outside this public path.",
            ],
            "safety_notes": [
                "Maturion remains responsible for final synthesis.",
                "This draft is not a commitment, approval, quote or activation decision.",
            ],
            "source_ids": source_ids,
        }
        validation = self.validate_specialist_output(draft)
        return {
            "route_decision": decision,
            "draft": draft,
            "validation": validation,
        }

    def validate_specialist_output(self, output: dict[str, Any]) -> RouteDecision:
        """Validate proposed specialist output without returning it to users."""

        answer_points = " ".join(str(item) for item in output.get("answer_points", []))
        safety_notes = " ".join(str(item) for item in output.get("safety_notes", []))
        combined = f"{answer_points} {safety_notes}".lower()

        forbidden_fragments = (
            "cs2 approval",
            "binding authority",
            "tenant audit",
            "customer record",
            "internal governance",
            "secret",
            "guaranteed price",
            "guaranteed delivery",
        )
        for fragment in forbidden_fragments:
            if fragment in combined:
                return RouteDecision(
                    route="blocked_output_validation",
                    allowed=False,
                    specialist_invoked=False,
                    reason=f"specialist output contains prohibited claim: {fragment}",
                    audit={"final_synthesizer": self.final_synthesizer},
                )

        if not output.get("source_limitations"):
            return RouteDecision(
                route="blocked_output_validation",
                allowed=False,
                specialist_invoked=False,
                reason="source limitations are required in Batch 6 validation",
                audit={"final_synthesizer": self.final_synthesizer},
            )

        return RouteDecision(
            route="validated_draft_only",
            allowed=True,
            specialist_invoked=False,
            reason="draft output passed validation but remains non-final",
            audit={"final_synthesizer": self.final_synthesizer},
        )

    def _validate_public_apw_context(self, envelope: dict[str, Any]) -> str | None:
        if envelope.get("app") != "APW":
            return "app must be APW"
        if envelope.get("embodiment") != "public-web":
            return "embodiment must be public-web"
        if envelope.get("permission_scope") != "public":
            return "permission scope must be public"

        user = envelope.get("user") or {}
        if user.get("tenant_id") is not None:
            return "tenant_id must be absent in public APW mode"
        if user.get("organisation_id") is not None:
            return "organisation_id must be absent in public APW mode"

        knowledge_scope = envelope.get("knowledge_scope") or {}
        if knowledge_scope.get("tenant_context_allowed"):
            return "tenant context is not allowed in public APW mode"
        if knowledge_scope.get("memory_allowed"):
            return "memory is not allowed in public APW mode"
        if knowledge_scope.get("framework_context_allowed"):
            return "framework context is not allowed in public APW mode"

        return None

    def _validate_registry(self, registry_record: dict[str, Any] | None) -> str | None:
        if not registry_record:
            return "runtime registry record is missing"
        if registry_record.get("runtime_agent_id") != self.specialist_id:
            return "runtime registry record does not describe apw-specialist"
        if registry_record.get("status") != "ACTIVE":
            return "runtime registry status is not ACTIVE"
        if registry_record.get("orchestrator") != "maturion":
            return "orchestrator must be maturion"
        if "APW" not in registry_record.get("allowed_apps", []):
            return "registry does not allow APW"
        if "public-web" not in registry_record.get("allowed_embodiments", []):
            return "registry does not allow public-web"
        if "public" not in registry_record.get("allowed_permission_scopes", []):
            return "registry does not allow public scope"
        return None

    @staticmethod
    def _validate_public_sources(sources: list[dict[str, Any]]) -> str | None:
        if not sources:
            return "at least one public-safe source is required"

        required = {
            "visibility",
            "public_safe",
            "retrieval_allowed",
            "requires_authentication",
            "requires_tenant_match",
            "tenant_id",
            "status",
        }
        for source in sources:
            missing = required.difference(source)
            if missing:
                return "source metadata is missing: " + ", ".join(sorted(missing))
            if source.get("visibility") != "public":
                return "source visibility is not public"
            if source.get("public_safe") is not True:
                return "source is not public_safe"
            if source.get("retrieval_allowed") is not True:
                return "source retrieval is not allowed"
            if source.get("requires_authentication") is not False:
                return "source requires authentication"
            if source.get("requires_tenant_match") is not False:
                return "source requires tenant match"
            if source.get("tenant_id") is not None:
                return "source has tenant_id in public mode"
            if source.get("status") in {"expired", "superseded"}:
                return "source is expired or superseded"
        return None

    def _blocked(
        self,
        route: str,
        reason: str,
        context_envelope: dict[str, Any],
    ) -> RouteDecision:
        return RouteDecision(
            route=route,
            allowed=False,
            specialist_invoked=False,
            reason=reason,
            audit=self._audit(context_envelope),
        )

    def _audit(self, context_envelope: dict[str, Any]) -> dict[str, Any]:
        return {
            "app": context_envelope.get("app"),
            "embodiment": context_envelope.get("embodiment"),
            "permission_scope": context_envelope.get("permission_scope"),
            "specialist_id": self.specialist_id,
            "final_synthesizer": self.final_synthesizer,
            "public_activation": False,
        }
