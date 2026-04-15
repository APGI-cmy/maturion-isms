# IAA Wave Record — aimc-specialist-hardening-20260415

**Wave**: aimc-specialist-hardening-20260415
**Date**: 2026-04-15
**Branch**: copilot/fix-253484265-1108482416-55347de4-d047-4a30-a366-377beba1bdf1
**Issue**: maturion-isms#1382
**Title**: [AIMC / Maturion] Harden orchestrator-specialist strategy into an execution-ready source model for MMM convergence
**Producing Agent(s)**: foreman-v2-agent (class: foreman)
**IAA Session**: PRE-BRIEF (Phase 0 — not yet assigned session number)
**Ceremony Admin Appointed**: NOT YET DECLARED — Foreman must confirm before Phase 4
**Wave Record Path**: `.agent-admin/assurance/iaa-wave-record-aimc-specialist-hardening-20260415-20260415.md`
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## PRE-BRIEF

**Invoked by**: IAA PRE-BRIEF REQUEST (Wave start authorization per Phase 0 directive)
**Invocation mode**: PRE-BRIEF (`action: "PRE-BRIEF"`)
**Pre-Brief generated**: 2026-04-15

---

### Qualifying Tasks

| # | Task | Deliverable | IAA-Qualifying? | Trigger Basis |
|---|------|-------------|-----------------|---------------|
| D1 | Harden `Maturion_agent_usage_escalation_strategy.md` to execution-ready quality | `Maturion/strategy/Maturion_agent_usage_escalation_strategy.md` (updated) | YES | AMBIGUITY RULE (A-003) — constitutional strategy document; CS2 mandate in AC-13 |
| D2 | Strategy delta summary | Strategy delta summary artifact (doc-only) | INCLUDED IN D1 REVIEW | Bundled with D1 |
| D3 | MMM convergence mapping note | MMM convergence mapping note (doc-only) | INCLUDED IN D1 REVIEW | Bundled with D1 |
| D4 | Forward handoff note | Forward handoff note (doc-only) | INCLUDED IN D1 REVIEW | Bundled with D1 |
| CER | Ceremony artifacts | PREHANDOVER proof + session memory | YES | CERT-001 through CERT-004 (universal gate) |

**Qualifying task count**: 1 primary task (D1) + bundled D2/D3/D4 + ceremony gate = **1 substantive qualifying task + 1 ceremony gate**

---

### Category Classification

**Trigger analysis**:
- `.github/agents/` changes? → NO (out of scope per wave declaration)
- `governance/canon/` changes? → NO (out of scope per wave declaration)
- `.github/workflows/` changes? → NO
- AAWP/MAT deliverable paths? → NO (no `modules/MMM/` implementation artifacts)
- `governance/quality/agent-integrity/` changes? → NO
- `.agent-workspace/*/knowledge/` changes? → NO
- Pre-build stage governance artifacts? → NO

**Primary artifact location**: `Maturion/strategy/` — constitutional strategy tier (above canon level per the Maturion three-tier governance hierarchy defined in the strategy file itself)

**AMBIGUITY RULE (FAIL-ONLY-ONCE A-003)**: `Maturion/strategy/` documents are constitutional-grade artifacts, not equivalent to README or housekeeping changes. CS2 has explicitly mandated IAA PASS as AC-13. The AMBIGUITY RULE resolves this definitively: **IAA IS REQUIRED**.

**Final classification**: `AMBIGUOUS → MANDATORY` (FAIL-ONLY-ONCE A-003 + CS2 mandate in AC-13)

> IAA NOTE: The strict trigger table does not include a named category for Maturion-level strategy document updates. The AMBIGUITY RULE applies. This wave is CS2-authorized with explicit IAA mandate in AC-13. IAA is required. Classification is treated as governance-adjacent documentation (closest to CANON_GOVERNANCE in nature but NOT a canon change). The universal CERT gate + AC-based substantive evaluation applies.

---

### Applicable Overlay

**Primary overlay**: Universal Ceremony Gate (CERT-001 through CERT-004) — applies to ALL categories

**Substantive evaluation framework**: Acceptance Criteria AC-1 through AC-12 (13 total from issue #1382) — these form the complete substantive checklist for this documentation wave. IAA must verify each criterion independently at final audit.

**CORE checks**: CORE-020 (zero partial pass) and CORE-021 (zero severity tolerance) — always active

**AAWP_MAT / PRE_BUILD_GATES / AGENT_CONTRACT / CANON_GOVERNANCE overlays**: NOT applicable (no build, no stage advancement, no agent contract, no canon change)

**NBR niggle checks (FUNCTIONAL-BEHAVIOUR-REGISTRY)**: NOT applicable — documentation-only wave contains no code, no mutations, no Supabase operations, no TanStack Query, no Zustand stores

---

### Anti-Regression Obligations

**FUNCTIONAL-BEHAVIOUR-REGISTRY applicable**: NO
- NBR-001 (TanStack Query mutation cache): Not applicable — no code
- NBR-002 (Supabase RLS write): Not applicable — no code
- NBR-003+ (Zustand state reset): Not applicable — no code

**FAIL-ONLY-ONCE rules applicable**:
- A-001 (IAA invocation evidence in PREHANDOVER): YES — PREHANDOVER proof must reference IAA invocation. Applies at final audit.
- A-002 (no class exemptions): NOT APPLICABLE — not an agent contract PR
- A-003 (ambiguity → mandatory): APPLIED — governed this classification decision
- A-029 (PREHANDOVER iaa_audit_token = expected reference, not PENDING): YES — applies to PREHANDOVER proof format

**Anti-regression obligations**: YES — A-001 and A-029 are binding for the PREHANDOVER ceremony

---

### Scope Blockers Identified

| # | Blocker | Risk | IAA Ruling |
|---|---------|------|------------|
| SB-001 | Canon changes are OUT OF SCOPE per wave declaration. If D1 hardening reveals that canon changes ARE required to properly define the source model → those changes MUST NOT be included in this PR. They must be raised as a forward handoff item (D4) and actioned in a new wave. | HIGH — canon changes in this wave would trigger CANON_GOVERNANCE overlay and would require CANON_INVENTORY update, IAA re-classification, and canon ripple. | BLOCKING — any `governance/canon/` file changes in the PR = immediate REJECTION-PACKAGE finding |
| SB-002 | Agent contract changes are OUT OF SCOPE. If the strategy hardening implies new agent class definitions, those go in a separate agent contract wave. | MEDIUM — could be tempting to "complete" the picture | BLOCKING — any `.github/agents/` file changes = immediate REJECTION-PACKAGE finding |
| SB-003 | D3 (MMM convergence mapping note) must be a documentary NOTE only — not a modification to any `modules/MMM/` lifecycle artifact (architecture.md, BUILD_PROGRESS_TRACKER.md, harvest-map.md). Any MMM module file modification triggers PRE_BUILD_STAGE_MODEL overlay and invalidates the EXEMPT status of D3. | MEDIUM | BLOCKING — any `modules/MMM/` file modifications in the PR = immediate REJECTION-PACKAGE finding (PRE_BUILD_STAGE_MODEL overlay not prepared in this pre-brief) |
| SB-004 | Code implementation is OUT OF SCOPE per wave declaration. No TypeScript, SQL, migrations, API endpoints, or test files may appear in this PR. | LOW (low likelihood given wave nature) | BLOCKING |
| SB-005 | D2 (delta summary) and D4 (forward handoff note) are informational artifacts. They should be committed as documentation files — their location must not be in `governance/canon/` or `governance/quality/` paths. Recommended: `.agent-workspace/foreman-v2/memory/` or directly in the PR as evidence bundle files. | LOW | ADVISORY — location must be confirmed by Foreman |

---

### Evidence Artifacts Required at Handover

IAA will require the following artifacts to be present in the PR before issuing a verdict:

| # | Artifact | Location | IAA Check |
|---|----------|----------|-----------|
| E-1 | Updated strategy artifact | `Maturion/strategy/Maturion_agent_usage_escalation_strategy.md` | Substantive review: AC-1 through AC-12 each verified |
| E-2 | Strategy delta summary (D2) | Evidence bundle (foreman workspace or doc file) | Confirms what changed and why |
| E-3 | MMM convergence mapping note (D3) | Evidence bundle (foreman workspace or doc file) | Confirms "already covered" vs "not yet governed" mapping |
| E-4 | Forward handoff note (D4) | Evidence bundle (foreman workspace or doc file) | Identifies what must be canonized next |
| E-5 | PREHANDOVER proof | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-[N]-aimc-specialist-hardening-20260415.md` | CERT-001 — must be present and non-placeholder |
| E-6 | Session memory | `.agent-workspace/foreman-v2/memory/session-[N]-aimc-specialist-hardening-20260415.md` | CERT-002 — must be present and non-placeholder |
| E-7 | FAIL-ONLY-ONCE attestation | In session memory preamble | CERT-003 |
| E-8 | `iaa_audit_token` field in PREHANDOVER proof | Pre-populated expected reference format per A-029: `IAA-session-[N]-aimc-specialist-hardening-20260415-PASS` | CERT-004 — must NOT say "PENDING" |

---

### Pre-Brief Summary (Required Output Format per Phase 0.2)

```
Qualifying tasks: [D1] Maturion_agent_usage_escalation_strategy.md hardening (D2/D3/D4 bundled as evidence artifacts)
Applicable overlay: AMBIGUOUS→MANDATORY (A-003) — Universal CERT gate + AC-1 through AC-12 substantive evaluation
Anti-regression obligations: YES — FAIL-ONLY-ONCE A-001 (IAA invocation evidence in PREHANDOVER), A-029 (iaa_audit_token format)
```

---

## TOKEN

```
ASSURANCE-TOKEN
PR: copilot/fix-253484265-1108482416-55347de4-d047-4a30-a366-377beba1bdf1 | Issue #1382
Wave: aimc-specialist-hardening-20260415
All 16 checks PASS (12 AC substantive + 4 CERT ceremony). Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
PHASE_B_BLOCKING_TOKEN: IAA-session-aimc-specialist-hardening-20260415-PASS
Token reference: IAA-session-aimc-specialist-hardening-20260415-PASS
Issued by: independent-assurance-agent
Date: 2026-04-15
Adoption phase: PHASE_B_BLOCKING — Hard gate ACTIVE
```

---

## REJECTION_HISTORY

*(No rejections yet — wave in progress)*
