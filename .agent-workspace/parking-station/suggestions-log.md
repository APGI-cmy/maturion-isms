# Parking Station — Improvement Suggestions Log

**Repository**: APGI-cmy/maturion-isms
**Purpose**: Append-only index of improvement suggestions from agent session handovers. One line per suggestion. Canonical detail in referenced session memory file.
**Watchdog**: Foreman app (future) — reads this file to aggregate suggestions for CS2 planning.

---

| Date | Agent | Session | Summary | Detail |
|------|-------|---------|---------|--------|
| 2026-02-21 | CodexAdvisor-agent | session-022 | Automate agent-file compliance verification as a dedicated CI/merge-gate check against non-negotiables checklist | `session-022-20260221.md` |
| 2026-02-21 | CodexAdvisor-agent | session-023 | Add S6-06 parking station append step to session-memory-template.md so all future agents inherit the suggestions-log append behaviour by default | `session-023-20260221.md` |
| 2026-02-23 | CodexAdvisor-agent | session-024 | Add Parking Station section to session-memory-template.md so agents using the template automatically produce the correct suggestions-log.md append line | `session-024-20260223.md` |
| 2026-02-23 | CodexAdvisor-agent | session-025 | Standardise builder Phase 4 session memory with explicit Suggestions for Improvement mandate in §4.2 to match foreman-v2 and CodexAdvisor pattern | `session-025-20260223.md` |
| 2026-02-23 | foreman-v2 | session-050 | Add scheduled governance scan (quarterly) to auto-detect new layer-up candidates by comparing local governance/policy/, governance/agent/, governance/coordination/ files against CANON_INVENTORY.json | `session-050-20260223.md` |
| 2026-02-23 | foreman-v2 | session-051 | Add integration test validating governance-alignment-schedule.yml creates a liaison issue on drift detection to prevent future automation gap regressions | `session-051-20260223.md` |
| 2026-02-23 | foreman-v2 | session-051 | Add idempotency guard to governance-ripple-sync.yml issue creation: check for existing open layer-down issues by canonical commit before creating new one | `session-051-20260223.md` |
| 2026-02-23 | foreman-v2 | session-052 | TD: TelemetryWriter process-wide counter must be replaced with persistent/UUID-based ID generation in Wave 4 (packages/ai-centre/src/telemetry/TelemetryWriter.ts) | `session-052-20260223.md` |
| 2026-02-23 | foreman-v2 | session-052 | TD: AICentre provider loop contains a redundant UNAVAILABLE guard (line 70) — already filtered by router at line 55; mark for clean-up in Wave 3 or 4 (packages/ai-centre/src/gateway/AICentre.ts) | `session-052-20260223.md` |
| 2026-02-24 | foreman-v2 | session-wave4-RCA | Add AAWP deliverable table line-by-line tick-off as a mandatory PREHANDOVER gate step — never raise a wave PR without it | `session-wave4-RCA-20260224.md` |
| 2026-02-24 | foreman-v2 | session-053 | Add CI check that fails the PR when .agent-admin/prehandover/proof-*.md is absent to enforce PREHANDOVER completion as a hard gate (prevents Phase 4 omission repeat) | `session-053-20260224.md` |
| 2026-02-24 | foreman-v2 | session-053 | Carry-forward: add integration test for governance-alignment-schedule.yml liaison issue creation on drift detection (originally session-051 — still unresolved) | `session-053-20260224.md` |
| 2026-02-24 | foreman-v2 | session-wave4-cs2-compliance | Supabase-backed PersistentMemoryAdapter deferred to Wave 5 — implement with @supabase/supabase-js, ai_memory table, organisation_id query filter per GRS-008 | `session-wave4-cs2-compliance-RCA-20260224.md` |
| 2026-02-24 | foreman-v2 | session-wave4-cs2-compliance | Add mandatory diff-vs-AAWP table to every wave PR description — each row must name the AAWP deliverable, the file in the diff, and a one-line proof; CS2 can reject immediately if any row is missing | `session-wave4-cs2-compliance-RCA-20260224.md` |
| 2026-02-24 | governance-liaison-isms | session-016 | Add idempotency check to governance-alignment-schedule.yml to prevent duplicate layer-down issues when AIMC_STRATEGY.md or other new canons trigger multiple rapid drift detections | session-016-20260224.md |
| 2026-02-24 | governance-liaison-isms | session-017 | FINAL_COMPLETE_WAVE_TEST_PROTOCOL.md (18e3f1422216) and PRE_BUILD_REALITY_CHECK_CANON.md now layered — reference these in wave closure checklists and align ripple PR deduplication (PRs #456/#457 carried identical canonical commit) | session-017-20260224.md |
| 2026-02-24 | foreman-v2 | wave4-cs2-final | TD Wave5: wrap MemoryLifecycle.recordTurn() Promise.all([persist,...]) in try/catch — log telemetry event and continue rather than throw on transient Supabase write failure | `proof-wave4-20260224.md` |
| 2026-02-24 | foreman-v2 | wave4-cs2-final | TD Wave8: OpenAIAdapter DEFAULT_MODEL='gpt-4o' is hardcoded — Wave 8 algorithm execution requires o3 model; extend NormalisedProviderRequest to carry model override or make model configurable per capability route | `proof-wave4-20260224.md` |
| 2026-02-24 | foreman-v2 | wave4-cs2-final | Governance hygiene: FAIL-ONLY-ONCE.md has entries A-01 and A-18..A-21 only — confirm A-02 through A-17 either exist in a prior session file and are referenced, or consolidate all rules into this file | `proof-wave4-20260224.md` |
| 2026-02-24 | governance-liaison-isms | session-018 | PRE_BUILD_REALITY_CHECK_CANON.md (87119743814a) confirmed layered and verified; ripple PRs #473/#474/#475 triple-triggered — scheduled workflow idempotency still needs improvement | session-018-20260224.md |
| 2026-02-24 | foreman-v2 | wave5-polc-RCA | Add CI POLC boundary gate that fails PR when foreman-v2 is listed as author of production code file changes (outside designated governance evidence paths) — machine-level enforcement of A-001 | `session-wave5-polc-RCA-20260224.md` |
| 2026-02-24 | foreman-v2 | wave5-polc-RCA | Add pre-session verification hook to confirm FAIL-ONLY-ONCE.md was loaded and all incidents are REMEDIATED before any task processing begins — prevents Phase 1 Wake-Up bypass | `session-wave5-polc-RCA-20260224.md` |
| 2026-02-24 | CodexAdvisor-agent | session-026 | Populate IAA Tier 2 stubs (iaa-core-invariants-checklist.md, iaa-trigger-table.md, iaa-category-overlays.md, session-memory-template.md) from INDEPENDENT_ASSURANCE_AGENT_CANON.md before Phase B activation | `session-026-20260224.md` |
| 2026-02-24 | independent-assurance-agent | session-026 | SESSION-END | Merge gate failed on invalid sync_state.json JSON syntax (unresolved git conflict markers) — canon update #1201 incoming to enforce local parity checks pre-handover. | `session-026-20260224.md` |
