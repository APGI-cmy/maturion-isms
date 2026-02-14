/**
 * Regulatory Standard Alignment Service
 * Architecture: modules/mat/02-architecture/security-architecture.md §3.2
 * Implements ISO 27001 and ISO 19011 alignment evidence exportable verification
 * FR-067, TR-032
 */

/** Supported regulatory standards */
export type RegulatoryStandard = 'ISO_27001' | 'ISO_19011';

/** Alignment evidence entry */
export interface AlignmentEvidence {
  standardClause: string;
  standardName: RegulatoryStandard;
  matCriterionId: string;
  matCriterionNumber: string;
  alignmentStatus: 'aligned' | 'partial' | 'not_aligned' | 'not_applicable';
  evidence: string;
  verifiedAt: string;
}

/** Alignment report for export */
export interface AlignmentReport {
  standard: RegulatoryStandard;
  generatedAt: string;
  totalClauses: number;
  alignedCount: number;
  partialCount: number;
  notAlignedCount: number;
  notApplicableCount: number;
  alignmentPercentage: number;
  entries: AlignmentEvidence[];
  exportFormats: string[];
}

/** ISO 27001 Annex A control domains */
export const ISO_27001_DOMAINS = [
  { id: 'A.5', name: 'Information Security Policies', clauseCount: 2 },
  { id: 'A.6', name: 'Organization of Information Security', clauseCount: 5 },
  { id: 'A.7', name: 'Human Resource Security', clauseCount: 6 },
  { id: 'A.8', name: 'Asset Management', clauseCount: 10 },
  { id: 'A.9', name: 'Access Control', clauseCount: 14 },
  { id: 'A.10', name: 'Cryptography', clauseCount: 2 },
  { id: 'A.11', name: 'Physical and Environmental Security', clauseCount: 15 },
  { id: 'A.12', name: 'Operations Security', clauseCount: 14 },
  { id: 'A.13', name: 'Communications Security', clauseCount: 7 },
  { id: 'A.14', name: 'System Acquisition, Development and Maintenance', clauseCount: 13 },
  { id: 'A.15', name: 'Supplier Relationships', clauseCount: 5 },
  { id: 'A.16', name: 'Information Security Incident Management', clauseCount: 7 },
  { id: 'A.17', name: 'Business Continuity Management', clauseCount: 4 },
  { id: 'A.18', name: 'Compliance', clauseCount: 8 },
] as const;

/** ISO 19011 audit guideline sections */
export const ISO_19011_SECTIONS = [
  { id: 'S.4', name: 'Principles of Auditing', clauseCount: 7 },
  { id: 'S.5', name: 'Managing an Audit Programme', clauseCount: 6 },
  { id: 'S.6', name: 'Performing an Audit', clauseCount: 7 },
  { id: 'S.7', name: 'Competence and Evaluation of Auditors', clauseCount: 5 },
] as const;

/**
 * Creates an alignment evidence entry
 */
export function createAlignmentEvidence(params: {
  standardClause: string;
  standardName: RegulatoryStandard;
  matCriterionId: string;
  matCriterionNumber: string;
  alignmentStatus: AlignmentEvidence['alignmentStatus'];
  evidence: string;
}): AlignmentEvidence {
  return {
    ...params,
    verifiedAt: new Date().toISOString(),
  };
}

/**
 * Generates an alignment report for a specific regulatory standard
 */
export function generateAlignmentReport(
  standard: RegulatoryStandard,
  entries: AlignmentEvidence[]
): AlignmentReport {
  const standardEntries = entries.filter(e => e.standardName === standard);

  const alignedCount = standardEntries.filter(e => e.alignmentStatus === 'aligned').length;
  const partialCount = standardEntries.filter(e => e.alignmentStatus === 'partial').length;
  const notAlignedCount = standardEntries.filter(e => e.alignmentStatus === 'not_aligned').length;
  const notApplicableCount = standardEntries.filter(e => e.alignmentStatus === 'not_applicable').length;

  const applicableTotal = standardEntries.length - notApplicableCount;
  const alignmentPercentage = applicableTotal > 0
    ? Math.round(((alignedCount + partialCount * 0.5) / applicableTotal) * 100)
    : 0;

  return {
    standard,
    generatedAt: new Date().toISOString(),
    totalClauses: standardEntries.length,
    alignedCount,
    partialCount,
    notAlignedCount,
    notApplicableCount,
    alignmentPercentage,
    entries: standardEntries,
    exportFormats: ['pdf', 'csv', 'json', 'xlsx'],
  };
}

/**
 * Exports alignment report data to a structured format
 */
export function exportAlignmentData(
  report: AlignmentReport,
  format: 'json' | 'csv'
): string {
  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  }

  if (format === 'csv') {
    const header = 'Standard Clause,Standard,MAT Criterion ID,MAT Criterion Number,Alignment Status,Evidence,Verified At';
    const rows = report.entries.map(e =>
      `"${e.standardClause}","${e.standardName}","${e.matCriterionId}","${e.matCriterionNumber}","${e.alignmentStatus}","${e.evidence}","${e.verifiedAt}"`
    );
    return [header, ...rows].join('\n');
  }

  throw new Error(`Unsupported export format: ${format}`);
}

/**
 * Validates alignment completeness for a standard
 */
export function validateAlignmentCompleteness(
  standard: RegulatoryStandard,
  entries: AlignmentEvidence[]
): { complete: boolean; missingClauses: string[]; coverage: number } {
  const domains = standard === 'ISO_27001' ? ISO_27001_DOMAINS : ISO_19011_SECTIONS;
  const expectedClauses = domains.map(d => d.id);
  const coveredDomains = new Set(
    entries
      .filter(e => e.standardName === standard)
      .map(e => {
        // Extract domain from clause (e.g., "A.5.1" -> "A.5")
        const parts = e.standardClause.split('.');
        return parts.length >= 2 ? `${parts[0]}.${parts[1]}` : e.standardClause;
      })
  );

  const missingClauses = expectedClauses.filter(c => !coveredDomains.has(c));
  const coverage = expectedClauses.length > 0
    ? Math.round(((expectedClauses.length - missingClauses.length) / expectedClauses.length) * 100)
    : 0;

  return {
    complete: missingClauses.length === 0,
    missingClauses,
    coverage,
  };
}
