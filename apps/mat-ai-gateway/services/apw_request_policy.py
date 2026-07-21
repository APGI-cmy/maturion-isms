"""Shared fail-closed request policy for the public APW integration."""

from __future__ import annotations

import re


# Broad confidentiality/data nouns are intentionally evaluated together with
# request/access verbs. This catches natural wording without blocking public
# descriptions such as "How does APW protect client information?".
_PRIVATE_QUALIFIERS = (
    "private",
    "confidential",
    "restricted",
    "non-public",
    "nonpublic",
    "internal",
    "sensitive",
)

_PROTECTED_SUBJECTS = (
    "customer",
    "client",
    "tenant",
    "account",
    "user",
    "employee",
    "personnel",
    "organisation",
    "organization",
)

_PROTECTED_OBJECTS = (
    "information",
    "data",
    "record",
    "records",
    "detail",
    "details",
    "file",
    "files",
    "document",
    "documents",
    "profile",
    "profiles",
    "history",
    "audit",
    "finding",
    "findings",
    "evidence",
    "investigation",
    "incident",
    "configuration",
    "memory",
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
    "what do you hold",
    "what information do you hold",
    "what data do you hold",
    "what records do you hold",
    "what can you access",
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

_NATURAL_LANGUAGE_HOLDING_QUERY = re.compile(
    r"\bwhat\b.{0,80}\b(information|data|records?|details?|files?|documents?|"
    r"profiles?|history|evidence)\b.{0,50}\b(do you|does apw|can you|can apw)\b"
    r".{0,30}\b(hold|have|store|retain|access|keep)\b"
)


def requires_private_context(message: str) -> bool:
    """Return True when a public request needs non-public context.

    The policy fails closed for explicit confidentiality language and for
    disclosure/access requests involving protected people or protected data.
    """

    lower = " ".join(message.lower().split())
    if any(term in lower for term in _ALWAYS_RESTRICTED_TERMS):
        return True
    if _NATURAL_LANGUAGE_HOLDING_QUERY.search(lower):
        return True

    has_access_intent = any(term in lower for term in _ACCESS_OR_DISCLOSURE_TERMS)
    has_private_qualifier = any(term in lower for term in _PRIVATE_QUALIFIERS)
    has_protected_subject = any(term in lower for term in _PROTECTED_SUBJECTS)
    has_protected_object = any(term in lower for term in _PROTECTED_OBJECTS)

    if has_access_intent and has_private_qualifier:
        return True
    if has_access_intent and has_protected_subject and has_protected_object:
        return True

    # Catch possessive/plural natural-language variants such as
    # "client records", "customers' data" and "account details".
    protected_phrase = re.compile(
        r"\b(customer|customers|client|clients|tenant|tenants|account|accounts|"
        r"user|users|employee|employees|personnel|organisation|organization)"
        r"(?:'s|s')?\s+"
        r"(information|data|record|records|detail|details|file|files|document|"
        r"documents|profile|profiles|history|audit|findings|evidence|incident|"
        r"investigation|configuration|memory)\b"
    )
    return bool(has_access_intent and protected_phrase.search(lower))
