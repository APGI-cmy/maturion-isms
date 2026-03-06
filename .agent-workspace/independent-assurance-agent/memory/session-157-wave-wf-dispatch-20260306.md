# IAA Session Memory — session-157 | Wave WF-Dispatch | 2026-03-06

## Session Header

| Field | Value |
|-------|-------|
| `session_id` | session-157-wave-wf-dispatch-20260306 |
| `date` | 2026-03-06 |
| `agent` | independent-assurance-agent v6.2.0 (contract v2.2.0) |
| `pr_reviewed` | PR #959 — branch `copilot/fix-workflow-trigger-conditions` — Wave WF-Dispatch (Workflow Manual Dispatch Fix) |
| `invoking_agent` | foreman-v2-agent (session-157) |
| `producing_agent` | general-purpose Copilot agent (implementation) + foreman-v2-agent (governance ceremony) |
| `producing_agent_class` | foreman + external (POLC breach INC-WFD-POLC-001 on record) |
| `pr_category` | CI_WORKFLOW |
| `checks_executed` | 21 (5 FAIL-ONLY-ONCE + 10 CORE applicable + 5 CI_WORKFLOW overlay + 1 BL-027 parity) |
| `checks_passed` | 20 |
| `checks_failed` | 1 (BL-027 SCOPE_DECLARATION mismatch) |
| `merge_gate_parity_result` | FAIL — validate-scope-to-diff.sh exit code 1 |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | IAA-session-157-wave-wf-dispatch-20260306-REJECT |
| `token_file` | `.agent-admin/assurance/iaa-token-session-157-wave-wf-dispatch-20260306.md` |
| `failures_cited` | FINDING-WFD-001: BL-027/A-026 validate-scope-to-diff.sh FAIL — script parsing issue + 2 genuine missing files |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `invocation_type` | FIRST INVOCATION for session-157 / Wave WF-Dispatch |
| `prior_iaa_sessions_for_this_pr` | session-157-prebrief-wave-wf-dispatch-20260306 (Phase 0 Pre-Brief only — no verdict) |

---

## Prior Sessions Reviewed (Phase 1 Step 1.5)

| Session | Wave / Context | Verdict |
|---------|---------------|---------|
| session-155-waveGovImpr-audit-20260305 | Wave GovImpr — KNOWLEDGE_GOVERNANCE + CI_WORKFLOW | REJECTION-PACKAGE (6 findings — different branch) |
| session-153-wave14-final-20260305 | Wave 14 Final Governance Closure (re-invocation) | ASSURANCE-TOKEN |
| session-152-wave14-final-20260305 | Wave 14 Final Governance Closure (first invocation) | REJECTION-PACKAGE (3 findings) |
| session-151-wave14-ibwr-v2-20260305 | Wave 14 IBWR (re-invocation) | ASSURANCE-TOKEN |
| session-151-20260305 | Wave GovImpr: OVL-AC-ADM overlay | ASSURANCE-TOKEN |

Open REJECTION-PACKAGEs from prior sessions: None applicable to this PR.

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 | IAA invocation evidence present | `iaa_audit_token: IAA-session-157-wave-wf-dispatch-20260306-PASS` in PREHANDOVER proof — PASS |
| A-002 | No class exceptions — CI_WORKFLOW, not AGENT_CONTRACT | CONFIRMED |
| A-021 | Commit before invocation | 480c871b committed before IAA invocation — PASS |
| A-026 | SCOPE_DECLARATION must match diff exactly | FAIL — validate-scope-to-diff.sh exit code 1 (FINDING-WFD-001) |
| A-029 | PREHANDOVER immutability §4.3b | Expected reference format confirmed; IAA writes dedicated token file |

---

## FINDING-WFD-001 Detail

**Category**: BL-027 / A-026 — validate-scope-to-diff.sh fails

**Root causes (3):**

1. **Script parsing incompatibility**: SCOPE_DECLARATION entry for `.github/workflows/deploy-mat-ai-gateway.yml` contains multiple backtick-quoted strings in description. Script's sed command extracts LAST backtick-quoted string: `|| github.event_name == 'workflow_dispatch'` is treated as file path instead of `.github/workflows/deploy-mat-ai-gateway.yml`.

2. **Missing file**: `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` in diff, not declared.

3. **Wrong IAA session filename**: SCOPE_DECLARATION has `session-157-wave-wf-dispatch-20260306.md` (final, not yet committed) but diff has `session-157-prebrief-wave-wf-dispatch-20260306.md` (pre-brief, already committed). Pre-brief file is undeclared.

**Fix**: 
- Simplify workflow file line format in SCOPE_DECLARATION (no inline backtick-quoted strings in description)
- Add `.agent-workspace/foreman-v2/parking-station/suggestions-log.md`
- Add `.agent-workspace/independent-assurance-agent/memory/session-157-prebrief-wave-wf-dispatch-20260306.md`
- Final SCOPE_DECLARATION should declare 11 files (9 currently in diff + 2 IAA will commit)
- Verify exit code 0 before re-invoking IAA

---

## Substantive Quality Verified (All PASS)

All 5 CI_WORKFLOW overlay checks passed:

| Check | Result |
|-------|--------|
| OVL-CI-001: Logic correctness (lines 146, 209 match spec; line 57 unchanged; exact 2-line diff) | PASS |
| OVL-CI-002: Merge gate integrity (needs chain lint→test→deploy-production→cwt intact) | PASS |
| OVL-CI-003: Silent failure risk (no continue-on-error; explicit exit 1) | PASS |
| OVL-CI-004: Environment parity (workflow_dispatch requires test gate; no staging bypass) | PASS |
| OVL-CI-005: CI evidence (YAML valid; logic verified; governance gate architectural constraint noted) | PASS |

**The change is correct and approvable — only the SCOPE_DECLARATION procedural issue blocks the token.**

---

## OVL-CI-005 Architectural Constraint Note

The governance gate architecture prevented CI from running before IAA token issuance (Deploy MAT AI Gateway run 22761109709 — `action_required`, 0 jobs executed). IAA passed OVL-CI-005 on substantive grounds under the 90/10 orientation mandate: YAML validation PASS + logic verification constitutes sufficient evidence for a 2-line YAML condition change where affected jobs are unconditional and logic only adds a trigger condition.

**Process gap escalated to CS2**: Pre-Brief protocol should formalize a carve-out for governance-gate-blocked CI in YAML-only change scenarios.

---

## Re-Invocation Guidance

Per A-030: This REJECTION-PACKAGE token file (committed) serves as the correction addendum evidence for the re-invocation. The PREHANDOVER proof is immutable (A-029). Foreman commits a correction commit with fixed SCOPE_DECLARATION. Re-invocation proceeds under A-030 carve-out.

Re-invocation checklist for Foreman:
- [ ] Fix SCOPE_DECLARATION.md (simplify workflow line, add 2 missing files, final count = 11)
- [ ] Verify validate-scope-to-diff.sh exits with code 0 locally
- [ ] Commit corrected SCOPE_DECLARATION (A-021 compliance)
- [ ] Re-invoke IAA for second invocation

---

## Suggestions for Improvement

1. **OVL-CI-005 governance-gate carve-out**: When the governance protection gate blocks all CI execution (resulting in `action_required` with 0 jobs), the pre-brief protocol should explicitly instruct Foreman to use YAML validation + logic verification as the OVL-CI-005 evidence substitute for YAML-only changes. This eliminates a recurring ambiguity. Candidate FAIL-ONLY-ONCE rule: A-031 — governance-gate CI block carve-out.

2. **SCOPE_DECLARATION parser compatibility**: Foreman PREHANDOVER template should warn against using multiple backtick-quoted strings in a single SCOPE_DECLARATION list line description. Each file entry should use format: `` - `path/to/file.ext` `` followed by a plain-text description (no additional backtick quoting). This prevents the sed parser from extracting wrong paths.

3. **Parking station auto-declaration reminder**: Foreman ceremony template should explicitly list `parking-station/suggestions-log.md` as a file that MUST be added to SCOPE_DECLARATION when it is updated (which it typically is in every ceremony).

---

## Parking Station

Appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`.

---

## Fail-Only-Once Updates

No new FAIL-ONLY-ONCE rules added this session. The OVL-CI-005 governance-gate carve-out pattern is a candidate for a new rule but requires CS2 review before codification.

---

*Authority: CS2 (@APGI-cmy) | independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING*
