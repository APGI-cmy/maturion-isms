import React from 'react';
import type { GeneratedCriterionItem } from './CriteriaManagement';

interface AIGeneratedCriteriaCardsProps {
  mpsId: string;
  criteria: GeneratedCriterionItem[];
  acceptedCodes: Set<string>;
  isSaving: boolean;
  onToggleCriterion: (code: string) => void;
  onAcceptAll: () => void;
  onSaveAccepted: () => void;
}

export function AIGeneratedCriteriaCards({
  mpsId,
  criteria,
  acceptedCodes,
  isSaving,
  onToggleCriterion,
  onAcceptAll,
  onSaveAccepted,
}: AIGeneratedCriteriaCardsProps) {
  return (
    <div data-testid={`generated-criteria-list-${mpsId}`}>
      <button
        type="button"
        className="btn btn-outline"
        data-testid={`accept-all-criteria-btn-${mpsId}`}
        onClick={onAcceptAll}
      >
        Accept All
      </button>
      <ol className="modal-list">
        {criteria.map((criterion) => (
          <li key={criterion.code} className="modal-list__item" data-testid="generated-criterion-item">
            <label>
              <input
                type="checkbox"
                checked={acceptedCodes.has(criterion.code)}
                onChange={() => onToggleCriterion(criterion.code)}
                data-testid={`criterion-select-${criterion.code}`}
                aria-label={`Select criterion ${criterion.code}`}
              />
              <strong> {criterion.code}</strong> — {criterion.statement}
              {criterion.source_origin ? (
                <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                  [{criterion.source_origin}]
                </span>
              ) : null}
            </label>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="btn btn-primary"
        data-testid={`save-criteria-btn-${mpsId}`}
        onClick={onSaveAccepted}
        disabled={isSaving || acceptedCodes.size === 0}
      >
        {isSaving ? 'Saving…' : 'Save accepted criteria'}
      </button>
    </div>
  );
}

export default AIGeneratedCriteriaCards;
