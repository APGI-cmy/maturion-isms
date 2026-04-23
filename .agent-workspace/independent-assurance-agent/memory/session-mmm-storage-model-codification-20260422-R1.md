# IAA Session Memory — mmm-storage-model-codification-20260422 (R1)

- session_id: session-mmm-storage-model-codification-20260422-R1
- pr_reviewed: PR #1460 — Resolve and codify MMM storage bucket model (copilot/resolve-mmm-storage-model-drift)
- overlay_applied: AAWP_MAT / PRE_BUILD_STAGE_MODEL (PRE_BUILD_GATES OVL-PBG-001–016 + AAWP_MAT BD-000–BD-024 + ACR-01–11)
- verdict: REJECTION-PACKAGE (R1) — Token reference: IAA-session-mmm-storage-model-codification-20260422-REJECT-R1
- checks_run: 23 checks total — 20 PASS, 3 FAIL. Substantive deliverables (ADR, migrations, tests, tracker) all PASS locally. Failures are CEREMONY only.
- learning_note: |
    RECURRING PATTERN — A-021 PUSH-GAP (third occurrence in recent waves):
    ECAP committed ceremony bundle (ef8176f6) and Foreman committed handback acceptance (88781e79) locally,
    but neither commit was pushed before IAA invocation. GitHub API returned HTTP 404 for all 3 ceremony file
    paths (PREHANDOVER at two declared paths, session memory). The pre-IAA gate protocol does not include an
    explicit `git log --oneline origin/{branch}..HEAD` check to confirm zero unpushed commits. This must be
    hardened. Additionally, `governance/scope-declaration.md` was acknowledged as needing update in the ECAP
    session memory, but Foreman did not action it before invoking IAA (recurring A-026 pattern).

    PREVENTION ACTION REGISTERED:
    1. Pre-IAA gate must include: `git log --oneline origin/copilot/resolve-mmm-storage-model-drift..HEAD`
       must return empty (no unpushed commits) before Foreman can invoke IAA.
    2. `governance/scope-declaration.md` update must be a mandatory, named checklist step in the Foreman
       pre-IAA gate — not optional, not delegatable to ECAP.
    3. ACR-01 chain: Any time ECAP is appointed, the reconciliation summary (embedded in PREHANDOVER) is
       only accessible on GitHub after the PREHANDOVER is pushed. Push gap = automatic ACR-01 failure.

    SUBSTANTIVE NOTE: Deliverables are sound. The simple resolution path is:
    1. git push (resolves F-001 + F-002)
    2. governance/scope-declaration.md update + push (resolves F-003)
    3. Re-invoke IAA — expected ASSURANCE-TOKEN on re-invocation.
