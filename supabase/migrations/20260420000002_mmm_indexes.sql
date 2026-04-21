-- =============================================================================
-- MMM Wave B1 — Database Indexes Migration
-- Wave Slug: mmm-build-wave-b1-schema
-- Architecture Reference: modules/MMM/04-architecture/architecture.md §A5.4
-- TR-046 compliance (10 required indexes)
-- Builder: schema-builder
-- Date: 2026-04-20
-- Issue: maturion-isms#1428
-- =============================================================================

-- Index 1: mmm_evidence(assessment_id, criterion_id) — B-tree
-- Purpose: Evidence lookup per criterion during assessment (TR-046)
CREATE INDEX IF NOT EXISTS idx_mmm_evidence_assessment_criterion
    ON public.mmm_evidence (assessment_id, criterion_id);

-- Index 2: mmm_maturity_scores(assessment_id, entity_type, entity_id) — B-tree
-- Purpose: Score cascade lookup (TR-046)
CREATE INDEX IF NOT EXISTS idx_mmm_maturity_scores_assessment_entity
    ON public.mmm_maturity_scores (assessment_id, entity_type, entity_id);

-- Index 3: mmm_audit_logs(target_entity_type, target_entity_id) — B-tree
-- Purpose: Audit trail lookup per entity (TR-046)
CREATE INDEX IF NOT EXISTS idx_mmm_audit_logs_target_entity
    ON public.mmm_audit_logs (target_entity_type, target_entity_id);

-- Index 4: mmm_audit_logs(created_at) — B-tree
-- Purpose: Time-range audit queries (TR-046)
CREATE INDEX IF NOT EXISTS idx_mmm_audit_logs_created_at
    ON public.mmm_audit_logs (created_at);

-- Index 5: mmm_frameworks(organisation_id, status) — B-tree
-- Purpose: Framework list per org/status (TR-046)
CREATE INDEX IF NOT EXISTS idx_mmm_frameworks_org_status
    ON public.mmm_frameworks (organisation_id, status);

-- Index 6: mmm_criteria(mps_id) — B-tree
-- Purpose: Criteria load for audit session (TR-007, TR-046)
CREATE INDEX IF NOT EXISTS idx_mmm_criteria_mps_id
    ON public.mmm_criteria (mps_id);

-- Index 7: mmm_parse_jobs(upload_id, status) — B-tree
-- Purpose: Upload status polling (TR-046)
CREATE INDEX IF NOT EXISTS idx_mmm_parse_jobs_upload_status
    ON public.mmm_parse_jobs (upload_id, status);

-- Index 8: mmm_pit_exports(organisation_id, status) — B-tree
-- Purpose: Export status queries (TR-046)
CREATE INDEX IF NOT EXISTS idx_mmm_pit_exports_org_status
    ON public.mmm_pit_exports (organisation_id, status);

-- Index 9: mmm_score_proposals(assessment_id, criterion_id) — B-tree
-- Purpose: Proposal lookup per criterion (TR-046)
CREATE INDEX IF NOT EXISTS idx_mmm_score_proposals_assessment_criterion
    ON public.mmm_score_proposals (assessment_id, criterion_id);

-- Index 10: mmm_ai_interactions(actor_id, created_at) — B-tree
-- Purpose: AI telemetry queries (TR-046)
CREATE INDEX IF NOT EXISTS idx_mmm_ai_interactions_actor_created
    ON public.mmm_ai_interactions (actor_id, created_at);

-- =============================================================================
-- Additional supporting indexes for common query patterns (performance)
-- =============================================================================

-- mmm_assessments by organisation (common dashboard query)
CREATE INDEX IF NOT EXISTS idx_mmm_assessments_organisation_id
    ON public.mmm_assessments (organisation_id);

-- mmm_domains by framework
CREATE INDEX IF NOT EXISTS idx_mmm_domains_framework_id
    ON public.mmm_domains (framework_id);

-- mmm_maturity_process_steps by domain
CREATE INDEX IF NOT EXISTS idx_mmm_mps_domain_id
    ON public.mmm_maturity_process_steps (domain_id);

-- mmm_findings by assessment
CREATE INDEX IF NOT EXISTS idx_mmm_findings_assessment_id
    ON public.mmm_findings (assessment_id);

-- mmm_override_log by assessment
CREATE INDEX IF NOT EXISTS idx_mmm_override_log_assessment_id
    ON public.mmm_override_log (assessment_id);

-- mmm_invitations by organisation and token
CREATE INDEX IF NOT EXISTS idx_mmm_invitations_organisation_id
    ON public.mmm_invitations (organisation_id);
CREATE INDEX IF NOT EXISTS idx_mmm_invitations_token
    ON public.mmm_invitations (token);

-- mmm_proposed_domains by framework
CREATE INDEX IF NOT EXISTS idx_mmm_proposed_domains_framework_id
    ON public.mmm_proposed_domains (framework_id);

-- mmm_parse_ambiguities by framework
CREATE INDEX IF NOT EXISTS idx_mmm_parse_ambiguities_framework_id
    ON public.mmm_parse_ambiguities (framework_id);

-- mmm_level_descriptors by criterion
CREATE INDEX IF NOT EXISTS idx_mmm_level_descriptors_criterion_id
    ON public.mmm_level_descriptors (criterion_id);

-- mmm_audit_sessions by organisation
CREATE INDEX IF NOT EXISTS idx_mmm_audit_sessions_organisation_id
    ON public.mmm_audit_sessions (organisation_id);
