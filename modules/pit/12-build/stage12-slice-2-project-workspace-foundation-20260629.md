# PIT Stage 12 Slice 2 - Project Workspace Foundation

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice | Slice 2 - Project Workspace Foundation |
| Status | OPENED FOR GOVERNED PLANNING - NOT IMPLEMENTED |
| Date opened | 2026-06-29 |
| Predecessor evidence | W8.2 boundary and entitlement handoff evidence accepted |
| Canonical host | `https://maturion-isms-portal.vercel.app` |
| Runtime entry | `/pit/tracker` |
| Initial runtime routes in scope for planning | `/projects`, `/projects/new` |

---

## 1. Purpose

This artifact opens the next governed PIT Stage 12 slice after acceptance of the W8.2 boundary and entitlement handoff evidence.

The previous slice established that the canonical ISMS journey can hand an entitled user into the PIT runtime shell without subscription loopback or duplicate PIT-host public acquisition behavior.

Slice 2 should now begin the actual PIT runtime workspace foundation beyond the shell.

---

## 2. Slice objective

Build a governed Project Workspace foundation for PIT that allows an entitled user to move from the PIT runtime entry shell into the first PIT project-management surfaces.

The initial runtime surfaces for planning are:

```text
/pit/tracker
/projects
/projects/new
```

This slice should establish the first usable project workspace shape without attempting to deliver the entire PIT module.

---

## 3. Product intent

The Project Implementation Tracker exists to manage security improvement projects, implementation activity, and evidence readiness.

The first runtime workspace must therefore help an entitled user understand:

- what PIT is tracking;
- what projects exist or can be created;
- what evidence/readiness state is expected later;
- which route is the current tracker landing;
- which actions are available now versus planned for later governed slices.

---

## 4. Proposed functional scope for Slice 2

Slice 2 should be planned around a small, evidence-friendly runtime foundation:

1. PIT runtime landing shell remains at `/pit/tracker`.
2. `/projects` renders a protected Project Register foundation instead of only a generic placeholder shell.
3. `/projects/new` renders a protected Create Project foundation instead of only a generic placeholder shell.
4. Both routes remain entitlement/auth protected through the shared ISMS shell.
5. The UI clearly states what is live in the slice and what remains future scope.
6. No Supabase write workflow is required unless separately approved.
7. No production billing/auth/onboarding changes are allowed.
8. No PIT-host public-acquisition behavior may be reintroduced.

---

## 5. Explicit non-scope

Slice 2 must not include:

- full project CRUD persistence unless separately authorized;
- Supabase schema or RLS changes unless a separate DB-scope artifact is created;
- billing, payment, subscription, auth, onboarding, or dashboard changes;
- MMM, Risk Management, RADAM, or other module runtime changes;
- AI provider calls;
- full report/evidence/audit lifecycle;
- W8.2 closure overclaims;
- full Stage 12 completion claim.

---

## 6. Required pre-build alignment before implementation

Before a builder implements Slice 2, the following must be created or updated:

- Slice 2 scope declaration;
- Slice 2 IAA pre-brief contract;
- Slice 2 builder appointment or builder reconfirmation;
- Slice 2 QA-to-Green criteria mapped to existing RED baseline rows;
- Slice 2 implementation plan checklist;
- Slice 2 evidence expectations;
- affected tracker note confirming that W8.2 boundary evidence was accepted and Slice 2 is now open for planning.

---

## 7. Candidate QA-to-Green criteria

The implementation PR for Slice 2 should be considered green only when evidence proves:

1. An entitled user can navigate from dashboard to `/pit/tracker`.
2. `/pit/tracker` provides a visible action/link to the Project Register or project workspace foundation.
3. `/projects` renders a PIT Project Register foundation without white screen or generic-only placeholder behavior.
4. `/projects/new` renders a PIT Create Project foundation without white screen or generic-only placeholder behavior.
5. Non-entitled direct access remains blocked or redirected predictably.
6. The PIT deployment host still redirects to the canonical ISMS host.
7. Existing admin/QA route protections do not regress.
8. The UI does not claim features that are not implemented in this slice.
9. Tests and build checks pass.
10. Production browser evidence is captured after deployment.

---

## 8. Governance boundary

Slice 2 is a PIT runtime slice after the ISMS entitlement handoff.

Therefore:

- PIT agent may work on PIT runtime surfaces if appointed;
- ISMS-owned public acquisition, subscription, auth, onboarding, dashboard entitlement, and module cards are out of scope;
- cross-module work requires a separate cross-module classification before implementation.

---

## 9. Builder classification recommendation

Recommended classification:

```text
PIT-only runtime slice
```

Recommended builder:

```text
pit-specialist
```

This recommendation must be confirmed through a formal builder appointment or reconfirmation before implementation.

---

## 10. Disposition

```text
PIT Stage 12 Slice 2 is opened for governed planning.
No implementation is performed by this artifact.
No Stage 12 completion or production readiness claim is made.
```
