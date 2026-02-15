/**
 * MAT Test Suite — CAT-09: integration
 *
 * Build-to-Green for MAT-T-0037, MAT-T-0055, MAT-T-0056–0057 (Wave 2+3+5 scope).
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it, expect } from 'vitest';
import {
  exportForPIT,
  exportForMaturityRoadmap,
  registerPlugin,
  listPlugins,
  getSupportedPluginTypes,
  clearPluginRegistry
} from '../../src/services/integration.js';
import { scoreMaturity, confirmScore } from '../../src/services/ai-scoring.js';
import { collectTextEvidence } from '../../src/services/evidence-collection.js';
import { generateExcelExport } from '../../src/services/reporting.js';
import type { HumanScoreConfirmation } from '../../src/types/index.js';

describe('CAT-09: integration', () => {
  it('MAT-T-0037: Excel Export', () => {
    // Architecture: §3.12 Path 6 — Excel Export
    // FRS: FR-037
    // TRS: TR-043
    // Type: integration | Priority: P0
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for Excel export test',
      uploaded_by: 'user-001'
    });

    const aiScore = scoreMaturity('crit-001', [evidence], 'gpt-4-turbo-2024');
    const confirmation = confirmScore(aiScore, aiScore.maturity_level, 'user-002', 'lead_auditor');

    const excelExport = generateExcelExport('audit-001', [confirmation]);

    expect(excelExport.audit_id).toBe('audit-001');
    expect(excelExport.exported_at).toBeDefined();
    expect(excelExport.sheets).toHaveLength(1);
    expect(excelExport.sheets[0].name).toBe('Scores');
    expect(excelExport.sheets[0].headers.length).toBeGreaterThan(0);
    expect(excelExport.sheets[0].headers).toContain('Criterion ID');
    expect(excelExport.sheets[0].headers).toContain('AI Maturity Level');
    expect(excelExport.sheets[0].headers).toContain('Human Confirmed Level');
    expect(excelExport.sheets[0].rows).toHaveLength(1);
    expect(excelExport.sheets[0].rows[0]['Criterion ID']).toBe('crit-001');
  });

  it('MAT-T-0055: Extensibility and Plugin Architecture', () => {
    // Architecture: §3.4, §3.10
    // FRS: FR-055
    // TRS: TR-006
    // Type: unit | Priority: P1

    // 1. Verify supported plugin types
    const supportedTypes = getSupportedPluginTypes();
    expect(supportedTypes).toContain('evidence_type');
    expect(supportedTypes).toContain('maturity_model');
    expect(supportedTypes).toContain('ai_capability');
    expect(supportedTypes).toContain('criteria_parser');
    expect(supportedTypes).toContain('report_format');

    // 2. Register an evidence type plugin
    clearPluginRegistry();
    const evidencePlugin = registerPlugin(
      'thermal-imaging',
      'evidence_type',
      '1.0.0',
      { mime_types: ['image/tiff'], max_size_mb: 100 }
    );
    expect(evidencePlugin.id).toBeDefined();
    expect(evidencePlugin.name).toBe('thermal-imaging');
    expect(evidencePlugin.type).toBe('evidence_type');
    expect(evidencePlugin.version).toBe('1.0.0');
    expect(evidencePlugin.enabled).toBe(true);
    expect(evidencePlugin.registered_at).toBeDefined();

    // 3. Register an AI capability plugin
    const aiPlugin = registerPlugin(
      'custom-llm-scorer',
      'ai_capability',
      '2.0.0',
      { model: 'custom-model', max_tokens: 4096 }
    );
    expect(aiPlugin.type).toBe('ai_capability');

    // 4. Register a maturity model plugin
    const maturityPlugin = registerPlugin(
      'iso-27001-maturity-v2',
      'maturity_model',
      '1.0.0',
      { levels: 6 }
    );
    expect(maturityPlugin.type).toBe('maturity_model');

    // 5. List all plugins
    const allPlugins = listPlugins();
    expect(allPlugins).toHaveLength(3);

    // 6. List plugins filtered by type
    const evidencePlugins = listPlugins('evidence_type');
    expect(evidencePlugins).toHaveLength(1);
    expect(evidencePlugins[0].name).toBe('thermal-imaging');

    const aiPlugins = listPlugins('ai_capability');
    expect(aiPlugins).toHaveLength(1);
    expect(aiPlugins[0].name).toBe('custom-llm-scorer');

    // Cleanup
    clearPluginRegistry();
  });

  it('MAT-T-0056: PIT Module Integration Export', () => {
    // Architecture: §3.6, §3.11.2 [M]
    // FRS: FR-056
    // TRS: TR-018
    // Type: integration | Priority: P2
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for PIT export',
      uploaded_by: 'user-001'
    });

    const aiScore = scoreMaturity('crit-001', [evidence], 'gpt-4-turbo-2024');
    const confirmation = confirmScore(aiScore, aiScore.maturity_level, 'user-002', 'lead_auditor');

    const pitExport = exportForPIT('audit-001', 'org-001', [confirmation]);

    expect(pitExport.audit_id).toBe('audit-001');
    expect(pitExport.organisation_id).toBe('org-001');
    expect(pitExport.exported_at).toBeDefined();
    expect(pitExport.criteria_scores).toHaveLength(1);
    expect(pitExport.criteria_scores[0].criterion_id).toBe('crit-001');
    expect(pitExport.criteria_scores[0].maturity_level).toBeDefined();
    expect(pitExport.criteria_scores[0].confidence).toBeGreaterThan(0);
    expect(pitExport.summary.total_criteria).toBe(1);
    expect(pitExport.summary.scored_criteria).toBe(1);
    expect(pitExport.summary.average_maturity).toBeGreaterThan(0);
  });

  it('MAT-T-0057: Maturity Roadmap Integration Export', () => {
    // Architecture: §3.6, §3.11.2 [N]
    // FRS: FR-057
    // TRS: TR-019
    // Type: integration | Priority: P2
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for roadmap export',
      uploaded_by: 'user-001'
    });

    const aiScore = scoreMaturity('crit-001', [evidence], 'gpt-4-turbo-2024');
    const confirmation = confirmScore(aiScore, aiScore.maturity_level, 'user-002', 'lead_auditor');

    const roadmapExport = exportForMaturityRoadmap('audit-001', 'org-001', [confirmation], 5);

    expect(roadmapExport.audit_id).toBe('audit-001');
    expect(roadmapExport.organisation_id).toBe('org-001');
    expect(roadmapExport.exported_at).toBeDefined();
    expect(roadmapExport.recommendations).toBeDefined();
    expect(roadmapExport.recommendations.length).toBeGreaterThan(0);

    if (confirmation.confirmed_level < 5) {
      expect(roadmapExport.gaps.length).toBeGreaterThan(0);
      expect(roadmapExport.gaps[0].current_level).toBeDefined();
      expect(roadmapExport.gaps[0].target_level).toBe(5);
      expect(roadmapExport.gaps[0].priority).toBeDefined();
    }
  });
});
