# IAA Pre-Brief — Wave `breach-rca-20260308`

**Artifact type**: IAA Pre-Brief (Phase 0)
**Wave**: breach-rca-20260308
**Branch**: copilot/fix-foreman-bootstrap-issue
**Issue**: #1013 — fail-only-once: Foreman bootstrap and implementation breach — Phase 1 + NO-IMPLEMENT-001 (PRs #986, #990, 2026-03-08)
**Date**: 2026-03-08
**IAA Session**: iaa-prebrief-breach-rca-20260308 (Phase 0 only — no Phases 2–4 this session)
**Authority**: CS2 only (@APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0 / contract v2.2.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## 1. Wave Scope Confirmation

This is a **GOVERNANCE-ONLY wave**. No production code, no schemas, no migrations, no CI changes, no `.github/agents/` files.

All deliverables are governance/evidence artifacts confined to agent workspace and assurance paths.

**Declared tasks from `wave-current-tasks.md`:**

| Task ID | Description | Path(s) |
|---------|-------------|---------|
| T-RCA-001 | Add INC-BOOTSTRAP-IMPL-001 incident + new A-rule to Foreman FAIL-ONLY-ONCE.md; version bump to 2.9.0 | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` |
| T-RCA-002 | Write missing session memory for 2026-03-08 breach | `.agent-workspace/foreman-v2/memory/session-rca-breach-20260308.md` |
| T-RCA-003 | Append parking station entry S-023 | `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` |
| PREHANDOVER | Foreman PREHANDOVER proof for this wave | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-rca-breach-20260308.md` |

---

## 2. Trigger Category Classification

### Per `iaa-trigger-table.md` v2.1.0:

| Task | Path | Classification | IAA Required? |
|------|------|----------------|--------------|
| T-RCA-001 | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | **KNOWLEDGE_GOVERNANCE** — matches `.agent-workspace/*/knowledge/` pattern; this is a Tier 2 knowledge file (operational FAIL-ONLY-ONCE registry) | **YES — MANDATORY** |
| T-RCA-002 | `.agent-workspace/foreman-v2/memory/session-rca-breach-20260308.md` | Session memory only → EXEMPT on its own | N/A (governed by T-RCA-001 trigger) |
| T-RCA-003 | `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` | Parking station → EXEMPT on its own | N/A (governed by T-RCA-001 trigger) |
| PREHANDOVER | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-rca-breach-20260308.md` | Ceremony artifact — part of KNOWLEDGE_GOVERNANCE bundle | Covered by primary trigger |

**Overall PR trigger category: KNOWLEDGE_GOVERNANCE (MANDATORY)**

AMBIGUITY RULE: Unambiguous. No class exemption applies. FAIL-ONLY-ONCE A-015 applies: Tier 2 knowledge patches require full PREHANDOVER ceremony.

---

## 3. FFA Checks IAA Will Run at Handover

IAA will execute ALL of the following at full assurance invocation (Phases 2–4):

### 3a. FAIL-ONLY-ONCE Learning Checks (Phase 3 Step 3.1)

| Rule | Check | Relevance to This Wave |
|------|-------|------------------------|
| A-001 | IAA invocation evidence present in PR artifacts | Token file must be in committed PR diff |
| A-002 | No class exceptions — all agent classes covered | Foreman is not exempt from Tier 2 knowledge governance |
| A-015 | Tier 2 knowledge patches require full PREHANDOVER ceremony | T-RCA-001 is a Tier 2 knowledge patch — ceremony mandatory |
| A-021 | Commit before invocation | All artifacts must be committed + pushed before IAA invocation |
| A-025 | No pre-fill of `PENDING` in `iaa_audit_token` | PREHANDOVER must pre-populate expected token reference |
| A-026 | SCOPE_DECLARATION.md must match `git diff --name-only origin/main...HEAD` exactly | Stale SCOPE_DECLARATION.md detected (contains prior T075 wave content) — **see §5 Scope Blocker 1** |
| A-028 | SCOPE_DECLARATION format compliance (list format, prior-wave trimmed) | Related to A-026 blocker |
| A-029 (IAA) | PREHANDOVER immutability — `iaa_audit_token` pre-populated with expected reference format | Foreman must follow §4.3b pattern |
| A-030 | IAA token date accuracy — token date must match actual token file date | Applies at Post-ASSURANCE-TOKEN ceremony |

### 3b. Core Invariants (CORE-001 to CORE-022)

All 22 core invariant checks will be executed. Key checks for this wave:

| Check | What IAA Verifies |
|-------|-------------------|
| CORE-001 | PR is on the declared branch (`copilot/fix-foreman-bootstrap-issue`) |
| CORE-002 | All declared artifacts are committed (not working-tree only) |
| CORE-003 | No `.github/agents/` modifications in this PR |
| CORE-004 | No production code introduced |
| CORE-007 | No secrets or credentials present |
| CORE-013 | PREHANDOVER proof present and committed |
| CORE-015 | Session memory artifacts present in PR bundle |
| CORE-016 | Dedicated IAA token file present (post-verdict ceremony) |
| CORE-018 | Complete evidence artifact sweep — all declared files in committed diff |
| CORE-019 | IAA token cross-verification (first invocation exception applies) |
| CORE-021 | No prohibited agent file paths modified |
| CORE-022 | `secret:` field absent (must be `secret_env_var:`) |

### 3c. KNOWLEDGE_GOVERNANCE Overlay (OVL-KG-001 to OVL-KG-ADM-003)

| Check ID | What IAA Will Verify |
|----------|----------------------|
| OVL-KG-001 | New A-rule (INC-BOOTSTRAP-IMPL-001) is stated clearly enough that the Foreman can apply it without ambiguity. No vague language. |
| OVL-KG-002 | New rule is traceable to a real incident (PRs #986 and #990, 2026-03-08 breach). Incident grounding confirmed in wave scope. |
| OVL-KG-003 | New rule does not duplicate an existing rule (particularly A-011 bootstrap directive, A-014 IAA tool call, A-016 Phase-4-before-commit). IAA will verify no collision. |
| OVL-KG-004 | All cross-references in the new rule (A-rule IDs, incident IDs, file paths) are valid and resolvable. |
| OVL-KG-ADM-001 | PREHANDOVER ceremony complete (Covered by CERT-001 through CERT-004) |
| OVL-KG-ADM-002 | Foreman FAIL-ONLY-ONCE.md version bump present (2.8.0 → 2.9.0) |
| OVL-KG-ADM-003 | Foreman knowledge `index.md` (if present) reflects updated version |

### 3d. Merge Gate Parity (§4.3 — Phase 4 Step 4.1)

For this governance-only PR, local parity checks will include:
- YAML validation of any changed YAML-front-matter files
- `validate-scope-to-diff.sh` or equivalent: SCOPE_DECLARATION.md list vs `git diff --name-only origin/main...HEAD`
- Canon hash verification: 0 null hashes in CANON_INVENTORY.json
- CI required checks: `merge-gate/verdict`, `governance/alignment`, `stop-and-fix/enforcement`

---

## 4. Required PREHANDOVER Proof Structure

The Foreman MUST commit a PREHANDOVER proof at `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-rca-breach-20260308.md` **before** invoking IAA.

### 4.1 Mandatory Fields

| Field | Required Value |
|-------|----------------|
| `wave` | `breach-rca-20260308` |
| `session` | `session-rca-breach-20260308` |
| `branch` | `copilot/fix-foreman-bootstrap-issue` |
| `issue` | `#1013` |
| `date` | Actual session date |
| `producing_agent` | `foreman-v2-agent` (governance doc author) |
| `pr_category` | `KNOWLEDGE_GOVERNANCE` |

### 4.2 Evidence Bundle Table

Must list ALL committed artifacts with paths and commit SHA evidence. Minimum entries:

| # | Artifact | Path | Status |
|---|----------|------|--------|
| 1 | Foreman FAIL-ONLY-ONCE.md (T-RCA-001) | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | COMMITTED |
| 2 | Foreman session memory (T-RCA-002) | `.agent-workspace/foreman-v2/memory/session-rca-breach-20260308.md` | COMMITTED |
| 3 | Parking station entry (T-RCA-003) | `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` | COMMITTED |
| 4 | This PREHANDOVER proof | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-rca-breach-20260308.md` | COMMITTED |
| 5 | SCOPE_DECLARATION.md | `SCOPE_DECLARATION.md` (freshly overwritten per A-029) | COMMITTED |
| 6 | IAA Pre-Brief (this file) | `.agent-admin/assurance/iaa-prebrief-breach-rca-20260308.md` | COMMITTED |

### 4.3 Ripple / Cross-Agent Assessment Section (MANDATORY — A-023)

The PREHANDOVER proof MUST contain a ripple assessment section addressing:

1. **Does the new A-rule (INC-BOOTSTRAP-IMPL-001) ripple to the Foreman agent contract?**
   - If the rule requires a contract update (e.g., a new Phase step, a new prohibition), that change requires CodexAdvisor + CS2 authorisation per A-013/AGCFPP-001.
   - The Foreman MUST declare whether a contract change is required or confirm that the new A-rule is operational-only (Tier 2) and no contract change is needed.

2. **Does this rule apply to other agents (builders, specialists)?**
   - If the NO-IMPLEMENT-001 pattern is a cross-agent concern, note whether other agent Tier 2 knowledge files require parallel updates.

3. **Upstream ripple to `maturion-foreman-governance`?**
   - This is a Tier 2 local extension. Note whether the new incident warrants a Layer-Up candidate for the canonical UNIVERSAL_FAIL_ONLY_ONCE_POLICY.md.

IAA will FAIL CORE immediately if this section is absent (per A-023: "If absent: FAIL immediately. Session memory is not a substitute.").

### 4.4 Pre-IAA Commit Gate Section (MANDATORY — A-027)

Must include:
- Output of `git status` showing clean working tree
- Output of `git log --oneline -5` confirming all artifacts committed

### 4.5 IAA Audit Token (A-029 compliance)

```
iaa_audit_token: IAA-session-rca-breach-20260308-wavebreachRCA-20260308-PASS
```

> **Note**: This token reference format must be pre-populated at commit time. IAA will write the dedicated token file `.agent-admin/assurance/iaa-token-session-rca-breach-20260308-wavebreachRCA-20260308.md` post-verdict. The PREHANDOVER proof MUST NOT be edited after initial commit (§4.3b immutability).

### 4.6 SCOPE_DECLARATION.md (A-026 + A-028 + A-029 Foreman)

The Foreman MUST:
1. Clear SCOPE_DECLARATION.md with `cat /dev/null > SCOPE_DECLARATION.md` before writing (A-029 Foreman rule).
2. List every file in the PR diff using ` - ` list format (A-028).
3. Verify that `validate-scope-to-diff.sh` (or manual diff comparison) shows exact match.

---

## 5. Scope Blockers and Governance Conflicts

### Blocker 1 — STALE SCOPE_DECLARATION.md ⚠️

**Finding**: `SCOPE_DECLARATION.md` currently contains stale content from the prior T075 wave (wave `patch-T075-isolation`, branch `copilot/fix-isolate-build-persistent-memory-test`). This file must be completely cleared and rewritten for this wave before IAA invocation.

**Rule**: A-029 (Foreman) — SCOPE_DECLARATION-FRESH-OVERWRITE. Also A-026 (IAA) — SCOPE_DECLARATION.md must match PR diff exactly. A stale SCOPE_DECLARATION will fail `validate-scope-to-diff.sh` and trigger BL-027 merge gate parity FAIL.

**Fix required before IAA invocation**: `cat /dev/null > SCOPE_DECLARATION.md`, then rewrite with correct wave content listing all committed artifacts. Verify match with `git diff --name-only origin/main...HEAD`.

### Blocker 2 — A-Rule ID Confirmation Required ⚠️

**Finding**: The current Foreman FAIL-ONLY-ONCE.md is at v2.8.0 with A-030 as the last locked-in rule. A-032 exists as a CANDIDATE (not yet approved). The next sequential available A-rule ID is **A-031**.

**Action for Foreman**: The new rule for INC-BOOTSTRAP-IMPL-001 should be assigned **A-031** (not A-032, which is reserved for the candidate; not A-033 or higher without evidence of a gap). Confirm A-031 is unoccupied before committing. Version bump 2.8.0 → 2.9.0 is appropriate for one new rule.

**IAA will verify**: No ID collision with existing A-031 (checking full file at handover).

### Non-Blocker Advisory 1 — OVL-KG-003 Duplication Risk

**Finding**: The breach described (Foreman Phase 1 bootstrap skip + direct implementation without delegation) is partially covered by existing rules:
- A-011 (AGENT-FILE-FIRST — bootstrap-first mandate)
- A-014 (IAA tool call mandatory — delegation to IAA required)
- A-016 (Phase 4 before report_progress)
- A-017 (ISMS-AGENTS-ONLY delegation)

The new A-031 rule must be scoped to address what is **not yet covered**: specifically, the **direct implementation of production test/CI code** (NO-IMPLEMENT-001) combined with the **bootstrap skip in the same session**. This should be framed as a compound incident rule, not a re-statement of A-011 or A-017.

**IAA will check**: OVL-KG-001 (clarity) and OVL-KG-003 (no duplication). If the new rule materially overlaps with A-011/A-017, IAA may issue a REJECTION-PACKAGE finding requesting differentiation.

### Non-Blocker Advisory 2 — Ripple to Foreman Contract

The wave-current-tasks.md notes that the NO-IMPLEMENT-001 violation involved the Foreman writing production test code directly. If the new A-031 rule implies a Phase step change (e.g., an explicit prohibition step in Phase 1 or Phase 3), this creates a ripple to `.github/agents/foreman-v2-agent.md` which requires CodexAdvisor + CS2 authorisation per A-013/AGCFPP-001. The Foreman must declare in the PREHANDOVER ripple assessment whether a contract change is required. If it is: this wave cannot complete without a parallel CodexAdvisor + CS2-authorised contract update, which is out of scope for this GOVERNANCE-ONLY wave and would require a separate wave.

---

## 6. Applicable Overlays Summary

| Overlay | Checks | Required for This Wave? |
|---------|--------|------------------------|
| KNOWLEDGE_GOVERNANCE | OVL-KG-001 to OVL-KG-ADM-003 | **YES — Primary trigger** |
| CORE invariants | CORE-001 to CORE-022 | YES — All invocations |
| AGENT_CONTRACT | OVL-AC-001 etc. | NO — No `.github/agents/` changes |
| CI_WORKFLOW | OVL-CI-001 etc. | NO — No workflow changes |
| AAWP_MAT / BUILD_DELIVERABLE | BD-001 etc. | NO — Governance only |

---

## 7. Pre-Brief Completion Status

| Step | Status |
|------|--------|
| 0.1 — Pre-Brief invocation confirmed | ✅ DONE |
| 0.2 — wave-current-tasks.md read | ✅ DONE |
| 0.3 — Tasks classified | ✅ DONE — KNOWLEDGE_GOVERNANCE primary trigger |
| 0.4 — Pre-Brief artifact generated | ✅ THIS FILE |
| 0.5 — Commit Pre-Brief artifact | 🔄 IN PROGRESS |
| 0.6 — Reply to triggering comment | 🔄 IN PROGRESS |

---

## 8. Wave Completion Gate (IAA Pre-Brief Obligations)

Before IAA can issue ASSURANCE-TOKEN at handover:

- [ ] T-RCA-001: INC-BOOTSTRAP-IMPL-001 + A-031 committed to FAIL-ONLY-ONCE.md v2.9.0
- [ ] T-RCA-002: Foreman session memory committed
- [ ] T-RCA-003: Parking station entry committed
- [ ] PREHANDOVER proof committed with all required sections (§4.1–4.6 above)
- [ ] SCOPE_DECLARATION.md freshly overwritten and matching PR diff (Blocker 1 resolved)
- [ ] A-rule ID confirmed as A-031 (Blocker 2 resolved)
- [ ] Pre-IAA Commit Gate: clean working tree, git log evidence
- [ ] IAA invoked via `task(agent_type: "independent-assurance-agent")` tool call (A-014)

---

**Authority**: CS2 only (@APGI-cmy)
**Generated by**: independent-assurance-agent v6.2.0 / Phase 0 Pre-Brief
**Session**: iaa-prebrief-breach-rca-20260308
**Date**: 2026-03-08
