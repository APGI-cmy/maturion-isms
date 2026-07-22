export type PitProjectType = 'project' | 'operational' | 'improvement';
export type PitQuickWinType = 'quick_win' | 'medium_term' | 'long_term';
export type PitProjectSourceType = 'manual' | 'risk' | 'audit' | 'incident' | 'roadmap';
export type PitProjectStatus = 'active' | 'paused' | 'completed' | 'archived';
export type PitProjectRole = 'viewer' | 'contributor' | 'team_leader' | 'project_manager' | 'org_admin' | 'cs2_admin';

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
  createdBy: string;
  updatedBy: string;
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

export type UpdatePitProjectInput = Partial<Pick<CreatePitProjectInput,
  'name' | 'type' | 'quickWinType' | 'description' | 'projectLeaderLabel' |
  'startDate' | 'endDate' | 'sourceType' | 'sourceRef' | 'capexAmount' |
  'opexAmount' | 'fiscalYear'>> & { status?: PitProjectStatus };

export interface PitProjectAuthContext {
  userId: string;
  orgId: string;
  role: PitProjectRole;
}

export interface PitProjectDatabaseClient {
  resolveAuthContext(): Promise<PitProjectAuthContext | null>;
  listProjects(context: PitProjectAuthContext): Promise<PitProjectRecord[]>;
  getProject(projectId: string, context: PitProjectAuthContext): Promise<PitProjectRecord | null>;
  createProject(input: CreatePitProjectInput, context: PitProjectAuthContext): Promise<PitProjectRecord>;
  updateProject(projectId: string, input: UpdatePitProjectInput, context: PitProjectAuthContext): Promise<PitProjectRecord>;
}

export interface PitProjectRepository {
  readonly compatibilityBoundary: {
    mode: 'read-only-browser-local';
    claimsMigrated: false;
  };
  list(): Promise<PitProjectRecord[]>;
  getById(projectId: string): Promise<PitProjectRecord | null>;
  create(input: CreatePitProjectInput): Promise<PitProjectRecord>;
  update(projectId: string, input: UpdatePitProjectInput): Promise<PitProjectRecord>;
}

const CREATOR_ROLES = new Set<PitProjectRole>(['contributor', 'team_leader', 'project_manager', 'org_admin', 'cs2_admin']);
const UPDATE_ROLES = new Set<PitProjectRole>(['team_leader', 'project_manager', 'org_admin', 'cs2_admin']);
const PROJECT_TYPES = new Set<PitProjectType>(['project', 'operational', 'improvement']);
const QUICK_WIN_TYPES = new Set<PitQuickWinType>(['quick_win', 'medium_term', 'long_term']);
const SOURCE_TYPES = new Set<PitProjectSourceType>(['manual', 'risk', 'audit', 'incident', 'roadmap']);
const PROJECT_STATUSES = new Set<PitProjectStatus>(['active', 'paused', 'completed', 'archived']);

function assertValidDate(value: string, field: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`${field} must be a valid date`);
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`${field} must be a valid date`);
  }
}

function isNonNegativeFiniteNumber(value: number | null | undefined): boolean {
  return value == null || (Number.isFinite(value) && value >= 0);
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

function validateUpdateInput(input: UpdatePitProjectInput): void {
  if (input.name !== undefined && !input.name.trim()) throw new Error('Project name is required');
  if (input.type !== undefined && !PROJECT_TYPES.has(input.type)) throw new Error('Project type is invalid');
  if (input.quickWinType !== undefined && !QUICK_WIN_TYPES.has(input.quickWinType)) throw new Error('Quick-win classification is invalid');
  if (input.sourceType !== undefined && !SOURCE_TYPES.has(input.sourceType)) throw new Error('Project source type is invalid');
  if (input.status !== undefined && !PROJECT_STATUSES.has(input.status)) throw new Error('Project status is invalid');
  if (input.startDate !== undefined) assertValidDate(input.startDate, 'Start date');
  if (input.endDate !== undefined) assertValidDate(input.endDate, 'End date');
  if (input.startDate && input.endDate && input.endDate < input.startDate) {
    throw new Error('End date must be on or after the start date');
  }
  if (!isNonNegativeFiniteNumber(input.capexAmount)) throw new Error('CAPEX must be a non-negative number');
  if (!isNonNegativeFiniteNumber(input.opexAmount)) throw new Error('OPEX must be a non-negative number');
}

async function requireContext(client: PitProjectDatabaseClient): Promise<PitProjectAuthContext> {
  const context = await client.resolveAuthContext();
  if (!context?.userId || !context.orgId) {
    throw new Error('An authenticated user with an active organisation membership is required');
  }
  return context;
}

export function createSupabasePitProjectRepository(client: PitProjectDatabaseClient): PitProjectRepository {
  return {
    compatibilityBoundary: { mode: 'read-only-browser-local', claimsMigrated: false },
    async list() {
      const context = await requireContext(client);
      return client.listProjects(context);
    },
    async getById(projectId) {
      if (!projectId.trim()) throw new Error('Project id is required');
      const context = await requireContext(client);
      return client.getProject(projectId, context);
    },
    async create(input) {
      const context = await requireContext(client);
      if (!CREATOR_ROLES.has(context.role)) throw new Error('Your role is not permitted to create PIT projects');
      validatePitProjectInput(input);
      return client.createProject(input, context);
    },
    async update(projectId, input) {
      if (!projectId.trim()) throw new Error('Project id is required');
      const context = await requireContext(client);
      if (!UPDATE_ROLES.has(context.role)) throw new Error('Your role is not permitted to update PIT projects');
      validateUpdateInput(input);
      return client.updateProject(projectId, input, context);
    },
  };
}

export type PitProjectDetailState = 'loading' | 'denied' | 'error' | 'not-found' | 'data';

export function resolvePitProjectDetailState(input: {
  loading?: boolean;
  denied?: boolean;
  error?: Error | null;
  project?: PitProjectRecord | null;
}): PitProjectDetailState {
  if (input.loading) return 'loading';
  if (input.denied) return 'denied';
  if (input.error) return 'error';
  if (!input.project) return 'not-found';
  return 'data';
}
