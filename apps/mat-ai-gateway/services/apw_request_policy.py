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

_ACCESS_INTENT = re.compile(
    r"\b(show|give|provide|list|display|reveal|disclose|share|send|export|"
    r"download|retrieve|access|read|view|open|search|find|lookup)\b|\blook up\b"
)

_HOLDING_INTENT = re.compile(
    r"\b(have|has|held|hold|holds|store|stores|stored|retain|retains|retained|"
    r"keep|keeps|kept|possess|possesses|possessed|access)\b"
)

_PROTECTED_SUBJECT = re.compile(
    r"\b(customer|customers|client|clients|tenant|tenants|account|accounts|"
    r"user|users|employee|employees|personnel|organisation|organisations|"
    r"organization|organizations)\b"
)

_PROTECTED_OBJECT = re.compile(
    r"\b(information|info|data|record|records|detail|details|file|files|document|"
    r"documents|profile|profiles|history|audit|finding|findings|evidence|incident|"
    r"investigation|configuration|memory)\b"
)

_PROTECTED_PHRASE = re.compile(
    r"\b(customer|customers|client|clients|tenant|tenants|account|accounts|"
    r"user|users|employee|employees|personnel|organisation|organisations|"
    r"organization|organizations)(?:'s|s')?\s+"
    r"(information|info|data|record|records|detail|details|file|files|document|"
    r"documents|profile|profiles|history|audit|finding|findings|evidence|incident|"
    r"investigation|configuration|memory)\b"
)

_REVERSE_PROTECTED_PHRASE = re.compile(
    r"\b(information|info|data|record|records|detail|details|file|files|document|"
    r"documents|profile|profiles|history|audit|finding|findings|evidence|incident|"
    r"investigation|configuration|memory)\b.{0,30}\b"
    r"(about|for|of|from|belonging to)\s+"
    r"(customer|customers|client|clients|tenant|tenants|account|accounts|user|users|"
    r"employee|employees|personnel|organisation|organisations|organization|organizations)\b"
)

_PERSONAL_ACCOUNT_ACCESS = re.compile(
    r"\b(access|open|view|show|retrieve|download)\b.{0,30}\b(my|our|their|a|an)\s+"
    r"(account|profile|record|records|file|files|data|information)\b"
)


def requires_private_context(message: str) -> bool:
    """Return True when a public request needs non-public context."""

    lower = " ".join(message.lower().replace("’", "'").split())
    if any(term in lower for term in _ALWAYS_RESTRICTED_TERMS):
        return True

    has_private_qualifier = any(term in lower for term in _PRIVATE_QUALIFIERS)
    has_public_safe_context = any(term in lower for term in _PUBLIC_SAFE_CONTEXT_TERMS)
    has_access_intent = _ACCESS_INTENT.search(lower) is not None
    has_holding_intent = _HOLDING_INTENT.search(lower) is not None
    has_protected_subject = _PROTECTED_SUBJECT.search(lower) is not None
    has_protected_object = _PROTECTED_OBJECT.search(lower) is not None
    has_protected_phrase = (
        _PROTECTED_PHRASE.search(lower) is not None
        or _REVERSE_PROTECTED_PHRASE.search(lower) is not None
    )

    if has_private_qualifier and (has_access_intent or has_holding_intent):
        return True
    if has_holding_intent and has_protected_subject and has_protected_object:
        return True
    if has_access_intent and has_protected_phrase and not has_public_safe_context:
        return True
    if _PERSONAL_ACCOUNT_ACCESS.search(lower) and not has_public_safe_context:
        return True

    return False
