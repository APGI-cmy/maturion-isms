/**
 * MAT Red Test Suite — CAT-10: ui accessibility
 *
 * Build-to-Green for MAT-T-0010, MAT-T-0011, MAT-T-0033, MAT-T-0034, MAT-T-0039 (Wave 1+3 scope).
 * Build-to-Green for MAT-T-0040, MAT-T-0041, MAT-T-0042, MAT-T-0061, MAT-T-0062, MAT-T-0063, MAT-T-0065, MAT-T-0066 (Wave 4 scope).
 * Remaining tests stay QA-to-Red for future waves.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it, expect } from 'vitest';
import {
  buildCriteriaTree,
  toggleNode,
  getBreadcrumb,
  filterTree,
  filterByStatus,
  getCompletionSummary,
  getNavigationLayout,
  handleKeyboardNavigation,
  STATUS_INDICATORS
} from '../../src/components/criteria-tree.js';
import type { Domain, MPS } from '../../src/components/criteria-tree.js';
import {
  createInitialModalState,
  openModal,
  closeModal,
  switchTab,
  markUnsavedChanges,
  handleModalKeyboard,
  getModalAriaAttributes,
  getTabAriaAttributes,
  getModalSize,
  validateNotUsedForm,
  MODAL_TABS,
  EVIDENCE_SUBTABS
} from '../../src/components/criteria-modal.js';
import {
  createReviewTableConfig,
  createReviewTableRow,
  sortReviewTable,
  filterReviewTableByStatus,
  editReviewTableRow,
  validateReviewTableCompleteness
} from '../../src/components/review-table.js';
import {
  generateDashboardMetrics,
  validateDashboardMetrics,
  generateDomainDrilldown,
  generateMaturityDistribution
} from '../../src/components/dashboard.js';
import type { MPSMappingEntry } from '../../src/components/dashboard.js';
import {
  getResponsiveLayout,
  getDeviceType,
  validateTouchTargets,
  validateAccessibility,
  getDashboardAriaConfig,
  getTranslations,
  translate,
  formatNumber,
  formatDate,
  getI18nConfig,
  validateLocaleCompleteness
} from '../../src/components/ui-support.js';
import { scoreMaturity, confirmScore } from '../../src/services/ai-scoring.js';
import { collectTextEvidence } from '../../src/services/evidence-collection.js';
import type { Criterion, MaturityLevel } from '../../src/types/index.js';

describe('CAT-10: ui accessibility', () => {
  it('MAT-T-0010: Hierarchical Navigation', () => {
    // Architecture: §3.1, §3.12 Path 8
    // FRS: FR-010
    // TRS: TR-050
    // Type: e2e | Priority: P0

    // --- Setup: Domain → MPS → Criteria hierarchy ---
    const domains: Domain[] = [
      { id: 'dom1', name: 'Information Security Policies', description: 'Domain 1', audit_id: 'audit1', order: 1 },
      { id: 'dom2', name: 'Access Control', description: 'Domain 2', audit_id: 'audit1', order: 2 }
    ];

    const mpsList: MPS[] = [
      { id: 'mps1', domain_id: 'dom1', number: 'A.5', title: 'Management Direction', description: 'Desc', order: 1 },
      { id: 'mps2', domain_id: 'dom1', number: 'A.6', title: 'Organization', description: 'Desc', order: 2 },
      { id: 'mps3', domain_id: 'dom2', number: 'A.9', title: 'Business Requirements', description: 'Desc', order: 1 }
    ];

    const criteria: Criterion[] = [
      { id: 'c1', mps_id: 'mps1', number: 'A.5.1', title: 'Policies for Information Security', description: 'Desc', status: 'not_started', is_approved: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
      { id: 'c2', mps_id: 'mps1', number: 'A.5.2', title: 'Review of Policies', description: 'Desc', status: 'in_progress', is_approved: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
      { id: 'c3', mps_id: 'mps2', number: 'A.6.1', title: 'Internal Organization', description: 'Desc', status: 'confirmed', is_approved: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
      { id: 'c4', mps_id: 'mps3', number: 'A.9.1', title: 'Access Control Policy', description: 'Desc', status: 'not_used', is_approved: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
    ];

    // 1. Build tree and verify Domain → MPS → Criteria hierarchy
    const tree = buildCriteriaTree(domains, mpsList, criteria);
    expect(tree).toHaveLength(2);
    expect(tree[0].type).toBe('domain');
    expect(tree[0].label).toBe('Information Security Policies');
    expect(tree[0].children).toHaveLength(2); // 2 MPS under domain 1
    expect(tree[0].children[0].type).toBe('mps');
    expect(tree[0].children[0].label).toBe('A.5 Management Direction');
    expect(tree[0].children[0].children).toHaveLength(2); // 2 criteria under MPS A.5
    expect(tree[0].children[0].children[0].type).toBe('criterion');
    expect(tree[0].children[0].children[0].label).toBe('A.5.1 Policies for Information Security');
    expect(tree[0].children[0].children[0].status).toBe('not_started');

    // 2. Verify status indicators exist for all criterion statuses
    expect(STATUS_INDICATORS.not_started.color).toBe('gray');
    expect(STATUS_INDICATORS.in_progress.color).toBe('blue');
    expect(STATUS_INDICATORS.confirmed.color).toBe('green');
    expect(STATUS_INDICATORS.not_used.color).toBe('strikethrough');

    // 3. Verify ARIA labels for accessibility
    expect(tree[0].ariaLabel).toContain('Domain');
    expect(tree[0].children[0].ariaLabel).toContain('MPS');
    expect(tree[0].children[0].children[0].ariaLabel).toContain('Criterion');
    expect(tree[0].children[0].children[0].ariaLabel).toContain('Not Started');

    // 4. Toggle expand/collapse
    const expandedTree = toggleNode(tree, 'dom1');
    expect(expandedTree[0].expanded).toBe(true);
    const collapsedTree = toggleNode(expandedTree, 'dom1');
    expect(collapsedTree[0].expanded).toBe(false);

    // 5. Breadcrumb generation (Audit > Domain > MPS > Criterion)
    const expandedForBreadcrumb = toggleNode(toggleNode(tree, 'dom1'), 'mps1');
    const breadcrumb = getBreadcrumb(expandedForBreadcrumb, 'c1', 'ISO 27001 Audit');
    expect(breadcrumb).toHaveLength(4); // audit, domain, mps, criterion
    expect(breadcrumb[0].type).toBe('audit');
    expect(breadcrumb[1].type).toBe('domain');
    expect(breadcrumb[2].type).toBe('mps');
    expect(breadcrumb[3].type).toBe('criterion');

    // 6. Search/filter by text
    const filtered = filterTree(tree, 'Access Control');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].label).toBe('Access Control');

    // 7. Filter by status
    const inProgressOnly = filterByStatus(tree, 'in_progress');
    expect(inProgressOnly).toHaveLength(1); // 1 domain with matching criteria
    const allCriteria = inProgressOnly[0].children[0].children;
    expect(allCriteria).toHaveLength(1);
    expect(allCriteria[0].status).toBe('in_progress');

    // 8. Completion summary
    const summary = getCompletionSummary(tree);
    expect(summary.total).toBe(4);
    expect(summary.confirmed).toBe(1);
    expect(summary.in_progress).toBe(1);
    expect(summary.not_started).toBe(1);
    expect(summary.not_used).toBe(1);

    // 9. Responsive layout
    expect(getNavigationLayout(1280)).toBe('sidebar');     // desktop
    expect(getNavigationLayout(900)).toBe('drawer');       // tablet
    expect(getNavigationLayout(400)).toBe('bottom-tabs');  // mobile

    // 10. Keyboard navigation
    const treeWithExpand = toggleNode(toggleNode(tree, 'dom1'), 'mps1');
    const navResult = handleKeyboardNavigation('ArrowDown', 'dom1', treeWithExpand);
    expect(navResult.action).toBe('navigate');
    const enterResult = handleKeyboardNavigation('Enter', 'c1', treeWithExpand);
    expect(enterResult.action).toBe('select');
  });

  it('MAT-T-0011: Criteria Modal Component', () => {
    // Architecture: §3.1
    // FRS: FR-011
    // TRS: TR-047
    // Type: unit | Priority: P0

    const criterion: Criterion = {
      id: 'crit_1',
      mps_id: 'mps_123',
      number: 'A.5.1',
      title: 'Information Security Policies',
      description: 'Management direction for information security',
      status: 'ai_scored',
      is_approved: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    // 1. Initial state — modal closed
    const initial = createInitialModalState();
    expect(initial.isOpen).toBe(false);
    expect(initial.criterion).toBeNull();
    expect(initial.activeTab).toBe('description');

    // 2. Open modal with criterion
    const opened = openModal(initial, criterion, 1280);
    expect(opened.isOpen).toBe(true);
    expect(opened.criterion).toBe(criterion);
    expect(opened.activeTab).toBe('description');
    expect(opened.isFullScreen).toBe(false); // desktop

    // 3. Open on mobile — full screen
    const openedMobile = openModal(initial, criterion, 400);
    expect(openedMobile.isFullScreen).toBe(true);

    // 4. Tab navigation (5 tabs: Description, Not Used, Evidence, Findings, Interview)
    expect(MODAL_TABS).toHaveLength(5);
    expect(MODAL_TABS[0].id).toBe('description');
    expect(MODAL_TABS[1].id).toBe('not_used');
    expect(MODAL_TABS[2].id).toBe('evidence');
    expect(MODAL_TABS[3].id).toBe('findings');
    expect(MODAL_TABS[4].id).toBe('interview');

    const evidenceTab = switchTab(opened, 'evidence');
    expect(evidenceTab.activeTab).toBe('evidence');

    // 5. Evidence sub-tabs (text, voice, photo, document, video)
    expect(EVIDENCE_SUBTABS).toHaveLength(5);
    expect(EVIDENCE_SUBTABS.map(s => s.id)).toEqual(['text', 'voice', 'photo', 'document', 'video']);

    // 6. Unsaved data protection
    const modified = markUnsavedChanges(opened);
    expect(modified.hasUnsavedChanges).toBe(true);
    const closeAttempt = closeModal(modified);
    expect(closeAttempt.needsConfirmation).toBe(true);
    expect(closeAttempt.state.isOpen).toBe(true); // still open

    // Force close bypasses confirmation
    const forceCloseResult = closeModal(modified, true);
    expect(forceCloseResult.needsConfirmation).toBe(false);
    expect(forceCloseResult.state.isOpen).toBe(false);

    // Close without unsaved changes — no confirmation needed
    const cleanClose = closeModal(opened);
    expect(cleanClose.needsConfirmation).toBe(false);
    expect(cleanClose.state.isOpen).toBe(false);

    // 7. Keyboard: Escape to close
    const escResult = handleModalKeyboard('Escape', opened);
    expect(escResult.action).toBe('close');

    // 8. ARIA attributes for accessibility
    const aria = getModalAriaAttributes(opened);
    expect(aria.role).toBe('dialog');
    expect(aria['aria-modal']).toBe('true');
    expect(aria['aria-label']).toContain('A.5.1');
    expect(aria['aria-label']).toContain('Information Security Policies');

    // 9. Tab ARIA attributes
    const tabAria = getTabAriaAttributes('description', true, MODAL_TABS[0]);
    expect(tabAria.role).toBe('tab');
    expect(tabAria['aria-selected']).toBe('true');
    expect(tabAria.tabindex).toBe('0');

    const inactiveTabAria = getTabAriaAttributes('evidence', false, MODAL_TABS[2]);
    expect(inactiveTabAria['aria-selected']).toBe('false');
    expect(inactiveTabAria.tabindex).toBe('-1');

    // 10. Responsive modal size
    const desktopSize = getModalSize(1280);
    expect(desktopSize.layout).toBe('dialog');
    expect(desktopSize.width).toBe('640px');

    const tabletSize = getModalSize(900);
    expect(tabletSize.layout).toBe('full-width');

    const mobileSize = getModalSize(400);
    expect(mobileSize.layout).toBe('full-screen');

    // 11. Not Used form validation
    const validForm = validateNotUsedForm('Not applicable to organization');
    expect(validForm.valid).toBe(true);

    const invalidForm = validateNotUsedForm('');
    expect(invalidForm.valid).toBe(false);
    expect(invalidForm.errors.length).toBeGreaterThan(0);
  });

  it('MAT-T-0033: Review Table Component', () => {
    // Architecture: §3.1
    // FRS: FR-033
    // TRS: TR-044
    // Type: unit | Priority: P0
    // Create review table config
    const config = createReviewTableConfig();
    expect(config.sortable).toBe(true);
    expect(config.filterable).toBe(true);
    expect(config.editable).toBe(true);
    expect(config.columns.length).toBeGreaterThan(0);
    expect(config.columns).toContain('criterion_number');
    expect(config.columns).toContain('ai_maturity_level');
    expect(config.columns).toContain('human_confirmed_level');

    // Create review table rows
    const row1 = createReviewTableRow({
      criterion_id: 'crit-001',
      criterion_number: '1.1.1',
      criterion_title: 'Access Control Policy',
      domain: 'Security',
      mps: '1.1',
      ai_maturity_level: 3,
      ai_confidence: 0.85,
      status: 'ai_scored',
      evidence_count: 4
    });

    expect(row1.criterion_number).toBe('1.1.1');
    expect(row1.ai_maturity_level).toBe(3);
    expect(row1.human_confirmed_level).toBeNull();
    expect(row1.status).toBe('ai_scored');

    const row2 = createReviewTableRow({
      criterion_id: 'crit-002',
      criterion_number: '1.1.2',
      criterion_title: 'Security Monitoring',
      domain: 'Security',
      mps: '1.1',
      ai_maturity_level: 4,
      ai_confidence: 0.92,
      status: 'confirmed',
      evidence_count: 6
    });

    // Sort by criterion_number
    const sorted = sortReviewTable([row2, row1], 'criterion_number', true);
    expect(sorted[0].criterion_number).toBe('1.1.1');
    expect(sorted[1].criterion_number).toBe('1.1.2');

    // Filter by status
    const filtered = filterReviewTableByStatus([row1, row2], 'ai_scored');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].criterion_id).toBe('crit-001');

    // Validate completeness
    const completeness = validateReviewTableCompleteness([row1, row2]);
    expect(completeness.total).toBe(2);
    expect(completeness.confirmed).toBe(1);
    expect(completeness.pending).toBe(1);
    expect(completeness.complete).toBe(false);
  });

  it('MAT-T-0034: Review Table Editing', () => {
    // Architecture: §3.1
    // FRS: FR-034
    // TRS: TR-044
    // Type: unit | Priority: P0
    // Create a row with AI score
    const row = createReviewTableRow({
      criterion_id: 'crit-001',
      criterion_number: '1.1.1',
      criterion_title: 'Access Control Policy',
      domain: 'Security',
      mps: '1.1',
      ai_maturity_level: 3,
      ai_confidence: 0.85,
      status: 'ai_scored',
      evidence_count: 4
    });

    // Edit to confirm at same level (no override)
    const confirmedRow = editReviewTableRow(row, 3);
    expect(confirmedRow.human_confirmed_level).toBe(3);
    expect(confirmedRow.is_override).toBe(false);
    expect(confirmedRow.status).toBe('confirmed');

    // Edit to override (different level)
    const overriddenRow = editReviewTableRow(row, 4);
    expect(overriddenRow.human_confirmed_level).toBe(4);
    expect(overriddenRow.is_override).toBe(true);
    expect(overriddenRow.status).toBe('confirmed');

    // Completeness after editing
    const row2 = createReviewTableRow({
      criterion_id: 'crit-002',
      criterion_number: '1.1.2',
      criterion_title: 'Monitoring',
      domain: 'Security',
      mps: '1.1',
      status: 'ai_scored',
      evidence_count: 3
    });

    const edited2 = editReviewTableRow(row2, 2);
    const completeness = validateReviewTableCompleteness([confirmedRow, edited2]);
    expect(completeness.complete).toBe(true);
    expect(completeness.pending).toBe(0);
    expect(completeness.confirmed).toBe(2);
  });

  it('MAT-T-0039: Global Dashboard', () => {
    // Architecture: §3.12 Path 8 — Dashboard Real-time Updates
    // FRS: FR-039
    // TRS: TR-048
    // Type: e2e | Priority: P0
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for dashboard test',
      uploaded_by: 'user-001'
    });

    const aiScore = scoreMaturity('crit-001', [evidence], 'gpt-4-turbo-2024');
    const confirmation = confirmScore(aiScore, aiScore.maturity_level, 'user-002', 'lead_auditor');

    const domainMapping = new Map<string, { domain_id: string; domain_name: string }>();
    domainMapping.set('crit-001', { domain_id: 'dom-001', domain_name: 'Security' });
    domainMapping.set('crit-002', { domain_id: 'dom-001', domain_name: 'Security' });

    const metrics = generateDashboardMetrics('audit-001', [confirmation], 5, domainMapping);

    expect(metrics.audit_id).toBe('audit-001');
    expect(metrics.total_criteria).toBe(5);
    expect(metrics.scored_criteria).toBe(1);
    expect(metrics.confirmed_criteria).toBe(1);
    expect(metrics.average_maturity).toBeGreaterThan(0);
    expect(metrics.average_maturity).toBeLessThanOrEqual(5);
    expect(metrics.completion_percentage).toBe(20); // 1/5 = 20%
    expect(metrics.generated_at).toBeDefined();
    expect(metrics.domains.length).toBeGreaterThan(0);
    expect(metrics.domains[0].domain_name).toBe('Security');

    // Validate metrics
    const validation = validateDashboardMetrics(metrics);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('MAT-T-0040: Domain Dashboard', () => {
    // Architecture: §3.12 Path 8
    // FRS: FR-040
    // TRS: TR-048
    // Type: e2e | Priority: P0

    // Setup: Create evidence and scores for multiple criteria in a domain
    const evidence1 = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for domain dashboard test criterion 1',
      uploaded_by: 'user-001'
    });

    const evidence2 = collectTextEvidence({
      criterion_id: 'crit-002',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for domain dashboard test criterion 2',
      uploaded_by: 'user-001'
    });

    const aiScore1 = scoreMaturity('crit-001', [evidence1], 'gpt-4-turbo-2024');
    const confirmation1 = confirmScore(aiScore1, aiScore1.maturity_level, 'user-002', 'lead_auditor');

    const aiScore2 = scoreMaturity('crit-002', [evidence2], 'gpt-4-turbo-2024');
    const confirmation2 = confirmScore(aiScore2, aiScore2.maturity_level, 'user-002', 'lead_auditor');

    // MPS mapping for domain drill-down
    const mpsMapping = new Map<string, MPSMappingEntry>();
    mpsMapping.set('crit-001', {
      domain_id: 'dom-001',
      domain_name: 'Information Security Policies',
      mps_id: 'mps-001',
      mps_number: 'A.5',
      mps_title: 'Management Direction',
      criterion_number: 'A.5.1'
    });
    mpsMapping.set('crit-002', {
      domain_id: 'dom-001',
      domain_name: 'Information Security Policies',
      mps_id: 'mps-001',
      mps_number: 'A.5',
      mps_title: 'Management Direction',
      criterion_number: 'A.5.2'
    });
    mpsMapping.set('crit-003', {
      domain_id: 'dom-001',
      domain_name: 'Information Security Policies',
      mps_id: 'mps-002',
      mps_number: 'A.6',
      mps_title: 'Organization',
      criterion_number: 'A.6.1'
    });

    // Generate domain drill-down
    const drilldown = generateDomainDrilldown(
      'dom-001',
      'Information Security Policies',
      [confirmation1, confirmation2],
      mpsMapping
    );

    // Verify domain-level metrics
    expect(drilldown.domain_id).toBe('dom-001');
    expect(drilldown.domain_name).toBe('Information Security Policies');
    expect(drilldown.criteria_count).toBe(3); // 3 criteria mapped to this domain
    expect(drilldown.scored_count).toBe(2); // 2 confirmations
    expect(drilldown.average_maturity).toBeGreaterThan(0);
    expect(drilldown.average_maturity).toBeLessThanOrEqual(5);
    expect(drilldown.completion_percentage).toBe(67); // 2/3 ≈ 67%
    expect(drilldown.generated_at).toBeDefined();

    // Verify MPS breakdown
    expect(drilldown.mps_breakdown.length).toBe(2); // 2 MPS groups
    const mpsA5 = drilldown.mps_breakdown.find(m => m.mps_number === 'A.5');
    expect(mpsA5).toBeDefined();
    expect(mpsA5!.criteria_count).toBe(2);
    expect(mpsA5!.scored_count).toBe(2);
    expect(mpsA5!.average_maturity).toBeGreaterThan(0);

    const mpsA6 = drilldown.mps_breakdown.find(m => m.mps_number === 'A.6');
    expect(mpsA6).toBeDefined();
    expect(mpsA6!.criteria_count).toBe(1);
    expect(mpsA6!.scored_count).toBe(0); // No confirmations for A.6

    // Verify criterion-level detail in MPS breakdown
    expect(mpsA5!.criteria.length).toBe(2);
    expect(mpsA5!.criteria[0].criterion_number).toBe('A.5.1');
    expect(mpsA5!.criteria[0].confirmed_level).toBeGreaterThan(0);
  });

  it('MAT-T-0041: MPS Dashboard', () => {
    // Architecture: §3.12 Path 8
    // FRS: FR-041
    // TRS: TR-048
    // Type: e2e | Priority: P1

    // Setup: Create evidence and scores for criteria within an MPS
    const evidence1 = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for MPS dashboard test criterion 1',
      uploaded_by: 'user-001'
    });

    const evidence2 = collectTextEvidence({
      criterion_id: 'crit-002',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for MPS dashboard test criterion 2',
      uploaded_by: 'user-001'
    });

    const aiScore1 = scoreMaturity('crit-001', [evidence1], 'gpt-4-turbo-2024');
    const confirmation1 = confirmScore(aiScore1, aiScore1.maturity_level, 'user-002', 'lead_auditor');

    const aiScore2 = scoreMaturity('crit-002', [evidence2], 'gpt-4-turbo-2024');
    // Override to a different level for crit-002
    const overrideLevel = (aiScore2.maturity_level === 5 ? 4 : aiScore2.maturity_level + 1) as MaturityLevel;
    const confirmation2 = confirmScore(aiScore2, overrideLevel, 'user-002', 'lead_auditor', 'Evidence quality warrants higher rating');

    // MPS mapping for drill-down to criterion level
    const mpsMapping = new Map<string, MPSMappingEntry>();
    mpsMapping.set('crit-001', {
      domain_id: 'dom-001',
      domain_name: 'Information Security Policies',
      mps_id: 'mps-001',
      mps_number: 'A.5',
      mps_title: 'Management Direction',
      criterion_number: 'A.5.1'
    });
    mpsMapping.set('crit-002', {
      domain_id: 'dom-001',
      domain_name: 'Information Security Policies',
      mps_id: 'mps-001',
      mps_number: 'A.5',
      mps_title: 'Management Direction',
      criterion_number: 'A.5.2'
    });

    // Generate domain drill-down (which includes MPS breakdown with criteria)
    const drilldown = generateDomainDrilldown(
      'dom-001',
      'Information Security Policies',
      [confirmation1, confirmation2],
      mpsMapping
    );

    // Get MPS-level drill-down
    const mpsDetail = drilldown.mps_breakdown.find(m => m.mps_id === 'mps-001');
    expect(mpsDetail).toBeDefined();
    expect(mpsDetail!.mps_number).toBe('A.5');
    expect(mpsDetail!.mps_title).toBe('Management Direction');
    expect(mpsDetail!.criteria_count).toBe(2);
    expect(mpsDetail!.scored_count).toBe(2);
    expect(mpsDetail!.average_maturity).toBeGreaterThan(0);

    // Verify criterion-level detail
    const criteria = mpsDetail!.criteria;
    expect(criteria.length).toBe(2);

    // Check criterion 1 — confirmed at AI level (no override)
    const crit1 = criteria.find(c => c.criterion_id === 'crit-001');
    expect(crit1).toBeDefined();
    expect(crit1!.criterion_number).toBe('A.5.1');
    expect(crit1!.ai_maturity_level).toBe(aiScore1.maturity_level);
    expect(crit1!.confirmed_level).toBe(aiScore1.maturity_level);
    expect(crit1!.is_override).toBe(false);
    expect(crit1!.confidence).toBeGreaterThan(0);

    // Check criterion 2 — overridden
    const crit2 = criteria.find(c => c.criterion_id === 'crit-002');
    expect(crit2).toBeDefined();
    expect(crit2!.criterion_number).toBe('A.5.2');
    expect(crit2!.confirmed_level).toBe(overrideLevel);
    expect(crit2!.is_override).toBe(true);
  });

  it('MAT-T-0042: Maturity Distribution Visualization', () => {
    // Architecture: §3.1
    // FRS: FR-042
    // TRS: TR-048
    // Type: unit | Priority: P0

    // Setup: Create multiple confirmations at different maturity levels
    const confirmations = [];
    const criterionIds = ['crit-001', 'crit-002', 'crit-003', 'crit-004', 'crit-005'];
    const targetLevels: MaturityLevel[] = [2, 3, 3, 4, 5];

    for (let i = 0; i < criterionIds.length; i++) {
      const evidence = collectTextEvidence({
        criterion_id: criterionIds[i],
        audit_id: 'audit-001',
        organisation_id: 'org-001',
        evidence_type: 'text',
        content_text: `Evidence for distribution test ${i + 1}`,
        uploaded_by: 'user-001'
      });

      const aiScore = scoreMaturity(criterionIds[i], [evidence], 'gpt-4-turbo-2024');
      const isOverride = targetLevels[i] !== aiScore.maturity_level;
      const justification = isOverride ? `Distribution test override for criterion ${i + 1}` : undefined;
      const confirmation = confirmScore(aiScore, targetLevels[i], 'user-002', 'lead_auditor', justification);
      confirmations.push(confirmation);
    }

    // Generate maturity distribution
    const distribution = generateMaturityDistribution('audit-001', confirmations);

    // Verify distribution structure
    expect(distribution.audit_id).toBe('audit-001');
    expect(distribution.total_scored).toBe(5);
    expect(distribution.distribution.length).toBe(5); // levels 1-5
    expect(distribution.generated_at).toBeDefined();

    // Verify each level has count and percentage
    for (const levelData of distribution.distribution) {
      expect(levelData.level).toBeGreaterThanOrEqual(1);
      expect(levelData.level).toBeLessThanOrEqual(5);
      expect(levelData.count).toBeGreaterThanOrEqual(0);
      expect(levelData.percentage).toBeGreaterThanOrEqual(0);
      expect(levelData.percentage).toBeLessThanOrEqual(100);
    }

    // Verify specific counts: level 1=0, level 2=1, level 3=2, level 4=1, level 5=1
    const level1 = distribution.distribution.find(d => d.level === 1);
    expect(level1!.count).toBe(0);
    const level2 = distribution.distribution.find(d => d.level === 2);
    expect(level2!.count).toBe(1);
    const level3 = distribution.distribution.find(d => d.level === 3);
    expect(level3!.count).toBe(2);
    const level4 = distribution.distribution.find(d => d.level === 4);
    expect(level4!.count).toBe(1);
    const level5 = distribution.distribution.find(d => d.level === 5);
    expect(level5!.count).toBe(1);

    // Verify percentages sum to 100%
    const totalPercentage = distribution.distribution.reduce((sum, d) => sum + d.percentage, 0);
    expect(totalPercentage).toBe(100);

    // Verify median (sorted: 2,3,3,4,5 — median is 3)
    expect(distribution.median_level).toBe(3);

    // Verify mode (level 3 has highest count of 2)
    expect(distribution.mode_level).toBe(3);
  });

  it('MAT-T-0061: Responsive Design — Desktop', () => {
    // Architecture: §3.1
    // FRS: FR-062
    // TRS: TR-034
    // Type: e2e | Priority: P0

    // Desktop viewport (≥1024px)
    const layout = getResponsiveLayout(1280);

    expect(layout.device).toBe('desktop');
    expect(layout.columns).toBe(3); // Multi-column layout
    expect(layout.navigationStyle).toBe('sidebar'); // Side navigation
    expect(layout.chartLayout).toBe('grid'); // Grid chart arrangement
    expect(layout.modalBehavior).toBe('dialog'); // Modal as dialog
    expect(layout.fontSize.base).toBe(14);
    expect(layout.fontSize.heading).toBe(28);

    // Device type classification
    expect(getDeviceType(1280)).toBe('desktop');
    expect(getDeviceType(1920)).toBe('desktop');
    expect(getDeviceType(1024)).toBe('desktop');
  });

  it('MAT-T-0062: Responsive Design — Tablet', () => {
    // Architecture: §3.1
    // FRS: FR-062
    // TRS: TR-034
    // Type: e2e | Priority: P0

    // Tablet viewport (768–1023px)
    const layout = getResponsiveLayout(900);

    expect(layout.device).toBe('tablet');
    expect(layout.columns).toBe(2); // Two-column layout
    expect(layout.navigationStyle).toBe('drawer'); // Collapsible drawer
    expect(layout.chartLayout).toBe('stacked'); // Stacked charts
    expect(layout.touchTargetSize).toBe(44); // Minimum 44px touch targets
    expect(layout.modalBehavior).toBe('full-width'); // Full-width modal

    // Touch target validation for tablet
    const touchValidation = validateTouchTargets(layout);
    expect(touchValidation.valid).toBe(true);
    expect(touchValidation.errors).toHaveLength(0);

    // Device type classification
    expect(getDeviceType(768)).toBe('tablet');
    expect(getDeviceType(900)).toBe('tablet');
    expect(getDeviceType(1023)).toBe('tablet');
  });

  it('MAT-T-0063: Responsive Design — Mobile', () => {
    // Architecture: §3.1
    // FRS: FR-062
    // TRS: TR-034
    // Type: e2e | Priority: P0

    // Mobile viewport (<768px)
    const layout = getResponsiveLayout(400);

    expect(layout.device).toBe('mobile');
    expect(layout.columns).toBe(1); // Single-column stacked layout
    expect(layout.navigationStyle).toBe('bottom-tabs'); // Bottom tab navigation
    expect(layout.chartLayout).toBe('stacked'); // Stacked charts
    expect(layout.touchTargetSize).toBe(44); // 44x44px touch targets per WCAG
    expect(layout.modalBehavior).toBe('full-screen'); // Full-screen modals
    expect(layout.fontSize.base).toBe(16); // Larger base font for readability

    // Touch target validation for mobile
    const touchValidation = validateTouchTargets(layout);
    expect(touchValidation.valid).toBe(true);
    expect(touchValidation.errors).toHaveLength(0);

    // Device type classification
    expect(getDeviceType(320)).toBe('mobile');
    expect(getDeviceType(400)).toBe('mobile');
    expect(getDeviceType(767)).toBe('mobile');
  });

  it('MAT-T-0065: Accessibility (WCAG 2.1 AA)', () => {
    // Architecture: §3.1
    // FRS: FR-064
    // TRS: TR-033
    // Type: e2e | Priority: P1

    // Validate WCAG 2.1 AA compliance for MAT application
    const accessibilityResult = validateAccessibility({
      hasAriaLabels: true,
      hasKeyboardNav: true,
      contrastRatio: 7.0, // AAA level contrast ratio
      hasScreenReaderSupport: true,
      hasFocusIndicators: true,
      hasSkipLinks: true,
      hasAltText: true
    });

    // Verify AA compliance
    expect(accessibilityResult.wcag_level).toBe('AA');
    expect(accessibilityResult.compliant).toBe(true);
    expect(accessibilityResult.failed).toBe(0);
    expect(accessibilityResult.passed).toBe(accessibilityResult.checks.length);

    // Verify specific WCAG criteria are checked
    const ruleIds = accessibilityResult.checks.map(c => c.rule);
    expect(ruleIds).toContain('1.1.1'); // Non-text Content
    expect(ruleIds).toContain('1.4.3'); // Contrast (Minimum)
    expect(ruleIds).toContain('2.1.1'); // Keyboard
    expect(ruleIds).toContain('2.4.1'); // Bypass Blocks
    expect(ruleIds).toContain('2.4.7'); // Focus Visible
    expect(ruleIds).toContain('4.1.2'); // Name, Role, Value
    expect(ruleIds).toContain('1.3.1'); // Info and Relationships

    // Verify dashboard ARIA configurations
    const chartAria = getDashboardAriaConfig('chart', 'Maturity Distribution Chart');
    expect(chartAria.role).toBe('img');
    expect(chartAria['aria-label']).toBe('Maturity Distribution Chart');
    expect(chartAria.tabindex).toBe('0');

    const metricAria = getDashboardAriaConfig('metric-card', 'Average Maturity Level');
    expect(metricAria.role).toBe('status');
    expect(metricAria['aria-live']).toBe('polite');
    expect(metricAria['aria-atomic']).toBe('true');

    const tableAria = getDashboardAriaConfig('data-table', 'Criteria Review Table');
    expect(tableAria.role).toBe('table');

    const navAria = getDashboardAriaConfig('navigation', 'Dashboard Navigation');
    expect(navAria.role).toBe('navigation');

    // Verify failure case — insufficient contrast
    const failResult = validateAccessibility({
      hasAriaLabels: true,
      hasKeyboardNav: true,
      contrastRatio: 3.0, // Below AA minimum
      hasScreenReaderSupport: true,
      hasFocusIndicators: true,
      hasSkipLinks: true,
      hasAltText: true
    });
    expect(failResult.compliant).toBe(false);
    expect(failResult.failed).toBe(1);
    const failedCheck = failResult.checks.find(c => !c.passed);
    expect(failedCheck!.rule).toBe('1.4.3');
  });

  it('MAT-T-0066: Internationalization (i18n)', () => {
    // Architecture: §3.1
    // FRS: FR-065
    // TRS: TR-035
    // Type: unit | Priority: P1

    // Verify i18n configuration
    const config = getI18nConfig();
    expect(config.defaultLocale).toBe('en');
    expect(config.supportedLocales).toContain('en');
    expect(config.supportedLocales).toContain('af'); // Afrikaans
    expect(config.fallbackLocale).toBe('en');

    // Verify English translations
    const enDict = getTranslations('en');
    expect(enDict.locale).toBe('en');
    expect(enDict.translations['dashboard.title']).toBe('Audit Dashboard');
    expect(enDict.translations['report.title']).toBe('Audit Report');
    expect(enDict.translations['common.save']).toBe('Save');
    expect(enDict.translations['common.cancel']).toBe('Cancel');

    // Verify Afrikaans translations
    const afDict = getTranslations('af');
    expect(afDict.locale).toBe('af');
    expect(afDict.translations['dashboard.title']).toBe('Oudit Kontroleskerm');
    expect(afDict.translations['report.title']).toBe('Ouditverslag');
    expect(afDict.translations['common.save']).toBe('Stoor');
    expect(afDict.translations['common.cancel']).toBe('Kanselleer');

    // Verify translate function
    expect(translate('dashboard.title', 'en')).toBe('Audit Dashboard');
    expect(translate('dashboard.title', 'af')).toBe('Oudit Kontroleskerm');
    expect(translate('nonexistent.key', 'en')).toBe('nonexistent.key'); // Fallback to key

    // Verify locale formatting
    const formattedNumber = formatNumber(1234.5, 'en', { decimals: 1 });
    expect(formattedNumber).toBeDefined();
    expect(typeof formattedNumber).toBe('string');

    const formattedDate = formatDate('2024-06-15T10:30:00Z', 'en');
    expect(formattedDate).toBeDefined();
    expect(typeof formattedDate).toBe('string');

    // Verify locale completeness
    const enCompleteness = validateLocaleCompleteness('en');
    expect(enCompleteness.valid).toBe(true);
    expect(enCompleteness.missingKeys).toHaveLength(0);

    const afCompleteness = validateLocaleCompleteness('af');
    expect(afCompleteness.valid).toBe(true);
    expect(afCompleteness.missingKeys).toHaveLength(0);
    expect(afCompleteness.translatedKeys).toBe(afCompleteness.totalKeys);
  });
});
