# QA-to-RED — MMM Mode Verification False-Green and Preview Origin Hardening

## Authority

- Issue: #1948
- Affected workflow: `.github/workflows/mmm-live-dashboard-diagnosis.yml`
- Affected verifier: `scripts/mmm-live-dashboard-diagnosis/verify-mmm-modes.mjs`

## Live defect

The Mode A/B/C artifact recorded `FUNCTIONAL_PASS: no`, but the GitHub job passed because exit code `1` was remapped to success. The resolved browser destination was a Vercel dashboard/login origin, not the MMM application preview.

## Required RED tests

1. `https://vercel.com/login` is rejected as an MMM preview URL.
2. An unrelated `*.vercel.app` host is rejected.
3. A valid `maturion-isms-mmm*.vercel.app` host is accepted.
4. A redirect from the expected preview host to `vercel.com/login` fails with a clear host-mismatch error.
5. Pull-request preview resolution has no generic fallback URL.
6. Pull-request verification fails when no matching MMM deployment URL is found.
7. Verification exit code `0` maps to success.
8. Verification exit codes `1` and `2` map to failure.
9. Artifact upload and PR summary/comment steps remain guarded by `if: always()`.

## Acceptance boundary

The check is green only when the verifier produces `FUNCTIONAL_PASS: yes` and exits `0`. Browser-console diagnostics alone do not decide pass/fail, but they may not mask failed mode or dashboard assertions.

## Non-scope

- MMM product runtime
- descriptor-generation logic
- Supabase schema or RLS
- edge-function behaviour
- Vercel project settings
- unrelated workflows
