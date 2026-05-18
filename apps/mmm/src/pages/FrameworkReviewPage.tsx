import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, getEdgeInvokeHeaders } from '@/lib/supabase';
// NOTE: Parse-job polling and proposed-domain count queries allow the review page to show
// actionable status for Mode A (document upload) and Mode B/C (AI generation) workflows.

export default function FrameworkReviewPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: framework } = useQuery({
    queryKey: ['frameworks', id],
    queryFn: async () => {
      const { data } = await supabase.from('mmm_frameworks').select('*').eq('id', id!).single();
      return data;
    },
  });

  // Poll the most recent parse job for this framework (Mode A only)
  const { data: parseJob } = useQuery({
    queryKey: ['parse-jobs', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('mmm_parse_jobs')
        .select('id,status,created_at,updated_at')
        .eq('framework_id', id!)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data ?? null;
    },
    // Poll every 4 s while job is pending or processing
    refetchInterval: (query: { state: { data: { status?: string } | null | undefined } }) => {
      const status = query.state.data?.status;
      return status === 'PENDING' || status === 'PROCESSING' ? 4000 : false;
    },
  });

  // Count proposed domains — Compile requires at least one to exist
  const { data: proposedDomainCount } = useQuery({
    queryKey: ['proposed-domains-count', id],
    queryFn: async () => {
      const { count } = await supabase
        .from('mmm_proposed_domains')
        .select('id', { count: 'exact', head: true })
        .eq('framework_id', id!);
      return count ?? 0;
    },
    // Re-check while parse job is active
    refetchInterval: parseJob && (parseJob.status === 'PENDING' || parseJob.status === 'PROCESSING') ? 4000 : false,
  });

  const compileMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('mmm-framework-compile', {
        headers: await getEdgeInvokeHeaders(),
        body: { framework_id: id },
      });
      if (error) throw new Error(error.message || 'Compile failed');
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frameworks', id] }); // NBR-001
      queryClient.invalidateQueries({ queryKey: ['domains', id] }); // NBR-001
      const normalizedBaseUrl = (import.meta.env.VITE_APP_URL ?? window.location.origin).replace(/\/$/, '');
      const legacyWorkspacePath = '/assessment/framework';
      const frameworkId = id ?? '';
      const frameworkQuery = frameworkId ? `?framework_id=${encodeURIComponent(frameworkId)}` : '';
      // TODO(arch-roadmap-1658): Transitional bridge into legacy workspace.
      // Follow architecture/modules/maturity/MMM_POST_LEGACY_HANDOFF_MIGRATION_ROADMAP_v0.1.md
      // to replace window.location.assign with unified SPA routing/state continuity and governance-aware orchestration.
      window.location.assign(`${normalizedBaseUrl}${legacyWorkspacePath}${frameworkQuery}`);
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('mmm-framework-publish', {
        headers: await getEdgeInvokeHeaders(),
        body: { framework_id: id },
      });
      if (error) throw new Error(error.message || 'Publish failed');
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frameworks'] }); // NBR-001
      queryClient.invalidateQueries({ queryKey: ['frameworks', id] }); // NBR-001
      navigate('/frameworks');
    },
  });

  const isReview = framework?.status?.toLowerCase() === 'review';
  const canPublish = isReview && !publishMutation.isPending && !publishMutation.isSuccess;

  // Compile is blocked while parse job is still active
  const parseJobActive = parseJob && (parseJob.status === 'PENDING' || parseJob.status === 'PROCESSING');
  const parseJobFailed = parseJob?.status === 'FAILED';
  const hasProposedDomains = (proposedDomainCount ?? 0) > 0;
  const canCompile =
    !compileMutation.isPending &&
    !compileMutation.isSuccess &&
    !parseJobActive &&
    hasProposedDomains;

  return (
    <main style={{ padding: '1.5rem', maxWidth: '48rem', margin: '0 auto' }}>
      <h1>Review Framework: {framework?.name}</h1>
      <p>Status: <strong>{framework?.status ?? '—'}</strong></p>

      {/* Parse job status panel (Mode A only — hidden when no parse job exists) */}
      {parseJob && (
        <section style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Document parse job:</strong>{' '}
          {parseJob.status === 'PENDING' && <span aria-live="polite">⏳ Pending — waiting for document processing…</span>}
          {parseJob.status === 'PROCESSING' && <span aria-live="polite">⏳ Processing — parsing document structure…</span>}
          {parseJob.status === 'COMPLETE' && (
            <span style={{ color: 'green' }}>
              ✓ Complete — {proposedDomainCount ?? 0} proposed domain{proposedDomainCount !== 1 ? 's' : ''} ready for compile
            </span>
          )}
          {parseJob.status === 'FAILED' && (
            <span style={{ color: 'red' }} role="alert">✗ Parse failed — document could not be structured. Compile will fail without proposed domains.</span>
          )}
        </section>
      )}

      {/* No parse job + no proposed domains = Mode B/C or direct navigation */}
      {!parseJob && !hasProposedDomains && (
        <section style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#f5f5f5', borderRadius: '4px' }}>
          <span>No proposed framework structure found. Compile requires source document processing to complete or AI generation to finish.</span>
        </section>
      )}

      {!parseJob && hasProposedDomains && (
        <section style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#f0fff4', borderRadius: '4px' }}>
          <span style={{ color: 'green' }}>
            ✓ Proposed structure ready — {proposedDomainCount} domain{proposedDomainCount !== 1 ? 's' : ''} available for compile.
          </span>
        </section>
      )}

      <section style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Compile</h2>
        <button
          onClick={() => compileMutation.mutate()}
          disabled={!canCompile}
          title={
            parseJobActive
              ? 'Waiting for document parse to complete…'
              : !hasProposedDomains && !parseJobFailed
              ? 'No proposed domains available yet — parse job must complete first'
              : undefined
          }
          style={{ marginRight: '0.5rem' }}
        >
          {compileMutation.isPending ? 'Compiling…' : 'Compile'}
        </button>
        {parseJobActive && (
          <span style={{ color: '#666', fontSize: '0.875rem' }}>
            (Compile will be available once document parsing completes.)
          </span>
        )}
        {!hasProposedDomains && !parseJobActive && !compileMutation.isSuccess && !compileMutation.isError && (
          <span style={{ color: '#666', fontSize: '0.875rem' }}>
            (No proposed domains found. Compile requires a completed parse or AI generation.)
          </span>
        )}
        {compileMutation.isPending && (
          <span aria-live="polite">Compiling framework — please wait…</span>
        )}
        {compileMutation.isSuccess && (
          <span aria-live="polite" style={{ color: 'green' }}>
            ✓ Framework compiled. Status moved to REVIEW.
          </span>
        )}
        {compileMutation.isError && (
          <span aria-live="assertive" role="alert" style={{ color: 'red' }}>
            ✗ Compile failed: {(compileMutation.error as Error).message}
          </span>
        )}
      </section>

      <section style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Publish</h2>
        <button
          onClick={() => publishMutation.mutate()}
          disabled={!canPublish}
          title={!isReview ? 'Framework must be in REVIEW status before publishing' : undefined}
          style={{ marginRight: '0.5rem' }}
        >
          {publishMutation.isPending ? 'Publishing…' : 'Publish'}
        </button>
        {!isReview && framework?.status && (
          <span style={{ color: '#666', fontSize: '0.875rem' }}>
            (Publish is only available when the framework is in REVIEW status.)
          </span>
        )}
        {publishMutation.isPending && (
          <span aria-live="polite">Publishing framework — please wait…</span>
        )}
        {publishMutation.isSuccess && (
          <span aria-live="polite" style={{ color: 'green' }}>
            ✓ Framework published. Redirecting…
          </span>
        )}
        {publishMutation.isError && (
          <span aria-live="assertive" role="alert" style={{ color: 'red' }}>
            ✗ Publish failed: {(publishMutation.error as Error).message}
          </span>
        )}
      </section>
    </main>
  );
}
