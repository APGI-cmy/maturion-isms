# PIT W8.3 Pre-Build Quality Plan and ECAP Evidence — PR #1972

## Foreman Quality Plan

### Scope verification

- Pre-build only: PASS
- No runtime React implementation: PASS
- No Supabase migration/RLS mutation: PASS
- No Vercel/Render change: PASS
- No implementation builder appointment: PASS
- Issue #1968 authority retained: PASS

### Authority-chain verification

- Scope declaration: present
- IAA pre-brief: present
- Bounded pre-build appointment: present
- App Description addendum: present
- UX/Wiring addendum: present
- FRS addendum: present
- TRS addendum: present
- Architecture addendum: present
- QA-to-RED contract: present
- Executable RED sentinel: present
- PBFAG addendum: present
- Stage 8 reconciliation: present

### Product-decision verification

- strict task parentage: represented
- no active descendants under cancelled parent: represented
- project-leader approval for transfers: represented
- atomic transfer/cancel and rollback: represented
- contextual subtree write scope: represented
- date validation and explicit exception: represented
- Archive/Cancel/Restore wording: represented
- MMM hierarchy mapping and lineage: represented
- AIMC-only draft suggestions: represented
- opt-in governed learning: represented
- shared MMM evidence assurance: represented
- future Incident Workflow boundary: represented

### QA quality verification

The RED package contains:

- 36 requirement-level RED cases;
- route and five-state coverage;
- anonymous and cross-tenant denial;
- sibling/subtree denial;
- stale-proposal and concurrent-change rejection;
- atomic rollback proof;
- audit immutability;
- MMM transformation and lineage;
- AI proposal/human acceptance and consent decline paths;
- shared evidence assurance without automatic progress;
- an executable Node test sentinel for missing route/schema/RPC capabilities.

The executable sentinel is intentionally excluded from the normal GREEN regression command until the W8.3 implementation lane is formally appointed. It is run explicitly as QA-to-RED evidence.

## ECAP administrative validation

ECAP confirms only administrative completeness and does not substitute for independent assurance.

| Check | Result |
|---|---|
| governing issue and PR identified | PASS |
| scope and exclusions explicit | PASS |
| pre-brief precedes substantive artifact chain | PASS |
| bounded appointment recorded | PASS |
| traceability from strategy to FRS/TRS/architecture/RED | PASS |
| no implementation or infrastructure mutation | PASS |
| no RED baseline weakening | PASS |
| later-wave boundaries retained | PASS |
| implementation appointment withheld | PASS |

## Remaining evidence before appointment GO

1. Run `node --test modules/pit/06-qa-to-red/executable/pit-w83-prebuild.red.test.mjs` on the PR head and retain the intended RED output.
2. Confirm existing normal regression checks remain GREEN.
3. Independent IAA reviews the frozen head against the pre-brief.
4. Resolve any IAA findings.
5. CS2 accepts the readiness disposition.

## Current recommendation

`PRE-BUILD ALIGNMENT SUBSTANTIVELY COMPLETE — QA CONTRACT COMPLETE — EXECUTABLE RED RUN AND FINAL IAA PENDING — IMPLEMENTATION BUILDER APPOINTMENT NO-GO`

---

## QA Builder Completion Addendum — Issue #1974

**QA builder**: `qa-builder` (appointed `e18eb8c`, Issue #1974)
**Addendum date**: 2026-07-27
**Branch head at addendum**: see commit pushed to `copilot/pit-w83-complete-executable-qa-to-red-inventory`

### Executable inventory completion

The QA builder has converted all 36 `PIT-RED-W83-001..036` contract IDs to executable RED tests.

| File | Tests | Status |
|---|---|---|
| `modules/pit/06-qa-to-red/executable/pit-w83-prebuild.red.test.mjs` | 8 sentinels | All RED — no harness errors |
| `modules/pit/06-qa-to-red/executable/pit-w83-red-contract.test.mjs` | 36 contract tests | All RED — no harness errors |
| `modules/pit/06-qa-to-red/executable/pit-w83-fixtures.mjs` | Fixtures | Actor identities, org/project stubs, MMM source, proposals |

### RED evidence — contract file

Command: `node --test modules/pit/06-qa-to-red/executable/pit-w83-red-contract.test.mjs`

```text
Tests: 36
Pass:  0
Fail:  36
```

Every failure names the unmet W8.3 capability.  No ENOENT, SyntaxError,
ERR_MODULE_NOT_FOUND or ReferenceError in output.

### RED evidence — sentinel file (preserved)

Command: `node --test modules/pit/06-qa-to-red/executable/pit-w83-prebuild.red.test.mjs`

```text
Tests: 8
Pass:  0
Fail:  8
```

### GREEN regression evidence

Command: `pnpm --filter isms-portal test:run`

```text
Test Files: 15 passed (15)
Tests:      127 passed (127)
```

No regression introduced.

### Inventory map

`modules/pit/06-qa-to-red/w83-executable-inventory-map.md` — one-to-one mapping of
all 36 contract IDs to executable tests with failing reason for each.

### CI workflow updated

`.github/workflows/pit-w83-prebuild-evidence.yml` — added `qa-to-red-contract` job
that runs the 36-case file, verifies all 36 IDs are present, checks for zero
harness errors, validates 0 passes, and uploads the raw RED log as an artifact.

### Updated ECAP checks

| Check | Result |
|---|---|
| 36-case executable inventory present | PASS |
| All 36 tests RED for intended missing capability | PASS |
| Zero harness/fixture/syntax failures | PASS |
| Existing 127-test regression GREEN | PASS |
| Inventory map document with one-to-one ID mapping | PASS |
| QP/ECAP updated with exact commands and results | PASS |
| CI workflow covers both sentinel and contract files | PASS |
| Implementation builder appointment withheld | PASS |

### Recommendation

`QA-TO-RED INVENTORY COMPLETE — 36/36 IDs EXECUTABLE AND RED — REGRESSION GREEN — SUBMIT FROZEN HEAD TO IAA`
