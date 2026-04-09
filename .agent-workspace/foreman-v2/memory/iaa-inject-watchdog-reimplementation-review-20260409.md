# IAA Inject/Watchdog Workflow Reimplementation Review

**Session**: session-162-optimize-iaa-inject-watchdog-20260409
**Wave**: optimize-iaa-invocation-workflows
**Issue**: maturion-isms#1311
**Date**: 2026-04-09
**Author**: foreman-v2-agent v6.2.0 / contract 2.10.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-optimize-iaa-invocation-workflows.md`

---

## D1 — Workflow Review

### Scope

Five workflows reviewed per issue #1311 requirements:

| Workflow | Current State | Lines |
|----------|--------------|-------|
| `iaa-prebrief-inject.yml` | DISABLED (issue #1061) | 733 |
| `iaa-prebrief-gate.yml` | DISABLED (issue #1061) | 113 |
| `governance-watchdog.yml` | ACTIVE (Gaps 1, 2A, 2, 3) | 599 |
| `foreman-reanchor.yml` | DISABLED (issue #1061, stale wording) | 118 |
| `injection-audit-report.yml` | DISABLED, manual-only | 252 |

---

### 1. `iaa-prebrief-inject.yml` — DISABLED

**Purpose**: Automatic IAA Pre-Brief invocation when Foreman commits `wave-current-tasks.md`.

**Trigger paths (original)**:
- `push` to any non-main branch: fires when `wave-current-tasks.md` is pushed; looks for open PR; posts IAA Pre-Brief invocation comment
- `pull_request_target` (opened/synchronize): fires for Copilot-authored PRs without a pre-brief
- `issue_comment`: fires when `/iaa-prebrief` is typed on a PR/issue

**Design strengths**:
- Idempotency guard: scoped to THIS wave's pre-brief file (checks `iaa-prebrief-wave<N>.md` before posting)
- Fallback: if no open PR exists at push time, resolves issue number from `wave-current-tasks.md` `**Issue**:` field OR branch name convention, and posts to the issue instead
- Final fallback: posts as a commit comment if neither PR nor issue can be resolved
- T+10min safety net: separate job (`iaa-prebrief-safety-net`) that sleeps 600s then rechecks — fires if pre-brief still absent
- `pull_request_target` path: reads files via GitHub API (not filesystem checkout) — correctly avoids the `pull_request_target` + untrusted-checkout security vulnerability
- Slug-aware wave number parsing: handles "Wave 14 Batch B" → `14-batchB` for pre-brief file lookup

**Design issues identified**:
- None. The design is sound. The T+10 safety net is a particularly strong mechanism for catching race conditions.

**Recommendation**: **RE-ENABLE**. Restore original triggers. Remove DISABLED comment. This workflow provides the highest-value pre-brief compliance enforcement at minimal token cost (one comment per wave, idempotent).

**Canon alignment check**:
- Line 373: `@Copilot You are the **Independent Assurance Agent (IAA)**` — IAA identity invocation is correct
- Line 391: `PHASE_A_ADVISORY status` handling — correct
- No stale IAA wording detected
- ✅ Canon-aligned

---

### 2. `iaa-prebrief-gate.yml` — DISABLED

**Purpose**: Reminder gate — checks for IAA Pre-Brief on PR open, posts comment if missing.

**Trigger (original)**: `pull_request` events for `copilot/`-prefixed branches.

**Design assessment**:
- Simple 113-line workflow
- Uses `pull_request` trigger (not `pull_request_target`) — would be subject to Copilot agent approval gate
- Functionality is essentially a subset of `governance-watchdog.yml` Gap 2A and Gap 2
- The governance-watchdog already:
  - Gap 2A: Blocks IAA second-tier if pre-brief absent (HARDER enforcement than this gate)
  - Gap 2: Posts pre-brief missing alert for ready PRs (SAME functionality)
- The gate uses `pull_request` trigger; governance-watchdog uses `pull_request_target` (already fixed for Copilot agent approval gate)

**Overlap analysis**:
- governance-watchdog Gap 2A covers: pre-brief gate before IAA second-tier processing (**stronger** than this standalone gate)
- governance-watchdog Gap 2 covers: alert when ready PR is missing pre-brief (**same** as this gate)
- Keeping both would cause duplicate comment posting for the same scenario

**Recommendation**: **RETIRE** (merge functionality into governance-watchdog, which is already active and stronger). File should be deleted or converted to a comment-only archive note.

**Canon alignment**: N/A (recommending retirement)

---

### 3. `governance-watchdog.yml` — ACTIVE

**Purpose**: Automated governance gap detection across three scenarios.

**Gaps implemented**:
- **Gap 1** (`push`, push event only): Foreman commits to a branch with no open PR → posts commit comment alert. Has guard for `copilot/` branches (exempt — they always have a PR).
- **Gap 2A** (`pull_request_target`, opened/ready_for_review): Pre-brief gate before IAA second-tier. Blocks and posts HARD STOP comment if pre-brief missing. Has idempotency guard via HTML comment marker.
- **Gap 2** (`pull_request_target`, ready_for_review/opened): Posts pre-brief missing alert. Depends on Gap 2A `needs:` — runs only if Gap 2A didn't already block.
- **Gap 3** (`pull_request_target`, synchronize): Detects PREHANDOVER proof with `iaa_audit_token: PENDING` and handover language → posts IAA token missing alert. Idempotency guard via comment body match.

**Design strengths**:
- `pull_request_target` trigger correctly bypasses Copilot agent approval gate
- Gap 3 reads PREHANDOVER file content for keyword scan (not just PR body) — catches in-file handover language
- Idempotency guards on all commenting steps
- Gap 1 has a "governance-only files" guard (skips if all changed files are governance artifacts)

**Design issues identified**:

| Issue | Location | Problem | Severity |
|-------|----------|---------|----------|
| GAP3-001 | Gap 3, line 584 | Action instruction says "Invoke IAA: use `/iaa-prebrief`" — `/iaa-prebrief` invokes the PRE-BRIEF, not the FINAL IAA audit. These are different operations. The final IAA invocation at handover (Phase 4 Step 4.3b) uses `task(agent_type: "independent-assurance-agent")` directly. | MODERATE |
| GAP3-002 | Gap 3 | Only detects PENDING token in PREHANDOVER. Does NOT detect when PREHANDOVER exists without any `iaa-token-*.md` file in `.agent-admin/assurance/` — the token ceremony creates a dedicated file (§4.3b). This is the most common real-world failure mode (session termination before token ceremony). | HIGH |
| GAP3-003 | Gap 3 | Keyword list for handover detection is broad (`ready for review`, `handover`) but misses `session closure`, `phase 4`, `merge gate released` — phrases that appear in closing commit messages. | LOW |
| GAP2-001 | Gap 2 | Pre-brief pattern uses `iaa-prebrief-wave*.md` only — would miss slug-based pre-brief names like `iaa-prebrief-optimize-iaa-invocation-workflows.md`. Gap 2A uses broader `iaa-prebrief-*.md` pattern (correct). | LOW |

**Recommendation**: **KEEP ACTIVE + ENHANCE**.

Enhancements needed (in order of priority):
1. **HIGH** (GAP3-002): Add separate step in Gap 3 to check for absent `iaa-token-*.md` file even when PREHANDOVER token field is not PENDING — catches the "session terminated before token file created" scenario
2. **MODERATE** (GAP3-001): Fix action instruction wording in Gap 3 comment to correctly describe final IAA invocation (not `/iaa-prebrief`)
3. **LOW** (GAP3-003): Expand keyword list in Gap 3
4. **LOW** (GAP2-001): Align Gap 2 pre-brief pattern with Gap 2A's broader `iaa-prebrief-*.md` pattern

**Canon alignment check**:
- Gap 3, line 575: References FAIL-ONLY-ONCE A-014, A-021 — correct
- Gap 3, line 575: References AGENT_HANDOVER_AUTOMATION.md §4.3 — correct
- No stale "never invoke IAA" wording
- ✅ Canon-aligned (enhancements needed but no structural stale wording)

---

### 4. `foreman-reanchor.yml` — DISABLED (STALE)

**Purpose**: Mid-wave re-anchor pulse — reminds Foreman of obligations.

**Trigger (original)**: `pull_request` events for PRs with "Wave", "AAWP", "MAT" in title or specific labels; OR `issue_comment` containing `/foreman-anchor`.

**Design assessment**:
The concept is good — a mid-wave reminder is genuinely useful for POLC compliance. However, the current content contains stale/contradictory wording that MUST NOT be re-enabled unchanged.

**Stale/contradictory content identified**:

| Issue | Location | Problem | Severity |
|-------|----------|---------|----------|
| REANCHOR-001 | Line 98 | `🚫 **NEVER invoke IAA on your own work** — POLC boundary violation. IAA is independent.` — This is STALE and CONTRADICTS current canon. Per foreman-v2-agent contract v2.10.0 Phase 4 Step 4.3b: **Foreman is REQUIRED to invoke IAA at handover**. Per FAIL-ONLY-ONCE A-031: the Foreman owns the stop-and-fix loop and re-invocation after REJECTION-PACKAGE. Foreman IS required to invoke IAA. The correct constraint is: "Foreman must not self-certify or issue its own ASSURANCE-TOKEN" — not "never invoke IAA". | CRITICAL |
| REANCHOR-002 | Line 104 | `contract v2.5.0` — STALE. Current contract version is 6.2.0 / 2.10.0. | HIGH |
| REANCHOR-003 | Line 93 | `Phase 4 Step 4.3a` reference — STALE. Step 4.3a is now "Pre-IAA Commit-State Gate". IAA invocation is Phase 4 Step 4.3b. | MODERATE |
| REANCHOR-004 | Line 29-43 | Trigger scope: only fires for PRs with "Wave", "AAWP", "MAT" in title or specific labels. This would miss generic governance/copilot PRs (e.g. `copilot/optimize-iaa-invocation-workflows`). Most current waves use generic Copilot branch names. | MODERATE |
| REANCHOR-005 | Line 93 | Obligation 1: "Has this PR received an ASSURANCE-TOKEN?" — This is the right check, but the reference to "Phase 4 Step 4.3a" makes it stale. | LOW |

**Recommendation**: **RETIRE and REPLACE** with a new `handover-reanchor.yml`. Do NOT re-enable the existing file. The REANCHOR-001 issue (incorrect IAA wording) alone is sufficient to block re-enablement — restoring it would actively misinform the agent about its IAA obligations.

**New design (`handover-reanchor.yml`) requirements**:
- Trigger: `pull_request_target` (synchronize) for `copilot/` branches + `issue_comment` with `/foreman-anchor`
- Scope: all `copilot/` branches (covers Copilot-coded waves, not just "Wave/AAWP/MAT" title filter)
- Content requirements:
  - Remove all "NEVER invoke IAA" wording entirely
  - Replace with: "Have you invoked IAA per Phase 4 Step 4.3b? If not → invoke now"
  - Correct phase/step references: Phase 4 Step 4.3a (Pre-IAA Commit Gate), Phase 4 Step 4.3b (IAA Independent Audit), Phase 4 Step 4.3c (Token Ceremony)
  - Include POLC reminder: "You do NOT build. If you find yourself editing source files, STOP."
  - Include IAA token ceremony checklist: PREHANDOVER committed → IAA invoked → token file created → merge gate released
  - Update contract version to 6.2.0 / 2.10.0

---

### 5. `injection-audit-report.yml` — DISABLED (manual-only)

**Purpose**: Scan all PR comments for injection workflow markers; post audit table as PR comment.

**Current state**: `workflow_dispatch` only with `pr_number` input.

**Design assessment**:
- Useful as an on-demand manual diagnostic tool
- Not suitable for always-on automation (high token cost, low signal per run)
- Provides value for post-wave IAA audits and governance retrospectives
- The scan logic looks for injection workflow markers in comments, counting fire events and agent acknowledgements — this would be useful for calibrating injection workflow performance

**Recommendation**: **KEEP AS MANUAL-ONLY**. No changes needed. File preserved for occasional audit use.

**Canon alignment**: N/A (manual-only tool)

---

## D2 — Reimplementation Strategy / Plan

### Strategic Objectives

1. **Minimum token usage**: Only fire when clearly needed, with idempotency guards on all comment steps
2. **Maximum enforcement value**: Catch the real failure modes (missing pre-brief, missing final IAA token)
3. **Canon alignment**: All wording must reflect current Foreman-owned IAA re-invocation model
4. **No comment spam**: One comment per gap per PR per lifecycle event, maximum

### Answers to Mandatory Questions

**Q1. Which discontinued workflows still provide high value relative to token cost?**
- `iaa-prebrief-inject.yml`: HIGH VALUE. Pre-brief enforcement is the most critical gate. One comment per wave. Idempotent. T+10min safety net prevents silent failures.
- `governance-watchdog.yml` Gap 3 (existing, active): HIGH VALUE. Catches PENDING token at handover. The most common operational failure mode.

**Q2. Which workflows are now stale against current canon and must not be re-enabled unchanged?**
- `foreman-reanchor.yml`: STALE — REANCHOR-001 (stale IAA wording) is a constitutional conflict. Must be replaced, not re-enabled.
- `iaa-prebrief-gate.yml`: REDUNDANT — functionality already covered by governance-watchdog Gap 2A and Gap 2. Re-enabling would cause duplicate alerts.

**Q3. How should the old Gap 3 watchdog logic be modernized?**
Current Gap 3 detects: PREHANDOVER with `iaa_audit_token: PENDING` + handover keywords.
Modernization needed:
1. Add detection for: PREHANDOVER exists + NO `iaa-token-*.md` file in `.agent-admin/assurance/` (covers "session terminated before token file" case)
2. Fix action instruction: Replace `/iaa-prebrief` reference with correct "invoke IAA via Phase 4 Step 4.3b" instruction
3. Expand keyword set to cover `session closure`, `phase 4`, `merge gate released`

**Q4. Should the new handover watchdog: comment only, fail a check only, or fail a check plus one idempotent comment?**
Recommendation: **Fail check + ONE idempotent comment**.
- The comment provides actionable guidance to the agent (what to do next)
- The failed check creates PR-level visibility (merge blocked until resolved)
- Idempotency guard prevents comment spam
- This is the same pattern governance-watchdog Gap 2A already uses successfully

**Q5. Should the old Foreman re-anchor be retired and replaced by a narrower handover-focused re-anchor?**
YES. The old re-anchor has a constitutional conflict (REANCHOR-001). The replacement should:
- Narrow scope: fire only on handover signals (synchronize events near handover) and `/foreman-anchor` command
- Focus exclusively on Phase 4 checklist (IAA invocation, token ceremony, merge gate)
- Remove general POLC reminders (these are in the agent contract, not in automation)

**Q6. Which workflows should run automatically, and which should remain manual/slash-command only?**

| Workflow | Mode | Rationale |
|----------|------|-----------|
| `iaa-prebrief-inject.yml` | AUTOMATIC (push + PR events) | Pre-brief is mandatory for every wave; automation catches skips reliably |
| `governance-watchdog.yml` | AUTOMATIC (push + PR events) | Gap detection must be real-time |
| New `handover-reanchor.yml` | SLASH-COMMAND + synchronize | Mid-wave reminders should be on-demand OR at handover signal only |
| `injection-audit-report.yml` | MANUAL ONLY (workflow_dispatch) | Audit tool, not enforcement; on-demand is appropriate |

**Q7. How do we minimize token usage while still catching the real failure modes?**
- Keep idempotency guards on all comment steps (already in place)
- T+10 safety net in `iaa-prebrief-inject.yml` adds one delayed recheck (acceptable)
- `handover-reanchor.yml` should NOT fire on every push — only on handover signals or `/foreman-anchor` command
- Gap 3 already has handover keyword detection to avoid firing on routine pushes
- Total expected token cost per wave: ~3 comments maximum (pre-brief invocation, T+10 safety net if pre-brief absent, Gap 3 at handover if token missing)

**Q8. How do we ensure restored workflows align with the canon that Foreman owns IAA re-invocation after rejection?**
- All workflow comments referencing IAA must say: "Invoke IAA via Phase 4 Step 4.3b / task(agent_type: 'independent-assurance-agent')"
- No workflow should say "NEVER invoke IAA" or "only CS2 can re-invoke IAA"
- After REJECTION-PACKAGE: Foreman fixes findings, regenerates PREHANDOVER, re-invokes IAA directly
- Workflow comments should reinforce this: "After receiving a REJECTION-PACKAGE, fix all findings, re-run QP (Phase 3 Step 3.5), regenerate PREHANDOVER, and re-invoke IAA directly."

---

## D3 — Recommended Workflow Set

### Decision Matrix

| Workflow | Decision | Action Required |
|----------|----------|----------------|
| `iaa-prebrief-inject.yml` | **RE-ENABLE** | Restore original triggers (push, pull_request_target, issue_comment). Remove DISABLED comment. No logic changes needed — design is sound. |
| `iaa-prebrief-gate.yml` | **RETIRE** | Delete file or mark as archived. Functionality fully covered by governance-watchdog Gap 2A and Gap 2. |
| `governance-watchdog.yml` | **KEEP + ENHANCE** | 4 enhancements (2 HIGH/MODERATE, 2 LOW). Especially GAP3-002 (absent iaa-token-*.md detection) and GAP3-001 (fix IAA re-invocation wording). |
| `foreman-reanchor.yml` | **RETIRE + REPLACE** | Delete/archive existing file. Create new `handover-reanchor.yml` per design spec below. |
| `injection-audit-report.yml` | **KEEP AS-IS** | No changes. Manual-only audit tool. |

### New `handover-reanchor.yml` Design Specification

**File**: `.github/workflows/handover-reanchor.yml`  
**Name**: `Foreman Handover Re-Anchor`

**Triggers**:
```yaml
on:
  pull_request_target:
    types: [synchronize]
  issue_comment:
    types: [created]
```

**Job conditions**:
- For `pull_request_target`: Only for `copilot/` branches
- For `issue_comment`: Only if comment contains `/foreman-anchor`
- For both: Guard against liaison/automated/ripple PRs

**Content (canonical, not stale)**:

```
## 🔄 FOREMAN HANDOVER RE-ANCHOR

@copilot — You are **foreman-v2-agent** (contract v6.2.0 / 2.10.0). You do NOT build. You orchestrate.

### Phase 4 Handover Checklist — Check Each Before Proceeding:

1. ✅ **OPOJD**: Is this wave fully complete? (Zero test failures, zero warnings, zero stubs)
2. ✅ **§4.3 Parity**: Has the merge gate parity check been run locally?
3. ✅ **IAA Invocation**: Have you invoked IAA per Phase 4 Step 4.3b?
   - If NO → Invoke now: task(agent_type: "independent-assurance-agent")
   - Provide: PREHANDOVER proof + session memory + wave evidence bundle
4. ✅ **Token Ceremony**: Has the IAA token been committed at .agent-admin/assurance/iaa-token-*.md?
   - Token file must include non-empty PHASE_B_BLOCKING_TOKEN:
5. ✅ **PREHANDOVER immutability**: PREHANDOVER proof must NOT be edited after initial commit.
6. ✅ **After REJECTION-PACKAGE**: Fix all findings → re-run QP (Phase 3 Step 3.5) → regenerate PREHANDOVER (new commit) → re-invoke IAA directly (you own this loop).

🚫 **NEVER write production code, schemas, migrations, or tests** — if you find yourself editing source files, STOP immediately and delegate to the correct builder.
```

**Idempotency**: Guard via HTML comment marker on PR. Do not repost on every synchronize — fire only if handover keywords present in commit message OR PR title, OR if triggered via slash command.

**Anti-spam**: For automatic firing (synchronize), check for handover keywords in HEAD commit message before posting.

---

## D4 — Follow-Up Implementation Issues

The following issues are recommended for creation by CS2 to action the implementation work:

### Issue 1: Re-enable `iaa-prebrief-inject.yml`

**Suggested title**: `[Governance] Re-enable iaa-prebrief-inject.yml — restore push/PR/comment triggers`

**Scope**: Modify `.github/workflows/iaa-prebrief-inject.yml`
- Restore original `on:` triggers: `push` (branches-ignore: main), `pull_request_target` (opened, synchronize), `issue_comment` (created)
- Remove DISABLED comment block (lines 3–5)
- No logic changes — the implementation is sound

**Assigned builder**: api-builder (workflow file modifications)
**IAA trigger category**: GOVERNANCE (workflow modification requires IAA)
**Estimated effort**: Small (trigger restoration only, ~5-10 line change)
**Dependencies**: None

---

### Issue 2: Enhance `governance-watchdog.yml` Gap 3

**Suggested title**: `[Governance] governance-watchdog.yml — Gap 3 enhancement: absent iaa-token detection and IAA re-invocation wording fix`

**Scope**: Modify `.github/workflows/governance-watchdog.yml` Gap 3 section
- **HIGH**: Add detection for `iaa-token-*.md` absence in `.agent-admin/assurance/` (separate from PENDING token check) — fires alert if PREHANDOVER exists but no token file committed yet
- **MODERATE**: Fix action instruction wording in Gap 3 alert comment: replace "Invoke IAA: use `/iaa-prebrief`" with "Invoke IAA per Phase 4 Step 4.3b: use task(agent_type: 'independent-assurance-agent')"
- **LOW**: Add keywords `session closure`, `phase 4`, `merge gate released` to Gap 3 handover keyword list
- **LOW**: Align Gap 2 pre-brief pattern to `iaa-prebrief-*.md` (matching Gap 2A's broader pattern)

**Assigned builder**: api-builder (workflow file modifications)
**IAA trigger category**: GOVERNANCE (workflow modification requires IAA)
**Estimated effort**: Medium (2-3 new steps in Gap 3 section)
**Dependencies**: None

---

### Issue 3: Replace `foreman-reanchor.yml` with `handover-reanchor.yml`

**Suggested title**: `[Governance] Replace foreman-reanchor.yml with canon-aligned handover-reanchor.yml`

**Scope**:
1. Delete `.github/workflows/foreman-reanchor.yml` (or archive with RETIRED header)
2. Create `.github/workflows/handover-reanchor.yml` per D3 design spec above

**Critical requirements**:
- MUST NOT contain any "NEVER invoke IAA" wording
- MUST reference current contract version 6.2.0 / 2.10.0
- MUST reference Phase 4 Step 4.3b for IAA invocation (not 4.3a)
- MUST include post-REJECTION-PACKAGE re-invocation guidance
- MUST scope to `copilot/` branches (not just "Wave/AAWP/MAT" title filter)

**Assigned builder**: api-builder (workflow file modifications)
**IAA trigger category**: GOVERNANCE (workflow modification requires IAA + agent contract guard for `.github/agents/` should NOT be triggered since this is `.github/workflows/`)
**Estimated effort**: Medium (new workflow file, ~100 lines)
**Dependencies**: None (independent of Issues 1 and 2)

---

### Issue 4: Retire `iaa-prebrief-gate.yml`

**Suggested title**: `[Governance] Retire iaa-prebrief-gate.yml — superseded by governance-watchdog Gap 2A/2`

**Scope**: Delete or archive `.github/workflows/iaa-prebrief-gate.yml`

**Rationale**: Functionality is fully covered by governance-watchdog.yml Gap 2A and Gap 2. Retaining creates risk of duplicate comment posting if both are ever re-enabled simultaneously.

**Assigned builder**: api-builder (file deletion)
**IAA trigger category**: GOVERNANCE (workflow deletion requires IAA)
**Estimated effort**: Trivial (deletion or archive)
**Dependencies**: Should be done after governance-watchdog Gap 3 enhancement (Issue 2) is confirmed complete, to ensure no coverage gaps

---

## Implementation Priority

| Priority | Issue | Rationale |
|----------|-------|-----------|
| 1 — HIGH | Issue 1 (Re-enable prebrief-inject) | Directly prevents the most common pre-brief skip. Zero logic changes needed. |
| 2 — HIGH | Issue 2 (Gap 3 enhancement) | Closes the most common real-world gap: session terminated before token ceremony. |
| 3 — MEDIUM | Issue 3 (Replace reanchor) | Removes active misinformation about IAA invocation. Important but not blocking. |
| 4 — LOW | Issue 4 (Retire gate) | Cleanup. No urgency. |

---

## Anti-Spam / Idempotency Summary

All reimplemented workflows must maintain idempotency via:
1. HTML comment markers (`<!-- marker-name -->`) for unique-per-PR checks
2. Comment body substring checks (scan recent comments before posting)
3. State file checks (pre-brief artifact existence, token file existence)

The governance-watchdog's existing idempotency patterns are correct and should be preserved/reused.

---

## Token Economy Assessment

| Workflow | Comments per wave (expected) | Cost |
|----------|------------------------------|------|
| iaa-prebrief-inject.yml (re-enabled) | 1 (pre-brief invocation) + 0-1 (T+10 safety net) | LOW |
| governance-watchdog.yml | 0-1 (Gap 1, only if no PR) + 0-1 (Gap 2A/2, only if pre-brief missing) + 0-1 (Gap 3, only at handover if token missing) | LOW |
| handover-reanchor.yml (new) | 0-1 (at handover signal or /foreman-anchor command) | LOW |
| injection-audit-report.yml | 0 (manual-only) | ZERO |
| **Total expected per well-run wave** | **1 comment** (pre-brief invocation only) | **MINIMAL** |
| **Total expected per wave with pre-brief skip** | **2-3 comments** (pre-brief + T+10 + Gap 2) | **LOW** |
| **Total expected per wave with token ceremony skip** | **1-2 comments** (Gap 3 + possible reanchor) | **LOW** |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Foreman contract**: foreman-v2-agent v6.2.0 / 2.10.0
**Living Agent System**: v6.2.0
