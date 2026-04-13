# IAA Pre-Brief — Foreman Phase 4 Step 4.1a (ECAP-001 §5.2 Compliance)

**Document type**: IAA Pre-Brief Artifact (Phase 0 — PRE-BRIEF mode)
**Wave**: foreman-ecap-step41a
**Branch**: copilot/fix-execution-ceremony-admin-agent
**Issue**: maturion-isms — [Governance] Mandate execution-ceremony-admin-agent appointment in Foreman contract Phase 4
**Pre-Brief authored by**: CodexAdvisor-agent (session-056 R2 — post-rejection pre-brief creation)
**Date**: 2026-04-10
**Authority**: CS2 (@APGI-cmy) | INDEPENDENT_ASSURANCE_AGENT_CANON.md
**Invocation mode**: PHASE 0 — PRE-BRIEF. IAA assurance phases 1–4 to be invoked at handover.

---

## 1. Wave Summary

Micro-wave to mandate `execution-ceremony-admin-agent` appointment in Foreman contract Phase 4,
implementing ECAP-001 §5.2 compliance. Work was performed by CodexAdvisor-agent (session-056)
on branch `copilot/fix-execution-ceremony-admin-agent`.

This wave addresses IAA REJECTION-PACKAGE from session-056 first invocation. All 6 ceremony
failures are corrected in this R2 commit.

**Scope**:
1. `.github/agents/foreman-v2-agent.md` — add Step 4.1a (delegate ceremony bundle to execution-ceremony-admin-agent before PREHANDOVER review), update Steps 4.2/4.3 headings (Generate → Review), bump contract_version 2.10.0 → 2.11.0, fix footer version consistency
2. `.agent-workspace/foreman-v2/knowledge/specialist-registry.md` — update Knowledge Version 1.0.0 → 1.2.0, Last Updated 2026-02-21 → 2026-04-10
3. `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-056-foreman-ecap-20260410.md` — CodexAdvisor PREHANDOVER proof (amended per IAA rejection)
4. `.agent-workspace/CodexAdvisor-agent/memory/session-056-20260410.md` — CodexAdvisor session memory
5. `.agent-workspace/CodexAdvisor-agent/parking-station/suggestions-log.md` — parking station entry
6. `.agent-workspace/CodexAdvisor-agent/personal/SCOPE_DECLARATION.md` — personal scope declaration for session-056
7. `SCOPE_DECLARATION.md` (root) — updated to declare exact PR diff for session-056

---

## 2. Agent Authority

**Executing agent**: CodexAdvisor-agent (Overseer class, administrator_class_coverage)
**CS2 Authorization**: Issue opened and assigned to CodexAdvisor-agent by @APGI-cmy (CS2)
**ECAP role boundary**: Three-role split preserved — ceremony-admin prepares, Foreman reviews, IAA audits independently
**POLC compliance**: Changes limited to Foreman Phase 4 orchestration model; no builder contracts modified

---

## 3. IAA Assessment Scope (at invocation)

IAA should verify:
1. **CORE-007**: foreman-v2-agent.md YAML frontmatter `contract_version: 2.11.0` matches footer `**Contract**: 2.11.0`
2. **CORE-007b**: specialist-registry.md header Knowledge Version 1.2.0 matches footer
3. **AC-05/OVL-AC-007/A-023**: PREHANDOVER proof contains `## Ripple Assessment` section with explicit verdict
4. **A-029 CORE-018(c)**: PREHANDOVER proof contains `## IAA Audit Token` section with `iaa_audit_token:` key-value
5. **A-026**: Root `SCOPE_DECLARATION.md` declared scope matches `git diff origin/main...HEAD` exactly
6. **HFMC-04**: This pre-brief covers wave foreman-ecap-step41a on branch `copilot/fix-execution-ceremony-admin-agent`
7. **ECAP-001 §5.2**: Step 4.1a correctly mandates execution-ceremony-admin-agent delegation before PREHANDOVER review
8. **Character count**: foreman-v2-agent.md ≤ 30,000 characters
9. **YAML frontmatter**: foreman-v2-agent.md ≤ 200 lines

---

## 4. Expected IAA Audit Token

`IAA-session-056-foreman-ecap-20260410-PASS`

Token file (IAA to create): `.agent-admin/assurance/iaa-token-session-056-foreman-ecap-20260410.md`

---

**IAA**: independent-assurance-agent v6.2.0 | **Authority**: CS2 (@APGI-cmy)
