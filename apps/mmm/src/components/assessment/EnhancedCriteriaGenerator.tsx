import React from 'react';

interface EnhancedCriteriaGeneratorProps {
  mpsId: string;
  refinePrompt: string;
  isGenerating: boolean;
  onRefinePromptChange: (value: string) => void;
  onGenerate: () => void;
}

export function EnhancedCriteriaGenerator({
  mpsId,
  refinePrompt,
  isGenerating,
  onRefinePromptChange,
  onGenerate,
}: EnhancedCriteriaGeneratorProps) {
  return (
    <div className="enhanced-criteria-generator" data-testid={`enhanced-criteria-generator-${mpsId}`}>
      <label htmlFor={`criteria-refine-${mpsId}`}>
        Refine criteria prompt
      </label>
      <textarea
        id={`criteria-refine-${mpsId}`}
        rows={2}
        value={refinePrompt}
        onChange={(event) => onRefinePromptChange(event.target.value)}
        placeholder="Optional: add refinement context for generated criteria."
        data-testid={`criteria-refine-prompt-${mpsId}`}
      />
      <button
        type="button"
        className="btn btn-primary"
        data-testid={`generate-criteria-btn-${mpsId}`}
        onClick={onGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating criteria…' : 'Generate criteria'}
      </button>
    </div>
  );
}

export default EnhancedCriteriaGenerator;

