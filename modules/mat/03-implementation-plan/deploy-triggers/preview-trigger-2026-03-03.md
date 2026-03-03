# Preview Deployment Trigger — 2026-03-03

This file triggers the `deploy-preview` job in `deploy-mat-vercel.yml`.

## Reason
PR #856 (Wave 13 Addendum — auth wiring fix) merged directly to `main` via a push event.
The `deploy-preview` job only fires on `pull_request` events, so no preview deployment occurred.
This PR re-triggers the preview deployment so the auth fix can be validated on a Vercel
preview URL before any further testing.

## Changes in this deployment
- `AuthContext.tsx` — new Supabase session provider
- `App.tsx` — wrapped with `QueryClientProvider`, `AuthProvider`, `ProtectedRoute`
- `LoginPage.tsx` — wired to real `supabase.auth.signUp` / `signInWithPassword`

## Evidence reference
- PR #856: https://github.com/APGI-cmy/maturion-isms/pull/856
- Wave 13 Addendum task: Task 13.A.1 / Task 13.A.2
- BUILD_PROGRESS_TRACKER.md — Wave 13 Addendum section
