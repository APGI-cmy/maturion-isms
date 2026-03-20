-- 009_ai_knowledge_approval_status_fix.sql
-- Wave: DCKIS-IMPL-002
-- Fix approval_status CHECK constraint: replace 'retired' with 'rejected'
-- Aligns DB constraint with TypeScript type and DCKIS alignment plan

BEGIN;

-- Drop the old constraint (allow fallback if it doesn't exist)
ALTER TABLE ai_knowledge
  DROP CONSTRAINT IF EXISTS ai_knowledge_approval_status_check;

-- Add the correct constraint matching the alignment plan and TypeScript types
ALTER TABLE ai_knowledge
  ADD CONSTRAINT ai_knowledge_approval_status_check
  CHECK (approval_status IN ('pending', 'approved', 'rejected'));

COMMIT;
