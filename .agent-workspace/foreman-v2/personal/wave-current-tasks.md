# Wave Current Tasks — foreman-v2-agent

Wave: wave-mmm-descriptor-generation-hardening-2026-07-01
Session ID: 06bb54f0-c0eb-430e-98bb-682b40994036
Date: 2026-07-01
Branch: apgi-cmy-fix-descriptor-gerund-normalization
Issue: #1883
PR: #1885 (draft)
CS2 Authorization: User instruction in this session to proceed with full governed prebuild sequence and PR-per-job enforcement.
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-wave-mmm-descriptor-generation-hardening-2026-07-01.md
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-wave-mmm-descriptor-generation-hardening-2026-07-01.md
delegation_order_path: .agent-admin/control/delegation-order.json
ceremony_admin_appointed: true

## Continuous-improvement incident log (FAIL-ONLY-ONCE)

- Incident ID: LOCAL-GOV-2026-07-01-FOREMAN-DIRECT-IMPLEMENTATION
- Summary: Foreman produced a direct local implementation patch before completing governed prebuild/delegation flow.
- Status: RECORDED_AND_REMEDIATING
- Immediate corrective action: ungoverned local patch discarded; wave restarted from prebuild stage.
- Prevention gate: no implementation delegation or commit until canonical IAA pre-brief is recorded and builder appointment is committed in-order.

## Outstanding Tasks (update as each is completed)

| # | Task | Builder | Status | PR / Evidence |
|---|------|---------|--------|---------------|
| 1 | Prebuild artifact alignment (scope declaration, wave tracker, issue binding, gate inventory references) | foreman-v2-agent | 🟢 DONE | this file + `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` |
| 2 | Canonical IAA pre-brief in wave record | independent-assurance-agent | 🟢 DONE | `.agent-admin/assurance/iaa-wave-record-wave-mmm-descriptor-generation-hardening-2026-07-01.md` |
| 3 | Builder appointment for hardening implementation scope | foreman-v2-agent | 🟢 DONE | `.agent-admin/builder-appointments/wave-mmm-descriptor-generation-hardening-2026-07-01.md` |
| 4 | Hardening implementation (descriptor generation grounding + deterministic grammar normalization) | ui-builder | 🟢 DONE | commit `74b022f16414b9d42d1612b421635568753fb2d4` / PR #1885 |
| 5 | Foreman QP review, ECAP admin validation, IAA final assurance | foreman-v2-agent + execution-ceremony-admin-agent + independent-assurance-agent | 🟡 IN PROGRESS | PREHANDOVER + IAA token artifact |

## Wave Completion Gate

- [x] Prebuild artifacts aligned and committed
- [x] Canonical IAA pre-brief completed before delegation
- [x] Delegation order proven (pre-brief -> builder appointment -> first implementation commit)
- [x] Builder implementation delivered to green with required MMM tests
- [ ] Foreman QP PASS recorded
- [ ] ECAP admin validation completed
- [ ] IAA final assurance token recorded
- [x] PR opened for this job

## Foreman readiness declarations (current HEAD)

- QP PASS: Recorded for implementation scope at commit `55b4a4b46745d41b9817cb30e17e8601c343222b` pending final IAA verdict.
- §4.3 merge-gate parity PASS: Declared against current PR head based on passing required checks as confirmed by CS2 instruction in-session.

## Pre-delegation hygiene certification

- `git status --porcelain` clean before delegation-order and readiness binding commits: CERTIFIED.
- Primary deliverables committed in ordered chain (pre-brief -> appointment -> first implementation): CERTIFIED.
- Scope declaration includes ECAP return artifact path coverage: CERTIFIED.
