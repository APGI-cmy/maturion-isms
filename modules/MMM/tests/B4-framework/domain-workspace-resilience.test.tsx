import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DomainWorkspacePage from '../../../../apps/mmm/src/pages/DomainWorkspacePage';

type Scenario = {
  mpsRows: Array<Record<string, unknown>>;
  criteriaRows: Array<Record<string, unknown>>;
  failTable: string | null;
};

const { mockSupabase, configureScenario } = vi.hoisted(() => {
  let scenario: Scenario = {
    mpsRows: [],
    criteriaRows: [],
    failTable: null,
  };

  const from = vi.fn((table: string) => ({
    select: vi.fn(() => ({
      eq: (_column: string, _value: unknown) => {
        if (scenario.failTable === table) {
          return {
            order: () =>
              Promise.resolve({ data: null, error: { message: `Failed to load ${table}` } }),
          };
        }

        if (table === 'mmm_maturity_process_steps') {
          return {
            order: () => Promise.resolve({ data: scenario.mpsRows, error: null }),
          };
        }

        return {
          order: () => Promise.resolve({ data: [], error: null }),
        };
      },
      in: (_column: string, _values: unknown[]) => {
        if (scenario.failTable === table) {
          return {
            order: () =>
              Promise.resolve({ data: null, error: { message: `Failed to load ${table}` } }),
          };
        }

        if (table === 'mmm_criteria') {
          return {
            order: () => Promise.resolve({ data: scenario.criteriaRows, error: null }),
          };
        }

        return {
          order: () => Promise.resolve({ data: [], error: null }),
        };
      },
      order: () => Promise.resolve({ data: [], error: null }),
      single: () => Promise.resolve({ data: null, error: null }),
    })),
    insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  }));

  return {
    mockSupabase: {
      from,
      functions: {
        invoke: vi.fn(() => Promise.resolve({ data: { reply: '[]' }, error: null })),
      },
      auth: {
        getSession: vi.fn(() =>
          Promise.resolve({ data: { session: { access_token: 'test-token' } } }),
        ),
      },
    },
    configureScenario(next: Partial<Scenario>) {
      scenario = {
        mpsRows: [],
        criteriaRows: [],
        failTable: null,
        ...next,
      };
      from.mockClear();
    },
  };
});

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
  getEdgeInvokeHeaders: vi.fn(() =>
    Promise.resolve({ Authorization: 'Bearer test-token', apikey: 'test-key' }),
  ),
}));

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderDomainWorkspace(
  route = '/assessment/framework/domain/leadership-governance?framework_id=framework-1&domain_name=Leadership%20and%20Governance&source_domain_id=domain-1',
) {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/assessment/framework/domain/:domainId" element={<DomainWorkspacePage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('T-MMM-S6-186: Domain workspace remains stable when malformed intent payloads are returned', () => {
  beforeEach(() => {
    configureScenario({
      mpsRows: [
        {
          id: 'mps-1',
          domain_id: 'domain-1',
          name: 'Leadership Oversight',
          code: 'LG-001',
          sort_order: 1,
          intent_statement: { unexpected: 'object' },
        },
      ],
      criteriaRows: [],
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders workspace and intent modal fallback copy instead of crashing', async () => {
    renderDomainWorkspace();

    expect((await screen.findByTestId('domain-workspace-title')).textContent).toContain(
      'Leadership and Governance',
    );
    await waitFor(() => {
      expect(screen.getByTestId('domain-audit-mps-count').textContent).toContain('1 MPS');
    });
    expect(screen.queryByText('Something went wrong. Please refresh.')).toBeNull();

    fireEvent.click(screen.getByTestId('step-action-intent'));
    expect(await screen.findByTestId('intent-list')).toBeTruthy();
    expect(screen.getByText('No intent statement stored for this MPS yet.')).toBeTruthy();
  });
});
