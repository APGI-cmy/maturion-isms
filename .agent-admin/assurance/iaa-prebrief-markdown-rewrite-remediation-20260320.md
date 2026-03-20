# IAA Pre-Brief — Wave: markdown-rewrite-remediation

**Artifact Type**: IAA Pre-Brief  
**Wave Slug**: markdown-rewrite-remediation  
**Issue**: #1184 — "Remediation List for the Markdown Rewrite"  
**Branch**: copilot/remediation-list-markdown-rewrite  
**Date**: 2026-03-20  
**IAA Session**: session-prebrief-markdown-rewrite-remediation-20260320  
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.3.0)  
**Adoption Phase**: PHASE_B_BLOCKING  
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Phase 0 Execution Trace

**Step 0.1 — Pre-Brief invocation confirmed**: Triggered by issue comment containing IAA PRE-BRIEF REQUEST for wave markdown-rewrite-remediation. PRE-BRIEF mode active. Phases 1–4 assurance NOT executed this session.

**Step 0.2 — Wave current tasks read**: Branch `copilot/remediation-list-markdown-rewrite` confirmed clean (1 commit: "Initial plan" above base). Target file confirmed present: `modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md` (525 lines).

**Step 0.3 — Task classification**: See §1 below.

**Step 0.4 — Pre-Brief artifact generated**: This file (§1–§5 below).

**Step 0.5 — Commit**: Committed as new file per §4.3b — no existing files edited.

---

## §1 — Trigger Category Classification

### Wave Scope (as declared)

| Field | Value |
|-------|-------|
| Files modified | `modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md` only |
| Change type | Documentation revision (source-fidelity remediation) |
| Production code | NONE |
| Database schema | NONE |
| CI/workflow | NONE |
| Agent contracts | NONE |
| Governance/canon | NONE |
| Agent workspace knowledge | NONE |

### Classification Decision (Trigger Table v2.1.0 — Step-by-Step)

| Step | Question | Answer | Result |
|------|----------|--------|--------|
| 1 | `.github/agents/` or `governance/agents/` changes? | NO | Not AGENT_CONTRACT |
| 2 | `governance/canon/` or CANON_INVENTORY changes? | NO | Not CANON_GOVERNANCE |
| 3 | `.github/workflows/` changes? | NO | Not CI_WORKFLOW |
| 4 | AAWP/MAT path patterns? (`modules/mat/`, `packages/ai-centre/`, AAWP architecture files) | AMBIGUOUS — see note | Ambiguity rule applied |
| 5 | `governance/quality/agent-integrity/` changes? | NO | Not AGENT_INTEGRITY |
| 6 | `.agent-workspace/*/knowledge/` changes? | NO | Not KNOWLEDGE_GOVERNANCE |
| 7 | Clearly and unambiguously doc-only outside governance/canon? | YES with caveat | Primary: EXEMPT — but see AMBIGUITY NOTE |

### ⚠️ AMBIGUITY NOTE — AMBIGUITY RULE APPLIED (A-003)

**Primary classification**: EXEMPT — the file `modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md` is a documentation-only markdown file, outside governance/canon, with no code or schema content.

**Ambiguity trigger**: The AAWP_MAT trigger includes "AAWP architecture files" as a qualifying path pattern. `ROADMAP_APP_DESCRIPTION_v3.0.md` is the formal architectural requirements document for the Maturity Roadmap module — a core Maturion production module. Whether this constitutes an "AAWP architecture file" is not definitively ruled out by the trigger table.

**AMBIGUITY RULE (A-003)**: *Ambiguity resolves to mandatory invocation — never to exempt.*

**Resolved classification: AMBIGUOUS → IAA IS REQUIRED at handover.**

Mat-specialist **MUST invoke IAA** at handover. IAA will make the final EXEMPT/AAWP_MAT classification at that point based on the actual PR diff. If the diff contains only the target documentation file with no qualifying additions, IAA will confirm EXEMPT and close with `ASSURANCE-TOKEN (EXEMPT)`. If any qualifying artifact is present, full assurance proceeds.

### Qualifying Task Status

| Task | Category | IAA Required? | Rationale |
|------|----------|--------------|-----------|
| Revise ROADMAP_APP_DESCRIPTION_v3.0.md (10-item remediation from Issue #1184) | AMBIGUOUS | YES — AMBIGUITY RULE | Doc-only primary; AAWP architecture file clause creates ambiguity; A-003 resolves to mandatory invocation |

**Pre-Brief Protocol §0.3 result**: 1 qualifying task (under ambiguity rule). IAA invocation IS required at handover. Advisory classification applies pending final diff review.

---

## §2 — FFA Checks IAA Will Run at Handover

**FFA = Functional Fitness Assessment** — adapted for documentation deliverables. Since this is a documentation-only PR, BUILD overlay BD-001 through BD-005 (code, schema, integration, tests, security) are **N/A**. IAA will apply a documentation-quality FFA in their place.

### 2A — Core Invariants (ALL categories — applied regardless of EXEMPT/AAWP_MAT outcome)

| Check | Name | What IAA Checks |
|-------|------|----------------|
| CORE-007 | No placeholder content | Scan revised file for "STUB", "TODO:", "FIXME:", "placeholder", "to be populated", "TBD". Any present = FAIL. |
| CORE-013 | IAA invocation evidence | PREHANDOVER proof or IAA token reference present in PR artifacts. |
| CORE-015 | Session memory present | Mat-specialist session memory file committed on branch. |
| CORE-017 | No unauthorized `.github/agents/` modifications | PR diff must not touch any `.github/agents/` file. |
| CORE-018 | Complete evidence artifact sweep | PREHANDOVER proof present, session memory present, `iaa_audit_token` field non-empty, IAA token file present (FIRST INVOCATION EXCEPTION applies — token file created by IAA this session). |
| CORE-019 | IAA token cross-verification | First invocation — FIRST INVOCATION EXCEPTION applies per CORE-019. |
| CORE-020 | Zero partial pass | No assumed passes. Missing evidence = FAIL. |
| CORE-021 | Zero-severity-tolerance | Any finding = REJECTION-PACKAGE. No "minor" or "cosmetic" softening. |
| CORE-023 | Workflow integrity ripple | N/A expected — no workflow-adjacent files touched. IAA will record `CORE-023: N/A — no workflow-adjacent changes detected in PR diff.` |

### 2B — Documentation-Quality FFA (IAA Judgement — replaces BUILD overlay for doc-only PR)

These checks assess whether the revised document achieves its declared purpose (source-fidelity remediation of Issue #1184):

| FFA Check | Name | What IAA Checks |
|-----------|------|----------------|
| DOC-FFA-001 | Scope boundary compliance | PR diff contains ONLY `modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md`. No qualifying artifacts added. Any non-documentation file in the diff = immediate category reclassification to appropriate trigger. |
| DOC-FFA-002 | Remediation completeness — Priority 1 (MUST Fix) | All 5 Priority 1 items from Issue #1184 visibly addressed in the revised document: (1) source-derived vs inferred separation, (2) source ambiguity preserved, (3) continuous live score concept strengthened, (4) evidence governance expanded, (5) dashboard visibility/wow-factor strengthened. |
| DOC-FFA-003 | Remediation completeness — Priority 2 (SHOULD Fix) | Items 6–8 from Issue #1184 addressed: post-subscription structure, free assessment boundary, open conceptual notes preserved. |
| DOC-FFA-004 | Remediation completeness — Priority 3 (Nice to Improve) | Items 9–10 addressed if declared in PREHANDOVER: over-formalization reduced, Source Fidelity Notes appendix added (if claimed). IAA will not fail if Priority 3 items are partially addressed but will note as advisory. |
| DOC-FFA-005 | Source fidelity — no over-specification | Revised document must NOT introduce new specificity beyond the source Word document (word_upload.md). Mat-specialist must not add implementation detail, technical architecture, or schema specifics not present in the source. |
| DOC-FFA-006 | Version header accuracy | Metadata block (Status, Owner, Date, Version, Supersedes) is accurate and non-placeholder. |
| DOC-FFA-007 | No new stub sections | Revised document must not introduce any section marked as "TBD", "to be expanded", or left as a heading with no content. |

### 2C — OVL-INJ-001 Pre-Brief Artifact Existence Check (PRE_BRIEF_ASSURANCE overlay)

Since this pre-brief artifact is being committed BEFORE mat-specialist task delegation, **OVL-INJ-001 WILL PASS** at handover — this artifact at `.agent-admin/assurance/iaa-prebrief-markdown-rewrite-remediation-20260320.md` satisfies the condition.

IAA will verify commit timestamp of this file precedes any mat-specialist deliverable artifact on this branch.

---

## §3 — PREHANDOVER Proof Structure Required

Mat-specialist **MUST commit a PREHANDOVER proof** to the branch before invoking IAA at handover. This is required by CORE-013, CORE-015, CORE-018, and FAIL-ONLY-ONCE A-021 (commit before invoking IAA — never after).

### Required File Path

```
.agent-workspace/mat-specialist/memory/PREHANDOVER-session-[session-id]-[wave-slug]-[date].md
```
Example: `.agent-workspace/mat-specialist/memory/PREHANDOVER-session-markdown-rewrite-remediation-20260320.md`

### Required Fields

```yaml
session_id: [mat-specialist session ID for this wave]
date: [YYYY-MM-DD]
wave: markdown-rewrite-remediation
issue: "#1184"
branch: copilot/remediation-list-markdown-rewrite

# Deliverables declared
deliverables:
  - file: modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md
    type: documentation-revision
    description: "Source-fidelity remediation of v3.0 — 10-item remediation list from Issue #1184"
    
# Scope confirmation
scope_confirmation:
  production_code_modified: false
  schema_modified: false
  ci_workflows_modified: false
  agent_contracts_modified: false
  governance_canon_modified: false
  agent_workspace_knowledge_modified: false
  only_file_modified: "modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md"

# Remediation coverage
remediation_coverage:
  priority_1_items_addressed: [list each of 5 items: YES/NO/PARTIAL with one-line evidence]
  priority_2_items_addressed: [list each of 3 items: YES/NO/PARTIAL with one-line evidence]
  priority_3_items_addressed: [list each of 2 items: YES/NO/NOT_ATTEMPTED with note]

# Source fidelity declaration
source_fidelity_declaration: >
  [1–2 sentences confirming the revision was made against word_upload.md as the primary
  source and that no new specificity was introduced beyond what the source document contains.]

# IAA audit token — pre-populate with expected reference format per A-029
# Do NOT leave as PENDING (superseded by A-029)
iaa_audit_token: "IAA-session-[session-id]-[wave-slug]-[date]-PASS"

# Session memory reference
session_memory_file: ".agent-workspace/mat-specialist/memory/session-[session-id]-[date].md"
```

### ⚠️ A-021 Reminder — COMMIT BEFORE INVOKING IAA

Per FAIL-ONLY-ONCE A-021: **The PREHANDOVER proof and session memory MUST be committed and pushed to the branch BEFORE mat-specialist invokes IAA.** Stating "to be committed after IAA response" is a direct A-021 violation and will produce REJECTION-PACKAGE on CORE-013/CORE-015/CORE-018.

**Correct sequence:**
1. Mat-specialist makes all changes to `ROADMAP_APP_DESCRIPTION_v3.0.md`
2. Mat-specialist writes PREHANDOVER proof and session memory
3. Mat-specialist **commits and pushes** both files to branch
4. Mat-specialist invokes IAA via `task(agent_type: "independent-assurance-agent")`
5. IAA reviews committed artifacts — NOT working tree

### Session Memory Required Fields

Mat-specialist must commit session memory at:
`.agent-workspace/mat-specialist/memory/session-[session-id]-[date].md`

Required fields: `session_id`, `date`, `wave`, `issue`, `deliverables`, `changes_made_summary`, `remediation_coverage_summary`, `source_document_used`.

---

## §4 — Scope Blockers and Governance Conflicts

### 4A — Active Blockers

**NONE IDENTIFIED.** The branch `copilot/remediation-list-markdown-rewrite` is clean:
- 0 uncommitted changes
- 1 commit above base ("Initial plan")
- Target file confirmed present and versioned
- No prior IAA REJECTION-PACKAGE on this branch

### 4B — Adjacent Wave Status (not blocking — different branches)

| Wave | Branch | Last IAA Verdict | Status |
|------|--------|-----------------|--------|
| Wave 20 — Atomic Write-Back | copilot/implement-wire-parse-write-back-rpc | ASSURANCE-TOKEN (R2, 2026-03-18) | Resolved — separate branch, no conflict |

### 4C — Governance Conflicts Visible Now

**NONE BLOCKING.** The following advisory notes apply:

1. **Source document access**: Mat-specialist must have access to `word_upload.md` (the original Word document source). If this file is not on the branch or not accessible in the repository, mat-specialist cannot verify source fidelity. IAA will check during DOC-FFA-005 whether any claimed source-faithful change is verifiable. If word_upload.md is not accessible → IAA will flag as advisory (cannot verify fidelity claim).

   > Check: `modules/maturity-roadmap/00-app-description/` already contains `ROADMAP_APP_DESCRIPTION_v2.0.md`. IAA notes the v2.0 may serve as an intermediate source reference. The actual Word source (`word_upload.md` or `Lucara_Diamond_Control_Standard_V4.md`) was identified in the branch directory listing. Mat-specialist should use `Lucara_Diamond_Control_Standard_V4.md` (confirmed present in `modules/maturity-roadmap/00-app-description/`) as the primary source reference.

2. **Version number**: The revised file should remain `ROADMAP_APP_DESCRIPTION_v3.0.md` (not bumped to v3.1 or v4.0 unless CS2 authorises a version change). If mat-specialist changes the file name or version designation, IAA will note this as a potential scope creep flag.

3. **Supersession chain**: The metadata block currently declares `Supersedes: ROADMAP_APP_DESCRIPTION_v2.0.md`. This should remain accurate in the revised document. If the remediation materially changes the document's scope or purpose, the supersession chain and version designation may need CS2 review — mat-specialist should flag this in the PREHANDOVER proof if relevant.

4. **OVL-INJ-001 pre-condition**: This pre-brief artifact satisfies the OVL-INJ-001 pre-condition. Mat-specialist must NOT commit any deliverable artifacts before this pre-brief artifact is present on the branch. Since this pre-brief is being committed first, the condition will be satisfied.

### 4D — IAA Re-classification Warning

If mat-specialist adds ANY of the following to the PR (scope creep), IAA will immediately reclassify the category and apply the corresponding full overlay:

| If PR adds... | Reclassification |
|--------------|-----------------|
| Any `.github/agents/*.md` change | AGENT_CONTRACT — full audit required |
| Any `governance/canon/` change | CANON_GOVERNANCE — full audit required |
| Any `.github/workflows/` change | CI_WORKFLOW — full audit required |
| Any source code, schema migration, or Edge Function | AAWP_MAT — full BUILD overlay required |
| Any `.agent-workspace/*/knowledge/` change | KNOWLEDGE_GOVERNANCE — full overlay required |

---

## §5 — Summary for mat-specialist Delegation

### What mat-specialist must deliver

1. **Revised `ROADMAP_APP_DESCRIPTION_v3.0.md`** addressing all 10 remediation items from Issue #1184 (Priority 1–3 as scoped)
2. **PREHANDOVER proof** committed to branch before IAA invocation (see §3 above)
3. **Session memory file** committed to branch before IAA invocation
4. **IAA invocation** via `task(agent_type: "independent-assurance-agent")` after committing all artifacts

### What IAA will assess at handover

1. Scope boundary — only the declared file was modified (DOC-FFA-001)
2. Remediation completeness — all Priority 1 items visibly addressed (DOC-FFA-002), Priority 2 addressed (DOC-FFA-003), Priority 3 noted (DOC-FFA-004)
3. Source fidelity — no over-specification or implementation invention (DOC-FFA-005)
4. No placeholder content (CORE-007)
5. Evidence artifact sweep — PREHANDOVER + session memory committed (CORE-018)
6. Pre-Brief artifact committed before deliverable (OVL-INJ-001)
7. Zero-severity-tolerance (CORE-021) — any finding = REJECTION-PACKAGE

### IAA verdict options at handover

| Outcome | Condition |
|---------|-----------|
| `ASSURANCE-TOKEN (EXEMPT — IAA not triggered)` | Diff is exactly the declared doc file, all FFA checks pass, all evidence artifacts present, EXEMPT classification confirmed |
| `ASSURANCE-TOKEN` | If reclassified to AAWP_MAT or AMBIGUOUS and all checks pass |
| `REJECTION-PACKAGE` | Any check fails — STOP-AND-FIX required before PR opens |

---

**Pre-Brief issued by**: independent-assurance-agent v6.2.0  
**Pre-Brief date**: 2026-03-20  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**STOP-AND-FIX mandate**: ACTIVE  
**Phase B Blocking**: ACTIVE — hard gate  
**Lock**: SELF-MOD-IAA-001 — CONSTITUTIONAL — ACTIVE
