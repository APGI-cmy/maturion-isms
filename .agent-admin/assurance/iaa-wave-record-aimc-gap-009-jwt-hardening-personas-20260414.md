# IAA Wave Record — AIMC GAP-009 / JWT Hardening / Personas

**Wave**: aimc-gap-009-jwt-hardening-personas-20260414
**Branch**: copilot/aimc-gap-009-harden-jwt-auth
**Date**: 2026-04-14
**IAA Agent**: independent-assurance-agent v6.2.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## PRE-BRIEF

**Invocation type**: PRE-BRIEF (Phase 0)
**Invoked by**: foreman-v2-agent (wave start — direct PRE-BRIEF request)
**Triggering issue**: [AIMC Persona & Gap Remediation] Multi-wave execution: persona specification, GAP-009, F-D3-002, CL-7/CL-6, GRS sign-off
**Branch**: copilot/aimc-gap-009-harden-jwt-auth
**Pre-Brief generated**: 2026-04-14
**Ceremony admin appointed**: NOT YET DECLARED in wave-current-tasks.md (new wave — Foreman must update)

---

## PREFLIGHT: 4/4 SILENT CHECKS PASS

| Check | Condition | Verdict |
|-------|-----------|---------|
| 1. Contract YAML parseable | agent.id = independent-assurance-agent, class = assurance, v6.2.0 | ✅ PASS |
| 2. Tier 2 files present | All 12 files confirmed in `.agent-workspace/independent-assurance-agent/knowledge/` | ✅ PASS |
| 3. CANON_INVENTORY hashes valid | 200 canons — all `file_hash_sha256` values non-null, non-empty; INDEPENDENT_ASSURANCE_AGENT_CANON.md hash `f79752f9...` present | ✅ PASS |
| 4. FAIL-ONLY-ONCE rules loaded | A-001 through A-035 loaded; no open breaches with uncompleted corrective actions | ✅ PASS |

> **PREFLIGHT: 4/4 silent checks PASS. Adoption phase: PHASE_B_BLOCKING. STANDBY.**

---

## 1. Qualifying Tasks

**Wave scope assessed per `iaa-trigger-table.md` v2.4.0 — decision flow applied wave-level:**

### Wave-Level Trigger Classification

| Wave | Description | Assigned To | File Area (Expected) | IAA Trigger Category | IAA Required? |
|------|-------------|-------------|---------------------|---------------------|---------------|
| Wave 1 — GAP-009 | EpisodicMemoryAdapter.record() → Supabase ai_episodic_events | integration-builder | `packages/ai-centre/` — Supabase INSERT + TypeScript | **AAWP_MAT** | ✅ YES |
| Wave 2 — F-D3-002 | JWT auth hardening, ARC approval endpoint, CS2 identity validation | api-builder | `packages/ai-centre/` — API endpoint + auth middleware | **AAWP_MAT** | ✅ YES |
| Wave 3 — CL-6 | LKIAC knowledge re-ingestion | qa-builder, api-builder | `packages/ai-centre/` — knowledge ingestion pipeline | **AAWP_MAT** | ✅ YES |
| Wave 4 — CL-7 | PersonaLoader YAML validation + PersonaValidationError type | integration-builder, qa-builder | `packages/ai-centre/` — loader + type definition | **AAWP_MAT** | ✅ YES |
| Wave 5 — Persona enrichment | mat-advisor, isms-navigator, maturity-roadmap-advisor, risk-advisor, xdetect-advisor enrichment | mat-specialist, risk-platform-agent, maturity-scoring-agent | `packages/ai-centre/personas/` YAML files | **AAWP_MAT** | ✅ YES |
| Wave 6 — GRS Admin | CS2 sign-off on AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md v0.1.0 | CS2 (sign-off) | ⚠️ **AMBIGUOUS — see blocker B-003 below** | **AMBIGUOUS → MANDATORY** | ✅ YES |

### Decision Flow Determination

```
Step 1 — .github/agents/ changes?
  → Likely NO for build waves. If Wave 4/5 produces new types consumed by agents → STILL NO (code change not contract).
  → Wave 6 GRS: If spec document modifies governance/agents/ → YES. Most likely NOT agent contracts.
  → Result: NO → continue

Step 2 — governance/canon/ or CANON_INVENTORY.json?
  → Wave 6 GRS: AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md — if it lands in governance/canon/ → YES.
  → AMBIGUOUS at pre-brief time. Target path must be declared before build.
  → Result: AMBIGUOUS → MANDATORY (FAIL-ONLY-ONCE A-003)

Step 3 — .github/workflows/ changes?
  → F-D3-002 JWT hardening: possible middleware/CI change, but primarily code-level.
  → Likely NO → continue

Step 4 — AAWP/MAT labelled deliverables?
  → Waves 1–5 are AIMC feature deliverables in packages/ai-centre/ → YES
  → Result: AAWP_MAT → IAA MANDATORY

Final Classification: MIXED (AAWP_MAT dominant + potential CANON_GOVERNANCE for Wave 6)
```

**Overall wave IAA classification: MIXED → IAA MANDATORY at all qualifying PR handovers.**

### Qualifying Tasks for Formal IAA Assurance

**Task 1 — Phase 4 Handover PR (Waves 1–5 combined or per-wave if separate PRs):**
The PR containing:
- Wave 1: EpisodicMemoryAdapter Supabase integration (`packages/ai-centre/`)
- Wave 2: JWT auth hardening on ARC endpoint (`packages/ai-centre/`)
- Wave 3: CL-6 LKIAC re-ingestion pipeline (`packages/ai-centre/`)
- Wave 4: PersonaLoader + PersonaValidationError (`packages/ai-centre/`)
- Wave 5: Persona YAML enrichment files (`packages/ai-centre/personas/`)
- PREHANDOVER proof (`execution-ceremony-admin-agent/bundles/`)
- Session memory (`.agent-workspace/foreman-v2/memory/`)
- Updated wave-current-tasks.md
- SCOPE_DECLARATION.md

**Task 2 — Wave 6 GRS Admin PR (separate, pending path clarification):**
The PR containing AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md v0.1.0.
⚠️ If path is `governance/canon/` → requires dedicated CANON_GOVERNANCE invocation.
⚠️ If path is `governance/` (non-canon) → MIXED overlay at handover PR.
Cannot be bundled with Task 1 without path declaration.

**Qualifying task count: 2 (Task 1 = build deliverables handover; Task 2 = GRS Admin — path-dependent)**

---

## 2. Applicable Overlays

### Task 1 — Primary Category: AAWP_MAT (BUILD_DELIVERABLE)

| Overlay Layer | Files Loaded | Scope |
|--------------|-------------|-------|
| Core invariants | CORE-020 (zero partial pass), CORE-021 (zero severity tolerance) | Applies to all checks |
| BUILD_DELIVERABLE | BD-000 through BD-024 | Primary 90% effort |
| CERT-001 through CERT-004 | Universal ceremony gate | Existence checks only |
| FAIL-ONLY-ONCE | A-001, A-015, A-021, A-026, A-029, A-029b, A-032, A-034, A-035 | Active rules per wave content |
| FUNCTIONAL-BEHAVIOUR-REGISTRY | NBR-001, NBR-002, NBR-003, NBR-004 | Applied per code area touched |
| Security class (F-D3-002) | CORE-021 zero tolerance | JWT auth hardening = security-class finding |

**IAA effort allocation for Task 1:**
- 90%: Build correctness, wiring, security, schema compliance, persona functional accuracy
- 10%: Ceremony existence checks (PREHANDOVER present? Yes/No. Session memory present? Yes/No.)

### Task 2 — Category: CANON_GOVERNANCE or MIXED (pending path declaration)

| If path is... | Overlay | IAA Effort |
|--------------|---------|-----------|
| `governance/canon/` | CANON_GOVERNANCE | 90% governance alignment, contradiction check, version bump |
| `governance/` (non-canon) | MIXED (AAWP_MAT + GOVERNANCE_AUDIT) | As per MIXED overlay |
| Bundled in Task 1 PR | MIXED (AAWP_MAT dominant) | Wave 6 gets CANON_GOVERNANCE sub-check within MIXED |

---

## 3. FAIL-ONLY-ONCE Checks Required

The following FAIL-ONLY-ONCE rules are MANDATORY at IAA invocation for this wave:

| Rule | Description | Wave Applicability | Blocking? |
|------|-------------|-------------------|-----------|
| **A-001** | IAA invocation evidence present in PREHANDOVER proof | All waves | ✅ Hard block |
| **A-015** | PREHANDOVER ceremony required — no content-type exemption | All waves | ✅ Hard block |
| **A-021** | Commit before IAA invocation — git-committed artifacts only | All waves | ✅ Hard block |
| **A-026** | SCOPE_DECLARATION.md exact match to `git diff --name-only` | All waves | ✅ Hard block |
| **A-029** | `iaa_audit_token` = expected reference format (not PENDING) | PREHANDOVER proof | ✅ Hard block |
| **A-029b** | Carry-Forward Mandate — any open AIMC Phase 2 blockers from PR #1367 | Waves 1–4 (AIMC) | ✅ Hard block |
| **A-032** | Schema Column Compliance — ai_episodic_events INSERT columns verified against DDL | **Wave 1 (GAP-009)** — CRITICAL | ✅ Hard block |
| **A-033** | Git-committed verification (`git ls-tree HEAD`) — not disk-only | PREHANDOVER proof | ✅ Hard block |
| **A-034** | FUNCTIONAL-BEHAVIOUR-REGISTRY read mandatory for BUILD PRs | All build waves | ✅ Hard block |
| **A-035** | Niggle pattern library — stack-specific patterns applied | All build waves | ✅ Hard block |

### FUNCTIONAL-BEHAVIOUR-REGISTRY: Anti-Regression Obligations

**Anti-regression obligations: YES**

| NBR Entry | Pattern | Applicable Wave | Check Required |
|-----------|---------|----------------|----------------|
| **NBR-001** | TanStack mutation cache invalidation | Any wave with `useMutation` additions | Verify `onSuccess`/`onSettled` calls `queryClient.invalidateQueries` |
| **NBR-002** | Supabase RLS write policy silently blocks non-owner | **Wave 1 (ai_episodic_events INSERT)** — CRITICAL | Verify RLS policy covers all writer roles; verify error checking in application code |
| **NBR-003** | Zustand store not reset between sessions | Wave 4 (PersonaLoader — if store is used) | Verify reset mechanism on scope exit |
| **NBR-004** | Optimistic update not rolled back on error | Any wave with optimistic `useMutation` | Verify `onError` restores snapshot |

---

## 4. PREHANDOVER Structure Required

Foreman and execution-ceremony-admin-agent must produce a PREHANDOVER proof conforming to:

```
## PREHANDOVER Proof — AIMC GAP-009 / JWT Hardening / Personas
wave: aimc-gap-009-jwt-hardening-personas-20260414
branch: copilot/aimc-gap-009-harden-jwt-auth
iaa_audit_token: IAA-session-NNN-aimc-gap-009-jwt-hardening-personas-20260414-PASS

## Deliverables

### Wave 1 — GAP-009: EpisodicMemoryAdapter Supabase Persistence
[Evidence: file paths, migration DDL path, schema column cross-check]

### Wave 2 — F-D3-002: JWT Auth Hardening (ARC Approval Endpoint)
[Evidence: endpoint path, auth middleware path, CS2 identity validation evidence]

### Wave 3 — CL-6: LKIAC Knowledge Re-ingestion
[Evidence: ingestion pipeline, test run evidence]

### Wave 4 — CL-7: PersonaLoader YAML Validation + PersonaValidationError
[Evidence: type definition path, validation logic path, test coverage]

### Wave 5 — Persona Enrichment
[Evidence: YAML file paths for each advisor, domain accuracy validation method]

### Wave 6 — GRS Admin (if bundled)
[Evidence: AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md v0.1.0 path, CS2 sign-off reference]

## Architecture Ripple/Impact Assessment
[Required per A-023 / OVL-AC-012]

## Wave Gap Register
[Open items from AIMC Phase 2 audit (PR #1367); GAP-009 and F-D3-002 as resolved-by-this-wave entries]

## Environment Parity
[OVL-AM-006 — env var parity for JWT secrets, Supabase connection, LKIAC config]

## SCOPE_DECLARATION alignment
[git diff --name-only match declaration]
```

**Critical PREHANDOVER field**: `iaa_audit_token` MUST be pre-populated with the expected reference format per A-029. Do NOT use `PENDING`.

---

## 5. Scope Blockers

| ID | Blocker | Severity | Resolution Required Before |
|----|---------|----------|--------------------------|
| **B-001** | ai_episodic_events migration DDL must exist and be committed before IAA will evaluate Wave 1 (A-032). If the table migration is missing → instant REJECTION-PACKAGE. | 🔴 CRITICAL | Wave 1 IAA invocation |
| **B-002** | F-D3-002 JWT hardening is a security-class finding from AIMC Phase 2 audit. CORE-021 zero-severity-tolerance applies with maximum weight. Any incomplete auth pathway, unauthenticated access vector, or missing CS2 identity validation check → REJECTION-PACKAGE. No exceptions. | 🔴 CRITICAL | Wave 2 IAA invocation |
| **B-003** | AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md target file path is UNDECLARED. Must be declared before Wave 6 build starts. If the file lands in `governance/canon/` → CANON_GOVERNANCE overlay applies with dedicated IAA invocation. Bundling with Waves 1–5 without path declaration = AMBIGUITY → mandatory separate classification. | 🟠 HIGH | Wave 6 pre-build |
| **B-004** | A-029b Carry-Forward Mandate: Any open blockers from AIMC Phase 2 audit (PR #1367 — PARTIAL PASS: 6 PARTIAL, 1 FAIL) must be either (a) resolved in this wave, (b) tracked as a blocking issue referenced in PREHANDOVER, or (c) covered by CS2 written exception. If open blockers remain unaddressed → REJECTION-PACKAGE per A-029b. | 🟠 HIGH | PREHANDOVER proof |
| **B-005** | wave-current-tasks.md has NOT been updated for this new wave (still shows AIMC Phase 2 as COMPLETE). Foreman MUST update wave-current-tasks.md with the new wave scope, `ceremony_admin_appointed` field, and `iaa_prebrief_path` pointer before builder delegations commence. | 🟡 MEDIUM | Wave 1 delegation |
| **B-006** | NBR-002 (Supabase RLS write policy): The ai_episodic_events table must have explicit RLS policies for all roles expected to INSERT. If the migration only creates the table without write RLS policies → NBR-002 FAIL. IAA will not pass Wave 1 without RLS policy evidence. | 🟡 MEDIUM | Wave 1 IAA invocation |

---

## 6. Pre-Brief Concerns

### Concern 1 — Security Class Finding (F-D3-002): ZERO TOLERANCE
F-D3-002 was classified as a FAIL in the AIMC Phase 2 audit. JWT auth hardening on the ARC approval endpoint is a security-critical finding. IAA applies CORE-021 zero-severity-tolerance with no exceptions for security class. The following are non-negotiable requirements:
- JWT signature verification must be end-to-end (not just presence check)
- CS2 identity claim must be validated against the token's `sub`/`iss` field per AIMC strategy
- No unauthenticated fallback path on the ARC approval endpoint
- Auth bypass scenarios must be tested and evidence provided

Any "partial implementation" or "we'll harden further later" posture → REJECTION-PACKAGE. This must be complete.

### Concern 2 — GAP-009 Blocks CP-11/CL-12: Execution Order Dependency
The issue declares GAP-009 (Wave 1) blocks CP-11/CL-12. This means:
- Wave 1 must be completed AND verified before any work that depends on EpisodicMemoryAdapter.record() functioning correctly
- Integration tests that exercise ai_episodic_events persistence must be committed alongside the implementation (BD-003: one-time build compliance)
- Test mocking of Supabase that masks the real integration behaviour will NOT satisfy IAA (A-032 note: "Mocked Supabase tests do NOT satisfy schema compliance evidence")

### Concern 3 — Multi-Agent Delegation Complexity
This wave spans 8 agents (integration-builder × 2, api-builder × 2, qa-builder × 2, mat-specialist, risk-platform-agent, maturity-scoring-agent). Foreman must:
- Ensure all delegations are captured in wave-current-tasks.md before build starts
- Each agent must produce a builder checklist entry (Stage 9)
- PREHANDOVER must aggregate evidence from all 8 delegation bundles
- No delegation result may be accepted without the producing agent completing their artifact set

### Concern 4 — Wave 5 Persona Enrichment: Specialist Agent Scope Boundary
mat-specialist, risk-platform-agent, and maturity-scoring-agent are SPECIALIST class, not BUILDER class. IAA will verify:
- They did NOT modify `.github/agents/` files (A-005)
- Their persona YAML output is committed and file paths are declared in SCOPE_DECLARATION.md
- Domain accuracy claims are substantiated (not just asserted)
- If any persona file resides in a governance-controlled path → additional trigger classification applies

### Concern 5 — CL-6 + CL-7 Carryover Status from Phase 2 Audit
AIMC Phase 2 audit returned CL-6 (LKIAC re-ingestion) and CL-7 (PersonaLoader validation) as carryover items. IAA will apply A-029b (Carry-Forward Mandate) and verify these are fully remediated, not partially addressed. "Mostly done" is not a passing verdict under CORE-021.

---

## 7. Pre-Brief Verdict

```
Qualifying tasks: 2
  Task 1: Waves 1–5 Build Deliverables handover PR (AAWP_MAT)
  Task 2: Wave 6 GRS Admin (AMBIGUOUS — CANON_GOVERNANCE or MIXED; path declaration required)

Applicable overlay:
  Task 1: BUILD_DELIVERABLE (BD-000–BD-024) + CERT-001–CERT-004
  Task 2: CANON_GOVERNANCE (if governance/canon/) or MIXED (if governance/ non-canon)
  Both tasks: CORE-020, CORE-021

Anti-regression obligations: YES
  NBR-001: FUNCTIONAL-BEHAVIOUR-REGISTRY ref — mutation cache invalidation (all build waves)
  NBR-002: FUNCTIONAL-BEHAVIOUR-REGISTRY ref — Supabase RLS write policy (Wave 1 CRITICAL)
  NBR-003: FUNCTIONAL-BEHAVIOUR-REGISTRY ref — Zustand store reset (Wave 4 if store used)
  NBR-004: FUNCTIONAL-BEHAVIOUR-REGISTRY ref — optimistic update rollback (any optimistic mutations)

Scope blockers: 6 (B-001 through B-006); B-001 and B-002 are CRITICAL — must resolve before IAA invocation

Key FFA checks at handover:
  A-032 (Schema column compliance — ai_episodic_events DDL)
  A-029b (Carry-forward mandate — AIMC Phase 2 open items)
  NBR-002 (Supabase RLS write policy — ai_episodic_events)
  CORE-021 (Zero tolerance — F-D3-002 JWT hardening is security-class)
```

---

## TOKEN

_To be populated after formal IAA assurance invocation at handover PR._

---

## REJECTION_HISTORY

_No rejections recorded yet. Populated if REJECTION-PACKAGE is issued._

---

**Wave record created**: 2026-04-14
**IAA Agent**: independent-assurance-agent v6.2.0
**Next action**: Foreman to update wave-current-tasks.md, declare Wave 6 GRS target path, appoint ceremony admin, then commence builder delegations.
