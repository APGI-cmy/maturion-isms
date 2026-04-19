# Execution Ceremony Admin Anti-Patterns

## Status
**Type**: Tier 2 Governance Reference  
**Authority**: CS2 — EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md v1.1.0  
**Version**: 1.2.0  
**Effective Date**: 2026-04-17  
**Owner**: execution-ceremony-admin-agent / Foreman QP / IAA  
**Purpose**: Canonized list of admin-ceremony defects that are auto-fail at the §4.3e Admin Ceremony Compliance Gate and/or trigger an IAA REJECTION-PACKAGE. Every entry is a known recurring failure mode derived from operational evidence.

---

## How to Use This Document

Each entry in this list is:

1. **Auto-fail** for the `§4.3e Admin Ceremony Compliance Gate` (Layer 1/2) when the ECAP bundle is reviewed before IAA invocation.
2. **IAA REJECTION-PACKAGE trigger** (Layer 3) when the defect is present at assurance time.

The `execution-ceremony-admin-agent` MUST scan for every anti-pattern before returning the bundle. The Foreman MUST scan for every anti-pattern at the QP checkpoint. The IAA MUST reject if any anti-pattern is present.

---

## Anti-Pattern Table

| ID | Anti-Pattern Name | Description | Detection | Auto-Fail Trigger | IAA ACR |
|----|------------------|-------------|-----------|-------------------|---------|
| **AAP-01** | **Issued token but pending/in-progress wording remains** | A valid IAA `ASSURANCE-TOKEN` was issued (or recorded as expected), but the PREHANDOVER proof or session memory still contains words like `PENDING`, `in progress`, `in-progress`, or equivalent provisional wording in fields that should declare COMPLETE/PASS/ISSUED. The bundle tells two conflicting stories simultaneously. | `grep -niE "\bPENDING\b|\bin[ _-]?progress\b" .agent-admin/prehandover/proof-*.md` | §4.3e Check C1 | ACR-02 |
| **AAP-02** | **Mixed internal version labels in same document** | A single document declares multiple different version strings as the "current" version of the same artifact — e.g., the header says v1.3.0 but a section says "updated in v1.2.0" in a way that implies v1.2.0 is the current version, or two sections give contradictory version numbers for the same canon file. | Manual review of headers, footers, and cross-references in the document | §4.3e Check D (manual) | ACR-02 |
| **AAP-03** | **Stale artifact path references** | A path declared in the PREHANDOVER proof, session memory, or any ceremony artifact does not exist as a committed file on the branch. This includes paths that were renamed, moved, or deleted after being recorded, or paths that were never committed. | `git ls-files --error-unmatch <declared-path>` | §4.3e Check E1 | ACR-08 |
| **AAP-04** | **Stale scope declaration after file changes** | The `FILES_CHANGED` count or listed files in `governance/scope-declaration.md` do not match the actual diff (`git diff --name-only origin/main...HEAD`). Typically caused by adding or deleting files after the scope declaration was written without regenerating it. | `git diff --name-only origin/main...HEAD \| wc -l` vs `FILES_CHANGED` field | §4.3e Check B1 | ACR-04 |
| **AAP-05** | **Stale hash after file finalization** | A SHA256 hash declared in the PREHANDOVER proof, CANON_INVENTORY, or any evidence artifact for a specific file does not match the actual SHA256 of that file in the committed branch state. Typically caused by editing a file after recording its hash without recomputing. | `sha256sum <file>` vs declared hash | §4.3e Check F1 | ACR-05 |
| **AAP-06** | **Requested vs completed assurance session mismatch** | The PREHANDOVER proof references an IAA session ID (in `iaa_audit_token` or `iaa_session_reference`) that does not match the session ID in the actual token file on the branch. Caused by copy-paste errors or generating a new IAA token without updating the PREHANDOVER proof reference. | Compare `iaa_audit_token` in PREHANDOVER with session ID in token file | §4.3e Check E1 | ACR-07 |
| **AAP-07** | **Declared file/artifact count mismatch** | A count of files, artifacts, or changed items declared in any ceremony document (e.g., "3 canon files amended", "5 artifacts committed", `FILES_CHANGED: 12`) does not match the actual count of those items in the committed branch state. | Count actual items and compare with declared count | §4.3e Check B1 | ACR-07 |
| **AAP-08** | **PUBLIC_API ripple obligations omitted or silently skipped** | One or more files with `layer_down_status: PUBLIC_API` in CANON_INVENTORY were changed in this PR but have no ripple assessment entry in the ECAP reconciliation summary. No mention of the layer-down obligation — not even a "DEFERRED" status. The obligation simply does not appear anywhere. | `jq '.canons[] \| select(.layer_down_status == "PUBLIC_API") \| .filename' governance/CANON_INVENTORY.json` compared against changed files | §4.3e Check G1 | ACR-06 |
| **AAP-09** | **Committed truth not matching proof/session memory claims** | The branch's actual committed file state contradicts a declared artifact path, hash, or status in a ceremony document. Examples: PREHANDOVER proof says `proof-001.md` exists but `proof-002.md` is what was actually committed; session memory says hash is `abc123` but actual hash is `def456`; PREHANDOVER says `final_state: COMPLETE` but the latest commit message says "WIP". | Cross-check declared artifacts and hashes against `git ls-files` and `sha256sum` | §4.3e Checks A1–A3, F1 | ACR-08, ACR-05 |
| **AAP-15** | **Gate inventory absent from PREHANDOVER proof** | The PREHANDOVER proof or session memory does not name which specific merge/workflow gates were verified. The `gate_set_checked:` field is absent or empty. This means gate-parity is asserted without evidence of which gates were actually checked. | `grep -i "gate_set_checked" .agent-workspace/foreman-v2/memory/PREHANDOVER-*.md` | §4.3e Gate-evidence check | ACR-09 |
| **AAP-16** | **Stale gate-pass wording in final-state proof** | A final-state proof artifact (PREHANDOVER, session memory, scope declaration) contains unchecked or provisional gate-pass language such as "verify gates pass", "gates TBD", "gates pending", or similar wording that was never resolved to a definitive state. This indicates a checklist item was carried forward without being executed. | `grep -niE "verify gates pass|gates TBD|gates pending" .agent-workspace/foreman-v2/memory/` | §4.3e Gate-evidence check | ACR-10 |
| **AAP-17** | **Pre-final instruction wording in final-state artifact** | A committed final-state artifact (PREHANDOVER proof, session memory, wave record, stage-readiness table, or any final handback artifact) contains pre-final assembly-time instruction text that is only lawful before final assurance is issued. Examples: "to be completed by Foreman after receiving ASSURANCE-TOKEN", "FOREMAN ACTION REQUIRED", "paste verbatim raw IAA output here", "IAA assurance pending (Phase 4)", "pending Phase 4", "awaiting token", "before committing this proof". These are unconditionally blocked once the branch claims final assurance. | `grep -niE "to be completed by Foreman\|FOREMAN ACTION REQUIRED\|paste verbatim raw IAA\|IAA assurance pending\|pending Phase 4\|awaiting token\|before committing this proof" <final-state-artifact-paths>` | §4.3e Check C2 | ACR-09 |
| **AAP-18** | **Cross-artifact final-state inconsistency** | The branch's collection of final-state artifacts tells two incompatible stories simultaneously. If any artifact in the final-state bundle claims final assurance (ASSURANCE-TOKEN issued, merge permitted, Stage 9 unblocked, final_state: COMPLETE, equivalent), then every other artifact in the final-state bundle must also be in post-token form. Blocking examples: wave record says PASS but PREHANDOVER says pending; stage-readiness table says IAA pending while token is already issued; session memory says final_state COMPLETE while another linked final artifact still contains assembly-time instructions. | Manual cross-artifact review; check that all key final-state fields across PREHANDOVER, wave record, session memory, and stage-readiness tables are mutually consistent. | §4.3e Check H | ACR-10 |
| **AAP-19** | **Canonical source parity violation for "carried-forward" claims** | An artifact claims to carry forward, copy verbatim, or inherit a model/table/ownership assignment from a canonical source (e.g., "from harvest map", "verbatim from canon", "carried forward"), but the actual artifact content differs from the cited canonical source in ownership labels, gate authority, or approval requirements. A copied table that changes ownership or weakens a canonical approval requirement while presenting itself as inherited is a governance contradiction. | Compare every "carried forward" / "verbatim" claim against its cited canonical source file; flag any difference in ownership, authority, gate conditions, or approval requirements. | §4.3e Check D (supplement to existing manual check) | ACR-11 |

---

## Supplementary Anti-Patterns (Foreman QP Awareness)

The following are not machine-detectable by §4.3e but must be caught by the Foreman QP checkpoint:

| ID | Anti-Pattern Name | Description | Detection Method |
|----|------------------|-------------|------------------|
| **AAP-10** | **Bundle returned without final-state normalization declaration** | The ECAP bundle is returned to the Foreman without the final acceptance block in the checklist completed (Section 9 of `execution-ceremony-admin-checklist.md`), or the block is present but not all sections are marked COMPLETE or N/A. | Review checklist Section 9 |
| **AAP-11** | **Reconciliation matrix not worked through** | The `execution-ceremony-admin-reconciliation-matrix.md` declaration was not completed — either missing entirely or all rows are empty. | Review reconciliation declaration block |
| **AAP-12** | **Exception declared without reason** | An item in the checklist or reconciliation matrix is marked `[N/A]` or `[Exception]` without a stated reason. Exceptions without justification cannot be assessed by the Foreman QP checkpoint. | Review exception fields |
| **AAP-13** | **Foreman QP checkpoint bypassed** | IAA was invoked without the Foreman explicitly completing and recording the QP admin-compliance checkpoint (`FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md §14.6`), leaving no `administrative_readiness: ACCEPTED` declaration. | Verify checkpoint artifact exists and is committed |
| **AAP-14** | **ECAP bundle forwarded with unresolved Foreman-identified defects** | The Foreman identified specific defects at the QP checkpoint (`administrative_readiness: REJECTED`) but invoked IAA anyway without returning the bundle to ECAP for remediation. | Review checkpoint verdict and IAA invocation timestamp |

---

## Severity Classification

| Severity | Definition | Examples |
|----------|-----------|---------|
| **S1 — Auto-Fail** | Immediately fails §4.3e gate and triggers IAA rejection. No discretion. | AAP-01 through AAP-09, AAP-15, AAP-16, AAP-17, AAP-18, AAP-19 |
| **S2 — Foreman QP Blocker** | Must be resolved at Foreman QP checkpoint before IAA invocation. Discretion allowed only if explicitly documented. | AAP-10 through AAP-14 |

---

## Remediation Patterns

| Anti-Pattern | ECAP Remediation Action |
|-------------|------------------------|
| AAP-01 | Find all `PENDING`/`in progress` wording in ceremony artifacts; replace with definitive status. Recommit. |
| AAP-02 | Audit every version reference in the document. Align all internal version labels to the single correct current version. |
| AAP-03 | Find the actual committed path of the artifact; update all references to use the correct path. If artifact was not committed, commit it. |
| AAP-04 | Run `git diff --name-only origin/main...HEAD > /tmp/actual-files.txt`; regenerate `governance/scope-declaration.md`; commit the regenerated file as the last change. |
| AAP-05 | Run `sha256sum <file>`; update the hash in every artifact that declared the old hash. Commit. |
| AAP-06 | Open the actual token file; copy the exact session ID; update PREHANDOVER `iaa_audit_token` and `iaa_session_reference` to match. Create a new PREHANDOVER proof (do not edit a committed one). |
| AAP-07 | Recount the actual items; update all declared counts to match. Regenerate scope declaration if FILES_CHANGED was wrong. |
| AAP-08 | Identify all PUBLIC_API-scoped changed files; add a ripple assessment block to the ECAP reconciliation summary with COMPLETED / DEFERRED / NOT-APPLICABLE status for each. |
| AAP-09 | For each mismatch: correct the ceremony artifact to reflect actual committed state. Recommit. Do not edit committed PREHANDOVER proofs — create a new proof. |
| AAP-15 | Return to Foreman's Step 3.6. Run all gates in `merge_gate_interface.required_checks` and record actual state (GREEN/FAIL/PENDING/MISSING) per gate. Populate `gate_set_checked: [list]` in PREHANDOVER proof. Recommit. |
| AAP-16 | Search all bundle artifacts for "verify gates pass", "gates TBD", or equivalent unresolved wording. For each hit: either execute the gate and record the GREEN result, or remove the provisional line if the gate was already verified. Recommit with definitive gate states. |
| AAP-17 | Identify every committed final-state artifact that contains pre-final instruction text. Replace each instance with the corresponding post-token wording per `POST_TOKEN_VOCABULARY_LAW.md`. Deletion alone is not sufficient — placeholder instruction text must be replaced with final truth. Recommit. |
| AAP-18 | Perform cross-artifact review of all final-state artifacts. For each inconsistency found (one artifact claiming COMPLETE/PASS/token-issued while another still contains pre-token wording): normalize the lagging artifact to post-token form. Ensure all final-state artifacts tell one coherent post-token story before re-submitting to IAA. |
| AAP-19 | For each "carried forward"/"verbatim" claim: locate the cited canonical source file and compare the claimed content against it. For any ownership/authority/gate-condition difference found: either (a) correct the artifact to match the canonical source, or (b) document the intentional deviation with explicit CS2 authorization. Recommit. |

---

## References

- `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` v1.1.0 — §3.5–§3.9
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.5.0 — §4.3e + Auto-Fail Rules
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.7.0 — §Admin-Ceremony Rejection Triggers
- `governance/canon/POST_TOKEN_VOCABULARY_LAW.md` v1.0.0 — Post-Token Vocabulary Denylist + Replacement Requirements
- `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` v1.4.0 — §14.6
- `governance/checklists/execution-ceremony-admin-checklist.md` — verification checklist
- `governance/checklists/execution-ceremony-admin-reconciliation-matrix.md` — dependency matrix

---

*Version: 1.2.0 | Effective: 2026-04-17 | Amended: 2026-05-01 (v1.2.0) — Added AAP-17/18/19: pre-final instruction wording, cross-artifact inconsistency, canonical source parity violation | Authority: CS2 (Johan Ras)*
