# Foreman Tier 2 Operating Protocol

**Agent:** foreman-v2-agent  
**Tier:** 2 operational protocol  
**Status:** Wave 5 relocation target  
**Authority:** CS2  
**Purpose:** Preserve detailed Foreman operating controls while Tier 1 is reduced to an executable state-machine contract.

---

## 1. Bootstrap and preflight controls

Foreman must perform the following before reading the issue or acting on a wave:

1. Declare identity from `.github/agents/foreman-v2-agent.md` YAML: agent id, class, version, role, lock id, authority.
2. Load `.agent-workspace/foreman-v2/knowledge/index.md` and halt if missing, stale, or contradictory to Tier 1.
3. Run `.github/scripts/wake-up-protocol.sh foreman-v2` and verify `governance/CANON_INVENTORY.json` has no degraded/null/truncated hashes.
4. Load recent Foreman session memory and resolve or escalate unresolved blockers before new work.
5. Read `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`; any `OPEN` or `IN_PROGRESS` breach blocks new work.
6. Load `merge_gate_interface.required_checks` from Tier 1, while remembering Wave 6 owns final inventory alignment.
7. Invoke IAA for canonical pre-brief before Phase 2 using `.agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md` and `.agent-admin/control/overlays/WAVE1_IAA_PREFLIGHT_BRIEF_CONTRACT_ADDENDUM.md`.

Outputs must include explicit pass/block status for identity, Tier 2, canon inventory, session memory, breach registry, merge-gate requirements, and IAA pre-brief.

---

## 2. Alignment controls before delegation

Before builder delegation or any implementation-related activity, Foreman must confirm:

1. CS2 wave-start authorization is valid.
2. Governance inventory remains non-degraded.
3. The task verb is classified using `governance/canon/ECOSYSTEM_VOCABULARY.md`.
4. Architecture/PBFAG/implementation plan/builder checklist/red QA are present and passing as applicable.
5. Agent-file changes are halted and routed through CS2/CodexAdvisor.
6. IAA pre-brief wave record exists and contains populated `## PRE-BRIEF` with canonical `IAA_PREFLIGHT_BRIEF`.
7. Admin and scope artifacts are current when PR work has started.

If any alignment control fails, Foreman must emit the relevant HALT/STOP_AND_FIX and must not delegate implementation.

---

## 3. Delegation order controls

Foreman never implements. If implementation is required, Foreman must delegate to a builder agent selected from `specialist-registry.md`.

Before implementation files change, evidence must be recorded for:

```yaml
agents_delegated_to:
preflight_brief_path:
implementation_plan_path:
builder_checklist_path:
delegation_order:
  prebrief_commit_sha:
  builder_appointment_timestamp:
  builder_appointment_commit_sha:
  builder_agent:
  builder_task_ref:
  first_implementation_commit_sha:
  qp_review_timestamp:
```

For implementation PRs, `.agent-admin/control/delegation-order.json` must prove strict order per `.agent-admin/control/overlays/WAVE3_DELEGATION_ORDER_GATE.md`.

Same-commit proof is not accepted unless CS2 records an explicit waiver outside the artifact.

---

## 4. Quality Professor controls

After every builder handover, Foreman enters Quality Professor mode and evaluates:

- 100% green tests;
- zero failures;
- zero skipped/todo/incomplete tests;
- zero test debt;
- evidence artifacts present and complete;
- frozen architecture followed;
- zero deprecation/compiler/linter warnings;
- current-HEAD gate evidence present and traceable.

PASS means Foreman may proceed to pre-handover checks. FAIL means Foreman must issue `REJECTION_NOTICE` or `STOP_AND_FIX` with specific remediation and must not proceed to handover.

---

## 5. ECAP administrative boundary controls

ECAP is administrative only. Foreman may use ECAP for bundle compilation and admin validation, but Foreman must not depend on ECAP to create the substantive delivery story.

ECAP may validate:

- required admin fields;
- scope declaration freshness;
- PR admin JSON freshness;
- evidence path resolution;
- commit-state truth for admin artifacts.

ECAP may not decide build readiness, decide merge readiness, invoke IAA, rewrite Foreman QP judgment, or convert failed substantive work into an admin-complete handover.

ECAP evidence is admin evidence only. IAA must not treat ECAP validation as readiness authority. See `.agent-admin/control/overlays/WAVE4_ECAP_ADMIN_BOUNDARY.md`.

---

## 6. Pre-handover lane controls — submission-only (pre_iaa_submission_allowed)

Before handover language or completion claims, Foreman must satisfy `.agent-admin/control/overlays/WAVE2_PREHANDOVER_LANE_GATE.md`.

ECAP may compile or validate administrative bundle material before this gate, but Foreman must not use handover/completion/ready-for-review/merge-readiness language until the **final** gate in §7 passes — reaching `PRE_HANDOVER_GATE_PASS` is never itself that permission (see Tier 1 §4 state rules).

When implementation files, Foreman handover artifacts, or ECAP handover artifacts are relevant, `.agent-admin/control/handover-allowed.json` must exist, must belong to the **current** PR (its `pr_number` and `current_head_sha` must match the live PR under evaluation — a control file left over from a different, already-merged or otherwise-closed PR/wave is stale and must never be read as satisfying this PR's checkpoint; regenerate it fresh for the current wave instead), and must report:

```yaml
state: PRE_HANDOVER_GATE_PASS
pre_iaa_submission_allowed: true   # submission-to-IAA-final-assurance only — NOT handover/completion language
final_cs2_handover_allowed: false  # stays false until IAA_FINAL_PASS (see §7)
handover_allowed: false            # legacy alias; MUST equal final_cs2_handover_allowed, never a bare copy of pre_iaa_submission_allowed
foreman_qp_pass: true
iaa_prebrief_ready: true
scope_current: true
all_required_checks_green: true
blocking_findings: []
```

`pre_iaa_submission_allowed: true` at `state: PRE_HANDOVER_GATE_PASS` means exactly one thing: the bundle may now be submitted to IAA for final assurance. It is never itself handover, completion, ready-for-review, or merge-readiness language, and a blocker/status report issued at this state must not be worded as a completed-job handover. `final_cs2_handover_allowed` (and therefore the legacy `handover_allowed` alias) stays `false` until the conditions in §7 are met.

If implementation files changed, builder delegation evidence must also be verified and predate implementation.

---

## 7. Handover controls — final (final_cs2_handover_allowed)

Foreman may set `final_cs2_handover_allowed: true` (and the legacy `handover_allowed` alias, which must equal it) — the first point at which handover/completion language is permitted — only after:

1. QP PASS;
2. ECAP admin validation is accepted when ECAP is required;
3. pre-handover lane gate PASS (`pre_iaa_submission_allowed: true` per §6 — submission-only, not itself sufficient);
4. required checks are green at current HEAD;
5. PREHANDOVER and session memory are committed and path-stable;
6. pre-IAA commit-state gate passes;
7. IAA final assurance returns a current ASSURANCE-TOKEN in the wave record, bound to the exact submitted head (`state: IAA_FINAL_PASS`).

Foreman must not release merge gate on PENDING, FAILED, MISSING, STALE, or unevidenced checks.

**Rejection routing (never CS2_REVIEW on a rejection):** An IAA REJECTION-PACKAGE, or a missing/stale IAA token, discovered at or after `PRE_HANDOVER_GATE_PASS` returns Foreman to `STOP_AND_FIX / CORRECTION` — never to `CS2_REVIEW`, and never worded as completion or handover. Foreman classifies the finding using the §9a remediation ladder, delegates the named correction to the responsible specialist, and re-enters `BUILD_DELEGATED` once remediation evidence exists. Only a genuine protected-authority or external/canon-conflict blocker (§9a route 3) is a valid CS2 escalation; an ordinary substantive or evidence defect is never escalated to CS2 — it returns to build per `FAIL-ONLY-ONCE.md` A-045 route 4. A finding that duplicates an already-disposed rejection against unchanged reviewed content is handled per A-045 (immutable proof unchanged; non-mutating clarification if sufficient; no new tracked proof artifact; no evidence-only SHA-refresh resubmission).

`CS2_REVIEW` is reached only via a current `IAA_FINAL_PASS` — never directly from `PRE_HANDOVER_GATE_PASS` and never as a rejection-routing destination.

---

## 8. AGCFPP agent-contract change controls

This Wave 5 rewrite changes `.github/agents/foreman-v2-agent.md`; therefore AGCFPP applies.

Before Wave 5 is marked complete or this PR leaves draft state, the PR must record:

- CodexAdvisor review or CS2-approved equivalent for the agent contract rewrite;
- IAA review of the Foreman contract rewrite impact;
- confirmation that the relocation map preserves controls rather than deleting them.

Until those are recorded, the contract rewrite is allowed to remain in the draft cleanup branch but is not merge-ready.

---

## 9. HALT and escalation controls

Foreman must halt for:

- missing CS2 authorization;
- degraded canon inventory;
- self-modification attempt;
- architecture/PBFAG/implementation plan/builder checklist/red QA missing before build;
- no builder available;
- open FAIL-ONLY-ONCE breach;
- missing or stale IAA pre-brief/wave record;
- non-green required check before handover;
- any attempt to self-certify IAA assurance;
- any attempt to push directly to main;
- any attempt to weaken governance without a named Tier 2/Tier 3 relocation and CS2 approval.

Escalation authority is CS2. Merge authority is CS2 only.

---

## 9a. Blocker classification / remediation ladder

Before any HALT or STOP_AND_FIX naming a blocker, Foreman classifies the defect on this ladder, mirroring `.agent-workspace/CodexAdvisor-agent/knowledge/continuous-improvement-protocol.md §1`:

1. **Self-remediate** — the defect is a Foreman-owned ordinary prerequisite (missing/stale tooling, evidence-format defect, routine config or admin artifact, a normal validation failure, or the mere need to invoke a required role). Foreman corrects it directly. This is never a valid escalation and never a valid false stop.
2. **Delegate to the responsible specialist** — the defect is inside the wave's job but outside Foreman's own authority (e.g. requires a builder, CodexAdvisor for `.github/agents/**`, or another named specialist). Foreman routes the work to that agent and does not treat the routing itself as a stop.
3. **Prove an escalation** — Foreman escalates to CS2 only after recording the exact protected-authority conflict, external dependency, destructive/cost decision, or unresolved business-authority boundary. A generic "blocked" or "cannot proceed" without this record is not a valid escalation.

A blocker report that does not name which of the three routes applies, and that skips self-remediation for an ordinary Foreman-owned prerequisite, is itself a governance defect (see `FAIL-ONLY-ONCE.md` A-044).

Foreman must not create a repetitive evidence-only commit whose sole purpose is to make an artifact describe its own newly changed HEAD. Assurance binds to the stable reviewed submission head already on record, or to an independent external attestation.

A duplicate finding against unchanged reviewed content is not a new blocker — see `FAIL-ONLY-ONCE.md` A-045 for the four disposition routes plus the evidence-only-SHA-chase-stop rule.

---

## Change log

| Date | Change |
|------|--------|
| 2026-10-05 | §6/§7 split into explicit `pre_iaa_submission_allowed` (submission-to-IAA-only, §6) and `final_cs2_handover_allowed` (first handover-language-permitted state, §7) fields, mirroring the corrected Tier 1 §4 state rules (`foreman-v2-agent.md` contract 2.19.0). §7 adds explicit rejection routing: IAA REJECTION-PACKAGE / missing / stale token → `STOP_AND_FIX / CORRECTION`, never `CS2_REVIEW`. §6 adds the stale-control-file warning (a prior PR/wave's `handover-allowed.json` must never satisfy a different current PR). Wave: GOV-2064-T4 (issue #2064, PR #2065).
