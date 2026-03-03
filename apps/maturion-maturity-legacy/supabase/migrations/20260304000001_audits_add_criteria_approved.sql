-- Wave 14 Addendum A: Add missing columns to audits table
-- Incidents: INC-W14-AUDITS-COL-001 (criteria_approved)
-- Architecture: modules/mat/02-architecture/data-architecture.md §1.1.3
-- Idempotent: ADD COLUMN IF NOT EXISTS and DO $$ guards prevent errors on re-run

-- Add organisation_name column (required by useCreateAudit in useAudits.ts)
ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS organisation_name TEXT;

-- Add facility_location column (required by useCreateAudit in useAudits.ts)
ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS facility_location TEXT;

-- Add audit_lead_id column (architecture §1.1.3 and useAudits.ts)
ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS audit_lead_id UUID REFERENCES auth.users(id);

-- Add criteria_approved column (INC-W14-AUDITS-COL-001 — P0 BLOCKER)
-- This is the primary cause of "Could not find the 'criteria_approved' column" runtime error.
ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS criteria_approved BOOLEAN NOT NULL DEFAULT false;

-- Add criteria_approved_at and criteria_approved_by (architecture §1.1.3)
ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS criteria_approved_at TIMESTAMPTZ;
ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS criteria_approved_by UUID REFERENCES auth.users(id);

-- Fix status CHECK constraint to include frontend-used values:
-- useAudits.ts status enum: 'not_started' | 'in_progress' | 'under_review' | 'completed' | 'archived'
-- The original constraint only allowed 'draft','active','completed','archived'.
-- Drop the old constraint (idempotent: only drops if it exists) and add the corrected one.
DO $$ BEGIN
  ALTER TABLE public.audits DROP CONSTRAINT IF EXISTS audits_status_check;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'audits_status_check'
      AND conrelid = 'public.audits'::regclass
  ) THEN
    ALTER TABLE public.audits
      ADD CONSTRAINT audits_status_check
      CHECK (status IN ('not_started', 'in_progress', 'under_review', 'completed', 'archived', 'draft', 'active'));
  END IF;
END $$;
