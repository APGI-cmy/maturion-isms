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

type OrganisationModeSource = 'VERBATIM' | 'HYBRID' | 'GENERATED';
type OrganisationSourceDoc = {
  id: string;
  title: string | null;
  file_name: string | null;
  processing_status: string | null;
  chunk_count: number | null;
  processing_error: string | null;
  tags: string[] | null;
  created_at: string;
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
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceMode, setSourceMode] = useState<OrganisationModeSource>('VERBATIM');
  const [isUploadingSource, setIsUploadingSource] = useState(false);
  const [activeDocActionId, setActiveDocActionId] = useState<string | null>(null);
  const query = useQuery({ queryKey: ['organisation-context'], queryFn: fetchOrganisationContext });
  const org = query.data?.organisation;
  const sourceDocsQuery = useQuery({
    queryKey: ['organisation-context-source-docs', org?.id],
    enabled: Boolean(org?.id),
    queryFn: async (): Promise<OrganisationSourceDoc[]> => {
      if (!org?.id) return [];
      const { data, error } = await supabase
        .from('mmm_subject_knowledge_documents')
        .select('id,title,file_name,processing_status,chunk_count,processing_error,tags,created_at')
        .eq('organisation_id', org.id)
        .eq('scope_type', 'organisation_context')
        .is('archived_at', null)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data as OrganisationSourceDoc[]) ?? [];
    },
  });
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

  const reprocessOrganisationSource = async (documentId: string) => {
    try {
      setActiveDocActionId(documentId);
      const headers = await getEdgeInvokeHeaders();
      const { error } = await supabase.functions.invoke('mmm-subject-knowledge-reprocess', {
        headers,
        body: { document_id: documentId },
      });
      if (error) throw new Error(error.message || 'Reprocess failed.');
      setMessage('Organisation source reprocess started/completed.');
      qc.invalidateQueries({ queryKey: ['organisation-context-source-docs', org?.id] });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Reprocess failed.');
    } finally {
      setActiveDocActionId(null);
    }
  };

  const deleteOrganisationSource = async (doc: OrganisationSourceDoc) => {
    if (!org?.id) return;
    try {
      setActiveDocActionId(doc.id);
      const confirmed = window.confirm(`Delete source document "${doc.title ?? doc.file_name ?? doc.id}"?`);
      if (!confirmed) return;

      const { data: fullDoc, error: fullDocError } = await supabase
        .from('mmm_subject_knowledge_documents')
        .select('id,storage_bucket,storage_path')
        .eq('id', doc.id)
        .maybeSingle();
      if (fullDocError || !fullDoc) throw new Error(fullDocError?.message || 'Document lookup failed.');

      if (fullDoc.storage_bucket && fullDoc.storage_path) {
        await supabase.storage.from(fullDoc.storage_bucket).remove([fullDoc.storage_path]);
      }

      await supabase.from('ai_knowledge').delete().eq('document_id', doc.id);
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id ?? null;
      const { error: archiveError } = await supabase
        .from('mmm_subject_knowledge_documents')
        .update({
          archived_at: new Date().toISOString(),
          updated_by: userId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', doc.id)
        .eq('organisation_id', org.id);
      if (archiveError) throw new Error(archiveError.message || 'Delete failed.');

      setMessage('Organisation source deleted.');
      qc.invalidateQueries({ queryKey: ['organisation-context-source-docs', org.id] });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setActiveDocActionId(null);
    }
  };

  const uploadModeSourceDocument = async () => {
    if (!org) throw new Error('Organisation context not loaded.');
    if (!sourceFile) throw new Error('Choose a source document before uploading.');

    setIsUploadingSource(true);
    setMessage(null);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw new Error(sessionError.message);
      const userId = sessionData.session?.user?.id;
      if (!userId) throw new Error('No authenticated user found.');

      const safeName = sourceFile.name.replace(/[^a-zA-Z0-9._-]+/g, '-');
      const storagePath = `organisation-context/${org.id}/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from('mmm-subject-knowledge')
        .upload(storagePath, sourceFile, {
          contentType: sourceFile.type || 'application/octet-stream',
          upsert: false,
        });
      if (uploadError) throw new Error(uploadError.message);

      const tags = [
        'organisation_context',
        'mode_source',
        `source_mode:${sourceMode}`,
        `organisation_id:${org.id}`,
      ];
      const { error: insertError } = await supabase.from('mmm_subject_knowledge_documents').insert({
        organisation_id: org.id,
        uploaded_by: userId,
        updated_by: userId,
        title: `${sourceMode} source - ${sourceFile.name}`,
        file_name: sourceFile.name,
        mime_type: sourceFile.type || 'application/octet-stream',
        file_size: sourceFile.size,
        storage_bucket: 'mmm-subject-knowledge',
        storage_path: storagePath,
        document_role: 'knowledge_source',
        scope_type: 'organisation_context',
        processing_status: 'pending',
        tags,
        upload_notes:
          sourceMode === 'VERBATIM'
            ? 'Authoritative verbatim source document for MPS, intent, and criteria extraction.'
            : sourceMode === 'HYBRID'
            ? 'Hybrid source document: harvest customer material, then complete gaps with subject knowledge.'
            : 'New-generation context source: use as organisation familiarisation material.',
      });
      if (insertError) throw new Error(insertError.message);

      // Auto-reprocess immediately so organisation source documents become chunked/AI-consumable
      // without requiring the user to switch to DMC first.
      const { data: insertedDoc, error: insertedLookupError } = await supabase
        .from('mmm_subject_knowledge_documents')
        .select('id')
        .eq('organisation_id', org.id)
        .eq('storage_bucket', 'mmm-subject-knowledge')
        .eq('storage_path', storagePath)
        .maybeSingle();
      if (insertedLookupError || !insertedDoc?.id) {
        throw new Error(insertedLookupError?.message || 'Source document saved but could not resolve document id for processing.');
      }

      const headers = await getEdgeInvokeHeaders();
      const { error: reprocessError } = await supabase.functions.invoke(
        'mmm-subject-knowledge-reprocess',
        {
          headers,
          body: { document_id: insertedDoc.id },
        },
      );
      if (reprocessError) {
        throw new Error(reprocessError.message || 'Source document uploaded but automatic processing failed.');
      }

      // Persist the selected mode in organisation context so runtime mode resolution
      // remains stable across framework pages and sessions.
      const nextContext = {
        ...(org.context ?? {}),
        frameworkCreationMode: sourceMode,
        sourceMode,
      };
      const { error: contextPersistError } = await supabase
        .from('mmm_organisations')
        .update({
          context: nextContext,
          context_updated_at: new Date().toISOString(),
        })
        .eq('id', org.id);
      if (contextPersistError) {
        throw new Error(contextPersistError.message || 'Source processed, but mode context save failed.');
      }

      setSourceFile(null);
      setMessage('Organisation source document uploaded and processed. Maturion can now use it according to the selected mode.');
      qc.invalidateQueries({ queryKey: ['organisation-context'] });
      qc.invalidateQueries({ queryKey: ['organisation-context-source-docs', org.id] });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Organisation source upload failed.');
    } finally {
      setIsUploadingSource(false);
    }
  };

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

      <div className="card" data-testid="organisation-source-upload">
        <h2>Organisation Source Documents</h2>
        <p>
          Upload the customer-specific document Maturion should use for Verbatim, Hybrid, or New Generation
          framework creation.
        </p>
        <div className="form-group">
          <label htmlFor="context-source-mode">Framework creation mode</label>
          <select
            id="context-source-mode"
            className="form-control"
            value={sourceMode}
            onChange={(event) => setSourceMode(event.target.value as OrganisationModeSource)}
          >
            <option value="VERBATIM">Verbatim source</option>
            <option value="HYBRID">Hybrid source</option>
            <option value="GENERATED">New generation context</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="context-source-file">Source document</label>
          <input
            id="context-source-file"
            className="form-control"
            type="file"
            onChange={(event) => setSourceFile(event.target.files?.[0] ?? null)}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          data-testid="upload-organisation-source-btn"
          onClick={uploadModeSourceDocument}
          disabled={!sourceFile || isUploadingSource}
        >
          {isUploadingSource ? 'Uploading…' : 'Upload Organisation Source'}
        </button>

        <div className="form-group" style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Uploaded Organisation Sources</h3>
          {sourceDocsQuery.isLoading ? <p>Loading uploaded source documents…</p> : null}
          {sourceDocsQuery.isError ? (
            <p role="alert">
              Failed to load uploaded source documents: {(sourceDocsQuery.error as Error).message}
            </p>
          ) : null}
          {!sourceDocsQuery.isLoading && !sourceDocsQuery.isError ? (
            sourceDocsQuery.data && sourceDocsQuery.data.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {sourceDocsQuery.data.map((doc) => (
                  <li key={doc.id} style={{ marginBottom: 8 }}>
                    <strong>{doc.title ?? doc.file_name ?? 'Untitled source'}</strong>
                    <div>
                      status: {doc.processing_status ?? 'pending'} | chunks: {doc.chunk_count ?? 0}
                    </div>
                    {doc.processing_error ? (
                      <div role="alert" style={{ color: '#b91c1c' }}>
                        parse note: {doc.processing_error}
                      </div>
                    ) : null}
                    <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => reprocessOrganisationSource(doc.id)}
                        disabled={activeDocActionId === doc.id}
                      >
                        Reprocess
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => deleteOrganisationSource(doc)}
                        disabled={activeDocActionId === doc.id}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No organisation source documents uploaded yet.</p>
            )
          ) : null}
        </div>
      </div>
    </main>
  );
}
