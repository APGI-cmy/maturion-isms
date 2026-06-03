import { supabase } from './supabase';

export type CriteriaMode = 'VERBATIM' | 'HYBRID' | 'GENERATED';

export type ModeSourceDocument = {
  id: string;
  title: string;
  file_name: string;
  scope_type: string;
  document_role: string;
  processing_status: string;
  chunk_count: number;
  tags: string[];
  upload_notes: string | null;
};

export type ModeSourceContext = {
  organisation_id: string | null;
  organisation_name: string | null;
  organisation_context: Record<string, unknown>;
  framework_id: string | null;
  framework_name: string | null;
  framework_source_type: CriteriaMode | null;
  mode_source_strategy: 'verbatim_context_document' | 'hybrid_gap_analysis' | 'new_generation_public_research';
  mode_source_documents: ModeSourceDocument[];
  source_rules: string[];
  tenant_isolation_required: true;
};

export type ModeSourceAvailability = {
  blockingError: string | null;
  warnings: string[];
};

type ProfileRow = { organisation_id: string | null };
type OrganisationRow = { id: string; name: string; context: Record<string, unknown> | null };
type FrameworkRow = { id: string; name: string | null; source_type: string | null };
type DocumentRow = {
  id: string;
  title: string | null;
  file_name: string | null;
  scope_type: string | null;
  document_role: string | null;
  processing_status: string | null;
  chunk_count: number | null;
  tags: unknown;
  upload_notes: string | null;
};

function normalizeCriteriaMode(input: string | null | undefined): CriteriaMode | null {
  if (input === 'VERBATIM' || input === 'HYBRID' || input === 'GENERATED') return input;
  return null;
}

function toTags(input: unknown): string[] {
  return Array.isArray(input) ? input.filter((tag): tag is string => typeof tag === 'string') : [];
}

function modeStrategy(mode: CriteriaMode | null): ModeSourceContext['mode_source_strategy'] {
  if (mode === 'VERBATIM') return 'verbatim_context_document';
  if (mode === 'HYBRID') return 'hybrid_gap_analysis';
  return 'new_generation_public_research';
}

function deriveModeFromDocuments(documents: ModeSourceDocument[]): CriteriaMode | null {
  const ordered = [...documents];
  for (const doc of ordered) {
    const tags = doc.tags ?? [];
    if (tags.includes('source_mode:VERBATIM')) return 'VERBATIM';
    if (tags.includes('source_mode:HYBRID')) return 'HYBRID';
    if (tags.includes('source_mode:GENERATED')) return 'GENERATED';
  }
  return null;
}

function deriveModeFromOrganisationContext(context: Record<string, unknown>): CriteriaMode | null {
  const candidates = [
    context.frameworkCreationMode,
    context.sourceMode,
    context.framework_mode,
  ];
  for (const value of candidates) {
    if (typeof value !== 'string') continue;
    const normalized = value.trim().toUpperCase();
    if (normalized === 'VERBATIM' || normalized === 'HYBRID' || normalized === 'GENERATED') {
      return normalized as CriteriaMode;
    }
  }
  return null;
}

export function isChunkedSourceReadyForExtraction(doc: ModeSourceDocument): boolean {
  return doc.chunk_count > 0;
}

function sourceRules(mode: CriteriaMode | null): string[] {
  if (mode === 'VERBATIM') {
    return [
      'VERBATIM: resolve uploaded organisation/framework source documents first and preserve source wording wherever it maps to the requested domain artifact.',
      'VERBATIM: do not invent replacement MPS, intent, or criteria content when an uploaded source statement exists.',
      'VERBATIM: mark gaps explicitly instead of silently filling them with generic content.',
    ];
  }
  if (mode === 'HYBRID') {
    return [
      'HYBRID: map uploaded organisation source content into the five MMM domains, then identify missing maturity-model components.',
      'HYBRID: label harvested material as source_origin=uploaded_source and AI completion material as source_origin=ai_completion.',
      'HYBRID: use subject knowledge only to complete gaps, improve structure, and align to security best practice.',
    ];
  }
  return [
    'GENERATED: create a new framework from organisation profile, industry tags, website context, and approved subject knowledge.',
    'GENERATED: public research is supplementary and must not override canonical subject knowledge.',
    'GENERATED: never use another customer tenant context as source material.',
  ];
}

export function defaultModeSourceContext(frameworkId?: string | null): ModeSourceContext {
  return {
    organisation_id: null,
    organisation_name: null,
    organisation_context: {},
    framework_id: frameworkId ?? null,
    framework_name: null,
    framework_source_type: null,
    mode_source_strategy: 'new_generation_public_research',
    mode_source_documents: [],
    source_rules: sourceRules(null),
    tenant_isolation_required: true,
  };
}

export async function resolveModeSourceContext(frameworkId?: string | null): Promise<ModeSourceContext> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) {
    return defaultModeSourceContext(frameworkId);
  }

  const { data: profile } = await supabase
    .from('mmm_profiles')
    .select('organisation_id')
    .eq('id', userId)
    .maybeSingle<ProfileRow>();

  const organisationId = profile?.organisation_id ?? null;
  let organisation: OrganisationRow | null = null;
  if (organisationId) {
    const { data } = await supabase
      .from('mmm_organisations')
      .select('id,name,context')
      .eq('id', organisationId)
      .maybeSingle<OrganisationRow>();
    organisation = data ?? null;
  }

  let framework: FrameworkRow | null = null;
  if (frameworkId) {
    const { data } = await supabase
      .from('mmm_frameworks')
      .select('id,name,source_type')
      .eq('id', frameworkId)
      .maybeSingle<FrameworkRow>();
    framework = data ?? null;
  }

  const frameworkMode = normalizeCriteriaMode(framework?.source_type);
  let documents: ModeSourceDocument[] = [];
  if (organisationId) {
    const { data } = await supabase
      .from('mmm_subject_knowledge_documents')
      .select('id,title,file_name,scope_type,document_role,processing_status,chunk_count,tags,upload_notes')
      .eq('organisation_id', organisationId)
      .is('archived_at', null)
      .order('created_at', { ascending: false });

    documents = ((data ?? []) as DocumentRow[])
      .map((doc) => ({
        id: doc.id,
        title: doc.title ?? doc.file_name ?? 'Untitled context document',
        file_name: doc.file_name ?? 'unknown',
        scope_type: doc.scope_type ?? 'subject_knowledge',
        document_role: doc.document_role ?? 'knowledge_source',
        processing_status: doc.processing_status ?? 'pending',
        chunk_count: doc.chunk_count ?? 0,
        tags: toTags(doc.tags),
        upload_notes: doc.upload_notes ?? null,
      }))
      .filter((doc) => {
        const tags = doc.tags.join('|');
        return (
          doc.scope_type === 'organisation_context' ||
          doc.scope_type === 'framework_context' ||
          tags.includes('organisation_context') ||
          tags.includes('mode_source') ||
          (frameworkId ? tags.includes(`framework_id:${frameworkId}`) : false)
        );
      });
  }

  const orgContextModeOverride = deriveModeFromOrganisationContext(organisation?.context ?? {});
  const documentModeOverride = deriveModeFromDocuments(documents);
  // Runtime source docs are the strongest signal because users can change mode
  // per upload flow; older context/source_type values may lag behind.
  const mode = documentModeOverride ?? orgContextModeOverride ?? frameworkMode;

  return {
    organisation_id: organisationId,
    organisation_name: organisation?.name ?? null,
    organisation_context: organisation?.context ?? {},
    framework_id: frameworkId ?? null,
    framework_name: framework?.name ?? null,
    framework_source_type: mode,
    mode_source_strategy: modeStrategy(mode),
    mode_source_documents: documents,
    source_rules: sourceRules(mode),
    tenant_isolation_required: true,
  };
}

export function evaluateModeSourceAvailability(context: ModeSourceContext): ModeSourceAvailability {
  const docs = context.mode_source_documents;
  const documentModeOverride = deriveModeFromDocuments(docs);
  const effectiveMode = documentModeOverride ?? context.framework_source_type;
  const usableDocs = docs.filter(isChunkedSourceReadyForExtraction);
  const pendingDocs = docs.filter((doc) => !isChunkedSourceReadyForExtraction(doc));
  const statusLagDocs = usableDocs.filter((doc) => doc.processing_status.toLowerCase() !== 'completed');

  const warnings: string[] = [];
  if (pendingDocs.length > 0) {
    warnings.push(
      `Some source documents are not ready yet: ${pendingDocs.map((doc) => `${doc.title} (${doc.processing_status})`).join('; ')}.`,
    );
  }
  if (statusLagDocs.length > 0) {
    warnings.push(
      `Some source documents have extracted chunks but their final status is still updating: ${statusLagDocs.map((doc) => `${doc.title} (${doc.processing_status}, chunks=${doc.chunk_count})`).join('; ')}.`,
    );
  }

  if (effectiveMode === 'VERBATIM' && usableDocs.length === 0) {
    return {
      blockingError:
        'Verbatim mode requires at least one source document with extracted chunks. Upload/reprocess the source and retry.',
      warnings,
    };
  }

  if (effectiveMode === 'HYBRID' && usableDocs.length === 0) {
    return {
      blockingError:
        'Hybrid mode requires at least one processed source document for gap analysis. Upload/reprocess the source and retry.',
      warnings,
    };
  }

  return { blockingError: null, warnings };
}
