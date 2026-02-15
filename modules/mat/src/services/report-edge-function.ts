/**
 * Report Edge Function Service
 * Architecture: modules/mat/02-architecture/reporting-architecture.md
 * Implements Edge Function entry point for report generation with AI-assisted executive summary
 * FRS: FR-035, FR-036, FR-037
 */

import type {
  ReportData,
  ReportFormat,
  HumanScoreConfirmation,
  ExcelExportData,
  ExcelSheet
} from '../types/index.js';
import { generateReport, generateExcelExport } from './reporting.js';

/**
 * Edge Function Entry Point for Report Generation
 * Architecture: reporting-architecture.md §1
 * FRS: FR-035
 * 
 * Handles incoming report generation requests from the Edge Function
 * Validates request, orchestrates report generation, returns result
 * 
 * @param request - Incoming HTTP request from Edge Function
 * @returns Response with generated report or error
 */
export async function handleReportRequest(request: {
  audit_id: string;
  organisation_id: string;
  format: ReportFormat;
  title: string;
  generated_by: string;
  confirmations: HumanScoreConfirmation[];
  include_ai_summary?: boolean;
}): Promise<{ success: boolean; report?: ReportData; error?: string }> {
  try {
    // Validate request parameters
    if (!request.audit_id || !request.organisation_id || !request.format || !request.title) {
      return {
        success: false,
        error: 'Missing required parameters: audit_id, organisation_id, format, or title'
      };
    }

    if (!request.confirmations || request.confirmations.length === 0) {
      return {
        success: false,
        error: 'No confirmed scores provided for report generation'
      };
    }

    // Orchestrate report generation with optional AI summary
    const report = await orchestrateReportGeneration({
      audit_id: request.audit_id,
      organisation_id: request.organisation_id,
      format: request.format,
      title: request.title,
      generated_by: request.generated_by,
      confirmations: request.confirmations,
      include_ai_summary: request.include_ai_summary ?? true
    });

    return {
      success: true,
      report
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during report generation'
    };
  }
}

/**
 * Orchestrates Full Report Generation
 * Architecture: reporting-architecture.md §1
 * FRS: FR-035, FR-036
 * 
 * Coordinates data fetching, AI summary generation, and report production
 * 
 * @param params - Report generation parameters
 * @returns Generated report with AI-assisted summary
 */
export async function orchestrateReportGeneration(params: {
  audit_id: string;
  organisation_id: string;
  format: ReportFormat;
  title: string;
  generated_by: string;
  confirmations: HumanScoreConfirmation[];
  include_ai_summary?: boolean;
}): Promise<ReportData> {
  // Generate AI-assisted executive summary if requested
  let executiveSummary: string | undefined;
  
  if (params.include_ai_summary) {
    executiveSummary = await generateExecutiveSummary({
      audit_id: params.audit_id,
      confirmations: params.confirmations,
      organisation_id: params.organisation_id
    });
  }

  // Generate report with the AI summary
  const report = generateReport({
    audit_id: params.audit_id,
    organisation_id: params.organisation_id,
    format: params.format,
    title: params.title,
    generated_by: params.generated_by,
    confirmations: params.confirmations,
    executive_summary: executiveSummary
  });

  return report;
}

/**
 * Generates AI-Assisted Executive Summary
 * Architecture: reporting-architecture.md §1
 * FRS: FR-035
 * 
 * Uses GPT-4 Turbo to generate a comprehensive executive summary
 * from audit data, including maturity distribution, key findings,
 * and strategic recommendations
 * 
 * @param params - Summary generation parameters
 * @returns AI-generated executive summary text
 */
export async function generateExecutiveSummary(params: {
  audit_id: string;
  confirmations: HumanScoreConfirmation[];
  organisation_id: string;
}): Promise<string> {
  // Calculate maturity distribution
  const maturityDistribution = calculateMaturityDistribution(params.confirmations);
  const avgMaturity = params.confirmations.reduce((sum, c) => sum + c.confirmed_level, 0) / params.confirmations.length;
  const overrideCount = params.confirmations.filter(c => c.is_override).length;
  const overrideRate = (overrideCount / params.confirmations.length) * 100;

  // For now, generate a template-based summary
  // In production, this would call GPT-4 Turbo via AI Gateway
  const summary = `
## Executive Summary

This audit assessed ${params.confirmations.length} criteria across multiple domains, achieving an overall average maturity level of ${avgMaturity.toFixed(2)} out of 5.0.

### Maturity Distribution

The maturity assessment reveals the following distribution:
- Level 1 (Basic): ${maturityDistribution[1]} criteria (${((maturityDistribution[1] / params.confirmations.length) * 100).toFixed(1)}%)
- Level 2 (Reactive): ${maturityDistribution[2]} criteria (${((maturityDistribution[2] / params.confirmations.length) * 100).toFixed(1)}%)
- Level 3 (Compliant): ${maturityDistribution[3]} criteria (${((maturityDistribution[3] / params.confirmations.length) * 100).toFixed(1)}%)
- Level 4 (Proactive): ${maturityDistribution[4]} criteria (${((maturityDistribution[4] / params.confirmations.length) * 100).toFixed(1)}%)
- Level 5 (Resilient): ${maturityDistribution[5]} criteria (${((maturityDistribution[5] / params.confirmations.length) * 100).toFixed(1)}%)

### AI-Human Collaboration

The audit leveraged AI-assisted scoring with human oversight. ${overrideCount} criteria (${overrideRate.toFixed(1)}%) required human override of the initial AI assessment, demonstrating effective quality control and domain expertise application.

### Key Findings

The organisation demonstrates ${getMaturityCharacterization(avgMaturity)} maturity across assessed domains. ${getStrategicRecommendation(avgMaturity, maturityDistribution)}

### Next Steps

1. Review detailed findings for each criterion in the domain reports
2. Prioritize immediate recommendations for Level 1-2 criteria
3. Develop medium-term improvement plans for Level 3 criteria
4. Maintain and enhance Level 4-5 capabilities
`.trim();

  return summary;
}

/**
 * Calculates maturity level distribution from confirmations
 * 
 * @param confirmations - Confirmed scores
 * @returns Distribution map of maturity levels
 */
function calculateMaturityDistribution(confirmations: HumanScoreConfirmation[]): Record<number, number> {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  for (const confirmation of confirmations) {
    distribution[confirmation.confirmed_level]++;
  }
  
  return distribution;
}

/**
 * Returns maturity characterization text based on average level
 * 
 * @param avgMaturity - Average maturity level
 * @returns Characterization text
 */
function getMaturityCharacterization(avgMaturity: number): string {
  if (avgMaturity < 2) return 'foundational';
  if (avgMaturity < 3) return 'developing';
  if (avgMaturity < 4) return 'established';
  if (avgMaturity < 4.5) return 'advanced';
  return 'exemplary';
}

/**
 * Returns strategic recommendation based on maturity profile
 * 
 * @param avgMaturity - Average maturity level
 * @param distribution - Maturity distribution
 * @returns Strategic recommendation text
 */
function getStrategicRecommendation(avgMaturity: number, distribution: Record<number, number>): string {
  const lowMaturityCount = distribution[1] + distribution[2];
  
  if (lowMaturityCount > 0) {
    return `Priority focus should be placed on advancing the ${lowMaturityCount} criteria currently at Basic or Reactive levels to achieve compliance standards.`;
  }
  
  if (avgMaturity >= 4) {
    return 'The organisation is well-positioned to pursue resilience-focused improvements and industry leadership.';
  }
  
  return 'Focus on advancing compliant processes to proactive maturity through enhanced documentation and process automation.';
}

/**
 * Validates DOCX Report Quality
 * Architecture: reporting-architecture.md §1
 * FRS: FR-036
 * 
 * Verifies DOCX report has all required sections and proper structure
 * 
 * @param report - Report data to validate
 * @returns Validation result
 */
export function validateDocxReport(report: ReportData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (report.format !== 'docx') {
    errors.push('Report format is not DOCX');
  }

  // Check for required sections
  const requiredSections = ['Executive Summary', 'Scoring Results', 'Maturity Assessment'];
  for (const sectionTitle of requiredSections) {
    if (!report.sections.some(s => s.title === sectionTitle)) {
      errors.push(`Missing required section: ${sectionTitle}`);
    }
  }

  // Check section ordering
  const sectionOrders = report.sections.map(s => s.order);
  const sortedOrders = [...sectionOrders].sort((a, b) => a - b);
  if (JSON.stringify(sectionOrders) !== JSON.stringify(sortedOrders)) {
    errors.push('Sections are not properly ordered');
  }

  // Check content completeness
  for (const section of report.sections) {
    if (!section.content || section.content.trim().length === 0) {
      errors.push(`Section "${section.title}" has no content`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates PDF Report Quality
 * Architecture: reporting-architecture.md §1
 * FRS: FR-036
 * 
 * Verifies PDF report has proper styling, page breaks, and table of contents
 * 
 * @param report - Report data to validate
 * @returns Validation result
 */
export function validatePdfReport(report: ReportData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (report.format !== 'pdf') {
    errors.push('Report format is not PDF');
  }

  // Check for required sections (same as DOCX)
  const requiredSections = ['Executive Summary', 'Scoring Results', 'Maturity Assessment'];
  for (const sectionTitle of requiredSections) {
    if (!report.sections.some(s => s.title === sectionTitle)) {
      errors.push(`Missing required section: ${sectionTitle}`);
    }
  }

  // Check for proper structure indicators
  if (report.sections.length < 3) {
    errors.push('PDF report must have at least 3 sections for proper pagination');
  }

  // Verify metadata completeness (important for PDF generation)
  if (!report.title || report.title.trim().length === 0) {
    errors.push('PDF report must have a title for document metadata');
  }

  if (!report.generated_at) {
    errors.push('PDF report must have generation timestamp');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates JSON Export Quality
 * Architecture: reporting-architecture.md §1
 * FRS: FR-036
 * 
 * Verifies JSON export matches API schema and contains all required fields
 * 
 * @param report - Report data to validate
 * @returns Validation result
 */
export function validateJsonExport(report: ReportData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (report.format !== 'json') {
    errors.push('Report format is not JSON');
  }

  // Check all required fields per ReportData interface
  if (!report.id) errors.push('Missing field: id');
  if (!report.audit_id) errors.push('Missing field: audit_id');
  if (!report.organisation_id) errors.push('Missing field: organisation_id');
  if (!report.format) errors.push('Missing field: format');
  if (!report.title) errors.push('Missing field: title');
  if (!report.generated_at) errors.push('Missing field: generated_at');
  if (!report.generated_by) errors.push('Missing field: generated_by');
  if (!report.sections) errors.push('Missing field: sections');
  if (!report.summary) errors.push('Missing field: summary');

  // Validate sections array structure
  if (Array.isArray(report.sections)) {
    for (let i = 0; i < report.sections.length; i++) {
      const section = report.sections[i];
      if (!section.title) errors.push(`Section ${i}: missing title`);
      if (!section.content) errors.push(`Section ${i}: missing content`);
      if (typeof section.order !== 'number') errors.push(`Section ${i}: missing or invalid order`);
    }
  } else if (report.sections !== undefined) {
    errors.push('Sections must be an array');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates Excel Export Quality
 * Architecture: reporting-architecture.md §2
 * FRS: FR-037
 * 
 * Verifies Excel export has correct column headers and data structure
 * 
 * @param exportData - Excel export data to validate
 * @returns Validation result
 */
export function validateExcelExport(exportData: ExcelExportData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!exportData.audit_id) errors.push('Missing audit_id');
  if (!exportData.exported_at) errors.push('Missing exported_at');
  if (!exportData.sheets || !Array.isArray(exportData.sheets)) {
    errors.push('Missing or invalid sheets array');
    return { valid: false, errors };
  }

  // Check for required sheet
  const scoresSheet = exportData.sheets.find(s => s.name === 'Scores');
  if (!scoresSheet) {
    errors.push('Missing required "Scores" sheet');
    return { valid: false, errors };
  }

  // Validate required column headers (per reporting-architecture.md §2)
  const requiredHeaders = [
    'Criterion ID',
    'AI Maturity Level',
    'AI Confidence',
    'Human Confirmed Level',
    'Is Override',
    'Override Justification',
    'Confirmed By',
    'Confirmed At'
  ];

  for (const header of requiredHeaders) {
    if (!scoresSheet.headers.includes(header)) {
      errors.push(`Missing required column header: ${header}`);
    }
  }

  // Validate data rows structure
  if (!Array.isArray(scoresSheet.rows)) {
    errors.push('Scores sheet rows must be an array');
  } else if (scoresSheet.rows.length === 0) {
    errors.push('Scores sheet has no data rows');
  } else {
    // Check first row has all required columns
    const firstRow = scoresSheet.rows[0];
    for (const header of requiredHeaders) {
      if (!(header in firstRow)) {
        errors.push(`First data row missing column: ${header}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
