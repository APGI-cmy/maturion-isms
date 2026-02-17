interface ConfidenceIndicatorProps {
  confidence: number;
}

export default function ConfidenceIndicator({ confidence }: ConfidenceIndicatorProps) {
  const color = confidence >= 80 ? 'green' : confidence >= 60 ? 'yellow' : 'red';
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded bg-${color}-100 text-${color}-800`}>
      <span className="text-sm font-bold">{confidence}%</span>
      <span className="text-xs">confidence</span>
    </div>
  );
}
