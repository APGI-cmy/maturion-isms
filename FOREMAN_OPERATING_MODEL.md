# Maturion ISMS - Foreman Operating Model

## Status

| Field | Value |
|-------|-------|
| Repository | `APGI-cmy/maturion-isms` |
| Product | ISMS - Integrated Security Management System |
| Owner / CS2 Authority | Johan Ras |
| Operating Role | Foreman-led governed delivery |
| AI Proxy Mode | Permitted only when Johan Ras explicitly authorizes it |
| Status | Active reference |
| Last Updated | 2026-05-29 |

---

## 1. Why this file exists

This file records how work is run in the `APGI-cmy/maturion-isms` repository so a future chat or agent session can continue without rebuilding the operating model from conversation history.

The working model is:

1. Johan Ras remains the CS2 authority.
2. ChatGPT may act as Foreman when asked.
3. ChatGPT may act as an AI-assisted CS2 proxy evaluator when Johan explicitly authorizes it.
4. Builder work must be appointed, bounded, and traceable.
5. ECAP and IAA are required for material stage completion, build handover, or implementation readiness.
6. Implementation must not start before the required pre-build gates unless CS2 explicitly authorizes a waiver.
7. Public-route, module-routing, subscription, onboarding, and shared-context boundaries must be treated as governed ISMS product boundaries, not incidental UI choices.

---

## 2. Product authority context

ISMS is the top-level integrated product and public front door for the Maturion security ecosystem.

ISMS owns:

- public landing and module discovery;
- subscription, sign-up, checkout, and get-to-know-you orchestration;
- shared shell navigation and route handoff;
- shared user, organisation, tenant, role, and permission context;
- shared Ask Maturion / AI entry-point continuity;
- cross-module dashboard and reporting framing.

MMM, Risk Management, PIT, Incident & Intelligence, Data Analytics & Remote Assurance, Systems Integration / RADAM, and Skills Development are modules inside ISMS. They do not replace ISMS as the platform front door.

Downstream work must preserve this product boundary unless CS2 explicitly approves a change.

---

## 3. Roles

### CS2 - Johan Ras

Johan Ras remains the underlying approval authority.

CS2 decisions include:

- stage approval;
- progression approval;
- acceptance of conditions;
- acceptance of risk;
- approval of any governance gate waiver;
- approval of any material product-boundary change;
- approval of any AI-assisted CS2 proxy use.

### AI-assisted CS2 proxy

When Johan Ras explicitly authorizes it, AI may evaluate and approve a stage or disposition on his behalf.

This must be recorded transparently as:

```text
Approved by AI-assisted CS2 proxy evaluator for Johan Ras.
CS2 Authority: Johan Ras.
```

Proxy sign-offs should be filed under:

```text
.agent-admin/signoffs/
```

AI-assisted CS2 proxy mode must not be assumed from silence, convenience, or prior authorization in a different repository or wave.

### Foreman

The Foreman orchestrates governed work.

The Foreman loads governance, declares scope, appoints builders, manages the wave, performs QP review, ensures ECAP and IAA are filed, keeps the tracker updated, checks PR readiness, and controls whether work is ready for review or needs correction.

For ISMS, the Foreman must also protect:

- ISMS as the top-level platform shell;
- public/private route boundaries;
- module ownership boundaries;
- subscription and onboarding sequence integrity;
- shared context and Ask Maturion continuity;
- traceability from app description through UX, FRS, TRS, architecture, QA, PBFAG, implementation plan, builder checklist, appointment, and build evidence.

### Builder

The builder performs the appointed work only within the scope given by the Foreman.

Builder appointment artifacts should be filed under:

```text
.agent-admin/builder-appointments/
```

Builder work must not silently expand scope, bypass route-boundary rules, modify read-only harvest sources, remove test obligations, or mark incomplete work as fully functional.

### ECAP

ECAP preserves the administrative record of the wave so the work can be reviewed or resumed later without relying on chat memory.

ECAP artifacts should be filed under:

```text
.agent-admin/ecap/
```

An ECAP record should identify:

- wave ID;
- scope authority;
- primary artifacts touched;
- decisions made;
- evidence reviewed;
- open risks;
- deviations or waivers;
- PR and CI status where applicable.

### IAA

IAA is the independent assurance role.

IAA reviews the work critically against governance, traceability, completeness, fully functional delivery readiness, no hidden test debt, no test dodging, public trust, scope discipline, and readiness for the next stage.

IAA artifacts should be filed under:

```text
.agent-admin/assurance/
```

IAA must be independent in posture even when performed by an AI assistant in the same overall chat. It should look for failure modes, not merely summarize the Foreman position.

---

## 4. Standard ISMS Foreman wave

A governed ISMS wave should normally include:

```text
.agent-admin/scope-declarations/<wave-id>.md
.agent-admin/builder-appointments/<wave-id>-builder-contract.md
<primary stage or wave artifact>
modules/isms/BUILD_PROGRESS_TRACKER.md
.agent-admin/quality/<wave-id>-foreman-qp.md
.agent-admin/ecap/<wave-id>-ecap.md
.agent-admin/assurance/iaa-prebrief-<wave-id>.md
.agent-admin/assurance/iaa-review-<wave-id>.md
.agent-admin/signoffs/<stage-or-wave-signoff>.md
```

A stage or wave is not complete merely because a file exists. Completion normally requires scope declaration, builder appointment where build work is involved, QP, ECAP, IAA, tracker update, and CS2 or authorized proxy disposition where approval is required.

Documentation-only waves may have lighter runtime evidence, but they still require traceability, explicit status, and honest CI/status reporting.

Implementation waves require stronger evidence and must not be treated as complete until the relevant acceptance, build, route, accessibility, and test obligations are satisfied or explicitly waived by CS2.

---

## 5. PR and merge rules

PRs should normally start as draft PRs.

A PR may move out of draft when the governance trail is complete enough for review.

Documentation-only PRs may record CI as unavailable if GitHub has no workflow runs. This must not be described as CI passing.

Implementation PRs require stronger evidence. They should not be merged until the relevant pre-build gates are complete or CS2 has explicitly waived them.

For ISMS implementation PRs, the Foreman/QP review must explicitly check:

- public routes remain public where required;
- private routes remain protected where required;
- module marketing routes are not wrapped in `ProtectedRoute`;
- subscription and checkout routes remain reachable;
- legacy redirects are preserved where required;
- navigation uses canonical ISMS route constants;
- ISMS remains the platform front door;
- MMM remains the Maturity Roadmap module, not the platform shell;
- build, typecheck, lint, and tests are honestly reported;
- known broken paths are disclosed rather than hidden.

A PR with missing CI, unavailable CI, or unrun tests may still be reviewed, but the status must be stated accurately.

---

## 6. Fully functional delivery rule

The central quality question is:

```text
Are we delivering a fully functional build in accordance with the fully functional build canon?
```

For implementation work, this means the result must be usable, routed, coherent, responsive, accessible to the agreed standard, correctly linked, inspectable, and free of known avoidable broken paths.

For pre-build work, this means the artifact must be specific enough to drive a fully functional downstream build.

For ISMS specifically, fully functional delivery also requires:

- the public landing funnel works from `/` through module discovery;
- module cards use canonical ISMS module names;
- module marketing pages route to `/marketing/<module>`;
- the free assessment route is public and clearly tied to Maturity Roadmap / MMM;
- the subscription and checkout path remains public and coherent;
- authentication and onboarding are not confused with public marketing pages;
- private workspace routes remain protected;
- shared shell, user/org/tenant context, and route handoff assumptions are not contradicted;
- Ask Maturion / shared AI entry points remain platform-level concepts unless a module-specific implementation is explicitly scoped.

---

## 7. ISMS canonical 12-stage model

The ISMS module follows the canonical 12-stage pre-build and build lifecycle.

| Canonical Stage | Module Folder | Artifact |
|-----------------|---------------|----------|
| Stage 1 | `modules/isms/00-app-description` | App Description |
| Stage 2 | `modules/isms/01-ux-workflow-wiring-spec` | UX Workflow & Wiring Spec |
| Stage 3 | `modules/isms/02-frs` | Functional Requirements Specification |
| Stage 4 | `modules/isms/03-trs` | Technical Requirements Specification |
| Stage 5 | `modules/isms/04-architecture` | Architecture |
| Stage 6 | `modules/isms/05-qa-to-red` | QA-to-Red |
| Stage 7 | `modules/isms/06-pbfag` | Pre-Build Functionality Assessment Gate |
| Stage 8 | `modules/isms/07-implementation-plan` | Implementation Plan |
| Stage 9 | `modules/isms/08-builder-checklist` | Builder Checklist |
| Stage 10 | `modules/isms/09-iaa-pre-brief` | IAA Pre-Brief |
| Stage 11 | `modules/isms/10-builder-appointment` | Builder Appointment |
| Stage 12 | `modules/isms/11-build` | Build Execution & Evidence |

Always update:

```text
modules/isms/BUILD_PROGRESS_TRACKER.md
```

when a stage changes state.

If the tracker conflicts with later authoritative artifacts, the Foreman must flag the mismatch and reconcile it through a governed tracker-update wave rather than silently relying on stale state.

---

## 8. Current ISMS authority stack

For ISMS top-level behavior, load the current authority stack before making material changes.

Core product authority:

```text
modules/isms/00-app-description/ISMS_app_description.md
```

Current public landing / pre-subscription harvest authority:

```text
modules/isms/prebuild-harvest-package/harvest-map.md
modules/isms/prebuild-harvest-package/implementation-map.md
modules/isms/prebuild-harvest-package/route-boundary-map.md
modules/isms/prebuild-harvest-package/module-card-inventory.md
modules/isms/prebuild-harvest-package/ux-journey-contract.md
modules/isms/prebuild-harvest-package/accessibility-requirements.md
modules/isms/prebuild-harvest-package/verification-plan.md
modules/isms/08-builder-checklist/builder-checklist.md
```

Application target:

```text
apps/isms-portal/
```

Legacy harvest source:

```text
apps/maturion-maturity-legacy/src/
```

The legacy harvest source is read-only for harvest waves unless CS2 explicitly authorizes otherwise.

---

## 9. ISMS public landing harvest invariants

For the ISMS public landing harvest and all future public marketing waves, the following invariants are mandatory unless CS2 explicitly approves a waiver.

1. Marketing pages must remain public and unauthenticated.
2. `/free-assessment` must remain public.
3. `/journey` must remain public.
4. `/modules` must remain public.
5. `/subscribe` must remain public.
6. `/subscribe/checkout` must remain public.
7. `/auth` and `/accept-invitation` must remain public entry routes.
8. Private workspace routes such as `/dashboard`, `/assessment`, `/maturity/setup`, `/team`, and admin/configuration routes must remain protected.
9. MMM must be represented as Maturity Roadmap / MMM, a module inside ISMS.
10. The MMM public card must route to `/marketing/maturity-roadmap`, not `/`, not `/maturity/setup`, and not a private workspace.
11. Module card names must use canonical ISMS names.
12. Legacy route aliases should redirect to canonical marketing routes where required.
13. No production `console.log` debug statements should remain in harvested production code.
14. No broad welcome `useToast` should run on public landing page load.
15. The public conversion sequence must be preserved:

```text
ISMS Public Landing (/)
  -> Module Discovery Card click
    -> Module Marketing/Explanation Page (/marketing/<module>)
      -> Subscribe CTA
        -> Subscription/Package Selection (/subscribe)
          -> Checkout (/subscribe/checkout)
            -> Account Creation (/auth)
              -> Get-To-Know-You profile (/onboarding or module first-run)
                -> Module Workspace entry
```

Any violation should be treated as a QP failure unless explicitly waived by CS2.

---

## 10. Current state note

As of 2026-05-29, the repository contains an ISMS App Description and public landing harvest authority that post-date earlier tracker notes.

The existing `modules/isms/BUILD_PROGRESS_TRACKER.md` may be stale where it states that Stage 1 is not started and that the app-description folder is empty. Before the next governed stage progression, Foreman should reconcile the tracker against the current ISMS App Description, prebuild harvest package, builder checklist, PR records, and issue records.

Do not blindly treat the tracker anomaly as the only source of truth if later authoritative artifacts exist.

Do not silently overwrite the tracker state either. Reconciliation should be explicit, reviewed, and filed as a governed administrative update.

---

## 11. Recommended immediate operating posture

Until the tracker is reconciled, the safest operating posture is:

1. Load `FOREMAN_OPERATING_MODEL.md`.
2. Load `modules/isms/00-app-description/ISMS_app_description.md`.
3. Load `modules/isms/BUILD_PROGRESS_TRACKER.md`.
4. Load the current wave package under `modules/isms/prebuild-harvest-package/`.
5. Load `modules/isms/08-builder-checklist/builder-checklist.md` for implementation invariants.
6. Identify whether the requested work is:
   - tracker/governance reconciliation;
   - pre-build artifact work;
   - public landing harvest implementation;
   - PR review / QP;
   - IAA review;
   - post-subscription module work.
7. Declare scope before material changes.
8. Do not start implementation work unless the required gates are complete or CS2 authorizes a waiver.
9. Where implementation is already in flight, review it against the public-route and fully functional delivery invariants before recommending merge.

---

## 12. Future chat startup instruction

Use this at the start of a new chat:

```text
Load `FOREMAN_OPERATING_MODEL.md` first. Assume Foreman for ISMS. Load the local governance canon, `modules/isms/BUILD_PROGRESS_TRACKER.md`, the current ISMS App Description, and the relevant current stage or wave artifacts. Continue from the reconciled current state. Use AI-assisted CS2 proxy evaluation only where Johan Ras explicitly authorizes it. Preserve Foreman, Builder, ECAP, and IAA separation.
```

For a governed job, use:

```text
Assume Foreman for ISMS.

Job:
<describe the task>

Authority:
Johan Ras authorizes AI-assisted CS2 proxy evaluation where needed.
```

Required ceremony should normally include:

```text
- Load governance
- Load ISMS App Description and current tracker
- Load current stage or wave artifacts
- Create or confirm scope declaration
- Appoint builder where build work is required
- Execute or prepare builder task
- Update tracker where state changes
- Run Foreman QP
- File ECAP
- File IAA pre-brief where required
- Run IAA review where required
- Inspect CI/status where a PR or implementation exists
- Record CS2/proxy disposition where approval is required
- Open or update PR where appropriate
```

AI-assisted CS2 proxy evaluation may only be used when Johan Ras explicitly authorizes it for the relevant stage, wave, or disposition.

---

## 13. Job-specific startup templates

### Public landing harvest implementation

```text
Assume Foreman for ISMS public landing harvest.

Load:
- `FOREMAN_OPERATING_MODEL.md`
- `modules/isms/00-app-description/ISMS_app_description.md`
- `modules/isms/prebuild-harvest-package/harvest-map.md`
- `modules/isms/prebuild-harvest-package/implementation-map.md`
- `modules/isms/prebuild-harvest-package/route-boundary-map.md`
- `modules/isms/prebuild-harvest-package/module-card-inventory.md`
- `modules/isms/prebuild-harvest-package/ux-journey-contract.md`
- `modules/isms/prebuild-harvest-package/accessibility-requirements.md`
- `modules/isms/prebuild-harvest-package/verification-plan.md`
- `modules/isms/08-builder-checklist/builder-checklist.md`

Preserve:
- public marketing routes
- canonical module names
- subscription and checkout path
- read-only legacy harvest source
- fully functional delivery evidence
```

### PR review / QP

```text
Assume Foreman QP for ISMS.

Review the PR against:
- governing app description
- current wave scope
- route-boundary requirements
- builder checklist invariants
- fully functional delivery rule
- build/typecheck/test evidence
- no hidden test debt
- public trust and scope discipline

Return:
- pass/fail disposition
- blocking findings
- non-blocking findings
- exact ready-to-paste PR review comments
- required remediation before merge
```

### IAA review

```text
Assume IAA for ISMS.

Review independently against:
- governance authority
- traceability
- completeness
- fully functional delivery readiness
- no hidden test debt
- no test dodging
- route and module ownership boundaries
- public trust
- readiness for next stage or merge

Return:
- IAA disposition
- material risks
- evidence gaps
- required corrections
- whether Foreman handover or merge recommendation is supportable
```

---

## 14. Next recommended governance action

Before relying on stage status for future waves, reconcile:

```text
modules/isms/BUILD_PROGRESS_TRACKER.md
```

against:

```text
modules/isms/00-app-description/ISMS_app_description.md
modules/isms/prebuild-harvest-package/
modules/isms/08-builder-checklist/builder-checklist.md
```

The reconciliation should determine whether Stage 1 can be marked complete, whether Stage 8/9 public landing harvest artifacts represent an authorized implementation wave exception, and what the next governed ISMS wave should be.

Until that reconciliation is complete, all implementation or PR decisions should explicitly cite the current wave authority rather than relying solely on the stale tracker summary.

---
