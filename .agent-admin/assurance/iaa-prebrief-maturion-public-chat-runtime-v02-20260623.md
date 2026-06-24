# IAA Pre-Brief - Maturion Public Chat Runtime v0.2

## Status Header

| Field | Value |
|---|---|
| Wave | Maturion Public Chat Runtime v0.2 |
| Repository | APGI-cmy/maturion-isms |
| Authority | CS2 - Johan Ras |
| Status | Pre-implementation assurance pre-brief |
| Date | 2026-06-23 |

---

## Scope

Upgrade `/api/v1/public-chat` from a bounded contract response to a server-side Maturion public guidance response.

---

## Assurance Focus

- Keep APW as public frontend only.
- Keep the endpoint public-guidance only.
- Do not access private tenant or workspace records.
- Do not modify Maturion agent contracts.
- Preserve response shape expected by APW: JSON with `answer`.

---

## Pre-Brief Disposition

Proceed to builder appointment under this boundary.
