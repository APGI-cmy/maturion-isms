# invoke-ai-parse-criteria — Supabase Edge Function

**Wave**: 15 / 15R / 20  
**Architecture ref**: `modules/mat/02-architecture/system-architecture.md §4`  
**FRS**: FR-005 (criteria parsing pipeline), FR-103 (error surfacing)  
**Task**: T-W15-IMPL-001 / T-W15R-API-001, T-W15R-API-002 / T-W20-001

---

## Purpose

This Edge Function is the entry point for the Criteria Parsing Pipeline:

```
CriteriaUpload (UI) → invoke-ai-parse-criteria (Edge Fn) → AI Gateway /parse → atomic DB write-back
                                                           (parse_write_back_atomic RPC)
```

It receives a document reference (`filePath`, `auditId`), generates a signed Supabase Storage URL, calls the AI Gateway `/parse` endpoint (GPT-4 Turbo extraction), and writes the resulting `domains → MPS → criteria` hierarchy back to the database using the `parse_write_back_atomic` PostgreSQL RPC — a single, atomic transaction that prevents orphaned partial data on failure.

---

## DB Write-Back — Atomic RPC (Wave 20)

All domain, MPS, and criteria rows are written in a **single atomic PL/pgSQL transaction** via `parse_write_back_atomic`. If any step fails, PostgreSQL automatically rolls back all prior inserts, ensuring no orphaned rows are left in the database.

The RPC also stamps `criteria_documents.status = 'pending_review'` on success.

Descriptor writes (`domain_level_descriptors`, `mps_level_descriptors`, `criteria_level_descriptors`) are performed as separate upserts after the atomic RPC, as they are not included in the core hierarchy transaction. See [Descriptor Write-Back Atomicity](#descriptor-write-back-atomicity) below.

### Migration requirements

| Migration | Purpose |
|-----------|---------|
| `20260317000003_parse_write_back_atomic_rpc.sql` | Creates the `parse_write_back_atomic` RPC function (Wave 19) |
| `20260318000001_fix_parse_write_back_atomic_status.sql` | Fixes status value (`pending_review`), adds `service_role` support, grants `service_role` EXECUTE (Wave 20) |

Both migrations must be applied before deploying this Edge Function version.

---

## Re-Parse Semantics

The `parse_write_back_atomic` RPC uses `ON CONFLICT DO NOTHING` for criteria inserts. This has important implications for re-parse workflows:

- **First parse**: all domain, MPS, and criteria rows are inserted; `criteria_inserted` equals the number of extracted criteria.
- **Re-parse of identical document**: the domain / MPS rows conflict on `(audit_id, name/number)` and are silently skipped; `criteria_inserted` will be **0**. This is expected and correct — the data is already in the database.
- **Assertion guard**: the Edge Function checks `domains_inserted == 0 AND mps_inserted == 0 AND criteria_inserted == 0` and throws a parse-failure error. **Re-parsing an identical document is currently treated as a failure** — this is a known limitation, not intentional design. Operators should not re-parse already-ingested documents until this is resolved.
- **Partial re-parse** (e.g. new criteria added to an existing document): new rows are inserted; existing rows are silently skipped. Insert counts reflect only the newly added rows.

> **Wave 21+ improvement**: Extend the RPC to return an `already_exists` flag or counts of skipped rows, so callers can distinguish a genuine re-parse no-op from an empty AI result.

---

## Descriptor Write-Back Atomicity

`domain_level_descriptors`, `mps_level_descriptors`, and `criteria_level_descriptors` are written via sequential upserts **after** the `parse_write_back_atomic` RPC returns. This is a deliberate architectural decision confirmed in Wave 20:

| Concern | Decision |
|---------|---------|
| Core hierarchy atomicity | Enforced — domains / MPS / criteria are written inside a single PL/pgSQL transaction via the RPC. |
| Descriptor atomicity | **Not enforced** — descriptors are non-critical enrichment data written outside the transaction. |
| Failure handling | Descriptor failures are non-fatal. They are logged to `audit_logs` with `outcome='partial_success'` and surfaced to operators. The core hierarchy remains committed. |
| Rationale | Descriptors are not required for audit scoring or criteria review. Including them in the transaction would increase transaction scope and rollback risk for non-critical data. |

> **Wave 21+ review note**: As the system matures and descriptors become more central to scoring, consider whether to include descriptor writes in the atomic transaction or to introduce a separate compensating transaction pattern.

---

## Post-RPC Re-Query Round-Trips

After the atomic RPC call, the Edge Function performs **2–3 additional DB round-trips** to recover the UUIDs of inserted rows before writing descriptors:

1. Re-query `domains` for `(id, name, number)` — builds `domainMap`
2. Re-query `mini_performance_standards` for `(id, number, domain_id)` — builds `mpsMap`
3. Re-query `criteria` for `(id, number)` — builds `criteriaNumberToId`

This is necessary because `parse_write_back_atomic` returns insert counts only, not the inserted row IDs.

The pattern is functional and well-documented, but adds latency on large documents (100+ criteria). **Wave 21+ improvement**: extend the RPC to return inserted row IDs alongside counts (e.g. as JSONB arrays), eliminating these re-queries.

---

## Endpoints

### `GET /health`

Deployment health-check. Returns HTTP 200 with:
```json
{ "status": "healthy", "function": "invoke-ai-parse-criteria" }
```

Use this to verify the function is deployed and reachable.

### `POST /`

Parse a compliance document.

**Request body**:
```json
{
  "auditId": "<uuid>",
  "filePath": "<path in audit-documents storage bucket>"
}
```

**Response (200)**:
```json
{
  "success": true,
  "domains_inserted": 5,
  "mps_inserted": 25,
  "criteria_inserted": 142,
  "needs_human_review": false,
  "ldcs_document": true
}
```

**Error response (400 / 500)**:
```json
{
  "error": "<message>",
  "code": "MISSING_FILE_PATH | MISSING_AUDIT_ID | PARSE_FAILED"
}
```

---

## Required Environment Variables (Supabase Secrets)

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_GATEWAY_URL` | **YES** | Internal URL of the `mat-ai-gateway` service (e.g. `https://mat-ai-gateway.example.com`) |
| `SUPABASE_URL` | **YES** | Supabase project URL (auto-provided by Supabase Edge Runtime) |
| `SUPABASE_SERVICE_ROLE_KEY` | **YES** | Service role key for DB write-back (auto-provided by Supabase Edge Runtime) |

> **INC-WAVE15-PARSE-001 Root Cause**: `AI_GATEWAY_URL` was not set in Supabase project secrets, causing all parse invocations to silently fail with `AI_GATEWAY_URL environment variable is not set`.

At function startup, the following log line is emitted to confirm configuration:
```
[invoke-ai-parse-criteria] AI_GATEWAY_URL configured: YES   ← correct
[invoke-ai-parse-criteria] AI_GATEWAY_URL configured: NO (MISSING)  ← misconfigured
```

---

## Deployment Instructions

### Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed and authenticated
- Access to the Supabase project (`supabase link --project-ref <PROJECT_REF>`)

### 1. Link the Supabase project (if not already linked)

```bash
supabase link --project-ref <YOUR_PROJECT_REF>
```

### 2. Set required secrets

```bash
supabase secrets set AI_GATEWAY_URL=https://<your-mat-ai-gateway-host>
```

Verify secrets are set:
```bash
supabase secrets list
```

### 3. Deploy the function

```bash
supabase functions deploy invoke-ai-parse-criteria
```

### 4. Verify deployment

```bash
# Health check (replace <PROJECT_REF> and <ANON_KEY> with your values)
curl https://<PROJECT_REF>.supabase.co/functions/v1/invoke-ai-parse-criteria/health \
  -H "Authorization: Bearer <ANON_KEY>"
```

Expected response:
```json
{"status":"healthy","function":"invoke-ai-parse-criteria"}
```

### 5. Check startup logs

In the Supabase dashboard → Edge Functions → `invoke-ai-parse-criteria` → Logs, confirm:
```
[invoke-ai-parse-criteria] AI_GATEWAY_URL configured: YES
```

If you see `NO (MISSING)`, re-run step 2.

---

## CI/CD Auto-Deploy

The Edge Function is automatically deployed via `.github/workflows/deploy-mat-edge-functions.yml` when:
- Any file under `supabase/functions/` is merged to `main`

**Manual deploy (CS2 PowerShell)**:
```powershell
# Trigger via GitHub CLI
gh workflow run deploy-mat-edge-functions.yml --repo APGI-cmy/maturion-isms

# Check status
gh run list --workflow=deploy-mat-edge-functions.yml --repo APGI-cmy/maturion-isms --limit 3

# Verify health directly (unauthenticated health check)
Invoke-RestMethod -Uri "https://ujucvyyspfxlxlfdamda.supabase.co/functions/v1/invoke-ai-parse-criteria/health"
```


**Required GitHub Secrets** (configured in repo settings):

| Secret | Description |
|--------|-------------|
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI authentication token |
| `SUPABASE_PROJECT_REF` | Project ref (`ujucvyyspfxlxlfdamda`) |
| `MATURION_BOT_TOKEN` | Repo checkout token (per token governance policy) |

---

## Security Notes

- **SSRF mitigation**: The AI Gateway URL is read exclusively from the `AI_GATEWAY_URL` environment variable; it is never supplied by the request body. URL format is validated (must start with `http://` or `https://`).
- **Signed URLs**: Document content is accessed via short-lived signed Supabase Storage URLs (5-minute TTL). No raw user-supplied URLs are fetched externally.
- **Audit trail**: Every parse invocation (success or failure) is logged to the `audit_logs` table.

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `AI_GATEWAY_URL environment variable is not set` | `AI_GATEWAY_URL` secret missing | `supabase secrets set AI_GATEWAY_URL=...` + redeploy |
| `AI Gateway returned 5xx` | AI Gateway service down / unreachable | Check `mat-ai-gateway` deployment; verify internal networking |
| `Failed to create signed URL` | `filePath` not found in `audit-documents` bucket | Verify file was uploaded before invoking the function |
| Function returns 404 (not found) | Function not deployed | Run `supabase functions deploy invoke-ai-parse-criteria` |
| `NO (MISSING)` in startup logs | Secret not propagated | Re-set secret and redeploy |
