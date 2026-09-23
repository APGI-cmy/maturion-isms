# Active-CS2 Automated Workflow — Control Map and ISMS Handoff

**Version**: 1.0.1
**Status**: CONTRACT_READY — no active-CS2 successor or controller is activated  
**Authority**: `ACTIVE_CS2_AUTOMATED_WORKFLOW_GOVERNANCE.md` v1.0.1
**Downstream target**: APGI-cmy/maturion-isms after verified layer-down

## Control-to-artifact map

| Control | Required ISMS artifact | Owner / approval | Readiness |
|---|---|---|---|
| Tier 1 role identity and boundaries | Active-CS2 successor `.github/agents/` contract; Tier 2 knowledge index | CodexAdvisor creates only under a CS2-approved issue; human CS2 approves; IAA assures | PROPOSED |
| Approved intake and job/wave plan | Durable job record conforming to `ACTIVE_CS2_JOB_WAVE.schema.json` | Foreman/controller validates; human CS2 authorises plan | PROPOSED |
| Deterministic state/evidence control | Controller state evaluator, append-only decision ledger, idempotency/claim store | Foreman appoints specialist implementation; QP/IAA verify | PROPOSED |
| Session Tier 3 context | Validated dispatch envelope: job/wave, scope/envelope, dependencies, PR/head/base/content, blockers, QP/ECAP/IAA refs | Controller reconstructs; active CS2 consumes read-only | PROPOSED |
| Safety and recovery | Shared counters, independent supervisor, kill switch, audited human reset, failure register | Foreman/controller; human CS2 controls reset | PROPOSED |
| Merge/refusal | Versioned allow-list and compare-and-set merge interface | Controller enforces; active CS2 cannot merge authority/safety changes | PROPOSED |
| Whole-job acceptance | Integrated functional, regression, acceptance and final content evidence | Foreman verifies; IAA independently assures; active CS2 reviews | PROPOSED |

## CodexAdvisor implementation handoff

After verified ISMS-main parity, create a separate CS2-approved ISMS implementation issue. Its required authorisation must name: the active-CS2 contract target(s); Tier 2 stubs; durable job/wave record; controller/evaluator; merge policy/interface; safety supervisor/reset interface; event/failure records; test plan; independent IAA review; and human-CS2 activation approval. It must state that no agent is active until the readiness conditions below pass.

The issue must preserve APGI-cmy/maturion-isms#2053 unchanged: it is W0 containment evidence, not an intake substitute, predecessor, or duplicate.

## Activation gate

`CONTRACT_READY` becomes `ACTIVATION_READY` only when W0 containment is proven, the controller and merge interface exist and have passing runtime tests, required policy/permissions are valid, and IAA has independently assured the activation package. `ACTIVE` requires a separate human-CS2 approval. Missing expiry/stage-attempt/merge-attempt limits remain fail-closed; no new credentials or spend authority is implied.

## Layer-down evidence

Record the upstream canonical commit, dispatch workflow run, generated ISMS issue, consumer PR, its checks/review/merge, and a post-merge ISMS-main parity verification. An open/conflicting PR, missing token, or protected-contract gate is an integration blocker with an owner, not a successful delivery.
