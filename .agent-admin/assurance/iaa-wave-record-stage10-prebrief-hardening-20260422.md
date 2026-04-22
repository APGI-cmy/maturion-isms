# IAA Wave Record — stage10-prebrief-hardening-20260422

**Wave**: stage10-prebrief-hardening-20260422
**Branch**: copilot/implement-wave-level-admin-ceremony-contract
**Issue**: maturion-isms#1446 — Harden Stage 10 IAA Pre-Brief: add wave-level admin ceremony contract and enforce it at handover
**Issue Reference Note**: Aligned with the current authoritative `wave-current-tasks.md` entry for this wave.
**Agent**: independent-assurance-agent v6.2.0
**Wave Record Created**: 2026-04-22
**Governed by**: `capabilities.wave_record_path_pattern` (contract §capabilities.assurance)
**Standalone artifacts prohibited**: YES — all IAA output for this wave lives in this file only

---

## PRE-BRIEF

**Pre-Brief Date**: 2026-04-22
**Triggered by**: Foreman-v2-agent wave-start pre-brief request (wave-current-tasks.md — IAA-PRE task, session-167-stage10-prebrief-hardening-20260422)
**Pre-Brief Mode**: PHASE_0 — Do NOT proceed to Phase 1–4 assurance

---

### Step 0.1 — Pre-Brief Mode Confirmed

Invocation type: Wave-start PRE-BRIEF (action: "PRE-BRIEF").
Phase 0 only. Phases 1–4 assurance deferred to final IAA invocation (IAA-FINAL task).

---

### Step 0.2 — Qualifying Tasks and Trigger Classification

**Trigger table applied**: `iaa-trigger-table.md` v2.4.0
**Classification decision flow**: Steps 2 (CANON_GOVERNANCE), 6 (KNOWLEDGE_GOVERNANCE), 8 (PRE_BUILD_STAGE_MODEL)

#### QUALIFYING TASKS (IAA triggered at final audit)

| Task | Deliverable Path(s) | Trigger Category | IAA Required? | Notes |
|------|-------------------|-----------------|---------------|-------|
| D1 | `governance/canon/IAA_PRE_BRIEF_PROTOCOL.md` | **CANON_GOVERNANCE** | YES — MANDATORY | Core IAA canon file; trigger table step 2 |
| D2 | `governance/templates/iaa-wave-record.template.md` | **CANON_GOVERNANCE** | YES — MANDATORY | Governance template under `governance/` tree; A-020 anti-regression applies |
| D3 | `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` | **CANON_GOVERNANCE** | YES — MANDATORY + **SELF-MOD-IAA-001 HARD GATE** | IAA canon protected file; governance-liaison-isms-agent MUST NOT commit without CS2 direct sign-off per SELF-MOD-IAA-001. **SB-001** declared. |
| D4 | `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` | **CANON_GOVERNANCE + PRE_BUILD_STAGE_MODEL** | YES — MANDATORY | Both trigger categories apply; OVL-PBG-010 Stage 10 gate definition in scope |
| D5 | `.agent-workspace/foreman-v2/knowledge/WAVE-CURRENT-TASKS-PROTOCOL.md`, `.agent-workspace/foreman-v2/knowledge/prehandover-template.md`, `.agent-workspace/foreman-v2/knowledge/index.md` | **KNOWLEDGE_GOVERNANCE** | YES — MANDATORY | Agent workspace knowledge files; trigger table step 6; OVL-KG overlay applies |
| D6 | `governance/examples/stage10-prebrief-ceremony-contract-examples.md` | **CANON_GOVERNANCE** | YES — MANDATORY | New file under `governance/` tree; examples demonstrate operational canon compliance; AMBIGUITY RULE applied → mandatory |
| D7 | `governance/CANON_INVENTORY.json` | **CANON_GOVERNANCE** | YES — MANDATORY | Explicitly named in trigger table step 2 |

#### NON-QUALIFYING TASKS (IAA not triggered for these artifacts in isolation)

| Task | Deliverable Path(s) | Trigger Category | Rationale |
|------|-------------------|-----------------|-----------|
| SCOPE | `.agent-workspace/foreman-v2/personal/scope-declaration-wave-stage10-prebrief-hardening-20260422.md` | EXEMPT | Admin scope artifact |
| WAVE-REC | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | EXEMPT | Session planning artifact |
| SESSION-MEM | `.agent-workspace/foreman-v2/memory/session-167-stage10-prebrief-hardening-20260422.md` | GOVERNANCE_AUDIT (EXEMPT solo) | Retrospective session record |
| PREHANDOVER | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-167-stage10-prebrief-hardening-20260422.md` | GOVERNANCE_AUDIT (EXEMPT solo) | Ceremony proof — exempt only in isolation; MIXED rule applies if triggering artifacts present in same PR |
| IAA-WAVE-REC | `.agent-admin/assurance/iaa-wave-record-stage10-prebrief-hardening-20260422.md` (this file) | GOVERNANCE_AUDIT / A-031 carve-out | IAA-generated ceremony artifact; A-031 carve-out applies |
| ECAP | ECAP bundle (Phase 4 — paths TBD) | GOVERNANCE_AUDIT (EXEMPT solo) | Ceremony record; Phase 4 only |

**MIXED classification result**: PR contains multiple MANDATORY trigger categories (CANON_GOVERNANCE + KNOWLEDGE_GOVERNANCE + PRE_BUILD_STAGE_MODEL). Primary overlay: CANON_GOVERNANCE. Secondary overlays: KNOWLEDGE_GOVERNANCE (D5), PRE_BUILD_STAGE_MODEL (D4). All qualifying tasks in scope for IAA-FINAL.

**AMBIGUITY RULE applied**: governance/examples/ is not `governance/canon/` but is within the governance tree and contains operationally active demonstration material. Default: mandatory (D6).

---

### Step 0.2 — Pre-Brief Output (Canon Format)

```
Qualifying tasks: D1 (CANON_GOVERNANCE), D2 (CANON_GOVERNANCE), D3 (CANON_GOVERNANCE + SELF-MOD-IAA-001),
                  D4 (CANON_GOVERNANCE + PRE_BUILD_STAGE_MODEL), D5 (KNOWLEDGE_GOVERNANCE),
                  D6 (CANON_GOVERNANCE), D7 (CANON_GOVERNANCE)
                  Non-qualifying: SCOPE/WAVE-REC (EXEMPT), SESSION-MEM/PREHANDOVER/ECAP
                                  (GOVERNANCE_AUDIT/EXEMPT-solo), IAA wave record (A-031 carve-out)

Applicable overlay: CANON_GOVERNANCE (primary — D1, D2, D3, D4, D6, D7)
                    KNOWLEDGE_GOVERNANCE (secondary — D5: foreman-v2 knowledge files)
                    PRE_BUILD_STAGE_MODEL (additional — D4: Stage 10 definition change)

Anti-regression obligations: YES
  — A-020: iaa-wave-record.template.md is being modified (D2). Must not reduce mandatory
    fields, remove required sections, or weaken existing compliance requirements. Any
    template change that drops a currently required section = REJECTION-PACKAGE.
  — SELF-MOD-IAA-001: INDEPENDENT_ASSURANCE_AGENT_CANON.md modification (D3) requires
    CS2 direct sign-off. governance-liaison-isms-agent is the producing agent but CANNOT
    commit this file unilaterally. Hard gate active.
  — FBR (FUNCTIONAL-BEHAVIOUR-REGISTRY): NOT applicable — governance wave, not BUILD
    or AAWP_MAT. NBR-001 through NBR-005 do not apply.
```

---

### Step 0.3 — Scope Blockers

The following blockers must be satisfied BEFORE IAA-FINAL invocation:

#### SB-001 — SELF-MOD-IAA-001 Hard Gate (D3)

**File**: `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`
**Rule**: INDEPENDENT_ASSURANCE_AGENT_CANON.md §Independence Requirements rule 1 — "The IAA cannot validly assure its own governing contract — CS2 must directly review." SELF-MOD-IAA-001 is ACTIVE and CONSTITUTIONAL.

**Obligation**: governance-liaison-isms-agent MUST NOT commit D3 without explicit CS2 (@APGI-cmy) sign-off documented in:
1. The issue (#1446) — CS2 must explicitly approve the new ACR conditions in writing
2. The PREHANDOVER proof — `cs2_direct_review_confirmed: YES` field required
3. The commit message — must reference CS2 approval (e.g., "CS2 approved — issue #XXXX")

IAA will verify at final audit that the modification was CS2-reviewed, not merely Foreman-authorized. If CS2 sign-off is absent or undocumented → REJECTION-PACKAGE (OVL-CG-001 + SELF-MOD-IAA-001).

#### SB-002 — CANON_INVENTORY Update Obligation (D7)

Every new or modified canon file in this wave (D1, D2, D3, D4, D6 new file) **must appear in `governance/CANON_INVENTORY.json`** with a valid, non-null, non-zeroed `file_hash_sha256` before IAA-FINAL invocation.

**Producing agent obligation**: After committing all D-task files → update CANON_INVENTORY.json → commit → then invoke IAA. Absence or null hash = HALT-002 risk at IAA final audit.

#### SB-003 — Version Bump Obligation

All modified canon files must have incremented version numbers in their headers:
- D1: `IAA_PRE_BRIEF_PROTOCOL.md` — current v1.2.2 → target v1.3.0 (minor bump for §wave-level admin ceremony contract addition)
- D2: `iaa-wave-record.template.md` — version must be bumped
- D3: `INDEPENDENT_ASSURANCE_AGENT_CANON.md` — current v1.10.0 → v1.11.0 (subject to CS2 approval per SB-001)
- D4: `PRE_BUILD_STAGE_MODEL_CANON.md` — current v1.0.0 → version bumped

Failure to bump any version = OVL-CG-ADM-002 FAIL → REJECTION-PACKAGE.

#### SB-004 — Ripple Impact Assessment Obligation

Three high-impact canon files are being modified (D1, D3, D4). The following agent contracts reference these files and must be assessed for ripple impact:

| Agent | Files Potentially Referencing | Assessment Required |
|-------|------------------------------|---------------------|
| foreman-v2-agent | IAA_PRE_BRIEF_PROTOCOL.md, PRE_BUILD_STAGE_MODEL_CANON.md | Stage 10 workflow update assessment |
| governance-liaison-isms-agent | INDEPENDENT_ASSURANCE_AGENT_CANON.md | ACR addition awareness |
| execution-ceremony-admin-agent | INDEPENDENT_ASSURANCE_AGENT_CANON.md §ACR | Protocol update assessment |
| independent-assurance-agent | All three (primary canon) | Contract reference update |

**Ripple determination** must be declared in the PREHANDOVER proof:
- List of agents/files referencing changed canon
- For each: UPDATE REQUIRED / NO UPDATE NEEDED (with justification)
- If any contract requires update → committed in this wave or named follow-on issue created BEFORE IAA-FINAL

Failure to declare = OVL-CG-004 FAIL → REJECTION-PACKAGE.

#### SB-005 — SCOPE_DECLARATION.md Parity (A-026)

`SCOPE_DECLARATION.md` (or scope-declaration-wave-stage10-prebrief-hardening-20260422.md) must match `git diff --name-only origin/main...HEAD` exactly at IAA-FINAL invocation time. IAA will run diff validation at Step 4.1.

A-031 carve-out: IAA-generated ceremony artifacts (this wave record, IAA session memory, IAA token file) are excluded from scope declaration per A-031. Foreman must include A-031 carve-out note in scope/PREHANDOVER proof for any IAA-only artifacts generated during Phase 4.

#### SB-006 — Issue Number ✅ RECONCILED

**Finding**: The PRE-BRIEF invocation request originally referenced issue **#1446**, while the initial `wave-current-tasks.md` recorded issue **#1442**. This discrepancy has been reconciled: all ceremony artifacts (wave record, wave-current-tasks.md, scope declaration, PREHANDOVER proof) now consistently reference **maturion-isms#1446** as the authoritative issue for this wave.

**Status**: RESOLVED — no further action required.

#### SB-007 — PREHANDOVER Proof Structure Requirements

The PREHANDOVER proof for this wave **must include** all required fields per the retained check set below:

| Required Field | Source Rule |
|---------------|-------------|
| `iaa_audit_token: IAA-session-216-stage10-prebrief-hardening-20260422-PASS` | A-029 (§4.3b) — pre-populate at commit time; NOT PENDING |
| `cs2_direct_review_confirmed: YES` (for D3) | SELF-MOD-IAA-001 / SB-001 |
| `## Authoritative Reference Table` section | ACR-17 / AAP-23+24 |
| `## Ripple/Cross-Agent Assessment` section (populated) | ACR-14 / A-023 |
| `gate_set_checked:` field listing specific gates verified | ACR-12 |
| CANON_INVENTORY.json hash confirmation for all D-task files | OVL-CG-ADM-001 |
| Version bump declarations for D1, D2, D3, D4 | OVL-CG-ADM-002 |
| Scope declaration parity evidence (`git diff --name-only`) | A-026 |
| A-031 carve-out note (for IAA ceremony artifacts) | A-031 |
| No pre-final instruction wording in any section | ACR-09 |
| All final-state wording consistent across bundle | ACR-02, ACR-10 |
| Issue number consistent across all artifacts (SB-006) | ACR-03 |

**CRITICAL A-029 note**: `iaa_audit_token: PENDING` is the OLD pattern. Pre-populate with `IAA-session-216-stage10-prebrief-hardening-20260422-PASS` at commit time. PREHANDOVER proof is read-only post-commit.

#### SB-008 — Wave Record Path Discrepancy

**Finding**: The PRE-BRIEF invocation request specified wave record path with `-20260422` date suffix:
`iaa-wave-record-stage10-prebrief-hardening-20260422-20260422.md`
The scope declaration lists path WITHOUT the extra date suffix:
`iaa-wave-record-stage10-prebrief-hardening-20260422.md`

IAA is using the **scope declaration path** (`.agent-admin/assurance/iaa-wave-record-stage10-prebrief-hardening-20260422.md`) as the authoritative target per scope precedence. The Foreman must update `wave-current-tasks.md` `iaa_wave_record_path` field to match this path after IAA commits this file.

---

### Step 0.3 — Ceremony Admin Status

```
ceremony_admin_appointed: PENDING — pending Phase 4 completion
```

**Implication**: ACR-01 through ACR-17 (Admin-Ceremony Rejection Triggers) will become active at IAA final invocation IF `execution-ceremony-admin-agent` is appointed before Phase 4 is complete. IAA will check `ceremony_admin_appointed` status in wave-current-tasks.md at final invocation.

If ECAP is appointed: **ACR-01 (ECAP reconciliation summary absence = AUTO-REJECT)** activates. The proof bundle must include the populated ECAP reconciliation summary per `ECAP_RECONCILIATION_SUMMARY.template.md`.

---

### Step 0.3 — Retained Check Set for IAA-FINAL Audit

**Core invariants (always):**
- CORE-020: Zero partial pass — absence of evidence = failing check
- CORE-021: Zero severity tolerance — no "minor" / "trivial" language permitted

**CANON_GOVERNANCE overlay (D1, D2, D3, D4, D6, D7):**
- OVL-CG-001: Strategy alignment — do each hardening deliverable actually achieve the intended Stage 10 ceremony contract enforcement? IAA will evaluate functional enforceability: can an autonomous agent operating from these files detect a missing ceremony contract declaration without human inspection?
- OVL-CG-002: No contradictions — new ACR conditions (D3) must not contradict existing ACR-01 through ACR-17; new Stage 10 requirements (D4) must align with existing stage gate definitions
- OVL-CG-003: Enforcement gap — every new rule introduced must be detectable and enforceable by an agent operating autonomously. If a rule requires human review to detect → flag
- OVL-CG-004: Ripple impact assessed — see SB-004
- OVL-CG-005: ISMS layer-down scope — all agent contracts/knowledge files referencing affected canon assessed or follow-on issue created
- OVL-CG-ADM-001: CANON_INVENTORY updated for all new/modified files (D7 — must cover D1, D2, D3, D4, D6)
- OVL-CG-ADM-002: Version bumps present on D1, D2, D3, D4

**KNOWLEDGE_GOVERNANCE overlay (D5):**
- OVL-KG-001: Knowledge file correctness — does the updated foreman Tier 2 guidance accurately and completely communicate the Stage 10 ceremony contract requirements to the Foreman agent?
- OVL-KG-002: No contradictions with Tier 1 canon — foreman knowledge files must align with what D1–D4 establish
- OVL-KG-ADM-001: Index.md updated (D5 scope declaration includes index.md — verify updated)
- OVL-KG-ADM-002: Version or last-updated declarations correct in modified knowledge files

**PRE_BUILD_STAGE_MODEL overlay (D4):**
- OVL-PBG-010: Stage 10 IAA Pre-Brief gate correctly defined — wave-level admin ceremony contract section requirement explicitly present in Stage 10 spec
- OVL-PBG-016: Stage-readiness criteria for Stage 10 complete and consistent with D1 IAA_PRE_BRIEF_PROTOCOL.md changes

**FAIL-ONLY-ONCE standing checks for IAA-FINAL:**
- A-020: iaa-wave-record.template.md modification (D2) must not reduce required fields or weaken compliance requirements
- A-022: Re-evaluate all trigger categories at final invocation against actual PR diff — do not carry forward this pre-brief's classification blindly
- A-023: PREHANDOVER proof must contain explicit `## Ripple/Cross-Agent Assessment` section (populated, not blank)
- A-026: SCOPE_DECLARATION.md matches `git diff --name-only origin/main...HEAD` exactly
- A-029: PREHANDOVER iaa_audit_token uses expected reference format `IAA-session-216-...-PASS` (NOT PENDING)
- A-031: A-026 carve-out note present in PREHANDOVER proof for IAA ceremony artifacts
- A-033: All PREHANDOVER/session memory paths verified via `git ls-tree HEAD` (not disk-only)

**SELF-MOD-IAA-001 standing check (D3 only):**
- CS2 direct sign-off documented in issue, PREHANDOVER proof, and commit message
- governance-liaison-isms-agent not the sole authority for this change

**Ceremony admin checks (conditional — activates if ECAP appointed at Phase 4):**
- ACR-01 through ACR-17 active if `ceremony_admin_appointed: YES` at final invocation

---

### Pre-Brief Summary

| Item | Value |
|------|-------|
| Qualifying tasks | D1, D2, D3, D4, D5, D6, D7 (7 qualifying tasks) |
| Non-qualifying | SCOPE, WAVE-REC, SESSION-MEM, PREHANDOVER, ECAP (EXEMPT/GOVERNANCE_AUDIT) |
| Primary trigger category | CANON_GOVERNANCE |
| Secondary trigger categories | KNOWLEDGE_GOVERNANCE (D5), PRE_BUILD_STAGE_MODEL (D4) |
| Hard gate | SELF-MOD-IAA-001 active on D3 (IAA canon) — CS2 direct review REQUIRED |
| Anti-regression obligations | YES — A-020 (template modification D2) |
| FBR obligations | NO — governance wave, not BUILD/AAWP_MAT |
| Scope blockers | SB-001 (SELF-MOD-IAA-001/D3), SB-002 (CANON_INVENTORY), SB-003 (version bumps), SB-004 (ripple), SB-005 (SCOPE_DECLARATION parity), SB-006 (RESOLVED — issue# reconciled to #1446), SB-007 (PREHANDOVER structure), SB-008 (wave record path discrepancy) |
| Ceremony admin status | PENDING — ACR-01 through ACR-17 activate if ECAP appointed at Phase 4 |
| IAA session for this pre-brief | session-215 |
| IAA session for final audit (IAA-FINAL) | session-216 |
| Expected PREHANDOVER iaa_audit_token | `IAA-session-216-stage10-prebrief-hardening-20260422-PASS` |
| ⚠️ Session numbering note | "session-167" in wave-current-tasks.md = **foreman-v2-agent session numbering**, NOT IAA session number. IAA and Foreman maintain independent session sequences. |
| Wave record path used | `.agent-admin/assurance/iaa-wave-record-stage10-prebrief-hardening-20260422.md` (per scope declaration — see SB-008) |
| Pre-Brief status | COMPLETE |

---

## TOKEN

*To be populated by IAA at Phase 4 Step 4.2 — IAA-FINAL invocation.*

---

## REJECTION_HISTORY

*Populated by IAA at Phase 4 Step 4.2b — rejection findings will appear here if any REJECTION-PACKAGE is issued during this wave.*

No rejection history at pre-brief stage.
