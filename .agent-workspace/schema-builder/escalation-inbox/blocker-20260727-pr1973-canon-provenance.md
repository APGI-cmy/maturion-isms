# Schema-Builder Blocker — PR #1973 Canon Provenance

**Type:** GOVERNANCE_GAP / BLOCKER
**Agent:** `schema-builder`
**Date:** 2026-07-27
**Issue:** #1959
**PR:** #1973
**PR head tested:** `d4f7753cca858aa9908b2f04e1767c41be10be7d`
**Target:** Foreman

## Description

The canonical schema-builder wake-up protocol returned a non-zero result before
Supabase CLI migration generation or implementation could begin.

Phase 3 reported:

- `governance/CANON_INVENTORY.json` present;
- canon version `1.0.0`;
- 203 artifacts;
- placeholder-hash enforcement enabled;
- 0 invalid or placeholder hashes;
- 203 entries missing canonical commit-SHA provenance;
- governance discovery status: `FAIL`;
- overall wake-up status: `FAILED`.

The schema-builder contract declares missing canonical commit-SHA provenance a
degraded-mode halt condition. The builder therefore did not run the Supabase CLI
migration-generation preflight, create a migration, change tests, or mutate any
Supabase project.

## Additional preflight disclosure

This resumed Work Mode turn inspected repository status and live PR/issue
metadata before the repository-local schema-builder contract and bootstrap
protocol were fully loaded. The `agent_bootstrap` MCP capability was not exposed
in the active tool registry. The full contract was then read and the local
canonical wake-up protocol was executed. This sequencing defect is disclosed
here and in the session memory as required by the contract.

## Scope impact

- Frozen Issue #1959 contract: unchanged.
- Seven-policy inventory: unchanged.
- Builder appointment: unchanged.
- Migration/test implementation: not started.
- Live Supabase mutation: not performed.
- Legacy public-helper grants: unchanged.

## Required Foreman disposition

Determine whether the 203 missing provenance values represent:

1. a canonical inventory defect requiring a bounded governance repair; or
2. a validator/baseline inconsistency requiring correction under separate
   CS2-authorized governance authority.

The schema-builder must remain blocked until the canonical wake-up protocol
passes or Foreman provides a lawful, recorded disposition through the governing
authority chain. The builder cannot waive this condition.

## Recommended next action

Open or bind a narrowly scoped Foreman/CodexAdvisor investigation to restore
canonical commit-SHA provenance or correct the canonical validator contract,
obtain required assurance, then rerun PR #1973's schema-builder wake-up from the
same frozen contract before Supabase CLI migration generation.
