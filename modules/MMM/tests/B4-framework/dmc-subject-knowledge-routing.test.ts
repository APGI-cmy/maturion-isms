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
    expect(src).toContain('Subject Knowledge writes are validated server-side for superuser roles');
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

  it('does not hard-disable upload actions purely on client-side role gate', () => {
    const src = readFile('apps/mmm/src/pages/DocumentManagementCenterPage.tsx');
    expect(src).toContain('disabled={uploadMutation.isPending}');
    expect(src).toContain('disabled={bulkUploadMutation.isPending}');
    expect(src).toContain('disabled={migrateLegacyMutation.isPending}');
  });

  it('provides immediate click feedback and validation errors for upload actions', () => {
    const src = readFile('apps/mmm/src/pages/DocumentManagementCenterPage.tsx');
    expect(src).toContain("setActionMessage('Upload request started...')");
    expect(src).toContain("setStatusMessage('Please choose a knowledge file before uploading.')");
    expect(src).toContain("setActionMessage('Bulk upload request started...')");
    expect(src).toContain("setStatusMessage('Please choose one or more files for bulk upload.')");
  });

  it('renders in-panel status/error feedback directly beneath DMC action buttons', () => {
    const src = readFile('apps/mmm/src/pages/DocumentManagementCenterPage.tsx');
    expect(src).toContain('{statusMessage ? (');
    expect(src).toContain("className={`alert ${statusMessage.toLowerCase().includes('failed') || statusMessage.toLowerCase().includes('error') || statusMessage.toLowerCase().includes('please choose') ? 'alert-error' : 'alert-success'}`}");
    expect(src).toContain('style={{ marginTop: \'0.5rem\' }}');
  });

  it('surfaces grouped bulk-upload failure diagnostics instead of only raw fail counts', () => {
    const src = readFile('apps/mmm/src/pages/DocumentManagementCenterPage.tsx');
    expect(src).toContain('function summarizeBulkFailures');
    expect(src).toContain("Top failure causes:");
    expect(src).toContain('cannot bulk upload subject knowledge');
  });

  it('uses diagnostic edge invocation path to surface real non-2xx response bodies', () => {
    const src = readFile('apps/mmm/src/pages/DocumentManagementCenterPage.tsx');
    expect(src).toContain('async function invokeEdgeWithDiagnostics');
    expect(src).toContain('throw new Error(`${functionName} failed: ${detail}`)');
    expect(src).toContain("'mmm-subject-knowledge-upload'");
    expect(src).toContain("'mmm-subject-knowledge-reprocess'");
  });

  it('sanitizes reprocess chunk/json payloads to prevent unicode-escape DB failures', () => {
    const shared = readFile('supabase/functions/_shared/mmm-subject-knowledge.ts');
    const reprocess = readFile('supabase/functions/mmm-subject-knowledge-reprocess/index.ts');
    expect(shared).toContain('export function sanitizeForPostgresText');
    expect(shared).toContain('export function sanitizeForPostgresJson');
    expect(reprocess).toContain('sanitizeForPostgresText');
    expect(reprocess).toContain('sanitizeForPostgresJson');
  });

  it('retries reprocess ai_knowledge insert with slim metadata on JSONB parse failures', () => {
    const reprocess = readFile('supabase/functions/mmm-subject-knowledge-reprocess/index.ts');
    expect(reprocess).toContain('invalid input syntax for type json');
    expect(reprocess).toContain("retry_mode: 'json_slim_fallback'");
  });

  it('retries completion update without kuc_classification when JSON parse fails at document update stage', () => {
    const reprocess = readFile('supabase/functions/mmm-subject-knowledge-reprocess/index.ts');
    expect(reprocess).toContain('final-document-update(json-slim-fallback)');
    expect(reprocess).toContain('kuc_classification: null');
  });
});
