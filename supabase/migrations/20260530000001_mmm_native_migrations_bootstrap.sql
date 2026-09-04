-- Migration: 20260530000001_mmm_native_migrations_bootstrap
-- Purpose: Bootstrap the MMM-native migration ledger before security hardening references it.
CREATE TABLE IF NOT EXISTS public.mmm_native_migrations (
  name text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mmm_native_migrations ENABLE ROW LEVEL SECURITY;
