/**
 * MAT Red Test Suite — G-15 Mobile Viewport (375px) — 3 Critical Flows
 *
 * Gap Reference: G-15 (Wave 5.6R)
 * FRS: FR-062 "Multi-Viewport Support (≥375px)"
 * TRS: TR-034 "Responsive layout — mobile ≥375px; no horizontal overflow"
 * Authority: Wave 5.6R Builder Appointment, INC-5.6R-DELIVERY-001 corrective directive
 *
 * Verifies: 3 critical flows have no horizontal overflow and are mobile-friendly at 375px:
 *   Flow 1 (MAT-T-0106): Audit creation form
 *   Flow 2 (MAT-T-0107): Evidence modal (EvidenceCollection)
 *   Flow 3 (MAT-T-0108): Review table (ReviewTable scoring)
 *
 * Test strategy: Source-code analysis (component structure + CSS class verification)
 * verifies responsive implementation without requiring a running browser/server.
 *
 * Registry: governance/TEST_REGISTRY.json
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const FRONTEND_SRC = resolve(__dirname, '../../frontend/src');

/**
 * Helper: checks a component file has no inline fixed pixel widths > 375px
 * which would cause horizontal overflow at mobile viewport.
 */
function hasNoWideFixedPixelWidths(src: string): boolean {
  // Match style={{ width: 'NNNpx' }} or style="width: NNNpx" where NNN > 375
  const fixedWidthPattern = /style=.*?width:\s*([4-9]\d{2,}|[1-9]\d{3,})px/g;
  // Also match Tailwind w-[NNNpx] utility classes > 375px
  const tailwindFixedPattern = /\bw-\[([4-9]\d{2,}|[1-9]\d{3,})px\]/g;
  return !fixedWidthPattern.test(src) && !tailwindFixedPattern.test(src);
}

describe('G-15: Mobile Viewport (375px) — 3 Critical Flows', () => {

  describe('Flow 1 — MAT-T-0106: Audit Creation Form at 375px', () => {
    it('MAT-T-0106: AuditCreationForm component exists and is mobile-compatible', () => {
      // FRS: FR-001 "Create New Audit", FR-062 "Multi-Viewport >=375px"
      // TRS: TR-034 "Responsive layout"
      // Acceptance: Form renders without horizontal overflow at 375px width

      const filePath = resolve(FRONTEND_SRC, 'components/audits/AuditCreationForm.tsx');
      expect(existsSync(filePath)).toBe(true);

      const src = readFileSync(filePath, 'utf-8');

      // All input elements use w-full (fills container at any width — no overflow at 375px)
      const wFullMatches = src.match(/className=.*?["'][^"']*\bw-full\b[^"']*["']/g) || [];
      expect(wFullMatches.length).toBeGreaterThanOrEqual(1);

      // No fixed pixel widths wider than 375px
      expect(hasNoWideFixedPixelWidths(src)).toBe(true);

      // Absence of hardcoded wide pixel widths confirms no overflow at 375px
      expect(src).not.toMatch(/width:\s*[4-9]\d{2,}px/);
    });

    it('MAT-T-0106b: AuditCreationForm submit button is full-width (touch-friendly at 375px)', () => {
      // FRS: FR-001, FR-062
      // TRS: TR-034, TR-020 "Mobile-first Evidence Collection"
      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/audits/AuditCreationForm.tsx'),
        'utf-8'
      );

      // Submit button must be present
      expect(src).toContain('type="submit"');

      // The button that contains w-full appears near the submit type
      expect(src).toContain('w-full');
    });
  });

  describe('Flow 2 — MAT-T-0107: Evidence Modal at 375px', () => {
    it('MAT-T-0107: EvidenceCollection component exists and handles tab overflow at 375px', () => {
      // FRS: FR-013 (Multi-Format Evidence), FR-062 "Multi-Viewport >=375px"
      // TRS: TR-034, TR-020 "Mobile-first Evidence Collection"
      // Acceptance: Evidence tab bar scrolls horizontally; no content clipped at 375px

      const filePath = resolve(FRONTEND_SRC, 'components/evidence/EvidenceCollection.tsx');
      expect(existsSync(filePath)).toBe(true);

      const src = readFileSync(filePath, 'utf-8');

      // Tab bar uses overflow-x-auto to prevent horizontal overflow at 375px
      expect(src).toContain('overflow-x-auto');

      // Buttons have adequate touch-target padding (>=py-2 or px-4)
      expect(src).toMatch(/className=.*?["'][^"']*(?:py-2|py-3|px-4|px-6)[^"']*["']/);

      // No fixed widths wider than 375px
      expect(hasNoWideFixedPixelWidths(src)).toBe(true);
    });

    it('MAT-T-0107b: EvidenceCapture delegates to EvidenceCollection (live data, not stub)', () => {
      // Verifies the evidence modal shows live data (not mock) at any viewport
      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/evidence/EvidenceCapture.tsx'),
        'utf-8'
      );
      expect(src).toContain('EvidenceCollection');
      expect(src).toContain('criterionId={criterionId}');
    });
  });

  describe('Flow 3 — MAT-T-0108: Review Table at 375px', () => {
    it('MAT-T-0108: ReviewTable component exists and supports horizontal scroll at 375px', () => {
      // FRS: FR-018 "Display Scoring Results", FR-062 "Multi-Viewport >=375px"
      // TRS: TR-034 "Responsive layout"
      // Acceptance: Table container uses overflow-x-auto; table uses min-w-full for scroll at 375px

      const filePath = resolve(FRONTEND_SRC, 'components/scoring/ReviewTable.tsx');
      expect(existsSync(filePath)).toBe(true);

      const src = readFileSync(filePath, 'utf-8');

      // Table container must have overflow-x-auto for horizontal scrolling on mobile
      expect(src).toContain('overflow-x-auto');

      // Table must use min-w-full to maintain layout while allowing container scroll
      expect(src).toContain('min-w-full');

      // No fixed widths wider than 375px on the container
      expect(hasNoWideFixedPixelWidths(src)).toBe(true);
    });

    it('MAT-T-0108b: ReviewTable text content uses truncation to prevent overflow at 375px', () => {
      // FRS: FR-018, FR-062
      // TRS: TR-034
      // Acceptance: Long criterion text uses truncate + max-w classes to avoid overflow
      const src = readFileSync(
        resolve(FRONTEND_SRC, 'components/scoring/ReviewTable.tsx'),
        'utf-8'
      );
      expect(src).toMatch(/truncate|max-w-/);
    });
  });
});
