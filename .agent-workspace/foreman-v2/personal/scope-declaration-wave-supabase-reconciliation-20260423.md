# Scope Declaration — Wave supabase-reconciliation-20260423

**Foreman**: foreman-v2-agent v6.2.0
**Wave**: supabase-reconciliation-20260423
**Issue**: maturion-isms#1461
**Branch**: copilot/reconcile-supabase-project-state
**Date**: 2026-04-23
**IAA Pre-Brief SHA**: b90efe0

---

## Wave Purpose

Post-Stage-12 operational documentation wave. Reconcile live Supabase project state with repo-backed MMM storage and deployment model. Establish repo as authoritative control surface.

---

## Approved Artifact Paths

All agent-created files in this wave MUST match one of the following declared paths:

```yaml
approved_artifact_paths:
  # Primary deliverables (mat-specialist)
  - docs/supabase/MMM_SUPABASE_AUDIT.md
  - docs/supabase/MMM_SUPABASE_BOUNDARY.md
  - docs/supabase/MMM_SUPABASE_OPERATING_PROCEDURE.md
  - supabase/config.toml                              # audit-only; supplement if deficient only
  - modules/MMM/BUILD_PROGRESS_TRACKER.md             # additive update only

  # Governance artifacts (foreman-v2-agent)
  - .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  - .agent-workspace/foreman-v2/personal/scope-declaration-wave-supabase-reconciliation-20260423.md
  - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-supabase-reconciliation-20260423.md
  - .agent-workspace/foreman-v2/memory/session-supabase-reconciliation-20260423.md
  - .agent-admin/assurance/iaa-wave-record-supabase-reconciliation-20260423.md  # IAA only

  # ECAP bundle artifacts (not required — ceremony_admin_appointed: NOT REQUIRED)
```

---

## Out-of-Scope (Explicitly Excluded)

The following are explicitly OUT OF SCOPE for this wave:

- `supabase/migrations/*.sql` — NO new migrations. Any drift requiring migrations must be captured as a separate issue.
- `modules/MMM/04-architecture/**` — No architecture changes.
- `modules/MMM/05-qa-to-red/**` — No QA changes.
- Any `.github/agents/*.md` files — Prohibited (AGCFPP-001).
- Any `governance/canon/**` files — Not in scope.
- Any pre-build stage (1–11) status changes in BUILD_PROGRESS_TRACKER.md — Prohibited.
- PIT module — Not in scope per issue non-scope.

---

## Constraints

1. **No new migrations**: This PR must NOT add any `supabase/migrations/*.sql` files. Drift identified in the audit must be documented and carried forward to a separate wave.

2. **config.toml audit-only**: `supabase/config.toml` already exists with verified settings (project_id: `ujucvyyspfxlxlfdamda`, JWT flags per function). Agent may ONLY supplement missing function entries; must NOT modify verified settings.

3. **BUILD_PROGRESS_TRACKER.md additive-only**: Anti-drift section must be additive. No pre-build stage (1–11) COMPLETE/CLOSED status changes.

4. **No credentials**: No Supabase project secrets, service role keys, anon keys, or dashboard credentials may appear in any document.

5. **No "TBD" in operational paths**: Per FFA-06 (BD-003), documentation must be deployment-ready at merge — no placeholder text in critical operating procedure paths.

---

## Undeclared Paths Are Blocked

Per CI governance-artifact-gate: any agent-created file NOT listed in `approved_artifact_paths` above is considered out of scope and will be blocked.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Scope Declaration Version**: 1.0.0
