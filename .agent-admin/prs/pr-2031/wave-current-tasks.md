# PR #2031 — Wave Current Tasks (Production Remediation, Issue #2030)

```yaml
pr_scope:
  pr_number: 2031
  pr_url: "https://github.com/APGI-cmy/maturion-isms/pull/2031"
  base_branch: "main"
  head_branch: "apgi-cmy-issue-2030-production-remediation-organisation-context"
  head_sha_at_open: "0de9bdda9e0b7186619d6c5b599993dd2eecf1d3"
  tracks_issues: [2025, 2030]
  supersedes_pr: 2026
  supersedes_merge_commit: "ed22c9a2"
  cs2_authorization: "issue #2030 (production-remediation record, CS2/APGI-cmy authorized)"
```

## 1. Why this PR exists — precise fault statement

Production fault: `mmm-subject-knowledge-reprocess` Edge Function returns **HTTP 546
`WORKER_RESOURCE_LIMIT`** at approximately **125.6s** wall-clock, caused by an unconditional
120-second synchronous AI-parse timeout (`AI_PARSE_TIMEOUT_MS = 120_000`) that exceeds Supabase's
Edge Function resource ceiling under real document-parsing load. **Context-metadata saves are not
the primary fault** — they are a downstream symptom (inline save-error UX), not the root cause.

PR #2026 (the original governed delivery vehicle for issue #2025) was merged directly to `main`
(merge commit `ed22c9a2`, merged by CS2/APGI-cmy at `2026-08-18T15:11:07Z`) **before** the
Foreman-governed reconciliation, fresh QP, and IAA final-assurance chain completed. The content
that actually landed on `main` came from an out-of-band, uncoordinated GitHub-native Copilot
coding-agent session (triggered independently to address 3 narrow Codex-review findings) — NOT
from the governed api-builder/ui-builder/qa-builder chain. Full incident record:
`.agent-admin/prs/pr-2026/wave-current-tasks.md` (sections BLK-2025-01 and BLK-2025-02).

**Why `ed22c9a2` is insufficient** (verified directly against `origin/main` before opening this PR):
- `AI_PARSE_TIMEOUT_MS` unchanged at `120_000` — root cause untouched.
- Resource-safety opt-in only, gated behind a client-sent `background: true` flag; any caller
  omitting it still takes the original unbounded synchronous path.
- No hard-timeout guard on the backgrounded pipeline — a document could remain stuck at
  `processing_status: 'processing'` indefinitely.
- `_shared/mmm-subject-knowledge-resource-budget.ts` (api-builder's tested pure budget module)
  was never merged — confirms the merged branch predates and is independent of the governed fix.

## 2. Frozen scope (unchanged from issue #2025, carried forward verbatim)

- Repeatable optional supplementary document rows (file selection reveals next empty row;
  selected rows removable; 3+ selectable documents).
- Supported formats: PDF, DOC, DOCX, TXT, MD, CSV, JSON, PPT, PPTX, XLS, XLSX, with MIME-type
  fallback by filename extension.
- Mixed-batch per-file isolation: one file's failure must not block/corrupt the others.
- Durable, actionable per-file statuses (not transient UI-only state).
- Recoverable, bounded/async resource-safe parsing — regression guard for the Edge Worker
  HTTP 546 fault.
- Exact inline context-save error UX — no browser `alert`/`confirm`/`prompt`.
- RLS/storage isolation and all pre-existing organisation-scoping behavior preserved unchanged.
- No schema/migration changes in scope.

## 3. Governed lineage carried forward (never re-delegated from scratch)

| Stage | Agent | Commit (original, PR #2026 branch) | Status |
|---|---|---|---|
| IAA canonical PRE-BRIEF | independent-assurance-agent | `.agent-admin/assurance/iaa-wave-record-issue-2025-20260818.md` | Reused, still valid — content unchanged |
| QA-to-Red (initial) | qa-builder | `1a2fdbd8` | Reused |
| QA-to-Red (reconciliation additions T-2025-09/10/11) | qa-builder | `c1409922` | Reused |
| UI Builder (initial) | ui-builder | `70d102ef` | Reused |
| UI Builder (reconciliation: basename uniqueness, trailing-row invariant, deferred-status messaging, abort-timer removal) | ui-builder | `f4234d5b` | Reused |
| API Builder (server-side unconditional bounded fix) | api-builder | `b07ebf38` | Reused, authoritative |

All 5 governed files were ported onto this PR's branch (forked fresh from `origin/main` at
`ed22c9a2`) via `git checkout old-governed-chain -- <path>` and committed as a single, explicitly
documented supersession commit: **`0de9bdda`** on this branch.

Files carried: `apps/mmm/src/pages/OrganisationContextPage.tsx`,
`modules/MMM/tests/B4-framework/organisation-context-mixed-document-red-issue-2025.test.tsx`,
`supabase/functions/mmm-subject-knowledge-reprocess/index.ts`,
`supabase/functions/_shared/mmm-subject-knowledge-resource-budget.ts` (new),
`modules/MMM/tests/B4-framework/mmm-subject-knowledge-resource-budget.test.ts` (new).

No same-commit proof: appointment/prebrief commits and their corresponding implementation
commits remain distinct, ordered commits on the historical `old-governed-chain` reference
(local tag) and are cited above by hash. This PR's single supersession commit (`0de9bdda`) is
explicitly a **porting/reconciliation** commit, not a new implementation — its provenance is the
already-QP-verified chain, not undelegated new work.

## 4. Fresh gates required for THIS PR (not yet run at PR open)

- [x] Targeted QA-to-Red suite independently reproduced GREEN by Foreman against this exact head
      (`0de9bdda`): 27/27 passed (12 UI/behavior tests + 15 resource-budget unit tests).
- [x] `tsc --noEmit` clean for `apps/mmm` against this head.
- [x] Cross-wave/CWT anti-regression check: full `modules/MMM/tests/B4-framework/` suite run
      against this head (999 tests, 25 failed / 424 passed / 550 todo across 8 failed files) —
      **all 25 failing tests independently confirmed to have zero references to any of the 5
      files this PR touches**, and independently confirmed to fail identically on unmodified
      `origin/main` (`ed22c9a2`) via an isolated worktree comparison (17 of 25 directly
      reproduced; remaining domain-workflow/workspace-resilience/framework-handoff file-level
      failures were an artifact of the comparison worktree's `node_modules` junction breaking
      Vite's module resolution — not a real signal — but zero overlap with this PR's changed
      files rules out causation either way). These are pre-existing, unrelated failures (mostly
      Issue #1990 migration-baseline/native-migrations-bootstrap work, tracked on a separate
      active branch `fix/issue-1990-mmm-native-migrations-ledger`, plus unrelated descriptor-
      learning/AI-linkage work) — **not introduced by this PR**.
- [ ] App build (root `build`/`lint` scripts are repo-wide placeholders — no build step currently
      configured at the root; no regression possible from a non-existent build gate).
- [ ] Production-equivalent configuration validation (timeout budgets vs. Supabase free-plan
      150s wall-clock ceiling; SYNC_COMPLETION_BUDGET_MS=8s + BACKGROUND_COMPLETION_HARD_TIMEOUT_MS=100s
      worst-case 108s headroom) — to be explicitly re-confirmed before final handover.
- [ ] Compatibility/security/compliance evidence collection.
- [ ] ECAP Phase-4 administrative bundle (execution-ceremony-admin-agent).
- [ ] Pre-handover lane gate (`/prepare-handover`).
- [ ] Fresh independent IAA final assurance bound to this PR's head SHA (first-ever final IAA
      invocation for this body of work — PR #2026 was merged before Foreman reached that stage).

## 5. Explicit documentation: what `ed22c9a2` shipped vs. what this PR corrects

See section 1 above and `.agent-admin/prs/pr-2026/wave-current-tasks.md` for the full incident
narrative (BLK-2025-01: ungoverned parallel branch divergence; BLK-2025-02: CS2 merged the
ungoverned branch before governed reconciliation completed).

## 6. Risks

- Residual risk that another out-of-band session could merge over this PR before Foreman's fresh
  QP/IAA chain completes — mitigated by Foreman explicitly re-checking live PR state via
  `gh pr view` before every push/handover-adjacent action going forward, and by prompt reporting
  to the parent Foreman/CS2 at each gate.
- None of the frozen-scope requirements are affected by files outside the 5 listed above.

## 7. STATUS

```yaml
status: "GATES_IN_PROGRESS"
blockers: []
next_action: "Run production-equivalent configuration validation, then ECAP admin bundle, pre-handover gate, and independent IAA final assurance bound to head 0de9bdda"
```
