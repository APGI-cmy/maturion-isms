-- =============================================================================
-- MMM Wave B1 — Core Tables Migration
-- Wave Slug: mmm-build-wave-b1-schema
-- Architecture Reference: modules/MMM/04-architecture/architecture.md §A5.2
-- TR-021, TR-022, TR-028 compliance
-- Builder: schema-builder
-- Date: 2026-04-20
-- Issue: maturion-isms#1428
-- =============================================================================
-- TR-028: All tables use mmm_ namespace prefix without exception.
-- NO foreign keys outside mmm_ namespace (architecture §A11).
-- IMMUTABLE pattern: mmm_audit_logs and mmm_override_log are INSERT-only via service role.
-- =============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. mmm_organisations
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_organisations (
    id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name                    text        NOT NULL,
    slug                    text        NOT NULL UNIQUE,
    tier                    text        NOT NULL,
    subscription_status     text        NOT NULL DEFAULT 'TRIAL',
    evidence_freshness_days integer     NOT NULL DEFAULT 30,
    created_at              timestamptz NOT NULL DEFAULT now(),
    updated_at              timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_organisations IS 'MMM tenant organisations. TR-022, TR-028.';

-- =============================================================================
-- 2. mmm_frameworks
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_frameworks (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id uuid        NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
    name            text        NOT NULL,
    version         integer     NOT NULL DEFAULT 1,
    status          text        NOT NULL CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED')),
    source_type     text,
    origin_mode     text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_frameworks IS 'Maturity frameworks per organisation. TR-022, TR-027.';

-- =============================================================================
-- 3. mmm_domains
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_domains (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id uuid        NOT NULL REFERENCES public.mmm_frameworks(id) ON DELETE CASCADE,
    name         text        NOT NULL,
    code         text        NOT NULL,
    sort_order   integer     NOT NULL DEFAULT 0,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_domains IS 'Framework domains. TR-022.';

-- =============================================================================
-- 4. mmm_maturity_process_steps
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_maturity_process_steps (
    id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id        uuid        NOT NULL REFERENCES public.mmm_domains(id) ON DELETE CASCADE,
    name             text        NOT NULL,
    code             text        NOT NULL,
    sort_order       integer     NOT NULL DEFAULT 0,
    intent_statement text,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_maturity_process_steps IS 'Maturity Process Steps (MPS). TR-022.';

-- =============================================================================
-- 5. mmm_criteria
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_criteria (
    id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    mps_id               uuid        NOT NULL REFERENCES public.mmm_maturity_process_steps(id) ON DELETE CASCADE,
    name                 text        NOT NULL,
    code                 text        NOT NULL,
    sort_order           integer     NOT NULL DEFAULT 0,
    maturity_level_target integer,
    created_at           timestamptz NOT NULL DEFAULT now(),
    updated_at           timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_criteria IS 'Assessment criteria per MPS. TR-022.';

-- =============================================================================
-- 6. mmm_level_descriptors
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_level_descriptors (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    criterion_id    uuid        NOT NULL REFERENCES public.mmm_criteria(id) ON DELETE CASCADE,
    level           integer     NOT NULL CHECK (level BETWEEN 1 AND 5),
    descriptor_text text        NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_level_descriptors IS 'Level descriptors (1–5) per criterion. TR-022.';

-- =============================================================================
-- 7. mmm_assessments
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_assessments (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id uuid        NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
    framework_id    uuid        NOT NULL REFERENCES public.mmm_frameworks(id),
    status          text        NOT NULL DEFAULT 'DRAFT',
    started_at      timestamptz,
    completed_at    timestamptz,
    created_by      uuid,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_assessments IS 'Assessment instances per org+framework. TR-022.';

-- =============================================================================
-- 8. mmm_maturity_scores
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_maturity_scores (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id uuid        NOT NULL REFERENCES public.mmm_assessments(id) ON DELETE CASCADE,
    entity_type   text        NOT NULL,
    entity_id     uuid        NOT NULL,
    score         numeric     NOT NULL,
    confirmed_at  timestamptz,
    confirmed_by  uuid,
    updated_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_maturity_scores IS 'Maturity scores per entity. TR-022.';

-- =============================================================================
-- 9. mmm_score_proposals
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_score_proposals (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id       uuid        NOT NULL REFERENCES public.mmm_assessments(id) ON DELETE CASCADE,
    criterion_id        uuid        NOT NULL REFERENCES public.mmm_criteria(id),
    proposed_score      integer     NOT NULL,
    proposed_by_ai      boolean     NOT NULL DEFAULT false,
    source_evidence_ids uuid[],
    created_at          timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_score_proposals IS 'AI/human score proposals per criterion. TR-022.';

-- =============================================================================
-- 10. mmm_evidence
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_evidence (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id uuid        NOT NULL REFERENCES public.mmm_assessments(id) ON DELETE CASCADE,
    criterion_id  uuid        NOT NULL REFERENCES public.mmm_criteria(id),
    type          text        NOT NULL,
    storage_ref   text,
    status        text        NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    reviewed_at   timestamptz,
    reviewed_by   uuid,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_evidence IS 'Evidence submissions per assessment criterion. TR-022, TR-024.';

-- =============================================================================
-- 11. mmm_findings
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_findings (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id     uuid        NOT NULL REFERENCES public.mmm_assessments(id) ON DELETE CASCADE,
    criterion_id      uuid        NOT NULL REFERENCES public.mmm_criteria(id),
    maturity_position integer,
    gap_to_next       integer,
    finding_text      text,
    created_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_findings IS 'Assessment findings per criterion. TR-022.';

-- =============================================================================
-- 12. mmm_override_log  — IMMUTABLE: INSERT-only via service role (TR-038)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_override_log (
    id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id  uuid        NOT NULL REFERENCES public.mmm_assessments(id),
    criterion_id   uuid        NOT NULL REFERENCES public.mmm_criteria(id),
    previous_score integer,
    new_score      integer     NOT NULL,
    rationale      text,
    overridden_by  uuid,
    created_at     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_override_log IS 'IMMUTABLE score override log. INSERT-only via service role. TR-026, TR-038.';

-- =============================================================================
-- 13. mmm_audit_sessions
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_audit_sessions (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id uuid        NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
    framework_id    uuid        NOT NULL REFERENCES public.mmm_frameworks(id),
    user_id         uuid,
    status          text        NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED')),
    started_at      timestamptz NOT NULL DEFAULT now(),
    closed_at       timestamptz
);

COMMENT ON TABLE public.mmm_audit_sessions IS 'Active audit sessions per org/framework/user. TR-022.';

-- =============================================================================
-- 14. mmm_audit_logs  — IMMUTABLE: INSERT-only via service role (TR-038)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_audit_logs (
    id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type        text        NOT NULL,
    actor_id           uuid,
    target_entity_type text,
    target_entity_id   uuid,
    before_state       jsonb,
    after_state        jsonb,
    created_at         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_audit_logs IS 'IMMUTABLE audit event log. INSERT-only via service role. TR-038.';

-- =============================================================================
-- 15. mmm_pit_exports
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_pit_exports (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id   uuid        NOT NULL REFERENCES public.mmm_assessments(id),
    organisation_id uuid        NOT NULL REFERENCES public.mmm_organisations(id),
    status          text        NOT NULL DEFAULT 'PENDING',
    payload_json    jsonb,
    sent_at         timestamptz,
    pit_task_id     text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_pit_exports IS 'PIT export payloads. TR-016–TR-018.';

-- =============================================================================
-- 16. mmm_parse_jobs
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_parse_jobs (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    upload_id   uuid,
    document_id uuid,
    status      text        NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETE', 'FAILED')),
    result_json jsonb,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_parse_jobs IS 'Framework document parse jobs. TR-019–TR-020.';

-- =============================================================================
-- 17. mmm_ai_interactions
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_ai_interactions (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id        uuid,
    action_type     text        NOT NULL,
    context_type    text,
    target_entity_id uuid,
    token_count     integer,
    duration_ms     integer,
    status          text,
    request_json    jsonb,
    response_json   jsonb,
    created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_ai_interactions IS 'AI governance and telemetry log. TR-034, TR-066.';

-- =============================================================================
-- 18. mmm_profiles
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_profiles (
    id                      uuid        PRIMARY KEY,  -- = auth.users.id
    organisation_id         uuid        REFERENCES public.mmm_organisations(id),
    role                    text        NOT NULL DEFAULT 'CONTRIBUTOR',
    current_org_id          uuid        REFERENCES public.mmm_organisations(id),
    current_framework_id    uuid        REFERENCES public.mmm_frameworks(id),
    invitation_token        text        UNIQUE,
    invitation_accepted_at  timestamptz,
    created_at              timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_profiles IS 'User profiles extending auth.users. TR-022.';

-- =============================================================================
-- 19. mmm_user_preferences
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_user_preferences (
    id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    uuid        NOT NULL UNIQUE REFERENCES public.mmm_profiles(id) ON DELETE CASCADE,
    filters    jsonb       NOT NULL DEFAULT '{}',
    ui         jsonb       NOT NULL DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_user_preferences IS 'Per-user UI/filter preferences. TR-022.';

-- =============================================================================
-- 20. mmm_organisation_hierarchy
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_organisation_hierarchy (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id uuid        NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
    node_type       text        NOT NULL CHECK (node_type IN ('SITE', 'OPERATION', 'SUBSIDIARY')),
    name            text        NOT NULL,
    parent_id       uuid,
    created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_organisation_hierarchy IS 'Org hierarchy nodes (sites, operations, subsidiaries). TR-022.';

-- =============================================================================
-- 21. mmm_free_assessments
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_free_assessments (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token   text        NOT NULL UNIQUE,
    responses       jsonb,
    baseline_result jsonb,
    status          text        NOT NULL DEFAULT 'IN_PROGRESS',
    created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_free_assessments IS 'Public free/baseline assessments (no auth required). TR-022.';

-- =============================================================================
-- 22. mmm_invitations
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_invitations (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id uuid        NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
    email           text        NOT NULL,
    role            text        NOT NULL DEFAULT 'CONTRIBUTOR',
    token           text        NOT NULL UNIQUE,
    expires_at      timestamptz NOT NULL,
    accepted_at     timestamptz,
    created_by      uuid,
    created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_invitations IS 'User invitations per organisation. TR-022.';

-- =============================================================================
-- 23. mmm_proposed_domains
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_proposed_domains (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id uuid        NOT NULL REFERENCES public.mmm_frameworks(id) ON DELETE CASCADE,
    name         text        NOT NULL,
    code         text        NOT NULL,
    sort_order   integer     NOT NULL DEFAULT 0,
    source       text        NOT NULL CHECK (source IN ('AI', 'HUMAN')),
    created_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_proposed_domains IS 'AI/human proposed domains for framework compilation. TR-022.';

-- =============================================================================
-- 24. mmm_proposed_mps
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_proposed_mps (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    proposed_domain_id  uuid        NOT NULL REFERENCES public.mmm_proposed_domains(id) ON DELETE CASCADE,
    name                text        NOT NULL,
    code                text        NOT NULL,
    sort_order          integer     NOT NULL DEFAULT 0,
    intent_statement    text,
    source              text        NOT NULL,
    created_at          timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_proposed_mps IS 'Proposed MPS for framework compilation. TR-022.';

-- =============================================================================
-- 25. mmm_proposed_criteria
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_proposed_criteria (
    id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    proposed_mps_id       uuid        NOT NULL REFERENCES public.mmm_proposed_mps(id) ON DELETE CASCADE,
    name                  text        NOT NULL,
    code                  text        NOT NULL,
    sort_order            integer     NOT NULL DEFAULT 0,
    maturity_level_target integer,
    source                text        NOT NULL,
    created_at            timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_proposed_criteria IS 'Proposed criteria for framework compilation. TR-022.';

-- =============================================================================
-- 26. mmm_parse_ambiguities
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_parse_ambiguities (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id      uuid        NOT NULL REFERENCES public.mmm_frameworks(id) ON DELETE CASCADE,
    item_type         text,
    item_ref          text,
    ambiguity_text    text,
    resolution_status text        NOT NULL DEFAULT 'OPEN',
    resolved_by       uuid,
    created_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mmm_parse_ambiguities IS 'Parse ambiguity items per framework. TR-022.';

-- =============================================================================
-- IMMUTABLE AUDIT TABLE PROTECTION FUNCTIONS
-- Enforce INSERT-only on mmm_audit_logs and mmm_override_log (TR-038)
-- =============================================================================

-- Prevent UPDATE on mmm_audit_logs
CREATE OR REPLACE FUNCTION public.mmm_prevent_audit_log_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RAISE EXCEPTION 'mmm_audit_logs is immutable: UPDATE operations are prohibited (TR-038)';
END;
$$;

CREATE TRIGGER mmm_audit_logs_no_update
    BEFORE UPDATE ON public.mmm_audit_logs
    FOR EACH ROW EXECUTE FUNCTION public.mmm_prevent_audit_log_update();

-- Prevent DELETE on mmm_audit_logs
CREATE OR REPLACE FUNCTION public.mmm_prevent_audit_log_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RAISE EXCEPTION 'mmm_audit_logs is immutable: DELETE operations are prohibited (TR-038)';
END;
$$;

CREATE TRIGGER mmm_audit_logs_no_delete
    BEFORE DELETE ON public.mmm_audit_logs
    FOR EACH ROW EXECUTE FUNCTION public.mmm_prevent_audit_log_delete();

-- Prevent UPDATE on mmm_override_log
CREATE OR REPLACE FUNCTION public.mmm_prevent_override_log_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RAISE EXCEPTION 'mmm_override_log is immutable: UPDATE operations are prohibited (TR-026, TR-038)';
END;
$$;

CREATE TRIGGER mmm_override_log_no_update
    BEFORE UPDATE ON public.mmm_override_log
    FOR EACH ROW EXECUTE FUNCTION public.mmm_prevent_override_log_update();

-- Prevent DELETE on mmm_override_log
CREATE OR REPLACE FUNCTION public.mmm_prevent_override_log_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RAISE EXCEPTION 'mmm_override_log is immutable: DELETE operations are prohibited (TR-026, TR-038)';
END;
$$;

CREATE TRIGGER mmm_override_log_no_delete
    BEFORE DELETE ON public.mmm_override_log
    FOR EACH ROW EXECUTE FUNCTION public.mmm_prevent_override_log_delete();

-- =============================================================================
-- updated_at auto-update trigger (applied to all mutable tables)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.mmm_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER mmm_organisations_updated_at
    BEFORE UPDATE ON public.mmm_organisations
    FOR EACH ROW EXECUTE FUNCTION public.mmm_set_updated_at();

CREATE TRIGGER mmm_frameworks_updated_at
    BEFORE UPDATE ON public.mmm_frameworks
    FOR EACH ROW EXECUTE FUNCTION public.mmm_set_updated_at();

CREATE TRIGGER mmm_domains_updated_at
    BEFORE UPDATE ON public.mmm_domains
    FOR EACH ROW EXECUTE FUNCTION public.mmm_set_updated_at();

CREATE TRIGGER mmm_maturity_process_steps_updated_at
    BEFORE UPDATE ON public.mmm_maturity_process_steps
    FOR EACH ROW EXECUTE FUNCTION public.mmm_set_updated_at();

CREATE TRIGGER mmm_criteria_updated_at
    BEFORE UPDATE ON public.mmm_criteria
    FOR EACH ROW EXECUTE FUNCTION public.mmm_set_updated_at();

CREATE TRIGGER mmm_assessments_updated_at
    BEFORE UPDATE ON public.mmm_assessments
    FOR EACH ROW EXECUTE FUNCTION public.mmm_set_updated_at();

CREATE TRIGGER mmm_evidence_updated_at
    BEFORE UPDATE ON public.mmm_evidence
    FOR EACH ROW EXECUTE FUNCTION public.mmm_set_updated_at();

CREATE TRIGGER mmm_parse_jobs_updated_at
    BEFORE UPDATE ON public.mmm_parse_jobs
    FOR EACH ROW EXECUTE FUNCTION public.mmm_set_updated_at();

CREATE TRIGGER mmm_user_preferences_updated_at
    BEFORE UPDATE ON public.mmm_user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.mmm_set_updated_at();
