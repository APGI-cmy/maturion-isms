import { beforeEach, describe, expect, it } from 'vitest';
import { PIT_PROJECT_STORAGE_KEY, createPitProject, listPitProjects, type CreatePitProjectInput, type StorageLike } from './pitProjectPersistence';

class MemoryStorage implements StorageLike {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

const actor = { id: 'user-1', email: 'project-manager@example.com', role: 'project_manager', orgId: 'org-1' };
const validInput: CreatePitProjectInput = {
  name: 'Improve access control', type: 'improvement', quickWinType: 'quick_win',
  description: 'Implement the controlled access improvement plan.', projectLeaderLabel: 'Project Manager',
  startDate: '2026-07-14', endDate: '2026-08-31', sourceType: 'risk', sourceRef: 'RISK-004',
  capexAmount: 50000, opexAmount: 20000, fiscalYear: '2026',
};

let storage: MemoryStorage;
beforeEach(() => { storage = new MemoryStorage(); });

describe('PIT Stage 12 Slice 3 project persistence', () => {
  it('creates one project and returns it from the register adapter', () => {
    const created = createPitProject(validInput, actor, storage);
    const projects = listPitProjects(storage);
    expect(projects).toHaveLength(1);
    expect(projects[0].id).toBe(created.id);
    expect(projects[0].orgId).toBe('org-1');
  });

  it('retains project classifications and financial context', () => {
    createPitProject(validInput, actor, storage);
    const [project] = listPitProjects(storage);
    expect(project.type).toBe('improvement');
    expect(project.quickWinType).toBe('quick_win');
    expect(project.sourceRef).toBe('RISK-004');
    expect(project.capexAmount).toBe(50000);
    expect(project.opexAmount).toBe(20000);
  });

  it('rejects invalid date order without writing', () => {
    expect(() => createPitProject({ ...validInput, startDate: '2026-09-01', endDate: '2026-08-31' }, actor, storage)).toThrow('End date');
    expect(listPitProjects(storage)).toEqual([]);
  });

  it('rejects viewer writes', () => {
    expect(() => createPitProject(validInput, { ...actor, role: 'viewer' }, storage)).toThrow('not permitted');
    expect(listPitProjects(storage)).toEqual([]);
  });

  it('requires a source reference for non-manual sources', () => {
    expect(() => createPitProject({ ...validInput, sourceRef: '' }, actor, storage)).toThrow('source reference');
  });

  it('fails safely for malformed browser storage', () => {
    storage.setItem(PIT_PROJECT_STORAGE_KEY, '{not-json');
    expect(listPitProjects(storage)).toEqual([]);
  });
});
