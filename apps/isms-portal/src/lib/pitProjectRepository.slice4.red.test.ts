import { describe, expect, it, vi } from 'vitest';
import {
  createSupabasePitProjectRepository,
  resolvePitProjectDetailState,
  validatePitProjectInput,
  type PitProjectAuthContext,
  type PitProjectDatabaseClient,
  type PitProjectRecord,
} from './pitProjectRepository';

const validInput = {
  name: 'Improve access control',
  type: 'improvement' as const,
  quickWinType: 'quick_win' as const,
  description: 'Implement the controlled access improvement plan.',
  projectLeaderLabel: 'Project Manager',
  startDate: '2026-07-22',
  endDate: '2026-08-31',
  sourceType: 'risk' as const,
  sourceRef: 'RISK-004',
  capexAmount: 50_000,
  opexAmount: 20_000,
  fiscalYear: '2026',
};

const creator: PitProjectAuthContext = {
  userId: '00000000-0000-4000-8000-000000000001',
  orgId: '00000000-0000-4000-8000-000000000010',
  role: 'project_manager',
};

const record: PitProjectRecord = {
  id: '00000000-0000-4000-8000-000000000100',
  orgId: creator.orgId,
  name: validInput.name,
  type: validInput.type,
  quickWinType: validInput.quickWinType,
  description: validInput.description,
  projectLeaderId: creator.userId,
  projectLeaderLabel: validInput.projectLeaderLabel,
  startDate: validInput.startDate,
  endDate: validInput.endDate,
  sourceType: validInput.sourceType,
  sourceRef: validInput.sourceRef,
  capexAmount: validInput.capexAmount,
  opexAmount: validInput.opexAmount,
  fiscalYear: validInput.fiscalYear,
  status: 'active',
  createdBy: creator.userId,
  updatedBy: creator.userId,
  createdAt: '2026-07-22T08:30:00.000Z',
  updatedAt: '2026-07-22T08:30:00.000Z',
};

function controlledClient(overrides: Partial<PitProjectDatabaseClient> = {}): PitProjectDatabaseClient {
  return {
    resolveAuthContext: vi.fn(async () => creator),
    listProjects: vi.fn(async () => [record]),
    getProject: vi.fn(async () => record),
    createProject: vi.fn(async () => record),
    updateProject: vi.fn(async () => record),
    ...overrides,
  };
}

describe('PIT Stage 12 Slice 4 QA-to-RED repository contract', () => {
  it('PIT-S4-RED-REPO-001 creates exactly one Supabase project', async () => {
    const client = controlledClient();
    const repository = createSupabasePitProjectRepository(client);
    const created = await repository.create(validInput);
    expect(created.id).toBe(record.id);
    expect(client.createProject).toHaveBeenCalledTimes(1);
    expect(client.createProject).toHaveBeenCalledWith(validInput, creator);
  });

  it('PIT-S4-RED-REPO-002 lists only organisation-scoped Supabase projects', async () => {
    const client = controlledClient();
    const repository = createSupabasePitProjectRepository(client);
    await expect(repository.list()).resolves.toEqual([record]);
    expect(client.listProjects).toHaveBeenCalledWith(creator);
  });

  it('PIT-S4-RED-REPO-003 loads a permitted project detail record', async () => {
    const client = controlledClient();
    const repository = createSupabasePitProjectRepository(client);
    await expect(repository.getById(record.id)).resolves.toEqual(record);
    expect(client.getProject).toHaveBeenCalledWith(record.id, creator);
  });

  it('PIT-S4-RED-REPO-004 persists authorised updates', async () => {
    const updated = { ...record, name: 'Updated project', updatedAt: '2026-07-22T09:00:00.000Z' };
    const client = controlledClient({ updateProject: vi.fn(async () => updated) });
    const repository = createSupabasePitProjectRepository(client);
    await expect(repository.update(record.id, { name: updated.name })).resolves.toEqual(updated);
    expect(client.updateProject).toHaveBeenCalledWith(record.id, { name: updated.name }, creator);
  });

  it('PIT-S4-RED-VALID-001 rejects invalid date order before any write', async () => {
    const client = controlledClient();
    const repository = createSupabasePitProjectRepository(client);
    await expect(repository.create({ ...validInput, startDate: '2026-09-01', endDate: '2026-08-31' })).rejects.toThrow('End date');
    expect(client.createProject).not.toHaveBeenCalled();
  });

  it('PIT-S4-RED-VALID-002 rejects invalid source state without partial writes', () => {
    expect(() => validatePitProjectInput({ ...validInput, sourceRef: '' })).toThrow('source reference');
  });

  it('PIT-S4-RED-AUTH-001 fails closed without an authenticated membership context', async () => {
    const client = controlledClient({ resolveAuthContext: vi.fn(async () => null) });
    const repository = createSupabasePitProjectRepository(client);
    await expect(repository.list()).rejects.toThrow('authenticated');
    expect(client.listProjects).not.toHaveBeenCalled();
  });

  it('PIT-S4-RED-RLS-004 blocks viewer mutations before the database call', async () => {
    const viewerContext: PitProjectAuthContext = { ...creator, role: 'viewer' };
    const client = controlledClient({ resolveAuthContext: vi.fn(async () => viewerContext) });
    const repository = createSupabasePitProjectRepository(client);
    await expect(repository.create(validInput)).rejects.toThrow('not permitted');
    expect(client.createProject).not.toHaveBeenCalled();
  });

  it('PIT-S4-RED-STATE-001 resolves deterministic detail route states', () => {
    expect(resolvePitProjectDetailState({ loading: true })).toBe('loading');
    expect(resolvePitProjectDetailState({ denied: true })).toBe('denied');
    expect(resolvePitProjectDetailState({ error: new Error('network') })).toBe('error');
    expect(resolvePitProjectDetailState({ project: null })).toBe('not-found');
    expect(resolvePitProjectDetailState({ project: record })).toBe('data');
  });

  it('PIT-S4-RED-COMPAT-001 keeps browser-local records outside production truth', async () => {
    const repository = createSupabasePitProjectRepository(controlledClient());
    expect(repository.compatibilityBoundary.mode).toBe('read-only-browser-local');
    expect(repository.compatibilityBoundary.claimsMigrated).toBe(false);
  });
});
