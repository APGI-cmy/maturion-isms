# PIT Stage 2 Addendum — PR #1850 Boundary Alignment

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 2 - UX Workflow & Wiring Spec alignment addendum |
| Status | ACTIVE PRE-BUILD ALIGNMENT ADDENDUM |
| Date | 2026-06-24 |
| Trigger | PR #1850 merged; post-PR #1847 production evidence showed the PIT card/subscription journey still looping |
| Applies to | `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` |
| Authority consumed | `modules/pit/04-architecture/platform-module-boundary-linkup-strategy.md`; `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md` |

---

## 1. Purpose

This addendum aligns PIT Stage 2 UX and wiring expectations with the ISMS/module boundary strategy introduced by PR #1850.

It is not implementation. It defines the required user-journey interpretation for future PIT correction work.

---

## 2. Replacement interpretation for PIT public entry

Any Stage 2 language describing a standalone PIT root landing journey must now be interpreted as a module-host or historical pre-boundary assumption.

The canonical user journey for PIT public entry is:

```text
ISMS landing `/`
  -> ISMS Project Implementation Tracker card
  -> ISMS `/marketing/project-implementation` for non-entitled users
  -> ISMS subscription / checkout
  -> ISMS authentication
  -> ISMS onboarding
  -> ISMS dashboard with PIT entitlement visible
  -> `/pit/tracker`
  -> PIT runtime shell
```

The PIT UX spec must not be used to justify a duplicate PIT-host public landing journey.

---

## 3. Screen ownership clarification

| Surface | UX owner | PIT obligation |
|---|---|---|
| `/` public landing | ISMS | Provide descriptor content only |
| `/modules` | ISMS | Provide descriptor content only |
| `/marketing/project-implementation` | ISMS | Provide PIT proposition content only |
| `/subscribe`, `/subscribe/checkout` | ISMS | Provide entitlement key/package requirement only |
| `/auth`, `/login`, onboarding | ISMS for shared platform shell | Consume authenticated state after handoff |
| `/dashboard` entitlement card | ISMS | Provide runtime entry route and expected entitlement key |
| `/pit/tracker` | PIT | Render protected runtime shell when entitled |
| PIT admin/QA routes | PIT inside shared shell | Respect shared role and entitlement context |

---

## 4. UX acceptance change for W8.2 correction

The W8.2 correction UX is not satisfied by rendering `/pit/tracker` in isolation.

The UX must prove that an entitled user can reach `/pit/tracker` from the canonical ISMS journey without falling back into subscription.

The red UX loop observed after PR #1847 is:

```text
ISMS dashboard says no entitlement
  -> user clicks PIT
  -> subscription page
  -> mock checkout/auth/onboarding
  -> dashboard still says no entitlement
  -> user clicks PIT
  -> subscription page again
```

This must remain RED until fixed by governed implementation.

---

## 5. Non-completion notice

This addendum does not close Stage 2, W8.2, or Stage 12. It only defines the PIT UX boundary that downstream QA-to-red and build work must obey.
