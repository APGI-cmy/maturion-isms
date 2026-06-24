# MMM Module Boundary and ISMS Linkup Strategy

| Field | Value |
|---|---|
| Artifact type | Pre-build reference authority |
| Owning module | MMM - Maturity Roadmap Module |
| Consumes authority from | `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md` |
| Applies to | MMM public linkup, assessment handoff, runtime navigation, entitlement, and later cross-module integration work |
| Status | Draft authority for pre-build alignment |
| Date | 2026-06-24 |
| Trigger | Shared ISMS/module boundary correction after post-PR #1847 evidence showed duplicate public landing surfaces and cross-origin entitlement-loop risk |

---

## 1. Purpose

This artifact records the MMM-side boundary contract for linking the Maturity Roadmap Module into the ISMS platform.

It must be read together with the ISMS platform authority artifact:

```text
modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md
```

MMM is a major module in the wider Maturion platform. It may be deeply involved in the foundation assessment and maturity journey, but it must not become an accidental replacement for the ISMS public platform shell.

---

## 2. MMM boundary statement

MMM owns:

- Maturity Roadmap module runtime behavior;
- maturity assessment and roadmap module logic where scoped to MMM;
- MMM-specific runtime screens, evidence, scoring, workflow, and module state;
- MMM module-specific pre-build artifacts and QA-to-red obligations;
- MMM deployment/runtime behavior where explicitly scoped to the MMM app or module.

MMM does not own:

- ISMS public landing `/`;
- ISMS modules overview `/modules`;
- the shared public platform navigation shell;
- ISMS subscription or checkout flow;
- ISMS authentication shell;
- ISMS onboarding / organisation baseline flow unless explicitly delegated as a cross-module extension;
- ISMS dashboard entitlement summary;
- cross-module entitlement storage;
- PIT, Risk Management, RADAM / Systems Integration, or other module runtime behavior.

The MMM agent must not build ISMS, PIT, Risk Management, RADAM, or other module features unless CS2 explicitly authorizes a cross-module appointment.

---

## 3. Canonical MMM linkup journey

The canonical MMM entry journey is owned by ISMS until the user reaches an MMM-owned runtime surface or approved module workflow.

The standard journey is:

```text
ISMS public landing
  -> Maturity Roadmap card or free assessment call-to-action
  -> ISMS-owned public assessment / marketing / subscription path as applicable
  -> ISMS-owned authentication where required
  -> ISMS-owned onboarding where required
  -> ISMS dashboard / shared handoff surface with entitlement or journey state visible
  -> MMM-owned runtime route or assessment/roadmap workflow
```

MMM may provide foundation assessment capability, but the public promise, entry routing, subscription handoff, authentication handoff, onboarding handoff, and shared dashboard framing remain ISMS-owned unless a governed cross-module artifact explicitly changes that boundary.

---

## 4. Host and deployment boundary

MMM may have its own Vercel project or deployment workflow for module/runtime isolation. A separate MMM deployment does not automatically make MMM a second ISMS public front door.

Until CS2 approves a different host model, an MMM-specific host must follow one of these governed patterns:

1. public root and public acquisition routes redirect to the canonical ISMS host;
2. only MMM runtime deep links are served on the MMM host;
3. MMM runtime is served only under the canonical ISMS host and the MMM host is not user-facing;
4. a specifically approved standalone-runtime model with governed identity, entitlement, and navigation handoff.

The MMM host must not duplicate the ISMS public landing -> subscription -> auth -> onboarding -> dashboard journey unless entitlement and session continuity are explicitly governed.

---

## 5. Entitlement and journey-state handoff rule

MMM must consume the canonical ISMS identity, entitlement, and journey-state contract.

MMM must not treat browser local storage on a standalone MMM host as equivalent to local storage on the canonical ISMS host. Different browser origins do not share local-storage state.

Until a governed cross-origin state model exists, MMM evidence must prove the canonical ISMS host journey when the work depends on ISMS platform state:

```text
https://maturion-isms-portal.vercel.app
  -> ISMS public entry / assessment / subscription / auth / onboarding as applicable
  -> dashboard or approved handoff surface shows expected module state
  -> MMM runtime or workflow opens without returning the user to an unintended loop
```

If the canonical journey returns a user to an earlier subscription, authentication, onboarding, or assessment step after the expected handoff state exists, the MMM linkup remains red.

---

## 6. MMM descriptor contract consumed by ISMS

MMM supplies descriptor data to ISMS. ISMS decides how to render public and dashboard navigation from the descriptor and current platform state.

Minimum MMM descriptor:

| Field | MMM value |
|---|---|
| `moduleId` | `maturity-roadmap` |
| `displayName` | `Maturity Roadmap` |
| `shortName` | `Maturity Roadmap` or approved short label |
| `marketingRoute` | `/marketing/maturity-roadmap` or approved ISMS-owned public route |
| `runtimeEntryRoute` | MMM-owned runtime/assessment/roadmap route, once governed |
| `entitlementKey` | `maturity-roadmap` or approved foundation entitlement key |
| `ownerModule` | `mmm` |
| `hostMode` | `integrated-shell`, `standalone-runtime`, or approved MMM deployment mode |

MMM may propose descriptor changes. ISMS owns rendering the public module grid, public calls-to-action, dashboard card, subscription journey, and first handoff into MMM runtime.

---

## 7. Free assessment boundary

MMM may be the module that powers maturity assessment logic, scoring, recommendations, or roadmap generation.

However, the public free-assessment entry is a platform-level ISMS acquisition and trust surface unless CS2 explicitly delegates a narrower module-owned runtime scope.

Therefore:

- ISMS owns the public wording, placement, and first click for free assessment.
- MMM owns the governed assessment/roadmap functionality behind the approved handoff.
- Any change that alters public free-assessment routing, subscription conversion, authentication, onboarding, dashboard state, or module entry must be treated as cross-module linkup work.

---

## 8. Pre-build alignment requirements for MMM

Before further MMM linkup or app-boundary implementation, MMM pre-build artifacts must be aligned with this boundary artifact.

At minimum, MMM must update or cross-reference this artifact from:

- MMM App Description;
- MMM UX / workflow / wiring specification;
- `modules/MMM/02-frs/functional-requirements.md`;
- MMM TRS;
- MMM architecture;
- MMM QA-to-Red;
- `modules/MMM/06-pbfag/pbfag-checklist.md`;
- `modules/MMM/07-implementation-plan/implementation-plan.md`;
- MMM builder checklist / builder contract;
- the applicable IAA wave record;
- MMM build progress tracker or equivalent tracker.

The MMM updates must not rewrite ISMS ownership. They must state how MMM consumes ISMS linkup contracts and which MMM runtime surfaces remain module-owned.

---

## 9. MMM QA-to-red obligations

MMM QA-to-red for linkup work must include coverage for:

1. ISMS public landing routes MMM-related entry points to the ISMS-owned public route or approved assessment entry.
2. Public free assessment remains an ISMS-owned acquisition surface unless explicitly delegated.
3. Subscription, authentication, onboarding, and dashboard states are preserved when MMM handoff requires them.
4. Dashboard or approved handoff surface shows the expected MMM journey or entitlement state.
5. Entitled or otherwise eligible users reach the MMM runtime/workflow without looping back to subscription, authentication, onboarding, or public assessment unexpectedly.
6. Non-entitled or ineligible users are redirected predictably to ISMS-owned acquisition or subscription surfaces.
7. Any MMM-specific host does not expose a duplicate public acquisition loop.
8. Cross-origin local-storage assumptions are not used as proof of journey continuity.
9. MMM runtime does not alter PIT, Risk Management, RADAM, or other module routes.
10. MMM changes do not make MMM the ISMS platform shell by accident.

---

## 10. Relationship to PIT and future modules

MMM must follow the same linkup philosophy as PIT and future modules:

```text
ISMS owns shared public journey and entitlement / journey handoff.
Each module owns its runtime after handoff.
Cross-module linkup is governed before build.
```

MMM changes must not introduce route, auth, entitlement, dashboard, or deployment patterns that force PIT, Risk Management, RADAM, or future modules to copy an incorrect boundary.

---

## 11. Immediate implication

This artifact does not complete MMM, ISMS, PIT, or any runtime work. It defines MMM's module-side pre-build boundary for future alignment.

The correct sequence for MMM linkup work is:

```text
Adopt boundary/linkup artifacts
  -> align MMM and ISMS pre-build artifacts
  -> update QA-to-red for canonical host and MMM handoff behavior
  -> appoint builders after QA-to-red exists
  -> build to green
  -> capture browser/runtime evidence
```

No completion, release, production readiness, or fully functional claim may be made from this artifact alone.
