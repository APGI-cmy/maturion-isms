import { useState } from 'react';

interface CriteriaUploadProps {
  onUpload?: (file: File) => void;
  accept?: string;
}

const CriteriaUpload = ({ onUpload, accept = '.pdf,.docx,.xlsx' }: CriteriaUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PDF, DOCX, or XLSX file.');
      return false;
    }
    setError(null);
    return true;
  };

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
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = () => {
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Upload Criteria Document</h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="criteria-upload"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          aria-label="Upload criteria document"
        />
        
        <label
          htmlFor="criteria-upload"
          className="cursor-pointer"
        >
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-gray-600">
              <span className="text-primary-600 hover:text-primary-500">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-gray-500">PDF, DOCX, or XLSX files only</p>
          </div>
        </label>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm" role="alert">
          {error}
        </div>
      )}

      {file && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-gray-700">{file.name}</span>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-sm text-red-600 hover:text-red-700"
              aria-label="Remove file"
            >
              Remove
            </button>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 w-full px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Upload and Parse
          </button>
        </div>
      )}
    </div>
  );
};

export default CriteriaUpload;
