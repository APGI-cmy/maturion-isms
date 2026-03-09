# IAA Pre-Brief — Wave 16 Orchestration Kick-Off

**Pre-Brief ID**: IAA-PREBRIEF-wave16-orchestration-20260309
**Wave**: wave16-orchestration — Wave 16 Completeness Gap Resolution Kick-Off
**Branch**: copilot/orchestrate-wave-16-build-again
**Date**: 2026-03-09
**Produced by**: independent-assurance-agent v6.2.0
**Requested by**: foreman-v2-agent (wave kick-off invocation)
**Authority**: CS2 (@APGI-cmy) — Issue: "Orchestrate Wave 16 Implementation Build for Completeness Gaps (see PR #1020)"
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## § 1 — Pre-Brief Mode Confirmation

This document is a **PRE-BRIEF artifact only**.  
IAA is NOT executing Phase 2–4 assurance in this session.  
Full assurance (ASSURANCE-TOKEN or REJECTION-PACKAGE) will be issued at handover when the
Foreman invokes IAA with the completed PREHANDOVER proof on this branch.

---

## § 2 — Wave Scope Review

**Source document**: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (read in full)

### Files Declared for This Kick-Off Session

| File | Type | IAA Category |
|------|------|-------------|
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Governance orchestration artifact | AAWP_MAT (combined trigger — see §3) |
| `modules/mat/BUILD_PROGRESS_TRACKER.md` | MAT module progress tracker v1.8 → v1.9 | **AAWP_MAT — PRIMARY TRIGGER** |
| `SCOPE_DECLARATION.md` | Admin — scope declaration for A-026 | ADMIN (EXEMPT standalone; subsumed into AAWP_MAT under MIXED rule) |
| `.agent-workspace/foreman-v2/memory/session-wave16-orchestration-20260309.md` | Session memory | EXEMPT (session memory only) |
| `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave16-orchestration-20260309.md` | PREHANDOVER proof | EXEMPT (ceremony artifact — but required for CORE-018 sweep) |
| `.agent-admin/assurance/iaa-prebrief-wave16.md` | **This Pre-Brief artifact** | IAA-authored ceremony artifact |

---

## § 3 — Trigger Category Classification

| Category | Triggered? | Basis |
|----------|-----------|-------|
| **AAWP_MAT** | **YES — PRIMARY** | `modules/mat/BUILD_PROGRESS_TRACKER.md` is in the `modules/mat/` path pattern — mandatory trigger |
| AGENT_CONTRACT | NO | No `.github/agents/` files modified |
| CANON_GOVERNANCE | NO | No `governance/canon/` files modified |
| CI_WORKFLOW | NO | No `.github/workflows/` files modified |
| KNOWLEDGE_GOVERNANCE | NO | No `.agent-workspace/*/knowledge/` files modified |
| AGENT_INTEGRITY | NO | No `governance/quality/agent-integrity/` files modified |
| MIXED | APPLICABLE | `modules/mat/` file (triggering) + admin/session files (non-triggering) — AAWP_MAT governs the whole PR per MIXED rule |
| EXEMPT | NOT APPLICABLE | PR contains triggering artifact — MIXED/AAWP_MAT applies |

**Ambiguity check**: Category is unambiguous — AAWP_MAT confirmed.  
**IAA required at handover**: **YES — MANDATORY (PHASE_B_BLOCKING)**

---

## § 4 — Qualifying Tasks for This Session

### Qualifying (IAA Applies)

| Task ID | Summary | IAA Trigger Category | Required at Handover |
|---------|---------|---------------------|---------------------|
| **KICK-OFF-001** | `modules/mat/BUILD_PROGRESS_TRACKER.md` v1.8 → v1.9 (Wave 16 ORCHESTRATION STARTED) | AAWP_MAT | Full FFA + CORE sweep |
| **KICK-OFF-002** | `wave-current-tasks.md` Wave 16 task register publication | AAWP_MAT (MIXED) | Session artifact completeness |
| **KICK-OFF-003** | PREHANDOVER proof for kick-off session | AAWP_MAT ceremony | CORE-018 sweep |
| **KICK-OFF-004** | SCOPE_DECLARATION.md accuracy | ADMIN — A-026 compliance | BL-027 merge gate parity |

### Not Qualifying (IAA Not Separately Triggered — Session Memory Only)

| Task ID | Summary | Reason |
|---------|---------|--------|
| KICK-OFF-MEM | Foreman session memory file | Session memory only — EXEMPT per trigger table |

---

## § 5 — FFA Checks IAA Will Run at Final Handover

### 5.1 Core Invariants (ALL — applied to every invocation)

> **Note — Applicability Scope**: CORE-001 through CORE-012 and CORE-022 are
> **AGENT_CONTRACT-specific** checks. This PR contains no agent contract files —
> those checks will receive `NOT APPLICABLE (no agent contract in scope)` at handover.
> All `ALL`-category core checks (CORE-005 through CORE-021) apply in full.

| Check ID | Name | Applicable? | Notes |
|----------|------|------------|-------|
| CORE-001 | YAML frontmatter valid | ❌ Not applicable | AGENT_CONTRACT only |
| CORE-002 | Agent version correct | ❌ Not applicable | AGENT_CONTRACT only |
| CORE-003 | Contract version present | ❌ Not applicable | AGENT_CONTRACT only |
| CORE-004 | Identity block complete | ❌ Not applicable | AGENT_CONTRACT only |
| CORE-005 | Governance block present | ✅ Applicable | Check PR artifacts reference governance correctly |
| CORE-006 | CANON_INVENTORY alignment | ✅ Applicable | Any governance references must resolve to non-null hashes |
| CORE-007 | No placeholder content | ✅ Applicable | No STUB/TODO/FIXME/TBD in BUILD_PROGRESS_TRACKER.md v1.9 or wave-current-tasks.md |
| CORE-008 | Prohibitions block present | ❌ Not applicable | AGENT_CONTRACT only |
| CORE-009 | Merge gate interface present | ❌ Not applicable | AGENT_CONTRACT only |
| CORE-010 | Tier 2 knowledge indexed | ❌ Not applicable | AGENT_CONTRACT only |
| CORE-011 | Four-phase structure present | ❌ Not applicable | AGENT_CONTRACT only |
| CORE-012 | Self-modification lock present | ❌ Not applicable | AGENT_CONTRACT only |
| CORE-013 | IAA invocation evidence | ✅ **BLOCKING** | PREHANDOVER proof must reference this Pre-Brief artifact (A-001) |
| CORE-014 | No class exemption claim | ✅ Applicable | No exemption claims permitted |
| CORE-015 | Session memory present | ✅ **BLOCKING** | Foreman session memory must be on branch |
| CORE-016 | IAA verdict evidenced (§4.3b) | ✅ **BLOCKING** | Dedicated token file required at `.agent-admin/assurance/iaa-token-session-wave16-orchestration-20260309-PASS.md` (FIRST-INVOCATION EXCEPTION applies — will be created this session) |
| CORE-017 | No unauthorized `.github/agents/` modifications | ✅ Applicable | No agent contract files in scope — verify via diff |
| CORE-018 | Complete evidence artifact sweep | ✅ **BLOCKING — FIRST CHECK** | PREHANDOVER proof, session memory, `iaa_audit_token` field, Pre-Brief artifact — all must be present |
| CORE-019 | IAA token cross-verification | ✅ Applicable | First-invocation exception applies — token file created this session |
| CORE-020 | Zero partial pass rule | ✅ Applicable | Any unverifiable check = REJECTION-PACKAGE |
| CORE-021 | Zero-severity-tolerance | ✅ **CONSTITUTIONAL** | Any finding = REJECTION-PACKAGE — no "minor" exceptions |
| CORE-022 | Secret field naming compliance | ❌ Not applicable | AGENT_CONTRACT only |

### 5.2 AAWP_MAT Overlay — Build Deliverable Checks

> **Orientation note**: This is a **pure governance/orchestration kick-off** with no production
> code. BD-TIER-1 through BD-TIER-5 checks are applied with governance-mode scope:
> the question is "does this orchestration artifact accurately represent the delivery state
> and correctly gate subsequent builder delegations?"

#### BD-TIER-1 — Delivery Completeness

| Check ID | Name | What IAA Checks |
|----------|------|----------------|
| BD-T1-W16-001 | BUILD_PROGRESS_TRACKER.md version bump | v1.9 present; Wave 16 status = "ORCHESTRATION STARTED"; 25-gap register referenced |
| BD-T1-W16-002 | wave-current-tasks.md completeness | All 16 sub-wave tasks listed with correct status (OPEN / BLOCKED / PARKED); dependencies documented |
| BD-T1-W16-003 | No production code committed | Verify PR diff contains ZERO: migrations, edge functions, frontend components, API handlers, test files |
| BD-T1-W16-004 | SCOPE_DECLARATION.md accuracy (A-026) | Must match `git diff --name-only origin/main...HEAD` exactly before IAA invocation |
| BD-T1-W16-005 | Blocked waves correctly documented | Wave 16.3, 16.4 status = BLOCKED with dependency on Wave 16.5; Wave 16.5 status = blocked on AIMC Waves 3-4; Wave 16.9 = PARKED |

#### BD-TIER-2 — Wiring & Integration (Governance-Mode)

| Check ID | Name | What IAA Checks |
|----------|------|----------------|
| BD-T2-W16-001 | Sub-wave execution sequence coherent | Execution sequence in wave-current-tasks.md is internally consistent — no circular dependencies, no task sequence violations |
| BD-T2-W16-002 | RED QA gate pre-condition documented | wave-current-tasks.md declares RED QA gate requirement before each builder delegation |
| BD-T2-W16-003 | IAA pre-brief gate pre-condition documented | Each actionable sub-wave lists "awaiting IAA pre-brief" in status — confirms gating is declared |

#### BD-TIER-3 — Test Quality (Not Applicable — Governance Kick-Off)

> BD-TIER-3 (QP evaluation, test debt, coverage) is **NOT APPLICABLE** for this session.
> No tests are added or modified in a pure governance/orchestration kick-off.
> **Required**: PREHANDOVER proof must contain explicit declaration: "QP gate: WAIVED — no
> tests added or modified in this session. Rationale: pure governance/orchestration kick-off."

#### BD-TIER-4 — Security (Minimal Scope)

| Check ID | Name | What IAA Checks |
|----------|------|----------------|
| BD-T4-W16-001 | No secrets or credentials committed | Scan diff for accidental credential exposure in any committed file |

#### BD-TIER-5 — Code Quality (Not Applicable — Governance Kick-Off)

> BD-TIER-5 code quality checks are **NOT APPLICABLE** for this session (no code delivered).

#### CST / CWT / FCWT Assessment

> **CST**: Not applicable — no sub-wave implementation is delivered in this kick-off session.
> **CWT**: Not applicable — wave 16 is starting, not completing.
> **FCWT**: Not applicable — not a wave closure or production sign-over.
>
> IAA will issue CST prompts at sub-wave handover PRs when cross-boundary integration
> points are reached (Wave 16.1+16.6+16.7 convergence; Wave 16.3+16.4 AIMC integration).
> CWT will be mandatory before Wave 16 IBWR completion.

### 5.3 Additional AAWP_MAT Admin Checks

| Check ID | Name | What IAA Checks |
|----------|------|----------------|
| OVL-AM-ADM-001 | PREHANDOVER proof structure per §6 of this Pre-Brief | All required fields present |
| OVL-AM-ADM-002 | `iaa_audit_token` field — PENDING pre-fill | Must be PENDING (not pre-filled with PASS token) per A-025 |
| OVL-AM-ADM-003 | Pre-IAA commit gate evidence | `git status` shows clean working tree; `git log` shows all declared files committed |
| OVL-AM-ADM-004 | A-026 SCOPE_DECLARATION match | Files in SCOPE_DECLARATION match `git diff --name-only origin/main...HEAD` exactly |

---

## § 6 — PREHANDOVER Proof Structure Requirements

The Foreman's PREHANDOVER proof for this kick-off session **MUST** contain the following
sections and fields. Any absent required field = **immediate CORE-018 failure** at handover.

```markdown
# PREHANDOVER Proof — session-wave16-orchestration-20260309
# Wave: wave16-orchestration
# Branch: copilot/orchestrate-wave-16-build-again

## Header
- session_id: session-wave16-orchestration-20260309
- wave: wave16-orchestration
- branch: copilot/orchestrate-wave-16-build-again
- date: 2026-03-09
- producing_agent: foreman-v2-agent
- pr_category: AAWP_MAT

## § 1 — Scope Declaration Evidence
- SCOPE_DECLARATION.md: reference current state
- Files committed: [explicit list matching git diff --name-only origin/main...HEAD]
- A-026 compliance: CONFIRMED — SCOPE_DECLARATION matches git diff output (paste evidence)

## § 2 — CS2 Authorization Evidence
- Issue: "Orchestrate Wave 16 Implementation Build for Completeness Gaps (see PR #1020)"
- Issue opened by: @APGI-cmy
- PR #1020 governance overlay committed: [SHA reference]
- Wave 16 authorization: CS2-issued issue + PR #1020 evidence

## § 3 — BUILD_PROGRESS_TRACKER.md Evidence
- Previous version: v1.8
- New version: v1.9
- Wave 16 status: ORCHESTRATION STARTED
- 25-gap register: referenced and linked
- Diff excerpt confirming v1.8 → v1.9 bump: [paste diff]

## § 4 — wave-current-tasks.md Evidence
- 16 sub-wave tasks registered: [list task IDs]
- Immediately actionable: T-W16.1-UI-001, T-W16.1-UI-002, T-W16.2-UI-001/002, T-W16.6-SCH-001/002, T-W16.7-UI-001/002, T-W16.8-DOC-001
- Blocked (with documented dependency): T-W16.3, T-W16.4 (on 16.5/AIMC); T-W16.5 (AIMC Waves 3-4)
- Parked: T-W16.9-PARKED (CS2 decision pending)

## § 5 — No Production Code Declaration
EXPLICIT DECLARATION: No migrations, edge functions, frontend components, API handlers,
test files, or executable production code were committed in this session.
Evidence: [git diff --stat output confirming only governance/orchestration files]

## § 6 — QP Gate
QP gate: WAIVED — no tests added or modified in this session.
Rationale: pure governance/orchestration kick-off. No executable code delivered.
Builder RED QA gate is required before each sub-wave delegation (documented in wave-current-tasks.md).

## § 7 — Pre-IAA Commit Gate
git status: [paste output showing clean working tree]
git log --oneline -5: [paste output showing all declared files in recent commits]

## § 8 — IAA Pre-Brief Evidence
IAA Pre-Brief artifact: .agent-admin/assurance/iaa-prebrief-wave16.md
Pre-Brief committed SHA: [SHA — verify this file is on branch]

## § 9 — Ceremony Artifacts on Branch
- Foreman session memory: .agent-workspace/foreman-v2/memory/session-wave16-orchestration-20260309.md — PRESENT
- PREHANDOVER proof (this file): .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave16-orchestration-20260309.md — PRESENT
- IAA Pre-Brief: .agent-admin/assurance/iaa-prebrief-wave16.md — PRESENT

## § 10 — IAA Audit Token
iaa_audit_token: PENDING
expected_token_file: .agent-admin/assurance/iaa-token-session-wave16-orchestration-20260309-PASS.md
```

> **A-029 compliance reminder**: The `iaa_audit_token` field must be set to `PENDING`
> at commit time. IAA will create the dedicated token file after issuing its verdict.
> The PREHANDOVER proof is **read-only / immutable post-commit** — do NOT edit it to
> add the token after IAA issues its verdict.

---

## § 7 — Scope Blockers and Governance Conflicts

### 7.1 Wave-Level Blockers (Acknowledged — Not Conflicts)

| Blocker | Sub-Waves Affected | Status | Required Action |
|---------|-------------------|--------|----------------|
| AIMC Waves 3-4 not delivered | Wave 16.3, 16.4, 16.5 | **BLOCKED — External** | Monitor AIMC progress; no foreman action until AIMC signals Wave 3-4 complete |
| CS2 architectural decision pending | Wave 16.9 (GAP-021, 022, 023) | **PARKED** | Escalate to CS2 for decision before Wave 16.9 is actioned |

These blockers are correctly documented in `wave-current-tasks.md`. They do not represent
governance conflicts — the correct governance response (BLOCKED / PARKED) is in place.

### 7.2 A-026 Risk (Standing Warning)

> **⚠️ A-026 Pre-Invocation Risk**: `SCOPE_DECLARATION.md` must match
> `git diff --name-only origin/main...HEAD` exactly before invoking IAA for final assurance.
> **This is the most common source of REJECTION-PACKAGEs in this repository.**
>
> Required action before IAA invocation:
> 1. Run `git diff --name-only origin/main...HEAD`
> 2. Overwrite `SCOPE_DECLARATION.md` with the exact output (list format, per A-028)
> 3. Commit the update
> 4. Only then invoke IAA

### 7.3 No CANON_INVENTORY Conflicts

No `governance/canon/` files are being modified in this session. CANON_INVENTORY
alignment check (CORE-006) will PASS trivially.

### 7.4 No Agent Contract Conflicts

No `.github/agents/` files are modified. CORE-017 and CORE-022 will receive
`NOT APPLICABLE` at handover.

### 7.5 Sub-Wave Pre-Brief Requirement (Forward Declaration)

> **For all immediately actionable sub-waves (16.1, 16.2, 16.6, 16.7, 16.8)**:
> Each sub-wave requires its **own IAA pre-brief and full ASSURANCE-TOKEN** before
> builder delegation proceeds.
>
> This pre-brief covers the **kick-off session only**.
> Sub-wave sessions (16.1, 16.6, 16.7, etc.) must each trigger a fresh IAA pre-brief
> per `IAA_PRE_BRIEF_PROTOCOL.md §Trigger` before any builder is commissioned.
>
> IAA will issue CST prompts at appropriate convergence points (see §5.2 CST/CWT/FCWT).

---

## § 8 — Summary

| Item | Value |
|------|-------|
| Wave | wave16-orchestration |
| IAA Triggered | YES — MANDATORY (AAWP_MAT) |
| Adoption Phase | PHASE_B_BLOCKING — Hard gate ACTIVE |
| Total FFA checks at handover | ~19 applicable (CORE: 14 applicable; AAWP_MAT overlay: 8; admin: 4) |
| Production code committed | NONE — pure governance kick-off |
| Blocked sub-waves | 16.3, 16.4, 16.5 (AIMC), 16.9 (CS2 decision) |
| Immediately actionable | 16.1, 16.2, 16.6, 16.7, 16.8 |
| Scope blockers | None blocking THIS kick-off session |
| Governance conflicts | None identified |
| Pre-Brief artifact path | `.agent-admin/assurance/iaa-prebrief-wave16.md` |
| Expected token file path | `.agent-admin/assurance/iaa-token-session-wave16-orchestration-20260309-PASS.md` |

---

*Authority: CS2 (Johan Ras / @APGI-cmy)*
*IAA Agent: independent-assurance-agent v6.2.0 | Knowledge v2.7.0*
*LIVING_AGENT_SYSTEM.md v6.2.0 | IAA Adoption Phase: PHASE_B_BLOCKING*
*Pre-Brief mode — no verdict issued. Full assurance at handover.*
