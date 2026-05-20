import React, { useState } from 'react';

interface EnhancedCriteriaGeneratorProps {
  domainId: string;
  mpsId: string;
  onCriteriaGenerated: (criteria: string) => void;
}

export function EnhancedCriteriaGenerator({
  domainId,
  mpsId,
  onCriteriaGenerated,
}: EnhancedCriteriaGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [draft, setDraft] = useState('');

  const generate = () => {
    const source = prompt.trim() || `domain ${domainId}`;
    setDraft(`A maintained evidence artifact demonstrates controlled execution for ${source} (${mpsId}).`);
  };

  return (
    <div className="enhanced-criteria-generator" data-testid={`enhanced-criteria-generator-${mpsId}`}>
      <label>
        <span>Refine criteria prompt</span>
        <textarea
          rows={2}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Describe the criteria you want refined."
          data-testid={`enhanced-criteria-prompt-${mpsId}`}
        />
      </label>
      <button type="button" className="btn btn-outline" onClick={generate} data-testid={`enhanced-generate-${mpsId}`}>
        Refine with Enhanced Generator
      </button>
      {draft ? (
        <div className="enhanced-criteria-generator__draft">
          <textarea
            rows={2}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            data-testid={`enhanced-criteria-draft-${mpsId}`}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onCriteriaGenerated(draft)}
            data-testid={`enhanced-criteria-accept-${mpsId}`}
          >
            Approve Refined Criterion
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default EnhancedCriteriaGenerator;

