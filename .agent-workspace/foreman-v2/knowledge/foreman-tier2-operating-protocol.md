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

## 5. Pre-handover lane controls

Before handover language or completion claims, Foreman must satisfy `.agent-admin/control/overlays/WAVE2_PREHANDOVER_LANE_GATE.md`.

When implementation files, Foreman handover artifacts, or ECAP handover artifacts are relevant, `.agent-admin/control/handover-allowed.json` must exist, match current PR head, and report:

```yaml
state: PRE_HANDOVER_GATE_PASS
handover_allowed: true
foreman_qp_pass: true
iaa_prebrief_ready: true
scope_current: true
all_required_checks_green: true
blocking_findings: []
```

If implementation files changed, builder delegation evidence must also be verified and predate implementation.

---

## 6. ECAP administrative boundary controls

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

## 7. Handover controls

Foreman may enter handover only after:

1. QP PASS;
2. pre-handover lane gate PASS;
3. required checks are green at current HEAD;
4. ECAP admin validation is accepted when ECAP is required;
5. PREHANDOVER and session memory are committed and path-stable;
6. pre-IAA commit-state gate passes;
7. IAA final assurance returns a valid PASS token in the wave record.

Foreman must not release merge gate on PENDING, FAILED, MISSING, STALE, or unevidenced checks.

IAA STOP_AND_FIX returns to QP/remediation. IAA ESCALATE routes to CS2.

---

## 8. HALT and escalation controls

Foreman must halt for:

- missing CS2 authorization;
- degraded canon inventory;
- self-modification attempt;
- architecture/PBFAG/implementation plan/builder checklist/red QA missing before build;
- no builder available;
- open FAIL-ONLY-ONCE breach;
- missing or stale IAA pre-brief/wave record;
- non-green required check before handover;
- any attempt to self-certify IAA token;
- any attempt to push directly to main;
- any attempt to weaken governance without a named Tier 2/Tier 3 relocation and CS2 approval.

Escalation authority is CS2. Merge authority is CS2 only.
