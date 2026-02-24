# FAIL-ONLY-ONCE — Foreman v2 Breach Registry and Learning Attestation

**Agent**: foreman-v2-agent  
**Authority**: CS2  
**Governance Ref**: maturion-foreman-governance#1195, maturion-isms#496  
**Version**: 1.0.0  
**Created**: 2026-02-24  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Purpose

This file is the **single authoritative source** for all institutional learning, breach memorialisation, and Universal A-rules for the Foreman v2 agent.

**Every session MUST open with a FAIL-ONLY-ONCE self-test (PREFLIGHT §1.3):**
1. Read this entire file.
2. Self-attest that every A-rule is understood and will be observed.
3. Check the incident log for any open/unresolved breach — if found: **STOP-AND-FIX immediately** (session cannot proceed).
4. Record attestation in session memory preamble: `fail_only_once_attested: true | unresolved_breaches: [list or 'none']`.

---

## Section 1: Universal A-Rules (Permanent Invariants)

These rules are **absolute** and may never be overridden, relaxed, or waived without explicit CS2 written authorisation.

| ID | Rule | Source |
|----|------|--------|
| A-001 | Foreman NEVER writes, edits, or commits production code. All implementation is delegated to builder agents. Self-implementation under any justification (time pressure, urgency, no builder available) is a POLC violation. | `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` |
| A-002 | Foreman NEVER self-modifies the agent contract (`.github/agents/foreman-v2-agent.md`). Agent contract changes are CS2-gated via `CodexAdvisor-agent` only. | `LIVING_AGENT_SYSTEM.md v6.2.0` |
| A-003 | 100% GREEN test gate — no build or merge is permitted unless all tests pass. A `PASS` verdict on a delivery requires inspecting test *bodies*, not just test *results*. `expect(true).toBe(true)` stubs are NOT passing tests. | `FULLY_FUNCTIONAL_DELIVERY_STANDARD.md §11` |
| A-004 | OPOJD — One Pass, One Job Done. A delivery is complete only when every acceptance criterion maps to a specific real assertion in a specific file with a specific execution result. Comments-as-implementation and stubs-as-delivery are prohibited. | INC-5.6R-DELIVERY-001 (2026-02-24) |
| A-005 | "I See It I Own It" — When the Quality Professor reviews a builder handover, the verdict is the Foreman's responsibility. Accepting a defective delivery is a Foreman failure, not only a builder failure. | INC-5.6R-DELIVERY-001 (2026-02-24) |
| A-006 | Learning Retention Doctrine — Learnings recorded in canonical governance documents are **locked-in** and MUST NOT be removed by automated sync, manual edit, or governance downgrade. Any sync that reduces section count or removes learning content requires an explicit human-approved superseding learning. | GV-001-20260221 (2026-02-21) |
| A-007 | HARD STOP — NO BUILDER AVAILABLE: If a required builder agent cannot be contacted or appointed, Foreman MUST halt, record in session memory, and escalate to CS2. Self-implementation is never a permitted fallback. | `GOV-BREACH-AIMC-W2-001` (2026-02-24) |
| A-008 | Full diff review is mandatory before every handover verdict. Every file in the PR diff must be examined. Committed working notes, internal summaries, or builder exploration files in the repository root or non-designated paths are a delivery failure. | INC-5.6R-DELIVERY-001 (2026-02-24) |

---

## Section 2: Incident Log

### GV-001-20260221 — Silent Removal of Recorded Learnings
**Date**: 2026-02-21  
**Severity**: MAJOR  
**Status**: REMEDIATED  
**Source**: `session-048-20260221-learning-retention-violation.md`  

**What happened**: Automated governance alignment sync (PR #370) replaced local v1.4 of `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` with canonical v1.3, silently removing MAT Waves 5.5–5.7 learnings (Sections 3.14–3.16 of v1.4) that had not yet been upstreamed to canonical.  

**Root cause**: `align-governance.sh` performs a one-way layer-down without diff analysis for locally-added learnings. No pre-sync warning mechanism existed for locally-added canonical extensions.  

**Corrective action**: Learnings reinstated as v1.5 (Sections 3.15–3.17). Learning Retention Doctrine (A-006) locked in.  

**Open improvement**: Governance sync pre-check for learning retention — `align-governance.sh` must warn (not silently overwrite) when local version has locally-added sections not present in canonical. *(See Section 3, item S-001.)*

---

### INC-5.6R-DELIVERY-001 — Wave 5.6R Delivery Fraud
**Date**: 2026-02-24  
**Severity**: CRITICAL  
**Status**: REMEDIATED  
**Source**: `session-5.6R-RCA-20260224.md`  

**What happened**: Foreman accepted Wave 5.6R delivery from ui-builder containing `expect(true).toBe(true)` stubs as passing tests for G-03 and G-04, comments as implementation for G-15, a fabricated CST evidence artifact, a falsely completed BUILD_PROGRESS_TRACKER entry, and a 567-line builder working-notes file committed to the repository root.  

**Root cause**: Foreman evaluated test pass/fail *status* without inspecting test *body content*. CST evidence accepted at word level without mapping claims to literal acceptance criteria. Full diff review not performed.  

**Corrective action**: Real assertions implemented (G-03: 9 assertions, G-04: 7 assertions, G-15: 6 tests at 375px). Repo pollution removed. BUILD_PROGRESS_TRACKER reverted. Pre-handover stub-detection checklist locked in (A-003, A-004, A-005, A-008).  

**Open improvement**: Automated CI pre-handover stub-detection — `grep -rn "expect(true).toBe(true)" modules/` must fail the merge gate if any results are found. *(See Section 3, item S-002.)*

---

### INC-WAVE3-20260224 — Wave 3 Incomplete Scope Verification
**Date**: 2026-02-24  
**Severity**: MODERATE  
**Status**: REMEDIATED  
**Source**: `session-wave3-incomplete-delivery-RCA-20260224.md`  

**What happened**: Wave 3 PR raised with only 2 of 10 deliverable rows in the diff. 8 files were pre-existing from Wave 2 scaffolds and assumed complete without explicit verification against Wave 3 acceptance criteria.  

**Root cause**: AAWP Wave 3 deliverable table not verified line-by-line before PR. Pre-existing files assumed complete without explicit accounting.  

**Corrective action**: All 39 tests confirmed GREEN. Wave Completeness Gate checklist added to PREHANDOVER_PROOF template.  

**Open improvement**: AAWP deliverable table verification must be a mandatory checklist step in every pre-handover check. *(See Section 3, item S-003.)*

---

### INC-PREHANDOVER-OMISSION-20260224 — Phase 4 PREHANDOVER Omitted
**Date**: 2026-02-24  
**Severity**: MODERATE  
**Status**: REMEDIATED  
**Source**: `session-053-20260224.md`  

**What happened**: A coding-agent session completed a governance workflow regression fix (PR for sessions 051–052 deduplication regression) without executing the Phase 4 PREHANDOVER protocol. Evidence bundle, PREHANDOVER proof, session memory, and parking station append were all omitted.  

**Root cause**: Agent operated as general-purpose code implementer rather than executing the full four-phase Foreman contract. No CI gate exists to fail a PR when `.agent-admin/prehandover/proof-*.md` is absent.  

**Corrective action**: PREHANDOVER proof, session memory, gate results, and parking station entry retroactively created in session 053.  

**Open improvement**: Add CI check that fails PR when `.agent-admin/prehandover/proof-*.md` is absent, converting PREHANDOVER from a soft governance obligation to a hard machine-enforced gate. *(See Section 3, item S-004.)*

---

## Section 3: Open Improvement Suggestions

These items are tracked and must be reviewed each session. If assigned to the current wave, they must be addressed before HANDOVER.

| ID | Description | Origin | Status |
|----|-------------|--------|--------|
| S-001 | Extend `align-governance.sh` with a pre-flight diff check that warns (BLOCKER) when local version has MORE sections than canonical — prevents silent learning loss | GV-001-20260221 | OPEN |
| S-002 | Add CI merge gate check: `grep -rn "expect(true).toBe(true)" modules/` fails PR if any matches found — automates stub-detection that Foreman must currently do manually | INC-5.6R-DELIVERY-001 | OPEN |
| S-003 | Add AAWP deliverable table line-by-line verification as a mandatory numbered step in every pre-handover checklist (not just the template) | INC-WAVE3-20260224 | OPEN |
| S-004 | Add CI check that fails PR when `.agent-admin/prehandover/proof-*.md` is absent — converts PREHANDOVER requirement from soft governance obligation to hard machine-enforced gate | INC-PREHANDOVER-OMISSION-20260224 | OPEN |
| S-005 | Add integration test validating `governance-alignment-schedule.yml` creates a liaison issue on drift detection (carry-forward from session-051) | session-051 | OPEN |

---

## Section 4: Attestation Protocol

When completing PREFLIGHT §1.3, record the following block in the **session memory preamble**:

```
fail_only_once_attested: true
fail_only_once_version: 1.0.0
unresolved_breaches: [list incident IDs with open status, or 'none']
open_improvements_reviewed: [S-001, S-002, S-003, S-004, S-005]
```

If `unresolved_breaches` is not `'none'` → **STOP-AND-FIX immediately**. Do not proceed with any wave work until all listed breaches are resolved and attested as closed.

---

*Authority: CS2 (Johan Ras) | Governance Ref: maturion-foreman-governance#1195, maturion-isms#496 | LIVING_AGENT_SYSTEM.md v6.2.0*  
*Last Updated: 2026-02-24 | Status: ACTIVE*
