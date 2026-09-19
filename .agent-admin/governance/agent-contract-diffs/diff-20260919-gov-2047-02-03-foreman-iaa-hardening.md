# Diff Record — GOV-2047-02 / GOV-2047-03 Foreman & IAA Convergence Hardening

**PR**: #2049 — Harden Foreman convergence and anti-loop controls
**Issue**: #2047 — Governance: harden Foreman convergence and anti-loop controls
**Wave**: GOVERNANCE-2047-FOREMAN-CONVERGENCE-20260919
**Producing agent**: CodexAdvisor-agent
**Authority chain**:
- CS2 authorization: user-provided explicit authorization, 2026-09-19 (recorded in `.agent-admin/prs/pr-2049/wave-current-tasks.md` @ `691bb26615e148b2195b49152f989d21b0715ad8`)
- IAA pre-brief: `.agent-admin/assurance/iaa-wave-record-GOVERNANCE-2047-FOREMAN-CONVERGENCE-20260919.md` @ `148c5ef067f51a5d19db3c61238f4be7dbed917d`
- Ripple/layer-down assessment gating this implementation: `.agent-admin/governance/pr-2049-gov-2047-01-ripple-assessment.md` @ `05621689b16a185247c1c3b4037b849cd87b5ec1`

**Nature of this artifact**: implementation diff record for CodexAdvisor's own GOV-2047-02/03 changes. No IAA verdict, no ECAP invocation, and no merge-readiness claim is made here.

---

## 1. Files changed and why

### (a) Protected Tier 1 agent contracts (GOV-2047-02, CodexAdvisor authority per AGCFPP-001)

| Path | Change | Ripple-assessment authorization |
|---|---|---|
| `.github/agents/independent-assurance-agent.md` | Step 0.2: PR-scoped-first (`.agent-admin/prs/pr-<N>/wave-current-tasks.md`) → legacy-fallback (`.agent-workspace/foreman-v2/personal/wave-current-tasks.md`) resolution, mirroring `.agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md §5`. Added explicit "never terminal/completion" language for `IAA_PREBRIEF_READY`-class statuses IAA reads (Step 0.2, Step 2.1). Added an evidence-binding rule after CORE-021 prohibiting repetitive evidence-only exact-current-HEAD commits and binding assurance to the stable reviewed head or independent external attestation. Contract version 2.10.0 → 2.11.0. | §3(a) row 1 of ripple assessment — this is the assessment's "HIGHEST-PRIORITY GAP." |
| `.github/agents/foreman-v2-agent.md` | Added §2 prohibition item 10 (never treat `IAA_PREBRIEF_READY` or any pre-brief/pre-handover intermediate state as terminal/completion/merge-readiness). Added new §2a "Blocker remediation ladder" (self-remediate → delegate to responsible specialist → prove protected/external escalation) as a named Tier-1 invariant, pointing to Tier 2 for detail. Amended the `IAA_PREBRIEF_READY` state-rule line in §4 to state explicitly it is never terminal. Amended §6 handover-blockers closing line to require blocker classification per §2a before HALT/STOP_AND_FIX. Contract version 2.17.0 → 2.18.0. | §3(a) row 2 of ripple assessment. |

### (b) Consumer Tier 2 knowledge (GOV-2047-03, re-routed to CodexAdvisor per ripple assessment §3(c) item 3 and per the CS2-authorized wave tracker, because the target paths are outside governance-liaison-isms-agent's declared `write_access`)

| Path | Change | Ripple-assessment authorization |
|---|---|---|
| `.agent-workspace/foreman-v2/knowledge/foreman-tier2-operating-protocol.md` | Added new §9a "Blocker classification / remediation ladder" — the detailed self-remediate/delegate/escalate classification mirroring `.agent-workspace/CodexAdvisor-agent/knowledge/continuous-improvement-protocol.md §1`, plus the same exact-current-HEAD evidence-binding prohibition. | §3(b) row 1 of ripple assessment. |
| `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | Added new permanent rule `A-044 FOREMAN-OWNED-PREREQUISITE-NON-STOP-AND-EXACT-HEAD-LOOP-PROHIBITION` (Section 1) and a matching Version History entry (4.7.0 → 4.8.0). Codifies both the false-stop prohibition and the exact-head-loop prohibition as CS2-authorized permanent non-recurrence rules. | §3(b) row 2 of ripple assessment. |

### (c) Verification-only (no edit made — ripple assessment found no gap; re-checked after (a)/(b) landed for continued coherence)

| Path | Finding |
|---|---|
| `FOREMAN_OPERATING_MODEL.md` (ECAP section, lines ~181–202) | Still correctly restricts ECAP to admin-only vocabulary (`ADMIN_VALIDATED`/`ADMIN_BLOCKED`/`ADMIN_READY_FOR_FOREMAN_REVIEW`); no readiness/IAA-invocation language present. No edit needed; remains coherent with the new §2a remediation ladder and non-terminal `IAA_PREBRIEF_READY` language added to `foreman-v2-agent.md`. |
| `.agent-admin/control/overlays/WAVE4_ECAP_ADMIN_BOUNDARY.md` | Still correctly excludes `ready for IAA`/`ready for merge`/etc. from ECAP's allowed result vocabulary. No edit needed. |
| `.agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md` | §5 already specifies the exact PR-scoped-first/legacy-fallback model now mirrored in the IAA Tier 1 contract. No edit needed — this file was already correct and is the source the new `independent-assurance-agent.md` Step 0.2 text cites. |
| `.github/agents/execution-ceremony-admin-agent.md` | No new Foreman-side ECAP-invocation wording was introduced by (a)/(b); the file's existing "never invoke IAA / never approve readiness" boundary remains coherent and unedited. |

### (d) Explicitly NOT edited — CS2-only canonical amendment gate

| Path | Reason not edited |
|---|---|
| `governance/canon/IAA_PRE_BRIEF_PROTOCOL.md` (v1.3.0) | This file's own header states: *"Only CS2 (Johan Ras / repo owner) may amend this canon. Any PR modifying this file without CS2 sign-off is auto-FAIL at the merge gate."* CodexAdvisor's own contract additionally declares `consumer_mode.create_governance_canon: false` and `consumer_mode.receive_only_governance: true` — this repository is a consumer of `APGI-cmy/maturion-foreman-governance` and does not originate canon changes. The general wave-level "CS2 authorization: user-provided explicit authorization, 2026-09-19" recorded in the PR tracker authorizes the *hardening wave* as a whole; it is not a file-specific, quoted CS2 sign-off for this canon amendment's content, which the ripple assessment explicitly flags as needing CS2 direct sign-off, separate from and in addition to the wave authorization ("this cannot be delegated to CodexAdvisor-agent alone per the file's own amendment-authority clause"). Per the task instruction's own conditional ("apply the amendment only if your contract accepts the user's explicit statement... as the required CS2 approval; otherwise ... record a concise recommendation/blocker instead"), CodexAdvisor's contract does not contain language accepting a general wave-level authorization as satisfying a file-specific canonical amendment-authority clause of this kind — so no edit was made. See §3 "Recommendation for CS2" below. |

---

## 2. What did not change (explicit non-actions)

- No `governance/canon/**` file was edited (CANON_INVENTORY hash validation re-run after all edits: 204/204 entries still valid, unchanged — confirmed via `node .github/scripts/validate-canon-inventory.js --inventory governance/CANON_INVENTORY.json --root .`).
- No PIT product code, database, Supabase, deployment, secret, or release artifact was touched.
- No PIT controller test or documentation was added — the controller surface exists only on the still-open, blocked PR #2046 and is absent from this branch/base, exactly as GOV-2047-01 found. Fabricating tests against a nonexistent surface was correctly avoided (GOV-2047-04 remains blocked pending CS2/Foreman resolution of that dependency).
- No IAA token, verdict, or ECAP invocation was issued or implied by this session. Phase 4 of this session hands the bundle to independent IAA; it does not self-certify assurance.
- No merge, activation, or successor-wave action was taken.

## 3. Recommendation for CS2 (blocker — not resolved in this session)

`governance/canon/IAA_PRE_BRIEF_PROTOCOL.md` v1.3.0 still describes only the older wave-record/legacy-symlink model and does not yet state the PR-scoped-first/legacy-fallback resolution order or the stable-reviewed-head/external-attestation principle now reflected in `.agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md` and in the amended `independent-assurance-agent.md`. **Recommended amendment** (for CS2-direct application only):

1. Add a new `## PR-Scoped Task Resolution` subsection stating: IAA/Foreman must resolve the active wave task file PR-scoped-first (`.agent-admin/prs/pr-<N>/wave-current-tasks.md`), falling back to the legacy path (`.agent-workspace/foreman-v2/personal/wave-current-tasks.md`) only when no PR-scoped file exists — mirroring `.agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md §5` verbatim.
2. Add a short "Evidence Binding" principle stating that assurance binds to the stable reviewed submission head or an independent external attestation, and that repetitive evidence-only commits made solely to describe an artifact's own newly changed HEAD are prohibited — mirroring `.agent-workspace/CodexAdvisor-agent/knowledge/continuous-improvement-protocol.md §2`.

Until CS2 signs off on this specific canonical amendment, the dual-protocol-file coherence risk the IAA pre-brief names remains open at the canonical layer (though it is now resolved between the Tier 1 IAA contract and the `.agent-admin/control/` protocol file, which now agree with each other).

## 4. Genuine sequencing blocker (not owned by this session)

GOV-2047-04 (pit-specialist, PIT controller tests/docs) remains blocked: the controller surface (`.github/cs2-controller/**`, `.github/scripts/pit-cs2-controller*`, `.github/workflows/pit-cs2-controller.yml`, `.github/workflows/iaa-prebrief-inject.yml`) exists only on open/blocked PR #2046 and is absent from `main`/this branch. This session did not fabricate tests against a nonexistent surface. Foreman/CS2 must resolve the PR #2046 dependency (merge order or explicit direction) before GOV-2047-04 can proceed.

---

*Authority: CS2 (Johan Ras / @APGI-cmy) | Produced by: CodexAdvisor-agent | Living Agent System v6.2.0*
