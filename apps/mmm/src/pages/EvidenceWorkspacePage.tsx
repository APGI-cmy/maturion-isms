import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
export default function EvidenceWorkspacePage() {
  const { id: assessmentId, criterionId } = useParams<{ id: string; criterionId: string }>();
  const queryClient = useQueryClient();
  const [evidenceType, setEvidenceType] = useState<'FILE'|'URL'|'TEXT'>('TEXT');
  const [content, setContent] = useState('');
  const [override, setOverride] = useState(false);
  const [rationale, setRationale] = useState('');
  const uploadMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/upload/evidence', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` }, body: JSON.stringify({ assessment_id: assessmentId, criterion_id: criterionId, type: evidenceType, content }) });
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence', criterionId] }); // NBR-001
    },
  });
  const confirmMutation = useMutation({
    mutationFn: async (score: number) => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/scores/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` }, body: JSON.stringify({ assessment_id: assessmentId, criterion_id: criterionId, score, confirm: true, rationale: override ? rationale : undefined }) });
      if (!res.ok) throw new Error('Confirm failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores', assessmentId] }); // NBR-001
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }); // NBR-001
    },
  });
  return (
    <main>
      <h1>Evidence Workspace</h1>
      <select value={evidenceType} onChange={e => setEvidenceType(e.target.value as any)}>
        <option value="TEXT">Text Attestation</option><option value="URL">URL Reference</option><option value="FILE">File Upload</option>
      </select>
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Evidence content" />
      <button onClick={() => uploadMutation.mutate()}>Submit Evidence</button>
      <div>
        <label><input type="checkbox" checked={override} onChange={e => setOverride(e.target.checked)} />Override AI score</label>
        {override && <textarea value={rationale} onChange={e => setRationale(e.target.value)} placeholder="Rationale for override (required)" />}
        {[1,2,3,4,5].map(s => <button key={s} onClick={() => confirmMutation.mutate(s)}>Confirm Level {s}</button>)}
      </div>
    </main>
  );
}
