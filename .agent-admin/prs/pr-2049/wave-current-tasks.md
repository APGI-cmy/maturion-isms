# PR #2049 Wave Current Tasks

PR: #2049
Issue: #2047 — Governance: harden Foreman convergence and anti-loop controls
Wave: GOVERNANCE-2047-FOREMAN-CONVERGENCE-20260919
Branch: copilot/governance-harden-foreman-controls
Base branch: main
Base SHA: 7b059c4d33b2a950cecc178eb6c94fef62468e8a
Initial planning head SHA: 6c878323f01e53926f67740a0c1ce5c542915e79
CS2 authorization: user-provided explicit authorization, 2026-09-19
Status: IAA_PREBRIEF_READY
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
      qp_verdict: PASS (CodexAdvisor self-QP; independent IAA verdict still pending and required before merge)
      notes: DONE — edited `.github/agents/independent-assurance-agent.md` (2.10.0→2.11.0: PR-scoped-first/legacy-fallback Step 0.2, non-terminal IAA_PREBRIEF_READY language, new evidence-binding rule after CORE-021) and `.github/agents/foreman-v2-agent.md` (2.17.0→2.18.0: §2 item 10 non-terminal prohibition, new §2a blocker remediation ladder, §4/§6 cross-references). Canonical `governance/canon/IAA_PRE_BRIEF_PROTOCOL.md` was NOT amended — CS2-only sign-off clause not satisfied by the general wave authorization; recommendation recorded in `.agent-admin/governance/agent-contract-diffs/diff-20260919-gov-2047-02-03-foreman-iaa-hardening.md` §3. Full diff record and evidence at that path. No IAA token/verdict issued by this session.

- [x] GOV-2047-03 — Apply the corresponding consumer governance controls in Foreman Tier 2/FAIL-ONLY-ONCE, FOREMAN_OPERATING_MODEL, IAA protocol/schema/workflow material, and the directly applicable ECAP boundary protocol.
      builder: CodexAdvisor-agent
      qp_verdict: PASS (CodexAdvisor self-QP; independent IAA verdict still pending and required before merge)
      notes: DONE — edited `.agent-workspace/foreman-v2/knowledge/foreman-tier2-operating-protocol.md` (new §9a blocker classification/remediation ladder) and `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` (4.7.0→4.8.0: new permanent rule A-044 covering false-stop prohibition + exact-current-HEAD evidence-loop prohibition). Verified (no edit needed, no gap found): `FOREMAN_OPERATING_MODEL.md` ECAP section, `.agent-admin/control/overlays/WAVE4_ECAP_ADMIN_BOUNDARY.md`, `.agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md`, `.github/agents/execution-ceremony-admin-agent.md` — all already coherent with the new hardening. No ECAP invocation, no readiness/merge authority exercised. Full diff record at `.agent-admin/governance/agent-contract-diffs/diff-20260919-gov-2047-02-03-foreman-iaa-hardening.md`.

- [ ] GOV-2047-04 — Add focused PIT controller tests and controller documentation covering automatic IAA prebrief invocation, IAA rejection-to-Foreman correction/reinvocation, protected-conflict CodexAdvisor routing, non-terminal READY_FOR_IAA prohibition, PR-scoped and legacy-fallback path behavior, and exact-head loop prevention.
      builder: pit-specialist
      qp_verdict: PENDING
      notes: BLOCKED — the controller surface exists only on open, blocked PR #2046 and is absent from this branch/base, as evidenced by GOV-2047-01. Await CS2 direction on integration order or controller-surface availability; do not fabricate tests against a nonexistent surface.

- [ ] GOV-2047-05 — Execute focused QA for the controller/contract hardening and report test results, skips, warnings, and regression evidence.
      builder: qa-builder
      qp_verdict: PENDING
      notes: PENDING — may begin only after the actual governed changes and any available controller tests/docs are delivered. Must preserve 100%-GREEN and zero-test-debt controls; no readiness or assurance verdict.

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
