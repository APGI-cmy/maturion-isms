# IAA Pre-Brief — Wave GovImpr
# IAA Governance & Template Improvements (A-028, Token Date, Test Fallbacks, OVL-CI-006)

**Artifact Type**: IAA Pre-Brief (Phase 0 output)
**Wave**: Wave GovImpr
**Branch**: `copilot/update-iaa-governance-templates`
**IAA Session**: session-154
**Date**: 2026-03-05
**IAA Agent Version**: independent-assurance-agent v6.2.0
**Invocation Trigger**: `IAA_PRE_BRIEF_PROTOCOL.md §Trigger` — Foreman wave-current-tasks.md
**CS2 Authorization**: Issue opened and assigned by @APGI-cmy directly
**Status**: ISSUED — builders may proceed
**Pre-Brief Phase Mode**: PHASE_B_BLOCKING (verdicts at handover are hard-blocking)

---

## Pre-Brief Summary

This Pre-Brief covers 5 tasks in Wave GovImpr. After classification, **4 tasks are QUALIFYING**
(require IAA at handover) and **1 task is conditionally QUALIFYING** (individually doc-only but
bundled into the same PR as triggering tasks — subject to the same PREHANDOVER ceremony).

**Overall PR Classification**: MIXED (KNOWLEDGE_GOVERNANCE + CI_WORKFLOW)
**IAA Triggered at Handover**: YES — MANDATORY (PHASE_B_BLOCKING)
**Phases Required at Handover**: ALL (Phase 1 through Phase 4)

---

## Task Classification Table

| Task ID | Description | IAA Trigger Category | Qualifying? | Trigger Rule |
|---------|-------------|---------------------|-------------|--------------|
| TASK-GI-001 | Update FAIL-ONLY-ONCE.md v2.6.0→v2.7.0 (Foreman Tier 2) | KNOWLEDGE_GOVERNANCE | ✅ YES | `.agent-workspace/*/knowledge/` file modified — trigger table step 6 |
| TASK-GI-002 | Update prehandover-template.md v1.4.0→v1.5.0 (Foreman Tier 2) | KNOWLEDGE_GOVERNANCE | ✅ YES | `.agent-workspace/*/knowledge/` file modified — trigger table step 6 |
| TASK-GI-003 | Update mat-specialist Tier 2 knowledge — IAA token date note | KNOWLEDGE_GOVERNANCE | ✅ YES | `.agent-workspace/*/knowledge/` file modified — trigger table step 6 |
| TASK-GI-004 | Update README-LIVENESS.md — env var WARNING blocks | DOC-ONLY (bundled) | ✅ YES (bundled) | Individually EXEMPT (doc-only README); bundled with QUALIFYING tasks → MIXED PR → MANDATORY |
| TASK-GI-005 | Add permissions blocks to 2 workflows (OVL-CI-006 compliance) | CI_WORKFLOW | ✅ YES | `.github/workflows/` files modified — trigger table step 3 |

**AMBIGUITY RULE applied to TASK-GI-004**: Individually this README change would be EXEMPT
(doc-only, no agent/governance/CI content). However, per trigger table MIXED category rule and
FAIL-ONLY-ONCE A-003, since this task is delivered in the same PR as QUALIFYING tasks, the full
IAA ceremony applies to the PR bundle. TASK-GI-004 adds no additional overlay requirements
beyond what the other tasks already require.

---

## Per-Task IAA Audit Requirements at Handover

---

### TASK-GI-001 — FAIL-ONLY-ONCE.md (Foreman Tier 2) v2.6.0→v2.7.0

**File**: `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`
**Builder**: governance-liaison-isms-agent
**IAA Trigger Category**: KNOWLEDGE_GOVERNANCE
**Required IAA Phases**: 1, 2, 3 (KNOWLEDGE_GOVERNANCE overlay), 4

**Specific Checks IAA Will Execute at Handover**:

| Check ID | Check Name | What IAA Will Look For |
|----------|------------|------------------------|
| CERT-001 | PREHANDOVER proof exists | File present on branch |
| CERT-002 | Session memory exists | File present on branch |
| CERT-003 | FAIL-ONLY-ONCE attestation | Producing agent stated attestation |
| CERT-004 | IAA token field present | `iaa_audit_token` field in PREHANDOVER proof |
| CORE-007 | No placeholder content | No TBD/TODO/FIXME in delivered content (§4.3b expected reference is NOT a violation) |
| CORE-013 | IAA invocation evidence | PREHANDOVER proof references IAA |
| CORE-015 | Session memory present | Session memory path in PREHANDOVER proof |
| CORE-016 | IAA verdict evidenced | Dedicated token file at `.agent-admin/assurance/iaa-token-session-NNN-waveGovImpr-YYYYMMDD.md` |
| CORE-018 | Complete evidence sweep | All ceremony artifacts present before overlay checks |
| CORE-021 | Zero-severity-tolerance | Any finding → REJECTION-PACKAGE |
| OVL-KG-001 | Rule clarity | A-029, A-031, S-017–S-020: each rule stated clearly enough that an agent can apply it without ambiguity. Vague rule = flag with specific sharpening suggestion. |
| OVL-KG-002 | Incident grounding | Each new rule traceable to a real incident or confirmed pattern. A-029 (SCOPE_DECLARATION fresh-overwrite) must cite the incident(s) that motivated it. A-031 (OVL-CI-006 candidate) must note its candidate/pending status. |
| OVL-KG-003 | No duplication | A-029 in Foreman's registry must not duplicate existing rules that already cover SCOPE_DECLARATION fresh-overwrite. S-017–S-020 suggestion entries must not duplicate prior suggestions already recorded. |
| OVL-KG-004 | Cross-reference consistency | If A-029/A-031/S-017–S-020 reference any rule IDs, check IDs, or file paths — those references must actually exist in the repository at time of PR. Dangling refs = REJECTION-PACKAGE. |
| OVL-KG-ADM-002 | Version bumped | `FAIL-ONLY-ONCE.md` header shows v2.7.0 |
| OVL-KG-ADM-003 | Index.md updated | `.agent-workspace/foreman-v2/knowledge/index.md` reflects v2.7.0 for FAIL-ONLY-ONCE.md |

**Required Evidence Artifacts**:
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` at v2.7.0 — committed to branch
- `.agent-workspace/foreman-v2/knowledge/index.md` — updated to reference v2.7.0

**IAA Substantive Focus (90% effort)**:
> IAA will read the new rules A-029, A-031 (candidate), and S-017–S-020. Primary question:
> Will the Foreman agent that reads these rules know exactly what to do? Is A-031's candidate
> status clearly flagged so the Foreman does not enforce a rule that CS2 has not yet formally
> approved? Is the IAA delegation protocol section in Section 1 clear about what
> governance-liaison may update and what requires CS2 approval?

**Notes for Builder**:
- A-031 is a **CANDIDATE** rule pending CS2 approval. It MUST be clearly marked as
  `CANDIDATE — PENDING CS2 APPROVAL` in the rule body. A-031 should NOT be stated as an
  active rule. If it reads like an active rule at handover, OVL-KG-001 FAIL.
- The IAA delegation protocol section must clearly distinguish: (a) governance-liaison may
  update operational knowledge with CS2-authorized content; (b) IAA's own
  `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` is separately
  maintained and must NOT be modified by governance-liaison without explicit CS2 directive
  naming that file.
- A-029 in Foreman's file covers SCOPE_DECLARATION fresh-overwrite (builder operational rule).
  This is distinct from A-029 in IAA's own FAIL-ONLY-ONCE.md (which covers §4.3b
  PREHANDOVER immutability). Builder must not conflate these — both use rule ID A-029 but
  in different registries. IAA will verify the Foreman rule is clearly scoped to foreman
  builder operations.

---

### TASK-GI-002 — prehandover-template.md (Foreman Tier 2) v1.4.0→v1.5.0

**File**: `.agent-workspace/foreman-v2/knowledge/prehandover-template.md`
**Builder**: governance-liaison-isms-agent
**IAA Trigger Category**: KNOWLEDGE_GOVERNANCE
**Required IAA Phases**: 1, 2, 3 (KNOWLEDGE_GOVERNANCE overlay), 4

**Specific Checks IAA Will Execute at Handover**:

| Check ID | Check Name | What IAA Will Look For |
|----------|------------|------------------------|
| CERT-001–004 | Ceremony complete | As per TASK-GI-001 |
| CORE-007 | No placeholder content | No TBD/TODO/FIXME (§4.3b expected reference excluded per A-029) |
| CORE-013, 015, 016, 018, 021 | Standard evidence checks | As per TASK-GI-001 |
| OVL-KG-001 | Rule clarity | SCOPE_DECLARATION note: is the instruction "cat /dev/null > SCOPE_DECLARATION.md" stated as a mandatory pre-step that is unambiguous to follow? IAA token date note: is the instruction about looking up actual token filename clearly actionable? |
| OVL-KG-002 | Incident grounding | SCOPE_DECLARATION note should reference A-028 (stale content rejections incident). Token date note should reference the incident where session date ≠ token file date caused rejection. |
| OVL-KG-003 | No duplication | The fresh-overwrite note must not duplicate existing SCOPE_DECLARATION guidance already in the template. If existing guidance already implies this, the new note should augment and cross-reference, not duplicate. |
| OVL-KG-004 | Cross-reference consistency | If note references A-028 or other rule IDs — those must exist. |
| OVL-KG-ADM-002 | Version bumped | Header shows v1.5.0 |
| OVL-KG-ADM-003 | Index.md updated | `.agent-workspace/foreman-v2/knowledge/index.md` references v1.5.0 |

**Required Evidence Artifacts**:
- `.agent-workspace/foreman-v2/knowledge/prehandover-template.md` at v1.5.0 — committed to branch
- `.agent-workspace/foreman-v2/knowledge/index.md` — updated

**IAA Substantive Focus (90% effort)**:
> IAA will evaluate whether the two new notes (SCOPE_DECLARATION fresh-overwrite + token date)
> are clear enough to prevent the exact failures they are designed to prevent. If a builder
> reads the updated template and the instructions are ambiguous, the update has not achieved
> its purpose. IAA will flag any ambiguity as an OVL-KG-001 finding.

**Notes for Builder**:
- The SCOPE_DECLARATION note should specify: "Before writing new SCOPE_DECLARATION content,
  always begin with `cat /dev/null > SCOPE_DECLARATION.md` (truncates file) then write
  new content — prevents A-028 stale prior-wave entries from persisting."
- The token date note should specify: "Look up the actual `.agent-admin/assurance/iaa-token-session-NNN-*`
  filename. Use the date in that filename — do NOT use the session date. Token date ≠ session
  date in re-invocation scenarios."
- Both notes must be in the appropriate sections of the template (not in version history).

---

### TASK-GI-003 — mat-specialist Tier 2 Knowledge — IAA Token Date Accuracy Note

**Files**: One or more files in `.agent-workspace/mat-specialist/knowledge/`
**Builder**: governance-liaison-isms-agent
**IAA Trigger Category**: KNOWLEDGE_GOVERNANCE
**Required IAA Phases**: 1, 2, 3 (KNOWLEDGE_GOVERNANCE overlay), 4

**Specific Checks IAA Will Execute at Handover**:

| Check ID | Check Name | What IAA Will Look For |
|----------|------------|------------------------|
| CERT-001–004 | Ceremony complete | As per TASK-GI-001 |
| CORE-007, 013, 015, 016, 018, 021 | Standard evidence checks | As per TASK-GI-001 |
| OVL-KG-001 | Rule clarity | Is the token date accuracy note clear and actionable for the mat-specialist agent? Does it state exactly which file to look up and what field to use? |
| OVL-KG-002 | Incident grounding | Note must reference the incident where IAA token date was cited incorrectly (session date used instead of token file date). |
| OVL-KG-003 | No duplication | Check whether any existing mat-specialist knowledge file already covers IAA token referencing. If yes: augment existing file rather than create duplicate note. |
| OVL-KG-004 | Cross-reference consistency | If note references a specific token file path pattern (`.agent-admin/assurance/iaa-token-session-NNN-*`), that pattern must be accurate. |
| OVL-KG-ADM-002 | Version bumped | Modified file(s) have incremented version in their headers |
| OVL-KG-ADM-003 | Index.md updated | If mat-specialist has a knowledge index, it must be updated |

**Required Evidence Artifacts**:
- The specific mat-specialist knowledge file(s) modified — committed to branch
- If mat-specialist has an `index.md` or equivalent — updated version reference

**IAA Substantive Focus (90% effort)**:
> IAA will verify the token date guidance is correct and actionable. The mat-specialist is an
> AAWP-facing builder. When it cites IAA tokens in handover artifacts, it must use the correct
> token filename date. IAA will check whether the guidance makes this unambiguous.

**Notes for Builder**:
- **⚠️ CLARIFICATION REQUIRED BEFORE BUILD**: The mat-specialist knowledge directory currently
  contains: `audit-lifecycle.md`, `compliance-mapping.md`, `criteria-structure.md`,
  `domain-model.md`. None of these are named Tier 2 briefs for IAA token handling.
  governance-liaison must determine:
  (a) Which existing file should receive the IAA token date note (most likely `audit-lifecycle.md`
      or a new operational-notes file), OR
  (b) Whether to create a new `iaa-token-guidance.md` file in the mat-specialist knowledge dir.
  If a new file is created, it must be indexed. If mat-specialist has no formal index.md,
  governance-liaison should create one (or document the addition in any existing index equivalent).
  IAA will apply OVL-KG-ADM-003 — if no index exists and no index is created, IAA will flag
  the missing indexing as a finding.
- Recommendation: Add note to the most relevant existing file AND update/create an index entry.

---

### TASK-GI-004 — README-LIVENESS.md — Env Var WARNING Blocks

**File**: `modules/mat/tests/liveness/README-LIVENESS.md`
**Builder**: qa-builder
**IAA Trigger Category**: DOC-ONLY (EXEMPT individually; bundled → overall PR is MANDATORY)
**Required IAA Phases**: 1, 2, 3 (core ceremony only — no additional overlay), 4

**Specific Checks IAA Will Execute at Handover**:
> Since this task is bundled with KNOWLEDGE_GOVERNANCE and CI_WORKFLOW qualifying tasks in
> the same PR, the standard ceremony checks apply to the overall PR bundle. For this file
> specifically, IAA will verify:

| Check ID | Check Name | What IAA Will Look For |
|----------|------------|------------------------|
| CORE-007 | No placeholder content | No TBD/TODO/FIXME in WARNING blocks |
| CORE-021 | Zero-severity-tolerance | Any factual error in env var names or defaults → REJECTION-PACKAGE |
| Substance review | Accuracy of warnings | Are `BASE_URL` and `LIVENESS_TEST_PASSWORD` correctly named? Is the localhost fallback behaviour accurately described? Is the hardcoded `LivenessTest!2026` password accurately flagged as a production anti-pattern? |

**Required Evidence Artifacts**:
- `modules/mat/tests/liveness/README-LIVENESS.md` — updated, committed to branch
- No additional ceremony artifacts needed for this task specifically

**IAA Substantive Focus (90% effort)**:
> IAA will read the WARNING blocks and verify they are technically accurate. A WARNING that
> misdescribes the fallback behaviour (e.g., wrong env var name, wrong default value) would
> be misleading. If the hardcoded default `LivenessTest!2026` is misspelled or the env var
> `LIVENESS_TEST_PASSWORD` name is incorrect, IAA will flag it.

**Notes for Builder (qa-builder)**:
- Verify the exact env var names by reading the liveness test source files before writing
  the WARNING. Do not rely on the task description alone.
- The WARNING block should include: (1) what happens if `BASE_URL` is not set (silently
  runs against localhost), (2) that `LIVENESS_TEST_PASSWORD` has a hardcoded fallback value
  that must never be used in production, (3) explicit instruction to set both env vars before
  running tests in any non-local environment.
- This task may be delivered in the same PR as governance-liaison tasks or in a separate
  parallel PR. Either approach is acceptable — if separate PR, it is EXEMPT from IAA audit
  (doc-only). If bundled, ceremony applies.

---

### TASK-GI-005 — Workflow Permissions Blocks (OVL-CI-006 Compliance)

**Files**:
- `.github/workflows/copilot-setup-steps.yml`
- `.github/workflows/provider-model-ban.yml`
**Builder**: integration-builder
**IAA Trigger Category**: CI_WORKFLOW
**Required IAA Phases**: 1, 2, 3 (CI_WORKFLOW overlay), 4

**Specific Checks IAA Will Execute at Handover**:

| Check ID | Check Name | What IAA Will Look For |
|----------|------------|------------------------|
| CERT-001–004 | Ceremony complete | As per TASK-GI-001 |
| CORE-007, 013, 015, 016, 018, 021 | Standard evidence checks | As per TASK-GI-001 |
| OVL-CI-001 | Workflow policy correctness | Does `permissions: contents: read` at workflow level actually restrict the token to read-only? Is the placement (before `jobs:`) syntactically correct for workflow-level scope? Does it not accidentally override or conflict with any existing job-level permissions? |
| OVL-CI-002 | Merge gate integrity | No existing checks removed or softened. Adding permissions must not break any existing step. |
| OVL-CI-003 | Silent failure risk | Adding permissions must not introduce a path where the workflow silently fails (e.g., permissions block causing `actions/checkout@v4` to fail if it requires write perms). Verify read permissions are sufficient for all existing steps. |
| OVL-CI-004 | Environment parity | Permissions restriction must behave consistently — no environment-conditional permissions logic. |
| OVL-CI-005 | CI evidence present | PREHANDOVER must include CI check run URL or log snippet confirming both workflows executed successfully post-change. |

**Required Evidence Artifacts**:
- `.github/workflows/copilot-setup-steps.yml` — with `permissions: contents: read` added, committed
- `.github/workflows/provider-model-ban.yml` — with `permissions: contents: read` added, committed
- CI check run URL or log snippet for BOTH workflows post-change (OVL-CI-005 — mandatory)

**IAA Substantive Focus (90% effort)**:
> IAA will verify the permissions blocks do not break the workflows. The primary concern is
> OVL-CI-003: does `actions/checkout@v4` succeed under `contents: read`? (Answer: yes,
> checkout only needs read permissions.) Does `npm test` in copilot-setup-steps succeed?
> Does the grep-based provider-model-ban check still work? IAA will verify the syntax is
> correct (workflow-level placement, correct YAML indentation) and that no step is silently
> broken. OVL-CI-005 is a hard gate — the CI evidence is mandatory; claim without log snippet
> or URL = REJECTION-PACKAGE.

**Notes for Builder (integration-builder)**:
- `contents: read` at the workflow level (before `jobs:`) is the correct placement for
  workflow-level scope. Do NOT add at `jobs.job-name:` level unless specifically needed.
- Verify YAML indentation: `permissions:` at the same level as `on:` and `jobs:`.
- `copilot-setup-steps.yml` runs `npm test` — `contents: read` is sufficient.
- `provider-model-ban.yml` runs `grep` on checked-out files — `contents: read` is sufficient.
- **OVL-CI-005 is mandatory**: You MUST provide a CI run URL or log snippet showing both
  workflows ran successfully after your changes. This is a hard gate at IAA audit. Ensure
  the branch triggers both workflows before submitting the PREHANDOVER proof.
- Note on OVL-CI-006: This check is being added to the Foreman's FAIL-ONLY-ONCE as a
  CANDIDATE (A-031) pending CS2 formal approval. IAA does NOT yet have OVL-CI-006 in its
  CI_WORKFLOW overlay. Your changes will be audited under OVL-CI-001 through OVL-CI-005.
  The absence of OVL-CI-006 in IAA's framework does not reduce the quality bar — OVL-CI-001
  (policy correctness) and OVL-CI-003 (silent failure risk) will cover the permissions
  verification thoroughly.

---

## Combined PREHANDOVER Ceremony Requirements (All Tasks — Single PR Bundle)

If all 5 tasks are delivered in a single PR (per wave sequencing), the following applies
to the **single shared PREHANDOVER proof**:

### PREHANDOVER Proof Required Fields (A-029 / §4.3b Architecture)

| Field | Requirement |
|-------|-------------|
| `wave` | `Wave GovImpr` |
| `session_id` | The session number used (e.g., `session-NNN`) |
| `branch` | `copilot/update-iaa-governance-templates` |
| `scope` | Must exactly match `git diff --name-only origin/main...HEAD` output at time of commit |
| `iaa_audit_token` | Pre-populated expected reference: `IAA-session-NNN-waveGovImpr-YYYYMMDD-PASS` (A-029 §4.3b — NOT "PENDING") |
| `tasks_covered` | TASK-GI-001 through TASK-GI-005 |
| `session_memory_path` | Path to the session memory file committed to branch |
| `ci_evidence` | For TASK-GI-005: CI run URL or log snippet (OVL-CI-005 mandatory) |

### SCOPE_DECLARATION.md Requirements (A-026 + A-028)

- **A-028**: Must use list format. No prior-wave entries. Only this wave's files.
- **A-026**: Must match `git diff --name-only origin/main...HEAD` exactly at time of IAA invocation.
- **A-029 + TASK-GI-002 note**: Begin with `cat /dev/null > SCOPE_DECLARATION.md` before writing new content to prevent stale entries. The irony of this wave is that TASK-GI-002 adds this exact instruction to the template — builders should follow the forthcoming guidance even before it is committed.

### Dedicated IAA Token File (§4.3b — written by IAA post-verdict)

IAA will write its verdict to:
`.agent-admin/assurance/iaa-token-session-NNN-waveGovImpr-20260305.md`

The PREHANDOVER proof `iaa_audit_token` field should reference this file pattern.

---

## Applicable IAA Overlays Summary

| Overlay Category | Applies To | Overlay Checks |
|-----------------|------------|----------------|
| CERT-001 through CERT-004 | All tasks (whole PR) | Ceremony admin — existence only |
| CORE-001 through CORE-022 | All tasks (applicable checks per artifact type) | Core invariants |
| KNOWLEDGE_GOVERNANCE | TASK-GI-001, 002, 003 | OVL-KG-001 through OVL-KG-004 + OVL-KG-ADM-001 through OVL-KG-ADM-003 |
| CI_WORKFLOW | TASK-GI-005 | OVL-CI-001 through OVL-CI-005 |
| DOC-ONLY (no dedicated overlay) | TASK-GI-004 | Core ceremony + substance accuracy check only |

**Not applicable**: AGENT_CONTRACT overlay (no `.github/agents/` files changed), AAWP_MAT overlay (no MAT deliverables), BUILD_DELIVERABLE (BD-001–024) overlay (no application code).

---

## Blockers (PC-GI-xxx)

### PC-GI-001 — ADVISORY: OVL-CI-006 Not Yet in IAA's Formal Audit Framework

**Type**: Advisory (not a build blocker)
**Affects**: TASK-GI-005
**Details**: OVL-CI-006 (workflow job permissions check) does not exist in IAA's
`iaa-category-overlays.md` as of this Pre-Brief date. The wave tasks reference "OVL-CI-006
compliance" as the driver for TASK-GI-005. A-031 in the Foreman's FAIL-ONLY-ONCE.md is being
added as a **CANDIDATE** rule (pending CS2 approval). IAA will audit TASK-GI-005 under
OVL-CI-001 through OVL-CI-005 only.
**Action**: No build change required. integration-builder proceeds under existing OVL-CI-001–005.
governance-liaison marks A-031 as CANDIDATE in Foreman's FAIL-ONLY-ONCE.md.
When CS2 formally approves A-031 and directs IAA to add OVL-CI-006 to its overlays, a
separate wave will formalise it in IAA's audit framework.

### PC-GI-002 — ADVISORY: mat-specialist Knowledge Index May Require Creation

**Type**: Advisory (governance-liaison decision required before build)
**Affects**: TASK-GI-003
**Details**: The mat-specialist knowledge directory (`.agent-workspace/mat-specialist/knowledge/`)
currently contains 4 files (`audit-lifecycle.md`, `compliance-mapping.md`,
`criteria-structure.md`, `domain-model.md`) with no named `index.md`. OVL-KG-ADM-003 requires
that the agent knowledge index be updated when a knowledge file is modified. If no index exists
and the builder adds a new file without creating/updating an index, IAA will issue an
OVL-KG-ADM-003 finding at handover.
**Action Required (before build)**:
governance-liaison-isms-agent must decide: (a) add the IAA token note to an existing file
and create a `index.md` for mat-specialist, OR (b) add the note to an existing file and
note the absence of an index as a known gap that will be addressed in a follow-up. Option (b)
requires documenting the gap in the PREHANDOVER proof so IAA can make an informed decision.
If the gap is not acknowledged, IAA will flag it as a finding.

### PC-GI-003 — CLARITY NOTE: Two Separate FAIL-ONLY-ONCE Registries

**Type**: Clarity (no build action required — awareness only)
**Affects**: TASK-GI-001, understanding of A-029 rule numbering
**Details**: Two separate FAIL-ONLY-ONCE registries exist:
- IAA's own: `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` (v2.4.0, A-001 through A-030)
- Foreman's: `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` (v2.6.0, rules up to A-028)
Both use the same rule-ID numbering scheme but for different rules. In particular:
- **IAA's A-029** = PREHANDOVER proof immutability (§4.3b)
- **Foreman's new A-029** = SCOPE_DECLARATION fresh-overwrite rule
These are different rules with the same number in different registries. governance-liaison
must not conflate them. The TASK-GI-001 work is in the Foreman's registry only.
**Action**: governance-liaison confirms it is updating ONLY the Foreman's registry
(`.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`).
IAA's own registry is NOT modified by this wave. Any change to IAA's registry requires
explicit CS2 directive naming `.agent-workspace/independent-assurance-agent/knowledge/`.

### PC-GI-004 — ADVISORY: IAA index.md Has Stale Version Reference for FAIL-ONLY-ONCE.md

**Type**: Advisory (pre-existing gap — not caused by this wave)
**Affects**: IAA knowledge integrity (not this wave's tasks)
**Details**: IAA's `index.md` references FAIL-ONLY-ONCE.md at version `2.3.0` in the file
table, while the actual file header reads `2.4.0`. This pre-existing stale reference was
likely caused by the session-153 FAIL-ONLY-ONCE update not propagating to the index file
table entry. This gap is not caused by Wave GovImpr and does not block this wave.
**Action**: Foreman should note this for a future knowledge governance wave targeting IAA's
own Tier 2 knowledge. It is not a blocker for Wave GovImpr.

---

## Wave-Level IAA Assessment

### CST/CWT/FCWT Assessment

Wave GovImpr is a **governance-only wave** — no application code changes (modules/mat/src/,
packages/, apps/ etc.). The Combined Testing Pattern (CST/CWT/FCWT) applies to AAWP/MAT
deliverable waves and build waves with cross-module integration. This wave does NOT trigger
a CST, CWT, or FCWT requirement. No combined testing obligation exists for this wave.

### SCOPE_DECLARATION Guidance (TASK-GI-002 Pre-Empted Application)

The wave tasks include an instruction for builders to follow the new SCOPE_DECLARATION
fresh-overwrite guidance (TASK-GI-002). Even before TASK-GI-002 is committed, all builders
on this wave should follow the forthcoming pattern:
```bash
cat /dev/null > SCOPE_DECLARATION.md
# then write scope content fresh
```
This prevents A-028 stale content from persisting. IAA will apply A-026 and A-028 at handover.

### Sequencing Compatibility

The wave tasks sequencing (TASK-GI-001/002/003 in parallel with TASK-GI-004/005) is compatible
with IAA's single-PR audit gate. All 5 tasks may be delivered together in one PREHANDOVER proof.
IAA will not object to parallel builder work being committed to the same branch.

---

## Pre-Brief Artifact Status

| Item | Status |
|------|--------|
| Wave tasks read | ✅ COMPLETE |
| Task classification | ✅ COMPLETE — 5 tasks reviewed, all QUALIFYING |
| Required phases declared | ✅ COMPLETE — Phases 1–4 for all qualifying tasks |
| Evidence artifacts listed | ✅ COMPLETE — per task and combined |
| Overlays identified | ✅ COMPLETE — KNOWLEDGE_GOVERNANCE + CI_WORKFLOW |
| Blockers identified | ✅ COMPLETE — PC-GI-001 through PC-GI-004 (all advisory) |
| Hard blockers (build must stop) | ✅ NONE — builders may proceed |
| Pre-Brief artifact committed | ✅ THIS FILE |

**Foreman Gate**: Builders may now be delegated. The Pre-Brief requirement (Foreman §Phase 2
Step 2.7) is satisfied by this artifact.

---

## IAA Session Memory Reference

This Pre-Brief is filed under session-154.
Session memory will be written to:
`.agent-workspace/independent-assurance-agent/memory/session-154-prebrief-waveGovImpr-20260305.md`

---

**Issued by**: independent-assurance-agent v6.2.0
**Session**: session-154 (Pre-Brief invocation only — no Phase 2–4 executed)
**Date**: 2026-03-05
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Next Action**: Foreman delegates qualifying tasks to builders. IAA is next invoked at handover after all tasks are committed.
