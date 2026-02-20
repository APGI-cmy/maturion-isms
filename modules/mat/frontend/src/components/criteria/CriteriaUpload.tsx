/**
 * Criteria Upload Component
 * FRS: FR-004 (Criteria Upload)
 * TRS: TR-047
 * Task: 5.6.3 (Criteria Management CRUD)
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

    try {
      setUploadProgress(50);
      const result = await uploadCriteria.mutateAsync({ auditId, file: selectedFile });
      setUploadProgress(75);
      
      // Trigger AI parsing
      await triggerParsing.mutateAsync({ auditId, filePath: result.path });
      setUploadProgress(100);
      
      alert('Criteria document uploaded and parsing initiated!');
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      setUploadProgress(0);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    </div>
  );
}
