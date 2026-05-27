import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getEdgeInvokeHeaders, supabase } from '@/lib/supabase';

type SubjectKnowledgeDocument = {
  id: string;
  organisation_id: string;
  title: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  storage_bucket: string;
  storage_path: string;
  document_role: string;
  scope_type: string;
  processing_status: string;
  chunk_count: number;
  tags: string[] | null;
  upload_notes: string | null;
  created_at: string;
  updated_at: string;
  kuc_upload_id: string | null;
  kuc_parse_job_id: string | null;
};

type SubjectKnowledgeListResponse = {
  documents: SubjectKnowledgeDocument[];
  stats: {
    total_documents: number;
    processing: number;
    pending: number;
    completed: number;
    failed: number;
    total_chunks: number;
  };
};

type MigrationResult = {
  migration_run_id: string;
  scanned_count: number;
  migrated_count: number;
  deduped_count: number;
  failed_count: number;
  manual_import_required?: boolean;
  message?: string;
  failures?: Array<Record<string, unknown>>;
};

function summarizeBulkFailures(results: Array<{ file: string; ok: boolean; error?: string }>): string {
  const failed = results.filter((item) => !item.ok);
  if (failed.length === 0) {
    return '';
  }

  const buckets = new Map<string, number>();
  for (const item of failed) {
    const key = (item.error ?? 'Unknown error').trim();
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const ranked = [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([reason, count]) => `${count}x ${reason}`);

  return `Top failure causes: ${ranked.join(' | ')}`;
}

type ProfileContext = {
  userId: string;
  organisationId: string | null;
  role: string | null;
};

const SUBJECT_DOCUMENT_TYPES = [
  'knowledge_source',
  'guidance',
  'template',
  'criteria_source',
  'evidence',
];

const SUPERUSER_ROLES = new Set([
  'ADMIN',
  'OWNER',
  'SUPERUSER',
  'BACKOFFICE_ADMIN',
  'LEAD_AUDITOR',
]);

function AppNav() {
  return (
    <header className="app-shell__header">
      <div className="container">
        <nav className="app-nav" aria-label="Main navigation">
          <span className="app-nav__logo">Maturion <span>MMM</span></span>
          <Link className="app-nav__link" to="/dashboard">Dashboard</Link>
          <Link className="app-nav__link" to="/frameworks">Frameworks</Link>
          <Link className="app-nav__link" to="/dmc">DMC</Link>
          <Link className="app-nav__link" to="/onboarding">Onboarding</Link>
        </nav>
      </div>
    </header>
  );
}

function toStatusLabel(status: string | null): string {
  if (!status) return 'Pending';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[index]}`;
}

function isSuperuserRole(role: string | null): boolean {
  if (!role) return false;
  return SUPERUSER_ROLES.has(role.trim().toUpperCase());
}

async function invokeEdgeWithDiagnostics<T>(functionName: string, body: Record<string, unknown>): Promise<T> {
  const headers = await getEdgeInvokeHeaders();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const endpoint = `${supabaseUrl}/functions/v1/${functionName}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const raw = await response.text();
  let parsed: unknown = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = raw;
  }

  if (!response.ok) {
    const detail =
      typeof parsed === 'object' && parsed && 'error' in (parsed as Record<string, unknown>)
        ? String((parsed as Record<string, unknown>).error)
        : raw || `HTTP ${response.status}`;
    throw new Error(`${functionName} failed: ${detail}`);
  }

  return (parsed ?? {}) as T;
}

async function fetchProfileContext(): Promise<ProfileContext> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    throw new Error(sessionError.message || 'Unable to validate session.');
  }

  const userId = sessionData.session?.user?.id;
  if (!userId) {
    throw new Error('User session not found. Please log in again.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('mmm_profiles')
    .select('organisation_id, role')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message || 'Unable to load profile context.');
  }

  return {
    userId,
    organisationId: profile?.organisation_id ?? null,
    role: profile?.role ?? null,
  };
}

async function fetchSubjectKnowledgeDocuments(): Promise<SubjectKnowledgeListResponse> {
  const headers = await getEdgeInvokeHeaders();
  const { data, error } = await supabase.functions.invoke('mmm-subject-knowledge-list', {
    headers,
    body: {},
  });

  if (!error && data) {
    const payload = (data ?? {}) as Partial<SubjectKnowledgeListResponse>;
    return {
      documents: Array.isArray(payload.documents) ? payload.documents : [],
      stats: payload.stats ?? {
        total_documents: 0,
        processing: 0,
        pending: 0,
        completed: 0,
        failed: 0,
        total_chunks: 0,
      },
    };
  }

  // Fallback path: direct canonical-table read when edge runtime is unavailable.
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    throw new Error(sessionError.message || 'Unable to validate session for DMC fallback.');
  }
  const userId = sessionData.session?.user?.id;
  if (!userId) {
    throw new Error('No active user session for DMC fallback.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('mmm_profiles')
    .select('organisation_id')
    .eq('id', userId)
    .maybeSingle();
  if (profileError || !profile?.organisation_id) {
    throw new Error(profileError?.message || 'Unable to resolve organisation for DMC fallback.');
  }

  const { data: docs, error: docsError } = await supabase
    .from('mmm_subject_knowledge_documents')
    .select('id,organisation_id,title,file_name,mime_type,file_size,storage_bucket,storage_path,document_role,scope_type,processing_status,chunk_count,tags,upload_notes,created_at,updated_at,kuc_upload_id,kuc_parse_job_id')
    .eq('organisation_id', profile.organisation_id)
    .is('archived_at', null)
    .order('created_at', { ascending: false });
  if (docsError) {
    throw new Error(docsError.message || 'Unable to load subject knowledge inventory.');
  }

  const documents = (docs ?? []) as SubjectKnowledgeDocument[];
  return {
    documents,
    stats: {
      total_documents: documents.length,
      processing: documents.filter((doc) => doc.processing_status === 'processing').length,
      pending: documents.filter((doc) => doc.processing_status === 'pending').length,
      completed: documents.filter((doc) => doc.processing_status === 'completed').length,
      failed: documents.filter((doc) => doc.processing_status === 'failed').length,
      total_chunks: documents.reduce((sum, doc) => sum + (doc.chunk_count ?? 0), 0),
    },
  };
}

export default function DocumentManagementCenterPage() {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('knowledge_source');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  const profileQuery = useQuery({
    queryKey: ['dmc-profile-context'],
    queryFn: fetchProfileContext,
    staleTime: 30_000,
  });

  const documentsQuery = useQuery({
    queryKey: ['dmc-subject-documents'],
    queryFn: fetchSubjectKnowledgeDocuments,
    enabled: !!profileQuery.data?.userId,
    staleTime: 15_000,
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) {
        throw new Error('Please choose a file before uploading.');
      }

      const profile = profileQuery.data;
      if (!profile) {
        throw new Error('Profile context is still loading.');
      }

      if (!profile.organisationId) {
        throw new Error('No organisation context found for this user.');
      }
      if (!isSuperuserRole(profile.role)) {
        throw new Error(`Current role "${profile.role ?? 'Unknown'}" cannot upload subject knowledge. Ask an ADMIN/SUPERUSER to grant access.`);
      }

      const safeFileName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${profile.organisationId}/${profile.userId}/${Date.now()}-${safeFileName}`;
      const bucket = 'mmm-subject-knowledge';

      const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, selectedFile, {
        upsert: false,
      });
      if (uploadError) {
        throw new Error(uploadError.message || 'Unable to upload file to storage.');
      }

      const parsedTags = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const data = await invokeEdgeWithDiagnostics<{ chunk_count?: number; kuc_error?: string | null }>(
        'mmm-subject-knowledge-upload',
        {
          title: title.trim() || selectedFile.name.replace(/\.[^/.]+$/, ''),
          file_name: selectedFile.name,
          mime_type: selectedFile.type || 'application/octet-stream',
          file_size: selectedFile.size,
          storage_bucket: bucket,
          storage_path: storagePath,
          document_role: documentType,
          tags: parsedTags,
          upload_notes: notes.trim() || null,
        },
      );

      return data;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['dmc-subject-documents'] });
      setSelectedFile(null);
      setTitle('');
      setTags('');
      setNotes('');
      setActionMessage(null);
      const chunks = Number(result?.chunk_count ?? 0);
      if (result?.kuc_error) {
        setStatusMessage(`Uploaded and indexed ${chunks} chunk(s). KUC warning: ${result.kuc_error}`);
      } else {
        setStatusMessage(`Uploaded and indexed ${chunks} chunk(s).`);
      }
    },
    onError: (error) => {
      setActionMessage(null);
      setStatusMessage((error as Error).message);
    },
  });

  const bulkUploadMutation = useMutation({
    mutationFn: async () => {
      const profile = profileQuery.data;
      if (!profile) {
        throw new Error('Profile context is still loading.');
      }
      if (!profile.organisationId) {
        throw new Error('No organisation context found for this user.');
      }
      if (!isSuperuserRole(profile.role)) {
        throw new Error(`Current role "${profile.role ?? 'Unknown'}" cannot bulk upload subject knowledge. Ask an ADMIN/SUPERUSER to grant access.`);
      }
      if (bulkFiles.length === 0) {
        throw new Error('Please choose one or more files before bulk upload.');
      }

      const results: Array<{ file: string; ok: boolean; error?: string }> = [];

      for (const file of bulkFiles) {
        try {
          const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const storagePath = `${profile.organisationId}/${profile.userId}/${Date.now()}-${safeFileName}`;
          const bucket = 'mmm-subject-knowledge';

          const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, file, {
            upsert: false,
          });
          if (uploadError) {
            throw new Error(uploadError.message || 'Unable to upload file to storage.');
          }

          const inferredTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();

          await invokeEdgeWithDiagnostics(
            'mmm-subject-knowledge-upload',
            {
              title: inferredTitle || file.name,
              file_name: file.name,
              mime_type: file.type || 'application/octet-stream',
              file_size: file.size,
              storage_bucket: bucket,
              storage_path: storagePath,
              document_role: 'knowledge_source',
              tags: [],
              upload_notes: 'Auto-ingested via DMC bulk upload.',
            },
          );

          results.push({ file: file.name, ok: true });
        } catch (err) {
          results.push({
            file: file.name,
            ok: false,
            error: err instanceof Error ? err.message : 'Unknown bulk upload error.',
          });
        }
      }

      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ['dmc-subject-documents'] });
      setBulkFiles([]);
      setActionMessage(null);
      const success = results.filter((item) => item.ok).length;
      const failed = results.length - success;
      const summary = summarizeBulkFailures(results);
      setStatusMessage(
        `Bulk upload completed: ${success} succeeded, ${failed} failed.${summary ? ` ${summary}` : ''}`,
      );
    },
    onError: (error) => {
      setActionMessage(null);
      setStatusMessage((error as Error).message);
    },
  });

  const reprocessMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const data = await invokeEdgeWithDiagnostics<{ chunk_count?: number; kuc_error?: string | null }>(
        'mmm-subject-knowledge-reprocess',
        { document_id: documentId },
      );
      return data;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['dmc-subject-documents'] });
      const chunks = Number(result?.chunk_count ?? 0);
      if (result?.kuc_error) {
        setStatusMessage(`Reprocessed ${chunks} chunk(s). KUC warning: ${result.kuc_error}`);
      } else {
        setStatusMessage(`Reprocessed ${chunks} chunk(s).`);
      }
    },
    onError: (error) => {
      setStatusMessage((error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const profile = profileQuery.data;
      if (!profile) {
        throw new Error('Profile context unavailable.');
      }

      const { error } = await supabase
        .from('mmm_subject_knowledge_documents')
        .update({
          archived_at: new Date().toISOString(),
          updated_by: profile.userId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId);
      if (error) {
        throw new Error(error.message || 'Failed to archive document.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dmc-subject-documents'] });
      setStatusMessage('Document archived.');
    },
    onError: (error) => {
      setStatusMessage((error as Error).message);
    },
  });

  const migrateLegacyMutation = useMutation({
    mutationFn: async () => {
      const data = await invokeEdgeWithDiagnostics<MigrationResult>(
        'mmm-subject-knowledge-migrate-legacy',
        {},
      );
      return data;
    },
    onSuccess: (result) => {
      setActionMessage(null);
      setMigrationResult(result);
      queryClient.invalidateQueries({ queryKey: ['dmc-subject-documents'] });
      if (result.manual_import_required) {
        setStatusMessage(
          result.message ??
            'No legacy source configured. Please upload your knowledge files into this DMC project.',
        );
        return;
      }
      setStatusMessage(
        `Legacy migration run ${result.migration_run_id} completed: scanned=${result.scanned_count}, migrated=${result.migrated_count}, deduped=${result.deduped_count}, failed=${result.failed_count}.`,
      );
    },
    onError: (error) => {
      setActionMessage(null);
      setStatusMessage((error as Error).message);
    },
  });

  const documents = documentsQuery.data?.documents ?? [];
  const stats = documentsQuery.data?.stats ?? {
    total_documents: 0,
    processing: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    total_chunks: 0,
  };

  const filteredDocuments = useMemo(() => {
    if (statusFilter === 'all') return documents;
    return documents.filter((doc) => (doc.processing_status ?? 'pending').toLowerCase() === statusFilter);
  }, [documents, statusFilter]);

  const allFilteredSelected =
    filteredDocuments.length > 0 &&
    filteredDocuments.every((doc) => selectedDocumentIds.includes(doc.id));

  const role = profileQuery.data?.role ?? null;
  const isSuperuser = isSuperuserRole(role);

  const handleSingleUploadClick = () => {
    setActionMessage('Upload request started...');
    if (!selectedFile) {
      setActionMessage(null);
      setStatusMessage('Please choose a knowledge file before uploading.');
      return;
    }
    uploadMutation.mutate();
  };

  const handleBulkUploadClick = () => {
    setActionMessage('Bulk upload request started...');
    if (bulkFiles.length === 0) {
      setActionMessage(null);
      setStatusMessage('Please choose one or more files for bulk upload.');
      return;
    }
    bulkUploadMutation.mutate();
  };

  const handleLegacyCheckClick = () => {
    setActionMessage('Legacy migration check started...');
    migrateLegacyMutation.mutate();
  };

  const toggleDocumentSelection = (documentId: string) => {
    setSelectedDocumentIds((prev) =>
      prev.includes(documentId) ? prev.filter((id) => id !== documentId) : [...prev, documentId],
    );
  };

  const toggleSelectAllFiltered = () => {
    setSelectedDocumentIds((prev) => {
      if (allFilteredSelected) {
        return prev.filter((id) => !filteredDocuments.some((doc) => doc.id === id));
      }
      const set = new Set(prev);
      filteredDocuments.forEach((doc) => set.add(doc.id));
      return [...set];
    });
  };

  const handleReprocessSelected = async () => {
    if (selectedDocumentIds.length === 0) {
      setStatusMessage('Select one or more documents to reprocess.');
      return;
    }

    setActionMessage(`Reprocessing ${selectedDocumentIds.length} selected document(s)...`);
    let success = 0;
    const failures: string[] = [];
    for (const documentId of selectedDocumentIds) {
      try {
        await reprocessMutation.mutateAsync(documentId);
        success += 1;
      } catch (error) {
        failures.push((error as Error).message);
      }
    }
    setActionMessage(null);
    const failedCount = selectedDocumentIds.length - success;
    setStatusMessage(`Bulk reprocess completed: ${success} succeeded, ${failedCount} failed.${failedCount ? ` ${summarizeBulkFailures(failures.map((e, i) => ({ file: `${i}`, ok: false, error: e })) )}` : ''}`);
  };

  const handleArchiveSelected = async () => {
    if (selectedDocumentIds.length === 0) {
      setStatusMessage('Select one or more documents to archive.');
      return;
    }
    setActionMessage(`Archiving ${selectedDocumentIds.length} selected document(s)...`);
    let success = 0;
    const failures: string[] = [];
    for (const documentId of selectedDocumentIds) {
      try {
        await deleteMutation.mutateAsync(documentId);
        success += 1;
      } catch (error) {
        failures.push((error as Error).message);
      }
    }
    setActionMessage(null);
    const failedCount = selectedDocumentIds.length - success;
    setStatusMessage(`Bulk archive completed: ${success} succeeded, ${failedCount} failed.${failedCount ? ` ${summarizeBulkFailures(failures.map((e, i) => ({ file: `${i}`, ok: false, error: e })) )}` : ''}`);
    if (!failedCount) {
      setSelectedDocumentIds([]);
    }
  };

  return (
    <div className="app-shell">
      <AppNav />
      <main className="dmc-page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-header__title">Document Management Centre (DMC)</h1>
            <p className="page-header__subtitle">
              Subject Knowledge domain for Maturion AI. Upload, inspect, and reprocess global knowledge content.
            </p>
          </div>

          {statusMessage ? (
            <div className="alert alert-success" role="status">{statusMessage}</div>
          ) : null}

          {profileQuery.isError ? (
            <div className="alert alert-error" role="alert">
              {(profileQuery.error as Error).message}
            </div>
          ) : null}

          {!profileQuery.isLoading && !isSuperuser ? (
            <div className="alert" role="status">
              Subject Knowledge writes are validated server-side for superuser roles. Current MMM role:{' '}
              <strong>{role ?? 'Unknown'}</strong>.
            </div>
          ) : null}

          <section className="dmc-summary-grid" aria-label="DMC summary">
            <article className="card">
              <h3 className="card__title">Global Documents</h3>
              <p className="card__body">{stats.total_documents}</p>
            </article>
            <article className="card">
              <h3 className="card__title">Processing</h3>
              <p className="card__body">{stats.processing} active / {stats.pending} pending</p>
            </article>
            <article className="card">
              <h3 className="card__title">Completed</h3>
              <p className="card__body">{stats.completed} (failed: {stats.failed})</p>
            </article>
            <article className="card">
              <h3 className="card__title">Knowledge Chunks</h3>
              <p className="card__body">{stats.total_chunks.toLocaleString()}</p>
            </article>
          </section>

          <section className="dmc-layout">
            <article className="card dmc-upload-panel">
              <h2 className="card__title">Upload Subject Knowledge</h2>
              <p className="card__body">
                Upload into the AIMC canonical knowledge layer used by Maturion MPS, intent, and criteria reasoning.
              </p>
              <div className="form-group">
                <label htmlFor="dmc-file">Knowledge file</label>
                <input
                  id="dmc-file"
                  className="form-control"
                  type="file"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                  disabled={uploadMutation.isPending}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dmc-bulk-files">Bulk knowledge files</label>
                <input
                  id="dmc-bulk-files"
                  className="form-control"
                  type="file"
                  multiple
                  onChange={(event) => setBulkFiles(Array.from(event.target.files ?? []))}
                  disabled={bulkUploadMutation.isPending}
                />
                <p className="card__body" style={{ marginTop: '0.5rem' }}>
                  {bulkFiles.length} file(s) selected. Bulk mode auto-extracts filename, MIME type, and file size.
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="dmc-title">Title</label>
                <input
                  id="dmc-title"
                  className="form-control"
                  type="text"
                  placeholder="Optional display title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={uploadMutation.isPending}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dmc-type">Document role</label>
                <select
                  id="dmc-type"
                  className="form-control"
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value)}
                  disabled={uploadMutation.isPending}
                >
                  {SUBJECT_DOCUMENT_TYPES.map((docType) => (
                    <option key={docType} value={docType}>
                      {docType}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="dmc-tags">Tags</label>
                <input
                  id="dmc-tags"
                  className="form-control"
                  type="text"
                  placeholder="Comma-separated tags"
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  disabled={uploadMutation.isPending}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dmc-notes">Upload notes</label>
                <textarea
                  id="dmc-notes"
                  className="form-control"
                  rows={4}
                  placeholder="What should Maturion learn from this file?"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  disabled={uploadMutation.isPending}
                />
              </div>
              <div className="dmc-upload-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleSingleUploadClick}
                  disabled={uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? 'Uploading…' : 'Upload to Subject Knowledge'}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleBulkUploadClick}
                  disabled={bulkUploadMutation.isPending}
                >
                  {bulkUploadMutation.isPending ? 'Bulk Uploading…' : 'Bulk Upload Files'}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={handleLegacyCheckClick}
                  disabled={migrateLegacyMutation.isPending}
                >
                  {migrateLegacyMutation.isPending ? 'Checking…' : 'Legacy Migration Check'}
                </button>
                <Link className="btn btn-outline" to="/framework-origin">Go to Criteria Modes</Link>
              </div>
              {statusMessage ? (
                <div
                  className={`alert ${statusMessage.toLowerCase().includes('failed') || statusMessage.toLowerCase().includes('error') || statusMessage.toLowerCase().includes('please choose') ? 'alert-error' : 'alert-success'}`}
                  role="status"
                  style={{ marginTop: '0.5rem' }}
                >
                  {statusMessage}
                </div>
              ) : null}
              {actionMessage ? (
                <p className="card__body" style={{ marginTop: '0.5rem' }}>{actionMessage}</p>
              ) : null}
              <p className="card__body" style={{ marginTop: '0.75rem' }}>
                If your old Supabase project was deleted, use this DMC page as the new source of truth and upload files directly here.
              </p>
              {!selectedFile && !bulkFiles.length ? (
                <p className="card__body" style={{ marginTop: '0.5rem' }}>
                  Select a file (or multiple files) first, then click upload. If you click without files selected, DMC will show a clear error.
                </p>
              ) : null}
              {migrationResult ? (
                <div className="alert" role="status">
                  <p><strong>migration_run_id:</strong> {migrationResult.migration_run_id}</p>
                  {migrationResult.manual_import_required ? (
                    <p><strong>Manual import required:</strong> Yes (no legacy source configured)</p>
                  ) : null}
                  <p>
                    scanned_count: {migrationResult.scanned_count} | migrated_count: {migrationResult.migrated_count} |
                    deduped_count: {migrationResult.deduped_count} | failed_count: {migrationResult.failed_count}
                  </p>
                </div>
              ) : null}
            </article>

            <article className="card dmc-documents-panel">
              <div className="dmc-documents-header">
                <h2 className="card__title">Subject Knowledge Inventory</h2>
                <div className="form-group dmc-filter-group">
                  <label htmlFor="dmc-status-filter">Status</label>
                  <select
                    id="dmc-status-filter"
                    className="form-control"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              <div className="dmc-upload-actions" style={{ marginBottom: '0.75rem' }}>
                <button className="btn btn-outline" onClick={toggleSelectAllFiltered}>
                  {allFilteredSelected ? 'Clear Select (Filtered)' : 'Select All (Filtered)'}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={handleReprocessSelected}
                  disabled={reprocessMutation.isPending || selectedDocumentIds.length === 0}
                >
                  Reprocess Selected ({selectedDocumentIds.length})
                </button>
                <button
                  className="btn btn-outline"
                  onClick={handleArchiveSelected}
                  disabled={deleteMutation.isPending || selectedDocumentIds.length === 0}
                >
                  Archive Selected ({selectedDocumentIds.length})
                </button>
              </div>

              {documentsQuery.isLoading ? (
                <p className="card__body">Loading subject knowledge documents…</p>
              ) : documentsQuery.isError ? (
                <div className="alert alert-error" role="alert">
                  {(documentsQuery.error as Error).message}
                </div>
              ) : filteredDocuments.length === 0 ? (
                <p className="card__body">
                  No global subject-knowledge documents found yet.
                </p>
              ) : (
                <div className="dmc-table-wrap">
                  <table className="dmc-table">
                    <thead>
                      <tr>
                        <th>Select</th>
                        <th>Document</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Size</th>
                        <th>Chunks</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedDocumentIds.includes(doc.id)}
                              onChange={() => toggleDocumentSelection(doc.id)}
                              aria-label={`Select ${doc.file_name}`}
                            />
                          </td>
                          <td>
                            <strong>{doc.title || doc.file_name}</strong>
                            <p>{doc.file_name}</p>
                            {doc.tags && doc.tags.length > 0 ? (
                              <p>Tags: {doc.tags.join(', ')}</p>
                            ) : null}
                          </td>
                          <td>{doc.document_role}</td>
                          <td>{toStatusLabel(doc.processing_status)}</td>
                          <td>{formatFileSize(doc.file_size)}</td>
                          <td>{doc.chunk_count ?? 0}</td>
                          <td>
                            <div className="dmc-row-actions">
                              <button
                                className="btn btn-outline"
                                onClick={() => reprocessMutation.mutate(doc.id)}
                                disabled={!isSuperuser || reprocessMutation.isPending}
                              >
                                Reprocess
                              </button>
                              <button
                                className="btn btn-outline"
                                onClick={() => deleteMutation.mutate(doc.id)}
                                disabled={!isSuperuser || deleteMutation.isPending}
                              >
                                Archive
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
