# IAA Category Overlays

**Agent**: independent-assurance-agent
**Version**: 2.2.0
**Status**: ACTIVE
**Last Updated**: 2026-03-02
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This file defines per-category additional checks that supplement the core invariants checklist.
IAA loads the overlay for the classified PR category in Phase 2 Step 2.4.

Core invariants (CORE-001 to CORE-020) apply to ALL categories.
Overlay checks are ADDITIONAL checks specific to each category.

---

## AGENT_CONTRACT Overlay

Applied when PR category is `AGENT_CONTRACT`.

| Check ID | Check Name | Description |
|----------|-----------|-------------|
| OVL-AC-001 | AGCFPP-001 policy reference | governance.policy_refs includes AGCFPP-001 with canonical path `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md` and name `Agent Contract File Protection Policy` |
| OVL-AC-002 | IAA oversight block | iaa_oversight block present (for foreman/builder class agents) OR policy_refs confirms IAA authority |
| OVL-AC-003 | Four-phase canonical structure | All four phases complete with mandatory evidence output declarations |
| OVL-AC-004 | Self-modification prohibition | CONSTITUTIONAL enforcement on SELF-MOD prohibition |
| OVL-AC-005 | No Tier 2 content embedded | No Tier 2 content inlined in the contract body |
| OVL-AC-006 | PREHANDOVER proof in bundle | PR bundle contains PREHANDOVER proof artifact |
| OVL-AC-007 | Session memory in bundle | PR bundle contains session memory artifact |
| OVL-AC-008 | Tier 2 stub present | `.agent-workspace/<agent>/knowledge/index.md` exists |
| OVL-AC-009 | Character count within limit | Contract body is under 30,000 characters |
| OVL-AC-010 | No hardcoded version strings | Phase body reads identity from YAML, not hardcoded strings |
| OVL-AC-011 | Agent file drift check | PREHANDOVER must include before/after character count for every modified agent contract file. If SHA256 hash comparison is available (e.g., from git diff or CANON_INVENTORY), before/after hashes must also be stated. |
| OVL-AC-012 | Ripple/cross-agent assessment | If the agent contract change triggers governance ripple requirements for other agents (e.g., shared Tier 2 references, cascading policy updates), PREHANDOVER proof must list all affected agents and whether ripple has been initiated or flagged. "No ripple required" is acceptable only when explicitly stated with justification. |

---

## CANON_GOVERNANCE Overlay

Applied when PR category is `CANON_GOVERNANCE`.

| Check ID | Check Name | Description |
|----------|-----------|-------------|
| OVL-CG-001 | CANON_INVENTORY updated | Changes reflected in CANON_INVENTORY.json with new hashes |
| OVL-CG-002 | No placeholder hashes | No `null`, `""`, `000000`, or truncated hash values |
| OVL-CG-003 | Version bump present | Updated document has bumped version number |
| OVL-CG-004 | Ripple impact assessed | Any impacted agents are flagged for governance ripple update |
| OVL-CG-005 | Drift/integrity hash check | PREHANDOVER must include for each modified canon file: either (a) SHA256 hash before and after the change, or (b) a git diff excerpt or summary confirming the exact scope of change. Missing or absent drift evidence = REJECTION-PACKAGE. |
| OVL-CG-006 | CANON_INVENTORY hash update confirmed | Every canon file modified in this PR must have its `file_hash_sha256` field updated in `governance/CANON_INVENTORY.json` to reflect the new file state. Stale or unchanged hashes for modified files = REJECTION-PACKAGE. |

---

## CI_WORKFLOW Overlay

Applied when PR category is `CI_WORKFLOW`.

| Check ID | Check Name | Description |
|----------|-----------|-------------|
| OVL-CI-001 | Merge gate checks preserved | All required merge_gate_interface checks remain present |
| OVL-CI-002 | No gate weakening | No check removed, softened, or made non-blocking |
| OVL-CI-003 | Parity enforcement maintained | parity_required and parity_enforcement remain BLOCKING |
| OVL-CI-004 | Workflow policy correctness | For any new workflow created or significantly modified: verify the workflow correctly implements its stated policy requirement — not just gate preservation. The workflow logic must match its declared intent (e.g., a "preflight gate" workflow must actually enforce preflight; a "ripple sync" workflow must actually sync ripples). A workflow that preserves the gate structure but inverts or misimplements its policy intent is a failure. |
| OVL-CI-005 | CI check run result attached | When any `.github/workflows/` or `.github/scripts/` file is modified, PREHANDOVER must include the URL of the resulting CI check run result or a log snippet confirming the workflow executed successfully (no errors/failures). A claim that CI passed without any supporting URL or log reference = REJECTION-PACKAGE. |
| OVL-CI-006 | Environment parity statement | PREHANDOVER must explicitly address whether the workflow/script change affects dev, staging, and production environments differently and how parity is maintained. An explicit "no environment impact" statement is acceptable when justified. Absent or blank environment parity statement = REJECTION-PACKAGE. |

---

## AAWP_MAT Overlay

Applied when PR category is `AAWP_MAT`.

| Check ID | Check Name | Description |
|----------|-----------|-------------|
| OVL-AM-001 | Stub population complete | No stub/TODO content in AAWP/MAT deliverables |
| OVL-AM-002 | Evidence artifacts present | Required evidence bundle artifacts present |
| OVL-AM-003 | Governance alignment | Deliverables align with current canon version |
| OVL-AM-004 | Architecture ripple/impact plan | If any schema, data model, AI model, migration, or critical infrastructure file changes: PREHANDOVER must include (a) a before/after diff summary of the change and (b) an explicit ripple/impact assessment listing downstream components that may be affected. "No downstream impact" is acceptable when explicitly stated with justification. Absent = REJECTION-PACKAGE. |
| OVL-AM-005 | Wave gap register trace | PREHANDOVER proof or session memory must include a link to the gap register entry for this wave's work, or explicitly state "no gap register entry applicable" with a brief justification. A blank or absent gap register reference = REJECTION-PACKAGE. |
| OVL-AM-006 | Environment parity validation | PREHANDOVER must explicitly state whether the change affects dev, staging, and production environments differently. Must identify any environment with different post-deployment behavior. An explicit "no environment impact" statement is acceptable when justified. Absent = REJECTION-PACKAGE. |
| OVL-AM-007 | Session memory learning note coverage | Session memory must contain at least one concrete, non-blank learning note in the `learning_notes` or `suggestions` field. If a repeat failure pattern is identified (same failure as any prior session), the session memory must explicitly reference the prior session ID(s) and flag for root-cause analysis. A blank or placeholder learning note = REJECTION-PACKAGE. |

---

## AGENT_INTEGRITY Overlay

Applied when PR category is `AGENT_INTEGRITY`.

| Check ID | Check Name | Description |
|----------|-----------|-------------|
| OVL-AI-001 | CS2-only modification | Only CS2 (Johan Ras / @APGI-cmy) may modify `governance/quality/agent-integrity/` files |
| OVL-AI-002 | Hash update is complete | All updated agent contract hashes reflect the current file state |
| OVL-AI-003 | No hash deletions | No previously present agent integrity entries deleted without CS2 sign-off |

---

## KNOWLEDGE_GOVERNANCE Overlay

Applied when PR category is `KNOWLEDGE_GOVERNANCE`.

| Check ID | Check Name | Description |
|----------|-----------|-------------|
| OVL-KG-001 | PREHANDOVER ceremony complete | PR includes PREHANDOVER proof and session memory; `iaa_audit_token` is non-empty and non-placeholder. Tier 2 knowledge patches are NOT exempt from the PREHANDOVER ceremony (FAIL-ONLY-ONCE A-015). |
| OVL-KG-002 | Knowledge version bumped | Every modified Tier 2 knowledge file has its version number incremented (patch or minor). A version-unchanged modification = REJECTION-PACKAGE. |
| OVL-KG-003 | Version history table updated | Every modified Tier 2 knowledge file's version history table includes an entry for the new version with date and change description. Missing or stale version history = REJECTION-PACKAGE. |
| OVL-KG-004 | Index.md updated | The agent's `knowledge/index.md` reflects updated file versions and new rules or categories introduced. Stale index = REJECTION-PACKAGE. |
| OVL-KG-005 | Cross-reference consistency | Any rule IDs, check IDs, or category names changed or added are updated consistently across all files that reference them (trigger table, overlays, checklist, index, learning notes). Any dangling or stale cross-reference = REJECTION-PACKAGE. |

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-02-25 | Initial STUB (placeholder from canon) |
| 2.0.0 | 2026-02-28 | Fully populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md; OVL-CI-004 added (workflow policy correctness check from IAA session-017 suggestion); AGENT_INTEGRITY overlay added; STUB status removed |
| 2.1.0 | 2026-03-02 | AGENT_CONTRACT: OVL-AC-011 (drift check), OVL-AC-012 (ripple assessment) added; CANON_GOVERNANCE: OVL-CG-005 (drift/integrity hash), OVL-CG-006 (CANON_INVENTORY update confirmed) added; CI_WORKFLOW: OVL-CI-005 (CI check run result), OVL-CI-006 (environment parity) added; AAWP_MAT: OVL-AM-004 (architecture ripple/impact plan), OVL-AM-005 (wave gap trace), OVL-AM-006 (environment parity), OVL-AM-007 (session memory learning notes) added (maturion-isms#IAA-TIER2 Wave 13+) |
| 2.2.0 | 2026-03-02 | KNOWLEDGE_GOVERNANCE overlay added (OVL-KG-001 through OVL-KG-005) — formalises Tier 2 knowledge patch audit requirements (maturion-isms#IAA-TIER2) |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
