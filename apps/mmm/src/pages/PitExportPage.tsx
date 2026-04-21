import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
export default function PitExportPage() {
  const { id: exportId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/pit-export/${exportId}/send`, { method: 'POST', headers: { 'Authorization': `Bearer ${session?.access_token}` } });
      if (!res.ok) throw new Error('Export failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pit-exports', exportId] }); // NBR-001
    },
  });
  return (
    <main>
      <h1>PIT Export</h1>
      <p>7-step handshake to send findings to PIT platform.</p>
      <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? 'Sending...' : 'Send to PIT'}
      </button>
      {mutation.isSuccess && <p>Export sent successfully.</p>}
    </main>
  );
}
