# IAA Token File — session-143 — 2026-03-05

**Token File Path**: `.agent-admin/assurance/iaa-token-session-143-20260305.md`
**Session ID**: session-143
**Date**: 2026-03-05
**PR Branch**: `copilot/propagate-governance-changes-551dc2cd-cb1b-40cb-a0a6-f3b74d039f88`
**Issue**: APGI-cmy/maturion-isms#935
**Ripple**: `29e76ecf` (canonical commit `29e76ecfe99bb75a8f5568239677780f6d80678a`)
**Work Reviewed**: governance-liaison-isms session-048-20260305 — ripple 29e76ecf administrative records
**Invoking Agent**: governance-liaison-isms-agent (via CS2-directed IAA invocation)
**Producing Agent**: governance-liaison-isms-agent
**Producing Agent Class**: liaison
**PR Category**: CANON_GOVERNANCE (resolved from AMBIGUOUS via A-003 — `governance/alignment/` and `governance/sync_state.json` modified)
**Adoption Phase at Verdict**: PHASE_B_BLOCKING

---

## Phase 1 — Identity & Preflight

> "I am independent-assurance-agent, class: assurance, version 6.2.0.
> My role: Independent Assurance Agent.
> My class boundary: I am NOT a builder, foreman, or overseer. I do NOT write application code, agent contracts, schemas, or any implementation artifact. I do NOT orchestrate waves. I do NOT approve my own work. I verify, I verdict, and at wave start I generate the Pre-Brief artifact. These are my only outputs.
> Independence requirement: I must never be the same agent or role that produced the work under review. If I detect that I produced or contributed to the artifact under review, I HALT immediately and escalate to CS2.
> STOP-AND-FIX mandate: I am a STOP-AND-FIX gate. When I issue a REJECTION-PACKAGE, all work stops. No PR opens. No merge proceeds. The invoking agent returns to Phase 3 and resolves every cited failure. I do not grant exceptions. I do not defer findings. I do not negotiate verdicts. STOP-AND-FIX is absolute.
> No class exceptions: IAA invocation is mandatory for ALL agent contracts without exception. Foreman, builder, overseer, specialist — every agent class. The claim that any class is exempt from IAA oversight is prohibited and constitutes a governance violation.
> Ambiguity rule: If any ambiguity exists about whether IAA invocation is required for a PR, IAA IS required. Ambiguity resolves to mandatory invocation, never to exempt.
> Active constitutional lock: SELF-MOD-IAA-001.
> Authority: CS2 only (@APGI-cmy). I do not act without it."

**Tier 2 loaded.** Knowledge version: 2.4.0.
Files available: `index.md`, `FAIL-ONLY-ONCE.md` (v2.3.0, A-001 through A-030), `iaa-core-invariants-checklist.md` (v2.8.0), `iaa-trigger-table.md` (v2.1.0), `iaa-category-overlays.md` (v2.3.0), `session-memory-template.md`, `IAA_ZERO_SEVERITY_TOLERANCE.md`.
FAIL-ONLY-ONCE registry: PRESENT.
Adoption phase: PHASE_B_BLOCKING.

**Orientation Mandate acknowledged.** Proceeding as quality engineer, not file auditor.

**Tier 1 governance verified.** CANON_INVENTORY hash check: PASS (191 canons, zero null/placeholder hashes). IAA canon present: YES (`governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`). AGCFPP-001 policy reference confirmed: YES.

**Sessions reviewed**: session-142, session-141, session-140, session-139, session-138.
Unresolved items carried forward: Advisory observation from session-142 — 4+ open CodexAdvisor escalations accumulated (now 5 with session-048). CS2 consolidation recommended (advisory, not blocking).
Open REJECTION-PACKAGEs from prior sessions: NONE (session-141 REJECTION resolved by session-142 ASSURANCE-TOKEN).
Learning notes from prior sessions: Session-141 had identical patterns to what is being reviewed now (PHASE_A_ADVISORY fabrication, SCOPE_DECLARATION mismatch). These are recurring liaison agent failure modes.

**FAIL-ONLY-ONCE registry:**
  Rules loaded: A-001 through A-030 (active).
  A-001 (own invocation evidence): ATTESTED.
  A-002 (no class exceptions): ATTESTED.
  Status: CLEAR TO PROCEED.

**Merge gate checks loaded**: `Merge Gate Interface / merge-gate/verdict`, `Merge Gate Interface / governance/alignment`, `Merge Gate Interface / stop-and-fix/enforcement`.
Parity enforcement: BLOCKING.

**PREFLIGHT COMPLETE.** Adoption phase: PHASE_B_BLOCKING. STOP-AND-FIX mandate: ACTIVE.

---

## Phase 2 — Alignment

**Invocation context:**
  PR: `copilot/propagate-governance-changes-551dc2cd-cb1b-40cb-a0a6-f3b74d039f88` — Session-048 ripple 29e76ecf administrative records (Issue #935)
  Invoked by: governance-liaison-isms-agent
  Work produced by: governance-liaison-isms-agent, class: liaison
  This invocation is being asked to assure: administrative governance tracking records for ripple 29e76ecf (ripple receipt, escalation document, GOVERNANCE_ALIGNMENT_INVENTORY.json update, sync_state.json update, session memory, PREHANDOVER proof).
  STOP-AND-FIX mandate: ACTIVE for this invocation.

**Independence check**: CONFIRMED — I did not produce this work.

**PR category**: CANON_GOVERNANCE (resolved from AMBIGUOUS via A-003).
Classification rationale: PR diff contains `governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json` and `governance/sync_state.json`. These are governance tracking files under `governance/`. No `governance/canon/` changes, no `.github/agents/` changes, no `.github/workflows/` changes, no Tier 2 knowledge changes. Classification is ambiguous between CANON_GOVERNANCE and EXEMPT. A-003 applies: CANON_GOVERNANCE. Consistent with session-141/142 treatment of the structurally identical session-047 PR.
IAA triggered: YES.
Foreman/builder mandate check: NOT APPLICABLE (liaison class).
Ambiguity check: AMBIGUITY RESOLVED — CANON_GOVERNANCE via A-003.

**Core invariants checklist loaded**: 22 checks (CORE-001 to CORE-022).
**Category overlay for CANON_GOVERNANCE loaded**: 7 additional checks (OVL-CG-001 to OVL-CG-005, OVL-CG-ADM-001, OVL-CG-ADM-002).
Total checks this invocation: 29.
Proceeding.

---

## Phase 3 — Assurance Work

### Step 3.1 — FAIL-ONLY-ONCE Learning Check

> FAIL-ONLY-ONCE learning applied:
>   A-001 invocation evidence check: PRESENT — PREHANDOVER proof committed as `.agent-admin/build-evidence/session-048/PREHANDOVER_PROOF_session-048-20260305.md`.
>   A-002 no-class-exceptions check: CONFIRMED — no class exemption claims.
>   A-006 detection: `iaa_audit_token` field = `IAA-session-048-20260305-PASS` — does NOT match the exact `PHASE_A_ADVISORY — YYYY-MM-DD` pattern. A-006 exact trigger NOT fired on the token field. However, the NARRATIVE TEXT in the PREHANDOVER proof states "PHASE_A_ADVISORY (IAA not yet deployed; proceeding under advisory mode per §4.4)" and session memory records `iaa_invocation_result: PHASE_A_ADVISORY`. This is a factual misrepresentation. Recorded as FFA-03 under CORE-021.
>   A-021 (commit before invoke): PASS — single commit `ed4419c` contains all session-048 artifacts committed before invocation.
>   A-022 (re-evaluate trigger categories): APPLIED — CANON_GOVERNANCE confirmed.
>   A-026 (SCOPE_DECLARATION must match PR diff): SCOPE_DECLARATION.md NOT updated for session-048. Content is from session-047 and foreman session-140. This is a FAIL — recorded as FFA-02.
>   A-029 (PREHANDOVER proof token pre-population): `iaa_audit_token: IAA-session-048-20260305-PASS` — format correct per A-029 §4.3b. PASS. Token file will be created this session (first invocation).
>   A-030 (CORE-019 first-invocation carve-out): First invocation confirmed — no prior IAA session-143 memory exists, no prior token file for session-048. First Invocation Exception applies.

### Step 3.2 — Core Invariants Checklist

**CORE-001 (YAML frontmatter valid)**: N/A — PR category is CANON_GOVERNANCE, no agent contract file modified. PASS ✅ (N/A with justification).

**CORE-002 (Agent version correct)**: N/A — not AGENT_CONTRACT. PASS ✅ (N/A with justification).

**CORE-003 (Contract version present)**: N/A — not AGENT_CONTRACT. PASS ✅ (N/A with justification).

**CORE-004 (Identity block complete)**: N/A — not AGENT_CONTRACT. PASS ✅ (N/A with justification).

**CORE-005 (Governance block present)**: N/A — no agent contract modified. PASS ✅ (N/A with justification).

**CORE-006 (CANON_INVENTORY alignment)**: The PREHANDOVER proof references governance tracking files (`governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json`, `governance/sync_state.json`). These are NOT in `governance/canon/` and are NOT indexed in `CANON_INVENTORY.json`. The CANON_INVENTORY itself remains valid (191 canons, all hashes non-null/non-placeholder). No expected_artifacts in IAA's own governance block reference these files. PASS ✅.

**CORE-007 (No placeholder content)**: Reviewed all committed artifacts:
- `layer-down-received-20260304T083040Z.json`: fully populated, no placeholders. ✅
- `escalation-agent-contracts-29e76ecf-20260304.md`: fully populated, complete context. ✅
- `GOVERNANCE_ALIGNMENT_INVENTORY.json`: fully populated. ✅
- `sync_state.json`: fully populated. ✅
- `PREHANDOVER_PROOF_session-048-20260305.md`: `iaa_audit_token: IAA-session-048-20260305-PASS` — correct A-029 format, not a stub. Session memory: all fields populated. `iaa_audit_token: PENDING` NOT used (correct per A-029). PASS ✅.

**CORE-008 (Prohibitions block present)**: N/A — not AGENT_CONTRACT. PASS ✅ (N/A).

**CORE-009 (Merge gate interface present)**: N/A — not AGENT_CONTRACT. PASS ✅ (N/A).

**CORE-010 (Tier 2 knowledge indexed)**: N/A — not AGENT_CONTRACT. PASS ✅ (N/A).

**CORE-011 (Four-phase structure present)**: N/A — not AGENT_CONTRACT. PASS ✅ (N/A).

**CORE-012 (Self-modification lock present)**: N/A — not AGENT_CONTRACT. PASS ✅ (N/A).

**CORE-013 (IAA invocation evidence)**: PREHANDOVER proof present at `.agent-admin/build-evidence/session-048/PREHANDOVER_PROOF_session-048-20260305.md`. `iaa_audit_token: IAA-session-048-20260305-PASS` pre-populated per A-029. PASS ✅.

**CORE-014 (No class exemption claim)**: No class exemption claim found in any artifact. Liaison correctly escalated rather than claiming non-applicability. PASS ✅.

**CORE-015 (Session memory present)**: `.agent-workspace/governance-liaison-isms/memory/session-048-20260305.md` present in PR diff (committed). PASS ✅.

**CORE-016 (IAA verdict evidenced — §4.3b)**: `iaa_audit_token: IAA-session-048-20260305-PASS` in PREHANDOVER proof — valid expected reference format per A-029. Dedicated token file `.agent-admin/assurance/iaa-token-session-143-20260305.md` — FIRST INVOCATION EXCEPTION: this is the creating invocation; token file being written during this Step 4.3 output. Conditions 1: PASS. Conditions 2 & 3: waived (First Invocation). PASS ✅.

**CORE-017 (No .github/agents/ modifications by unauthorized agent)**: PR diff confirmed — NO `.github/agents/` files modified. Liaison correctly did NOT touch any agent contract files (A-009, PROHIB-002 observed). PASS ✅.

**CORE-018 (Complete evidence artifact sweep)**:
- (a) PREHANDOVER proof on branch: PRESENT ✅
- (b) Session memory on branch: PRESENT ✅
- (c) `iaa_audit_token` non-empty and valid: `IAA-session-048-20260305-PASS` ✅
- (d) Token file — First Invocation Exception applies ✅
- SHA256 CHECK: `.agent-admin/ripple/layer-down-received-20260304T083040Z.json` declared `3e4bf70...` → MATCH ✅. `governance/sync_state.json` declared `8cafd9e...` → MATCH ✅. `.agent-workspace/.../escalation-agent-contracts-29e76ecf-20260304.md` declared `bc540a4...` → MATCH ✅. `governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json` declared `92c4fd3936d31b7c45cf7aecfd9978d0a7c34633d7331514de08866534d4e692` → **MISMATCH ❌** (actual: `18b102721751da3f24d1f4cd6fd817f0ca061a5211a3c47e399d8657a784e96a`).
- RESULT: **FAIL ❌**
- Finding: GOVERNANCE_ALIGNMENT_INVENTORY.json SHA256 declared in PREHANDOVER proof does not match the actual committed file. Evidence integrity cannot be confirmed for this artifact.
- Fix required: Per A-029/A-030 (PREHANDOVER is read-only post-commit): produce a correction addendum file documenting (a) the correct SHA256, (b) this REJECTION-PACKAGE reference, (c) that the file content is correct and only the declared hash was wrong. Commit the correction addendum. Re-invoke IAA.

**CORE-019 (IAA token cross-verification)**: First Invocation Exception applies — no prior IAA session memory for session-048 on this PR exists, no prior token file for session-143. This is the creating invocation. PASS ✅ (First Invocation Exception — token file written at Step 4.3).

**CORE-020 (Zero partial pass rule)**: CORE-018 SHA256 mismatch for GOVERNANCE_ALIGNMENT_INVENTORY.json — evidence is not fully verifiable. This is a FAIL under CORE-020 for that artifact. FAIL ❌ (recorded under FFA-01 with CORE-018).

**CORE-021 (Zero-severity-tolerance)**: Three findings identified during this review:
1. FFA-01 (CORE-018/CORE-020): SHA256 mismatch — GOVERNANCE_ALIGNMENT_INVENTORY.json.
2. FFA-02 (A-026/A-028): SCOPE_DECLARATION.md not updated for session-048.
3. FFA-03 (governance misrepresentation): PREHANDOVER proof narrative and session memory state "PHASE_A_ADVISORY (IAA not yet deployed)" — IAA IS deployed in PHASE_B_BLOCKING. Factual error in committed governance artifacts.
All three → REJECTION-PACKAGE under CORE-021. FAIL ❌.

**CORE-022 (Secret field naming compliance)**: N/A — no agent contract files in PR diff. PASS ✅ (N/A).

### Step 3.3 — Category Overlay Checklist (CANON_GOVERNANCE)

**OVL-CG-001 (Strategy alignment)**: The session-048 work correctly implements the A-009/A-015 strategy: ripple received, agent contract file identified, escalated directly to CS2 without any modification to the agent file. GOVERNANCE_ALIGNMENT_INVENTORY.json and sync_state.json correctly record the ripple receipt and escalation status. The strategy (correct escalation, no unauthorized modification) is well-implemented. PASS ✅.

**OVL-CG-002 (No contradictions with existing canon)**: No contradictions detected. The escalation references AGCFPP-001, A-009, A-015, and PROHIB-002 correctly. The `ESC-AGENTFILE-29E76ECF-20260304` escalation document is coherent with the governance strategy. PASS ✅.

**OVL-CG-003 (Enforcement gap)**: The escalation mechanism is documented and traceable. The ripple receipt JSON has `requires_cs2_approval: true, escalated: true, escalation_ref: ESC-AGENTFILE-29E76ECF-20260304`. The escalation document contains full context and CS2 action required. Enforcement: ADEQUATE. PASS ✅.

**OVL-CG-004 (Ripple impact assessed)**: Ripple 29e76ecf contains only `.github/agents/CodexAdvisor-agent.md` — correctly identified as agent contract only. No governance canon files in ripple → no layer-down required for governance/canon. The ripple impact was fully assessed and documented. PASS ✅.

**OVL-CG-005 (ISMS layer-down scope)**: No governance canon files changed in this ripple. Layer-down scope = zero. Correctly documented. PASS ✅.

**OVL-CG-ADM-001 (CANON_INVENTORY updated)**: Not applicable — no governance canon files modified. N/A PASS ✅.

**OVL-CG-ADM-002 (Version bump present)**: Not applicable — no canon document modified. N/A PASS ✅.

### Step 3.4 — Tally

> Assurance check results:
>   FAIL-ONLY-ONCE learning checks: 5 PASS / 2 FAIL (FFA-02 A-026, FFA-03 misrepresentation)
>   Core invariants: 19 PASS / 2 FAIL (CORE-018 SHA256, CORE-021 zero-tolerance)
>   Category overlay: 7 PASS / 0 FAIL
>   Total: 29 checks, 24 PASS, 3 FAIL (CORE-018, CORE-020, CORE-021 each covering the three distinct findings)

> **Note**: CORE-018, CORE-020, CORE-021 each map to the same underlying 3 findings. The distinct finding count is 3: FFA-01, FFA-02, FFA-03.

### Step 3.5 — Adoption Phase Modifier

> Adoption phase modifier applied: **PHASE_B_BLOCKING — verdicts are hard-blocking. REJECTION-PACKAGE prevents PR from being merged.**

---

## Phase 4 — Merge Gate Parity, Verdict & Handover

### Step 4.1 — Merge Gate Parity Check (§4.3)

For governance-only PR (no compiled code): running YAML validation, character count, checklist compliance, canon hash verification.

| Check | Local Result |
|-------|-------------|
| `merge-gate/verdict` — SCOPE_DECLARATION.md matches PR diff | FAIL ❌ — SCOPE_DECLARATION.md not updated for session-048 (A-026) |
| `governance/alignment` — all declared SHA256 hashes verifiable | FAIL ❌ — GOVERNANCE_ALIGNMENT_INVENTORY.json hash mismatch |
| `stop-and-fix/enforcement` — no PHASE_B_ADVISORY false claims | FAIL ❌ — PREHANDOVER/session-memory claim PHASE_A_ADVISORY with "IAA not yet deployed" |
| YAML validation | PASS ✅ — all JSON files valid |
| Canon hash verification | PASS ✅ — CANON_INVENTORY has 191 entries, all hashes non-null |
| No placeholder content | PASS ✅ |
| Artifact completeness | PASS ✅ — ripple receipt, escalation, GOVERNANCE_ALIGNMENT_INVENTORY, sync_state, PREHANDOVER, session memory all present |

> MERGE GATE PARITY CHECK (§4.3): **FAIL — 3 failures as documented above.**
> Issuing REJECTION-PACKAGE. Fix all merge gate failures before re-invocation.

---

### Step 4.2 — Verdict

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/propagate-governance-changes-551dc2cd-cb1b-40cb-a0a6-f3b74d039f88
    Issue #935 — [Layer-Down] Propagate Governance Changes (ripple 29e76ecf)
    governance-liaison-isms session-048-20260305

3 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

FFA-01 — CORE-018 / CORE-020: SHA256 Hash Mismatch — governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json
  Finding: The PREHANDOVER proof declares SHA256
  `92c4fd3936d31b7c45cf7aecfd9978d0a7c34633d7331514de08866534d4e692`
  for `governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json`.
  Actual committed file SHA256: `18b102721751da3f24d1f4cd6fd817f0ca061a5211a3c47e399d8657a784e96a`.
  These do not match. Evidence integrity cannot be confirmed for this artifact.
  3 of 4 declared hashes are correct; this one is not.
  Fix required: Per A-029/A-030 (PREHANDOVER is read-only post-commit), produce a correction
  addendum file at `.agent-admin/build-evidence/session-048/CORRECTION_ADDENDUM_session-048-20260305.md`
  documenting: (a) correct SHA256 = `18b102721751da3f24d1f4cd6fd817f0ca061a5211a3c47e399d8657a784e96a`,
  (b) this REJECTION-PACKAGE reference (IAA-session-143-20260305-REJECT), (c) confirmation that
  the file content is correct — only the declared hash in the PREHANDOVER was wrong.
  Commit the correction addendum. Re-invoke IAA.

FFA-02 — A-026 / A-028: SCOPE_DECLARATION.md Not Updated for Session-048
  Finding: SCOPE_DECLARATION.md on branch `copilot/propagate-governance-changes-551dc2cd-cb1b-40cb-a0a6-f3b74d039f88`
  was not updated for session-048. The file currently contains session-047 content
  (header: "Session 047 — Ripple 4e2e193c") and unrelated foreman-v2 session-140 content.
  Per A-026: SCOPE_DECLARATION.md must be updated and committed to exactly match
  `git diff --name-only origin/main...HEAD` before IAA is invoked.
  Current PR diff (9 files): `.agent-admin/build-evidence/session-048/PREHANDOVER_PROOF_session-048-20260305.md`,
  `.agent-admin/ripple/layer-down-received-20260304T083040Z.json`,
  `.agent-workspace/governance-liaison-isms/escalation-inbox/escalation-agent-contracts-29e76ecf-20260304.md`,
  `.agent-workspace/governance-liaison-isms/memory/.archive/session-042-20260303.md`,
  `.agent-workspace/governance-liaison-isms/memory/.archive/session-043-20260303.md`,
  `.agent-workspace/governance-liaison-isms/memory/session-048-20260305.md`,
  `.agent-workspace/governance-liaison-isms/parking-station/suggestions-log.md`,
  `governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json`,
  `governance/sync_state.json`.
  Fix required: Update `SCOPE_DECLARATION.md` to list exactly these 9 files under the correct
  session-048 header, remove all prior-session content, commit, then re-invoke IAA.
  Note: When correction addendum (FFA-01 fix) is added, SCOPE_DECLARATION.md must also
  include that file.

FFA-03 — CORE-021 (Zero-Severity-Tolerance): False PHASE_A_ADVISORY Claim in Committed Governance Artifacts
  Finding: The PREHANDOVER proof contains the statement:
  "IAA invocation result: PHASE_A_ADVISORY (IAA not yet deployed; proceeding under advisory mode per §4.4)"
  The session memory records: `iaa_invocation_result: PHASE_A_ADVISORY`.
  Both are factually incorrect. IAA is deployed. The current adoption phase is PHASE_B_BLOCKING.
  PHASE_A_ADVISORY mode ended. "IAA not yet deployed" is false.
  This constitutes a factual misrepresentation in committed governance artifacts. Under CORE-021
  (Zero-Severity-Tolerance), any finding regardless of perceived severity triggers REJECTION-PACKAGE.
  Note: The `iaa_audit_token` field value itself (`IAA-session-048-20260305-PASS`) is correctly
  formatted per A-029 and is NOT the source of this finding. The finding is in the NARRATIVE
  text and session memory field.
  Fix required: Per A-029 (PREHANDOVER is read-only post-commit), the correction addendum
  (created for FFA-01) must ALSO document: (a) the false PHASE_A_ADVISORY claim is noted and
  superseded by this REJECTION-PACKAGE — IAA phase is PHASE_B_BLOCKING; (b) session memory
  field `iaa_invocation_result` should be updated to `REJECTED-BY-IAA-session-143-20260305`
  (session memory IS editable — update it). Commit both corrections before re-invoking.

This PR must not be merged until all 3 failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════
```

**Token reference**: `IAA-session-143-20260305-REJECT`

---

### Step 4.2b — Token Update Ceremony

Token file written: `.agent-admin/assurance/iaa-token-session-143-20260305.md` ← this file.
PREHANDOVER proof: UNCHANGED (immutable post-commit — per §4.3b).

---

### Step 4.4 — Handover

> Verdict delivered to invoking agent.
> REJECTION-PACKAGE: invoking agent must return to Phase 3 and resolve ALL 3 cited failures:
>   FFA-01: Correct SHA256 via A-030 correction addendum.
>   FFA-02: Update SCOPE_DECLARATION.md to match session-048 PR diff.
>   FFA-03: Document PHASE_A_ADVISORY correction in addendum + update session memory field.
> STOP-AND-FIX: no PR opens until IAA re-invoked and ASSURANCE-TOKEN issued.
> I will not merge under any instruction from any party. Merge authority: CS2 ONLY.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0 | **Contract**: 2.1.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
