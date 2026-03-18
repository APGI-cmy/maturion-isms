-- Migration: 20260318000001_fix_parse_write_back_atomic_status.sql
-- Wave: Wave 20 — Atomic Write-Back Wire-Up (T-W20-001)
-- Issue: maturion-isms#1143
-- Branch: copilot/implement-wire-parse-write-back-rpc
--
-- Purpose:
--   Two corrections to `public.parse_write_back_atomic` (created in 20260317000003):
--
--   Fix 1 — Status value:
--     The original function stamped the document with status 'processed', but
--     that value is not in the CHECK constraint
--     (`pending_parse | processing | pending_review | parse_failed`).
--     Attempting to write that value raises a constraint-violation error and rolls back
--     the entire transaction, making the RPC unusable.
--     Correction: use `pending_review` (matching the pre-existing Edge Function behaviour).
--
--   Fix 2 — Service-role caller support:
--     The original ownership check joined `profiles` on `p.id = auth.uid()`.
--     When the Edge Function calls the RPC using the Supabase service-role key,
--     `auth.uid()` returns NULL (no user JWT is present), causing the join to match
--     zero rows and the function to raise `insufficient_privilege`.
--     Correction: when `auth.uid()` IS NULL, skip the user-ownership check and perform
--     a direct lookup (document → audit → organisation_id).  The service-role key is
--     already a trusted server-side secret; an extra user-level ownership check adds no
--     security value for server-side callers.
--
--   Fix 3 — EXECUTE grant:
--     The original migration revoked from PUBLIC and granted only to `authenticated`.
--     The Edge Function connects with the `service_role` Postgres role, which is not
--     covered by the `authenticated` grant.  This migration adds the missing grant so
--     the Edge Function can invoke the function without a permission error.
--
-- Idempotency: CREATE OR REPLACE FUNCTION is fully idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

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

  -- Ownership / resolution
  v_audit_id         UUID;
  v_organisation_id  UUID;
BEGIN
  -- ── Step 0: Resolve document ownership ────────────────────────────────────
  -- Two paths:
  --   a) Authenticated caller  — auth.uid() IS NOT NULL: enforce user-ownership
  --      join to prevent a malicious user from writing to another org's document.
  --   b) Service-role caller   — auth.uid() IS NULL: server-side Edge Function with
  --      the service-role key; skip user join, look up document directly.
  IF auth.uid() IS NOT NULL THEN
    -- Authenticated user path: validate the caller owns the document's organisation
    SELECT cd.audit_id, a.organisation_id
      INTO v_audit_id, v_organisation_id
      FROM public.criteria_documents cd
      JOIN public.audits a ON a.id = cd.audit_id
      JOIN public.profiles p ON p.organisation_id = a.organisation_id
     WHERE cd.id = p_document_id
       AND p.id  = auth.uid()
     LIMIT 1;

    IF v_audit_id IS NULL THEN
      RAISE EXCEPTION
        'parse_write_back_atomic: document % not found or caller lacks access',
        p_document_id
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  ELSE
    -- Service-role path: direct lookup — no user-ownership check needed
    SELECT cd.audit_id, a.organisation_id
      INTO v_audit_id, v_organisation_id
      FROM public.criteria_documents cd
      JOIN public.audits a ON a.id = cd.audit_id
     WHERE cd.id = p_document_id
     LIMIT 1;

    IF v_audit_id IS NULL THEN
      RAISE EXCEPTION
        'parse_write_back_atomic: document % not found',
        p_document_id
        USING ERRCODE = 'no_data_found';
    END IF;
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
  -- name (required). Optional: title, description, intent_statement, source_anchor,
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
      guidance,
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
      v_crit->>'guidance',
      v_crit->>'source_anchor'
    )
    ON CONFLICT DO NOTHING;     -- Idempotent: skip if same criteria already exists

    IF FOUND THEN
      v_criteria_inserted := v_criteria_inserted + 1;
    END IF;
  END LOOP;

  -- ── Step 4: Stamp the document as pending_review ──────────────────────────
  -- Fix (Wave 20): original used 'processed' which is not in the CHECK constraint.
  -- Use 'pending_review' to match the allowed values and the pre-existing Edge
  -- Function behaviour.
  UPDATE public.criteria_documents
     SET status     = 'pending_review',
         updated_at = now()
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
  'Wave 19/20 (GAP-PARSE-005): Atomic transactional write-back for the MAT criteria '
  'parsing pipeline. Inserts domains, mini_performance_standards, and criteria in a '
  'single PL/pgSQL transaction. Any failure rolls back all prior inserts, preventing '
  'partial data from entering the database. Called by the invoke-ai-parse-criteria '
  'Edge Function via supabase.rpc(). SECURITY DEFINER — runs as function owner; '
  'caller ownership validated (authenticated users) or bypassed (service_role).';

-- ── Grant execute to authenticated users and service_role ─────────────────────
-- Authenticated users are validated internally via auth.uid() (Step 0a).
-- Service-role (Edge Function server-side) is trusted and validated via direct
-- document lookup (Step 0b).
REVOKE EXECUTE ON FUNCTION public.parse_write_back_atomic(UUID, JSONB, JSONB, JSONB)
  FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.parse_write_back_atomic(UUID, JSONB, JSONB, JSONB)
  TO authenticated;

GRANT EXECUTE ON FUNCTION public.parse_write_back_atomic(UUID, JSONB, JSONB, JSONB)
  TO service_role;
