# Pre-MMM Implementation Upgrade Strategy

**Document ID**: PRE-MMM-UPGRADE-STRATEGY-v1.0.0  
**Status**: ACTIVE — Awaiting CS2 Wave-Start Authorisation per Wave  
**Version**: 1.0.0  
**Created**: 2026-04-07  
**Author**: CS2 (Johan Ras / @APGI-cmy) — compiled via Copilot strategic session  
**Governed by**: `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0  
**Related Issue**: [#1247 — Pre-MMM Build Readiness](https://github.com/APGI-cmy/maturion-isms/issues/1247)  
**Authority**: CS2 sign-off required before each wave is started

---

## 1. Purpose & Context

This document records the full set of governance, knowledge, and tooling upgrades that must be
implemented **before** the MMM (Maturion Maturity Module) build can begin in earnest — specifically
before the Foreman is authorised to open the MMM Stage 2 (UX Workflow & Wiring Spec) wave.

These upgrades were identified from three sources:
1. **Deep research audit** — full readiness scan of `maturion-isms` conducted 2026-04-07
2. **Parking station analysis** — systematic review of all S-series suggestions and staged
   improvements logged across Foreman and IAA agent session memory
3. **Structured Readiness Summary** — delivered by deep research task
   `6c9f6845-b7f3-4b28-8ef5-14ec8f304706`

The upgrades are organised into **9 implementation waves (PS-A through PS-I)**, each independently
actionable and delegatable by Foreman. Waves have sequencing dependencies noted below.

---

## 2. Blocking Items from Readiness Audit (Must Resolve First)

These are CS2-gated blockers that must be resolved *before* any PS-wave work can be instructed
to agents. They are recorded here for traceability; the actioning of #1247 (now merged) covers
most of the agent-executable items.

| ID | Blocker | Owner | Status |
|----|---------|-------|--------|
| BLK-1 | `MMM_app_description.md` v0.2.0 pending CS2 formal approval (Stage 1 gate) | CS2 | ⏳ OPEN |
| BLK-2 | IAA Tier 2 not updated for PBFAG gate (PRE_BUILD_STAGE_MODEL_CANON.md compliance) | CodexAdvisor → CS2 | ⏳ In #1247 |
| BLK-3 | IAA Tier 2 not updated for MANDATORY_CROSS_APP_COMPONENTS | CodexAdvisor → CS2 | ⏳ In #1247 |
| BLK-4 | `CONSUMER_REPO_REGISTRY.json` not layered down to `maturion-isms` | Governance Liaison → CS2 | ⏳ In #1247 |
| BLK-5 | MMM wave-start authorisation issue not yet opened by CS2 | CS2 | ⏳ OPEN — after BLK-1 |
| BLK-6 | Active wave is `cl6-relaunch-20260406`; sequential wave governance applies | CS2 → Foreman | ⏳ OPEN |

---

## 3. Implementation Waves

### PS-A — Foreman PREHANDOVER Template Upgrades

**Target file**: `.agent-workspace/foreman-v2/knowledge/prehandover-template.md`  
**Current version**: v1.7.0 → **Target**: v1.8.0  
**Assignee**: CodexAdvisor-agent  
**Dependencies**: PS-B (must complete first — PS-A references new A-rules from PS-B)  
**Authority**: CS2 wave-start required

| ID | Change | Source |
|----|--------|--------|
| PS-A-01 | Add `## Ripple Assessment` mandatory stub section | A-023, sessions 110, 129, 147 |
| PS-A-02 | Add `## Canon File Changes` mandatory section | session-wave-disable-automatic-injections-20260311 |
| PS-A-03 | Add `## CWT PASS` section (waves_covered, modules_covered, verdict) | sessions 436, 448 |
| PS-A-04 | Add `## Post-Wave NBR Entries` section stub | wave-reconciliation-checklist.md A-2 cross-ref |
| PS-A-05 | Add `## Re-Audit Context` section for re-invocation | session-cp-1-persona-gate-closure-20260313 |
| PS-A-06 | Add `## Prior Failures Re-Verification` section to re-invocation template | session-158 |
| PS-A-07 | Add `## Tier 2 Index Parity` checkpoint row to Pre-IAA Commit Gate | session-050-wave050 |
| PS-A-08 | Add A-031 carve-out template block (IAA ceremony artifacts) | sessions 146, 150, 151 |
| PS-A-09 | Clarify SCOPE_DECLARATION as mandatory bundle row with explicit `cat /dev/null >` instruction | sessions 133, 140, 253 |
| PS-A-10 | Add doc-only wave variant note (lightweight ceremony path annotation) | sessions 149, 157b, session-049 |

---

### PS-B — Foreman FAIL-ONLY-ONCE Deduplication & New Rules

**Target file**: `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`  
**Current version**: v4.1.0 → **Target**: v4.2.0  
**Assignee**: CodexAdvisor-agent  
**Dependencies**: None — can start immediately  
**Authority**: CS2 wave-start required

| ID | Change | Source |
|----|--------|--------|
| PS-B-01 | Rename second `A-004` → `A-018` (duplicate rule ID fix) | Sessions 028–035, 8 flags |
| PS-B-02 | Rename second `A-016` → `A-019` (duplicate rule ID fix) | Sessions 028–035, 8 flags |
| PS-B-03 | Add `A-033`: Foreman ceremony files must be declared in SCOPE_DECLARATION; A-031 carve-out for IAA artifacts applies | session-postfcwt-prodfails-20260306 |
| PS-B-04 | Add `A-034`: Canon file modifications require CANON_INVENTORY.json update in same wave | session-wave-disable-automatic-injections-20260311 |
| PS-B-05 | Codify `A-035` DELEGATION-ISSUE-REQUIRED: every builder delegation requires a GitHub issue before work begins | session-wave-disable-automatic-injections-20260311-R2 |
| PS-B-06 | Add corrective action completion marker convention: `[ ]` / `[x]` for pending/complete items in incident log | session-ci-gateway-fix-20260312 |

---

### PS-C — New Foreman Tier 2 Knowledge Files

**Target dir**: `.agent-workspace/foreman-v2/knowledge/`  
**Assignee**: CodexAdvisor-agent  
**Dependencies**: PS-A and PS-B must complete first  
**Authority**: CS2 wave-start required

| ID | New File | Purpose | Source |
|----|----------|---------|--------|
| PS-C-01 | `wave-issue-templates.md` | Wave-start issue template library: UX Wiring, FRS, TRS, Architecture, QA-to-Red, PBFAG | session-mmm-mat-harvest, parking item 1 |
| PS-C-02 | `wave-kickoff-template.md` | Orchestration kickoff checklist: pre-brief path, builder appointment link, Red QA count, arch freeze confirmation, delegation chain | S-030, parking item 2 |
| PS-C-03 | `KNOWN_FAILING_TESTS.md` | Pre-existing test failure registry: test ID, file, reason, wave introduced, status | IAA session-080, parking item 8 |
| PS-C-04 | Pre-Commission Classification gate section in `domain-flag-index.md` | IMPLEMENT / VERIFY / N/A-CANDIDATE step in Phase 2 Step 2.4 | session-wave15r-impl-20260308, parking item 4 |

---

### PS-D — Foreman Wave Reconciliation Checklist Upgrades

**Target file**: `.agent-workspace/foreman-v2/knowledge/wave-reconciliation-checklist.md`  
**Current version**: v1.1.0 → **Target**: v1.2.0  
**Assignee**: CodexAdvisor-agent  
**Dependencies**: PS-A (references new template sections)  
**Authority**: CS2 wave-start required

| ID | Change | Source |
|----|--------|--------|
| PS-D-01 | Add step C-3: confirm IAA pre-brief committed as first artifact on branch | session-048-audit-20260318 |
| PS-D-02 | Add Section E: Implementation Plan Staleness check — verify execution plan/CEP version is current at wave close | session-wave14-execution-start-20260313, parking item 7 |

---

### PS-E — IAA Tier 2 Knowledge Upgrades (Overlays, Invariants, Checklists)

**Target dir**: `.agent-workspace/independent-assurance-agent/knowledge/`  
**Assignee**: CodexAdvisor-agent  
**Dependencies**: PS-F (trigger table) must complete first  
**Authority**: CS2 wave-start required (KNOWLEDGE_GOVERNANCE category per A-015)

| ID | Target File | Change | Source |
|----|-------------|--------|--------|
| PS-E-04 | `iaa-category-overlays.md` | Add `OVL-CI-005` S-033 Inherent Limitation Exception note for `ready_for_review`-triggered workflows | sessions 157, 334, 468 |
| PS-E-05 | `iaa-category-overlays.md` | Add `OVL-CI-006` check: GitHub Actions jobs must have explicit `permissions` block | sessions 149, 150, 289, 291 |
| PS-E-06 | `iaa-category-overlays.md` | Add `OVL-AM-004` candidate: symmetric constraint enforcement across DB/backend/frontend layers | session-138 |
| PS-E-07 | `iaa-category-overlays.md` | Add `OVL-INJ-001` carve-out note for CodexAdvisor direct-task waves with no builder delegation | session-KG-overlays-20260318 |
| PS-E-08 | `iaa-core-invariants-checklist.md` | Codify `CORE-007` PENDING exception: exempt `## IAA Agent Response (verbatim)` PENDING annotation from CORE-007 check | sessions 084, 138–141 |
| PS-E-09 | `iaa-core-invariants-checklist.md` | Add `A-026` self-referential ceremony commit trap note re: A-031 SCOPE_DECLARATION carve-out | session-wave-disable-automatic-injections-20260311-R2 |
| PS-E-10 | `iaa-core-invariants-checklist.md` / pre-brief section | Add pre-brief phase-0 logic: auto-flag CWT as QUALIFYING when batch closes all remaining wave GAPs | sessions 147, 149 |
| PS-E-11 | `iaa-core-invariants-checklist.md` | Add A-023 ripple assessment section stub to PREHANDOVER validation checks | sessions 110, 129, 194 |
| PS-E-12 | `iaa-core-invariants-checklist.md` / `niggle-pattern-library.md` | Add SCOPE_DECLARATION ASCII hyphen vs em-dash validation note | session-135, session-cwt-envvars |

> **Note**: PS-E also includes the stale version reference fix: `AGENT_HANDOVER_AUTOMATION.md`
> cited as v1.0.0 in `index.md` must be updated to v1.1.4.

---

### PS-F — IAA Trigger Table New Categories

**Target file**: `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md`  
**Assignee**: CodexAdvisor-agent  
**Dependencies**: None — can start immediately (parallel to PS-B)  
**Authority**: CS2 wave-start required

| ID | Change | Source |
|----|--------|--------|
| PS-E-01 | Add `KNOWLEDGE_GOVERNANCE` trigger category | sessions 084, 139, session-mmm-govgaps |
| PS-E-02 | Add `LIAISON_ADMIN` trigger category (governance tracking files: governance/alignment/, sync_state.json) | session-141 |
| PS-E-03 | Add `GOVERNANCE_AUDIT` category (EXEMPT-classified) to reduce classification overhead | session-088 |

> *Note: IDs labelled PS-E-01/02/03 in the source; isolated here as PS-F because the trigger
> table can and should be updated independently of the overlays for governance tractability.*

---

### PS-G — Governance Canon: Lightweight Doc-Ceremony Path

**Scope**: New or amended canon document; ripple to ISMS required  
**Assignee**: CS2 decision → CodexAdvisor-agent (if approved) → governance-liaison-isms (layer-down)  
**Dependencies**: PS-A, PS-E must complete first  
**Authority**: **CS2 decision gate — work may NOT begin until CS2 explicitly approves**

**Description**: Define a formally governed lightweight ceremony track for documentation-only
waves (UX Wiring Spec, FRS, TRS, Architecture Spec, QA-to-Red). Amend
`AGENT_HANDOVER_AUTOMATION.md` (or create `AGENT_HANDOVER_DOC_WAVE_VARIANT.md`) to specify:
- Which OPOJD sub-checks are N/A for doc-only waves
- Which QP evaluation criteria are simplified
- Which IAA overlay applies (candidate: new `DOC_GOVERNANCE` overlay category)
- When this track may be activated (CS2-gated per wave)

**Impact if approved**: Significantly accelerates MMM pre-build stages 2–7. Each stage currently
requires full PREHANDOVER + IAA + token ceremony. A doc-ceremony variant removes the QP overhead
for non-implementation waves while maintaining governance accountability.

**Impact if declined**: Full ceremony applies to all MMM doc waves. No change to current protocol.

> ⚠️ **CS2 Decision Required**: Record decision as a comment on this document or as a dedicated
> GitHub issue. Until recorded, PS-G scope is BLOCKED.

---

### PS-H — CI / Workflow Additions

**Assignee**: Specialist builder (ci-type) via Foreman delegation  
**Dependencies**: PS-E must complete first (overlays define CI check specifications)  
**Authority**: CS2 wave-start required + full IAA ceremony (CI_WORKFLOW category)

| ID | New/Modified Workflow | Purpose | Source |
|----|----------------------|---------|--------|
| PS-H-01 | Extend `preflight-evidence-gate.yml` or new `iaa-prebrief-existence-check.yml` | Fail PR when implementation file changes present but no `iaa-prebrief-*.md` on branch | S-023, S-028, sessions 355, 408, parking item 6 |
| PS-H-02 | Extend `agent-contract-audit.yml` or new `workflow-permissions-check.yml` | Enforce explicit `permissions` block per GitHub Actions job (OVL-CI-006) | sessions 149, 289 |
| PS-H-03 | Add step to `ripple-integration.yml` | Phase 0 inventory health check: compare CANON_INVENTORY hashes vs actual file content | session-035 |

---

### PS-I — Governance Liaison Session Memory Template Cleanup

**Target**: `governance-liaison-isms` agent session memory template  
**Assignee**: CodexAdvisor-agent  
**Dependencies**: None — parallel to PS-A (independent agent file)  
**Authority**: CS2 wave-start required (agent template modification)

| ID | Change | Source |
|----|--------|--------|
| PS-I-01 | Remove `iaa_invocation_result:` field from template entirely (enables INC-IAA-SKIP self-assessment — prohibited) | sessions 030, 130, 233 |
| PS-I-02 | Update `advisory_phase: PHASE_A_ADVISORY` → `PHASE_B_BLOCKING` (stale field recurring across sessions) | sessions 086, 156, 157, 280, 328 |
| PS-I-03 | Add mandatory pre-IAA commit gate to liaison PREHANDOVER template (git status + git log evidence) | sessions 124, 144, 281 |
| PS-I-04 | Add SCOPE_DECLARATION fresh-overwrite instruction (`cat /dev/null > SCOPE_DECLARATION.md` step) | sessions 143, 145, 282 |

---

## 4. Non-Blocking Governance Gaps (Tracked for Completeness)

These items do not block MMM but should be actioned in the next available governance wave:

| ID | Gap | Notes |
|----|-----|-------|
| NB-1 | `module.manifest.json` references "risk-management" slug | In #1247 scope |
| NB-2 | `BUILD_PROGRESS_TRACKER.md` references "Risk Management" | In #1247 scope |
| NB-3 | `architecture.md` in `02-architecture/` is a wrong-module stub | In #1247 scope |
| NB-4 | `02-architecture/capabilities/` legacy risk-management dirs | CS2 direction needed: archive vs delete |
| NB-5 | IAA `index.md` cites `AGENT_HANDOVER_AUTOMATION.md` as v1.0.0 (actual: v1.1.4) | Include in PS-E wave |
| NB-6 | IAA contract SHA-256 mismatch (ESC-AGENTFILE-6523FE8D, ESCALATED_TO_CS2 since 2026-03-04) | CS2 + CodexAdvisor |
| NB-7 | `governance-repo-administrator-v2.agent.md` decision pending (Issue #1228) | CS2 decision |
| NB-8 | 25+ S-series Foreman FAIL-ONLY-ONCE improvements OPEN (S-001 through S-034) | Batch via Foreman governance wave post-MMM-FRS |
| NB-9 | IAA FAIL-ONLY-ONCE.md v2.5.0 — no PBFAG gate entry (PRE_BUILD_STAGE_MODEL_CANON published 2026-04-05) | Include in PS-E wave |

---

## 5. Sequencing Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  IMMEDIATE (no dependencies)                                                │
│  PS-B  — Foreman FAIL-ONLY-ONCE dedup + new rules (A-033/034/035)          │
│  PS-F  — IAA Trigger Table: KNOWLEDGE_GOVERNANCE / LIAISON_ADMIN / AUDIT   │
│  PS-I  — Governance Liaison session memory template cleanup                 │
└─────────────────┬───────────────────────────┬───────────────────────────────┘
                  │                           │
                  ▼                           ▼
┌─────────────────────────┐   ┌─────────────────────────────────────────────┐
│  PS-A (after PS-B)       │   │  PS-E (after PS-F)                          │
│  Foreman PREHANDOVER     │   │  IAA Overlays + Invariants + Checklists     │
│  template v1.7→v1.8      │   │  + version ref fix (index.md v1.0→v1.1.4)  │
└───────────┬─────────────┘   └──────────────────┬──────────────────────────┘
            │                                     │
            ▼                                     ▼
┌─────────────────────────┐   ┌─────────────────────────────────────────────┐
│  PS-D (after PS-A)       │   │  PS-H (after PS-E)                          │
│  Wave Reconciliation     │   │  CI workflow additions                       │
│  Checklist v1.1→v1.2     │   │  (IAA prebrief gate, permissions check,     │
└─────────────────────────┘   │   CANON hash check)                          │
                              └─────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PS-C (after PS-A + PS-B)                                                  │
│  New Foreman Tier 2 knowledge files                                        │
│  (wave-issue-templates, kickoff template, KNOWN_FAILING_TESTS,             │
│   Pre-Commission Classification gate)                                      │
└─────────────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PS-G — CS2 DECISION GATE (can be evaluated at any time)                  │
│  Lightweight doc-ceremony path for MMM documentation waves                │
│  Requires: PS-A + PS-E complete before implementation if APPROVED          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. CS2 Decision Register

The following decisions must be explicitly recorded by CS2 before associated waves begin:

| Decision ID | Item | Wave | Status |
|-------------|------|------|--------|
| DEC-PS-G | Approve or decline lightweight doc-ceremony path for MMM doc waves | PS-G | ⏳ PENDING |
| DEC-PS-BLK1 | Formal approval of `MMM_app_description.md` v0.2.0 (Stage 1 gate) | BLK-1 | ⏳ PENDING |
| DEC-NB7 | `governance-repo-administrator-v2.agent.md` — introduce or formally defer | NB-7 | ⏳ PENDING |
| DEC-NB4 | Legacy `02-architecture/capabilities/` dirs — archive vs delete | NB-4 | ⏳ PENDING |

---

## 7. Implementation Issue Roadmap

Once this strategy document is filed and CS2 confirms the sequencing, the following issues will
be created for Foreman to orchestrate (each is a delegation-target issue per A-035):

| Issue | Wave(s) | Assignee | Priority |
|-------|---------|----------|----------|
| `[PS-B + PS-F] FAIL-ONLY-ONCE dedup + IAA trigger table upgrades` | PS-B, PS-F | CodexAdvisor-agent | HIGH — start first |
| `[PS-I] Governance Liaison session memory template cleanup` | PS-I | CodexAdvisor-agent | HIGH — parallel |
| `[PS-A + PS-D] Foreman PREHANDOVER template v1.8 + Wave Reconciliation checklist v1.2` | PS-A, PS-D | CodexAdvisor-agent | HIGH — after PS-B |
| `[PS-E] IAA Tier 2 overlays, invariants, checklist upgrades` | PS-E | CodexAdvisor-agent | HIGH — after PS-F |
| `[PS-C] New Foreman Tier 2 knowledge files` | PS-C | CodexAdvisor-agent | MEDIUM — after PS-A/B |
| `[PS-H] CI workflow: prebrief gate, permissions check, CANON hash` | PS-H | Specialist builder | MEDIUM — after PS-E |
| `[PS-G] CS2 Decision: lightweight doc-ceremony path` | PS-G | CS2 decision | HIGH if approved |

---

## 8. Relationship to MMM Build

Once all **blocking items (BLK-1 through BLK-6)** are resolved, and waves **PS-B, PS-F, PS-I,
PS-A, PS-E** are complete, Foreman is cleared to begin the MMM build sequence:

```
Stage 1: App Description          — CS2 sign-off (BLK-1)
Stage 2: UX Workflow & Wiring Spec — First Foreman-delegated MMM wave
Stage 3: FRS                       — After Stage 2 IAA-PASS
Stage 4: TRS                       — After Stage 3 IAA-PASS
Stage 5: Architecture              — After Stage 4 IAA-PASS
Stage 6: QA-to-Red                 — After Stage 5 IAA-PASS
Stage 7: PBFAG                     — After Stage 6 IAA-PASS
Stage 8: Implementation Plan       — After Stage 7 IAA-PASS
Stage 9: Builder Checklist         — After Stage 8 IAA-PASS
Stage 10: IAA Pre-Brief            — After Stage 9 IAA-PASS
Stage 11: Builder Appointment      — After Stage 10 CS2 wave-start auth
Stage 12: Implementation           — Governed builder waves begin
```

> Each stage transition requires CS2 wave-start authorisation (GitHub issue) per
> `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 and `FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md`.

---

*End of document — PRE-MMM-UPGRADE-STRATEGY-v1.0.0*  
*Filed: 2026-04-07 | CS2 authority: @APGI-cmy | Governed by LIVING_AGENT_SYSTEM.md v6.2.0*
