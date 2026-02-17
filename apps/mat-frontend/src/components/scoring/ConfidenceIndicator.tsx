import React from 'react';

interface ConfidenceIndicatorProps {
  confidence: number;
}

export default function ConfidenceIndicator({ confidence }: ConfidenceIndicatorProps) {
  const percentage = Math.round(confidence * 100);
  
  const getColor = () => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Confidence:</span>
      <span className={`px-2 py-1 rounded text-sm font-semibold ${getColor()}`}>
        {percentage}%
      </span>
    </div>
  );
}
