# MMM QA-to-Red Addendum — Sidebar Context + MPS L1/L2 Approval

## New RED Gates

### T-MMM-S6-188 — Authenticated routes render unified sidebar shell
- RED: protected pages use disconnected top-nav patterns.
- GREEN: one shared shell renders sidebar across protected routes.

### T-MMM-S6-189 — Onboarding completion replaces wizard re-entry with context editor
- RED: user must rerun onboarding wizard to edit context.
- GREEN: Organisation Context page provides editable persisted context.

### T-MMM-S6-190 — DMC exposes legacy migration action and telemetry
- RED: no migration trigger; inventory remains empty with non-actionable errors.
- GREEN: migration invoke action exists; telemetry and failure details are rendered.

### T-MMM-S6-191 — Domain card mini-dashboard includes approval/readiness/maturity state
- RED: domain cards only show structural counts.
- GREEN: cards render criteria status, approval status, readiness status, maturity level.

### T-MMM-S6-192 — MPS L1 action surface and audit-traced lifecycle
- RED: no explicit L1 workflow controls.
- GREEN: MPS UI exposes approve/reopen/reject actions backed by persisted approval ledger.

### T-MMM-S6-193 — Domain L2 review loop with submit/return/resubmit/approve transitions
- RED: no review loop with lock state and comments.
- GREEN: domain approval request loop with tracked comments and state transitions.

### T-MMM-S6-194 — Sidebar width remains compact on desktop
- RED: sidebar consumes excessive horizontal space and constrains work area.
- GREEN: desktop shell keeps a compact auto baseline width with a bounded default fallback.

### T-MMM-S6-195 — Sidebar width is manually adjustable by user
- RED: sidebar has fixed width only, no user-level adjustment.
- GREEN: sidebar exposes drag-resize via cursor handle and persists width preference.

### T-MMM-S6-196 — Framework origin step must not hard-fail on edge invocation
- RED: clicking Continue on `/framework-origin` fails with edge-function non-2xx and blocks user progression.
- GREEN: `/framework-origin` performs mode selection + routing only; first framework init occurs in upload step.

### T-MMM-S6-197 — Organisation Context must remain available during edge-runtime outages
- RED: `/organisation-context` shows hard failure when `mmm-organisation-context` invoke path is unavailable.
- GREEN: page falls back to canonical `mmm_profiles` + `mmm_organisations` read/update path and remains usable.

### T-MMM-S6-198 — DMC inventory must remain available during edge-runtime outages
- RED: `/dmc` inventory fails with edge invoke transport error and shows empty/non-actionable state.
- GREEN: page falls back to canonical `mmm_subject_knowledge_documents` query path and renders inventory/stats.

### T-MMM-S6-199 — MPS AI linkage must use user-scoped endpoint with fallback
- RED: MPS generation depends on admin-only AI route or hard-fails on AI outage.
- GREEN: MPS generation uses `mmm-ai-chat-user` and falls back to legacy MPS pack.

### T-MMM-S6-200 — Intent AI linkage must use user-scoped endpoint with fallback
- RED: intent generation hard-fails when AI call fails.
- GREEN: intent generation uses `mmm-ai-chat-user` and returns deterministic fallback intent draft.

### T-MMM-S6-201 — Criteria AI linkage must use user-scoped endpoint with fallback
- RED: criteria generation hard-fails when AI call fails.
- GREEN: criteria generation uses `mmm-ai-chat-user` and returns deterministic fallback criteria set.

### T-MMM-S6-207 — MPS modal actions must align with Draft→Submit workflow language
- RED: modal exposes ambiguous `Reopen` wording and only `Cancel` action after L1 operations.
- GREEN: modal uses `Edit` language for draft rework and exposes explicit `Submit MPS Set` action for L2 transition.

### T-MMM-S6-208 — MPS edits must trigger user-preference learning capture consent
- RED: user edits are applied with no learning-capture acknowledgement or consent prompt.
- GREEN: after MPS edit save, modal prompts for preference memory consent and persists learning event metadata.

### T-MMM-S6-209 — MPS section must remain editable until higher-level sign-off
- RED: once L1 actions are used, users cannot reopen content edits before L2/L3 completion.
- GREEN: modal supports repeatable `Edit Content` updates while domain is not finally signed off.

### T-MMM-S6-210 — MPS submission state must be visibly actionable in-modal
- RED: user cannot submit completed MPS set from the working modal context.
- GREEN: modal footer exposes count-aware submit CTA (`Submit MPS Set (N)`) and success confirmation.

### T-MMM-S6-211 — Organisation Context uploads mode-source documents
- RED: Organisation Context only stores text profile fields, so Verbatim/Hybrid/New generation cannot resolve the customer source document from the customer context domain.
- GREEN: Organisation Context exposes a customer source-document upload, stores it in the canonical knowledge ledger with `scope_type = organisation_context`, and tags it with `source_mode:<VERBATIM|HYBRID|GENERATED>`.

### T-MMM-S6-212 — MPS AI generation consumes mode-source context
- RED: MPS generation only receives a mode label and cannot inspect organisation context documents before calling Maturion.
- GREEN: MPS generation resolves `mode_source_strategy`, organisation profile, and organisation/framework source documents before invoking `mmm-ai-chat-user`.

### T-MMM-S6-213 — Intent and Criteria generation consume the same mode-source context
- RED: Intent and Criteria generation can drift from the Verbatim/Hybrid/New source rule used for MPS.
- GREEN: Intent and Criteria generation use the same `resolveModeSourceContext` contract as MPS and pass the resolved context into the user-scoped AI endpoint.

### T-MMM-S6-214 — Hybrid origin labelling is supported for harvested versus AI-added content
- RED: Hybrid output provides no visible distinction between uploaded-source material and AI completion material.
- GREEN: generated artifacts accept `source_origin` metadata and the MPS modal renders colour-coded origin badges for `uploaded_source`, `ai_completion`, and `subject_knowledge`.

### T-MMM-S6-215 — MPS generation must de-duplicate verbatim rows and expose consulted sources
- RED: Verbatim MPS generation returns repeated rows and does not show which documents were consulted.
- GREEN: MPS generation de-duplicates by normalized source title and the modal shows a consulted-resources status toast.

### T-MMM-S6-216 — Verbatim criteria generation must prefer parsed framework criteria
- RED: Criteria generation falls back to generic non-verbatim text despite available parsed framework criteria.
- GREEN: Criteria generation resolves criteria from `mmm_proposed_criteria` for matching proposed MPS before AI fallback.
