/**
 * useDomainAuditBuilder — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/hooks/useDomainAuditBuilder.ts hook.
 *
 * Owns three-step metadata/order, active step state, and current-app data loading
 * for the DomainAuditBuilder workflow: Create MPSs → Create Intent → Create Criteria.
 *
 * Legacy source: apps/maturion-maturity-legacy/src/hooks/useDomainAuditBuilder.ts
 */
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import {
  hasTrimmedText,
  toDisplayNumber,
  toDisplayText,
  toTrimmedText,
} from '../lib/safeText';

export type AuditStep = 'mps' | 'intent' | 'criteria';
export type AuditStepStatus = 'locked' | 'active' | 'completed';

export interface DomainAuditDomain {
  id: string;
  name: string;
  code: string;
  sort_order: number;
  framework_id?: string;
}

export interface DomainAuditMpsRow {
  id: string;
  domain_id: string;
  name: string;
  code: string;
  sort_order: number;
  intent_statement: string | null;
}

export interface DomainAuditCriterionRow {
  id: string;
  mps_id: string;
  name: string;
  code: string;
  sort_order: number;
}

export type DraftPersistenceState = 'session' | 'persisted';

export interface GeneratedMpsDraft {
  number: number;
  title: string;
  intent: string;
  rationale: string;
  acceptance: DraftPersistenceState;
}

export interface GeneratedIntentDraft {
  mpsId: string;
  text: string;
  acceptance: DraftPersistenceState;
}

export interface GeneratedCriteriaDraft {
  code: string;
  statement: string;
  acceptance: DraftPersistenceState;
}

export interface StepMeta {
  id: AuditStep;
  title: string;
  description: string;
  order: number;
  status: AuditStepStatus;
  count: number;
  summary: string;
  previewItems: string[];
}

const BASE_AUDIT_STEPS: Omit<StepMeta, 'count' | 'summary' | 'previewItems' | 'status'>[] = [
  { id: 'mps', title: 'Create MPSs', description: 'Define Maturity Practice Statements for this domain.', order: 1 },
  { id: 'intent', title: 'Create Intent', description: 'Write intent statements for each MPS.', order: 2 },
  { id: 'criteria', title: 'Create Criteria', description: 'Define criteria scoped to each MPS.', order: 3 },
];

function normalizeDomainKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function truncate(value: string, max = 96): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

type SupabaseRow = Record<string, unknown>;

export interface UseDomainAuditBuilderOptions {
  domainId: string;
  frameworkId?: string | null;
  domainName?: string | null;
  sourceDomainId?: string | null;
}

export interface UseDomainAuditBuilderReturn {
  activeStep: AuditStep | null;
  isMPSModalOpen: boolean;
  setIsMPSModalOpen: (open: boolean) => void;
  isIntentCreatorOpen: boolean;
  setIsIntentCreatorOpen: (open: boolean) => void;
  isCriteriaManagementOpen: boolean;
  setIsCriteriaManagementOpen: (open: boolean) => void;
  handleStepClick: (step: AuditStep) => void;
  steps: StepMeta[];
  domain: DomainAuditDomain | null;
  mpsRows: DomainAuditMpsRow[];
  criteriaRows: DomainAuditCriterionRow[];
  criteriaByMps: Record<string, DomainAuditCriterionRow[]>;
  isLoading: boolean;
  errorMessage: string | null;
}

export function useDomainAuditBuilder({
  domainId,
  frameworkId,
  domainName,
  sourceDomainId,
}: UseDomainAuditBuilderOptions): UseDomainAuditBuilderReturn {
  const [activeStep, setActiveStep] = useState<AuditStep | null>(null);

  const {
    data: domain,
    isLoading: isDomainLoading,
    error: domainError,
  } = useQuery<DomainAuditDomain | null>({
    queryKey: ['domain-audit-domain', domainId, frameworkId, domainName, sourceDomainId],
    queryFn: async () => {
      if (sourceDomainId) {
        return {
          id: sourceDomainId,
          name: domainName ?? domainId,
          code: domainId,
          sort_order: 0,
          framework_id: frameworkId ?? undefined,
        };
      }

      if (!frameworkId) {
        throw new Error('Framework context is required to load the domain workflow.');
      }

      const { data, error } = await supabase
        .from('mmm_domains')
        .select('id, name, code, sort_order, framework_id')
        .eq('framework_id', frameworkId)
        .order('sort_order');

      if (error) {
        throw new Error(error.message);
      }

      const lookupKey = normalizeDomainKey(domainName ?? domainId);
      const matchedDomain = (data ?? []).find((candidate) => {
        const candidateName = toDisplayText(candidate.name);
        const candidateCode = toDisplayText(candidate.code);
        const candidateKeys = [
          normalizeDomainKey(candidateName),
          normalizeDomainKey(candidateCode),
          normalizeDomainKey(`${candidateCode}-${candidateName}`),
        ];
        return candidateKeys.includes(lookupKey);
      });

      if (!matchedDomain) {
        return null;
      }

      return {
        id: toDisplayText(matchedDomain.id),
        name: toDisplayText(matchedDomain.name, domainName ?? domainId),
        code: toDisplayText(matchedDomain.code, domainId),
        sort_order: toDisplayNumber(matchedDomain.sort_order, 0),
        framework_id: toDisplayText(matchedDomain.framework_id, frameworkId ?? ''),
      } as DomainAuditDomain;
    },
    enabled: Boolean(domainId) && Boolean(sourceDomainId || frameworkId),
    retry: false,
  });

  const {
    data: mpsRows = [],
    isLoading: isMpsLoading,
    error: mpsError,
  } = useQuery<DomainAuditMpsRow[]>({
    queryKey: ['domain-audit-mps', domain?.id],
    queryFn: async () => {
      if (!domain?.id) {
        throw new Error('Resolved MMM domain context is required before loading MPS rows.');
      }

      const { data, error } = await supabase
        .from('mmm_maturity_process_steps')
        .select('id, domain_id, name, code, sort_order, intent_statement')
        .eq('domain_id', domain.id)
        .order('sort_order');

      if (error) {
        throw new Error(error.message);
      }

      const rows = (data ?? []) as SupabaseRow[];
      return rows.map((row, index) => {
        const intentStatement = toTrimmedText(row.intent_statement);
        return {
          id: toDisplayText(row.id, `mps-${index + 1}`),
          domain_id: toDisplayText(row.domain_id, domain.id),
          name: toDisplayText(row.name, `MPS ${index + 1}`),
          code: toDisplayText(row.code, `MPS-${index + 1}`),
          sort_order: toDisplayNumber(row.sort_order, index + 1),
          intent_statement: intentStatement.length > 0 ? intentStatement : null,
        };
      });
    },
    enabled: Boolean(domain?.id),
    retry: false,
  });

  const mpsIds = useMemo(() => mpsRows.map((row) => row.id), [mpsRows]);

  const {
    data: criteriaRows = [],
    isLoading: isCriteriaLoading,
    error: criteriaError,
  } = useQuery<DomainAuditCriterionRow[]>({
    queryKey: ['domain-audit-criteria', mpsIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mmm_criteria')
        .select('id, mps_id, name, code, sort_order')
        .in('mps_id', mpsIds)
        .order('sort_order');

      if (error) {
        throw new Error(error.message);
      }

      const rows = (data ?? []) as SupabaseRow[];
      return rows.map((row, index) => ({
        id: toDisplayText(row.id, `criterion-${index + 1}`),
        mps_id: toDisplayText(row.mps_id),
        name: toDisplayText(row.name, `Criterion ${index + 1}`),
        code: toDisplayText(row.code, `C-${index + 1}`),
        sort_order: toDisplayNumber(row.sort_order, index + 1),
      }));
    },
    enabled: mpsIds.length > 0,
    retry: false,
  });

  const criteriaByMps = useMemo<Record<string, DomainAuditCriterionRow[]>>(() => {
    return criteriaRows.reduce<Record<string, DomainAuditCriterionRow[]>>((grouped, criterion) => {
      grouped[criterion.mps_id] = [...(grouped[criterion.mps_id] ?? []), criterion];
      return grouped;
    }, {});
  }, [criteriaRows]);

  const steps = useMemo<StepMeta[]>(() => {
    const intentRows = mpsRows.filter((row) => hasTrimmedText(row.intent_statement));
    const hasDomainContext = Boolean(domain?.id);
    const hasMps = mpsRows.length > 0;
    const hasCompleteIntents = hasMps && intentRows.length === mpsRows.length;
    const hasCriteria = criteriaRows.length > 0;

    return BASE_AUDIT_STEPS.map((step) => {
      if (step.id === 'mps') {
        return {
          ...step,
          status: !hasDomainContext ? 'locked' : mpsRows.length > 0 ? 'completed' : 'active',
          count: mpsRows.length,
          summary:
            !hasDomainContext
              ? 'Compile this framework domain first to unlock MPS authoring.'
              : mpsRows.length > 0
              ? `${mpsRows.length} MPS rows loaded from MMM current data source.`
              : 'No MPS rows loaded for this routed domain yet.',
          previewItems: mpsRows.slice(0, 3).map((row) => `${row.code} — ${row.name}`),
        };
      }

      if (step.id === 'intent') {
        return {
          ...step,
          status:
            !hasDomainContext || !hasMps
              ? 'locked'
              : intentRows.length > 0
              ? 'completed'
              : 'active',
          count: intentRows.length,
          summary:
            !hasDomainContext || !hasMps
              ? 'Create and store at least one MPS before generating intents.'
              : intentRows.length > 0
              ? `${intentRows.length} intent statements are available from current MMM data.`
              : 'No intent statements are currently stored for this domain.',
          previewItems: intentRows
            .slice(0, 3)
            .map((row) => `${row.code} — ${truncate(toTrimmedText(row.intent_statement))}`),
        };
      }

      return {
        ...step,
        status:
          !hasDomainContext || !hasCompleteIntents
            ? 'locked'
            : hasCriteria
            ? 'completed'
            : 'active',
        count: criteriaRows.length,
        summary:
          !hasDomainContext || !hasCompleteIntents
            ? 'Complete intent statements for this domain to unlock criteria generation.'
            : criteriaRows.length > 0
            ? `${criteriaRows.length} criteria rows grouped under ${mpsRows.length} MPS entries.`
            : 'No criteria rows are currently stored for this domain.',
        previewItems: criteriaRows.slice(0, 3).map((row) => `${row.code} — ${row.name}`),
      };
    });
  }, [criteriaRows, domain?.id, mpsRows]);

  const isLoading = isDomainLoading || isMpsLoading || isCriteriaLoading;
  const errorMessage =
    (domainError as Error | null)?.message ??
    (mpsError as Error | null)?.message ??
    (criteriaError as Error | null)?.message ??
    null;

  const setIsMPSModalOpen = (open: boolean) => {
    setActiveStep((current) => (open ? 'mps' : current === 'mps' ? null : current));
  };

  const setIsIntentCreatorOpen = (open: boolean) => {
    setActiveStep((current) => (open ? 'intent' : current === 'intent' ? null : current));
  };

  const setIsCriteriaManagementOpen = (open: boolean) => {
    setActiveStep((current) => (open ? 'criteria' : current === 'criteria' ? null : current));
  };

  const handleStepClick = (step: AuditStep) => {
    const targetStep = steps.find((candidate) => candidate.id === step);
    if (!targetStep || targetStep.status === 'locked') {
      return;
    }
    setActiveStep(step);
  };

  return {
    activeStep,
    isMPSModalOpen: activeStep === 'mps',
    setIsMPSModalOpen,
    isIntentCreatorOpen: activeStep === 'intent',
    setIsIntentCreatorOpen,
    isCriteriaManagementOpen: activeStep === 'criteria',
    setIsCriteriaManagementOpen,
    handleStepClick,
    steps,
    domain: domain ?? null,
    mpsRows,
    criteriaRows,
    criteriaByMps,
    isLoading,
    errorMessage,
  };
}
