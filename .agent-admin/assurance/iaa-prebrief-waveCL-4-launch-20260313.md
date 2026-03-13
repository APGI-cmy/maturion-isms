# IAA Pre-Brief — Wave CL-4 (AIMC Audit Phase A: Foundation Verification)

**Wave**: CL-4 — AIMC Audit Phase A: Foundation Verification (Parallel Execution Start)
**Branch**: copilot/cl-4-launch-audit-verification
**Date**: 2026-03-13
**Authored By**: independent-assurance-agent v6.2.0
**Invocation Mode**: PHASE_0 — PRE-BRIEF (Wave Start)
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Adoption Phase**: PHASE_B_BLOCKING

---

## Phase 0 Execution Record

```yaml
phase_0_executed: true
invocation_trigger: "IAA PRE-BRIEF REQUEST comment on issue — Wave CL-4 AIMC Audit Phase A"
action: PRE-BRIEF
pre_brief_stop: true
phases_1_to_4_NOT_executed: true
```

---

## Step 0.1 — Pre-Brief Invocation Confirmed

Invocation context confirmed:
- Triggered by explicit `[IAA PRE-BRIEF REQUEST]` comment on Wave CL-4 issue
- Action = PRE-BRIEF
- PRE-BRIEF mode entered. Phases 1–4 assurance not executed this session.

---

## Step 0.2 — Wave Tasks Declared

**Source**: Issue body — Wave CL-4: AIMC Audit Phase A: Foundation Verification  
**Branch**: `copilot/cl-4-launch-audit-verification`  
**Wave Characteristics**:
- Foreman-led orchestration wave
- Runs in **parallel with CL-2**
- Primary acceptance: CL-4 **started**, parallel job execution **evidenced**, plan registry updated, blockers surfaced
- Wave is a **bottleneck** for CL-7, CL-10, CL-11, CL-12

**Wave Tasks Extracted from Issue Body**:

| # | Task ID | Description | Expected Artifact Type |
|---|---------|-------------|------------------------|
| 1 | T-CL4-001 | Launch audit foundation verification tasks in parallel with CL-2 | Foreman plan/orchestration docs |
| 2 | T-CL4-002 | Execute schema alignment verification jobs | Audit artifacts ± schema migrations |
| 3 | T-CL4-003 | Execute audit traceability checks | Audit traceability documents |
| 4 | T-CL4-004 | Execute foundation integrity verification jobs | Audit artifacts ± CI/workflow changes |
| 5 | T-CL4-005 | Record jobs in plan registry | Plan registry update (Foreman admin) |
| 6 | T-CL4-006 | Surface immediate blockers to CS2 | Escalation records |

---

## Step 0.3 — Qualifying Task Classification

Per `iaa-trigger-table.md` v2.1.0 and FAIL-ONLY-ONCE registry.

> **AMBIGUITY RULE applied**: CL-4 is an audit wave. The PRIMARY deliverables during the
> LAUNCH phase are likely EXEMPT (Foreman docs, plan registry, audit read-only artifacts).
> However, prior CL-4 execution (sessions 078 + 080, 2026-03-01) demonstrates that this
> wave CLASS reliably produces TRIGGERING artifacts (CI workflow changes, schema migrations,
> ESLint enforcement changes). The AMBIGUITY RULE (FAIL-ONLY-ONCE A-003) requires that
> any task whose execution may produce triggering artifacts is classified as QUALIFYING.

| Task ID | Task Description | IAA Trigger Category | Qualifying? | Rationale |
|---------|-----------------|---------------------|-------------|-----------|
| T-CL4-001 | Launch audit tasks (Foreman orchestration) | EXEMPT | NOT QUALIFYING (launch doc only) | Foreman plan docs are session memory / admin. Not AAWP or contract artifacts. |
| T-CL4-002 | Schema alignment verification | **AAWP_MAT** (conditional) | **QUALIFYING** | If schema alignment produces SQL migration files → `packages/ai-centre/supabase/migrations/` or similar path → AAWP_MAT trigger. Prior CL-4 produced `007_ai_requests.sql`. History establishes pattern. |
| T-CL4-003 | Audit traceability checks | EXEMPT (read-only audit docs) | NOT QUALIFYING as standalone | Audit traceability documents in `.agent-workspace/audit/` are read-only findings — not AAWP/MAT deliverables. NOT QUALIFYING unless combined with implementation fix deliverables in same PR. |
| T-CL4-004 | Foundation integrity verification | **CI_WORKFLOW + AAWP_MAT** (conditional) | **QUALIFYING** | Prior CL-4 produced `.github/workflows/deploy-mat-vercel.yml` changes (CI_WORKFLOW trigger) and `packages/ai-centre/supabase/config.toml` creation (AAWP_MAT trigger). Foundation integrity checks have demonstrated pattern of requiring CI fixes. |
| T-CL4-005 | Plan registry update | EXEMPT | NOT QUALIFYING | Admin/housekeeping update to Foreman personal workspace. |
| T-CL4-006 | Surface blockers to CS2 | EXEMPT | NOT QUALIFYING | Escalation notes/comments. No triggering artifact type. |

**Summary — Qualifying Tasks**: T-CL4-002 (conditional), T-CL4-004 (conditional)

---

## Step 0.4 — IAA Trigger Categories Declared

The following trigger categories **WILL apply** at handover if any qualifying task produces artifacts of the corresponding type:

| # | Trigger Category | Condition for Activation | Check Overlays |
|---|-----------------|--------------------------|----------------|
| 1 | **AAWP_MAT** | Any SQL migration file, any `packages/ai-centre/` implementation file, any `modules/mat/` or `apps/` application code change | BD-001 through BD-006, BD-TIER-2 (security), BD-TIER-3 (RLS/schema), OVL-AM-CST-01, OVL-AM-CWT-01 |
| 2 | **CI_WORKFLOW** | Any `.github/workflows/*.yml` file created or modified | OVL-CI-001 through OVL-CI-005 (including OVL-CI-005 Inherent Limitation Exception where applicable) |
| 3 | **PRE_BRIEF_ASSURANCE** | Always applies to T1/T2 qualifying PRs | OVL-INJ-001: confirm this Pre-Brief artifact committed before any builder task artifact |
| 4 | **EXEMPT** | If the PR contains only Foreman session memory, plan registry updates, audit documents in `.agent-workspace/audit/`, and no triggering artifacts | No overlay — ASSURANCE-TOKEN (EXEMPT) issued |

**CRITICAL NOTE**: If a single handover PR contains BOTH audit documents (EXEMPT) AND implementation artifacts (AAWP_MAT / CI_WORKFLOW), the MIXED category applies and **IAA IS MANDATORY** for the entire PR. The EXEMPT portion does not override the triggering portion.

---

## Step 0.4a — FFA Checks Declared for Handover

The following FAIL-ONLY-ONCE rules will be specifically verified at handover for this wave:

| Rule | Verification Action |
|------|---------------------|
| **A-001** | IAA invocation evidence present in PR artifacts — this Pre-Brief file must appear on branch before any builder delegations |
| **A-002** | No class exceptions — all builder deliverables (schema-builder, qa-builder, integration-builder, api-builder) subject to IAA |
| **A-021** | Producing agent must have committed and pushed ALL changes before invoking IAA. Working-tree-only fixes will fail this check |
| **A-026** | `SCOPE_DECLARATION.md` must match `git diff --name-only origin/main...HEAD` exactly at IAA invocation time |
| **A-028** | `SCOPE_DECLARATION.md` format compliance — list format required, prior-wave entries trimmed |
| **A-029** | PREHANDOVER proof immutability §4.3b — pre-populate expected IAA token reference at commit time; IAA writes dedicated token file post-verdict; PREHANDOVER is READ-ONLY post-commit |
| **A-031** | IAA ceremony carve-out — IAA's own parking station / session memory / token file from prior rejection ceremony excluded from SCOPE_DECLARATION (when carve-out note present) |
| **A-032** | Schema Column Compliance — if any SQL migration or INSERT/SELECT operation is present, IAA MUST read migration DDL and cross-check every column name against actual table definition. Silent try/catch or mocked tests do NOT satisfy. |

Additionally, for **AAWP_MAT** PRs arising from this wave, CST/CWT prompting rules apply:

| CST/CWT Rule | Applied When |
|--------------|-------------|
| **OVL-AM-CST-01** | If schema alignment or foundation fixes introduce a new cross-boundary integration point (new table RLS + consuming service + frontend hook) → CST checkpoint warranted |
| **OVL-AM-CWT-01** | CWT PASS evidence required in IBWR before wave closure. CWT is constitutional — absence = REJECTION-PACKAGE |

---

## Step 0.4b — PREHANDOVER Proof Structure Required

All handover PRs from Wave CL-4 that include triggering artifacts MUST include a PREHANDOVER proof with the following structure:

```yaml
# Required PREHANDOVER Proof Fields — Wave CL-4

session_id: [session identifier]
date: [YYYY-MM-DD]
agent_version: foreman-v2-agent v6.2.0
wave: CL-4 — AIMC Audit Phase A: Foundation Verification
triggering_issue: [issue number/URL]
branch: copilot/cl-4-launch-audit-verification

# Wave description (required)
wave_description: |
  [One paragraph describing what was delivered this session]

# Builders involved (required for each builder delegated)
builders_involved:
  - builder: [agent-name]
    task: [task description]
    qp_verdict: PASS | FAIL

# Evidence artifacts (required — list all files delivered)
evidence_artifacts:
  - path: [file path]
    description: [what it proves]
    status: "PRESENT ✅"

# Scope declaration (required — must match git diff exactly)
scope_declaration_file: SCOPE_DECLARATION.md
scope_matches_git_diff: [YES — verified / NO — mismatch flagged]

# Pre-Brief artifact reference (required — OVL-INJ-001)
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-waveCL-4-launch-20260313.md
iaa_prebrief_committed_before_builder_work: [YES / NO]

# IAA audit token reference (A-029 — pre-populated at commit time)
# Format: IAA-session-[slug]-waveCL-4-YYYYMMDD-PASS
iaa_audit_token: IAA-session-[slug]-waveCL-4-[YYYYMMDD]-PASS

# Session memory file (required)
session_memory_file: [path]

# OPOJD Gate (for AAWP_MAT waves — One-Pass One-Job Delivery)
opojd_declaration: |
  [Foreman declares that all delegated work is complete and no immediate follow-on
   fix wave is anticipated. Exceptions: explicitly documented open items.]
```

**Additional requirements for AAWP_MAT handover**:
- `SCOPE_DECLARATION.md` must be present on branch and match `git diff --name-only origin/main...HEAD`
- Dedicated IAA token file must be written to `.agent-admin/assurance/iaa-token-session-[slug]-waveCL-4-[YYYYMMDD].md` AFTER IAA verdict
- PREHANDOVER proof is READ-ONLY post-commit (A-029)

**For EXEMPT handover** (audit docs only):
- Pre-Brief artifact reference sufficient
- Session memory required
- No dedicated token file required (ASSURANCE-TOKEN EXEMPT issued inline)

---

## Step 0.5 — Scope Blockers and Governance Conflicts

The following blockers and conflicts are visible at wave-start:

### BLOCKER-CL4-001: Prior CL-4 Work Status Unknown

**Description**: Prior CL-4 work was executed on separate branches (`copilot/perform-audit-for-aimc-foundation`, `copilot/consolidate-audit-gaps`) in sessions 078 and 080 (2026-03-01). The wave-status sweep (2026-03-12) classified CL-4 as "PENDING — no CS2 wave-start issue opened". This new branch (`copilot/cl-4-launch-audit-verification`) is a fresh start.

**Risk**: If prior CL-4 PRs (schema migrations `007_ai_requests.sql`, CI changes to `deploy-mat-vercel.yml`, ESLint config changes) were merged into main, the Foreman must **NOT re-deliver the same artifacts**. If they were NOT merged, the schema gap (DB-GAP-001) and CI gap (T-A-012) remain open and will need to be re-addressed.

**Required Action (Foreman)**: At wave start, verify the merge status of prior CL-4 PRs. Surface findings to CS2 if prior work was partially merged.

**IAA Impact**: If prior artifacts were merged without IAA token, this is a governance gap under FAIL-ONLY-ONCE A-017/A-018 and should be recorded. IAA will check for this at handover.

---

### BLOCKER-CL4-002: Open Audit Gaps from Session-080 Remain Unresolved

**Description**: Session-080 PREHANDOVER documented four remediated gaps (ARCH-001, DB-GAP-001, CI-GAP-002, CI-GAP-003). However, session-078 also documented follow-on items not closed in session-080:
- **CI-GAP-002** (T-C-001): `@maturion/ai-centre` not in all consuming app `package.json` files → deferred to CL-10
- **CI-GAP-003** (T-C-010): No CI gate for direct SDK imports → deferred to CL-10

These were explicitly deferred to CL-10. They remain out of scope for CL-4 unless CL-10 scope changes. Foreman should confirm deferral status at wave start.

---

### BLOCKER-CL4-003: Parallel Execution Governance (CL-2 + CL-4)

**Description**: CL-4 runs in parallel with CL-2. CL-2's scope is unknown to IAA at this Pre-Brief stage. If CL-2 and CL-4 produce artifacts that touch overlapping files (e.g., both modifying `packages/ai-centre/`, both adding CI migration steps), merge conflicts and duplicate artifact risk arise.

**Required Action (Foreman)**: Define non-overlapping file scope boundaries between CL-2 and CL-4 at wave start. Document the boundary in the plan registry. Surface to CS2 if overlap is detected.

**IAA Impact**: IAA will verify at handover that CL-4 artifacts do not duplicate or conflict with CL-2 artifacts on the same branch or in the same PR.

---

### ADVISORY-CL4-001: This Is a LAUNCH Wave — Split Handover Pattern Expected

**Description**: The acceptance criteria for CL-4 is "CL-4 **started**, parallel job execution **evidenced**, plan registry updated; blockers surfaced". This implies:
1. The LAUNCH handover PR may be EXEMPT (Foreman orchestration docs only, no triggering artifacts)
2. Subsequent sub-waves or follow-on PRs from builder delegations will be TRIGGERING

**IAA Recommendation**: If the launch PR contains only plan registry updates and Foreman session memory → IAA will issue ASSURANCE-TOKEN (EXEMPT). If any builder deliverable is bundled into the same PR as the launch docs → MIXED category applies → full IAA review required.

---

## Step 0.6 — Commit Confirmation

This Pre-Brief artifact is committed to branch `copilot/cl-4-launch-audit-verification` at:
- Path: `.agent-admin/assurance/iaa-prebrief-waveCL-4-launch-20260313.md`

**Pre-Brief status**: COMMITTED (SHA to be confirmed post-commit)

---

## Pre-Brief Summary

| Item | Declaration |
|------|-------------|
| Wave | CL-4 — AIMC Audit Phase A: Foundation Verification |
| Pre-Brief invocation mode | PHASE_0 — PRE-BRIEF |
| Qualifying tasks | T-CL4-002 (schema alignment), T-CL4-004 (foundation integrity) |
| Trigger categories that may apply | AAWP_MAT, CI_WORKFLOW, PRE_BRIEF_ASSURANCE |
| Trigger categories that apply if audit-only | EXEMPT (ASSURANCE-TOKEN EXEMPT) |
| FFA checks declared for handover | A-001, A-002, A-021, A-026, A-028, A-029, A-031, A-032 |
| CST/CWT applicability | OVL-AM-CST-01 (discretionary), OVL-AM-CWT-01 (mandatory before IBWR) |
| Scope blockers identified | BLOCKER-CL4-001 (prior work status), BLOCKER-CL4-002 (open gaps), BLOCKER-CL4-003 (parallel CL-2 overlap) |
| Governance conflicts visible | None hard-blocking at this stage. Blockers are advisory/confirmatory. |
| PREHANDOVER proof structure declared | YES — see Step 0.4b |
| Authority | CS2 (Johan Ras / @APGI-cmy) |
| Phases 1–4 executed | NO — Pre-Brief mode only |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Independent Assurance Agent**: v6.2.0 | Contract: 2.2.0
**Adoption Phase**: PHASE_B_BLOCKING
**STOP-AND-FIX Mandate**: ACTIVE
