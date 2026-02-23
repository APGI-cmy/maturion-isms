/**
 * MAT Frontend QA-to-Red Test Suite — CAT-FE-07: Evidence Collection UI
 *
 * QA-to-Red: Tests define expected frontend behavior for evidence collection.
 * Status at creation: RED — frontend evidence collection UI not yet implemented.
 *
 * FRS: FR-016 (Document Upload), FR-017 (Video), FR-018 (Concurrent Upload),
 *      FR-019 (Evidence Review), FR-020 (Criterion Interview),
 *      FR-021 (Audit-Level Interview), FR-022 (Interview Governance),
 *      FR-027 (Photo Capture — Wave 2R G-07), FR-028 (Interview Recording — Wave 2R G-10)
 * TRS: TR-033, TR-047, TR-015, TR-027, TR-028
 * Registry: governance/TEST_REGISTRY.json
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const SRC_DIR = resolve(__dirname, '..', 'src');
const PUBLIC_DIR = resolve(__dirname, '..', 'public');

describe('CAT-FE-07: evidence collection UI (FR-016 to FR-022)', () => {
  it('MAT-FE-T-040: Document upload component for evidence exists', () => {
    // FRS: FR-016
    // TRS: TR-047, TR-015
    // Type: structural | Priority: P0
    // Status: RED — document evidence UI not yet created

    const candidates = [
      resolve(SRC_DIR, 'components/evidence/DocumentUpload.tsx'),
      resolve(SRC_DIR, 'components/evidence/FileUpload.tsx'),
      resolve(SRC_DIR, 'components/evidence/EvidenceCapture.tsx'),
    ];
    const exists = candidates.some((p) => existsSync(p));
    expect(exists).toBe(true);
  });

  it('MAT-FE-T-041: Video upload component exists', () => {
    // FRS: FR-017
    // TRS: TR-047
    // Type: structural | Priority: P1
    // Status: RED — video upload UI not yet created

    const candidates = [
      resolve(SRC_DIR, 'components/evidence/VideoUpload.tsx'),
      resolve(SRC_DIR, 'components/evidence/VideoCapture.tsx'),
      resolve(SRC_DIR, 'components/evidence/EvidenceCapture.tsx'),
    ];
    const exists = candidates.some((p) => existsSync(p));
    expect(exists).toBe(true);
  });

  it('MAT-FE-T-042: Upload progress indicator for concurrent uploads', () => {
    // FRS: FR-018
    // TRS: TR-047
    // Type: structural | Priority: P0
    // Status: RED — upload progress not yet implemented

    const candidates = [
      resolve(SRC_DIR, 'components/evidence/UploadProgress.tsx'),
      resolve(SRC_DIR, 'components/evidence/FileUploadProgress.tsx'),
      resolve(SRC_DIR, 'components/UploadProgress.tsx'),
    ];
    const exists = candidates.some((p) => existsSync(p));
    expect(exists).toBe(true);
  });

  it('MAT-FE-T-043: Evidence review panel/page exists', () => {
    // FRS: FR-019
    // TRS: TR-047
    // Type: structural | Priority: P0
    // Status: RED — evidence review UI not yet created

    const candidates = [
      resolve(SRC_DIR, 'components/evidence/EvidenceReview.tsx'),
      resolve(SRC_DIR, 'components/evidence/EvidenceList.tsx'),
      resolve(SRC_DIR, 'pages/evidence/review.tsx'),
    ];
    const exists = candidates.some((p) => existsSync(p));
    expect(exists).toBe(true);
  });

  it('MAT-FE-T-044: Interview recording UI component exists', () => {
    // FRS: FR-020 (criterion-level), FR-021 (audit-level)
    // TRS: TR-047
    // Type: structural | Priority: P0
    // Status: RED — interview UI not yet created

    const candidates = [
      resolve(SRC_DIR, 'components/evidence/InterviewRecorder.tsx'),
      resolve(SRC_DIR, 'components/interview/InterviewRecorder.tsx'),
      resolve(SRC_DIR, 'components/InterviewRecorder.tsx'),
    ];
    const exists = candidates.some((p) => existsSync(p));
    expect(exists).toBe(true);
  });

  it('MAT-FE-T-045: Interview governance rules display', () => {
    // FRS: FR-022 — consent, roles, disclosure rules
    // TRS: TR-047
    // Type: structural | Priority: P0
    // Status: RED — governance rules UI not yet implemented

    const candidates = [
      resolve(SRC_DIR, 'components/evidence/InterviewGovernance.tsx'),
      resolve(SRC_DIR, 'components/interview/GovernanceRules.tsx'),
      resolve(SRC_DIR, 'components/interview/ConsentForm.tsx'),
    ];
    const exists = candidates.some((p) => existsSync(p));
    expect(exists).toBe(true);
  });

  // ── Wave 2R Remediation Tests ──────────────────────────────────────────────

  it('MAT-FE-T-046-2R: PhotoCapture component uses capture="environment" for mobile (G-07)', () => {
    // Wave 2R G-07: Photo capture stub replaced with working implementation
    // FRS: FR-027 | TRS: TR-027
    // Type: structural | Priority: P0
    const photoCaptureFile = resolve(SRC_DIR, 'components/evidence/PhotoCapture.tsx');
    expect(existsSync(photoCaptureFile)).toBe(true);
    const source = readFileSync(photoCaptureFile, 'utf8');
    // Must use file input with accept="image/*" for cross-platform support
    expect(source).toContain('accept="image/*"');
    // Must include capture attribute for mobile native camera (G-07 corrective action)
    expect(source).toContain('capture=');
    // Must include getUserMedia for desktop fallback
    expect(source).toContain('getUserMedia');
  });

  it('MAT-FE-T-047-2R: InterviewRecorder has consent fields: name, role, checkbox (G-10)', () => {
    // Wave 2R G-10: Interview recording stub replaced with consent-gated implementation
    // FRS: FR-028 | TRS: TR-028
    // Type: structural | Priority: P0
    const interviewFile = resolve(SRC_DIR, 'components/evidence/InterviewRecorder.tsx');
    expect(existsSync(interviewFile)).toBe(true);
    const source = readFileSync(interviewFile, 'utf8');
    // Must have interviewee name field
    expect(source).toContain('interviewee-name');
    // Must have role field
    expect(source).toContain('interviewee-role');
    // Must have consent checkbox
    expect(source).toContain('consent-checkbox');
    // Must gate recording behind consent (canStartRecording / disabled pattern)
    expect(source).toContain('canStartRecording');
    // Must use MediaRecorder
    expect(source).toContain('MediaRecorder');
  });

  it('MAT-FE-T-048-2R: EvidenceCollection includes Interview tab (G-10)', () => {
    // Wave 2R G-10: EvidenceCollection wires InterviewRecorder as a tab
    // FRS: FR-028 | TRS: TR-028
    // Type: structural | Priority: P0
    const collectionFile = resolve(SRC_DIR, 'components/evidence/EvidenceCollection.tsx');
    expect(existsSync(collectionFile)).toBe(true);
    const source = readFileSync(collectionFile, 'utf8');
    expect(source).toContain("'interview'");
    expect(source).toContain('InterviewRecorder');
  });

  it('MAT-FE-T-049-2R: Service worker registers background sync for offline evidence (G-16)', () => {
    // Wave 2R G-16: Offline mode — service worker handles sync event
    // FRS: FR-060, FR-061, FR-062 | TRS: TR-060, TR-061, TR-062
    // Type: structural | Priority: P0
    const swFile = resolve(PUBLIC_DIR, 'sw.js');
    expect(existsSync(swFile)).toBe(true);
    const source = readFileSync(swFile, 'utf8');
    // Must listen for background sync events
    expect(source).toContain("addEventListener('sync'");
    // Must handle the evidence-sync tag
    expect(source).toContain('evidence-sync');
    // Must open IndexedDB for offline queue
    expect(source).toContain('indexedDB.open');
  });
});

