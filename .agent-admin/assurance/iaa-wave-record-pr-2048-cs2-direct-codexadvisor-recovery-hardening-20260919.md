# IAA Wave Record — PR #2048 CS2-Direct CodexAdvisor Recovery Hardening

IAA_PREFLIGHT_BRIEF
PR: #2048
ISSUE: #2047
WAVE: pr-2048-cs2-direct-codexadvisor-recovery-hardening-20260919
WAVE_TASKS_PATH: .agent-admin/prs/pr-2048/wave-current-tasks.md
CURRENT_HEAD_SHA: CURRENT_HEAD
STABLE_SUBMITTED_HEAD_SHA: 7e365fb5d8572e18f728fc43a23e60ba5f341e5d
QUALIFYING_TASKS:
- GOV-2048-01 — Rebind IAA/Foreman/ECAP assurance to PR #2048 and the submitted head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`, replacing inherited retrospective context with PR-scoped evidence only.
APPLICABLE_OVERLAY: AGENT_CONTRACT
ANTI_REGRESSION_OBLIGATIONS: no — `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` reviewed; this is governance/agent-contract recovery-hardening only, with no product/runtime/deployment/schema/CI deliverable in scope.
EXPECTED_QA_SCOPE:
- Qualify only GOV-2048-01 for PR #2048 on the submitted head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`.
- Keep active evidence bound to `.agent-admin/prs/pr-2048/wave-current-tasks.md`; no product/runtime/deployment/schema/CI scope is included in this pre-brief.
- Treat `.agent-admin/assurance/iaa-wave-record-issue-2016-retrospective-pr2006-20260813.md` as NON-ACTIVE / UNUSABLE for PR #2048 because it binds to PR `#2017` and a different wave-tasks path.
EXPECTED_FAILURE_MODES:
- Historical PR `#2017` / `issue-2016-retrospective-pr2006` evidence is reused as active proof for PR #2048.
- Scope expands beyond GOV-2048-01 into product/runtime/deployment/schema/CI or into unauthorized new CodexAdvisor contract edits.
- Any final PASS / REJECTION token is claimed from this pre-brief-only invocation.
FOREMAN_INSTRUCTIONS:
- Keep PR #2048 bound to GOV-2048-01, `WAVE_TASKS_PATH: .agent-admin/prs/pr-2048/wave-current-tasks.md`, and the submitted head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`.
- Do not use the historical retrospective wave record as active evidence for PR #2048.
- Do not treat this invocation as final assurance; independent final IAA assurance remains a separate later step.
IAA_WILL_QA:
- QA the PR-bound governance evidence binding, qualifying-task identity, and submitted-head relevance for PR #2048 only.
- QA that the historical retrospective artifact remains explicitly NON-ACTIVE / UNUSABLE for PR #2048.
- QA that no product/runtime/deployment/schema/CI scope is imported into this pre-brief.
RESULT: PREFLIGHT_BRIEF_COMPLETE

Wave: `pr-2048-cs2-direct-codexadvisor-recovery-hardening-20260919`
Date: 2026-09-19
Repository: `APGI-cmy/maturion-isms`
PR: #2048
Issue: #2047
Branch: `cs2/codex-advisor-recovery-hardening`
Base SHA: `1603f0ca201754e152f79a13d8e0a62fc4e51755`
Current Submitted Head SHA: `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`
Wave Tasks Path: `.agent-admin/prs/pr-2048/wave-current-tasks.md`
Status: `PRE-BRIEF ONLY — NO FINAL IAA TOKEN OR REJECTION ISSUED IN THIS INVOCATION`

## PRE-BRIEF

Qualifying tasks:
- `GOV-2048-01` — Rebind IAA/Foreman/ECAP assurance to PR #2048 and the submitted head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`, replacing inherited retrospective context with PR-scoped evidence only.

Applicable overlay: `AGENT_CONTRACT`

Anti-regression obligations: no — `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` reviewed; this PR-scoped task is governance/agent-contract recovery-hardening only, with no product/runtime/deployment/schema/CI deliverable in scope.

## BINDING

- Bound task record: `.agent-admin/prs/pr-2048/wave-current-tasks.md`
- Bound repository: `APGI-cmy/maturion-isms`
- Bound PR / Issue: `#2048` / `#2047`
- Bound branch: `cs2/codex-advisor-recovery-hardening`
- Bound runtime review head marker: `CURRENT_HEAD`
- Bound stable submitted head: `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`
- Bound base SHA: `1603f0ca201754e152f79a13d8e0a62fc4e51755`
- Scope discipline: only the recovery-hardening task above qualifies; no product/runtime/deployment/schema/CI changes are in scope; no new CodexAdvisor contract edits are authorised unless a later evidenced correction requires them.
- Ceremony-admin appointment: not declared in `.agent-admin/prs/pr-2048/wave-current-tasks.md` at pre-brief time.

## ACTIVE-EVIDENCE BOUNDARY

- Historical wave record `.agent-admin/assurance/iaa-wave-record-issue-2016-retrospective-pr2006-20260813.md` is explicitly **NON-ACTIVE / UNUSABLE** for PR #2048.
- Reason: that historical record is bound to PR `#2017`, branch `apgi-cmy-issue-2016-retrospective-governance-pr-2`, and wave-tasks path `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`; it is not bound to PR `#2048` or to the PR-scoped task record required here.
- Therefore no inherited retrospective context from that artifact may be relied on as active evidence, active assurance, or active head binding for PR #2048.
- Active evidence for PR #2048 must remain PR-scoped and anchored to `.agent-admin/prs/pr-2048/wave-current-tasks.md`, the stable submitted head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`, and the symbolic runtime current-head marker `CURRENT_HEAD` (accepted to avoid stale exact-SHA self-rebinding loops).

## PRE-BRIEF RECORD

- Phase 1 preflight completed for this invocation: contract YAML parseable; Tier 2 required files present; `governance/CANON_INVENTORY.json` contained no null/empty/zeroed `file_hash_sha256` values and included `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`; FAIL-ONLY-ONCE loaded with no open IAA breach blocking pre-brief execution.
- Trigger basis for this pre-brief: submitted-head diff includes `.github/agents/CodexAdvisor-agent.md`, therefore `AGENT_CONTRACT` is the controlling trigger category for current gate expectations.
- This artifact is the sole canonical IAA pre-brief record for PR #2048 in this invocation.

## FINAL ASSURANCE — 2026-09-19

Invocation: PR `#2048 / fix(codex-advisor): restore config and recovery controls` | Invoked by: `CS2-direct final assurance request` | Produced by: `CodexAdvisor-agent`, `foreman-v2-agent`, `execution-ceremony-admin-agent` | Class: `AGENT_CONTRACT` | Ceremony-admin: `YES` | STOP-AND-FIX: `ACTIVE`

Independence: `CONFIRMED`

Category: `AGENT_CONTRACT` | IAA triggered: `YES` | Ambiguity: `CLEAR`

Checklist loaded: `CORE-020`, `CORE-021`, `AGENT_CONTRACT overlay`, `IAA_AGENT_CONTRACT_AUDIT_STANDARD.md`

Evidence heads:
- Reviewed pre-assurance branch head: `94bf6f3d20189a115a2374275408e7ea72175512`
- Stable substantive submitted head: `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`
- External PR/admin attestation head referenced by ECAP bundle and hosted checks: `131ec666122f1bc0cde3953b851f7e88787f2b26`
- Symbolic runtime-head marker retained for convergence discipline: `CURRENT_HEAD`

FAIL-ONLY-ONCE:
- `A-001`: `PRESENT` — IAA invocation evidence exists in this wave record.
- `A-002`: `CONFIRMED` — no class exemption accepted; AGENT_CONTRACT remained mandatory.

Check results:
- `CORE-020`: FAIL ❌ — missing mandatory PR `#2048` PREHANDOVER proof, missing producer session memory, and incomplete ceremony evidence leave required checks unverifiable.
- `CORE-021`: PASS ✅ — zero-severity-tolerance enforced; no finding was softened.
- `OVL-AC-001` Strategy alignment: PASS ✅ — the CodexAdvisor repair stays inside the authorised CS2-direct recovery-hardening scope.
- `OVL-AC-002` No contradictions: FAIL ❌ — `.agent-workspace/CodexAdvisor-agent/knowledge/index.md` declares `**Knowledge Version**: 1.6.0` while the `index.md` table row still reports `1.5.0`; `.agent-admin/prs/pr-2048/wave-current-tasks.md` still shows `ECAP-2048` as `PENDING` while `.agent-admin/prs/pr-2048/ecap-admin-bundle-20260919.md` concludes `ADMIN_VALIDATED`.
- `OVL-AC-003` Authority boundaries correct: PASS ✅ — `SELF-MOD-001`, CS2-direct routing, and independent IAA requirements remain explicit.
- `OVL-AC-004` Delegation safety: PASS ✅ — no builder/product/deployment expansion was introduced.
- `OVL-AC-005` Four-phase structure present: PASS ✅ — the CodexAdvisor Tier 1 retains substantive four-phase structure.
- `OVL-AC-006` Self-modification prohibition present: PASS ✅ — the constitutional self-modification prohibition remains intact.
- `OVL-AC-007` Ripple / cross-agent impact: PASS ✅ — the CodexAdvisor Tier 2 and PR-scoped governance artifacts were updated together.
- `OVL-AC-ADM-001` PREHANDOVER proof exists: FAIL ❌ — no committed PR `#2048` PREHANDOVER proof was present anywhere on branch.
- `OVL-AC-ADM-002` Session memory exists: FAIL ❌ — no committed producer session memory for PR `#2048` was present anywhere on branch.
- `OVL-AC-ADM-003` Tier 2 stub present: PASS ✅ — `.agent-workspace/CodexAdvisor-agent/knowledge/index.md` exists.
- `OVL-AC-ADM-004` Character count within limit: PASS ✅ — `.github/agents/CodexAdvisor-agent.md` is `17,553` characters and `metadata.change_summary` is `78` characters.
- `ACR-01` ECAP reconciliation summary present: FAIL ❌ — ceremony-admin is appointed, but `.agent-admin/prs/pr-2048/ecap-admin-bundle-20260919.md` contains no populated `ECAP_RECONCILIATION_SUMMARY` / `C1–C6` reconciliation structure.
- `ACR-09` Gate set identified: FAIL ❌ — the active PR `#2048` admin bundle names no explicit `gate_set_checked` field or equivalent exact gate list.
- `ACR-15` Active bundle / tracker coherence: FAIL ❌ — `.agent-admin/prs/pr-2048/wave-current-tasks.md` still records `ECAP-2048` as `PENDING` after the ECAP bundle records `ADMIN_VALIDATED`.
- `MERGE-GATE-PARITY / YAML validation`: PASS ✅ — CodexAdvisor contract frontmatter parses cleanly.
- `MERGE-GATE-PARITY / character count`: PASS ✅ — contract remains below the 30,000-character hard limit.
- `MERGE-GATE-PARITY / canon hash verification`: PASS ✅ — `governance/CANON_INVENTORY.json` contained no null/empty/zeroed `file_hash_sha256` values and included `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`.
- `MERGE-GATE-PARITY / checklist compliance`: FAIL ❌ — missing PREHANDOVER proof, missing producer session memory, and unresolved ceremony-admin bundle gaps prevent parity clearance.

Total: `21` checks, `13` PASS, `8` FAIL

Adoption phase: `PHASE_B_BLOCKING` — blocking

MERGE GATE PARITY:
- `YAML validation`: PASS ✅
- `Character count`: PASS ✅
- `Canon hash verification`: PASS ✅
- `Checklist compliance`: FAIL ❌
- Result: `FAIL`

═══════════════════════════════════════
REJECTION-PACKAGE
PR: `#2048 / fix(codex-advisor): restore config and recovery controls`
`8` check(s) FAILED. Merge blocked. STOP-AND-FIX required.
FAILURES:
  - `OVL-AC-ADM-001 / CORE-020 / MERGE-GATE-PARITY` — No committed PR `#2048` PREHANDOVER proof exists — Fix required: create and commit an immutable PREHANDOVER proof bound to PR `#2048`, stable substantive head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`, and the accepted symbolic runtime-head model — Classification: `Systemic`
  - `OVL-AC-ADM-002 / CORE-020 / MERGE-GATE-PARITY` — No committed producer session memory exists for PR `#2048` — Fix required: create and commit the producing-agent session memory referenced by the final ceremony bundle before re-invocation — Classification: `Systemic`
  - `ACR-01` — Ceremony-admin was appointed but no populated ECAP reconciliation summary (`C1–C6`) is committed in the active PR `#2048` admin bundle — Fix required: add the canonical ECAP reconciliation summary to the active bundle and recommit — Classification: `Systemic`
  - `ACR-09` — Active ceremony artifacts do not name the exact gate set checked — Fix required: add explicit `gate_set_checked` / equivalent exact gate listing to the active PR `#2048` ceremony artifacts and recommit — Classification: `Systemic`
  - `ACR-15 / OVL-AC-002` — Active artifact state is contradictory: ECAP bundle says `ADMIN_VALIDATED`, while `wave-current-tasks.md` still leaves `ECAP-2048` as `PENDING` — Fix required: normalize the active tracker and bundle statuses so they tell one coherent state before re-invocation — Classification: `Systemic`
  - `OVL-AC-002` — CodexAdvisor Tier 2 index self-version drift remains in the changed bundle (`Knowledge Version: 1.6.0` vs table row `index.md ... 1.5.0`) — Fix required: align the Tier 2 index version references and recommit — Classification: `Substantive`
Prevention action required: harden the PR-scoped pre-IAA ceremony route so final assurance cannot be requested until PREHANDOVER proof, producer session memory, ECAP reconciliation summary, explicit gate-set declaration, and tracker/bundle state parity are all committed.
This PR must not be opened until all failures are resolved and IAA re-invoked.
Adoption phase: `PHASE_B_BLOCKING`
IAA_REJECTION_NOTICE:
- `RCA_REVIEW: REFER_BACK`
- `HANDOVER_ALLOWED: no`
- `RESULT: REJECTED_BACK_TO_PRODUCER`
═══════════════════════════════════════

## REJECTION_HISTORY

- `2026-09-19` — Reviewed branch head `94bf6f3d20189a115a2374275408e7ea72175512`; stable substantive head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`.
  - `OVL-AC-ADM-001 / CORE-020`: PREHANDOVER proof absent. Fix required: commit the immutable PR `#2048` PREHANDOVER proof before re-invocation.
  - `OVL-AC-ADM-002 / CORE-020`: producer session memory absent. Fix required: commit the producing-agent session memory before re-invocation.
  - `ACR-01`: ECAP reconciliation summary absent. Fix required: add canonical reconciliation summary (`C1–C6`) to the active ECAP bundle.
  - `ACR-09`: gate set not identified. Fix required: declare the exact gates checked in the active ceremony artifacts.
  - `ACR-15 / OVL-AC-002`: active tracker contradicts ECAP `ADMIN_VALIDATED` result; CodexAdvisor Tier 2 index version metadata also drifts internally. Fix required: normalize all active artifact states and version references before re-invocation.
