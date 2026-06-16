# Issue 1815 MMM Vercel Ownership Evidence

Issue: 1815
Module: MMM
Lane: implementation

MMM owned app path: apps/mmm
MMM package: @maturion/mmm
MMM output directory: apps/mmm/dist
MMM Vercel project target: maturion-isms-mmm

Secret namespace used:
- MMM_VERCEL_PROJECT_ID
- MMM_VERCEL_ORG_ID
- MMM_VERCEL_TOKEN
- MMM_VERCEL_AUTOMATION_BYPASS_SECRET

Workflow trigger paths:
- apps/mmm/**
- .github/workflows/deploy-mmm-vercel.yml
- pnpm-lock.yaml

Non-owned paths removed from the MMM deploy trigger:
- api/**
- packages/ai-centre/src/**
- vercel.json

Preview smoke routes:
- /login
- /forgot-password
- /reset-password
- /onboarding
- /frameworks
- /frameworks/upload

Preview protection handling:
- If the MMM bypass secret exists, smoke requests use the bypass header and query string.
- If the bypass secret is absent, protected 401 or 403 responses are recorded as preview protection and not treated as route failure.
