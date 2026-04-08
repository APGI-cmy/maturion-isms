# IAA Pre-Brief — Wave: mmm-harvest-map | Issue #1300

**Artifact Type**: IAA Pre-Brief (Phase 0 — Wave Start)
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.5.0)
**Wave**: mmm-harvest-map
**Issue**: maturion-isms#1300
**Branch**: copilot/produce-mat-roadmap-transition-matrix
**Date Produced**: 2026-04-08
**Produced By**: independent-assurance-agent (Phase 0 — Pre-Brief mode)
**Adoption Phase**: PHASE_B_BLOCKING
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Phase 0 Invocation Confirmation

This Pre-Brief was triggered by a comment on issue #1300 requesting IAA Pre-Brief
declaration for wave `mmm-harvest-map`. This is Phase 0 (Pre-Brief) mode. IAA does NOT
execute Phases 1–4 assurance here — those are deferred until handover invocation.

**Invoking party**: Foreman / CS2 (issue #1300 comment — `[IAA PRE-BRIEF REQUEST]`)
**Phase 0 invocation mode**: CONFIRMED

---

## Step 0.2 — Wave Current Tasks Reading

`wave-current-tasks.md` read. Confirmed active wave at the time of reading is
`opojd-comment-only-copilot-20260408` (issue #1286) — a separate in-flight wave.

This Pre-Brief declares the IAA framework for the **mmm-harvest-map** wave (issue #1300)
which runs concurrently on branch `copilot/produce-mat-roadmap-transition-matrix`.

**Wave declared tasks (from issue #1300)**:
| Task ID | Description | Producer |
|---------|-------------|---------|
| MMM-HM-001 | Create `modules/MMM/harvest-map/harvest-map.md` — Harvest Map and Ownership Transition Matrix | foreman-v2-agent |

---

## Step 0.3 — Task Classification

### Task: MMM-HM-001 — Harvest Map Artifact Creation

**Deliverable**: `modules/MMM/harvest-map/harvest-map.md` — new markdown planning artifact
**Code changes**: NONE
**Schema changes**: NONE
**CI/workflow changes**: NONE
**Agent contract changes**: NONE
**Canon file changes**: NONE

#### Trigger Table Decision Flow Applied

| Step | Question | Answer |
|------|----------|--------|
| 1 | `.github/agents/` changes? | NO |
| 2 | `governance/canon/` changes? | NO |
| 3 | `.github/workflows/` changes? | NO |
| 4 | AAWP/MAT deliverable label or path? | NO — path is `modules/MMM/harvest-map/`, not `modules/mat/` or `packages/ai-centre/` |
| 5 | `governance/quality/agent-integrity/` changes? | NO |
| 6 | `.agent-workspace/*/knowledge/` changes? | NO |
| 7 | Governance liaison artifacts? | NO |
| 8 | PRE_BUILD_STAGE_MODEL paths? (`module.manifest.json`, `BUILD_PROGRESS_TRACKER.md`, `00-app-description/`, `01-frs/`, etc.) | NO — `harvest-map/` is not a canonical pre-build lifecycle stage path |
| 9 | Cross-app component governance? | NO |
| 10 | Only retrospective audit artifacts? | NO — this is new content |
| 11 | Clearly and unambiguously doc-only outside governance? | **UNCERTAIN** — see AMBIGUITY RULE below |

#### AMBIGUITY RULE APPLIED

The deliverable is a new markdown file in `modules/MMM/` — an active PRE_BUILD_STAGE_MODEL
governed module with a 12-stage lifecycle tracker. The artifact:
- Creates a new subdirectory and ownership-transition governance record
- Maps architectural decisions (source system → destination, canonical owner, treatment)
- Has downstream implications for convergence planning across MAT, Maturity Roadmap, and MMM
- Is NOT "clearly and unambiguously non-triggering"

**Per FAIL-ONLY-ONCE A-003**: Ambiguity resolves to mandatory invocation. IAA IS required.

#### Classification Decision

| Field | Value |
|-------|-------|
| **Trigger Category** | `GOVERNANCE_DOCUMENTATION` (AMBIGUOUS → MANDATORY per A-003) |
| **IAA Required** | YES — MANDATORY |
| **Ambiguity resolution** | APPLIED — resolves to mandatory invocation |
| **Category reasoning** | New governance/convergence planning artifact in active module space; ownership implications; not cleanly EXEMPT |

**This task is QUALIFYING** for IAA assurance at handover.

---

## Step 0.3b — Anti-Regression Obligations

### Prior Session Learning Notes Review

Sessions reviewed for recurring patterns applicable to this wave:
- `session-054-mmm-mat-harvest-20260405` — governance documentation in MMM space
- `session-055-layer-down-20260405` — governance/canon documentation PR
- `iaa-session-052-20260406` — REJECTION-PACKAGE for missing ripple assessment
- `session-053-wave1253-20260407` — governance alignment PR

### Recurring Failure Pattern 1 — Ripple Assessment Absent (A-023)

**Pattern confirmed across**: sessions 051, 052, 084, 086, 088, 089, 097, 101
**FAIL-ONLY-ONCE rule**: A-023 (active — enforced every invocation)

**What must happen for this wave**:
The PREHANDOVER proof MUST include an explicit `## Ripple/Cross-Agent Assessment` section.
For a planning-only markdown artifact, the ripple assessment must explicitly declare:
> "NO DOWNSTREAM RIPPLE REQUIRED to agent contracts, CI, schema, or canon — with justification"
OR list any downstream agents/files that must be updated as a result of this artifact.
Absence of this section → REJECTION-PACKAGE at first IAA invocation (no R2 correction possible
without producing a new PREHANDOVER proof per §4.3b immutability).

**Anti-regression obligation**: Foreman MUST include `## Ripple/Cross-Agent Assessment` in
the PREHANDOVER proof before invoking IAA.

### Recurring Failure Pattern 2 — Uncommitted Artifacts (A-033)

**Pattern confirmed across**: session-ci-gateway-fix-20260312, sessions 051, 050
**FAIL-ONLY-ONCE rule**: A-033 (active — enforced every invocation)

**What must happen for this wave**:
ALL bundle items declared in the PREHANDOVER proof must be committed to git (`git ls-tree HEAD`)
before IAA is invoked. Disk presence is NOT sufficient. Specifically:
- `modules/MMM/harvest-map/harvest-map.md` — must be committed
- PREHANDOVER proof file — must be committed
- Session memory file — must be committed

**Anti-regression obligation**: Foreman MUST run `git ls-tree -r HEAD` to confirm all
bundle items are committed before invoking IAA. HFMC-03 will verify this at audit.

### Recurring Failure Pattern 3 — Ceremony Bypass for Governance Docs (A-015)

**Pattern confirmed across**: session-054 (R1 REJECTION on ceremony grounds), session-mmm-gov-gaps
**FAIL-ONLY-ONCE rule**: A-015 (active — enforced every invocation)

**What must happen for this wave**:
This wave produces a governance documentation artifact. Even though it is NOT code, NOT schema,
and NOT a canon file — the PREHANDOVER ceremony IS required. Specifically:
- PREHANDOVER proof file MUST be created and committed
- Session memory MUST be created and committed
- `iaa_audit_token` in PREHANDOVER MUST use expected reference format (A-029)
  e.g. `IAA-session-NNN-wave1300-20260408-PASS` — NOT `PENDING`

**Anti-regression obligation**: Do NOT invoke IAA without a committed PREHANDOVER proof
and session memory. Absence of either → REJECTION-PACKAGE (CORE-013, CORE-015, CORE-018).

### Mechanically Verified Before Phase 2–4 Proceeds

IAA will verify the following at audit invocation:
1. `git ls-tree -r HEAD | grep harvest-map.md` → COMMITTED ✓
2. `git ls-tree -r HEAD | grep PREHANDOVER` → COMMITTED ✓
3. `git ls-tree -r HEAD | grep session-memory` → COMMITTED ✓
4. PREHANDOVER proof contains `## Ripple/Cross-Agent Assessment` section → PRESENT ✓
5. `iaa_audit_token` field is non-empty, non-PENDING, in expected format → VALID ✓
6. harvest-map.md contains ALL 10 required columns per issue #1300 → VERIFIED ✓

---

## Step 0.4 — Pre-Brief Artifact

### Qualifying Tasks Summary

| Task ID | Task Summary | IAA Trigger Category | Required Phases | Required Evidence Artifacts | Applicable Overlays | Specific Rules |
|---------|-------------|---------------------|-----------------|---------------------------|---------------------|----------------|
| MMM-HM-001 | Create `modules/MMM/harvest-map/harvest-map.md` — Harvest Map and Ownership Transition Matrix | `GOVERNANCE_DOCUMENTATION` (AMBIGUOUS → MANDATORY) | Phase 1 (Identity/Preflight) + Phase 2 (Alignment) + Phase 3 (Assurance) + Phase 4 (Verdict/Handover) | PREHANDOVER proof, session memory, IAA token file, harvest-map.md committed to git | Core invariants (all), HFMC-01–06, OVL-INJ-001 (Pre-Brief presence — satisfied by THIS artifact), Substantive content quality | A-003 (ambiguity), A-015 (ceremony mandatory), A-023 (ripple assessment), A-029 (§4.3b artifact immutability), A-033 (git verification), CORE-007 (no placeholders), CORE-013 (invocation evidence), CORE-015 (session memory), CORE-016 (token file), CORE-018 (evidence sweep), CORE-024 (PHASE_B_BLOCKING_TOKEN field), HFMC-01–06 |

---

### Required Evidence Artifacts at Handover

| Artifact | Path | Notes |
|----------|------|-------|
| Harvest Map (deliverable) | `modules/MMM/harvest-map/harvest-map.md` | ALL 10 columns required (see below). No placeholder rows. |
| PREHANDOVER proof | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-NNN-wave-mmm-harvest-1300-YYYYMMDD.md` | Must include `## Ripple/Cross-Agent Assessment`. `iaa_audit_token` pre-populated with expected reference. |
| Session memory | `.agent-workspace/foreman-v2/memory/session-NNN-mmm-harvest-map-1300-YYYYMMDD.md` | Standard foreman session memory |
| IAA Pre-Brief | `.agent-admin/assurance/iaa-prebrief-wave1300-mmm-harvest-map-20260408.md` | THIS artifact — satisfies OVL-INJ-001 |
| IAA token file (written by IAA at audit) | `.agent-admin/assurance/iaa-token-session-NNN-wave1300-YYYYMMDD.md` | Must contain `PHASE_B_BLOCKING_TOKEN:` field (CORE-024 / A-037) |

---

### Required Columns in Harvest Map (issue #1300 specification)

IAA will verify ALL 10 columns are present and non-empty in the delivered table:

| # | Column Name | Verification |
|---|-------------|-------------|
| 1 | Source System | Non-empty for all rows |
| 2 | Capability/Asset | Non-empty for all rows |
| 3 | Current Role | Non-empty for all rows |
| 4 | Destination | Non-empty — must be one of: MMM, AIMC, PIT, Shared Platform, Retire |
| 5 | Treatment | Non-empty for all rows |
| 6 | Canonical Owner After Convergence | Non-empty for all rows |
| 7 | Why | Non-empty — rationale required |
| 8 | Stage of Formalisation | Non-empty for all rows |
| 9 | Migration/Decommission Note | Non-empty for all rows |
| 10 | Open Question | Empty cells acceptable (some rows may have no open questions) |

---

### FFA Checks Required

**Build Delivery Checks (BD-series)**: NOT APPLICABLE
- No production code, no schema, no API endpoints, no UI components
- BD-000 (User Journey Trace): NOT APPLICABLE — no user-visible behaviour changed
- Niggle pattern library (A-035): NOT APPLICABLE — no stack code

**High-Frequency Miss Checks (HFMC-01–06)**: ALL APPLICABLE at handover audit

| Check | What Will Be Verified |
|-------|----------------------|
| HFMC-01 Ripple | `## Ripple/Cross-Agent Assessment` present in PREHANDOVER proof |
| HFMC-02 Scope parity | SCOPE_DECLARATION.md (if present) matches PR diff exactly |
| HFMC-03 Artifacts committed | All bundle items confirmed via `git ls-tree HEAD` — not just disk presence |
| HFMC-04 Pre-brief | THIS artifact at `.agent-admin/assurance/iaa-prebrief-wave1300-mmm-harvest-map-20260408.md` |
| HFMC-05 Token ceremony | IAA token file written to `.agent-admin/assurance/iaa-token-session-NNN-wave1300-YYYYMMDD.md` |
| HFMC-06 Evidence bundle | All declared artifacts present, non-empty, committed |

**Core Invariant Checks (applicable subset)**:

| Check | Applicable? | Notes |
|-------|-------------|-------|
| CORE-001 through CORE-012 | NOT APPLICABLE | Agent contract-specific checks |
| CORE-005 (governance block present) | ADVISORY | Governance metadata in artifact headers |
| CORE-006 (CANON_INVENTORY alignment) | N/A for this artifact type | No governance/canon changes |
| CORE-007 (no placeholders) | APPLICABLE | harvest-map.md must contain no TODO, STUB, TBD rows |
| CORE-013 (IAA invocation evidence) | APPLICABLE | PREHANDOVER must reference IAA |
| CORE-014 (no class exemption claim) | APPLICABLE | Standard |
| CORE-015 (session memory present) | APPLICABLE | Session memory committed before invocation |
| CORE-016 (token file) | APPLICABLE | Token file at `.agent-admin/assurance/iaa-token-session-NNN-wave1300-YYYYMMDD.md` |
| CORE-017 (no unauthorized .github/agents/ mods) | APPLICABLE | git diff must show no agent contract changes |
| CORE-018 (evidence sweep) | APPLICABLE | PREHANDOVER + session memory + token reference all present and committed |
| CORE-019 (token cross-verification) | APPLICABLE | First invocation exception applies |
| CORE-020 (zero partial pass) | APPLICABLE | Standard |
| CORE-021 (zero severity tolerance) | APPLICABLE | Standard |
| CORE-022 (secret field naming) | N/A | No agent contract changes |
| CORE-023 (workflow integrity ripple) | ADVISORY (likely N/A) | Verify no workflow-adjacent files changed |
| CORE-024 (PHASE_B_BLOCKING_TOKEN) | APPLICABLE | Token file must contain this field |
| CORE-025 (Pre-Brief stage-readiness) | ADVISORY | Noted: Stage 10 IAA Pre-Brief is NOT_STARTED in BUILD_PROGRESS_TRACKER; this artifact does not advance that stage |

**Substantive Content Quality Checks (PRIMARY — 90% of IAA effort at audit)**:

| Check | What Will Be Verified |
|-------|----------------------|
| SQ-001 Column completeness | All 10 issue #1300 columns present in harvest map table |
| SQ-002 Coverage completeness | All three source systems (MAT, Maturity Roadmap, Legacy) have entries |
| SQ-003 Destination validity | Destination values are from the defined set: MMM / AIMC / PIT / Shared Platform / Retire |
| SQ-004 No placeholder content | No "TBD", "TODO", "STUB", or blank rationale in Why/Treatment columns |
| SQ-005 Owner clarity | Canonical Owner After Convergence column names a real system/team, not "TBD" |
| SQ-006 Alignment with MMM strategy | Destinations are consistent with `modules/MMM/MMM_strategy.md` and `MMM_app_description.md` v0.4.0 |
| SQ-007 Stage of Formalisation accuracy | Values are realistic and consistent with current BUILD_PROGRESS_TRACKER.md state |

---

### PREHANDOVER Structure Required

The Foreman MUST include ALL of the following in the PREHANDOVER proof before invoking IAA:

```markdown
# PREHANDOVER Proof — session-NNN — wave: mmm-harvest-map — Issue #1300

## CS2 Authorization
Issue: maturion-isms#1300 — opened by @APGI-cmy — CS2 authority confirmed.

## Task Scope
MMM-HM-001: Create modules/MMM/harvest-map/harvest-map.md

## Delivered Artifacts
- [ ] modules/MMM/harvest-map/harvest-map.md — committed to branch
- [ ] .agent-admin/assurance/iaa-prebrief-wave1300-mmm-harvest-map-20260408.md — committed (IAA pre-brief)
- [ ] [this PREHANDOVER proof file] — committed to branch
- [ ] [session memory file] — committed to branch

## Evidence Bundle
[List git-verified file hashes or paths confirmed via git ls-tree]

## Non-Goals Confirmed
- No FRS, TRS, implementation code
- No builder appointment
- No architecture artifacts
- No schema changes
- No CI/workflow changes

## Ripple/Cross-Agent Assessment
[MANDATORY SECTION — per A-023 / HFMC-01]

This artifact (harvest-map.md) is a standalone planning/governance document.
Assessment: [Explicitly declare ONE of:]
  Option A: "NO DOWNSTREAM RIPPLE REQUIRED — justification: [reason]"
  Option B: List of downstream agents/files requiring updates

## IAA Invocation Evidence
iaa_audit_token: IAA-session-NNN-wave1300-20260408-PASS
[Pre-populated expected reference — NOT "PENDING"]
```

---

### Scope Blockers

| Blocker ID | Description | Resolution |
|-----------|-------------|-----------|
| SB-001 | **No builder delegation required** — Foreman is the sole producer of this markdown artifact. Builder appointment (Stage 11) is NOT triggered by this wave. Do not appoint a builder for this task. | Foreman produces artifact directly. |
| SB-002 | **Markdown-only scope** — Any change to code, schema, CI, or agent contracts would expand scope beyond what issue #1300 authorises. This wave is BLOCKED from such changes. | PR diff must show only: `modules/MMM/harvest-map/harvest-map.md` + ceremony artifacts |
| SB-003 | **All 10 columns required** — Missing any of the 10 required columns from issue #1300 specification will result in REJECTION-PACKAGE (SQ-001). | Verify all 10 columns before invoking IAA. |
| SB-004 | **Pre-brief must precede all other wave activity** — This pre-brief must be the first committed artifact on the branch for this wave. If any harvest-map or task artifacts were committed before this pre-brief, HFMC-04 may flag ordering. | This pre-brief is being committed first. ✓ |
| SB-005 | **PREHANDOVER must be committed, not just on disk** — Per A-033, IAA verifies via `git ls-tree HEAD`, not disk `-f` check. | Run `git add && git commit` for ALL ceremony files before invoking IAA. |
| SB-006 | **BUILD_PROGRESS_TRACKER.md Stage 10 (IAA Pre-Brief)** — The `modules/MMM/BUILD_PROGRESS_TRACKER.md` lists Stage 10 (IAA Pre-Brief) as NOT_STARTED. This wave's pre-brief (THIS artifact) is for the harvest-map wave, NOT the module's full Stage 10 pre-build pre-brief. The two MUST NOT be conflated. Stage 10 in BUILD_PROGRESS_TRACKER.md should NOT be marked COMPLETE based on this pre-brief alone. | Foreman must NOT update BUILD_PROGRESS_TRACKER.md Stage 10 to COMPLETE as part of this wave. |

---

### MMM Module Stage-Readiness View (CORE-025 advisory — PRE_BUILD_STAGE_MODEL context)

The `modules/MMM/` module is PRE_BUILD_STAGE_MODEL governed. Current stage status:

| Stage | Name | Status |
|-------|------|--------|
| 1 | App Description | ✅ COMPLETE |
| 2 | UX Workflow & Wiring Spec | ❌ NOT_STARTED |
| 3 | FRS | ❌ NOT_STARTED |
| 4 | TRS | ❌ NOT_STARTED |
| 5 | Architecture | 🔄 IN_PROGRESS |
| 6 | QA-to-Red | ❌ NOT_STARTED |
| 7 | PBFAG | ❌ NOT_STARTED |
| 8 | Implementation Plan | ❌ NOT_STARTED |
| 9 | Builder Checklist | ❌ NOT_STARTED |
| 10 | IAA Pre-Brief (module-level) | ❌ NOT_STARTED |
| 11 | Builder Appointment | ❌ NOT_STARTED |
| 12 | Build | ❌ NOT_STARTED |

**Blocker for builder appointment**: Stages 2–9 are not complete. This wave does NOT unlock builder appointment. The harvest-map artifact is a convergence planning tool, not a lifecycle stage advancement.

---

### Phase B Blocking Status

**IAA adoption phase**: `PHASE_B_BLOCKING` — Hard gate ACTIVE.
At handover invocation, a REJECTION-PACKAGE from IAA blocks PR opening. No deferral.

---

## Invocation Instructions for Foreman

When ready for final IAA audit, invoke via:

```
task(
  agent_type: "independent-assurance-agent",
  name: "iaa-audit-wave1300-mmm-harvest-map",
  description: "IAA final audit — harvest map wave 1300",
  prompt: "Invoke IAA Phases 1–4 for wave mmm-harvest-map (issue #1300). 
           Branch: copilot/produce-mat-roadmap-transition-matrix. 
           Pre-brief artifact: .agent-admin/assurance/iaa-prebrief-wave1300-mmm-harvest-map-20260408.md.
           Confirm all bundle items committed. Issue verdict."
)
```

Pre-conditions before invoking:
1. ✅ This pre-brief committed to branch
2. ⏳ `modules/MMM/harvest-map/harvest-map.md` committed to branch (all 10 columns)
3. ⏳ PREHANDOVER proof committed (including `## Ripple/Cross-Agent Assessment`)
4. ⏳ Session memory committed
5. ⏳ `git ls-tree -r HEAD` confirms all above files present

---

**Pre-Brief Status**: COMPLETE
**Token file**: Will be written at audit handover — `.agent-admin/assurance/iaa-token-session-NNN-wave1300-YYYYMMDD.md`
**Authority**: CS2 (Johan Ras / @APGI-cmy) — maturion-isms#1300
**IAA Version**: independent-assurance-agent v6.2.0 / contract 2.5.0
**Adoption Phase**: PHASE_B_BLOCKING
