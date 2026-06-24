# PIT Stage 1 Addendum — PR #1850 Boundary Alignment

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 1 - App Description alignment addendum |
| Status | ACTIVE PRE-BUILD ALIGNMENT ADDENDUM |
| Date | 2026-06-24 |
| Trigger | PR #1850 merged; post-PR #1847 production evidence showed duplicate public landing surfaces and an entitlement/subscription loop |
| Applies to | `modules/pit/00-app-description/app-description.md`; `docs/governance/PIT_APP_DESCRIPTION.md` when next governance mirror update is performed |
| Authority consumed | `modules/pit/04-architecture/platform-module-boundary-linkup-strategy.md`; `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md` |

---

## 1. Purpose

This addendum aligns the PIT App Description authority with the merged PR #1850 platform/module boundary strategy.

It does not replace the PIT App Description. It records a binding interpretation that downstream PIT artifacts must apply until the canonical App Description and governance mirror are formally revised in a dedicated stage update.

---

## 2. Boundary interpretation

PIT remains the Project Implementation Tracker runtime module.

PIT does not own the ISMS public platform front door, public modules overview, marketing page, subscription flow, checkout, authentication shell, onboarding flow, or dashboard entitlement summary.

Those surfaces are owned by ISMS. PIT consumes the ISMS identity, entitlement, role, and navigation handoff contracts before rendering PIT runtime surfaces.

---

## 3. Product boundary correction

Any App Description language that can be read as PIT owning a standalone public landing or complete acquisition journey must now be interpreted through this boundary:

```text
ISMS owns public acquisition and entitlement handoff.
PIT owns Project Implementation Tracker runtime after entitled handoff.
```

PIT may supply module descriptor data to ISMS, including:

- module id: `project-implementation`;
- display name: `Project Implementation Tracker`;
- marketing route: `/marketing/project-implementation`;
- runtime entry route: `/pit/tracker`;
- entitlement key: `project-implementation`.

ISMS owns how that descriptor appears in public cards, dashboard cards, subscription plans, onboarding prompts, and canonical navigation.

---

## 4. Canonical host rule

For current PIT W8.2 correction work, production evidence must use the canonical ISMS host for the complete public-to-runtime journey:

```text
https://maturion-isms-portal.vercel.app
```

The PIT deployment host may exist for integrated-shell deployment isolation, but it must not be treated as a second user-facing public front door unless a governed host strategy explicitly approves that behavior.

---

## 5. Immediate requirement for downstream artifacts

All PIT downstream artifacts must align their scope and tests so that:

1. non-entitled users reach ISMS-owned public marketing/subscription surfaces;
2. checkout/auth/onboarding/dashboard entitlement state is established and shown by ISMS;
3. entitled users enter `/pit/tracker` without returning to subscription;
4. PIT runtime evidence starts only after the ISMS handoff succeeds;
5. no PIT agent builds ISMS-owned public, subscription, auth, onboarding, or dashboard behavior unless cross-module appointment exists.

---

## 6. Non-completion notice

This addendum is pre-build alignment only. It does not implement any correction, does not close W8.2, and does not support a Stage 12 completion, production readiness, functional pass, or RLS final pass claim.
