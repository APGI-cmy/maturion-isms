# IAA Wave Record — admin-ceremony-hardening-20260421

**Wave**: admin-ceremony-hardening-20260421
**Branch**: copilot/harden-admin-ceremony-handover
**Issue**: Harden admin-ceremony handovers after PR #1432: universal reference-truth checks, liaison mini-pack, and QP/IAA improvements
**Agent**: independent-assurance-agent v6.2.0
**Wave Record Created**: 2026-04-21
**Governed by**: `capabilities.wave_record_path_pattern` (contract §capabilities.assurance)
**Standalone artifacts prohibited**: YES — all IAA output for this wave lives in this file only

---

## PRE-BRIEF

**Pre-Brief Date**: 2026-04-21
**Triggered by**: Foreman-v2-agent wave-start pre-brief request (wave-current-tasks.md — IAA-PRE task)
**Pre-Brief Mode**: PHASE_0 — Do NOT proceed to Phase 1–4 assurance

---

### Step 0.1 — Pre-Brief Mode Confirmed

Invocation type: Wave-start PRE-BRIEF.
Phase 0 only. Phases 1–4 assurance deferred to final IAA invocation (IAA-FINAL task).

---

### Step 0.2 — Qualifying Tasks and Trigger Classification

**Wave tasks reviewed against trigger table (iaa-trigger-table.md v2.4.0):**

#### QUALIFYING TASKS (IAA triggered at final audit)

| Task | Deliverable Path(s) | Trigger Category | IAA Required? |
|------|-------------------|-----------------|---------------|
| D2 | `governance/canon/AGENT_HANDOVER_AUTOMATION.md` (hardening additions) | **CANON_GOVERNANCE** | YES — MANDATORY |
| D3 | `governance/checklists/execution-ceremony-admin-anti-patterns.md` (new AAP entries) | **CANON_GOVERNANCE** | YES — MANDATORY |
| D4 | `governance/checklists/execution-ceremony-admin-reconciliation-matrix.md` (renumber rule — new file) | **CANON_GOVERNANCE** | YES — MANDATORY |
| D5 | `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md` (QP auth-ref table), `governance/templates/execution-ceremony-admin/SESSION_MEMORY.template.md` | **CANON_GOVERNANCE** | YES — MANDATORY |
| D5 | `.github/agents/*.md` (if any agent contract files modified via CodexAdvisor-agent per AGCFPP-001) | **AGENT_CONTRACT** | YES — MANDATORY (conditional on agent file touch) |
| D6 | `governance/templates/` (new liaison/non-ECAP mini-ceremony pack template) | **CANON_GOVERNANCE** | YES — MANDATORY |
| D7 | `governance/checklists/execution-ceremony-admin-checklist.md` (new check items), additional governance template/gate updates | **CANON_GOVERNANCE** | YES — MANDATORY |

#### NON-QUALIFYING TASKS (IAA not triggered for these artifacts in isolation)

| Task | Deliverable Path(s) | Trigger Category | Rationale |
|------|-------------------|-----------------|-----------|
| D1 | `governance/design/...` (gap analysis / target-state design document) | EXEMPT (doc-only) | Design document is stored in the repo governance design tree, not an admin workspace path. It remains EXEMPT here because design-only material does not itself modify governed canon/checklist/template content. AMBIGUITY NOTE: if the work also changes governed artifacts such as `governance/canon/`, `governance/checklists/`, or `governance/templates/` → reclassify at final audit based on the changed artifact class. |
| D8 | Validation package / PREHANDOVER proof | GOVERNANCE_AUDIT (EXEMPT solo) | Retrospective ceremony bundle. Exempt only when isolated. If D8 contains triggering artifacts (e.g., canon verification evidence referencing new files), MIXED rule applies. |
| WAVE-REC | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | EXEMPT | Session planning artifact |
| SCOPE-DEC | `.agent-workspace/foreman-v2/personal/scope-declaration-wave-admin-ceremony-hardening-20260421.md` | EXEMPT | Admin scope artifact |
| SESSION-MEM | `.agent-workspace/foreman-v2/memory/session-166-admin-ceremony-hardening-20260421.md` | GOVERNANCE_AUDIT | Session memory — exempt solo |
| PREHANDOVER | `.agent-workspace/foreman-v2/memory/` (PREHANDOVER proof) | GOVERNANCE_AUDIT | Ceremony record — exempt solo |

**AMBIGUITY RULE applied**: D5 lists CodexAdvisor-agent as owner with the AGCFPP-001 route for agent-file work. This means `.github/agents/*.md` modifications are **possible** under D5 (e.g., Foreman QP protocol hardening that touches the foreman-v2-agent contract or checklist template agent). If any `.github/agents/*.md` file appears in the PR diff → **AGENT_CONTRACT** trigger activates in addition to CANON_GOVERNANCE. IAA will re-classify at final invocation per FAIL-ONLY-ONCE A-022.

---

### Step 0.2 — Pre-Brief Output (Canon Format)

```
Qualifying tasks: D2 (CANON_GOVERNANCE), D3 (CANON_GOVERNANCE), D4 (CANON_GOVERNANCE),
                  D5 (CANON_GOVERNANCE + conditional AGENT_CONTRACT), D6 (CANON_GOVERNANCE),
                  D7 (CANON_GOVERNANCE)
                  Non-qualifying: D1 (EXEMPT-doc), D8 (GOVERNANCE_AUDIT/EXEMPT-solo),
                  wave admin artifacts (EXEMPT/GOVERNANCE_AUDIT)

Applicable overlay: CANON_GOVERNANCE (primary — mandatory for all qualifying tasks)
                    AGENT_CONTRACT (conditional — activates if .github/agents/*.md touched under D5)
                    If AGENT_CONTRACT triggers: AC-01 through AC-07 + OVL-INJ-001 added to check set

Anti-regression obligations: YES
  — A-020: PREHANDOVER.template.md is being modified (D5). Must not reduce overlay coverage,
    remove mandatory fields, or weaken existing compliance requirements. Any template change that
    drops a currently required section = REJECTION-PACKAGE.
  — FBR (FUNCTIONAL-BEHAVIOUR-REGISTRY): NOT applicable — this is a governance/CANON_GOVERNANCE
    wave, not a BUILD or AAWP_MAT wave. NBR-001 through NBR-005 do not apply.
```

---

### Step 0.3 — Scope Blockers and Pre-Brief Obligations

The following blockers and obligations must be satisfied BEFORE IAA final invocation (IAA-FINAL):

#### SB-ACWH-001 — CANON_INVENTORY Update Obligation
Every new governance file created in this wave (D3 new anti-patterns file, D4 new reconciliation-matrix file, D6 new liaison mini-pack template) **must appear in `governance/CANON_INVENTORY.json`** with a valid, non-null, non-zeroed `file_hash_sha256` (or equivalent hash field) before IAA invocation. Absence or null hash = HALT-002 risk at IAA final audit.

**Producing agent obligation**: After committing D3, D4, D6 new files → update CANON_INVENTORY.json → commit → then invoke IAA.

#### SB-ACWH-002 — Ripple Impact Declaration (OVL-CG-004/OVL-CG-005)
Changes to `governance/canon/AGENT_HANDOVER_AUTOMATION.md` (D2) introduce new reference-truth and renumber rules. **All consumer agents whose contracts or knowledge files reference AGENT_HANDOVER_AUTOMATION.md** must be identified and assessed for ripple impact. At minimum, the following must be declared in the PREHANDOVER proof:

- List of agent contracts referencing `AGENT_HANDOVER_AUTOMATION.md` or ceremony handover procedures
- Ripple determination: UPDATE REQUIRED / NO UPDATE NEEDED (with justification)
- If any contract requires update → those must be committed as part of this wave or a named follow-on issue must be created before IAA-FINAL invocation

Failure to declare ripple scope = OVL-CG-004 FAIL → REJECTION-PACKAGE.

#### SB-ACWH-003 — AGCFPP-001 Compliance (Conditional on D5 Agent File Touch)
If any `.github/agents/*.md` file is modified under D5 (Foreman QP hardening):
- Modification **must** be routed through CodexAdvisor-agent per AGCFPP-001
- IAA invocation evidence (A-001) must be present in the PR artifacts
- Wave context confirms CodexAdvisor-agent is authorised — but IAA will verify at final audit that AGCFPP-001 routing was actually followed, not just declared

#### SB-ACWH-004 — SCOPE_DECLARATION.md Parity (A-026)
`SCOPE_DECLARATION.md` must be committed on the branch and must **exactly match** `git diff --name-only origin/main...HEAD` at the time of IAA final invocation. Any mismatch = REJECTION-PACKAGE (BL-027 merge gate parity failure). IAA ceremony artifacts are subject to the A-031 carve-out — Foreman must include A-031 note in SCOPE_DECLARATION.md for any IAA-only artifacts (session memory, tokens, wave record) generated during this wave's ceremony.

#### SB-ACWH-005 — PREHANDOVER Proof Structure Requirements
The PREHANDOVER proof for this wave **must include**:

| Required Field | Source Rule | Notes |
|---------------|-------------|-------|
| `iaa_audit_token: IAA-session-214-admin-ceremony-hardening-20260421-PASS` | A-029 (§4.3b) | Pre-populated at commit time — NOT `PENDING`. Session-214 = IAA final audit session (separate track from foreman session numbering). |
| Authoritative Reference Table | D5 deliverable intent | The very mechanism this wave is delivering. The wave's own PREHANDOVER must demonstrate it (eat your own cooking). Must include: session ID, PR number, branch name, all canon file paths + versions, CANON_INVENTORY hash confirmation. |
| Ripple impact assessment | OVL-CG-004/005, SB-ACWH-002 | Explicit list of affected consumers with update/no-update determination |
| CANON_INVENTORY verification | OVL-CG-ADM-001 | Confirm CANON_INVENTORY.json updated for all new/modified canon files |
| Version bump declarations | OVL-CG-ADM-002 | All modified canon documents must show incremented version numbers |
| SCOPE_DECLARATION.md match evidence | A-026 | `git diff --name-only origin/main...HEAD` output or equivalent |
| A-031 carve-out note (if IAA artifacts excluded) | A-031 | Required if any IAA-generated artifacts (session memory, tokens) are excluded from scope declaration |

**CRITICAL A-029 note**: `iaa_audit_token: PENDING` is the OLD pattern. Do NOT use PENDING. Pre-populate with the expected reference format at commit time. PREHANDOVER proof is read-only post-commit.

---

### Step 0.3 — Ceremony Admin Status

```
ceremony_admin_appointed: PENDING — ECAP appointment required at Phase 4
```

**Implication**: ACR-01 through ACR-11 (Admin-Ceremony Rejection Triggers) will become active at IAA final invocation IF `execution-ceremony-admin-agent` is appointed before Phase 4 is complete. IAA will check `ceremony_admin_appointed` status in wave-current-tasks.md at final invocation and apply ACR checks accordingly.

If ECAP is appointed: **ACR-01 (ECAP reconciliation summary absence = AUTO-REJECT)** activates. The proof bundle must include the populated ECAP reconciliation summary per `ECAP_RECONCILIATION_SUMMARY.template.md`.

---

### Step 0.3 — Retained Check Set for Final IAA Audit (IAA-FINAL)

**Core invariants (always):**
- CORE-020: Zero partial pass — absence of evidence = failing check
- CORE-021: Zero severity tolerance — no "minor" / "trivial" language permitted

**CANON_GOVERNANCE overlay (OVL-CG — all qualifying tasks):**
- OVL-CG-001: Strategy alignment — does each hardening deliverable actually prevent PR #1432-class defects? IAA will check whether the wrong-but-plausible reference anti-pattern, the renumber rule, and the reference-truth mechanism are each functionally enforceable as written.
- OVL-CG-002: No contradictions with existing canon — new entries in AGENT_HANDOVER_AUTOMATION.md must not contradict existing ceremony obligations.
- OVL-CG-003: Enforcement gap — each new rule must be detectable by an agent operating autonomously. If a rule cannot be detected or enforced without human inspection, it must be flagged.
- OVL-CG-004: Ripple impact assessed — see SB-ACWH-002.
- OVL-CG-005: ISMS layer-down scope — all agent contracts/knowledge files referencing affected canon must be touched or have a named follow-on.
- OVL-CG-ADM-001: CANON_INVENTORY updated — all new/modified files present with valid hashes.
- OVL-CG-ADM-002: Version bumps present — all modified canon files have incremented version numbers.

**AGENT_CONTRACT overlay (conditional — activates if .github/agents/*.md touched):**
- AC-01 through AC-07 (IAA_AGENT_CONTRACT_AUDIT_STANDARD.md)
- OVL-INJ-001: Pre-Brief artifact committed before builder delegation

**FAIL-ONLY-ONCE standing checks:**
- A-020: PREHANDOVER.template.md modification must not reduce overlay coverage
- A-022: Re-evaluate all trigger categories at final invocation — do not carry forward this pre-brief's classification blindly
- A-026: SCOPE_DECLARATION.md matches PR diff exactly
- A-029: PREHANDOVER iaa_audit_token uses expected reference format (NOT PENDING)
- A-031: A-026 carve-out note present for IAA ceremony artifacts
- A-033: All PREHANDOVER/session memory paths verified via `git ls-tree HEAD` (not disk only)

**Ceremony admin checks (conditional — activates if ECAP appointed):**
- ACR-01 through ACR-11 active if `ceremony_admin_appointed: YES` at final invocation

---

### Pre-Brief Summary

| Item | Value |
|------|-------|
| Qualifying tasks | D2, D3, D4, D5, D6, D7 (6 qualifying; D1/D8/wave-admin exempt solo) |
| Primary trigger category | CANON_GOVERNANCE |
| Conditional trigger category | AGENT_CONTRACT (if .github/agents/*.md touched under D5) |
| Applicable overlay | CANON_GOVERNANCE + conditional AGENT_CONTRACT |
| Anti-regression obligations | YES — A-020 (PREHANDOVER template modification) |
| FBR obligations | NO — governance wave, not BUILD/AAWP_MAT |
| Scope blockers | SB-ACWH-001 (CANON_INVENTORY), SB-ACWH-002 (ripple), SB-ACWH-003 (AGCFPP-001), SB-ACWH-004 (SCOPE_DECLARATION), SB-ACWH-005 (PREHANDOVER structure) |
| Ceremony admin status | PENDING — ACR checks activate if ECAP appointed at Phase 4 |
| IAA session for this pre-brief | session-213 (next available after session-212) |
| IAA session for final audit (IAA-FINAL) | session-214 (next available after pre-brief session-213) |
| Expected PREHANDOVER iaa_audit_token | `IAA-session-214-admin-ceremony-hardening-20260421-PASS` |
| ⚠️ Session-166 clarification | "session-166" in wave-current-tasks.md = **foreman-v2-agent session numbering**, NOT IAA session number. IAA and Foreman maintain independent session sequences. |
| Pre-Brief status | COMPLETE |

---

## TOKEN

*Populated by IAA at Phase 4 Step 4.2 — ASSURANCE-TOKEN or REJECTION-PACKAGE will appear here after final IAA invocation (IAA-FINAL task).*

PHASE_B_BLOCKING_TOKEN: PENDING — awaiting IAA-FINAL invocation after all D1–D8 deliverables committed.

---

## REJECTION_HISTORY

*Populated by IAA at Phase 4 Step 4.2b — rejection findings will appear here if any REJECTION-PACKAGE is issued during this wave.*

No rejection history at pre-brief stage.
