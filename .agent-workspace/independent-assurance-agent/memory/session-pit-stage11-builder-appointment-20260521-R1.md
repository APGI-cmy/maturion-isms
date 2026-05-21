# IAA Session Memory

- session_id: session-pit-stage11-builder-appointment-20260521-R1
- pr_reviewed: PR #1730 — PIT Stage 11 Builder Appointment (Issue #1729)
- overlay_applied: PRE_BUILD_GATES (OVL-PBG-001–OVL-PBG-013 applicable to appointment wave) + SIMPLIFIED_ADMIN_ASSURANCE (OVL-SAA-001–008) + STRICT_MERGE_POSTURE (OVL-SMP-001–003)
- verdict: REJECTION-PACKAGE
- checks_run: 25 substance checks: 23 PASS, 2 FAIL
- learning_note: |
    Two Ceremony-class failures found in otherwise high-quality appointment wave:

    PATTERN 1 (A-029 recurrence prevention): Foreman committed PREHANDOVER with
    `iaa_audit_token: PENDING_FINAL_ASSURANCE` — the old PENDING pattern. A-029 requires
    pre-population with expected reference `IAA-<wave>-<date>-PASS` at commit time. This
    is the same class of error A-029 was created to prevent. The PREHANDOVER correctly
    documents the expected reference in a separate note field (`Expected token reference:`),
    showing awareness — but did not place it in the `iaa_audit_token:` field. Fix: Foreman
    PREHANDOVER template must use `iaa_audit_token: IAA-<wave>-<date>-PASS` (not PENDING)
    as the commit-time pre-population value.

    PATTERN 2 (wave-current-tasks closure hygiene): Tasks 6 (builder delegation) and 7 (QP
    review) remained ⏳ at IAA invocation time, despite PREHANDOVER confirming QP VERDICT: PASS
    and all deliverables committed. Task 9 also retained old "likely N/A" wording that IAA
    pre-brief had explicitly corrected to REQUIRED. Producing agent must close tasks as ✅
    before invoking IAA — wave-current-tasks.md must reflect actual delivery state at invocation
    time, not the pre-delivery state.

    SUBSTANCE OF APPOINTMENT ARTIFACTS: Excellent. All 5 required artifacts committed with
    concrete, auditable content. No placeholders. All anti-regression obligations verified.
    Build Authorization NOT CLEARED, Stage 12 NOT_STARTED, 147 baseline acknowledged. Both
    failures are Ceremony-class and correctable in a new commit before re-invocation.

    GOVERNANCE NOTE: NO-STANDALONE-TOKEN-001 + NO-ASSURANCE-PATH-ESCAPE-001 prohibit
    creation of standalone `iaa-token-*.md` files. The invocation requested such a file but
    IAA's contract prohibitions are absolute. Token will be written to ## TOKEN of the wave
    record on passing invocation, per Step 4.2b.
