/**
 * Review Table Component
 * FRS: FR-021 to FR-023 (Scoring Review)
 * TRS: TR-050
 * Task: 5.6.5
 */
import { useState } from 'react';
import { useAuditScores, useConfirmScore, useOverrideScore } from '../../lib/hooks/useScoring';
import { Check, Edit2, AlertCircle } from 'lucide-react';

interface ReviewTableProps {
  auditId: string;
}

export function ReviewTable({ auditId }: ReviewTableProps) {
  const { data: scores, isLoading, isError, error } = useAuditScores(auditId);
  const confirmScore = useConfirmScore();
  const overrideScore = useOverrideScore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'overridden'>('all');
  const [search, setSearch] = useState('');
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [overrideValue, setOverrideValue] = useState(0);
  const [overrideJustification, setOverrideJustification] = useState('');

  const handleConfirm = async (scoreId: string, criterionId: string) => {
    try {
      await confirmScore.mutateAsync({ scoreId, criterionId, auditId });
      alert('Score confirmed successfully!');
    } catch (err) {
      alert(`Failed to confirm score: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleOverride = async (scoreId: string, criterionId: string) => {
    if (!overrideJustification.trim() || overrideValue < 0 || overrideValue > 5) {
      alert('Please provide a valid override score (0-5) and justification');
      return;
    }

    try {
      await overrideScore.mutateAsync({
        scoreId,
        criterionId,
        auditId,
        overrideScore: overrideValue,
        justification: overrideJustification,
      });
      setEditingScoreId(null);
      setOverrideValue(0);
      setOverrideJustification('');
      alert('Score override saved successfully!');
    } catch (err) {
      alert(`Failed to override score: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const filteredScores = scores?.filter((score) => {
    const matchesFilter = filter === 'all' || score.status === filter;
    const matchesSearch = search === '' ||
      score.criterion_number.toLowerCase().includes(search.toLowerCase()) ||
      score.criterion_title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Confirmed</span>;
      case 'overridden':
        return <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">Overridden</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">Pending</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getMaturityLabel = (level: number) => {
    const labels = ['0 - Not Met', '1 - Initial', '2 - Developing', '3 - Defined', '4 - Managed', '5 - Optimizing'];
    return labels[level] || `Level ${level}`;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded w-full" />
        <div className="h-64 bg-gray-200 rounded w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-2 border-red-500 bg-red-50 rounded p-4" role="alert">
        <p className="text-red-800">Failed to load scores: {error?.message}</p>
      </div>
    );
  }

  if (!scores || scores.length === 0) {
    return (
      <div className="border-2 border-gray-300 bg-gray-50 rounded p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p className="text-gray-600">No scores available yet.</p>
        <p className="text-sm text-gray-500 mt-2">
          AI scoring will run after evidence is collected.
        </p>
      </div>
    );
  }

  return (
    <div className="review-table">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search criteria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          aria-label="Search criteria"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          aria-label="Filter by status"
        >
          <option value="all">All ({scores.length})</option>
          <option value="pending">Pending ({scores.filter(s => s.status === 'pending').length})</option>
          <option value="confirmed">Confirmed ({scores.filter(s => s.status === 'confirmed').length})</option>
          <option value="overridden">Overridden ({scores.filter(s => s.status === 'overridden').length})</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Criterion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AI Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Human Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evidence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredScores.map((score) => (
              <tr key={score.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{score.criterion_number}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{score.criterion_title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getMaturityLabel(score.ai_score)}</div>
                  <div className="text-xs text-gray-500">Confidence: {(score.confidence * 100).toFixed(0)}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingScoreId === score.id ? (
                    <div className="space-y-2">
                      <select
                        value={overrideValue}
                        onChange={(e) => setOverrideValue(parseInt(e.target.value))}
                        className="w-full text-sm border-gray-300 rounded-md"
                      >
                        <option value={0}>0 - Not Met</option>
                        <option value={1}>1 - Initial</option>
                        <option value={2}>2 - Developing</option>
                        <option value={3}>3 - Defined</option>
                        <option value={4}>4 - Managed</option>
                        <option value={5}>5 - Optimizing</option>
                      </select>
                      <textarea
                        value={overrideJustification}
                        onChange={(e) => setOverrideJustification(e.target.value)}
                        placeholder="Justification..."
                        className="w-full text-sm border-gray-300 rounded-md"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOverride(score.id, score.criterion_number)}
                          disabled={overrideScore.isPending}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingScoreId(null);
                            setOverrideValue(0);
                            setOverrideJustification('');
                          }}
                          className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900">
                      {score.human_score !== undefined ? getMaturityLabel(score.human_score) : '-'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {score.evidence_count} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(score.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {score.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirm(score.id, score.criterion_number)}
                        disabled={confirmScore.isPending}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        title="Confirm AI score"
                      >
                        <Check className="h-4 w-4" />
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          setEditingScoreId(score.id);
                          setOverrideValue(score.ai_score);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        title="Override score"
                      >
                        <Edit2 className="h-4 w-4" />
                        Override
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredScores.length === 0 && (
        <div className="border-2 border-gray-300 bg-gray-50 rounded p-8 text-center mt-4">
          <p className="text-gray-600">No scores match your filter.</p>
        </div>
      )}
    </div>
  );
}
