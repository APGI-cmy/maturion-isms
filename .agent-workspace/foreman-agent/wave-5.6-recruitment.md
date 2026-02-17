# Wave 5.6 UI Builder Recruitment Document

**Foreman**: foreman-agent  
**Wave**: 5.6 — UI Component Wiring & Data Integration  
**Builder**: ui-builder  
**Date**: 2026-02-17  
**Status**: READY FOR RECRUITMENT

---

## Executive Summary

Wave 5.6 implements full frontend functionality for the MAT (Manual Audit Tool) application by wiring all components to Supabase, implementing CRUD operations, data fetching, state management, loading/error states, and ensuring complete user workflows are functional.

**Context**: Wave 5.5 delivered application STRUCTURE (scaffolding, routing, layouts) but all components remain empty placeholders. Wave 6 production testing revealed complete non-functionality. Wave 5.6 bridges the gap between structure and functionality.

**Governance**: This wave addresses Deviation #11 ("Tested ≠ Delivered" pattern at UI layer).

---

## Builder Recruitment Protocol

**Following Constitutional Agent Chain** (per Deviation #12 learning):

1. ✅ **Foreman Role** (this document): Plan wave, organize resources, define scope, create recruitment documentation
2. ⏳ **ui-builder Role** (to be assigned): Implement all tasks per implementation plan, achieve 100% GREEN, provide evidence
3. ⏳ **Foreman Role** (post-execution): Validate completion, execute physical verification, issue Wave Closure Certification
4. ⏳ **CS2 Role** (final approval): Review and approve wave completion

**Note**: If ui-builder contract requires updates, those updates MUST be authored by Codex Advisor agent (per Deviation #12 preventive action).

---

## Wave 5.6 Scope

### Tasks (Sequential Execution)

1. **Task 5.6.1**: Dashboard Data Fetching & Metrics Display
2. **Task 5.6.2**: Audit Management CRUD Implementation
3. **Task 5.6.3**: Criteria Management CRUD Implementation
4. **Task 5.6.4**: Evidence Collection Implementation
5. **Task 5.6.5**: Scoring and Reports Implementation
6. **Task 5.6.6**: Settings Implementation

**Full specifications**: See `modules/mat/03-implementation-plan/implementation-plan.md` Section 2.6.6

---

## Architecture Authority

### Frozen Architecture Documents

- **App Description**: `modules/mat/00-app-description/app-description.md` (v1.2.0)
- **FRS**: `modules/mat/01-frs/frs.md` (v1.1.0, FR-001 to FR-069)
- **TRS**: `modules/mat/01.5-trs/trs.md` (v1.1.0, TR-001, TR-016, TR-033, TR-047)
- **Implementation Plan**: `modules/mat/03-implementation-plan/implementation-plan.md` (v1.5.0, Section 2.6.6)
- **Test Registry**: `modules/mat/02.5-qa-to-red/test-registry.md`

### Acceptance Criteria (from Implementation Plan v1.5.0)

**Wave 5.6 CANNOT close until ALL of the following are satisfied**:

1. ✅ Dashboard displays real-time audit metrics from Supabase (not hardcoded)
2. ✅ User can create new audit via form with validation
3. ✅ User can edit/delete audits from audit list
4. ✅ User can upload criteria documents (PDF, DOCX) with drag-and-drop
5. ✅ User can collect evidence (text notes, photos, audio, video)
6. ✅ User can view scoring and generate reports (DOCX, PDF, Excel)
7. ✅ User can manage settings (profile, organization, preferences)
8. ✅ ALL features physically verified in running application (video walkthrough + screenshots)
9. ✅ E2E tests GREEN for all user workflows (if implemented)
10. ✅ Loading states, error states, and empty states implemented for all data fetching
11. ✅ Form validation with user-friendly error messages
12. ✅ No console errors, no runtime errors, no broken UI states

**CRITICAL**: Physical verification ("Does the app WORK?") is NON-NEGOTIABLE. Tests alone are insufficient.

---

## QA-to-Red Test Suite

### Test Coverage

**Existing Tests** (from Wave 5.5):
- `apps/mat-frontend/tests/` — 71 test cases covering scaffolding, routing, layouts

**Required New Tests** (Wave 5.6):
- E2E UI behavior tests validating user workflows
- Data fetching validation tests
- CRUD operation verification tests
- State management tests
- Error handling tests

**Test Status**: Existing tests GREEN (structure validated). New E2E tests required for Wave 5.6.

**Test Registry Location**: `modules/mat/02.5-qa-to-red/test-registry.md`

---

## Governance Constraints

### Constitutional Requirements

1. **Zero Test Debt** — All tests must pass (100% GREEN) before wave closure
2. **Stop-and-Fix Doctrine** — Warnings are errors; test debt is blocker
3. **No Partial Delivery** — All acceptance criteria must be met
4. **Physical Verification Mandatory** — Foreman MUST test running app before certification
5. **"Tested ≠ Delivered"** — Tests validate logic; physical verification validates USER EXPERIENCE

### Prohibited Actions

ui-builder MUST NOT:
- ❌ Modify backend logic or Edge Functions
- ❌ Change database schema
- ❌ Make direct API calls bypassing TanStack Query
- ❌ Use class components (functional only per TRS TR-001)
- ❌ Implement cross-module logic
- ❌ Skip loading/error state implementation
- ❌ Deliver empty placeholder components
- ❌ Close wave without physical verification evidence

### Escalation Triggers

ui-builder MUST escalate to Foreman if:
- Architecture not frozen or ambiguous
- QA-to-Red tests missing or unclear
- Governance ambiguity encountered
- Canon drift detected
- Test debt > 0
- Scope expansion needed
- Supabase schema changes required

---

## Wave Execution Workflow

### Phase 1: Pre-Build (ui-builder responsibility)

1. Review frozen architecture documents (FRS, TRS, Implementation Plan)
2. Verify QA-to-Red test suite present and understood
3. Confirm Supabase schema matches architecture
4. Validate all dependencies available (React 18+, Vite 5+, Supabase client)
5. Create session memory file documenting pre-build verification

### Phase 2: Build-to-Green (ui-builder responsibility)

1. Implement Task 5.6.1 (Dashboard) → Run tests → Verify GREEN
2. Implement Task 5.6.2 (Audit CRUD) → Run tests → Verify GREEN
3. Implement Task 5.6.3 (Criteria CRUD) → Run tests → Verify GREEN
4. Implement Task 5.6.4 (Evidence Collection) → Run tests → Verify GREEN
5. Implement Task 5.6.5 (Scoring & Reports) → Run tests → Verify GREEN
6. Implement Task 5.6.6 (Settings) → Run tests → Verify GREEN
7. Run full test suite → Verify 100% GREEN
8. Create PREHANDOVER_PROOF with test results

### Phase 3: Physical Verification (ui-builder responsibility)

1. Start development server (`pnpm dev`)
2. Test ALL user workflows manually:
   - Create new audit
   - Edit audit details
   - Delete audit
   - Upload criteria document
   - Collect evidence (text, photo, audio, video)
   - View scoring dashboard
   - Generate reports (DOCX, PDF, Excel)
   - Update settings
3. Record video walkthrough (5-10 minutes showing all features)
4. Capture screenshots of all pages functioning
5. Document in PREHANDOVER_PROOF:
   - "Does the app WORK?" checklist completed
   - All user workflows validated
   - Video walkthrough link
   - Screenshots attached

### Phase 4: Handover (ui-builder → Foreman)

1. Submit PR with:
   - All implemented code
   - PREHANDOVER_PROOF with physical verification evidence
   - Session memory file
   - Video walkthrough
   - Screenshots
2. Update BUILD_PROGRESS_TRACKER.md (Wave 5.6 status)
3. Notify Foreman for validation

---

## Foreman Validation Checklist

**Foreman MUST verify before Wave Closure Certification**:

1. ✅ All 6 tasks (5.6.1 to 5.6.6) implemented
2. ✅ All tests GREEN (100% pass rate)
3. ✅ PREHANDOVER_PROOF present and complete
4. ✅ Physical verification evidence provided (video + screenshots)
5. ✅ Foreman personally tests running app:
   - Start `pnpm dev`
   - Execute all user workflows
   - Verify application provides USER VALUE
   - Confirm "Does the app WORK?" = YES
6. ✅ No console errors
7. ✅ No runtime errors
8. ✅ No broken UI states
9. ✅ Loading/error/empty states implemented
10. ✅ Form validation working
11. ✅ Supabase data fetching functional
12. ✅ CRUD operations successful
13. ✅ Session memory file present
14. ✅ BUILD_PROGRESS_TRACKER.md updated

**IF ANY ITEM FAILS → REJECT PR, assign ui-builder to fix, re-validate**

---

## Wave Closure Certification (Foreman)

**Once ALL validation checklist items PASS, Foreman will issue**:

**Wave 5.6 Closure Certification**:

1. ✅ Deliverable completeness: All 6 tasks implemented
2. ✅ Functional completeness: All acceptance criteria met
3. ✅ Quality completeness: 100% tests GREEN, no errors
4. ✅ Fully functional delivery: Application provides USER VALUE
5. ✅ Zero major rework: Clean implementation, no technical debt

**Evidence Bundle**:
- PREHANDOVER_PROOF (ui-builder)
- Wave Closure Certification (Foreman)
- Session memory files (ui-builder + Foreman)
- Video walkthrough
- Screenshots
- Test results
- BUILD_PROGRESS_TRACKER.md update

---

## Next Steps

1. ⏳ **Assign ui-builder** to this wave (create GitHub issue or assign directly)
2. ⏳ **ui-builder executes** tasks 5.6.1 to 5.6.6 per implementation plan
3. ⏳ **ui-builder provides** physical verification evidence
4. ⏳ **Foreman validates** all deliverables and physically tests app
5. ⏳ **Foreman issues** Wave Closure Certification
6. ⏳ **Proceed to Wave 6** (Deployment & Commissioning)

---

## Governance References

- `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` (POLC supervisory role)
- `governance/canon/FULLY_FUNCTIONAL_DELIVERY_STANDARD.md` (Physical verification, "Tested ≠ Delivered")
- `governance/canon/BUILD_PHILOSOPHY.md` (Zero Test Debt, One-Time Build)
- `modules/mat/BUILD_PROGRESS_TRACKER.md` Deviation #11 (Root cause for this wave)
- `modules/mat/BUILD_PROGRESS_TRACKER.md` Deviation #12 (Agent authority boundaries)
- `modules/mat/03-implementation-plan/implementation-plan.md` Section 2.6.6

---

**Created By**: foreman-agent  
**Date**: 2026-02-17  
**Session**: Deviation #12 governance correction and Wave 5.6 preparation  
**Authority**: POLC Organizing phase (builder recruitment and task assignment)
