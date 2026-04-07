# IAA High-Frequency Miss Checks (HFMC)

**Agent**: independent-assurance-agent
**Version**: 1.0.0
**Status**: ACTIVE
**Last Updated**: 2026-04-07
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Referenced by**: IAA contract Phase 3 Step 3.1b

---

## Purpose

These 6 named binary checks (HFMC-01 through HFMC-06) represent the most frequently
recurring preventable failure categories observed across IAA sessions. Each check is
binary: YES (pass) or NO (fail). Any NO = REJECTION-PACKAGE. No partial credit.

They are executed in Phase 3 Step 3.1b before the core invariants checklist to surface
high-frequency misses early and reduce churn in the review cycle.

---

## Check Definitions

### HFMC-01 — Ripple Assessment Presence

**Check**: Does the PREHANDOVER proof include a `## Ripple/Cross-Agent Assessment` section
(or equivalent) that evaluates impact on downstream agents?

**How to verify**: Look for a `## Ripple` or `## Cross-Agent` section in the PREHANDOVER
proof file. It must be non-empty and assess impact on at least one other agent or system.

**Required outcome if NO**: Fix required — add a Ripple/Cross-Agent Assessment section
to the PREHANDOVER proof. Do not re-use a section with empty content.

**Background**: Recurring failure in sessions 051, 052. Confirmed pattern in IAA FAIL-ONLY-ONCE
registry (A-023). OVL-AC-007 also covers this for agent contract PRs.

---

### HFMC-02 — SCOPE_DECLARATION.md Parity

**Check**: Does `.agent-workspace/CodexAdvisor-agent/personal/SCOPE_DECLARATION.md`
(or equivalent scope declaration file) list exactly the same files as the PR diff?

**How to verify**: Run `git diff origin/main...HEAD --name-only | sort` and compare to
SCOPE_DECLARATION.md contents. File lists must match exactly.

**Required outcome if NO**: Fix required — update SCOPE_DECLARATION.md to match the
current PR diff before IAA is re-invoked.

**Background**: Recurring failure in sessions 052, 050. Confirmed pattern (PARITY-A-026).

---

### HFMC-03 — Committed Artifacts Completeness

**Check**: Are ALL bundle items declared in the PREHANDOVER proof already committed to
the branch? (No artifacts in PENDING or "will commit" state.)

**How to verify**: For each file path listed in the PREHANDOVER proof bundle, confirm
the file exists in the working branch (`git show HEAD:[path]`). Any path not yet committed
= NO.

**Required outcome if NO**: Fix required — commit all pending bundle items, then
re-invoke IAA.

**Background**: IAA R1 rejections frequently cite uncommitted artifacts. Confirmed pattern
in session 051 (REJECTION R1 failure type 1).

---

### HFMC-04 — Pre-Brief Presence

**Check**: Does a valid IAA pre-brief exist at
`.agent-admin/assurance/iaa-prebrief-wave<N>.md` (where N matches the current wave)?

**How to verify**: Confirm the file exists and is non-empty. If the PR was initiated
without a wave context, confirm this check is N/A and record justification.

**Required outcome if NO**: Fix required — IAA Pre-Brief must be generated before
Phase 2–4 assurance proceeds. Invoke IAA in PRE-BRIEF mode if absent.

**Background**: CI enforces `iaa_prebrief_path:` field in wave-current-tasks.md.
Recurring friction source when pre-brief is skipped at wave start.

---

### HFMC-05 — Token Ceremony Correctness

**Check**: Does the IAA token file follow the required naming pattern
`.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md` AND include a
non-empty `PHASE_B_BLOCKING_TOKEN: <value>` line?

**How to verify**:
1. File exists at the expected path pattern
2. File contains `PHASE_B_BLOCKING_TOKEN: <non-empty, non-PENDING value>`
3. File is NOT named iaa-rejection-* (rejection packages are exempt from this check)

**Required outcome if NO**: Fix required — write a compliant token file. Per FAIL-ONLY-ONCE
A-037 and CI gate `preflight/iaa-token-self-certification`.

**Background**: A-037 added in session-052-20260406 to enforce PHASE_B_BLOCKING_TOKEN
presence. CI gate blocks PRs with missing or empty token.

---

### HFMC-06 — Evidence Bundle Completeness

**Check**: Are all 4 required bundle items present for agent contract or governance PRs?

Required bundle items:
1. Agent contract file (`.github/agents/<agent>.md`)
2. Tier 2 knowledge stub (`.agent-workspace/<agent>/knowledge/index.md` or updated T2 file)
3. PREHANDOVER proof (`.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-NNN-*.md`)
4. Session memory (`.agent-workspace/CodexAdvisor-agent/memory/session-NNN-*.md`)

**How to verify**: Confirm all 4 paths exist in the current PR diff.

**Required outcome if NO**: Fix required — add missing bundle items to the PR before
re-invoking IAA.

**Background**: Repeated pattern (BREACH-001 through BREACH-006 in CodexAdvisor breach
registry). CI checks for session memory and PREHANDOVER. A full evidence bundle prevents
the most common merge gate failures.

---

## Output Format

For each check, output:

```
HFMC-01 Ripple: YES ✅
HFMC-02 Scope parity: NO ❌ — Finding: SCOPE_DECLARATION.md has 5 files, diff has 7. Missing: [paths]. Fix: update SCOPE_DECLARATION.md.
HFMC-03 Artifacts committed: YES ✅
HFMC-04 Pre-brief: YES ✅
HFMC-05 Token ceremony: YES ✅
HFMC-06 Evidence bundle: YES ✅
```

Any NO triggers immediate REJECTION-PACKAGE. Include HFMC failures in the REJECTION-PACKAGE
FAILURES list with classification: Ceremony or Systemic (per Step 3.4a/3.4b).

---

## Recurring Pattern Escalation

When the same HFMC check fails repeatedly across sessions:
1. Classify the failure as **Systemic** (per Step 3.4a)
2. Per Step 3.4b: REJECTION-PACKAGE must name a required prevention action
3. Per NO-REPEAT-PREVENTABLE-001: structural prevention is required, not just re-detection

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Part of IAA contract v2.5.0 upgrade — Issue #1282**
