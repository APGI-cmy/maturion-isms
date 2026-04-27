# Scope Declaration — harden-deploy-mmm-supabase-migrations-20260427

**Wave**: harden-deploy-mmm-supabase-migrations-20260427
**Issue**: maturion-isms — "Foreman: harden Deploy MMM Supabase Migrations workflow end-to-end until it passes"
**Branch**: copilot/harden-deploy-mmm-supabase-migrations
**Date**: 2026-04-27
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)
**IAA Pre-Brief SHA**: a548b39

---

## Scope Decision

Replace the interactive `supabase link + supabase db push` mechanism in the MMM migration workflow
with the proven Management API approach (`apply-migrations-via-api.py`). This eliminates the SASL
auth/password-prompt failure and makes the MMM-native migration path fully non-interactive and
consistent with the cross-app migration pattern.

---

## Approved Artifact Paths

All agent-created files in this wave MUST match a path declared here.
Undeclared paths are blocked by CI governance-artifact-gate.

### Implementation Artifacts

| # | Path | Purpose | Agent |
|---|------|---------|-------|
| 1 | `.github/workflows/deploy-mmm-supabase-migrations.yml` | Remove setup-cli, supabase link, supabase db push; add Management API step | api-builder |

### Governance Artifacts

| # | Path | Purpose | Agent |
|---|------|---------|-------|
| G1 | `SCOPE_DECLARATION.md` | Wave scope declaration (root) | foreman-v2-agent |
| G2 | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Active wave task tracker | foreman-v2-agent |
| G3 | `.agent-workspace/foreman-v2/personal/scope-declaration-wave-harden-deploy-mmm-supabase-migrations-20260427.md` | This file | foreman-v2-agent |
| G4 | `.agent-admin/assurance/iaa-wave-record-harden-deploy-mmm-supabase-migrations-20260427.md` | IAA wave record (pre-brief + token) | independent-assurance-agent |
| G5 | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-075-harden-deploy-mmm-supabase-migrations-20260427.md` | PREHANDOVER proof | foreman-v2-agent |
| G6 | `.agent-workspace/foreman-v2/memory/session-075-20260427.md` | Session memory | foreman-v2-agent |
| G7 | `.agent-admin/prehandover/proof-session-075-harden-deploy-mmm-supabase-migrations-20260427.md` | PREHANDOVER proof (admin copy) | foreman-v2-agent |

---

## Out of Scope

- Any agent contract files (`.github/agents/*.md`)
- Any application code (`apps/`, `modules/`, `packages/`)
- Any schema migrations (`supabase/migrations/`)
- Any files not listed in Approved Artifact Paths above

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Living Agent System**: v6.2.0
