"""APW Specialist red-test stubs.

Batch 5 deliberately introduces non-activating implementation stubs for the
APW Specialist routing path. These helpers are safe to test because they do
not call OpenAI, Supabase, vector search, or any external service.

The public chat endpoint is not wired to these stubs in this wave.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class RouteDecision:
    """A minimal route decision used by APW Specialist red tests."""

    route: str
    allowed: bool
    specialist_invoked: bool
    reason: str
    audit: dict[str, Any] = field(default_factory=dict)


class APWSpecialistRedTestStubs:
    """Non-activating stubs for future APW Specialist routing."""

    specialist_id = "apw-specialist"
    final_synthesizer = "maturion"

    def classify_route(
        self,
        message: str,
        context_envelope: dict[str, Any],
        registry_record: dict[str, Any] | None,
        candidate_sources: list[dict[str, Any]] | None,
        *,
        activation_approved: bool = False,
    ) -> RouteDecision:
        """Classify a public APW request without invoking the specialist."""

        context_error = self._validate_public_apw_context(context_envelope)
        if context_error:
            return self._blocked("blocked_context", context_error, context_envelope)

        if self._requires_private_context(message):
            return self._blocked(
                "blocked_private_context",
                "request requires private, tenant, internal, secret or authority-bound context",
                context_envelope,
            )

        registry_error = self._validate_registry(registry_record)
        if registry_error:
            return self._blocked("blocked_registry", registry_error, context_envelope)

        filter_error = self._validate_public_sources(candidate_sources or [])
        if filter_error:
            return self._blocked("blocked_unsafe_source", filter_error, context_envelope)

        if not activation_approved:
            return self._blocked(
                "blocked_activation",
                "activation wave approval is required before specialist invocation",
                context_envelope,
            )

        return self._blocked(
            "blocked_stub_boundary",
            "Batch 5 stubs never invoke APW Specialist",
            context_envelope,
        )

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
                reason="source limitations are required in Batch 5 stub validation",
                audit={"final_synthesizer": self.final_synthesizer},
            )

        return RouteDecision(
            route="validated_draft_only",
            allowed=True,
            specialist_invoked=False,
            reason="draft output passed stub validation but remains non-final",
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

    @staticmethod
    def _requires_private_context(message: str) -> bool:
        lower = message.lower()
        private_terms = (
            "tenant audit",
            "customer configuration",
            "incident evidence",
            "investigation record",
            "internal governance",
            "secret",
            "cs2 approval",
            "sign off",
            "runtime registry internals",
        )
        return any(term in lower for term in private_terms)

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
            audit={
                "app": context_envelope.get("app"),
                "embodiment": context_envelope.get("embodiment"),
                "permission_scope": context_envelope.get("permission_scope"),
                "specialist_id": self.specialist_id,
                "final_synthesizer": self.final_synthesizer,
            },
        )
