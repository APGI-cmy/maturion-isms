# ACTIVE CS2 AUTOMATED WORKFLOW GOVERNANCE

**Status**: CANONICAL | **Version**: 1.0.1 | **Authority**: CS2
**Effective Date**: 2026-09-22  
**Type**: Constitutional governance definition  
**Layer-Down Status**: PUBLIC_API  
**Authorisation**: APGI-cmy/maturion-foreman-governance#1409 — Johan Ras, 2026-09-22  
**Precedence**: Subordinate to constitutional canon, OPOJD, the Fully Functional Delivery Standard, IAA canon, and human CS2 reserved authority. This canon governs the active-CS2 successor only; `INTERIM_CS2_AMC_AUTOMATION_GOVERNANCE.md` remains advisory for the interim role.

---

## 1. Purpose and activation boundary

This canon defines a bounded, auditable model for an **active-CS2 successor** to deliver one explicitly approved parent job through an arbitrary, explicitly approved ordered collection of waves. It enables continuous delivery toward one-time build correctness, fully functional delivery, and OPOJD without treating a merged PR, isolated green check, or partial evidence as whole-job completion.

This is contract-ready governance, not activation. No active-CS2 agent, permission, controller, merge interface, credential, spend authority, or pilot is activated by this canon. Activation requires the separate readiness decision in §12. The initial W0 pilot may select two waves, but two is neither an architecture limit nor a policy maximum.

## 2. Roles and non-delegable boundaries

| Role | May do | Must not do |
|---|---|---|
| Human CS2 / Johan | Approve job plan/envelope; retain protected authority; authorise breaker reset and activation | Delegate new scope, costs/credentials, destructive actions, irreducible business decisions, or constitutional changes implicitly |
| Active-CS2 successor | Accept an approved job; dispatch an eligible wave; review evidence; issue precise findings; merge only under §8; advance exactly once; verify integrated acceptance | Build; appoint specialists; replace IAA/QP/ECAP; weaken gates; self-authorise; merge its own authority or safety change |
| Foreman | Own POLC orchestration, ordinary remediation, specialist appointment, gates, evidence-binding verification | Surrender orchestration or use active CS2 as a builder |
| Specialist | Implement and self-check bounded work | Self-appoint, self-accept, or self-merge |
| QP | Check completeness and evidence | Replace independent assurance |
| ECAP | Validate administration and prepare the ceremony bundle | Decide product quality, merge, or assurance |
| IAA | Pre-brief and independently assure | Assure its own work or be replaced by CS2 review |

The controller is the deterministic state evaluator. CS2 requests a transition; it does not write state directly. Foreman owns failure routing to the correct role. A successor must never reinterpret interim advisory authority as this active authority.

## 3. Parent job and wave model

An approved job record conforms to `governance/schemas/ACTIVE_CS2_JOB_WAVE.schema.json`.

* `job_id` is stable for the life of the parent job and is never recreated for a later wave, PR recut, restart, or correction.
* Each `wave_id` is stable and unique within its `job_id`. `ordinal` provides deterministic ordering; `depends_on` provides the explicit dependency graph.
* The approved plan is a non-empty, acyclic graph. Every dependency names an approved wave and precedes its dependent. A plan can contain any number of waves.
* There is one active parent job and, within it, at most one claimed active wave. Multiple waves are not concurrent jobs.
* A wave can be released only once its dependencies are `VALIDATED`; `FAILED`, `ABANDONED`, `TRIPPED`, blocked, or unknown predecessors never release successors.
* Adding a wave, changing scope/dependencies, or enlarging any limit is a new human-CS2 decision. It is not a routine progression event.

### 3.1 States

| Entity | States |
|---|---|
| Job | `PROPOSED`, `APPROVED`, `ACTIVE`, `INTEGRATION_VALIDATION`, `COMPLETE`, `BLOCKED`, `TRIPPED`, `ABANDONED` |
| Wave | `PLANNED`, `ELIGIBLE`, `CLAIMED`, `DISPATCHED`, `IN_BUILD`, `IN_ASSURANCE`, `IN_REVIEW`, `MERGE_ELIGIBLE`, `MERGED`, `VALIDATED`, `CORRECTION`, `BLOCKED`, `FAILED`, `ABANDONED`, `TRIPPED` |

Only the evaluator may create a transition. It rejects illegal, duplicate, stale, reordered, or incompatible events idempotently and writes an append-only decision record. `current_wave_id` is null except while a wave is active.

### 3.2 Normal route and completion

For an eligible wave, the normal route is:

```text
approved intake → CS2 dispatch → Foreman pre-build/QA-to-RED → IAA pre-brief
→ Foreman specialist appointment → implementation/self-check → Foreman QP → ECAP
→ Foreman gates → final independent IAA → Foreman evidence binding → CS2 review
→ permitted merge → wave validation → next eligible approved wave
```

Routine correction returns to Foreman and re-enters at the applicable stage; it does not close, recreate, or replenish the parent job. `COMPLETE` requires every approved wave `VALIDATED` plus integrated functional, regression, and job-acceptance evidence. It must bind the accepted target/base, all accepted wave PRs, and the final integrated content fingerprint. A PR merge or tests for one wave is insufficient.

## 4. Tier-to-control map

| Tier | Required control | Consumer implementation artifact and owner |
|---|---|---|
| Tier 1 | Identity, authority, boundaries, preflight, lifecycle, reserved matters | Active-CS2 successor contract, created by CodexAdvisor under a CS2-approved ISMS issue; human CS2 approves |
| Tier 2 | Intake, dispatch, correction routing, evidence review, merge/refusal, safety, bootstrap, continuity, learning | ISMS controller policy, runbook, state evaluator configuration, failure register and continuity index; Foreman owns orchestration controls |
| Tier 3 | Validated task-specific context from the actual record | Per-dispatch context envelope containing `job_id`, `wave_id`, approved scope/limits, dependencies, PR/head/base/reviewed-content fingerprints, live blockers, and QP/ECAP/IAA references |

Tier 3 is ephemeral task context reconstructed from validated records. It is not a static knowledge tier, cannot override Tier 1, and cannot provide missing authority. The control map at `governance/ACTIVE_CS2_AUTOMATED_WORKFLOW_CONTROL_MAP.md` distinguishes proposed, contract-ready, activation-ready, and active artifacts.

## 5. Safety envelope and deterministic control

The approved envelope is job-scoped and shared across all waves, sessions, PR recuts, and restarts. Counters do not reset at a wave boundary.

For the approved W0 baseline, the envelope is one active job, one active wave, one material correction, 30 minutes per dispatch, two hours total per job/work item, runtime-only accounting until reliable spend telemetry exists, and a human-authorised audited breaker reset. Expiry, stage-attempt, merge-attempt, spend, or other limits not explicitly approved are null and cause their dependent operations to fail closed.

The controller must provide:

1. atomic compare-and-set wave claims and idempotency keys for every stage event;
2. one authoritative evaluator and an append-only event/decision ledger;
3. duplicate/reordered-event rejection, loop detection, and deduplicated trip alerts;
4. an independent deterministic supervisor, human kill switch, and human-only audited reset;
5. a failure register with root cause, earliest expected and actual detection layer, prevention control, owner, regression identifier, recurrence, and cost/time impact.

Every decision record binds the parent/wave, event and idempotency key, state before/after, envelope identity, evidence references, PR and reviewed head/base/content fingerprint, material blockers, delta class, owner, decision/reason, input revision, and persistent runtime, correction, stage-attempt, merge-attempt, and spend accounting. Unknown or unverifiable values fail closed.

## 6. Evidence and assurance freshness

The assurance record distinguishes three identities: (1) the frozen substantive submission and its reviewed-content fingerprint; (2) one finite, explicitly identified evidence envelope that may authorise a token-only append; and (3) the current merge head, which is re-read for live checks and atomic compare-and-set. The frozen submission is not retroactively moved to a later Git head.

The evaluator invalidates prior PASS when current checks are failed, pending, missing, stale, mismatched in identity, conflicted, or bound to a different substantive content/base/policy/authority/dependency/gate input. A material code, rebase, gate, dependency, policy, authority, or material-evidence delta requires only the affected pre-brief, assurance, and review to be re-evaluated.

Delta classification is `ADMIN_TOKEN_ONLY`, `SUBSTANTIVE`, `REBASE`, `GATE_CHANGE`, or `UNKNOWN`. A changed Git head preserves assurance without fresh pre-brief or assurance dispatch only when the finite evidence envelope expressly permits that exact token append and deterministic comparison verifies the token path/hash plus unchanged frozen reviewed content, base, policy, authority, dependencies, and gate results. The current head must still pass live checks and compare-and-set. A label, filename, or delta class alone is not proof. `UNKNOWN` fails closed.

## 7. Review, correction, and refusal

CS2 reviews genuine completed evidence and returns precise, evidence-bound findings to Foreman. Findings identify the failed obligation, evidence location, delta, owner, and required re-entry stage. Foreman routes ordinary remediation; a finding may not silently enlarge scope or budgets.

The evaluator must refuse a dispatch, advance, or merge with a typed reason including `UNAPPROVED_SCOPE`, `DEPENDENCY_UNMET`, `BUDGET_EXHAUSTED`, `BREAKER_TRIPPED`, `EVIDENCE_STALE`, `MATERIAL_BLOCKER`, `GATE_UNSATISFIED`, `IDENTITY_MISMATCH`, `UNKNOWN_DELTA`, `CONFLICT`, or `RESERVED_MATTER`.

## 8. Machine-governed merge policy

Routine merging is permitted only when a versioned, machine-readable merge policy explicitly allows the action and the evaluator confirms all of the following:

1. an approved in-scope wave and current merge policy version;
2. required tests/checks are current and passing;
3. independent evidence and a valid final IAA outcome bound to the current reviewed content;
4. no unresolved substantive review thread;
5. fresh head/base validation, no material blocker, conflict, or identity mismatch;
6. an unexpired atomic compare-and-set merge claim; and
7. no reserved matter, breaker condition, or envelope breach.

The policy must identify approved repository, target branch, permitted paths, parent-job/wave scope, approval binding, allow-list, tests/checks, evidence requirements, protected authority/safety exclusions, and refusal codes. It must not authorise merging authority/safety changes made by the successor. Any condition that cannot be evaluated is a typed refusal, not a discretionary approval.

## 9. Records and retention

The controller maintains durable parent and wave records, immutable event decisions, claim records, merge evidence, final acceptance, and failure-register entries. A restart reconstructs its Tier 3 context solely from those records and current repository/CI facts. It must retain recurrence and spending/runtime history across waves and recuts.

## 10. Validation fixtures

Static/schema validation is required before consumer implementation. The canonical fixtures under `governance/schemas/fixtures/active-cs2-job-wave/` demonstrate:

* two-wave pilot and three-wave plans that are valid without a wave-count maximum;
* rejection of an unknown/cyclic dependency;
* duplicate/reordered event handling;
* attempted budget reset and premature parent completion;
* stale assurance and a material blocker after PASS;
* a verified envelope-permitted token-only append that changes Git head but preserves assurance, contrasted with material evidence that invalidates it;
* refusal of wrong repository, branch, path, job/wave, and prohibited self-authorising merge.

These fixtures are governance acceptance evidence, not a claim that a runtime controller exists. Runtime tests and controller enforcement are consumer implementation work.

## 11. Layer-down and consumer handoff

After upstream merge, layer-down uses the existing registry and dispatch route:

```text
upstream main → governance-layer-down-dispatch.yml → ISMS [Layer-Down] issue
→ ripple-integration.yml → consumer ripple PR → checks/review/merge → verified ISMS-main parity
```

The dispatch record must name the actual canonical commit, workflow run, consumer issue and PR, and ISMS-main integration evidence. Notification or PR creation is not success. A conflicting/open ripple PR, missing token, or protected-contract gate is recorded as an actionable blocker with its owner; it is never bypassed.

After verified ISMS arrival, the handoff in the control map authorises a separate CS2-approved downstream implementation issue for CodexAdvisor. It must not rewrite, close, duplicate, or reassign ISMS #2053, and it must not begin W0 or create/modify an agent contract from this upstream issue.

## 12. Readiness and reserved matters

Lifecycle terms are deliberately distinct:

| State | Meaning |
|---|---|
| `PROPOSED` | Candidate model/artifact; no authority |
| `CONTRACT_READY` | Governance and implementation specification approved; no live successor |
| `ACTIVATION_READY` | W0 containment proven, controller/merge interfaces implemented, policy/permissions valid, and independently assured |
| `ACTIVE` | Human CS2 has separately authorised activation within a defined envelope |

Human CS2 retains authority for scope and authority changes, costs/credentials, destructive actions, irreducible business decisions, breaker resets, agent-contract approval, activation, and constitutional amendment. Active-CS2 automation is not a prerequisite for building its safety foundation.

## 13. Amendment history

| Date | Version | Change | Authority |
|---|---|---|---|
| 2026-09-22 | 1.0.0 | Initial general parent-job/multi-wave active-CS2 governance | CS2-authorised issue #1409 |
| 2026-09-22 | 1.0.1 | Defined finite token-only evidence append, stage-aware evidence, scoped merge policy, and durable envelope records | CS2-authorised #1410 correction |
