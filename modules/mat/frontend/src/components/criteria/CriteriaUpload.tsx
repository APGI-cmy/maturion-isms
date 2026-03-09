/**
 * Criteria Upload Component
 * FRS: FR-004 (Criteria Upload), FR-103 (Error Surfacing)
 * TRS: TR-047
 * Task: 5.6.3 (Criteria Management CRUD)
 *
 * Wave 15 — T-W15-IMPL-002 (ui-builder)
 * FR-103: Upload component MUST surface explicit error messages — not silent fail.
 *   uploadError state replaces alert() for upload failures.
 *
 * Wave 15R — T-W15R-UI-001 / T-W15R-UI-002 / T-W15R-UI-003 / T-W15R-UI-004 (ui-builder)
 * - DocumentsList: shows previously uploaded documents with parse status badge
 * - Per-document retry button (T-W15R-UI-002)
 * - Inline error log per failed document (T-W15R-UI-003 / FR-103 full)
 * - alert() replaced with inline success state (T-W15R-UI-003)
 */
import { useState, useEffect } from 'react';
import {
  useUploadCriteria,
  useTriggerAIParsing,
  useUploadedDocuments,
  usePollCriteriaDocumentStatus,
  type UploadedDocument,
} from '../../lib/hooks/useCriteria';

interface CriteriaUploadProps {
  auditId: string;
}

/** Maps audit_logs action → normalised parse-status badge value */
function getParseStatus(doc: UploadedDocument, pollingFilePath: string | null = null): 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'FAILED' {
  const docFilePath = doc.file_path ?? doc.details?.file_path ?? null;
  if (pollingFilePath && docFilePath && pollingFilePath === docFilePath) return 'PROCESSING';
  if (doc.action === 'criteria_parsed') return 'COMPLETE';
  if (doc.action === 'criteria_parse_failed') return 'FAILED';
  // criteria_upload: document uploaded but parsing not yet attempted or unavailable
  if (doc.action === 'criteria_upload') return 'PENDING';
  return 'PENDING';
}

const BADGE_CLASSES: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700 border border-gray-300',
  PROCESSING: 'bg-blue-100 text-blue-700 border border-blue-300',
  COMPLETE: 'bg-green-100 text-green-700 border border-green-300',
  FAILED: 'bg-red-100 text-red-700 border border-red-300',
};

/** Human-readable timestamp */
function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

/** Derive a display-friendly filename from the stored file_path or details */
function getDisplayName(doc: UploadedDocument): string {
  const filePath = doc.file_path ?? doc.details?.file_path ?? '';
  if (filePath) {
    // Strip leading org/criteria/<auditId>/ prefix and timestamp
    const parts = filePath.split('/');
    const lastPart = parts[parts.length - 1] ?? filePath;
    // Remove leading timestamp prefix (e.g. "1709900000000-myfile.pdf" → "myfile.pdf")
    return lastPart.replace(/^\d+-/, '');
  }
  return 'Unknown document';
}

export function CriteriaUpload({ auditId }: CriteriaUploadProps) {
  const uploadCriteria = useUploadCriteria();
  const triggerParsing = useTriggerAIParsing();
  const uploadedDocuments = useUploadedDocuments(auditId);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiParsingWarning, setAiParsingWarning] = useState<string | null>(null);
  // FR-103: inline error state — replaces alert() for upload failures
  const [uploadError, setUploadError] = useState<string | null>(null);
  // T-W15R-UI-003: inline success state — replaces alert() for upload success
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  // T-W15R-UI-002: track which doc is being retried
  const [retryingDocId, setRetryingDocId] = useState<string | null>(null);
  // Track which file path is currently being polled after a parse trigger
  const [pollingFilePath, setPollingFilePath] = useState<string | null>(null);
  const pollStatus = usePollCriteriaDocumentStatus(auditId, pollingFilePath);

  useEffect(() => {
    const status = pollStatus.data?.status;
    if (status === 'pending_review' || status === 'parse_failed') {
      setPollingFilePath(null);
      uploadedDocuments.invalidate();
    }
  }, [pollStatus.data?.status]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // FR-103: clear previous errors/messages before each upload attempt
    setUploadError(null);
    setUploadSuccess(null);
    setAiParsingWarning(null);

    try {
      setUploadProgress(50);
      const result = await uploadCriteria.mutateAsync({ auditId, file: selectedFile });
      setUploadProgress(75);
      
      // Trigger AI parsing — graceful degradation: upload succeeds even if Edge Function unavailable
      let parsingSucceeded = false;
      try {
        await triggerParsing.mutateAsync({ auditId, filePath: result.path });
        parsingSucceeded = true;
      } catch (parsingError) {
        console.warn('[CriteriaUpload] AI parsing unavailable — upload succeeded, parsing pending:', parsingError);
        setAiParsingWarning('Upload complete. AI parsing is currently unavailable — your document has been saved and can be manually processed once the parsing service is restored.');
      }

      setUploadProgress(100);

      // T-W15R-UI-003: replace alert() with inline success message
      if (parsingSucceeded) {
        setUploadSuccess('Criteria document uploaded and parsing initiated!');
        setPollingFilePath(result.path);
      }

      // Refresh the uploaded documents list
      uploadedDocuments.invalidate();

      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      // FR-103: surface upload failure as inline error, not browser alert
      setUploadProgress(0);
      setUploadError(
        error instanceof Error ? error.message : 'Upload failed due to an unknown error. Please try again.',
      );
    }
  };

  // T-W15R-UI-002: per-document retry handler
  const handleRetry = async (doc: UploadedDocument) => {
    const filePath = doc.file_path ?? doc.details?.file_path ?? '';
    if (!filePath) return;

    setRetryingDocId(doc.id);
    try {
      await triggerParsing.mutateAsync({ auditId, filePath });
      setPollingFilePath(filePath);
      uploadedDocuments.invalidate();
    } catch (retryError) {
      console.warn('[CriteriaUpload] Retry parse failed:', retryError);
    } finally {
      setRetryingDocId(null);
    }
  };

  return (
    <div className="criteria-upload p-6 bg-white border border-gray-200 rounded shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Upload Criteria</h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="criteria-file-input"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload criteria file"
        />
        
        <label htmlFor="criteria-file-input" className="cursor-pointer">
          <div className="space-y-2">
            <p className="text-gray-600">
              Drag and drop a file here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOCX (max 10MB)
            </p>
          </div>
        </label>

        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="font-medium">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-4" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100}>
            <div className="bg-blue-600 h-4 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">{uploadProgress}% complete</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploadCriteria.isPending}
        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {uploadCriteria.isPending ? 'Uploading...' : 'Upload and Parse'}
      </button>

      {aiParsingWarning && (
        <div
          data-testid="criteria-upload-ai-parsing-warning"
          className="mt-4 p-4 bg-yellow-50 border border-yellow-400 rounded"
          role="alert"
        >
          <p className="text-yellow-800 text-sm">{aiParsingWarning}</p>
        </div>
      )}

      {/* T-W15R-UI-003: inline upload success — replaces alert() */}
      {uploadSuccess && (
        <div
          data-testid="criteria-upload-success"
          className="mt-4 p-4 bg-green-50 border border-green-400 rounded"
          role="status"
          aria-live="polite"
        >
          <p className="text-green-800 text-sm font-medium">{uploadSuccess}</p>
        </div>
      )}

      {/* FR-103: inline upload error — replaces alert() */}
      {uploadError && (
        <div
          data-testid="criteria-upload-error"
          className="mt-4 p-4 bg-red-50 border border-red-400 rounded"
          role="alert"
        >
          <p className="text-red-800 text-sm font-medium">Upload failed</p>
          <p className="text-red-700 text-sm mt-1">{uploadError}</p>
        </div>
      )}

      {/* T-W15R-UI-001: Uploaded documents list with parse status badge */}
      <section className="mt-8" aria-label="Uploaded documents">
        <h4 className="text-base font-semibold mb-3 text-gray-800">Uploaded Documents</h4>

        {uploadedDocuments.isLoading && (
          <p className="text-sm text-gray-500">Loading documents…</p>
        )}

        {uploadedDocuments.isError && (
          <p className="text-sm text-red-600">Failed to load uploaded documents.</p>
        )}

        {!uploadedDocuments.isLoading &&
          !uploadedDocuments.isError &&
          (uploadedDocuments.data?.length ?? 0) === 0 && (
            <p
              data-testid="documents-empty-state"
              className="text-sm text-gray-500 italic"
            >
              No documents uploaded yet.
            </p>
          )}

        {(uploadedDocuments.data?.length ?? 0) > 0 && (
          <ul className="space-y-3" aria-label="Document list">
            {uploadedDocuments.data!.map((doc) => {
              const status = getParseStatus(doc, pollingFilePath);
              const isRetrying = retryingDocId === doc.id;
              const docFilePath = doc.file_path ?? doc.details?.file_path ?? null;
              const isPolling = !!pollingFilePath && pollingFilePath === docFilePath;
              const errorMessage = doc.details?.error;

              return (
                <li
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  {/* Document info */}
                  <div className="flex-1 min-w-0">
                    <p
                      data-testid="document-name"
                      className="font-medium text-sm text-gray-900 truncate"
                    >
                      {getDisplayName(doc)}
                    </p>
                    <p
                      data-testid="document-upload-time"
                      className="text-xs text-gray-500 mt-0.5"
                    >
                      {formatTimestamp(doc.created_at)}
                    </p>

                    {/* T-W15R-UI-003: inline error per failed document */}
                    {status === 'FAILED' && errorMessage && (
                      <p
                        data-testid="document-parse-error"
                        className="text-xs text-red-600 mt-1"
                        role="alert"
                      >
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  {/* Parse status badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      data-testid="parse-status-badge"
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE_CLASSES[status] ?? BADGE_CLASSES['PENDING']}`}
                    >
                      {status}
                    </span>

                    {/* T-W15R-UI-002: per-document retry button */}
                    <button
                      data-testid="retry-parse-button"
                      onClick={() => void handleRetry(doc)}
                      disabled={isRetrying || isPolling || triggerParsing.isPending}
                      aria-label={`Parse ${getDisplayName(doc)} now`}
                      className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {isRetrying || isPolling ? 'Parsing…' : 'Parse Now'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
