# IAA REJECTION-PACKAGE — Session 056 | Wave foreman-ecap-step41a | 2026-04-10

**Document type**: IAA REJECTION-PACKAGE (PHASE_B_BLOCKING)
**Session ID**: session-056-foreman-ecap-20260410
**Date**: 2026-04-10
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.5.0)
**Adoption Phase**: PHASE_B_BLOCKING
**Branch**: copilot/fix-execution-ceremony-admin-agent
**PR Subject**: Mandate execution-ceremony-admin-agent in Foreman Phase 4 (Step 4.1a) per ECAP-001 §5.2
**Invoked by**: CodexAdvisor-agent (session-056)
**Work produced by**: CodexAdvisor-agent (session-056), class: overseer
**Authority**: CS2 (@APGI-cmy)

---

## ═══════════════════════════════════════
## REJECTION-PACKAGE
**PR**: copilot/fix-execution-ceremony-admin-agent — Mandate execution-ceremony-admin-agent in Foreman Phase 4 (Step 4.1a) per ECAP-001 §5.2
**6 check(s) FAILED. Merge BLOCKED. STOP-AND-FIX required.**

This PR must NOT be opened until all failures are resolved and IAA re-invoked.
Adoption phase: **PHASE_B_BLOCKING — hard gate ACTIVE.**
## ═══════════════════════════════════════

---

## Failures

### FAILURE 1 — HFMC-01 / OVL-AC-007 / A-023 / AC-05: Ripple Assessment Missing
**Classification**: Systemic (recurring: sessions 051, 052, now 056 — pattern confirmed per HFMC-01 background)
**Finding**: The PREHANDOVER proof (`.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-056-foreman-ecap-20260410.md`) does NOT contain a `## Ripple/Cross-Agent Assessment` section. Zero matches for "Ripple", "ripple", "downstream", "cross-agent" in the file. This is a mandatory requirement per FAIL-ONLY-ONCE A-023 and OVL-AC-007 for ALL AGENT_CONTRACT PRs.
**Context**: The Step 4.1a addition mandates execution-ceremony-admin-agent delegation in Foreman Phase 4. This is a substantive change to the Foreman delegation model. A ripple assessment must evaluate: (a) does execution-ceremony-admin-agent contract require a corresponding update? (b) does CodexAdvisor-agent contract need updating to reflect the new delegation chain? (c) does IAA contract's ECAP-001 checks remain consistent with this foreman change?
**Fix required**: Add `## Ripple Assessment` section to the PREHANDOVER proof. Include either:
- `NO DOWNSTREAM RIPPLE REQUIRED — [justification]`, OR
- List of affected downstream files updated in this PR.
**Systemic prevention action required**: Template hardening — add mandatory `## Ripple Assessment` section to CodexAdvisor PREHANDOVER template. Section must require explicit YES/NO answer and cannot be left blank. No invocation proceeds without it.

---

### FAILURE 2 — HFMC-02 / A-026: SCOPE_DECLARATION Not Updated
**Classification**: Systemic (recurring: sessions 052, 050, now 056 — confirmed Systemic per HFMC-02 background)
**Finding**: The CodexAdvisor personal SCOPE_DECLARATION at `.agent-workspace/CodexAdvisor-agent/personal/SCOPE_DECLARATION.md` was NOT updated for session-056. It still reflects session ecap-001-20260409 (prior wave on branch `copilot/ecap-001-downstream-normalization`). The PR diff contains 5 files; none are listed in the current SCOPE_DECLARATION.
**PR diff files** (confirmed via `git diff HEAD~1 HEAD --name-only`):
- `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-056-foreman-ecap-20260410.md`
- `.agent-workspace/CodexAdvisor-agent/memory/session-056-20260410.md`
- `.agent-workspace/CodexAdvisor-agent/parking-station/suggestions-log.md`
- `.agent-workspace/foreman-v2/knowledge/specialist-registry.md`
- `.github/agents/foreman-v2-agent.md`
**Fix required**: Update `.agent-workspace/CodexAdvisor-agent/personal/SCOPE_DECLARATION.md` to declare session-056 scope with all 5 files listed. Commit to branch before re-invoking IAA.
**Systemic prevention action required**: Template hardening — CodexAdvisor PREHANDOVER template must include a mandatory SCOPE_DECLARATION update checklist item producing a HANDOVER BLOCKER if not explicitly checked and committed.

---

### FAILURE 3 — HFMC-04: Pre-Brief Absent for Wave foreman-ecap-step41a
**Classification**: Ceremony
**Finding**: No IAA pre-brief file matching wave "foreman-ecap-step41a" exists in `.agent-admin/assurance/`. The closest existing pre-brief is `iaa-prebrief-ecap-001-20260409.md` which covers branch `copilot/ecap-001-downstream-normalization` — a different branch, different wave. No dedicated pre-brief covers this specific micro-wave/branch.
**Fix required**: Either:
(a) Create a dedicated IAA pre-brief artifact for wave "foreman-ecap-step41a" (IAA invoked in PRE-BRIEF mode), OR
(b) Provide explicit written CS2 authorisation (quoted verbatim in PREHANDOVER proof) that the ecap-001-20260409 pre-brief explicitly covers this wave's work, with justification.

---

### FAILURE 4 — CORE-007a: Foreman Contract Footer Version Mismatch
**Classification**: Ceremony
**Finding**: The foreman-v2-agent.md footer (line 664) reads `**Version**: 6.2.0 | **Contract**: 2.10.0 | **Last Updated**: 2026-04-08`. The YAML frontmatter (line 10) was correctly updated to `contract_version: 2.11.0`. The footer was NOT updated to match the version bump. This creates an internal inconsistency within the delivered contract artifact.
**Evidence**: `grep "Contract.*2\.\|contract_version" .github/agents/foreman-v2-agent.md` → line 10: `contract_version: 2.11.0` / line 664: `**Contract**: 2.10.0`
**Fix required**: Update footer line 664 to: `**Version**: 6.2.0 | **Contract**: 2.11.0 | **Last Updated**: 2026-04-10`

---

### FAILURE 5 — CORE-007b: Specialist-Registry Header Inconsistency
**Classification**: Ceremony
**Finding**: `.agent-workspace/foreman-v2/knowledge/specialist-registry.md` header (lines 4–5) reads `Knowledge Version: 1.0.0` / `Last Updated: 2026-02-21`. The footer was correctly updated to `Version: 1.2.0 | Date: 2026-04-10`. The header fields were NOT synchronized.
**Fix required**: Update specialist-registry.md header to: `Knowledge Version: 1.2.0` / `Last Updated: 2026-04-10`

---

### FAILURE 6 — CORE-018(c): `iaa_audit_token` Field Format Deviation
**Classification**: Ceremony
**Finding**: The PREHANDOVER proof does NOT contain the standard `iaa_audit_token: IAA-session-NNN-waveY-YYYYMMDD-PASS` key-value field. Instead it uses "**Expected IAA audit token reference**: `IAA-session-056-foreman-ecap-20260410-PASS`" as a free-text label under "IAA Trigger Classification". Reference template pattern from session-054 proof: `iaa_audit_token: IAA-session-054-ps-f-iaa-trigger-table-20260407-PASS` under `## IAA Audit Token` section.
**Fix required**: Add `## IAA Audit Token` section to PREHANDOVER proof with:
```
iaa_audit_token: IAA-session-056-foreman-ecap-20260410-PASS
```
This must be a standalone key-value line per A-029 §4.3b architecture.

---

## Substantive Assessment (90% Quality Review)

**The core changes are SUBSTANTIVELY SOUND.** All 6 failures are ceremony/process failures, not substantive defects in the delivered governance change.

- **Step 4.1a (new)**: Correctly implements ECAP-001 §5.2. Delegation to execution-ceremony-admin-agent before PREHANDOVER review is clear, bounded, and consistent with the three-role split. Instruction "Do NOT generate PREHANDOVER or session memory yourself" correctly enforces the model.
- **Steps 4.2/4.3 heading changes** ("Generate" → "Review"): Correctly reflects the delegation model — Foreman reviews what ceremony-admin produces.
- **contract_version 2.10.0 → 2.11.0**: Appropriate version bump for a functional Phase 4 change.
- **ECAP role boundary**: Three-role split preserved — ceremony-admin prepares, Foreman reviews, IAA audits independently.

Once ceremony failures are resolved, this PR is expected to pass assurance on re-invocation.

---

## Re-Invocation Requirements

Before re-invoking IAA:
1. Add `## Ripple Assessment` to PREHANDOVER proof (Failure 1)
2. Update SCOPE_DECLARATION.md for session-056 (Failure 2)
3. Resolve pre-brief gap — create pre-brief OR document CS2 waiver (Failure 3)
4. Fix footer version to `**Contract**: 2.11.0` (Failure 4)
5. Fix specialist-registry header to `Knowledge Version: 1.2.0` / `Last Updated: 2026-04-10` (Failure 5)
6. Add `## IAA Audit Token` section with `iaa_audit_token:` key-value field to PREHANDOVER proof (Failure 6)
7. Commit all fixes. Verify working tree clean (`git status --porcelain` = empty).
8. Re-invoke IAA with fresh evidence bundle.

**Note**: Per §4.3b, the existing PREHANDOVER proof is NOT read-only until after IAA issues ASSURANCE-TOKEN. Since no token exists yet (this is the first invocation and it returned REJECTION-PACKAGE), the PREHANDOVER proof MAY be amended in the same commit as the fixes. A fresh PREHANDOVER proof in a new commit resolves all PREHANDOVER-related failures.

---

**IAA**: independent-assurance-agent v6.2.0 | **Authority**: CS2 (@APGI-cmy)
**Token reference**: IAA-session-056-foreman-ecap-20260410-REJECTED
**Adoption phase**: PHASE_B_BLOCKING — hard gate ACTIVE
