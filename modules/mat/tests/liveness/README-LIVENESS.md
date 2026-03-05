# MAT Liveness Tests — README

> **Spec Authority**: `modules/mat/00-app-description/MAT_LIVENESS_TEST_SPEC.md` v1.0

## What Are Liveness Tests?

Liveness tests answer one question: **"Is the live, deployed MAT app alive and usable right now?"**

They are not unit tests. They are not integration tests. They run against a real deployed environment and walk through the actual user workflow step by step — from sign-up through to report download.

| Test Type | Question | When |
|-----------|----------|------|
| Unit | Does this function return the right value? | Every PR |
| Integration | Does this API respond correctly? | Every PR |
| **Liveness** | **Is the live app alive right now?** | **Post-deploy, on demand, continuously** |

## Test Files

| File | Coverage |
|------|----------|
| `mat-liveness.spec.ts` | AUTO checks — LV-00-xx through LV-10-xx (all `AUTO` type) |
| `mat-ai-health.spec.ts` | AI checks — LV-AI-xx and AI-dependent checks (LV-02-03, LV-06-02…10, LV-10-01/02) |
| `mat-visual.spec.ts` | VISUAL checks — LV-02-05, LV-03-06, LV-05-08, LV-07-04, LV-08-06 |

## Running Locally

### Prerequisites

```bash
# Install Playwright browsers (first time)
npx playwright install chromium
```

### Environment Variables

> ⚠️ **WARNING — Silent Test Misfires**
>
> | Variable | Fallback if NOT set | Risk |
> |----------|---------------------|------|
> | `BASE_URL` | `http://localhost:3000` | **Tests run against localhost, not production. All checks produce false PASSes/FAILs. Deploy liveness is NOT verified.** Set this to your actual deployment URL before running. |
> | `LIVENESS_TEST_PASSWORD` | `LivenessTest!2026` | Safe for local dev/test only. **Do NOT use the fallback in production or CI environments.** Always set explicitly via secrets. |
>
> **If `BASE_URL` is not set, liveness tests will NOT verify your deployed application.**

Copy `.env.example` to `.env.local` and populate:

```bash
# Required
BASE_URL=https://your-mat-deployment.vercel.app  # REQUIRED — no fallback for production use
LIVENESS_TEST_EMAIL=liveness@yourdomain.com
LIVENESS_TEST_PASSWORD=YourSecurePassword123!  # REQUIRED in CI — fallback exists for local dev only

# AI endpoint probes (required for mat-ai-health.spec.ts)
AI_GATEWAY_URL=https://your-ai-gateway/health
AI_DOC_PARSER_URL=https://your-ai-gateway/api/parse-document
AI_SCORING_URL=https://your-ai-gateway/api/score
AI_CHAT_URL=https://your-ai-gateway/api/chat
AI_REPORT_URL=https://your-ai-gateway/api/report

# AI latency thresholds (optional — defaults shown)
AI_WARN_THRESHOLD_MS=15000
AI_FAIL_THRESHOLD_MS=30000
AI_REPORT_TIMEOUT_MS=120000
```

### Run All Liveness Tests

> **Before running**: Verify `BASE_URL` and `LIVENESS_TEST_PASSWORD` are set in your environment.
> Run `echo $BASE_URL` to confirm. If empty, export them first or create `.env.local`.

```bash
# Run all AUTO checks
npx playwright test modules/mat/tests/liveness/mat-liveness.spec.ts

# Run AI health probes
npx playwright test modules/mat/tests/liveness/mat-ai-health.spec.ts

# Run VISUAL checks (requires human review of screenshots)
npx playwright test modules/mat/tests/liveness/mat-visual.spec.ts

# Run everything
npx playwright test modules/mat/tests/liveness/
```

### Run with Visible Browser (Headed Mode)

```bash
npx playwright test modules/mat/tests/liveness/ --headed
```

## Output

All screenshots are saved to `liveness-evidence/` (git-ignored):

```
liveness-evidence/
  LV-00-02-signup.png
  LV-01-01-dashboard.png
  LV-02-05-hierarchy.png
  LV-03-06-domain-card.png
  ... etc
```

## VISUAL Check Human Review

VISUAL checks (`mat-visual.spec.ts`) require human review. The automated test:
- Captures a screenshot
- Asserts it is non-blank (non-zero bytes, page body has content)

But a **human reviewer must inspect each screenshot** in `liveness-evidence/` before marking the liveness suite GREEN. Screenshots must confirm that:

- `LV-02-05`: Hierarchy cards show real domain/MPS/criteria structure (not loading state)
- `LV-03-06`: Domain card has a title, toggle control, and visual hierarchy
- `LV-05-08`: Evidence panel shows upload controls and any submitted evidence
- `LV-07-04`: Results table shows domain/MPS/criteria rows with ratings
- `LV-08-06`: Dashboard shows completion percentage and outstanding work items

## Wave-lv Gate

The file-existence gate at `modules/mat/tests/wave-lv/liveness-gate.test.ts` runs in Vitest (not Playwright) and verifies all liveness suite artifacts exist. Run it with:

```bash
npx vitest run modules/mat/tests/wave-lv/liveness-gate.test.ts
```

Expected: 9/9 GREEN once all liveness files are present.

## Reference

- **Spec**: `modules/mat/00-app-description/MAT_LIVENESS_TEST_SPEC.md`
- **UX Workflow**: `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md`
- **Future**: AMC Watchdog Panel (each check ID maps 1:1 to a row in the green/red ticklist)
