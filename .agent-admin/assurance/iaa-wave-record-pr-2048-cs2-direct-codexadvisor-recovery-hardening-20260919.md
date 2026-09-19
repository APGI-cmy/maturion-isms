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

## FINAL ASSURANCE — RE-INVOCATION 2026-09-19

Invocation: PR `#2048 / fix(codex-advisor): restore config and recovery controls` | Invoked by: `CS2-direct reassessment request` | Produced by: `CodexAdvisor-agent`, `foreman-v2-agent`, `execution-ceremony-admin-agent` | Class: `AGENT_CONTRACT` | Ceremony-admin: `YES` | STOP-AND-FIX: `ACTIVE`

Independence: `CONFIRMED`

Category: `AGENT_CONTRACT` | IAA triggered: `YES` | Ambiguity: `CLEAR`

Checklist loaded: `CORE-020`, `CORE-021`, `AGENT_CONTRACT overlay`, `IAA_AGENT_CONTRACT_AUDIT_STANDARD.md`

Evidence heads:
- Reviewed current branch head: `05c8e019d0c1bdcf7832efdd7ff8c818f271ce02`
- Prior rejection-round head: `94bf6f3d20189a115a2374275408e7ea72175512`
- Stable substantive submitted head: `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`
- Runtime head binding model: `CURRENT_HEAD`

FAIL-ONLY-ONCE:
- `A-001`: `PRESENT` — IAA invocation evidence remains present in this PR-scoped wave record.
- `A-002`: `CONFIRMED` — no class exemption accepted; AGENT_CONTRACT remained mandatory.

Check results:
- `CORE-020`: FAIL ❌ — the committed active-state artifact is not fully verifiable against the committed PR evidence set: `HEAD:.agent-admin/prs/pr-2048/active-state.json` still declares `runtime_head_sha: 5855fc958b6e8497bfaeae2c663f78541b374406` and lists `.agent-admin/prs/pr-unknown/active-state.json` in `changed_files`, while the committed `git diff --name-only 1603f0ca201754e152f79a13d8e0a62fc4e51755...HEAD` contains 14 files and no `pr-unknown` path.
- `CORE-021`: PASS ✅ — zero-severity-tolerance enforced; no finding softened.
- `OVL-AC-001` Strategy alignment: PASS ✅ — the correction set remains limited to PR-scoped assurance repair on the already-reviewed submitted head.
- `OVL-AC-002` No contradictions: FAIL ❌ — prior missing-proof, missing-session-memory, ECAP-summary, gate-set, tracker parity, and CodexAdvisor index-version findings are resolved, but the committed active-state artifact still contradicts the active PR evidence set with a stale runtime-head SHA and a non-PR `pr-unknown` path.
- `OVL-AC-003` Authority boundaries correct: PASS ✅ — CS2-direct protected own-contract routing and IAA independence remain explicit.
- `OVL-AC-004` Delegation safety: PASS ✅ — no builder/product/runtime/deployment/CI scope expansion was introduced.
- `OVL-AC-005` Four-phase structure present: PASS ✅ — the submitted CodexAdvisor Tier 1 remains substantively intact.
- `OVL-AC-006` Self-modification prohibition present: PASS ✅ — self-modification controls remain intact.
- `OVL-AC-007` Ripple / cross-agent impact: PASS ✅ — PR-scoped proof, ECAP, task tracker, and Foreman memory were added together; no untracked downstream contract ripple is evident.
- `OVL-AC-ADM-001` PREHANDOVER proof exists: PASS ✅ — `.agent-admin/prehandover/proof-pr-2048-current-head-20260919.md` is committed on branch.
- `OVL-AC-ADM-002` Session memory exists: PASS ✅ — `.agent-workspace/foreman-v2/memory/session-pr-2048-cs2-direct-codexadvisor-recovery-hardening-20260919.md` is committed on branch.
- `OVL-AC-ADM-003` Tier 2 stub present: PASS ✅ — `.agent-workspace/CodexAdvisor-agent/knowledge/index.md` exists and the internal header/table version drift is corrected to `1.6.0`.
- `OVL-AC-ADM-004` Character count within limit: PASS ✅ — `.github/agents/CodexAdvisor-agent.md` remains below the 30,000-character limit.
- `ACR-01` ECAP reconciliation summary present: PASS ✅ — `.agent-admin/prs/pr-2048/ecap-admin-bundle-20260919.md` now embeds `ECAP_RECONCILIATION_SUMMARY` sections `C1–C6`.
- `ACR-07` Declared count/path parity across ceremony artifacts: FAIL ❌ — the committed active-state artifact still declares a 15-path `changed_files` list including `.agent-admin/prs/pr-unknown/active-state.json`, while the scope declaration, PREHANDOVER proof, wave task tracker, and actual PR diff all bind the set to 14 PR-scoped files only.
- `ACR-08` Stale artifact path reference: FAIL ❌ — `HEAD:.agent-admin/prs/pr-2048/active-state.json` references `.agent-admin/prs/pr-unknown/active-state.json`, which is not committed on branch and is not part of PR `#2048`.
- `ACR-09` Gate set identified: PASS ✅ — the active PR-scoped tracker, ECAP bundle, and PREHANDOVER proof now name the gate inventory explicitly.
- `ACR-15` Active bundle / tracker coherence: PASS ✅ — `ECAP-2048` is now `COMPLETE`, and the active tracker no longer leaves ECAP pending.

Total: `20` checks, `16` PASS, `4` FAIL

Adoption phase: `PHASE_B_BLOCKING` — blocking

MERGE GATE PARITY:
- `YAML validation`: PASS ✅
- `Character count`: PASS ✅
- `Canon hash verification`: PASS ✅
- `Checklist compliance`: FAIL ❌ — the committed active-state artifact remains stale/over-inclusive relative to the PR-scoped evidence set and exact diff.
- Result: `FAIL`

═══════════════════════════════════════
REJECTION-PACKAGE
PR: `#2048 / fix(codex-advisor): restore config and recovery controls`
`4` check(s) FAILED. Merge blocked. STOP-AND-FIX required.
FAILURES:
  - `CORE-020` — Committed PR evidence is not fully verifiable because `.agent-admin/prs/pr-2048/active-state.json` still records a stale exact `runtime_head_sha` and a non-PR `pr-unknown` path — Fix required: recommit the PR-scoped active-state artifact so it matches the actual committed `base...HEAD` diff and the CURRENT_HEAD binding model — Classification: `Ceremony`
  - `OVL-AC-002` — Active PR-scoped evidence still contradicts itself through the committed active-state artifact even though the prior rejection findings were otherwise repaired — Fix required: normalize the committed active-state artifact to the same 14-file PR-scoped evidence set used by the scope declaration, PREHANDOVER proof, ECAP bundle, and wave tracker — Classification: `Ceremony`
  - `ACR-07` — Declared changed-file inventory remains inconsistent across active ceremony artifacts (`15` in committed active-state vs `14` everywhere else / in actual diff) — Fix required: refresh and commit the active-state changed-files inventory from the exact committed diff before re-invocation — Classification: `Systemic`
  - `ACR-08` — Committed active-state still references stale path `.agent-admin/prs/pr-unknown/active-state.json` not present on branch — Fix required: remove the stale `pr-unknown` reference from the committed active-state artifact and re-run final assurance on the committed result — Classification: `Systemic`
Prevention action required: harden the producer-side active-state refresh path so local validation-side working-tree rewrites are not mistaken for committed PR evidence.
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
- `2026-09-19` — Re-invocation reviewed current branch head `05c8e019d0c1bdcf7832efdd7ff8c818f271ce02`; stable substantive head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`.
  - `CORE-020 / OVL-AC-002`: committed `.agent-admin/prs/pr-2048/active-state.json` remains stale versus the committed PR evidence set. Fix required: recommit the active-state artifact with CURRENT_HEAD binding coherence and the exact committed diff inventory only.
  - `ACR-07`: active-state changed-files inventory still mismatches the actual diff and other active ceremony artifacts (`15` vs `14`). Fix required: regenerate and commit the exact PR-scoped inventory before re-invocation.
  - `ACR-08`: committed active-state references stale path `.agent-admin/prs/pr-unknown/active-state.json` not present on branch. Fix required: remove the stale reference and re-run final assurance on the committed result.

## FINAL ASSURANCE — FINAL REASSESSMENT 2026-09-19

Invocation: PR `#2048 / fix(codex-advisor): restore config and recovery controls` | Invoked by: `CS2-direct final reassessment request` | Produced by: `CodexAdvisor-agent`, `foreman-v2-agent`, `execution-ceremony-admin-agent` | Class: `AGENT_CONTRACT` | Ceremony-admin: `YES` | STOP-AND-FIX: `ACTIVE`

Independence: `CONFIRMED`

Category: `AGENT_CONTRACT` | IAA triggered: `YES` | Ambiguity: `CLEAR`

`IAA_AGENT_CONTRACT_AUDIT_STANDARD.md` v1.0.0 loaded. Applying pre-approval doctrine and protected-component verification to this AGENT_CONTRACT invocation.

Checklist loaded: `CORE-020`, `CORE-021`, `CORE-026`, `CORE-027`, `AGENT_CONTRACT overlay`, `IAA_AGENT_CONTRACT_AUDIT_STANDARD.md`

Evidence heads:
- Reviewed committed current branch head: `d4f73332c62bed57b92bcc006cb01b8485cd85a8`
- Stable substantive submitted head: `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`
- Base SHA: `1603f0ca201754e152f79a13d8e0a62fc4e51755`
- Runtime head binding model: `CURRENT_HEAD`
- Exact committed `base...HEAD` diff: `15` paths, all matched by `.agent-admin/scope-declarations/pr-2048.md`

FAIL-ONLY-ONCE:
- `A-001`: `PRESENT` — IAA invocation evidence is present in this PR-scoped wave record and in the PR-scoped proof/task bundle.
- `A-002`: `CONFIRMED` — no class exemption was accepted; `.github/agents/CodexAdvisor-agent.md` keeps this PR in `AGENT_CONTRACT`.

Acceptance-Criteria Evidence Matrix (`CORE-026`):

| Acceptance criterion | Hard evidence | Verdict |
|---|---|---|
| PR-bound task record exists at `.agent-admin/prs/pr-2048/wave-current-tasks.md` | `.agent-admin/prs/pr-2048/wave-current-tasks.md` declares PR `#2048`, issue `#2047`, branch `cs2/codex-advisor-recovery-hardening`, stable submitted head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`, and canonical artifact paths | PASS ✅ |
| Active assurance artifact path resolves to PR `#2048` evidence, not historical fallback | `.agent-admin/prs/pr-2048/active-state.json` points only to PR `#2048` artifacts; `.agent-admin/prs/pr-2048/ecap-admin-bundle-20260919.md` and `.agent-admin/prehandover/proof-pr-2048-current-head-20260919.md` both mark the old PR `#2017` retrospective record as NON-ACTIVE / UNUSABLE for this PR | PASS ✅ |
| Foreman QP confirms the submitted head changes only the authorised CodexAdvisor contract and local knowledge/escalation files | `.agent-admin/prs/pr-2048/wave-current-tasks.md` `qp_verdict` records `full_diff_reviewed: true`, `out_of_scope_changes_detected: false`, and the authorised file set; current `git diff --name-only 1603f0ca201754e152f79a13d8e0a62fc4e51755...d4f73332c62bed57b92bcc006cb01b8485cd85a8` remains within that declared scope plus PR-scoped assurance artifacts | PASS ✅ |
| ECAP validates administrative binding only and does not substitute for readiness authority | `.agent-admin/prs/pr-2048/ecap-admin-bundle-20260919.md` states `Administrative scope only`, `No IAA invocation performed`, `No readiness claim made`, and concludes `ADMIN_VALIDATED`; `.agent-admin/prehandover/proof-pr-2048-current-head-20260919.md` states `HANDOVER_ALLOWED: no` and `RESULT: ADMIN_POINTER_ONLY` | PASS ✅ |
| Independent IAA final assurance reviews the same stable head referenced by the task record | This reassessment used stable head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`, current committed head `d4f73332c62bed57b92bcc006cb01b8485cd85a8`, and confirmed the post-submission delta is limited to PR-scoped governance/assurance repairs plus the bounded CodexAdvisor knowledge-index correction already cited in prior rejection handling | PASS ✅ |

Independent Risk Challenge (`CORE-027`):
1. **What could still fail after merge?** Future own-contract recovery work could reintroduce self-referential current-HEAD evidence loops, blur CS2-direct authority boundaries, or broaden the repair beyond CodexAdvisor governance scope.
2. **What evidence would prove it does not fail?** The contract and Tier 2 bundle must keep `SELF-MOD-001`, `CS2_DIRECT_ONLY`, `FRESH_CONTEXT_ONLY`, the continuous-improvement ladder, and the stable-reviewed-head / independent-attestation rule; the PR-scoped assurance bundle must keep exact diff parity and PR-only routing.
3. **Is that evidence present?** Yes. The CodexAdvisor contract, Tier 2 knowledge files, Tier 3 CS2-direct record, PR-scoped scope declaration, ECAP bundle, and proof pointer all show those controls; the identity-binding, governance-evidence-exactness, and scope-to-diff gates pass on the committed head.
4. **Is there any contradiction between issue intent, architecture requirements, and PR evidence?** No unresolved contradiction remains. The issue’s sequencing correction narrows PR `#2048` to the CodexAdvisor self-repair lane, and the current diff stays within that lane without product/runtime/deployment expansion.
5. **Would a reasonable production owner accept this as merge-ready?** Yes for this bounded governance repair. Independent assurance, admin boundary evidence, scope parity, and contract/Tier 2 protections are all present and no blocker remains inside the reviewed PR scope.

Check results:
- `CORE-020`: PASS ✅ — required evidence is committed, PR-scoped, and independently verifiable on the committed head.
- `CORE-021`: PASS ✅ — zero-severity-tolerance preserved; no finding was softened or waived.
- `CORE-026`: PASS ✅ — the acceptance-criteria evidence matrix above maps every active PR `#2048` requirement to hard evidence.
- `CORE-027`: PASS ✅ — the independent risk challenge is complete and affirmative.
- `OVL-AC-001` Strategy alignment: PASS ✅ — the diff implements the declared CS2-direct CodexAdvisor recovery-hardening scope only.
- `OVL-AC-002` No contradictions: PASS ✅ — the stale `pr-unknown` reference is gone, the changed-file inventory is coherent at `15`, the CodexAdvisor knowledge index is internally aligned at `1.6.0`, and the current authoritative binding model is consistently `CURRENT_HEAD` plus stable submitted head.
- `OVL-AC-003` Authority boundaries correct: PASS ✅ — `SELF-MOD-001`, `CS2_DIRECT_ONLY`, and independent IAA handover remain explicit and unweakened.
- `OVL-AC-004` Delegation safety: PASS ✅ — the new continuous-improvement route requires self-remediate/delegate/prove-escalation ordering and does not permit builder/product/deployment overreach.
- `OVL-AC-005` Four-phase structure present: PASS ✅ — the CodexAdvisor Tier 1 remains a substantive four-phase canonical contract.
- `OVL-AC-006` Self-modification prohibition present: PASS ✅ — the contract still states `I never create, modify, commit, approve, or self-assure .github/agents/CodexAdvisor-agent.md.`
- `OVL-AC-007` Ripple / cross-agent impact: PASS ✅ — the Tier 1 contract, Tier 2 index, new Tier 2 continuous-improvement protocol, FAIL-ONLY-ONCE rule, Tier 3 CS2-direct record, and PR-scoped assurance artifacts were updated together.
- `OVL-AC-ADM-001` PREHANDOVER proof exists: PASS ✅ — `.agent-admin/prehandover/proof-pr-2048-current-head-20260919.md` is committed and discoverable.
- `OVL-AC-ADM-002` Session memory exists: PASS ✅ — `.agent-workspace/foreman-v2/memory/session-pr-2048-cs2-direct-codexadvisor-recovery-hardening-20260919.md` is committed.
- `OVL-AC-ADM-003` Tier 2 stub present: PASS ✅ — `.agent-workspace/CodexAdvisor-agent/knowledge/index.md` exists and lists the required bundle including `continuous-improvement-protocol.md`.
- `OVL-AC-ADM-004` Character count within limit: PASS ✅ — `.github/agents/CodexAdvisor-agent.md` is `17,553` characters and `metadata.change_summary` is `78` characters.
- `ACR-01`: PASS ✅ — `.agent-admin/prs/pr-2048/ecap-admin-bundle-20260919.md` includes populated `ECAP_RECONCILIATION_SUMMARY` sections `C1–C6`.
- `ACR-07`: PASS ✅ — `.admin/prs/pr-2048.json`, `.agent-admin/scope-declarations/pr-2048.md`, `.agent-admin/prs/pr-2048/active-state.json`, and the exact `git diff` all agree on the `15`-path active PR-scoped file set.
- `ACR-08`: PASS ✅ — no stale artifact path reference remains in the committed active-state artifact; all referenced paths resolve to PR `#2048` assets on branch.
- `ACR-09`: PASS ✅ — the active tracker, ECAP bundle, and PREHANDOVER proof each declare the gate set checked.
- `ACR-15`: PASS ✅ — the previously contradictory ECAP/tracker state is resolved, and no open prior rejection blocker remains in the active PR-scoped ceremony set.

Total: `22` checks, `22` PASS, `0` FAIL

Adoption phase: `PHASE_B_BLOCKING` — blocking

MERGE GATE PARITY:
- `identity-binding-gate.sh` (PR `#2048` context): PASS ✅
- `validate-governance-evidence-exactness.sh` (PR `#2048` context): PASS ✅
- `validate-scope-to-diff.sh` (PR `#2048` context): PASS ✅
- `YAML validation`: PASS ✅
- `Character count`: PASS ✅
- `Canon hash verification`: PASS ✅
- `Checklist compliance`: PASS ✅
- Result: `PASS`

═══════════════════════════════════════
ASSURANCE-TOKEN
PR: `#2048 / fix(codex-advisor): restore config and recovery controls`
All `22` checks PASS. Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
Token reference: `IAA-session-1289-20260919-PASS`
Adoption phase: `PHASE_B_BLOCKING`
═══════════════════════════════════════

## TOKEN

- Date: `2026-09-19`
- PR: `#2048`
- Reviewed head: `d4f73332c62bed57b92bcc006cb01b8485cd85a8`
- Stable substantive submitted head: `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`
- PHASE_B_BLOCKING_TOKEN: `IAA-session-1289-20260919-PASS`
- Verdict: `ASSURANCE-TOKEN`
- Merge gate parity: `PASS`
