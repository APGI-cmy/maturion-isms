# Scope Declaration — require-admin-ceremony-for-protected-paths-20260428

**Wave**: require-admin-ceremony-for-protected-paths-20260428
**Issue**: maturion-isms#1493
**Branch**: copilot/require-admin-ceremony-for-protected-paths
**Date**: 2026-04-28
**Last refreshed**: 2026-04-28 (post-final-edit scope refresh per §4.3g / AAP-28)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Require mandatory ECAP/admin ceremony for protected-path PRs before IAA may issue a PASS token
(maturion-isms#1493). Adds §Mandatory ECAP Presence Gate to IAA canon, §Protected-Path
Classifier, CS2 waiver model, ACR-27 (ECAP-MISSING-FOR-PROTECTED-PATH), AAP-30, and
ECAP template / checklist updates so protected-path PRs are consistently gated.

## Changed Files

- `SCOPE_DECLARATION.md` - This scope declaration (updated to reflect all changed files per scope-to-diff rule)
- `governance/CANON_INVENTORY.json` - Updated hashes for INDEPENDENT_ASSURANCE_AGENT_CANON.md (v1.14.0), execution-ceremony-admin-anti-patterns.md (v1.8.0), execution-ceremony-admin-checklist.md (v1.7.0), PREHANDOVER.template.md (v1.7.0), iaa-wave-record.template.md (v1.3.0)
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` - Added §Mandatory ECAP Presence Gate (4-question check P-1 through P-4), §Protected-Path Classifier, §CS2 Waiver Model for Protected-Path PRs, §ECAP Requirements for Protected-Path PRs; added ACR-27 (ECAP-MISSING-FOR-PROTECTED-PATH); updated §Admin-Ceremony Rejection Triggers header to v1.14.0; version 1.14.0
- `governance/checklists/execution-ceremony-admin-anti-patterns.md` - Added AAP-30 (ECAP-MISSING-FOR-PROTECTED-PATH, S1 auto-fail, ACR-27); updated S1 severity list; added AAP-30 remediation pattern; updated References; version 1.8.0
- `governance/checklists/execution-ceremony-admin-checklist.md` - Added Section 13 (Protected-Path ECAP Presence Gate, 7 checks covering diff-first classification, ecap_required/ecap_invoked/ecap_waiver_ref, and BLOCKED condition); updated References; version 1.7.0
- `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md` - Added certification item 16 (protected-path ECAP presence confirmation, AAP-30 / ACR-27); updated version to 3.5
- `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md` - Added ecap_required, ecap_invoked, ecap_waiver_ref fields to Gate Results YAML; added ## Protected-Path Classification section; version 1.7.0
- `governance/templates/iaa-wave-record.template.md` - Added §3.1a Mandatory ECAP Presence Gate (P-1 through P-4 check before any ACR/checklist evaluation; REJECTED-ACR-27 if protected path with no ECAP and no CS2 waiver); updated Record Schema Version to 1.3.0

## Out of Scope

- Any Supabase schema or migration changes
- Any Edge Function changes
- Any deployment workflow changes
- Any application code changes
- Any agent Tier 2 knowledge file changes
- Any files not listed above
