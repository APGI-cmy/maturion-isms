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
