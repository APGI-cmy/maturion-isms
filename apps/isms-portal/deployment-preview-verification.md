# ISMS Real Preview Deploy Verification

Date: 2026-06-16
Issue: #1817

This marker file intentionally lives under `apps/isms-portal/**` so the ISMS-only Vercel workflow path filter runs without changing application behavior.

Expected verification for this PR:

- `Build ISMS Portal` passes.
- `Deploy ISMS Preview` detects the app-specific ISMS Vercel secrets.
- The workflow performs a real Vercel preview deployment instead of the previous missing-secret skip path.
- ISMS route smoke tests run against the preview URL.

This file may be retained as deployment evidence or removed in a later cleanup after real preview proof is recorded.
