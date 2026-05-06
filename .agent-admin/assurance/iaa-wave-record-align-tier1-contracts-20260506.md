# IAA Wave Record — align-tier1-contracts-20260506

**Wave Slug**: align-tier1-contracts-20260506
**Branch**: copilot/align-tier-1-agent-contracts-again
**PR**: #1533
**Issue**: #1532 — Hardening — Align Tier 1 agent contracts with Tier 2 lifecycle, evidence, scope, and live-validation gates
**IAA Contract Version**: 2.9.0
**Created**: 2026-05-06
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## PRE-BRIEF

**Pre-Brief Mode**: PHASE_0 — PRE-BRIEF invocation. Phases 1–4 assurance NOT executed.
**Pre-Brief Date**: 2026-05-06
**Triggered by**: CS2-authorized Foreman (wave-current-tasks.md `IAA Pre-Brief | Stage 10 | INVOKED`)

---

### Qualifying Tasks

| Task ID | Description | Trigger Category | IAA Required? |
|---------|-------------|-----------------|---------------|
| T-WAT-001 | Agent contract alignment: foreman-v2-agent.md, independent-assurance-agent.md, execution-ceremony-admin-agent.md | **AGENT_CONTRACT** | YES — MANDATORY |
| T-WAT-002 | Governance canon updates: 5 × governance/canon/ files | **CANON_GOVERNANCE** | YES — MANDATORY (separate PR/invocation required) |
| T-WAT-003 | Tests and fixtures proving AC1–AC6 constraints | **MIXED** (test files + agent/governance constraint refs) | YES — MANDATORY (AMBIGUITY RULE applies; included in scope) |

**Qualifying task count**: 3 tasks (T-WAT-001, T-WAT-002, T-WAT-003)

**Scope note for T-WAT-002**: Governance canon updates are NOT in the current PR #1533 scope declaration. If T-WAT-002 lands in a separate PR, a separate IAA invocation is required for that PR. If T-WAT-002 is merged into PR #1533, the CANON_GOVERNANCE overlay also applies at assurance time.

---

### Applicable Overlays (for IAA assurance invocation)

**Primary overlay**: `AGENT_CONTRACT`
**Checklist**: IAA_AGENT_CONTRACT_AUDIT_STANDARD.md (AC-01 through AC-07)
**Secondary overlay**: `CANON_GOVERNANCE` (if T-WAT-002 lands in this PR)
**Core invariants**: CORE-020 (zero partial pass) + CORE-021 (zero severity tolerance) — both retained by IAA

**At assurance time, IAA must load**:
- `iaa-core-invariants-checklist.md` (CORE-020, CORE-021)
- `iaa-category-overlays.md` → AGENT_CONTRACT section
- `IAA_AGENT_CONTRACT_AUDIT_STANDARD.md` (AC-01–AC-07)
- `FAIL-ONLY-ONCE.md` (all rules — A-001, A-002, A-031 explicitly applicable)
- `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` (NBR entries — not primary risk for this PR type, but must be loaded)

---

### FAIL-ONLY-ONCE Checks Applicable to This Wave

| Rule ID | Rule Summary | Applies? | Notes |
|---------|-------------|----------|-------|
| A-001 | IAA invocation evidence must be present in PR artifacts before builder delegation | **YES — BLOCKING** | This pre-brief IS the A-001 evidence. Must be committed before CodexAdvisor delegation proceeds. |
| A-002 | All agent classes covered — no class exemptions | **YES — BLOCKING** | All 3 agent contracts in scope (Foreman class, Assurance class, Admin class). IAA self-contract update → escalate to CS2 (IAA cannot self-review per HALT-001; but this is ALIGNMENT not IAA self-authoring — CodexAdvisor produces, IAA audits). |
| A-031 | IAA ceremony artifacts (pre-brief, wave record, future token) must be excluded from scope via A-031 carve-out OR explicitly declared | **YES — FLAG** | Scope declaration `pr-1533.md` lists "IAA pre-brief artifact" as IN_SCOPE but does NOT include an explicit A-031 carve-out note. Builder must add the carve-out note before PREHANDOVER, or confirm the pre-brief listing satisfies the declaration requirement. |
| A-015 | KNOWLEDGE_GOVERNANCE: evidence bundle + PREHANDOVER ceremony required | **N/A for #1533** | Only applies if `.agent-workspace/*/knowledge/` files change. Not in current scope. |
| A-003 | Ambiguity rule — ambiguity resolves to mandatory invocation | **APPLIED** | T-WAT-003 (tests) classified MIXED → mandatory. |

---

### Anti-Regression Obligations

**Anti-regression required**: YES

| Registry Entry | Applies to This Wave? | Reason |
|---------------|----------------------|--------|
| NBR-001 (TanStack Query cache invalidation) | NO | No TanStack mutations in agent contract files |
| NBR-002 (Supabase RLS silent write block) | NO | No Supabase write operations |
| NBR-003 (Zustand state reset) | NO | No Zustand stores |

**Applicable FAIL-ONLY-ONCE patterns for AGENT_CONTRACT PRs** (from prior wave learning notes):
- Tier 2 file binding declared but not verifiably linked to halt behavior → pattern requires IAA to demand explicit halt conditions in contract YAML, not prose-only references
- ACR trigger additions (ACR-21 through ACR-24) must include both YAML update AND prose definition — one without the other = REJECTION-PACKAGE
- `merge_gate_interface.required_checks` must enumerate actual CI gate identifiers as they appear in `.github/workflows/` — symbolic names are not acceptable

---

### PREHANDOVER Structure Requirements

Per CS2 instruction (PR review comment on branch), the PREHANDOVER for this wave MUST:

1. **NOT** follow the old #1524 LUIEP/ceremony model — no separate `LUIEP-*.md` artifacts
2. **Evidence captured via** `.admin/pr.json` `evidence_required` array entries — each entry must be marked as evidenced with a commit reference or artifact path
3. **ECAP bundle required** (`requires_ecap: true`) — `execution-ceremony-admin-agent` must produce the bundle; appointment must be declared in wave-current-tasks.md before bundle is requested
4. **IAA token** goes in `## TOKEN` section of THIS wave record (not a standalone `iaa-token-*.md` file per NO-STANDALONE-TOKEN-001)
5. **Scope declaration** must be updated from `SCOPE_FROZEN: NO` → `SCOPE_FROZEN: YES` before PREHANDOVER is submitted
6. **Agent contract diffs** must be attached or cited per AC-04 evidence requirements
7. **Pre-PREHANDOVER CI gate confirmation** required: all gates in `merge_gate_interface.required_checks` must be GREEN before PREHANDOVER is committed

Minimum PREHANDOVER fields required for this wave type (AGENT_CONTRACT):
```
wave_id: align-tier1-contracts-20260506
pr: 1533
branch: copilot/align-tier-1-agent-contracts-again
scope_frozen: YES  ← must be YES, not NO
files_changed: [confirmed list]
evidence_required_status:
  - item: [each evidence_required entry from pr.json]
    status: EVIDENCED
    ref: [commit SHA or artifact path]
iaa_audit_token: IAA-[session-ID]-20260506-PASS  ← pre-populated reference per A-029
ecap_bundle: [path or COMMITTED]
merge_gate_parity: PASS  ← CI-confirmed, not assumed
gate_set_checked: [list each gate by name]
```

---

### Scope Blockers

| Blocker ID | Description | Severity | Resolution Required Before |
|-----------|-------------|----------|--------------------------|
| **SB-001** | `ceremony_admin_appointed` field absent from wave-current-tasks.md — `requires_ecap: true` is set in pr.json but no ECAP admin has been formally appointed in the wave tracking artifact | **SOFT BLOCKER** | Before PREHANDOVER submission — ECAP admin must be appointed and declared in wave-current-tasks.md |
| **SB-002** | Scope declaration `SCOPE_FROZEN: NO` — file explicitly states provisional status; FILES_CHANGED list expected but not final | **SOFT BLOCKER** | Before PREHANDOVER — scope must be frozen and declaration updated |
| **SB-003** | T-WAT-002 (governance canon updates) is NOT in PR #1533 scope — if canon updates are needed to support AC2/AC3, they require a separate PR with separate CANON_GOVERNANCE overlay IAA invocation | **STRUCTURAL NOTE** | Before closing wave — either T-WAT-002 is confirmed out-of-scope for this PR, or a follow-on PR is planned |
| **SB-004** | A-031 carve-out note absent from scope declaration `pr-1533.md` — IAA ceremony artifacts (this pre-brief, wave record, future token) are listed in IN_SCOPE but no explicit A-031 carve-out note is present | **SOFT BLOCKER** | Before PREHANDOVER — add A-031 carve-out note to scope declaration OR confirm listing satisfies declaration requirement |

**Hard pre-brief blockers**: NONE — wave may proceed to CodexAdvisor delegation immediately upon commitment of this wave record.

---

### Pre-Brief Summary Output

```
Qualifying tasks: T-WAT-001 (AGENT_CONTRACT), T-WAT-002 (CANON_GOVERNANCE — separate PR), T-WAT-003 (MIXED)
Applicable overlay: AGENT_CONTRACT (primary) | CANON_GOVERNANCE (secondary, if T-WAT-002 merges here)
Anti-regression obligations: YES — FAIL-ONLY-ONCE A-001, A-002, A-031 apply; NBR registry entries not applicable (no TanStack/Supabase/Zustand code)
Ceremony admin appointed: NOT DECLARED IN WAVE TASKS (SB-001)
Hard blockers: NONE
Soft blockers: SB-001 (ECAP admin not appointed), SB-002 (scope not frozen), SB-003 (T-WAT-002 scope), SB-004 (A-031 carve-out)
```

---

## PREHANDOVER_EMBEDDED

*To be populated by execution-ceremony-admin-agent at wave close — before PREHANDOVER is committed.*

*(PLACEHOLDER — do not populate until builder work is complete and all evidence_required entries are evidenced.)*

---

## TOKEN

*To be populated by IAA at final assurance invocation (Phase 4 Step 4.2b).*

*(PLACEHOLDER — IAA-only. execution-ceremony-admin-agent MUST NOT write here.)*

---

## REJECTION_HISTORY

*No rejections recorded at pre-brief stage.*

---

*Wave record created by IAA at Phase 0 (PRE-BRIEF). Phases 1–4 assurance pending builder delivery.*
*Authority: CS2 (Johan Ras / @APGI-cmy) | IAA Contract v2.9.0*
