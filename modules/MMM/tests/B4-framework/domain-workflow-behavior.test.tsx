import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DomainWorkspacePage from '../../../../apps/mmm/src/pages/DomainWorkspacePage';
import { MPSSelectionModal } from '../../../../apps/mmm/src/components/assessment/MPSSelectionModal';
import { IntentCreator } from '../../../../apps/mmm/src/components/assessment/IntentCreator';
import {
  CriteriaManagement,
  normalizeDescriptorEvidenceGrammar,
} from '../../../../apps/mmm/src/components/assessment/CriteriaManagement';

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


describe('T-MMM-DGC-1871: Descriptor grammar closure', () => {
  it('normalizes RACI requirement wording into an evidence-state descriptor', () => {
    const descriptor = normalizeDescriptorEvidenceGrammar(
      'Evidence that Security roles and responsibilities are to be clearly defined and presented in the form of a RACI chart is absent, weak, outdated, inconsistent, fragmented, or person-dependent. Records do not yet show repeatable ownership, communication, execution, review, or reliable evidence retention.',
    );

    expect(descriptor).toContain(
      'Evidence that Security roles and responsibilities are clearly defined and presented in the form of a RACI chart is absent, weak, outdated, inconsistent, fragmented, or person-dependent.',
    );
    expect(descriptor).not.toContain('are to be clearly defined');
  });

  it('normalizes gerund incentive-scheme wording into an auditable evidence clause', () => {
    const descriptor = normalizeDescriptorEvidenceGrammar(
      'Evidence that Assessing incentive schemes and measures for their impact on Security is absent, weak, outdated, inconsistent, fragmented, or person-dependent. Records do not yet show repeatable ownership, communication, execution, review, or reliable evidence retention.',
    );

    expect(descriptor).toContain(
      'Evidence that incentive schemes and measures are assessed for their impact on Security is absent, weak, outdated, inconsistent, fragmented, or person-dependent.',
    );
    expect(descriptor).not.toContain('Evidence that Assessing incentive schemes');
  });

  it('normalizes instruction words before maturity-state wording is attached', () => {
    expect(
      normalizeDescriptorEvidenceGrammar(
        'Evidence that the policy should be displayed is absent, weak, outdated, inconsistent, fragmented, or person-dependent.',
      ),
    ).toContain('Evidence that the policy is displayed is absent');

    expect(
      normalizeDescriptorEvidenceGrammar(
        'Evidence that the procedure shall be reviewed is absent, weak, outdated, inconsistent, fragmented, or person-dependent.',
      ),
    ).toContain('Evidence that the procedure is reviewed is absent');

    expect(
      normalizeDescriptorEvidenceGrammar(
        'Evidence that the accountable person must be documented is absent, weak, outdated, inconsistent, fragmented, or person-dependent.',
      ),
    ).toContain('Evidence that the accountable person is documented is absent');
  });
});
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

  it('criteria cards display one-based visible sequence rather than raw persisted sort order', async () => {
    configureScenario({
      mpsRows: baseMpsRows,
      criteriaRows: [
        {
          id: 'zero-sort-criterion-1',
          mps_id: 'mps-1',
          name: 'First historical criterion',
          code: 'PI-001-C001',
          sort_order: 0,
        },
        {
          id: 'zero-sort-criterion-2',
          mps_id: 'mps-1',
          name: 'Second historical criterion',
          code: 'PI-001-C002',
          sort_order: 1,
        },
        {
          id: 'wrong-code-first-criterion',
          mps_id: 'mps-2',
          name: 'First criterion saved with a drifted code',
          code: 'PI-002-C002',
          sort_order: 1,
        },
      ],
    });
    renderDomainWorkspace();

    await waitFor(() => {
      expect(screen.getByTestId('step-action-criteria').hasAttribute('disabled')).toBe(false);
    });
    fireEvent.click(screen.getByTestId('step-action-criteria'));

    expect(await screen.findByDisplayValue('PI-001-C002')).toBeTruthy();
    expect(screen.getByText('Sequence: 2')).toBeTruthy();
    expect(screen.queryByText('Sort order: 1')).toBeNull();
    const repairedCode = await screen.findByTestId('criteria-code-input-wrong-code-first-criterion') as HTMLInputElement;
    expect(repairedCode.value).toBe('PI-002-C001');
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
    expect(basicDescriptor.value).toMatch(/^Evidence that Workflow owner formally assigned/i);
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
    const learningPrompt = await screen.findByTestId('descriptor-learning-prompt');
    expect(learningPrompt.textContent).toContain('Thank you for the guidance');
    expect(learningPrompt.textContent).toContain('record this edit in my learning memory');
    fireEvent.click(screen.getByTestId('descriptor-learning-yes'));
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

  it('descriptor edit learning prompt can save without memory capture when declined', async () => {
    renderDomainWorkspace();

    await waitFor(() => {
      expect(screen.getByTestId('step-action-criteria').hasAttribute('disabled')).toBe(false);
    });
    fireEvent.click(screen.getByTestId('step-action-criteria'));
    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-1'));

    const basicDescriptor = await screen.findByTestId('descriptor-input-criterion-1-1') as HTMLTextAreaElement;
    fireEvent.click(screen.getByTestId('edit-descriptor-btn-criterion-1-1'));
    fireEvent.change(basicDescriptor, {
      target: { value: 'Evidence that Workflow owner formally assigned is corrected by the user.' },
    });
    fireEvent.click(await screen.findByTestId('descriptor-learning-no'));
    fireEvent.click(screen.getByTestId('save-descriptors-btn-criterion-1'));

    await waitFor(() => expect(mockSupabase.functions.invoke).toHaveBeenCalledWith(
      'mmm-level-descriptor-save',
      expect.objectContaining({
        body: expect.objectContaining({
          criterion_id: 'criterion-1',
          edited_levels: [],
        }),
      }),
    ));
    const saveStatus = await screen.findByTestId('descriptor-save-status-criterion-1');
    expect(saveStatus.textContent).toContain('without Maturion learning capture');
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
    expect(basicDescriptor.value).toMatch(/^Evidence that Workflow owner formally assigned/i);
    const status = await screen.findByText(/Maturity descriptors created from the approved methodology reference/i);
    expect(status.textContent).not.toContain('AI refinement');
    expect(status.textContent).not.toContain('AIMC');
    expect(status.textContent).not.toContain('404');
    expect(status.textContent).not.toContain('Used methodology fallback');
    expect(status.textContent).not.toContain('non-2xx');
    expect(mockSupabase.functions.invoke).toHaveBeenCalled();
  });

  it('maturity descriptors preserve criterion-specific role, reporting, and support anchors', async () => {
    const riskManagerCriteria: Scenario['criteriaRows'] = [
      {
        id: 'criterion-role-accountability',
        mps_id: 'mps-1',
        code: 'D001.MPS003.C006',
        sort_order: 5,
        name:
          'The Risk Manager: Security is the person who will be accountable for the delivery of security at the operations (both KDM and DTP) and co-ordination of security on behalf of the General Manager in accordance with this standard, laws rules and regulations and applicable Lucara Policies.',
      },
      {
        id: 'criterion-direct-reporting',
        mps_id: 'mps-1',
        code: 'D001.MPS003.C007',
        sort_order: 6,
        name:
          'The Risk Manager: Security will report independently and directly to the most senior executive of the operation. Currently, the Risk Manager: Security reports direct to the Chief Risk Officer, who reports to the Managing Director.',
      },
      {
        id: 'criterion-hod-support',
        mps_id: 'mps-1',
        code: 'D001.MPS003.C008',
        sort_order: 7,
        name:
          'The Risk Manager: Security will support Heads of Department (HOD) / Business Unit Managers in achieving Security in their areas through enforcing the intent of this standard. Where a HOD wishes to deviate from this standard the Risk Manager: Security Manager will escalate the issue to the DCC or the General Manager or MD Lucara Botswana.',
      },
    ];

    configureScenario({
      mpsRows: baseMpsRows,
      criteriaRows: riskManagerCriteria,
    });
    renderCriteriaManagement({
      criteriaByMps: {
        'mps-1': riskManagerCriteria,
      },
    });

    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-role-accountability'));
    const roleBasic = await screen.findByTestId('descriptor-input-criterion-role-accountability-1') as HTMLTextAreaElement;
    expect(roleBasic.value).toMatch(/^Evidence that the Risk Manager: Security is accountable/);
    expect(roleBasic.value).toContain('delivery of security');
    expect(roleBasic.value).toContain('this standard');
    expect(roleBasic.value).not.toMatch(/policy ownership, communication, display, and awareness/i);

    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-direct-reporting'));
    const reportingCompliant = await screen.findByTestId('descriptor-input-criterion-direct-reporting-3') as HTMLTextAreaElement;
    expect(reportingCompliant.value).toMatch(/^Evidence that the Risk Manager: Security reports independently\/directly/);
    expect(reportingCompliant.value).toMatch(/most senior executive/i);
    expect(reportingCompliant.value).toMatch(/meeting cadence|agendas\/minutes|action logs/i);
    expect(reportingCompliant.value).not.toMatch(/policy ownership, communication, display, and awareness/i);

    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-hod-support'));
    const supportProactive = await screen.findByTestId('descriptor-input-criterion-hod-support-4') as HTMLTextAreaElement;
    expect(supportProactive.value).toMatch(/^Evidence that the Risk Manager: Security provides Security support/);
    expect(supportProactive.value).toMatch(/deviation escalation|DCC\/GM\/MD/i);
    expect(supportProactive.value).toMatch(/closure/i);
    expect(supportProactive.value).not.toMatch(/governance forum mandate/i);
  });

  it('maturity descriptors begin with the actual criterion evidence requirement before level state', async () => {
    const precisionCriteria: Scenario['criteriaRows'] = [
      {
        id: 'criterion-policy-display',
        mps_id: 'mps-1',
        code: 'D001.MPS001.C001',
        sort_order: 1,
        name:
          'A Security Policy signed by the most senior executive for Lucara Botswana - applicable to both Karowe Diamond Mine (KDM) and the Corporate Office at the Diamond Technology Park (DTP) should be prominently displayed. This display, subject to the location (at the Corporate Office or KDM) should be either communicated via email and placed on available and accessible social media platforms like Yammer.',
      },
      {
        id: 'criterion-policy-outline',
        mps_id: 'mps-1',
        code: 'D001.MPS001.C002',
        sort_order: 2,
        name:
          'The Security Policy will be a short document that will at least outline the company’s obligations and the individual’s obligations regarding Security and/or security related activities.',
      },
      {
        id: 'criterion-governance-charter',
        mps_id: 'mps-1',
        code: 'D001.MPS001.C003',
        sort_order: 3,
        name:
          'A documented governance charter defines leadership responsibilities and decision authority (hybrid source).',
      },
      {
        id: 'criterion-hod-golden-rules',
        mps_id: 'mps-1',
        code: 'D001.MPS001.C004',
        sort_order: 4,
        name:
          'The Heads of Department / HODs, Superintendents, etc. - leaders at all levels - will endeavour to make the Security Policy relevant to their place of operation / workplace through setting a limited number of Golden Rules that define applicable security requirements based on the associated risk profile and acceptable risk tolerance.',
      },
      {
        id: 'criterion-induction-process',
        mps_id: 'mps-1',
        code: 'D001.MPS001.C005',
        sort_order: 5,
        name:
          'The Policy will be incorporated into the operation’s induction process for all personnel, contractors and visitors. A process will exist for recording that all personnel, contractors and visitors understand and agree to comply with it.',
      },
      {
        id: 'criterion-to-indicate',
        mps_id: 'mps-1',
        code: 'D001.MPS002.C001',
        sort_order: 6,
        name:
          'To indicate all accountable and responsible people, the Chain of Custody Matrix does list all those from the MD, GM to those in the Mining Operations and Support Services.',
      },
      {
        id: 'criterion-where-possible',
        mps_id: 'mps-1',
        code: 'D001.MPS001.C006',
        sort_order: 7,
        name:
          'Where possible and applicable, specific Security accountabilities and performance measures will be documented within role descriptions for those in high-risk diamond areas, security and management. (Note: Within the current Performance Management Scorecard/System’s and approved Generic Objectives, reference is made to ‘Security’ and ‘Governance’ where KPA/Objectives and KPI/Measures are listed for those in a HOD and/or Superintendent role. Consultation will need to be held with HR to review any role descriptions for those in high-risk diamond areas / Security / Management and determine if additional security responsibilities are required to be included and/or enhanced)',
      },
    ];

    configureScenario({
      mpsRows: baseMpsRows,
      criteriaRows: precisionCriteria,
    });
    renderCriteriaManagement({
      criteriaByMps: {
        'mps-1': precisionCriteria,
      },
    });

    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-policy-display'));
    const displayBasic = await screen.findByTestId('descriptor-input-criterion-policy-display-1') as HTMLTextAreaElement;
    expect(displayBasic.value).toMatch(/^Evidence that a Security Policy signed by the most senior executive/i);
    expect(displayBasic.value).toContain('prominently displayed');
    expect(displayBasic.value).toMatch(/absent|weak|outdated/i);
    expect(displayBasic.value).not.toMatch(/policy approval\/currency/i);

    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-policy-outline'));
    const outlineCompliant = await screen.findByTestId('descriptor-input-criterion-policy-outline-3') as HTMLTextAreaElement;
    expect(outlineCompliant.value).toMatch(/^Evidence that the Security Policy is a short document that at least outlines/i);
    expect(outlineCompliant.value).toContain('company’s obligations');
    expect(outlineCompliant.value).toMatch(/current, complete, traceable/i);
    expect(outlineCompliant.value).not.toMatch(/policy approval\/currency/i);

    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-governance-charter'));
    const charterBasic = await screen.findByTestId('descriptor-input-criterion-governance-charter-1') as HTMLTextAreaElement;
    expect(charterBasic.value).toMatch(
      /^Evidence that a documented governance charter that defines leadership responsibilities and decision authority is absent/i,
    );
    expect(charterBasic.value).not.toMatch(/governance forum mandate/i);

    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-hod-golden-rules'));
    const goldenRulesBasic = await screen.findByTestId('descriptor-input-criterion-hod-golden-rules-1') as HTMLTextAreaElement;
    expect(goldenRulesBasic.value).toMatch(/^Evidence that the Heads of Department \/ HODs/i);
    expect(goldenRulesBasic.value).toContain('Golden Rules');
    expect(goldenRulesBasic.value).toContain('risk profile and acceptable risk tolerance');
    expect(goldenRulesBasic.value).not.toMatch(/Risk Manager: Security support/i);

    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-induction-process'));
    const inductionBasic = await screen.findByTestId('descriptor-input-criterion-induction-process-1') as HTMLTextAreaElement;
    expect(inductionBasic.value).toMatch(/^Evidence that the Policy is incorporated into the operation’s induction process/i);
    expect(inductionBasic.value).toContain('supported by a process recording that all personnel, contractors and visitors understand and agree to comply with it');
    expect(inductionBasic.value).toMatch(/is absent, weak, outdated/i);
    expect(inductionBasic.value).not.toMatch(/visitors\. A process/i);

    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-to-indicate'));
    const toIndicateBasic = await screen.findByTestId('descriptor-input-criterion-to-indicate-1') as HTMLTextAreaElement;
    expect(toIndicateBasic.value).toMatch(/^Evidence indicating all accountable and responsible people/i);
    expect(toIndicateBasic.value).not.toMatch(/^Evidence that To/i);

    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-where-possible'));
    const wherePossibleResilient = await screen.findByTestId('descriptor-input-criterion-where-possible-5') as HTMLTextAreaElement;
    expect(wherePossibleResilient.value).toMatch(/^Evidence that, where possible and applicable/i);
    expect(wherePossibleResilient.value).toContain('specific Security accountabilities and performance measures');
    expect(wherePossibleResilient.value).not.toContain('Performance Management Scorecard');
    expect(wherePossibleResilient.value).not.toContain('KPA/Objectives');
    expect(wherePossibleResilient.value).not.toMatch(/^Evidence that Where/i);
  });

  it('sanitizes uploaded-source notes from AI-refined maturity descriptors before display', async () => {
    const noteCriterion: Scenario['criteriaRows'] = [
      {
        id: 'criterion-note-ai',
        mps_id: 'mps-1',
        code: 'D001.MPS001.C006',
        sort_order: 1,
        name:
          'Where possible and applicable, specific Security accountabilities and performance measures will be documented within role descriptions for those in high-risk diamond areas, security and management. (Note: Within the current Performance Management Scorecard/System’s and approved Generic Objectives, reference is made to ‘Security’ and ‘Governance’ where KPA/Objectives and KPI/Measures are listed for those in a HOD and/or Superintendent role. Consultation need to be held with HR to review any role descriptions for those in high-risk diamond areas / Security / Management and determine if additional security responsibilities are required to be included and/or enhanced)',
      },
    ];
    configureScenario({
      mpsRows: baseMpsRows,
      criteriaRows: noteCriterion,
      knowledgeRows: [
        {
          source_document_name: 'LDCS_Maturity_Model_Descriptor_Guideline_Approved_Methodology_Reference.md',
          metadata: { role: 'criteria_source' },
          chunk_index: 0,
          content: 'Approved methodology reference for Basic Reactive Compliant Proactive Resilient descriptors.',
        },
      ],
    });
    const maturityLevels = [
      { level: 1, label: 'Basic' },
      { level: 2, label: 'Reactive' },
      { level: 3, label: 'Compliant' },
      { level: 4, label: 'Proactive' },
      { level: 5, label: 'Resilient' },
    ];
    configureAIResponse({
      reply: JSON.stringify(maturityLevels.map(({ level, label }) => ({
        level,
        label,
        descriptor_text:
          `Evidence that, where possible and applicable, specific Security accountabilities and performance measures is documented within role descriptions for those in high-risk diamond areas, security and management. (Note: Within the current Performance Management Scorecard/System’s and approved Generic Objectives, reference is made to ‘Security’ and ‘Governance’ where KPA/Objectives and KPI/Measures are listed for those in a HOD and/or Superintendent role. Consultation need to be held with HR to review any role descriptions for those in high-risk diamond areas / Security / Management and determine if additional security responsibilities are required to be included and/or enhanced) ${label.toLowerCase()} evidence state is auditable and level-specific.`,
      }))),
    });
    renderCriteriaManagement({
      criteriaByMps: {
        'mps-1': noteCriterion,
      },
    });

    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-note-ai'));
    const aiBasic = await screen.findByTestId('descriptor-input-criterion-note-ai-1') as HTMLTextAreaElement;
    expect(aiBasic.value).toContain('specific Security accountabilities and performance measures');
    expect(aiBasic.value).not.toContain('Performance Management Scorecard');
    expect(aiBasic.value).not.toContain('KPA/Objectives');
    expect(aiBasic.value).not.toContain('(Note:');
  });

  it('T-MMM-DMC-044: multi-sentence criterion with contextual qualifier reconstructs one grammatical evidence clause', async () => {
    const contextualCriterion: Scenario['criteriaRows'] = [
      {
        id: 'criterion-contextual',
        mps_id: 'mps-1',
        code: 'D001.MPS004.C001',
        sort_order: 1,
        name:
          'Leadership teams assess security culture and protocol adherence. This is especially important during high-risk or high-exposure activities.',
      },
    ];
    configureScenario({
      mpsRows: baseMpsRows,
      criteriaRows: contextualCriterion,
    });
    renderCriteriaManagement({
      criteriaByMps: { 'mps-1': contextualCriterion },
    });

    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-contextual'));
    const basicDescriptor = await screen.findByTestId('descriptor-input-criterion-contextual-1') as HTMLTextAreaElement;

    // The contextual clause must be integrated — not copied as a separate sentence
    expect(basicDescriptor.value).toMatch(/^Evidence that Leadership teams assess security culture/i);
    expect(basicDescriptor.value).toContain('during high-risk or high-exposure activities');
    expect(basicDescriptor.value).not.toMatch(/\.\s+This is especially important/i);
    expect(basicDescriptor.value).not.toMatch(/activities\.\s+is absent/i);
    expect(basicDescriptor.value).toMatch(/absent|weak|outdated|informal/i);
  });

  it('T-MMM-DMC-043: each maturity level triggers an independent per-level learning consent prompt', async () => {
    configureScenario({
      mpsRows: baseMpsRows,
      criteriaRows: baseCriteriaRows,
    });
    renderDomainWorkspace();

    await waitFor(() => {
      expect(screen.getByTestId('step-action-criteria').hasAttribute('disabled')).toBe(false);
    });
    fireEvent.click(screen.getByTestId('step-action-criteria'));
    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-1'));

    // Edit Basic (level 1) — learning prompt should appear
    const basicDescriptor = await screen.findByTestId('descriptor-input-criterion-1-1') as HTMLTextAreaElement;
    fireEvent.click(screen.getByTestId('edit-descriptor-btn-criterion-1-1'));
    fireEvent.change(basicDescriptor, {
      target: { value: 'Evidence that Workflow owner formally assigned is edited for Basic level.' },
    });
    const basicPrompt = await screen.findByTestId('descriptor-learning-prompt');
    expect(basicPrompt).toBeTruthy();
    fireEvent.click(screen.getByTestId('descriptor-learning-yes'));

    // Edit Reactive (level 2) — a fresh prompt must appear for this level
    const reactiveDescriptor = screen.getByTestId('descriptor-input-criterion-1-2') as HTMLTextAreaElement;
    fireEvent.click(screen.getByTestId('edit-descriptor-btn-criterion-1-2'));
    fireEvent.change(reactiveDescriptor, {
      target: { value: 'Evidence that Workflow owner formally assigned is edited for Reactive level.' },
    });
    const reactivePrompt = await screen.findByTestId('descriptor-learning-prompt');
    expect(reactivePrompt).toBeTruthy();
    expect(reactivePrompt.textContent).toContain('Thank you for the guidance');
    fireEvent.click(screen.getByTestId('descriptor-learning-no'));

    // Save — Basic consented; Reactive declined → edited_levels contains only level 1
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
  });

  it('T-MMM-DMC-043b: descriptor editing remains available after save without sign-off lock', async () => {
    configureScenario({
      mpsRows: baseMpsRows,
      criteriaRows: baseCriteriaRows,
    });
    renderDomainWorkspace();

    await waitFor(() => {
      expect(screen.getByTestId('step-action-criteria').hasAttribute('disabled')).toBe(false);
    });
    fireEvent.click(screen.getByTestId('step-action-criteria'));
    fireEvent.click(await screen.findByTestId('generate-descriptors-btn-criterion-1'));

    // First edit and save
    const basicDescriptor = await screen.findByTestId('descriptor-input-criterion-1-1') as HTMLTextAreaElement;
    fireEvent.click(screen.getByTestId('edit-descriptor-btn-criterion-1-1'));
    fireEvent.change(basicDescriptor, {
      target: { value: 'Evidence that Workflow owner formally assigned — first edit.' },
    });
    fireEvent.click(await screen.findByTestId('descriptor-learning-yes'));
    fireEvent.click(screen.getByTestId('save-descriptors-btn-criterion-1'));
    await screen.findByTestId('descriptor-save-status-criterion-1');

    // After save the edit button must still be present and functional (second edit)
    const editBtn = screen.getByTestId('edit-descriptor-btn-criterion-1-1');
    expect(editBtn).toBeTruthy();
    fireEvent.click(editBtn);
    expect(basicDescriptor.readOnly).toBe(false);
    fireEvent.change(basicDescriptor, {
      target: { value: 'Evidence that Workflow owner formally assigned — second edit.' },
    });
    expect(basicDescriptor.value).toContain('second edit');

    // Save again — second save must reach the invoke call
    fireEvent.click(screen.getByTestId('save-descriptors-btn-criterion-1'));
    await waitFor(() => expect(mockSupabase.functions.invoke).toHaveBeenCalledTimes(2));
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
        { code: 'PI-001-C002', statement: 'Workflow owner formally assigned' },
        { code: 'PI-001-C005', statement: 'Approval checkpoints documented' },
      ]),
    });
    renderCriteriaManagement();
    fireEvent.click(screen.getByTestId('generate-criteria-btn-mps-1'));
    await screen.findByTestId('save-criteria-btn-mps-1');
    fireEvent.click(screen.getByTestId('save-criteria-btn-mps-1'));
    await waitFor(() => expect(mockInsert).toHaveBeenCalled());
    const insertArg = mockInsert.mock.calls[0][0] as Array<Record<string, unknown>>;
    expect(insertArg[0]).toMatchObject({ mps_id: 'mps-1', code: 'PI-001-C001', sort_order: 1 });
    expect(insertArg[1]).toMatchObject({ mps_id: 'mps-1', code: 'PI-001-C002', sort_order: 2 });
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

