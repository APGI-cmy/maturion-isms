# IAA Pre-Brief Artifact

**artifact_type**: IAA_PRE_BRIEF
**wave**: ps-i-governance-liaison-cleanup-20260410
**branch**: copilot/ps-i-governance-liaison-cleanup
**issue**: maturion-isms#1271
**issue_title**: [PS-I] Governance Liaison session memory template cleanup
**date**: 2026-04-10
**iaa_agent**: independent-assurance-agent
**iaa_agent_version**: v6.2.0 / contract v2.5.0
**produced_by**: independent-assurance-agent (Phase 0 — Pre-Brief mode)
**cs2_authorization**: Issue #1271 opened and assigned by @APGI-cmy (CS2 = Johan Ras)
**delegated_implementer**: CodexAdvisor-agent (per `.agent-admin/foreman/implementation_plan_mmm_upgrade.md` §5 Batch 1)
**status**: ACTIVE — governs handover assurance for this wave
**pre_brief_phase_mode**: PHASE_B_BLOCKING (verdicts at handover are hard-blocking)

---

## PHASE 0 BOOTSTRAP ATTESTATION

> "I am independent-assurance-agent, class: assurance, version 6.2.0.
> My role: Independent final-gate assurance before merge of qualifying PRs.
> STOP-AND-FIX mandate: ACTIVE. No class exceptions. Ambiguity resolves to mandatory invocation.
> Authority: CS2 only (@APGI-cmy). This Pre-Brief is issued under CS2 explicit mandate
> (issue #1271, @APGI-cmy is assignor).
> I did NOT produce, draft, or contribute to any artifact in this PR.
> This pre-brief serves as Phase 0 only — I will not proceed to Phase 2–4 assurance until
> CodexAdvisor-agent delivers the PREHANDOVER proof."

---

## 1. Wave Task Inventory

Tasks declared for this wave per `wave-current-tasks.md` (wave: ps-i-governance-liaison-cleanup-20260410):

| Task ID | Target File | Change | Nature |
|---------|------------|--------|--------|
| PS-I-01 | `.agent-workspace/governance-liaison-isms/knowledge/session-memory-template.md` | Remove `iaa_invocation_result:` field entirely | Knowledge template cleanup |
| PS-I-02 | `.github/agents/governance-liaison-isms-agent.md` | Update `advisory_phase: PHASE_A_ADVISORY` → `PHASE_B_BLOCKING` | Agent contract correction |
| PS-I-03 | `.agent-workspace/governance-liaison-isms/knowledge/session-memory-template.md` | Add mandatory pre-IAA commit gate section | Knowledge template addition |
| PS-I-04 | `.agent-workspace/governance-liaison-isms/knowledge/session-memory-template.md` | Add SCOPE_DECLARATION fresh-overwrite instruction (`cat /dev/null > SCOPE_DECLARATION.md`) | Knowledge template addition |
| T5 | Wave closure gate | QP evaluation PASS + PREHANDOVER proof committed + SCOPE_DECLARATION PASS | Ceremony |
| T6 | Final gate | IAA full assurance PASS | Ceremony |

---

## 2. IAA Trigger Category Classification

**Classification Decision Flow (per `iaa-trigger-table.md` v2.4.0):**

```
Step 1: .github/agents/ or governance/agents/ changes?
  → YES — PS-I-02 modifies .github/agents/governance-liaison-isms-agent.md
  → PARTIAL trigger: AGENT_CONTRACT for PS-I-02

Step 2: governance/canon/ or CANON_INVENTORY.json changes? → NO

Step 3: .github/workflows/ changes? → NO

Step 4: AAWP/MAT deliverable artifacts? → NO

Step 5: governance/quality/agent-integrity/ changes? → NO

Step 6: .agent-workspace/*/knowledge/ file changes?
  → YES — PS-I-01, PS-I-03, PS-I-04 modify
           .agent-workspace/governance-liaison-isms/knowledge/session-memory-template.md
  → PARTIAL trigger: KNOWLEDGE_GOVERNANCE for PS-I-01, PS-I-03, PS-I-04

Step 7 (LIAISON_ADMIN): .agent-workspace/governance-liaison-isms-agent/ file changes,
  OR liaison session memory or knowledge files?
  → YES (per "liaison knowledge files" condition) — session-memory-template.md is a liaison
     knowledge file. However: trigger table path specifies
     ".agent-workspace/governance-liaison-isms-agent/" (with -agent suffix), while the actual
     workspace path is ".agent-workspace/governance-liaison-isms/" (without -agent suffix).
     PATH DISCREPANCY DETECTED — see SB-003 below. Per AMBIGUITY RULE: ambiguity resolves
     to mandatory. LIAISON_ADMIN overlay applies.
  → PARTIAL trigger: LIAISON_ADMIN (ambiguity-resolved) for PS-I-01, PS-I-03, PS-I-04

Steps 8–10: Not applicable.

Step 11: Is PR clearly and unambiguously doc-only, parking-station, or admin? → NO

RESULT: Multiple triggering categories → Category = MIXED. IAA = MANDATORY.
```

| Task ID | Primary Trigger Category | IAA Required? | Rationale |
|---------|--------------------------|---------------|-----------|
| PS-I-01 | KNOWLEDGE_GOVERNANCE | MANDATORY | Modifies `.agent-workspace/*/knowledge/` file; also LIAISON_ADMIN (ambiguity-resolved) |
| PS-I-02 | AGENT_CONTRACT | MANDATORY | Modifies `.github/agents/governance-liaison-isms-agent.md`; FAIL-ONLY-ONCE A-002, A-005 |
| PS-I-03 | KNOWLEDGE_GOVERNANCE | MANDATORY | Same target file as PS-I-01 |
| PS-I-04 | KNOWLEDGE_GOVERNANCE | MANDATORY | Same target file as PS-I-01 |

**Overall PR Classification**: **MIXED (AGENT_CONTRACT + KNOWLEDGE_GOVERNANCE + LIAISON_ADMIN)**
**IAA Triggered at Handover**: **YES — MANDATORY**
**Ambiguity**: NONE on IAA requirement — all tasks are triggering. Ambiguity on LIAISON_ADMIN
exact path → resolved to MANDATORY per AMBIGUITY RULE (A-003).

**AGCFPP-001 gate**: PS-I-02 modifies `.github/agents/governance-liaison-isms-agent.md`.
AGCFPP-001 §3–§4 mandates CodexAdvisor + IAA audit for all such changes.
Producing agent MUST be CodexAdvisor-agent (A-005). CS2 authorization: issue #1271.

---

## 3. Ceremony-Admin Appointment Check

Reviewing `wave-current-tasks.md` for `ceremony_admin_appointed` field:
**→ NO `ceremony_admin_appointed` field present in wave-current-tasks.md.**
No `execution-ceremony-admin-agent` appointed for this wave. ECAP three-role split check: N/A at handover.

---

## 4. Anti-Regression Obligations (Step 0.3b)

Reviewing prior session learning_notes and FAIL-ONLY-ONCE.md for patterns relevant to this wave:

### 4.1 Known Recurring Failure Patterns Applicable to This Wave

| Pattern | Rule | Relevance to PS-I |
|---------|------|-------------------|
| Agent contract modification without CS2 authorization evidence | A-005 | PS-I-02 modifies `.github/agents/` — CodexAdvisor must be the producing agent AND CS2 authorization must be cited in PREHANDOVER proof |
| PREHANDOVER committed after invocation (not before) | A-021 | All artifacts must be git-committed BEFORE CodexAdvisor invokes IAA at T6 |
| SCOPE_DECLARATION mismatch | A-026 | All four PS-I change files plus all ceremony artifacts must be declared in SCOPE_DECLARATION |
| Tier 2 knowledge patches without full PREHANDOVER ceremony | A-015 | PS-I-01/03/04 are Tier 2 knowledge patches — full ceremony required, no content-type exemption |
| iaa_audit_token: PENDING in PREHANDOVER proof | A-029 | PREHANDOVER proof `iaa_audit_token` must be pre-populated with expected reference at commit time; PENDING = hard violation |
| Artifact verified from disk only, not git | A-033 | IAA will use `git ls-tree HEAD` / `git show HEAD:<path>` for all existence checks — not `-f` |

### 4.2 Anti-Regression Obligations for CodexAdvisor-agent

1. **A-005 obligation**: Document CS2 authorization (issue #1271 + @APGI-cmy) explicitly in the
   PREHANDOVER proof under `cs2_authorization:` before making any commit touching
   `.github/agents/governance-liaison-isms-agent.md`.

2. **A-021 obligation**: Run `git status` before invoking IAA. Working tree must be clean.
   All four target files + PREHANDOVER proof + session memory + SCOPE_DECLARATION must be
   in git-committed state (`git ls-files --error-unmatch <path>` must pass for each).

3. **A-026/A-028 obligation**: SCOPE_DECLARATION.md must be overwritten fresh (per PS-I-04's
   own instruction) and must declare EVERY file in `git diff --name-only origin/main...HEAD`.
   No undeclared files permitted unless A-031 carve-out note is present.

4. **A-029 obligation**: `iaa_audit_token:` in PREHANDOVER proof must be pre-populated as
   `IAA-session-NNN-ps-i-governance-liaison-cleanup-20260410-PASS` at commit time.
   Do NOT use `PENDING`. PREHANDOVER proof is immutable post-commit.

5. **A-033 obligation**: IAA will verify all artifacts using git commands only.
   Ensure every file is committed AND pushed to the remote branch before invoking IAA.

### 4.3 What Must Be Mechanically Verified Before Phase 2–4 Proceeds

At handover invocation, IAA will mechanically verify:
- `git ls-tree -r HEAD | grep session-memory-template.md` → PASS
- `git ls-tree -r HEAD | grep governance-liaison-isms-agent.md` → PASS
- `git ls-tree -r HEAD | grep PREHANDOVER` → PASS
- `git ls-tree -r HEAD | grep session-NNN` (session memory) → PASS
- `grep -n "iaa_invocation_result" .agent-workspace/governance-liaison-isms/knowledge/session-memory-template.md` → returns nothing (field removed)
- `grep -n "PHASE_B_BLOCKING" .github/agents/governance-liaison-isms-agent.md` → returns advisory_phase line
- `grep -n "iaa_audit_token" PREHANDOVER*.md` → returns pre-populated value (not PENDING)

---

## 5. FFA (Full Functional Assurance) Checks at Handover

### 5.1 FAIL-ONLY-ONCE Rules Active for This Wave

| Rule ID | Rule Name | Application to PS-I |
|---------|----------|---------------------|
| A-001 | IAA invocation evidence must be present | PREHANDOVER proof + IAA token file required |
| A-002 | IAA mandatory — no class exceptions | PS-I-02 is AGENT_CONTRACT; no class exemption permitted |
| A-003 | Ambiguity resolves to mandatory invocation | LIAISON_ADMIN path ambiguity resolved to MANDATORY |
| A-005 | Agent contract immutability — only CodexAdvisor may touch `.github/agents/` | **DIRECTLY APPLIES** — PS-I-02. Producing agent must be CodexAdvisor-agent. CS2 authorization must be documented. |
| A-015 | Tier 2 knowledge patches require full PREHANDOVER ceremony | **DIRECTLY APPLIES** — PS-I-01/03/04 modify Tier 2 knowledge file |
| A-021 | Commit before IAA invocation (working tree clean) | All artifacts committed before T6 IAA invocation |
| A-022 | Re-evaluate trigger categories on every IAA invocation | IAA will re-evaluate at handover invocation |
| A-026 | SCOPE_DECLARATION must match PR diff exactly | SCOPE_DECLARATION must declare all changed files |
| A-029 | §4.3b Artifact immutability — PREHANDOVER proof read-only post-commit | `iaa_audit_token` pre-populated; NOT editable post-commit |
| A-033 | CORE-018 verification must use `git ls-tree HEAD`, not disk `-f` | IAA will use git verification for all artifact existence checks |

### 5.2 Change-Specific Functional Checks (FFA-CFC)

These are the substance checks IAA will execute during Phase 3 for each declared change.

#### FFA-CFC-001 — PS-I-01: `iaa_invocation_result:` Field Removal

| Sub-Check | What IAA Will Verify |
|-----------|---------------------|
| FFA-CFC-001a | Field is absent from `session-memory-template.md` — `grep -n "iaa_invocation_result" .agent-workspace/governance-liaison-isms/knowledge/session-memory-template.md` returns zero results. Any residual occurrence = REJECTION-PACKAGE. |
| FFA-CFC-001b | Consistency with agent contract: The governance-liaison-isms-agent.md at line 685 (approximately) still documents `iaa_invocation_result:` as a required session memory field. IAA WILL CHECK whether this reference in the agent contract has been updated (removed or changed) as part of PS-I-02. If the template removes the field but the agent contract still mandates it, this is an internal inconsistency = REJECTION-PACKAGE. See SB-001 below. |
| FFA-CFC-001c | No other occurrence in the session memory template body — entire template scanned, not just the Required Fields section. |

#### FFA-CFC-002 — PS-I-02: `advisory_phase` Upgrade

| Sub-Check | What IAA Will Verify |
|-----------|---------------------|
| FFA-CFC-002a | `advisory_phase: PHASE_B_BLOCKING` is present in the YAML block of `.github/agents/governance-liaison-isms-agent.md`. The old value `PHASE_A_ADVISORY` must not appear as the active `advisory_phase:` setting. |
| FFA-CFC-002b | PHASE_A_ADVISORY fallback behavior guidance (lines ~768–776 of current contract) — IAA will assess whether these remain valid as "legacy fallback path" instructions now that Phase B is active, OR whether they require updating/removal. Guidance that describes `PHASE_A_ADVISORY` as the normal operating path is misleading in Phase B. See SB-002. |
| FFA-CFC-002c | No contradiction with merge_gate_interface `parity_enforcement: BLOCKING` — the Phase B upgrade must be consistent with the already-declared BLOCKING parity enforcement. No contradictions between YAML fields. |
| FFA-CFC-002d | CS2 authorization for agent contract modification explicitly stated in PREHANDOVER proof (A-005 requirement). |

#### FFA-CFC-003 — PS-I-03: Mandatory Pre-IAA Commit Gate Section

| Sub-Check | What IAA Will Verify |
|-----------|---------------------|
| FFA-CFC-003a | A new section titled (or substantively equivalent to) "Pre-IAA Commit Gate" or "Mandatory Pre-IAA Commit Checklist" is present in `session-memory-template.md`. |
| FFA-CFC-003b | The section content is operational — it instructs the governance-liaison-isms agent to commit all artifacts before invoking IAA. It must not be a stub or placeholder. Any `TODO`, `TBD`, or `[placeholder]` = REJECTION-PACKAGE (CORE-007). |
| FFA-CFC-003c | The section aligns with A-021 (commit before invoke) as the canonical anti-pattern it is implementing. References to the working tree clean requirement are strongly preferred. |
| FFA-CFC-003d | The section does not re-introduce `iaa_invocation_result:` field in any form. PS-I-01 and PS-I-03 must be net-consistent in the final file state. |

#### FFA-CFC-004 — PS-I-04: SCOPE_DECLARATION Fresh-Overwrite Instruction

| Sub-Check | What IAA Will Verify |
|-----------|---------------------|
| FFA-CFC-004a | An instruction is present in `session-memory-template.md` directing the governance-liaison-isms agent to run `cat /dev/null > SCOPE_DECLARATION.md` (or substantively equivalent fresh-overwrite command) as part of its handover workflow. |
| FFA-CFC-004b | The instruction is placed in a logical location within the template — before the PREHANDOVER commit step, not after (sequence matters for A-026 compliance). |
| FFA-CFC-004c | The instruction does not conflict with or duplicate existing SCOPE_DECLARATION guidance that may already exist in the template or agent contract. If prior guidance exists, the new instruction must be consolidated or the prior guidance updated. Duplication = flag per OVL-KG-003. |
| FFA-CFC-004d | The SCOPE_DECLARATION instruction is consistent with A-028 (SCOPE_DECLARATION format compliance) and A-026 (must match PR diff). The instruction should guide the agent to declare ALL files changed in the wave, not just a subset. |

### 5.3 Core Invariants Applicable at Handover

| Check ID | Check Name | Applicability |
|----------|-----------|---------------|
| CORE-005 | Governance block present | PR body must include `## Governance` block |
| CORE-006 | CANON_INVENTORY alignment | If `session-memory-template.md` or `governance-liaison-isms-agent.md` are listed in CANON_INVENTORY.json, their hashes must be updated |
| CORE-007 | No placeholder content | New template sections must have zero stubs, TODO, TBD, or placeholders |
| CORE-013 | IAA invocation evidence | PREHANDOVER proof and/or IAA token file must reference this invocation |
| CORE-014 | No class exemption claim | Not an issue here (CS2 authorized); noted for completeness |
| CORE-015 | Session memory present | CodexAdvisor session memory must be in PR bundle |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated IAA token file at `.agent-admin/assurance/iaa-token-session-NNN-ps-i-*.md` |
| CORE-018 | Complete evidence artifact sweep | All evidence artifacts git-committed (A-033) |
| CORE-019 | IAA token cross-verification | First invocation exception applies — token created during IAA's Phase 4 |
| CORE-020 | Zero partial pass | No assumed passes |
| CORE-021 | Zero-severity-tolerance | Any finding drives REJECTION-PACKAGE |
| CORE-024 | PHASE_B_BLOCKING_TOKEN non-empty | Token file must contain non-empty, non-PENDING `PHASE_B_BLOCKING_TOKEN:` value |

### 5.4 Applicable Overlays at Handover

IAA will apply the following overlay layers during Phase 3 assurance:

| Layer | Overlay | Checks |
|-------|---------|--------|
| Universal Ceremony Gate | CERT-001 through CERT-004 | PREHANDOVER proof, session memory, FFA attestation, iaa_audit_token field |
| AGENT_CONTRACT | OVL-AC-001 through OVL-AC-007 (substance) + OVL-AC-ADM-001–004 (admin) | Strategy alignment, authority boundaries, self-mod prohibition, ripple impact, PREHANDOVER, session memory, Tier 2 stub, character count |
| KNOWLEDGE_GOVERNANCE | OVL-KG-001 through OVL-KG-004 (substance) + OVL-KG-ADM-001–003 (admin) | Rule clarity, incident grounding, no duplication, cross-reference validity; version bump, index.md update |
| LIAISON_ADMIN | As applicable per LIAISON_ADMIN overlay (ambiguity-resolved) | Liaison-specific governance compliance |
| PRE_BRIEF_ASSURANCE | OVL-INJ-001, OVL-INJ-ADM-001–003 | Pre-Brief artifact existence and non-empty, references correct wave |

**IAA_AGENT_CONTRACT_AUDIT_STANDARD.md applies**: PS-I-02 is an AGENT_CONTRACT change.
IAA will execute AC-01 through AC-07 as the organising framework for the contract review.

### 5.5 Version and Index Checks (FFA-VIC)

| Check ID | Description | What IAA Will Verify |
|----------|-------------|---------------------|
| FFA-VIC-001 | `session-memory-template.md` version bumped | Template version header must be incremented from 1.1.0 (e.g., → 1.2.0). If version is unchanged = REJECTION-PACKAGE (OVL-KG-ADM-002). |
| FFA-VIC-002 | `governance-liaison-isms/knowledge/index.md` updated | The index.md for governance-liaison-isms agent must reflect the new version of `session-memory-template.md`. Version mismatch between file header and index = REJECTION-PACKAGE. |
| FFA-VIC-003 | Version history entry in `session-memory-template.md` | A version history entry (e.g., v1.2.0) must be present in the file summarising the PS-I changes. |
| FFA-VIC-004 | Agent contract version bumped | `governance-liaison-isms-agent.md` must have a version number increment reflecting the advisory_phase change. Unchanged version = flag per OVL-AC-007 ripple check. |

### 5.6 Ceremony Checks (FFA-CER)

| Check ID | Description | What IAA Will Verify |
|----------|-------------|---------------------|
| FFA-CER-001 | PREHANDOVER proof present (CERT-001) | A file matching `PREHANDOVER*ps-i*` or `PREHANDOVER*governance-liaison*` or equivalent committed to branch. `git ls-tree -r HEAD | grep PREHANDOVER` must return at least one result. |
| FFA-CER-002 | Session memory present (CERT-002) | CodexAdvisor session memory file committed to branch. `git ls-tree -r HEAD | grep session-` must return the CodexAdvisor session file. |
| FFA-CER-003 | FFA attestation declared (CERT-003) | Session memory preamble declares `fail_only_once_attested: true`. |
| FFA-CER-004 | `iaa_audit_token` pre-populated (CERT-004 + A-029) | PREHANDOVER proof contains `iaa_audit_token:` field with expected reference `IAA-session-NNN-ps-i-governance-liaison-cleanup-20260410-PASS` (not PENDING, not blank). |
| FFA-CER-005 | `wave-current-tasks.md` reflects PS-I completion | Foreman's `wave-current-tasks.md` updated — tasks T1–T4 marked `[x]` before T6 IAA invocation. |
| FFA-CER-006 | Pre-Brief artifact committed first (OVL-INJ-001) | THIS artifact (`.agent-admin/assurance/iaa-prebrief-ps-i-governance-liaison-cleanup-20260410.md`) must be committed to the branch BEFORE any PS-I-01 through PS-I-04 file changes. IAA will verify commit order via branch history. |
| FFA-CER-007 | SCOPE_DECLARATION.md present and complete | SCOPE_DECLARATION.md committed to branch declaring all files in `git diff --name-only origin/main...HEAD`. IAA will cross-check against actual diff. |

### 5.7 Governance Ceremony Gate Checks (FFA-GCG)

The `governance-ceremony-gate.yml` workflow covers `.agent-workspace/*/knowledge/*.md` paths and `.github/agents/*.md`.

| Check ID | Description | Requirement |
|----------|-------------|-------------|
| FFA-GCG-001 | Not draft PR | PR must be in non-draft state at handover invocation |
| FFA-GCG-002 | PREHANDOVER proof + IAA token | PREHANDOVER proof present; `iaa_audit_token` non-PENDING; dedicated IAA token file at `.agent-admin/assurance/iaa-token-session-NNN-ps-i-YYYYMMDD.md` present (§4.3b architecture). |
| FFA-GCG-003 | PR body governance block | PR body must contain `## Governance` block with: `IAA Category: MIXED (AGENT_CONTRACT + KNOWLEDGE_GOVERNANCE)`, `IAA Audit Token: IAA-session-NNN-YYYYMMDD-PASS`, `PREHANDOVER Proof: <path>` |
| FFA-GCG-004 | PHASE_B_BLOCKING_TOKEN field | Dedicated IAA token file must contain `PHASE_B_BLOCKING_TOKEN:` with non-empty, non-PENDING value (CORE-024 / A-037). |

---

## 6. PREHANDOVER Structure Requirements

CodexAdvisor-agent MUST produce a PREHANDOVER proof file. Recommended path:
```
PREHANDOVER-codexadvisor-session-NNN-ps-i-governance-liaison-cleanup-20260410.md
```
(committed to branch root or `.agent-admin/`)

**Required PREHANDOVER proof sections:**

| Section | Required Content | Governing Rule |
|---------|-----------------|----------------|
| `session_id` | Canonical session number (NNN format) | Standard |
| `wave` | `ps-i-governance-liaison-cleanup-20260410` | A-028 |
| `issue` | `maturion-isms#1271` | Standard |
| `date` | Actual execution date | Standard |
| `iaa_audit_token` | Pre-populated: `IAA-session-NNN-ps-i-governance-liaison-cleanup-20260410-PASS` | A-029 — NOT PENDING, NOT editable post-commit |
| `cs2_authorization` | Reference to issue #1271 and @APGI-cmy explicit authorization for `.github/agents/` modification | A-005, CORE-017 |
| `producing_agent` | `CodexAdvisor-agent` | A-005 |
| `scope_declaration` | Exact list of all files changed: `session-memory-template.md`, `governance-liaison-isms-agent.md`, `index.md` (if updated), `wave-current-tasks.md` | A-026, A-028 |
| `tasks_completed` | PS-I-01 through PS-I-04 with file paths and before/after change descriptions | A-026 |
| `fail_only_once_attested` | `true` + list of rules applied (minimum: A-001, A-005, A-015, A-021, A-026, A-029, A-033) | CERT-003 |
| `session_memory_path` | Path to committed CodexAdvisor session memory file | CORE-015 |
| `pre_brief_artifact` | `.agent-admin/assurance/iaa-prebrief-ps-i-governance-liaison-cleanup-20260410.md` | OVL-INJ-001 |
| `iaa_token_file_path` | Expected: `.agent-admin/assurance/iaa-token-session-NNN-ps-i-governance-liaison-cleanup-20260410.md` | §4.3b architecture |
| `§4.3 merge_gate_parity` | Local governance checks: markdown lint on modified files, no-placeholder verification, version bump confirmed, index.md updated | A-018 §4.3-EXECUTE-BEFORE-PR |

**IAA token file (written by IAA at Phase 4 — NOT by CodexAdvisor):**
```
.agent-admin/assurance/iaa-token-session-NNN-ps-i-governance-liaison-cleanup-20260410.md
```
Must contain: `PHASE_B_BLOCKING_TOKEN: IAA-session-NNN-ps-i-governance-liaison-cleanup-20260410-PASS`

### Prohibited PREHANDOVER Content

- `iaa_audit_token: PENDING` — hard violation of A-029
- `iaa_audit_token: PHASE_A_ADVISORY` — hard violation (PHASE_B_BLOCKING is active)
- Any self-certification that IAA assurance was obtained without actually invoking IAA
- Retroactive pre-brief (pre-brief committed AFTER file changes — pre-brief must precede all PS-I file commits)

---

## 7. Scope Blockers

### ⚠️ SB-001 (BLOCKING — Must Be Resolved in PR): `iaa_invocation_result:` Consistency

**Issue**: PS-I-01 removes `iaa_invocation_result:` from `session-memory-template.md`. However,
`.github/agents/governance-liaison-isms-agent.md` at approximately line 685 still documents this
field as a required session memory field:
```
- `iaa_invocation_result: [ASSURANCE-TOKEN / REJECTION-PACKAGE / NOT_REQUIRED / PHASE_A_ADVISORY]`
```
If PS-I-01 removes the field from the template but PS-I-02 does not also remove or update this
documentation in the agent contract, the agent contract will mandate a field the template no longer
provides. This is an internal inconsistency that IAA WILL fail under OVL-AC-002 (no contradictions)
and OVL-KG-001 (rule clarity).

**Required resolution**: CodexAdvisor MUST scope PS-I-02 to also remove or update the
`iaa_invocation_result:` documentation at line ~685 of the agent contract, or provide explicit
justification for why the template removal and agent contract retention are intentionally
inconsistent (e.g., the agent contract documents historical context, not current template).

**Blocker status**: BLOCKING — IAA will issue REJECTION-PACKAGE if inconsistency remains.
CodexAdvisor must resolve this in the same PR as PS-I-01 and PS-I-02.

---

### ⚠️ SB-002 (ADVISORY — Must Be Addressed, Not Necessarily Removed): PHASE_A_ADVISORY Runtime Guidance

**Issue**: `.github/agents/governance-liaison-isms-agent.md` at approximately lines 768–776 contains
runtime guidance describing what to do "If IAA is not yet deployed (Phase A advisory)":
```
"IAA not yet deployed (Phase A). Logging invocation attempt. Proceeding under advisory mode.
IAA phase status: PHASE_A_ADVISORY. This PR is flagged for IAA review once Phase B activates."
```
After PS-I-02 sets `advisory_phase: PHASE_B_BLOCKING`, this guidance describes a path that should
never be taken under normal operations. The governance-liaison-isms agent reading this in Phase B
may be confused about whether advisory mode is still available.

**Required resolution**: CodexAdvisor must either:
(a) Update this section to read "PHASE_A_ADVISORY fallback — this path is NOT available in
    Phase B. If IAA tool call fails, escalate to CS2 immediately. Do not proceed under advisory." OR
(b) Remove the advisory path description entirely, replacing it with Phase B failure handling only.

The section at lines ~768–776 must be consistent with `advisory_phase: PHASE_B_BLOCKING`.
IAA will check for this under OVL-AC-002 (no contradictions) at handover.

**Blocker status**: ADVISORY — does not block wave start, but must be resolved before
ASSURANCE-TOKEN is issued. IAA will fail OVL-AC-002 if the contradiction remains.

---

### ⚠️ SB-003 (ADVISORY — Documentation): LIAISON_ADMIN Path Discrepancy in Trigger Table

**Issue**: `iaa-trigger-table.md` v2.4.0 defines LIAISON_ADMIN as triggering on:
"Any `.agent-workspace/governance-liaison-isms-agent/` file created or modified"
(path suffix: `-agent`).

The actual workspace path for this agent is:
`.agent-workspace/governance-liaison-isms/` (no `-agent` suffix).

This discrepancy means the path-based LIAISON_ADMIN trigger may not fire correctly for this
agent's workspace in an automated scan. The trigger table was added in PS-F (v2.4.0) and this
discrepancy is pre-existing — not introduced by PS-I.

**Impact on this wave**: IAA has resolved the ambiguity to MANDATORY (per AMBIGUITY RULE A-003).
The LIAISON_ADMIN overlay will still be applied at handover. No additional action required
from CodexAdvisor for THIS wave.

**Recommended upstream fix**: The trigger table should be corrected to either:
(a) Use `.agent-workspace/governance-liaison-isms/` (actual path) OR
(b) Use `.agent-workspace/governance-liaison-isms*/` (wildcard matching both patterns)
This is recommended as a separate Tier 2 knowledge patch in a future PS wave.

**Blocker status**: ADVISORY — does not block this wave. Noted for follow-on governance action.
IAA will park a suggestion for trigger table path correction.

---

### ✅ SB-004 (CLEARED): Independence Requirement

**Issue**: Could IAA have contributed to the PS-I changes being reviewed?

**Verification**: PS-I is a new wave. The target files (`session-memory-template.md` and
`governance-liaison-isms-agent.md`) have not been touched by IAA in any prior session.
IAA's write paths are `.agent-workspace/independent-assurance-agent/` and `.agent-admin/assurance/`
only — IAA does NOT write to `.agent-workspace/governance-liaison-isms/` or `.github/agents/`.

**Status**: CLEARED — No independence violation. IAA did not contribute to PS-I artifacts.

---

### ✅ SB-005 (CLEARED): CS2 Authorization

**Issue**: Is this wave CS2-authorized?

**Verification**: Issue #1271 opened and assigned by @APGI-cmy (Johan Ras = CS2).
The PS-I wave is part of the CS2-approved MMM Pre-Implementation Upgrade strategy per
`.agent-admin/foreman/implementation_plan_mmm_upgrade.md` §5 Batch 1.
PS-B (FAIL-ONLY-ONCE v4.2.0) and PS-F (IAA trigger table) confirmed as already completed.

**Status**: CLEARED — CS2 authorization confirmed.

---

### ✅ SB-006 (CLEARED): Producing Agent Eligibility

**Issue**: Is CodexAdvisor-agent authorized to modify `.github/agents/governance-liaison-isms-agent.md`?

**Verification**: Per A-005 and AGCFPP-001 §3–§4, only CodexAdvisor-agent may modify
`.github/agents/` files when explicitly authorized by CS2. CodexAdvisor-agent is the declared
implementing agent per the MMM Pre-Implementation Upgrade plan. CS2 authorization is issue #1271.

**Status**: CLEARED — CodexAdvisor-agent is the authorized producer. CS2 authorization present.

---

## 8. Evidence Bundle Requirements at Handover Invocation

CodexAdvisor-agent MUST commit ALL of the following to the branch BEFORE invoking IAA at T6 (A-021):

| Artifact | Path | Required State |
|----------|------|---------------|
| Updated session memory template | `.agent-workspace/governance-liaison-isms/knowledge/session-memory-template.md` | No `iaa_invocation_result:` field; pre-IAA commit gate section present; SCOPE_DECLARATION fresh-overwrite instruction present; version header bumped; no placeholders |
| Updated agent contract | `.github/agents/governance-liaison-isms-agent.md` | `advisory_phase: PHASE_B_BLOCKING`; PHASE_A_ADVISORY runtime guidance updated (SB-002); `iaa_invocation_result:` reference at ~line 685 removed/updated (SB-001); version bumped |
| Updated knowledge index | `.agent-workspace/governance-liaison-isms/knowledge/index.md` | `session-memory-template.md` version updated to match new header version |
| PREHANDOVER proof | Root or `.agent-admin/` | Non-empty; `iaa_audit_token` pre-populated; all required sections present |
| CodexAdvisor session memory | `.agent-workspace/codexadvisor-agent/memory/session-NNN-YYYYMMDD.md` | Non-empty; `fail_only_once_attested: true` |
| SCOPE_DECLARATION.md | Root | Declares ALL files in `git diff --name-only origin/main...HEAD` |
| wave-current-tasks.md | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Tasks T1–T4 marked `[x]` |
| This Pre-Brief | `.agent-admin/assurance/iaa-prebrief-ps-i-governance-liaison-cleanup-20260410.md` | **THIS FILE — must be git-committed BEFORE any PS-I file changes** |

**Verification method**: IAA will use `git ls-tree -r HEAD` or `git ls-files --error-unmatch`
for all artifact existence checks (A-033). Disk-only files will not satisfy CORE-018.

---

## 9. IAA Invocation Instruction (for CodexAdvisor-agent at T6)

After completing all PS-I-01 through PS-I-04 changes and committing the full evidence bundle:

```
task(
  agent_type: "independent-assurance-agent",
  name: "iaa-ps-i-governance-liaison-cleanup",
  prompt: "Invoke IAA for full assurance review of PR on branch
    copilot/ps-i-governance-liaison-cleanup (issue maturion-isms#1271).
    PR category: MIXED (AGENT_CONTRACT + KNOWLEDGE_GOVERNANCE).
    Pre-Brief artifact:
      .agent-admin/assurance/iaa-prebrief-ps-i-governance-liaison-cleanup-20260410.md
    Deliverables:
      - PS-I-01: iaa_invocation_result field removed from session-memory-template.md
      - PS-I-02: advisory_phase PHASE_A_ADVISORY → PHASE_B_BLOCKING in agent contract
      - PS-I-03: Pre-IAA commit gate section added to session-memory-template.md
      - PS-I-04: SCOPE_DECLARATION fresh-overwrite instruction added to session-memory-template.md
    PREHANDOVER proof: [insert path at time of invocation]
    Session memory: [insert path at time of invocation]"
)
```

---

## 10. Summary

| Item | Value |
|------|-------|
| Wave | ps-i-governance-liaison-cleanup-20260410 |
| Issue | maturion-isms#1271 |
| Producing Agent | CodexAdvisor-agent |
| Trigger Categories | MIXED (AGENT_CONTRACT + KNOWLEDGE_GOVERNANCE + LIAISON_ADMIN ambiguity-resolved) |
| IAA Required at Handover | YES — MANDATORY |
| FFA Checks Declared | 22 (FFA-CFC: 12, FFA-VIC: 4, FFA-CER: 7, FFA-GCG: 4) |
| Ceremony Checks | CERT-001–004, OVL-AC-001–007, OVL-AC-ADM-001–004, OVL-KG-001–004, OVL-KG-ADM-001–003, OVL-INJ-001 |
| Scope Blockers | SB-001 (BLOCKING — iaa_invocation_result consistency), SB-002 (advisory — PHASE_A guidance), SB-003 (advisory — trigger table path), SB-004 (cleared), SB-005 (cleared), SB-006 (cleared) |
| Ceremony-Admin Appointed | NO |
| Pre-Brief Phase Mode | PHASE_B_BLOCKING |
| Adoption Phase | PHASE_B — hard gate ACTIVE |

⚠️ **SB-001 is a BLOCKING scope issue.** CodexAdvisor-agent must resolve the
`iaa_invocation_result:` consistency between the template (PS-I-01 removes it) and the agent
contract (currently still documents it as required). IAA will fail OVL-AC-002 and OVL-KG-001
if this inconsistency reaches handover unresolved.

**CodexAdvisor-agent may proceed with implementation.** This Pre-Brief artifact satisfies
the pre-brief-before-delegation requirement. All required checks are declared above.
IAA will verify each at full assurance invocation upon PREHANDOVER proof delivery.

---

## 11. IAA Pre-Brief Certification

This Pre-Brief artifact was produced by independent-assurance-agent in Phase 0 (PRE-BRIEF mode).

- IAA did NOT produce, draft, or implement any PS-I changes
- IAA acted solely in the capacity of Pre-Brief classifier and scope-setter
- This artifact is the **authoritative governance gate** for the handover assurance of this wave
- At handover (T6), IAA will execute Phases 1–4 against the actual committed artifacts
  using the FFA checks declared in Sections 5–8 above

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA contract version at time of pre-brief**: 2.5.0
**Knowledge pack version at time of pre-brief**:
  - iaa-trigger-table.md v2.4.0
  - iaa-category-overlays.md v4.0.0 (approx)
  - FAIL-ONLY-ONCE.md v2.5.0
