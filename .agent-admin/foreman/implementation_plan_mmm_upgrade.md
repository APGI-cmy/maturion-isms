# Implementation Plan — MMM Pre-Implementation Upgrade

**Document ID**: IMPL-PLAN-MMM-PRE-UPGRADE-v1.0.0
**Artifact Path**: `.agent-admin/foreman/implementation_plan_mmm_upgrade.md`
**Wave**: wave-mmm-pre-impl-orchestration-20260407
**Version**: 1.0.0
**Created**: 2026-04-07
**Author**: foreman-v2-agent (POLC-Orchestration mode)
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Strategy Source**: `Maturion/strategy/PRE_MMM_IMPLEMENTATION_UPGRADE_STRATEGY.md` v1.0.0
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-mmm-pre-impl-orchestration-20260407.md`
**Session**: session-158-mmm-pre-impl-orchestration-20260407

---

## 1. Purpose

This document is Foreman's consolidated, actionable implementation and orchestration plan
for the MMM Pre-Implementation Upgrade. It translates
`PRE_MMM_IMPLEMENTATION_UPGRADE_STRATEGY.md` §3–§7 into batched waves, assigns builders,
declares dependency constraints, and registers CS2 decision gates.

This plan governs the sequencing and delegation of PS-A through PS-I upgrade waves.
No PS-wave implementation may begin without:
1. CS2 wave-start authorisation (GitHub issue per A-035)
2. IAA Pre-Brief artifact on the branch (A-031)
3. All applicable pre-build gates satisfied (Stages 5–10)

---

## 2. CS2 Decision Register

The following decisions must be recorded by CS2 before associated work begins:

| Decision ID | Item | Wave(s) Blocked | Status |
|-------------|------|-----------------|--------|
| DEC-PS-G | Approve or decline lightweight doc-ceremony path for MMM doc waves | PS-G | ⏳ PENDING CS2 DECISION |
| DEC-PS-BLK1 | Formal approval of `MMM_app_description.md` v0.2.0 (Stage 1 gate) | BLK-1 (MMM build start) | ✅ RESOLVED — CS2 approved v0.5.0 via issue #1298 (2026-04-08) |
| DEC-NB7 | `governance-repo-administrator-v2.agent.md` — introduce or formally defer | NB-7 | ⏳ PENDING |
| DEC-NB4 | Legacy `02-architecture/capabilities/` dirs — archive vs delete | NB-4 | ⏳ PENDING |

> ⚠️ CS2 HALT: No wave listed as "Blocked" above may begin until its decision is recorded
> as a comment on the relevant GitHub issue or this document. DEC-PS-G specifically
> must be resolved before PS-G scope is opened to CodexAdvisor.

---

## 3. Blocking Items (BLK-Series)

These blockers from the strategy must be tracked and resolved before downstream work:

| ID | Blocker | Owner | Status |
|----|---------|-------|--------|
| BLK-1 | `MMM_app_description.md` v0.5.0 CS2 formal approval (Stage 1 gate) | CS2 | ✅ RESOLVED — CS2 approved via issue #1298 (2026-04-08) |
| BLK-2 | IAA Tier 2 not updated for PBFAG gate (PRE_BUILD_STAGE_MODEL_CANON.md compliance) | CodexAdvisor → CS2 | In #1247 scope |
| BLK-3 | IAA Tier 2 not updated for MANDATORY_CROSS_APP_COMPONENTS | CodexAdvisor → CS2 | In #1247 scope |
| BLK-4 | `CONSUMER_REPO_REGISTRY.json` not layered down to `maturion-isms` | Governance Liaison → CS2 | In #1247 scope |
| BLK-5 | MMM wave-start authorisation issue not yet opened by CS2 | CS2 | ⏳ OPEN — after BLK-1 |
| BLK-6 | Active wave governance — sequential wave governance applies | CS2 → Foreman | ⏳ OPEN |

---

## 4. Batched Wave Execution Plan

The 9 upgrade waves (PS-A through PS-I) are grouped into **3 implementation batches**
plus 1 CS2 decision gate. This achieves the target of 3–4 batchable waves while
respecting all dependency constraints from strategy §5.

```
BATCH 1 ──────────────────────────────────────────────────────────
  PS-B  ──┐
  PS-F  ──┼──► (parallel, no dependencies)
  PS-I  ──┘

       CS2 REVIEW + MERGE per sub-wave
       ↓

BATCH 2 ──────────────────────────────────────────────────────────
  PS-A  (requires PS-B complete)
  PS-E  (requires PS-F complete)
  ↑ Can run in parallel once Batch 1 is merged

       CS2 REVIEW + MERGE per sub-wave
       ↓

BATCH 3 ──────────────────────────────────────────────────────────
  PS-C  (requires PS-A + PS-B complete)
  PS-D  (requires PS-A complete)       ──► can run parallel
  PS-H  (requires PS-E complete)       ──► can run parallel

       CS2 REVIEW + MERGE per sub-wave
       ↓

CS2 DECISION GATE ────────────────────────────────────────────────
  PS-G  (requires PS-A + PS-E complete; CS2 decision DEC-PS-G required)
```

---

## 5. Batch 1 — Foundational Upgrades (No Dependencies)

**Start Gate**: CS2 wave-start authorisation per sub-wave.
**All assignees**: CodexAdvisor-agent
**All can run in parallel** (independent target files, different agent workspaces)

### Batch 1 Issues to Open

| Issue Title | PS-Wave(s) | Assignee | IAA Category | Priority |
|-------------|-----------|----------|--------------|----------|
| `[PS-B] Foreman FAIL-ONLY-ONCE v4.2.0 — dedup + new A-rules` | PS-B | CodexAdvisor-agent | KNOWLEDGE_GOVERNANCE | HIGH |
| `[PS-F] IAA Trigger Table — new categories (KNOWLEDGE_GOVERNANCE, LIAISON_ADMIN, GOVERNANCE_AUDIT)` | PS-F | CodexAdvisor-agent | KNOWLEDGE_GOVERNANCE | HIGH |
| `[PS-I] Governance Liaison session memory template cleanup` | PS-I | CodexAdvisor-agent | KNOWLEDGE_GOVERNANCE | HIGH |

### PS-B Detail — Foreman FAIL-ONLY-ONCE v4.1.0 → v4.2.0

**Target**: `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`
**Wave-start gate**: CS2 issue opened and assigned to CodexAdvisor-agent

| Change ID | Change | Source |
|-----------|--------|--------|
| PS-B-01 | Rename second `A-004` → `A-018` (duplicate rule ID fix) | Sessions 028–035 |
| PS-B-02 | Rename second `A-016` → `A-019` (duplicate rule ID fix) | Sessions 028–035 |
| PS-B-03 | Add `A-033`: Foreman ceremony files declared in SCOPE_DECLARATION; A-031 carve-out for IAA artifacts | session-postfcwt-prodfails |
| PS-B-04 | Add `A-034`: Canon file modifications require CANON_INVENTORY.json update in same wave | session-wave-disable-auto |
| PS-B-05 | Codify `A-035` DELEGATION-ISSUE-REQUIRED: every builder delegation requires a GitHub issue before work begins | session-wave-disable-auto-R2 |
| PS-B-06 | Add corrective action completion marker convention `[ ]` / `[x]` for incident log | session-ci-gateway-fix |

**Handover requirements**:
- FAIL-ONLY-ONCE.md updated to v4.2.0 with all 6 changes applied
- No duplicate A-rule IDs remain
- IAA Pre-Brief artifact on branch before CodexAdvisor begins
- Full IAA ceremony (KNOWLEDGE_GOVERNANCE category)
- CS2 merge authority

### PS-F Detail — IAA Trigger Table: New Categories

**Target**: `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md`
**Wave-start gate**: CS2 issue opened and assigned to CodexAdvisor-agent

| Change ID | Change | Source |
|-----------|--------|--------|
| PS-F-01 (PS-E-01) | Add `KNOWLEDGE_GOVERNANCE` trigger category | sessions 084, 139, session-mmm-govgaps |
| PS-F-02 (PS-E-02) | Add `LIAISON_ADMIN` trigger category | session-141 |
| PS-F-03 (PS-E-03) | Add `GOVERNANCE_AUDIT` category (EXEMPT-classified) | session-088 |

**Handover requirements**:
- iaa-trigger-table.md updated with all 3 new categories
- Each category entry includes: name, description, triggering paths, IAA required (yes/no/exempt)
- IAA Pre-Brief on branch before CodexAdvisor begins
- Full IAA ceremony (KNOWLEDGE_GOVERNANCE category)
- CS2 merge authority

### PS-I Detail — Governance Liaison Session Memory Template Cleanup

**Target**: Governance Liaison session memory template (path to be confirmed by CodexAdvisor)
**Wave-start gate**: CS2 issue opened and assigned to CodexAdvisor-agent

| Change ID | Change | Source |
|-----------|--------|--------|
| PS-I-01 | Remove `iaa_invocation_result:` field entirely | sessions 030, 130, 233 |
| PS-I-02 | Update `advisory_phase: PHASE_A_ADVISORY` → `PHASE_B_BLOCKING` | sessions 086, 156, 280 |
| PS-I-03 | Add mandatory pre-IAA commit gate to liaison PREHANDOVER template | sessions 124, 144, 281 |
| PS-I-04 | Add SCOPE_DECLARATION fresh-overwrite instruction (`cat /dev/null > SCOPE_DECLARATION.md`) | sessions 143, 145, 282 |

**Handover requirements**:
- Template updated with all 4 changes
- No `PHASE_A_ADVISORY` references remain in template
- `iaa_invocation_result:` field removed
- IAA Pre-Brief on branch before CodexAdvisor begins
- Full IAA ceremony (KNOWLEDGE_GOVERNANCE category)
- CS2 merge authority

---

## 6. Batch 2 — Dependent Upgrades (After Batch 1 Merge)

**Start Gate**: Batch 1 merges confirmed by CS2. CS2 wave-start authorisation per sub-wave.
**All assignees**: CodexAdvisor-agent
**PS-A and PS-E can run in parallel** once their respective Batch 1 dependencies are merged.

### Batch 2 Issues to Open

| Issue Title | PS-Wave(s) | Assignee | Depends On | IAA Category | Priority |
|-------------|-----------|----------|-----------|--------------|----------|
| `[PS-A] Foreman PREHANDOVER template v1.8.0 — new sections` | PS-A | CodexAdvisor-agent | PS-B merged | KNOWLEDGE_GOVERNANCE | HIGH |
| `[PS-E] IAA Tier 2 overlays + invariants + checklists upgrades` | PS-E | CodexAdvisor-agent | PS-F merged | KNOWLEDGE_GOVERNANCE | HIGH |

### PS-A Detail — Foreman PREHANDOVER Template v1.7.0 → v1.8.0

**Target**: `.agent-workspace/foreman-v2/knowledge/prehandover-template.md`
**Dependency**: PS-B merged (PS-A references new A-rules from PS-B)
**Wave-start gate**: CS2 issue opened, PS-B merge confirmed

| Change ID | Change | Source |
|-----------|--------|--------|
| PS-A-01 | Add `## Ripple Assessment` mandatory stub section | A-023, sessions 110, 129, 147 |
| PS-A-02 | Add `## Canon File Changes` mandatory section | session-wave-disable-auto |
| PS-A-03 | Add `## CWT PASS` section (waves_covered, modules_covered, verdict) | sessions 436, 448 |
| PS-A-04 | Add `## Post-Wave NBR Entries` section stub | wave-reconciliation-checklist A-2 |
| PS-A-05 | Add `## Re-Audit Context` section for re-invocation template | session-cp-1-persona-gate |
| PS-A-06 | Add `## Prior Failures Re-Verification` section to re-invocation template | session-158 |
| PS-A-07 | Add `## Tier 2 Index Parity` checkpoint row to Pre-IAA Commit Gate | session-050-wave050 |
| PS-A-08 | Add A-031 carve-out template block (IAA ceremony artifacts) | sessions 146, 150, 151 |
| PS-A-09 | Clarify SCOPE_DECLARATION as mandatory bundle row with `cat /dev/null >` instruction | sessions 133, 140, 253 |
| PS-A-10 | Add doc-only wave variant note (lightweight ceremony path annotation) | sessions 149, 157b, 049 |

**Handover requirements**:
- prehandover-template.md updated to v1.8.0 with all 10 changes
- All new section stubs are non-empty (have placeholder guidance, not empty headers)
- Version bumped in template header
- IAA Pre-Brief on branch before CodexAdvisor begins
- Full IAA ceremony (KNOWLEDGE_GOVERNANCE category)
- CS2 merge authority

### PS-E Detail — IAA Tier 2 Overlays + Invariants + Checklists

**Target files**:
- `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md`
- `.agent-workspace/independent-assurance-agent/knowledge/iaa-core-invariants-checklist.md`
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` (version ref fix)
- (possible) `.agent-workspace/independent-assurance-agent/knowledge/niggle-pattern-library.md`

**Dependency**: PS-F merged (trigger table must exist before overlays reference categories)
**Wave-start gate**: CS2 issue opened, PS-F merge confirmed

| Change ID | Change | Target File |
|-----------|--------|-------------|
| PS-E-04 | Add `OVL-CI-005` S-033 Inherent Limitation Exception note | iaa-category-overlays.md |
| PS-E-05 | Add `OVL-CI-006` check: GitHub Actions jobs must have explicit `permissions` block | iaa-category-overlays.md |
| PS-E-06 | Add `OVL-AM-004` candidate: symmetric constraint enforcement DB/backend/frontend | iaa-category-overlays.md |
| PS-E-07 | Add `OVL-INJ-001` carve-out note for CodexAdvisor direct-task waves | iaa-category-overlays.md |
| PS-E-08 | Codify `CORE-007` PENDING exception for `## IAA Agent Response (verbatim)` | iaa-core-invariants-checklist.md |
| PS-E-09 | Add `A-026` self-referential ceremony commit trap note re: A-031 carve-out | iaa-core-invariants-checklist.md |
| PS-E-10 | Add pre-brief phase-0 logic: auto-flag CWT when batch closes all remaining GAPs | iaa-core-invariants-checklist.md |
| PS-E-11 | Add A-023 ripple assessment section stub to PREHANDOVER validation checks | iaa-core-invariants-checklist.md |
| PS-E-12 | Add SCOPE_DECLARATION ASCII hyphen vs em-dash validation note | iaa-core-invariants-checklist.md / niggle-pattern-library.md |
| PS-E-VR | Fix stale version reference: `AGENT_HANDOVER_AUTOMATION.md` v1.0.0 → v1.1.4 in index.md | index.md |
| NB-9 | Add PBFAG gate entry to IAA FAIL-ONLY-ONCE.md (PRE_BUILD_STAGE_MODEL_CANON published 2026-04-05) | iaa-knowledge (path TBC) |

**Handover requirements**:
- All 9 overlay/invariant changes plus version ref fix applied
- `iaa-category-overlays.md` has at least OVL-CI-005, OVL-CI-006, OVL-AM-004, OVL-INJ-001
- `iaa-core-invariants-checklist.md` has CORE-007 PENDING exception documented
- index.md version ref updated to v1.1.4
- IAA Pre-Brief on branch before CodexAdvisor begins
- Full IAA ceremony (KNOWLEDGE_GOVERNANCE category)
- CS2 merge authority

---

## 7. Batch 3 — Downstream Upgrades (After Batch 2 Merge)

**Start Gate**: Batch 2 merges confirmed by CS2. CS2 wave-start authorisation per sub-wave.
**PS-C, PS-D, PS-H can run in parallel** once their respective Batch 2 dependencies are merged.

### Batch 3 Issues to Open

| Issue Title | PS-Wave(s) | Assignee | Depends On | IAA Category | Priority |
|-------------|-----------|----------|-----------|--------------|----------|
| `[PS-C] New Foreman Tier 2 knowledge files (wave-issue-templates, kickoff, KNOWN_FAILING_TESTS, Pre-Commission gate)` | PS-C | CodexAdvisor-agent | PS-A + PS-B merged | KNOWLEDGE_GOVERNANCE | MEDIUM |
| `[PS-D] Foreman Wave Reconciliation Checklist v1.2.0` | PS-D | CodexAdvisor-agent | PS-A merged | KNOWLEDGE_GOVERNANCE | MEDIUM |
| `[PS-H] CI workflows: prebrief gate, permissions check, CANON hash check` | PS-H | Specialist builder (ci-type) | PS-E merged | CI_WORKFLOW | MEDIUM |

### PS-C Detail — New Foreman Tier 2 Knowledge Files

**Target dir**: `.agent-workspace/foreman-v2/knowledge/`
**Dependency**: PS-A + PS-B merged

| Change ID | New File | Purpose | Source |
|-----------|----------|---------|--------|
| PS-C-01 | `wave-issue-templates.md` | Wave-start issue template library: UX Wiring, FRS, TRS, Architecture, QA-to-Red, PBFAG | session-mmm-mat-harvest, parking item 1 |
| PS-C-02 | `wave-kickoff-template.md` | Orchestration kickoff checklist: pre-brief path, builder appointment link, Red QA count, arch freeze confirmation, delegation chain | S-030, parking item 2 |
| PS-C-03 | `KNOWN_FAILING_TESTS.md` | Pre-existing test failure registry: test ID, file, reason, wave introduced, status | IAA session-080, parking item 8 |
| PS-C-04 | Pre-Commission Classification gate section in `domain-flag-index.md` | IMPLEMENT / VERIFY / N/A-CANDIDATE step in Phase 2 Step 2.4 | session-wave15r-impl, parking item 4 |

**Handover requirements**:
- All 4 files created (PS-C-01 to PS-C-03 as new files; PS-C-04 as section addition to existing file)
- Each new file has complete non-stub content
- index.md in foreman-v2/knowledge updated to list new files with versions
- IAA Pre-Brief on branch before CodexAdvisor begins
- Full IAA ceremony (KNOWLEDGE_GOVERNANCE category)
- CS2 merge authority

### PS-D Detail — Wave Reconciliation Checklist v1.1.0 → v1.2.0

**Target**: `.agent-workspace/foreman-v2/knowledge/wave-reconciliation-checklist.md`
**Dependency**: PS-A merged (references new template sections)

| Change ID | Change | Source |
|-----------|--------|--------|
| PS-D-01 | Add step C-3: confirm IAA pre-brief committed as first artifact on branch | session-048-audit |
| PS-D-02 | Add Section E: Implementation Plan Staleness check at wave close | session-wave14-execution-start, parking item 7 |

**Handover requirements**:
- wave-reconciliation-checklist.md updated to v1.2.0 with both changes
- Step C-3 is actionable (not a comment)
- Section E has a concrete staleness check step
- IAA Pre-Brief on branch before CodexAdvisor begins
- Full IAA ceremony (KNOWLEDGE_GOVERNANCE category)
- CS2 merge authority

### PS-H Detail — CI Workflow Additions

**Target**: `.github/workflows/` (extensions or new workflow files)
**Dependency**: PS-E merged (overlays define the CI check specifications)
**Assignee**: Specialist builder — ci-type (Foreman to identify available CI specialist)
**IAA Category**: CI_WORKFLOW — MANDATORY ceremony

> ⚠️ **Note**: PS-H requires a CI specialist builder. If no CI-type builder is inducted
> in the ISMS ecosystem at wave-start time, Foreman MUST HALT (A-007) and escalate to CS2.

| Change ID | Target | Purpose | Source |
|-----------|--------|---------|--------|
| PS-H-01 | Extend `preflight-evidence-gate.yml` or new `iaa-prebrief-existence-check.yml` | Fail PR when implementation file changes present but no `iaa-prebrief-*.md` on branch | S-023, S-028, parking item 6 |
| PS-H-02 | Extend `agent-contract-audit.yml` or new `workflow-permissions-check.yml` | Enforce explicit `permissions` block per GitHub Actions job (OVL-CI-006) | sessions 149, 289 |
| PS-H-03 | Add step to `ripple-integration.yml` | Phase 0 inventory health check: compare CANON_INVENTORY hashes vs actual file content | session-035 |

**Handover requirements**:
- All 3 CI changes implemented and CI-green
- Each new/modified workflow has explicit `permissions:` on every job (OVL-CI-006)
- Tests/evidence confirming new gates trigger on appropriate conditions
- IAA Pre-Brief on branch before builder begins (CI_WORKFLOW category — full ceremony)
- Full IAA ceremony (CI_WORKFLOW category)
- CS2 merge authority

---

## 8. CS2 Decision Gate — PS-G

**Requirement**: CS2 must record DEC-PS-G before PS-G work begins.
**Status**: ⏳ PENDING CS2 DECISION

PS-G may be evaluated by CS2 **at any time** — it is not blocked by Batches 1–3.
PS-G implementation (if approved) requires:
- PS-A and PS-E both merged first (PS-G references new ceremony variant)
- CodexAdvisor-agent as implementer
- IAA category: CANON_GOVERNANCE (if new/amended governance canon document)
- Full IAA ceremony + CS2 merge authority

**If DEC-PS-G is DECLINED**: PS-G scope is permanently closed. Full ceremony applies to
all MMM documentation waves. No change to current protocol.

**If DEC-PS-G is APPROVED**:
- Open GitHub issue: `[PS-G] Lightweight doc-ceremony path — AGENT_HANDOVER_DOC_WAVE_VARIANT`
- Assign: CodexAdvisor-agent
- Start gate: DEC-PS-G recorded + PS-A + PS-E merged

---

## 9. Dependency / Sequencing Map

```
Phase:   IMMEDIATE          │  AFTER BATCH 1    │  AFTER BATCH 2    │  CS2 GATE
─────────────────────────────────────────────────────────────────────────────────
         PS-B ──────────┐   │                   │                   │
         (FAIL-ONLY-    │   │  PS-A ─────┐      │  PS-C             │
          ONCE v4.2)    │   │  (after    │      │  (after PS-A+B)   │
                        │   │   PS-B)    │      │                   │
         PS-F ──────────┤   │            │      │  PS-D             │
         (IAA trigger   │   │  PS-E ─┐  │      │  (after PS-A)     │
          table)        │   │  (after│  │      │                   │
                        │   │   PS-F)│  └──────┤  PS-H             │  PS-G
         PS-I ──────────┘   │        └─────────┤  (after PS-E)     │  (CS2 DEC
         (liaison           │                   │                   │   + PS-A
          template)         │                   │                   │   + PS-E)
─────────────────────────────────────────────────────────────────────────────────
         ↓ CS2 merge       │   ↓ CS2 merge     │   ↓ CS2 merge     │   ↓ CS2
         per sub-wave      │   per sub-wave     │   per sub-wave    │   decision
```

**What can be parallelised:**
- Within Batch 1: PS-B, PS-F, PS-I are fully independent (different files, different agents)
- Within Batch 2: PS-A and PS-E are independent once their Batch 1 deps are merged
- Within Batch 3: PS-C, PS-D, and PS-H are independent once their Batch 2 deps are merged

**Sequential constraints (hard):**
- PS-A cannot start until PS-B is merged
- PS-E cannot start until PS-F is merged
- PS-C cannot start until PS-A AND PS-B are both merged
- PS-D cannot start until PS-A is merged
- PS-H cannot start until PS-E is merged
- PS-G cannot start until DEC-PS-G recorded AND PS-A + PS-E merged

---

## 10. Wave Governance Requirements per Batch

Each sub-wave must independently satisfy:

| Requirement | Authority |
|-------------|-----------|
| GitHub issue opened by CS2 (or via Foreman with CS2 wave-start authorisation) | A-035 |
| IAA Pre-Brief artifact on branch before CodexAdvisor/builder begins | A-031 |
| wave-current-tasks.md updated with new wave slug | WAVE-CURRENT-TASKS-PROTOCOL |
| Full IAA ceremony (KNOWLEDGE_GOVERNANCE or CI_WORKFLOW as applicable) | A-010, A-014 |
| IAA token committed to `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md` | A-028, §4.3b |
| PREHANDOVER proof committed before `report_progress` | A-016 |
| CS2 review and merge (Foreman NEVER merges directly) | NO-PUSH-MAIN-001 |

---

## 11. Dashboard / Progress Tracker

| PS-Wave | Batch | Assignee | Status | Blocked By | Issue # | Notes |
|---------|-------|----------|--------|-----------|---------|-------|
| PS-B | 1 | CodexAdvisor-agent | ⏳ AWAITING CS2 WAVE-START | — | TBC | First to open |
| PS-F | 1 | CodexAdvisor-agent | ⏳ AWAITING CS2 WAVE-START | — | TBC | Parallel with PS-B |
| PS-I | 1 | CodexAdvisor-agent | ⏳ AWAITING CS2 WAVE-START | — | TBC | Parallel with PS-B/F |
| PS-A | 2 | CodexAdvisor-agent | ⏳ BLOCKED — awaiting PS-B merge | PS-B | TBC | — |
| PS-E | 2 | CodexAdvisor-agent | ⏳ BLOCKED — awaiting PS-F merge | PS-F | TBC | — |
| PS-C | 3 | CodexAdvisor-agent | ⏳ BLOCKED — awaiting PS-A + PS-B | PS-A, PS-B | TBC | — |
| PS-D | 3 | CodexAdvisor-agent | ⏳ BLOCKED — awaiting PS-A | PS-A | TBC | — |
| PS-H | 3 | CI specialist | ⏳ BLOCKED — awaiting PS-E | PS-E | TBC | Needs CI builder |
| PS-G | CS2 gate | CodexAdvisor-agent | ⏳ PENDING DEC-PS-G | DEC-PS-G | TBC | CS2 approval first |

*This dashboard is updated by Foreman at each wave-start and wave-close event.*

---

## 12. Relationship to MMM Build

Upon completion of all blocking items and PS-waves, Foreman is cleared to begin MMM build:

```
Pre-condition gates:
  BLK-1: CS2 approves MMM_app_description.md v0.2.0  ← CS2 action
  BLK-5: CS2 opens MMM wave-start authorisation issue ← CS2 action (after BLK-1)
  PS-B, PS-F, PS-I merged                             ← Batch 1
  PS-A, PS-E merged                                   ← Batch 2
  PS-C, PS-D merged                                   ← Batch 3 (recommended before build)
  PS-H merged (optional — CI enforcement)             ← Batch 3

MMM Build Sequence:
  Stage 1:  App Description          ← CS2 sign-off (BLK-1)
  Stage 2:  UX Workflow & Wiring Spec ← First Foreman-delegated MMM doc wave
  Stage 3:  FRS                       ← After Stage 2 IAA-PASS
  Stage 4:  TRS                       ← After Stage 3 IAA-PASS
  Stage 5:  Architecture              ← After Stage 4 IAA-PASS
  Stage 6:  QA-to-Red                 ← After Stage 5 IAA-PASS
  Stage 7:  PBFAG                     ← After Stage 6 IAA-PASS
  Stage 8:  Implementation Plan       ← After Stage 7 IAA-PASS
  Stage 9:  Builder Checklist         ← After Stage 8 IAA-PASS
  Stage 10: IAA Pre-Brief             ← After Stage 9 IAA-PASS
  Stage 11: Builder Appointment       ← After Stage 10 + CS2 wave-start auth
  Stage 12: Implementation            ← Governed builder waves begin
```

> Each MMM stage transition requires CS2 wave-start authorisation per
> `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0.

---

*End of document — IMPL-PLAN-MMM-PRE-UPGRADE-v1.0.0*
*Filed: 2026-04-07 | Foreman session: session-158 | Authority: CS2 (@APGI-cmy)*
*Strategy source: PRE_MMM_IMPLEMENTATION_UPGRADE_STRATEGY.md v1.0.0*
