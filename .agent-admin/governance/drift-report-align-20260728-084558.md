# Governance Drift Report

**Session ID**: align-20260728-084558  
**Timestamp**: 2026-07-28T08:45:58Z  
**Canonical Commit**: 52ce157bb5b2971256cbe5e4123c576dc65fabbb  
**Canonical Version**: 1.0.0

## Automated Result

- **Missing Files**: 0
- **Hash Mismatches Detected**: 1
- **Files Changed by Automation**: 3
- **Governed Files Accepted as Layered Down**: 1

The automated run copied the canonical inventory and the INTERNAL governance manifest, then updated sync evidence. Post-merge review rejected the manifest copy as outside issue #1982.

## Accepted Layer-Down Scope

- `governance/CANON_INVENTORY.json`

The accepted inventory contains 203 registered entries, 203 valid 64-hex content hashes, and 203 valid 40-hex canonical commit-provenance values.

## Explicit Internal Exclusion

- `governance/canon/GOVERNANCE_CANON_MANIFEST.md`
  - Canonical hash: `1502ca98c65323ed5ea297ad26583fa932647f77ad4f0d94e9867cd06ed51a6a`
  - Consumer hash: `fc3ddf69229736aa8f9357524d27bc7ed3d4c032926defeb0cc73a1d496d2b05`
  - Layer-down status: `INTERNAL`
  - Disposition: restore the pre-PR #1983 consumer bytes and record the intentional variance; do not treat it as PUBLIC_API drift.

## Evidence Correction

The receipt commit is normalized to an exact 40-hex value. The alignment inventory advances to the July ripple and records the INTERNAL exclusion. The ripple log no longer reports an unqualified success. The sync-state file lists only the inventory as the governed artifact actually accepted from the layer-down.

## Verification

- Inventory membership: 203/203
- Content-hash format: 203/203
- Canonical commit provenance: 203/203
- Semantic canon/policy changes accepted: 0
- Issue authority: #1982
- Source governance assurance: `IAA-20260728-PR1375-FINAL`

---
**Authority**: CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md  
**Correction**: bounded STOP-AND-FIX disposition for PR #1983
