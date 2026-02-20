import { useEffect } from 'react';
import { useAuditMetrics } from '../lib/hooks/useAuditMetrics';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function DashboardPage() {
  const { data: metrics, isLoading, isError, error } = useAuditMetrics();
  const queryClient = useQueryClient();

  // Realtime subscription for live updates (MAT-T-0100)
  useEffect(() => {
    const channel = supabase
      .channel('audit-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'audits' },
        () => {
          // Invalidate metrics query when audits table changes
          queryClient.invalidateQueries({ queryKey: ['audit-metrics'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Error state (MAT-T-0099)
  useEffect(() => {
    if (isError) {
      console.error('Dashboard error:', error);
      // Toast notification would go here
    }
  }, [isError, error]);

  // Loading skeleton (MAT-T-0099)
  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Audits</h2>
          <p className="text-3xl font-bold text-primary-600">{metrics?.totalAudits || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Completion Rate</h2>
          <p className="text-3xl font-bold text-primary-600">{metrics?.completionRate || 0}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Average Maturity</h2>
          <p className="text-3xl font-bold text-primary-600">{metrics?.averageMaturity?.toFixed(1) || '0.0'}</p>
        </div>
        {/* FR-039 through FR-042 - Dashboard functionality */}
      </div>
    </div>
  );
}
