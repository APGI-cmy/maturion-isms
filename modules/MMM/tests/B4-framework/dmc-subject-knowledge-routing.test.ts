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

describe('T-MMM-DMC-001: Upload tab rerouted to DMC while preserving framework upload flow', () => {
  it('registers /dmc protected route in App.tsx', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain("import DocumentManagementCenterPage from '@/pages/DocumentManagementCenterPage';");
    expect(src).toContain('path="/dmc" element={<DocumentManagementCenterPage />}');
    expect(src).toContain('AuthenticatedAppShell');
  });

  it('retains framework mode route /frameworks/upload for criteria generation flow', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('path="/frameworks/upload" element={<FrameworkUploadPage />}');
  });

  it('uses DMC as top navigation destination in MMM shell pages', () => {
    const files = [
      'apps/mmm/src/pages/DashboardPage.tsx',
      'apps/mmm/src/pages/FrameworkListPage.tsx',
      'apps/mmm/src/pages/FrameworkUploadPage.tsx',
      'apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx',
      'apps/mmm/src/pages/DomainWorkspacePage.tsx',
    ];

    files.forEach((file) => {
      const src = readFile(file);
      expect(src).toContain('to="/dmc">DMC</Link>');
    });
  });

  it('keeps framework upload CTA on Frameworks page for mode selection workflow', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkListPage.tsx');
    expect(src).toContain('to="/frameworks/upload">Upload Framework Source</Link>');
  });
});

describe('T-MMM-DMC-002: Subject Knowledge DMC behavior is wired to legacy/AIMC document layer', () => {
  it('creates DMC page with subject-knowledge controls', () => {
    const src = readFile('apps/mmm/src/pages/DocumentManagementCenterPage.tsx');
    expect(src).toContain('Document Management Centre (DMC)');
    expect(src).toContain('Upload Subject Knowledge');
    expect(src).toContain('Subject Knowledge management is restricted to superuser admins');
  });

  it('loads document inventory through canonical subject-knowledge list function', () => {
    const src = readFile('apps/mmm/src/pages/DocumentManagementCenterPage.tsx');
    expect(src).toContain("'mmm-subject-knowledge-list'");
    expect(src).toContain('documents: Array.isArray(payload.documents) ? payload.documents : []');
  });

  it('uploads into canonical subject-knowledge storage and queues AIMC/KUC ingestion', () => {
    const src = readFile('apps/mmm/src/pages/DocumentManagementCenterPage.tsx');
    expect(src).toContain(".storage.from(bucket).upload(storagePath, selectedFile");
    expect(src).toContain("const bucket = 'mmm-subject-knowledge'");
    expect(src).toContain("'mmm-subject-knowledge-upload'");
    expect(src).toContain("'mmm-subject-knowledge-reprocess'");
  });
});
