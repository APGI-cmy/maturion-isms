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

export type AuditStep = 'mps' | 'intent' | 'criteria';

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

export interface GeneratedMpsDraft {
  code: string;
  name: string;
  intent_statement?: string;
}

export interface GeneratedCriteriaDraft {
  statement: string;
}

export interface StepMeta {
  id: AuditStep;
  title: string;
  description: string;
  order: number;
  count: number;
  summary: string;
  previewItems: string[];
}

const BASE_AUDIT_STEPS: Omit<StepMeta, 'count' | 'summary' | 'previewItems'>[] = [
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
  isCanonicalSetupRequired: boolean;
  setupMessage: string | null;
  acceptGeneratedMPSRows: (drafts: GeneratedMpsDraft[]) => void;
  approveGeneratedIntent: (mpsId: string, intent: string) => void;
  acceptGeneratedCriteria: (mpsId: string, drafts: GeneratedCriteriaDraft[]) => void;
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
  const [acceptedGeneratedMps, setAcceptedGeneratedMps] = useState<GeneratedMpsDraft[]>([]);
  const [approvedGeneratedIntents, setApprovedGeneratedIntents] = useState<Record<string, string>>({});
  const [acceptedGeneratedCriteria, setAcceptedGeneratedCriteria] = useState<Record<string, GeneratedCriteriaDraft[]>>({});

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
        const candidateKeys = [
          normalizeDomainKey(candidate.name),
          normalizeDomainKey(candidate.code),
          normalizeDomainKey(`${candidate.code}-${candidate.name}`),
        ];
        return candidateKeys.includes(lookupKey);
      });

      if (!matchedDomain) {
        return null;
      }

      return matchedDomain as DomainAuditDomain;
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

      return (data ?? []) as DomainAuditMpsRow[];
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

      return (data ?? []) as DomainAuditCriterionRow[];
    },
    enabled: mpsIds.length > 0,
    retry: false,
  });

  const generatedMpsRows = useMemo<DomainAuditMpsRow[]>(() => {
    if (!domain?.id) {
      return [];
    }

    return acceptedGeneratedMps.map((draft, index) => ({
      id: `generated-mps-${domain.id}-${index + 1}`,
      domain_id: domain.id,
      code: draft.code,
      name: draft.name,
      sort_order: mpsRows.length + index + 1,
      intent_statement: draft.intent_statement ?? null,
    }));
  }, [acceptedGeneratedMps, domain?.id, mpsRows.length]);

  const mergedMpsRows = useMemo<DomainAuditMpsRow[]>(() => {
    const byId = new Map<string, DomainAuditMpsRow>();
    [...mpsRows, ...generatedMpsRows].forEach((row) => {
      byId.set(row.id, {
        ...row,
        intent_statement: approvedGeneratedIntents[row.id] ?? row.intent_statement,
      });
    });
    return Array.from(byId.values()).sort((a, b) => a.sort_order - b.sort_order);
  }, [generatedMpsRows, mpsRows, approvedGeneratedIntents]);

  const mergedCriteriaRows = useMemo<DomainAuditCriterionRow[]>(() => {
    const generatedRows = Object.entries(acceptedGeneratedCriteria).flatMap(([mpsId, drafts], mpsIndex) =>
      drafts.map((draft, index) => ({
        id: `generated-criterion-${mpsId}-${mpsIndex + 1}-${index + 1}`,
        mps_id: mpsId,
        code: `GEN-${mpsIndex + 1}-${index + 1}`,
        name: draft.statement,
        sort_order: index + 1,
      })),
    );

    return [...criteriaRows, ...generatedRows];
  }, [acceptedGeneratedCriteria, criteriaRows]);

  const mergedCriteriaByMps = useMemo<Record<string, DomainAuditCriterionRow[]>>(() => {
    return mergedCriteriaRows.reduce<Record<string, DomainAuditCriterionRow[]>>((grouped, criterion) => {
      grouped[criterion.mps_id] = [...(grouped[criterion.mps_id] ?? []), criterion];
      return grouped;
    }, {});
  }, [mergedCriteriaRows]);

  const steps = useMemo<StepMeta[]>(() => {
    const intentRows = mergedMpsRows.filter((row) => Boolean(row.intent_statement?.trim()));

    return BASE_AUDIT_STEPS.map((step) => {
      if (step.id === 'mps') {
        return {
          ...step,
          count: mergedMpsRows.length,
          summary:
            mergedMpsRows.length > 0
              ? `${mergedMpsRows.length} MPS rows loaded from MMM current data source.`
              : 'No MPS rows loaded for this routed domain yet.',
          previewItems: mergedMpsRows.slice(0, 3).map((row) => `${row.code} — ${row.name}`),
        };
      }

      if (step.id === 'intent') {
        return {
          ...step,
          count: intentRows.length,
          summary:
            intentRows.length > 0
              ? `${intentRows.length} intent statements are available from current MMM data.`
              : 'No intent statements are currently stored for this domain.',
          previewItems: intentRows
            .slice(0, 3)
            .map((row) => `${row.code} — ${truncate(row.intent_statement ?? '')}`),
        };
      }

      return {
        ...step,
        count: mergedCriteriaRows.length,
        summary:
          mergedCriteriaRows.length > 0
            ? `${mergedCriteriaRows.length} criteria rows grouped under ${mergedMpsRows.length} MPS entries.`
            : 'No criteria rows are currently stored for this domain.',
        previewItems: mergedCriteriaRows.slice(0, 3).map((row) => `${row.code} — ${row.name}`),
      };
    });
  }, [mergedCriteriaRows, mergedMpsRows]);

  const isLoading = isDomainLoading || isMpsLoading || isCriteriaLoading;
  const isCanonicalSetupRequired = Boolean(domainId) && !sourceDomainId && !isDomainLoading && !domain;
  const setupMessage = isCanonicalSetupRequired
    ? 'No mapped MMM domain row exists for this canonical card yet. Create the domain mapping or start generation in this workspace.'
    : null;
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
    setActiveStep(step);
  };

  const acceptGeneratedMPSRows = (drafts: GeneratedMpsDraft[]) => {
    if (drafts.length === 0) return;
    setAcceptedGeneratedMps(drafts);
  };

  const approveGeneratedIntent = (mpsId: string, intent: string) => {
    setApprovedGeneratedIntents((current) => ({
      ...current,
      [mpsId]: intent.trim(),
    }));
  };

  const acceptGeneratedCriteria = (mpsId: string, drafts: GeneratedCriteriaDraft[]) => {
    if (drafts.length === 0) return;
    setAcceptedGeneratedCriteria((current) => ({
      ...current,
      [mpsId]: drafts,
    }));
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
    mpsRows: mergedMpsRows,
    criteriaRows: mergedCriteriaRows,
    criteriaByMps: mergedCriteriaByMps,
    isCanonicalSetupRequired,
    setupMessage,
    acceptGeneratedMPSRows,
    approveGeneratedIntent,
    acceptGeneratedCriteria,
    isLoading,
    errorMessage,
  };
}
