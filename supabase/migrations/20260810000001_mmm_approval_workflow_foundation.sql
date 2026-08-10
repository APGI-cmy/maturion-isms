-- =============================================================================
-- MMM Approval Workflow Foundation Schema
-- Issue: #2004 (mmm-approval-foundation-runtime-build-to-green)
-- Wave: approval-workflow-foundation-runtime
-- =============================================================================

-- =============================================================================
-- 1. ENUM TYPES
-- =============================================================================

CREATE TYPE mmm_approval_round_status AS ENUM (
  'draft',
  'invited',
  'in_review',
  'changes_requested',
  'resubmitted',
  'approved_by_some',
  'approved_by_all',
  'cancelled',
  'superseded'
);

CREATE TYPE mmm_approval_approver_status AS ENUM (
  'invited',
  'invite_accepted',
  'in_review',
  'changes_submitted',
  'approved',
  'declined',
  'replaced',
  'expired'
);

CREATE TYPE mmm_approval_decision AS ENUM (
  'approved',
  'changes_requested',
  'declined'
);

CREATE TYPE mmm_approval_invitation_status AS ENUM (
  'pending_send',
  'sent',
  'accepted',
  'expired',
  'revoked',
  'failed'
);

CREATE TYPE mmm_approval_object_type AS ENUM (
  'domain',
  'mps',
  'intent_statement',
  'criterion',
  'maturity_descriptor'
);

CREATE TYPE mmm_approval_proposed_change_status AS ENUM (
  'proposed',
  'accepted',
  'edited_by_level_1',
  'rejected',
  'applied',
  'superseded'
);

CREATE TYPE mmm_approval_comment_visibility AS ENUM (
  'round_participants',
  'level_1_only',
  'level_2_and_level_1',
  'level_3_level_2_and_level_1'
);

CREATE TYPE mmm_approval_lock_state AS ENUM (
  'unlocked',
  'locked_by_level_2',
  'temporarily_unlocked_for_change_request',
  'locked_by_final_approval'
);

CREATE TYPE mmm_approval_notification_type AS ENUM (
  'level_2_invitation',
  'level_2_changes_submitted',
  'level_1_response_submitted',
  'level_2_all_approved',
  'level_3_invitation',
  'level_3_changes_submitted',
  'final_approval_complete'
);

CREATE TYPE mmm_approval_notification_status AS ENUM (
  'queued',
  'sent',
  'failed',
  'cancelled'
);

CREATE TYPE mmm_ai_learning_decision AS ENUM (
  'accepted',
  'rejected',
  'edited',
  'superseded',
  'final_signed_off'
);

-- =============================================================================
-- 2. APPROVAL ROUNDS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.mmm_approval_rounds (
  id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id                 uuid NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
  framework_id                    uuid NOT NULL REFERENCES public.mmm_frameworks(id) ON DELETE CASCADE,
  domain_id                       uuid,
  approval_level                  text NOT NULL CHECK (approval_level IN ('level_2', 'level_3')),
  round_number                    integer NOT NULL DEFAULT 1,
  status                          mmm_approval_round_status NOT NULL DEFAULT 'draft',
  submitted_by_user_id            uuid NOT NULL,
  submitted_at                    timestamptz NOT NULL DEFAULT now(),
  resubmitted_from_round_id       uuid,
  all_approvers_required          boolean NOT NULL DEFAULT true,
  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mmm_approval_rounds_org_framework
  ON public.mmm_approval_rounds (organisation_id, framework_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mmm_approval_rounds_org_domain
  ON public.mmm_approval_rounds (organisation_id, domain_id, status);

-- =============================================================================
-- 3. APPROVAL APPROVERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.mmm_approval_approvers (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_round_id       uuid NOT NULL REFERENCES public.mmm_approval_rounds(id) ON DELETE CASCADE,
  organisation_id         uuid NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
  user_id                 uuid,
  email                   text NOT NULL,
  full_name               text NOT NULL,
  designation             text,
  approval_level          text NOT NULL CHECK (approval_level IN ('level_2', 'level_3')),
  status                  mmm_approval_approver_status NOT NULL DEFAULT 'invited',
  invited_by_user_id      uuid NOT NULL,
  invited_at              timestamptz NOT NULL DEFAULT now(),
  accepted_invite_at      timestamptz,
  decision                mmm_approval_decision,
  decision_at             timestamptz,
  decision_comment        text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mmm_approval_approvers_round_email
  ON public.mmm_approval_approvers (approval_round_id, email);
CREATE INDEX IF NOT EXISTS idx_mmm_approval_approvers_org_status
  ON public.mmm_approval_approvers (organisation_id, status);

-- =============================================================================
-- 4. APPROVAL INVITATIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.mmm_approval_invitations (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_round_id       uuid NOT NULL REFERENCES public.mmm_approval_rounds(id) ON DELETE CASCADE,
  approver_id             uuid NOT NULL REFERENCES public.mmm_approval_approvers(id) ON DELETE CASCADE,
  email                   text NOT NULL,
  token_hash              text NOT NULL,
  status                  mmm_approval_invitation_status NOT NULL DEFAULT 'pending_send',
  expires_at              timestamptz NOT NULL,
  sent_at                 timestamptz,
  accepted_at             timestamptz,
  revoked_at              timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mmm_approval_invitations_approver_round
  ON public.mmm_approval_invitations (approver_id, approval_round_id);

-- =============================================================================
-- 5. PROPOSED CHANGES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.mmm_approval_proposed_changes (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_round_id       uuid NOT NULL REFERENCES public.mmm_approval_rounds(id) ON DELETE CASCADE,
  approver_id             uuid NOT NULL REFERENCES public.mmm_approval_approvers(id) ON DELETE CASCADE,
  organisation_id         uuid NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
  framework_id            uuid NOT NULL REFERENCES public.mmm_frameworks(id) ON DELETE CASCADE,
  domain_id               uuid,
  mps_id                  uuid,
  criterion_id            uuid,
  descriptor_id           uuid,
  object_type             mmm_approval_object_type NOT NULL,
  object_id               uuid NOT NULL,
  field_name              text NOT NULL,
  display_reference       text NOT NULL,
  original_value          text NOT NULL,
  proposed_value          text NOT NULL,
  comment                 text,
  status                  mmm_approval_proposed_change_status NOT NULL DEFAULT 'proposed',
  level_1_response        text,
  final_value             text,
  applied_by_user_id      uuid,
  applied_at              timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mmm_approval_proposed_changes_round
  ON public.mmm_approval_proposed_changes (approval_round_id, status);
CREATE INDEX IF NOT EXISTS idx_mmm_approval_proposed_changes_object
  ON public.mmm_approval_proposed_changes (framework_id, object_type, object_id);

-- =============================================================================
-- 6. COMMENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.mmm_approval_comments (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_round_id       uuid NOT NULL REFERENCES public.mmm_approval_rounds(id) ON DELETE CASCADE,
  proposed_change_id      uuid REFERENCES public.mmm_approval_proposed_changes(id) ON DELETE CASCADE,
  parent_comment_id       uuid REFERENCES public.mmm_approval_comments(id) ON DELETE CASCADE,
  author_user_id          uuid NOT NULL,
  author_role             text NOT NULL CHECK (author_role IN ('level_1', 'level_2', 'level_3', 'system')),
  body                    text NOT NULL,
  visibility              mmm_approval_comment_visibility NOT NULL,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mmm_approval_comments_round
  ON public.mmm_approval_comments (approval_round_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mmm_approval_comments_proposed_change
  ON public.mmm_approval_comments (proposed_change_id);

-- =============================================================================
-- 7. LOCKS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.mmm_approval_locks (
  id                                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id                   uuid NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
  framework_id                      uuid NOT NULL REFERENCES public.mmm_frameworks(id) ON DELETE CASCADE,
  domain_id                         uuid,
  object_type                       mmm_approval_object_type,
  object_id                         uuid,
  lock_state                        mmm_approval_lock_state NOT NULL,
  locked_by_round_id                uuid REFERENCES public.mmm_approval_rounds(id) ON DELETE SET NULL,
  temporarily_unlocked_by_round_id  uuid REFERENCES public.mmm_approval_rounds(id) ON DELETE SET NULL,
  reason                            text NOT NULL,
  created_at                        timestamptz NOT NULL DEFAULT now(),
  updated_at                        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mmm_approval_locks_framework_domain
  ON public.mmm_approval_locks (framework_id, domain_id, lock_state);
CREATE INDEX IF NOT EXISTS idx_mmm_approval_locks_object
  ON public.mmm_approval_locks (object_type, object_id);

-- =============================================================================
-- 8. AUDIT EVENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.mmm_approval_audit_events (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_round_id       uuid NOT NULL REFERENCES public.mmm_approval_rounds(id) ON DELETE CASCADE,
  organisation_id         uuid NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
  event_type              text NOT NULL,
  actor_id                uuid NOT NULL,
  actor_role              text NOT NULL CHECK (actor_role IN ('level_1', 'level_2', 'level_3', 'system')),
  details                 jsonb,
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mmm_approval_audit_events_round
  ON public.mmm_approval_audit_events (approval_round_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mmm_approval_audit_events_org
  ON public.mmm_approval_audit_events (organisation_id, created_at DESC);

-- =============================================================================
-- 9. NOTIFICATION EVENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.mmm_approval_notification_events (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id         uuid NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
  approval_round_id       uuid NOT NULL REFERENCES public.mmm_approval_rounds(id) ON DELETE CASCADE,
  recipient_user_id       uuid,
  recipient_email         text NOT NULL,
  notification_type       mmm_approval_notification_type NOT NULL,
  payload_json            jsonb NOT NULL,
  idempotency_key         text NOT NULL,
  status                  mmm_approval_notification_status NOT NULL DEFAULT 'queued',
  queued_at               timestamptz NOT NULL DEFAULT now(),
  sent_at                 timestamptz,
  failed_at               timestamptz,
  failure_reason          text,
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mmm_approval_notification_events_round
  ON public.mmm_approval_notification_events (approval_round_id, status);
CREATE INDEX IF NOT EXISTS idx_mmm_approval_notification_events_idempotency
  ON public.mmm_approval_notification_events (idempotency_key);

-- =============================================================================
-- 10. AI LEARNING EVENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.mmm_ai_learning_events (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id         uuid NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
  framework_id            uuid NOT NULL REFERENCES public.mmm_frameworks(id) ON DELETE CASCADE,
  approval_round_id       uuid REFERENCES public.mmm_approval_rounds(id) ON DELETE SET NULL,
  proposed_change_id      uuid REFERENCES public.mmm_approval_proposed_changes(id) ON DELETE SET NULL,
  approval_level          text CHECK (approval_level IN ('level_2', 'level_3')),
  object_type             mmm_approval_object_type NOT NULL,
  object_id               uuid NOT NULL,
  original_value          text,
  proposed_value          text,
  final_value             text,
  decision                mmm_ai_learning_decision NOT NULL,
  reason                  text,
  actor_role              text NOT NULL CHECK (actor_role IN ('level_1', 'level_2', 'level_3', 'system')),
  consent_given           boolean DEFAULT false,
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mmm_ai_learning_events_org_framework
  ON public.mmm_ai_learning_events (organisation_id, framework_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mmm_ai_learning_events_object
  ON public.mmm_ai_learning_events (object_type, object_id);

-- =============================================================================
-- 11. ROW-LEVEL SECURITY POLICIES (RLS)
-- =============================================================================

ALTER TABLE public.mmm_approval_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_approval_approvers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_approval_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_approval_proposed_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_approval_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_approval_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_approval_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_approval_notification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_ai_learning_events ENABLE ROW LEVEL SECURITY;

-- Approval Rounds: User can see rounds in their organisation
DROP POLICY IF EXISTS "mmm_approval_rounds_select_own_org" ON public.mmm_approval_rounds;
CREATE POLICY "mmm_approval_rounds_select_own_org"
  ON public.mmm_approval_rounds
  FOR SELECT
  USING (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_approval_rounds_insert_own_org" ON public.mmm_approval_rounds;
CREATE POLICY "mmm_approval_rounds_insert_own_org"
  ON public.mmm_approval_rounds
  FOR INSERT
  WITH CHECK (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_approval_rounds_update_own_org" ON public.mmm_approval_rounds;
CREATE POLICY "mmm_approval_rounds_update_own_org"
  ON public.mmm_approval_rounds
  FOR UPDATE
  USING (organisation_id = mmm_current_user_org_id())
  WITH CHECK (organisation_id = mmm_current_user_org_id());

-- Approval Approvers: User can see approvers in their organisation
DROP POLICY IF EXISTS "mmm_approval_approvers_select_own_org" ON public.mmm_approval_approvers;
CREATE POLICY "mmm_approval_approvers_select_own_org"
  ON public.mmm_approval_approvers
  FOR SELECT
  USING (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_approval_approvers_insert_own_org" ON public.mmm_approval_approvers;
CREATE POLICY "mmm_approval_approvers_insert_own_org"
  ON public.mmm_approval_approvers
  FOR INSERT
  WITH CHECK (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_approval_approvers_update_own_org" ON public.mmm_approval_approvers;
CREATE POLICY "mmm_approval_approvers_update_own_org"
  ON public.mmm_approval_approvers
  FOR UPDATE
  USING (organisation_id = mmm_current_user_org_id())
  WITH CHECK (organisation_id = mmm_current_user_org_id());

-- Approval Invitations: User can see invitations in their organisation
DROP POLICY IF EXISTS "mmm_approval_invitations_select_own_org" ON public.mmm_approval_invitations;
CREATE POLICY "mmm_approval_invitations_select_own_org"
  ON public.mmm_approval_invitations
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.mmm_approval_approvers a
    WHERE a.id = approval_invitations.approver_id
    AND a.organisation_id = mmm_current_user_org_id()
  ));

DROP POLICY IF EXISTS "mmm_approval_invitations_insert_own_org" ON public.mmm_approval_invitations;
CREATE POLICY "mmm_approval_invitations_insert_own_org"
  ON public.mmm_approval_invitations
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.mmm_approval_approvers a
    WHERE a.id = approval_invitations.approver_id
    AND a.organisation_id = mmm_current_user_org_id()
  ));

-- Proposed Changes: User can see changes in their organisation
DROP POLICY IF EXISTS "mmm_approval_proposed_changes_select_own_org" ON public.mmm_approval_proposed_changes;
CREATE POLICY "mmm_approval_proposed_changes_select_own_org"
  ON public.mmm_approval_proposed_changes
  FOR SELECT
  USING (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_approval_proposed_changes_insert_own_org" ON public.mmm_approval_proposed_changes;
CREATE POLICY "mmm_approval_proposed_changes_insert_own_org"
  ON public.mmm_approval_proposed_changes
  FOR INSERT
  WITH CHECK (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_approval_proposed_changes_update_own_org" ON public.mmm_approval_proposed_changes;
CREATE POLICY "mmm_approval_proposed_changes_update_own_org"
  ON public.mmm_approval_proposed_changes
  FOR UPDATE
  USING (organisation_id = mmm_current_user_org_id())
  WITH CHECK (organisation_id = mmm_current_user_org_id());

-- Comments: User can see comments in their organisation
DROP POLICY IF EXISTS "mmm_approval_comments_select_own_org" ON public.mmm_approval_comments;
CREATE POLICY "mmm_approval_comments_select_own_org"
  ON public.mmm_approval_comments
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.mmm_approval_rounds r
    WHERE r.id = approval_comments.approval_round_id
    AND r.organisation_id = mmm_current_user_org_id()
  ));

DROP POLICY IF EXISTS "mmm_approval_comments_insert_own_org" ON public.mmm_approval_comments;
CREATE POLICY "mmm_approval_comments_insert_own_org"
  ON public.mmm_approval_comments
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.mmm_approval_rounds r
    WHERE r.id = approval_comments.approval_round_id
    AND r.organisation_id = mmm_current_user_org_id()
  ));

-- Locks: User can see locks in their organisation
DROP POLICY IF EXISTS "mmm_approval_locks_select_own_org" ON public.mmm_approval_locks;
CREATE POLICY "mmm_approval_locks_select_own_org"
  ON public.mmm_approval_locks
  FOR SELECT
  USING (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_approval_locks_insert_own_org" ON public.mmm_approval_locks;
CREATE POLICY "mmm_approval_locks_insert_own_org"
  ON public.mmm_approval_locks
  FOR INSERT
  WITH CHECK (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_approval_locks_update_own_org" ON public.mmm_approval_locks;
CREATE POLICY "mmm_approval_locks_update_own_org"
  ON public.mmm_approval_locks
  FOR UPDATE
  USING (organisation_id = mmm_current_user_org_id())
  WITH CHECK (organisation_id = mmm_current_user_org_id());

-- Audit Events: User can see audit events in their organisation
DROP POLICY IF EXISTS "mmm_approval_audit_events_select_own_org" ON public.mmm_approval_audit_events;
CREATE POLICY "mmm_approval_audit_events_select_own_org"
  ON public.mmm_approval_audit_events
  FOR SELECT
  USING (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_approval_audit_events_insert_own_org" ON public.mmm_approval_audit_events;
CREATE POLICY "mmm_approval_audit_events_insert_own_org"
  ON public.mmm_approval_audit_events
  FOR INSERT
  WITH CHECK (organisation_id = mmm_current_user_org_id());

-- Notification Events: User can see notification events in their organisation
DROP POLICY IF EXISTS "mmm_approval_notification_events_select_own_org" ON public.mmm_approval_notification_events;
CREATE POLICY "mmm_approval_notification_events_select_own_org"
  ON public.mmm_approval_notification_events
  FOR SELECT
  USING (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_approval_notification_events_insert_own_org" ON public.mmm_approval_notification_events;
CREATE POLICY "mmm_approval_notification_events_insert_own_org"
  ON public.mmm_approval_notification_events
  FOR INSERT
  WITH CHECK (organisation_id = mmm_current_user_org_id());

-- AI Learning Events: User can see learning events in their organisation
DROP POLICY IF EXISTS "mmm_ai_learning_events_select_own_org" ON public.mmm_ai_learning_events;
CREATE POLICY "mmm_ai_learning_events_select_own_org"
  ON public.mmm_ai_learning_events
  FOR SELECT
  USING (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_ai_learning_events_insert_own_org" ON public.mmm_ai_learning_events;
CREATE POLICY "mmm_ai_learning_events_insert_own_org"
  ON public.mmm_ai_learning_events
  FOR INSERT
  WITH CHECK (organisation_id = mmm_current_user_org_id());
