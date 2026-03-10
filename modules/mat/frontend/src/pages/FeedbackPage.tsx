/**
 * Feedback / Recommendations Page
 * FRS: Wave 16.2 — GAP-006, GAP-020
 *
 * Displays the gap_analysis JSONB from the scores table
 * (immediate / medium_term / long_term recommendations) and
 * next_level_guidance from criteria_evaluations for the active audit.
 */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GapAnalysis {
  immediate?: string[];
  medium_term?: string[];
  long_term?: string[];
}

interface ScoreRow {
  id: string;
  audit_id: string;
  gap_analysis: GapAnalysis | null;
  maturity_level: number | null;
  domain: string | null;
}

interface CriteriaEvaluation {
  id: string;
  criterion_id: string;
  next_level_guidance: string | null;
  criterion_number?: string;
  criterion_title?: string;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useScoresWithGapAnalysis(auditId: string) {
  return useQuery<ScoreRow[], Error>({
    queryKey: ['scores-gap-analysis', auditId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scores')
        .select('id, audit_id, gap_analysis, maturity_level, domain')
        .eq('audit_id', auditId);
      if (error) throw new Error(`Failed to fetch scores: ${error.message}`);
      return data ?? [];
    },
    enabled: !!auditId,
    staleTime: 30000,
  });
}

function useCriteriaEvaluationsGuidance(auditId: string) {
  return useQuery<CriteriaEvaluation[], Error>({
    queryKey: ['criteria-evaluations-guidance', auditId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('criteria_evaluations')
        .select('id, criterion_id, next_level_guidance, criterion_number, criterion_title')
        .eq('audit_id', auditId)
        .not('next_level_guidance', 'is', null);
      if (error) throw new Error(`Failed to fetch criteria evaluations: ${error.message}`);
      return data ?? [];
    },
    enabled: !!auditId,
    staleTime: 30000,
  });
}

function useAudits() {
  return useQuery<{ id: string; title: string }[], Error>({
    queryKey: ['audits-for-feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audits')
        .select('id, title')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (error) throw new Error(`Failed to fetch audits: ${error.message}`);
      return data ?? [];
    },
    staleTime: 60000,
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function GapAnalysisSection({ gapAnalysis }: { gapAnalysis: GapAnalysis }) {
  const sections = [
    {
      key: 'immediate',
      title: 'Immediate Actions',
      items: gapAnalysis.immediate ?? [],
      icon: <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />,
      badgeClass: 'bg-red-50 border-red-200',
      headerClass: 'text-red-700',
    },
    {
      key: 'medium_term',
      title: 'Medium-Term Improvements',
      items: gapAnalysis.medium_term ?? [],
      icon: <Clock className="h-5 w-5 text-yellow-500" aria-hidden="true" />,
      badgeClass: 'bg-yellow-50 border-yellow-200',
      headerClass: 'text-yellow-700',
    },
    {
      key: 'long_term',
      title: 'Long-Term Goals',
      items: gapAnalysis.long_term ?? [],
      icon: <TrendingUp className="h-5 w-5 text-blue-500" aria-hidden="true" />,
      badgeClass: 'bg-blue-50 border-blue-200',
      headerClass: 'text-blue-700',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {sections.map((section) => (
        <div
          key={section.key}
          className={`border rounded-lg p-4 ${section.badgeClass}`}
          aria-labelledby={`gap-section-${section.key}`}
        >
          <div className="flex items-center gap-2 mb-3">
            {section.icon}
            <h3
              id={`gap-section-${section.key}`}
              className={`font-semibold text-sm ${section.headerClass}`}
            >
              {section.title}
            </h3>
          </div>
          {section.items.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No items identified</p>
          ) : (
            <ul className="space-y-2" aria-label={section.title}>
              {section.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export function FeedbackPage() {
  const { data: audits, isLoading: auditsLoading } = useAudits();
  const [selectedAuditId, setSelectedAuditId] = useState<string>('');

  const activeAuditId = selectedAuditId || audits?.[0]?.id || '';

  const { data: scores, isLoading: scoresLoading, isError: scoresError } =
    useScoresWithGapAnalysis(activeAuditId);

  const { data: evaluations, isLoading: evalsLoading, isError: evalsError } =
    useCriteriaEvaluationsGuidance(activeAuditId);

  const isLoading = auditsLoading || scoresLoading || evalsLoading;
  const isError = scoresError || evalsError;

  // Aggregate all gap_analysis objects across scores
  const mergedGapAnalysis: GapAnalysis = {
    immediate: [],
    medium_term: [],
    long_term: [],
  };
  if (scores) {
    for (const score of scores) {
      if (score.gap_analysis) {
        mergedGapAnalysis.immediate?.push(...(score.gap_analysis.immediate ?? []));
        mergedGapAnalysis.medium_term?.push(...(score.gap_analysis.medium_term ?? []));
        mergedGapAnalysis.long_term?.push(...(score.gap_analysis.long_term ?? []));
      }
    }
  }

  const hasGapData =
    (mergedGapAnalysis.immediate?.length ?? 0) > 0 ||
    (mergedGapAnalysis.medium_term?.length ?? 0) > 0 ||
    (mergedGapAnalysis.long_term?.length ?? 0) > 0;

  const hasGuidance = (evaluations?.length ?? 0) > 0;

  return (
    <main className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback &amp; Recommendations</h1>
          <p className="mt-1 text-gray-600 text-sm">
            Gap analysis and next-level guidance for the selected audit
          </p>
        </div>

        {/* Audit selector */}
        {!auditsLoading && audits && audits.length > 1 && (
          <div>
            <label htmlFor="audit-select" className="block text-sm font-medium text-gray-700 mb-1">
              Active Audit
            </label>
            <select
              id="audit-select"
              value={activeAuditId}
              onChange={(e) => setSelectedAuditId(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {audits.map((audit) => (
                <option key={audit.id} value={audit.id}>
                  {audit.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-center py-16 gap-3 text-gray-500"
        >
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          <span>Loading recommendations…</span>
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div role="alert" className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" aria-hidden="true" />
          <p className="text-red-800 text-sm">Failed to load feedback data. Please try again.</p>
        </div>
      )}

      {/* No audit selected */}
      {!isLoading && !isError && !activeAuditId && (
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-40" aria-hidden="true" />
          <p className="font-medium">No audit selected</p>
          <p className="text-sm mt-1">Create an audit to see feedback and gap analysis.</p>
        </div>
      )}

      {/* Gap Analysis Section */}
      {!isLoading && !isError && activeAuditId && (
        <section aria-labelledby="gap-analysis-heading">
          <h2
            id="gap-analysis-heading"
            className="text-xl font-semibold text-gray-900 mb-4"
          >
            Gap Analysis
          </h2>

          {!hasGapData ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
              <p className="text-sm">
                No gap_analysis data available yet. Run scoring to generate gap analysis.
              </p>
            </div>
          ) : (
            <GapAnalysisSection gapAnalysis={mergedGapAnalysis} />
          )}
        </section>
      )}

      {/* Next-Level Guidance Section */}
      {!isLoading && !isError && activeAuditId && (
        <section aria-labelledby="guidance-heading">
          <h2
            id="guidance-heading"
            className="text-xl font-semibold text-gray-900 mb-4"
          >
            Next-Level Guidance
          </h2>

          {!hasGuidance ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
              <p className="text-sm">
                No next_level_guidance available yet for this audit&apos;s criteria evaluations.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {evaluations?.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <TrendingUp
                      className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      {(evaluation.criterion_number || evaluation.criterion_title) && (
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          {evaluation.criterion_number}
                          {evaluation.criterion_number && evaluation.criterion_title && ' — '}
                          {evaluation.criterion_title}
                        </p>
                      )}
                      <p className="text-sm text-gray-700">{evaluation.next_level_guidance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
