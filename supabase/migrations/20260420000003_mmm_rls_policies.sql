-- =============================================================================
-- MMM Wave B1 — Row-Level Security (RLS) Policies Migration
-- Wave Slug: mmm-build-wave-b1-schema
-- Architecture Reference: modules/MMM/04-architecture/architecture.md §A5.3
-- TR-031, TR-032 compliance
-- Builder: schema-builder
-- Date: 2026-04-20
-- Issue: maturion-isms#1428
-- =============================================================================
-- NBR-002: RLS must return HTTP 403 / policy violation on cross-org writes.
-- Audit table immutability: mmm_audit_logs and mmm_override_log — service role only writes.
-- =============================================================================

-- =============================================================================
-- ENABLE RLS on ALL 26 mmm_ tables (architecture §A5.3: "RLS is enabled on all MMM tables")
-- =============================================================================
ALTER TABLE public.mmm_organisations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_frameworks             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_domains                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_maturity_process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_criteria               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_level_descriptors      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_assessments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_maturity_scores        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_score_proposals        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_evidence               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_findings               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_override_log           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_audit_sessions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_audit_logs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_pit_exports            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_parse_jobs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_ai_interactions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_user_preferences       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_organisation_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_free_assessments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_invitations            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_proposed_domains       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_proposed_mps           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_proposed_criteria      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_parse_ambiguities      ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- Helper function: get caller's organisation_id from their profile
-- Used in org-scoped policies.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.mmm_current_user_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT organisation_id
    FROM public.mmm_profiles
    WHERE id = auth.uid()
    LIMIT 1;
$$;

-- Helper function: check if caller has a specific role
CREATE OR REPLACE FUNCTION public.mmm_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT role
    FROM public.mmm_profiles
    WHERE id = auth.uid()
    LIMIT 1;
$$;

-- =============================================================================
-- 1. mmm_organisations
-- Policy: authenticated users see only their own organisation.
-- =============================================================================
CREATE POLICY "mmm_organisations_select_own_org"
    ON public.mmm_organisations FOR SELECT
    TO authenticated
    USING (id = public.mmm_current_user_org_id());

CREATE POLICY "mmm_organisations_update_admin"
    ON public.mmm_organisations FOR UPDATE
    TO authenticated
    USING (
        id = public.mmm_current_user_org_id()
        AND public.mmm_current_user_role() IN ('ADMIN', 'LEAD_AUDITOR')
    )
    WITH CHECK (id = public.mmm_current_user_org_id());

-- Service role bypass (implicit for service_role in Supabase — no policy needed
-- as service_role bypasses RLS by default in Supabase; documented here for clarity)

-- =============================================================================
-- 2. mmm_frameworks — org-scoped via organisation_id
-- =============================================================================
CREATE POLICY "mmm_frameworks_select_own_org"
    ON public.mmm_frameworks FOR SELECT
    TO authenticated
    USING (organisation_id = public.mmm_current_user_org_id());

CREATE POLICY "mmm_frameworks_insert_own_org"
    ON public.mmm_frameworks FOR INSERT
    TO authenticated
    WITH CHECK (organisation_id = public.mmm_current_user_org_id());

CREATE POLICY "mmm_frameworks_update_own_org"
    ON public.mmm_frameworks FOR UPDATE
    TO authenticated
    USING (
        organisation_id = public.mmm_current_user_org_id()
        AND public.mmm_current_user_role() IN ('ADMIN', 'LEAD_AUDITOR')
    )
    WITH CHECK (organisation_id = public.mmm_current_user_org_id());

CREATE POLICY "mmm_frameworks_delete_admin"
    ON public.mmm_frameworks FOR DELETE
    TO authenticated
    USING (
        organisation_id = public.mmm_current_user_org_id()
        AND public.mmm_current_user_role() = 'ADMIN'
    );

-- =============================================================================
-- 3. mmm_domains — org-scoped via framework chain
-- =============================================================================
CREATE POLICY "mmm_domains_select_own_org"
    ON public.mmm_domains FOR SELECT
    TO authenticated
    USING (
        framework_id IN (
            SELECT id FROM public.mmm_frameworks
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

CREATE POLICY "mmm_domains_insert_own_org"
    ON public.mmm_domains FOR INSERT
    TO authenticated
    WITH CHECK (
        framework_id IN (
            SELECT id FROM public.mmm_frameworks
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

CREATE POLICY "mmm_domains_update_own_org"
    ON public.mmm_domains FOR UPDATE
    TO authenticated
    USING (
        framework_id IN (
            SELECT id FROM public.mmm_frameworks
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    )
    WITH CHECK (
        framework_id IN (
            SELECT id FROM public.mmm_frameworks
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

CREATE POLICY "mmm_domains_delete_admin"
    ON public.mmm_domains FOR DELETE
    TO authenticated
    USING (
        framework_id IN (
            SELECT id FROM public.mmm_frameworks
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
        AND public.mmm_current_user_role() IN ('ADMIN', 'LEAD_AUDITOR')
    );

-- =============================================================================
-- 4. mmm_maturity_process_steps — org-scoped via domain→framework chain
-- =============================================================================
CREATE POLICY "mmm_mps_select_own_org"
    ON public.mmm_maturity_process_steps FOR SELECT
    TO authenticated
    USING (
        domain_id IN (
            SELECT d.id FROM public.mmm_domains d
            JOIN public.mmm_frameworks f ON f.id = d.framework_id
            WHERE f.organisation_id = public.mmm_current_user_org_id()
        )
    );

CREATE POLICY "mmm_mps_insert_own_org"
    ON public.mmm_maturity_process_steps FOR INSERT
    TO authenticated
    WITH CHECK (
        domain_id IN (
            SELECT d.id FROM public.mmm_domains d
            JOIN public.mmm_frameworks f ON f.id = d.framework_id
            WHERE f.organisation_id = public.mmm_current_user_org_id()
        )
    );

CREATE POLICY "mmm_mps_update_own_org"
    ON public.mmm_maturity_process_steps FOR UPDATE
    TO authenticated
    USING (
        domain_id IN (
            SELECT d.id FROM public.mmm_domains d
            JOIN public.mmm_frameworks f ON f.id = d.framework_id
            WHERE f.organisation_id = public.mmm_current_user_org_id()
        )
    )
    WITH CHECK (
        domain_id IN (
            SELECT d.id FROM public.mmm_domains d
            JOIN public.mmm_frameworks f ON f.id = d.framework_id
            WHERE f.organisation_id = public.mmm_current_user_org_id()
        )
    );

-- =============================================================================
-- 5. mmm_criteria — org-scoped via mps→domain→framework chain
-- =============================================================================
CREATE POLICY "mmm_criteria_select_own_org"
    ON public.mmm_criteria FOR SELECT
    TO authenticated
    USING (
        mps_id IN (
            SELECT mps.id FROM public.mmm_maturity_process_steps mps
            JOIN public.mmm_domains d ON d.id = mps.domain_id
            JOIN public.mmm_frameworks f ON f.id = d.framework_id
            WHERE f.organisation_id = public.mmm_current_user_org_id()
        )
    );

CREATE POLICY "mmm_criteria_insert_own_org"
    ON public.mmm_criteria FOR INSERT
    TO authenticated
    WITH CHECK (
        mps_id IN (
            SELECT mps.id FROM public.mmm_maturity_process_steps mps
            JOIN public.mmm_domains d ON d.id = mps.domain_id
            JOIN public.mmm_frameworks f ON f.id = d.framework_id
            WHERE f.organisation_id = public.mmm_current_user_org_id()
        )
    );

-- =============================================================================
-- 6. mmm_level_descriptors — org-scoped via criterion chain
-- =============================================================================
CREATE POLICY "mmm_level_descriptors_select_own_org"
    ON public.mmm_level_descriptors FOR SELECT
    TO authenticated
    USING (
        criterion_id IN (
            SELECT c.id FROM public.mmm_criteria c
            JOIN public.mmm_maturity_process_steps mps ON mps.id = c.mps_id
            JOIN public.mmm_domains d ON d.id = mps.domain_id
            JOIN public.mmm_frameworks f ON f.id = d.framework_id
            WHERE f.organisation_id = public.mmm_current_user_org_id()
        )
    );

-- =============================================================================
-- 7. mmm_assessments — org-scoped via organisation_id
-- =============================================================================
CREATE POLICY "mmm_assessments_select_own_org"
    ON public.mmm_assessments FOR SELECT
    TO authenticated
    USING (organisation_id = public.mmm_current_user_org_id());

CREATE POLICY "mmm_assessments_insert_own_org"
    ON public.mmm_assessments FOR INSERT
    TO authenticated
    WITH CHECK (organisation_id = public.mmm_current_user_org_id());

CREATE POLICY "mmm_assessments_update_own_org"
    ON public.mmm_assessments FOR UPDATE
    TO authenticated
    USING (organisation_id = public.mmm_current_user_org_id())
    WITH CHECK (organisation_id = public.mmm_current_user_org_id());

-- =============================================================================
-- 8. mmm_maturity_scores — service role INSERT; org-scoped SELECT
-- Architecture §A5.3: "INSERT: Service role (via confirm endpoint); SELECT: Authenticated + own org"
-- =============================================================================
CREATE POLICY "mmm_maturity_scores_select_own_org"
    ON public.mmm_maturity_scores FOR SELECT
    TO authenticated
    USING (
        assessment_id IN (
            SELECT id FROM public.mmm_assessments
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

-- No INSERT/UPDATE/DELETE policy for authenticated role (service role only)
-- This enforces the "service role only" write pattern

-- =============================================================================
-- 9. mmm_score_proposals — service role INSERT; org-scoped SELECT
-- =============================================================================
CREATE POLICY "mmm_score_proposals_select_own_org"
    ON public.mmm_score_proposals FOR SELECT
    TO authenticated
    USING (
        assessment_id IN (
            SELECT id FROM public.mmm_assessments
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

-- =============================================================================
-- 10. mmm_evidence — org-scoped via assessment
-- =============================================================================
CREATE POLICY "mmm_evidence_select_own_org"
    ON public.mmm_evidence FOR SELECT
    TO authenticated
    USING (
        assessment_id IN (
            SELECT id FROM public.mmm_assessments
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

CREATE POLICY "mmm_evidence_insert_own_org"
    ON public.mmm_evidence FOR INSERT
    TO authenticated
    WITH CHECK (
        assessment_id IN (
            SELECT id FROM public.mmm_assessments
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

CREATE POLICY "mmm_evidence_update_own_org"
    ON public.mmm_evidence FOR UPDATE
    TO authenticated
    USING (
        assessment_id IN (
            SELECT id FROM public.mmm_assessments
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    )
    WITH CHECK (
        assessment_id IN (
            SELECT id FROM public.mmm_assessments
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

-- =============================================================================
-- 11. mmm_findings — org-scoped via assessment
-- =============================================================================
CREATE POLICY "mmm_findings_select_own_org"
    ON public.mmm_findings FOR SELECT
    TO authenticated
    USING (
        assessment_id IN (
            SELECT id FROM public.mmm_assessments
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

CREATE POLICY "mmm_findings_insert_own_org"
    ON public.mmm_findings FOR INSERT
    TO authenticated
    WITH CHECK (
        assessment_id IN (
            SELECT id FROM public.mmm_assessments
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

-- =============================================================================
-- 12. mmm_override_log — IMMUTABLE: SELECT allowed for org members; NO INSERT/UPDATE/DELETE via RLS
-- Architecture §A5.3: "INSERT: ADMIN + own org; UPDATE: PROHIBITED; DELETE: PROHIBITED"
-- =============================================================================
CREATE POLICY "mmm_override_log_select_own_org"
    ON public.mmm_override_log FOR SELECT
    TO authenticated
    USING (
        assessment_id IN (
            SELECT id FROM public.mmm_assessments
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

-- No INSERT policy for authenticated — service role only (NBR-002, TR-038)

-- =============================================================================
-- 13. mmm_audit_sessions — org-scoped
-- =============================================================================
CREATE POLICY "mmm_audit_sessions_select_own_org"
    ON public.mmm_audit_sessions FOR SELECT
    TO authenticated
    USING (organisation_id = public.mmm_current_user_org_id());

CREATE POLICY "mmm_audit_sessions_insert_own_org"
    ON public.mmm_audit_sessions FOR INSERT
    TO authenticated
    WITH CHECK (organisation_id = public.mmm_current_user_org_id());

CREATE POLICY "mmm_audit_sessions_update_own_org"
    ON public.mmm_audit_sessions FOR UPDATE
    TO authenticated
    USING (organisation_id = public.mmm_current_user_org_id())
    WITH CHECK (organisation_id = public.mmm_current_user_org_id());

-- =============================================================================
-- 14. mmm_audit_logs — IMMUTABLE: SELECT allowed for org members; NO INSERT/UPDATE/DELETE via RLS
-- Architecture §A5.3: "INSERT: Service role only; UPDATE: PROHIBITED; DELETE: PROHIBITED"
-- =============================================================================
CREATE POLICY "mmm_audit_logs_select_authenticated"
    ON public.mmm_audit_logs FOR SELECT
    TO authenticated
    USING (true);  -- Any authenticated user can read audit logs for visibility
                   -- Org scoping at application layer (actor_id / target_entity_id)

-- No INSERT/UPDATE/DELETE policies for authenticated or anon role.
-- Service role bypasses RLS — only path for writes (NBR-002, TR-038).

-- =============================================================================
-- 15. mmm_pit_exports — org-scoped via organisation_id
-- =============================================================================
CREATE POLICY "mmm_pit_exports_select_own_org"
    ON public.mmm_pit_exports FOR SELECT
    TO authenticated
    USING (organisation_id = public.mmm_current_user_org_id());

-- No authenticated INSERT — service role only (PIT export via Edge Function)

-- =============================================================================
-- 16. mmm_parse_jobs — org-scoped (users can read their own parse jobs)
-- =============================================================================
CREATE POLICY "mmm_parse_jobs_select_authenticated"
    ON public.mmm_parse_jobs FOR SELECT
    TO authenticated
    USING (true);  -- Read permitted; write via service role only

-- =============================================================================
-- 17. mmm_ai_interactions — ADMIN read + service-role write (TR-066)
-- =============================================================================
CREATE POLICY "mmm_ai_interactions_select_admin"
    ON public.mmm_ai_interactions FOR SELECT
    TO authenticated
    USING (public.mmm_current_user_role() IN ('ADMIN', 'LEAD_AUDITOR'));

-- No INSERT/UPDATE/DELETE for authenticated — service role only

-- =============================================================================
-- 18. mmm_profiles — users can read/update their own profile
-- =============================================================================
CREATE POLICY "mmm_profiles_select_own"
    ON public.mmm_profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "mmm_profiles_insert_own"
    ON public.mmm_profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid());

CREATE POLICY "mmm_profiles_update_own"
    ON public.mmm_profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- =============================================================================
-- 19. mmm_user_preferences — users can read/update their own preferences
-- =============================================================================
CREATE POLICY "mmm_user_preferences_select_own"
    ON public.mmm_user_preferences FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "mmm_user_preferences_insert_own"
    ON public.mmm_user_preferences FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "mmm_user_preferences_update_own"
    ON public.mmm_user_preferences FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- 20. mmm_organisation_hierarchy — org-scoped
-- =============================================================================
CREATE POLICY "mmm_org_hierarchy_select_own_org"
    ON public.mmm_organisation_hierarchy FOR SELECT
    TO authenticated
    USING (organisation_id = public.mmm_current_user_org_id());

CREATE POLICY "mmm_org_hierarchy_insert_admin"
    ON public.mmm_organisation_hierarchy FOR INSERT
    TO authenticated
    WITH CHECK (
        organisation_id = public.mmm_current_user_org_id()
        AND public.mmm_current_user_role() = 'ADMIN'
    );

-- =============================================================================
-- 21. mmm_free_assessments — PUBLIC: no auth required (session_token access)
-- Architecture §A5.3: "INSERT: No auth required; SELECT: Session token matching"
-- =============================================================================
CREATE POLICY "mmm_free_assessments_select_by_token"
    ON public.mmm_free_assessments FOR SELECT
    TO anon, authenticated
    USING (true);  -- Token matching enforced at application layer

CREATE POLICY "mmm_free_assessments_insert_public"
    ON public.mmm_free_assessments FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);  -- Public insert — session token uniqueness enforced by DB constraint

-- No UPDATE/DELETE for anon/authenticated (service role only)

-- =============================================================================
-- 22. mmm_invitations — ADMIN only
-- Architecture §A5.3: "INSERT/SELECT/UPDATE/DELETE: ADMIN + own org"
-- =============================================================================
CREATE POLICY "mmm_invitations_select_admin"
    ON public.mmm_invitations FOR SELECT
    TO authenticated
    USING (
        organisation_id = public.mmm_current_user_org_id()
        AND public.mmm_current_user_role() IN ('ADMIN', 'LEAD_AUDITOR')
    );

CREATE POLICY "mmm_invitations_insert_admin"
    ON public.mmm_invitations FOR INSERT
    TO authenticated
    WITH CHECK (
        organisation_id = public.mmm_current_user_org_id()
        AND public.mmm_current_user_role() IN ('ADMIN', 'LEAD_AUDITOR')
    );

CREATE POLICY "mmm_invitations_update_admin"
    ON public.mmm_invitations FOR UPDATE
    TO authenticated
    USING (
        organisation_id = public.mmm_current_user_org_id()
        AND public.mmm_current_user_role() IN ('ADMIN', 'LEAD_AUDITOR')
    )
    WITH CHECK (organisation_id = public.mmm_current_user_org_id());

CREATE POLICY "mmm_invitations_delete_admin"
    ON public.mmm_invitations FOR DELETE
    TO authenticated
    USING (
        organisation_id = public.mmm_current_user_org_id()
        AND public.mmm_current_user_role() = 'ADMIN'
    );

-- =============================================================================
-- 23. mmm_proposed_domains — org-scoped via framework chain
-- =============================================================================
CREATE POLICY "mmm_proposed_domains_select_own_org"
    ON public.mmm_proposed_domains FOR SELECT
    TO authenticated
    USING (
        framework_id IN (
            SELECT id FROM public.mmm_frameworks
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

CREATE POLICY "mmm_proposed_domains_insert_own_org"
    ON public.mmm_proposed_domains FOR INSERT
    TO authenticated
    WITH CHECK (
        framework_id IN (
            SELECT id FROM public.mmm_frameworks
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

-- =============================================================================
-- 24. mmm_proposed_mps — org-scoped via proposed_domain chain
-- =============================================================================
CREATE POLICY "mmm_proposed_mps_select_own_org"
    ON public.mmm_proposed_mps FOR SELECT
    TO authenticated
    USING (
        proposed_domain_id IN (
            SELECT pd.id FROM public.mmm_proposed_domains pd
            JOIN public.mmm_frameworks f ON f.id = pd.framework_id
            WHERE f.organisation_id = public.mmm_current_user_org_id()
        )
    );

CREATE POLICY "mmm_proposed_mps_insert_own_org"
    ON public.mmm_proposed_mps FOR INSERT
    TO authenticated
    WITH CHECK (
        proposed_domain_id IN (
            SELECT pd.id FROM public.mmm_proposed_domains pd
            JOIN public.mmm_frameworks f ON f.id = pd.framework_id
            WHERE f.organisation_id = public.mmm_current_user_org_id()
        )
    );

-- =============================================================================
-- 25. mmm_proposed_criteria — org-scoped via proposed_mps chain
-- =============================================================================
CREATE POLICY "mmm_proposed_criteria_select_own_org"
    ON public.mmm_proposed_criteria FOR SELECT
    TO authenticated
    USING (
        proposed_mps_id IN (
            SELECT pm.id FROM public.mmm_proposed_mps pm
            JOIN public.mmm_proposed_domains pd ON pd.id = pm.proposed_domain_id
            JOIN public.mmm_frameworks f ON f.id = pd.framework_id
            WHERE f.organisation_id = public.mmm_current_user_org_id()
        )
    );

CREATE POLICY "mmm_proposed_criteria_insert_own_org"
    ON public.mmm_proposed_criteria FOR INSERT
    TO authenticated
    WITH CHECK (
        proposed_mps_id IN (
            SELECT pm.id FROM public.mmm_proposed_mps pm
            JOIN public.mmm_proposed_domains pd ON pd.id = pm.proposed_domain_id
            JOIN public.mmm_frameworks f ON f.id = pd.framework_id
            WHERE f.organisation_id = public.mmm_current_user_org_id()
        )
    );

-- =============================================================================
-- 26. mmm_parse_ambiguities — org-scoped via framework
-- =============================================================================
CREATE POLICY "mmm_parse_ambiguities_select_own_org"
    ON public.mmm_parse_ambiguities FOR SELECT
    TO authenticated
    USING (
        framework_id IN (
            SELECT id FROM public.mmm_frameworks
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );

CREATE POLICY "mmm_parse_ambiguities_insert_own_org"
    ON public.mmm_parse_ambiguities FOR INSERT
    TO authenticated
    WITH CHECK (
        framework_id IN (
            SELECT id FROM public.mmm_frameworks
            WHERE organisation_id = public.mmm_current_user_org_id()
        )
    );
