import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { GeneratedCriteriaDraft } from '../../hooks/useDomainAuditBuilder';

interface AIGeneratedCriteriaCardsProps {
  mpsId: string;
  mpsLabel: string;
  onAccept: (criteria: GeneratedCriteriaDraft[]) => void;
}

export function AIGeneratedCriteriaCards({ mpsId, mpsLabel, onAccept }: AIGeneratedCriteriaCardsProps) {
  const [drafts, setDrafts] = useState<GeneratedCriteriaDraft[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const prompt = `Generate 3 audit criteria for ${mpsLabel}. Return JSON array of { statement }.`;
      const { data, error: invokeError } = await supabase.functions.invoke('maturion-ai-chat', {
        body: { prompt, context: 'Criteria generation', mpsId },
      });
      if (invokeError) {
        throw new Error(invokeError.message);
      }
      const response = (data?.response || data?.content || '').toString();
      const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim() || '[]') as Array<{ statement?: string }>;
      const normalized = parsed
        .filter((item) => item.statement?.trim())
        .slice(0, 5)
        .map((item) => ({ statement: item.statement!.trim() }));

      if (normalized.length === 0) {
        throw new Error('No criteria returned.');
      }
      setDrafts(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate criteria.');
      setDrafts([
        { statement: `A documented control objective exists for ${mpsLabel}.` },
        { statement: `A review record confirms ${mpsLabel} execution cadence.` },
        { statement: `A tracked evidence log supports ${mpsLabel} assurance outcomes.` },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateDraft = (index: number, statement: string) => {
    setDrafts((current) => current.map((draft, i) => (i === index ? { statement } : draft)));
  };

  return (
    <div className="ai-criteria-cards" data-testid={`ai-generated-criteria-${mpsId}`}>
      <button
        type="button"
        className="btn btn-outline"
        onClick={generate}
        disabled={isGenerating}
        data-testid={`generate-criteria-${mpsId}`}
      >
        {isGenerating ? 'Generating criteria…' : 'Generate Criteria'}
      </button>
      {error ? (
        <p role="status" data-testid={`criteria-generation-error-${mpsId}`}>
          {error}
        </p>
      ) : null}
      {drafts.length > 0 ? (
        <div className="ai-criteria-cards__list">
          {drafts.map((draft, index) => (
            <label key={`${mpsId}-${index}`} className="ai-criteria-cards__item">
              <span>Criterion {index + 1}</span>
              <textarea
                value={draft.statement}
                onChange={(event) => updateDraft(index, event.target.value)}
                rows={2}
                data-testid={`criteria-draft-${mpsId}-${index}`}
              />
            </label>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onAccept(drafts.filter((draft) => draft.statement.trim()))}
            data-testid={`accept-generated-criteria-${mpsId}`}
          >
            Accept Criteria
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default AIGeneratedCriteriaCards;

