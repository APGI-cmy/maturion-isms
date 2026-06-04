import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DomainWorkspacePage from '../../../../apps/mmm/src/pages/DomainWorkspacePage';
import { MPSSelectionModal } from '../../../../apps/mmm/src/components/assessment/MPSSelectionModal';
import { IntentCreator } from '../../../../apps/mmm/src/components/assessment/IntentCreator';
import { CriteriaManagement } from '../../../../apps/mmm/src/components/assessment/CriteriaManagement';

type Scenario = {
  domainRows: Array<{
    id: string;
    name: string;
    code: string;
    sort_order: number;
    framework_id?: string;
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
    maturity_level_target?: number | null;
  }>;
  levelDescriptorRows: Array<{
    id: string;
    criterion_id: string;
    level: number;
    descriptor_text: string;
  }>;
  knowledgeRows: Array<{
    content: string;
    source_document_name: string;
    metadata?: Record<string, unknown>;
    chunk_index: number;
  }>;
  pendingTable: string | null;
  failTable: string | null;
};

const { mockSupabase, configureScenario, supabaseCalls, configureAIResponse, configureAIError, mockInsert, mockUpdate, mockUpsert } = vi.hoisted(() => {
  const calls: Array<Record<string, unknown>> = [];
  let scenario: Scenario = {
    domainRows: [],
    mpsRows: [],
    criteriaRows: [],
    levelDescriptorRows: [],
    knowledgeRows: [],
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

  const insert = vi.fn(() => Promise.resolve({ data: [], error: null }));
  const upsert = vi.fn(() => Promise.resolve({ data: [], error: null }));
  const update = vi.fn(() => ({
    eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
  }));

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

        if (table === 'mmm_level_descriptors' && column === 'criterion_id') {
          return {
            order: () => queryResult(table, scenario.levelDescriptorRows),
          };
        }

        return {
          order: () => queryResult(table, []),
        };
      },
      order: () => queryResult(table, table === 'ai_knowledge' ? scenario.knowledgeRows : []),
      single: () => queryResult(table, []),
    })),
    insert,
    upsert,
    update,
  }));

  let aiInvokeResult: { data: unknown; error: unknown } = {
    data: { reply: '[]' },
    error: null,
  };
  const functionsInvoke = vi.fn((functionName: string) => {
    if (functionName === 'mmm-level-descriptor-save') {
      return Promise.resolve({
        data: {
          ok: true,
          saved_count: 5,
          changed_count: 1,
          learning_event_recorded: true,
        },
        error: null,
      });
    }
    return Promise.resolve(aiInvokeResult);
  });

  return {
    mockSupabase: {
      from,
      functions: { invoke: functionsInvoke },
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
        levelDescriptorRows: [],
        knowledgeRows: [],
        pendingTable: null,
        failTable: null,
        ...next,
      };
      calls.length = 0;
      from.mockClear();
      insert.mockClear();
      upsert.mockClear();
      update.mockClear();
      functionsInvoke.mockClear();
      aiInvokeResult = { data: { reply: '[]' }, error: null };
    },
    configureAIResponse(result: unknown) {
      aiInvokeResult = { data: result, error: null };
    },
    configureAIError() {
      aiInvokeResult = { data: null, error: { message: 'AI generation failed' } };
    },
    supabaseCalls: calls,
    mockInsert: insert,
    mockUpdate: update,
    mockUpsert: upsert,
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
      queries: {
        retry: false,
      },
      mutations: {
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

const baseMpsRowsForModal = [
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
    intent_statement: null,
  },
];

function renderMPSSelectionModal(props?: Partial<React.ComponentProps<typeof MPSSelectionModal>>) {
  const qc = createQueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <MPSSelectionModal
        domainId="domain-1"
        domainName="Process Integrity"
        open={true}
        mpsRows={baseMpsRowsForModal}
        isLoading={false}
        errorMessage={null}
        onClose={vi.fn()}
        {...props}
      />
    </QueryClientProvider>,
  );
}

function renderIntentCreator(props?: Partial<React.ComponentProps<typeof IntentCreator>>) {
  const qc = createQueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <IntentCreator
        domainId="domain-1"
        domainName="Process Integrity"
        open={true}
        mpsRows={baseMpsRowsForModal}
        isLoading={false}
        errorMessage={null}
        onClose={vi.fn()}
        {...props}
      />
    </QueryClientProvider>,
  );
}

function renderCriteriaManagement(props?: Partial<React.ComponentProps<typeof CriteriaManagement>>) {
  const qc = createQueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <CriteriaManagement
        domainId="domain-1"
        domainName="Process Integrity"
        open={true}
        mpsRows={baseMpsRowsForModal}
        criteriaByMps={{}}
        levelDescriptorsByCriterion={{}}
        isLoading={false}
        errorMessage={null}
        onClose={vi.fn()}
        {...props}
      />
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

describe('T-MMM-S6-190: Domain workflow renders real MMM data', () => {
  beforeEach(() => {
    configureScenario({
      domainRows: [],
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

    await waitFor(() => {
      expect(screen.getByTestId('step-action-mps').hasAttribute('disabled')).toBe(false);
    });
    fireEvent.click(screen.getByTestId('step-action-mps'));

    const list = await screen.findByTestId('mps-selection-list');
    expect(within(list).getByText('PI-001')).toBeTruthy();
    expect(within(list).getByText(/Workflow Ownership/)).toBeTruthy();
    expect(within(list).getByText(/Sort order: 1/)).toBeTruthy();
    expect(within(list).getByText(/Establish process ownership and approval accountability/)).toBeTruthy();
  });

  it('renders intent statements from mmm_maturity_process_steps intent_statement values', async () => {
    renderDomainWorkspace();

    await waitFor(() => {
      expect(screen.getByTestId('step-action-intent').hasAttribute('disabled')).toBe(false);
    });
    fireEvent.click(screen.getByTestId('step-action-intent'));

    const list = await screen.findByTestId('intent-list');
    expect(within(list).getByText(/PI-001/)).toBeTruthy();
    expect(within(list).getByText(/Review workflow execution evidence on a scheduled cadence/)).toBeTruthy();
  });

  it('loads criteria rows and groups them under their related MPS entries', async () => {
    renderDomainWorkspace();

    await waitFor(() => {
      expect(screen.getByTestId('step-action-criteria').hasAttribute('disabled')).toBe(false);
    });
    fireEvent.click(screen.getByTestId('step-action-criteria'));

    const groups = await screen.findAllByTestId('criteria-group');
    expect(groups).toHaveLength(2);
    expect(within(groups[0]).getByText(/PI-001 — Workflow Ownership/)).toBeTruthy();
    expect(within(groups[0]).getByDisplayValue('PI-001-C001')).toBeTruthy();
    expect(within(groups[0]).getByDisplayValue('Approval checkpoints documented')).toBeTruthy();
    expect(within(groups[1]).getByDisplayValue('PI-002-C001')).toBeTruthy();
  });

  it('criteria step card renders a per-MPS criteria dashboard and reopens as view/edit', async () => {
    renderDomainWorkspace();

    await waitFor(() => {
      expect(screen.getByTestId('step-action-criteria').textContent).toContain('View / Edit Criteria (3)');
    });
    expect(screen.getByTestId('criteria-step-dashboard')).toBeTruthy();
    const dashboardItems = screen.getAllByTestId('criteria-step-dashboard-item');
    expect(dashboardItems).toHaveLength(2);
    expect(dashboardItems[0].textContent).toContain('PI-001');
    expect(dashboardItems[0].textContent).toContain('2');
    expect(dashboardItems[1].textContent).toContain('PI-002');
    expect(dashboardItems[1].textContent).toContain('1');
  });

  it('saved criteria can be edited from the criteria modal', async () => {
    renderDomainWorkspace();

    await waitFor(() => {
      expect(screen.getByTestId('step-action-criteria').hasAttribute('disabled')).toBe(false);
    });
    fireEvent.click(screen.getByTestId('step-action-criteria'));

    const input = await screen.findByTestId('criteria-name-input-criterion-1') as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: 'Workflow owner formally assigned and reviewed' } });
    fireEvent.click(screen.getByTestId('criteria-save-btn-criterion-1'));

    await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
  });

  it('criteria cards generate and save five maturity level descriptors', async () => {
    renderDomainWorkspace();

    await waitFor(() => {
      expect(screen.getByTestId('step-action-criteria').hasAttribute('disabled')).toBe(false);
    });
    fireEvent.click(screen.getByTestId('step-action-criteria'));
    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-1'));

    const descriptorGrid = await screen.findByTestId('level-descriptor-grid-criterion-1');
    expect(within(descriptorGrid).getByText('Basic')).toBeTruthy();
    expect(within(descriptorGrid).getByText('Resilient')).toBeTruthy();
    const basicDescriptor = screen.getByTestId('descriptor-input-criterion-1-1') as HTMLTextAreaElement;
    expect(basicDescriptor.value).not.toContain('Basic: Approval checkpoints documented');
    expect(basicDescriptor.value).not.toMatch(/\bmust be approved\b/i);
    expect(basicDescriptor.value).toMatch(/^Evidence for/i);
    expect(basicDescriptor.value).toMatch(/absent|informal|dependent|weak/i);
    expect(basicDescriptor.readOnly).toBe(true);

    fireEvent.click(screen.getByTestId('edit-descriptor-btn-criterion-1-1'));
    expect(basicDescriptor.readOnly).toBe(false);
    fireEvent.change(basicDescriptor, {
      target: {
        value:
          'Evidence for policy approval and display is weak, person-dependent, and not retained in a repeatable audit trail.',
      },
    });
    fireEvent.click(screen.getByTestId('edit-descriptor-btn-criterion-1-1'));
    fireEvent.click(screen.getByTestId('save-descriptors-btn-criterion-1'));

    await waitFor(() => expect(mockSupabase.functions.invoke).toHaveBeenCalledWith(
      'mmm-level-descriptor-save',
      expect.objectContaining({
        body: expect.objectContaining({
          criterion_id: 'criterion-1',
          edited_levels: [1],
        }),
      }),
    ));
    const saveStatus = await screen.findByTestId('descriptor-save-status-criterion-1');
    expect(saveStatus.textContent).toMatch(/Saved 5 maturity descriptors.*Recorded 1 descriptor edit/i);
  });

  it('descriptor generation stays green when AI refinement returns non-2xx', async () => {
    configureScenario({
      mpsRows: baseMpsRows,
      criteriaRows: baseCriteriaRows,
      knowledgeRows: [
        {
          source_document_name: 'LDCS_Maturity_Model_Descriptor_Guideline_Approved_Methodology_Reference.md',
          metadata: { role: 'criteria_source' },
          chunk_index: 0,
          content:
            'Operational Maturity Model Descriptor Guideline. Critical authoring rule: do not copy the criterion into each level. Basic Reactive Compliant Proactive Resilient descriptors reconstruct operating states.',
        },
      ],
    });
    configureAIError();
    renderDomainWorkspace();

    await waitFor(() => {
      expect(screen.getByTestId('step-action-criteria').hasAttribute('disabled')).toBe(false);
    });
    fireEvent.click(screen.getByTestId('step-action-criteria'));
    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-1'));

    const descriptorGrid = await screen.findByTestId('level-descriptor-grid-criterion-1');
    expect(within(descriptorGrid).getByText('Basic')).toBeTruthy();
    expect(within(descriptorGrid).getByText('Resilient')).toBeTruthy();
    const basicDescriptor = screen.getByTestId('descriptor-input-criterion-1-1') as HTMLTextAreaElement;
    expect(basicDescriptor.value).not.toMatch(/\bmust\b|\bshall\b/i);
    expect(basicDescriptor.value).toMatch(/^Evidence for/i);
    const status = await screen.findByText(/Maturity descriptors created from the approved methodology reference/i);
    expect(status.textContent).not.toContain('AI refinement');
    expect(status.textContent).not.toContain('AIMC');
    expect(status.textContent).not.toContain('404');
    expect(status.textContent).not.toContain('Used methodology fallback');
    expect(status.textContent).not.toContain('non-2xx');
    expect(mockSupabase.functions.invoke).toHaveBeenCalled();
  });

  it('shows loading feedback while MMM data is still in flight', async () => {
    configureScenario({
      domainRows: [],
      mpsRows: [],
      criteriaRows: [],
      pendingTable: 'mmm_maturity_process_steps',
    });

    renderDomainWorkspace();

    expect((await screen.findByTestId('domain-audit-loading')).textContent).toContain(
      'Loading domain workflow data…',
    );

    await waitFor(() => {
      expect(screen.getByTestId('step-action-mps').hasAttribute('disabled')).toBe(false);
    });
    fireEvent.click(screen.getByTestId('step-action-mps'));
    expect(screen.getByTestId('mps-selection-loading').textContent).toContain('Loading MPS data…');
  });

  it('shows error feedback when MMM data loading fails', async () => {
    configureScenario({
      domainRows: [],
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

  it('shows an intentional setup state for canonical routes without source_domain_id when no domain row exists', async () => {
    configureScenario({
      domainRows: [],
      mpsRows: [],
      criteriaRows: [],
    });

    renderDomainWorkspace(
      '/assessment/framework/domain/protection?framework_id=framework-1&domain_name=Protection',
    );

    expect((await screen.findByTestId('domain-workspace-title')).textContent).toContain('Protection');
    expect((await screen.findByTestId('domain-audit-setup-state')).textContent).toContain(
      'No compiled domain record exists for this canonical route yet.',
    );
    expect(screen.queryByTestId('domain-audit-error')).toBeNull();
    expect(
      screen.getByRole('link', { name: 'Back to Framework Workspace' }).getAttribute('href'),
    ).toBe('/assessment/framework?framework_id=framework-1');
  });
});

// ---------------------------------------------------------------------------
// T-MMM-S6-AI-001: MPS AI generation lifecycle
// ---------------------------------------------------------------------------

describe('T-MMM-S6-AI-001: AI generation lifecycle — MPS generation', () => {
  beforeEach(() => {
    configureScenario({ mpsRows: baseMpsRowsForModal, criteriaRows: [] });
  });
  afterEach(() => { cleanup(); });

  it('"Generate MPS with AI" button renders in MPSSelectionModal', () => {
    renderMPSSelectionModal({ mpsRows: [] });
    expect(screen.getByTestId('generate-mps-btn')).toBeTruthy();
  });

  it('clicking generate shows loading state', async () => {
    // Never resolve the AI call to hold loading state
    const { getByTestId } = renderMPSSelectionModal({ mpsRows: [] });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockSupabase.functions.invoke as any).mockImplementationOnce(() => new Promise(() => undefined));
    fireEvent.click(getByTestId('generate-mps-btn'));
    expect(await screen.findByTestId('mps-generation-loading')).toBeTruthy();
  });

  it('successful generation renders AI-proposed MPS list', async () => {
    configureAIResponse({
      reply: JSON.stringify([
        { number: 1, title: 'Access Control', intent: 'Ensure access is governed', rationale: 'Security baseline' },
        { number: 2, title: 'Audit Logging', intent: 'Log all audit events', rationale: 'Traceability' },
      ]),
    });
    renderMPSSelectionModal({ mpsRows: [] });
    fireEvent.click(screen.getByTestId('generate-mps-btn'));
    await waitFor(() => expect(screen.getByTestId('generated-mps-list')).toBeTruthy());
    const items = screen.getAllByTestId('generated-mps-item');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('Access Control');
    expect(items[1].textContent).toContain('Audit Logging');
    // Verify intent and rationale are also visible on generated MPS cards (legacy parity)
    expect(items[0].textContent).toContain('Ensure access is governed');
    expect(items[0].textContent).toContain('Security baseline');
    expect(items[1].textContent).toContain('Log all audit events');
    expect(items[1].textContent).toContain('Traceability');
  });

  it('"Accept All" selects all generated items', async () => {
    configureAIResponse({
      reply: JSON.stringify([
        { number: 1, title: 'Item One', intent: 'Intent one', rationale: 'Rationale' },
        { number: 2, title: 'Item Two', intent: 'Intent two', rationale: 'Rationale' },
      ]),
    });
    renderMPSSelectionModal({ mpsRows: [] });
    fireEvent.click(screen.getByTestId('generate-mps-btn'));
    await screen.findByTestId('generated-mps-list');
    // Deselect first item
    fireEvent.click(screen.getByTestId('mps-select-1'));
    // Accept all
    fireEvent.click(screen.getByTestId('accept-all-mps-btn'));
    const cb1 = screen.getByTestId('mps-select-1') as HTMLInputElement;
    const cb2 = screen.getByTestId('mps-select-2') as HTMLInputElement;
    expect(cb1.checked).toBe(true);
    expect(cb2.checked).toBe(true);
  });

  it('individual item toggle deselects and re-selects', async () => {
    configureAIResponse({
      reply: JSON.stringify([
        { number: 1, title: 'Item One', intent: 'Intent one', rationale: 'Rationale' },
      ]),
    });
    renderMPSSelectionModal({ mpsRows: [] });
    fireEvent.click(screen.getByTestId('generate-mps-btn'));
    await screen.findByTestId('generated-mps-list');
    const cb = screen.getByTestId('mps-select-1') as HTMLInputElement;
    expect(cb.checked).toBe(true);
    fireEvent.click(cb);
    expect((screen.getByTestId('mps-select-1') as HTMLInputElement).checked).toBe(false);
    fireEvent.click(screen.getByTestId('mps-select-1'));
    expect((screen.getByTestId('mps-select-1') as HTMLInputElement).checked).toBe(true);
  });

  it('inline edit updates title before confirm', async () => {
    configureAIResponse({
      reply: JSON.stringify([
        { number: 1, title: 'Original Title', intent: 'Original Intent', rationale: 'R' },
      ]),
    });
    renderMPSSelectionModal({ mpsRows: [] });
    fireEvent.click(screen.getByTestId('generate-mps-btn'));
    await screen.findByTestId('generated-mps-list');
    fireEvent.click(screen.getByTestId('mps-edit-btn-1'));
    const titleInput = screen.getByTestId('mps-title-input-1') as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'Edited Title' } });
    expect(titleInput.value).toBe('Edited Title');
  });

  it('confirm selection calls insert and invalidates cache', async () => {
    configureAIResponse({
      reply: JSON.stringify([
        { number: 1, title: 'Access Control', intent: 'Govern access', rationale: 'Security' },
      ]),
    });
    renderMPSSelectionModal({ mpsRows: [] });
    fireEvent.click(screen.getByTestId('generate-mps-btn'));
    await screen.findByTestId('confirm-mps-selection-btn');
    fireEvent.click(screen.getByTestId('confirm-mps-selection-btn'));
    await waitFor(() => expect(mockInsert).toHaveBeenCalled());
    const insertArg = mockInsert.mock.calls[0][0] as Array<Record<string, unknown>>;
    expect(insertArg[0]).toMatchObject({ domain_id: 'domain-1', name: 'Access Control' });
  });

  it('AI function error shows non-blocking fallback warning with generated legacy pack', async () => {
    configureAIError();
    renderMPSSelectionModal({ mpsRows: [] });
    fireEvent.click(screen.getByTestId('generate-mps-btn'));
    await waitFor(() => expect(screen.getByTestId('mps-generation-warning')).toBeTruthy());
    expect(screen.queryByTestId('mps-generation-error')).toBeNull();
    expect(screen.getByTestId('generated-mps-list')).toBeTruthy();
  });

  it('closing modal resets generation state', async () => {
    configureAIResponse({
      reply: JSON.stringify([
        { number: 1, title: 'Access Control', intent: 'Govern access', rationale: 'Security' },
      ]),
    });
    const onClose = vi.fn();
    renderMPSSelectionModal({ mpsRows: [], onClose });
    fireEvent.click(screen.getByTestId('generate-mps-btn'));
    await screen.findByTestId('generated-mps-list');
    // Close via Cancel button
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// T-MMM-S6-AI-002: Intent AI generation lifecycle
// ---------------------------------------------------------------------------

describe('T-MMM-S6-AI-002: AI generation lifecycle — intent generation', () => {
  beforeEach(() => {
    configureScenario({ mpsRows: baseMpsRowsForModal, criteriaRows: [] });
  });
  afterEach(() => { cleanup(); });

  it('per-MPS "Generate intent" button renders in IntentCreator', () => {
    renderIntentCreator();
    expect(screen.getByTestId('generate-intent-btn-mps-1')).toBeTruthy();
    // mps-2 has no intent so shows "Generate intent"
    expect(screen.getByTestId('generate-intent-btn-mps-2')).toBeTruthy();
  });

  it('clicking generate for a specific MPS shows per-MPS loading', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockSupabase.functions.invoke as any).mockImplementationOnce(() => new Promise(() => undefined));
    renderIntentCreator();
    fireEvent.click(screen.getByTestId('generate-intent-btn-mps-2'));
    expect(await screen.findByTestId('intent-generation-loading-mps-2')).toBeTruthy();
  });

  it('successful generation renders proposed intent text', async () => {
    configureAIResponse({ reply: 'Ensure all workflows are properly owned and governed.' });
    renderIntentCreator();
    fireEvent.click(screen.getByTestId('generate-intent-btn-mps-2'));
    await waitFor(() => expect(screen.getByTestId('intent-generated-mps-2')).toBeTruthy());
    const textarea = screen.getByTestId('intent-textarea-mps-2') as HTMLTextAreaElement;
    expect(textarea.value).toContain('Ensure all workflows are properly owned and governed.');
  });

  it('accept saves via mutation update and removes generated state', async () => {
    configureAIResponse({ reply: 'Govern all workflows.' });
    renderIntentCreator();
    fireEvent.click(screen.getByTestId('generate-intent-btn-mps-2'));
    await screen.findByTestId('intent-accept-btn-mps-2');
    fireEvent.click(screen.getByTestId('intent-accept-btn-mps-2'));
    await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
  });

  it('editable textarea allows text change before accept', async () => {
    configureAIResponse({ reply: 'Original intent text.' });
    renderIntentCreator();
    fireEvent.click(screen.getByTestId('generate-intent-btn-mps-2'));
    await screen.findByTestId('intent-textarea-mps-2');
    fireEvent.change(screen.getByTestId('intent-textarea-mps-2'), {
      target: { value: 'Edited intent text.' },
    });
    expect((screen.getByTestId('intent-textarea-mps-2') as HTMLTextAreaElement).value).toBe(
      'Edited intent text.',
    );
  });

  it('reject clears proposed intent for that MPS', async () => {
    configureAIResponse({ reply: 'Some generated intent.' });
    renderIntentCreator();
    fireEvent.click(screen.getByTestId('generate-intent-btn-mps-2'));
    await screen.findByTestId('intent-reject-btn-mps-2');
    fireEvent.click(screen.getByTestId('intent-reject-btn-mps-2'));
    await waitFor(() =>
      expect(screen.queryByTestId('intent-generated-mps-2')).toBeNull(),
    );
    // Generate button should reappear
    expect(screen.getByTestId('generate-intent-btn-mps-2')).toBeTruthy();
  });

  it('AI error shows per-MPS error state', async () => {
    configureAIError();
    renderIntentCreator();
    fireEvent.click(screen.getByTestId('generate-intent-btn-mps-2'));
    await waitFor(() =>
      expect(screen.getByTestId('intent-generation-error-mps-2')).toBeTruthy(),
    );
  });

  it('closing IntentCreator resets all generation states', async () => {
    configureAIResponse({ reply: 'Some generated intent.' });
    const onClose = vi.fn();
    renderIntentCreator({ onClose });
    fireEvent.click(screen.getByTestId('generate-intent-btn-mps-2'));
    await screen.findByTestId('intent-generated-mps-2');
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// T-MMM-S6-AI-003: Criteria AI generation lifecycle
// ---------------------------------------------------------------------------

describe('T-MMM-S6-AI-003: AI generation lifecycle — criteria generation', () => {
  beforeEach(() => {
    configureScenario({ mpsRows: baseMpsRowsForModal, criteriaRows: [] });
  });
  afterEach(() => { cleanup(); });

  it('per-MPS "Generate criteria" button renders in CriteriaManagement', () => {
    renderCriteriaManagement();
    expect(screen.getByTestId('generate-criteria-btn-mps-1')).toBeTruthy();
    expect(screen.getByTestId('generate-criteria-btn-mps-2')).toBeTruthy();
  });

  it('clicking generate shows per-MPS loading', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockSupabase.functions.invoke as any).mockImplementationOnce(() => new Promise(() => undefined));
    renderCriteriaManagement();
    fireEvent.click(screen.getByTestId('generate-criteria-btn-mps-1'));
    expect(await screen.findByTestId('criteria-generation-loading-mps-1')).toBeTruthy();
  });

  it('generated criteria list renders with accept/reject checkboxes per item', async () => {
    configureAIResponse({
      reply: JSON.stringify([
        { code: 'PI-001-C001', statement: 'Workflow owner formally assigned' },
        { code: 'PI-001-C002', statement: 'Approval checkpoints documented' },
      ]),
    });
    renderCriteriaManagement();
    fireEvent.click(screen.getByTestId('generate-criteria-btn-mps-1'));
    await screen.findByTestId('generated-criteria-list-mps-1');
    const items = screen.getAllByTestId('generated-criterion-item');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('PI-001-C001');
    expect(items[0].textContent).toContain('Workflow owner formally assigned');
  });

  it('"Accept All" selects all criteria for that MPS', async () => {
    configureAIResponse({
      reply: JSON.stringify([
        { code: 'PI-001-C001', statement: 'Criterion one' },
        { code: 'PI-001-C002', statement: 'Criterion two' },
      ]),
    });
    renderCriteriaManagement();
    fireEvent.click(screen.getByTestId('generate-criteria-btn-mps-1'));
    await screen.findByTestId('generated-criteria-list-mps-1');
    // Deselect first
    fireEvent.click(screen.getByTestId('criterion-select-PI-001-C001'));
    // Accept all
    fireEvent.click(screen.getByTestId('accept-all-criteria-btn-mps-1'));
    const cb1 = screen.getByTestId('criterion-select-PI-001-C001') as HTMLInputElement;
    const cb2 = screen.getByTestId('criterion-select-PI-001-C002') as HTMLInputElement;
    expect(cb1.checked).toBe(true);
    expect(cb2.checked).toBe(true);
  });

  it('save accepted fires mutation insert to mmm_criteria and clears generated list', async () => {
    configureAIResponse({
      reply: JSON.stringify([
        { code: 'PI-001-C001', statement: 'Workflow owner formally assigned' },
      ]),
    });
    renderCriteriaManagement();
    fireEvent.click(screen.getByTestId('generate-criteria-btn-mps-1'));
    await screen.findByTestId('save-criteria-btn-mps-1');
    fireEvent.click(screen.getByTestId('save-criteria-btn-mps-1'));
    await waitFor(() => expect(mockInsert).toHaveBeenCalled());
    const insertArg = mockInsert.mock.calls[0][0] as Array<Record<string, unknown>>;
    expect(insertArg[0]).toMatchObject({ mps_id: 'mps-1', code: 'PI-001-C001' });
  });

  it('AI error shows per-MPS error state', async () => {
    configureAIError();
    renderCriteriaManagement();
    fireEvent.click(screen.getByTestId('generate-criteria-btn-mps-1'));
    await waitFor(() =>
      expect(screen.getByTestId('criteria-generation-error-mps-1')).toBeTruthy(),
    );
  });

  it('closing CriteriaManagement resets all generation states', async () => {
    configureAIResponse({
      reply: JSON.stringify([{ code: 'PI-001-C001', statement: 'Criterion one' }]),
    });
    const onClose = vi.fn();
    renderCriteriaManagement({ onClose });
    fireEvent.click(screen.getByTestId('generate-criteria-btn-mps-1'));
    await screen.findByTestId('generated-criteria-list-mps-1');
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// T-MMM-S6-AI-004: NBR-003 — generation state resets when domainId changes
// ---------------------------------------------------------------------------

describe('T-MMM-S6-AI-004: generation state resets when domainId changes (NBR-003)', () => {
  afterEach(() => { cleanup(); });

  it('MPSSelectionModal resets generated list when domainId prop changes', async () => {
    configureAIResponse({
      reply: JSON.stringify([
        { number: 1, title: 'Access Control', intent: 'Govern access', rationale: 'Security' },
      ]),
    });
    const { rerender } = renderMPSSelectionModal({ mpsRows: [], domainId: 'domain-1' });
    fireEvent.click(screen.getByTestId('generate-mps-btn'));
    await screen.findByTestId('generated-mps-list');
    // Change domainId — state should reset
    const qc = createQueryClient();
    rerender(
      <QueryClientProvider client={qc}>
        <MPSSelectionModal
          domainId="domain-2"
          domainName="Different Domain"
          open={true}
          mpsRows={[]}
          isLoading={false}
          errorMessage={null}
          onClose={vi.fn()}
        />
      </QueryClientProvider>,
    );
    expect(screen.queryByTestId('generated-mps-list')).toBeNull();
    expect(screen.getByTestId('generate-mps-btn')).toBeTruthy();
  });

  it('IntentCreator resets per-MPS intent state when domainId prop changes', async () => {
    configureAIResponse({ reply: 'Generated intent.' });
    const { rerender } = renderIntentCreator({ domainId: 'domain-1' });
    fireEvent.click(screen.getByTestId('generate-intent-btn-mps-2'));
    await screen.findByTestId('intent-generated-mps-2');
    // Change domainId
    const qc = createQueryClient();
    rerender(
      <QueryClientProvider client={qc}>
        <IntentCreator
          domainId="domain-2"
          domainName="Different Domain"
          open={true}
          mpsRows={baseMpsRowsForModal}
          isLoading={false}
          errorMessage={null}
          onClose={vi.fn()}
        />
      </QueryClientProvider>,
    );
    expect(screen.queryByTestId('intent-generated-mps-2')).toBeNull();
  });

  it('CriteriaManagement resets per-MPS criteria state when domainId prop changes', async () => {
    configureAIResponse({
      reply: JSON.stringify([{ code: 'PI-001-C001', statement: 'Criterion one' }]),
    });
    const { rerender } = renderCriteriaManagement({ domainId: 'domain-1' });
    fireEvent.click(screen.getByTestId('generate-criteria-btn-mps-1'));
    await screen.findByTestId('generated-criteria-list-mps-1');
    // Change domainId
    const qc = createQueryClient();
    rerender(
      <QueryClientProvider client={qc}>
        <CriteriaManagement
          domainId="domain-2"
          domainName="Different Domain"
          open={true}
          mpsRows={baseMpsRowsForModal}
          criteriaByMps={{}}
          isLoading={false}
          errorMessage={null}
          onClose={vi.fn()}
        />
      </QueryClientProvider>,
    );
    expect(screen.queryByTestId('generated-criteria-list-mps-1')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// T-MMM-S6-AI-005: Legacy harvest parity — three generation step cards render
// ---------------------------------------------------------------------------

describe('T-MMM-S6-AI-005: DomainAuditBuilder renders three card-based step items (legacy harvest parity)', () => {
  beforeEach(() => {
    configureScenario({ domainRows: [{ id: 'domain-1', name: 'Process Integrity', code: 'PI', sort_order: 1, framework_id: 'framework-1' }], mpsRows: baseMpsRows, criteriaRows: [] });
  });
  afterEach(() => { cleanup(); });

  it('renders three domain audit step cards (not an ordered list)', async () => {
    renderDomainWorkspace();
    await screen.findByTestId('domain-audit-builder');
    const stepCards = screen.getAllByTestId('domain-audit-step-card');
    expect(stepCards).toHaveLength(3);
  });

  it('step cards container is NOT an ordered list element (legacy card workflow, not list shell)', async () => {
    renderDomainWorkspace();
    await screen.findByTestId('domain-audit-builder');
    const stepCards = screen.getAllByTestId('domain-audit-step-card');
    // The card elements themselves (and their direct parents) must not be <li> or <ol>
    for (const card of stepCards) {
      expect(card.tagName.toLowerCase()).not.toBe('li');
      expect(card.tagName.toLowerCase()).not.toBe('ol');
      const parent = card.parentElement;
      if (parent) {
        expect(parent.tagName.toLowerCase()).not.toBe('ol');
      }
      // No ancestor of any card should be an <ol>
      expect(card.closest('ol')).toBeNull();
    }
    // The steps container element itself must not be an <ol>
    const stepsContainer = document.querySelector('.domain-audit-builder__steps');
    expect(stepsContainer).not.toBeNull();
    expect(stepsContainer!.tagName.toLowerCase()).not.toBe('ol');
  });

  it('first step card renders "Create MPSs"', async () => {
    renderDomainWorkspace();
    await screen.findByTestId('domain-audit-builder');
    const stepCards = screen.getAllByTestId('domain-audit-step-card');
    expect(stepCards[0].textContent).toContain('Create MPSs');
  });

  it('second step card renders "Create Intent"', async () => {
    renderDomainWorkspace();
    await screen.findByTestId('domain-audit-builder');
    const stepCards = screen.getAllByTestId('domain-audit-step-card');
    expect(stepCards[1].textContent).toContain('Create Intent');
  });

  it('third step card renders "Create Criteria"', async () => {
    renderDomainWorkspace();
    await screen.findByTestId('domain-audit-builder');
    const stepCards = screen.getAllByTestId('domain-audit-step-card');
    expect(stepCards[2].textContent).toContain('Create Criteria');
  });
});

