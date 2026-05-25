import { useSearchParams, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useFrameworkHandoffContext,
  FrameworkHandoffDomain,
  FrameworkHandoffDomainMetrics,
} from '@/lib/useFrameworkHandoffContext';
import { supabase } from '@/lib/supabase';
import {
  LEGACY_DOMAIN_BLUEPRINTS,
  normalizeDomainKey,
  LegacyDomainBlueprint,
  LegacyMpsBlueprint,
} from '@/lib/legacyDomainBlueprint';

const CANONICAL_DOMAIN_NAMES: string[] = [
  'Leadership and Governance',
  'Process Integrity',
  'People and Culture',
  'Protection',
  'Proof It Works',
];

const CANONICAL_DOMAIN_SLUGS: Record<string, string> = {
  'Leadership and Governance': 'leadership-governance',
  'Process Integrity': 'process-integrity',
  'People and Culture': 'people-culture',
  Protection: 'protection',
  'Proof It Works': 'proof-it-works',
};

/**
 * Converts a canonical domain name to a URL-safe slug.
 * Uses legacy-compatible slugs to preserve harvested route parity.
 * This slug is used as the route key so the URL remains stable and
 * human-readable regardless of whether a DB domain record exists.
 */
function canonicalNameToSlug(name: string): string {
  const canonicalSlug = CANONICAL_DOMAIN_SLUGS[name];
  if (canonicalSlug) {
    return canonicalSlug;
  }
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function normalizeForLookup(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildMpsCode(domainCode: string, blueprint: LegacyMpsBlueprint): string {
  return `${domainCode}.${blueprint.codeSuffix}`;
}

function firstCriterionCode(mpsCode: string): string {
  return `${mpsCode}.C001`;
}

function AppNav() {
  return (
    <header className="app-shell__header">
      <div className="container">
        <nav className="app-nav" aria-label="Main navigation">
          <span className="app-nav__logo">Maturion <span>MMM</span></span>
          <Link className="app-nav__link" to="/dashboard">Dashboard</Link>
          <Link className="app-nav__link" to="/frameworks">Frameworks</Link>
          <Link className="app-nav__link" to="/frameworks/upload">Upload</Link>
          <Link className="app-nav__link" to="/onboarding">Onboarding</Link>
        </nav>
      </div>
    </header>
  );
}

interface DomainCardProps {
  canonicalName: string;
  domain: FrameworkHandoffDomain | undefined;
  index: number;
  frameworkId: string;
  domainMetrics?: FrameworkHandoffDomainMetrics;
  frameworkStatus: string | undefined;
  metricsLoading: boolean;
}

function DomainCard({
  canonicalName,
  domain,
  index,
  frameworkId,
  domainMetrics,
  frameworkStatus,
  metricsLoading,
}: DomainCardProps) {
  // Route by canonical slug so the URL is always stable and human-readable.
  // The actual DB domain ID (if present) is passed as source_domain_id for
  // future backend use, but it is never used as the primary route key.
  const domainSlug = canonicalNameToSlug(canonicalName);
  const sourceDomainParam = domain?.id ? `&source_domain_id=${encodeURIComponent(domain.id)}` : '';
  const domainPath =
    `/assessment/framework/domain/${domainSlug}` +
    `?framework_id=${encodeURIComponent(frameworkId)}` +
    `&domain_name=${encodeURIComponent(canonicalName)}` +
    sourceDomainParam;

  return (
    <div
      className="domain-card"
      data-testid="domain-card"
      data-index={index}
    >
      <div className="domain-card__header">
        <h3 className="domain-card__title">{canonicalName}</h3>
        {domain ? (
          <span className="domain-card__code">{domain.code}</span>
        ) : (
          <span className="domain-card__placeholder-badge">Pending</span>
        )}
      </div>

      <div className="domain-card__mini-dashboard">
        <div className="domain-card__stat">
          <span className="domain-card__stat-label">MPS Count</span>
          <span className="domain-card__stat-value" data-testid="domain-mps-count">
            {metricsLoading ? '...' : (domainMetrics?.mpsCount ?? 0)}
          </span>
        </div>
        <div className="domain-card__stat">
          <span className="domain-card__stat-label">Criteria Count</span>
          <span className="domain-card__stat-value" data-testid="domain-criteria-count">
            {metricsLoading ? '...' : (domainMetrics?.criteriaCount ?? 0)}
          </span>
        </div>
        <div className="domain-card__stat">
          <span className="domain-card__stat-label">Maturity Level</span>
          <span className="domain-card__stat-value" data-testid="domain-maturity-level">
            {domainMetrics && domainMetrics.criteriaCount > 0 ? 'In Progress' : 'Pending'}
          </span>
        </div>
        <div className="domain-card__stat">
          <span className="domain-card__stat-label">Evidence Upload</span>
          <span className="domain-card__stat-value" data-testid="domain-evidence-completion">
            Not started
          </span>
        </div>
        <div className="domain-card__stat">
          <span className="domain-card__stat-label">Approval Status</span>
          <span className="domain-card__stat-value" data-testid="domain-approval-status">
            {frameworkStatus ?? 'Draft'}
          </span>
        </div>
        <div className="domain-card__stat">
          <span className="domain-card__stat-label">Compile Status</span>
          <span className="domain-card__stat-value" data-testid="domain-compile-status">
            {frameworkStatus === 'REVIEW' || frameworkStatus === 'PUBLISHED' ? 'Compiled' : 'Pending'}
          </span>
        </div>
      </div>

      <div className="domain-card__footer">
        <Link className="domain-card__cta btn btn-primary" to={domainPath}>
          Open Domain Workspace
        </Link>
      </div>
    </div>
  );
}

export default function AssessmentFrameworkHandoffPage() {
  const [searchParams] = useSearchParams();
  const frameworkId = searchParams.get('framework_id');
  const queryClient = useQueryClient();

  const {
    framework,
    isLoading,
    isError,
    domains,
    domainsLoading,
    domainsError,
    domainMetrics,
    domainMetricsLoading,
  } =
    useFrameworkHandoffContext(frameworkId);

  if (!frameworkId) {
    return (
      <div className="app-shell">
        <AppNav />
        <main className="assessment-framework-handoff-page">
          <div className="container">
            <div
              className="alert alert-error"
              role="alert"
              data-testid="handoff-missing-framework-id"
            >
              <p>No framework ID provided. Please navigate from the framework compile workflow.</p>
              <Link to="/frameworks">Back to Frameworks</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="app-shell">
        <AppNav />
        <main className="assessment-framework-handoff-page">
          <div className="container">
            <p className="handoff-loading" data-testid="handoff-loading">
              Loading framework workspace…
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !framework) {
    return (
      <div className="app-shell">
        <AppNav />
        <main className="assessment-framework-handoff-page">
          <div className="container">
            <div
              className="alert alert-error"
              role="alert"
              data-testid="handoff-framework-not-found"
            >
              Framework not found. The framework ID may be invalid or you may not have access.{' '}
              <Link to="/frameworks">View all frameworks</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Build canonical slot array: 5 slots backed by DB domains.
  // Prefer exact canonical name/code matching first; then fall back to positional mapping.
  const sortedDomains = domains ? domains.slice().sort((a, b) => a.sort_order - b.sort_order) : [];
  const matchedByCanonicalName = new Map<string, FrameworkHandoffDomain>();
  const consumedDomainIds = new Set<string>();

  for (const domain of sortedDomains) {
    const candidateKeys = [
      normalizeForLookup(domain.name),
      normalizeForLookup(domain.code),
      normalizeForLookup(`${domain.code}-${domain.name}`),
    ];

    for (const canonicalName of CANONICAL_DOMAIN_NAMES) {
      if (matchedByCanonicalName.has(canonicalName)) continue;
      const canonicalKeys = [
        normalizeForLookup(canonicalName),
        normalizeForLookup(canonicalNameToSlug(canonicalName)),
      ];
      if (candidateKeys.some((candidate) => canonicalKeys.includes(candidate))) {
        matchedByCanonicalName.set(canonicalName, domain);
        consumedDomainIds.add(domain.id);
        break;
      }
    }
  }

  const unconsumedDomains = sortedDomains.filter((domain) => !consumedDomainIds.has(domain.id));
  const canonicalSlots = CANONICAL_DOMAIN_NAMES.map((name, i) => {
    const matched = matchedByCanonicalName.get(name);
    if (matched) {
      return {
        canonicalName: name,
        domain: matched,
        index: i + 1,
      };
    }
    return {
      canonicalName: name,
      domain: unconsumedDomains.shift() as FrameworkHandoffDomain | undefined,
      index: i + 1,
    };
  });

  const missingCanonicalCount = canonicalSlots.filter((slot) => !slot.domain).length;
  const totalMpsCount = canonicalSlots.reduce((sum, slot) => {
    const slotCount = slot.domain?.id ? domainMetrics[slot.domain.id]?.mpsCount ?? 0 : 0;
    return sum + slotCount;
  }, 0);
  const needsLegacyRepair =
    !domainsLoading &&
    !domainsError &&
    (missingCanonicalCount > 0 || totalMpsCount <= 1);

  const legacyRepairMutation = useMutation({
    mutationFn: async () => {
      if (!frameworkId) {
        throw new Error('framework_id is required.');
      }

      const { data: existingDomains, error: existingDomainsError } = await supabase
        .from('mmm_domains')
        .select('id, name, code, sort_order')
        .eq('framework_id', frameworkId)
        .order('sort_order');
      if (existingDomainsError) {
        throw new Error(existingDomainsError.message);
      }

      const domainByCanonicalKey = new Map<string, { id: string; name: string; code: string; sort_order: number }>();
      for (const domain of existingDomains ?? []) {
        domainByCanonicalKey.set(normalizeDomainKey(domain.name), domain);
      }

      let insertedDomains = 0;
      let insertedMps = 0;
      let insertedCriteria = 0;

      for (const blueprint of LEGACY_DOMAIN_BLUEPRINTS) {
        const canonicalKey = normalizeDomainKey(blueprint.name);
        let domain = domainByCanonicalKey.get(canonicalKey);

        if (!domain) {
          const { data: insertedDomain, error: insertedDomainError } = await supabase
            .from('mmm_domains')
            .insert({
              framework_id: frameworkId,
              name: blueprint.name,
              code: blueprint.code,
              sort_order: blueprint.sortOrder,
            })
            .select('id, name, code, sort_order')
            .single();

          if (insertedDomainError || !insertedDomain) {
            throw new Error(
              insertedDomainError?.message ?? `Failed to seed domain "${blueprint.name}".`,
            );
          }
          insertedDomains += 1;
          domain = insertedDomain;
          domainByCanonicalKey.set(canonicalKey, insertedDomain);
        }

        const seeded = await seedDomainBlueprint(domain.id, domain.code || blueprint.code, blueprint);
        insertedMps += seeded.insertedMps;
        insertedCriteria += seeded.insertedCriteria;
      }

      return { insertedDomains, insertedMps, insertedCriteria };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['framework-handoff', frameworkId] });
      await queryClient.invalidateQueries({ queryKey: ['framework-handoff-domains', frameworkId] });
      await queryClient.invalidateQueries({ queryKey: ['framework-handoff-domain-metrics'] });
      await queryClient.invalidateQueries({ queryKey: ['domain-audit-domain'] });
      await queryClient.invalidateQueries({ queryKey: ['domain-audit-mps'] });
      await queryClient.invalidateQueries({ queryKey: ['domain-audit-criteria'] });
    },
  });

  return (
    <div className="app-shell">
      <AppNav />
      <main className="assessment-framework-handoff-page" data-testid="handoff-workspace">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-header__title" data-testid="handoff-framework-name">
                {framework.name}
              </h1>
              <p className="page-header__subtitle">Framework Workspace</p>
            </div>
            <span
              className={`handoff-framework-badge handoff-framework-badge--${framework.status?.toLowerCase() ?? 'unknown'}`}
              data-testid="handoff-framework-status"
            >
              {framework.status ?? 'Unknown'}
            </span>
          </div>

          <section
            className="handoff-domains"
            aria-label="Framework domains"
            data-testid="handoff-domains"
          >
            <h2>Domains</h2>
            {needsLegacyRepair ? (
              <div className="alert" data-testid="legacy-domain-repair-banner">
                <p>
                  Legacy domain scaffold appears incomplete for this framework. Load the harvested
                  legacy domain blueprint to restore the expected 5-domain workflow.
                </p>
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => legacyRepairMutation.mutate()}
                    disabled={legacyRepairMutation.isPending}
                  >
                    {legacyRepairMutation.isPending ? 'Loading Legacy Blueprint…' : 'Load Legacy Domain Blueprint'}
                  </button>
                  {legacyRepairMutation.isSuccess ? (
                    <span className="handoff-domains-loading" data-testid="legacy-domain-repair-success">
                      Legacy blueprint loaded. Refreshing domain workspace.
                    </span>
                  ) : null}
                  {legacyRepairMutation.isError ? (
                    <span className="handoff-domains-error" data-testid="legacy-domain-repair-error">
                      {(legacyRepairMutation.error as Error).message}
                    </span>
                  ) : null}
                </div>
              </div>
            ) : null}
            {domainsLoading ? (
              <p className="handoff-domains-loading">Loading domains…</p>
            ) : domainsError ? (
              <p className="handoff-domains-error">Could not load domains.</p>
            ) : (
              <div className="handoff-domain-cards">
                {canonicalSlots.map((slot) => (
                  <DomainCard
                    key={slot.index}
                    canonicalName={slot.canonicalName}
                    domain={slot.domain}
                    index={slot.index}
                    frameworkId={frameworkId}
                    domainMetrics={slot.domain?.id ? domainMetrics[slot.domain.id] : undefined}
                    frameworkStatus={framework?.status}
                    metricsLoading={domainMetricsLoading}
                  />
                ))}
              </div>
            )}
          </section>

          <div className="handoff-actions">
            <Link
              className="btn btn-outline"
              to={`/frameworks/${frameworkId}/review`}
              data-testid="handoff-back-link"
            >
              Back to Review Framework
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

async function seedDomainBlueprint(
  domainId: string,
  domainCode: string,
  blueprint: LegacyDomainBlueprint,
): Promise<{ insertedMps: number; insertedCriteria: number }> {
  const { data: existingMpsRows, error: existingMpsError } = await supabase
    .from('mmm_maturity_process_steps')
    .select('id, name, code, sort_order, intent_statement')
    .eq('domain_id', domainId)
    .order('sort_order');
  if (existingMpsError) {
    throw new Error(existingMpsError.message);
  }

  const existingMpsByName = new Map<string, { id: string; name: string; code: string; sort_order: number }>();
  for (const mps of existingMpsRows ?? []) {
    existingMpsByName.set(normalizeDomainKey(mps.name), mps);
  }

  let insertedMps = 0;
  for (const mpsBlueprint of blueprint.mps) {
    const key = normalizeDomainKey(mpsBlueprint.title);
    if (existingMpsByName.has(key)) {
      continue;
    }
    const nextSortOrder = (existingMpsRows?.length ?? 0) + insertedMps + 1;
    const insertedCode = buildMpsCode(domainCode, mpsBlueprint);
    const { data: insertedMpsRow, error: insertedMpsError } = await supabase
      .from('mmm_maturity_process_steps')
      .insert({
        domain_id: domainId,
        name: mpsBlueprint.title,
        code: insertedCode,
        sort_order: nextSortOrder,
        intent_statement: mpsBlueprint.intent,
      })
      .select('id, name, code, sort_order')
      .single();

    if (insertedMpsError || !insertedMpsRow) {
      throw new Error(insertedMpsError?.message ?? `Failed to seed MPS "${mpsBlueprint.title}".`);
    }
    existingMpsByName.set(key, insertedMpsRow);
    insertedMps += 1;
  }

  const { data: refreshedMpsRows, error: refreshedMpsError } = await supabase
    .from('mmm_maturity_process_steps')
    .select('id, name, code')
    .eq('domain_id', domainId);
  if (refreshedMpsError) {
    throw new Error(refreshedMpsError.message);
  }

  const refreshedByName = new Map<string, { id: string; code: string }>();
  for (const row of refreshedMpsRows ?? []) {
    refreshedByName.set(normalizeDomainKey(row.name), { id: row.id, code: row.code });
  }

  const mpsIds = (refreshedMpsRows ?? []).map((row) => row.id);
  let existingCriteriaRows: Array<{ id: string; mps_id: string }> = [];
  if (mpsIds.length > 0) {
    const { data: criteriaRows, error: criteriaError } = await supabase
      .from('mmm_criteria')
      .select('id, mps_id')
      .in('mps_id', mpsIds);
    if (criteriaError) {
      throw new Error(criteriaError.message);
    }
    existingCriteriaRows = criteriaRows ?? [];
  }

  const criteriaCountByMps = new Map<string, number>();
  for (const criterion of existingCriteriaRows) {
    criteriaCountByMps.set(criterion.mps_id, (criteriaCountByMps.get(criterion.mps_id) ?? 0) + 1);
  }

  let insertedCriteria = 0;
  for (const mpsBlueprint of blueprint.mps) {
    const mps = refreshedByName.get(normalizeDomainKey(mpsBlueprint.title));
    if (!mps) continue;
    if ((criteriaCountByMps.get(mps.id) ?? 0) > 0) continue;

    const firstCriterion = mpsBlueprint.criteria[0];
    const criterionCode = firstCriterion?.codeSuffix
      ? `${mps.code}.${firstCriterion.codeSuffix}`
      : firstCriterionCode(mps.code);
    const criterionName =
      firstCriterion?.statement ??
      `Evidence demonstrates control effectiveness for ${mpsBlueprint.title}.`;
    const criterionTarget = firstCriterion?.maturityLevelTarget ?? 3;

    const { error: criterionInsertError } = await supabase
      .from('mmm_criteria')
      .insert({
        mps_id: mps.id,
        name: criterionName,
        code: criterionCode,
        sort_order: 1,
        maturity_level_target: criterionTarget,
      });
    if (criterionInsertError) {
      throw new Error(
        criterionInsertError.message ??
          `Failed to seed criteria for "${mpsBlueprint.title}".`,
      );
    }
    insertedCriteria += 1;
  }

  return { insertedMps, insertedCriteria };
}
