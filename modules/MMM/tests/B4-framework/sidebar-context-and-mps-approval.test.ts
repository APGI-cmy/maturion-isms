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

  it('Maturity Roadmap sidebar route resolves to frameworks list to avoid missing framework_id dead-end', () => {
    const src = readFile('apps/mmm/src/components/AuthenticatedAppShell.tsx');
    expect(src).toContain("{ to: '/frameworks', label: 'Maturity Roadmap' }");
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
