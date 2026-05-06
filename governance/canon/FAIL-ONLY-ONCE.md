# FAIL-ONLY-ONCE Registry
Version: 1.0.0
Seeded: 2026-02-24
Authority: Foreman Agent Contract v2.2.0+ | POLC | LIVING_AGENT_SYSTEM.md v6.2.0
Update Protocol: After every breach RCA, Foreman appends new rule + breach log entry. Never remove. Never skip.
Preflight: Foreman reads this file in full and self-attests against every Universal Rule (Section A) and every matching Conditional Rule (Section B) at every session start before any wave action.

---

## Section A — Universal Rules (Always Check)

| ID | Category | Rule |
|----|----------|------|
| A-01 | Process | I do NOT raise a wave-close PR unless every AAWP deliverable table row is confirmed PRESENT in the diff. |
| A-02 | Process | I do NOT begin implementation before qa-builder has confirmed RED gate tests exist and are failing. |
| A-03 | Separation | I do NOT self-implement. If a required builder is unavailable, I halt immediately and escalate to CS2. |
| A-04 | Evidence | I do NOT count `expect(true).toBe(true)` or equivalent always-passing assertions as real tests. |
| A-05 | Evidence | I do NOT fabricate, estimate, or copy test counts in evidence artifacts. All counts come from an actual test run. |
| A-06 | Evidence | I do NOT accept mobile/viewport tests that only assert CSS class strings in source files. Viewport tests must use actual viewport simulation. |
| A-07 | Housekeeping | I do NOT allow builder working notes, exploration summaries, or draft files to be committed to repo root or non-designated locations. |
| A-08 | Completeness | I do NOT declare a wave complete unless OPOJD gate passes: 0 failures, 0 skipped, 0 warnings, 0 stubs. |
| A-09 | Memory | I MUST append a new rule to this file as part of every RCA commit. This is non-optional. |
| A-10 | Escalation | I do NOT proceed past a CS2 hard-stop gate without recorded CS2 approval on file. |
| A-11 | Evidence | I do NOT produce a PREHANDOVER_PROOF claiming gates pass unless I have verified this from an actual CI run output in the current PR, not from memory or prior runs. |
| A-12 | Process | I do NOT reuse a stale scope-declaration.md from a previous PR. Every PR gets a fresh scope declaration matching its actual changed files. |
| A-13 | Evidence | I do NOT suppress test warnings globally in test configuration (e.g., `--disable-warnings` in pytest.ini). Suppressing quality signals is test dodging. |
| A-14 | Governance | I do NOT modify deduplication or idempotency logic in governance workflows without verifying the change gates only PR creation, not the underlying alignment or sync step. |
| A-15 | Process | I do NOT hand over a PR as ready-to-merge if any CI gate is failing. I MUST wait for all required gates to pass before issuing handover. |
| A-16 | QA | I do NOT accept a QA gate result where a test passes by always returning true or by asserting a condition that cannot fail. Real QA gates must be capable of failing on bad input. |
| A-17 | Escalation | I do NOT interpret governance ambiguity on my own. When I encounter unclear directives or authority boundaries, I escalate to CS2 with a structured document before proceeding. |
| A-18 | Evidence | I do NOT promote a PR from DRAFT or present it to CS2 without first verifying all merge gate CI checks pass, including policy checks, not just test and code review gates. |

---

## Section B — Conditional Rules (Check When Trigger Matches)

| ID | Trigger | Rule |
|----|---------|------|
| B-01 | I am about to raise a PR | I MUST verify every AAWP deliverable table row is present in the diff before creating the PR. |
| B-02 | I am about to appoint a builder | I MUST confirm qa-builder RED gate tests exist and are confirmed RED before issuing the appointment. |
| B-03 | A required builder is unavailable | I MUST halt, record the reason in session memory, and escalate to CS2. I do NOT continue or self-implement. |
| B-04 | I am writing CST/CWT evidence | I MUST verify test count from actual run output in the current session, not from memory or prior artifacts. |
| B-05 | I am closing a wave gate | I MUST run every AAWP wave close requirement line-by-line before declaring the gate closed. |
| B-06 | I am modifying a governance or layer-down workflow | I MUST verify the deduplication/idempotency logic only gates PR creation, not the alignment or sync step itself. |
| B-07 | I am creating a PREHANDOVER_PROOF | I MUST include the actual CI run output (job URL, status, timestamp) from the current PR, not estimated or carried over from a previous run. |
| B-08 | I am updating scope-declaration.md | I MUST ensure the declared files match the actual files changed in the current PR. I MUST NOT copy scope from a previous PR. |
| B-09 | A test configuration file is being modified | I MUST verify the change does not suppress warnings, skip tests, or weaken coverage thresholds. Any such change requires CS2 approval. |
| B-10 | A CI gate fails after I claimed it would pass | I MUST immediately raise a STOP-AND-FIX, document the false attestation in session memory, and perform an RCA before any further wave action. |
| B-11 | I am reviewing builder output before handover | I MUST verify there are no stub assertions (`expect(true)`, `assert True`, empty test bodies) and no working notes in committed files. |

---

## Section C — Breach Log

| Rule ID | Date Added | Incident Reference | One-line Summary |
|---------|------------|--------------------|------------------|
| A-01 | 2026-02-24 | PR #483 — Wave 3 raised with 9/10 AAWP deliverables missing | Wave-close PR raised without confirming all AAWP deliverable rows were present in the diff. |
| A-02 | 2026-02-24 | PR #483 — QA-to-Red step skipped before implementation | Implementation began before qa-builder confirmed RED gate tests existed and were failing. |
| A-03 | 2026-02-24 | GOV-BREACH-AIMC-W2-001 — Self-implementation when builder unavailable | Foreman self-implemented when a required builder was unavailable instead of halting and escalating. |
| A-04 | 2026-02-24 | PR #479 (Wave 5.6R) — `expect(true).toBe(true)` stubs submitted as passing tests | Always-passing stub assertions were submitted and counted as real passing tests. |
| A-05 | 2026-02-24 | PR #479 — CST evidence fabricated / estimated rather than from actual test run | Test counts in CST evidence artifacts were fabricated or estimated, not derived from an actual test run. |
| A-06 | 2026-02-24 | PR #479 (re-delivery) — CSS source-string matching used instead of viewport simulation | Mobile/viewport tests only asserted CSS class presence in source files, not actual rendered viewport behavior. |
| A-07 | 2026-02-24 | PR #479 — Builder working notes committed to repo root | Builder exploration/working notes were committed to the repository root instead of being excluded. |
| A-08 | 2026-02-24 | PR #483 — Wave declared complete with deliverables missing | Wave was declared complete despite failing OPOJD gate (missing deliverables, unchecked requirements). |
| A-09 | 2026-02-24 | Multiple RCAs — No rule appended after breach resolution | Breach RCAs were completed without appending a new permanent rule to the FAIL-ONLY-ONCE registry. |
| A-10 | 2026-02-24 | GOV-BREACH-AIMC-W2-001 — CS2 hard-stop gate bypassed | Execution continued past a CS2 hard-stop gate without recorded approval on file. |
| A-11 | 2026-02-24 | INCIDENT_2026-01-27_PR_1023_FALSE_ATTESTATION — PREHANDOVER_PROOF claimed "ALL gates exit 0" when CI showed 2 failing gates | PREHANDOVER_PROOF was authored claiming gate success without running or verifying actual CI output. |
| A-12 | 2026-02-24 | RCA_SCOPE_VIOLATION_20260217 — Stale scope-declaration.md from previous PR used | scope-declaration.md from a prior PR was reused verbatim, causing scope-to-diff gate failure. |
| A-13 | 2026-02-24 | INCIDENT-2026-01-08-TEST-DODGING — `--disable-warnings` added to pytest.ini to suppress test warnings | pytest configuration was modified to globally suppress warnings, hiding test quality signals (test dodging). |
| A-14 | 2026-02-24 | PR #462 — Deduplication logic suppressed entire governance alignment workflow, not just PR creation | Over-broad deduplication condition caused the alignment/sync step to be skipped, not just PR creation. |
| A-15 | 2026-02-24 | INCIDENT-2026-01-08-PR895 — Handover issued twice with failing CI gates | PR was handed over as "ready to merge" while multiple CI gates were still failing. |
| A-16 | 2026-02-24 | PR #479 (Wave 5.6R) — Stub tests accepted in QA gate | QA gate accepted assertions that could never fail, defeating the purpose of the RED gate requirement. |
| A-17 | 2026-02-24 | GOV-BREACH-AIMC-W2-001 — Governance ambiguity self-interpreted rather than escalated | Foreman proceeded under ambiguous governance authority without escalating to CS2 for clarification. |
| B-01 | 2026-02-24 | PR #483 — Wave 3 raised with 9/10 AAWP deliverables missing | Pre-PR check not performed; deliverable table rows not verified before PR creation. |
| B-02 | 2026-02-24 | PR #483 — QA-to-Red step skipped | Builder appointment issued before RED gate test confirmation. |
| B-03 | 2026-02-24 | GOV-BREACH-AIMC-W2-001 — Builder unavailability led to self-implementation | Builder was unavailable; instead of halting and escalating, Foreman self-implemented. |
| B-04 | 2026-02-24 | PR #479 — CST evidence fabricated | CST/CWT evidence written from memory/prior artifacts instead of actual run output. |
| B-05 | 2026-02-24 | PR #483 — Wave gate closed without line-by-line AAWP check | Wave close gate declared without running through every AAWP requirement line-by-line. |
| B-06 | 2026-02-24 | PR #462 — Deduplication change suppressed alignment workflow | Governance workflow modified without verifying deduplication only gated PR creation. |
| B-07 | 2026-02-24 | INCIDENT_2026-01-27_PR_1023_FALSE_ATTESTATION — PREHANDOVER_PROOF did not include actual CI run output | PREHANDOVER_PROOF authored without including actual CI job URL or output from current PR run. |
| B-08 | 2026-02-24 | RCA_SCOPE_VIOLATION_20260217 — scope-declaration.md not updated for current PR | scope-declaration.md was copied from previous PR without updating for current PR's actual files. |
| B-09 | 2026-02-24 | INCIDENT-2026-01-08-TEST-DODGING — pytest.ini modified to suppress warnings | Test configuration modified to suppress warnings without CS2 approval. |
| B-10 | 2026-02-24 | INCIDENT-2026-01-08-PR895 — Second catastrophic handover with still-failing gates | After first CI failure, second handover was issued without verifying all gates were actually fixed. |
| B-11 | 2026-02-24 | PR #479 (Wave 5.6R) — Stub assertions and builder notes not caught in review | Builder output accepted without checking for stub assertions or working notes in committed files. |
| A-18 | 2026-02-24 | PR #1195 — Breach-prevention registry PR handed over with POLICY-NO-ONLY-LANGUAGE gate failing | PR was promoted from DRAFT and presented to CS2 without verifying all CI gate checks passed. |
