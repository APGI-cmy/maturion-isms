# Scope Declaration — restore-evidence-first-iaa-assurance-20260428

**Wave**: restore-evidence-first-iaa-assurance-20260428
**Issue**: maturion-isms#1491
**Branch**: copilot/restore-evidence-first-iaa-assurance
**Date**: 2026-04-28
**Last refreshed**: 2026-04-28 (post-final-edit scope refresh per §4.3g / AAP-28)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Restore evidence-first IAA assurance with build-correctness and independent risk challenge
(maturion-isms#1491). Hardens IAA canon/contract and Tier 2 assurance guidance so IAA
independently verifies: (1) governing issue intent; (2) actual PR diff; (3) build philosophy
and architectural requirements; (4) hard evidence that the build/workflow/runtime behaves
correctly; (5) independent risk beyond checklist compliance.

## Changed Files

- `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` - Added A-039 (agent claims non-evidence — acceptance-criteria matrix), A-040 (evidence-type downgrade prohibition), A-041 (diff-first classification), A-042 (independent risk challenge mandatory); version 3.0.0
- `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` - Added OVL-GE-004 (acceptance-criteria coverage check) to GOVERNANCE_EVIDENCE overlay; version 4.3.0
- `.agent-workspace/independent-assurance-agent/knowledge/iaa-core-invariants-checklist.md` - Added CORE-026 (Acceptance-Criteria Evidence Matrix) and CORE-027 (Independent Risk Challenge); version 4.1.0
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` - Updated knowledge table versions; added FAIL-ONLY-ONCE summary rows A-038 through A-042; updated operating model summary; version 3.8.0
- `SCOPE_DECLARATION.md` - Updated for this wave
- `governance/CANON_INVENTORY.json` - Updated hashes for INDEPENDENT_ASSURANCE_AGENT_CANON.md (v1.13.0), PREHANDOVER.template.md (v1.6.0), iaa-wave-record.template.md (v1.2.0)
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` - Added §Evidence-First Assurance Mandate (Rules 1–7: Acceptance-Criteria Evidence Matrix, Build Philosophy and Architecture Compliance Gate, Evidence-Type Downgrade Prohibition, Diff-First Audit Rule, Agent Claim Non-Evidence Rule, Independent Risk Challenge, Expanded Verdict Taxonomy); expanded Output Specification with new verdict types; added ACR-22 through ACR-26; version 1.13.0
- `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md` - Added mandatory §Acceptance-Criteria Matrix (Producer-Side) section; added certification item 15; version 3.4
- `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md` - Added mandatory §Acceptance-Criteria Matrix (Producer-Side) section; version 1.6.0
- `governance/templates/iaa-wave-record.template.md` - Added §3.2 Acceptance-Criteria Evidence Matrix, §3.3 Build-Correctness Assessment, §3.4 Independent Risk Challenge; renumbered §3.5/3.6; version 1.2.0

## Out of Scope

- Any agent contract files (.github/agents/*.md)
- Any application code or schema migrations
- Any files not listed above

