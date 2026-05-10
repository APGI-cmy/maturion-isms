import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

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

  const compileMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('mmm-framework-compile', {
        body: { framework_id: id },
      });
      if (error) throw new Error(error.message || 'Compile failed');
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frameworks', id] }); // NBR-001
      queryClient.invalidateQueries({ queryKey: ['domains', id] }); // NBR-001
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('mmm-framework-publish', {
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

  return (
    <main style={{ padding: '1.5rem', maxWidth: '48rem', margin: '0 auto' }}>
      <h1>Review Framework: {framework?.name}</h1>
      <p>Status: <strong>{framework?.status ?? '—'}</strong></p>

      <section style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Compile</h2>
        <button
          onClick={() => compileMutation.mutate()}
          disabled={compileMutation.isPending || compileMutation.isSuccess}
          style={{ marginRight: '0.5rem' }}
        >
          {compileMutation.isPending ? 'Compiling…' : 'Compile'}
        </button>
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
