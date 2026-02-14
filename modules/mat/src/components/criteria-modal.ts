/**
 * Criteria Modal Component Logic
 * Architecture: modules/mat/02-architecture/ui-component-architecture.md §2 (Criteria Modal TR-047)
 * FRS: FR-011 (Criteria Modal Component)
 * TRS: TR-047 (Criteria Modal)
 *
 * Implements criteria assessment modal with tabs for description, not used,
 * evidence, findings, and interview. Includes unsaved data protection,
 * responsive behavior, and accessibility support.
 */

import type { Criterion, CriterionStatus } from '../types/index.js';

/**
 * Tab identifiers for the criteria modal
 * Architecture: ui-component-architecture.md §2 — Tabs/Sections
 */
export type ModalTab = 'description' | 'not_used' | 'evidence' | 'findings' | 'interview';

/**
 * Evidence type for sub-tabs within evidence tab
 */
export type EvidenceType = 'text' | 'voice' | 'photo' | 'document' | 'video';

/**
 * Modal state object
 */
export interface ModalState {
  isOpen: boolean;
  criterion: Criterion | null;
  activeTab: ModalTab;
  hasUnsavedChanges: boolean;
  isFullScreen: boolean;
}

/**
 * Evidence attachment metadata
 */
export interface EvidenceAttachment {
  id: string;
  type: EvidenceType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  url: string;
}

/**
 * Score display data from AI scoring
 */
export interface AIScoreDisplay {
  maturityLevel: number;
  confidence: number;
  rationale: string;
  gapAnalysis: string[];
}

/**
 * Tab configuration with accessibility attributes
 * Architecture: ui-component-architecture.md §7 — Accessibility (TR-033)
 */
export const MODAL_TABS: { id: ModalTab; label: string; ariaLabel: string }[] = [
  { id: 'description', label: 'Description', ariaLabel: 'Criteria description tab' },
  { id: 'not_used', label: 'Not Used', ariaLabel: 'Mark criterion as not used tab' },
  { id: 'evidence', label: 'Evidence', ariaLabel: 'Evidence attachments tab' },
  { id: 'findings', label: 'Findings', ariaLabel: 'Findings summary tab' },
  { id: 'interview', label: 'Interview', ariaLabel: 'Interview recording tab' }
];

/**
 * Evidence sub-tabs configuration
 */
export const EVIDENCE_SUBTABS: { id: EvidenceType; label: string; ariaLabel: string }[] = [
  { id: 'text', label: 'Text', ariaLabel: 'Text evidence' },
  { id: 'voice', label: 'Voice', ariaLabel: 'Voice recording evidence' },
  { id: 'photo', label: 'Photo', ariaLabel: 'Photo evidence' },
  { id: 'document', label: 'Document', ariaLabel: 'Document evidence' },
  { id: 'video', label: 'Video', ariaLabel: 'Video evidence' }
];

/**
 * Creates the initial modal state
 *
 * @returns Default modal state (closed)
 */
export function createInitialModalState(): ModalState {
  return {
    isOpen: false,
    criterion: null,
    activeTab: 'description',
    hasUnsavedChanges: false,
    isFullScreen: false
  };
}

/**
 * Opens the modal with a specific criterion
 *
 * @param state - Current modal state
 * @param criterion - Criterion to display
 * @param viewportWidth - Current viewport width for responsive behavior
 * @returns Updated modal state
 */
export function openModal(
  state: ModalState,
  criterion: Criterion,
  viewportWidth: number
): ModalState {
  return {
    ...state,
    isOpen: true,
    criterion,
    activeTab: 'description',
    hasUnsavedChanges: false,
    isFullScreen: viewportWidth < 768 // Mobile: full-screen sheet
  };
}

/**
 * Attempts to close the modal with unsaved data protection
 * Architecture: ui-component-architecture.md §2 — Unsaved Data Protection
 *
 * @param state - Current modal state
 * @param forceClose - Force close without checking unsaved changes
 * @returns Object with updated state and whether confirmation is needed
 */
export function closeModal(
  state: ModalState,
  forceClose: boolean = false
): { state: ModalState; needsConfirmation: boolean } {
  if (state.hasUnsavedChanges && !forceClose) {
    return { state, needsConfirmation: true };
  }

  return {
    state: createInitialModalState(),
    needsConfirmation: false
  };
}

/**
 * Switches to a different tab in the modal
 *
 * @param state - Current modal state
 * @param tab - Target tab
 * @returns Updated modal state
 */
export function switchTab(state: ModalState, tab: ModalTab): ModalState {
  return {
    ...state,
    activeTab: tab
  };
}

/**
 * Marks the modal as having unsaved changes
 *
 * @param state - Current modal state
 * @returns Updated modal state with hasUnsavedChanges=true
 */
export function markUnsavedChanges(state: ModalState): ModalState {
  return {
    ...state,
    hasUnsavedChanges: true
  };
}

/**
 * Handles keyboard events for the modal
 * Architecture: ui-component-architecture.md §7 — Accessibility
 * - Escape to close
 * - Tab navigation within modal
 *
 * @param key - Keyboard key pressed
 * @param state - Current modal state
 * @returns Object with updated state, action to take, and focus target
 */
export function handleModalKeyboard(
  key: string,
  state: ModalState
): { state: ModalState; action: 'close' | 'next-tab' | 'prev-tab' | 'none' } {
  if (!state.isOpen) {
    return { state, action: 'none' };
  }

  switch (key) {
    case 'Escape':
      return { state, action: 'close' };

    default:
      return { state, action: 'none' };
  }
}

/**
 * Gets the ARIA attributes for the modal dialog
 * Architecture: ui-component-architecture.md §7 — ARIA Labels
 *
 * @param state - Current modal state
 * @returns ARIA attributes object
 */
export function getModalAriaAttributes(state: ModalState): Record<string, string> {
  if (!state.criterion) {
    return {};
  }

  return {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': `Criteria Details: ${state.criterion.number} ${state.criterion.title}`,
    'aria-describedby': 'criteria-modal-description'
  };
}

/**
 * Gets tab panel ARIA attributes
 *
 * @param tabId - Tab identifier
 * @param isActive - Whether this tab is currently active
 * @returns ARIA attributes for the tab panel
 */
export function getTabPanelAriaAttributes(
  tabId: ModalTab,
  isActive: boolean
): Record<string, string> {
  return {
    role: 'tabpanel',
    id: `tabpanel-${tabId}`,
    'aria-labelledby': `tab-${tabId}`,
    hidden: isActive ? '' : 'true'
  };
}

/**
 * Gets tab button ARIA attributes
 *
 * @param tabId - Tab identifier
 * @param isActive - Whether this tab is currently active
 * @param tabConfig - Tab configuration with label and ariaLabel
 * @returns ARIA attributes for the tab button
 */
export function getTabAriaAttributes(
  tabId: ModalTab,
  isActive: boolean,
  tabConfig: { label: string; ariaLabel: string }
): Record<string, string> {
  return {
    role: 'tab',
    id: `tab-${tabId}`,
    'aria-selected': isActive ? 'true' : 'false',
    'aria-controls': `tabpanel-${tabId}`,
    'aria-label': tabConfig.ariaLabel,
    tabindex: isActive ? '0' : '-1'
  };
}

/**
 * Determines modal size based on viewport
 * Architecture: ui-component-architecture.md §6 — Viewport-Specific Adaptations
 *
 * @param viewportWidth - Current viewport width
 * @returns Modal size configuration
 */
export function getModalSize(viewportWidth: number): {
  layout: 'full-screen' | 'full-width' | 'dialog';
  width: string;
  maxHeight: string;
} {
  if (viewportWidth < 768) {
    return { layout: 'full-screen', width: '100%', maxHeight: '100%' };
  }
  if (viewportWidth < 1024) {
    return { layout: 'full-width', width: '100%', maxHeight: '90vh' };
  }
  return { layout: 'dialog', width: '640px', maxHeight: '85vh' };
}

/**
 * Validates that a not-used exclusion has required fields
 *
 * @param reason - Reason for marking as not used
 * @param justification - Additional justification
 * @returns Validation result
 */
export function validateNotUsedForm(
  reason: string,
  justification?: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!reason || !reason.trim()) {
    errors.push('Reason is required when marking a criterion as not used');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Creates human confirmation/override data for AI score
 *
 * @param criterion - The criterion being confirmed
 * @param action - Confirm or override action
 * @param overrideLevel - Optional override maturity level
 * @param overrideReason - Required if overriding
 * @returns Confirmation data object
 */
export function createScoreConfirmation(
  criterion: Criterion,
  action: 'confirm' | 'override',
  overrideLevel?: number,
  overrideReason?: string
): {
  criterionId: string;
  action: 'confirm' | 'override';
  newStatus: CriterionStatus;
  overrideLevel?: number;
  overrideReason?: string;
  timestamp: string;
} {
  if (action === 'override' && !overrideReason) {
    throw new Error('Override reason is required when overriding AI score');
  }

  return {
    criterionId: criterion.id,
    action,
    newStatus: 'confirmed',
    overrideLevel: action === 'override' ? overrideLevel : undefined,
    overrideReason: action === 'override' ? overrideReason : undefined,
    timestamp: new Date().toISOString()
  };
}
