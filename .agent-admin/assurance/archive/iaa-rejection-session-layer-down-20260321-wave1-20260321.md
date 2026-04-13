# IAA REJECTION-PACKAGE

**Session**: layer-down-20260321-wave1-20260321
**Date**: 2026-03-21
**PR Branch**: copilot/layer-down-propagate-governance-changes
**PR Title**: [Layer-Down] Propagate GOVERNANCE_WATCHDOG_CANON + GOVERNANCE_CANON_MANIFEST from canonical commit 4303aee2
**Invoking Agent**: governance-liaison-isms-agent
**Producing Agent**: governance-liaison-isms-agent (session layer-down-20260321-073700)
**IAA Session**: layer-down-20260321-wave1-20260321
**Adoption Phase**: PHASE_B_BLOCKING

---

## ═══════════════════════════════════════
## REJECTION-PACKAGE

**PR**: copilot/layer-down-propagate-governance-changes — [Layer-Down] Propagate GOVERNANCE_WATCHDOG_CANON + GOVERNANCE_CANON_MANIFEST from canonical commit 4303aee2

**4 check(s) FAILED. Merge blocked. STOP-AND-FIX required.**

### FAILURES:

#### FAILURE 1 — CORE-013 / CORE-018(a): PREHANDOVER proof absent
**Check**: IAA invocation evidence (CORE-013) + Complete evidence artifact sweep item (a) (CORE-018)
**Finding**: No PREHANDOVER proof for session `layer-down-20260321-073700` found anywhere on branch `copilot/layer-down-propagate-governance-changes`. Searched: `.agent-admin/prehandover/`, `.agent-admin/build-evidence/`, `.agent-workspace/governance-liaison-isms/memory/`, root `PREHANDOVER_PROOF.md` (belongs to Issue #193 Foreman 2026-02-16 — different session). The `governance-liaison-isms-agent.md` YAML explicitly lists `prehandover_proof` as a mandatory artifact required before IAA invocation (`iaa_oversight.mandatory_artifacts`).
**Fix required**: Commit a PREHANDOVER proof for session `layer-down-20260321-073700` to the branch. Suggested path: `.agent-admin/prehandover/PREHANDOVER_PROOF_session-layer-down-20260321-073700.md` or `.agent-admin/build-evidence/session-layer-down-20260321-073700/PREHANDOVER_PROOF.md`. The file must include:
- Session identifier: `layer-down-20260321-073700`
- PR branch reference: `copilot/layer-down-propagate-governance-changes`
- Files delivered (all 5 governance files)
- Alignment evidence summary
- `iaa_audit_token: IAA-session-layer-down-20260321-wave1-20260321-PASS` (expected reference for re-invocation)

#### FAILURE 2 — CORE-015 / CORE-018(b): Session memory absent
**Check**: Session memory present (CORE-015) + Complete evidence artifact sweep item (b) (CORE-018)
**Finding**: No session memory file for `layer-down-20260321-073700` found on branch. Most recent governance-liaison-isms session memory is `session-052-20260319.md` (wave DCKIS-GOV-001). The `governance-liaison-isms-agent.md` YAML explicitly lists `session_memory` as a mandatory artifact required before IAA invocation.
**Fix required**: Commit session memory file for this session to `.agent-workspace/governance-liaison-isms/memory/session-layer-down-20260321-073700.md` (or equivalent) before re-invoking IAA. File must include: session_id, date, wave, pr_branch, canonical_commit, files_layered_down, sha256_results, alignment_status, and all standard session memory fields.

#### FAILURE 3 — CORE-016 / CORE-018(c): `iaa_audit_token` unverifiable
**Check**: IAA verdict evidenced / `iaa_audit_token` field (CORE-016) + evidence sweep item (c) (CORE-018)
**Finding**: PREHANDOVER proof absent → `iaa_audit_token` field cannot be located or verified. Per CORE-016, PREHANDOVER proof must exist with a valid `iaa_audit_token` field (format: `IAA-session-NNN-waveY-YYYYMMDD-PASS`) as condition (1). This condition fails because the proof is absent.
**Fix required**: Resolved by addressing FAILURE 1 (CORE-013/CORE-018(a)). Commit the PREHANDOVER proof with `iaa_audit_token` field populated.

#### FAILURE 4 — OVL-CG-ADM-002: `GOVERNANCE_CANON_MANIFEST.md` version not incremented
**Check**: Version bump present (OVL-CG-ADM-002)
**Finding**: `GOVERNANCE_CANON_MANIFEST.md` was modified in this layer-down (new GOVERNANCE_WATCHDOG_CANON.md row added to index table; SHA256 changed from prior value to `ede3270a...`). However, the document version remained at `1.0.0` before and after the modification. OVL-CG-ADM-002 requires that modified canon documents have an incremented version number.
**Context**: The canonical source (`APGI-cmy/maturion-foreman-governance` commit `4303aee2`) made this content change without bumping the manifest version. The layer-down faithfully propagated the canonical source. The canonical source is responsible for this version gap. GOVERNANCE_CANON_MANIFEST.md has `layer_down_status: INTERNAL` — INTERNAL documents are described as "Not versioned for external consumption" in the manifest's own definitions, which may be the rationale for no version bump. CS2 must adjudicate.
**Fix required**: One of:
  (a) Canonical source bumps `GOVERNANCE_CANON_MANIFEST.md` version from `1.0.0` to `1.1.0` (or equivalent) in a new commit, followed by a fresh layer-down of the updated file; OR
  (b) CS2 issues an explicit written waiver confirming that INTERNAL-classified index documents in `maturion-foreman-governance` are exempt from mandatory version bump requirements under OVL-CG-ADM-002, and this waiver is quoted verbatim in the re-submitted PREHANDOVER proof.

---

## WHAT PASSED (Substantive Review)

The following substantive checks PASSED and do not require rework:
- **CORE-006**: SHA256 hashes verified ✅ — both canon files match CANON_INVENTORY and canonical source exactly
- **CORE-007**: No placeholder content ✅
- **CORE-014**: No class exemption claimed ✅
- **CORE-017**: No `.github/agents/` files modified ✅
- **OVL-CG-001**: Strategy alignment ✅ — canon correctly implements GOVERNANCE_WATCHDOG_DEPLOYMENT_STRATEGY.md v1.1.0
- **OVL-CG-002**: No contradictions with existing canon ✅
- **OVL-CG-003**: Enforcement gap ✅ — requirements are specific and verifiable; `governance-watchdog.yml` already deployed
- **OVL-CG-004**: Ripple impact assessed ✅ — no agent contracts required; watchdog workflow already present
- **OVL-CG-005**: ISMS layer-down scope ✅ — all 5 governance tracking files correctly updated
- **OVL-CG-ADM-001**: CANON_INVENTORY updated ✅ — total_canons 192, correct SHA256s

The GOVERNANCE_WATCHDOG_CANON.md content is substantively sound. The layer-down execution (SHA256 verification, CANON_INVENTORY update, alignment inventory, sync state) is technically correct. The failures are ceremony artifacts (PREHANDOVER proof, session memory) and a canonical source governance issue (version bump). The substantive work can be retained as-is once ceremony artifacts are added.

---

**This PR must not be opened until all 4 failures are resolved and IAA re-invoked.**

**Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.**

**Re-invocation path**:
1. Add PREHANDOVER proof with `iaa_audit_token` field
2. Add session memory file
3. Resolve or obtain CS2 waiver for OVL-CG-ADM-002 (manifest version bump)
4. Re-invoke IAA
5. Only after ASSURANCE-TOKEN: open PR

═══════════════════════════════════════

**Authority**: CS2 only (@APGI-cmy). Merge authority: CS2 ONLY.
**IAA Agent**: independent-assurance-agent v6.2.0
**Session Reference**: IAA-session-layer-down-20260321-wave1-20260321-REJECTION
