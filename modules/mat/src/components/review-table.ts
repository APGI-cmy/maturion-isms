/**
 * Review Table Component
 * Architecture: modules/mat/02-architecture/ui-component-architecture.md
 * Implements pre-report structured review table with editing capability
 * FRS: FR-033, FR-034
 */

import type {
  ReviewTableRow,
  ReviewTableConfig,
  MaturityLevel,
  CriterionStatus,
  HumanScoreConfirmation
} from '../types/index.js';

/**
 * Default review table configuration
 */
const DEFAULT_CONFIG: ReviewTableConfig = {
  sortable: true,
  filterable: true,
  editable: true,
  columns: [
    'criterion_number',
    'criterion_title',
    'domain',
    'mps',
    'ai_maturity_level',
    'ai_confidence',
    'human_confirmed_level',
    'is_override',
    'status',
    'evidence_count'
  ]
};

/**
 * Creates a review table configuration
 * FRS: FR-033
 * 
 * @param overrides - Optional configuration overrides
 * @returns Review table configuration
 */
export function createReviewTableConfig(overrides?: Partial<ReviewTableConfig>): ReviewTableConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}

/**
 * Creates a review table row from criterion and scoring data
 * FRS: FR-033
 * 
 * @param params - Row data parameters
 * @returns Review table row
 */
export function createReviewTableRow(params: {
  criterion_id: string;
  criterion_number: string;
  criterion_title: string;
  domain: string;
  mps: string;
  ai_maturity_level?: MaturityLevel;
  ai_confidence?: number;
  confirmation?: HumanScoreConfirmation;
  status: CriterionStatus;
  evidence_count: number;
}): ReviewTableRow {
  return {
    criterion_id: params.criterion_id,
    criterion_number: params.criterion_number,
    criterion_title: params.criterion_title,
    domain: params.domain,
    mps: params.mps,
    ai_maturity_level: params.ai_maturity_level || null,
    ai_confidence: params.ai_confidence || null,
    human_confirmed_level: params.confirmation?.confirmed_level || null,
    is_override: params.confirmation?.is_override || false,
    status: params.status,
    evidence_count: params.evidence_count
  };
}

/**
 * Sorts review table rows by a column
 * FRS: FR-033
 * 
 * @param rows - Array of review table rows
 * @param column - Column to sort by
 * @param ascending - Sort direction
 * @returns Sorted copy of rows
 */
export function sortReviewTable(
  rows: ReviewTableRow[],
  column: keyof ReviewTableRow,
  ascending: boolean = true
): ReviewTableRow[] {
  return [...rows].sort((a, b) => {
    const aVal = a[column];
    const bVal = b[column];
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return ascending ? 1 : -1;
    if (bVal === null) return ascending ? -1 : 1;
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
}

/**
 * Filters review table rows by status
 * FRS: FR-033
 * 
 * @param rows - Array of review table rows
 * @param status - Status to filter by
 * @returns Filtered rows
 */
export function filterReviewTableByStatus(
  rows: ReviewTableRow[],
  status: CriterionStatus
): ReviewTableRow[] {
  return rows.filter(r => r.status === status);
}

/**
 * Updates a review table row with a human confirmed level (editing)
 * FRS: FR-034
 * 
 * @param row - Review table row to update
 * @param confirmedLevel - New human-confirmed maturity level
 * @returns Updated row
 */
export function editReviewTableRow(
  row: ReviewTableRow,
  confirmedLevel: MaturityLevel
): ReviewTableRow {
  const isOverride = row.ai_maturity_level !== null && confirmedLevel !== row.ai_maturity_level;
  return {
    ...row,
    human_confirmed_level: confirmedLevel,
    is_override: isOverride,
    status: 'confirmed'
  };
}

/**
 * Validates review table completeness
 * FRS: FR-033
 * 
 * @param rows - Array of review table rows
 * @returns Validation result
 */
export function validateReviewTableCompleteness(rows: ReviewTableRow[]): {
  complete: boolean;
  total: number;
  confirmed: number;
  pending: number;
} {
  const confirmed = rows.filter(r => r.status === 'confirmed').length;
  const pending = rows.filter(r => r.status !== 'confirmed' && r.status !== 'not_used').length;
  return {
    complete: pending === 0,
    total: rows.length,
    confirmed,
    pending
  };
}
