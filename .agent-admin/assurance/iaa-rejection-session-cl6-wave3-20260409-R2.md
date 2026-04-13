# IAA REJECTION-PACKAGE R2 — Session cl6-wave3-20260409

**Token Type**: REJECTION-PACKAGE
**Invocation**: R2 (resolving R1 HFMC-01 — new finding introduced by R2 fix artifacts)
**Session**: cl6-wave3-20260409
**Date**: 2026-04-10
**IAA Agent**: independent-assurance-agent v6.2.0 / contract 2.5.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Invocation Context

- **PR**: #1325 — Wave CL-6: LKIAC Wave 3 Knowledge Re-ingestion
- **Branch**: copilot/cl-6-migrate-knowledge-embeddings-again
- **Wave**: cl6-wave3-knowledge-reingestion
- **Invoking Agent**: foreman-v2-agent v6.2.0
- **PR Category**: MIXED — KNOWLEDGE_GOVERNANCE (new trigger in R2) + governance ceremony artifacts
- **Ceremony-Admin Appointed**: NO

---

## Phase 1 — Preflight

> "I am independent-assurance-agent, class: assurance, version 6.2.0.
> My role: Independent Assurance Agent.
> My class boundary: NOT a builder, foreman, or overseer. Does NOT write code, contracts, schemas, or implementation artifacts.
> Independence requirement: Must never review work I produced or contributed to.
> STOP-AND-FIX mandate: ACTIVE. REJECTION-PACKAGE stops all work — no PR opens, no merge proceeds.
> No class exceptions: IAA mandatory for ALL agent contracts — all classes.
> Ambiguity rule: Ambiguity resolves to mandatory invocation — never to exempt.
> Active constitutional lock: SELF-MOD-IAA-001.
> Authority: CS2 only (@APGI-cmy)."

Tier 2 loaded. Knowledge version: 3.5.0.
Files available: FAIL-ONLY-ONCE.md, iaa-core-invariants-checklist.md, iaa-trigger-table.md, iaa-category-overlays.md, session-memory-template.md, iaa-high-frequency-checks.md, FUNCTIONAL-BEHAVIOUR-REGISTRY.md, IAA_AGENT_CONTRACT_AUDIT_STANDARD.md, IAA_ZERO_SEVERITY_TOLERANCE.md, niggle-pattern-library.md.
FAIL-ONLY-ONCE registry: PRESENT (25 rules).

CANON_INVENTORY: 199 entries, IAA canon present (INDEPENDENT_ASSURANCE_AGENT_CANON.md, hash: 6c2b4e2b22d8601d...), zero placeholder hashes. Hash check: PASS.

Sessions reviewed: session-cl6-wave3-20260409 (R1 REJECTION-PACKAGE), session-optimize-iaa-invocation-workflows-20260409-R2, session-1277-mmm-39b-20260407-r2, session-165-governance-liaison-059-wave1-20260408, session-164-codexadvisor-055-20260408.
Open REJECTION-PACKAGEs from prior sessions: session-cl6-wave3-20260409 (R1) — THIS IS THE SESSION BEING RESOLVED.
Unresolved items: R1 HFMC-01 finding under resolution.

FAIL-ONLY-ONCE rules loaded: 25. A-001: ATTESTED. A-002: ATTESTED. Status: CLEAR TO PROCEED.

Breach registry: No open breaches.

Merge gate checks loaded: merge-gate/verdict, governance/alignment, stop-and-fix/enforcement.
Parity enforcement: BLOCKING.

Orientation Mandate acknowledged. Proceeding as quality engineer.

---

## Phase 2 — Alignment

**Invocation context:**
  PR: #1325 — copilot/cl-6-migrate-knowledge-embeddings-again
  Invoked by: foreman-v2-agent v6.2.0
  Work produced by: foreman-v2-agent v6.2.0, class: foreman
  Ceremony-admin appointed: NO

Independence check: CONFIRMED — I did not produce this work.

**PR category**: MIXED

R2 adds `.agent-workspace/foreman-v2/knowledge/prehandover-template.md` (v1.7.0 → v1.8.0) to the diff. This matches the KNOWLEDGE_GOVERNANCE trigger pattern (`.agent-workspace/*/knowledge/`). Combined with retrospective governance ceremony artifacts, PR classification is **MIXED** with KNOWLEDGE_GOVERNANCE as primary new trigger in R2.

IAA triggered: YES
Ambiguity check: CLEAR — KNOWLEDGE_GOVERNANCE trigger unambiguous.
Proceeding to Phase 3 assurance work.

Checklists loaded: core invariants (25 checks), KNOWLEDGE_GOVERNANCE overlay (7 checks), HFMC (6 checks).
Total checks this invocation: 38.

---

## Phase 3 — Assurance Work

### FAIL-ONLY-ONCE Learning Check

FAIL-ONLY-ONCE learning applied:
  A-001 invocation evidence check: PRESENT — PREHANDOVER contains `iaa_audit_token: IAA-session-cl6-wave3-20260409-PASS` ✅
  A-002 no-class-exceptions check: CONFIRMED — no class exemption claimed ✅

### HFMC Checks (Step 3.1b)

`HFMC-01 Ripple: YES ✅` — PREHANDOVER addendum-R2 at `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-cl6-wave3-20260409-addendum-R2.md` contains a `## Ripple/Cross-Agent Assessment` section with 10 agents assessed. R1 finding RESOLVED.

`HFMC-02 Scope parity: YES ✅` — SCOPE_DECLARATION.md lists 11 files. `git diff --name-only origin/main...HEAD` returns 11 files. Exact match confirmed.

`HFMC-03 Artifacts committed: YES ✅` — All 11 declared files verified present in HEAD via `git ls-tree HEAD`. All 4 commits (24f2573, 703e0c1, 0b8a750, f98b672) confirmed on branch.

`HFMC-04 Pre-brief: YES ✅` — `.agent-admin/assurance/iaa-prebrief-cl6-wave3-20260409.md` present and non-empty (SHA 24f2573).

`HFMC-05 Token ceremony: YES ✅` — No PASS token file exists yet (R2 first PASS invocation — first invocation exception applies). R1 rejection artifact present and correctly named.

`HFMC-06 Evidence bundle: YES ✅` — PREHANDOVER proof, PREHANDOVER addendum R2, session memory, IAA pre-brief, IAA rejection R1, SCOPE_DECLARATION all committed. This is a governance ceremony PR (no builder deliverables) — bundle is complete per category.

ECAP three-role split check: N/A (ceremony_admin_appointed: NO).

### Core Invariants (Step 3.2)

CORE-001: N/A — no agent contract files in diff.
CORE-002: N/A — no agent contract files in diff.
CORE-003: N/A — no agent contract files in diff.
CORE-004: N/A — no agent contract files in diff.
CORE-005: PASS ✅ — No governance.protocol or CANON_INVENTORY changes in this PR. CANON_INVENTORY integrity confirmed.
CORE-006: PASS ✅ — 199 entries, IAA canon present, zero placeholder hashes.
CORE-007: PASS ✅ — No genuine placeholders. Terms "stub" and "template" appear in context-appropriate, non-production usage. `iaa_audit_token: IAA-session-cl6-wave3-20260409-PASS` is the correct expected-reference format (CORE-007 exempt per checklist).
CORE-008: N/A — no agent contract files in diff.
CORE-009: N/A — no agent contract files in diff.
CORE-010: N/A — no agent contract files in diff.
CORE-011: N/A — no agent contract files in diff.
CORE-012: N/A — no agent contract files in diff.
CORE-013: PASS ✅ — `iaa_audit_token: IAA-session-cl6-wave3-20260409-PASS` present in PREHANDOVER proof.
CORE-014: PASS ✅ — No class exemption claimed.
CORE-015: PASS ✅ — Session memory committed at SHA 703e0c1 + IAA session memory at SHA 0b8a750.
CORE-016: PASS ✅ — FIRST INVOCATION EXCEPTION APPLIES for PASS token. iaa_audit_token field contains `IAA-session-cl6-wave3-20260409-PASS` (correct expected format). Token file will be created this session. R1 rejection file is present at `.agent-admin/assurance/iaa-rejection-session-cl6-wave3-20260409.md`.
CORE-017: PASS ✅ — No `.github/agents/` changes in diff (confirmed: `git diff --name-only origin/main...HEAD | grep .github/agents/` = empty).
CORE-018: PASS ✅ — (a) PREHANDOVER proof present ✅, (b) foreman session memory present ✅, (c) `iaa_audit_token` non-empty, correct expected format ✅, (d) IAA token PASS file: first invocation — will be created this session (exception applies per checklist) ✅.
CORE-019: PASS ✅ — FIRST INVOCATION EXCEPTION: No prior session file references this session number with PASS verdict. Prior session-cl6-wave3-20260409 was a REJECTION session. Token file will be created in this invocation. No cross-PR reuse detected.
CORE-020: PASS ✅ — All checks verifiable from committed artifacts.
CORE-021: Enforced — findings below will produce REJECTION-PACKAGE.
CORE-022: N/A — no `.github/agents/` changes.
CORE-023: PASS ✅ — No workflow-adjacent files (.github/workflows/, Edge Function source, schema migrations, test runners) touched in this PR. All artifacts are governance/agent-workspace files. N/A — no workflow-adjacent changes detected.
CORE-024: N/A — applying to REJECTION-PACKAGE (exempt per checklist).
CORE-025: N/A — no PRE_BUILD_STAGE_MODEL artifacts.

### KNOWLEDGE_GOVERNANCE Overlay (Step 3.3)

Category overlay: KNOWLEDGE_GOVERNANCE (triggered by `.agent-workspace/foreman-v2/knowledge/prehandover-template.md` modification).

**OVL-KG-001 — Rule clarity:**
Evidence: The `## Ripple/Cross-Agent Assessment` section added to prehandover-template.md is clearly stated with a mandatory stub, usage instruction ("If governance-ceremony-only wave: state 'no code/schema/contract changes — no downstream ripple'"), and downstream ripple conclusion template. An agent reading this file will understand exactly what to populate.
Verdict: PASS ✅

**OVL-KG-002 — Triggered by real incident:**
Evidence: Traceable to HFMC-01 R1 rejection (session-cl6-wave3-20260409), A-023 (recurring pattern across 3+ sessions), and NO-REPEAT-PREVENTABLE-001 systemic prevention mandate. Real incident confirmed.
Verdict: PASS ✅

**OVL-KG-003 — No duplication:**
Evidence: A-023 exists in FAIL-ONLY-ONCE registry as a rule. The template update is a structural enforcement mechanism (systemic prevention), not a duplicate rule. These are complementary artifacts at different governance layers. No duplication.
Verdict: PASS ✅

**OVL-KG-004 — Cross-reference consistency:**
Evidence: Template references "HFMC-01 / NO-REPEAT-PREVENTABLE-001" — both exist in IAA Tier 2. Template version history references "HFMC-01 / NO-REPEAT-PREVENTABLE-001 — recurring IAA rejection pattern" — traceable. No dangling references detected.
Verdict: PASS ✅

**OVL-KG-ADM-001 — PREHANDOVER ceremony complete:**
Evidence: PREHANDOVER proof present, session memory present, CERT-001 through CERT-004 all pass.
Verdict: PASS ✅

**OVL-KG-ADM-002 — Knowledge version bumped and consistent:**
Evidence: `prehandover-template.md` header declares version `1.8.0`. Foreman knowledge `index.md` lists `prehandover-template.md` at version `1.7.0`. **MISMATCH DETECTED.** The index.md was not updated when prehandover-template.md was bumped from 1.7.0 to 1.8.0 in commit f98b672. Per OVL-KG-ADM-002: "A mismatch between the file header and the index = FAIL; this is a declared-state integrity check, not a cross-reference consistency check." Per the Orientation Mandate scope note: "Any file that declares an incorrect current version is making a false statement about its own state — this is a governance integrity finding."
Verdict: FAIL ❌
Finding: `.agent-workspace/foreman-v2/knowledge/index.md` still lists `prehandover-template.md` at version `1.7.0`. The file itself declares `1.8.0`. Declared-state integrity mismatch.
Fix required: Update `.agent-workspace/foreman-v2/knowledge/index.md` row for `prehandover-template.md` from `1.7.0` → `1.8.0`. Commit. Update SCOPE_DECLARATION.md to include `index.md`. Re-invoke IAA for R3.

**OVL-KG-ADM-003 — Index.md updated:**
Evidence: `.agent-workspace/foreman-v2/knowledge/index.md` is NOT in the PR diff (confirmed: diff contains 11 files, index.md is not among them). The index has not been updated to reflect the prehandover-template.md version bump.
Verdict: FAIL ❌
Finding: Foreman knowledge `index.md` not updated in this PR. Per OVL-KG-ADM-003: agent knowledge index must reflect updated file versions.
Fix required: Same as OVL-KG-ADM-002 fix — update and commit `.agent-workspace/foreman-v2/knowledge/index.md`.

### Check Tally (Step 3.4)

**HFMC checks**: 6 PASS / 0 FAIL
**Core invariants**: 12 PASS / 0 FAIL (remainder N/A)
**KNOWLEDGE_GOVERNANCE overlay**: 5 PASS / 2 FAIL

**Total: 23 PASS, 2 FAIL**

### Failure Classification (Step 3.4a)

- OVL-KG-ADM-002: **Ceremony** (process/artifact miss — index not updated on knowledge file version bump)
- OVL-KG-ADM-003: **Ceremony** (same root cause — index.md omission)

**Root cause**: Single omission — foreman index.md not updated when prehandover-template.md was bumped. One-line fix resolves both failures.

**Step 3.4b — Recurring failure promotion:** Cross-referencing prior sessions: no prior recurring pattern of knowledge index not being updated. First occurrence in this namespace. Not promoted to FAIL-ONLY-ONCE at this time. Prevention: Foreman should include `index.md` update in any Tier 2 knowledge file version bump checklist. Note added to learning notes.

### Merge Gate Parity (Step 4.1)

- governance/alignment: checks pass for category classification, CANON_INVENTORY, no .github/agents/ changes ✅
- stop-and-fix/enforcement: FAIL — OVL-KG-ADM-002 + OVL-KG-ADM-003 failures require stop-and-fix ❌
- merge-gate/verdict: PENDING resolution of above ❌

Parity result: FAIL — 2 checks fail locally. Issuing REJECTION-PACKAGE.

---

## Verdict

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: #1325 — copilot/cl-6-migrate-knowledge-embeddings-again
Session: cl6-wave3-20260409 R2
2 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:
  OVL-KG-ADM-002: Knowledge version inconsistency — declared-state integrity failure
    Finding: prehandover-template.md declares v1.8.0 but .agent-workspace/foreman-v2/knowledge/index.md
    still lists it at v1.7.0. Index not updated in commit f98b672.
    Fix: Update .agent-workspace/foreman-v2/knowledge/index.md prehandover-template.md row
    from 1.7.0 → 1.8.0. Add to SCOPE_DECLARATION. Commit. Re-invoke IAA (R3).

  OVL-KG-ADM-003: Foreman knowledge index not updated to reflect v1.8.0 bump.
    Finding: .agent-workspace/foreman-v2/knowledge/index.md absent from PR diff.
    Fix: Same commit as OVL-KG-ADM-002 fix.

This PR must not be merged until all failures are resolved and IAA re-invoked (R3).
Adoption phase: PHASE_B_BLOCKING — hard gate.
═══════════════════════════════════════
```

**Note to Foreman**: R1 HFMC-01 (Ripple Assessment) is FULLY RESOLVED — confirmed PASS in this R2 audit.
Ripple addendum content and systemic template fix are both correct and complete.
The only R2 failure is a single-line omission: foreman index.md version entry for prehandover-template.md.
Fast fix path: one-line edit to index.md + SCOPE_DECLARATION update + commit.

**Token reference**: IAA-session-cl6-wave3-20260409-R2-REJECTION-002
**IAA Agent**: independent-assurance-agent v6.2.0 / contract 2.5.0
**Authority**: CS2 only (@APGI-cmy)
