# ECAP - PIT Stage 12 W8.2

Issue: maturion-isms#1774

## Scope authority

W8.2 is authorized to start after W8.1 hydrated smoke evidence was merged in PR #1780.

## Primary artifacts touched

- apps/isms-portal/src/lib/routes.ts
- apps/isms-portal/src/lib/pitAccess.ts
- apps/isms-portal/src/lib/pitAccess.test.ts
- apps/isms-portal/src/App.tsx
- modules/pit/12-build/w82-rls-denied-path-evidence.md

## Decisions made

- Start W8.2 with local access decision and protected-route foundations before live Supabase RLS execution.
- Keep cross-org and role-denied logic explicit and tested.
- Keep full W8.2 exit evidence open for later runtime/database work.

## Open risks

- No live Supabase RLS query/output evidence yet.
- No deployed denied-path screenshots yet.
- No full role matrix execution against live identities yet.

## ECAP disposition

Administrative and implementation trail is sufficient for PR review as a W8.2 foundation slice. Merge depends on CI/reviewer status.
