# APW Staging Verification Target and Operator Boundary v0.1

**Artifact ID**: APW-STAGING-TARGET-OPERATOR-BOUNDARY-001  
**Version**: 0.1.0  
**Status**: APPROVED FOR STAGING VERIFICATION ONLY  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-07-22

## Approved staging target

- Platform: Render
- Environment: staging only
- Gateway URL: `https://maturion-mat-ai-gateway-staging.onrender.com`
- Health URL: `https://maturion-mat-ai-gateway-staging.onrender.com/health`
- Public chat endpoint: `https://maturion-mat-ai-gateway-staging.onrender.com/api/v1/public-chat`
- Control: `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED`

## Operator boundary

The operator may:

1. Confirm the staging health endpoint returns `200 OK`.
2. Set the staging-only feature flag to `true`.
3. Redeploy or restart the staging service.
4. Execute the approved verification matrix.
5. Inspect safe route telemetry and public-safe outputs.
6. Restore the staging-only feature flag to `false`.
7. Redeploy or restart staging and prove rollback.

The operator may not:

- alter the production feature flag;
- deploy to the production Render service;
- change Vercel or Supabase configuration;
- expose secrets, environment values or credentials in evidence;
- authorize production activation;
- leave the staging flag enabled after the verification window without separate CS2 authorization.

## Stop and rollback rule

On any failed route, unsafe answer, telemetry concern, health failure or authority-boundary failure:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
```

Then redeploy or restart staging and confirm:

```text
apw_specialist_route=apw_integration_disabled
```

## Evidence boundary

Evidence may include timestamps, prompt category, exact test prompt, HTTP status, route, a short public-safe answer summary and redacted route telemetry. It must not contain secrets, tokens, credentials, environment values, private data or tenant data.
