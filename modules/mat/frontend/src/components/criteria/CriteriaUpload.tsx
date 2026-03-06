/**
 * Criteria Upload Component
 * FRS: FR-004 (Criteria Upload), FR-103 (Error Surfacing)
 * TRS: TR-047
 * Task: 5.6.3 (Criteria Management CRUD)
 *
 * Wave 15 — T-W15-IMPL-002 (ui-builder)
 * FR-103: Upload component MUST surface explicit error messages — not silent fail.
 *   uploadError state replaces alert() for upload failures.
 */
import { useState } from 'react';
import { useUploadCriteria, useTriggerAIParsing } from '../../lib/hooks/useCriteria';

interface CriteriaUploadProps {
  auditId: string;
}

export function CriteriaUpload({ auditId }: CriteriaUploadProps) {
  const uploadCriteria = useUploadCriteria();
  const triggerParsing = useTriggerAIParsing();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiParsingWarning, setAiParsingWarning] = useState<string | null>(null);
  // FR-103: inline error state — replaces alert() for upload failures
  const [uploadError, setUploadError] = useState<string | null>(null);

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

    // FR-103: clear previous errors before each upload attempt
    setUploadError(null);
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

      if (parsingSucceeded) {
        alert('Criteria document uploaded and parsing initiated!');
      }
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
    </div>
  );
}
