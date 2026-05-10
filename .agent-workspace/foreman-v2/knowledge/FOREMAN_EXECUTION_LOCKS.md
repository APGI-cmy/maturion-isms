# FOREMAN EXECUTION LOCKS — Tier 2 Operational Guidance

**Version**: 1.0.0
**Date**: 2026-05-10
**Authority**: CS2 (Johan Ras / @APGI-cmy) — Issue #1593
**Tier**: 2 (Operational Domain Knowledge)
**Canonical Tier 1 Reference**: `.github/agents/foreman-v2-agent.md` §FOREMAN EXECUTION LOCKS
**Status**: ACTIVE

---

## Purpose

This file provides Foreman and downstream agents with operational guidance for applying the four
Foreman Execution Locks defined in the Tier 1 contract (contract version 2.16.0, issue #1593).

The locks move Foreman from a reminder-based operating model to an execution-lock model:

```text
Foreman cannot proceed by conversational intent.
Foreman proceeds only when the required lock artifacts exist and prove the right agents
have performed the right work.
```

---

## When Each Lock Applies

| Lock | Trigger | Required Before |
|------|---------|----------------|
| START_LOCK | Any wave with implementation, product, governance, workflow, schema, test, or evidence-producing work | First builder delegation |
| PRODUCT_LOCK | Product/runtime files appear in scope | Handover |
| ASSURANCE_LOCK | IAA final assurance is required per wave-record pre-brief | Handover |
| HANDOVER_LOCK | Every wave (unconditional) | Closure language of any kind |

---

## LOCK 1 — START LOCK

### When applies

Every wave that includes implementation, product, governance, workflow, schema, test, or evidence-producing work.

### Required artifact

An orchestration record committed to the branch before delegating to any builder.

**Template**: `governance/templates/foreman/FOREMAN_ORCHESTRATION_RECORD.template.md`

**Minimum required fields** (STOP_AND_FIX if empty or missing):

- `agents_delegated_to` — list of agents and their assigned scope
- `Implementation owner` — must be a specific builder agent, not "TBD"
- `Scope declaration path` — `.agent-admin/scope-declarations/pr-<PR>.md`

### Owner by role

| Role | Responsibility |
|------|---------------|
| Foreman | Create and maintain orchestration record; must be committed before first delegation |
| Builder | Read orchestration record; confirm scope before accepting work |
| IAA | Verify orchestration record present and populated at pre-brief and handover |

### Failure behavior

```text
START_LOCK: FAIL
Reason: agents_delegated_to is empty / Implementation owner missing / orchestration record absent
Owner: Foreman
Next action: Create orchestration record using governance/templates/foreman/FOREMAN_ORCHESTRATION_RECORD.template.md
             Commit to branch BEFORE delegating to any builder
RESULT: STOP_AND_FIX
```

---

## LOCK 2 — PRODUCT LOCK

### When applies

When product/runtime files are in scope. Product/runtime files include:

- `apps/**`
- `supabase/functions/**`
- `supabase/migrations/**`
- `packages/**` (if runtime-deployed)
- Any file that changes live application behavior when merged

### Required artifact

Functional delivery evidence at the default path:

```text
.functional-delivery/pr-<PR_NUMBER>.md
```

The evidence file must:
- Exist on the branch
- Reference the current PR number
- Contain a functional delivery verdict (FULL_FUNCTIONAL_DELIVERY, PARTIAL_FUNCTIONAL_DELIVERY, etc.)
- Be current to the final PR head (not stale from a previous head)

### Owner by role

| Role | Responsibility |
|------|---------------|
| Builder / QA Builder | Produce functional evidence |
| ECAP | Verify evidence is present, current, and correctly scoped |
| Foreman | Require evidence before handover; block on missing or stale evidence |
| IAA | Confirm evidence is present at final assurance |

### Failure behavior

```text
PRODUCT_LOCK: FAIL
Reason: Product/runtime files in scope but .functional-delivery/pr-<PR>.md missing or stale
Owner: QA Builder (to produce), Foreman (to require)
Next action: Delegate evidence production to QA Builder
             Verify evidence references current PR head before proceeding
RESULT: STOP_AND_FIX
```

### Distinction from ECAP / admin evidence

Product functional evidence proves the runtime behavior works.
ECAP admin evidence proves the governance ceremony is complete.
These are not substitutes for each other.

---

## LOCK 3 — ASSURANCE LOCK

### When applies

When IAA final assurance is declared mandatory in the wave-record pre-brief, OR when a
`PHASE_B_BLOCKING_TOKEN` is required by the PREHANDOVER proof.

### Required artifact

A non-PENDING IAA assurance token tied to the current PR head, recorded in:

```text
.agent-admin/assurance/iaa-wave-record-<wave>-<date>.md  ## TOKEN section
```

The token must satisfy ALL of the following:

- `PHASE_B_BLOCKING_TOKEN:` is present and non-empty
- `PHASE_B_BLOCKING_TOKEN:` is NOT `PENDING`
- `Reviewed SHA:` matches the current PR HEAD
- `PR:` matches the current PR number
- `Issue:` matches the governing issue number

### What does NOT satisfy this lock

- IAA pre-brief (that is a control input, not final assurance)
- Archive wave records (`.agent-admin/assurance/archive/**`)
- A REJECTION-PACKAGE (that requires return to Phase 3 Step 3.5)
- A token that was issued against a previous head SHA

### Owner by role

| Role | Responsibility |
|------|---------------|
| IAA | Issue assurance token after independent audit |
| Foreman | Invoke IAA (Phase 4 Step 4.3b); verify token before merge gate release |
| ECAP | Verify token field is present and non-PENDING in PREHANDOVER proof |

### IAA pre-brief vs. IAA final assurance

| | Pre-Brief | Final Assurance |
|---|---|---|
| Timing | Phase 1 Step 1.8 / Phase 2 Step 2.7 | Phase 4 Step 4.3b |
| Purpose | Control input, declare expected evidence | Independent audit verdict |
| Artifact | `iaa-wave-record-*.md ## PRE-BRIEF` | `iaa-wave-record-*.md ## TOKEN` |
| Token | None (advisory) | `PHASE_B_BLOCKING_TOKEN: IAA-...-PASS` |
| Satisfies ASSURANCE_LOCK | ❌ No | ✅ Yes (when non-PENDING) |

### Failure behavior

```text
ASSURANCE_LOCK: FAIL
Reason: PHASE_B_BLOCKING_TOKEN is PENDING / missing / against stale head
Owner: IAA (to issue token), Foreman (to invoke and verify)
Next action: Re-invoke IAA via Phase 4 Step 4.3b
             Do not proceed to merge gate until token is non-PENDING and HEAD-current
RESULT: STOP_AND_FIX
```

---

## LOCK 4 — HANDOVER LOCK

### When applies

Unconditional — every wave, every PR, before any closure language.

### Required artifact

A current-head pre-handover checkpoint that returns:

```text
HANDOVER_ALLOWED: yes
RESULT: HANDOVER_ALLOWED
```

The checkpoint must be:
- Non-mutating (no commits after the checkpoint trigger)
- Current to the final PR head (HEAD at time of checkpoint = final HEAD)
- Posted as a PR comment via `.github/workflows/pre-handover-checkpoint.yml`

### Closure language prohibited without HANDOVER_ALLOWED: yes

The following language is PROHIBITED until the checkpoint returns `HANDOVER_ALLOWED: yes`:

```text
handover
merge-ready
ready for review
ready for merge
complete
done
LGTM
ship it
release
PASS (as a final verdict)
```

### Owner by role

| Role | Responsibility |
|------|---------------|
| Foreman | Trigger checkpoint at Phase 4 Step 4.3a |
| ECAP | Verify checkpoint result is present and current in PREHANDOVER proof |
| IAA | Verify HANDOVER_ALLOWED: yes before issuing final token |

### Failure behavior

```text
HANDOVER_LOCK: FAIL
Reason: No current-head checkpoint / checkpoint is stale / checkpoint returned HANDOVER_BLOCKED
Owner: Foreman (to trigger checkpoint via /pre-handover-checkpoint)
Next action: Trigger a fresh checkpoint at current HEAD
             Wait for HANDOVER_ALLOWED: yes before any closure language
RESULT: STOP_AND_FIX
```

---

## STOP_AND_FIX-Only Output Protocol

When any lock fails, Foreman MUST:

1. Output `STOP_AND_FIX` immediately.
2. Name the failing lock(s).
3. State the owner of the required artifact for each failing lock.
4. State the specific next action for each failing lock.
5. Cease ALL closure language.
6. Record the failure in session memory.
7. Update wave-current-tasks.md with failure state.

Use template: `governance/templates/foreman/FOREMAN_STOP_AND_FIX_RESPONSE.template.md`

No other output is permitted when a lock fails. Do not provide partial analysis, progress notes,
or status summaries that could be interpreted as progress toward closure.

---

## Execution Lock Status Record

Before proceeding to Phase 4, Foreman MUST complete and commit a lock status record.

**Template**: `governance/templates/foreman/FOREMAN_EXECUTION_LOCK_STATUS.template.md`

This record must be referenced in the PREHANDOVER proof.

---

## Relationship to Existing Gates

The execution locks are **earlier** enforcement than the existing CI gates:

| Gate | When runs | Lock mapped |
|------|-----------|-------------|
| `preflight/scope-declaration-parity` | CI on PR push | START_LOCK (scope declaration) |
| `preflight/iaa-final-assurance` | CI on PR push | ASSURANCE_LOCK |
| `preflight/ecap-admin-ceremony` | CI on PR push | HANDOVER_LOCK (via ECAP) |
| `handover-claim-gate` | CI on PR push | HANDOVER_LOCK (language gate) |
| `foreman-start-lock` (NEW) | CI on PR push | START_LOCK (orchestration record) |

The locks are Foreman's **behavioral enforcement** (pre-CI). The CI gates are **confirmatory**.
CI catching a failure means Foreman failed the lock earlier — this is a FAIL-ONLY-ONCE candidate.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-05-10 | Initial creation — issue #1593, contract 2.16.0 |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Issue**: #1593
**Living Agent System**: v6.2.0
