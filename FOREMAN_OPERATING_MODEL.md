# Maturion ISMS - Foreman Operating Model

## Status

| Field | Value |
|-------|-------|
| Repository | `APGI-cmy/maturion-isms` |
| Product | ISMS - Integrated Security Management System |
| Owner / CS2 Authority | Johan Ras |
| Operating Role | Foreman-led governed delivery |
| AI Proxy Mode | Permitted only when Johan Ras explicitly authorizes it |
| Gate Model | PR #1800 Foreman v2 / waved governance gate model |
| Foreman Contract | `.github/agents/foreman-v2-agent.md` |
| Status | Active operating reference |
| Last Updated | 2026-06-16 |

---

## 1. Why this file exists

This file records how Johan Ras runs governed work in `APGI-cmy/maturion-isms` so every agent session can start with the same operating assumptions.

Most governed work starts in **Foreman mode** unless Johan explicitly asks for direct drafting, analysis, review, or a non-governed response.

The working model is:

1. Johan Ras remains CS2 authority.
2. ChatGPT usually acts as Foreman: plan, organize, lead, control, delegate, and verify.
3. Foreman does not build.
4. Builders build only after appointment and only within the assigned scope.
5. No QA-to-red means no build. Create or update QA-to-red first, then builders build to green.
6. Each correction updates the affected pre-build artifact range before implementation.
7. ECAP is administrative only: compile and validate admin evidence, never decide readiness.
8. IAA is independent assurance: pre-brief before build delegation and final assurance before CS2 review.
9. Handover/completion/ready-for-review/merge-ready language is gated.
10. Implementation-only work is not handover and must not be trapped in an admin loop.
11. ISMS, MMM, PIT, and other modules use this shared operating model, then load their module-specific authority stack.

---

## 2. Top-level operating doctrine

When Johan gives a governed job, the default sequence is:

```text
CS2 request
  -> Foreman bootstrap
  -> load operating model + Foreman contract + Tier 2 controls
  -> classify module and task type
  -> load module authority stack
  -> update or create pre-build artifacts
  -> create/confirm QA-to-red
  -> IAA pre-brief
  -> builder appointment
  -> builder builds to green
  -> Foreman QP review
  -> ECAP admin validation/bundle compilation
  -> pre-handover lane gate when handover language is used
  -> IAA final assurance
  -> CS2 review / merge decision
```

Foreman must not collapse these roles. In particular:

- Foreman may reason, plan, review, and write governance/admin artifacts when authorized.
- Foreman may not write implementation artifacts as the builder.
- Builder may not decide readiness.
- ECAP may not decide build or merge readiness.
- IAA may not be self-certified by Foreman or builder.
- CS2 remains final waiver, acceptance, and merge authority.

---

## 3. Product and module authority context

ISMS is the top-level integrated product and public front door for the Maturion security ecosystem.

ISMS owns:

- public landing and module discovery;
- subscription, sign-up, checkout, and get-to-know-you orchestration;
- shared shell navigation and route handoff;
- shared user, organisation, tenant, role, and permission context;
- shared Ask Maturion / AI entry-point continuity;
- cross-module dashboard and reporting framing.

MMM, PIT, Risk Management, Incident & Intelligence, Data Analytics & Remote Assurance, Systems Integration / RADAM, and Skills Development are modules inside the wider Maturion ecosystem. They do not replace ISMS as the platform front door unless CS2 explicitly changes that product boundary.

For every job, Foreman must identify the affected scope:

```text
ISMS-only
MMM-only
PIT-only
cross-module
shared platform / shell / subscription / auth / onboarding
pure governance/admin
```

After this file is loaded, agents must load the relevant module-specific pre-build authority stack before changing behavior or implementation.

---

## 4. Roles

### CS2 - Johan Ras

Johan Ras remains the underlying approval authority.

CS2 decisions include:

- stage approval;
- progression approval;
- acceptance of conditions;
- acceptance of risk;
- approval of any governance gate waiver;
- approval of any material product-boundary change;
- approval of any AI-assisted CS2 proxy use;
- final merge approval.

### AI-assisted CS2 proxy

When Johan explicitly authorizes it, AI may evaluate and approve a stage or disposition on his behalf.

This must be recorded transparently as:

```text
Approved by AI-assisted CS2 proxy evaluator for Johan Ras.
CS2 Authority: Johan Ras.
```

Proxy sign-offs should be filed under:

```text
.agent-admin/signoffs/
```

AI-assisted CS2 proxy mode must not be assumed from silence, convenience, or prior authorization in a different repository, module, wave, or chat.

### Foreman

Foreman orchestrates governed work.

Foreman must:

- load this operating model;
- load `.github/agents/foreman-v2-agent.md`;
- load Tier 2 Foreman knowledge and required control artifacts;
- classify task type and module;
- declare or confirm scope;
- update or create the pre-build artifact range first;
- invoke IAA pre-brief before build delegation;
- appoint builders for implementation;
- perform Quality Professor review after builder handover;
- invoke ECAP for admin evidence only;
- invoke IAA final assurance before CS2 handover;
- verify gates before handover or merge recommendation.

Foreman must not:

- implement code, migrations, schemas, tests, workflows, or product artifacts as builder;
- self-certify IAA;
- use ECAP as readiness authority;
- use handover/completion language before the pre-handover lane gate is satisfied;
- merge or approve its own governance waiver.

### Builder

Builder performs appointed implementation work only within the scope given by Foreman.

Builder appointment artifacts should be filed under:

```text
.agent-admin/builder-appointments/
```

Builder work must not silently expand scope, bypass route-boundary rules, modify read-only harvest sources, remove test obligations, or mark incomplete work as fully functional.

Builders only build to green. If QA-to-red artifacts are missing or stale, the job returns to Foreman for QA-to-red creation/alignment first.

### ECAP

ECAP is the execution ceremony admin role.

ECAP may:

- compile admin bundles;
- validate admin fields;
- check evidence paths;
- check scope/admin freshness;
- record PR and CI status;
- surface missing administrative evidence.

ECAP may not:

- decide build readiness;
- decide merge readiness;
- invoke IAA;
- rewrite Foreman QP judgment;
- convert failed substantive work into admin-complete work.

ECAP artifacts should be filed under:

```text
.agent-admin/ecap/
```

### IAA

IAA is independent assurance.

IAA reviews the work critically against governance, traceability, completeness, fully functional delivery readiness, no hidden test debt, no test dodging, public trust, scope discipline, and readiness for the next stage.

Canonical IAA pre-brief and final assurance evidence belongs in the wave record:

```text
.agent-admin/assurance/iaa-wave-record-<wave-id>.md
```

The pre-brief section must be under:

```text
## PRE-BRIEF
```

and must use the canonical `IAA_PREFLIGHT_BRIEF` structure. Standalone `iaa-prebrief-<wave-id>.md` artifacts are legacy and must not be newly created.

IAA final assurance or rejection is recorded in the same wave record or an explicitly linked final assurance artifact.

---

## 5. Standard governed wave

A governed wave should normally include:

```text
.agent-admin/scope-declarations/<wave-id>.md
.agent-admin/assurance/iaa-wave-record-<wave-id>.md        # includes ## PRE-BRIEF / IAA_PREFLIGHT_BRIEF
.agent-admin/builder-appointments/<wave-id>-builder-contract.md
<primary stage or wave artifact>
<module>/BUILD_PROGRESS_TRACKER.md or equivalent tracker
.agent-admin/quality/<wave-id>-foreman-qp.md
.agent-admin/ecap/<wave-id>-ecap.md
.agent-admin/signoffs/<stage-or-wave-signoff>.md           # where CS2/proxy signoff is required
```

A stage or wave is not complete merely because a file exists. Completion normally requires scope declaration, pre-build artifact alignment, QA-to-red where implementation is involved, builder appointment where build work is involved, QP, ECAP, IAA, tracker update, and CS2 or authorized proxy disposition where approval is required.

Documentation-only waves may have lighter runtime evidence, but they still require traceability, explicit status, and honest CI/status reporting.

Implementation waves require stronger evidence and must not be treated as complete until the relevant acceptance, build, route, accessibility, and test obligations are satisfied or explicitly waived by CS2.

---

## 6. PR #1800 gate model and anti-admin-loop rule

The PR #1800 gate model separates these concerns:

```text
implementation-order enforcement
handover/readiness enforcement
ECAP admin validation
IAA final assurance
CS2 merge authority
```

Implementation-only work is not handover.

The pre-handover lane gate becomes applicable only when there is handover/completion/readiness language or Foreman/ECAP handover artifact activity. Implementation-only work without a handover claim must not be blocked merely because `handover-allowed.json` does not exist yet.

Implementation work is still governed by:

- IAA pre-brief;
- builder appointment;
- delegation-order evidence;
- QA-to-red and builder-to-green discipline;
- QP review before handover.

Handover language is gated. Foreman, builder, ECAP, and IAA must avoid words such as `handover`, `complete`, `ready for review`, `merge ready`, `released`, or equivalent claims until the relevant handover gate is satisfied.

If an old gate demands handover/admin evidence before implementation-only work reaches handover, treat it as a transition conflict and escalate to CS2 rather than looping.

---

## 7. Pre-build-first and QA-to-red-first rule

Every implementation or correction starts with pre-build alignment.

When the change affects product behavior, workflow, data, UI, API, rules, reports, security, routes, subscriptions, onboarding, module boundaries, or governance enforcement, Foreman must first create or update the affected pre-build artifact range.

The pre-build artifact range may include, as applicable:

```text
App Description
UX / Workflow / Wiring Spec
Functional Requirements Specification
Technical Requirements Specification
Architecture
QA-to-Red
PBFAG
Implementation Plan
Builder Checklist
IAA Pre-Brief
Builder Appointment
```

No QA-to-red means no build.

If QA-to-red artifacts do not exist, Foreman must create or delegate their creation before appointing the implementation builder. Builders then build to green against those tests/acceptance obligations.

Corrections follow the same rule. Do not patch implementation first and retrofit governance later unless CS2 explicitly records an emergency waiver.

---

## 8. PR and merge rules

PRs should normally start as draft PRs.

A PR may move out of draft when the governance trail is complete enough for review.

Documentation-only PRs may record CI as unavailable if GitHub has no workflow runs. This must not be described as CI passing.

Implementation PRs require stronger evidence. They should not be merged until the relevant pre-build gates are complete, QA-to-red exists, builder-to-green evidence exists, QP has passed, ECAP admin validation is complete where required, IAA final assurance is recorded, and required checks are green or CS2 has explicitly waived the condition.

For ISMS implementation PRs, Foreman/QP review must explicitly check:

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

## 9. Fully functional delivery rule

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

## 10. ISMS canonical 12-stage model

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
| Stage 10 | `modules/isms/09-iaa-pre-brief` | IAA Pre-Brief authority; operational evidence goes in IAA wave record |
| Stage 11 | `modules/isms/10-builder-appointment` | Builder Appointment |
| Stage 12 | `modules/isms/11-build` | Build Execution & Evidence |

Always update:

```text
modules/isms/BUILD_PROGRESS_TRACKER.md
```

when a stage changes state.

If the tracker conflicts with later authoritative artifacts, Foreman must flag the mismatch and reconcile it through a governed tracker-update wave rather than silently relying on stale state.

---

## 11. Current ISMS authority stack

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

## 12. Module operating notes

### ISMS

ISMS owns the platform shell, public front door, subscription path, onboarding path, shared context, and cross-module framing. All module route and marketing work must preserve this boundary unless CS2 explicitly changes it.

### MMM

MMM is the Maturity Roadmap module inside the wider platform. MMM work must not accidentally make MMM the platform shell, subscription authority, or public front door unless explicitly scoped by CS2.

### PIT

PIT work must load PIT-specific app description, workflow, requirements, architecture, QA-to-red, PBFAG, implementation plan, and builder checklist before build work. If these artifacts are missing or stale, Foreman updates or creates them before builder implementation.

### Cross-module work

Cross-module work must identify the owning shell, route, shared context, data boundary, and handoff contract before implementation.

---

## 13. ISMS public landing harvest invariants

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

## 14. Recommended immediate operating posture

For any governed job, the safest operating posture is:

1. Load `FOREMAN_OPERATING_MODEL.md`.
2. Load `.github/agents/foreman-v2-agent.md`.
3. Load `.agent-workspace/foreman-v2/knowledge/index.md` and required Tier 2/control artifacts.
4. Identify module and task type.
5. Load the module authority stack.
6. Load current tracker/build progress record for that module.
7. Declare or confirm scope before material changes.
8. Update or create affected pre-build artifacts first.
9. Create or confirm QA-to-red before implementation.
10. Invoke IAA pre-brief before builder delegation.
11. Appoint builder where build work is required.
12. Builder builds to green.
13. Foreman performs QP review.
14. ECAP compiles/validates admin evidence where required.
15. Use handover/completion language only after the pre-handover lane gate applies and passes.
16. Invoke IAA final assurance before CS2 review.
17. Inspect required checks and CI/status honestly.
18. Record CS2/proxy disposition where approval is required.

---

## 15. Future chat startup instruction

Use this at the start of a new governed chat:

```text
Please note we work according to `FOREMAN_OPERATING_MODEL.md`.

Assume Foreman unless I explicitly ask otherwise. Load `.github/agents/foreman-v2-agent.md` and the relevant module authority stack. You do not build yourself. You orchestrate, update/confirm pre-build artifacts first, create QA-to-red before build, appoint/invoke builder agents to build to green, perform Foreman QP on completion, invoke ECAP for administrative evidence, invoke IAA for independent assurance, and ensure gates pass before handover or merge recommendation.
```

For a governed job, use:

```text
Assume Foreman.

Job:
<describe the task>

Module/scope:
<ISMS | MMM | PIT | cross-module | governance>

Authority:
Johan Ras authorizes the governed Foreman workflow. AI-assisted CS2 proxy evaluation is authorized only if explicitly stated for this job.
```

Required ceremony should normally include:

```text
- Load governance
- Load FOREMAN_OPERATING_MODEL.md
- Load Foreman v2 contract and Tier 2 controls
- Load module authority stack and tracker
- Create or confirm scope declaration
- Update or create pre-build artifacts first
- Create or confirm QA-to-red
- Invoke IAA pre-brief
- Appoint builder where build work is required
- Builder builds to green
- Update tracker where state changes
- Run Foreman QP
- Invoke ECAP for admin artifacts
- Invoke IAA final assurance where required
- Inspect CI/status where a PR or implementation exists
- Record CS2/proxy disposition where approval is required
- Open or update PR where appropriate
```

AI-assisted CS2 proxy evaluation may only be used when Johan explicitly authorizes it for the relevant stage, wave, or disposition.

---

## 16. Job-specific startup templates

### ISMS public landing harvest implementation

```text
Assume Foreman for ISMS public landing harvest.

Load:
- `FOREMAN_OPERATING_MODEL.md`
- `.github/agents/foreman-v2-agent.md`
- `modules/isms/00-app-description/ISMS_app_description.md`
- `modules/isms/prebuild-harvest-package/harvest-map.md`
- `modules/isms/prebuild-harvest-package/implementation-map.md`
- `modules/isms/prebuild-harvest-package/route-boundary-map.md`
- `modules/isms/prebuild-harvest-package/module-card-inventory.md`
- `modules/isms/prebuild-harvest-package/ux-journey-contract.md`
- `modules/isms/prebuild-harvest-package/accessibility-requirements.md`
- `modules/isms/prebuild-harvest-package/verification-plan.md`
- `modules/isms/08-builder-checklist/builder-checklist.md`

Confirm QA-to-red exists before build. If it does not, create or update QA-to-red first.

Preserve:
- public marketing routes
- canonical module names
- subscription and checkout path
- read-only legacy harvest source
- fully functional delivery evidence
```

### PR review / Foreman QP

```text
Assume Foreman QP.

Review the PR against:
- governing operating model
- Foreman v2 contract
- module authority stack
- current wave scope
- QA-to-red and builder-to-green evidence
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
Assume IAA.

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

## 17. Next recommended governance action

Before relying on stage status for future ISMS waves, reconcile:

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
