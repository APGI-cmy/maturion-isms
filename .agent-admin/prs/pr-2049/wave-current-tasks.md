# PR #2049 Wave Current Tasks

PR: #2049
Issue: #2047 — Governance: harden Foreman convergence and anti-loop controls
Wave: GOVERNANCE-2047-FOREMAN-CONVERGENCE-20260919
Branch: copilot/governance-harden-foreman-controls
Base branch: main
Base SHA: 7b059c4d33b2a950cecc178eb6c94fef62468e8a
Initial planning head SHA: 6c878323f01e53926f67740a0c1ce5c542915e79
CS2 authorization: user-provided explicit authorization, 2026-09-19
Status: FOREMAN_CONTROL
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-GOVERNANCE-2047-FOREMAN-CONVERGENCE-20260919.md
iaa_prebrief_commit_sha: 148c5ef067f51a5d19db3c61238f4be7dbed917d
ceremony_admin_appointed: PENDING — ECAP is required by the pre-brief and may be appointed only after Foreman QP PASS.

## Wave boundary

- In scope: the minimal coherent governance ripple for Foreman convergence and anti-loop controls described in issue #2047.
- Out of scope: PIT product behavior, database, Supabase, deployment, secrets, releases, merge authority, unrelated role changes, and any weakening of IAA independence or quality gates.
- Required routing invariant: self-remediate ordinary Foreman-owned prerequisites; delegate specialist-owned work; escalate only a proven protected or external authority boundary.
- Evidence invariant: use a stable reviewed head or external attestation; do not create self-referential exact-current-HEAD evidence refresh loops.

## Qualifying task checklist

- [x] GOV-2047-01 — Assess authoritative/canonical ripple and produce the consumer layer-down plan for the Foreman, IAA, operating-model, and ECAP control changes.
      builder: governance-liaison-isms-agent
      qp_verdict: PASS
      notes: QP PASS — assessment is complete at .agent-admin/governance/pr-2049-gov-2047-01-ripple-assessment.md (05621689b16a185247c1c3b4037b849cd87b5ec1). It identifies no unapproved scope expansion and correctly separates direct consumer work from CS2-protected canon work.

- [x] GOV-2047-02 — Apply the CS2-authorized minimal agent-contract hardening to Foreman and IAA paths: remediation ladder, Foreman-owned prerequisite handling, no terminal READY_FOR_IAA state, PR-scoped-first prebrief route, legacy fallback only when no PR record exists, and stable reviewed-head/external-attestation semantics.
      builder: CodexAdvisor-agent
      qp_verdict: PASS
      notes: PASS after STOP_AND_FIX remediation — Foreman-corrected tracker authority mismatch and removed whitespace defects (`git diff --check` clean on current head). Contract/Tier2/IAA hardening landed on reviewed head and maintains canonical-boundary separation for CS2-only canon amendments.

- [x] GOV-2047-03 — Apply the corresponding consumer governance controls in Foreman Tier 2/FAIL-ONLY-ONCE, FOREMAN_OPERATING_MODEL, IAA protocol/schema/workflow material, and the directly applicable ECAP boundary protocol.
      builder: CodexAdvisor-agent
      qp_verdict: PASS
      notes: PASS — consumer coherence updates completed and re-verified on current head across Foreman Tier2/FAIL-ONLY-ONCE plus targeted FOREMAN_OPERATING_MODEL, IAA prebrief protocol, and WAVE4 ECAP boundary language (admin-only + anti-loop consistency).

- [x] GOV-2047-04 — Add focused PIT controller tests and controller documentation covering automatic IAA prebrief invocation, IAA rejection-to-Foreman correction/reinvocation, protected-conflict CodexAdvisor routing, non-terminal READY_FOR_IAA prohibition, PR-scoped and legacy-fallback path behavior, and exact-head loop prevention.
      builder: maturion-agent
      qp_verdict: PASS
      notes: PASS — after current-main integration brought PR #2046's controller foundation onto this branch, maturion-agent accepted the controller/governance-facing fallback route and updated `.github/scripts/pit-cs2-controller.js`, `.github/scripts/pit-cs2-controller.test.js`, `.github/scripts/pit-cs2-controller-workflow.test.js`, and `.github/cs2-controller/pit-pilot.md` with the required PR-scoped pre-brief, rejection-routing, protected-conflict CodexAdvisor/CS2, non-terminal READY_FOR_IAA, legacy-fallback, and no exact-head-loop coverage. Builder validation reported `node --test .github/scripts/pit-cs2-controller.test.js .github/scripts/pit-cs2-controller-workflow.test.js` = 12 passed / 0 failed.

- [x] GOV-2047-05 — Execute focused QA for the controller/contract hardening and report test results, skips, warnings, and regression evidence.
      builder: qa-builder
      qp_verdict: PASS
      notes: PASS — qa-builder executed focused QA on the GOV-2047-04 surface only. `node --test .github/scripts/pit-cs2-controller.test.js .github/scripts/pit-cs2-controller-workflow.test.js` returned 12 passed / 0 failed / 0 skipped / 0 todo / 0 warnings, and the focused test-debt scan across the four in-scope files found 0 `.skip/.todo/TODO/FIXME/xit/xdescribe/xtest` markers.

## IAA tokens received this wave

| PR # | Token | Date |
|------|-------|------|
| 2049 | PENDING | — |

## Wave completion gate

- [ ] All tasks above show `[x]` only after a recorded Foreman QP PASS.
- [ ] ECAP administrative validation, if required by the IAA pre-brief, is recorded without substantive readiness language.
- [ ] PREHANDOVER proof and session memory are current and committed.
- [ ] Independent IAA final assurance has a current, valid recorded result.
- [ ] CS2 receives the evidence package for its exclusive merge decision.
