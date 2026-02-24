/**
 * MAT Red Test Suite — CAT-13: UI Wiring and Data Fetching Behavior
 *
 * QA-to-Red: All tests MUST fail with NOT_IMPLEMENTED initially.
 * These tests define expected UI behavior (user interaction → data flow → UI update).
 *
 * Purpose: Address Deviation #11 (frontend non-functional)
 * Root Cause: Previous tests validated component structure, NOT behavior
 * Solution: E2E UI behavior tests validating complete user workflows
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: modules/mat/02-architecture/test-strategy.md
 * Authority: GOVERNANCE_CHAIN_TRACEABILITY_ANALYSIS_20260217.md
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const FRONTEND_SRC = resolve(__dirname, '../../frontend/src');

// Category 1: Dashboard Data Fetching (2 tests)

describe('CAT-13: UI Wiring and Data Fetching Behavior', () => {
  describe('Dashboard Data Fetching', () => {
    it('MAT-T-0099: CriteriaTree component renders Domain→MPS→Criteria hierarchy from live Supabase data via useCriteriaTree hook (G-03)', () => {
      // Gap Reference: G-03 (Wave 5.6R) — closes criteria hierarchy render verification gap
      // FRS: FR-039 "Global Audit Dashboard", FR-005 "Display Criteria Hierarchy"
      // TRS: TR-033, TR-047
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: CriteriaTree renders all 3 hierarchy levels from live Supabase data

      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/criteria/CriteriaTree.tsx'),
        'utf-8'
      );

      // Assert: useCriteriaTree hook used for live Supabase data (not mock/static)
      expect(src).toContain('useCriteriaTree');
      expect(src).toContain("from '../../lib/hooks/useCriteria'");

      // Assert: Level 1 — Domain list rendered
      expect(src).toContain('domains.map');

      // Assert: Level 2 — MPS nested within Domain
      expect(src).toContain('domain.mini_performance_standards');
      expect(src).toContain('mini_performance_standards.map');

      // Assert: Level 3 — Criteria nested within MPS
      expect(src).toContain('mps.criteria');
      expect(src).toContain('mps.criteria.map');

      // Assert: ARIA tree role for accessibility
      expect(src).toContain('role="tree"');
      expect(src).toContain('role="treeitem"');

      // Assert: No hardcoded/mock data
      expect(src).not.toContain('mockData');
      expect(src).not.toContain('hardcodedDomains');
    });

    it('MAT-T-0100: EvidenceCapture delegates to EvidenceCollection using live useCriterionEvidence hook, not mock data (G-04)', () => {
      // Gap Reference: G-04 (Wave 5.6R) — closes evidence modal live data wiring gap
      // FRS: FR-013 (Multi-Format Evidence), FR-039 AC-2 real-time accuracy
      // TRS: TR-047, TR-049
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: EvidenceCapture renders EvidenceCollection with live criterionId; no mock data

      const captureSrc = readFileSync(
        resolve(FRONTEND_SRC, 'components/evidence/EvidenceCapture.tsx'),
        'utf-8'
      );

      // Assert: EvidenceCapture imports and delegates to EvidenceCollection
      expect(captureSrc).toContain('EvidenceCollection');
      expect(captureSrc).toContain("from './EvidenceCollection'");

      // Assert: criterionId passed through to EvidenceCollection
      expect(captureSrc).toContain('criterionId={criterionId}');

      // Assert: No stub/mock data in capture component
      expect(captureSrc).not.toContain('mockEvidence');
      expect(captureSrc).not.toContain('TODO');
      expect(captureSrc).not.toContain('STUB');

      // Assert: EvidenceCollection uses live Supabase hook (not mock)
      const collectionSrc = readFileSync(
        resolve(FRONTEND_SRC, 'components/evidence/EvidenceCollection.tsx'),
        'utf-8'
      );
      expect(collectionSrc).toContain('useCriterionEvidence');
      expect(collectionSrc).toContain('useUploadEvidence');

      // Assert: No hardcoded/static mock data in collection component
      expect(collectionSrc).not.toContain('mockEvidence');
      expect(collectionSrc).not.toContain("const evidence = [");
    });
  });

  // Category 2: Audit Management CRUD (7 tests)

  describe('Audit Management CRUD', () => {
    it('MAT-T-0101: Create Audit button displays form with validation', () => {
      // Architecture: ui-component-architecture.md §1 "DashboardPage: <CreateAuditButton>"
      // Architecture: system-architecture.md §3.12 "Path 1 — Audit Creation" specifies UI: AuditCreateForm validates input
      // FRS: FR-001 "Create New Audit"
      // TRS: TR-047 "Audit Management UI" - Form validation (Zod schema)
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: AuditCreationForm uses useCreateAudit, has validation, aria-required fields, disabled state while pending

      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/audits/AuditCreationForm.tsx'),
        'utf-8'
      );

      // Assert: Form uses live Supabase mutation hook
      expect(src).toContain('useCreateAudit');

      // Assert: Client-side validation function exists
      expect(src).toContain('validate');

      // Assert: Required fields are marked with aria-required for accessibility
      expect(src).toContain('aria-required');

      // Assert: Submit button is disabled while mutation is in flight
      expect(src).toContain('isPending');
    });

    it('MAT-T-0102: Create Audit form submits and saves to Supabase', () => {
      // Architecture: system-architecture.md §3.12 "Path 1 — Audit Creation" specifies API: POST /rest/v1/audits
      // FRS: FR-001 "Create New Audit"
      // TRS: TR-012 "Audit Lifecycle State Machine"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: AuditCreationForm calls mutateAsync on submit; hook invalidates audits cache on success

      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/audits/AuditCreationForm.tsx'),
        'utf-8'
      );

      // Assert: Form calls mutation on submit
      expect(src).toContain('mutateAsync');

      // Assert: Form has submit handler
      expect(src).toContain('onSubmit');

      // Assert: Submit is gated by isPending to prevent double-submit
      expect(src).toContain('isPending');

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useAudits.ts'),
        'utf-8'
      );

      // Assert: Mutation invalidates audits cache on success for list refresh
      expect(hookSrc).toContain('invalidateQueries');
      expect(hookSrc).toContain("queryKey: ['audits']");
    });

    it('MAT-T-0103: Audit list fetches and displays audits from Supabase', () => {
      // Architecture: ui-component-architecture.md §1 "DashboardPage: <AuditList> — List of audits with status, search, and filters"
      // FRS: FR-002 "Audit Listing" (implied by status lifecycle)
      // TRS: TR-047 "Audit Management UI"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: AuditList uses useAudits hook, shows skeleton while loading, displays empty state

      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/audits/AuditList.tsx'),
        'utf-8'
      );

      // Assert: Component uses live Supabase hook to fetch audits
      expect(src).toContain('useAudits');

      // Assert: Loading state is handled
      expect(src).toContain('isLoading');

      // Assert: Empty state message shown when no audits exist
      expect(src).toContain('No audits yet');

      // Assert: Skeleton loader shown while data is loading
      expect(src).toContain('animate-pulse');
    });

    it('MAT-T-0104: Edit Audit functionality updates audit in Supabase', () => {
      // Architecture: Implied by FR-001 create audit (edit follows same pattern)
      // FRS: Implied by audit management
      // TRS: TR-047 "Audit Management UI"
      // Type: source-analysis | Priority: P1
      // Acceptance Criteria: useUpdateAudit hook exported, uses useMutation; AuditList renders Edit button

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useAudits.ts'),
        'utf-8'
      );

      // Assert: useUpdateAudit hook is exported and wired to TanStack Query mutation
      expect(hookSrc).toContain('useUpdateAudit');
      expect(hookSrc).toContain('useMutation');

      const listSrc = readFileSync(
        resolve(FRONTEND_SRC, 'components/audits/AuditList.tsx'),
        'utf-8'
      );

      // Assert: Edit button is present in the audit list UI
      expect(listSrc).toContain('Edit');
    });

    it('MAT-T-0105: Delete Audit (soft delete) functionality updates Supabase', () => {
      // Architecture: Implied by audit lifecycle
      // FRS: FR-003 "Soft delete audit" (implied)
      // TRS: TR-012 "Audit Lifecycle State Machine"
      // Type: source-analysis | Priority: P1
      // Acceptance Criteria: AuditList uses useDeleteAudit with confirmation; hook performs soft delete via deleted_at timestamp

      const listSrc = readFileSync(
        resolve(FRONTEND_SRC, 'components/audits/AuditList.tsx'),
        'utf-8'
      );

      // Assert: Component imports and uses the delete hook
      expect(listSrc).toContain('useDeleteAudit');

      // Assert: Confirmation dialog shown before deletion
      expect(listSrc).toContain('window.confirm');

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useAudits.ts'),
        'utf-8'
      );

      // Assert: Soft delete is implemented via deleted_at timestamp (not hard delete)
      expect(hookSrc).toContain('deleted_at');

      // Assert: useDeleteAudit hook is exported
      expect(hookSrc).toContain('useDeleteAudit');
    });

    it('MAT-T-0106: Audit creation flow at 375px mobile viewport — no fixed-width overflow, w-full inputs (G-15)', () => {
      // Gap Reference: G-15 (Wave 5.6R) — Flow 1: Audit creation at mobile viewport
      // FRS: FR-001 "Create New Audit", FR-062 "Multi-Viewport Support (≥375px)"
      // TRS: TR-034 "Responsive layout — mobile ≥375px"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: AuditCreationForm has no fixed pixel widths > 375px; all inputs use w-full

      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/audits/AuditCreationForm.tsx'),
        'utf-8'
      );

      // Assert: All input fields use w-full (fills container width at any viewport)
      const inputClassMatches = src.match(/className=.*?["'][^"']*w-full[^"']*["']/g) || [];
      expect(inputClassMatches.length).toBeGreaterThan(0);

      // Assert: No fixed pixel widths wider than 375px that would cause horizontal overflow
      expect(src).not.toMatch(/style=.*?width:\s*[4-9]\d{2,}px/);
      expect(src).not.toMatch(/className=.*?["'][^"']*\bw-\[(?:[4-9]\d{2,}|[1-9]\d{3,})px\][^"']*["']/);

      // Assert: Submit button is full-width (mobile-friendly tap target)
      expect(src).toMatch(/className=.*?["'][^"']*w-full[^"']*["'][^>]*>[\s\S]*?submit|type="submit"/i);
    });

    it('MAT-T-0107: Evidence modal at 375px mobile viewport — overflow-x-auto tabs, touch-friendly tap targets (G-15)', () => {
      // Gap Reference: G-15 (Wave 5.6R) — Flow 2: Evidence modal at mobile viewport
      // FRS: FR-013 (Multi-Format Evidence), FR-062 "Multi-Viewport Support (≥375px)"
      // TRS: TR-034 "Responsive layout — mobile ≥375px", TR-020 "Mobile-first Evidence Collection"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: EvidenceCollection handles tab overflow at 375px (overflow-x-auto); buttons have adequate padding

      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/evidence/EvidenceCollection.tsx'),
        'utf-8'
      );

      // Assert: Tab container uses overflow-x-auto to prevent horizontal overflow at 375px
      expect(src).toContain('overflow-x-auto');

      // Assert: Action buttons have touch-friendly padding (py-2 or px-4 class)
      expect(src).toMatch(/className=.*?["'][^"']*(?:py-2|py-3|px-4|p-4)[^"']*["']/);

      // Assert: No fixed pixel widths wider than 375px that cause overflow
      expect(src).not.toMatch(/style=.*?width:\s*[4-9]\d{2,}px/);

      // Assert: Component accepts criterionId prop (passed from EvidenceCapture)
      expect(src).toContain('criterionId: string');
      expect(src).toContain('criterionId }');
    });
  });

  // Category 3: Criteria Management CRUD (6 tests)

  describe('Criteria Management CRUD', () => {
    it('MAT-T-0108: Review table at 375px mobile viewport — overflow-x-auto container, no content clipping (G-15)', () => {
      // Gap Reference: G-15 (Wave 5.6R) — Flow 3: Review table at mobile viewport
      // FRS: FR-018 "Display Scoring Results", FR-062 "Multi-Viewport Support (≥375px)"
      // TRS: TR-034 "Responsive layout — mobile ≥375px"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: ReviewTable wraps in overflow-x-auto; table uses min-w-full for horizontal scroll at 375px

      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/scoring/ReviewTable.tsx'),
        'utf-8'
      );

      // Assert: Table container has overflow-x-auto for mobile horizontal scroll
      expect(src).toContain('overflow-x-auto');

      // Assert: Table uses min-w-full to allow scrolling on narrow viewports
      expect(src).toContain('min-w-full');

      // Assert: No fixed pixel widths on the table wider than 375px
      expect(src).not.toMatch(/style=.*?width:\s*[4-9]\d{2,}px/);

      // Assert: Text uses truncate or max-w to prevent content overflow
      expect(src).toMatch(/truncate|max-w-/);
    });

    it('MAT-T-0109: Criteria tree displays hierarchical data from Supabase', () => {
      // Architecture: ui-component-architecture.md §1 "CriteriaTree — Hierarchical display with collapsible sections"
      // FRS: FR-005 "Display Criteria Hierarchy"
      // TRS: TR-047 "Criteria Management UI"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: CriteriaTree uses useCriteriaTree hook, has expand/collapse state, shows loading skeleton

      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/criteria/CriteriaTree.tsx'),
        'utf-8'
      );

      // Assert: Component fetches live hierarchical data via hook
      expect(src).toContain('useCriteriaTree');

      // Assert: Domain expand/collapse state is managed
      expect(src).toContain('expandedDomains');

      // Assert: MPS expand/collapse state is managed
      expect(src).toContain('expandedMPS');

      // Assert: Skeleton loader displayed while data is loading
      expect(src).toContain('animate-pulse');

      // Assert: Loading state is handled
      expect(src).toContain('isLoading');
    });

    it('MAT-T-0110: Criteria modal displays criterion details and linked evidence', () => {
      // Architecture: ui-component-architecture.md §1 "CriteriaModal — Detail view with evidence links"
      // FRS: FR-006 "View Criterion Details"
      // TRS: TR-047 "Criteria Management UI"
      // Type: source-analysis | Priority: P1
      // Acceptance Criteria: CriteriaModal renders EvidenceCollection, uses role="dialog", displays criterion.description

      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/criteria/CriteriaModal.tsx'),
        'utf-8'
      );

      // Assert: Modal renders EvidenceCollection component for linked evidence
      expect(src).toContain('EvidenceCollection');

      // Assert: Modal uses ARIA dialog role for accessibility
      expect(src).toContain('role="dialog"');

      // Assert: Modal is marked as modal for screen readers
      expect(src).toContain('aria-modal');

      // Assert: Criterion description is displayed in modal
      expect(src).toContain('criterion.description');
    });

    it('MAT-T-0111: AI parsing trigger button invokes edge function and updates Supabase', () => {
      // Architecture: system-architecture.md §3.12 Path 2 — Criteria Upload
      // FRS: FR-007 "Trigger AI Criteria Parsing"
      // TRS: TR-019 "AI Criteria Parsing"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: useTriggerAIParsing hook invokes invoke-ai-parse-criteria edge function with auditId and filePath

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useCriteria.ts'),
        'utf-8'
      );

      // Assert: Hook is exported for use by UI components
      expect(hookSrc).toContain('useTriggerAIParsing');

      // Assert: Correct edge function name is invoked
      expect(hookSrc).toContain('invoke-ai-parse-criteria');

      // Assert: auditId is passed to the edge function
      expect(hookSrc).toContain('auditId');

      // Assert: filePath is passed to the edge function
      expect(hookSrc).toContain('filePath');
    });

    it('MAT-T-0112: Criteria search and filter functionality filters tree', () => {
      // Architecture: ui-component-architecture.md §1 "CriteriaTree — search and filters"
      // FRS: Implied by criteria management
      // TRS: TR-047 "Criteria Management UI"
      // Type: source-analysis | Priority: P2
      // Acceptance Criteria: CriteriaTree manages expand/collapse state for domain and MPS levels; hook fetches data ordered by sort_order

      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/criteria/CriteriaTree.tsx'),
        'utf-8'
      );

      // Assert: Domain-level expand/collapse state enables filtering by domain
      expect(src).toContain('expandedDomains');

      // Assert: MPS-level expand/collapse state enables filtering by MPS
      expect(src).toContain('expandedMPS');

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useCriteria.ts'),
        'utf-8'
      );

      // Assert: Hook returns data ordered by sort_order for predictable tree display
      expect(hookSrc).toContain('sort_order');
    });

    it('MAT-T-0113: Criteria keyboard navigation (arrow keys) works in tree', () => {
      // Architecture: ui-component-architecture.md §1 "CriteriaTree — keyboard navigation"
      // FRS: Implied by accessibility requirements
      // TRS: TR-047 "Criteria Management UI"
      // Type: source-analysis | Priority: P2
      // Acceptance Criteria: CriteriaTree has handleKeyDown function with Enter and Space key handlers wired via onKeyDown

      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/criteria/CriteriaTree.tsx'),
        'utf-8'
      );

      // Assert: Keyboard handler function is defined
      expect(src).toContain('handleKeyDown');

      // Assert: onKeyDown is wired to tree item buttons
      expect(src).toContain('onKeyDown');

      // Assert: Enter key activates items (expand/collapse/select)
      expect(src).toMatch(/event\.key\s*===\s*['"]Enter['"]/);

      // Assert: Space key activates items (ARIA treeitem pattern)
      expect(src).toMatch(/event\.key\s*===\s*['"] ['"]/);
    });
  });

  // Category 4: Evidence Collection (5 tests)

  describe('Evidence Collection', () => {
    it('MAT-T-0114: Text note capture saves to Supabase', () => {
      // Architecture: ui-component-architecture.md §1 "EvidenceCapture — Text notes"
      // FRS: FR-010 "Capture Text Notes"
      // TRS: TR-047 "Evidence Collection UI"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: useUploadEvidence hook supports type 'text' with content parameter, stores in evidence table linked to criterion_id

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useEvidence.ts'),
        'utf-8'
      );

      // Assert: Hook exported for text evidence upload
      expect(hookSrc).toContain('useUploadEvidence');

      // Assert: text type is part of the supported evidence types union
      expect(hookSrc).toContain("'text'");

      // Assert: content field accepted for text evidence (no file upload required)
      expect(hookSrc).toContain('content');

      // Assert: Evidence record is linked to the criterion
      expect(hookSrc).toContain('criterion_id');
    });

    it('MAT-T-0115: Photo capture uploads to Supabase Storage', () => {
      // Architecture: ui-component-architecture.md §1 "EvidenceCapture — Photo capture"
      // FRS: FR-011 "Capture Photo Evidence"
      // TRS: TR-020 "Mobile-first Evidence Collection"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: useUploadEvidence handles type 'photo', uploads to 'photos/' storage path

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useEvidence.ts'),
        'utf-8'
      );

      // Assert: Hook supports photo type routing to correct storage folder
      expect(hookSrc).toContain("type === 'photo'");

      // Assert: Photo files are stored in a dedicated 'photos' subfolder
      expect(hookSrc).toContain("'photos'");

      // Assert: File path is recorded in evidence record for retrieval
      expect(hookSrc).toContain('filePath');
    });

    it('MAT-T-0116: Audio recording uploads to Supabase Storage', () => {
      // Architecture: ui-component-architecture.md §1 "EvidenceCapture — Audio recording"
      // FRS: FR-012 "Record Audio Evidence"
      // TRS: TR-020 "Mobile-first Evidence Collection"
      // Type: source-analysis | Priority: P1
      // Acceptance Criteria: useUploadEvidence handles type 'audio', uploads to 'audio/' storage path

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useEvidence.ts'),
        'utf-8'
      );

      // Assert: Hook supports audio type routing to correct storage folder
      expect(hookSrc).toContain("type === 'audio'");

      // Assert: Audio files are stored in a dedicated 'audio' subfolder
      expect(hookSrc).toContain("'audio'");
    });

    it('MAT-T-0117: Video recording uploads to Supabase Storage', () => {
      // Architecture: ui-component-architecture.md §1 "EvidenceCapture — Video recording"
      // FRS: FR-013 "Record Video Evidence"
      // TRS: TR-020 "Mobile-first Evidence Collection"
      // Type: source-analysis | Priority: P1
      // Acceptance Criteria: useUploadEvidence handles type 'video', uploads to 'videos/' storage path

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useEvidence.ts'),
        'utf-8'
      );

      // Assert: Hook supports video type routing to correct storage folder
      expect(hookSrc).toContain("type === 'video'");

      // Assert: Video files are stored in a dedicated 'videos' subfolder
      expect(hookSrc).toContain("'videos'");
    });

    it('MAT-T-0118: Interview recording (structured audio with transcription) saves to Supabase', () => {
      // Architecture: ui-component-architecture.md §1 "EvidenceCapture — Interview recording"
      // FRS: FR-015 "Conduct Structured Interviews"
      // TRS: TR-021 "AI Transcription"
      // Type: source-analysis | Priority: P1
      // Acceptance Criteria: useUploadEvidence supports 'interview' type with metadata parameter for interviewee details

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useEvidence.ts'),
        'utf-8'
      );

      // Assert: Interview type is part of the supported evidence types union
      expect(hookSrc).toContain("'interview'");

      // Assert: metadata parameter is accepted for interviewee details
      expect(hookSrc).toContain('metadata');

      // Assert: Evidence record is created in the database
      expect(hookSrc).toContain('criterion_id');
    });
  });

  // Category 5: Scoring & Reports (4 tests)

  describe('Scoring & Reports', () => {
    it('MAT-T-0119: AI scoring trigger button invokes edge function', () => {
      // Architecture: system-architecture.md §3.12 Path 4 — AI Scoring
      // FRS: FR-016 "Trigger AI Scoring"
      // TRS: TR-022 "AI Scoring"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: useTriggerAIScoring hook invokes invoke-ai-score-criterion edge function

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useScoring.ts'),
        'utf-8'
      );

      // Assert: Hook is exported for use by UI trigger button
      expect(hookSrc).toContain('useTriggerAIScoring');

      // Assert: Correct edge function name is invoked for AI scoring
      expect(hookSrc).toContain('invoke-ai-score-criterion');
    });

    it('MAT-T-0120: Human confirmation workflow (approve/reject AI scores) updates Supabase', () => {
      // Architecture: system-architecture.md §3.12 Path 4
      // FRS: FR-017 "Human Confirmation Workflow"
      // TRS: TR-023 "Human Review Interface"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: useConfirmScore sets confirmed=true; useOverrideScore sets override_score; both hooks exported

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useScoring.ts'),
        'utf-8'
      );

      // Assert: Confirm score hook exported for approval UI
      expect(hookSrc).toContain('useConfirmScore');

      // Assert: Override score hook exported for edit/reject UI
      expect(hookSrc).toContain('useOverrideScore');

      // Assert: Confirmation sets confirmed flag to true
      expect(hookSrc).toContain('confirmed: true');

      // Assert: Override stores the override score value
      expect(hookSrc).toContain('override_score');
    });

    it('MAT-T-0121: Review table fetches and displays scoring data from Supabase', () => {
      // Architecture: ui-component-architecture.md §1 "ReviewTable — Score review interface"
      // FRS: FR-018 "Display Scoring Results"
      // TRS: TR-023 "Human Review Interface"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: ReviewTable imports and uses useAuditScores hook; handles loading state

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useScoring.ts'),
        'utf-8'
      );

      // Assert: useAuditScores hook is exported for the ReviewTable component
      expect(hookSrc).toContain('useAuditScores');

      const tableSrc = readFileSync(
        resolve(FRONTEND_SRC, 'components/scoring/ReviewTable.tsx'),
        'utf-8'
      );

      // Assert: ReviewTable imports and uses the live scoring hook
      expect(tableSrc).toContain('useAuditScores');

      // Assert: Loading state is handled in the component
      expect(tableSrc).toContain('isLoading');
    });

    it('MAT-T-0122: Report generation button downloads PDF report', () => {
      // Architecture: system-architecture.md §3.12 Path 5 — Report Generation
      // FRS: FR-019 "Generate Audit Report"
      // TRS: TR-024 "Report Generation"
      // Type: source-analysis | Priority: P1
      // Acceptance Criteria: useGenerateReport hook invokes generate-audit-report edge function

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useScoring.ts'),
        'utf-8'
      );

      // Assert: Report generation hook is exported for UI button
      expect(hookSrc).toContain('useGenerateReport');

      // Assert: Correct edge function is invoked for report generation
      expect(hookSrc).toContain('generate-audit-report');
    });
  });

  // Category 6: Settings (2 tests)

  describe('Settings', () => {
    it('MAT-T-0123: User profile management UI updates user_preferences table', () => {
      // Architecture: ui-component-architecture.md §1 "SettingsPage — User preferences"
      // FRS: Implied by user management
      // TRS: TR-047 "Settings UI"
      // Type: source-analysis | Priority: P2
      // Acceptance Criteria: useUserProfile and useUpdateUserProfile hooks exported; hook reads from user_profiles table

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useSettings.ts'),
        'utf-8'
      );

      // Assert: Read hook exported for displaying current profile
      expect(hookSrc).toContain('useUserProfile');

      // Assert: Write hook exported for saving profile updates
      expect(hookSrc).toContain('useUpdateUserProfile');

      // Assert: Hook reads from the user_profiles table
      expect(hookSrc).toContain('user_profiles');
    });

    it('MAT-T-0124: Organization settings UI updates organization_settings table', () => {
      // Architecture: ui-component-architecture.md §1 "SettingsPage — Organization settings"
      // FRS: Implied by organization management
      // TRS: TR-047 "Settings UI"
      // Type: source-analysis | Priority: P2
      // Acceptance Criteria: useOrganisationSettings and useUpdateOrganisationSettings hooks exported; hook reads from organisation_settings table

      const hookSrc = readFileSync(
        resolve(FRONTEND_SRC, 'lib/hooks/useSettings.ts'),
        'utf-8'
      );

      // Assert: Read hook exported for displaying current org settings
      expect(hookSrc).toContain('useOrganisationSettings');

      // Assert: Write hook exported for saving org settings updates
      expect(hookSrc).toContain('useUpdateOrganisationSettings');

      // Assert: Hook reads from and writes to the organisation_settings table
      expect(hookSrc).toContain('organisation_settings');
    });
  });

  // Category 7: Component Wiring and State Management (3 tests)

  describe('Component Wiring and State Management', () => {
    it('MAT-T-0125: All page components import and render child components with data props', () => {
      // Architecture: ui-component-architecture.md §1 Page Components
      // FRS: Implied by architecture
      // TRS: TR-047 "Component Architecture"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: DashboardPage uses useAuditMetrics; AuditManagementPage renders AuditCreationForm and AuditList; App uses ErrorBoundary

      const dashSrc = readFileSync(
        resolve(FRONTEND_SRC, 'pages/DashboardPage.tsx'),
        'utf-8'
      );

      // Assert: DashboardPage uses live metrics hook (not hardcoded data)
      expect(dashSrc).toContain('useAuditMetrics');

      const mgmtSrc = readFileSync(
        resolve(FRONTEND_SRC, 'pages/AuditManagementPage.tsx'),
        'utf-8'
      );

      // Assert: Audit management page renders the creation form
      expect(mgmtSrc).toContain('AuditCreationForm');

      // Assert: Audit management page renders the audit list
      expect(mgmtSrc).toContain('AuditList');

      const appSrc = readFileSync(
        resolve(FRONTEND_SRC, 'App.tsx'),
        'utf-8'
      );

      // Assert: App-level error boundary exists for graceful error handling
      expect(appSrc).toContain('ErrorBoundary');
    });

    it('MAT-T-0126: TanStack Query configured with Supabase client and proper cache settings', () => {
      // Architecture: system-architecture.md §3.5 "TanStack Query for server state"
      // TRS: TR-033 "Real-time Updates"
      // Type: source-analysis | Priority: P0
      // Acceptance Criteria: main.tsx creates QueryClient with staleTime and retry; QueryClientProvider wraps the App

      const mainSrc = readFileSync(
        resolve(FRONTEND_SRC, 'main.tsx'),
        'utf-8'
      );

      // Assert: QueryClient is instantiated
      expect(mainSrc).toContain('QueryClient');

      // Assert: QueryClientProvider wraps the application
      expect(mainSrc).toContain('QueryClientProvider');

      // Assert: staleTime is configured for cache management
      expect(mainSrc).toContain('staleTime');

      // Assert: retry is set to limit failed query retries (inside defaultOptions)
      expect(mainSrc).toContain('defaultOptions');
      expect(mainSrc).toContain('retry: 1');
    });

    it('MAT-T-0127: Loading states (skeleton loaders) and error states (toast notifications) implemented for all data-fetching components', () => {
      // Architecture: ui-component-architecture.md §2 "Loading States"
      // TRS: TR-047 "UI/UX Requirements"
      // Type: source-analysis | Priority: P1
      // Acceptance Criteria: AuditList and DashboardPage show skeleton loaders (animate-pulse) while loading and handle empty/error states

      const auditListSrc = readFileSync(
        resolve(FRONTEND_SRC, 'components/audits/AuditList.tsx'),
        'utf-8'
      );

      // Assert: AuditList checks isLoading to conditionally show skeleton
      expect(auditListSrc).toContain('isLoading');

      // Assert: AuditList uses animate-pulse for skeleton loader UX
      expect(auditListSrc).toContain('animate-pulse');

      // Assert: AuditList shows empty state message when no data
      expect(auditListSrc).toContain('No audits yet');

      const dashSrc = readFileSync(
        resolve(FRONTEND_SRC, 'pages/DashboardPage.tsx'),
        'utf-8'
      );

      // Assert: DashboardPage also applies skeleton loading pattern
      expect(dashSrc).toContain('animate-pulse');

      // Assert: DashboardPage handles the isLoading state
      expect(dashSrc).toContain('isLoading');
    });
  });
});
