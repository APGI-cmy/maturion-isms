# PIT Stage 12 Slice 4 — Authenticated Deployed LFV Evidence

| Field | Value |
|---|---|
| Issue | #1943 |
| Pull request | #1952 |
| Date | 2026-07-23 |
| Environment | Vercel protected preview |
| Preview URL | `https://maturion-isms-portal-git-pit-stage12-1a1797-rassie-ras-projects.vercel.app` |
| GitHub Actions workflow run | `30006074390` |
| Workflow artifact | `pit-slice4-authenticated-lfv`, artifact ID `8563051604` |
| Tested deployment identity | `d5931ebf15d366cae02715904e85cc4fc0a0273b` |
| Actor | Governed authenticated `project_manager` test identity |
| Organisation | `b3f0cdf0-2f42-4f99-9d3b-f7b10f2772ce` |
| Result | PASS |

## Purpose

This record preserves the final deployed browser evidence for the Slice 4 acceptance boundary after the temporary PR-specific browser workflow is removed. It records observed runtime behavior; it does not claim that PIT or Stage 12 is complete.

## Preconditions verified

- The governed Supabase test identity authenticated successfully through the deployed login form.
- The identity had exactly one active organisation membership.
- The identity held the `project_manager` role for that organisation.
- Vercel Deployment Protection was passed using the ISMS Portal automation-bypass secret through request headers.
- The deployed client contained the public Supabase URL and publishable-key configuration.
- No service-role or privileged database credential was exposed to the browser.

## Browser journey and observed result

| Journey checkpoint | Observed result |
|---|---|
| Load protected preview login | PASS |
| Authenticate with governed project-manager identity | PASS |
| Open `/projects/new` | PASS |
| Submit a valid project | PASS |
| Navigate to `/projects/:id` | PASS |
| Render the persisted project-detail data state | PASS |
| Update the project name and description | PASS |
| Reload the project detail page | PASS — update survived reload |
| Open Project Register | PASS — updated record visible |
| Verify the record directly through the authenticated Supabase REST boundary | PASS |

Machine-readable result captured by the workflow:

```json
{
  "authenticated": true,
  "create": true,
  "detail": true,
  "updateSurvivedReload": true,
  "register": true,
  "projectId": "ae89ddd2-1656-4dd0-a1bc-dc8743a9b723",
  "projectName": "PIT Slice 4 LFV 30006074390 Updated",
  "previewUrl": "https://maturion-isms-portal-git-pit-stage12-1a1797-rassie-ras-projects.vercel.app",
  "headSha": "d5931ebf15d366cae02715904e85cc4fc0a0273b"
}
```

## Captured visual evidence

The retained workflow artifact contains:

- `00-login.png`;
- `00-after-login.png`;
- `00-create-route.png`;
- `01-create-project.png`;
- `02-created-detail.png`;
- `03-updated-detail.png`;
- `04-project-register.png`;
- `result.json`;
- `lfv-fixture.txt`.

The artifact expires according to GitHub Actions retention. This repository record therefore preserves the durable result, tested identities and acceptance disposition without embedding credentials or personal authentication data.

## Cleanup evidence

The generated project was removed from the bound Supabase project after evidence capture. The parent delete cascaded to its source link.

```json
{
  "residual_projects": 0,
  "residual_source_links": 0
}
```

No LFV project or source-link fixture remains in the database.

## Defects found and corrected during LFV

The LFV process correctly exposed and drove correction of these integration defects:

1. The browser workflow originally used the PIT-named Vercel bypass secret instead of the ISMS Portal-owned secret.
2. The login selector expected the stale label `Continue`; the deployed form uses `Sign in`.
3. The ISMS Portal deployment did not provide the public Supabase client configuration to its Vite build.
4. The portal build now routes through `apps/isms-portal/scripts/build-with-public-env.mjs`, which supplies the governed public defaults only when the corresponding environment variables are absent.

These were corrected without weakening authentication, RLS, deployment protection or fail-closed repository behavior.

## Exit disposition

Authenticated deployed Slice 4 LFV: **PASS**.

This evidence satisfies the positive create → detail → update → reload → register acceptance journey for Issue #1943. It does not satisfy unrelated Slice 3 evidence Issue #1944, later PIT hierarchy waves, full Stage 12 closure or PIT `FUNCTIONAL_PASS`.
