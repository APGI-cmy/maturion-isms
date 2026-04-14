# IAA Wave Record — AIMC Audit Phase 2

**Wave**: aimc-audit-phase-2-20260414
**Branch**: copilot/aimc-audit-phase-2-orchestrate
**Date**: 2026-04-14
**IAA Agent**: independent-assurance-agent v6.2.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## PRE-BRIEF

**Invocation type**: PRE-BRIEF (Phase 0)
**Invoked by**: foreman-v2-agent (wave-current-tasks.md + direct invocation in issue comment)
**Triggering issue**: [AIMC Audit Phase 2] Orchestrate distributed AIMC audit & consolidate findings
**Pre-Brief generated**: 2026-04-14

---

### 1. Qualifying Tasks

**Trigger classification applied per `iaa-trigger-table.md` v2.4.0 — decision flow steps 1–11:**

| Step | Question | Answer | Result |
|------|----------|--------|--------|
| 1 | Any `.github/agents/` changes? | NO | → continue |
| 2 | Any `governance/canon/` or `CANON_INVENTORY.json` changes? | NO — audit report is in `governance/AUDIT/`, not `governance/canon/` | → continue |
| 3 | Any `.github/workflows/` changes? | NO | → continue |
| 4 | Any AAWP/MAT labelled deliverables? | NO | → continue |
| 5 | Any `governance/quality/agent-integrity/` changes? | NO | → continue |
| 6 | Any `.agent-workspace/*/knowledge/` changes? | NO | → continue |
| 7 | Any governance liaison artifacts? | NO | → continue |
| 8 | Any pre-build stage governance artifacts? | NO — audit-only wave | → continue |
| 9 | Any cross-app component governance changes? | NO | → continue |
| 10 | ONLY retrospective audit artifacts? | **MIXED** — `governance/AUDIT/AIMC_PHASE2_AUDIT_CONSOLIDATED_REPORT.md` is a NEW primary governance document (not retrospective); `.agent-workspace/audit/` evidence files are new (not retrospective); PREHANDOVER proof IS retrospective | → AMBIGUITY RULE invoked |
| 11 | Clearly EXEMPT (doc-only outside governance/)? | NO — consolidated report is inside `governance/` tree and constitutes new governance documentation | → AMBIGUITY RULE: IAA MANDATORY |

**Classification: MIXED → IAA MANDATORY at final PR handover**

Per FAIL-ONLY-ONCE A-003: "Ambiguity resolves to mandatory invocation." The consolidated audit report (`governance/AUDIT/AIMC_PHASE2_AUDIT_CONSOLIDATED_REPORT.md`) is a new primary governance document, not purely retrospective record-keeping. Under the AMBIGUITY RULE, the full PR qualifies for IAA review.

**Qualifying tasks for formal IAA assurance at handover:**

1. **Phase 4 handover ceremony** — the final PR containing:
   - `governance/AUDIT/AIMC_PHASE2_AUDIT_CONSOLIDATED_REPORT.md` (NEW governance document → triggers MIXED)
   - `.agent-workspace/audit/AIMC-P2-*` evidence files (NEW, not retrospective)
   - `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-aimc-audit-phase-2-20260414.md` (ceremony artifact)
   - `.agent-workspace/foreman-v2/memory/session-aimc-audit-phase-2-20260414.md` (session memory)
   - `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (updated with task completions)

**Intermediate delegation work (D1–D5): NOT separately triggering** — workspace-only artifacts during execution do not open PRs and are committed as part of the single wave PR. No separate IAA invocations required for each delegation.

**Qualifying task count: 1 (Phase 4 handover ceremony PR)**

---

### 2. Applicable Overlay

**Primary category: MIXED (GOVERNANCE_AUDIT base + new governance document)**

At formal IAA invocation (Phase 4 handover), the applicable overlay will be:

- **Core invariants**: CORE-020 (zero partial pass), CORE-021 (zero severity tolerance)
- **Overlay**: GOVERNANCE_AUDIT — audit document completeness, scope coverage, evidence substantiation
- **No BUILD overlay**: NBR-001 (TanStack mutations), NBR-002 (Supabase RLS writes), NBR-003 and all other Functional Behaviour Registry build-pattern checks are **NOT APPLICABLE** — this is a governance-doc-only audit wave with zero production code changes

**IAA checks at handover will focus on:**

| Check reference | Description | Basis |
|----------------|-------------|-------|
| CORE-020 | No partial passes — all evidence must be verifiable or → REJECTION | Core invariant |
| CORE-021 | Zero severity tolerance — no "minor" findings waived without CS2 waiver | Core invariant |
| OVERLAY: Report completeness | All declared test categories (D, E, G) covered in consolidated report | GOVERNANCE_AUDIT overlay |
| OVERLAY: Evidence substantiation | Each finding in consolidated report must have traceable evidence in `.agent-workspace/audit/` files | GOVERNANCE_AUDIT overlay |
| OVERLAY: Phase 1 continuity | Phase 2 report must correctly reference Phase 1 results (Categories A, B, C — all PASS, CL-4) | GOVERNANCE_AUDIT overlay |
| OVERLAY: Scope declaration alignment | PR diff must exactly match declared artifact paths in scope-declaration-wave-aimc-audit-phase-2.md | A-026 |
| OVERLAY: PREHANDOVER proof compliance | iaa_audit_token MUST follow A-029 pattern (expected reference, NOT "PENDING") | A-029 |
| OVERLAY: Session memory present | Foreman session memory artifact committed and present | A-015 |

---

### 3. Anti-Regression Obligations

**Applicable FAIL-ONLY-ONCE rules for this wave:**

| Rule | Applies? | Notes |
|------|----------|-------|
| A-001 (IAA invocation evidence) | **YES** — APPLICABLE | At handover: PREHANDOVER proof or PR artifacts must reference IAA pre-brief token. This wave record IS the invocation evidence. |
| A-002 (No class exemptions) | N/A for this wave | No agent contract PRs in this wave |
| A-003 (Ambiguity → mandatory) | **YES — APPLIED HERE** | `governance/AUDIT/` new document triggers MIXED; IAA mandatory at handover |
| A-015 (PREHANDOVER ceremony required for triggered PRs) | **YES — APPLICABLE** | Wave is MIXED-triggered; PREHANDOVER proof with full ceremony is required |
| A-026 (Scope declaration must match PR diff) | **YES — APPLICABLE** | All artifacts in PR diff must appear in scope-declaration-wave-aimc-audit-phase-2.md |
| A-029 (PREHANDOVER immutability — iaa_audit_token NOT "PENDING") | **YES — APPLICABLE** | Foreman must pre-populate `iaa_audit_token` with expected reference format before committing PREHANDOVER proof |
| NBR-001 through NBR-xxx (Functional Behaviour Registry) | **NOT APPLICABLE** | Governance-doc-only wave; no code, no TanStack, no Supabase writes in diff |

**Anti-regression: YES** — A-001, A-003, A-015, A-026, A-029 all apply to this wave.

---

### 4. PREHANDOVER Structure Requirements

The following PREHANDOVER structure is MANDATORY for handover ceremony to pass IAA review:

**Artifact**: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-aimc-audit-phase-2-20260414.md`

**Required fields and status:**

```
wave: aimc-audit-phase-2-20260414
branch: copilot/aimc-audit-phase-2-orchestrate
iaa_audit_token: IAA-session-NNN-wave-aimc-audit-phase-2-20260414-PASS
  ↑ MANDATORY: pre-populated with expected reference at commit time (A-029)
  ↑ NOT "PENDING" — do not use PENDING pattern

deliverables:
  - path: .agent-workspace/audit/AIMC-P2-category-d-kuc-review-20260414.md
    status: COMMITTED | sha: [git SHA]
  - path: .agent-workspace/audit/AIMC-P2-category-e-persona-reviews-20260414.md
    status: COMMITTED | sha: [git SHA]
  - path: .agent-workspace/audit/AIMC-P2-category-g-process-review-20260414.md
    status: COMMITTED | sha: [git SHA]
  - path: .agent-workspace/audit/AIMC-P2-parking-station-review-20260414.md
    status: COMMITTED | sha: [git SHA]
  - path: governance/AUDIT/AIMC_PHASE2_AUDIT_CONSOLIDATED_REPORT.md
    status: COMMITTED | sha: [git SHA]

session_memory: .agent-workspace/foreman-v2/memory/session-aimc-audit-phase-2-20260414.md
scope_declaration: .agent-workspace/foreman-v2/personal/scope-declaration-wave-aimc-audit-phase-2.md
wave_record: .agent-admin/assurance/iaa-wave-record-aimc-audit-phase-2-20260414.md
```

**PREHANDOVER completeness gate** — IAA will FAIL any handover where:
- `iaa_audit_token` is `PENDING` or blank (A-029 violation → REJECTION)
- Any declared deliverable is absent from committed branch (CORE-020 → REJECTION)
- Session memory not present (A-015 → REJECTION)
- Scope declaration artifact list does not match PR diff (A-026 → REJECTION)

---

### 5. FFA — Foreman Fitness Assessment

**Foreman fitness checks at pre-brief time:**

| Check | Status | Notes |
|-------|--------|-------|
| IAA Pre-Brief invoked | ✅ CONFIRMED | This artifact is the pre-brief. Wave record path as declared. |
| CS2 authorization | ✅ CONFIRMED | Issue opened by CS2 (@APGI-cmy); valid per §2.1 |
| Scope declaration present | ✅ CONFIRMED | `.agent-workspace/foreman-v2/personal/scope-declaration-wave-aimc-audit-phase-2.md` |
| Wave-current-tasks.md present | ✅ CONFIRMED | Audit artifacts declared, tasks listed |
| Architecture / specification present | ✅ CONFIRMED | `governance/AUDIT/AIMC_PHASE1_AUDIT_AND_TEST_PLAN.md` serves as audit specification |
| Evidence artifact paths declared | ✅ CONFIRMED | All 5 expected artifacts listed in wave-current-tasks.md and scope declaration |
| Branch declared | ✅ CONFIRMED | `copilot/aimc-audit-phase-2-orchestrate` |
| Pre-build stage model | N/A | Audit-orchestration wave — PBFAG confirmed in wave-current-tasks.md as N/A with Phase 1 plan as specification |
| `ceremony_admin_appointed` field | ⚠️ NOT RECORDED | Phase 4 handover ceremony is listed as a task (`execution-ceremony-admin-agent + IAA audit`) but no `ceremony_admin_appointed` field appears in wave-current-tasks.md. **Foreman should add this field before Phase 4.** Not a hard blocker at pre-brief time. |

**FFA verdict: CLEAR to proceed** — no hard blockers. One soft concern noted.

---

### 6. Scope Blockers and Concerns

**Hard blockers: NONE**

This wave is a governance-doc-only audit orchestration wave. No production code changes, no agent contract modifications, no CI workflow changes. No hard pre-build stage gates apply.

**Soft concerns (non-blocking, require resolution before Phase 4):**

| ID | Concern | Resolution required before |
|----|---------|---------------------------|
| SC-001 | `ceremony_admin_appointed` not recorded in wave-current-tasks.md | Before Phase 4 handover ceremony begins |
| SC-002 | MIXED classification confirmed — IAA invocation at Phase 4 is MANDATORY (not EXEMPT). Foreman must formally invoke IAA with PR link, not assume GOVERNANCE_AUDIT EXEMPT applies | At Phase 4 handover |
| SC-003 | A-029 compliance: PREHANDOVER proof must use expected reference pattern for `iaa_audit_token`, not "PENDING". Foreman must populate the expected token reference at PREHANDOVER proof commit time | At PREHANDOVER proof creation |

**Observation — no additional blockers from audit plan scope:**

The Phase 1 audit plan (`AIMC_PHASE1_AUDIT_AND_TEST_PLAN.md`) is well-structured and provides clear test specifications for Categories D, E, and G. Delegation assignment (D1–D6) is coherent. No structural concerns with the audit scope as presented.

---

### 7. ceremony_admin_appointed

**Status**: NOT INDICATED in wave-current-tasks.md at pre-brief time.
The task `Phase 4 handover ceremony (execution-ceremony-admin-agent + IAA audit)` is listed, confirming intent, but the formal `ceremony_admin_appointed` appointment record is absent.
**Action required**: Foreman to add `ceremony_admin_appointed: execution-ceremony-admin-agent` to wave-current-tasks.md before Phase 4 begins.

---

*Pre-Brief generated by independent-assurance-agent v6.2.0 | 2026-04-14 | PHASE_B_BLOCKING*
*Wave: aimc-audit-phase-2-20260414 | Pre-Brief mode: PHASE 0 — no assurance verdict issued*

---

## TOKEN

*Placeholder — to be populated by IAA after Phase 4 handover assurance review.*

```
PHASE_B_BLOCKING_TOKEN: [PENDING ISSUANCE — populated after Phase 4 IAA review]
Token reference: IAA-session-NNN-wave-aimc-audit-phase-2-20260414-PASS
Issued by: independent-assurance-agent
Issued after: Phase 4 formal invocation with PR link
```

---

## REJECTION_HISTORY

*No rejections recorded for this wave at pre-brief time.*
