-- Migration: 20260514000001_mmm_onboarding_context
--
-- Issue: maturion-isms#13 — Harvest legacy MaturitySetup into MMM Get To Know You wizard
-- Date:  2026-05-14
--
-- Adds onboarding context storage to mmm_organisations:
--   context            JSONB   — stores all wizard-collected fields for AI use
--   onboarding_complete BOOLEAN — gate flag for /framework-origin access
--
-- Backwards compatible: existing rows get context=NULL, onboarding_complete=false.

ALTER TABLE public.mmm_organisations
  ADD COLUMN IF NOT EXISTS context            jsonb,
  ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.mmm_organisations.context IS
  'Onboarding wizard context: fullName, title, bio, branding, risk profile, etc. (maturion-isms#13)';

COMMENT ON COLUMN public.mmm_organisations.onboarding_complete IS
  'Set to true when the Get To Know You wizard is successfully submitted. Gates /framework-origin access. (maturion-isms#13)';
