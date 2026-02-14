/**
 * Criteria Management Service
 * Architecture: modules/mat/02-architecture/system-architecture.md §3.12 Path 2
 * Handles criteria document upload, AI parsing, validation, and approval
 */

import { createHash } from 'crypto';
import {
  Criterion,
  ParsedCriterion,
  UploadResult,
  ParseResult,
  ValidationResult,
  CoverageValidationResult,
  HallucinationFlag,
  UserRole,
  CRITERION_STATUS_TRANSITIONS,
  CriterionStatus
} from '../types/index.js';

/**
 * Upload criteria document and return metadata
 * TR-013: File upload and secure storage
 */
export function uploadCriteriaDocument(
  fileContent: Uint8Array,
  fileName: string,
  mimeType: string
): UploadResult {
  // Generate SHA-256 hash
  const hash = createHash('sha256');
  hash.update(fileContent);
  const sha256_hash = hash.digest('hex');

  // Calculate file size
  const file_size = fileContent.length;

  // Generate storage path (would be stored in actual storage in production)
  const file_path = `/uploads/criteria/${sha256_hash}/${fileName}`;

  return {
    file_path,
    sha256_hash,
    file_size
  };
}

/**
 * Parse criteria document and extract structured criteria
 * TR-037: AI-assisted parsing with validation
 */
export function parseCriteriaDocument(
  sourceText: string,
  sections: number
): ParseResult {
  // Extract criteria from source text
  const criteria: ParsedCriterion[] = [];
  
  // Simple pattern matching for criteria (e.g., "A.5.1 Title")
  // In production, this would use AI/LLM for parsing
  const criterionPattern = /([A-Z]\.\d+(?:\.\d+)?)\s+([^\n]+)\n([^\n]+(?:\n(?![A-Z]\.\d+)[^\n]+)*)/g;
  
  let match;
  while ((match = criterionPattern.exec(sourceText)) !== null) {
    const [fullMatch, number, title, description] = match;
    criteria.push({
      number: number.trim(),
      title: title.trim(),
      description: description.trim(),
      source_text: fullMatch.trim()
    });
  }

  // Validate no hallucinations
  const hallucinationResult = validateNoHallucination(criteria, sourceText);
  
  // Calculate coverage ratio
  const coverageResult = validateCoverageRule(criteria, sections);

  return {
    criteria,
    coverage_ratio: coverageResult.coverage_ratio,
    hallucination_flags: hallucinationResult.hallucinations,
    is_valid: hallucinationResult.valid && coverageResult.is_sufficient
  };
}

/**
 * Validate that parsed criteria are not hallucinated
 * TR-037: No-hallucination rule
 */
export function validateNoHallucination(
  parsedCriteria: ParsedCriterion[],
  sourceText: string
): ValidationResult {
  const hallucinations: HallucinationFlag[] = [];

  for (const criterion of parsedCriteria) {
    // Check if the criterion number and title appear in the source text
    const numberExists = sourceText.includes(criterion.number);
    const titleExists = sourceText.includes(criterion.title);
    
    if (!numberExists || !titleExists) {
      hallucinations.push({
        criterion_number: criterion.number,
        issue: `Criterion ${criterion.number} or its title not found in source document`
      });
    }

    // Check if source_text is actually in the sourceText
    if (criterion.source_text && !sourceText.includes(criterion.source_text)) {
      hallucinations.push({
        criterion_number: criterion.number,
        issue: `Source text for criterion ${criterion.number} not found in document`
      });
    }
  }

  return {
    valid: hallucinations.length === 0,
    hallucinations
  };
}

/**
 * Validate coverage ratio meets 95% threshold
 * TR-037: Coverage rule
 */
export function validateCoverageRule(
  parsedCriteria: ParsedCriterion[],
  totalSections: number
): CoverageValidationResult {
  const parsedSections = parsedCriteria.length;
  const coverage_ratio = totalSections > 0 ? parsedSections / totalSections : 0;
  const is_sufficient = coverage_ratio >= 0.95;

  return {
    coverage_ratio,
    is_sufficient
  };
}

/**
 * Approve parsed criteria (lead_auditor or admin only)
 * TR-012: Role-based approval
 */
export function approveParsedCriteria(
  criteria: ParsedCriterion[],
  mpsId: string,
  approverRole: UserRole
): Criterion[] {
  // Only lead_auditor and admin can approve criteria
  if (approverRole !== 'lead_auditor' && approverRole !== 'admin') {
    throw new Error(`Role ${approverRole} is not authorized to approve criteria`);
  }

  // Convert parsed criteria to approved criteria
  const now = new Date().toISOString();
  return criteria.map((parsed, index) => ({
    id: `criterion_${mpsId}_${index + 1}`,
    mps_id: mpsId,
    number: parsed.number,
    title: parsed.title,
    description: parsed.description,
    status: 'not_started' as CriterionStatus,
    is_approved: true,
    created_at: now,
    updated_at: now
  }));
}

/**
 * Validate criteria numbering immutability
 * TR-012: Criteria numbering cannot change after approval
 */
export function validateCriteriaNumberingImmutability(
  existing: Criterion[],
  updated: Criterion[]
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];

  // Create map of existing criteria by ID
  const existingMap = new Map(existing.map(c => [c.id, c]));

  for (const updatedCriterion of updated) {
    const existingCriterion = existingMap.get(updatedCriterion.id);
    
    if (existingCriterion && existingCriterion.number !== updatedCriterion.number) {
      violations.push(
        `Criterion ${updatedCriterion.id}: number changed from ${existingCriterion.number} to ${updatedCriterion.number}`
      );
    }
  }

  return {
    valid: violations.length === 0,
    violations
  };
}

/**
 * Mark criterion as not used with reason
 * FR-012: Not used exclusion
 */
export function markCriterionNotUsed(
  criterion: Criterion,
  reason: string
): Criterion {
  if (!reason || reason.trim() === '') {
    throw new Error('Reason is required when marking criterion as not used');
  }

  return {
    ...criterion,
    status: 'not_used',
    updated_at: new Date().toISOString()
  };
}

/**
 * Track criterion status with validation
 * FR-054: Criterion status tracking with valid transitions
 */
export function trackCriterionStatus(
  criterion: Criterion,
  newStatus: CriterionStatus
): Criterion {
  const currentStatus = criterion.status;
  const validTransitions = CRITERION_STATUS_TRANSITIONS[currentStatus];

  if (!validTransitions.includes(newStatus)) {
    throw new Error(
      `Invalid status transition from ${currentStatus} to ${newStatus}. Valid transitions: ${validTransitions.join(', ')}`
    );
  }

  return {
    ...criterion,
    status: newStatus,
    updated_at: new Date().toISOString()
  };
}
