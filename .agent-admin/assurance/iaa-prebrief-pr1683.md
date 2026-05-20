# IAA Pre-Flight Brief — PR #1683

IAA_PREFLIGHT_BRIEF
PR: #1683
ISSUE: #1682 — Build 5-domain framework configuration workspace after RED/pre-build alignment
WAVE: build-to-green-5domain-workspace-20260519
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: CURRENT_HEAD

EXPECTED_QA_SCOPE:
- `apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx` — 5 canonical domain cards replacing raw domain list
- `apps/mmm/src/lib/useFrameworkHandoffContext.ts` — extended domain data access
- `apps/mmm/src/pages/DomainWorkspacePage.tsx` — new transitional domain workspace page
- `apps/mmm/src/App.tsx` — domain workspace route registration
- `modules/MMM/tests/B4-framework/b4-framework.test.ts` — RED→GREEN implementation tests aligned to T-MMM-S6-177 through T-MMM-S6-184
- `scripts/mmm-live-dashboard-diagnosis/verify-mmm-modes.mjs` — 5-card workspace assertion update
- `modules/MMM/BUILD_PROGRESS_TRACKER.md` — RED finding record

EXPECTED_FAILURE_MODES:
- Anti-regression: T-MMM-S6-179 asserts 'Back to Frameworks' text — builder must preserve in error blocks
- DomainWorkspacePage blank/skeleton renders failing BD-002 (no stubs in production render paths)
- 5-domain card hardcoded names vs data-driven ID mismatch — canonical names shown but wrong domain IDs used
- Mini-dashboard slots as comments/TODOs instead of rendered DOM elements with data-testids
- Missing ProtectedRoute wrapper on /assessment/framework/domain/:domainId route in App.tsx
- verify-mmm-modes.mjs update too vacuous — asserts only outer wrapper, not 5-card structure

FOREMAN_INSTRUCTIONS:
- Preserve 'Back to Frameworks' text in missing-framework-id error block recovery links (T-MMM-S6-179)
- Specify domain resolution strategy to builder: use DB-sourced domains sorted by sort_order as canonical slots
- Instruct builder: all 5 mini-dashboard slots must be rendered DOM elements with data-testid attributes
- Appoint execution-ceremony-admin-agent for Phase 4 ceremony bundle
- Ensure DomainWorkspacePage has visible content (domain title, placeholder workspace, back-nav link)

IAA_WILL_QA:
- All 4 user journeys traced end-to-end against implementation diff (BD-000)
- All 9 declared deliverables present in PR diff (BD-001)
- No stubs/TODOs in domain card or DomainWorkspacePage render paths (BD-002)
- Anti-regression: 115 existing B4 tests still GREEN (BD-011)
- T-MMM-S6-179 pass condition preserved: 'Back to Frameworks' in error block recovery link
- DomainWorkspacePage exists and renders visible non-blank content
- App.tsx domain route registered with ProtectedRoute
- wave-current-tasks.md updated to wave build-to-green-5domain-workspace-20260519
- NBR-003 Zustand store reset verification if any store slice introduced
- verify-mmm-modes.mjs 5-card assertion specificity (not vacuous)
- TypeScript strict compliance (BD-021)

RESULT: PREFLIGHT_BRIEF_COMPLETE
