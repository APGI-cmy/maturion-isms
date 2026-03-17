-- Migration: 20260317000003_parse_write_back_atomic_rpc.sql
-- Wave: Wave 19 — MAT Criteria Parsing Holistic Repair
-- Task IDs: T-W19B-003
-- Issue: maturion-isms#1135 (wave-gov-mat-criteria-repair-1135)
-- Branch: copilot/wave-19-holistic-mat-criteria-repair
--
-- Purpose:
--   GAP-PARSE-005 — DB write-back is not transactional. The Edge Function
--   performs sequential supabase-js calls to insert domains, then MPS, then
--   criteria. If the criteria insert fails, the domain and MPS rows remain in
--   the database as orphaned partial data. This leaves the database in an
--   inconsistent state with no mechanism to detect or recover from the partial
--   write.
--
--   This migration creates a SECURITY DEFINER Postgres function
--   `parse_write_back_atomic` that wraps all three insert operations in a
--   single PL/pgSQL transaction block. If any step fails, PostgreSQL
--   automatically rolls back all prior inserts in the same call.
--
--   The Edge Function (api-builder batch C, T-W19C-003) will be updated to
--   call this RPC via supabase.rpc('parse_write_back_atomic', {...}) instead
--   of making three independent supabase-js calls.
--
-- Function signature:
--   parse_write_back_atomic(
--     p_document_id UUID,       -- criteria_documents.id to stamp as processed
--     p_domains     JSONB,      -- array of domain objects to upsert
--     p_mps         JSONB,      -- array of MPS objects to upsert
--     p_criteria    JSONB       -- array of criteria objects to insert
--   ) RETURNS JSONB             -- { domains_inserted, mps_inserted, criteria_inserted }
--
-- Security model:
--   SECURITY DEFINER — the function runs with the privileges of the function
--   owner (typically the postgres/service_role user). This means RLS policies
--   on the underlying tables are bypassed inside the function body, which is
--   intentional: the function enforces its own isolation via the p_document_id
--   ownership check (see Step 0). GRANT EXECUTE is restricted to authenticated
--   users only.
--
-- A-032 DDL self-check:
--   Function created: public.parse_write_back_atomic
--   Assertion test: T-W19-008
--
-- Idempotency: CREATE OR REPLACE FUNCTION is idempotent by definition.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Create the atomic write-back RPC ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.parse_write_back_atomic(
  p_document_id  UUID,
  p_domains      JSONB,
  p_mps          JSONB,
  p_criteria     JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_domains_inserted  INTEGER := 0;
  v_mps_inserted      INTEGER := 0;
  v_criteria_inserted INTEGER := 0;

  v_domain      JSONB;
  v_mps_row     JSONB;
  v_crit        JSONB;
  v_domain_id   UUID;
  v_mps_id      UUID;

  -- Ownership check
  v_audit_id         UUID;
  v_organisation_id  UUID;
BEGIN
  -- ── Step 0: Validate caller owns the document ─────────────────────────────
  -- Retrieve audit_id and organisation_id from the criteria_documents row.
  -- This prevents a malicious authenticated user from calling this RPC against
  -- a document_id that does not belong to their organisation.
  SELECT cd.audit_id, a.organisation_id
    INTO v_audit_id, v_organisation_id
    FROM public.criteria_documents cd
    JOIN public.audits a ON a.id = cd.audit_id
    JOIN public.profiles p ON p.organisation_id = a.organisation_id
   WHERE cd.id     = p_document_id
     AND p.id      = auth.uid()
   LIMIT 1;

  IF v_audit_id IS NULL THEN
    RAISE EXCEPTION
      'parse_write_back_atomic: document % not found or caller lacks access',
      p_document_id
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  -- ── Step 1: Upsert domains ────────────────────────────────────────────────
  -- Each element in p_domains must have: number, name (required).
  -- Optional: description, sort_order.
  FOR v_domain IN SELECT * FROM jsonb_array_elements(p_domains)
  LOOP
    INSERT INTO public.domains (
      audit_id,
      organisation_id,
      number,
      name,
      description,
      sort_order
    )
    VALUES (
      v_audit_id,
      v_organisation_id,
      (v_domain->>'number')::INTEGER,
      v_domain->>'name',
      v_domain->>'description',
      (v_domain->>'sort_order')::INTEGER
    )
    ON CONFLICT (audit_id, number) DO UPDATE
      SET name        = EXCLUDED.name,
          description = EXCLUDED.description,
          sort_order  = EXCLUDED.sort_order,
          updated_at  = now();

    v_domains_inserted := v_domains_inserted + 1;
  END LOOP;

  -- ── Step 2: Upsert mini_performance_standards ─────────────────────────────
  -- Each element in p_mps must have: domain_number, number, name (required).
  -- Optional: description, intent_statement, guidance.
  FOR v_mps_row IN SELECT * FROM jsonb_array_elements(p_mps)
  LOOP
    -- Resolve domain_id from audit + domain number
    SELECT id INTO v_domain_id
      FROM public.domains
     WHERE audit_id = v_audit_id
       AND number   = (v_mps_row->>'domain_number')::INTEGER
     LIMIT 1;

    IF v_domain_id IS NULL THEN
      RAISE EXCEPTION
        'parse_write_back_atomic: domain number % not found for audit %',
        v_mps_row->>'domain_number', v_audit_id
        USING ERRCODE = 'foreign_key_violation';
    END IF;

    INSERT INTO public.mini_performance_standards (
      domain_id,
      audit_id,
      organisation_id,
      number,
      name,
      description,
      intent_statement,
      guidance
    )
    VALUES (
      v_domain_id,
      v_audit_id,
      v_organisation_id,
      (v_mps_row->>'number')::INTEGER,
      v_mps_row->>'name',
      v_mps_row->>'description',
      v_mps_row->>'intent_statement',
      v_mps_row->>'guidance'
    )
    ON CONFLICT (audit_id, number) DO UPDATE
      SET name              = EXCLUDED.name,
          description       = EXCLUDED.description,
          intent_statement  = EXCLUDED.intent_statement,
          guidance          = EXCLUDED.guidance,
          updated_at        = now();

    v_mps_inserted := v_mps_inserted + 1;
  END LOOP;

  -- ── Step 3: Insert criteria ───────────────────────────────────────────────
  -- Each element in p_criteria must have: mps_number, domain_number, number,
  -- name (required). Optional: description, intent_statement, source_anchor,
  -- guidance.
  -- Note: criteria.number is TEXT (Wave 19 GAP-PARSE-001 fix) to hold LDCS
  -- hierarchical identifiers like "1.4.1".
  FOR v_crit IN SELECT * FROM jsonb_array_elements(p_criteria)
  LOOP
    -- Resolve domain_id
    SELECT id INTO v_domain_id
      FROM public.domains
     WHERE audit_id = v_audit_id
       AND number   = (v_crit->>'domain_number')::INTEGER
     LIMIT 1;

    IF v_domain_id IS NULL THEN
      RAISE EXCEPTION
        'parse_write_back_atomic: domain number % not found for audit %',
        v_crit->>'domain_number', v_audit_id
        USING ERRCODE = 'foreign_key_violation';
    END IF;

    -- Resolve mps_id from audit + mps number
    SELECT id INTO v_mps_id
      FROM public.mini_performance_standards
     WHERE audit_id = v_audit_id
       AND number   = (v_crit->>'mps_number')::INTEGER
     LIMIT 1;

    IF v_mps_id IS NULL THEN
      RAISE EXCEPTION
        'parse_write_back_atomic: MPS number % not found for audit %',
        v_crit->>'mps_number', v_audit_id
        USING ERRCODE = 'foreign_key_violation';
    END IF;

    INSERT INTO public.criteria (
      mps_id,
      domain_id,
      audit_id,
      organisation_id,
      number,
      title,
      description,
      intent_statement,
      source_anchor
    )
    VALUES (
      v_mps_id,
      v_domain_id,
      v_audit_id,
      v_organisation_id,
      v_crit->>'number',          -- TEXT — supports "1.4.1" LDCS format (GAP-PARSE-001)
      v_crit->>'title',
      v_crit->>'description',
      v_crit->>'intent_statement',
      v_crit->>'source_anchor'
    )
    ON CONFLICT DO NOTHING;     -- Idempotent: skip if same criteria already exists

    v_criteria_inserted := v_criteria_inserted + 1;
  END LOOP;

  -- ── Step 4: Stamp the document as processed ───────────────────────────────
  UPDATE public.criteria_documents
     SET processing_status = 'processed',
         updated_at        = now()
   WHERE id = p_document_id;

  -- ── Step 5: Return summary counts ─────────────────────────────────────────
  RETURN jsonb_build_object(
    'domains_inserted',   v_domains_inserted,
    'mps_inserted',       v_mps_inserted,
    'criteria_inserted',  v_criteria_inserted,
    'document_id',        p_document_id
  );

EXCEPTION
  WHEN OTHERS THEN
    -- PL/pgSQL automatically rolls back the entire transaction on RAISE EXCEPTION.
    -- Re-raise so the caller sees the error details.
    RAISE;
END;
$$;

COMMENT ON FUNCTION public.parse_write_back_atomic(UUID, JSONB, JSONB, JSONB) IS
  'Wave 19 (GAP-PARSE-005): Atomic transactional write-back for the MAT criteria '
  'parsing pipeline. Inserts domains, mini_performance_standards, and criteria in a '
  'single PL/pgSQL transaction. Any failure rolls back all prior inserts, preventing '
  'partial data from entering the database. Called by the invoke-ai-parse-criteria '
  'Edge Function via supabase.rpc(). SECURITY DEFINER — runs as function owner; '
  'caller ownership validated against auth.uid() in Step 0.';

-- ── 2. Grant execute to authenticated users ───────────────────────────────────
-- The function validates auth.uid() ownership internally (Step 0), so it is
-- safe to grant execute to the authenticated role. Anon users are intentionally
-- excluded: they cannot have a valid session token or own any documents.
REVOKE EXECUTE ON FUNCTION public.parse_write_back_atomic(UUID, JSONB, JSONB, JSONB)
  FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.parse_write_back_atomic(UUID, JSONB, JSONB, JSONB)
  TO authenticated;
