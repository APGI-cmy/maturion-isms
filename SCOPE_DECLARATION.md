# Scope Declaration — layer-down-propagate-governance-changes-0205b9c8

**Wave**: layer-down-propagate-governance-changes-0205b9c8
**Issue**: maturion-isms#1509
**Branch**: copilot/layer-down-propagate-governance-changes-0205b9c8-6512-4272-baa9-f4c269c186a0
**Date**: 2026-04-29
**Authority**: SCOPE_TO_DIFF_RULE.md

## Scope Decision

Post-ripple correction of `GOVERNANCE_ALIGNMENT_INVENTORY.json` discrepancies
following canonical commit `2ba1d6a3cf9c97dd67fff483ca04a90549cba293` and ripple PR #1510.
Corrects stale `last_ripple_commit`, wrong version/hash for `INDEPENDENT_ASSURANCE_AGENT_CANON.md`,
mismatched canonical hash for `AGENT_HANDOVER_AUTOMATION.md`, TBD placeholders for
`PRE_BUILD_STAGE_MODEL_CANON.md`, and stale hash for `PREHANDOVER.template.md`.

## Changed Files

### Modified Files

- `governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json` - corrected post-ripple discrepancies (last_ripple_commit, last_ripple_timestamp, last_ripple_pr, INDEPENDENT_ASSURANCE_AGENT_CANON.md version/hash, AGENT_HANDOVER_AUTOMATION.md canonical hash, PRE_BUILD_STAGE_MODEL_CANON.md TBD placeholders resolved, PREHANDOVER.template.md hash corrected)
- `SCOPE_DECLARATION.md` - updated for this wave

## Out of Scope

- Application source code changes
- Supabase schema migrations or functions
- Agent contract files under .github/agents/
- Governance canon files (receive-only consumer mode)
