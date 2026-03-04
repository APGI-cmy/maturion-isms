/**
 * CriteriaCard Component
 * FRS: FR-095 (Next Level Guidance Surface)
 * TRS: TR-095
 * Wave: 14 — TASK-W14-BB-004
 *
 * Renders the AI evaluation result for a criterion, including:
 * - Proposed maturity level badge
 * - Confidence score
 * - Rationale
 * - "What to improve" section (next_level_guidance)
 * - "Where you're heading" section (next_plus_one_taster)
 * - "Explore further levels" link that triggers the AI chat panel
 */

export interface CriteriaEvaluation {
  id?: string;
  criteria_id?: string;
  proposed_level: number;
  confidence_score: number;
  rationale?: string;
  findings_summary?: string;
  next_level_guidance?: string;
  next_plus_one_taster?: string;
  status: 'pending_review' | 'confirmed' | 'overridden';
  evaluated_by?: string;
}

interface CriteriaCardProps {
  criteriaName: string;
  criteriaCode?: string;
  evaluation: CriteriaEvaluation;
  excluded?: boolean;
  onConfirm?: (evaluationId: string) => void;
  onOverride?: (evaluationId: string, justification: string) => void;
  /** Opens the AI chat panel with criteria context pre-injected */
  onExploreClick?: () => void;
}

const LEVEL_COLOURS: Record<number, string> = {
  0: 'bg-gray-100 text-gray-700',
  1: 'bg-red-100 text-red-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-green-100 text-green-700',
  5: 'bg-emerald-100 text-emerald-700',
};

const STATUS_LABELS: Record<CriteriaEvaluation['status'], string> = {
  pending_review: 'Pending Review',
  confirmed: 'Confirmed',
  overridden: 'Overridden',
};

export function CriteriaCard({
  criteriaName,
  criteriaCode,
  evaluation,
  excluded = false,
  onExploreClick,
}: CriteriaCardProps) {
  const levelColour = LEVEL_COLOURS[evaluation.proposed_level] ?? 'bg-gray-100 text-gray-700';
  const confidencePct = Math.round(evaluation.confidence_score * 100);

  if (excluded) {
    return (
      <div
        className="criteria-card p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
        data-testid="criteria-card-excluded"
        aria-label={`${criteriaName} — Excluded`}
      >
        <div className="flex items-center justify-between">
          <div>
            {criteriaCode && (
              <span className="text-xs text-gray-500 font-mono mr-2">{criteriaCode}</span>
            )}
            <span className="text-sm font-medium text-gray-500">{criteriaName}</span>
          </div>
          <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded">Excluded</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="criteria-card p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
      data-testid="criteria-card"
      aria-label={`Criteria: ${criteriaName}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {criteriaCode && (
            <span className="text-xs text-gray-500 font-mono mr-2">{criteriaCode}</span>
          )}
          <h4 className="text-sm font-semibold text-gray-900">{criteriaName}</h4>
        </div>
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          {/* Proposed level badge */}
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold ${levelColour}`}
            data-testid="criteria-level-badge"
            aria-label={`Proposed level: ${evaluation.proposed_level}`}
          >
            Level {evaluation.proposed_level}
          </span>
          {/* Confidence score */}
          <span
            className="text-xs text-gray-500"
            data-testid="criteria-confidence-score"
            aria-label={`Confidence: ${confidencePct}%`}
          >
            {confidencePct}% confidence
          </span>
        </div>
      </div>

      {/* Status badge */}
      <div className="mb-3">
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            evaluation.status === 'confirmed'
              ? 'bg-green-100 text-green-700'
              : evaluation.status === 'overridden'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
          data-testid="criteria-status-badge"
        >
          {STATUS_LABELS[evaluation.status]}
        </span>
      </div>

      {/* Rationale */}
      {evaluation.rationale && (
        <div className="mb-3">
          <h5 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
            Rationale
          </h5>
          <p className="text-sm text-gray-700" data-testid="criteria-rationale">
            {evaluation.rationale}
          </p>
        </div>
      )}

      {/* What to improve — next_level_guidance */}
      {evaluation.next_level_guidance && (
        <div
          className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded"
          data-testid="criteria-next-level-guidance"
        >
          <h5 className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
            What to improve
          </h5>
          <p className="text-sm text-blue-800">{evaluation.next_level_guidance}</p>
        </div>
      )}

      {/* Where you're heading — next_plus_one_taster */}
      {evaluation.next_plus_one_taster && (
        <div
          className="mb-3 p-3 bg-green-50 border border-green-100 rounded"
          data-testid="criteria-next-plus-one-taster"
        >
          <h5 className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
            Where you&apos;re heading
          </h5>
          <p className="text-sm text-green-800">{evaluation.next_plus_one_taster}</p>
        </div>
      )}

      {/* Explore further levels link */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          className="text-sm text-primary-600 hover:text-primary-800 underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
          onClick={onExploreClick}
          aria-label="Explore further levels with AI assistant"
          data-testid="criteria-explore-further-levels"
        >
          Explore further levels
        </button>
      </div>
    </div>
  );
}

export default CriteriaCard;
