# IAA Pre-Brief — DCKIS-GOV-001: MAT Governance Document Amendments

**Document type**: IAA Pre-Brief Artifact (Phase 0 — PRE-BRIEF mode)
**Wave ID**: DCKIS-GOV-001
**Wave Title**: MAT Governance Document Amendments — Pipeline 2 additions to 7 MAT governance docs
**Declared branch**: `copilot/dckis-gov-001-update-governance-docs`
**Pre-Brief authored by**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Date**: 2026-03-19
**Authority**: CS2 (@APGI-cmy) | `INDEPENDENT_ASSURANCE_AGENT_CANON.md`
**Invocation mode**: PHASE 0 — PRE-BRIEF ONLY. Phases 1–4 assurance NOT executed in this session.
**Adoption phase**: PHASE_B_BLOCKING — verdicts at handover are hard-blocking.
**Parent pre-brief**: `.agent-admin/assurance/iaa-prebrief-dckis-alignment-plan.md`
**Source authority**: `governance/EXECUTION/MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` v1.0.0

> **⚠️ SCOPE BLOCKERS DETECTED — READ BEFORE DELEGATING**
> Two numbering conflicts found in target documents. See §5 for mandatory remediation
> instructions before governance-liaison-isms-agent begins work.

---

## Phase 0 Execution Record

### Step 0.1 — Invocation Context Confirmation

> **PRE-BRIEF MODE CONFIRMED.**
> Triggered by: CS2-issued task containing `[IAA PRE-BRIEF REQUEST]` for wave `DCKIS-GOV-001`.
> Operating in Phase 0 exclusively. Phases 1–4 are NOT executed in this session.
> This Pre-Brief artifact is generated and committed. Execution stops here.

### Step 0.2 — Source Documents Read

| Document | Path | Status |
|----------|------|--------|
| MAT Knowledge Ingestion Alignment Plan v1.0.0 | `governance/EXECUTION/MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` | READ ✅ |
| Parent DCKIS Pre-Brief | `.agent-admin/assurance/iaa-prebrief-dckis-alignment-plan.md` | READ ✅ |
| IAA Trigger Table v2.1.0 | `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md` | READ ✅ |
| IAA Core Invariants v2.9.0 | `.agent-workspace/independent-assurance-agent/knowledge/iaa-core-invariants-checklist.md` | READ ✅ |
| IAA Category Overlays v3.6.0 | `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` | READ ✅ |
| FAIL-ONLY-ONCE Registry v2.5.0 | `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` | READ ✅ |
| IAA Knowledge Index v3.1.0 | `.agent-workspace/independent-assurance-agent/knowledge/index.md` | READ ✅ |
| system-architecture.md (live state) | `modules/mat/02-architecture/system-architecture.md` | READ ✅ — §4 numbering verified |
| implementation-plan.md (live state) | `modules/mat/03-implementation-plan/implementation-plan.md` | READ ✅ — Wave numbering verified |
| app-description.md (live state) | `modules/mat/00-app-description/app-description.md` | READ ✅ — §6 numbering verified |
| MAT_UX_WORKFLOW_AND_WIRING.md (live state) | `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` | READ ✅ — STEP structure verified |
| functional-requirements.md (live state) | `modules/mat/01-frs/functional-requirements.md` | READ ✅ — No FR-KU series present |
| technical-requirements-specification.md (live state) | `modules/mat/01.5-trs/technical-requirements-specification.md` | READ ✅ — No TR-KU series present |
| test-strategy.md (live state) | `modules/mat/02-architecture/test-strategy.md` | READ ✅ — No Pipeline 2 section present |
| Session memory (last 3) | `.agent-workspace/independent-assurance-agent/memory/session-05x-*.md` | READ ✅ — No open REJECTION-PACKAGEs for DCKIS-GOV-001 |

### Step 0.3 — Task Classification

| Deliverable | Path | Qualifying? | Category |
|-------------|------|-------------|----------|
| GOV-001-D1 | `modules/mat/00-app-description/app-description.md` | **YES** | AAWP_MAT |
| GOV-001-D2 | `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` | **YES** | AAWP_MAT |
| GOV-001-D3 | `modules/mat/01-frs/functional-requirements.md` | **YES** | AAWP_MAT |
| GOV-001-D4 | `modules/mat/01.5-trs/technical-requirements-specification.md` | **YES** | AAWP_MAT |
| GOV-001-D5 | `modules/mat/02-architecture/system-architecture.md` | **YES** | AAWP_MAT |
| GOV-001-D6 | `modules/mat/03-implementation-plan/implementation-plan.md` | **YES** | AAWP_MAT |
| GOV-001-D7 | `modules/mat/02-architecture/test-strategy.md` | **YES** | AAWP_MAT |
| PREHANDOVER proof | `PREHANDOVER_PROOF*.md` | NOT QUALIFYING — ceremony artifact | — |
| Session memory | `.agent-workspace/governance-liaison-isms-agent/memory/*.md` | NOT QUALIFYING — EXEMPT | — |

**Qualifying task count**: 7 deliverables (GOV-001-D1 through GOV-001-D7).
All 7 are documentation amendments to `modules/mat/` paths → **AAWP_MAT** trigger.

---

## 1. Wave Summary

This wave delivers **7 governance documentation amendments** to formally register Pipeline 2
(DCKIS v1.0.0 Knowledge Document Upload) into the MAT module's specification suite.

**Producing agent**: `governance-liaison-isms-agent`
**Scope type**: Governance documentation only — **zero production code changes permitted**
**Source of truth**: `governance/EXECUTION/MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` §4, §6, §7
**ADR-005 hard constraint**: Pipeline 1 files are UNTOUCHABLE — any change to Pipeline 1 files
is an automatic REJECTION-PACKAGE regardless of justification.

---

## 2. IAA Trigger Category Declaration

### Classification

| Trigger Category | Activated? | Rationale |
|-----------------|------------|-----------|
| **AAWP_MAT** | **YES — PRIMARY** | All 7 deliverables are in `modules/mat/` path patterns. The IAA trigger table §Decision Flow Step 4 activates on `modules/mat/` file changes. Documentation amendments to MAT module specification files are within scope regardless of code-vs-docs status. |
| **PRE_BRIEF_ASSURANCE** | **YES — ALWAYS** | Applied alongside all triggering categories per overlay rules. This pre-brief IS the required artifact. OVL-INJ-001 will confirm its presence at handover. |
| AGENT_CONTRACT | NO | No `.github/agents/*.md` files modified. |
| CANON_GOVERNANCE | NO | No `governance/canon/` files modified. The 7 target files are in `modules/mat/` — not the `governance/` directory. CANON_INVENTORY is not touched. |
| CI_WORKFLOW | NO | No `.github/workflows/` files modified. |
| KNOWLEDGE_GOVERNANCE | NO | No `.agent-workspace/*/knowledge/` files modified. |
| EXEMPT | **REJECTED** | AMBIGUITY RULE: even if an argument were made that these are "doc-only" files, all 7 files are in `modules/mat/` which is a confirmed AAWP_MAT trigger path. Exemption is not available. |

**AMBIGUITY RULE status**: CLEAR — classification is unambiguous. AAWP_MAT + PRE_BRIEF_ASSURANCE.
**IAA required at handover**: YES — MANDATORY. PHASE_B_BLOCKING is in effect.

### Adoption Phase Modifier

PHASE_B_BLOCKING is active. IAA verdicts at handover are **hard-blocking**. A REJECTION-PACKAGE
prevents the PR from being opened. governance-liaison-isms-agent must not request PR opening
until ASSURANCE-TOKEN is received.

---

## 3. Declared FFA Checks at Handover

IAA will execute the following checks at handover invocation. These are declared in advance
so governance-liaison-isms-agent can self-audit before submitting for IAA review.

### 3.1 Core Invariants (ALL — CORE-001 to CORE-023)

All 23 core invariant checks apply. For this governance-docs-only PR, the following core
checks are particularly relevant (others will be N/A or pass trivially):

| Check | Relevance | What IAA will verify |
|-------|-----------|---------------------|
| CORE-005 | MEDIUM | governance block present in PREHANDOVER proof |
| CORE-006 | MEDIUM | CANON_INVENTORY alignment — no canon files are touched in this wave so this check is trivially PASS |
| CORE-007 | **HIGH** | No stub, TODO, FIXME, or placeholder values in any of the 7 delivered governance documents. FR/TR definitions must be substantively populated. |
| CORE-013 | **HIGH** | PREHANDOVER proof with pre-populated iaa_audit_token present on branch before IAA invocation |
| CORE-015 | **HIGH** | Session memory artifact present on branch |
| CORE-016 | **HIGH** | Dedicated IAA token file at `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md` — written by IAA at verdict time, not pre-created |
| CORE-017 | **HIGH** | No `.github/agents/` file modifications — governance-liaison MUST NOT touch agent files |
| CORE-018 | **HIGH** | Complete evidence artifact sweep: PREHANDOVER + session memory + iaa_audit_token field populated + token file (First Invocation Exception applies for token file) |
| CORE-019 | HIGH | Token cross-verification — First Invocation Exception applies for first run |
| CORE-020 | HIGH | Zero partial pass — all 7 deliverables must be substantively complete |
| CORE-021 | HIGH | Zero-severity-tolerance — any finding is a REJECTION-PACKAGE regardless of perceived size |
| CORE-023 | LOW | Workflow integrity ripple — this PR does NOT touch workflow-adjacent files; IAA expects to record `CORE-023: N/A — no workflow-adjacent changes detected` |

### 3.2 AAWP_MAT Overlay (Documentation-Adapted Application)

The AAWP_MAT overlay (BD-000 through BD-024 + FFA summary) applies. For governance
documentation PRs, IAA applies the Orientation Mandate (90/10 rule): **90% substance,
10% ceremony admin.** The substantive focus for docs-only PRs is:

> "Does the governance content correctly represent the intended design? If downstream builders
> (schema-builder, api-builder, ui-builder, qa-builder) use these governance docs as their
> specification, will they produce a correct, coherent, and complete Pipeline 2 implementation?"

#### Build Deliverable Checks — Applicability Table

| Check ID | Name | Applicable to docs-only? | IAA approach |
|----------|------|--------------------------|-------------|
| **BD-000** | User Journey Trace | **YES — ADAPTED** | The "user journey" for a governance doc wave is: governance-liaison adds content → downstream builder reads spec → builder implements correctly. IAA will verify that the FR/TR/architecture/test content is coherent enough to support correct implementation without ambiguity. |
| **BD-001** | Full scope delivered | **YES — HARD** | All 7 deliverables (D1–D7) must be present in the PR diff. Partial delivery = REJECTION-PACKAGE. |
| **BD-002** | No stub/TODO in production paths | **YES — ADAPTED** | No TODOs, stubs, or placeholders in the FR/TR definitions, architecture section, or test IDs. |
| **BD-003** | One-time build compliance | **YES — ADAPTED** | If downstream builders use these docs as their spec today, will they produce a correct implementation? Ambiguous or contradictory spec content = REJECTION-PACKAGE. |
| BD-004 | No leftover debt | LOW | IAA checks for obvious inconsistencies introduced by amendments |
| BD-005 to BD-010 | Wiring/integration | **N/A** | No code paths, endpoints, or DB tables introduced in this wave |
| BD-011 to BD-014 | Test quality | **N/A** | No test files introduced in this wave (test IDs are declared, not implemented) |
| BD-015 to BD-019 | Security | **N/A** | No code, no RLS, no inputs |
| BD-020 to BD-024 | Code quality | **N/A** | No code |

**FFA Checks IAA WILL run (docs-adapted):**

| FFA-ID | Check | What IAA Does |
|--------|-------|---------------|
| **FFA-CONTENT-01** | FR content fidelity | FR-KU-001 through FR-KU-005 in `functional-requirements.md` must match Alignment Plan §6 definitions. IAA cross-checks each FR definition, acceptance criteria count, and domain taxonomy list against the alignment plan verbatim (or with editorial improvements only — no omissions or contradictions). |
| **FFA-CONTENT-02** | TR content fidelity | TR-KU-001 through TR-KU-004 in `technical-requirements-specification.md` must match Alignment Plan §7 definitions. IAA cross-checks each TR, technical constraints, and specific values (chunk size 2000, overlap 200, embedding dims 1536, `approval_status = 'pending'` on insert) against the alignment plan. |
| **FFA-CONTENT-03** | Architecture section completeness | The new Pipeline 2 architecture section in `system-architecture.md` must include: (a) component diagram (text/table), (b) data flow description, (c) target table (`ai_knowledge`), (d) references to ADR-001 through ADR-005. |
| **FFA-CONTENT-04** | Test IDs complete | `test-strategy.md` Pipeline 2 section must declare all 12 RED gate test IDs (T-KU-001 through T-KU-012) with descriptions matching Alignment Plan §4.3 (Wave DCKIS-QA-RED) exactly. No missing test IDs. |
| **FFA-CONTENT-05** | Wave entry in implementation plan | The new wave entry in `implementation-plan.md` must include: builder assignments, test ID references (T-KU-001 through T-KU-012), entry criteria (DCKIS-GOV-001 merged + DCKIS-SCH-001 + DCKIS-QA-RED), exit criteria (all 12 T-KU tests GREEN, zero Pipeline 1 files modified). |
| **FFA-CONTENT-06** | ADR-005 non-violation | The PR diff must contain **zero modifications** to any of the following Pipeline 1 files. IAA runs an explicit zero-tolerance check: `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx`, `supabase/functions/invoke-ai-parse-criteria/`, `apps/mat-ai-gateway/`, and any `criteria`, `domains`, or `mini_performance_standards` table references. Any touch = REJECTION-PACKAGE citing ADR-005. |
| **FFA-CONTENT-07** | Section numbering correct | ⚠️ **CRITICAL — see §5 SCOPE BLOCKERS.** IAA will verify that `system-architecture.md` uses §4.6 (NOT §4.3) and `implementation-plan.md` uses Wave 19 (NOT Wave 17). Incorrect numbering = REJECTION-PACKAGE. |
| **FFA-CONTENT-08** | UX Workflow STEP 2b coherence | STEP 2b in `MAT_UX_WORKFLOW_AND_WIRING.md` must clearly distinguish the Knowledge Upload flow from STEP 2 (Criteria Upload). Actor, UI component, pipeline, and table target must all be distinct from STEP 2/Step 2a. |
| **FFA-CONTENT-09** | App description §6.3 completeness | §6.3 in `app-description.md` must cover: purpose of Knowledge Document Upload, actor (Content Administrator), supported document types (`.docx`, `.pdf`, `.txt`, `.md`), target table (`ai_knowledge`), and reference to AIMC governance/ARC approval workflow. |
| **FFA-CONTENT-10** | No Pipeline 2 content in Pipeline 1 sections | Amendments must be **additive only**. No existing Pipeline 1 sections in any of the 7 documents may be modified. IAA checks for deletions or edits to pre-existing content. |

### 3.3 PRE_BRIEF_ASSURANCE Overlay

| Check ID | Check | IAA verdict approach |
|----------|-------|---------------------|
| **OVL-INJ-001** | Pre-Brief artifact exists | IAA verifies this artifact (`iaa-prebrief-dckis-gov-001.md`) is present at `.agent-admin/assurance/` on the branch AND was committed before any governance-liaison builder artifact. |
| OVL-INJ-ADM-001 | Pre-Brief non-empty | Existence-only check — this file confirms this check. |
| OVL-INJ-ADM-002 | Pre-Brief references correct wave | Wave slug `dckis-gov-001` matches this pre-brief and the branch. |

---

## 4. PREHANDOVER Proof Structure Required

governance-liaison-isms-agent must commit a PREHANDOVER proof file before invoking IAA.
The proof must conform to the §4.3b architecture (FAIL-ONLY-ONCE A-029).

### 4.1 Mandatory Fields

```yaml
# PREHANDOVER Proof — DCKIS-GOV-001
wave_id: DCKIS-GOV-001
wave_title: "MAT Governance Document Amendments — Pipeline 2 additions to 7 MAT governance docs"
branch: copilot/dckis-gov-001-update-governance-docs
producing_agent: governance-liaison-isms-agent
producing_agent_class: specialist
cs2_authorisation: "[GitHub issue URL — CS2 wave-start authorisation for DCKIS-GOV-001]"

# Deliverables — ALL 7 must be committed and confirmed present
deliverables_committed:
  - GOV-001-D1: modules/mat/00-app-description/app-description.md  # §6.3 added
  - GOV-001-D2: modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md  # STEP 2b added
  - GOV-001-D3: modules/mat/01-frs/functional-requirements.md  # FR-KU-001 to FR-KU-005 added
  - GOV-001-D4: modules/mat/01.5-trs/technical-requirements-specification.md  # TR-KU-001 to TR-KU-004 added
  - GOV-001-D5: modules/mat/02-architecture/system-architecture.md  # §4.6 Knowledge Ingestion Pipeline added (NOT §4.3)
  - GOV-001-D6: modules/mat/03-implementation-plan/implementation-plan.md  # Wave 19 added (NOT Wave 17)
  - GOV-001-D7: modules/mat/02-architecture/test-strategy.md  # Pipeline 2 test coverage section added

# Scope declaration — must match git diff exactly (FAIL-ONLY-ONCE A-026)
scope_declaration_file: SCOPE_DECLARATION.md  # Must be present and match git diff --name-only

# IAA token field — pre-populated per §4.3b (A-029)
# Replace NNN with actual session number, Y with wave identifier, date with actual date
iaa_audit_token: "IAA-session-NNN-waveDCKIS-GOV-001-YYYYMMDD-PASS"

# Evidence of ADR-005 compliance — zero Pipeline 1 file modifications
adr_005_compliance: "git diff --name-only confirms zero changes to Pipeline 1 paths"

# Session memory
session_memory_file: ".agent-workspace/governance-liaison-isms-agent/memory/session-NNN-YYYYMMDD.md"
```

### 4.2 Pre-IAA Commit Gate (FAIL-ONLY-ONCE A-021)

Before invoking IAA, governance-liaison-isms-agent MUST confirm all artifacts are committed:

```bash
git status   # Must show: nothing to commit, working tree clean
git ls-tree HEAD modules/mat/00-app-description/app-description.md
git ls-tree HEAD modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md
git ls-tree HEAD modules/mat/01-frs/functional-requirements.md
git ls-tree HEAD modules/mat/01.5-trs/technical-requirements-specification.md
git ls-tree HEAD modules/mat/02-architecture/system-architecture.md
git ls-tree HEAD modules/mat/03-implementation-plan/implementation-plan.md
git ls-tree HEAD modules/mat/02-architecture/test-strategy.md
git ls-tree HEAD SCOPE_DECLARATION.md
git ls-tree HEAD .agent-workspace/governance-liaison-isms-agent/memory/session-NNN-YYYYMMDD.md
```

All 9 commands above must return valid object hashes (not "fatal: not in this object tree").
A working-tree-only fix is NOT a committed fix and will fail CORE-018 (FAIL-ONLY-ONCE A-021).

### 4.3 SCOPE_DECLARATION.md Format

`SCOPE_DECLARATION.md` in the repo root must list exactly the files changed by this wave
in list format (FAIL-ONLY-ONCE A-028). It must include all 7 governance documents,
the PREHANDOVER proof, and the session memory. It must NOT include this pre-brief or
the IAA token file (those are IAA-authored, covered by the A-031 carve-out).

---

## 5. Scope Blockers and Governance Conflicts Visible Now

### ⛔ BLOCKER-01 — §4.3 Already in Use in `system-architecture.md`

**Status**: BLOCKING — governance-liaison MUST NOT use §4.3.

**Finding**: `modules/mat/02-architecture/system-architecture.md` contains a `§4` section
titled "Criteria Parsing Pipeline Architecture (Wave 15)" with the following sub-sections:
- `§4.1` Component Map
- `§4.2` Edge Function Specification
- `§4.3` AI Gateway `DocumentParser` Specification ← **ALREADY IN USE**
- `§4.4` DB Write-Back Specification
- `§4.5` Frontend Polling Specification

The Alignment Plan references "Add §4.3 Pipeline 2 Knowledge Ingestion architecture" — but
**§4.3 is taken**. Using §4.3 for Pipeline 2 content would create a document collision and
invalidate the existing Criteria Parsing architecture entry.

**Required correction**: governance-liaison-isms-agent must use **§4.6** for the Pipeline 2
Knowledge Ingestion architecture section. Title: `§4.6 — Knowledge Ingestion Pipeline
Architecture (Pipeline 2 — DCKIS v1.0.0)`.

**IAA action at handover**: If the PR adds content under `§4.3` for Pipeline 2, IAA will
issue REJECTION-PACKAGE with this finding. If §4.6 is used, FFA-CONTENT-07 will PASS.

---

### ⛔ BLOCKER-02 — Wave 17 Already in Use in `implementation-plan.md`

**Status**: BLOCKING — governance-liaison MUST NOT add a Wave 17 entry.

**Finding**: `modules/mat/03-implementation-plan/implementation-plan.md` already contains:
- `## Wave 17 — User-Guided Parsing (2026-03-11)` ← **ALREADY IN USE**
- `## Wave 18 — MAT Criteria Parsing Pipeline End-to-End Repair (2026-03-15)` ← **ALREADY IN USE**

The Alignment Plan references "Add Wave 17 (Knowledge Upload Centre Integration)" — but
**Wave 17 and Wave 18 are both taken**. The next available wave number is **Wave 19**.

**Required correction**: governance-liaison-isms-agent must add **Wave 19** for the
Knowledge Upload Centre Integration. Title: `## Wave 19 — Knowledge Upload Centre Integration
(Pipeline 2 — DCKIS v1.0.0)`.

**IAA action at handover**: If the PR adds a duplicate Wave 17 header, IAA will issue
REJECTION-PACKAGE. If Wave 19 is used correctly, FFA-CONTENT-07 will PASS.

---

### ✅ CLEAR-01 — `app-description.md` §6.3 is available

**Status**: CLEAR — safe to add §6.3.

**Finding**: `app-description.md` currently has §6.1 (Input Flexibility) and §6.2 (Parsing
Pipeline) under section 6 (Criteria Compilation). §6.3 does not yet exist. Adding §6.3
Knowledge Document Upload (Pipeline 2) is safe and does not conflict with existing structure.

---

### ✅ CLEAR-02 — `MAT_UX_WORKFLOW_AND_WIRING.md` STEP 2b is available

**Status**: CLEAR — safe to add STEP 2b.

**Finding**: The document has STEP 2 (Upload Audit Criteria Document — Pipeline 1) with
sub-step Step 2a (Concrete Parse Cycle Wiring). STEP 2b does not exist. Adding STEP 2b for
Knowledge Upload (Pipeline 2) is safe. Governance-liaison must ensure STEP 2b is clearly
distinct from STEP 2 and Step 2a in actor, UI panel, pipeline, and table target.

---

### ✅ CLEAR-03 — `functional-requirements.md` has no FR-KU series

**Status**: CLEAR — FR-KU-001 through FR-KU-005 do not exist. Safe to add.

---

### ✅ CLEAR-04 — `technical-requirements-specification.md` has no TR-KU series

**Status**: CLEAR — TR-KU-001 through TR-KU-004 do not exist. Safe to add.

---

### ✅ CLEAR-05 — `test-strategy.md` has no Pipeline 2 section

**Status**: CLEAR — No Pipeline 2 test coverage section exists. Safe to add.

---

### ⚠️ ADVISORY-01 — Alignment Plan is the authoritative content source

The content for FR-KU-001 through FR-KU-005 and TR-KU-001 through TR-KU-004 is defined
verbatim in the Alignment Plan §6 and §7 respectively. governance-liaison-isms-agent must
use these definitions as the source of truth. Paraphrasing, summarising, or omitting
acceptance criteria will cause FFA-CONTENT-01 or FFA-CONTENT-02 to fail.

Specific values that MUST appear verbatim in the governance docs:
- Chunk size: **2000 characters** (TR-KU-001)
- Overlap: **200 characters** (TR-KU-001)
- Minimum chunk length: **50 characters** (TR-KU-001)
- Embedding dimensions: **1536** (TR-KU-002)
- Domain taxonomy values: `general`, `iso27001`, `nist`, `pci-dss`, `soc2`, `risk-management` (FR-KU-003)
- Approval status on insert: **`pending`** — never `approved` (TR-KU-003)
- `source_document_name`, `chunk_index`, `chunk_size`, `chunk_overlap` as metadata fields (TR-KU-003)
- All 12 test IDs (T-KU-001 through T-KU-012) in test-strategy.md

### ⚠️ ADVISORY-02 — ADR-005 is an absolute hard constraint

ADR-005 declares Pipeline 1 (Criteria Parsing) and Pipeline 2 (Knowledge Ingestion) as
architecturally separate. governance-liaison-isms-agent must add all amendments as
**new sections only**. No existing Pipeline 1 content in any of the 7 documents may be
modified, reworded, or deleted. Any modification to existing pre-DCKIS content = REJECTION-PACKAGE.

---

## 6. Complete Qualifying Task Registry

| Task ID | Document | Amendment | IIA Trigger | Required Evidence |
|---------|----------|-----------|-------------|-------------------|
| GOV-001-D1 | `modules/mat/00-app-description/app-description.md` | Add §6.3 Knowledge Document Upload (Pipeline 2) | AAWP_MAT | Substantive §6.3 content matching ADVISORY-01; no existing sections modified |
| GOV-001-D2 | `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` | Add STEP 2b: Knowledge Upload workflow | AAWP_MAT | STEP 2b with distinct actor, UI, pipeline, table from STEP 2; no Step 2/2a modifications |
| GOV-001-D3 | `modules/mat/01-frs/functional-requirements.md` | Append FR-KU-001 to FR-KU-005 | AAWP_MAT | All 5 FRs with full acceptance criteria matching Alignment Plan §6; no existing FRs modified |
| GOV-001-D4 | `modules/mat/01.5-trs/technical-requirements-specification.md` | Append TR-KU-001 to TR-KU-004 | AAWP_MAT | All 4 TRs with full technical constraints and all specific values matching Alignment Plan §7 |
| GOV-001-D5 | `modules/mat/02-architecture/system-architecture.md` | Add **§4.6** Pipeline 2 Knowledge Ingestion architecture | AAWP_MAT | §4.6 with component diagram, data flow, target table, ADR-001–ADR-005 references; **NOT §4.3** |
| GOV-001-D6 | `modules/mat/03-implementation-plan/implementation-plan.md` | Add **Wave 19**: Knowledge Upload Centre Integration | AAWP_MAT | Wave 19 entry with builder assignments, test IDs, entry/exit criteria; **NOT Wave 17** |
| GOV-001-D7 | `modules/mat/02-architecture/test-strategy.md` | Add Pipeline 2 test coverage requirements section | AAWP_MAT | All 12 test IDs (T-KU-001 to T-KU-012) with descriptions matching Alignment Plan §4 RED gate spec |

**Total qualifying tasks**: 7
**All are AAWP_MAT + PRE_BRIEF_ASSURANCE triggers**: IAA required at handover for all 7.

---

## 7. Pre-Brief Advisory — Alignment Plan Numbering Corrections Required

The Alignment Plan was written before IAA inspected the live document state. Two numbering
corrections are required. These do NOT invalidate the Alignment Plan — the content
definitions remain authoritative. Only the section/wave numbers must be updated:

| Alignment Plan Says | Correct Value | Reason |
|--------------------|---------------|--------|
| "Add §4.3 Pipeline 2 Knowledge Ingestion architecture" | **§4.6** | §4.3 already occupied by AI Gateway DocumentParser Specification |
| "Add Wave 17: Knowledge Upload Centre Integration" | **Wave 19** | Wave 17 = User-Guided Parsing; Wave 18 = Criteria Parsing Repair. Next available = 19. |

governance-liaison-isms-agent must apply these corrections in the delivered documents.
The Alignment Plan §4 (Wave DCKIS-GOV-001 Deliverables table) should be updated to
reflect §4.6 and Wave 19 for future reference clarity.

---

## 8. Summary

| Field | Value |
|-------|-------|
| **Qualifying tasks** | 7 (GOV-001-D1 through GOV-001-D7) |
| **Trigger category** | AAWP_MAT + PRE_BRIEF_ASSURANCE |
| **IAA required at handover** | YES — MANDATORY — PHASE_B_BLOCKING |
| **FFA checks declared** | FFA-CONTENT-01 through FFA-CONTENT-10 + applicable CORE checks |
| **Scope blockers** | 2 BLOCKING (§4.3 and Wave 17 already in use — see §5) |
| **Required section** | §4.6 (not §4.3) in system-architecture.md |
| **Required wave** | Wave 19 (not Wave 17) in implementation-plan.md |
| **ADR-005 constraint** | ABSOLUTE — zero Pipeline 1 file touches |
| **Content source authority** | Alignment Plan §6 (FRs) and §7 (TRs) — verbatim required |
| **PREHANDOVER proof** | Required — committed before IAA invocation (§4.3b architecture) |
| **SCOPE_DECLARATION.md** | Required — list format, must match `git diff --name-only` exactly |
| **Pre-IAA commit gate** | Required — `git status` must show clean working tree |
| **Token file** | Written by IAA at verdict time — governance-liaison must NOT pre-create it |

---

**Pre-Brief authored by**: independent-assurance-agent v6.2.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Phase 0 complete. This session ends here.**
**Phases 1–4 will be executed at handover when governance-liaison-isms-agent invokes IAA.**
