interface ParsingProgressProps {
  status: 'idle' | 'uploading' | 'parsing' | 'validating' | 'complete' | 'error';
  progress?: number;
  message?: string;
}

const ParsingProgress = ({ status, progress = 0, message }: ParsingProgressProps) => {
  const statusConfig = {
    idle: { label: 'Ready', color: 'text-gray-600' },
    uploading: { label: 'Uploading...', color: 'text-blue-600' },
    parsing: { label: 'Parsing document...', color: 'text-blue-600' },
    validating: { label: 'Validating criteria...', color: 'text-yellow-600' },
    complete: { label: 'Parsing complete', color: 'text-green-600' },
    error: { label: 'Error occurred', color: 'text-red-600' },
  };

  const config = statusConfig[status];

  if (status === 'idle') {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow" role="status" aria-live="polite">
      <div className="flex items-center space-x-3 mb-4">
        {status !== 'complete' && status !== 'error' && (
          <div className="animate-spin h-5 w-5 border-2 border-primary-600 border-t-transparent rounded-full"></div>
        )}
        {status === 'complete' && (
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === 'error' && (
          <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <h3 className={`text-lg font-semibold ${config.color}`}>{config.label}</h3>
      </div>

      {status !== 'idle' && status !== 'complete' && status !== 'error' && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
      )}

      {message && (
        <p className="mt-3 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default ParsingProgress;
