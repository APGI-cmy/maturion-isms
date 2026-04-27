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

- `.github/scripts/refresh-scope-and-validate.sh`
- `SCOPE_DECLARATION.md`
- `governance/CANON_INVENTORY.json`
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md`
- `governance/checklists/execution-ceremony-admin-anti-patterns.md`
- `governance/checklists/execution-ceremony-admin-checklist.md`
- `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md`

## Out of Scope

- Any application code files
- Any other governance workspace artifacts not listed above
- Any agent contract files (.github/agents/*.md)
- Any files not listed above
