/**
 * Criteria Tree View Component Logic
 * Architecture: modules/mat/02-architecture/ui-component-architecture.md §5
 * Implements hierarchical Domain → MPS → Criteria tree navigation
 * with responsive rendering across desktop, tablet, and mobile viewports.
 */

import type { Criterion, CriterionStatus } from '../types/index.js';

/** Viewport breakpoint configuration per TR-034 */
export type Viewport = 'desktop' | 'tablet' | 'mobile';

export interface ViewportConfig {
  minWidth: number;
  maxWidth: number | null;
  layout: 'sidebar' | 'drawer' | 'bottom-tab';
  modalStyle: 'dialog' | 'full-width' | 'full-screen';
}

export const VIEWPORT_BREAKPOINTS: Record<Viewport, ViewportConfig> = {
  desktop: { minWidth: 1024, maxWidth: null, layout: 'sidebar', modalStyle: 'dialog' },
  tablet: { minWidth: 768, maxWidth: 1023, layout: 'drawer', modalStyle: 'full-width' },
  mobile: { minWidth: 0, maxWidth: 767, layout: 'bottom-tab', modalStyle: 'full-screen' },
};

/** Status badge configuration per ui-component-architecture.md §5 */
export interface StatusBadge {
  color: string;
  icon: string;
  label: string;
  ariaLabel: string;
}

export const STATUS_BADGES: Record<CriterionStatus, StatusBadge> = {
  not_started: { color: 'gray', icon: '○', label: 'Not Started', ariaLabel: 'Status: Not Started' },
  in_progress: { color: 'blue', icon: '◐', label: 'In Progress', ariaLabel: 'Status: In Progress' },
  submitted: { color: 'yellow', icon: '◑', label: 'Submitted', ariaLabel: 'Status: Submitted' },
  ai_scored: { color: 'orange', icon: '◕', label: 'AI Scored', ariaLabel: 'Status: AI Scored' },
  confirmed: { color: 'green', icon: '●', label: 'Confirmed', ariaLabel: 'Status: Confirmed' },
  not_used: { color: 'gray', icon: '⊘', label: 'Not Used', ariaLabel: 'Status: Not Used' },
};

/** Domain node in the criteria tree */
export interface DomainNode {
  id: string;
  name: string;
  mpsNodes: MPSNode[];
  expanded: boolean;
}

/** MPS node in the criteria tree */
export interface MPSNode {
  id: string;
  name: string;
  criteria: Criterion[];
  expanded: boolean;
}

/** Breadcrumb segment for navigation trail */
export interface BreadcrumbSegment {
  id: string;
  label: string;
  type: 'audit' | 'domain' | 'mps' | 'criterion';
}

/** Criteria tree render output */
export interface CriteriaTreeRenderOutput {
  viewport: Viewport;
  layout: string;
  nodes: DomainNode[];
  breadcrumb: BreadcrumbSegment[];
  totalCriteria: number;
  completedCriteria: number;
  completionPercentage: number;
  accessibilityAttributes: AccessibilityAttributes;
}

/** WCAG 2.1 AA accessibility attributes per TR-033 */
export interface AccessibilityAttributes {
  role: string;
  ariaLabel: string;
  tabIndex: number;
  keyboardNavigation: boolean;
  focusIndicatorWidth: string;
  minTouchTarget: string;
  skipNavigation: boolean;
  ariaLive: string;
}

/**
 * Detects viewport based on screen width
 * TR-034: Responsive Design
 */
export function detectViewport(screenWidth: number): Viewport {
  if (screenWidth >= 1024) return 'desktop';
  if (screenWidth >= 768) return 'tablet';
  return 'mobile';
}

/**
 * Builds the criteria tree from flat criteria list
 * Architecture: §5 Navigation Component (TR-050)
 */
export function buildCriteriaTree(
  domains: Array<{ id: string; name: string }>,
  mpsEntries: Array<{ id: string; name: string; domain_id: string }>,
  criteria: Criterion[]
): DomainNode[] {
  return domains.map(domain => {
    const domainMPS = mpsEntries.filter(m => m.domain_id === domain.id);
    return {
      id: domain.id,
      name: domain.name,
      expanded: false,
      mpsNodes: domainMPS.map(mps => ({
        id: mps.id,
        name: mps.name,
        expanded: false,
        criteria: criteria.filter(c => c.mps_id === mps.id),
      })),
    };
  });
}

/**
 * Builds breadcrumb navigation from current selection
 */
export function buildBreadcrumb(
  auditName: string,
  domainName?: string,
  mpsName?: string,
  criterionNumber?: string
): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [
    { id: 'audit', label: auditName, type: 'audit' },
  ];
  if (domainName) segments.push({ id: 'domain', label: domainName, type: 'domain' });
  if (mpsName) segments.push({ id: 'mps', label: mpsName, type: 'mps' });
  if (criterionNumber) segments.push({ id: 'criterion', label: criterionNumber, type: 'criterion' });
  return segments;
}

/**
 * Calculates completion statistics for the tree
 */
export function calculateCompletion(criteria: Criterion[]): {
  total: number;
  completed: number;
  percentage: number;
} {
  const total = criteria.length;
  const completed = criteria.filter(c => c.status === 'confirmed' || c.status === 'not_used').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percentage };
}

/**
 * Generates WCAG 2.1 AA accessibility attributes for the tree component
 * TR-033: Accessibility
 */
export function generateAccessibilityAttributes(): AccessibilityAttributes {
  return {
    role: 'tree',
    ariaLabel: 'Criteria Navigation Tree',
    tabIndex: 0,
    keyboardNavigation: true,
    focusIndicatorWidth: '2px',
    minTouchTarget: '44px',
    skipNavigation: true,
    ariaLive: 'polite',
  };
}

/**
 * Filters criteria by search term (title or number)
 */
export function filterCriteria(criteria: Criterion[], searchTerm: string): Criterion[] {
  if (!searchTerm.trim()) return criteria;
  const term = searchTerm.toLowerCase();
  return criteria.filter(
    c => c.title.toLowerCase().includes(term) || c.number.toLowerCase().includes(term)
  );
}

/**
 * Filters criteria by status
 */
export function filterCriteriaByStatus(
  criteria: Criterion[],
  statuses: CriterionStatus[]
): Criterion[] {
  if (statuses.length === 0) return criteria;
  return criteria.filter(c => statuses.includes(c.status));
}

/**
 * Renders criteria tree for a given viewport
 * This is the main entry point for rendering the tree view.
 * Architecture: ui-component-architecture.md §5 Navigation Component (TR-050)
 * TR-034: Responsive Design
 */
export function renderCriteriaTree(
  domains: Array<{ id: string; name: string }>,
  mpsEntries: Array<{ id: string; name: string; domain_id: string }>,
  criteria: Criterion[],
  screenWidth: number,
  auditName: string
): CriteriaTreeRenderOutput {
  const viewport = detectViewport(screenWidth);
  const viewportConfig = VIEWPORT_BREAKPOINTS[viewport];
  const nodes = buildCriteriaTree(domains, mpsEntries, criteria);
  const breadcrumb = buildBreadcrumb(auditName);
  const completion = calculateCompletion(criteria);
  const accessibilityAttributes = generateAccessibilityAttributes();

  return {
    viewport,
    layout: viewportConfig.layout,
    nodes,
    breadcrumb,
    totalCriteria: completion.total,
    completedCriteria: completion.completed,
    completionPercentage: completion.percentage,
    accessibilityAttributes,
  };
}
