# Wave Current Tasks — Issue 1311

wave: optimize-iaa-invocation-workflows
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-optimize-iaa-invocation-workflows.md

## Active Wave: optimize-iaa-invocation-workflows

### Wave Description
Foreman orchestrates selective reimplementation and hardening of the discontinued inject/watchdog
workflow set in maturion-isms. Planning-only wave: produces review artifact (D1), reimplementation
strategy/plan (D2+D3), and follow-up implementation issues (D4). No builder delegation in this wave.

CS2 Authorization: Issue maturion-isms#1311 opened by @APGI-cmy (CS2 = Johan Ras) and assigned to
foreman-v2-agent (Copilot). Issue author is CS2 (Johan Ras / @APGI-cmy).

### Tasks
- [x] T1: IAA Pre-Brief — .agent-admin/assurance/iaa-prebrief-optimize-iaa-invocation-workflows.md
- [x] T2: Workflow Review Artifact (D1) — review all 5 discontinued/active workflows
- [x] T3: Reimplementation Strategy/Plan (D2+D3)
- [x] T4: Follow-up Implementation Issues (D4)
- [ ] T5: PREHANDOVER proof committed
- [ ] T6: IAA final audit and token

### Workflows Under Review
- iaa-prebrief-inject.yml (DISABLED — issue #1061)
- iaa-prebrief-gate.yml (DISABLED — issue #1061)
- governance-watchdog.yml (ACTIVE — Gaps 1, 2A, 2, 3)
- foreman-reanchor.yml (DISABLED — issue #1061, stale IAA wording)
- injection-audit-report.yml (DISABLED — manual-only)

### Previous Wave (Closed)
wave: ecap-001-layer-down-implementation (Issue #1305)
