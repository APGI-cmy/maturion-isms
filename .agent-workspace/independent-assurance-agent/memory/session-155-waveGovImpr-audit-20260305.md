# IAA Session Memory — session-155 | Wave GovImpr Audit | 2026-03-05

## Session Header

| Field | Value |
|-------|-------|
| `session_id` | session-155 |
| `date` | 2026-03-05 |
| `agent` | independent-assurance-agent v6.2.0 (contract v2.2.0) |
| `pr_reviewed` | branch `copilot/update-iaa-governance-templates` — Wave GovImpr (IAA Governance & Template Improvements) |
| `invoking_agent` | foreman-v2-agent session-155 |
| `producing_agent` | governance-liaison-isms-agent (TASK-GI-001/002/003), qa-builder (TASK-GI-004), integration-builder (TASK-GI-005) |
| `producing_agent_class` | liaison + builder |
| `pr_category` | MIXED — KNOWLEDGE_GOVERNANCE + CI_WORKFLOW |
| `checks_executed` | 34 total: 3 FAIL-ONLY-ONCE + 22 CORE + 7 KG overlay + 5 CI overlay + merge gate parity |
| `checks_passed` | 21 |
| `checks_failed` | 6 (CORE-018, CORE-015, CORE-020, CORE-007, OVL-KG-ADM-001, OVL-CI-005) |
| `merge_gate_parity_result` | FAIL — validate-scope-to-diff.sh: Changed 3, Declared 13, Extra 10 |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | IAA-session-155-waveGovImpr-20260305-REJECT |
| `token_file` | `.agent-admin/assurance/iaa-token-session-155-waveGovImpr-20260305.md` |
| `failures_cited` | CORE-018+A-021 (uncommitted deliverables), CORE-015 (session memory missing), CORE-020 (cascade), CORE-007 (STUB in index.md), OVL-KG-ADM-001 (cascade), OVL-CI-005 (no CI evidence) |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `invocation_type` | FIRST INVOCATION for session-155 / Wave GovImpr on this branch |
| `prior_iaa_sessions_for_this_pr` | session-154 (Pre-Brief only — Phase 0, no verdict) |

---

## Prior Sessions Reviewed (Phase 1 Step 1.5)

| Session | Wave / Context | Verdict |
|---------|---------------|---------|
| session-154 | Pre-Brief — Wave GovImpr | PRE-BRIEF ISSUED (no audit verdict) |
| session-153 | Wave 14 Final (re-invocation) | ASSURANCE-TOKEN |
| session-149 | session-050 OVL-KG (first invocation) | REJECTION-PACKAGE |
| session-148 | IAA Audit Standard (2nd invocation) | ASSURANCE-TOKEN |
| session-147 | IAA Audit Standard (1st invocation) | REJECTION-PACKAGE |

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 | YES — checked for IAA invocation evidence | PASS — first invocation exception; evidence created this session |
| A-002 | YES — no class exemption claim | PASS |
| A-021 | YES — checked commit state before invocation (recurring pattern) | FAIL — all 10 deliverables uncommitted |
| A-026 | YES — SCOPE_DECLARATION vs committed diff | FAIL — 3 committed, 13 declared, 10 extra |
| A-029 | YES — PREHANDOVER proof iaa_audit_token pre-populated | PASS (format correct; proof uncommitted but token field valid) |
| A-030 | YES — token date accuracy | PASS — 20260305 = today = token issuance date |

---

## Evidence Summary

| Artifact | Committed? | Status |
|----------|-----------|--------|
| PREHANDOVER proof | NO — untracked (`??`) | CORE-018 FAIL |
| Session memory (foreman) | NO — does not exist | CORE-015 FAIL |
| FAIL-ONLY-ONCE.md v2.7.0 | NO — working tree ` M` | Not evaluated (uncommitted) |
| prehandover-template.md v1.5.0 | NO — working tree ` M` | Not evaluated |
| audit-lifecycle.md v1.1.0 | NO — working tree ` M` | Not evaluated |
| mat-specialist index.md v1.0.0 | NO — staged `A ` only | Not evaluated |
| copilot-setup-steps.yml | NO — working tree ` M` | Not evaluated |
| provider-model-ban.yml | NO — working tree ` M` | Not evaluated |
| SCOPE_DECLARATION.md | NO — working tree ` M` | A-026 FAIL |
| README-LIVENESS.md | NO — working tree ` M` | Not evaluated |

Committed diff only (3 files): `iaa-prebrief-waveGovImpr-20260305.md`, `wave-current-tasks.md`, `session-154-prebrief-waveGovImpr-20260305.md` — all Pre-Brief artifacts from session-154.

---

## Content Quality Advisory (Working Tree Review)

Despite the procedural A-021 failure, the actual content of the deliverables was reviewed from the working tree. Content quality is strong:

| Task | Content Verdict | Notes |
|------|----------------|-------|
| TASK-GI-001 FAIL-ONLY-ONCE v2.7.0 | STRONG ✅ | A-029, A-030, OVL-CI-006 candidate, S-017–S-020, IAA delegation protocol, Section 4 attestation all correctly implemented |
| TASK-GI-002 prehandover-template v1.5.0 | STRONG ✅ | SCOPE_DECLARATION ceremony + `cat /dev/null` instruction + A-030 comment correct |
| TASK-GI-003 audit-lifecycle.md v1.1.0 | STRONG ✅ | A-030 section clear, actionable, versioned correctly |
| TASK-GI-003 mat-specialist index.md | NEEDS FIX ❌ | "STUB" placeholder text in 4 Status rows (CORE-007) |
| TASK-GI-004 README-LIVENESS.md | STRONG ✅ | ⚠️ WARNING block with BASE_URL and LIVENESS_TEST_PASSWORD risks clear and actionable |
| TASK-GI-005 workflow permissions | STRONG ✅ | Both files have `permissions: contents: read` at workflow level (correct placement) |

---

## FAIL-ONLY-ONCE Updates

No new FAIL-ONLY-ONCE entries required this session. A-021 is well-established (rules A-021, A-027 already active). The STUB language finding (CORE-007) is addressed by the existing CORE-007 check — no new rule needed.

---

## Learning Notes

1. **A-021 continues as the most recurring failure mode** — sessions 147, 149, and now 155 all failed on uncommitted artifacts. The pattern is clear: agents complete the work and invoke IAA before committing. The fix path is well-established: commit first, then invoke. The content is typically correct; the failure is procedural.

2. **Session memory pre-existence claim is a new failure pattern**: This session reveals a new variant — the PREHANDOVER proof claimed session memory "✅ Created" when the file did not exist. This is a documentation accuracy failure distinct from A-021. Future sessions: do not mark a file as created in the PREHANDOVER bundle table until the file actually exists on disk.

3. **index.md STUB language**: When creating knowledge index files, avoid the word "STUB" in status columns even when describing partially-complete files. The word "STUB" is on CORE-007's prohibited list. Use "ACTIVE — partial content" or "PLANNED — not yet created" instead.

4. **OVL-CI-005 requires actual CI run URL**: Workflow changes require a GitHub Actions run URL, not just local YAML validation. This is only possible after committing and pushing — another reason A-021 compliance (commit before IAA invocation) is critical.

---

## Suggestions for Improvement (MANDATORY)

**S-IAA-155-01**: The recurring A-021 pattern (sessions 147, 149, 155) suggests a structural workflow gap. The Foreman should add a pre-invocation git status check as a mandatory gate in their session workflow: before calling IAA, run `git diff --name-only origin/main...HEAD` and verify it matches SCOPE_DECLARATION. If it doesn't match, STOP and commit before invoking. This check costs 10 seconds and would prevent 100% of A-021 failures.

**S-IAA-155-02**: The claim "✅ Created" in the PREHANDOVER bundle table for a file that doesn't exist is a documentation accuracy gap. Consider adding a pre-invocation verification step: for each "✅ Created" or "✅ Updated" entry in the bundle table, run `ls -la <path>` to confirm the file exists before writing the PREHANDOVER proof.

---

## Parking Station Update

Appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`

| Date | Agent | Session | Phase | Summary | Session File |
|------|-------|---------|-------|---------|--------------|
| 2026-03-05 | independent-assurance-agent | session-155 | Phase 3/4 | Pre-invocation git-status gate would eliminate 100% of A-021 failures — add to Foreman workflow | session-155-waveGovImpr-audit-20260305.md |
| 2026-03-05 | independent-assurance-agent | session-155 | Phase 3 | Bundle table "✅ Created" claims must be verified with ls before writing PREHANDOVER proof | session-155-waveGovImpr-audit-20260305.md |

---

*Authority: CS2 (Johan Ras) | independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING*
