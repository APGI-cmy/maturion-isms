import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DomainWorkspacePage from '../../../../apps/mmm/src/pages/DomainWorkspacePage';

type Scenario = {
  domainRows: Array<{
    id: string;
    name: string;
    code: string;
    sort_order: number;
    framework_id: string;
  }>;
  mpsRows: Array<{
    id: string;
    domain_id: string;
    name: string;
    code: string;
    sort_order: number;
    intent_statement: string | null;
  }>;
  criteriaRows: Array<{
    id: string;
    mps_id: string;
    name: string;
    code: string;
    sort_order: number;
  }>;
  pendingTable: string | null;
  failTable: string | null;
};

const { mockSupabase, configureScenario, supabaseCalls } = vi.hoisted(() => {
  const calls: Array<Record<string, unknown>> = [];
  let scenario: Scenario = {
    domainRows: [],
    mpsRows: [],
    criteriaRows: [],
    pendingTable: null,
    failTable: null,
  };

  const queryResult = (table: string, rows: unknown[]) => {
    if (scenario.pendingTable === table) {
      // Intentionally never resolve: this keeps the query in-flight so the
      // loading state remains visible for assertion.
      return new Promise<never>(() => undefined);
    }

    if (scenario.failTable === table) {
      return Promise.resolve({
        data: null,
        error: { message: `Failed to load ${table}` },
      });
    }

    return Promise.resolve({
      data: rows,
      error: null,
    });
  };

  const from = vi.fn((table: string) => ({
    select: vi.fn(() => ({
      eq: (column: string, value: unknown) => {
        calls.push({ table, operator: 'eq', column, value });

        if (table === 'mmm_maturity_process_steps' && column === 'domain_id') {
          return {
            order: () => queryResult(table, scenario.mpsRows),
          };
        }

        if (table === 'mmm_domains' && column === 'framework_id') {
          return {
            order: () => queryResult(table, scenario.domainRows),
          };
        }

        return {
          order: () => queryResult(table, []),
          single: () => queryResult(table, []),
        };
      },
      in: (column: string, value: unknown[]) => {
        calls.push({ table, operator: 'in', column, value });

        if (table === 'mmm_criteria' && column === 'mps_id') {
          return {
            order: () => queryResult(table, scenario.criteriaRows),
          };
        }

        return {
          order: () => queryResult(table, []),
        };
      },
      order: () => queryResult(table, []),
      single: () => queryResult(table, []),
    })),
  }));

  const invoke = vi.fn(async (...args: unknown[]) => {
    const options = (args.length > 1 ? args[1] : args[0]) as { body?: Record<string, unknown> } | undefined;
    const context = String(options?.body?.context ?? '');

    if (context === 'MPS generation') {
      return {
        data: {
          response: JSON.stringify([
            {
              code: 'AI-001',
              name: 'AI generated ownership',
              intent_statement: 'Define accountabilities for generated controls.',
            },
            {
              code: 'AI-002',
              name: 'AI generated review',
              intent_statement: 'Set evidence review cadence for generated controls.',
            },
          ]),
        },
        error: null,
      };
    }

    if (context === 'Intent generation') {
      return {
        data: {
          response:
            'AI-generated intent statement for this MPS, pending reviewer approval.',
        },
        error: null,
      };
    }

    if (context === 'Criteria generation') {
      return {
        data: {
          response: JSON.stringify([
            { statement: 'A documented generated criterion exists for this MPS.' },
            { statement: 'A tracked generated evidence review record exists for this MPS.' },
          ]),
        },
        error: null,
      };
    }

    return { data: {}, error: null };
  });

  return {
    mockSupabase: { from, functions: { invoke } },
    configureScenario(next: Partial<Scenario>) {
      scenario = {
        domainRows: [],
        mpsRows: [],
        criteriaRows: [],
        pendingTable: null,
        failTable: null,
        ...next,
      };
      calls.length = 0;
      from.mockClear();
    },
    supabaseCalls: calls,
  };
});

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderDomainWorkspace(
  route = '/assessment/framework/domain/process-integrity?framework_id=framework-1&domain_name=Process%20Integrity&source_domain_id=domain-1',
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

const baseMpsRows: Scenario['mpsRows'] = [
  {
    id: 'mps-1',
    domain_id: 'domain-1',
    name: 'Workflow Ownership',
    code: 'PI-001',
    sort_order: 1,
    intent_statement: 'Establish process ownership and approval accountability.',
  },
  {
    id: 'mps-2',
    domain_id: 'domain-1',
    name: 'Workflow Review',
    code: 'PI-002',
    sort_order: 2,
    intent_statement: 'Review workflow execution evidence on a scheduled cadence.',
  },
];

const baseCriteriaRows: Scenario['criteriaRows'] = [
  {
    id: 'criterion-1',
    mps_id: 'mps-1',
    name: 'Workflow owner formally assigned',
    code: 'PI-001-C001',
    sort_order: 1,
  },
  {
    id: 'criterion-2',
    mps_id: 'mps-1',
    name: 'Approval checkpoints documented',
    code: 'PI-001-C002',
    sort_order: 2,
  },
  {
    id: 'criterion-3',
    mps_id: 'mps-2',
    name: 'Review cadence tracked',
    code: 'PI-002-C001',
    sort_order: 1,
  },
];

const canonicalDomainRows: Scenario['domainRows'] = [
  {
    id: 'domain-canonical',
    name: 'Leadership and Governance',
    code: 'leadership-governance',
    sort_order: 1,
    framework_id: 'framework-1',
  },
];

describe('T-MMM-S6-190: Domain workflow renders real MMM data', () => {
  beforeEach(() => {
    configureScenario({
      domainRows: canonicalDomainRows,
      mpsRows: baseMpsRows,
      criteriaRows: baseCriteriaRows,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('opens the routed domain workspace and preserves framework back-navigation context', async () => {
    renderDomainWorkspace();

    expect((await screen.findByTestId('domain-workspace-title')).textContent).toContain('Process Integrity');
    await waitFor(() => {
      expect(screen.getByTestId('domain-audit-mps-count').textContent).toContain('2 MPS');
    });
    expect(
      supabaseCalls.some(
        (call) =>
          call.table === 'mmm_maturity_process_steps' &&
          call.operator === 'eq' &&
          call.column === 'domain_id' &&
          call.value === 'domain-1',
      ),
    ).toBe(true);

    expect(
      screen.getByRole('link', { name: 'Back to Framework Workspace' }).getAttribute('href'),
    ).toBe('/assessment/framework?framework_id=framework-1');
  });

  it('loads and renders MPS rows with code, name, sort order, and intent linkage', async () => {
    renderDomainWorkspace();

    fireEvent.click(await screen.findByTestId('step-action-mps'));

    const list = await screen.findByTestId('mps-selection-list');
    expect(within(list).getByText('PI-001')).toBeTruthy();
    expect(within(list).getByText(/Workflow Ownership/)).toBeTruthy();
    expect(within(list).getByText(/Sort order: 1/)).toBeTruthy();
    expect(within(list).getByText(/Establish process ownership and approval accountability/)).toBeTruthy();
  });

  it('a canonical card route without source_domain_id shows intentional setup state and preserves back-navigation', async () => {
    configureScenario({
      domainRows: [],
      mpsRows: [],
      criteriaRows: [],
    });

    renderDomainWorkspace(
      '/assessment/framework/domain/leadership-governance?framework_id=framework-1&domain_name=Leadership%20and%20Governance',
    );

    expect((await screen.findByTestId('domain-audit-setup-state')).textContent).toContain(
      'No mapped MMM domain row exists for this canonical card yet.',
    );
    expect(screen.queryByTestId('domain-audit-error')).toBeNull();
    expect(
      screen.getByRole('link', { name: 'Back to Framework Workspace' }).getAttribute('href'),
    ).toBe('/assessment/framework?framework_id=framework-1');
  });

  it('a canonical card route without source_domain_id resolves via framework_id + domain_name and loads rows', async () => {
    const canonicalMpsRows: Scenario['mpsRows'] = [
      {
        id: 'canonical-mps-1',
        domain_id: 'domain-canonical',
        name: 'Governance oversight',
        code: 'LG-001',
        sort_order: 1,
        intent_statement: 'Maintain governance accountability.',
      },
    ];
    const canonicalCriteriaRows: Scenario['criteriaRows'] = [
      {
        id: 'canonical-criterion-1',
        mps_id: 'canonical-mps-1',
        name: 'Oversight evidence maintained',
        code: 'LG-001-C001',
        sort_order: 1,
      },
    ];

    configureScenario({
      domainRows: canonicalDomainRows,
      mpsRows: canonicalMpsRows,
      criteriaRows: canonicalCriteriaRows,
    });

    renderDomainWorkspace(
      '/assessment/framework/domain/leadership-governance?framework_id=framework-1&domain_name=Leadership%20and%20Governance',
    );

    await waitFor(() => {
      expect(screen.getByTestId('domain-audit-mps-count').textContent).toContain('1 MPS');
    });

    expect(
      supabaseCalls.some(
        (call) =>
          call.table === 'mmm_maturity_process_steps' &&
          call.operator === 'eq' &&
          call.column === 'domain_id' &&
          call.value === 'domain-canonical',
      ),
    ).toBe(true);
  });

  it('renders intent statements from mmm_maturity_process_steps intent_statement values', async () => {
    renderDomainWorkspace();

    fireEvent.click(await screen.findByTestId('step-action-intent'));

    const list = await screen.findByTestId('intent-list');
    expect(within(list).getByText(/PI-001/)).toBeTruthy();
    expect(within(list).getByText(/Review workflow execution evidence on a scheduled cadence/)).toBeTruthy();
  });

  it('loads criteria rows and groups them under their related MPS entries', async () => {
    renderDomainWorkspace();

    fireEvent.click(await screen.findByTestId('step-action-criteria'));

    const groups = await screen.findAllByTestId('criteria-group');
    expect(groups).toHaveLength(2);
    expect(within(groups[0]).getByText(/PI-001 — Workflow Ownership/)).toBeTruthy();
    expect(within(groups[0]).getByText(/PI-001-C001/)).toBeTruthy();
    expect(within(groups[0]).getByText(/Approval checkpoints documented/)).toBeTruthy();
    expect(within(groups[1]).getByText(/PI-002-C001/)).toBeTruthy();
  });

  it('shows loading feedback while MMM data is still in flight', async () => {
    configureScenario({
      mpsRows: [],
      criteriaRows: [],
      pendingTable: 'mmm_maturity_process_steps',
    });

    renderDomainWorkspace();

    expect((await screen.findByTestId('domain-audit-loading')).textContent).toContain(
      'Loading domain workflow data…',
    );

    fireEvent.click(screen.getByTestId('step-action-mps'));
    expect(screen.getByTestId('mps-selection-loading').textContent).toContain('Loading MPS data…');
  });

  it('shows error feedback when MMM data loading fails', async () => {
    configureScenario({
      mpsRows: [],
      criteriaRows: [],
      failTable: 'mmm_maturity_process_steps',
    });

    renderDomainWorkspace();

    expect((await screen.findByTestId('domain-audit-error')).textContent).toContain(
      'Failed to load mmm_maturity_process_steps',
    );

    fireEvent.click(screen.getByTestId('step-action-mps'));
    expect((await screen.findByTestId('mps-selection-error')).textContent).toContain(
      'Failed to load mmm_maturity_process_steps',
    );
  });

  it('wires generation and acceptance flow for MPS, intent, and criteria in the domain workspace', async () => {
    renderDomainWorkspace();

    fireEvent.click(await screen.findByTestId('step-action-mps'));
    fireEvent.click(await screen.findByTestId('generate-mps-action'));
    expect(await screen.findByTestId('generated-mps-list')).toBeTruthy();
    fireEvent.click(screen.getByTestId('accept-generated-mps'));

    await waitFor(() => {
      expect(screen.getByTestId('domain-audit-mps-count').textContent).toContain('4 MPS');
    });

    fireEvent.click(screen.getByTestId('step-action-intent'));
    fireEvent.click(await screen.findByTestId('generate-intent-mps-1'));
    fireEvent.click(await screen.findByTestId('approve-intent-mps-1'));
    expect(screen.getAllByText(/AI-generated intent statement/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByTestId('step-action-criteria'));
    fireEvent.click(await screen.findByTestId('generate-criteria-mps-1'));
    fireEvent.click(await screen.findByTestId('accept-generated-criteria-mps-1'));
    await waitFor(() => {
      expect(screen.getByTestId('domain-audit-criteria-count').textContent).toContain('5 criteria');
    });
  });
});
