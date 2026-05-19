import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface FrameworkHandoffRecord {
  id: string;
  name: string;
  status: string;
}

export interface FrameworkHandoffDomain {
  id: string;
  code: string;
  name: string;
  sort_order: number;
}

export interface FrameworkHandoffContext {
  framework: FrameworkHandoffRecord | undefined;
  isLoading: boolean;
  isError: boolean;
  domains: FrameworkHandoffDomain[] | undefined;
  domainsLoading: boolean;
  domainsError: boolean;
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
      return data as FrameworkHandoffRecord;
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
      return (data ?? []) as FrameworkHandoffDomain[];
    },
    enabled: !!frameworkId && !!framework,
  });

  return { framework, isLoading, isError, domains, domainsLoading, domainsError };
}
