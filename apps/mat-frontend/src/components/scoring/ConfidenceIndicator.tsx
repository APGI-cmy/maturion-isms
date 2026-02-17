interface ConfidenceIndicatorProps {
  confidence: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ConfidenceIndicator = ({ confidence, showLabel = true, size = 'md' }: ConfidenceIndicatorProps) => {
  const getConfidenceLevel = (conf: number): { label: string; color: string; bgColor: string } => {
    if (conf >= 0.8) {
      return { 
        label: 'High Confidence', 
        color: 'text-green-700', 
        bgColor: 'bg-green-100 border-green-300' 
      };
    } else if (conf >= 0.6) {
      return { 
        label: 'Medium Confidence', 
        color: 'text-yellow-700', 
        bgColor: 'bg-yellow-100 border-yellow-300' 
      };
    } else {
      return { 
        label: 'Low Confidence', 
        color: 'text-red-700', 
        bgColor: 'bg-red-100 border-red-300' 
      };
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const level = getConfidenceLevel(confidence);
  const percentage = Math.round(confidence * 100);

  if (!showLabel) {
    return (
      <div
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full border-2 ${level.bgColor}`}
        title={`${level.label}: ${percentage}%`}
        aria-label={`Confidence: ${percentage}%`}
      >
        <span className={`text-sm font-bold ${level.color}`}>
          {percentage}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center space-x-2 rounded border ${level.bgColor} ${sizeClasses[size]}`}
      role="status"
      aria-label={`${level.label}: ${percentage}%`}
    >
      <div className="flex items-center space-x-1">
        <svg
          className={`h-4 w-4 ${level.color}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {confidence >= 0.8 ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          ) : confidence >= 0.6 ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
        <span className={`font-semibold ${level.color}`}>{percentage}%</span>
      </div>
      <span className={`text-xs ${level.color}`}>{level.label.split(' ')[0]}</span>
    </div>
  );
};

export default ConfidenceIndicator;
