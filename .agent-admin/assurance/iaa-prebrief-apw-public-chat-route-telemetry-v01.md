# IAA Prebrief - APW Public Chat Route Telemetry v0.1

Wave ID: APW-PUBLIC-CHAT-ROUTE-TELEMETRY-V01
PR: TBD (superseding PR replacing #1913)
Repository: APGI-cmy/maturion-isms
Authority: CS2 - Johan Ras
Date: 2026-07-10

## Review objective

Verify that the public chat gateway emits route telemetry required for controlled-preview evidence without changing routing decisions or logging sensitive content.

## Required checks

- Telemetry logs only route, page, and history count.
- Prompt text is not logged.
- Answer text is not logged.
- Headers, cookies, tokens, credentials, IP addresses, tenant data, customer data, and user identity are not logged.
- Routing, prompt handling, and answer generation remain unchanged.
- Regression coverage proves telemetry emission and safe-data boundaries.

## Decision boundary

This wave supports evidence capture only. It does not approve production activation or modify APW Specialist routing behaviour.

Result: PREFLIGHT_BRIEF_COMPLETE
