interface MaturitySelectorProps {
  value: number;
  onChange?: (level: number) => void;
  disabled?: boolean;
  showDescriptions?: boolean;
}

const MaturitySelector = ({ value, onChange, disabled = false, showDescriptions = false }: MaturitySelectorProps) => {
  const maturityLevels = [
    { 
      value: 0, 
      label: 'Level 0', 
      name: 'Not Achieved',
      description: 'Process not implemented or objectives not achieved'
    },
    { 
      value: 1, 
      label: 'Level 1', 
      name: 'Ad Hoc',
      description: 'Process is ad hoc and disorganized'
    },
    { 
      value: 2, 
      label: 'Level 2', 
      name: 'Repeatable',
      description: 'Process is planned and tracked'
    },
    { 
      value: 3, 
      label: 'Level 3', 
      name: 'Defined',
      description: 'Process is well characterized and understood'
    },
    { 
      value: 4, 
      label: 'Level 4', 
      name: 'Managed',
      description: 'Process is measured and controlled'
    },
    { 
      value: 5, 
      label: 'Level 5', 
      name: 'Optimizing',
      description: 'Focus on continuous process improvement'
    },
  ];

  return (
    <div className="space-y-2">
      {maturityLevels.map((level) => (
        <label
          key={level.value}
          className={`flex items-start p-3 border rounded cursor-pointer transition-colors ${
            value === level.value
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            type="radio"
            name="maturityLevel"
            value={level.value}
            checked={value === level.value}
            onChange={(e) => onChange?.(Number(e.target.value))}
            disabled={disabled}
            className="h-4 w-4 mt-0.5 text-primary-600 focus:ring-primary-500 border-gray-300"
            aria-label={`${level.label} - ${level.name}`}
          />
          <div className="ml-3 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-900">{level.label}</span>
              <span className="text-sm text-gray-600">- {level.name}</span>
            </div>
            {showDescriptions && (
              <p className="mt-1 text-xs text-gray-500">{level.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
};

export default MaturitySelector;
