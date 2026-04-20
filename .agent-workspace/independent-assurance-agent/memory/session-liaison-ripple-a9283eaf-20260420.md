# IAA Session Memory — Session liaison-ripple-a9283eaf-20260420 — 2026-04-20

- session_id: session-liaison-ripple-a9283eaf-20260420
- pr_reviewed: "#1434 — [WIP] Propagate governance changes for layer-down artifacts (branch: copilot/layer-down-propagate-governance-changes-aad6494d-f2d5-4cdb-850b-4b7b2f1a7e43, governance-liaison-isms session-068)"
- overlay_applied: LIAISON_ADMIN (KNOWLEDGE_GOVERNANCE overlay per trigger table)
- verdict: REJECTION-PACKAGE
- checks_run: 8 substance checks: 4 PASS, 4 FAIL
- learning_note: >
    Liaison agents must not self-issue PHASE_A_ADVISORY tokens when IAA is operating at
    PHASE_B_BLOCKING. Session-068 pre-declared "PHASE_A_ADVISORY" in session memory before IAA
    was invoked — this is a self-issued token with no governance standing. The correct pattern is:
    leave iaa_audit_token as [pending] in session memory, invoke IAA, and only record the
    actual verdict reference after IAA issues it. Additionally, files must be committed to
    the branch before IAA invocation — uncommitted working-tree changes cannot be merge-gate-verified.
    Both patterns (self-advisory token + uncommitted work) are preventable via PREHANDOVER template
    enforcement. Promotion candidate for FAIL-ONLY-ONCE if recurrence observed.
