/**
 * Criteria Tree View Component Logic
 * Architecture: modules/mat/02-architecture/ui-component-architecture.md §5 (Navigation Component TR-050)
 * FRS: FR-010 (Hierarchical Navigation)
 * TRS: TR-050 (Navigation Component)
 *
 * Implements Domain → MPS → Criteria hierarchy tree navigation
 * with status indicators, keyboard navigation, search/filter, and responsive design.
 */

import type { Criterion, CriterionStatus } from '../types/index.js';

/**
 * Represents a domain in the audit hierarchy
 */
export interface Domain {
  id: string;
  name: string;
  description: string;
  audit_id: string;
  order: number;
}

/**
 * Represents an MPS (Management Practice Statement) under a domain
 */
export interface MPS {
  id: string;
  domain_id: string;
  number: string;
  title: string;
  description: string;
  order: number;
}

/**
 * Represents a tree node in the criteria tree hierarchy
 */
export interface TreeNode {
  id: string;
  type: 'domain' | 'mps' | 'criterion';
  label: string;
  status?: CriterionStatus;
  children: TreeNode[];
  expanded: boolean;
  level: number;
  ariaLabel: string;
}

/**
 * Breadcrumb segment for current location trail
 */
export interface BreadcrumbSegment {
  id: string;
  label: string;
  type: 'audit' | 'domain' | 'mps' | 'criterion';
}

/**
 * Status indicator colors per criterion status
 * Architecture: ui-component-architecture.md §5 — Status Indicators
 */
export const STATUS_INDICATORS: Record<CriterionStatus, { color: string; icon: string; label: string }> = {
  not_started: { color: 'gray', icon: '○', label: 'Not Started' },
  in_progress: { color: 'blue', icon: '◐', label: 'In Progress' },
  submitted: { color: 'yellow', icon: '◑', label: 'Submitted' },
  ai_scored: { color: 'orange', icon: '◕', label: 'AI Scored' },
  confirmed: { color: 'green', icon: '●', label: 'Confirmed' },
  not_used: { color: 'strikethrough', icon: '⊘', label: 'Not Used' }
};

/**
 * Responsive breakpoints for navigation layout
 * Architecture: ui-component-architecture.md §6 — Responsive Design (TR-034)
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
} as const;

/**
 * Navigation layout configuration per viewport
 */
export type NavigationLayout = 'sidebar' | 'drawer' | 'bottom-tabs';

/**
 * Builds the tree structure from flat domain, MPS, and criteria data
 *
 * @param domains - Array of domains
 * @param mpsList - Array of MPS records
 * @param criteria - Array of criteria
 * @returns Array of tree nodes representing the hierarchy
 */
export function buildCriteriaTree(
  domains: Domain[],
  mpsList: MPS[],
  criteria: Criterion[]
): TreeNode[] {
  return domains
    .sort((a, b) => a.order - b.order)
    .map(domain => {
      const domainMps = mpsList
        .filter(m => m.domain_id === domain.id)
        .sort((a, b) => a.order - b.order);

      const mpsNodes: TreeNode[] = domainMps.map(mps => {
        const mpsCriteria = criteria
          .filter(c => c.mps_id === mps.id)
          .sort((a, b) => a.number.localeCompare(b.number));

        const criterionNodes: TreeNode[] = mpsCriteria.map(criterion => ({
          id: criterion.id,
          type: 'criterion' as const,
          label: `${criterion.number} ${criterion.title}`,
          status: criterion.status,
          children: [],
          expanded: false,
          level: 2,
          ariaLabel: `Criterion ${criterion.number}: ${criterion.title}, Status: ${STATUS_INDICATORS[criterion.status].label}`
        }));

        return {
          id: mps.id,
          type: 'mps' as const,
          label: `${mps.number} ${mps.title}`,
          children: criterionNodes,
          expanded: false,
          level: 1,
          ariaLabel: `MPS ${mps.number}: ${mps.title}, ${criterionNodes.length} criteria`
        };
      });

      return {
        id: domain.id,
        type: 'domain' as const,
        label: domain.name,
        children: mpsNodes,
        expanded: false,
        level: 0,
        ariaLabel: `Domain: ${domain.name}, ${mpsNodes.length} management practice statements`
      };
    });
}

/**
 * Toggles a node's expanded state in the tree
 *
 * @param tree - Current tree nodes
 * @param nodeId - ID of node to toggle
 * @returns Updated tree with toggled node
 */
export function toggleNode(tree: TreeNode[], nodeId: string): TreeNode[] {
  return tree.map(node => {
    if (node.id === nodeId) {
      return { ...node, expanded: !node.expanded };
    }
    if (node.children.length > 0) {
      return { ...node, children: toggleNode(node.children, nodeId) };
    }
    return node;
  });
}

/**
 * Generates breadcrumb path for a given node in the tree
 *
 * @param tree - Full tree structure
 * @param nodeId - Target node ID
 * @param auditTitle - Title of the audit (root breadcrumb)
 * @returns Array of breadcrumb segments from root to target
 */
export function getBreadcrumb(
  tree: TreeNode[],
  nodeId: string,
  auditTitle: string
): BreadcrumbSegment[] {
  const path: BreadcrumbSegment[] = [
    { id: 'root', label: auditTitle, type: 'audit' }
  ];

  function findPath(nodes: TreeNode[], targetId: string, currentPath: BreadcrumbSegment[]): BreadcrumbSegment[] | null {
    for (const node of nodes) {
      const segment: BreadcrumbSegment = {
        id: node.id,
        label: node.label,
        type: node.type
      };
      const newPath = [...currentPath, segment];

      if (node.id === targetId) {
        return newPath;
      }

      if (node.children.length > 0) {
        const found = findPath(node.children, targetId, newPath);
        if (found) return found;
      }
    }
    return null;
  }

  const found = findPath(tree, nodeId, path);
  return found || path;
}

/**
 * Filters tree nodes by search query (matches against label)
 *
 * @param tree - Full tree structure
 * @param query - Search text
 * @returns Filtered tree with matching nodes and their parents expanded
 */
export function filterTree(tree: TreeNode[], query: string): TreeNode[] {
  if (!query.trim()) return tree;

  const lowerQuery = query.toLowerCase();

  function filterNodes(nodes: TreeNode[]): TreeNode[] {
    return nodes.reduce<TreeNode[]>((acc, node) => {
      const matchesSelf = node.label.toLowerCase().includes(lowerQuery);
      const filteredChildren = filterNodes(node.children);

      if (matchesSelf || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren,
          expanded: filteredChildren.length > 0
        });
      }
      return acc;
    }, []);
  }

  return filterNodes(tree);
}

/**
 * Filters tree nodes by criterion status
 *
 * @param tree - Full tree structure
 * @param statusFilter - Status to filter by
 * @returns Filtered tree showing only criteria with matching status
 */
export function filterByStatus(tree: TreeNode[], statusFilter: CriterionStatus): TreeNode[] {
  function filterNodes(nodes: TreeNode[]): TreeNode[] {
    return nodes.reduce<TreeNode[]>((acc, node) => {
      if (node.type === 'criterion') {
        if (node.status === statusFilter) {
          acc.push(node);
        }
      } else {
        const filteredChildren = filterNodes(node.children);
        if (filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren,
            expanded: true
          });
        }
      }
      return acc;
    }, []);
  }

  return filterNodes(tree);
}

/**
 * Calculates completion summary for the tree
 *
 * @param tree - Full tree structure
 * @returns Summary with total, completed, in-progress, and not-started counts
 */
export function getCompletionSummary(tree: TreeNode[]): {
  total: number;
  confirmed: number;
  in_progress: number;
  not_started: number;
  not_used: number;
} {
  let total = 0;
  let confirmed = 0;
  let in_progress = 0;
  let not_started = 0;
  let not_used = 0;

  function countNodes(nodes: TreeNode[]): void {
    for (const node of nodes) {
      if (node.type === 'criterion') {
        total++;
        if (node.status === 'confirmed') confirmed++;
        else if (node.status === 'in_progress' || node.status === 'submitted' || node.status === 'ai_scored') in_progress++;
        else if (node.status === 'not_started') not_started++;
        else if (node.status === 'not_used') not_used++;
      }
      countNodes(node.children);
    }
  }

  countNodes(tree);
  return { total, confirmed, in_progress, not_started, not_used };
}

/**
 * Determines navigation layout based on viewport width
 * Architecture: ui-component-architecture.md §6 — Responsive Design
 *
 * @param viewportWidth - Current viewport width in pixels
 * @returns Navigation layout type
 */
export function getNavigationLayout(viewportWidth: number): NavigationLayout {
  if (viewportWidth < BREAKPOINTS.mobile) return 'bottom-tabs';
  if (viewportWidth < BREAKPOINTS.tablet) return 'drawer';
  return 'sidebar';
}

/**
 * Handles keyboard navigation for tree nodes
 * Architecture: ui-component-architecture.md §5 — Keyboard Navigation
 *
 * Arrow keys for tree navigation, Enter to select, Tab to breadcrumb
 *
 * @param key - Keyboard key pressed
 * @param currentNodeId - Currently focused node ID
 * @param tree - Full tree structure
 * @returns Object with next focused node ID and any action to take
 */
export function handleKeyboardNavigation(
  key: string,
  currentNodeId: string,
  tree: TreeNode[]
): { focusNodeId: string; action: 'select' | 'expand' | 'collapse' | 'navigate' | 'none' } {
  const flatNodes = flattenVisibleNodes(tree);
  const currentIndex = flatNodes.findIndex(n => n.id === currentNodeId);

  if (currentIndex === -1) {
    return { focusNodeId: currentNodeId, action: 'none' };
  }

  const currentNode = flatNodes[currentIndex];

  switch (key) {
    case 'ArrowDown':
      if (currentIndex < flatNodes.length - 1) {
        return { focusNodeId: flatNodes[currentIndex + 1].id, action: 'navigate' };
      }
      return { focusNodeId: currentNodeId, action: 'none' };

    case 'ArrowUp':
      if (currentIndex > 0) {
        return { focusNodeId: flatNodes[currentIndex - 1].id, action: 'navigate' };
      }
      return { focusNodeId: currentNodeId, action: 'none' };

    case 'ArrowRight':
      if (currentNode.children.length > 0 && !currentNode.expanded) {
        return { focusNodeId: currentNodeId, action: 'expand' };
      }
      if (currentNode.expanded && currentNode.children.length > 0) {
        return { focusNodeId: currentNode.children[0].id, action: 'navigate' };
      }
      return { focusNodeId: currentNodeId, action: 'none' };

    case 'ArrowLeft':
      if (currentNode.expanded && currentNode.children.length > 0) {
        return { focusNodeId: currentNodeId, action: 'collapse' };
      }
      // Navigate to parent
      const parent = findParent(tree, currentNodeId);
      if (parent) {
        return { focusNodeId: parent.id, action: 'navigate' };
      }
      return { focusNodeId: currentNodeId, action: 'none' };

    case 'Enter':
      return { focusNodeId: currentNodeId, action: 'select' };

    default:
      return { focusNodeId: currentNodeId, action: 'none' };
  }
}

/**
 * Flattens the visible (expanded) nodes for keyboard navigation
 */
function flattenVisibleNodes(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];
  for (const node of nodes) {
    result.push(node);
    if (node.expanded && node.children.length > 0) {
      result.push(...flattenVisibleNodes(node.children));
    }
  }
  return result;
}

/**
 * Finds the parent of a given node in the tree
 */
function findParent(nodes: TreeNode[], childId: string, parent?: TreeNode): TreeNode | null {
  for (const node of nodes) {
    if (node.children.some(c => c.id === childId)) {
      return node;
    }
    const found = findParent(node.children, childId, node);
    if (found) return found;
  }
  return null;
}
