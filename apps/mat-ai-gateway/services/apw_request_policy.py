"""Shared fail-closed request policy for the public APW integration."""

from __future__ import annotations

import re

_PRIVATE_QUALIFIERS = (
    "private",
    "confidential",
    "restricted",
    "non-public",
    "nonpublic",
    "internal",
    "sensitive",
)

_ACCESS_OR_DISCLOSURE_TERMS = (
    "show",
    "give",
    "provide",
    "list",
    "display",
    "reveal",
    "disclose",
    "share",
    "send",
    "export",
    "download",
    "retrieve",
    "access",
    "read",
    "view",
    "open",
    "search",
    "find",
    "lookup",
    "look up",
)

_HOLDING_OR_EXISTENCE_TERMS = (
    "have",
    "hold",
    "holds",
    "store",
    "stores",
    "retain",
    "retains",
    "keep",
    "keeps",
    "possess",
    "possesses",
    "can access",
    "do you hold",
    "does apw hold",
    "do you have",
    "does apw have",
)

_PUBLIC_SAFE_CONTEXT_TERMS = (
    "public",
    "onboarding",
    "public website",
    "published",
    "brochure",
    "marketing",
    "documentation",
    "help page",
)

_ALWAYS_RESTRICTED_TERMS = (
    "tenant audit",
    "customer configuration",
    "incident evidence",
    "investigation record",
    "internal governance",
    "environment variable",
    "environment-variable",
    "env var",
    "credential",
    "api key",
    "access token",
    "service token",
    "bearer token",
    "token",
    "password",
    "secret",
    "internal configuration",
    "configuration detail",
    "cs2 approval",
    "sign off",
    "runtime registry internals",
)

_PROTECTED_PHRASE = re.compile(
    r"\b(customer|customers|client|clients|tenant|tenants|account|accounts|"
    r"user|users|employee|employees|personnel|organisation|organization)"
    r"(?:'s|s')?\s+"
    r"(information|info|data|record|records|detail|details|file|files|document|"
    r"documents|profile|profiles|history|audit|finding|findings|evidence|incident|"
    r"investigation|configuration|memory)\b"
)

_NATURAL_LANGUAGE_HOLDING_QUERY = re.compile(
    r"\b(does|do|can|what)\b.{0,80}\b(apw|you)\b.{0,50}"
    r"\b(have|hold|holds|store|stores|retain|retains|keep|keeps|possess|possesses|access)\b"
)


def requires_private_context(message: str) -> bool:
    """Return True when a public request needs non-public context."""

    lower = " ".join(message.lower().split())
    if any(term in lower for term in _ALWAYS_RESTRICTED_TERMS):
        return True

    has_private_qualifier = any(term in lower for term in _PRIVATE_QUALIFIERS)
    has_access_intent = any(term in lower for term in _ACCESS_OR_DISCLOSURE_TERMS)
    has_holding_intent = any(term in lower for term in _HOLDING_OR_EXISTENCE_TERMS)
    has_public_safe_context = any(term in lower for term in _PUBLIC_SAFE_CONTEXT_TERMS)
    protected_phrase = _PROTECTED_PHRASE.search(lower) is not None
    natural_holding_query = _NATURAL_LANGUAGE_HOLDING_QUERY.search(lower) is not None

    if has_private_qualifier and (has_access_intent or has_holding_intent):
        return True
    if natural_holding_query and (has_private_qualifier or protected_phrase):
        return True
    if has_access_intent and protected_phrase and not has_public_safe_context:
        return True

    return False
