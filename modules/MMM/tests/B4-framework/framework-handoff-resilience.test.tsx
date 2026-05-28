import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AssessmentFrameworkHandoffPage from '../../../../apps/mmm/src/pages/AssessmentFrameworkHandoffPage';

type Scenario = {
  frameworkRow: Record<string, unknown> | null;
  domainRows: Array<Record<string, unknown>>;
  mpsRows: Array<Record<string, unknown>>;
  criteriaRows: Array<Record<string, unknown>>;
};

const { mockSupabase, configureScenario } = vi.hoisted(() => {
  let scenario: Scenario = {
    frameworkRow: {
      id: 'framework-1',
      name: 'Framework Workspace',
      status: 'REVIEW',
    },
    domainRows: [],
    mpsRows: [],
    criteriaRows: [],
  };

  const from = vi.fn((table: string) => ({
    select: vi.fn(() => ({
      eq: (column: string, value: unknown) => {
        if (table === 'mmm_frameworks' && column === 'id') {
          return {
            single: () =>
              Promise.resolve({
                data: scenario.frameworkRow,
                error: null,
              }),
          };
        }

        if (table === 'mmm_domains' && column === 'framework_id') {
          return {
            order: () =>
              Promise.resolve({
                data: scenario.domainRows,
                error: null,
              }),
          };
        }

        return {
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => Promise.resolve({ data: [], error: null }),
        };
      },
      in: (column: string, values: unknown[]) => {
        if (table === 'mmm_maturity_process_steps' && column === 'domain_id') {
          return Promise.resolve({
            data: scenario.mpsRows.filter((row) => values.includes(row.domain_id)),
            error: null,
          });
        }

        if (table === 'mmm_criteria' && column === 'mps_id') {
          return Promise.resolve({
            data: scenario.criteriaRows.filter((row) => values.includes(row.mps_id)),
            error: null,
          });
        }

        return Promise.resolve({ data: [], error: null });
      },
      order: () => Promise.resolve({ data: [], error: null }),
      single: () => Promise.resolve({ data: null, error: null }),
    })),
    insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
  }));

  return {
    mockSupabase: { from },
    configureScenario(next: Partial<Scenario>) {
      scenario = {
        frameworkRow: {
          id: 'framework-1',
          name: 'Framework Workspace',
          status: 'REVIEW',
        },
        domainRows: [],
        mpsRows: [],
        criteriaRows: [],
        ...next,
      };
      from.mockClear();
    },
  };
});

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderHandoff(
  route = '/assessment/framework?framework_id=framework-1',
) {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/assessment/framework" element={<AssessmentFrameworkHandoffPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('T-MMM-S6-185: Compile handoff workspace is resilient to malformed framework/domain payload values', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders canonical workspace and placeholders instead of crashing when non-string payload fields are received', async () => {
    configureScenario({
      frameworkRow: {
        id: 'framework-1',
        name: { raw: 'Unexpected object value' },
        status: { state: 'REVIEW' },
      },
      domainRows: [
        {
          id: 'domain-1',
          name: { value: 'Leadership and Governance' },
          code: { value: 'D001' },
          sort_order: '1',
        },
      ],
      mpsRows: [{ id: 'mps-1', domain_id: 'domain-1' }],
      criteriaRows: [{ id: 'criteria-1', mps_id: 'mps-1' }],
    });

    renderHandoff();

    expect(await screen.findByTestId('handoff-workspace')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getAllByTestId('domain-card')).toHaveLength(5);
    });

    expect(screen.getByTestId('handoff-framework-name').textContent).toContain('Untitled Framework');
    expect(screen.getByTestId('handoff-framework-status').textContent).toContain('Unknown');
    expect(screen.queryByText('Something went wrong. Please refresh.')).toBeNull();
  });
});
