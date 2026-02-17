interface UploadItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

interface UploadProgressProps {
  uploads?: UploadItem[];
  onCancel?: (uploadId: string) => void;
  onRetry?: (uploadId: string) => void;
}

const UploadProgress = ({ uploads = [], onCancel, onRetry }: UploadProgressProps) => {
  if (uploads.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">
          Uploading {uploads.filter(u => u.status === 'uploading').length} files
        </h3>
      </div>

      <div className="p-4 space-y-3">
        {uploads.map((upload) => (
          <div key={upload.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{upload.name}</p>
                <p className="text-xs text-gray-500">
                  {(upload.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div className="ml-4 flex items-center space-x-2">
                {upload.status === 'uploading' && (
                  <span className="text-xs text-gray-600">{upload.progress}%</span>
                )}
                {upload.status === 'complete' && (
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {upload.status === 'error' && (
                  <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                
                {upload.status === 'uploading' && onCancel && (
                  <button
                    onClick={() => onCancel(upload.id)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Cancel upload"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {upload.status === 'uploading' && (
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${upload.progress}%` }}
                  role="progressbar"
                  aria-valuenow={upload.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            )}

            {upload.status === 'error' && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-red-600">{upload.error || 'Upload failed'}</p>
                {onRetry && (
                  <button
                    onClick={() => onRetry(upload.id)}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadProgress;
