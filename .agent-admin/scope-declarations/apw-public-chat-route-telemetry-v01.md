SCOPE_SCHEMA_VERSION: v2
PR_NUMBER: 1913
ISSUE: #1913 - Add safe public chat route telemetry
BRANCH: apw-public-chat-route-telemetry-v01
OWNER: chatgpt-cs2-proxy
DATE_UTC: 2026-07-08T10:10:00Z

# Scope Declaration - APW Public Chat Route Telemetry v0.1

## PR Responsibility Domain

RESPONSIBILITY_DOMAIN: Add safe route telemetry for the APW public chat gateway so controlled-preview route evidence can be captured from Render logs.

## Explicitly In Scope

IN_SCOPE:
- Add safe public-chat route telemetry logging.
- Log route, page and history count only.
- Add a test proving telemetry exists.
- Add a test guard that prompt text and answer text are not logged.
- Preserve Maturion as the final public response authority.

## Explicitly Out of Scope

OUT_OF_SCOPE:
- Changing routing decisions.
- Changing prompt handling.
- Changing answer generation.
- Logging prompt text.
- Logging answer text.
- Logging headers, cookies, tokens, credentials, IP addresses, tenant data, customer data, or user identity.
- Environment setting changes.
- Database or Supabase changes.
- Registry changes.
- Retrieval or embedding changes.
- Agent contract changes.

## FILES_CHANGED

FILES_CHANGED: 4
- `.agent-admin/scope-declarations/apw-public-chat-route-telemetry-v01.md`
- `.agent-admin/scope-declarations/pr-1913.md`
- `apps/mat-ai-gateway/routers/ai_routes.py`
- `apps/mat-ai-gateway/tests/test_public_chat.py`

## Evidence Boundary

This PR only makes route evidence visible in service logs. It does not approve production activation or change APW Specialist routing behaviour.
