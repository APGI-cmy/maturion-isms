import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(__dirname, '../../../..');

function readFile(relPath: string): string {
  const abs = resolve(ROOT, relPath);
  if (!existsSync(abs)) {
    throw new Error(`File not found: ${relPath}`);
  }
  return readFileSync(abs, 'utf-8');
}

describe('T-MMM-S6-188: Protected routes use unified sidebar shell', () => {
  it('App.tsx nests protected routes in AuthenticatedAppShell', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('AuthenticatedAppShell');
    expect(src).toContain('<Route element={<ProtectedRoute><AuthenticatedAppShell /></ProtectedRoute>}>');
    expect(src).toContain('path="/organisation-context"');
  });

  it('Maturity Roadmap sidebar route is separated from frameworks list route', () => {
    const shell = readFile('apps/mmm/src/components/AuthenticatedAppShell.tsx');
    const app = readFile('apps/mmm/src/App.tsx');
    expect(shell).toContain("{ to: '/maturity-roadmap', label: 'Maturity Roadmap' }");
    expect(app).toContain('path="/maturity-roadmap" element={<MaturityRoadmapPage />}');
  });
});

describe('T-MMM-S6-189: Organisation Context page replaces onboarding rerun for edits', () => {
  it('OrganisationContextPage exists and reads/writes mmm_organisations context', () => {
    const src = readFile('apps/mmm/src/pages/OrganisationContextPage.tsx');
    expect(src).toContain("'mmm-organisation-context'");
    expect(src).toContain('context');
    expect(src).toContain('Save Context');
  });
});

describe('T-MMM-S6-190: DMC supports legacy migration trigger and telemetry', () => {
  it('DMC invokes mmm-subject-knowledge-migrate-legacy and renders run counts', () => {
    const src = readFile('apps/mmm/src/pages/DocumentManagementCenterPage.tsx');
    expect(src).toContain("'mmm-subject-knowledge-migrate-legacy'");
    expect(src).toContain('migration_run_id');
    expect(src).toContain('scanned_count');
    expect(src).toContain('deduped_count');
  });
});

describe('T-MMM-S6-191: Domain cards expose mini-dashboard status model', () => {
  it('handoff page renders criteria, approval, readiness, and maturity labels', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('Criteria Status');
    expect(src).toContain('Approval Status');
    expect(src).toContain('Implementation Readiness');
    expect(src).toContain('Domain Maturity');
  });
});

describe('T-MMM-S6-192/T-MMM-S6-193: MPS L1 and domain L2 approval workflows wired', () => {
  it('MPS modal invokes mmm-mps-approval-action', () => {
    const src = readFile('apps/mmm/src/components/assessment/MPSSelectionModal.tsx');
    expect(src).toContain("'mmm-mps-approval-action'");
  });

  it('DomainAuditBuilder invokes mmm-domain-approval-action and comment endpoint', () => {
    const src = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
    expect(src).toContain("'mmm-domain-approval-action'");
    expect(src).toContain("'mmm-domain-approval-comment'");
  });
});

describe('T-MMM-S6-194: Sidebar width remains compact on desktop', () => {
  it('shell CSS defines a compact fixed sidebar width', () => {
    const src = readFile('apps/mmm/src/index.css');
    expect(src).toContain('grid-template-columns: var(--mmm-sidebar-width, 148px) 8px minmax(0, 1fr);');
  });
});

describe('T-MMM-S6-195: Sidebar width is manually adjustable by user', () => {
  it('shell exposes drag-resize handle and persists width choice', () => {
    const src = readFile('apps/mmm/src/components/AuthenticatedAppShell.tsx');
    expect(src).toContain('mmm.sidebar.width');
    expect(src).toContain('Resize sidebar');
    expect(src).toContain('onMouseDown={onResizeHandleMouseDown}');
    expect(src).toContain('role="separator"');
    expect(src).toContain('--mmm-sidebar-width');
  });
});

describe('T-MMM-S6-207: MPS L1 action naming and submit transition clarity', () => {
  it('MPS modal uses Edit label and exposes Submit MPS Set action', () => {
    const src = readFile('apps/mmm/src/components/assessment/MPSSelectionModal.tsx');
    expect(src).toContain('Edit');
    expect(src).toContain('Edit Content');
    expect(src).toContain('Submit MPS Set');
    expect(src).toContain("'mmm-domain-approval-action'");
  });
});

describe('T-MMM-S6-208: MPS edit captures user learning preference', () => {
  it('MPS modal prompts for memory consent and records USER_PREFERENCE_CAPTURE', () => {
    const src = readFile('apps/mmm/src/components/assessment/MPSSelectionModal.tsx');
    expect(src).toContain('Do you want me to include this in my memory system?');
    expect(src).toContain('USER_PREFERENCE_CAPTURE');
    expect(src).toContain('Preference recorded. Maturion will apply this style in future proposals.');
  });
});

describe('T-MMM-S6-211: Organisation Context uploads mode-source documents', () => {
  it('OrganisationContextPage writes customer source documents as organisation_context ledger rows', () => {
    const src = readFile('apps/mmm/src/pages/OrganisationContextPage.tsx');
    expect(src).toContain('Organisation Source Documents');
    expect(src).toContain('Upload Organisation Source');
    expect(src).toContain("scope_type: 'organisation_context'");
    expect(src).toContain('source_mode:${sourceMode}');
    expect(src).toContain("'mmm_subject_knowledge_documents'");
    expect(src).toContain("'mmm-subject-knowledge'");
  });
});

describe('T-MMM-S6-214: Hybrid source-origin labelling is supported in MPS UI', () => {
  it('MPS modal renders source_origin badges for uploaded and AI-added material', () => {
    const modal = readFile('apps/mmm/src/components/assessment/MPSSelectionModal.tsx');
    const css = readFile('apps/mmm/src/index.css');
    expect(modal).toContain('source_origin');
    expect(modal).toContain('source-origin--');
    expect(modal).toContain('Uploaded source');
    expect(modal).toContain('AI completion');
    expect(css).toContain('.source-origin--uploaded_source');
    expect(css).toContain('.source-origin--ai_completion');
    expect(css).toContain('.source-origin--subject_knowledge');
  });
});

describe('T-MMM-S6-215: MPS modal displays consulted source resources', () => {
  it('MPS modal surfaces resources consulted toast after generation', () => {
    const src = readFile('apps/mmm/src/components/assessment/MPSSelectionModal.tsx');
    expect(src).toContain('mps-consulted-resources-toast');
    expect(src).toContain('Resources consulted:');
    expect(src).toContain('lastConsultedResources');
  });
});

describe('T-MMM-S6-217: MPS modal displays memory capture evidence for domain edits', () => {
  it('MPS modal surfaces memory evidence toast with USER_PREFERENCE_CAPTURE count', () => {
    const src = readFile('apps/mmm/src/components/assessment/MPSSelectionModal.tsx');
    expect(src).toContain('mps-memory-evidence-toast');
    expect(src).toContain('Memory capture evidence:');
    expect(src).toContain("eq('action_type', 'USER_PREFERENCE_CAPTURE')");
    expect(src).toContain("eq('context_type', 'MPS_EDIT')");
  });
});
