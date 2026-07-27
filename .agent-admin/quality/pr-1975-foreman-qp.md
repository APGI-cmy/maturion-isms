# Foreman Quality Plan Review — PR #1975

## Identity

- Repository: `APGI-cmy/maturion-isms`
- Pull request: `#1975`
- Governing issue: `#1974`
- Parent pre-build issue: `#1968`
- Carrier pre-build PR: `#1972`
- QA-builder appointment: `e18eb8c1f70fcdd96c6b8dea4ad8b4a2e676c966`
- Reviewed QA-builder head: `df1e554ff306ed1bcfd4550c80f029ce9416ea58`
- Foreman: AI-assisted Foreman for Johan Ras
- Review type: post-builder Quality Plan review

## Scope review

### Confirmed in scope

- 36-ID executable inventory map exists.
- `PIT-RED-W83-001..036` are individually named in an executable Node test file.
- Existing eight sentinels remain present.
- QA fixtures and QA-builder memory are committed.
- CI preserves expected-RED output and existing GREEN regression.
- No W8.3 production runtime, schema migration, RLS deployment or live environment change is introduced by the intended PIT QA files.

### Branch-integrity concern

PR #1975 is based on `main` rather than directly on the frozen PR #1972 head. Comparison with appointment commit `e18eb8c1f70fcdd96c6b8dea4ad8b4a2e676c966` shows unrelated governance and APW changes in the branch ancestry. The PIT QA files themselves are identifiable, but the final QA correction must be delivered through a clean branch based on the current PR #1972 head or retargeted so unrelated files are excluded from the merge boundary.

## Evidence reviewed

- PR #1975 head: `df1e554ff306ed1bcfd4550c80f029ce9416ea58`.
- CI workflow run `30270702281`: all three jobs successful.
- Existing regression: Vitest, route verification and integrated-shell build GREEN.
- Existing sentinel: 8/8 intended RED.
- New contract file: 36/36 intended RED.
- Inventory map: one-to-one ID mapping present.
- No open inline review threads were present when QP began.

## QP finding QP-W83-001 — required harness classes were not implemented

### Requirement

Issue #1974 and the approved QA-to-RED contract require:

- Supabase integration tests for RPC, RLS, transactions, rollback, stale proposals, audit immutability and tenant isolation;
- browser tests for routes, wizard states, invitation/approval surfaces and role-denied controls;
- network and database before/after evidence for denied and atomic mutation paths.

### Delivered state

The delivered `pit-w83-red-contract.test.mjs` is a static source-presence and regular-expression contract scanner. It checks for filenames, migration text and source patterns. The inventory map itself states that the tests do not use live Supabase connections or browser automation.

### Why this is insufficient

Static existence checks can prove that a future file, component, string or migration name is absent. They cannot execute or prove:

- authenticated and cross-tenant RLS denial;
- backend role enforcement against crafted requests;
- atomic multi-child transfer and cancellation;
- forced rollback with zero residue;
- stale proposal rejection under concurrency;
- append-only audit policy enforcement;
- invitation, wizard and modal behaviour in a rendered browser;
- UI-denied controls plus backend-denied network requests;
- five-state route behaviour.

Calling these behavioural, RLS, transaction or browser tests would therefore overstate the executable assurance provided.

### Required correction

The QA Builder must add executable harnesses appropriate to the approved contract, without implementing W8.3 product functionality:

1. **Supabase test harness**
   - isolated/local or dedicated test environment;
   - migrations/contracts loaded in a way that cleanly proves missing W8.3 schema/RPC capability;
   - authenticated personas for project leader, viewer, contextual owners and cross-tenant actor;
   - executable assertions for RLS, RPC denial, stale versioning, transaction rollback and audit immutability;
   - deterministic cleanup and zero-residue evidence.

2. **Browser test harness**
   - Playwright or the repository-standard browser harness;
   - route discovery and five-state coverage for W8.3 routes;
   - wizard, invitation preview, cancellation guard and approval workspace tests;
   - role-denied UI controls and crafted backend request denial;
   - failure must be due to missing W8.3 capability, not missing browser setup or broken fixtures.

3. **Inventory reconciliation**
   - map each of `PIT-RED-W83-001..036` to its actual harness;
   - static contract checks may remain as supplemental sentinels but may not substitute for required integration/browser cases;
   - record exact command, collected count, expected failure and zero harness errors for each suite.

4. **Clean branch boundary**
   - move or replay only the PIT QA changes onto a branch based on the current PR #1972 head;
   - exclude unrelated PR #1970/APW/governance files from the final QA merge boundary.

## QP status

| Gate | Result |
|---|---|
| appointment and scope traceability | PASS |
| 36-ID static executable inventory | PASS |
| existing sentinel preserved | PASS |
| existing regression GREEN | PASS |
| no PIT runtime implementation | PASS |
| required Supabase integration harness | FAIL |
| required browser/role harness | FAIL |
| atomic rollback and RLS execution evidence | FAIL |
| clean merge boundary into PR #1972 | FAIL |
| ready for ECAP | NO |
| ready for independent IAA | NO |
| ready to merge | NO |

## Foreman disposition

`QP FAIL — QA BUILDER CORRECTION REQUIRED — ECAP AND IAA WITHHELD — PR #1975 NOT READY TO MERGE`

The QA Builder remains appointed under Issue #1974 for this bounded correction. No W8.3 implementation authority is granted.