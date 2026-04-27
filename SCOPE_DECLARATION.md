# Scope Declaration — harden-agent-pre-handover-exactness-20260427

**Wave**: harden-agent-pre-handover-exactness-20260427
**Issue**: maturion-isms#1484
**Branch**: copilot/harden-agent-pre-handover-exactness
**Date**: 2026-04-27
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Harden agent pre-handover exactness discipline: add §4.3g Scope-Refresh and
Evidence-Exactness Gate to canonical governance, add AAP-28/AAP-29 anti-patterns,
update PREHANDOVER template with mandatory §4.3g fields, add Section 12 to ECAP
checklist, create `.github/scripts/refresh-scope-and-validate.sh` helper script,
and update CANON_INVENTORY.json hashes for all changed files.

## Changed Files

- `.github/scripts/refresh-scope-and-validate.sh` - New §4.3g helper script: scope-refresh + exactness validation + PREHANDOVER snippet
- `SCOPE_DECLARATION.md` - Updated for this wave
- `governance/CANON_INVENTORY.json` - Updated hashes for all changed canon files
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` - Added §4.3g gate (v1.8.0); added AAP-28/29 to auto-fail table; updated sequencing note
- `governance/checklists/execution-ceremony-admin-anti-patterns.md` - Added AAP-28 and AAP-29 (v1.7.0)
- `governance/checklists/execution-ceremony-admin-checklist.md` - Added Section 12 (v1.6.0)
- `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md` - Added §4.3g fields (v1.5.0)

## Out of Scope

- Any application code files
- Any other governance workspace artifacts not listed above
- Any agent contract files (.github/agents/*.md)
- Any files not listed above
