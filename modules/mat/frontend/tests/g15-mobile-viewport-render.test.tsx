// @vitest-environment jsdom
/**
 * G-15 Mobile Viewport Component Rendering — @testing-library/react (375×812px)
 *
 * Gap Reference: G-15 (Wave 5.6R)
 * FRS: FR-062 "Multi-Viewport Support (≥375px)"
 * TRS: TR-034 "Responsive layout — mobile ≥375px; no horizontal overflow"
 * Authority: CS2 directive on PR #479 — genuine @testing-library/react component
 *            render tests with window.innerWidth = 375
 *
 * 3 critical flows tested with actual React component renders:
 *   Flow 1 (MAT-T-0106-RENDER): render(<AuditCreationForm />) at 375px
 *   Flow 2 (MAT-T-0107-RENDER): render(<EvidenceCollection />) at 375px
 *   Flow 3 (MAT-T-0108-RENDER): render(<ReviewTable />) at 375px
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { AuditCreationForm } from '../src/components/audits/AuditCreationForm';
import { EvidenceCollection } from '../src/components/evidence/EvidenceCollection';
import { ReviewTable } from '../src/components/scoring/ReviewTable';

// ── Mock all Supabase-dependent hooks ─────────────────────────────────────────

vi.mock('../src/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({ select: vi.fn(() => ({ data: [], error: null })) })),
    channel: vi.fn(() => ({ on: vi.fn(() => ({ subscribe: vi.fn() })) })),
    removeChannel: vi.fn(),
    storage: { from: vi.fn(() => ({ upload: vi.fn(), getPublicUrl: vi.fn() })) },
  },
}));

vi.mock('../src/lib/hooks/useAudits', () => ({
  useCreateAudit: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useAudits: () => ({ data: [], isLoading: false, error: null }),
  useUpdateAudit: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteAudit: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('../src/lib/hooks/useEvidence', () => ({
  useCriterionEvidence: () => ({ data: [], isLoading: false, isError: false, error: null }),
  useUploadEvidence: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteEvidence: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('../src/lib/hooks/useScoring', () => ({
  useAuditScores: () => ({
    data: [
      {
        id: 'score-1',
        criterion_number: '1.1',
        criterion_title: 'Test Criterion',
        ai_score: 3,
        evidence_count: 1,
        status: 'pending' as const,
        confidence: 0.85,
      },
    ],
    isLoading: false,
    isError: false,
    error: null,
  }),
  useConfirmScore: () => ({ mutate: vi.fn(), isPending: false }),
  useOverrideScore: () => ({ mutate: vi.fn(), isPending: false }),
}));

// Mock InterviewRecorder (uses MediaRecorder which is not available in jsdom)
vi.mock('../src/components/evidence/InterviewRecorder', () => ({
  InterviewRecorder: () => null,
}));

// ── Viewport setup ────────────────────────────────────────────────────────────

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', {
    value: 375,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(window, 'innerHeight', {
    value: 812,
    writable: true,
    configurable: true,
  });
  // jsdom does not implement scrollIntoView
  window.HTMLElement.prototype.scrollIntoView = () => {};
});

afterEach(() => {
  vi.clearAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('G-15: Mobile Viewport Component Rendering (@testing-library/react, 375×812)', () => {

  // ── Flow 1: Audit Creation Form ──────────────────────────────────────────

  describe('Flow 1 — MAT-T-0106-RENDER: AuditCreationForm at 375px', () => {
    it('MAT-T-0106-RENDER: renders at 375px and all inputs carry the w-full class (no overflow)', () => {
      // FRS: FR-001, FR-062 | TRS: TR-034
      expect(window.innerWidth).toBe(375);

      const { container } = render(<AuditCreationForm />);

      // Assert: form is rendered (the component mounted successfully)
      const form = container.querySelector('form.audit-creation-form');
      expect(form).toBeInTheDocument();

      // Assert: every text/date input has w-full class — fills container at 375px
      const inputs = container.querySelectorAll<HTMLInputElement>('input');
      expect(inputs.length).toBeGreaterThan(0);
      inputs.forEach((input) => {
        expect(input.className).toMatch(/\bw-full\b/);
      });

      // Assert: submit button has w-full class — full-width touch target on mobile
      const submitBtn = container.querySelector<HTMLButtonElement>('button[type="submit"]');
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn!.className).toMatch(/\bw-full\b/);
    });
  });

  // ── Flow 2: Evidence Modal Tab Bar ───────────────────────────────────────

  describe('Flow 2 — MAT-T-0107-RENDER: EvidenceCollection at 375px', () => {
    it('MAT-T-0107-RENDER: renders at 375px and the tab bar has overflow-x-auto class (no clipping)', () => {
      // FRS: FR-013, FR-062 | TRS: TR-034, TR-020
      expect(window.innerWidth).toBe(375);

      const { container } = render(<EvidenceCollection criterionId="test-criterion-id" />);

      // Assert: evidence-collection component rendered
      const root = container.querySelector('.evidence-collection');
      expect(root).toBeInTheDocument();

      // Assert: tab bar container has overflow-x-auto class (enables horizontal
      // scroll at 375px instead of clipping the tab buttons)
      const tabBar = container.querySelector('.overflow-x-auto');
      expect(tabBar).toBeInTheDocument();
      expect(tabBar!.className).toMatch(/\boverflow-x-auto\b/);

      // Assert: tab buttons have whitespace-nowrap (they scroll, not wrap)
      const tabButtons = container.querySelectorAll<HTMLButtonElement>(
        '.overflow-x-auto button'
      );
      expect(tabButtons.length).toBeGreaterThan(0);
      tabButtons.forEach((btn) => {
        expect(btn.className).toMatch(/\bwhitespace-nowrap\b/);
      });
    });
  });

  // ── Flow 3: Review Table ─────────────────────────────────────────────────

  describe('Flow 3 — MAT-T-0108-RENDER: ReviewTable at 375px', () => {
    it('MAT-T-0108-RENDER: renders at 375px and the table wrapper has overflow-x-auto class (horizontal scroll)', () => {
      // FRS: FR-018, FR-062 | TRS: TR-034
      expect(window.innerWidth).toBe(375);

      const { container } = render(<ReviewTable auditId="test-audit-id" />);

      // Assert: table rendered in DOM
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();

      // Assert: table wrapper has overflow-x-auto (enables horizontal scroll
      // so the table doesn't overflow the 375px viewport)
      const wrapper = container.querySelector('.overflow-x-auto');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper!.className).toMatch(/\boverflow-x-auto\b/);

      // Assert: table itself has min-w-full (fills wrapper; container scrolls)
      expect(table!.className).toMatch(/\bmin-w-full\b/);
    });
  });
});
