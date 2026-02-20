/**
 * Custom hooks for scoring and reports
 * FRS: FR-021 to FR-024 (Scoring & Reports)
 * TRS: TR-050, TR-053
 * Task: 5.6.5
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export interface Score {
  id: string;
  criterion_id: string;
  maturity_level: number;
  confidence: number;
  rationale: string;
  gap_analysis: {
    immediate: string[];
    medium: string[];
    long_term: string[];
  };
  confirmed: boolean;
  confirmed_by?: string;
  confirmed_at?: string;
  override_score?: number;
  override_justification?: string;
  created_at: string;
}

export interface ReviewTableRow {
  id: string;
  criterion_number: string;
  criterion_title: string;
  ai_score: number;
  human_score?: number;
  evidence_count: number;
  status: 'pending' | 'confirmed' | 'overridden';
  confidence: number;
}

interface ScoreWithCriteria {
  id: string;
  maturity_level: number;
  confidence: number;
  confirmed: boolean;
  override_score?: number;
  criteria: {
    id: string;
    number: string;
    title: string;
    audit_id: string;
  };
}

interface EvidenceCount {
  criterion_id: string;
}

/**
 * Fetch scores for an audit (review table data)
 */
export function useAuditScores(auditId: string) {
  return useQuery<ReviewTableRow[], Error>({
    queryKey: ['audit-scores', auditId],
    queryFn: async () => {
      // Fetch scores with joined criteria and evidence count
      const { data, error } = await supabase
        .from('scores')
        .select(`
          id,
          maturity_level,
          confidence,
          confirmed,
          override_score,
          criteria (
            id,
            number,
            title,
            audit_id
          )
        `)
        .eq('criteria.audit_id', auditId)
        .order('criteria.number', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch scores: ${error.message}`);
      }

      // Get evidence counts
      const { data: evidenceCounts, error: evidenceError } = await supabase
        .from('evidence')
        .select('criterion_id')
        .in('criterion_id', (data || []).map((s) => (s as unknown as ScoreWithCriteria).criteria.id));

      if (evidenceError) {
        console.warn('Failed to fetch evidence counts:', evidenceError);
      }

      // Count evidence per criterion
      const evidenceMap = (evidenceCounts || []).reduce((acc: Record<string, number>, item: EvidenceCount) => {
        acc[item.criterion_id] = (acc[item.criterion_id] || 0) + 1;
        return acc;
      }, {});

      // Transform to review table format
      return (data || []).map((score) => {
        const typedScore = score as unknown as ScoreWithCriteria;
        return {
          id: typedScore.id,
          criterion_number: typedScore.criteria.number,
          criterion_title: typedScore.criteria.title,
          ai_score: typedScore.maturity_level,
          human_score: typedScore.override_score,
          evidence_count: evidenceMap[typedScore.criteria.id] || 0,
          status: typedScore.override_score ? 'overridden' as const : typedScore.confirmed ? 'confirmed' as const : 'pending' as const,
          confidence: typedScore.confidence,
        };
      });
    },
    enabled: !!auditId,
  });
}

/**
 * Fetch detailed score for a criterion
 */
export function useCriterionScore(criterionId: string) {
  return useQuery<Score | null, Error>({
    queryKey: ['criterion-score', criterionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('criterion_id', criterionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No score yet
          return null;
        }
        throw new Error(`Failed to fetch score: ${error.message}`);
      }

      return data;
    },
    enabled: !!criterionId,
  });
}

/**
 * Confirm AI score (human approval)
 */
export function useConfirmScore() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { scoreId: string; criterionId: string; auditId: string }>({
    mutationFn: async ({ scoreId }) => {
      const { error } = await supabase
        .from('scores')
        .update({
          confirmed: true,
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', scoreId);

      if (error) {
        throw new Error(`Failed to confirm score: ${error.message}`);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['audit-scores', variables.auditId] });
      queryClient.invalidateQueries({ queryKey: ['criterion-score', variables.criterionId] });
    },
  });
}

/**
 * Override AI score (human override)
 */
export function useOverrideScore() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, {
    scoreId: string;
    criterionId: string;
    auditId: string;
    overrideScore: number;
    justification: string;
  }>({
    mutationFn: async ({ scoreId, overrideScore, justification }) => {
      const { error } = await supabase
        .from('scores')
        .update({
          override_score: overrideScore,
          override_justification: justification,
          confirmed: true,
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', scoreId);

      if (error) {
        throw new Error(`Failed to override score: ${error.message}`);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['audit-scores', variables.auditId] });
      queryClient.invalidateQueries({ queryKey: ['criterion-score', variables.criterionId] });
    },
  });
}

/**
 * Trigger AI scoring for a criterion
 */
export function useTriggerAIScoring() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { criterionId: string; auditId: string }>({
    mutationFn: async ({ criterionId }) => {
      // Call Edge Function to trigger AI scoring
      const { data, error } = await supabase.functions.invoke('invoke-ai-score-criterion', {
        body: { criterionId }
      });

      if (error) {
        throw new Error(`Failed to trigger AI scoring: ${error.message}`);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['audit-scores', variables.auditId] });
      queryClient.invalidateQueries({ queryKey: ['criterion-score', variables.criterionId] });
    },
  });
}

/**
 * Generate audit report
 */
export function useGenerateReport() {
  return useMutation<{ url: string }, Error, { auditId: string; format: 'pdf' | 'docx' | 'xlsx' }>({
    mutationFn: async ({ auditId, format }) => {
      // Call Edge Function to generate report
      const { data, error } = await supabase.functions.invoke('generate-audit-report', {
        body: { auditId, format }
      });

      if (error) {
        throw new Error(`Failed to generate report: ${error.message}`);
      }

      // Return signed URL or blob URL
      return { url: data.url };
    },
  });
}
