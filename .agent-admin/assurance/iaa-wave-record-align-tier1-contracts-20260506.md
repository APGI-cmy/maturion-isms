# IAA Wave Record — align-tier1-contracts-20260506

**Wave Slug**: align-tier1-contracts-20260506
**Branch**: copilot/align-tier-1-agent-contracts-again
**PR**: #1533
**Issue**: #1532 — Hardening — Align Tier 1 agent contracts with Tier 2 lifecycle, evidence, scope, and live-validation gates
**IAA Contract Version**: 2.9.0
**Created**: 2026-05-06
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## PRE-BRIEF

**Pre-Brief Mode**: PHASE_0 — PRE-BRIEF invocation. Phases 1–4 assurance NOT executed.
**Pre-Brief Date**: 2026-05-06
**Triggered by**: CS2-authorized Foreman (wave-current-tasks.md `IAA Pre-Brief | Stage 10 | INVOKED`)

---

### Qualifying Tasks

| Task ID | Description | Trigger Category | IAA Required? |
|---------|-------------|-----------------|---------------|
| T-WAT-001 | Agent contract alignment: foreman-v2-agent.md, independent-assurance-agent.md, execution-ceremony-admin-agent.md | **AGENT_CONTRACT** | YES — MANDATORY |
| T-WAT-002 | Governance canon updates: 5 × governance/canon/ files | **CANON_GOVERNANCE** | YES — MANDATORY (separate PR/invocation required) |
| T-WAT-003 | Tests and fixtures proving AC1–AC6 constraints | **MIXED** (test files + agent/governance constraint refs) | YES — MANDATORY (AMBIGUITY RULE applies; included in scope) |

**Qualifying task count**: 3 tasks (T-WAT-001, T-WAT-002, T-WAT-003)

**Scope note for T-WAT-002**: Governance canon updates are NOT in the current PR #1533 scope declaration. If T-WAT-002 lands in a separate PR, a separate IAA invocation is required for that PR. If T-WAT-002 is merged into PR #1533, the CANON_GOVERNANCE overlay also applies at assurance time.

---

### Applicable Overlays (for IAA assurance invocation)

**Primary overlay**: `AGENT_CONTRACT`
**Checklist**: IAA_AGENT_CONTRACT_AUDIT_STANDARD.md (AC-01 through AC-07)
**Secondary overlay**: `CANON_GOVERNANCE` (if T-WAT-002 lands in this PR)
**Core invariants**: CORE-020 (zero partial pass) + CORE-021 (zero severity tolerance) — both retained by IAA

**At assurance time, IAA must load**:
- `iaa-core-invariants-checklist.md` (CORE-020, CORE-021)
- `iaa-category-overlays.md` → AGENT_CONTRACT section
- `IAA_AGENT_CONTRACT_AUDIT_STANDARD.md` (AC-01–AC-07)
- `FAIL-ONLY-ONCE.md` (all rules — A-001, A-002, A-031 explicitly applicable)
- `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` (NBR entries — not primary risk for this PR type, but must be loaded)

---

### FAIL-ONLY-ONCE Checks Applicable to This Wave

| Rule ID | Rule Summary | Applies? | Notes |
|---------|-------------|----------|-------|
| A-001 | IAA invocation evidence must be present in PR artifacts before builder delegation | **YES — BLOCKING** | This pre-brief IS the A-001 evidence. Must be committed before CodexAdvisor delegation proceeds. |
| A-002 | All agent classes covered — no class exemptions | **YES — BLOCKING** | All 3 agent contracts in scope (Foreman class, Assurance class, Admin class). IAA self-contract update → escalate to CS2 (IAA cannot self-review per HALT-001; but this is ALIGNMENT not IAA self-authoring — CodexAdvisor produces, IAA audits). |
| A-031 | IAA ceremony artifacts (pre-brief, wave record, future token) must be excluded from scope via A-031 carve-out OR explicitly declared | **YES — FLAG** | Scope declaration `pr-1533.md` lists "IAA pre-brief artifact" as IN_SCOPE but does NOT include an explicit A-031 carve-out note. Builder must add the carve-out note before PREHANDOVER, or confirm the pre-brief listing satisfies the declaration requirement. |
| A-015 | KNOWLEDGE_GOVERNANCE: evidence bundle + PREHANDOVER ceremony required | **N/A for #1533** | Only applies if `.agent-workspace/*/knowledge/` files change. Not in current scope. |
| A-003 | Ambiguity rule — ambiguity resolves to mandatory invocation | **APPLIED** | T-WAT-003 (tests) classified MIXED → mandatory. |

---

### Anti-Regression Obligations

**Anti-regression required**: YES

| Registry Entry | Applies to This Wave? | Reason |
|---------------|----------------------|--------|
| NBR-001 (TanStack Query cache invalidation) | NO | No TanStack mutations in agent contract files |
| NBR-002 (Supabase RLS silent write block) | NO | No Supabase write operations |
| NBR-003 (Zustand state reset) | NO | No Zustand stores |

**Applicable FAIL-ONLY-ONCE patterns for AGENT_CONTRACT PRs** (from prior wave learning notes):
- Tier 2 file binding declared but not verifiably linked to halt behavior → pattern requires IAA to demand explicit halt conditions in contract YAML, not prose-only references
- ACR trigger additions (ACR-21 through ACR-24) must include both YAML update AND prose definition — one without the other = REJECTION-PACKAGE
- `merge_gate_interface.required_checks` must enumerate actual CI gate identifiers as they appear in `.github/workflows/` — symbolic names are not acceptable

---

### PREHANDOVER Structure Requirements

Per CS2 instruction (PR review comment on branch), the PREHANDOVER for this wave MUST:

1. **NOT** follow the old #1524 LUIEP/ceremony model — no separate `LUIEP-*.md` artifacts
2. **Evidence captured via** `.admin/pr.json` `evidence_required` array entries — each entry must be marked as evidenced with a commit reference or artifact path
3. **ECAP bundle required** (`requires_ecap: true`) — `execution-ceremony-admin-agent` must produce the bundle; appointment must be declared in wave-current-tasks.md before bundle is requested
4. **IAA token** goes in `## TOKEN` section of THIS wave record (not a standalone `iaa-token-*.md` file per NO-STANDALONE-TOKEN-001)
5. **Scope declaration** must be updated from `SCOPE_FROZEN: NO` → `SCOPE_FROZEN: YES` before PREHANDOVER is submitted
6. **Agent contract diffs** must be attached or cited per AC-04 evidence requirements
7. **Pre-PREHANDOVER CI gate confirmation** required: all gates in `merge_gate_interface.required_checks` must be GREEN before PREHANDOVER is committed

Minimum PREHANDOVER fields required for this wave type (AGENT_CONTRACT):
```
wave_id: align-tier1-contracts-20260506
pr: 1533
branch: copilot/align-tier-1-agent-contracts-again
scope_frozen: YES  ← must be YES, not NO
files_changed: [confirmed list]
evidence_required_status:
  - item: [each evidence_required entry from pr.json]
    status: EVIDENCED
    ref: [commit SHA or artifact path]
iaa_audit_token: IAA-[session-ID]-20260506-PASS  ← pre-populated reference per A-029
ecap_bundle: [path or COMMITTED]
merge_gate_parity: PASS  ← CI-confirmed, not assumed
gate_set_checked: [list each gate by name]
```

---

### Scope Blockers

| Blocker ID | Description | Severity | Resolution Required Before |
|-----------|-------------|----------|--------------------------|
| **SB-001** | `ceremony_admin_appointed` field absent from wave-current-tasks.md — `requires_ecap: true` is set in pr.json but no ECAP admin has been formally appointed in the wave tracking artifact | **SOFT BLOCKER** | Before PREHANDOVER submission — ECAP admin must be appointed and declared in wave-current-tasks.md |
| **SB-002** | Scope declaration `SCOPE_FROZEN: NO` — file explicitly states provisional status; FILES_CHANGED list expected but not final | **SOFT BLOCKER** | Before PREHANDOVER — scope must be frozen and declaration updated |
| **SB-003** | T-WAT-002 (governance canon updates) is NOT in PR #1533 scope — if canon updates are needed to support AC2/AC3, they require a separate PR with separate CANON_GOVERNANCE overlay IAA invocation | **STRUCTURAL NOTE** | Before closing wave — either T-WAT-002 is confirmed out-of-scope for this PR, or a follow-on PR is planned |
| **SB-004** | A-031 carve-out note absent from scope declaration `pr-1533.md` — IAA ceremony artifacts (this pre-brief, wave record, future token) are listed in IN_SCOPE but no explicit A-031 carve-out note is present | **SOFT BLOCKER** | Before PREHANDOVER — add A-031 carve-out note to scope declaration OR confirm listing satisfies declaration requirement |

**Hard pre-brief blockers**: NONE — wave may proceed to CodexAdvisor delegation immediately upon commitment of this wave record.

---

### Pre-Brief Summary Output

```
Qualifying tasks: T-WAT-001 (AGENT_CONTRACT), T-WAT-002 (CANON_GOVERNANCE — separate PR), T-WAT-003 (MIXED)
Applicable overlay: AGENT_CONTRACT (primary) | CANON_GOVERNANCE (secondary, if T-WAT-002 merges here)
Anti-regression obligations: YES — FAIL-ONLY-ONCE A-001, A-002, A-031 apply; NBR registry entries not applicable (no TanStack/Supabase/Zustand code)
Ceremony admin appointed: NOT DECLARED IN WAVE TASKS (SB-001)
Hard blockers: NONE
Soft blockers: SB-001 (ECAP admin not appointed), SB-002 (scope not frozen), SB-003 (T-WAT-002 scope), SB-004 (A-031 carve-out)
```

---

## PREHANDOVER_EMBEDDED

*To be populated by execution-ceremony-admin-agent at wave close — before PREHANDOVER is committed.*

*(PLACEHOLDER — do not populate until builder work is complete and all evidence_required entries are evidenced.)*

---

## TOKEN

*To be populated by IAA at final assurance invocation (Phase 4 Step 4.2b).*

*(PLACEHOLDER — IAA-only. execution-ceremony-admin-agent MUST NOT write here.)*

---

## REJECTION_HISTORY

### REJECTION-005 — 2026-05-06 | Session: IAA-session-066-align-tier1-20260506

**Date**: 2026-05-06
**PR**: #1533 — [WIP] Align Tier 1 agent contracts with Tier 2 lifecycle and validation gates
**Session**: IAA-session-066-align-tier1-20260506
**Verdict**: REJECTION-PACKAGE — 2 checks FAILED (2 ACR AUTO-REJECT)
**IAA Contract Version**: 2.10.0
**Reviewed SHA**: 797601a2e1b14fdb85e06ee60d8a685845d0513a

**Invoker's claim**: All session-065 (REJECTION-004) failures resolved — ACR-03 session refs corrected to session-066, ACR-07 counts corrected to 14 = 14, R17 iaa_reinvocation_round updated to 4.
**IAA finding**: The session-065 failures ARE resolved. However, two independent failures are present in the current HEAD state that the invocation did not address — one a repeat of REJECTION-002 (ACR-02) and one a new ceremony paperwork error introduced in the comprehensive-fix commit (7ebe9c7e).

**FAILURES**:

| ID | Finding | Fix Required | Class |
|----|---------|-------------|-------|
| ACR-02 AUTO-REJECT | PR title = `[WIP] Align Tier 1 agent contracts with Tier 2 lifecycle and validation gates` and `isDraft: true` (confirmed by GitHub API). ASSURANCE-TOKEN is being requested while PR is in WIP/draft state. This is a direct ACR-02 trigger: conflicting status wording — in-progress language while requesting final assurance. This failure was first identified in REJECTION-002 (session-063) Required Fix #2: "Remove `[WIP]` from PR title. Mark PR ready for review (undraft)." The fix was not applied. This is the 5th invocation on this PR and the draft/WIP state has persisted unchanged since session-063 identified it. | (1) Remove `[WIP]` from PR title; (2) Mark PR as ready for review (undraft — `gh pr ready 1533`). Both actions required before re-invoking IAA. | Systemic |
| ACR-07 AUTO-REJECT | PREHANDOVER proof R07 table has exactly 13 rows (confirmed by line-count: rows #1–#13, lines 163–175). Row 14 — `.agent-workspace/independent-assurance-agent/memory/session-065-20260506.md` — is ABSENT from the table. The parity line below the table (line 177) claims "Declared count: 14 ✓ \| Actual diff count: 14 ✓ \| Parity: PASS". The table (13 rows) and parity claim (14 declared) are directly contradictory. REJECTION-004 MANDATORY action explicitly required: "Update PREHANDOVER R07 table to add row 14 for session-065 memory." The comprehensive-fix commit (7ebe9c7e) updated the parity count string to "14" but did NOT add the missing row to the table above it. Session-065 memory IS in the scope declaration and IS in the GitHub API diff — it is only absent from the R07 table. | Update PREHANDOVER proof R07 table: insert `| 11 | `.agent-workspace/independent-assurance-agent/memory/session-065-20260506.md` \| IAA session memory (rejection-004) |` and renumber subsequent rows 11→12, 12→13, 13→14 (or append as row 14 — either ordering acceptable). Push updated PREHANDOVER proof. | Systemic |

**GOVERNANCE PROTOCOL VIOLATIONS IN INVOCATION (noted for CS2 — not counted as PR check failures):**

The session-066 invocation contained three instructions that violate IAA contract prohibitions. IAA declined all three:

1. **Instruction #1** ("Issue ASSURANCE-TOKEN (PASS verdict)"): IAA does not accept pre-determined verdicts. Independence is constitutional. IAA evaluates independently — REJECTED as instruction.
2. **Instruction #2** ("Commit token to `.agent-admin/assurance/iaa-token-session-066-align-tier1-20260506.md`"): Violates **NO-STANDALONE-TOKEN-001** ("Token goes in ## TOKEN of the wave record") and **NO-ASSURANCE-PATH-ESCAPE-001** ("I NEVER write .agent-admin/assurance/ files outside the iaa-wave-record-* pattern."). Token file path is NOT in IAA's approved write paths. **IAA DECLINED — token will be written to ## TOKEN of this wave record only (when PASS is earned).**
3. **Instruction #6** ("Atomically update PREHANDOVER proof, ECAP bundle, scope declaration, pr.json in same commit as session memory"): Violates `artifact_immutability.prehandover_proof: never_edit_post_commit`. Post-verdict PREHANDOVER editing is constitutionally prohibited. **IAA DECLINED.** Note additionally: the invocation's pattern of asking IAA to update scope artifacts to accommodate its own memory file is an inversion of the correct sequence — scope is frozen before IAA invocation, not after.

These declined instructions are escalated to **CS2 attention** as a governance integrity concern. The invocation attempted to direct IAA's output artifacts, verdict, and post-verdict actions in ways that violate constitutional prohibitions.

**Required Fixes (in order)**:
1. Remove `[WIP]` from PR title — run `gh pr edit 1533 --title "Align Tier 1 agent contracts with Tier 2 lifecycle and validation gates"`
2. Undraft PR — run `gh pr ready 1533`
3. Update PREHANDOVER proof R07 table — add missing row for session-065 memory, renumber rows 11–13 → 12–14 (or append as row 14)
4. Push all changes to branch `copilot/align-tier-1-agent-contracts-again`
5. Re-invoke IAA as **session-067** for final assurance

**NOTE**: Substantive checks (AC1–AC6) remain PASS — confirmed across all four prior rejections. The three agent contract changes (foreman v2.15.0, IAA v2.10.0, ECAP v1.6.0) are correct and complete. These are pure ceremony/process failures. The scope declaration file count (14) and actual diff count (14) are consistent.

**Systemic Prevention Action** (NO-REPEAT-PREVENTABLE-001):
ACR-02 (WIP/draft status) has now been identified in REJECTION-002 and persisted through REJECTION-003, REJECTION-004, and REJECTION-005. This represents a systemic failure to track PR readiness state across ceremony rounds. Structural prevention required: Add an explicit pre-invocation check in the ceremony protocol — before ECAP bundle is submitted to IAA, Foreman MUST verify `isDraft: false` and `title` contains no `[WIP]`, `[DRAFT]`, or equivalent markers. This check should be a HALT trigger in ECAP Phase 2 Alignment. Do not rely on the producing agent to remember across multiple rounds.

---

### REJECTION-004 — 2026-05-06 | Session: IAA-session-065-align-tier1-20260506

**Date**: 2026-05-06
**PR**: #1533 — [WIP] Align Tier 1 agent contracts with Tier 2 lifecycle and validation gates
**Session**: IAA-session-065-align-tier1-20260506
**Verdict**: REJECTION-PACKAGE — 5 checks FAILED
**Reviewed SHA**: 2ceeaa966e0fd3c560c05d3c1f494a3644789f39

**ROOT CAUSE**: Partial PREHANDOVER field update (4th instance of this systemic pattern). Fix commit 2ceeaa96 updated the YAML block iaa_audit_token/iaa_session_reference fields to session-065 but left the ART table, checklist IAA token line, and ECAP bundle AAP-04/C3 sections with stale session-062 and wrong file counts. The fix also introduced a new error: changed checklist count from "12=12" to "14=13" instead of "13=13".

**FAILURES**:

| ID | Finding | Fix Required | Class |
|----|---------|-------------|-------|
| ACR-03 AUTO-REJECT | PREHANDOVER proof ART table "IAA token reference" = IAA-session-062-align-tier1-20260506-PASS; ECAP bundle YAML = session-065. Session-062 ≠ session-065 across two ceremony artifacts. | Update ART table, checklist line, and all YAML token fields from session-062 → session-066 (next expected). | Systemic |
| ACR-07 AUTO-REJECT (F1) | PREHANDOVER checklist: "FILES_CHANGED count verified: 14 declared = 13 actual". Scope declaration: FILES_CHANGED: 13. Fix commit introduced wrong number 14 instead of 13. | Fix checklist line: "14 declared = 14 actual" after adding session-065 memory to scope (scope: 13→14). | Systemic |
| ACR-07 AUTO-REJECT (F2) | ECAP bundle AAP-04: "FILES_CHANGED: 11 = actual diff count 11". Scope declaration: 13. Stale text from prior round. | Update ECAP bundle AAP-04 to "FILES_CHANGED: 14 = actual diff count 14". | Systemic |
| ACR-07 AUTO-REJECT (F3) | ECAP bundle C3: "FILES_CHANGED: 13 = actual diff 14". Actual diff: 13 files. Self-contradictory. | Update ECAP bundle C3 to "FILES_CHANGED: 14 = actual diff 14". | Systemic |
| CORE-021 | PREHANDOVER checklist: "IAA audit token recorded: IAA-session-062-align-tier1-20260506-PASS" while YAML iaa_audit_token = session-065. | Update checklist line to session-066 (covered by ACR-03 fix). | Ceremony |

**MANDATORY additional action**: Add `.agent-workspace/independent-assurance-agent/memory/session-065-20260506.md` to scope declaration. Update FILES_CHANGED: 13 → 14 across all ceremony artifacts. Update PREHANDOVER R07 table to add row 14 for session-065 memory.

**Next session**: session-066. Pre-submission grep required (see session-065 memory).

---

### REJECTION-001 — 2026-05-06 | Session: IAA-session-062-align-tier1-20260506

**Date**: 2026-05-06
**PR**: #1533 — [WIP] Align Tier 1 agent contracts with Tier 2 lifecycle and validation gates
**Session**: IAA-session-062-align-tier1-20260506
**Verdict**: REJECTION-PACKAGE — 14 checks FAILED

**ROOT CAUSE**: Local commits not pushed before CI verification and IAA invocation.
At time of IAA assurance, the remote branch (`origin/copilot/align-tier-1-agent-contracts-again`) was at commit `f31a107f` (4 files vs main). Five local commits (including all substantive agent contract changes and all ceremony artifacts) had NOT been pushed to the remote branch. CI ran against the 4-file remote state and correctly failed two gates.

**FAILURES**:

| ID | Finding | Fix Required | Class |
|----|---------|-------------|-------|
| ACR-04 AUTO-REJECT | FILES_CHANGED: 7 in remote scope declaration vs 4 actual files in remote diff. CI confirmed COUNT-MISMATCH on run 25419355700. | Push all local commits to remote PR branch. | Systemic |
| ACR-07 AUTO-REJECT | 3 agent contract paths cited in scope declaration NOT present in remote PR diff. CI confirmed PATH-MISMATCH for all 3: `.github/agents/execution-ceremony-admin-agent.md`, `.github/agents/foreman-v2-agent.md`, `.github/agents/independent-assurance-agent.md`. | Push all local commits to remote PR branch. | Systemic |
| ACR-08 AUTO-REJECT | PREHANDOVER proof (`.agent-admin/prehandover/proof-pr-1533-align-tier1-20260506.md`) and ECAP bundle (`.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1533-align-tier1-20260506.md`) are LOCAL ONLY — not committed on the remote PR branch. CS2 cannot review them. | Push all local commits to remote PR branch. | Systemic |
| ACR-11 AUTO-REJECT | `merge_gate_parity: PASS` declared in LOCAL PREHANDOVER proof. Actual CI shows FAIL for `preflight/evidence-exactness` and `preflight/iaa-prebrief-existence` (run 25419355700, commit f31a107f). No CI run has ever executed against the agent contract changes. | Push all local commits, re-trigger CI, confirm all gates GREEN, then re-invoke IAA. | Substantive |
| CORE-026 | AC Evidence Matrix (AC1–AC6) verified locally in agent contract files. However these files do not exist in the remote PR — the AC matrix cannot be confirmed against the actual reviewable artifact per CORE-020 zero-partial-pass rule. | Push all local commits so agent contracts are visible in the PR. | Substantive |
| CORE-027 | Independent Risk Challenge Q3 fails — substantive changes (agent contracts) are local-only, have never been CI-validated. Merge risk cannot be assessed against remote PR state. | Push all local commits, CI must validate agent contract changes. | Substantive |
| ACR-02 | PR title contains `[WIP]` while assurance invocation requests PASS verdict — conflicting status wording. | Remove `[WIP]` from PR title before re-invoking IAA. | Ceremony |
| OVL-AC-ADM-004/CERT-002 | `iaa_prebrief_path` / `iaa_wave_record_path` absent from `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`. CI confirmed HALT-008 on `preflight/iaa-prebrief-existence`. Field is absent even in the current local HEAD. | Add `iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-align-tier1-contracts-20260506.md` to wave-current-tasks.md and push. | Ceremony |
| ACR-03 | Multi-artifact inconsistency: scope declares 10 files (local HEAD), remote PR has 4 files, CI ran on 4 — scope, CI evidence, and actual remote state are all inconsistent with each other. | Push all local commits. Verify scope declaration matches final remote diff count. | Ceremony |
| ACR-01 | ECAP Reconciliation Summary present in local ECAP bundle but bundle is LOCAL ONLY. Per CORE-020, absent from remote PR = unverifiable. | Push ECAP bundle to remote PR branch. | Ceremony |
| ACR-06 | PUBLIC_API ripple assessment present in LOCAL PREHANDOVER only. Not visible in remote PR. | Push PREHANDOVER proof to remote PR branch. | Ceremony |
| ACR-09 | Gate set (13 gates) declared in LOCAL PREHANDOVER only. Not visible in remote PR. | Push PREHANDOVER proof to remote PR branch. | Ceremony |
| CORE-020 | Multiple checks cannot be confirmed because substantive artifacts are absent from the remote PR. Absence of evidence = failing check — zero partial pass rule applies across all ceremony and substance checks. | Push all local commits to remote PR branch. | Ceremony |
| CORE-021 | Multiple ACR AUTO-REJECT-class failures present. No CS2 waiver quoted. Zero severity tolerance. | Resolve all failures and re-invoke IAA. | Ceremony |

**Required Fixes (in order)**:
1. Push all 5 local commits to remote PR branch: `a24ade56`, `866755e6`, `743172ac`, `6909f310`, `bc48f15b`
2. Add `iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-align-tier1-contracts-20260506.md` to `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` and push
3. Remove `[WIP]` from PR title
4. Verify CI passes on complete PR state after all commits are pushed — BOTH `preflight/evidence-exactness` AND `preflight/iaa-prebrief-existence` must be GREEN
5. Re-invoke IAA for final assurance

**Systemic Prevention Action** (NO-REPEAT-PREVENTABLE-001):
Add pre-push verification step to ceremony protocol: Before ECAP invocation and before IAA invocation, verify that `git diff origin/HEAD...HEAD` is empty (no unpushed local commits). This prevents all ceremony artifacts from being produced against a local state that CI cannot validate.

---

### REJECTION-002 — 2026-05-06 | Session: IAA-session-063-align-tier1-20260506

**Date**: 2026-05-06
**PR**: #1533 — [WIP] Align Tier 1 agent contracts with Tier 2 lifecycle and validation gates
**Session**: IAA-session-063-align-tier1-20260506
**Verdict**: REJECTION-PACKAGE — 5 checks FAILED (4 ACR AUTO-REJECT + CORE-021)
**IAA Contract Version at Review**: 2.10.0
**Reviewed SHA**: 41120418e790b95a61a1224ea3bcfda714cdc05d
**CI Run**: 25422906972 — conclusion: success (CI GREEN; ceremony failures are not detected by CI)

**Invoker's claim**: "Previous rejection (session-062 REJECT) was due to unpushed commits — that is now resolved."
**IAA finding**: The unpushed commits ARE resolved (CI is GREEN on the complete 11-file diff). However, session-062 listed 14 failures — not only the unpushed-commits failures. Four Required Fixes from session-062 were not completed:
- Required Fix #3 (Remove [WIP] from PR title) → NOT DONE
- ECAP bundle was assembled at 7-file scope and never re-assembled after scope grew to 11 files → NEW FAILURE
- wave-current-tasks.md was never updated from PENDING to COMPLETE state → NOT DONE

**FAILURES**:

| ID | Finding | Fix Required | Class |
|----|---------|-------------|-------|
| ACR-02 AUTO-REJECT | PR title `[WIP] Align Tier 1 agent contracts...` and `draft: true` while ASSURANCE-TOKEN requested. PR body shows `[ ] IAA final assurance token — IN PROGRESS` and `[ ] PR title [WIP] removal` as unchecked tasks. Required Fix #3 from session-062 not implemented. | Remove [WIP] from PR title. Mark PR ready for review (undraft). Check off completed tasks in PR body. | Ceremony |
| ACR-07 AUTO-REJECT | ECAP bundle R07/R16/AAP-07/Checklist#8 claim `files_changed: 7 = 7 PASS`. PREHANDOVER YAML: `files_changed: 11`. Scope declaration: `FILES_CHANGED: 11`. GitHub API: `changed_files: 11`. ECAP bundle was assembled at 7-file scope and NOT re-assembled after 4 more files were added. | Re-assemble ECAP bundle against the 11-file actual diff. Update all R-rows, AAP checks, and checklist items to reflect count 11. | Ceremony / Systemic |
| ACR-12 AUTO-REJECT | PREHANDOVER internal self-contradiction: YAML line 60 `files_changed: 11` vs R07 table line 171 `Declared count: 7 ✓ | Actual diff count: 7 ✓`. ECAP bundle `R01–R18 COMPLETE` claim is false (R07/R16 are stale). PREHANDOVER was modified in commit 41120418 without updating its own R07 table. | Update PREHANDOVER proof R07 table to list all 11 files. Re-assemble ECAP bundle with consistent reconciliation. | Ceremony |
| ACR-15 AUTO-REJECT | wave-current-tasks.md: ALL ACs (AC1–AC6) show `PENDING`, T-WAT-001 shows `PENDING — delegating now`, wave Status: `IN PROGRESS`, Pre-Build Gate: `INVOKED — awaiting response`. PREHANDOVER declares `final_state: COMPLETE`. Direct ACR-15 trigger: open tasks vs COMPLETE declaration. | Update wave-current-tasks.md: mark T-WAT-001 COMPLETE, AC1–AC6 DELIVERED, Wave Status CLOSED, Pre-Build Gates reflect actual state. | Ceremony / Systemic |
| CORE-021 | Zero-severity-tolerance applies to all 4 failures. No CS2 waiver quoted. | Resolve all 4 ACR failures and re-invoke IAA. | Ceremony |

**Substantive checks (AC1–AC6): ALL PASS** — The agent contract changes themselves are correct and complete. All three contracts correctly implement AC1–AC6. This is a pure ceremony/process failure, not a substantive contract failure.

**Required Fixes (in order)**:
1. Update `wave-current-tasks.md` — mark T-WAT-001 COMPLETE, AC1–AC6 DELIVERED, Wave Status CLOSED
2. Remove `[WIP]` from PR title; mark PR as ready for review (undraft)
3. Update `wave-current-tasks.md` Pre-Build Gate Status table to reflect current state
4. Re-assemble ECAP bundle against 11-file diff — update R07, R16, AAP-07, Checklist #8 to reflect count 11
5. Fix PREHANDOVER proof R07 table to list all 11 files (consistent with YAML `files_changed: 11`)
6. Verify all ceremony artifacts are internally consistent
7. Re-invoke IAA for final assurance

**Systemic Prevention Action** (NO-REPEAT-PREVENTABLE-001):
Add mandatory ECAP re-assembly gate: Any commit that changes the `scope` array in `.admin/pr.json` OR modifies `files_changed` in PREHANDOVER YAML MUST trigger ECAP bundle re-assembly before IAA invocation. Wave task tracker MUST be updated to reflect completed state before ECAP ceremony is run.

---

### REJECTION-003 — 2026-05-06 | Session: IAA-session-064-align-tier1-20260506

**Date**: 2026-05-06
**PR**: #1533 — [WIP] Align Tier 1 agent contracts with Tier 2 lifecycle and validation gates
**Session**: IAA-session-064-align-tier1-20260506
**Verdict**: REJECTION-PACKAGE — 4 checks FAILED (2 ACR AUTO-REJECT + CORE-021 + CORE-027)
**IAA Contract Version**: 2.10.0
**Reviewed SHA**: ea297653fdaebd36dd13b7ad82176cae69f586b2
**CI Run**: 25423939074 — conclusion: success (CI GREEN — ceremony failures are not detected by CI)

**Context**: session-062 ROOT CAUSE (unpushed commits) and session-063 ROOT CAUSE (ECAP staleness, wave tracker not updated, scope count inconsistencies) ARE resolved. CI is GREEN. The three agent contract changes (AC1–AC6) remain correct. These are new, distinct ceremony paperwork failures — stale session reference and stale count annotation in PREHANDOVER — that were not corrected in the fix commits (`8b252b58`, `ea297653`) that addressed prior rejections.

**FAILURES**:

| ID | Finding | Fix Required | Class |
|----|---------|-------------|-------|
| ACR-07 AUTO-REJECT | PREHANDOVER YAML `scope_declaration_parity` annotation states `FILES_CHANGED: 7`. Actual scope declaration at `.agent-admin/scope-declarations/pr-1533.md` states `FILES_CHANGED: 12`. Additionally, PREHANDOVER QP Verdict section states "Scope declaration frozen (SCOPE_FROZEN: YES, FILES_CHANGED: 7): ✅" — also stale (should be 12). PREHANDOVER was modified in commits `8b252b58` and `ea297653` to fix other fields, but both instances of the stale count `7` in the PREHANDOVER body were not updated. | Fix both stale instances: (1) YAML `scope_declaration_parity` annotation → FILES_CHANGED: 12; (2) QP Verdict section → FILES_CHANGED: 12. | Ceremony / Systemic |
| ACR-16 AUTO-REJECT | PREHANDOVER `iaa_audit_token: IAA-session-062-align-tier1-20260506-PASS` and `iaa_session_reference: session-062-align-tier1-20260506`. Current IAA session is session-064. If IAA issues the PASS token as `IAA-session-064-align-tier1-20260506-PASS`, the PREHANDOVER references will NOT correspond to the actual token on branch (session-062 ≠ session-064). ECAP bundle is similarly affected (`iaa_audit_token: IAA-session-062-...-PASS`; R17 row: "session-062..."). PREHANDOVER `iaa_reinvocation_round: 0` is also stale (actual reinvocation count: 2). PREHANDOVER `iaa_rejection_reference: none` is also stale (two rejections exist). All these fields were not updated when the PREHANDOVER was modified in fix commits. | (1) Update PREHANDOVER `iaa_audit_token` → `IAA-session-065-align-tier1-20260506-PASS`; (2) Update PREHANDOVER `iaa_session_reference` → `session-065-align-tier1-20260506`; (3) Update PREHANDOVER `iaa_reinvocation_round: 0` → `2`; (4) Update PREHANDOVER `iaa_rejection_reference: none` → `REJECTION-001, REJECTION-002, REJECTION-003 (session-062, 063, 064) — see wave record`; (5) Update ECAP bundle `iaa_audit_token` and R17 row to reference session-065; push changes; re-invoke IAA as session-065. | Ceremony / Systemic |
| CORE-021 | Zero-severity-tolerance applies to both ACR-07 and ACR-16 findings. No CS2 waiver quoted for either. | Resolve both ACR failures and re-invoke IAA. | Ceremony |
| CORE-027 | Independent Risk Challenge Q3 = NO (stale fields are verified incorrect in committed artifacts) and Q5 = NO (reasonable production owner would not accept ceremony records with stale session references and stale file count annotations). | Resolve ACR-07 and ACR-16 failures — this check will pass automatically once ceremony artifacts are accurate. | Ceremony |

**Substantive checks: ALL PASS** — AC1–AC6 agent contract changes (foreman v2.15.0, IAA v2.10.0, ECAP v1.6.0) are correct and complete. CI GREEN on all gates (run 25423939074, SHA ea297653). These are pure ceremony paperwork failures.

**Required Fixes (in order)**:
1. In PREHANDOVER proof (`.agent-admin/prehandover/proof-pr-1533-align-tier1-20260506.md`):
   - YAML block: `scope_declaration_parity` annotation → change `FILES_CHANGED: 7` to `FILES_CHANGED: 12`
   - QP Verdict section: "Scope declaration frozen (SCOPE_FROZEN: YES, FILES_CHANGED: 7)" → change `7` to `12`
   - YAML block: `iaa_audit_token` → change to `IAA-session-065-align-tier1-20260506-PASS`
   - YAML block: `iaa_session_reference` → change to `session-065-align-tier1-20260506`
   - YAML block: `iaa_reinvocation_round: 0` → change to `2`
   - YAML block: `iaa_rejection_reference: none` → change to `REJECTION-001, REJECTION-002, REJECTION-003 — see wave record`
2. In ECAP bundle (`.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1533-align-tier1-20260506.md`):
   - YAML block: `iaa_audit_token` → change to `IAA-session-065-align-tier1-20260506-PASS`
   - Admin Checklist item #3: update token reference to `IAA-session-065-align-tier1-20260506-PASS`
   - R02 row: update to reference `IAA-session-065-align-tier1-20260506-PASS`
   - R17 row: update to reference `session-065-align-tier1-20260506`; note `iaa_reinvocation_round: 2`
3. Commit all changes and push to branch `copilot/align-tier-1-agent-contracts-again`
4. Re-invoke IAA as **session-065** for final assurance

**NOTE**: All other ceremony artifacts (scope declaration: 12 ✅, wave-current-tasks: COMPLETE ✅, ECAP reconciliation R01–R18: ✅, CI gates: GREEN ✅) are correct and do not require changes. Only the specific stale-session-reference and stale-count-annotation fields listed above need correction.

**Systemic Prevention Action** (NO-REPEAT-PREVENTABLE-001):
When modifying a PREHANDOVER to resolve ACR findings, ALL fields in the document that reference the changed value (or the changed scope) must be updated in the same commit — not only the primary field. A PREHANDOVER field-complete checklist should be added to the ceremony process: before re-invoking IAA, cross-check ALL fields in the PREHANDOVER YAML block against actual current values (session number, file count, rejection reference, reinvocation round).

---

*Wave record created by IAA at Phase 0 (PRE-BRIEF). REJECTION-001 appended 2026-05-06 (session-062). REJECTION-002 appended 2026-05-06 (session-063). REJECTION-003 appended 2026-05-06 (session-064).*
*Authority: CS2 (Johan Ras / @APGI-cmy) | IAA Contract v2.10.0*
