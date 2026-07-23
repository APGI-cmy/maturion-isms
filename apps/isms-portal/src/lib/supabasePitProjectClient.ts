import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  createSupabasePitProjectRepository,
  type CreatePitProjectInput,
  type PitProjectAuthContext,
  type PitProjectDatabaseClient,
  type PitProjectRecord,
  type PitProjectRepository,
  type PitProjectRole,
  type UpdatePitProjectInput,
} from './pitProjectRepository';

const ROLE_PRIORITY: PitProjectRole[] = [
  'cs2_admin',
  'org_admin',
  'project_manager',
  'team_leader',
  'contributor',
  'viewer',
];

interface ProjectRpcRow {
  id: string;
  org_id: string;
  name: string;
  type: PitProjectRecord['type'];
  quick_win_type: PitProjectRecord['quickWinType'];
  description: string | null;
  project_leader_id: string;
  project_leader_label: string;
  start_date: string;
  end_date: string;
  status: PitProjectRecord['status'];
  capex_amount: number | null;
  opex_amount: number | null;
  fiscal_year: string | null;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  source_type?: PitProjectRecord['sourceType'] | null;
  source_ref?: string | null;
  source_links?: Array<{ source_type: PitProjectRecord['sourceType']; source_ref: string | null }>;
}

function mapProject(row: ProjectRpcRow): PitProjectRecord {
  const source = row.source_links?.[0];
  return {
    id: row.id,
    orgId: row.org_id,
    name: row.name,
    type: row.type,
    quickWinType: row.quick_win_type,
    description: row.description ?? '',
    projectLeaderId: row.project_leader_id,
    projectLeaderLabel: row.project_leader_label,
    startDate: row.start_date,
    endDate: row.end_date,
    sourceType: row.source_type ?? source?.source_type ?? 'manual',
    sourceRef: row.source_ref ?? source?.source_ref ?? null,
    capexAmount: row.capex_amount,
    opexAmount: row.opex_amount,
    fiscalYear: row.fiscal_year,
    status: row.status,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function errorMessage(error: { message?: string } | null, fallback: string): string {
  return error?.message || fallback;
}

function browserSupabaseConfiguration(): { url: string; key: string } {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    ?? import.meta.env.VITE_SUPABASE_ANON_KEY
  ) as string | undefined;

  if (!url || !key) {
    throw new Error('PIT Supabase is not configured for this deployment');
  }

  return { url, key };
}

class SupabasePitProjectDatabaseClient implements PitProjectDatabaseClient {
  constructor(private readonly supabase: SupabaseClient) {}

  async resolveAuthContext(): Promise<PitProjectAuthContext | null> {
    const { data: sessionData, error: sessionError } = await this.supabase.auth.getSession();
    if (sessionError) throw new Error(errorMessage(sessionError, 'Unable to restore the Supabase session'));
    const userId = sessionData.session?.user.id;
    if (!userId) return null;

    const { data: memberships, error: membershipError } = await this.supabase
      .from('user_org_memberships')
      .select('org_id')
      .eq('user_id', userId)
      .eq('status', 'active');
    if (membershipError) throw new Error(errorMessage(membershipError, 'Unable to resolve organisation membership'));
    if (!memberships || memberships.length !== 1) return null;

    const orgId = String(memberships[0].org_id);
    const { data: roles, error: roleError } = await this.supabase
      .from('user_roles')
      .select('role, org_id')
      .eq('user_id', userId)
      .or(`org_id.eq.${orgId},and(role.eq.cs2_admin,org_id.is.null)`);
    if (roleError) throw new Error(errorMessage(roleError, 'Unable to resolve PIT role'));

    const effectiveRole = ROLE_PRIORITY.find((candidate) =>
      roles?.some((entry) => entry.role === candidate),
    );
    if (!effectiveRole) return null;

    return { userId, orgId, role: effectiveRole };
  }

  async listProjects(context: PitProjectAuthContext): Promise<PitProjectRecord[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*, source_links(source_type, source_ref)')
      .eq('org_id', context.orgId)
      .is('archived_at', null)
      .order('created_at', { ascending: false });
    if (error) throw new Error(errorMessage(error, 'Unable to load PIT projects'));
    return (data as ProjectRpcRow[] | null ?? []).map(mapProject);
  }

  async getProject(projectId: string, context: PitProjectAuthContext): Promise<PitProjectRecord | null> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*, source_links(source_type, source_ref)')
      .eq('id', projectId)
      .eq('org_id', context.orgId)
      .is('archived_at', null)
      .maybeSingle();
    if (error) throw new Error(errorMessage(error, 'Unable to load the PIT project'));
    return data ? mapProject(data as ProjectRpcRow) : null;
  }

  async createProject(input: CreatePitProjectInput, context: PitProjectAuthContext): Promise<PitProjectRecord> {
    const { data, error } = await this.supabase.rpc('pit_create_project', {
      p_org_id: context.orgId,
      p_name: input.name.trim(),
      p_type: input.type,
      p_quick_win_type: input.quickWinType,
      p_description: input.description.trim(),
      p_project_leader_label: input.projectLeaderLabel.trim(),
      p_start_date: input.startDate,
      p_end_date: input.endDate,
      p_source_type: input.sourceType,
      p_source_ref: input.sourceType === 'manual' ? null : input.sourceRef?.trim() || null,
      p_capex_amount: input.capexAmount ?? null,
      p_opex_amount: input.opexAmount ?? null,
      p_fiscal_year: input.fiscalYear?.trim() || null,
    });
    if (error) throw new Error(errorMessage(error, 'Unable to create the PIT project'));
    return mapProject(data as ProjectRpcRow);
  }

  async updateProject(projectId: string, input: UpdatePitProjectInput, context: PitProjectAuthContext): Promise<PitProjectRecord> {
    const { data, error } = await this.supabase.rpc('pit_update_project', {
      p_project_id: projectId,
      p_org_id: context.orgId,
      p_patch: input,
    });
    if (error) throw new Error(errorMessage(error, 'Unable to update the PIT project'));
    return mapProject(data as ProjectRpcRow);
  }
}

let repository: PitProjectRepository | null = null;
let configurationError: Error | null = null;

export function getPitProjectRepository(): PitProjectRepository {
  if (repository) return repository;
  if (configurationError) throw configurationError;

  try {
    const { url, key } = browserSupabaseConfiguration();
    const supabase = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    repository = createSupabasePitProjectRepository(new SupabasePitProjectDatabaseClient(supabase));
    return repository;
  } catch (error) {
    configurationError = error instanceof Error ? error : new Error('PIT Supabase is not configured for this deployment');
    throw configurationError;
  }
}

export function createPitSupabaseClient(): SupabaseClient {
  const { url, key } = browserSupabaseConfiguration();
  return createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}
