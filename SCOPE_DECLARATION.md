# SCOPE_DECLARATION.md — ARCHIVAL

> ⚠️ **This root scope declaration file is archival and must not be rewritten for normal PRs.**
>
> Active PR scope declarations must be written to:
>
> `.agent-admin/scope-declarations/pr-<PR_NUMBER>.md`
>
> Normal PRs must not modify this file. A CI gate (`preflight/scope-declaration-parity`)
> will fail any PR that modifies this file without an explicit migration exemption.
>
> **Modification exemptions / bypasses** (administered by CS2 only):
> - PR label: `scope-declaration-migration`
> - PR body contains: `CS2-SCOPE-MIGRATION-WAIVER`
> - PR label: `CS sign-off: approved`
> - Any other explicit CS2-administered bypass accepted by the `preflight/scope-declaration-parity` enforcement logic
>
> **Authority**: CS2 (@APGI-cmy) | Issue: maturion-isms#1521
> **Effective**: 2026-04-30 | Schema: SCOPE_DECLARATION_SCHEMA.md v2.0.0

## Previous Content (Historical Reference)

This file previously served as the per-wave scope declaration, rewritten by each PR.
That model caused merge conflicts when multiple PRs were active simultaneously.
It has been superseded by the per-PR model at `.agent-admin/scope-declarations/pr-<N>.md`.

Last valid wave entries before archival:
- layer-down-propagate-governance-changes-d99e68e8 (PR #1516/1517 area, 2026-04-29)
- mmm-dashboard-ui-fix-20260430 (PR #1520, 2026-04-30) — last PR to use the legacy root model
