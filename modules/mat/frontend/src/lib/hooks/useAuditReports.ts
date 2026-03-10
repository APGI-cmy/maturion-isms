/**
 * Custom hook for fetching audit reports from Supabase
 * FRS: FR-035 to FR-038 (Report Generation / Wave 16.2 GAP-007)
 * TRS: TR-053
 * Wave 16.2 — GAP-007: audit_reports table listing with signed download URLs
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

export interface AuditReport {
  id: string;
  audit_id: string;
  format: string;
  status: string;
  file_path: string | null;
  signed_url?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches all audit_reports rows for the current user's organisation,
 * optionally filtered by auditId. Generates signed download URLs for
 * each report that has a file_path.
 */
export function useAuditReports(auditId?: string) {
  return useQuery<AuditReport[], Error>({
    queryKey: ['audit_reports', auditId ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('audit_reports')
        .select('id, audit_id, format, status, file_path, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (auditId) {
        query = query.eq('audit_id', auditId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch audit reports: ${error.message}`);
      }

      // Generate signed download URLs for reports that have a file_path
      const reportsWithUrls: AuditReport[] = await Promise.all(
        (data ?? []).map(async (report) => {
          if (!report.file_path) {
            return { ...report, signed_url: null };
          }
          try {
            const { data: signedData, error: signedError } = await supabase.storage
              .from('reports')
              .createSignedUrl(report.file_path, 3600); // 1 hour expiry
            return {
              ...report,
              signed_url: signedError ? null : signedData?.signedUrl ?? null,
            };
          } catch {
            return { ...report, signed_url: null };
          }
        }),
      );

      return reportsWithUrls;
    },
    staleTime: 30000,
  });
}
