import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

type RoadmapFramework = {
  id: string;
  name: string | null;
};

async function fetchLatestFramework(): Promise<RoadmapFramework | null> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    throw new Error(sessionError.message || 'Unable to validate session.');
  }
  const userId = sessionData.session?.user?.id;
  if (!userId) {
    throw new Error('No active user session.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('mmm_profiles')
    .select('organisation_id')
    .eq('id', userId)
    .maybeSingle();
  if (profileError) {
    throw new Error(profileError.message || 'Unable to load user profile.');
  }
  if (!profile?.organisation_id) {
    return null;
  }

  const { data, error } = await supabase
    .from('mmm_frameworks')
    .select('id,name')
    .eq('organisation_id', profile.organisation_id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Unable to load maturity roadmap.');
  }
  if (!data) return null;
  return {
    id: String(data.id),
    name: data.name ? String(data.name) : null,
  };
}

export default function MaturityRoadmapPage() {
  const navigate = useNavigate();

  const roadmapQuery = useQuery({
    queryKey: ['maturity-roadmap-latest-framework'],
    queryFn: fetchLatestFramework,
    retry: false,
  });

  useEffect(() => {
    if (!roadmapQuery.data?.id) return;
    navigate(`/assessment/framework?framework_id=${roadmapQuery.data.id}`, { replace: true });
  }, [navigate, roadmapQuery.data?.id]);

  if (roadmapQuery.isLoading) {
    return (
      <main className="frameworks-page">
        <div className="container">
          <p className="frameworks-loading">Opening your maturity roadmap…</p>
        </div>
      </main>
    );
  }

  if (roadmapQuery.isError) {
    return (
      <main className="frameworks-page">
        <div className="container">
          <div className="alert alert-error" role="alert">
            {(roadmapQuery.error as Error).message}
          </div>
          <p style={{ marginTop: '0.75rem' }}>
            <Link to="/frameworks">Go to Frameworks</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="frameworks-page">
      <div className="container">
        <div className="frameworks-empty-state">
          <h2 className="frameworks-empty-state__title">No roadmap yet</h2>
          <p className="frameworks-empty-state__body">
            Create or upload a framework first, then Maturity Roadmap will open the domain workspace directly.
          </p>
          <Link className="btn btn-primary" to="/frameworks/upload">Upload Framework Source</Link>
        </div>
      </div>
    </main>
  );
}

