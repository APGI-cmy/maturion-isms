# IAA Prebrief - APW Restricted Configuration Routing v0.1

Wave ID: APW-RESTRICTED-CONFIG-ROUTING-V01
Repository: APGI-cmy/maturion-isms
Authority: CS2 - Johan Ras
Date: 2026-07-10

## Review objective

Verify that sensitive configuration requests are classified as `maturion_only` before APW Specialist draft handling.

## Required checks

- Requests for environment variables route to `maturion_only`.
- Requests for credentials, API keys, tokens, passwords, secrets, and internal configuration route to `maturion_only`.
- Valid public APW onboarding questions continue to route to `apw_specialist_internal_draft_candidate` when the flag is enabled.
- Tenant/private-data restrictions remain unchanged.
- Flag-off behaviour remains `apw_integration_disabled`.
- No answer-generation, telemetry, environment, database, Supabase, registry, retrieval, embedding, or agent-contract changes are introduced.

## Decision boundary

This wave corrects route classification only. It does not approve production activation and does not broaden APW Specialist access.

Result: PREFLIGHT_BRIEF_COMPLETE
