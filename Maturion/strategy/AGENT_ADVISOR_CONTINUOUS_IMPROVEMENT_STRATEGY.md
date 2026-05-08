# Agent Advisor Continuous Improvement Strategy

**Repository**: `APGI-cmy/maturion-isms`  
**Path**: `Maturion/strategy/AGENT_ADVISOR_CONTINUOUS_IMPROVEMENT_STRATEGY.md`  
**Owner**: CS2 / Maturion Agent Advisor  
**Status**: Strategy reference  
**Last updated**: 2026-05-08

---

## 1. Purpose

This document preserves the operating model developed during the MMM functional-delivery hardening cycle so future ChatGPT / agent-advisor sessions can resume with the same level of understanding after a chat switch.

It is not a gate script, canon file, or PR-specific evidence artifact. It is a strategy reference for agent advisors and CS2 when deciding how to interpret failures, improve guidance, and preserve lessons without recreating bureaucracy.

The core idea is simple:

```text
Failure observed
→ classify the failure
→ decide whether it is admin, gate, functional, role, evidence, or workflow failure
→ update the lowest effective layer
→ preserve the lesson as reusable guidance, template, gate, or canon
→ next agent has less room to repeat the same failure
```

The objective is continuous improvement, not ceremony for its own sake.

---

## 2. Operating law

The MMM hardening cycle established this operating law:

```text
Admin correctness makes a PR admissible.
Functional delivery makes a build acceptable.
IAA may not confuse the two.
```

The IAA's central question for product builds is:

```text
If CS2 opens this deployed or preview build and performs the promised workflow, does it work completely?
```

File numbers, SHAs, manifests, run IDs, and scope declarations matter. They are the seatbelt. They do not replace the car.

A product build is not complete because the PR is administratively green. It is complete only when the delivered system does the promised thing.

---

## 3. What changed during the hardening cycle

The hardening cycle implemented or reinforced these layers:

### 3.1 Simplified admin model

The admin model was simplified around per-PR manifests, scope declarations, evidence exactness, governance-control path detection, and explicit PR ownership.

The target state is:

- manifests exist when required;
- changed files are inside declared scope;
- evidence files are in permitted paths;
- issue/PR numbers align;
- file counts and SHAs are current;
- governance-control changes require the appropriate ceremony;
- stale global or root-level ceremony spillover does not substitute for current PR evidence.

### 3.2 Role separation

The role model was clarified:

| Role | Purpose | Must not do |
|---|---|---|
| Admin Ceremony Agent | Make the admin record clean | Decide whether the build works |
| ECAP Agent | Run gates, prove stop-and-fix, record current-head gate truth | Issue final functional delivery assurance |
| Builder QA Agent | Test product behaviour, CTAs, backend integration, error states, screenshots, preview/live evidence | Treat route rendering as enough |
| IAA Agent | Independently assure the build is complete, not merely administratively valid | Waste its life re-running gates instead of checking delivery truth |
| Foreman | Orchestrate roles and enforce boundaries | Build directly or collapse roles |

The system should prevent role collapse. A clean admin report is not a functional PASS. A green gate record is not a user journey. A UI shell is not a delivered product.

### 3.3 Tier 2 operational guidance

Tier 2 is the practical operating layer. It should contain checklists, risk scans, templates, and reusable instructions that agents can apply.

The hardening cycle added or reinforced guidance for:

- role boundaries;
- current-head evidence freshness;
- Git / commit / push discipline;
- post-push SHA and CI refresh;
- split IAA verdicts;
- functional delivery evidence;
- Builder QA behaviour testing;
- ECAP gate scrutiny;
- Foreman orchestration;
- admin ceremony cleanliness;
- limitations and partial-scope honesty.

### 3.4 Governance support

Governance canon and related layer-down work established the full-functional-delivery vocabulary:

```text
FULL_FUNCTIONAL_DELIVERY
PARTIAL_FUNCTIONAL_DELIVERY
UI_SHELL_ONLY
ADMIN_PASS
FUNCTIONAL_PASS
```

The preferred product-build IAA verdict shape is:

```text
ADMIN_PASS: yes/no
FUNCTIONAL_PASS: yes/no
VERDICT: FULL_FUNCTIONAL_DELIVERY | PARTIAL_FUNCTIONAL_DELIVERY | ADMIN_ONLY | FAIL
```

Where legacy templates still refer to `FULL_FUNCTIONAL_DELIVERY_VERDICT:`, treat it as a compatibility alias, not a competing standard.

### 3.5 CI and gate alignment

Phase 5 aligned the gates to the new concept. The gate suite should block recurring objective failures such as:

- dead CTAs without CTA/API mapping;
- invented `/api/...` endpoints without exact route implementation and tests;
- missing functional delivery evidence;
- generic IAA PASS without admin/functional split;
- placeholder or incomplete-delivery language while claiming functional PASS;
- handover claims made while current-head checks are red, pending, or missing.

---

## 4. The continuous improvement loop

Every failed PR, blocked handover, bad delivery, or agent performance issue should be processed through this loop:

```text
1. Observe the failure.
2. Classify the failure.
3. Identify the lowest effective layer to fix it.
4. Add the minimum useful standard, template, gate, or canon update.
5. Add regression coverage when objective and repeatable.
6. Preserve the lesson in a durable repo artifact.
7. Use the next PR to verify whether behaviour improved.
```

The goal is not to eliminate failed jobs entirely. Good gates should fail bad PRs.

The goal is:

```text
No unexplained failures.
No repeated known failure class.
No handover while red.
No green admin record masking broken product delivery.
```

Failed gates are useful when they stop bad delivery early. They become improvement signals when they expose a missing standard or unclear instruction.

---

## 5. Failure classification model

Before adding another checklist item, classify the failure.

| Failure class | Diagnostic question | Typical fix |
|---|---|---|
| Knowledge failure | Did the agent not know the required behaviour? | Tier 2 guidance or index pointer |
| Role-boundary failure | Did the wrong agent perform or certify the wrong work? | Tier 2 role guidance; possibly canon if principle is missing |
| Admin evidence failure | Did the manifest/scope/SHA/file count/evidence path drift? | Admin template + ECAP checklist + exactness gate if objective |
| Gate failure | Did CI correctly block a bad state? | No change, or clarify Tier 2 if agents misunderstand it |
| Gate gap | Did CI allow an objective bad state? | Gate update + regression test |
| Product behaviour failure | Did the user workflow not actually work? | Builder QA + functional evidence + product implementation fix |
| IAA assurance failure | Did IAA certify admin instead of delivery truth? | IAA Tier 2 guidance + split verdict template + gate if objective |
| Discoverability failure | Did the correct guidance exist but agent failed to load it? | Tier 2 index/pointer update; agent contract only if unavoidable |
| Canon conflict | Did different governance layers say incompatible things? | Canon/governance issue and layer-down |
| Tooling limitation | Did the agent lack access or a tool failed? | Process workaround, template note, or tool/gate improvement |

Do not treat all failures as the same kind of failure.

---

## 6. Lowest effective layer rule

Use the lowest effective layer that prevents recurrence.

| Fix layer | Use when | Avoid when |
|---|---|---|
| Tier 2 guidance/checklist | Agent judgement or behaviour needs improvement | Failure is objective and repeatable enough for CI |
| Tier 2 index/pointer | Guidance exists but agents may not discover it | Agent contract truly requires new authority |
| Template | Evidence shape is unclear or incomplete | Principle itself is missing |
| CI gate / validator | Objective, repeatable, high-risk failure should be machine-blocked | Failure requires judgement or context |
| Tier 3 evidence pattern | PR-specific proof is stale or incomplete | Reusable rule belongs in Tier 2 |
| Tier 1 / canon | Stable principle is absent or conflicting | It is merely an operational habit |
| Agent contract file | Agent cannot discover/load correct Tier 2 guidance without contract change | A Tier 2 pointer is enough |
| Product backlog | Governance worked but product remains unimplemented | Governance itself caused or allowed the miss |

Simple rule:

```text
Tier 2 first for judgement.
CI gate only for repeatable, objective, high-risk failures.
Canon only for stable principles.
Agent files only when discovery cannot be solved through Tier 2 pointers.
```

---

## 7. Improvement decision outcomes

Each failure review should produce exactly one or more of these outcomes:

```text
1. No action — the gate correctly blocked the issue and current guidance is adequate.
2. Tier 2 improvement — agent guidance was unclear or incomplete.
3. Tier 2 discoverability improvement — add an index/pointer so agents load the right guidance.
4. Template improvement — evidence shape was missing, stale, or ambiguous.
5. Gate improvement — an objective failure was not machine-detected.
6. Regression test — a gate must preserve the newly fixed behaviour.
7. Canon issue — governing principle was absent or conflicted.
8. Agent-contract review — only if Tier 2 pointers are insufficient.
9. Product backlog item — the system behaved correctly, but product implementation remains incomplete.
```

Avoid uncontrolled checklist bloat. Each new checklist item should have a failure class and a reason.

---

## 8. How future chat agents should use this document

When a new chat starts, the agent advisor should read this document before advising on MMM governance, PR review, gate failures, or product delivery issues.

The agent advisor should ask:

1. Is this an admin correctness issue or a functional delivery issue?
2. Is the gate failure useful, stale, over-broad, or paradoxical?
3. Did the agent fail because it lacked guidance, ignored guidance, or could not discover guidance?
4. Does the fix belong in Tier 2, CI, template, canon, Tier 3 evidence, or product backlog?
5. Are we improving the system or just adding ceremony?
6. Would CS2 opening the preview/live build prove the workflow works?

The expected stance is firm but practical:

- protect functional delivery;
- avoid false product PASS;
- respect admin evidence without confusing it for product success;
- keep role boundaries clean;
- preserve useful lessons;
- avoid bureaucracy theatre.

---

## 9. PR review stance for agent advisors

When reviewing PRs, classify findings as:

### Blocking

Use for:

- red required gates;
- missing or stale active manifest/scope for governance-control PRs;
- handover while checks are red/pending/missing;
- product PR missing functional evidence;
- product PR with dead CTAs or invented endpoints;
- IAA product PASS without split verdict;
- admin evidence contradicting current PR state;
- UI shell presented as full delivery.

### Non-blocking follow-up

Use for:

- route naming hygiene not blocking current governance purpose;
- documentation clarity when gates and evidence are otherwise sound;
- future hardening suggestions;
- template polish that does not affect current correctness.

### Approve

Use only when:

- current-head required checks are green;
- manifest/scope/evidence match the final diff;
- role evidence is coherent;
- product PRs include functional delivery proof;
- IAA verdict matches the actual delivery state;
- no stale evidence contradicts the claimed state.

For PR review comments, provide exact ready-to-paste text.

---

## 10. Product delivery standard

For product-facing MMM PRs, full delivery means:

```text
1. The requested user journey can be completed.
2. All visible CTAs perform implemented actions.
3. Frontend actions map to deployed backend capabilities.
4. The expected system state is created, updated, or displayed.
5. Success, loading, and failure states are visible.
6. Live or preview evidence exists.
7. No placeholder is presented as complete.
```

The issue or PR must provide functional evidence, not only admin evidence.

Minimum evidence:

```text
PR:
Issue:
Current head SHA reviewed:
Product/user journey:
User journey tested: yes/no
CTA/API map: present/missing
Backend target proof: present/missing
Screenshots or recording: present/missing
Preview/live URL:
Pass/fail result:
Known partials:
Known limitations:
Partial scope accepted by CS2: yes/no/not_applicable
Builder QA functional report reference:
ECAP/admin-gate report reference:
IAA final assurance reference:
ADMIN_PASS: yes/no
FUNCTIONAL_PASS: yes/no
VERDICT: FULL_FUNCTIONAL_DELIVERY | PARTIAL_FUNCTIONAL_DELIVERY | ADMIN_ONLY | FAIL
```

Partial delivery may be accepted only if explicitly declared and accepted by CS2.

---

## 11. Handling failed jobs

Do not assume all failed jobs are bad.

A failed job can mean:

- the gate correctly stopped an invalid PR;
- the PR is missing evidence;
- the branch is stale;
- the gate is over-broad;
- the gate is stale and no longer matches the operating model;
- the gate created a paradox by applying a product standard to a governance/template PR.

Review failed jobs by asking:

```text
1. What exact condition failed?
2. Is that condition still part of the intended governance model?
3. Is the PR the type of PR this gate should apply to?
4. Is the gate enforcing a real standard or creating a false positive?
5. If the gate is right, what must the agent fix?
6. If the gate is wrong, what classifier or regression must change?
```

The goal is not zero failed jobs. The goal is meaningful failed jobs.

---

## 12. Handover discipline

Agents must not claim handover, merge-ready, complete, or ready-for-review until current-head truth is known.

Before handover, an agent should be able to produce:

```text
CURRENT_HEAD_SHA:
REQUIRED_CHECKS_TOTAL:
PASSING_CHECKS:
FAILING_CHECKS:
PENDING_CHECKS:
MISSING_CHECKS:
ECAP_REQUIRED:
ECAP_ARTIFACT_PRESENT:
IAA_REQUIRED:
IAA_ARTIFACT_PRESENT:
HANDOVER_ALLOWED:
```

If any required check is red, pending, or missing, the correct output is:

```text
STOP_AND_FIX
```

not:

```text
handover-ready
merge-ready
all gates pass
```

The handover gate exists to catch bad claims, but the desired behaviour is for agents to stop before making the bad claim.

---

## 13. Admin vs functional truth

Admin evidence answers:

```text
Is the PR procedurally admissible?
```

Functional evidence answers:

```text
Does the delivered system work for the user?
```

Both matter. They are not interchangeable.

Admin evidence includes:

- manifest;
- scope declaration;
- file-count exactness;
- issue/PR alignment;
- current-head SHA;
- CI run IDs;
- ECAP proof;
- IAA/admin tokens.

Functional evidence includes:

- user journey proof;
- CTA/API map;
- backend target proof;
- screenshots or recording;
- preview/live URL;
- backend logs or invocation proof;
- success/loading/failure states;
- dashboard/state changes;
- known partials;
- IAA functional verdict.

A PR may be admin-valid and functionally incomplete. That must be called out explicitly.

---

## 14. Continuous improvement anti-patterns

Avoid these patterns:

1. **Checklist inflation** — adding rules without classifying the failure.
2. **Gate absolutism** — turning judgement-heavy questions into brittle CI checks.
3. **Canon sprawl** — elevating operational habits into governance law too quickly.
4. **Agent-file churn** — editing `.github/agents/*.md` when a Tier 2 index pointer would work.
5. **Green-gate complacency** — assuming green CI proves product behaviour.
6. **Admin theatre** — perfect manifests over broken workflows.
7. **Product optimism** — calling a shell complete because it looks good.
8. **Stale evidence tolerance** — allowing old SHA, old run ID, old file count, or old verdict after a final push.
9. **Role collapse** — builder, QA, ECAP, and IAA all becoming one vague agent action.
10. **False partials** — using partial delivery as a soft escape hatch without CS2 acceptance.

---

## 15. Current system posture after Phase 5

As of the Phase 5 hardening cycle:

```text
Simplified admin model: implemented / improved.
Admin Ceremony role: clarified.
ECAP role: clarified.
Builder QA role: clarified.
IAA role: clarified.
Foreman role: clarified.
Tier 2 operational guidance: improved.
Tier 2 discoverability: improved through role knowledge indexes.
Governance canon support: improved through full-functional-delivery canon/layer-down work.
CI gate alignment: improved through product-delivery and handover gate hardening.
Phase 6 product wiring: ready to proceed under the new model.
```

Remaining watch areas:

- verify agents actually use the Tier 2 guidance, not merely pass file gates;
- keep ECAP evidence rich enough to prove current-head gate truth;
- ensure IAA focuses on delivery truth after admin quick scan;
- watch for over-broad gates and fix classifiers quickly;
- prove the full model on the next real product PR.

---

## 16. Recommended update practice

When this strategy changes, update this document in a focused PR.

A useful update should include:

- what failure or insight triggered the update;
- which layer was affected;
- whether CI, Tier 2, template, canon, or product backlog changed;
- whether regression evidence exists;
- whether the change reduces repeated failure without adding unnecessary ceremony.

The document should stay readable. It is a strategy memory, not a dumping ground.

---

## 17. One-page reminder

```text
Admin correctness makes a PR admissible.
Functional delivery makes a build acceptable.
IAA may not confuse the two.

A failed job is not automatically bad.
A green admin record is not automatically product success.
A UI shell is not a delivered workflow.
A checklist is useful only when it prevents a real repeated failure.
A gate is useful only when it blocks objective, high-risk mistakes.
Canon is for stable principles, not every operational habit.
Tier 2 is where agent performance improves fastest.

The agent advisor's job is to help CS2 turn failures into reusable standards
without turning delivery into ceremony theatre.
```
