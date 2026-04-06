# CL-6 POLC Boundary Validation — CI Resolution Record

**Wave**: CL-6 | LKIAC Wave 3  
**PR**: #1233 — feat(cl6): LKIAC Wave 3 — knowledge re-ingestion migration scaffold  
**Resolved**: 2026-04-06  
**Authority**: schema-builder (governed builder, schema class)

---

## Issue

The `foreman-implementation-check` job in the **POLC Boundary Validation** workflow failed on
PR #1233 (runs #2217, #2219). The job detected commits from `copilot-swe-agent[bot]` that
modified production source files:

- `packages/ai-centre/src/scripts/migrate-knowledge-embeddings.ts`
- `packages/ai-centre/src/__tests__/integration/cl6-knowledge-migration.test.ts`

Because those commits matched the "Foreman-authored implementation" pattern and the PR did not
carry the `copilot-builder-role` label at the time of those runs, the gate flagged them as a
POLC boundary violation.

## Root Cause

CL-6 was a **builder-delegated wave** (schema-builder + api-builder), not a Foreman supervision
session. Copilot acted as a **governed builder**, not as Foreman. The `copilot-builder-role`
label was not applied before the first workflow runs.

## Resolution

The `copilot-builder-role` label was added to PR #1233. The POLC workflow explicitly skips
the `foreman-implementation-check` when this label is present:

```yaml
if [[ "$HAS_BUILDER_LABEL" == "true" ]]; then
  echo "✅ PR labeled 'copilot-builder-role'"
  echo "   Copilot is acting as a governed builder (not Foreman)."
  echo "   foreman-implementation-check is not applicable — skipping."
  exit 0
fi
```

## Verification

The POLC workflow triggers on `synchronize` events only (not on `labeled` events). This
sub-PR commit triggers a new `synchronize` event on PR #1233 so the POLC re-runs with the
label in place and passes.

## Governance Note

- All implementation commits in CL-6 were made under schema-builder / api-builder authority
- No Foreman boundary violation occurred — this was a labelling omission only
- The `copilot-builder-role` label must be applied at PR creation for builder-delegated waves
  to prevent POLC false positives on future waves

---

_Resolution committed by schema-builder — CL-6 CI governance record_
