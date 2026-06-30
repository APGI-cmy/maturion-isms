# PIT Stage 12 Slice 2 Governance Pack Index

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution and Evidence |
| Slice | Slice 2 - Project Workspace Foundation |
| Issue | #1868 |
| Date | 2026-06-30 |
| Status | GOVERNANCE PACK STARTED |

---

## 1. Included artifacts

This governance pack starts Slice 2 with the following artifacts:

- `scope-declaration-20260630.md`
- `iaa-prebrief-contract-20260630.md`
- `builder-reconfirmation-20260630.md`
- `qa-to-green-criteria-20260630.md`
- `implementation-checklist-20260630.md`
- `evidence-expectations-20260630.md`

---

## 2. Confirmed slice scope

Slice 2 is confirmed as a PIT-only runtime slice focused on these routes:

```text
/pit/tracker
/projects
/projects/new
```

The purpose is to create the first Project Workspace Foundation beyond the existing PIT runtime shell.

---

## 3. Current status

```text
Governance pack started.
Implementation not started.
```

A separate implementation PR must be opened after this governance pack is accepted.

---

## 4. Boundary summary

- ISMS public acquisition, subscription, authentication, onboarding, dashboard, and entitlement handoff are out of scope.
- Supabase/RLS/database persistence is out of scope unless separately approved.
- PIT runtime surfaces are in scope only after entitlement handoff.
- PIT host redirect behavior must not regress.

---

## 5. Next action after merge

After this pack is reviewed and merged:

1. Open the Slice 2 implementation PR.
2. Builder acknowledges the governance pack.
3. Implement `/pit/tracker`, `/projects`, and `/projects/new` foundation surfaces.
4. Capture QA-to-Green evidence.
5. File final Slice 2 evidence disposition.
