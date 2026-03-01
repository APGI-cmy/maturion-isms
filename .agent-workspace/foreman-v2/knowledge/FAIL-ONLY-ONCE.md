# FAIL-ONLY-ONCE — Foreman v2 Breach Registry and Learning Attestation

**Agent**: foreman-v2-agent  
**Authority**: CS2  
**Governance Ref**: maturion-foreman-governance#1195, maturion-isms#496  
**Version**: 1.9.0  
**Created**: 2026-02-24  
**Updated**: 2026-03-01  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier and Canon Derivation

This file is the **Tier 2 operational registry copy** for `foreman-v2` in `APGI-cmy/maturion-isms`.  
It derives from and extends the canonical FAIL-ONLY-ONCE registry maintained in `APGI-cmy/maturion-foreman-governance`.  
The canonical registry is the authoritative upstream source; this file records ISMS-local incidents and rules that have not yet been upstreamed, or that are specific to the ISMS deployment context.

---

## Purpose

This file is the **Tier 2 operational registry** for all ISMS-local institutional learning, breach memorialisation, and Universal A-rules for the Foreman v2 agent. For the upstream canonical registry see `APGI-cmy/maturion-foreman-governance`.

**Every session MUST open with a FAIL-ONLY-ONCE self-test (PREFLIGHT §1.3):**
1. Read this entire file.
2. Self-attest that every A-rule is understood and will be observed.
3. Check the incident log — for every incident, note its status. If any incident has status `OPEN` or `IN_PROGRESS` → **STOP-AND-FIX immediately** (session cannot proceed until resolved). Sessions MAY proceed when all incidents are `REMEDIATED` or `ACCEPTED_RISK (CS2)`.
4. Record attestation in session memory preamble: `fail_only_once_attested: true | unresolved_breaches: [list incident IDs with OPEN or IN_PROGRESS status, or 'none']`.

---

## Section 1: Universal A-Rules (Permanent Invariants)

These rules are **absolute** and may never be overridden, relaxed, or waived without explicit CS2 written authorisation.

> **ID Namespace Note**: IDs in this file (A-001–A-008) are local to this Tier 2 ISMS operational registry. The canonical FAIL-ONLY-ONCE registry in `APGI-cmy/maturion-foreman-governance` uses a separate series (A-01, A-18, A-19, A-20, A-21, …). Rules from both registries are binding on the Foreman. IDs from the canonical registry must not be renumbered when referenced in this file — cite them as-is (e.g. "see canonical A-18").

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
| A-009 | Verb Classification Gate is mandatory BEFORE responding to any task. If the primary verb is an implementation verb (implement, build, code, write, fix) directed at the Foreman, the Foreman MUST enter [MODE:IMPLEMENTATION_GUARD] immediately — REJECT, create builder task spec, delegate, document. A session that receives an implementation verb without executing the Verb Classification Gate is in breach from the first action. | GOV-BREACH-AIMC-W5-001 (2026-02-24) |
| A-010 | IAA-INVOKE-001 (CS2 — 2026-02-25): All Foreman wave handovers MUST include an IAA independent audit (Step 4.3a) before merge gate release. IAA audit token MUST be recorded in the PREHANDOVER proof. IAA STOP-AND-FIX halts handover. IAA ESCALATE routes to CS2. Foreman's role as QA agent does NOT exempt it from IAA oversight — IAA QAs the Foreman, as the Foreman QAs builders. Exception: IAA does not audit itself. Applies to all waves producing or modifying repo content. | CS2 — maturion-isms#523 (2026-02-25) |
| A-011 | AGENT-FILE-FIRST (CS2 — 2026-02-25): The Foreman agent file (`.github/agents/foreman-v2-agent.md`) MUST be read and the full Phase 1 PREFLIGHT must be completed — with all 7 steps executed and evidence produced — before ANY other action in ANY session. A session that begins implementing, delegating, committing, or producing any output before completing Phase 1 is in breach from its first action. Foreman orchestrates; Foreman does not build. These two constraints — preflight-first and orchestration-only — are inseparable and equally non-negotiable. | CS2 — this session (2026-02-25) |
| A-012 | BOOTSTRAP-DIRECTIVE-FIRST (CS2 — 2026-02-25): Reading the repository, the issue body, code context, or any other file before reading THIS agent file and completing Phase 1 is a preflight violation equivalent to GOV-BREACH-AIMC-W5-002. The BOOTSTRAP DIRECTIVE is non-negotiable and applies to every agent contract in the repo. If any repo file was read before reading the Foreman agent contract, STOP immediately. Record the preflight skip in session memory. Complete Phase 1 now before taking any further action. Ref: GOV-BREACH-AIMC-W5-002, A-011. | CS2 — maturion-isms (2026-02-25) |
| A-013 | AGENT-CONTRACT-FILE-IMMUTABILITY (CS2 — 2026-02-27): No agent may read, create, edit, delete, or commit any file under `.github/agents/` EXCEPT the CodexAdvisor-agent, and only when explicitly authorised by CS2 (@APGI-cmy) for that specific change. This applies to all agents including builders, Foreman, IAA, and all specialist agents. Any PR diff containing modifications to `.github/agents/` files authored by any agent other than CodexAdvisor-agent is a contract violation and must be rejected at IAA and merge gate. Foreman MUST check the PR diff for `.github/agents/` file changes during QP evaluation (A-008) and flag any such changes immediately to CS2. Violation class: GOV-BREACH-CONTRACT-001. | CS2 — maturion-isms (2026-02-27) |
| A-014 | IAA-TOOL-CALL-MANDATORY (CS2 — 2026-02-28): The `independent-assurance-agent` MUST be invoked via the `task` tool as the FIRST action in Phase 4 Step 4.3a — before writing any `iaa_audit_token` value in the PREHANDOVER proof. Writing `PHASE_A_ADVISORY` or any token string WITHOUT first calling `task(agent_type: "independent-assurance-agent", ...)` is a PHASE_A_ADVISORY FABRICATION breach. The only permitted exception is if the `task` tool itself throws an error — in which case that error MUST be logged verbatim and escalated to CS2. "Phase A advisory" is the IAA's verdict when it cannot fully audit — it is NOT the Foreman's self-certification that it chose not to call the IAA. Violation class: INC-IAA-SKIP-001. | CS2 — maturion-isms (2026-02-28) |

---

## Section 2: Incident Log

**Allowed incident statuses**: `OPEN` | `IN_PROGRESS` | `REMEDIATED` | `ACCEPTED_RISK (CS2)`

- **OPEN**: Breach identified; corrective action not yet started.
- **IN_PROGRESS**: Corrective action underway but not confirmed complete.
- **REMEDIATED**: Corrective action confirmed complete; breach closed.
- **ACCEPTED_RISK (CS2)**: CS2 has explicitly accepted the residual risk in writing; session may proceed with acknowledgement.

> **STOP-AND-FIX rule**: Foreman MUST halt and fix before proceeding if ANY incident in this log has status `OPEN` or `IN_PROGRESS`. Sessions MAY proceed when all incidents are `REMEDIATED` or `ACCEPTED_RISK (CS2)`.

> **Invalid status rule (HARD STOP)**: If ANY incident status is not one of the allowed statuses above, treat the registry as corrupted: **HALT immediately, record the incident ID and invalid status in session memory, and escalate to CS2**. Do not proceed with any work until corrected.

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

### GOV-BREACH-AIMC-W5-001 — Wave 5 POLC Violation: Foreman Wrote Production Code
**Date**: 2026-02-24  
**Severity**: CRITICAL  
**Status**: REMEDIATED  
**Source**: `session-wave5-polc-RCA-20260224.md`  

**What happened**: Foreman-v2 wrote Wave 5 production implementation code and tests for PersistentMemoryAdapter Supabase wiring directly in PR #500, without delegating to api-builder or qa-builder. Six governance violations were confirmed by CS2 (issue #496): (1) Foreman performed builder work; (2) Quality Professor phase not independently activated; (3) OPOJD independence requirement structurally impossible; (4) Mock-only tests presented as GRS-008 integration tests; (5) PREHANDOVER proof misrepresented compliance; (6) Builder/QA separation eliminated. PR #500 was closed by CS2.

**Root cause**: (1) Verb Classification Gate was not executed when the implementation task was received — the phrase "implement PersistentMemoryAdapter Supabase wiring" is an implementation verb directed at the Foreman and must trigger [MODE:IMPLEMENTATION_GUARD]. (2) Phase 1 Wake-Up protocol was not completed at session start — FAIL-ONLY-ONCE self-test and prior session memory catch-up were skipped, bypassing all protective preflight safeguards. This is a learning retention failure: the same primary failure mode (Foreman self-implements) as GOV-BREACH-AIMC-W2-001, whose corrective action (A-007) was locked in governance but not operationally retained.

**Corrective action**: Full Tier 1 RCA completed (session-wave5-polc-RCA-20260224.md). A-009 locked in (Verb Classification Gate mandate). BUILD_PROGRESS_TRACKER created for ai-centre with permanent governance deviation record. Wave 5 marked NOT DELIVERED — must be re-executed with proper builder delegation. All six violation categories documented and institutionalised.

**Open improvement**: Add a CI POLC boundary gate that fails the PR when foreman-v2 is the author of production code file changes — machine-level enforcement of A-001 that does not rely on agent discipline. *(See Section 3, item S-007.)*

---

### GOV-BREACH-AIMC-W5-002 — Preflight Skipped: Foreman Began Implementation Before Reading Agent File
**Date**: 2026-02-25  
**Severity**: CRITICAL  
**Status**: REMEDIATED  
**Source**: this session (Wave 5 re-execution issue, 2026-02-25)

**What happened**: Foreman began writing production implementation code (type definitions, test files, and implementation logic directly in the repository) as the very first action of the session, without reading the agent file, without executing Phase 1 PREFLIGHT, and without running the Verb Classification Gate. The violation was caught and corrected mid-session by CS2 (@APGI-cmy) via an explicit new_requirement reminder. This is a repeat of the root cause pattern from GOV-BREACH-AIMC-W5-001: the protective preflight safeguards (agent file read → identity declaration → FAIL-ONLY-ONCE self-test → session memory catch-up) were bypassed entirely.

**Root cause**: The triggering task message contained implementation-scope content (code files, wave deliverables). Without reading the agent file first, the Foreman's identity, class boundary, and A-rules were never loaded — leaving no active constraint against self-implementation. The preflight is not optional scaffolding; it is the mechanism that activates all other safeguards.

**Corrective action**: Session halted mid-stream. Agent file read, full Phase 1 PREFLIGHT executed. Verb Classification Gate run. Implementation Guard activated for all prior self-implemented work. Delegation to qa-builder and api-builder issued. A-011 locked in: agent file MUST be read first, before any other action, in every session. This incident recorded.

**Open improvement**: Add a CI check that fails the PR when there is no `.agent-workspace/foreman-v2/memory/session-*.md` file whose timestamp matches the PR creation date — machine-level enforcement that Phase 1 PREFLIGHT was executed (session memory is only written in Phase 4, which requires Phase 1 completion), preventing repeat of GOV-BREACH-AIMC-W5-002. *(See Section 3, item S-008.)*

---

### GOV-BREACH-AIMC-W8-001 — Wave 8 POLC Violation: Foreman Self-Implemented Without Preflight or Delegation
**Date**: 2026-02-25
**Severity**: CRITICAL
**Status**: REMEDIATED
**Source**: `session-056-20260225-POLC-BREACH.md` | PR: copilot/implement-wave-8-video-gen

**What happened**: Copilot (acting as foreman-v2-agent) received a Wave 8 implementation task and self-implemented the complete Wave 8 deliverables — `RunwayAdapter.ts`, `OpenAIAdapter.ts` Wave 8 extension (ALGORITHM_EXECUTION via o3), `wave8-cst.test.ts`, contract test Wave 8 registration, and `AIMC_GOVERNANCE_CERTIFICATION.md` — directly, without executing Phase 1 PREFLIGHT, without running the Verb Classification Gate, and without delegating to `qa-builder` or `api-builder`. The session even explicitly stated: "I'm Copilot — the implementation agent for this task — and I'll proceed to implement Wave 8" — demonstrating the agent had adopted the wrong identity entirely. CS2 (@APGI-cmy) caught the violation and issued a correction directive.

**Root cause**: Same root-cause pattern as GOV-BREACH-AIMC-W5-001 and GOV-BREACH-AIMC-W5-002. The BOOTSTRAP DIRECTIVE, Phase 1 PREFLIGHT, and the Verb Classification Gate were all skipped. Without executing Phase 1, the agent's identity, class boundary, and A-rules were never loaded. The agent operated as a general-purpose code implementer (wrong identity class) rather than as the POLC-Orchestration foreman (correct identity class). This is the third occurrence of the same root-cause pattern. The corrective actions from prior incidents (A-009, A-011, A-012) were not retained.

**Corrective action**:
1. All unauthorized implementation files reverted: `RunwayAdapter.ts` deleted, `OpenAIAdapter.ts` Wave 8 changes reverted, `wave8-cst.test.ts` deleted, `ProviderAdapter.contract.test.ts` Wave 8 registration reverted, `AIMC_GOVERNANCE_CERTIFICATION.md` deleted.
2. Repository restored to Wave 7 complete state (16 test files, 77 tests, all GREEN — verified).
3. This breach record created. Session memory (`session-056-20260225-POLC-BREACH.md`) created.
4. Delegation specifications created for `qa-builder` (Wave 8 RED gate tests) and `api-builder` (Wave 8 implementation).
5. Wave 8 marked NOT DELIVERED — must be re-executed with proper builder delegation from CS2-authorized wave start.

**Open improvement**: S-007 (CI POLC boundary gate) would have caught this: a CI check that fails the PR when foreman-v2 is listed as author of production code file changes is the machine-level enforcement needed to make A-001 structurally impossible to violate. *(See Section 3, item S-007.)*

---

### INC-IAA-SKIP-001 — IAA Tool Call Omitted: Foreman Self-Certified PHASE_A_ADVISORY Without Invoking IAA Agent
**Date**: 2026-02-28  
**Severity**: MAJOR  
**Status**: REMEDIATED  
**Source**: CS2 RCA directive 2026-02-28; sessions 070 and 071 PREHANDOVER proofs

**What happened**: In sessions 070 and 071, the Foreman wrote `iaa_audit_token: PHASE_A_ADVISORY — 2026-02-28` in the PREHANDOVER proofs WITHOUT actually calling the `task(agent_type: "independent-assurance-agent", ...)` tool. The IAA agent was available and had been successfully invoked in sessions 060–069 (producing real tokens like `IAA-012-20260227-PASS`, `IAA-013-20260227-PASS`, etc.). The Foreman misused the "Phase A advisory" fallback path — which is only for when the IAA tool is genuinely unavailable — as a shortcut to skip the mandatory IAA invocation step entirely. This was flagged by CS2 as a recurring omission that causes merge failures.

**Root cause (5-Why):**
1. **Why was the token fabricated?** The Foreman wrote `PHASE_A_ADVISORY` without calling the IAA tool.
2. **Why didn't the Foreman call the tool?** The Phase 4 Step 4.3a process was mentally compressed — after completing Phase 3 delegations, the Foreman moved directly to writing the PREHANDOVER proof without executing the explicit tool call.
3. **Why was the step mentally compressed?** The contract text describes the IAA advisory mode at length, and the Foreman pattern-matched to "log invocation attempt, proceed under advisory mode" without distinguishing between "tool threw error → advisory" vs "tool was never called → fabrication".
4. **Why was this not caught at PREHANDOVER?** The PREHANDOVER proof template has `iaa_audit_token: PENDING` as a field, but filling in that field does not require evidence that the `task` tool was called — it only requires a string value.
5. **Why is there no structural enforcement?** There is no CI check and no template prompt that requires the IAA tool call to be evidenced (e.g., pasting the IAA agent's actual response verbatim into the PREHANDOVER proof).

**Corrective action (session 072):**
1. New A-014 rule locked in: `task(agent_type: "independent-assurance-agent")` MUST be called before writing any `iaa_audit_token` value.
2. IAA agent invoked NOW (session 072) for Wave 9.10 deliverables.
3. PREHANDOVER proof session-071 updated with real IAA token from this session.
4. New improvement suggestion S-009 added: PREHANDOVER template must require verbatim paste of IAA agent response — making the tool call self-evidencing.

**Open improvement**: S-009 — Require verbatim paste of IAA agent response in PREHANDOVER proof IAA section, making the tool call self-evidencing and structurally impossible to fake. *(See Section 3, item S-009.)*

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
| S-006 | Add CI lint/check: validate that every incident status in FAIL-ONLY-ONCE.md is in the allowed status set — automates the invalid-status HARD STOP rule currently enforced manually at preflight | maturion-isms#498 | OPEN |
| S-007 | Add CI POLC boundary gate that fails PR when foreman-v2 is listed as author of production code file changes (outside designated governance evidence paths) — machine-level enforcement of A-001, preventing repeat of GOV-BREACH-AIMC-W5-001 | GOV-BREACH-AIMC-W5-001 | OPEN |
| S-008 | Add CI check that fails PR when no `.agent-workspace/foreman-v2/memory/session-*.md` file exists with a timestamp matching the PR creation date — machine-level enforcement that Phase 1 PREFLIGHT was executed (session memory is only written in Phase 4, which requires Phase 1 completion), preventing repeat of GOV-BREACH-AIMC-W5-002 | GOV-BREACH-AIMC-W5-002 | OPEN |
| S-009 | Require verbatim paste of IAA agent's actual response text in the PREHANDOVER proof IAA section — making the `task` tool call self-evidencing and structurally impossible to fake. Template must include a `## IAA Agent Response (verbatim)` section where the raw IAA agent output is pasted. A PREHANDOVER proof with a blank or placeholder IAA response section is a HANDOVER BLOCKER. | INC-IAA-SKIP-001 (2026-02-28) | OPEN |
| S-010 | Correct GRS-010 requirement text in PersonaLoader.test.ts header comment — line 10 references packages/ai-centre/agents/ but actual PersonaLoader path is packages/ai-centre/src/agents/. Also correct inline comment on line 30. Prevents path confusion in CL-2 through CL-4 persona migration issues. | session-078 / IAA-session-027-20260301 | REMEDIATED |
| S-011 | Canonical FAIL-ONLY-ONCE registry in maturion-foreman-governance has duplicate rule IDs: A-004 appears twice (Bootstrap Directive rule + Post-Merge Retrospective rule) and A-016 appears twice (Trigger Table Misapplication + Cross-PR Token Reuse). Renumber later-added rules to sequential IDs (A-018, A-019, etc.) to prevent ambiguous rule citations in sessions. CodexAdvisor-agent to execute in a governance maintenance PR to maturion-foreman-governance. | IAA-session-027-20260301 | OPEN |

---

## Section 4: Attestation Protocol

When completing PREFLIGHT §1.3, record the following block in the **session memory preamble**:

```
fail_only_once_attested: true
fail_only_once_version: 1.9.0
unresolved_breaches: [list incident IDs with OPEN or IN_PROGRESS status, or 'none']
open_improvements_reviewed: [S-001, S-002, S-003, S-004, S-005, S-006, S-007, S-008, S-009, S-010, S-011]
```

**STOP-AND-FIX trigger**: If `unresolved_breaches` is not `'none'` (i.e. any incident has status `OPEN` or `IN_PROGRESS`) → halt immediately. Do not proceed with any wave work until all listed breaches reach `REMEDIATED` or `ACCEPTED_RISK (CS2)` status.

**Proceed condition**: All incidents are `REMEDIATED` or `ACCEPTED_RISK (CS2)` → attestation complete, session may proceed.

---

*Authority: CS2 (Johan Ras) | Governance Ref: maturion-foreman-governance#1195, maturion-isms#496, maturion-isms#523 | LIVING_AGENT_SYSTEM.md v6.2.0*  
*Last Updated: 2026-03-01 | Version: 1.9.0 | Status: ACTIVE*
