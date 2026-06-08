# PIT Stage 12 W8.2 RLS-First Access and Denied-Path Evidence

Issue: maturion-isms#1774
Branch: pit-stage12-w82-rls-denied-paths

## Scope

This PR starts W8.2 with a narrow access-control foundation slice:

- W8.2 admin route constants
- protected admin route shells
- local PIT access decision helper
- tests for unauthenticated, cross-org denied, role denied, and allowed decisions

## Routes covered

- `/admin/org`
- `/admin/users`
- `/admin/settings`
- `/admin/audit-log`
- `/qa-dashboard`

## RED target mapping

- RLS-001..013: started through local decision-helper coverage for tenant and role boundaries
- ROUTE-022..027: started through admin route constants and protected route shells

## Evidence captured in this PR

- In-repo role decision tests for unauthenticated, cross-org, role denied, and allowed cases
- Admin route shell wiring through existing protected route boundary
- No direct provider calls introduced
- No W8.3/W8.5/W8.6 scope expansion

## Evidence not yet claimed

- Supabase RLS policy execution output
- database query/output evidence
- deployed denied-path screenshots
- full role matrix execution against live identities
- full W8.2 exit

## Non-overclaim

This is the first W8.2 foundation slice. It does not claim full W8.2 completion, Stage 12 completion, or PIT FUNCTIONAL_PASS.
