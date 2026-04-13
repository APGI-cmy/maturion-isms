# IAA REJECTION-PACKAGE — Session govpatch-session051-20260405

**IAA Session ID**: session-govpatch-session051-20260405
**Date**: 2026-04-05
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Adoption Phase**: PHASE_B_BLOCKING

---

## PR Under Review

**Branch**: copilot/lock-out-foreman-self-certification
**Requested by**: CodexAdvisor-agent (session-051-20260405)
**Work produced by**: CodexAdvisor-agent, class: overseer
**Artifact scope**: foreman-v2-agent.md (YAML trigger, NO-SELFCERT-001 prohibition, iaa_oversight rationale) + CodexAdvisor FAIL-ONLY-ONCE.md (A-036 + INC-IAA-SELFCERT-001)
**PR Category**: MIXED (AGENT_CONTRACT + KNOWLEDGE_GOVERNANCE) → IAA MANDATORY
**CS2 Authorization**: Issue opened and assigned by @APGI-cmy — CONFIRMED

---

## Verdict

═══════════════════════════════════════
**REJECTION-PACKAGE**

PR: copilot/lock-out-foreman-self-certification — Foreman self-certification lock-out patch

**5 check(s) FAILED. Merge blocked. STOP-AND-FIX required.**

**FAILURES:**

1. **CORE-018(a) + A-033**: PREHANDOVER proof not committed to git.
   - Evidence: `git ls-tree -r HEAD | grep PREHANDOVER-session-051-20260405` → EMPTY. File is untracked on disk only. Per A-033: "If the file does NOT appear: FAIL regardless of disk presence."
   - Fix required: `git add .agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-051-20260405.md && git commit && git push`

2. **CORE-018(b) + A-033**: Session memory not committed to git.
   - Evidence: `git ls-tree -r HEAD | grep session-051-20260405` → EMPTY. File is untracked on disk only.
   - Fix required: `git add .agent-workspace/CodexAdvisor-agent/memory/session-051-20260405.md && git commit && git push`

3. **A-021 + CORE-018**: Governance artifact changes uncommitted. `foreman-v2-agent.md` and `CodexAdvisor FAIL-ONLY-ONCE.md` appear in `git diff HEAD --name-only` as working-tree-only modifications. The HEAD commit ("Initial plan") introduced zero file changes to these files. Per A-021: "the producing agent MUST execute `git commit && git push` BEFORE invoking IAA."
   - Fix required: `git add .github/agents/foreman-v2-agent.md .agent-workspace/CodexAdvisor-agent/knowledge/FAIL-ONLY-ONCE.md && git commit && git push`

4. **OVL-AC-007 + A-023 (RIPPLE ASSESSMENT MISSING)**: PREHANDOVER proof contains no `## Ripple Assessment` or `## Ripple/Cross-Agent Assessment` section. Exhaustive search for "ripple", "cross-agent", "downstream" in PREHANDOVER proof returned NO MATCHES. Per A-023: "Search PREHANDOVER proof for ripple/cross-agent assessment section. If absent: FAIL immediately. Session memory is not a substitute."
   - Fix required: Add `## Ripple / Cross-Agent Assessment` section to PREHANDOVER proof. Declare: (a) whether this change requires downstream updates to any other agent contracts or knowledge files, or (b) explicit `NO DOWNSTREAM RIPPLE REQUIRED` verdict with justification. Note: the addition of NO-SELFCERT-001 to foreman may require at least a ripple assessment against other agent contracts that reference foreman behaviour. The declaring agent must explicitly document the scope decision.

5. **OVL-AC-ADM-004**: foreman-v2-agent.md at 30,648 bytes exceeds the 30,000 byte hard limit (648 bytes over). Per IAA_AGENT_CONTRACT_AUDIT_STANDARD §3 and OVL-AC-ADM-004: "If limit is exceeded: IAA flags bloat... and issues REJECTION-PACKAGE." Per CORE-021: "The only valid exception is an explicit written CS2 waiver quoted verbatim in the output." The PREHANDOVER characterises the issue assignment as a CS2-authorized exception but does not quote a verbatim CS2 waiver statement.
   - Fix required: Trim foreman-v2-agent.md below 30,000 bytes by migrating Tier 2 content (inline scripts, extended rationale blocks, or phase body verbosity) to `.agent-workspace/foreman-v2/knowledge/` per IAA_AGENT_CONTRACT_AUDIT_STANDARD §6.2-§6.3. Note: the governance additions themselves are correct and should be retained — the trim should target existing verbosity elsewhere in the contract body.

**This PR must NOT be opened or merged until ALL 5 failures are resolved and IAA is re-invoked.**

Adoption phase: PHASE_B_BLOCKING — Hard gate ACTIVE
═══════════════════════════════════════

---

## Passing Checks (Evidence Summary)

All of the following were verified PASS:

- **CORE-001**: YAML frontmatter valid — all required fields (agent, identity, governance, prohibitions, merge_gate_interface, tier2_knowledge) present and non-empty ✅
- **CORE-002**: agent.version = 6.2.0 — matches LIVING_AGENT_SYSTEM v6.2.0 ✅
- **CORE-003**: contract_version = 2.8.0 — present, semver, non-zero ✅
- **CORE-004**: identity.role="POLC Supervisor", mission len=329, class_boundary len=254 — all present and substantive ✅
- **CORE-005**: governance block present — protocol, version, canon_inventory non-empty ✅
- **CORE-006**: CANON_INVENTORY.json — 192 entries, 0 placeholder hashes ✅
- **CORE-007**: No placeholder/stub/TODO content in artifacts ✅
- **CORE-008**: SELF-MOD-FM-001 + NO-SELFCERT-001 (CONSTITUTIONAL enforcement) present ✅
- **CORE-009**: merge_gate_interface.required_checks non-empty array, parity_enforcement: BLOCKING ✅
- **CORE-010**: tier2_knowledge.index → .agent-workspace/foreman-v2/knowledge/index.md — file EXISTS ✅
- **CORE-011**: All 4 phases present (PHASE 1 IDENTITY & PREFLIGHT, PHASE 2 ALIGNMENT, PHASE 3 WORK, PHASE 4 HANDOVER) ✅
- **CORE-012**: SELF-MOD-FM-001 with enforcement: CONSTITUTIONAL present ✅
- **CORE-013**: iaa_audit_token = `IAA-session-051-20260405-PASS` present in PREHANDOVER ✅
- **CORE-014**: No class exemption claimed ✅
- **CORE-016**: First invocation — token file will be created this session ✅
- **CORE-017**: Producer = CodexAdvisor-agent, CS2 authorization documented ✅
- **CORE-019**: First invocation exception — token file will be created at Phase 4 Step 4.3 ✅
- **CORE-022**: `secret_env_var: "MATURION_BOT_TOKEN"` — no bare `secret:` field present ✅
- **CORE-023**: No workflow-adjacent files changed — N/A ✅
- **OVL-AC-001**: Strategy alignment — NO-SELFCERT-001, trigger expansion, and iaa_oversight rationale correctly implement the governance intent to close the Foreman self-certification loophole ✅
- **OVL-AC-002**: No contradictions — changes align with AGCFPP-001, IAA mandate, FAIL-ONLY-ONCE principles ✅
- **OVL-AC-003**: Authority boundaries — NO-SELFCERT-001 with CONSTITUTIONAL enforcement clearly and unambiguously defines the boundary ✅
- **OVL-AC-004**: Delegation safety — CONSTITUTIONAL prohibition eliminates planning-wave argument pathway ✅
- **OVL-AC-005**: Four-phase structure — all 4 phases present with substantive content ✅
- **OVL-AC-006**: Self-modification prohibition — SELF-MOD-FM-001 present with CONSTITUTIONAL enforcement ✅
- **OVL-AC-ADM-003**: foreman-v2/knowledge/index.md EXISTS ✅
- **AC-01**: AGCFPP-001 — CodexAdvisor-agent + CS2 issue by @APGI-cmy ✅
- **AC-02**: Protected components sweep — all 14 protected components from IAA_AGENT_CONTRACT_AUDIT_STANDARD §3 present and non-weakened ✅
- **AC-04**: Tier placement discipline — no Tier 2 content inline (checklists, scripts, templates remain in Tier 2) ✅

---

## Substance Quality Note

The governance content itself is EXCELLENT. The three foreman-v2-agent.md changes (trigger expansion, NO-SELFCERT-001, iaa_oversight rationale extension) are precisely targeted, constitutionally correct, and close the self-certification loophole without unintended side effects. The CodexAdvisor FAIL-ONLY-ONCE additions (A-036, INC-IAA-SELFCERT-001) are correctly formatted, actionable, and complete. IAA confirms the governance intent is sound — the failures are entirely procedural (uncommitted artifacts and two missing ceremony elements). Resolution of the 5 findings will result in an ASSURANCE-TOKEN on re-invocation.

---

## Re-Invocation Instructions

1. Execute ALL 5 fixes listed above
2. Commit all changed files in a single commit: `git add -A && git commit -m "fix(governance): resolve IAA REJECTION-PACKAGE findings — commit artifacts, add ripple assessment, trim contract" && git push`
3. Add a correction addendum to the PREHANDOVER proof (per A-030) documenting this REJECTION-PACKAGE and what was fixed
4. Invoke IAA for re-verification

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Token reference**: IAA-govpatch-session051-20260405-REJECTION
