# Functional Delivery Active Evidence Boundary

**Authority**: CS2 (Johan Ras / @APGI-cmy) working model; CodexAdvisor cleanup pass  
**Date**: 2026-05-22  
**Purpose**: Prevent historical functional delivery evidence from being treated as current-head proof for unrelated active PRs.

## Boundary Rule

Only the evidence file for the active PR is current-head evidence:

```text
.functional-delivery/pr-<ACTIVE_PR_NUMBER>.md
```

All other `.functional-delivery/pr-*.md` files are protected historical records. They may contain `CURRENT_HEAD` token values, old SHAs, partial-delivery verdicts, or historical limitations that were valid in their original PR context. They must not be rewritten, deleted, or used to satisfy current PR evidence unless the active PR explicitly points to that file with a `Functional-Delivery-Artifact:` line.

## Gate Behavior Required

Current-head SHA injection and validation must target only:

- `.functional-delivery/pr-<ACTIVE_PR_NUMBER>.md`
- a functional-delivery artifact explicitly named in the active PR body
- resolver-selected active PR artifacts

Bulk rewriting every historical `.functional-delivery/pr-*.md` file is prohibited because it corrupts audit meaning and creates false current-head posture.

## Active PRs at Creation

Open PRs observed during this cleanup pass:

- PR #1731 — MMM DomainAuditBuilder / legacy harvest recovery
- PR #1741 — PIT Stage 12 W8.1 intake / authorization router shell
- PR #1742 — producer post-handover remediation loop hardening

These entries are informational only. The binding active PR number is always the runtime PR context.

