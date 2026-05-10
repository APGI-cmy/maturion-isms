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
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frameworks'] }); // NBR-001
      queryClient.invalidateQueries({ queryKey: ['frameworks', id] }); // NBR-001
      navigate('/frameworks');
    },
  });
  return (
    <main>
      <h1>Review Framework: {framework?.name}</h1>
      <p>Status: {framework?.status}</p>
      <button onClick={() => compileMutation.mutate()} disabled={compileMutation.isPending}>Compile</button>
      <button onClick={() => publishMutation.mutate()} disabled={publishMutation.isPending}>Publish</button>
    </main>
  );
}
