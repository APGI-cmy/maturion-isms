/**
 * Report Generation Service
 * Architecture: modules/mat/02-architecture/reporting-architecture.md
 * Implements report generation in multiple formats (DOCX, PDF, JSON)
 * FRS: FR-035, FR-036
 */

import type {
  ReportData,
  ReportFormat,
  ReportSection,
  HumanScoreConfirmation,
  MaturityLevel,
  ExcelExportData,
  ExcelSheet
} from '../types/index.js';

/**
 * Generates a report for an audit
 * Architecture: Reporting Architecture
 * FRS: FR-035
 * 
 * @param params - Report generation parameters
 * @returns Generated report data
 */
export function generateReport(params: {
  audit_id: string;
  organisation_id: string;
  format: ReportFormat;
  title: string;
  generated_by: string;
  confirmations: HumanScoreConfirmation[];
  executive_summary?: string;
}): ReportData {
  const sections = buildReportSections(params.confirmations, params.executive_summary);

  return {
    id: generateUniqueId(),
    audit_id: params.audit_id,
    organisation_id: params.organisation_id,
    format: params.format,
    title: params.title,
    generated_at: new Date().toISOString(),
    generated_by: params.generated_by,
    sections,
    summary: generateSummary(params.confirmations)
  };
}

/**
 * Generates reports in all supported formats
 * FRS: FR-036
 * 
 * @param params - Report generation parameters
 * @returns Reports in DOCX, PDF, and JSON formats
 */
export function generateAllFormats(params: {
  audit_id: string;
  organisation_id: string;
  title: string;
  generated_by: string;
  confirmations: HumanScoreConfirmation[];
}): Record<ReportFormat, ReportData> {
  const formats: ReportFormat[] = ['docx', 'pdf', 'json'];
  const reports = {} as Record<ReportFormat, ReportData>;

  for (const format of formats) {
    reports[format] = generateReport({
      ...params,
      format
    });
  }

  return reports;
}

/**
 * Validates report data completeness
 * 
 * @param report - Report data to validate
 * @returns Validation result
 */
export function validateReport(report: ReportData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!report.audit_id) errors.push('Missing audit_id');
  if (!report.organisation_id) errors.push('Missing organisation_id');
  if (!report.title) errors.push('Missing title');
  if (!report.generated_by) errors.push('Missing generated_by');
  if (report.sections.length === 0) errors.push('No sections in report');
  if (!report.summary) errors.push('Missing summary');

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generates an Excel export of review table data
 * Architecture: Reporting Architecture
 * FRS: FR-037
 * 
 * @param auditId - Audit ID
 * @param confirmations - Confirmed scores
 * @returns Excel export data
 */
export function generateExcelExport(
  auditId: string,
  confirmations: HumanScoreConfirmation[]
): ExcelExportData {
  const headers = [
    'Criterion ID',
    'AI Maturity Level',
    'AI Confidence',
    'Human Confirmed Level',
    'Is Override',
    'Override Justification',
    'Confirmed By',
    'Confirmed At'
  ];

  const rows = confirmations.map(c => ({
    'Criterion ID': c.criterion_id,
    'AI Maturity Level': c.ai_score.maturity_level,
    'AI Confidence': c.ai_score.confidence,
    'Human Confirmed Level': c.confirmed_level,
    'Is Override': c.is_override,
    'Override Justification': c.override_justification,
    'Confirmed By': c.confirmed_by,
    'Confirmed At': c.confirmed_at
  }));

  return {
    audit_id: auditId,
    exported_at: new Date().toISOString(),
    sheets: [
      {
        name: 'Scores',
        headers,
        rows
      }
    ]
  };
}

/**
 * Builds report sections from confirmation data
 * 
 * @param confirmations - Confirmed scores
 * @param executiveSummary - Optional executive summary
 * @returns Array of report sections
 */
function buildReportSections(
  confirmations: HumanScoreConfirmation[],
  executiveSummary?: string
): ReportSection[] {
  const sections: ReportSection[] = [];
  let order = 1;

  sections.push({
    title: 'Executive Summary',
    content: executiveSummary || generateSummary(confirmations),
    order: order++
  });

  sections.push({
    title: 'Scoring Results',
    content: `Total criteria scored: ${confirmations.length}. ` +
      `Overrides: ${confirmations.filter(c => c.is_override).length}.`,
    order: order++
  });

  const avgLevel = confirmations.length > 0
    ? confirmations.reduce((sum, c) => sum + c.confirmed_level, 0) / confirmations.length
    : 0;

  sections.push({
    title: 'Maturity Assessment',
    content: `Average maturity level: ${avgLevel.toFixed(2)} out of 5.`,
    order: order++
  });

  return sections;
}

/**
 * Generates a text summary from confirmation data
 * 
 * @param confirmations - Confirmed scores
 * @returns Summary text
 */
function generateSummary(confirmations: HumanScoreConfirmation[]): string {
  if (confirmations.length === 0) {
    return 'No criteria have been scored yet.';
  }

  const avgLevel = confirmations.reduce((sum, c) => sum + c.confirmed_level, 0) / confirmations.length;
  const overrideCount = confirmations.filter(c => c.is_override).length;

  return `Audit covers ${confirmations.length} criteria with average maturity level ${avgLevel.toFixed(2)}. ` +
    `${overrideCount} override(s) recorded.`;
}

/**
 * Generates a unique ID for entities
 * 
 * @returns Unique identifier string
 */
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
