interface ConfidenceIndicatorProps {
  confidence: number;
}

export default function ConfidenceIndicator({ confidence }: ConfidenceIndicatorProps) {
  // Use complete class names for Tailwind purge compatibility
  const colorClasses = confidence >= 80 
    ? 'bg-green-100 text-green-800' 
    : confidence >= 60 
    ? 'bg-yellow-100 text-yellow-800' 
    : 'bg-red-100 text-red-800';
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded ${colorClasses}`}>
      <span className="text-sm font-bold">{confidence}%</span>
      <span className="text-xs">confidence</span>
    </div>
  );
}
