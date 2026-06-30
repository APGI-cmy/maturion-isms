# PIT Stage 12 Slice 2 Scope Declaration

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice | Slice 2 - Project Workspace Foundation |
| Issue | #1868 |
| Status | SCOPE CONFIRMED - PRE-BUILD GOVERNANCE STARTED |
| Date | 2026-06-30 |
| Classification | PIT-only runtime slice |
| Recommended builder | `pit-specialist` |
| Canonical host | `https://maturion-isms-portal.vercel.app` |
| Predecessor evidence | W8.2 boundary and entitlement handoff evidence accepted |

---

## 1. Scope decision

Slice 2 is confirmed as a PIT-only runtime slice after the ISMS entitlement handoff.

The slice objective is to create the first Project Workspace Foundation so an entitled user can move beyond the PIT runtime shell into the initial project workspace surfaces.

This slice does not reopen the ISMS/PIT boundary work completed through PR #1865 and accepted through PR #1869.

---

## 2. Routes in scope

The following routes are in scope:

```text
/pit/tracker
/projects
/projects/new
```

Expected direction:

- `/pit/tracker` becomes a practical PIT landing/workspace hub rather than a shell-only endpoint.
- `/projects` becomes a Project Register foundation.
- `/projects/new` becomes a Create Project foundation.

---

## 3. Functional scope

Slice 2 may implement:

1. Runtime navigation from `/pit/tracker` to the project workspace surfaces.
2. A Project Register foundation at `/projects`.
3. A Create Project foundation at `/projects/new`.
4. Clear state messaging that identifies what is functional now and what remains governed future scope.
5. Entitlement/auth protection inherited from the existing ISMS shell context.
6. Non-persistent draft/project-form UI only, unless a separate data-scope artifact is approved before build.
7. Browser evidence and tests proving the surfaces render without white screen or generic-only placeholder behavior.

---

## 4. Explicit non-scope

Slice 2 must not include:

- full project CRUD persistence;
- Supabase schema or RLS changes;
- production database writes;
- billing, subscription, checkout, authentication, onboarding, dashboard, or public marketing changes;
- PIT deployment-host public acquisition changes;
- MMM, Risk Management, RADAM, or other module runtime changes;
- AI provider calls;
- full report/evidence/audit lifecycle;
- full Stage 12 completion claim;
- production readiness, release readiness, functional pass, or handover completion claims.

---

## 5. Boundary controls

The following controls remain active:

- ISMS remains the canonical public acquisition and entitlement handoff host.
- PIT runtime remains canonical under the ISMS host.
- PIT deployment host must continue redirecting to the canonical ISMS host.
- Any change to ISMS-owned surfaces requires separate cross-module classification.

---

## 6. Build eligibility

Implementation may not begin until the Slice 2 governance pack includes:

- this scope declaration;
- IAA pre-brief contract;
- builder appointment or builder reconfirmation;
- QA-to-Green criteria;
- implementation checklist;
- evidence expectations;
- PR/issue linkage back to #1868.

---

## 7. Disposition

```text
Slice 2 scope is confirmed for governed planning.
No implementation is performed by this artifact.
```
