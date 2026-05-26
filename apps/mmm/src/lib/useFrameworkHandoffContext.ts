import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface FrameworkHandoffRecord {
  id: string;
  name: string;
  status: string | null;
}

export interface FrameworkHandoffDomain {
  id: string;
  code: string | null;
  name: string | null;
  sort_order: number;
}

export interface FrameworkHandoffDomainMetrics {
  mpsCount: number;
  criteriaCount: number;
}

export interface FrameworkHandoffContext {
  framework: FrameworkHandoffRecord | undefined;
  isLoading: boolean;
  isError: boolean;
  domains: FrameworkHandoffDomain[] | undefined;
  domainsLoading: boolean;
  domainsError: boolean;
  domainMetrics: Record<string, FrameworkHandoffDomainMetrics>;
  domainMetricsLoading: boolean;
  domainMetricsError: boolean;
  domainApprovalStatus: Record<string, { status: string; locked: boolean }>;
}

function toNullableString(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return null;
}

function toRequiredString(value: unknown, fallback: string): string {
  return toNullableString(value) ?? fallback;
}

function toSortOrder(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

/**
 * MMM typed data-access boundary for the `/assessment/framework` handoff page.
 * Fetches the compiled framework header and its resolved domains.
 * Satisfies Stage 5 integration contract: page components must not own direct
 * Supabase table access (TR-022, TR-027).
 *
 * @param frameworkId - The framework UUID from the compile-handoff URL query string.
 */
export function useFrameworkHandoffContext(frameworkId: string | null): FrameworkHandoffContext {
  const {
    data: framework,
    isLoading,
    isError,
  } = useQuery<FrameworkHandoffRecord>({
    queryKey: ['framework-handoff', frameworkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mmm_frameworks')
        .select('id, name, status')
        .eq('id', frameworkId!)
        .single();
      if (error) throw new Error(error.message);
      return {
        id: toRequiredString((data as { id?: unknown } | null)?.id, frameworkId!),
        name: toRequiredString((data as { name?: unknown } | null)?.name, 'Untitled Framework'),
        status: toNullableString((data as { status?: unknown } | null)?.status),
      };
    },
    enabled: !!frameworkId,
  });

  const {
    data: domains,
    isLoading: domainsLoading,
    isError: domainsError,
  } = useQuery<FrameworkHandoffDomain[]>({
    queryKey: ['framework-handoff-domains', frameworkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mmm_domains')
        .select('id, name, code, sort_order')
        .eq('framework_id', frameworkId!)
        .order('sort_order');
      if (error) throw new Error(error.message);
      const rows = (data ?? []) as Array<{
        id?: unknown;
        name?: unknown;
        code?: unknown;
        sort_order?: unknown;
      }>;
      return rows
        .map((row, index) => ({
          id: toRequiredString(row.id, ''),
          name: toNullableString(row.name),
          code: toNullableString(row.code),
          sort_order: toSortOrder(row.sort_order, index + 1),
        }))
        .filter((row) => row.id.length > 0);
    },
    enabled: !!frameworkId && !!framework,
  });

  const {
    data: domainMetrics = {},
    isLoading: domainMetricsLoading,
    isError: domainMetricsError,
  } = useQuery<Record<string, FrameworkHandoffDomainMetrics>>({
    queryKey: [
      'framework-handoff-domain-metrics',
      frameworkId,
      (domains ?? []).map((domain) => domain.id).join(','),
    ],
    queryFn: async () => {
      const domainIds = (domains ?? []).map((domain) => domain.id);
      if (domainIds.length === 0) {
        return {};
      }

      const metricMap: Record<string, FrameworkHandoffDomainMetrics> = {};
      for (const domainId of domainIds) {
        metricMap[domainId] = { mpsCount: 0, criteriaCount: 0 };
      }

      const { data: mpsRows, error: mpsError } = await supabase
        .from('mmm_maturity_process_steps')
        .select('id, domain_id')
        .in('domain_id', domainIds);
      if (mpsError) {
        throw new Error(mpsError.message);
      }

      const mpsList = (mpsRows ?? []) as Array<{ id: string; domain_id: string }>;
      for (const mps of mpsList) {
        if (metricMap[mps.domain_id]) {
          metricMap[mps.domain_id].mpsCount += 1;
        }
      }

      const mpsIds = mpsList.map((mps) => mps.id);
      if (mpsIds.length === 0) {
        return metricMap;
      }

      const domainIdByMpsId = new Map<string, string>();
      for (const mps of mpsList) {
        domainIdByMpsId.set(mps.id, mps.domain_id);
      }

      const { data: criteriaRows, error: criteriaError } = await supabase
        .from('mmm_criteria')
        .select('id, mps_id')
        .in('mps_id', mpsIds);
      if (criteriaError) {
        throw new Error(criteriaError.message);
      }

      for (const criterion of (criteriaRows ?? []) as Array<{ id: string; mps_id: string }>) {
        const domainId = domainIdByMpsId.get(criterion.mps_id);
        if (domainId && metricMap[domainId]) {
          metricMap[domainId].criteriaCount += 1;
        }
      }

      return metricMap;
    },
    enabled: !!frameworkId && !!domains,
  });

  const { data: domainApprovalStatus = {} } = useQuery<Record<string, { status: string; locked: boolean }>>({
    queryKey: ['framework-handoff-domain-approval-status', frameworkId, (domains ?? []).map((d) => d.id).join(',')],
    queryFn: async () => {
      const domainIds = (domains ?? []).map((domain) => domain.id);
      if (domainIds.length === 0) return {};

      const { data, error } = await supabase
        .from('mmm_domain_approval_requests')
        .select('domain_id,status,locked')
        .in('domain_id', domainIds);
      if (error) throw new Error(error.message);

      return ((data ?? []) as Array<{ domain_id: string; status: string; locked: boolean }>).reduce(
        (acc, row) => {
          acc[row.domain_id] = { status: row.status, locked: row.locked };
          return acc;
        },
        {} as Record<string, { status: string; locked: boolean }>,
      );
    },
    enabled: !!frameworkId && !!domains,
  });

  return {
    framework,
    isLoading,
    isError,
    domains,
    domainsLoading,
    domainsError,
    domainMetrics,
    domainMetricsLoading,
    domainMetricsError,
    domainApprovalStatus,
  };
}
