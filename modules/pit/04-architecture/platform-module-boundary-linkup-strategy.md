# PIT Module Boundary and ISMS Linkup Strategy

| Field | Value |
|---|---|
| Artifact type | Pre-build reference authority |
| Owning module | PIT - Project Implementation Tracker |
| Consumes authority from | `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md` |
| Applies to | PIT W8.2 and later PIT runtime / navigation / entitlement work |
| Status | Draft authority for pre-build alignment |
| Date | 2026-06-24 |
| Trigger | Post-PR #1847 production evidence showed duplicate public landing surfaces and a subscription / entitlement loop across ISMS and PIT deployment hosts |

---

## 1. Purpose

This artifact records the PIT-side boundary contract for linking Project Implementation Tracker into the ISMS platform.

It must be read together with the ISMS platform authority artifact:

```text
modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md
```

PIT must not build or own the ISMS public acquisition journey. PIT must consume ISMS-provided identity, entitlement, shell, dashboard, subscription, and navigation handoff contracts, then render PIT-owned runtime surfaces only after those contracts allow entry.

---

## 2. PIT boundary statement

PIT owns:

- Project Implementation Tracker runtime shell behavior;
- PIT protected workspace routes, including `/pit/tracker`;
- PIT project runtime surfaces, where scoped;
- PIT role-aware admin and QA route behavior where scoped to PIT W8.2;
- PIT runtime evidence requirements;
- PIT module-specific pre-build artifacts and QA-to-red obligations.

PIT does not own:

- ISMS public landing `/`;
- ISMS modules overview `/modules`;
- public platform navigation shell;
- ISMS subscription or checkout flow;
- ISMS authentication shell;
- ISMS onboarding / organisation baseline flow;
- ISMS dashboard entitlement summary;
- cross-module entitlement storage;
- MMM, Risk Management, RADAM, or other module runtime behavior.

The PIT agent must not build ISMS, MMM, Risk Management, RADAM, or other module features unless CS2 explicitly authorizes a cross-module appointment.

---

## 3. Canonical PIT linkup journey

The canonical PIT entry journey is owned by ISMS until the protected PIT runtime route is reached.

```text
ISMS public landing
  -> Project Implementation Tracker card
  -> ISMS-owned /marketing/project-implementation when non-entitled
  -> ISMS-owned subscription / checkout
  -> ISMS-owned authentication
  -> ISMS-owned onboarding
  -> ISMS dashboard with Project Implementation entitlement visible
  -> /pit/tracker runtime entry
  -> PIT-owned Project Implementation Tracker shell
```

PIT must not create a separate public landing, subscription, authentication, onboarding, or dashboard journey to bypass ISMS.

---

## 4. Host and deployment boundary

PIT is currently deployed in integrated-shell mode. PIT routes are hosted by the `isms-portal` package. This means the deployment may build the ISMS portal shell for PIT-owned routes.

Integrated-shell deployment is not permission for `maturion-pit.vercel.app` to become a second public ISMS front door.

Until CS2 approves a different host model, PIT host behavior must follow one of these governed patterns:

1. public root and public acquisition routes redirect to the canonical ISMS host;
2. only PIT runtime deep links are served on the PIT host;
3. PIT runtime is served only under the canonical ISMS host and the PIT host is not user-facing.

The PIT host must not provide evidence of public acquisition correctness if that evidence depends on separate browser-origin local storage from the ISMS host.

---

## 5. Entitlement handoff rule

The PIT runtime entry route must consume the canonical ISMS entitlement result.

PIT must not treat browser local storage on `maturion-pit.vercel.app` as equivalent to local storage on `maturion-isms-portal.vercel.app`. These are different browser origins and do not share local-storage state.

Until a governed cross-origin entitlement model exists, PIT evidence must prove the canonical ISMS host journey:

```text
https://maturion-isms-portal.vercel.app
  -> checkout/auth/onboarding/dashboard
  -> dashboard shows PIT entitlement active
  -> /pit/tracker renders Project Implementation Tracker shell
```

If the dashboard shows no entitlement after onboarding, or clicking the PIT card returns to subscription after checkout/onboarding, the PIT linkup remains red.

---

## 6. PIT descriptor contract consumed by ISMS

PIT supplies descriptor data to ISMS. ISMS decides how to render public and dashboard navigation from the descriptor and entitlement state.

Minimum PIT descriptor:

| Field | PIT value |
|---|---|
| `moduleId` | `project-implementation` |
| `displayName` | `Project Implementation Tracker` |
| `shortName` | `PIT` |
| `marketingRoute` | `/marketing/project-implementation` |
| `runtimeEntryRoute` | `/pit/tracker` |
| `entitlementKey` | `project-implementation` |
| `ownerModule` | `pit` |
| `hostMode` | `integrated-shell` until changed by governed decision |

PIT may propose descriptor changes. ISMS owns rendering the public module grid, dashboard card, subscription journey, and first handoff into PIT runtime.

---

## 7. Pre-build alignment requirements for PIT

Before further W8.2 correction implementation, PIT pre-build artifacts must be aligned with this boundary artifact.

At minimum, PIT must update or cross-reference this artifact from:

- `modules/pit/00-app-description/app-description.md`;
- PIT UX / workflow / wiring specification;
- PIT FRS;
- PIT TRS;
- PIT architecture;
- `modules/pit/06-qa-to-red/qa-to-red-plan.md`;
- PIT PBFAG;
- `modules/pit/08-implementation-plan/implementation-plan.md`;
- `modules/pit/09-builder-checklist/builder-checklist.md`;
- the applicable IAA wave record;
- `modules/pit/BUILD_PROGRESS_TRACKER.md`.

The PIT updates must not rewrite ISMS ownership. They must state how PIT consumes ISMS linkup contracts and which PIT runtime surfaces remain module-owned.

---

## 8. PIT QA-to-red obligations

PIT QA-to-red must include red tests for the post-PR #1847 loop:

1. On the canonical ISMS host, a non-entitled user clicking the Project Implementation Tracker card reaches `/marketing/project-implementation`.
2. The marketing route routes to ISMS subscription / checkout.
3. Completing mock checkout, auth, and onboarding establishes visible PIT entitlement on the ISMS dashboard.
4. The dashboard Project Implementation Tracker card opens `/pit/tracker` rather than returning to subscription.
5. Direct `/pit/tracker` denies or redirects non-entitled users predictably.
6. Direct `/pit/tracker` renders the PIT runtime shell for entitled users on the canonical host.
7. `maturion-pit.vercel.app` does not present itself as an independent public acquisition journey unless a governed host strategy explicitly allows that.
8. PIT admin and QA routes continue to respect role-gated behavior after entitlement handoff.

The expected PIT runtime shell evidence remains:

```text
PIT STAGE 12 SLICE 1
Project Implementation Tracker
Protected Project Implementation Tracker workspace entry for entitled authenticated users.
Runtime state: data
Runtime shell ready. Stage 12 feature content will be delivered through governed slices.
```

This shell evidence is not sufficient by itself. The canonical ISMS entitlement journey must also reach it without looping.

---

## 9. Relationship to MMM and future modules

PIT does not define MMM, Risk Management, RADAM, or other module runtime boundaries. However, PIT must follow the same linkup philosophy that those modules will follow:

```text
ISMS owns shared public journey and entitlement handoff.
Each module owns its runtime after handoff.
Cross-module linkup is governed before build.
```

PIT changes must not introduce route, auth, entitlement, or dashboard patterns that future modules would be forced to copy incorrectly.

---

## 10. Immediate implication for PIT W8.2

The post-PR #1847 browser evidence means PIT W8.2 remains NOT_READY.

No PIT W8.2 completion, Stage 12 completion, production readiness, functional pass, or RLS final pass may be claimed from the current evidence.

The correct next sequence is:

```text
Adopt boundary/linkup artifacts
  -> align PIT and ISMS pre-build artifacts
  -> update QA-to-red for the canonical host and entitlement loop
  -> appoint builders after QA-to-red exists
  -> build to green
  -> capture production browser evidence
```

This artifact is not implementation. It is a pre-build boundary authority for the correction wave.
