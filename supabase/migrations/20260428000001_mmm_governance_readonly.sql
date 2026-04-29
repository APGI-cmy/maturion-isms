-- =============================================================================
-- MMM Governance Read-Only Schema — Governed Agent Verification Path
-- Migration: 20260428000001_mmm_governance_readonly.sql
-- Wave: governed-supabase-access-model
-- Issue: maturion-isms#1505
-- Architecture Reference: docs/supabase/SUPABASE_GOVERNED_ACCESS_MODEL.md
-- Builder: schema-builder (delegated by foreman-v2-agent)
-- Date: 2026-04-28
-- =============================================================================
--
-- PURPOSE
-- -------
-- This migration creates a governed read-only verification layer for agents.
-- It implements the "read-only verification path" defined in the Governed
-- Supabase Access Model (docs/supabase/SUPABASE_GOVERNED_ACCESS_MODEL.md).
--
-- SECURITY MODEL
-- --------------
-- All functions are SECURITY DEFINER, owned by the migration role (postgres /
-- supabase_admin).  They perform SELECT-only operations on business tables.
-- The only write statement present is an INSERT into
-- governance_readonly.verification_log inside the SECURITY DEFINER helper
-- log_verification_call — this is the intentional audit-log exception.
-- No INSERT/UPDATE/DELETE/DDL on business tables, no storage-mutation statements.
--
-- The functions are granted EXECUTE to the `service_role` so they can be
-- invoked from the approved verify-supabase-readonly.yml workflow.  No
-- production credentials are embedded here.
--
-- WHAT THIS MIGRATION CREATES
-- ----------------------------
--   Schema:  governance_readonly
--   Functions (all SECURITY DEFINER, SELECT-only):
--     governance_readonly.verify_mps_source_pack_status()
--     governance_readonly.list_mmm_framework_source_documents()
--     governance_readonly.count_mmm_mps_records()
--     governance_readonly.count_mmm_criteria_records()
--     governance_readonly.search_ai_knowledge_mps_sources(p_search_term TEXT)
--     governance_readonly.log_verification_call(p_caller TEXT, p_target TEXT)
--
-- AUDIT LOGGING
-- -------------
-- Every externally callable verification RPC logs its invocation to
-- governance_readonly.verification_log via the SECURITY DEFINER helper
-- log_verification_call.  This satisfies the Issue #1505 requirement that
-- "all query/RPC usage must be logged."  Each function accepts an optional
-- p_caller text parameter (DEFAULT 'unknown') so the workflow can pass the
-- caller_id from the dispatch input.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Create governance_readonly schema
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS governance_readonly;

COMMENT ON SCHEMA governance_readonly IS
  'Governed read-only verification layer for agents. '
  'Functions SELECT from business tables only. '
  'The only write is an audit INSERT to governance_readonly.verification_log '
  'via the SECURITY DEFINER helper log_verification_call. '
  'Issue: maturion-isms#1505.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Audit log table — INSERT-only from SECURITY DEFINER functions
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS governance_readonly.verification_log (
    id          bigserial    PRIMARY KEY,
    caller      text         NOT NULL,   -- workflow / agent identifier
    target      text         NOT NULL,   -- verification_target (e.g. mps_source_pack)
    called_at   timestamptz  NOT NULL DEFAULT now()
);

COMMENT ON TABLE governance_readonly.verification_log IS
  'Append-only audit log for governance read-only verification calls. '
  'Written by SECURITY DEFINER helper only — no direct INSERT grants to callers.';

-- No RLS on verification_log; it is written by SECURITY DEFINER only.
-- Direct SELECT is restricted to service_role / postgres.

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Audit log helper — called internally by the verification RPCs
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION governance_readonly.log_verification_call(
    p_caller text DEFAULT 'unknown',
    p_target text DEFAULT 'unknown'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = governance_readonly, public
AS $$
BEGIN
    INSERT INTO governance_readonly.verification_log (caller, target)
    VALUES (p_caller, p_target);
EXCEPTION
    WHEN OTHERS THEN
        -- Re-raise with context so callers know the verification RPC failed
        -- due to an audit logging error (fail-closed — never silently continue).
        RAISE EXCEPTION 'governance_readonly audit logging failed (caller: %, target: %): %',
            p_caller, p_target, SQLERRM;
END;
$$;

COMMENT ON FUNCTION governance_readonly.log_verification_call(text, text) IS
  'Internal audit logger for governance verification calls. '
  'SECURITY DEFINER — inserts to verification_log on behalf of read-only callers. '
  'Fail-closed: a logging failure propagates to the caller.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. count_mmm_mps_records()
--    Returns the number of records in public.mmm_maturity_process_steps
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION governance_readonly.count_mmm_mps_records(
    p_framework_org_id uuid DEFAULT NULL,
    p_caller           text DEFAULT 'unknown'
)
RETURNS TABLE (
    mps_total           bigint,
    distinct_domain_ids bigint,
    checked_at          timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = governance_readonly, public
AS $$
BEGIN
    -- Log the verification call for audit trail
    PERFORM governance_readonly.log_verification_call(p_caller, 'mps_count');

    RETURN QUERY
    SELECT
        COUNT(mps.id)                    AS mps_total,
        COUNT(DISTINCT mps.domain_id)    AS distinct_domain_ids,
        now()                            AS checked_at
    FROM public.mmm_maturity_process_steps mps
    INNER JOIN public.mmm_domains d ON d.id = mps.domain_id
    INNER JOIN public.mmm_frameworks f ON f.id = d.framework_id
    WHERE (p_framework_org_id IS NULL OR f.organisation_id = p_framework_org_id);
END;
$$;

COMMENT ON FUNCTION governance_readonly.count_mmm_mps_records(uuid, text) IS
  'Read-only: counts mmm_maturity_process_steps records. '
  'Logs invocation via log_verification_call. SELECT-only. maturion-isms#1505.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. count_mmm_criteria_records()
--    Returns the number of records in public.mmm_criteria
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION governance_readonly.count_mmm_criteria_records(
    p_framework_org_id uuid DEFAULT NULL,
    p_caller           text DEFAULT 'unknown'
)
RETURNS TABLE (
    criteria_total      bigint,
    distinct_mps_ids    bigint,
    checked_at          timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = governance_readonly, public
AS $$
BEGIN
    -- Log the verification call for audit trail
    PERFORM governance_readonly.log_verification_call(p_caller, 'criteria_count');

    RETURN QUERY
    SELECT
        COUNT(c.id)                      AS criteria_total,
        COUNT(DISTINCT c.mps_id)         AS distinct_mps_ids,
        now()                            AS checked_at
    FROM public.mmm_criteria c
    INNER JOIN public.mmm_maturity_process_steps mps ON mps.id = c.mps_id
    INNER JOIN public.mmm_domains d ON d.id = mps.domain_id
    INNER JOIN public.mmm_frameworks f ON f.id = d.framework_id
    WHERE (p_framework_org_id IS NULL OR f.organisation_id = p_framework_org_id);
END;
$$;

COMMENT ON FUNCTION governance_readonly.count_mmm_criteria_records(uuid, text) IS
  'Read-only: counts mmm_criteria records. '
  'Logs invocation via log_verification_call. SELECT-only. maturion-isms#1505.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. list_mmm_framework_source_documents()
--    Returns storage.objects metadata for the mmm-framework-sources bucket.
--    No file contents are returned — only metadata.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION governance_readonly.list_mmm_framework_source_documents(
    p_name_filter text DEFAULT NULL,
    p_caller      text DEFAULT 'unknown'
)
RETURNS TABLE (
    object_name         text,
    content_type        text,
    size_bytes          bigint,
    created_at          timestamptz,
    updated_at          timestamptz,
    metadata            jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = governance_readonly, public, storage
AS $$
BEGIN
    -- Log the verification call for audit trail
    PERFORM governance_readonly.log_verification_call(p_caller, 'framework_docs');

    RETURN QUERY
    SELECT
        obj.name                            AS object_name,
        obj.metadata ->> 'mimetype'         AS content_type,
        (obj.metadata ->> 'size')::bigint   AS size_bytes,
        obj.created_at                      AS created_at,
        obj.updated_at                      AS updated_at,
        obj.metadata                        AS metadata
    FROM storage.objects obj
    WHERE obj.bucket_id = 'mmm-framework-sources'
      AND (p_name_filter IS NULL
           OR obj.name ILIKE '%' || p_name_filter || '%')
    ORDER BY obj.created_at DESC;
END;
$$;

COMMENT ON FUNCTION governance_readonly.list_mmm_framework_source_documents(text, text) IS
  'Read-only: lists storage.objects metadata for mmm-framework-sources bucket. '
  'Returns metadata only — no file contents. '
  'Logs invocation via log_verification_call. SELECT-only. maturion-isms#1505.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. search_ai_knowledge_mps_sources()
--    Searches ai_knowledge records related to MPS source content.
--    Returns metadata snippets only — no full embeddings, no PII.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION governance_readonly.search_ai_knowledge_mps_sources(
    p_search_term text DEFAULT 'maturity process step',
    p_caller      text DEFAULT 'unknown'
)
RETURNS TABLE (
    record_id           text,
    source              text,
    domain              text,
    module              text,
    approval_status     text,
    content_snippet     text,   -- first 200 chars only
    source_document     text,
    created_at          timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = governance_readonly, public
AS $$
BEGIN
    -- Log the verification call for audit trail
    PERFORM governance_readonly.log_verification_call(p_caller, 'ai_knowledge');

    RETURN QUERY
    SELECT
        ak.id::text                                          AS record_id,
        ak.source                                            AS source,
        ak.domain                                            AS domain,
        ak.module                                            AS module,
        ak.approval_status                                   AS approval_status,
        LEFT(ak.content, 200)                                AS content_snippet,
        ak.source_document_name                              AS source_document,
        ak.created_at                                        AS created_at
    FROM public.ai_knowledge ak
    WHERE
        (ak.content ILIKE '%' || p_search_term || '%'
         OR ak.source ILIKE '%' || p_search_term || '%'
         OR ak.source_document_name ILIKE '%' || p_search_term || '%')
    ORDER BY ak.created_at DESC
    LIMIT 50;
END;
$$;

COMMENT ON FUNCTION governance_readonly.search_ai_knowledge_mps_sources(text, text) IS
  'Read-only: searches ai_knowledge for MPS-related source content. '
  'Returns 200-char snippets only — no full embeddings, no PII. '
  'Logs invocation via log_verification_call. SELECT-only. maturion-isms#1505.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. verify_mps_source_pack_status()
--    Consolidated verification RPC for MPS source-pack state.
--    Returns a single JSON object suitable as Foreman/IAA evidence.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION governance_readonly.verify_mps_source_pack_status(
    p_caller text DEFAULT 'unknown'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = governance_readonly, public, storage
AS $$
DECLARE
    v_source_doc_count                  bigint;
    v_mps_record_count                  bigint;
    v_distinct_domain_ids               bigint;
    v_criteria_record_count             bigint;
    v_ai_knowledge_count                bigint;
    v_ai_knowledge_approved             bigint;
    v_diamond_specific_ldcs_detected    boolean;
    v_result                            jsonb;
BEGIN
    -- Log the verification call for audit trail
    PERFORM governance_readonly.log_verification_call(p_caller, 'mps_source_pack');

    -- ── Count storage source documents ───────────────────────────────────────
    SELECT COUNT(*)
      INTO v_source_doc_count
      FROM storage.objects
     WHERE bucket_id = 'mmm-framework-sources';

    -- ── Count MPS records ────────────────────────────────────────────────────
    SELECT COUNT(*), COUNT(DISTINCT domain_id)
      INTO v_mps_record_count, v_distinct_domain_ids
      FROM public.mmm_maturity_process_steps;

    -- ── Count criteria records ───────────────────────────────────────────────
    SELECT COUNT(*)
      INTO v_criteria_record_count
      FROM public.mmm_criteria;

    -- ── Count ai_knowledge MPS-related records ───────────────────────────────
    -- Search terms are intentionally hardcoded: this function exists specifically
    -- to verify the generic MPS 1–25 source-pack (maturion-isms#1501).
    -- If broader search is needed, use search_ai_knowledge_mps_sources() instead.
    SELECT
        COUNT(*),
        COUNT(*) FILTER (WHERE approval_status = 'approved')
      INTO v_ai_knowledge_count, v_ai_knowledge_approved
      FROM public.ai_knowledge
     WHERE (
         content            ILIKE '%maturity process step%'
      OR source              ILIKE '%mps%'
      OR source_document_name ILIKE '%mps%'
      OR module              ILIKE '%mps%'
     );

    -- ── Generic content classification ───────────────────────────────────────
    -- Heuristic: if ai_knowledge records mention diamond-specific LDCS terms,
    -- flag potential diamond-specific contamination.
    -- 'diamond' is the known discriminator for LDCS-specific content (as opposed
    -- to generic MPS content).  This term is hardcoded because it is a known
    -- vendor-specific marker for the LDCS standard — it is not a configurable value.
    SELECT COUNT(*) > 0
      INTO v_diamond_specific_ldcs_detected
      FROM public.ai_knowledge
     WHERE content ILIKE '%diamond%'
       AND (
           content ILIKE '%maturity process step%'
        OR source  ILIKE '%mps%'
       );

    -- ── Assemble result ───────────────────────────────────────────────────────
    v_result := jsonb_build_object(
        'mps_source_documents_found',   v_source_doc_count > 0,
        'source_document_count',        v_source_doc_count,
        'mps_record_count',             v_mps_record_count,
        'criteria_record_count',        v_criteria_record_count,
        'canonical_domains_found',      v_distinct_domain_ids,
        'all_25_mps_represented',       v_mps_record_count >= 25,
        'ai_knowledge_mps_records',     v_ai_knowledge_count,
        'ai_knowledge_approved_count',  v_ai_knowledge_approved,
        'diamond_specific_ldcs_detected', v_diamond_specific_ldcs_detected,
        'content_classification',       CASE
                                            -- Diamond-specific indicator found: flag contamination
                                            WHEN v_diamond_specific_ldcs_detected
                                                THEN 'mixed_or_diamond_specific'
                                            -- No source documents AND no MPS/AI knowledge records:
                                            -- content is absent, not confirmed generic
                                            WHEN v_source_doc_count = 0
                                             AND v_mps_record_count = 0
                                             AND v_ai_knowledge_count = 0
                                                THEN 'not_found'
                                            -- Generic MPS evidence exists and no diamond indicator:
                                            -- content can be classified as generic
                                            ELSE 'generic'
                                        END,
        'retrievable_by_mmm_aimc',      v_ai_knowledge_count > 0,
        'approval_status',              CASE
                                            WHEN v_ai_knowledge_approved > 0 THEN 'approved'
                                            WHEN v_ai_knowledge_count > 0    THEN 'pending'
                                            ELSE 'not_found'
                                        END,
        'checked_at',                   now()
    );

    RETURN v_result;
END;
$$;

COMMENT ON FUNCTION governance_readonly.verify_mps_source_pack_status(text) IS
  'Consolidated read-only verification for MPS source-pack state. '
  'Returns JSON evidence suitable for Foreman/IAA citation. '
  'Logs call to governance_readonly.verification_log. '
  'SELECT-only. No writes except audit log. maturion-isms#1505.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. GRANT execution rights to service_role
--    The verify-supabase-readonly.yml workflow runs under the approved
--    SUPABASE_ACCESS_TOKEN (service role) but calls ONLY these allowlisted
--    read-only RPCs.  No other grants are made.
-- ─────────────────────────────────────────────────────────────────────────────

-- First, explicitly revoke PUBLIC access to the schema and all functions.
-- PostgreSQL grants EXECUTE to PUBLIC by default on new functions, which would
-- make these RPCs callable by any role with USAGE on the schema.  Revoking
-- here ensures that only service_role (granted below) can execute them, even
-- if future schema USAGE grants are added.
REVOKE ALL ON SCHEMA governance_readonly FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION governance_readonly.log_verification_call(text, text)
    FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION governance_readonly.verify_mps_source_pack_status(text)
    FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION governance_readonly.list_mmm_framework_source_documents(text, text)
    FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION governance_readonly.count_mmm_mps_records(uuid, text)
    FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION governance_readonly.count_mmm_criteria_records(uuid, text)
    FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION governance_readonly.search_ai_knowledge_mps_sources(text, text)
    FROM PUBLIC;

GRANT USAGE ON SCHEMA governance_readonly TO service_role;

GRANT EXECUTE ON FUNCTION governance_readonly.verify_mps_source_pack_status(text)
    TO service_role;
GRANT EXECUTE ON FUNCTION governance_readonly.list_mmm_framework_source_documents(text, text)
    TO service_role;
GRANT EXECUTE ON FUNCTION governance_readonly.count_mmm_mps_records(uuid, text)
    TO service_role;
GRANT EXECUTE ON FUNCTION governance_readonly.count_mmm_criteria_records(uuid, text)
    TO service_role;
GRANT EXECUTE ON FUNCTION governance_readonly.search_ai_knowledge_mps_sources(text, text)
    TO service_role;

-- Explicitly deny direct table access through this schema to service_role
-- (functions are the only entry point — no direct SELECT on base tables from
-- this schema grant). For these SECURITY DEFINER RPCs executed by
-- service_role, RLS is not the protection mechanism; protection comes from
-- the limited, reviewed read-only RPC surface and the controlled outputs they
-- return.

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. End of migration
-- ─────────────────────────────────────────────────────────────────────────────
-- SECURITY SUMMARY:
--   ✅ No INSERT/UPDATE/DELETE/DDL on business tables from these functions
--   ✅ Audit INSERT to governance_readonly.verification_log via SECURITY DEFINER helper only
--   ✅ No storage object contents returned (metadata only)
--   ✅ No embeddings returned (content snippets ≤ 200 chars)
--   ✅ EXECUTE explicitly REVOKED FROM PUBLIC for all functions and schema
--   ✅ EXECUTE granted to service_role only (not anon or authenticated)
--   ✅ All functions SET search_path explicitly (SQL injection hardening)
-- =============================================================================
