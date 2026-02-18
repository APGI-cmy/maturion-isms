/**
 * Custom hook for fetching audit metrics from Supabase
 * FRS: FR-039 (Global Dashboard)
 * TRS: TR-033 (Dashboard Components), TR-016 (Supabase Integration)
 * Task: 5.6.1 (Dashboard Data Fetching)
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

export interface AuditMetrics {
  totalAudits: number;
  completionRate: number;
  averageMaturity: number;
  inProgressAudits: number;
  completedAudits: number;
}

/**
 * Fetches aggregated audit metrics from Supabase
 * - Total audits count (excludes soft-deleted)
 * - Completion rate calculation (completed / total)
 * - Average maturity score from audit_scores table
 * - Status breakdown (in_progress, completed)
 */
export function useAuditMetrics() {
  return useQuery<AuditMetrics, Error>({
    queryKey: ['audit-metrics'],
    queryFn: async () => {
      // Fetch total audits count (excluding soft-deleted)
      const { count: totalAudits, error: auditCountError } = await supabase
        .from('audits')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null);

      if (auditCountError) {
        throw new Error(`Failed to fetch audit count: ${auditCountError.message}`);
      }

      // Fetch completed audits count
      const { count: completedAudits, error: completedError} = await supabase
        .from('audits')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .is('deleted_at', null);

      if (completedError) {
        throw new Error(`Failed to fetch completed audits: ${completedError.message}`);
      }

      // Fetch in-progress audits count
      const { count: inProgressAudits, error: inProgressError } = await supabase
        .from('audits')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_progress')
        .is('deleted_at', null);

      if (inProgressError) {
        throw new Error(`Failed to fetch in-progress audits: ${inProgressError.message}`);
      }

      // Calculate completion rate
      const completionRate = totalAudits && totalAudits > 0
        ? Math.round((completedAudits || 0) / totalAudits * 100)
        : 0;

      // Fetch average maturity score
      // Note: audit_scores table may not exist yet in schema
      // Using a safe query that returns 0.0 if table doesn't exist
      let averageMaturity = 0.0;
      try {
        const { data: scoresData, error: scoresError } = await supabase
          .from('audit_scores')
          .select('maturity_level');

        if (!scoresError && scoresData && scoresData.length > 0) {
          const sum = scoresData.reduce((acc, score) => acc + (score.maturity_level || 0), 0);
          averageMaturity = Math.round((sum / scoresData.length) * 10) / 10;
        }
      } catch {
        // Table may not exist yet, default to 0.0
        averageMaturity = 0.0;
      }

      return {
        totalAudits: totalAudits || 0,
        completionRate,
        averageMaturity,
        inProgressAudits: inProgressAudits || 0,
        completedAudits: completedAudits || 0,
      };
    },
    // Refetch every 30 seconds for near-real-time updates
    refetchInterval: 30000,
    // Keep data fresh for 5 seconds
    staleTime: 5000,
  });
}
