# invoke-ai-parse-criteria — Supabase Edge Function

**Wave**: 15 / 15R  
**Architecture ref**: `modules/mat/02-architecture/system-architecture.md §4`  
**FRS**: FR-005 (criteria parsing pipeline), FR-103 (error surfacing)  
**Task**: T-W15-IMPL-001 / T-W15R-API-001, T-W15R-API-002

---

## Purpose

This Edge Function is the entry point for the Criteria Parsing Pipeline:

```
CriteriaUpload (UI) → invoke-ai-parse-criteria (Edge Fn) → AI Gateway /parse → DB write-back
                                                           (domains, mini_performance_standards, criteria)
```

It receives a document reference (`filePath`, `auditId`), generates a signed Supabase Storage URL, calls the AI Gateway `/parse` endpoint (GPT-4 Turbo extraction), and writes the resulting `domains → MPS → criteria` hierarchy back to the database.

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

# Verify health directly (replace <SUPABASE_ANON_KEY> with the actual key)
Invoke-RestMethod -Uri "https://ujucvyyspfxlxlfdamda.supabase.co/functions/v1/invoke-ai-parse-criteria/health" `
  -Headers @{ Authorization = "Bearer <SUPABASE_ANON_KEY>" }
```

**Required GitHub Secrets** (configured in repo settings):

| Secret | Description |
|--------|-------------|
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI authentication token |
| `SUPABASE_PROJECT_REF` | Project ref (`ujucvyyspfxlxlfdamda`) |
| `SUPABASE_ANON_KEY` | Anon key for health-check verification |
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
