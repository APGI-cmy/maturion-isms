-- INC-W13-AUDIT-SCHEMA-001: Add missing audit_period_start and audit_period_end columns
-- Architecture reference: modules/mat/02-architecture/data-architecture.md §1.1.3
-- Idempotent: safe to re-run — IF NOT EXISTS guards prevent errors if columns already exist

ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS audit_period_start DATE;
ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS audit_period_end DATE;
