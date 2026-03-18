# Independent Assurance Agent — Tier 2 Knowledge Index

**Agent**: independent-assurance-agent
**Contract Version**: 2.0.0
**Knowledge Version**: 3.1.0
**Last Updated**: 2026-03-18
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier 2 Knowledge Contents

| File | Purpose | Version | Status |
|------|---------|---------|--------|
| `index.md` (this file) | Knowledge entry point and version reference | 2.9.0 | PRESENT |
| `FAIL-ONLY-ONCE.md` | Permanent rules recording governance failures IAA must never repeat | 2.5.0 | PRESENT — Rules A-001 through A-032 active (A-032: Schema Column Compliance Check — IAA must read migration DDL directly for all PRs containing INSERT/SELECT operations; INC-ALCF-001 self-governance closure) |
| `iaa-core-invariants-checklist.md` | Core checks applied to every IAA invocation regardless of category | 2.6.0 | ACTIVE — CORE-001 to CORE-022; CORE-016 PENDING carve-out updated per A-029 |
| `iaa-trigger-table.md` | PR category classification table — when IAA activates and when it is exempt | 2.1.0 | ACTIVE — KNOWLEDGE_GOVERNANCE trigger category added |
| `iaa-category-overlays.md` | Per-category additional checks (AGENT_CONTRACT, CANON_GOVERNANCE, CI_WORKFLOW, AAWP_MAT, KNOWLEDGE_GOVERNANCE, PRE_BRIEF_ASSURANCE) | 3.6.0 | ACTIVE — OVL-CI-005 Inherent Limitation Exception (v3.3.0, S-033); INJECTION_AUDIT_TRAIL renamed to PRE_BRIEF_ASSURANCE, artifact-existence-only OVL-INJ-001 (v3.4.0, issue #1061); Orientation Mandate scope note + OVL-KG-ADM-002 sharpened + timestamp carve-out (v3.6.0) |
| `session-memory-template.md` | Standard session memory template for IAA invocations | 1.0.0 | PRESENT |
| `IAA_ZERO_SEVERITY_TOLERANCE.md` | Tier 2 operational note for Zero-Severity-Tolerance Rule — prohibited language table, machine-readable logic, exception procedure | 1.0.0 | ACTIVE |
| `IAA_AGENT_CONTRACT_AUDIT_STANDARD.md` | **AGENT_CONTRACT Audit Standard** — mandatory audit steps, pre-approval doctrine, protected components checklist, tier placement discipline, decision matrix for all agent contract PRs reviewed by IAA | 1.0.0 | ACTIVE — Load at Step 2.4 when PR category is AGENT_CONTRACT |
| `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` | **Functional Behaviour Registry** — post-merge behavioural failure patterns (niggles) that must never recur; each entry is a permanent mandatory check for BUILD PRs | 1.1.0 | ACTIVE — Read at Step 3.1 for all BUILD/AAWP_MAT PRs; governed by FAIL-ONLY-ONCE A-034; v1.1.0 adds NBR-005 (schema migration column mismatch silently masked by try/catch — INC-ALCF-001) |
| `niggle-pattern-library.md` | **Niggle Pattern Library** — stack-specific failure patterns for Next.js/Supabase/TanStack Query/Zustand/TypeScript stack; IAA applies relevant patterns to BUILD PR diffs | 1.0.0 | ACTIVE — Read at Step 3.1 for all BUILD/AAWP_MAT PRs; governed by FAIL-ONLY-ONCE A-035 |

---

## Constitutional Canon References (Tier 1 — verified via CANON_INVENTORY)

- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` — primary IAA governance canon
- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` v1.0.0
- `governance/canon/AGENT_PREFLIGHT_PATTERN.md` v1.0.0
- `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` v1.0.0
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.0.0
- `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md` (AGCFPP-001)
- `governance/canon/COMBINED_TESTING_PATTERN.md` — CST/CWT canonical pattern (authority for §CST/CWT Orchestration Prompting below)

---

## IAA Trigger Summary (load full table from `iaa-trigger-table.md`)

| PR Category | IAA Triggered? | Notes |
|-------------|---------------|-------|
| Agent contract creation or update | YES — MANDATORY | All classes. No exceptions. FAIL-ONLY-ONCE A-002. |
| Canon / governance document changes | YES | |
| CI / workflow changes | YES | |
| AAWP / MAT deliverables | YES | |
| Tier 2 knowledge file changes | YES — MANDATORY | KNOWLEDGE_GOVERNANCE category. Evidence bundle + PREHANDOVER ceremony required (A-015). |
| Doc-only or parking station updates | NO | Must be unambiguously doc-only |
| Session memory files only | NO | |
| Ambiguous / unclear category | YES — MANDATORY | FAIL-ONLY-ONCE A-003: ambiguity resolves to mandatory |

---

## FAIL-ONLY-ONCE Active Rules (Key Rules — full registry in `FAIL-ONLY-ONCE.md`)

| Rule ID | Trigger | Status |
|---------|---------|--------|
| A-001 | IAA invocation evidence must be present in all agent contract PRs | ACTIVE |
| A-002 | IAA is mandatory for ALL agent contract classes — no class exceptions | ACTIVE |
| A-003 | Ambiguity resolves to mandatory invocation | ACTIVE |
| A-004 | Bootstrap directive non-negotiable — repo read before agent file is a preflight violation | ACTIVE |
| A-005 | Agent contract file immutability — no agent may modify .github/agents/ except CodexAdvisor+CS2 | ACTIVE |
| A-006 | PHASE_A_ADVISORY FABRICATION breach detection (INC-IAA-SKIP-001 pattern) | ACTIVE |
| A-015 | Tier 2 knowledge patches require full PREHANDOVER ceremony | ACTIVE |
| A-016 | Cross-PR IAA token reuse is a governance breach | ACTIVE |
| A-017 | Session memory must not cite a REJECTION-PACKAGE session as PASS | ACTIVE |
| A-018 | Post-merge retrospective audit findings must be formally recorded — no informal notes | ACTIVE |
| A-019 | Trigger table misapplication is an IAA bypass — all triggering categories require IAA | ACTIVE |
| A-020 | PREHANDOVER template must be kept current with overlay requirements — stale template causes cascading REJECTION-PACKAGEs | ACTIVE |
| A-021 | Commit and push BEFORE invoking IAA — working-tree-only fix is not a committed fix and will fail IAA audit | ACTIVE |
| A-022 | Re-evaluate ALL trigger categories on every IAA invocation — do not carry forward prior session's category classification; new commits can introduce new trigger categories | ACTIVE |
| A-023 | OVL-AC-012 ripple assessment is a standing PREHANDOVER requirement for all AGENT_CONTRACT PRs | ACTIVE |
| A-024 | `secret:` field prohibited in agent contracts — must use `secret_env_var:` to prevent CI scanner false positives | ACTIVE |
| A-025 | Ceremony artifacts must use PENDING until Post-ASSURANCE-TOKEN ceremony — no pre-fill of anticipated -PASS tokens | ACTIVE |
| A-026 | `SCOPE_DECLARATION.md` must match `git diff --name-only origin/main...HEAD` exactly before IAA invocation — stale = BL-027 merge gate parity failure | ACTIVE |
| A-027 | Third-consecutive A-021 failure on same PR/branch = systemic workflow gap — producing agent must add Pre-IAA Commit Gate to PREHANDOVER template with git status + git log evidence | ACTIVE |
| A-028 | `SCOPE_DECLARATION.md` format compliance — list format required, prior-wave entries must be trimmed | ACTIVE |
| A-029 | PREHANDOVER proof immutability §4.3b — pre-populate expected reference token at commit time; IAA writes dedicated token file post-verdict; PREHANDOVER is READ-ONLY post-commit | ACTIVE |
| A-030 | CORE-019 re-invocation carve-out — correction addendum (committed) documents prior rejection verdict; satisfies CORE-019 for immutable-PREHANDOVER re-invocation scenarios | ACTIVE |
| A-031 | IAA ceremony artifact A-026 carve-out — IAA's own parking station/session memory/token file from prior rejection ceremony excluded from SCOPE_DECLARATION when A-031 carve-out note is present | ACTIVE |
| A-032 | Schema Column Compliance Check — for any PR containing INSERT/SELECT on a named Supabase table: IAA MUST read migration DDL and cross-check every column name; non-existent column = REJECTION-PACKAGE; silent try/catch does NOT exempt; mocked tests do NOT satisfy (INC-ALCF-001) | ACTIVE |
| A-033 | CORE-018 Verification Must Use Git, Not Disk — disk existence check (`-f`) is insufficient; must use `git ls-tree HEAD` or `git ls-files --error-unmatch` (INC-CI-GATEWAY-FIX-001-IAA) | ACTIVE |
| A-034 | FUNCTIONAL-BEHAVIOUR-REGISTRY Reading Mandatory — for BUILD/AAWP_MAT PRs: read FUNCTIONAL-BEHAVIOUR-REGISTRY.md at Step 3.1 and apply all relevant niggle patterns as blocking checks | ACTIVE |
| A-035 | Niggle Pattern Library Application — for BUILD/AAWP_MAT PRs: read niggle-pattern-library.md at Step 3.1 and apply all relevant stack-specific patterns as blocking checks | ACTIVE |

---

## Adoption Phase

| Phase | Status | Behaviour |
|-------|--------|-----------|
| Phase A | CLOSED | Advisory mode — verdicts informational, not hard-blocking |
| Phase B | **CURRENT — PHASE_B_BLOCKING** | Mandatory blocking — REJECTION-PACKAGE prevents PR open |

---

## Stub Population Status

All previously stub files have been fully populated (as of 2026-02-28):

1. `iaa-core-invariants-checklist.md` — fully populated from IAA canon v2.0.0 (CORE-001 to CORE-017)
2. `iaa-trigger-table.md` — fully populated from IAA canon v2.0.0 (with AGENT_INTEGRITY category and classification decision flow)
3. `iaa-category-overlays.md` — fully populated from IAA canon v2.0.0 (with OVL-CI-004 and AGENT_INTEGRITY overlay)

---

## CST / CWT / FCWT Orchestration Prompting (IAA Responsibility)

**Canonical Authority**: `governance/canon/COMBINED_TESTING_PATTERN.md`

### Purpose

IAA must, at its discretion and in full accordance with the governance canon, identify the appropriate moment during its review of a wave or subwave PR to prompt the Foreman to execute a Combined Subwave Test (CST), Combined Wave Test (CWT), or Final Complete Wave Test (FCWT). This responsibility exists because IAA is the independent observer with full cross-wave visibility — it is uniquely positioned to detect when integration convergence points have been reached but integration testing has not been commissioned.

Failure to prompt testing at the correct time is itself a governance gap and must be recorded as a finding.

---

### Definitions (from `COMBINED_TESTING_PATTERN.md`)

| Test Type | When | Mandate | Blocking |
|-----------|------|---------|----------|
| **CST** — Combined Subwave Testing | Mid-wave, when multiple subwaves or modules converge and must interact | Strategic — apply when integration risk justifies it | Blocks wave completion if failures exist |
| **CWT** — Combined Wave Testing | After wave QA passes (cumulative regression GREEN), before IBWR completion | **Mandatory — always required** | Blocks IBWR if CWT PASS not achieved |
| **FCWT** — Final Complete Wave Test | After all remediation waves complete, before production sign-over | **Mandatory** | Blocks production deployment / formal sign-over |

---

### IAA Prompting Obligation

IAA **must** evaluate the following at every AAWP/MAT deliverable PR review and at every wave gate review:

#### CST Prompt Conditions (discretionary — apply when risk warrants)

Prompt the Foreman to commission a CST **if ALL of the following are true**:
1. The PR closes a subwave that introduces a cross-module or cross-architectural-boundary integration point (e.g., frontend consuming a new backend API, service consuming a new DB migration, auth module integrating with a new table's RLS)
2. A prior CST has not already been recorded for this convergence point in the current wave
3. The integration risk is non-trivial (new tables, new hooks, new RLS policies, new storage paths, new AI invocation endpoints)

**Prompt wording IAA should use:**
> "This subwave closes a cross-boundary integration point. Per `COMBINED_TESTING_PATTERN.md` §4.2, a CST checkpoint is warranted before wave completion. Please commission CST for [describe scope: subwaves/modules] and record the result in the wave reconciliation artefact before proceeding."

#### CWT Prompt Conditions (mandatory — always required before IBWR)

Prompt the Foreman to commission a CWT **before any IBWR completion** if:
1. Wave QA has passed (cumulative regression GREEN)
2. No CWT PASS evidence is present in the IBWR artefact or PREHANDOVER proof

This is **not discretionary**. Absence of CWT PASS evidence in an IBWR is a REJECTION-PACKAGE finding.

**Prompt wording IAA should use:**
> "No CWT PASS evidence is recorded in this IBWR. Per `COMBINED_TESTING_PATTERN.md` §5.2, CWT is a constitutional requirement before IBWR completion. IBWR CANNOT close without a CWT PASS verdict. Please execute CWT covering all waves through Wave [N] and all modules in this wave, and record the result before re-submitting."

#### FCWT Prompt Conditions (mandatory — before production sign-over)

Prompt the Foreman to commission an FCWT **if**:
1. The PR or wave being reviewed is the final wave or a postbuild remediation wave prior to formal production sign-over / CWT-on-production
2. No FCWT PASS evidence is present in the handover artefact

**Prompt wording IAA should use:**
> "This wave targets production sign-over. Per implementation plan §2.7 (Task 6.4) and `COMBINED_TESTING_PATTERN.md`, an FCWT (Final Complete Wave Test) is required to confirm all wave interdependencies function correctly end-to-end on the live deployment before formal sign-over. Please commission and record FCWT before closing this wave."

---

### IAA Audit Check for CST/CWT/FCWT Evidence

When reviewing an IBWR, PREHANDOVER proof, or wave closure artefact, IAA **must** verify:

| Check ID | What to verify | Missing = |
|----------|---------------|-----------|
| OVL-AM-CST-01 | If convergence point exists in wave: CST checkpoint recorded OR documented rationale for skip (per §4.2 "CST may be skipped if cumulative regression provides sufficient integration assurance") | Advisory finding if no rationale; REJECTION if wave claimed complete and CST was clearly warranted |
| OVL-AM-CWT-01 | IBWR artefact contains CWT PASS verdict with scope (waves covered, modules covered, scenarios covered) | **REJECTION-PACKAGE** — CWT is mandatory, no exceptions |
| OVL-AM-FCWT-01 | Final production sign-over / Task 6.4 CWT: FCWT PASS verdict present in handover artefact | **REJECTION-PACKAGE** — FCWT is mandatory before sign-over |

---

### Scope of This Rule

This rule applies to:
- All AAWP/MAT deliverable PRs (waves, subwaves, remediation waves, postbuild waves)
- All wave gate reviews
- All IBWR and PREHANDOVER proof reviews
- All production deployment and sign-over PRs

This rule does **not** apply to:
- Session memory only PRs
- Doc-only / parking station PRs
- Agent contract PRs where no wave deliverable is included

---

## Operating Model Summary

IAA operates with a single objective: binary verdict.
- **ASSURANCE-TOKEN**: all checks PASS → merge permitted (subject to CS2 approval)
- **REJECTION-PACKAGE**: one or more checks FAIL → merge blocked, all failures cited with fix required
- **STOP-AND-FIX mandate**: ACTIVE. No class exceptions. Ambiguity resolves to mandatory invocation.

IAA never produces partial verdicts, never reviews its own work, and is never the same agent
that produced the work under review. Every invocation is logged in session memory and
`learning_notes` are used to refine future decisions and grow the FAIL-ONLY-ONCE registry.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-02-25 | Initial index — FAIL-ONLY-ONCE.md, session-memory-template.md stubs |
| 1.1.0 | 2026-02-28 | Core knowledge files fully populated (iaa-core-invariants-checklist.md, iaa-trigger-table.md, iaa-category-overlays.md) |
| 1.2.0 | 2026-03-01 | iaa-core-invariants-checklist.md v2.1.0 update (CORE-016 copy-paste requirement) |
| 1.3.0 | 2026-03-02 | iaa-trigger-table.md v2.1.0 (KNOWLEDGE_GOVERNANCE category); iaa-category-overlays.md v2.2.0 (OVL-KG-001 through OVL-KG-005); FAIL-ONLY-ONCE.md v1.3.0 (A-018, A-019) |
| 1.4.0 | 2026-03-02 | iaa-core-invariants-checklist.md v2.3.0 (CORE-018 to CORE-020; CORE-007 PENDING carve-out); A-020 (PREHANDOVER template staleness); all stub files populated |
| 1.5.0 | 2026-03-02 | IAA_ZERO_SEVERITY_TOLERANCE.md v1.0.0; iaa-core-invariants-checklist.md v2.4.0 (CORE-021); A-021 (commit before invocation); A-022 (re-evaluate trigger categories every invocation) |
| 1.6.0 | 2026-03-03 | FAIL-ONLY-ONCE.md v1.6.0 (A-023 OVL-AC-012 ripple assessment standing requirement codified from sessions 084–101); index updated to 1.6.0 |
| 1.7.0 | 2026-03-03 | FAIL-ONLY-ONCE.md v1.7.0 (A-024 secret field naming — `secret:` prohibited, must use `secret_env_var:`); iaa-core-invariants-checklist.md v2.5.0 (CORE-022); all 16 active agent contracts fixed; CI scanner failures resolved |
| 1.8.0 | 2026-03-03 | Conflict resolution: A-023 collision fixed — PR #816 rule renumbered to A-025 (ceremony PENDING rule); A-023 now = OVL-AC-012 ripple assessment; A-024 = secret field naming; A-025 = ceremony PENDING pre-fill prohibition |
| 1.9.0 | 2026-03-03 | FAIL-ONLY-ONCE.md v1.9.0 — A-026 (SCOPE_DECLARATION.md must match PR diff exactly before IAA invocation — stale = BL-027 merge gate parity failure) added from session-116 Wave 13 Addendum B+C re-invocation |
| 2.0.0 | 2026-03-03 | FAIL-ONLY-ONCE.md v2.0.0 — A-027 (third-consecutive A-021 = systemic workflow gap) added from session-119 (Wave 14 Addendum A); FAIL-ONLY-ONCE.md header corrected from 1.8.0 to 2.0.0 (header/index version mismatch resolved) |
| 2.1.0 | 2026-03-03 | FAIL-ONLY-ONCE.md v2.1.0 — A-028 (SCOPE_DECLARATION format compliance — list format required, prior-wave entries must be trimmed) added from session-120 (Wave 14 Addendum A fourth invocation) |
| 2.2.0 | 2026-03-04 | FAIL-ONLY-ONCE.md v2.2.0 (A-029 ARTIFACT-IMMUTABILITY §4.3b); iaa-core-invariants-checklist.md v2.6.0 (CORE-016 PENDING carve-out updated per A-029) |
| 2.3.0 | 2026-03-04 | FAIL-ONLY-ONCE.md v2.3.0 (A-030 CORE-019 re-invocation carve-out — correction addendum path for immutable-PREHANDOVER re-invocation scenarios); index updated to 2.3.0 (session-098b) |
| 2.4.0 | 2026-03-04 | Added §CST/CWT/FCWT Orchestration Prompting — IAA discretionary and mandatory obligation to prompt Foreman for CST/CWT/FCWT at appropriate wave gates; added OVL-AM-CST-01, OVL-AM-CWT-01, OVL-AM-FCWT-01 audit checks; added COMBINED_TESTING_PATTERN.md to constitutional canon references (CS2 directive 2026-03-04) |
| 2.5.0 | 2026-03-05 | IAA_AGENT_CONTRACT_AUDIT_STANDARD.md v1.0.0 added — codifies mandatory audit steps, pre-approval doctrine, protected components checklist, tier placement discipline, and decision matrix for AGENT_CONTRACT PRs (CS2 directive — governance-liaison-isms session-049-20260305) |
| 2.6.0 | 2026-03-05 | iaa-category-overlays.md → v3.1.0: OVL-AC-ADM-001 through OVL-AC-ADM-004 descriptions completed with full pass conditions; version history table added; index version reference corrected from stale 2.3.0 to 3.1.0 (governance-liaison-isms session-050 — CS2 directive issue #966) |
| 2.7.0 | 2026-03-08 | FAIL-ONLY-ONCE.md → v2.5.0 (A-032 Schema Column Compliance Check — IAA self-governance closure for INC-ALCF-001; per Pre-Brief wave-audit-log-column-fix §7 shared responsibility clause); index version and key rules table updated (session-wave-audit-log-column-fix-20260308) |
| 2.8.0 | 2026-03-10 | iaa-category-overlays.md → v3.3.0 (S-033: OVL-CI-005 Inherent Limitation Exception documented for self-referential workflow PRs; three required substitutes defined; retroactive incident acceptance policy formalised); PR #1053 |
| 2.9.0 | 2026-03-11 | iaa-category-overlays.md → v3.4.0 (INJECTION_AUDIT_TRAIL renamed to PRE_BRIEF_ASSURANCE; removed injection pipeline signature string requirement; OVL-INJ-001 artifact-existence-only); INDEPENDENT_ASSURANCE_AGENT_CANON.md → v1.5.0 (same model change); issue #1061 |
| 3.0.0 | 2026-03-17 | FUNCTIONAL-BEHAVIOUR-REGISTRY.md v1.0.0 added (post-merge niggle registry — NBR-001 through NBR-004; FAIL-ONLY-ONCE A-034); niggle-pattern-library.md v1.0.0 added (stack patterns for TanStack Query, Supabase, Zustand, Next.js, TypeScript — FAIL-ONLY-ONCE A-035); iaa-category-overlays.md → v3.5.0 (BD-000 User Journey Trace — BD-000-A through BD-000-D); FAIL-ONLY-ONCE.md → v2.7.0 (A-034, A-035); IAA contract → v2.3.0 (Step 2.3b liveness signal check; Step 3.1 FUNCTIONAL-BEHAVIOUR-REGISTRY reference); liveness/last-known-good.md baseline created — CS2 IAA functional behaviour strengthening mandate |
| 3.1.0 | 2026-03-18 | iaa-category-overlays.md → v3.6.0 (Orientation Mandate scope note clarifying cross-reference consistency vs. declared-state integrity; OVL-KG-ADM-002 pass condition sharpened; timestamp carve-out note added); index.md version reference updated; issue [clarify audit scope cross-reference consistency and version bump history] |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
**Canonical Source**: `APGI-cmy/maturion-foreman-governance`