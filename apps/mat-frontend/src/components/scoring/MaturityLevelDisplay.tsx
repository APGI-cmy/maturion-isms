import React from 'react';

interface MaturityLevelDisplayProps {
  level: number;
}

export default function MaturityLevelDisplay({ level }: MaturityLevelDisplayProps) {
  const levels = [
    { value: 0, label: 'Not Implemented', color: 'bg-red-500' },
    { value: 1, label: 'Initial', color: 'bg-orange-500' },
    { value: 2, label: 'Managed', color: 'bg-yellow-500' },
    { value: 3, label: 'Defined', color: 'bg-blue-500' },
    { value: 4, label: 'Quantitatively Managed', color: 'bg-green-500' },
    { value: 5, label: 'Optimizing', color: 'bg-green-700' },
  ];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Maturity Level:</p>
      <div className="flex gap-1">
        {levels.map((l) => (
          <div
            key={l.value}
            className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-medium ${
              l.value === level
                ? `${l.color} text-white`
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {l.value}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Level {level}: {levels.find((l) => l.value === level)?.label}
      </p>
    </div>
  );
}
