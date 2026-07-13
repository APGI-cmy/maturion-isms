export type PitProjectType = 'project' | 'operational' | 'improvement';
export type PitQuickWinType = 'quick_win' | 'medium_term' | 'long_term';
export type PitProjectSourceType = 'manual' | 'risk' | 'audit' | 'incident' | 'roadmap';
export type PitProjectStatus = 'active';

export interface PitProjectRecord {
  id: string;
  orgId: string;
  name: string;
  type: PitProjectType;
  quickWinType: PitQuickWinType;
  description: string;
  projectLeaderId: string;
  projectLeaderLabel: string;
  startDate: string;
  endDate: string;
  sourceType: PitProjectSourceType;
  sourceRef: string | null;
  capexAmount: number | null;
  opexAmount: number | null;
  fiscalYear: string | null;
  status: PitProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePitProjectInput {
  name: string;
  type: PitProjectType;
  quickWinType: PitQuickWinType;
  description: string;
  projectLeaderLabel: string;
  startDate: string;
  endDate: string;
  sourceType: PitProjectSourceType;
  sourceRef?: string;
  capexAmount?: number | null;
  opexAmount?: number | null;
  fiscalYear?: string;
}

export interface PitProjectActor {
  id: string;
  email: string;
  role: string;
  orgId?: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const PIT_PROJECT_STORAGE_KEY = 'pit_slice3_projects_v1';

const CREATOR_ROLES = new Set(['contributor', 'team_leader', 'project_manager', 'org_admin', 'cs2_admin']);
const PROJECT_TYPES = new Set<PitProjectType>(['project', 'operational', 'improvement']);
const QUICK_WIN_TYPES = new Set<PitQuickWinType>(['quick_win', 'medium_term', 'long_term']);
const SOURCE_TYPES = new Set<PitProjectSourceType>(['manual', 'risk', 'audit', 'incident', 'roadmap']);

function defaultStorage(): StorageLike {
  if (typeof window === 'undefined' || !window.localStorage) {
    throw new Error('PIT project persistence requires browser storage');
  }
  return window.localStorage;
}

function isNonNegativeFiniteNumber(value: number | null | undefined): boolean {
  return value == null || (Number.isFinite(value) && value >= 0);
}

function assertValidDate(value: string, field: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${field} must be a valid date`);
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`${field} must be a valid date`);
  }
}

export function validatePitProjectInput(input: CreatePitProjectInput): void {
  if (!input.name.trim()) throw new Error('Project name is required');
  if (!PROJECT_TYPES.has(input.type)) throw new Error('Project type is invalid');
  if (!QUICK_WIN_TYPES.has(input.quickWinType)) throw new Error('Quick-win classification is invalid');
  if (!input.projectLeaderLabel.trim()) throw new Error('Project leader is required');
  if (!SOURCE_TYPES.has(input.sourceType)) throw new Error('Project source type is invalid');
  assertValidDate(input.startDate, 'Start date');
  assertValidDate(input.endDate, 'End date');
  if (input.endDate < input.startDate) throw new Error('End date must be on or after the start date');
  if (input.sourceType !== 'manual' && !input.sourceRef?.trim()) {
    throw new Error('A source reference is required for the selected source type');
  }
  if (!isNonNegativeFiniteNumber(input.capexAmount)) throw new Error('CAPEX must be a non-negative number');
  if (!isNonNegativeFiniteNumber(input.opexAmount)) throw new Error('OPEX must be a non-negative number');
}

function isPitProjectRecord(value: unknown): value is PitProjectRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<PitProjectRecord>;
  return (
    typeof record.id === 'string' && typeof record.orgId === 'string' && typeof record.name === 'string' &&
    PROJECT_TYPES.has(record.type as PitProjectType) && QUICK_WIN_TYPES.has(record.quickWinType as PitQuickWinType) &&
    typeof record.description === 'string' && typeof record.projectLeaderId === 'string' &&
    typeof record.projectLeaderLabel === 'string' && typeof record.startDate === 'string' &&
    typeof record.endDate === 'string' && SOURCE_TYPES.has(record.sourceType as PitProjectSourceType) &&
    (record.sourceRef === null || typeof record.sourceRef === 'string') &&
    (record.capexAmount === null || typeof record.capexAmount === 'number') &&
    (record.opexAmount === null || typeof record.opexAmount === 'number') &&
    (record.fiscalYear === null || typeof record.fiscalYear === 'string') && record.status === 'active' &&
    typeof record.createdAt === 'string' && typeof record.updatedAt === 'string'
  );
}

function readStoredProjects(storage: StorageLike): PitProjectRecord[] {
  const raw = storage.getItem(PIT_PROJECT_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isPitProjectRecord);
  } catch {
    return [];
  }
}

function createProjectId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `pit-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function listPitProjects(storage: StorageLike = defaultStorage()): PitProjectRecord[] {
  return readStoredProjects(storage).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createPitProject(
  input: CreatePitProjectInput,
  actor: PitProjectActor,
  storage: StorageLike = defaultStorage(),
): PitProjectRecord {
  if (!CREATOR_ROLES.has(actor.role)) throw new Error('Your role is not permitted to create PIT projects');
  validatePitProjectInput(input);
  const now = new Date().toISOString();
  const record: PitProjectRecord = {
    id: createProjectId(), orgId: actor.orgId || 'mock-org', name: input.name.trim(), type: input.type,
    quickWinType: input.quickWinType, description: input.description.trim(), projectLeaderId: actor.id,
    projectLeaderLabel: input.projectLeaderLabel.trim(), startDate: input.startDate, endDate: input.endDate,
    sourceType: input.sourceType, sourceRef: input.sourceType === 'manual' ? null : input.sourceRef?.trim() || null,
    capexAmount: input.capexAmount ?? null, opexAmount: input.opexAmount ?? null,
    fiscalYear: input.fiscalYear?.trim() || null, status: 'active', createdAt: now, updatedAt: now,
  };
  const projects = readStoredProjects(storage);
  storage.setItem(PIT_PROJECT_STORAGE_KEY, JSON.stringify([...projects, record]));
  return record;
}

export function clearPitProjects(storage: StorageLike = defaultStorage()): void {
  storage.removeItem(PIT_PROJECT_STORAGE_KEY);
}
