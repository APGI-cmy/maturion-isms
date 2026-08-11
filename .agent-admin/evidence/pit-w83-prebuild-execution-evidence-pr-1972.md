# PIT W8.3 Pre-Build Execution Evidence — PR #1972

## Identity

- Governing issue: `#1968`
- Pull request: `#1972`
- Evidence workflow: `PIT W8.3 Pre-Build Evidence`
- Workflow run: `30249666564`
- Tested head: `906230fab6494cfcc641462a1ff699dab85f6f29`
- Run date: 2026-07-27

## QA-to-RED execution

Command:

```text
node --test modules/pit/06-qa-to-red/executable/pit-w83-prebuild.red.test.mjs
```

Raw command result:

```text
Tests: 8
Pass: 0
Fail: 8
Cancelled: 0
Skipped: 0
Todo: 0
```

The command exited non-zero as intended. The workflow wrapper independently verified that the failures named the expected missing product capabilities and did not contain harness failures such as `ENOENT`, module-resolution errors, syntax errors or reference errors.

Confirmed missing-capability failures include:

- milestone route;
- deliverable route;
- task route;
- project settings route;
- hierarchy workspaces;
- W8.3 hierarchy migration;
- structural-change request/approval migration;
- atomic project-leader transfer-and-cancel RPC.

Workflow job result:

```text
W8.3 Intended RED Confirmed — SUCCESS
```

Preserved artifact:

- name: `pit-w83-red-sentinel`
- artifact id: `8646432951`
- digest: `sha256:1f0e23245e2561ebbf54ffa31ea9e6dbf3ad4e9b7a30616d351c9cd0f30e6d5c`
- retention: 30 days

## Existing normal regression verification

### Vitest

```text
Test files: 15 passed / 15
Tests: 127 passed / 127
Duration: 6.52 seconds
```

This includes the existing PIT project repository, persistence, route, access, host-policy and Slice 2 tests without regression.

### Route registry

```text
ISMS W7 route verification passed for 18 routes.
Protected route count: 4.
Canonical marketing route count: 7.
```

### Production build

```text
Vite production build: SUCCESS
Modules transformed: 1798
Build time: 3.81 seconds
```

The existing chunk-size advisory remains a non-failing build warning and is not introduced by this documentation/QA-design wave.

Workflow job result:

```text
Existing PIT Host Regression GREEN — SUCCESS
```

Preserved artifact:

- name: `pit-w83-normal-regression`
- artifact id: `8646445181`
- digest: `sha256:ed67ee28ef3fb268865af74dfb7562bb6cf01ac70f699384652fc28969434b15`
- retention: 30 days

## Lint configuration observation

The package script `ci:w7` currently invokes ESLint 9, but the repository does not contain an `eslint.config.js`, `.mjs` or `.cjs` file required by ESLint 9. The first evidence attempt therefore failed before testing the PR scope.

The final evidence workflow did not claim lint success. It executed the maintained functional regression layers directly:

- Vitest;
- route registry verification;
- production build.

The ESLint configuration gap is pre-existing repository debt and is not evidence of a W8.3 product regression. It should be repaired in a separately bounded tooling/governance wave and must not be silently described as GREEN.

## Evidence conclusion

- Intended executable RED baseline: **CONFIRMED for eight coarse W8.3 capability sentinels**.
- Existing functional regression: **GREEN**.
- Runtime implementation introduced by PR #1972: **NONE**.
- Evidence scope limitation: the complete 36-case W8.3 contract is not yet represented by 36 executable test cases.
