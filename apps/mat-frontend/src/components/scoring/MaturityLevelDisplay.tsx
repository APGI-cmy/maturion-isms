interface MaturityLevelDisplayProps {
  level: number;
}

export default function MaturityLevelDisplay({ level }: MaturityLevelDisplayProps) {
  const labels = ['N/A', 'Initial', 'Managed', 'Defined', 'Quantitatively Managed', 'Optimizing'];
  
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-2xl font-bold text-blue-600">{level}</span>
      <span className="text-sm text-gray-600">{labels[level] || 'Unknown'}</span>
    </div>
  );
}
