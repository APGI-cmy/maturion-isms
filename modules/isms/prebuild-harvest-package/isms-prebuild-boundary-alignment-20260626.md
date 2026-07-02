# ISMS Pre-Build Boundary Alignment Record

| Field | Value |
|---|---|
| Artifact type | ISMS pre-build boundary alignment record |
| Owning module | ISMS platform shell |
| Date | 2026-06-26 |
| Status | Pre-build governance alignment |
| Authority | PR #1850 shared platform/module boundary authority |
| Primary authority artifact | `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md` |
| Related module-side alignments | PIT PR #1853; MMM PR #1854 |

---

## 1. Purpose

This record aligns the ISMS pre-build stack to the platform/module boundary strategy introduced by PR #1850.

It confirms that ISMS remains the canonical public platform front door and shared journey owner while PIT, MMM, Risk Management, RADAM / Systems Integration, Incident & Intelligence, Data Analytics & Assurance, Skills Development, and future modules remain owners of their governed runtime surfaces after an approved ISMS handoff.

This is a documentation and pre-build governance alignment only.

It does not implement runtime behavior.

---

## 2. Authority adopted

This ISMS alignment adopts the boundary strategy in:

```text
modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md
```

The authority rule is:

```text
ISMS owns the shared platform journey.
Modules own their governed module runtime surfaces.
Agents must not build across that boundary unless specifically appointed for a cross-module wave.
```

For ISMS, this means ISMS pre-build artifacts must preserve ISMS ownership of the public platform shell and handoff contract without drifting into PIT, MMM, Risk Management, RADAM / Systems Integration, or other module runtime implementation.

---

## 3. ISMS-owned surfaces

ISMS owns:

- public landing / front door;
- modules overview;
- module marketing and explanation routes;
- public free-assessment entry and other public trust/acquisition surfaces;
- subscription and checkout orchestration;
- authentication entry and shell;
- onboarding and organisation baseline journey;
- dashboard and entitlement summary;
- entitlement and journey-state handoff;
- shared platform shell and navigation framing;
- cross-module governance framing and descriptor consumption.

ISMS may render module cards, module descriptions, public calls-to-action, subscription states, dashboard states, and runtime entry links from approved module descriptors.

ISMS must not build the module runtime behind those entry links unless a governed cross-module wave explicitly appoints that work.

---

## 4. Module-owned runtime surfaces

Modules own their runtime surfaces after the approved ISMS handoff.

Current module boundaries include:

- PIT owns Project Implementation Tracker runtime, including project implementation execution surfaces, projects, milestones, deliverables, tasks, PIT evidence/progress behavior, and PIT runtime after entitled handoff.
- MMM owns Maturity Roadmap runtime, including Domain -> MPS -> Criteria structures, maturity scoring, maturity evidence, assessment/roadmap logic, and MMM runtime after approved ISMS handoff.
- Risk Management owns its module-specific risk runtime once appointed and handed off.
- RADAM / Systems Integration owns its runtime integration, data extraction, and assurance/data-source behavior once appointed and handed off.
- Future modules own their own runtime surfaces only after descriptor registration and governed ISMS handoff.

Modules may supply descriptor content, entitlement keys, pricing/package requirements, runtime entry routes, role requirements, and approved marketing copy. They must not duplicate ISMS public acquisition, subscription, authentication, onboarding, dashboard, or entitlement/journey-state behavior.

---

## 5. ISMS pre-build stack alignment

This record aligns the following ISMS pre-build references to the boundary strategy:

- App Description;
- UX / Workflow / Wiring Spec;
- Functional Requirements Specification;
- Technical Requirements Specification;
- Architecture;
- QA-to-Red;
- PBFAG;
- Implementation Plan;
- Builder Checklist;
- IAA record / pre-brief references;
- BUILD_PROGRESS_TRACKER.

The aligned interpretation is:

1. ISMS public and shared journey artifacts describe ISMS-owned public/platform behavior only.
2. ISMS artifacts may define descriptor contracts and handoff obligations for modules.
3. ISMS artifacts must not define PIT, MMM, Risk, RADAM, or other module runtime behavior as if it belongs to ISMS.
4. Any cross-module linkup affecting public landing, modules overview, marketing, subscription, authentication, onboarding, dashboard, entitlement, runtime route protection, module host/domain behavior, cross-module route constants, or shared role/entitlement context is governed cross-module work before implementation.

---

## 6. Canonical host and origin rule

The canonical public host for platform acquisition and discovery remains:

```text
https://maturion-isms-portal.vercel.app
```

ISMS must preserve the canonical journey:

```text
ISMS public landing
  -> ISMS modules overview or module card
  -> ISMS-owned marketing / free-assessment / subscription route as applicable
  -> ISMS authentication where required
  -> ISMS onboarding where required
  -> ISMS dashboard or approved handoff surface with entitlement/journey state visible
  -> module runtime entry route when eligible or entitled
```

ISMS must not use browser local storage on one origin as proof of entitlement, onboarding, journey-state, or dashboard continuity on another origin.

Until a governed cross-origin state model exists, the acquisition, subscription, onboarding, dashboard, and first runtime handoff must remain on the canonical ISMS host or another CS2-approved host model.

---

## 7. ISMS QA-to-red alignment obligations

Future ISMS/module linkup QA-to-red must verify:

1. ISMS public landing and module cards route non-entitled users to ISMS-owned marketing, public assessment, subscription, authentication, onboarding, or dashboard surfaces as applicable.
2. Public free assessment remains an ISMS-owned acquisition/trust surface unless CS2 explicitly delegates otherwise.
3. Marketing routes route non-entitled users to ISMS-owned subscription or approved acquisition flows.
4. Subscription, authentication, onboarding, and dashboard states preserve or establish expected entitlement and journey-state before module runtime handoff.
5. Dashboard or approved handoff surface shows the expected module entitlement, journey state, or runtime entry affordance.
6. Eligible or entitled users reach the owning module runtime without unintended loopback to subscription, authentication, onboarding, dashboard setup, public assessment, or marketing.
7. Direct runtime entry routes deny or redirect non-entitled users predictably to ISMS-owned surfaces.
8. Direct runtime entry routes render only the owning module runtime for eligible users; ISMS links and frames but does not build module runtime content.
9. Module-specific hosts do not expose duplicate public acquisition, subscription, authentication, onboarding, dashboard, or free-assessment loops.
10. Cross-origin local-storage assumptions are not used as proof of entitlement or journey continuity.
11. Role-gated module routes still respect shared role context after entitlement handoff.
12. ISMS changes do not alter PIT, MMM, Risk Management, RADAM / Systems Integration, or other module runtime behavior unless a governed cross-module appointment authorizes it.

---

## 8. Implementation block

The following remain blocked until this ISMS pre-build alignment is merged and a later slice is separately appointed:

- P2 runtime persistence;
- Supabase runtime persistence hooks;
- PIT linkup implementation;
- MMM linkup implementation;
- Risk Management linkup implementation;
- RADAM / Systems Integration linkup implementation;
- future module linkup implementation;
- workflow/deployment changes that alter app or module ownership;
- `.agent-admin/control/delegation-order.json` changes unless a gate explicitly requires them.

---

## 9. Claim restriction

No completion, release, production-readiness, or fully functional claim may be made from PR #1850, PIT PR #1853, MMM PR #1854, or this ISMS alignment record alone.

This record only establishes ISMS-side pre-build boundary alignment.

Future implementation requires a separately scoped QA-to-red/build wave, builder appointment, build-to-green work, and canonical-host evidence.

---

## 10. Next governed sequence

The correct sequence after this ISMS alignment is:

```text
Merge ISMS pre-build boundary alignment
  -> classify the next linkup or productionization slice
  -> create or update boundary-specific QA-to-red
  -> appoint the correct builder only after QA-to-red exists
  -> build to green inside the authorized ISMS/module lane
  -> capture canonical-host browser/runtime evidence
  -> run Foreman / ECAP / IAA gates before CS2 merge decision
```
