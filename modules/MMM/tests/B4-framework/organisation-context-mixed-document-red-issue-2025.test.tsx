/**
 * QA-to-Red: Organisation-context mixed-document ingestion (issue #2025, PR #2026, task #2027).
 *
 * Functional/behavioral tests only (render + interact via @testing-library/react), NOT
 * source-text/static-presence checks, per T-2025-QA-RED appointment scope.
 *
 * Production fault under remediation: `mmm-subject-knowledge-reprocess` Edge Function returns
 * HTTP 546 WORKER_RESOURCE_LIMIT after ~125.6s (resource/time exhaustion, not a metadata-save
 * bug). See .agent-admin/scope-declarations/issue-2025.md for the frozen scope/acceptance
 * contract this suite proves against.
 *
 * All tests below MUST be RED against current `main`-derived behavior, EXCEPT:
 *  - T-2025-07 (RLS/storage isolation) and T-2025-08 (existing single-document happy path),
 *    which are regression guards explicitly permitted to already be GREEN today per the frozen
 *    acceptance contract ("RLS/storage isolation regression tests remain green" /
 *    "existing single-primary-document happy path must be covered as a regression guard").
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrganisationContextPage from '../../../../apps/mmm/src/pages/OrganisationContextPage';

type DocRow = {
  id: string;
  organisation_id: string;
  scope_type: string;
  archived_at: string | null;
  title: string | null;
  file_name: string | null;
  mime_type?: string | null;
  processing_status: string | null;
  chunk_count: number | null;
  processing_error: string | null;
  tags: string[] | null;
  created_at: string;
  storage_bucket?: string | null;
  storage_path?: string | null;
};

type OrgFixture = {
  id: string;
  name: string;
  tier: string;
  context: Record<string, unknown> | null;
  onboarding_complete: boolean;
  context_updated_at: string | null;
};

type Scenario = {
  org: OrgFixture;
  initialDocs: DocRow[];
  primaryUploadFailPathMatch?: string | null;
  supplementaryUploadFailFileNames?: string[];
  reprocessMode?: 'success' | 'hang' | 'fail';
  contextPersistShouldFail?: boolean;
};

const { mockSupabase, configureScenario, mockStorageUpload, mockInvoke } = vi.hoisted(() => {
  let scenario: Scenario | null = null;
  let documentsStore: DocRow[] = [];
  let idCounter = 0;

  function nextId(): string {
    idCounter += 1;
    return `doc-${idCounter}`;
  }

  const mockStorageUpload = vi.fn((path: string, _file: unknown, _opts?: Record<string, unknown>) => {
    const primaryFail =
      scenario?.primaryUploadFailPathMatch && path.includes(scenario.primaryUploadFailPathMatch);
    const suppFail = (scenario?.supplementaryUploadFailFileNames ?? []).some((name) =>
      path.includes(name),
    );
    if (primaryFail || suppFail) {
      return Promise.resolve({
        data: null,
        error: { message: `Simulated storage upload failure for ${path}` },
      });
    }
    return Promise.resolve({ data: { path }, error: null });
  });

  const mockInvoke = vi.fn((fnName: string, opts?: { body?: Record<string, unknown> }) => {
    if (fnName === 'mmm-organisation-context') {
      const action = opts?.body?.action;
      if (action === 'get') {
        return Promise.resolve({ data: { organisation: scenario?.org }, error: null });
      }
      if (action === 'update') {
        return Promise.resolve({
          data: { organisation: { ...(scenario?.org ?? {}), context: opts?.body?.context } },
          error: null,
        });
      }
      return Promise.resolve({ data: null, error: { message: 'unknown action' } });
    }
    if (fnName === 'mmm-subject-knowledge-reprocess') {
      if (opts?.body?.background === true) {
        return Promise.resolve({
          data: {
            accepted: true,
            status: 'processing',
            document_id: opts?.body?.document_id,
          },
          error: null,
        });
      }
      const mode = scenario?.reprocessMode ?? 'success';
      if (mode === 'hang') {
        // Simulate a long-running call without leaving never-resolving promises + open timeout handles.
        return new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: { success: true, document_id: opts?.body?.document_id, chunk_count: 0 },
                error: null,
              }),
            1_000,
          ),
        );
      }
      if (mode === 'fail') {
        return Promise.resolve({ data: null, error: { message: 'Simulated reprocess failure' } });
      }
      return Promise.resolve({
        data: { success: true, document_id: opts?.body?.document_id, chunk_count: 3 },
        error: null,
      });
    }
    return Promise.resolve({ data: null, error: { message: `unmocked function ${fnName}` } });
  });

  function makeBuilder(table: string) {
    const state: {
      filters: Record<string, unknown>;
      single: 'maybe' | 'single' | null;
      mode: 'select' | 'insert' | 'update';
      insertRows: Record<string, unknown>[] | null;
      updatePatch: Record<string, unknown> | null;
    } = { filters: {}, single: null, mode: 'select', insertRows: null, updatePatch: null };

    function execute(): { data: unknown; error: { message: string } | null } {
      if (table === 'mmm_subject_knowledge_documents') {
        if (state.mode === 'insert' && state.insertRows) {
          const inserted = state.insertRows.map((row) => ({
            archived_at: null,
            chunk_count: null,
            processing_error: null,
            created_at: new Date().toISOString(),
            ...row,
            id: nextId(),
          })) as DocRow[];
          documentsStore.push(...inserted);
          return { data: inserted, error: null };
        }
        if (state.mode === 'update' && state.updatePatch) {
          const idFilter = state.filters.id;
          documentsStore = documentsStore.map((row) =>
            row.id === idFilter ? { ...row, ...(state.updatePatch as Partial<DocRow>) } : row,
          );
          return { data: null, error: null };
        }
        const matches = documentsStore.filter((row) =>
          Object.entries(state.filters).every(([key, value]) => {
            const rowValue = (row as Record<string, unknown>)[key];
            if (value === null) return rowValue === null || rowValue === undefined;
            return rowValue === value;
          }),
        );
        if (state.single === 'maybe') {
          return { data: matches[0] ?? null, error: null };
        }
        if (state.single === 'single') {
          return { data: matches[0] ?? null, error: matches[0] ? null : { message: 'not found' } };
        }
        const sorted = [...matches].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
        return { data: sorted, error: null };
      }
      if (table === 'mmm_organisations' && state.mode === 'update') {
        if (scenario?.contextPersistShouldFail) {
          return { data: null, error: { message: 'Simulated context persist failure' } };
        }
        return { data: null, error: null };
      }
      return { data: null, error: null };
    }

    const builder: Record<string, unknown> = {
      select(_cols?: string) {
        state.mode = 'select';
        return builder;
      },
      eq(col: string, val: unknown) {
        state.filters[col] = val;
        return builder;
      },
      is(col: string, val: unknown) {
        state.filters[col] = val;
        return builder;
      },
      order() {
        return builder;
      },
      maybeSingle() {
        state.single = 'maybe';
        return Promise.resolve(execute());
      },
      single() {
        state.single = 'single';
        return Promise.resolve(execute());
      },
      insert(rows: Record<string, unknown> | Record<string, unknown>[]) {
        state.mode = 'insert';
        state.insertRows = Array.isArray(rows) ? rows : [rows];
        return Promise.resolve(execute());
      },
      update(patch: Record<string, unknown>) {
        state.mode = 'update';
        state.updatePatch = patch;
        return builder;
      },
      then(onFulfilled: (v: unknown) => unknown, onRejected?: (e: unknown) => unknown) {
        return Promise.resolve(execute()).then(onFulfilled, onRejected);
      },
    };
    return builder;
  }

  return {
    mockSupabase: {
      auth: {
        getSession: vi.fn(() =>
          Promise.resolve({ data: { session: { user: { id: 'user-1' } } }, error: null }),
        ),
      },
      functions: { invoke: mockInvoke },
      storage: {
        from: vi.fn(() => ({ upload: mockStorageUpload })),
      },
      from: vi.fn((table: string) => makeBuilder(table)),
    },
    configureScenario(next: Scenario) {
      scenario = next;
      documentsStore = next.initialDocs.map((doc) => ({ ...doc }));
      idCounter = documentsStore.length;
      mockStorageUpload.mockClear();
      mockInvoke.mockClear();
    },
    mockStorageUpload,
    mockInvoke,
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
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function renderOrganisationContextPage() {
  const queryClient = createQueryClient();
  const utils = render(
    <QueryClientProvider client={queryClient}>
      <OrganisationContextPage />
    </QueryClientProvider>,
  );
  return { queryClient, ...utils };
}

function makeFile(name: string, mimeType: string, content = 'stub-content'): File {
  return new File([content], name, { type: mimeType });
}

async function addSupplementaryFiles(container: HTMLElement, files: File[]) {
  for (let index = 0; index < files.length; index += 1) {
    const selector =
      index === 0
        ? '#context-supplementary-files'
        : `[data-testid="organisation-supplementary-row-${index}"] input[type="file"]`;
    const input =
      (container.querySelector(selector) as HTMLInputElement | null) ??
      ((await screen.findByTestId(`organisation-supplementary-row-${index}`)).querySelector(
        'input[type="file"]',
      ) as HTMLInputElement | null);
    if (!input) {
      throw new Error(`Missing supplementary input for row ${index}`);
    }
    fireEvent.change(input, { target: { files: [files[index]] } });
  }
}

function baseOrg(id = 'org-t2025'): OrgFixture {
  return {
    id,
    name: 'Acme Test Org',
    tier: 'PRO',
    context: {},
    onboarding_complete: true,
    context_updated_at: null,
  };
}

afterEach(() => {
  cleanup();
});

describe('T-2025-01: Repeatable optional supplementary upload rows', () => {
  it('reveals the next empty optional row when a file is selected, supports 3+ simultaneous files, and allows individual row removal', async () => {
    configureScenario({ org: baseOrg(), initialDocs: [] });
    const { container } = renderOrganisationContextPage();
    await screen.findByTestId('organisation-source-upload');

    // Row 0 must exist as its own repeatable optional-row input (not a single combined
    // multi-select input) so that each selected row is individually addressable/removable.
    const row0 = container.querySelector(
      '[data-testid="organisation-supplementary-row-0"] input[type="file"]',
    ) as HTMLInputElement | null;
    expect(row0).not.toBeNull();

    fireEvent.change(row0 as HTMLInputElement, {
      target: { files: [makeFile('supp-one.pptx', 'application/vnd.ms-powerpoint')] },
    });

    // Selecting a file in row 0 must reveal a new empty row 1.
    const row1 = await screen.findByTestId('organisation-supplementary-row-1');
    const row1Input = row1.querySelector('input[type="file"]') as HTMLInputElement;
    expect(row1Input).toBeTruthy();

    fireEvent.change(row1Input, {
      target: { files: [makeFile('supp-two.xlsx', 'application/vnd.ms-excel')] },
    });

    // Selecting a file in row 1 must reveal row 2, proving 3+ supplementary files are
    // supported without reopening/replacing a single picker.
    const row2 = await screen.findByTestId('organisation-supplementary-row-2');
    const row2Input = row2.querySelector('input[type="file"]') as HTMLInputElement;
    expect(row2Input).toBeTruthy();

    fireEvent.change(row2Input, {
      target: { files: [makeFile('supp-three.pdf', 'application/pdf')] },
    });

    // A 4th row must appear too (arbitrary, not capped at exactly 3).
    expect(await screen.findByTestId('organisation-supplementary-row-3')).toBeTruthy();

    fireEvent.click(screen.getByTestId('organisation-supplementary-row-remove-3'));

    await waitFor(() => {
      expect(screen.getByTestId('organisation-supplementary-row-3')).toBeTruthy();
    });

    // Each populated row must be individually removable without clearing the others.
    const removeRow0 = screen.getByTestId('organisation-supplementary-row-remove-0');
    fireEvent.click(removeRow0);

    await waitFor(() => {
      expect(screen.queryByText('supp-one.pptx')).toBeNull();
    });
    // Rows 1 and 2 selections must be unaffected by removing row 0.
    expect(screen.getByText('supp-two.xlsx')).toBeTruthy();
    expect(screen.getByText('supp-three.pdf')).toBeTruthy();
  });
});

describe('T-2025-02: All 11 accepted formats incl. JSON MIME-fallback-by-filename', () => {
  const REQUIRED_FORMAT_EXTENSIONS = [
    '.pdf',
    '.doc',
    '.docx',
    '.txt',
    '.md',
    '.csv',
    '.json',
    '.ppt',
    '.pptx',
    '.xls',
    '.xlsx',
  ];

  it('accepts all 11 formats (including JSON) and resolves JSON MIME by filename when the browser reports an empty type', async () => {
    configureScenario({ org: baseOrg(), initialDocs: [], reprocessMode: 'success' });
    const { container } = renderOrganisationContextPage();
    await screen.findByTestId('organisation-source-upload');

    const primaryInput = container.querySelector('#context-source-file') as HTMLInputElement;
    const acceptAttr = (primaryInput.getAttribute('accept') ?? '').toLowerCase();

    // Format-completeness: all 11 frozen formats must be selectable, including JSON, which
    // is currently entirely absent from the accepted-types contract.
    REQUIRED_FORMAT_EXTENSIONS.forEach((ext) => {
      expect(acceptAttr).toEqual(expect.stringContaining(ext));
    });

    // MIME-fallback-by-filename: JSON is a format where browsers commonly report an empty
    // native File.type; the upload pipeline must still resolve/send the correct MIME type.
    const jsonFile = makeFile('org-context.json', '');
    fireEvent.change(primaryInput, { target: { files: [jsonFile] } });
    fireEvent.click(screen.getByTestId('upload-organisation-source-btn'));

    await waitFor(() => expect(mockStorageUpload).toHaveBeenCalled());
    const [, , uploadOpts] = mockStorageUpload.mock.calls[0];
    expect((uploadOpts as { contentType?: string })?.contentType).toBe('application/json');
  });
});

describe('T-2025-03: Mixed-batch per-file isolation', () => {
  it('still uploads supplementary files even when the primary source document fails to process', async () => {
    configureScenario({
      org: baseOrg(),
      initialDocs: [],
      primaryUploadFailPathMatch: 'primary-will-fail.docx',
      reprocessMode: 'success',
    });
    const { container } = renderOrganisationContextPage();
    await screen.findByTestId('organisation-source-upload');

    const primaryInput = container.querySelector('#context-source-file') as HTMLInputElement;
    fireEvent.change(primaryInput, {
      target: {
        files: [
          makeFile(
            'primary-will-fail.docx',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ),
        ],
      },
    });
    await addSupplementaryFiles(container, [
      makeFile('supp-should-still-succeed-1.pptx', 'application/vnd.ms-powerpoint'),
      makeFile('supp-should-still-succeed-2.xlsx', 'application/vnd.ms-excel'),
    ]);

    fireEvent.click(screen.getByTestId('upload-organisation-source-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('organisation-source-upload').textContent ?? '').toMatch(
        /storage upload failed/i,
      );
    });

    // A single failing primary file must not roll back or block the other files in the same
    // batch: the supplementary uploads must still have been attempted/succeeded.
    const suppUploadAttempted = mockStorageUpload.mock.calls.some(([path]) =>
      String(path).includes('supp-'),
    );
    expect(suppUploadAttempted).toBe(true);
  });

  it('gives same-name supplementary files distinct storage paths within one batch', async () => {
    configureScenario({ org: baseOrg(), initialDocs: [], reprocessMode: 'success' });
    const { container } = renderOrganisationContextPage();
    await screen.findByTestId('organisation-source-upload');

    const primaryInput = container.querySelector('#context-source-file') as HTMLInputElement;
    fireEvent.change(primaryInput, {
      target: { files: [makeFile('primary-ok.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')] },
    });
    await addSupplementaryFiles(container, [
      makeFile('same-name.txt', 'text/plain', 'first'),
      makeFile('same-name.txt', 'text/plain', 'second'),
    ]);

    fireEvent.click(screen.getByTestId('upload-organisation-source-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('organisation-source-upload').textContent ?? '').toMatch(
        /finished successfully/i,
      );
    });

    const supplementaryPaths = mockStorageUpload.mock.calls
      .map(([path]) => String(path))
      .filter((path) => path.includes('-supp-same-name.txt'));
    expect(supplementaryPaths).toHaveLength(2);
    expect(new Set(supplementaryPaths).size).toBe(2);
  });
});

describe('T-2025-04: Durable, actionable per-file processing status/error persistence', () => {
  it('persists a failed supplementary file status so it survives a reload/refetch instead of only in-memory state', async () => {
    configureScenario({
      org: baseOrg(),
      initialDocs: [],
      supplementaryUploadFailFileNames: ['flaky-supp.txt'],
      reprocessMode: 'success',
    });
    const { container, queryClient } = renderOrganisationContextPage();
    await screen.findByTestId('organisation-source-upload');

    const primaryInput = container.querySelector('#context-source-file') as HTMLInputElement;
    fireEvent.change(primaryInput, { target: { files: [makeFile('primary-ok.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')] } });
    await addSupplementaryFiles(container, [
      makeFile('good-supp.pptx', 'application/vnd.ms-powerpoint'),
      makeFile('flaky-supp.txt', 'text/plain'),
    ]);

    fireEvent.click(screen.getByTestId('upload-organisation-source-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('organisation-source-upload').textContent ?? '').toMatch(
        /finished successfully/i,
      );
    });

    // Simulate a page reload/refetch of durable per-file status (not just in-memory state).
    await queryClient.invalidateQueries({
      queryKey: ['organisation-context-source-docs', baseOrg().id],
    });

    // The failed supplementary file must have a durable, actionable status entry that
    // survives the reload — it must not simply vanish because it only lived in component
    // state during the failed upload attempt.
    await waitFor(() => {
      expect(screen.getByText(/flaky-supp\.txt/i)).toBeTruthy();
    });
    expect(screen.getByText(/failed/i)).toBeTruthy();
  });
});

describe('T-2025-05: Recoverable bounded/async resource-failure handling (regression guard for Edge Worker HTTP 546 WORKER_RESOURCE_LIMIT)', () => {
  it('uses worker-side background processing so the browser can persist mode context without keeping the reprocess request open', async () => {
    configureScenario({ org: baseOrg(), initialDocs: [], reprocessMode: 'success' });
    const { container } = renderOrganisationContextPage();
    await screen.findByTestId('organisation-source-upload');

    const primaryInput = container.querySelector('#context-source-file') as HTMLInputElement;
    fireEvent.change(primaryInput, {
      target: {
        files: [
          makeFile(
            'resource-heavy-doc.pdf',
            'application/pdf',
          ),
        ],
      },
    });
    fireEvent.click(screen.getByTestId('upload-organisation-source-btn'));

    await waitFor(() =>
      expect(mockInvoke).toHaveBeenCalledWith(
        'mmm-subject-knowledge-reprocess',
        expect.anything(),
      ),
    );

    const reprocessCall = mockInvoke.mock.calls.find(
      ([name]) => name === 'mmm-subject-knowledge-reprocess',
    );
    const options = (reprocessCall?.[1] ?? {}) as { body?: Record<string, unknown>; signal?: AbortSignal };

    expect(options.body?.background).toBe(true);
    expect(options.signal).toBeUndefined();
    await waitFor(() => {
      expect(screen.getAllByText(/processing continues in the background/i).length).toBeGreaterThan(0);
    });
  });

  it('does not block the rest of the batch while the primary document is handed off to background processing', async () => {
    configureScenario({ org: baseOrg(), initialDocs: [], reprocessMode: 'success' });
    const { container } = renderOrganisationContextPage();
    await screen.findByTestId('organisation-source-upload');

    const primaryInput = container.querySelector('#context-source-file') as HTMLInputElement;
    fireEvent.change(primaryInput, {
      target: { files: [makeFile('resource-heavy-doc-2.pdf', 'application/pdf')] },
    });
    await addSupplementaryFiles(container, [
      makeFile('supp-during-hang-1.pptx', 'application/vnd.ms-powerpoint'),
      makeFile('supp-during-hang-2.xlsx', 'application/vnd.ms-excel'),
    ]);

    fireEvent.click(screen.getByTestId('upload-organisation-source-btn'));

    await waitFor(() => {
      const suppUploadAttempted = mockStorageUpload.mock.calls.some(([path]) =>
        String(path).includes('supp-'),
      );
      expect(suppUploadAttempted).toBe(true);
    });
  });
});

describe('T-2025-06: Exact inline context-save error UX (no browser alerts)', () => {
  it('does not call window.alert/confirm/prompt on organisation source upload failure and renders the error inline instead', async () => {
    configureScenario({
      org: baseOrg(),
      initialDocs: [],
      primaryUploadFailPathMatch: 'will-fail.pdf',
    });
    const { container } = renderOrganisationContextPage();
    await screen.findByTestId('organisation-source-upload');

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    const promptSpy = vi.spyOn(window, 'prompt').mockImplementation(() => null);

    const primaryInput = container.querySelector('#context-source-file') as HTMLInputElement;
    fireEvent.change(primaryInput, {
      target: { files: [makeFile('will-fail.pdf', 'application/pdf')] },
    });
    fireEvent.click(screen.getByTestId('upload-organisation-source-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('organisation-source-upload').textContent ?? '').toMatch(
        /storage upload failed/i,
      );
    });

    expect(alertSpy).not.toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(promptSpy).not.toHaveBeenCalled();

    alertSpy.mockRestore();
    confirmSpy.mockRestore();
    promptSpy.mockRestore();
  });
});

describe('T-2025-07: RLS/storage isolation/security regression (regression guard — expected to remain GREEN)', () => {
  it('scopes organisation source document queries to the authenticated organisation and never renders another organisation\'s documents', async () => {
    const org = baseOrg('org-aaa');
    configureScenario({
      org,
      initialDocs: [
        {
          id: 'doc-own',
          organisation_id: 'org-aaa',
          scope_type: 'organisation_context',
          archived_at: null,
          title: null,
          file_name: 'own-doc.pdf',
          processing_status: 'completed',
          chunk_count: 2,
          processing_error: null,
          tags: [],
          created_at: '2026-01-01T00:00:00.000Z',
          storage_bucket: 'mmm-subject-knowledge',
          storage_path: 'org-aaa/user-1/own-doc.pdf',
        },
        {
          id: 'doc-foreign',
          organisation_id: 'org-bbb',
          scope_type: 'organisation_context',
          archived_at: null,
          title: null,
          file_name: 'foreign-doc.pdf',
          processing_status: 'completed',
          chunk_count: 5,
          processing_error: null,
          tags: [],
          created_at: '2026-01-02T00:00:00.000Z',
          storage_bucket: 'mmm-subject-knowledge',
          storage_path: 'org-bbb/user-2/foreign-doc.pdf',
        },
      ],
    });

    renderOrganisationContextPage();
    await screen.findByTestId('organisation-source-upload');

    await waitFor(() => {
      expect(screen.getByText(/own-doc\.pdf/i)).toBeTruthy();
    });
    expect(screen.queryByText(/foreign-doc\.pdf/i)).toBeNull();
  });
});

describe('T-2025-08: Existing single-primary-document happy path (regression guard — expected to remain GREEN)', () => {
  it('uploads a single primary source document successfully end-to-end as today', async () => {
    configureScenario({ org: baseOrg(), initialDocs: [], reprocessMode: 'success' });
    const { container } = renderOrganisationContextPage();
    await screen.findByTestId('organisation-source-upload');

    const primaryInput = container.querySelector('#context-source-file') as HTMLInputElement;
    fireEvent.change(primaryInput, {
      target: {
        files: [
          makeFile(
            'annual-strategy.docx',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ),
        ],
      },
    });
    fireEvent.click(screen.getByTestId('upload-organisation-source-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('organisation-source-upload').textContent ?? '').toMatch(
        /finished successfully/i,
      );
    });

    expect(mockStorageUpload).toHaveBeenCalled();
    expect(mockInvoke).toHaveBeenCalledWith(
      'mmm-subject-knowledge-reprocess',
      expect.anything(),
    );
  });
});
