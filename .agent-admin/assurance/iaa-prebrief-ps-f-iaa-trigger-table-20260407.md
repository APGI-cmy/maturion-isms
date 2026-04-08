# IAA Pre-Brief Artifact

**artifact_type**: IAA_PRE_BRIEF  
**wave**: ps-f-iaa-trigger-table-new-categories  
**branch**: copilot/add-new-categories-to-iaa-trigger-table  
**issue**: maturion-isms#1270  
**date**: 2026-04-07  
**iaa_agent**: independent-assurance-agent  
**produced_by**: independent-assurance-agent (Phase 0 — Pre-Brief mode)  
**cs2_authorization**: Issue #1270 opened by @APGI-cmy (CS2) and assigned to Copilot/foreman-v2-agent  
**delegated_implementer**: CodexAdvisor-agent (per IMPL-PLAN-MMM-PRE-UPGRADE-v1.0.0 §5 Batch 1)  
**status**: ACTIVE — governs handover assurance for this wave  

---

## 1. Wave Task Inventory

Tasks declared for this wave per issue #1270:

| Task ID | Task Summary | Source |
|---------|-------------|--------|
| PS-F-02 | Add LIAISON_ADMIN trigger category to `iaa-trigger-table.md` | Issue #1270 |
| PS-F-03 | Add GOVERNANCE_AUDIT trigger category (EXEMPT-classified) to `iaa-trigger-table.md` | Issue #1270 |
| PS-F-VER | Version bump from v2.3.0 → v2.4.0 in `iaa-trigger-table.md` and `index.md` | Issue #1270 |

---

## 2. IAA Trigger Category Classification

**Per classification decision flow in `iaa-trigger-table.md` v2.3.0 §Classification Decision Flow, Step 6:**

> "Does PR contain any `.agent-workspace/*/knowledge/` file changes? → YES: Category = KNOWLEDGE_GOVERNANCE. IAA = MANDATORY."

| Task ID | Qualifying? | IAA Trigger Category | IAA Required? | Rationale |
|---------|------------|----------------------|---------------|-----------|
| PS-F-02 | YES | KNOWLEDGE_GOVERNANCE | MANDATORY | Modifies `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md` — a Tier 2 knowledge file |
| PS-F-03 | YES | KNOWLEDGE_GOVERNANCE | MANDATORY | Same file modification — EXEMPT-classified row addition still constitutes a Tier 2 knowledge patch |
| PS-F-VER | YES | KNOWLEDGE_GOVERNANCE | MANDATORY | Version bump to `iaa-trigger-table.md` and `index.md` — both Tier 2 knowledge files |

**Overall PR classification: KNOWLEDGE_GOVERNANCE — IAA MANDATORY**

**AMBIGUITY RULE check**: No ambiguity. All tasks modify `.agent-workspace/independent-assurance-agent/knowledge/` files. Classification is unambiguous. AMBIGUITY RULE not invoked.

**FAIL-ONLY-ONCE A-015 applies**: Tier 2 knowledge patches require full PREHANDOVER ceremony — no content-type exemption. The fact that PS-F-03 introduces an EXEMPT category does not make the PR itself EXEMPT.

---

## 3. FFA (Full Functional Assurance) Checks Applicable at Handover

### 3.1 FAIL-ONLY-ONCE Rules That Apply to This Wave

| Rule ID | Rule Name | Application |
|---------|----------|-------------|
| A-001 | IAA invocation evidence must be present | PREHANDOVER proof and IAA token file required |
| A-002 | IAA mandatory for all agent classes — no exceptions | Not an agent contract PR; no class exemption risk, but rule noted |
| A-003 | Ambiguity resolves to mandatory invocation | N/A — category is unambiguous (KNOWLEDGE_GOVERNANCE) |
| A-015 | Tier 2 knowledge patches require full PREHANDOVER ceremony | **DIRECTLY APPLIES** — this wave modifies Tier 2 knowledge files |
| A-019 | Trigger table misapplication is an IAA bypass | DIRECTLY APPLIES — this wave modifies the trigger table itself; IAA must verify the new rows are correctly classified and do not inadvertently create bypass pathways |
| A-021 | Commit before IAA invocation (CI run evidence) | CodexAdvisor must commit all artifacts to branch before invoking IAA at handover |
| A-022 | Re-evaluate trigger categories on every IAA invocation | IAA will re-evaluate at handover invocation |
| A-026 | SCOPE_DECLARATION.md must match PR diff | SCOPE_DECLARATION.md must be updated to declare the exact file changes before IAA handover invocation |
| A-029 | §4.3b Artifact Immutability — PREHANDOVER proof is read-only post-commit | PREHANDOVER proof `iaa_audit_token` must be pre-populated with expected token reference at commit time; NOT editable post-commit |
| A-033 | CORE-018 verification must use `git ls-tree HEAD`, not disk `-f` check | IAA will use git verification, not disk existence |

### 3.2 Core Invariants That Apply

The following CORE checks from `iaa-core-invariants-checklist.md` v3.0.0 will be executed at handover:

| Check ID | Check Name | Relevance |
|----------|-----------|-----------|
| CORE-005 | Governance block present | Verify any governance metadata in updated files |
| CORE-006 | CANON_INVENTORY alignment | If `iaa-trigger-table.md` is listed in CANON_INVENTORY, verify hash is updated |
| CORE-007 | No placeholder content | Verify new category rows have no stubs, TODO, TBD, or placeholders |
| CORE-013 | IAA invocation evidence | PREHANDOVER proof or IAA token reference must be present |
| CORE-014 | No class exemption claim | N/A — no agent contract involved |
| CORE-015 | Session memory present | CodexAdvisor session memory must be in PR bundle |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated IAA token file must exist at `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md` |
| CORE-018 | Complete evidence artifact sweep | PREHANDOVER proof, session memory, `iaa_audit_token` field, IAA token file — all must be git-committed |
| CORE-019 | IAA token cross-verification | First invocation exception applies — token file created during IAA's own Phase 4 |
| CORE-020 | Zero partial pass rule | No assumed passes |
| CORE-021 | Zero-severity-tolerance | Any finding drives REJECTION-PACKAGE |

### 3.3 KNOWLEDGE_GOVERNANCE Overlay Checks

Per `iaa-category-overlays.md` v4.0.0 §KNOWLEDGE_GOVERNANCE Overlay:

**Substance Checks (Primary — 90% of IAA effort):**

| Check ID | Check Name | What IAA Will Do |
|----------|-----------|-----------------|
| OVL-KG-001 | Rule clarity | Verify that both LIAISON_ADMIN and GOVERNANCE_AUDIT categories are defined clearly enough that any agent can classify a PR without ambiguity — trigger conditions, notes, and IAA-required status must be unambiguous |
| OVL-KG-002 | Triggered by real incident/need | Verify that LIAISON_ADMIN and GOVERNANCE_AUDIT categories are grounded in a real governance need (CS2-issued issue #1270 constitutes authorization; IAA will verify the categories serve a functional purpose and are not redundant) |
| OVL-KG-003 | No duplication | Verify LIAISON_ADMIN does not duplicate EXEMPT; verify GOVERNANCE_AUDIT does not duplicate EXEMPT or CANON_GOVERNANCE |
| OVL-KG-004 | Cross-reference consistency | Verify any references to other check IDs or file names in the new rows actually exist |

**Critical Substance Check — Self-Referential Trigger Table Integrity:**

> ⚠️ IAA WILL APPLY A SPECIAL SUBSTANCE CHECK to this wave because the modified artifact IS the trigger table itself. IAA must verify:
>
> 1. **LIAISON_ADMIN trigger conditions**: Are they tight enough to prevent misclassification of legitimate governance PRs (CANON_GOVERNANCE, KNOWLEDGE_GOVERNANCE, AGENT_CONTRACT) as LIAISON_ADMIN? Over-broad trigger = REJECTION-PACKAGE.
> 2. **GOVERNANCE_AUDIT EXEMPT classification**: This is the critical check. GOVERNANCE_AUDIT is declared EXEMPT. IAA must verify the EXEMPT classification is appropriate — i.e., that a PR matching GOVERNANCE_AUDIT cannot also match a triggering category. If GOVERNANCE_AUDIT overlaps with AGENT_CONTRACT, CANON_GOVERNANCE, or KNOWLEDGE_GOVERNANCE, the EXEMPT classification creates an IAA bypass. IAA will fail this check if the classification logic creates a bypass pathway.
> 3. **Classification decision flow updated**: The flow at the end of the trigger table must be updated to incorporate both new categories, and the ordering must be correct (triggering categories before EXEMPT in the decision flow).
> 4. **AMBIGUITY RULE compliance**: The new rows must explicitly state interaction with the AMBIGUITY RULE where relevant.

**Admin Checks (Secondary — 10% of IAA effort):**

| Check ID | Check Name | Pass Condition |
|----------|-----------|----------------|
| OVL-KG-ADM-001 | PREHANDOVER ceremony complete | CERT-001 through CERT-004 pass |
| OVL-KG-ADM-002 | Knowledge version bumped and consistent | `iaa-trigger-table.md` header declares v2.4.0 AND `index.md` registration matches v2.4.0 |
| OVL-KG-ADM-003 | Index.md updated | `index.md` reflects v2.4.0 for `iaa-trigger-table.md` |

### 3.4 PRE_BRIEF_ASSURANCE Overlay Check

| Check ID | Check Name | Status |
|----------|-----------|--------|
| OVL-INJ-001 | Pre-Brief artifact existence | **THIS ARTIFACT IS THE PRE-BRIEF** — OVL-INJ-001 satisfied by this file once committed |
| OVL-INJ-ADM-001 | Pre-Brief non-empty | This artifact is non-empty |
| OVL-INJ-ADM-002 | Pre-Brief references correct wave | Wave `ps-f-iaa-trigger-table-new-categories` declared in this artifact header |
| OVL-INJ-ADM-003 | Stage-readiness view declared | See Section 6 below |

---

## 4. PREHANDOVER Structure Requirements

CodexAdvisor-agent MUST produce a PREHANDOVER proof file at:
```
PREHANDOVER-codexadvisor-session-NNN-ps-f-iaa-trigger-table-YYYYMMDD.md
```
(or equivalent naming, committed to the branch root or `.agent-admin/`)

**Required PREHANDOVER proof sections:**

| Section | Required Content | Governing Rule |
|---------|-----------------|----------------|
| `iaa_audit_token` | Pre-populated with expected token reference: `IAA-session-NNN-ps-f-iaa-trigger-table-20260407-PASS` | A-029 §4.3b — NOT editable post-commit |
| `cs2_authorization` | Reference to issue #1270 and @APGI-cmy explicit authorization | CORE-017 |
| `scope_declaration` | Exact list of files changed: `iaa-trigger-table.md`, `index.md` (if updated) | A-026, A-028 |
| `wave_reference` | `ps-f-iaa-trigger-table-new-categories` | A-028 |
| `tasks_completed` | PS-F-02, PS-F-03, PS-F-VER with file changes listed | A-026 |
| `fail_only_once_attested` | `true` + which rules were applied | CERT-003 |
| `session_memory_path` | Path to committed session memory file | CORE-015 |

**IAA token file** (written by IAA at Phase 4 after ASSURANCE-TOKEN):
```
.agent-admin/assurance/iaa-token-session-NNN-ps-f-iaa-trigger-table-YYYYMMDD.md
```
Must contain `PHASE_B_BLOCKING_TOKEN: IAA-session-NNN-ps-f-iaa-trigger-table-YYYYMMDD-PASS`

---

## 5. Scope Blockers

| Blocker ID | Blocker Description | Severity | Resolution Required |
|------------|--------------------|-----------|--------------------|
| BLOCKER-001 | **GOVERNANCE_AUDIT EXEMPT classification — bypass risk** | CRITICAL | CodexAdvisor MUST define GOVERNANCE_AUDIT trigger conditions with sufficient precision to guarantee it cannot be triggered by PRs that should classify as AGENT_CONTRACT, CANON_GOVERNANCE, KNOWLEDGE_GOVERNANCE, or CI_WORKFLOW. If GOVERNANCE_AUDIT conditions are over-broad, IAA will issue REJECTION-PACKAGE on the grounds that an EXEMPT-classified category creates a bypass pathway. Suggested design: GOVERNANCE_AUDIT should apply only to read-only audit log entries, parking station audit notes, or retrospective review artifacts — not to any file that modifies governance operational state. |
| BLOCKER-002 | **LIAISON_ADMIN overlap with CANON_GOVERNANCE / AGENT_CONTRACT** | HIGH | LIAISON_ADMIN trigger conditions must not overlap with CANON_GOVERNANCE (canon file changes) or AGENT_CONTRACT (agent file changes). If liaison admin work involves canon or agent contract changes, AMBIGUITY RULE requires CANON_GOVERNANCE/AGENT_CONTRACT classification — IAA is mandatory. LIAISON_ADMIN should cover liaison session records, inter-repo governance reports, and ripple notifications that do NOT modify canonical governance files. |
| BLOCKER-003 | **Classification decision flow ordering** | MEDIUM | The classification decision flow (the numbered decision tree at the bottom of the trigger table) must be updated to include LIAISON_ADMIN and GOVERNANCE_AUDIT steps. GOVERNANCE_AUDIT (being EXEMPT) must appear AFTER all triggering category checks. Any ordering error may cause misclassification. |

**No other scope blockers identified.** The wave is targeted, CS2-authorized, and scoped to a single Tier 2 knowledge file.

---

## 6. Evidence Bundle Requirements at Handover Invocation

CodexAdvisor-agent must commit ALL of the following to the branch BEFORE invoking IAA at handover (A-021):

| Artifact | Path | Required State |
|----------|------|---------------|
| Updated trigger table | `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md` | v2.4.0, LIAISON_ADMIN and GOVERNANCE_AUDIT rows present, decision flow updated, no placeholders |
| Updated index | `.agent-workspace/independent-assurance-agent/knowledge/index.md` | v2.4.0 registered for `iaa-trigger-table.md` |
| PREHANDOVER proof | Root or `.agent-admin/` | Non-empty, `iaa_audit_token` pre-populated, scope declared, session memory path stated |
| Session memory | `.agent-workspace/codexadvisor-agent/memory/session-NNN-YYYYMMDD.md` | Non-empty, fail_only_once_attested: true |
| This Pre-Brief | `.agent-admin/assurance/iaa-prebrief-ps-f-iaa-trigger-table-20260407.md` | THIS FILE — must be git-committed |

**Verification method**: IAA will use `git ls-tree HEAD` or `git ls-files --error-unmatch` for all artifact existence checks (A-033 — git verification, not disk `-f` check).

---

## 7. Stage-Readiness View (OVL-INJ-ADM-003 Adaptation for Knowledge Governance Wave)

> Note: This is a KNOWLEDGE_GOVERNANCE wave, not a PRE_BUILD_STAGE_MODEL module build. The 12-stage pre-build model does not apply. Stage-readiness is adapted for knowledge governance context.

| Stage Equivalent | Status | Notes |
|-----------------|--------|-------|
| CS2 Authorization | COMPLETE | Issue #1270 opened and assigned by @APGI-cmy |
| Problem definition (what is being changed and why) | COMPLETE | PS-F-02 (LIAISON_ADMIN) and PS-F-03 (GOVERNANCE_AUDIT) described in issue #1270 |
| Implementation plan (IMPL-PLAN-MMM-PRE-UPGRADE-v1.0.0 §5 Batch 1) | COMPLETE per issue | Referenced as authorization context |
| Target file identified | COMPLETE | `iaa-trigger-table.md` v2.3.0 confirmed present |
| Pre-Brief artifact (this file) | COMPLETE | This artifact constitutes Stage 10 equivalent |
| Builder appointment (CodexAdvisor-agent) | COMPLETE | Designated per IMPL-PLAN-MMM-PRE-UPGRADE-v1.0.0 §5 |
| **Blockers preventing implementation** | **SEE SECTION 5** | BLOCKER-001 (EXEMPT bypass risk) and BLOCKER-002 (LIAISON_ADMIN overlap) are design constraints, not hard blockers — CodexAdvisor must address these in the implementation design |

**Acceptance conditions IAA will verify at handover:**

1. LIAISON_ADMIN row present with trigger conditions that are non-overlapping with AGENT_CONTRACT, CANON_GOVERNANCE, KNOWLEDGE_GOVERNANCE, CI_WORKFLOW
2. GOVERNANCE_AUDIT row present, classified EXEMPT, with trigger conditions that cannot be triggered by any PR that modifies governance operational state (only retrospective/read-only artifacts)
3. Classification decision flow updated and correctly ordered (GOVERNANCE_AUDIT check appears after all triggering category steps)
4. `iaa-trigger-table.md` version header declares v2.4.0
5. `index.md` knowledge version updated to reflect v2.4.0 registration for `iaa-trigger-table.md`
6. All evidence bundle artifacts committed to branch (A-021, A-033)
7. PREHANDOVER proof present with `iaa_audit_token` pre-populated (A-029)
8. No placeholder, stub, or TBD content in new rows (CORE-007)
9. Version history table in `iaa-trigger-table.md` includes a v2.4.0 entry describing PS-F-02 and PS-F-03 additions

---

## 8. IAA Pre-Brief Certification

This Pre-Brief artifact was produced by independent-assurance-agent in Phase 0 (PRE-BRIEF mode).

- IAA did NOT produce, draft, or implement the changes to `iaa-trigger-table.md`
- IAA acted solely in the capacity of Pre-Brief classifier and scope-setter
- This artifact is the **authoritative governance gate** for the handover assurance of this wave
- At handover, IAA will execute Phases 2–4 against the actual committed artifacts using the FFA checks declared in Section 3 above

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**IAA contract version at time of pre-brief**: 2.4.0  
**Knowledge pack version at time of pre-brief**: iaa-trigger-table.md v2.3.0, iaa-category-overlays.md v4.0.0  
