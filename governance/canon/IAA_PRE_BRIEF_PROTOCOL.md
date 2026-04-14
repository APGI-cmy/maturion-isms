# IAA PRE-BRIEF PROTOCOL

**Status**: CANONICAL | **Version**: 1.2.2 | **Authority**: CS2  
**Date**: 2026-03-03  
**Amended**: 2026-03-03 — v1.1.0: Added §Wave Checklist Management, §Foreman Handover Gate,
§IAA Invocation Gate, §Mid-Wave Task Addition, wave_checklist PREHANDOVER field, and commit
discipline requirements  
**Amended**: 2026-04-05 — v1.2.0: Added §Wave Checklist Invocation Gate — Applicability Scope
clarifying that the Wave Checklist Invocation Gate applies to Foreman-governed wave execution
and does not automatically apply to direct-CS2 standalone governance-repo-administrator-v2
canon actions (CS2 guidance — issue #1319)  
**Amended**: 2026-04-08 — v1.2.1: Reference update — added `EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` to references; clarified that Phase 4 handover proof may be prepared by `execution-ceremony-admin-agent` under Foreman oversight without affecting IAA independence or Pre-Brief validity; authority: CS2 — ECAP-001 canon establishment issue.
**Amended**: 2026-04-08 — v1.2.2: Re-invocation ownership cross-reference — added §Re-Invocation After Rejection — Ownership Reference, clarifying that after a `REJECTION-PACKAGE` the Foreman (not CS2) owns the stop-and-fix loop and re-invocation; cross-references INDEPENDENT_ASSURANCE_AGENT_CANON.md §IAA Re-Invocation After Rejection for full rules. Authority: CS2 — Foreman IAA re-invocation ownership canonisation issue.

---

## Purpose

Defines the **IAA Pre-Brief Protocol** — a proactive assurance mechanism that shifts quality
assurance left by declaring acceptance criteria at wave start rather than at final handover.

At the beginning of every wave, once the Foreman has created and populated
`wave-current-tasks.md`, the IAA is invoked to read the task list and generate a **Pre-Brief**
artifact. The Pre-Brief declares, per task, the exact assurance requirements the IAA will check
at handover. Submitting agents receive these criteria before building, eliminating iterative
reject-fix-reject cycles caused by late discovery of assurance expectations.

> **Amendment Authority**: Only CS2 (Johan Ras / repo owner) may amend this canon. Any PR
> modifying this file without CS2 sign-off is auto-FAIL at the merge gate.

---

## Problem Statement

The current IAA protocol operates exclusively as an end-of-wave binary gate. Submitting agents
learn about assurance expectations only when the IAA issues a `REJECTION-PACKAGE` at handover,
leading to:

- **Iterative rejection cycles** — agents repeat work after discovering missing evidence requirements
- **Late-stage surprises** — agents build without knowing which ceremony artifacts, overlays, or
  compliance rules the IAA will check
- **Alignment gap** — the Foreman and builders cannot self-verify compliance before handover
  if the acceptance bar is implicit

As AI CS2 autonomy increases and human oversight decreases, implicit assurance expectations
become unsustainable. The Pre-Brief Protocol makes acceptance criteria machine-checkable at
wave start.

---

## Trigger

The IAA Pre-Brief is triggered **once per wave**, immediately after the Foreman creates and
populates the wave task list artifact (`wave-current-tasks.md` or equivalent). The Foreman
invokes the IAA via the standard `task(agent_type: "independent-assurance-agent")` tool call
with a `PRE-BRIEF` action flag.

**Trigger conditions** (all must be true):
1. Foreman has created the wave task list artifact for the current wave
2. The wave task list contains at least one qualifying task (per §Qualifying Tasks below)
3. No Pre-Brief already exists for this wave number

If the IAA tool call fails or is unavailable, the Foreman records `PHASE_A_ADVISORY` status
and the Pre-Brief is deferred until IAA is accessible. Wave execution **may proceed** in
`PHASE_A_ADVISORY` mode, but Pre-Brief must be completed before the first qualifying PR opens
for review.

---

## Qualifying Tasks

A task qualifies for Pre-Brief coverage if it would trigger IAA assurance at handover per the
IAA Trigger Table in `INDEPENDENT_ASSURANCE_AGENT_CANON.md §Trigger Table`. Specifically:

| Task Category | Qualifies? |
|---------------|-----------|
| AAWP deliverable | YES |
| MAT deliverable | YES |
| Core agent file update | YES |
| Agent contract update | YES |
| Canon file update | YES |
| Architecture update | YES |
| Merge gate workflow update | YES |
| Agent-integrity folder update | YES |
| Docs-only task | NO |
| Parking station update | NO |
| Admin / housekeeping task | NO |

---

## Pre-Brief Content Requirements

Each Pre-Brief artifact MUST contain the following sections:

### Header Block

```markdown
# IAA Pre-Brief — Wave <N> — <Wave Description>

**IAA Session**: IAA-<YYYYMMDD>-PREBRIEF-WAVE<N>
**Wave**: <N>
**Date**: YYYY-MM-DD
**Wave Task List**: <path/to/wave-current-tasks.md>
**Authority**: IAA_PRE_BRIEF_PROTOCOL.md v1.0.0
**Status**: ACTIVE
```

### Wave Summary

A concise summary (2–5 sentences) of what the wave aims to deliver, synthesised from the task
list. This gives context for why specific assurance requirements are selected for each task.

### Per-Task Assurance Declaration

For each qualifying task, the Pre-Brief lists:

| Field | Required | Description |
|-------|----------|-------------|
| `task_id` | YES | Unique task identifier from the wave task list |
| `task_summary` | YES | One-sentence summary of what the task delivers |
| `iaa_trigger_category` | YES | Which Trigger Table row applies |
| `required_phases` | YES | Which delivery proof phases (1–4) are required |
| `required_evidence_artifacts` | YES | Explicit list of artifact paths the IAA will check |
| `applicable_overlays` | YES | Which category overlays apply (from `iaa-category-overlays.md`) |
| `specific_rules` | NO | Named compliance rules (e.g., CORE-018, INV-409) the IAA will check |
| `notes` | NO | Additional context or caveats specific to this task |

### Pre-Brief Footer

```markdown
## Declaration

The requirements listed above are the acceptance criteria the IAA will verify at handover.
Meeting all criteria listed is necessary (but not sufficient) for an ASSURANCE-TOKEN.
The IAA retains intelligence-led assessment authority and may identify additional issues
discovered during review not listed here.

**IAA signature**: IAA-<YYYYMMDD>-PREBRIEF-WAVE<N>
```

---

## Storage Location

Pre-Brief artifacts are stored at:

```
.agent-admin/assurance/iaa-prebrief-wave<N>.md
```

Where `<N>` is the zero-padded wave number (e.g., `iaa-prebrief-wave09.md`).

If a wave has a descriptive identifier rather than a number, use:

```
.agent-admin/assurance/iaa-prebrief-<wave-slug>.md
```

Pre-Brief artifacts are **immutable** once published. If task scope changes materially after
publication, the Foreman must request a **Pre-Brief Amendment** (see §Pre-Brief Amendment
below).

---

## Merge Gate Enforcement

The following conditions are merge-blockers for any PR from a wave that has qualifying tasks:

| Condition | Blocker | Resolution |
|-----------|---------|-----------|
| Pre-Brief artifact missing for a wave with qualifying tasks | YES | Foreman invokes IAA to generate Pre-Brief |
| Pre-Brief not referenced in Foreman's PREHANDOVER proof | YES | Foreman adds Pre-Brief reference using required `wave_checklist` block |
| `wave-current-tasks.md` checklist absent | YES | Foreman creates checklist at canonical path |
| Checklist has `[ ]` tasks with no `[~]` annotation | YES | Builder completes task and Foreman ticks after QP PASS, or Foreman annotates as `[~]` with reason |
| `wave_checklist` block absent from PREHANDOVER proof | YES | Foreman adds required block (§Foreman Handover Gate — PREHANDOVER Proof Template) |
| `wave_checklist.status` ≠ `ALL_TICKED` in PREHANDOVER proof | YES | Resolve all unticked tasks |
| A `[~]` entry has no reason in `notes` | YES | Foreman adds mandatory reason |
| At handover, a declared Pre-Brief requirement is not met | YES | Submitting agent resolves gap; IAA re-assesses |
| Pre-Brief was generated but marked `SUPERSEDED` without a replacement | YES | Generate replacement Pre-Brief Amendment |
| Mid-wave qualifying task added without Pre-Brief Amendment | YES | Foreman requests Pre-Brief Amendment from IAA |

The IAA **must** cross-reference the active Pre-Brief at handover and report:
- Which declared requirements were met (✅)
- Which declared requirements were not met (❌) — each becomes a `REJECTION-PACKAGE` finding

---

## Pre-Brief Amendment

If the wave task scope changes materially after the Pre-Brief is published (tasks added,
removed, or substantially redesigned), the Foreman must:

1. Note the scope change in the wave task list
2. Invoke IAA for a Pre-Brief Amendment via `task(agent_type: "independent-assurance-agent")`
   with action flag `PRE-BRIEF-AMEND`
3. IAA generates an amendment artifact at:
   `.agent-admin/assurance/iaa-prebrief-<wave-slug>-amend<M>.md`
   where `M` is the amendment number (01, 02, …)
4. The original Pre-Brief is marked `SUPERSEDED` with a reference to the amendment
5. The amendment becomes the active Pre-Brief for assurance purposes

Minor scope changes (e.g., file paths corrected, typo fixes in descriptions) do not require
an amendment. The IAA uses judgment about materiality.

---

## Wave Checklist Schema

The `wave-current-tasks.md` is the Foreman's authoritative record of all tasks planned for a
wave. It is a living document updated as work progresses and a mandatory handover artifact.

### File Location and Naming

```
.agent-admin/waves/wave-<N>-current-tasks.md
```

Where `<N>` is the zero-padded wave number (e.g., `wave-09-current-tasks.md`). For waves with
a descriptive slug, the file may be named `wave-<slug>-current-tasks.md`.

The Foreman references this canonical path in all wave planning and handover artifacts. A
symlink or alias at `.agent-admin/waves/wave-current-tasks.md` pointing to the current wave
file is permitted.

### Per-Task Schema

Each task in `wave-current-tasks.md` MUST be structured as a single checklist line followed
by an indented metadata block:

```markdown
- [ ] TASK-<WAVE>-<SEQ> — <description>
      builder: <builder-agent-id>
      qp_verdict: PENDING | PASS | DESCOPED | DEFERRED
      notes: <optional free text>
```

| Field | Required | Values | Description |
|-------|----------|--------|-------------|
| `tick status` | YES | `[ ]` / `[x]` / `[~]` | `[ ]` = in progress; `[x]` = QP PASS confirmed; `[~]` = descoped or deferred |
| `TASK-<WAVE>-<SEQ>` | YES | e.g., `TASK-10-001` | Unique task identifier, wave-scoped |
| `description` | YES | Free text | One-sentence description of the task deliverable |
| `builder` | YES | Agent ID or `TBD` | Builder agent assigned to the task |
| `qp_verdict` | YES | `PENDING` \| `PASS` \| `DESCOPED` \| `DEFERRED` | QP evaluation outcome |
| `notes` | NO | Free text | Optional context, links, or caveats |

### Checklist Tick States

| Symbol | Meaning | When to Set |
|--------|---------|-------------|
| `[ ]` | In progress or not started | Initial state for all tasks |
| `[x]` | Complete — QP PASS confirmed | Set by Foreman only after QP PASS is on record |
| `[~]` | Descoped or deferred | Set by Foreman with mandatory reason in `notes` |

**Prohibited**: Removing a task line from the checklist at any point. Silent removal is a
governance violation equivalent to modifying evidence in-place.

### Example Checklist

```markdown
# Wave 10 — Agent Registry Harmonisation — Task Checklist

**Wave**: 10
**Foreman**: foreman-v2
**IAA Pre-Brief**: .agent-admin/assurance/iaa-prebrief-wave10.md
**Status**: IN PROGRESS

---

- [x] TASK-10-001 — Update foreman-v2.agent.md job_environment fields
      builder: codex-advisor-agent
      qp_verdict: PASS
      notes: PR #1291 — merged 2026-03-03

- [ ] TASK-10-002 — Add IAA_REGISTRY_ALIGNMENT_CANON.md
      builder: governance-repo-administrator-v2
      qp_verdict: PENDING
      notes:

- [~] TASK-10-003 — Update consumer repo registry entries
      builder: governance-repo-administrator-v2
      qp_verdict: DESCOPED
      notes: Deferred to Wave 11 — consumer repo out of sync; CS2 informed 2026-03-03
```

---

## Foreman Wave Checklist Management

### Creating the Checklist

The Foreman MUST create `wave-current-tasks.md` **before** invoking the IAA for a Pre-Brief.
The Pre-Brief is generated from the populated task list; an empty or unpopulated checklist
cannot serve as the Pre-Brief input.

**Creation checklist** (Foreman, FM_H):

1. Create file at `.agent-admin/waves/wave-<N>-current-tasks.md`
2. Populate all known tasks for the wave with schema-compliant entries
3. Set all `qp_verdict` values to `PENDING` and tick status to `[ ]`
4. Commit file to the PR branch
5. Invoke IAA for Pre-Brief (see §Trigger above)

### Ticking Tasks

The Foreman MUST update the checklist each time a builder completes a task and hands it back
for QP evaluation:

1. Foreman conducts QP (Quality Professor) evaluation of the builder's work
2. If QP verdict is **PASS**:
   - Update the task line: `[ ]` → `[x]` and `qp_verdict: PENDING` → `qp_verdict: PASS`
   - Commit the updated file to the PR branch using the standardised message (see §Commit
     Discipline below)
3. If QP verdict is **NOT PASS**: the task remains `[ ]`; builder is reassigned

**PROHIBITED**:
- Ticking a task `[x]` without a QP PASS verdict on record in session memory
- Batch-ticking multiple tasks in a single commit (one tick = one commit)
- Pre-ticking tasks before builder work is complete

### Descoping and Deferring Tasks

If a task is removed from scope or deferred to a later wave, the Foreman MUST:

1. Update tick status to `[~]`
2. Update `qp_verdict` to `DESCOPED` or `DEFERRED`
3. Add mandatory reason in `notes` (e.g., "DESCOPED — requirement withdrawn by CS2 2026-03-03")
4. Commit with message: `chore(wave-<N>): descope task-<ID> — <reason>`
5. If the descoped task had a Pre-Brief entry, invoke IAA for a Pre-Brief Amendment (see
   §Pre-Brief Amendment)

### Commit Discipline

Each checklist update MUST be committed as a **discrete commit** with a standardised message:

| Commit Type | Message Format | Example |
|------------|----------------|---------|
| Task tick (QP PASS) | `chore(wave-N): tick TASK-N-SEQ — QP PASS` | `chore(wave-10): tick TASK-10-001 — QP PASS` |
| Task descoped | `chore(wave-N): descope TASK-N-SEQ — <reason>` | `chore(wave-10): descope TASK-10-003 — deferred to wave-11` |
| Task deferred | `chore(wave-N): defer TASK-N-SEQ — <reason>` | `chore(wave-10): defer TASK-10-004 — blocked on upstream` |
| New task added | `chore(wave-N): add TASK-N-SEQ to checklist` | `chore(wave-10): add TASK-10-005 to checklist` |

Combining a task tick with other file changes in the same commit is permitted only if the
other changes are directly required by the QP evaluation (e.g., updating a session memory
file that records the QP verdict). All other unrelated file changes must be in separate
commits.

---

## Foreman Handover Gate

The `wave-current-tasks.md` checklist is a **mandatory handover artifact**. The Foreman
MUST NOT open a PR or proceed to IAA invocation until all handover gate conditions are met.

### Handover Gate Conditions (all must be true)

| Condition | Check | Blocker |
|-----------|-------|---------|
| Checklist file exists at canonical path | `ls .agent-admin/waves/wave-<N>-current-tasks.md` | YES |
| All qualifying tasks are `[x]` or `[~]` | No `[ ]` lines remain unless explicitly annotated | YES |
| Every `[~]` line has a `notes` entry with reason | Inspect each `[~]` entry | YES |
| Every `[x]` has a QP PASS record in session memory | Session memory review | YES |
| IAA Pre-Brief artifact exists for the wave | `ls .agent-admin/assurance/iaa-prebrief-wave<N>.md` | YES |
| All qualifying tasks appear in both checklist and Pre-Brief | Cross-reference | YES |

### PREHANDOVER Proof Template — Required Fields

The Foreman's PREHANDOVER proof MUST include a `wave_checklist` section:

```markdown
## Wave Checklist

wave_checklist: .agent-admin/waves/wave-<N>-current-tasks.md
status: ALL_TICKED | PARTIALLY_TICKED | BLOCKED
pending: none | [list of task IDs still in [ ] state]
descoped: none | [list of task IDs marked [~] with reasons]
iaa_prebrief: .agent-admin/assurance/iaa-prebrief-wave<N>.md
prebrief_status: ACTIVE | SUPERSEDED (ref: <amendment path>)
```

`status: ALL_TICKED` means all qualifying tasks are either `[x]` or `[~]` with documented
reasons. Any other status BLOCKS handover.

If `pending` is non-empty and items are not explicitly descoped: **handover is BLOCKED**.

---

## IAA Invocation Gate

The IAA MUST NOT begin assurance execution unless the wave checklist gate is cleared. This
gate is a **hard prerequisite**, applied as Step 2.4 immediately after PR classification
(Step 2.3) and before any Phase 3 assurance execution.

### Applicability Scope

> **v1.2.0 Amendment — CS2 guidance issue #1319**

The Wave Checklist Invocation Gate **applies to Foreman-governed wave execution** and **does
not automatically apply** to direct-CS2 standalone governance-repo-administrator-v2 canon
actions.

| Execution Context | Wave Checklist Gate Applies? |
|------------------|------------------------------|
| Foreman-governed wave execution (any wave, any repo) | **YES — mandatory** |
| Direct-CS2 standalone governance-repo-administrator-v2 canon action | **NO — exempt by default** |
| Explicit CS2 instruction to apply checklist gate for a specific GA session | **YES — follows CS2 instruction** |

**Rationale**: The Wave Checklist Invocation Gate is a discipline control for **Foreman-governed
wave delivery**, where wave checklist management is part of structured, multi-task execution.
The governance-repo-administrator-v2 performing a **standalone canon/governance action under
direct CS2 mandate** operates in a different governance context — the canon action itself is
the CS2-authorized unit of work, not a sub-task within a Foreman wave.

**Important Constraints on the Exemption**:
- This exemption does **NOT** weaken or bypass IAA assurance invocation at handover (Rule A-09
  in the GA FAIL-ONLY-ONCE registry still applies)
- This exemption does **NOT** apply to GA sessions that are operating as builders within a
  Foreman-governed wave — in those cases, the standard Foreman wave checklist obligations apply
- CS2 may explicitly invoke the wave checklist gate for any specific GA standalone session by
  stating so in the CS2 mandate that authorizes the work
- The exemption applies only to the **wave checklist** gate check; all other IAA invocation
  requirements (evidence artifacts, prehandover proof, ASSURANCE-TOKEN recording) remain fully
  mandatory for GA standalone sessions

### Gate Conditions (each independently triggers REJECTION-PACKAGE if failed)

| Condition | Failure Action |
|-----------|---------------|
| `wave-current-tasks.md` checklist is absent | Immediate REJECTION-PACKAGE — `CHECKLIST-GATE-001` |
| Checklist has one or more `[ ]` tasks with no `[~]` annotation | Immediate REJECTION-PACKAGE — `CHECKLIST-GATE-002` |
| Checklist not referenced in the PREHANDOVER proof | Immediate REJECTION-PACKAGE — `CHECKLIST-GATE-003` |
| `wave_checklist.status` in PREHANDOVER proof is not `ALL_TICKED` | Immediate REJECTION-PACKAGE — `CHECKLIST-GATE-004` |

"Immediate REJECTION-PACKAGE" means: the IAA halts all further assurance review and issues
the REJECTION-PACKAGE at this step, citing the specific gate condition code. No partial
assessment of other phases occurs before the checklist gate is cleared.

### Pre-Brief Cross-Reference (Applied During Step 3.5 / Phase 4 Review)

Once the checklist gate is cleared, the IAA MUST cross-reference the active Pre-Brief against
the checklist during handover proof review:

- Every task declared in the Pre-Brief MUST appear in the checklist
- Every qualifying task in the checklist MUST have a corresponding Pre-Brief entry
- Any task present in the checklist but absent from the Pre-Brief is flagged as a
  `CHECKLIST-GATE-005` finding (non-blocking if task was added after Pre-Brief and a
  Pre-Brief Amendment was generated; blocking if no amendment exists)

---

## Mid-Wave Task Addition

If a task is added to the wave scope after the Pre-Brief is published:

1. Foreman adds the task to `wave-current-tasks.md` with tick status `[ ]`
2. Foreman commits with message: `chore(wave-<N>): add TASK-<N>-<SEQ> to checklist`
3. Foreman requests a Pre-Brief Amendment via IAA invocation with `PRE-BRIEF-AMEND` action
4. IAA generates an amendment at `.agent-admin/assurance/iaa-prebrief-wave<N>-amend<M>.md`
5. The original Pre-Brief is marked `SUPERSEDED` by the IAA with a reference to the amendment
6. The amendment becomes the active Pre-Brief; the PREHANDOVER proof must reference the amendment

If the Foreman adds a task to the checklist without a corresponding Pre-Brief Amendment, the
IAA will flag a `CHECKLIST-GATE-005` finding at handover.

**Late-addition tasks that are non-qualifying** (docs-only, parking station, admin) do NOT
require a Pre-Brief Amendment — the Foreman must annotate these with `notes: NON-QUALIFYING`
in the checklist.

---

## Cross-Agent Interactions

### IAA Obligations

- The IAA **MUST** generate a Pre-Brief when invoked by the Foreman with `PRE-BRIEF` action
- The IAA **MUST** apply the Wave Checklist Invocation Gate (§IAA Invocation Gate) as a hard
  prerequisite before beginning any assurance execution — a failing gate condition triggers
  immediate REJECTION-PACKAGE citing the specific gate code (CHECKLIST-GATE-001 to -005)
- The IAA **MUST** cross-reference the active Pre-Brief against the checklist during handover
  proof review and report per-requirement and per-task status
- The IAA **MUST NOT** silently apply requirements not declared in the Pre-Brief without noting
  them as intelligence-led additions
- The IAA **MUST** mark the Pre-Brief as `SUPERSEDED` when a valid amendment replaces it
- The IAA **MUST** generate Pre-Brief Amendments when invoked with `PRE-BRIEF-AMEND` action
  after a mid-wave task addition

### Foreman Obligations

- The Foreman **MUST** create `wave-current-tasks.md` in schema-compliant format **before**
  invoking the IAA for a Pre-Brief
- The Foreman **MUST** invoke the IAA for a Pre-Brief after populating the wave task list for
  any wave containing qualifying tasks
- The Foreman **MUST** reference both the checklist (`wave_checklist`) and the Pre-Brief in
  the PREHANDOVER proof using the required template fields (§Foreman Handover Gate)
- The Foreman **MUST** tick tasks using `[x]` only after a QP PASS verdict is on record, and
  commit each tick as a discrete commit with the standardised message (§Commit Discipline)
- The Foreman **MUST** annotate descoped/deferred tasks with `[~]` and a mandatory reason;
  silent removal is PROHIBITED
- The Foreman **MUST** request a Pre-Brief Amendment for any mid-wave qualifying task addition
- The Foreman **MUST** communicate the Pre-Brief to all builders assigned to the wave

### Builder Obligations

- Builders **SHOULD** review the wave Pre-Brief before beginning implementation
- Builders **MUST** verify their handover proof addresses each Pre-Brief requirement that
  applies to their task before submitting

---

## Example Pre-Brief

```markdown
# IAA Pre-Brief — Wave 10 — Agent Registry Harmonisation

**IAA Session**: IAA-20260303-PREBRIEF-WAVE10
**Wave**: 10
**Date**: 2026-03-03
**Wave Task List**: .agent-admin/waves/wave-10-tasks.md
**Authority**: IAA_PRE_BRIEF_PROTOCOL.md v1.0.0
**Status**: ACTIVE

---

## Wave Summary

Wave 10 harmonises agent registry files across the canonical governance repo and two consumer
repos. It modifies three agent contract files, updates the INTEGRITY_INDEX, and creates a new
canon file for registry alignment. No application code is touched.

---

## Task: TASK-10-001 — Harmonise foreman-v2.agent.md

**Summary**: Update foreman-v2.agent.md to align job_environment fields with canonical pattern.  
**IAA Trigger Category**: Core agent file update  
**Required Phases**: 1 (Preflight), 2 (Governance), 3 (Working), 4 (Handover)  
**Required Evidence Artifacts**:
- `.agent-admin/evidence/preflight-proof-<PR#>.md` — must name the submitting agent and cite
  contract version
- `.agent-admin/evidence/governance-proof-<PR#>.md` — must cite LIVING_AGENT_SYSTEM.md v6.2.0
  and confirm canon hash verification
- `.agent-admin/evidence/working-proof-<PR#>.md` — must document why specific fields were
  changed and reference CODEX_ADVISOR_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md
- `.agent-admin/prehandover/prehandover_proof_<PR#>_<date>.md` — must confirm GREEN status,
  OPOJD, and all gate parity checks

**Applicable Overlays**: OVD-001 (Agent Contract Update), OVG-001–OVG-005 (Agent Integrity
Deep Checks per Overlay G)  
**Specific Rules**: CORE-018 (complete evidence sweep), INV-409 (PR must not be DRAFT)  
**Notes**: SELF-ASSURANCE-001 does not apply as this PR does not modify the IAA contract file.

---

## Task: TASK-10-002 — Add IAA_REGISTRY_ALIGNMENT_CANON.md

**Summary**: Create new canon file defining registry alignment requirements.  
**IAA Trigger Category**: Canon file update  
**Required Phases**: 1, 2, 3, 4  
**Required Evidence Artifacts**:
- All standard evidence artifacts (preflight, governance, working, prehandover)
- `.agent-admin/governance/ripple-executed-*.json` — canon update triggers ripple; evidence
  of ripple execution required

**Applicable Overlays**: OVD-002 (Canon File Update)  
**Specific Rules**: REQ-CM-001 (no placeholder hashes in CANON_INVENTORY after update)  
**Notes**: CANON_INVENTORY.json must be updated in the same PR with correct SHA256 hash for
the new canon file. Placeholder hash will fail alignment gate.

---

## Declaration

The requirements listed above are the acceptance criteria the IAA will verify at handover.
Meeting all criteria listed is necessary (but not sufficient) for an ASSURANCE-TOKEN.
The IAA retains intelligence-led assessment authority and may identify additional issues
discovered during review not listed here.

**IAA signature**: IAA-20260303-PREBRIEF-WAVE10
```

---

## Integration with Existing IAA Phases

The Pre-Brief Protocol introduces a new **Phase 0** that precedes the existing five-phase
delivery proof protocol, and a **Wave Checklist Invocation Gate** that precedes Phase 3
assurance execution:

| Phase | Name | Timing | Artifact |
|-------|------|--------|----------|
| Phase 0 | Pre-Brief | Wave start — before building begins | `iaa-prebrief-wave<N>.md` |
| Checklist Gate | Wave Checklist Invocation Gate | IAA session — before Phase 3 | `wave-<N>-current-tasks.md` + `wave_checklist` PREHANDOVER block |
| Phase 1 | Preflight Proof | Per PR — before build | `preflight-proof-<PR#>.md` |
| Phase 2 | Governance Proof | Per PR — before build | `governance-proof-<PR#>.md` |
| Phase 3 | Working Phase Proof | Per PR — during/after build | `working-proof-<PR#>.md` |
| Phase 4 | Handover Proof | Per PR — before IAA invocation | `prehandover_proof_<PR#>.md` |
| Phase 5 | Assurance Invocation | Per PR — final gate | `assurance-token-<PR#>.md` or `rejection-package-<PR#>.md` |

Phase 0 is the IAA's proactive declaration at wave start. The Checklist Gate is applied at
IAA session start (Step 2.4) before any Phase 3 execution — a failing gate triggers immediate
REJECTION-PACKAGE. Phases 1–4 are the submitting agent's delivery evidence. Phase 5 is the
IAA's final verdict, which cross-references Phase 0 (Pre-Brief) and the wave checklist.

---

## Re-Invocation After Rejection — Ownership Reference (v1.2.2)

When a Foreman-led handover receives a `REJECTION-PACKAGE`, the **Foreman** (not CS2) owns
the correction and re-invocation cycle. The Pre-Brief Invocation Gate (§IAA Invocation Gate)
and the Wave Checklist obligations remain in full force on re-invocation — the Foreman must
ensure the checklist and Pre-Brief references are correct before re-invoking.

**Key rule**: A Foreman-led PR MUST NOT state or imply "CS2 must re-invoke IAA" or
"re-invocation by CS2 is required before merge" outside a canon-defined CS2-only exception
class.

**Allowed wording** for rejection-cycle artifacts:

- "IAA issued `REJECTION-PACKAGE`; Foreman correcting cited failures; re-invocation pending"
- "Fresh `ASSURANCE-TOKEN` required before merge — Foreman to correct and re-invoke"

**Full specification** (governing sentence, ownership table, CS2-only exception classes,
token/session format, prohibited wording, worked example):

> `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` §IAA Re-Invocation After Rejection — Foreman Ownership

---

## References

- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.5.0 — IAA class definition, trigger table, and IAA re-invocation ownership rules
- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0 — Living Agent framework
- `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` v1.3.0 — Foreman authority model, §14.5 IAA Rejection Stop-and-Fix Loop
- `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` — Evidence artifact requirements
- `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` v1.0.0 — Ceremony admin role; Phase 4 handover proof may be prepared by execution-ceremony-admin-agent under Foreman oversight; IAA independence and Pre-Brief validity are unchanged
- `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` — Overlay definitions
- `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md` — Trigger table
- `governance/CANON_INVENTORY.json` — Canon hash registry

---

*Authority: CS2 (Johan Ras) | Version: 1.2.2 | Effective: 2026-04-05 (v1.2.0) | Amended: 2026-04-08 (v1.2.2) | Previous: 2026-04-08 (v1.2.1) | Original: 2026-03-03 (v1.1.0)*
