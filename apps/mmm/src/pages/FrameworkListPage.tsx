import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
export default function FrameworkListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['frameworks'],
    queryFn: async () => {
      const { data } = await supabase.from('mmm_frameworks').select('*');
      return data ?? [];
    },
  });
  if (isLoading) return <div>Loading...</div>;
  return (
    <main>
      <h1>Frameworks</h1>
      <Link to="/frameworks/upload">Upload Framework Source</Link>
      {data?.map((f: any) => <div key={f.id}><strong>{f.name}</strong> — {f.status}</div>)}
    </main>
  );
}
