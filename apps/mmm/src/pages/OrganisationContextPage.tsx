import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEdgeInvokeHeaders, supabase } from '@/lib/supabase';

type OrganisationContextPayload = {
  fullName?: string;
  title?: string;
  bio?: string;
  industryTags?: string[];
  customIndustry?: string;
  regionOperating?: string;
  primaryWebsiteUrl?: string;
  linkedDomains?: string[];
  riskConcerns?: string[];
  complianceCommitments?: string[];
  threatSensitivityLevel?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  modelName?: string;
  documentNotes?: string;
};

type OrganisationContextResponse = {
  organisation: {
    id: string;
    name: string;
    tier: string;
    context: OrganisationContextPayload | null;
    onboarding_complete: boolean;
    context_updated_at?: string | null;
  };
};

async function fetchOrganisationContext(): Promise<OrganisationContextResponse> {
  const headers = await getEdgeInvokeHeaders();
  const { data, error } = await supabase.functions.invoke('mmm-organisation-context', {
    headers,
    body: { action: 'get' },
  });
  if (!error && data) {
    return data as OrganisationContextResponse;
  }

  // Fallback path: read directly from canonical tables if edge runtime is unavailable.
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw new Error(sessionError.message || 'Failed to load user session.');
  const userId = sessionData.session?.user?.id;
  if (!userId) throw new Error('No authenticated user found.');

  const { data: profile, error: profileError } = await supabase
    .from('mmm_profiles')
    .select('organisation_id')
    .eq('id', userId)
    .maybeSingle();
  if (profileError) throw new Error(profileError.message || 'Failed to load profile context.');
  if (!profile?.organisation_id) throw new Error('No organisation found for this user profile.');

  const { data: organisation, error: orgError } = await supabase
    .from('mmm_organisations')
    .select('id,name,tier,context,onboarding_complete,context_updated_at')
    .eq('id', profile.organisation_id)
    .single();
  if (orgError || !organisation) {
    throw new Error(orgError?.message || 'Failed to load organisation context.');
  }

  return { organisation } as OrganisationContextResponse;
}

export default function OrganisationContextPage() {
  const qc = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const query = useQuery({ queryKey: ['organisation-context'], queryFn: fetchOrganisationContext });
  const org = query.data?.organisation;
  const context = org?.context ?? {};

  const [draft, setDraft] = useState<OrganisationContextPayload>({});
  const merged = useMemo<OrganisationContextPayload>(() => ({ ...context, ...draft }), [context, draft]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!org) throw new Error('Organisation context not loaded.');
      const headers = await getEdgeInvokeHeaders();
      const { data, error } = await supabase.functions.invoke('mmm-organisation-context', {
        headers,
        body: {
          action: 'update',
          name: org.name,
          tier: org.tier,
          context: merged,
        },
      });
      if (!error && data) {
        return data as OrganisationContextResponse;
      }

      // Fallback path: update organisation row directly.
      const { data: updatedOrg, error: updateError } = await supabase
        .from('mmm_organisations')
        .update({
          name: org.name,
          tier: org.tier,
          context: merged,
          context_updated_at: new Date().toISOString(),
        })
        .eq('id', org.id)
        .select('id,name,tier,context,onboarding_complete,context_updated_at')
        .single();
      if (updateError || !updatedOrg) {
        throw new Error(updateError?.message || 'Failed to save context.');
      }
      return { organisation: updatedOrg } as OrganisationContextResponse;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organisation-context'] });
      setDraft({});
      setMessage('Organisation context saved.');
    },
    onError: (err) => setMessage((err as Error).message),
  });

  if (query.isLoading) return <main className="container"><p>Loading organisation context…</p></main>;
  if (query.isError || !org) return <main className="container"><p role="alert">Failed to load organisation context.</p></main>;

  return (
    <main className="container" data-testid="organisation-context-page">
      <div className="page-header">
        <h1 className="page-header__title">Organisation Context</h1>
        <p className="page-header__subtitle">
          Edit your saved Get To Know You profile without rerunning onboarding.
        </p>
      </div>

      {message ? <div className="alert" role="status">{message}</div> : null}

      <div className="card">
        <h2>{org.name}</h2>
        <p>Tier: {org.tier}</p>
        <div className="form-group">
          <label htmlFor="context-full-name">Full Name</label>
          <input
            id="context-full-name"
            className="form-control"
            value={merged.fullName ?? ''}
            onChange={(e) => setDraft((prev) => ({ ...prev, fullName: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="context-title">Title</label>
          <input
            id="context-title"
            className="form-control"
            value={merged.title ?? ''}
            onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="context-industry">Industry Tags (comma-separated)</label>
          <input
            id="context-industry"
            className="form-control"
            value={(merged.industryTags ?? []).join(', ')}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                industryTags: e.target.value.split(',').map((v) => v.trim()).filter(Boolean),
              }))
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="context-region">Region</label>
          <input
            id="context-region"
            className="form-control"
            value={merged.regionOperating ?? ''}
            onChange={(e) => setDraft((prev) => ({ ...prev, regionOperating: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="context-website">Primary Website</label>
          <input
            id="context-website"
            className="form-control"
            value={merged.primaryWebsiteUrl ?? ''}
            onChange={(e) => setDraft((prev) => ({ ...prev, primaryWebsiteUrl: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="context-notes">Notes</label>
          <textarea
            id="context-notes"
            className="form-control"
            rows={4}
            value={merged.documentNotes ?? ''}
            onChange={(e) => setDraft((prev) => ({ ...prev, documentNotes: e.target.value }))}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving…' : 'Save Context'}
        </button>
      </div>
    </main>
  );
}
