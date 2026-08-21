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

type ReprocessResponse = {
  success?: boolean;
  error?: string;
  document_id?: string;
  chunk_count?: number;
  // api-builder's server-side deferred-completion contract (b07ebf38): when the reprocess
  // pipeline accepts the request but has not finished chunking/indexing within the request
  // lifecycle, it reports `deferred: true` / `processing_status: 'processing'` alongside
  // `success: true`. Callers MUST NOT treat that combination as a fully-finished result.
  processing_status?: string;
  deferred?: boolean;
};

function formatOrganisationSourceStatus(doc: OrganisationSourceDoc): string {
  const status = doc.processing_status ?? 'pending';
  const chunks = doc.chunk_count ?? 0;
  if (chunks > 0 && status.toLowerCase() === 'failed') {
    return 'completed (chunks ready; parser/index warning)';
  }
  if (chunks > 0 && status.toLowerCase() !== 'completed') {
    return `${status} (chunks ready for VERBATIM extraction)`;
  }
  return status;
}

function resolveMimeType(file: File): string {
  if (file.type && file.type.trim().length > 0) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return 'application/pdf';
  if (name.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (name.endsWith('.doc')) return 'application/msword';
  if (name.endsWith('.pptx')) return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  if (name.endsWith('.ppt')) return 'application/vnd.ms-powerpoint';
  if (name.endsWith('.xlsx')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (name.endsWith('.xls')) return 'application/vnd.ms-excel';
  if (name.endsWith('.txt')) return 'text/plain';
  if (name.endsWith('.md')) return 'text/markdown';
  if (name.endsWith('.csv')) return 'text/csv';
  if (name.endsWith('.json')) return 'application/json';
  return 'application/octet-stream';
}

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

const ORG_ACCEPTED_TYPES = [
  '.pdf', '.doc', '.docx', '.txt', '.md', '.csv', '.json',
  '.pptx', '.ppt', '.xlsx', '.xls',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
].join(',');

let supplementaryRowIdSeq = 0;
function nextSupplementaryRowId(): string {
  supplementaryRowIdSeq += 1;
  return `supp-row-${supplementaryRowIdSeq}`;
}

type SupplementaryRow = {
  id: string;
  files: File[];
};

export default function OrganisationContextPage() {
  const qc = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [supplementaryRows, setSupplementaryRows] = useState<SupplementaryRow[]>(() => [
    { id: nextSupplementaryRowId(), files: [] },
  ]);
  const [sourceMode, setSourceMode] = useState<OrganisationModeSource>('VERBATIM');
  const [isUploadingSource, setIsUploadingSource] = useState(false);
  const [sourceUploadStatus, setSourceUploadStatus] = useState<string | null>(null);
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
      const { data, error } = await supabase.functions.invoke('mmm-subject-knowledge-reprocess', {
        headers,
        body: { document_id: documentId },
      });
      if (error) throw new Error(error.message || 'Reprocess failed.');
      const result = data as ReprocessResponse | null;
      if (result?.success === false) {
        throw new Error(result.error || 'Organisation source reprocess failed.');
      }
      setMessage(`Organisation source reprocess completed${typeof result?.chunk_count === 'number' ? ` with ${result.chunk_count} chunk(s)` : ''}.`);
      qc.invalidateQueries({ queryKey: ['organisation-context-source-docs', org?.id] });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Reprocess failed.');
    } finally {
      setActiveDocActionId(null);
    }
  };

  const archiveOrganisationSource = async (doc: OrganisationSourceDoc) => {
    if (!org?.id) return;
    try {
      setActiveDocActionId(doc.id);
      const confirmed = window.confirm(
        `Archive source document "${doc.title ?? doc.file_name ?? doc.id}"? The uploaded file will be retained.`,
      );
      if (!confirmed) return;

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
      if (archiveError) throw new Error(archiveError.message || 'Archive failed.');

      setMessage('Organisation source archived. The uploaded file was retained for audit/recovery.');
      qc.invalidateQueries({ queryKey: ['organisation-context-source-docs', org.id] });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Archive failed.');
    } finally {
      setActiveDocActionId(null);
    }
  };

  // Repeatable optional supplementary upload rows (issue #2025 / T-2025-01): selecting a file
  // in the current last row reveals a new empty optional row, and each row is individually
  // removable, so an arbitrary number (3+) of supplementary files can be attached without
  // reopening/replacing a single combined picker.
  const handleSupplementaryRowFilesChange = (rowIndex: number, fileList: FileList | null) => {
    const files = fileList ? Array.from(fileList) : [];
    setSupplementaryRows((prev) => {
      const next = prev.map((row, idx) => (idx === rowIndex ? { ...row, files } : row));
      const isLastRow = rowIndex === prev.length - 1;
      if (isLastRow && files.length > 0) {
        next.push({ id: nextSupplementaryRowId(), files: [] });
      }
      return next;
    });
  };

  const handleRemoveSupplementaryRow = (rowIndex: number) => {
    setSupplementaryRows((prev) => {
      const next = prev.filter((_, idx) => idx !== rowIndex);
      if (next.length === 0) {
        return [{ id: nextSupplementaryRowId(), files: [] }];
      }
      // Trailing-empty-row invariant (issue #2025 / T-2025-10): if removal leaves a POPULATED
      // row as the new last row, append a fresh empty row after it so the user can keep adding
      // files without disturbing existing selections — mirroring the auto-reveal behavior in
      // `handleSupplementaryRowFilesChange`.
      const newLastRow = next[next.length - 1];
      if (newLastRow.files.length > 0) {
        return [...next, { id: nextSupplementaryRowId(), files: [] }];
      }
      return next;
    });
  };

  // Invokes the `mmm-subject-knowledge-reprocess` Edge Function directly, with no client-side
  // AbortController/timeout wrapper. api-builder's server-side fix (b07ebf38) now
  // unconditionally bounds every invocation itself (worst case ~108s, safely under the 150s
  // free-plan ceiling), so a client-side abort layered on top would itself risk cutting off a
  // server pipeline that is safely running to completion (issue #2025 reconciliation,
  // T-2025-05).
  const invokeReprocessBounded = async (documentId: string): Promise<ReprocessResponse | null> => {
    const headers = await getEdgeInvokeHeaders();
    const { data, error } = await supabase.functions.invoke('mmm-subject-knowledge-reprocess', {
      headers,
      body: { document_id: documentId },
    });
    if (error) {
      throw new Error(error.message || 'Reprocess failed.');
    }
    if (data && typeof data === 'object' && 'success' in data && (data as { success?: boolean }).success === false) {
      const detail =
        typeof (data as { error?: unknown }).error === 'string'
          ? (data as { error: string }).error
          : 'Processing failed.';
      throw new Error(detail);
    }
    return data as ReprocessResponse | null;
  };

  // Uploads the single primary source document end-to-end (storage -> metadata -> bounded
  // reprocess -> mode context persistence). Runs independently of supplementary uploads so a
  // primary failure/hang cannot gate or roll back supplementary attempts (T-2025-03, T-2025-05).
  const uploadPrimaryDocument = async (
    activeOrg: NonNullable<typeof org>,
    file: File,
    userId: string,
  ): Promise<ReprocessResponse | null> => {
    setSourceUploadStatus('Starting upload…');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_');
    const mimeType = resolveMimeType(file);
    // Storage-path uniqueness (issue #2025 / T-2025-09): `crypto.randomUUID()` is used
    // elsewhere in this codebase's browser/Vite runtime target (e.g. approval modals), so it
    // is confirmed available here. A per-call unique salt is appended so concurrent uploads of
    // same-basename files (which `Array.prototype.map` can invoke synchronously, in the same
    // tick, before either upload's first `await`) never collide on an identical `Date.now()`.
    const storagePath = `${activeOrg.id}/${userId}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from('mmm-subject-knowledge')
      .upload(storagePath, file, { contentType: mimeType, upsert: false });
    if (uploadError) {
      const detail = JSON.stringify({
        message: uploadError.message,
        name: uploadError.name,
        statusCode: (uploadError as { statusCode?: string }).statusCode ?? null,
        error: (uploadError as { error?: string }).error ?? null,
        path: storagePath,
        mimeType,
        fileSize: file.size,
      });
      // Persist a durable failed record (per-file processing status) rather than losing the
      // failure only in transient component state (T-2025-04 durability contract).
      try {
        await supabase.from('mmm_subject_knowledge_documents').insert({
          organisation_id: activeOrg.id,
          uploaded_by: userId,
          updated_by: userId,
          title: `${sourceMode} source - ${file.name}`,
          file_name: file.name,
          mime_type: mimeType,
          file_size: file.size,
          storage_bucket: 'mmm-subject-knowledge',
          storage_path: storagePath,
          document_role: 'knowledge_source',
          scope_type: 'organisation_context',
          processing_status: 'failed',
          // Generic, non-file-name-bearing message: the title already carries the file name, so
          // the durable per-file status stays unambiguous/actionable without duplicating it. Also
          // avoids repeating the literal word "failed" (already shown via processing_status) so
          // the status text remains the single unambiguous match for that word in the UI.
          processing_error: 'Storage upload was unsuccessful before the document could be processed.',
          tags: ['organisation_context', 'mode_source', `source_mode:${sourceMode}`, `organisation_id:${activeOrg.id}`],
          upload_notes: 'Primary source upload failed at storage layer.',
        });
      } catch {
        // Best-effort durability write; the primary failure is still surfaced via the thrown
        // error below regardless of whether this durable record could be persisted.
      }
      throw new Error(`Storage upload failed: ${detail}`);
    }
    setSourceUploadStatus('Storage upload complete. Saving document metadata…');

    const tags = [
      'organisation_context',
      'mode_source',
      `source_mode:${sourceMode}`,
      `organisation_id:${activeOrg.id}`,
    ];
    const { error: insertError } = await supabase.from('mmm_subject_knowledge_documents').insert({
      organisation_id: activeOrg.id,
      uploaded_by: userId,
      updated_by: userId,
      title: `${sourceMode} source - ${file.name}`,
      file_name: file.name,
      mime_type: mimeType,
      file_size: file.size,
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
    if (insertError) {
      const detail = JSON.stringify({
        message: insertError.message,
        code: insertError.code ?? null,
        details: insertError.details ?? null,
        hint: insertError.hint ?? null,
        orgId: activeOrg.id,
        scopeType: 'organisation_context',
        sourceMode,
      });
      throw new Error(`Database insert failed: ${detail}`);
    }
    setSourceUploadStatus('Metadata saved. Processing source document…');

    // Auto-reprocess immediately so organisation source documents become chunked/AI-consumable
    // without requiring the user to switch to DMC first.
    const { data: insertedDoc, error: insertedLookupError } = await supabase
      .from('mmm_subject_knowledge_documents')
      .select('id')
      .eq('organisation_id', activeOrg.id)
      .eq('storage_bucket', 'mmm-subject-knowledge')
      .eq('storage_path', storagePath)
      .maybeSingle();
    if (insertedLookupError || !insertedDoc?.id) {
      throw new Error(insertedLookupError?.message || 'Source document saved but could not resolve document id for processing.');
    }

    const reprocessResult = await invokeReprocessBounded(insertedDoc.id);
    setSourceUploadStatus('Processing complete. Finalizing mode context…');

    // Persist the selected mode in organisation context so runtime mode resolution
    // remains stable across framework pages and sessions.
    const nextContext = {
      ...(activeOrg.context ?? {}),
      frameworkCreationMode: sourceMode,
      sourceMode,
    };
    const { error: contextPersistError } = await supabase
      .from('mmm_organisations')
      .update({
        context: nextContext,
        context_updated_at: new Date().toISOString(),
      })
      .eq('id', activeOrg.id);
    if (contextPersistError) {
      throw new Error(contextPersistError.message || 'Source processed, but mode context save failed.');
    }

    // Deferred/processing response messaging (issue #2025 / T-2025-11): api-builder's
    // server-side fix (b07ebf38) can report `success: true` alongside `deferred: true` /
    // `processing_status: 'processing'` when the reprocess pipeline accepted the document but
    // has not finished chunking/indexing yet. That combination must NOT be reported as a fully
    // finished upload — surface the durable "processing" status instead (consistent with the
    // per-file status list, which already reads `processing_status` from the database).
    const isDeferred =
      reprocessResult?.deferred === true || reprocessResult?.processing_status === 'processing';
    setSourceUploadStatus(
      isDeferred
        ? 'Organisation source document uploaded; processing is continuing in the background.'
        : 'Organisation source upload finished successfully.',
    );
    return reprocessResult;
  };

  // Uploads a single supplementary file independently of the primary document and of every
  // other supplementary file, so one file's failure never rolls back or blocks the others
  // (T-2025-03 mixed-batch per-file isolation). Failures are persisted as a durable per-file
  // status row rather than only being held in component state (T-2025-04).
  const uploadSupplementaryDocument = async (activeOrg: NonNullable<typeof org>, file: File, userId: string) => {
    const suppSafeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_');
    const suppMime = resolveMimeType(file);
    // Storage-path uniqueness (issue #2025 / T-2025-09): `Array.prototype.map` invokes every
    // `uploadSupplementaryDocument(...)` call synchronously, in the same tick, before any of
    // them reach their first `await` — so two same-basename files uploaded in the same batch
    // can collide on an identical `Date.now()` value. A per-call `crypto.randomUUID()` salt
    // guarantees distinct paths regardless of timing.
    const suppPath = `${activeOrg.id}/${userId}/${Date.now()}-${crypto.randomUUID()}-supp-${suppSafeName}`;
    const suppTags = ['organisation_context', 'supplementary', `source_mode:${sourceMode}`, `organisation_id:${activeOrg.id}`];

    const { error: suppUploadError } = await supabase.storage
      .from('mmm-subject-knowledge')
      .upload(suppPath, file, { contentType: suppMime, upsert: false });
    if (suppUploadError) {
      try {
        await supabase.from('mmm_subject_knowledge_documents').insert({
          organisation_id: activeOrg.id,
          uploaded_by: userId,
          updated_by: userId,
          title: `Supplementary - ${file.name}`,
          file_name: file.name,
          mime_type: suppMime,
          file_size: file.size,
          storage_bucket: 'mmm-subject-knowledge',
          storage_path: suppPath,
          document_role: 'knowledge_source',
          scope_type: 'organisation_context',
          processing_status: 'failed',
          // Generic, non-file-name-bearing message: the title already carries the file name, so
          // the durable per-file status stays unambiguous/actionable without duplicating it. Also
          // avoids repeating the literal word "failed" so the status text (processing_status)
          // remains the single unambiguous match for that word in the UI.
          processing_error: 'Storage upload was unsuccessful. This file was not saved; remove the row and retry.',
          tags: suppTags,
          upload_notes: 'Supplementary context document upload failed at storage layer.',
        });
      } catch {
        // Best-effort durability write; the per-row status list simply omits this entry if
        // even the failure record could not be persisted.
      }
      return;
    }

    const { error: suppInsertError } = await supabase.from('mmm_subject_knowledge_documents').insert({
      organisation_id: activeOrg.id,
      uploaded_by: userId,
      updated_by: userId,
      title: `Supplementary - ${file.name}`,
      file_name: file.name,
      mime_type: suppMime,
      file_size: file.size,
      storage_bucket: 'mmm-subject-knowledge',
      storage_path: suppPath,
      document_role: 'knowledge_source',
      scope_type: 'organisation_context',
      processing_status: 'pending',
      tags: suppTags,
      upload_notes: 'Supplementary context document.',
    });
    if (suppInsertError) return;

    try {
      const { data: suppDoc } = await supabase
        .from('mmm_subject_knowledge_documents')
        .select('id')
        .eq('storage_path', suppPath)
        .maybeSingle();
      if (suppDoc?.id) {
        await invokeReprocessBounded(suppDoc.id);
      }
    } catch {
      // Non-fatal: the supplementary document's durable metadata row is already persisted with
      // a 'pending' status; a reprocess failure here is surfaced via the per-file status list.
    }
  };

  const uploadModeSourceDocument = async () => {
    if (!org) {
      const err = 'Organisation context not loaded.';
      setSourceUploadStatus(err);
      setMessage(err);
      return;
    }
    if (!sourceFile) {
      const err = 'Choose a source document before uploading.';
      setSourceUploadStatus(err);
      setMessage(err);
      return;
    }

    const activeOrg = org;
    setIsUploadingSource(true);
    setMessage(null);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw new Error(sessionError.message);
      const userId = sessionData.session?.user?.id;
      if (!userId) throw new Error('No authenticated user found.');

      const supplementaryFiles = supplementaryRows.flatMap((row) => row.files);

      // Client-side mixed-batch orchestration (T-2025-03, T-2025-05): the primary document
      // and every supplementary file are attempted independently/concurrently. A failed or
      // still-pending/hung primary reprocess call must never gate or block the supplementary
      // attempts, and one supplementary file's failure must never block another's.
      const primaryPromise = uploadPrimaryDocument(activeOrg, sourceFile, userId)
        .then((reprocessResult) => {
          // Deferred/processing response messaging (issue #2025 / T-2025-11): mirror the
          // per-card status wording — a deferred/still-processing reprocess response must not
          // be reported as a fully finished upload here either.
          const isDeferred =
            reprocessResult?.deferred === true || reprocessResult?.processing_status === 'processing';
          setMessage(
            isDeferred
              ? 'Organisation source document uploaded and accepted; processing continues in the background.'
              : 'Organisation source document uploaded and processed. Maturion can now use it according to the selected mode.',
          );
          qc.invalidateQueries({ queryKey: ['organisation-context'] });
        })
        .catch((err) => {
          const msg = err instanceof Error ? err.message : 'Organisation source upload failed.';
          setSourceUploadStatus(msg);
          setMessage(msg);
        });

      const supplementaryPromise = Promise.allSettled(
        supplementaryFiles.map((file) => uploadSupplementaryDocument(activeOrg, file, userId)),
      );

      await Promise.allSettled([primaryPromise, supplementaryPromise]);
      qc.invalidateQueries({ queryKey: ['organisation-context-source-docs', activeOrg.id] });

      setSourceFile(null);
      setSupplementaryRows([{ id: nextSupplementaryRowId(), files: [] }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Organisation source upload failed.';
      setSourceUploadStatus(msg);
      setMessage(msg);
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
          <label htmlFor="context-source-file">Primary source document <span style={{color:'#888',fontWeight:'normal'}}>(PDF, Word, PowerPoint, Excel, text)</span></label>
          <input
            id="context-source-file"
            className="form-control"
            type="file"
            accept={ORG_ACCEPTED_TYPES}
            onChange={(event) => setSourceFile(event.target.files?.[0] ?? null)}
          />
          {sourceFile && (
            <p style={{margin:'4px 0 0',fontSize:'0.85rem',color:'#555'}}>Selected: {sourceFile.name}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="context-supplementary-files">
            Supplementary files{' '}
            <span style={{ color: '#888', fontWeight: 'normal' }}>
              (optional — PDF, Word, PowerPoint, Excel, text, JSON; add as many rows as you need)
            </span>
          </label>
          {supplementaryRows.map((row, rowIndex) => (
            <div
              key={row.id}
              data-testid={`organisation-supplementary-row-${rowIndex}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}
            >
              <input
                id={rowIndex === 0 ? 'context-supplementary-files' : undefined}
                className="form-control"
                type="file"
                accept={ORG_ACCEPTED_TYPES}
                multiple
                onChange={(event) => handleSupplementaryRowFilesChange(rowIndex, event.target.files)}
              />
              {row.files.length > 0 && (
                <span style={{ fontSize: '0.85rem', color: '#555' }}>
                  {row.files.map((f) => f.name).join(', ')}
                </span>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid={`organisation-supplementary-row-remove-${rowIndex}`}
                onClick={() => handleRemoveSupplementaryRow(rowIndex)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-primary"
          data-testid="upload-organisation-source-btn"
          onClick={() => {
            void uploadModeSourceDocument();
          }}
          disabled={!sourceFile || isUploadingSource}
        >
          {isUploadingSource ? 'Uploading…' : 'Upload Organisation Source'}
        </button>
        {sourceUploadStatus ? (
          <p role="status" style={{ marginTop: 8 }}>{sourceUploadStatus}</p>
        ) : null}

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
                      status: {formatOrganisationSourceStatus(doc)} | chunks: {doc.chunk_count ?? 0}
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
                        onClick={() => archiveOrganisationSource(doc)}
                        disabled={activeDocActionId === doc.id}
                      >
                        Archive
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
