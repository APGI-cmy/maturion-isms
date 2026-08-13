# Blocker: PIT W8.3 Disposable Supabase Environment Unavailable

**Date**: 2026-08-11T07:53:20Z  
**Agent**: qa-builder  
**Type**: BLOCKER  
**Severity**: CRITICAL  
**PR / Issue**: #1981 / #1974  
**Head**: `64b1eb1ca60dd2621d54766becac69c349a4bf5c`

## Blocker

Docker Desktop's `desktop-linux` engine returns HTTP 500 through
`//./pipe/dockerDesktopLinuxEngine`. A local Supabase environment cannot start,
so the authenticated Supabase and browser RED harnesses would fail in setup
rather than only for the missing W8.3 product capability.

## Evidence

```text
Command:
npx --yes supabase@2.39.2 start --debug

Output:
Supabase CLI 2.39.2
failed to inspect service: request returned 500 Internal Server Error for API route and version
http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.51/containers/supabase_db_ujucvyyspfxlxlfdamda/json,
check if the server supports the requested API version
```

```text
Command:
docker info

Output:
ERROR: request returned 500 Internal Server Error for API route and version
http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.55/info,
check if the server supports the requested API version
```

## Impact

The required 36-case zero-skip execution, real authenticated personas,
database state/cleanup proof, and browser flow proof cannot be produced.
No test run was started because it would be a harness/environment failure,
which is non-qualifying.

## Safe Remediation

Restore the local Docker Desktop Linux engine or provide credentials for an
already-authorized disposable Supabase project. Then re-run local Supabase
bootstrap and the full QA harness. Do not use production/shared Supabase,
skip environment validation, or use mocks as a substitute.
