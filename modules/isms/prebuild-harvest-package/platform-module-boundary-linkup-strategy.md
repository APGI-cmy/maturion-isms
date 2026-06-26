# ISMS Platform Module Boundary and Linkup Strategy

| Field | Value |
|---|---|
| Artifact type | Pre-build reference authority |
| Owning module | ISMS platform shell |
| Applies to | ISMS, PIT, MMM, Risk Management, RADAM / Systems Integration, Incident & Intelligence, Data Analytics & Assurance, Skills Development, future modules |
| Status | Draft authority for pre-build alignment |
| Date | 2026-06-24 |
| Trigger | Post-PR #1847 production evidence showed duplicate public landing surfaces and a subscription / entitlement loop across ISMS and PIT deployment hosts |

---

## 1. Purpose

This artifact defines how independently governed Maturion modules link into the shared ISMS platform without duplicating public sites, subscription journeys, authentication journeys, onboarding journeys, entitlement state, or platform navigation.

It exists because the post-PR #1847 PIT evidence showed that deploying the ISMS integrated shell to both `maturion-isms-portal.vercel.app` and `maturion-pit.vercel.app` can make two public landing pages appear to exist for the same product journey. In the current mock implementation, entitlement and authentication state are browser-origin scoped. A user can therefore complete a mock journey on one host and still appear non-entitled on another host, recreating the subscription loop.

This is not a PIT-only concern. The same boundary must govern PIT, MMM, Risk Management, RADAM / Systems Integration, and all future module applications.

---

## 2. Core philosophy

ISMS is the canonical platform front door.

Modules are product capabilities inside the wider ISMS platform. A module may eventually have its own runtime package, deployment workflow, and deep-link host, but it must not create an independent public acquisition, subscription, authentication, onboarding, or entitlement journey unless CS2 explicitly changes the product boundary.

The rule is:

```text
ISMS owns the shared platform journey.
Modules own their governed module runtime surfaces.
Agents must not build across that boundary unless specifically appointed for a cross-module wave.
```

This means:

- The ISMS agent must not build PIT, MMM, RADAM, Risk Management, or other module runtime features.
- The PIT agent must not build ISMS acquisition, subscription, onboarding, dashboard, or shared platform features.
- The MMM agent must not build ISMS or PIT behavior.
- Any linkup work that touches both platform shell and module runtime is cross-module work and must be governed as such before implementation.

---

## 3. Ownership matrix

| Surface / concern | Owner | Other modules may do |
|---|---|---|
| Public landing `/` | ISMS | Provide module descriptor content only |
| Public modules overview `/modules` | ISMS | Provide module descriptor content only |
| Public module marketing `/marketing/<module>` | ISMS | Provide approved marketing copy / module proposition only |
| Subscription selection and checkout | ISMS | Provide entitlement key and pricing / package requirements only |
| Authentication shell | ISMS | Consume authenticated identity only |
| Onboarding / organisation baseline | ISMS | Provide module-specific context fields only through approved ISMS extension points |
| Dashboard and entitlement summary | ISMS | Provide card metadata and runtime entry route only |
| Entitlement evaluation and storage contract | ISMS shared platform | Consume entitlement result; do not fork storage logic |
| Module runtime route, for example `/pit/tracker` | Owning module inside ISMS shell | ISMS links to route; does not build runtime content |
| Module admin / QA runtime surfaces | Owning module, using shared role context | ISMS supplies shell / identity / role context only |
| Module-specific build artifacts | Owning module | Other modules reference, not edit, unless cross-module appointment exists |
| Cross-module navigation/linkup contract | ISMS + affected module under Foreman governance | Implement only after pre-build and QA-to-red alignment |

---

## 4. Canonical host policy

The canonical public host for platform acquisition and discovery is:

```text
https://maturion-isms-portal.vercel.app
```

Module-specific hosts may exist for deployment isolation, previews, or later standalone runtime hosting. They must not become duplicate public platform front doors by accident.

For the current PIT integrated-shell mode:

```text
https://maturion-pit.vercel.app
```

must be treated as a PIT deployment surface, not as a second ISMS public acquisition site. Until CS2 approves a different model, the expected behavior is one of the following governed patterns:

1. **Redirect-only module host**: public root and public platform routes on the module host redirect to the canonical ISMS host.
2. **Deep-link-only module host**: only module runtime deep links are served on the module host; public acquisition routes redirect to the canonical ISMS host.
3. **Canonical-host-only integrated shell**: module runtime routes are served under the ISMS host only, and the module host is not user-facing.

A module host must not run its own copy of the public landing -> marketing -> subscription -> auth -> onboarding -> dashboard journey unless the entitlement and session model is explicitly cross-origin and governed.

---

## 5. Linkup strategy

Every module links into ISMS through a descriptor contract, not through ad hoc page duplication.

Each module must define, and ISMS must consume, these fields:

| Field | Meaning |
|---|---|
| `moduleId` | Stable canonical key, for example `project-implementation`, `maturity-roadmap`, `risk-management`, `systems-integration` |
| `displayName` | Public platform name shown by ISMS |
| `shortName` | Short card / navigation label |
| `marketingRoute` | ISMS-owned public overview route, usually `/marketing/<module>` |
| `runtimeEntryRoute` | Protected / entitled module entry route, for example `/pit/tracker` |
| `entitlementKey` | Canonical key used by subscription and dashboard logic |
| `ownerModule` | Module responsible for runtime behavior |
| `hostMode` | `integrated-shell`, `standalone-runtime`, `redirect-only`, or later approved value |
| `publicCardState` | ISMS-computed state based on entitlement, not hard-coded module assumptions |
| `requiredRoles` | Optional role requirements for admin / QA runtime routes |

ISMS owns the rendering of public cards and platform navigation. The owning module owns runtime behavior behind the runtime entry route.

The standard user journey is:

```text
ISMS public landing
  -> ISMS modules overview or module card
  -> ISMS module marketing route when non-entitled
  -> ISMS subscription / checkout
  -> ISMS authentication
  -> ISMS onboarding
  -> ISMS dashboard with entitlement state visible
  -> module runtime entry route when entitled
```

The runtime route must not send a user back to subscription after the canonical ISMS journey has granted entitlement.

---

## 6. Entitlement and origin policy

Browser local storage, session storage, and cookies are scoped by origin. Therefore, entitlement state created on:

```text
https://maturion-isms-portal.vercel.app
```

is not automatically available on:

```text
https://maturion-pit.vercel.app
```

or any future module host.

Until the platform has a governed cross-origin session / entitlement backend, the safe rule is:

```text
Do not rely on browser-origin local storage across module hosts.
Keep the acquisition, subscription, onboarding, dashboard, and first runtime handoff on the canonical ISMS host.
```

If a future module needs a standalone host, the pre-build package must define one of these handoff models before implementation:

- server-backed entitlement shared across hosts;
- signed handoff token from ISMS to module runtime;
- same-site cookie / domain strategy where legally and technically valid;
- explicit redirect back to canonical ISMS for entitlement-gated routes;
- module host disabled for public navigation until the above exists.

No module may invent its own entitlement persistence layer in isolation.

---

## 7. Module-specific application

### PIT - Project Implementation Tracker

PIT owns protected Project Implementation Tracker runtime routes such as `/pit/tracker`, PIT project surfaces, PIT admin foundations, and PIT QA route behavior that are explicitly scoped to PIT.

PIT does not own the ISMS landing page, modules overview, subscription flow, authentication flow, onboarding flow, or shared dashboard. PIT may supply descriptor content and runtime entry requirements to ISMS.

### MMM - Maturity Roadmap

MMM is the Maturity Roadmap module. ISMS may present MMM as the foundation public assessment and maturity journey entry point, but MMM runtime work must not rewrite ISMS shell ownership. MMM linkup must follow the same descriptor and entitlement pattern.

### Risk Management

Risk Management may provide module-specific marketing content, entitlement needs, and runtime route contracts. ISMS owns public discovery, subscription, and navigation handoff.

### RADAM / Systems Integration

RADAM or Systems Integration may eventually require deeper technical integration and data-source authorization. The public linkup remains ISMS-owned unless CS2 approves a module-specific acquisition boundary. Runtime integration screens and data extraction behavior remain module-owned.

### Future modules

Future modules must not start from a duplicated landing site. They start by registering a module descriptor and agreeing the public, subscription, entitlement, and runtime handoff contract with ISMS.

---

## 8. Pre-build alignment requirements

Before any module linkup or app-boundary implementation, the affected pre-build stack must be updated to reference this artifact.

At minimum, affected modules must align:

- App Description;
- UX / Workflow / Wiring Spec;
- Functional Requirements Specification;
- Technical Requirements Specification;
- Architecture;
- QA-to-Red;
- PBFAG;
- Implementation Plan;
- Builder Checklist;
- IAA Pre-Brief / wave record;
- BUILD_PROGRESS_TRACKER or equivalent status tracker.

For ISMS, updates must verify that ISMS remains the public platform owner and that module descriptors do not become module-built public shell behavior.

For the module, updates must verify that the module consumes ISMS identity, entitlement, shell, and navigation contracts instead of forking them.

---

## 9. QA-to-red obligations for linkup waves

Every linkup wave must include QA-to-red coverage for:

1. Public landing card routes non-entitled users to the ISMS-owned marketing route.
2. Marketing route routes non-entitled users to ISMS subscription / checkout.
3. Checkout, authentication, and onboarding preserve or establish the expected entitlement state.
4. Dashboard shows the correct entitlement state after onboarding.
5. Entitled module card opens the module runtime entry route.
6. Direct runtime entry route denies or redirects non-entitled users predictably.
7. Direct runtime entry route renders the module runtime shell for entitled users.
8. Module host does not expose a duplicate public acquisition loop.
9. Cross-origin local-storage assumptions are not used as proof of entitlement continuity.
10. Role-gated module routes still respect the shared role context after entitlement handoff.

For PIT W8.2 specifically, the subscription loop observed after PR #1847 must be treated as a red test until the canonical ISMS journey reaches `/pit/tracker` without returning to subscription for an entitled user.

---

## 10. Governance rules

A module boundary/linkup change is not a cosmetic navigation change if it affects any of these:

- public landing;
- modules overview;
- marketing route;
- subscription or checkout route;
- authentication route;
- onboarding route;
- dashboard entitlement state;
- runtime route protection;
- module host/domain behavior;
- cross-module route constants;
- shared role or entitlement context.

Such a change requires governed cross-module classification unless it is limited to descriptor text that does not change behavior.

No agent may treat a module linkup defect as complete merely because a card label or route constant changed. Evidence must show that the full canonical journey works on the intended host and that non-canonical hosts do not create duplicate loops.

---

## 11. Immediate implication for PIT W8.2

The post-PR #1847 production evidence means PIT W8.2 remains NOT_READY.

The next governed sequence should be:

```text
Create / adopt this boundary artifact
  -> align ISMS pre-build artifacts
  -> align PIT pre-build artifacts
  -> update QA-to-red for canonical host and entitlement handoff
  -> appoint builders only after QA-to-red exists
  -> build to green
  -> capture production evidence on canonical host
```

This artifact does not itself complete W8.2, Stage 12, or any module runtime work. It defines the boundary that later pre-build and implementation work must obey.
