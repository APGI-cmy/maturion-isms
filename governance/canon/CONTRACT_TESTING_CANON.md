# CONTRACT TESTING CANON

## Status
**Type**: Tier-1 Canonical Governance Standard
**Authority**: CS2 (Johan Ras)
**Version**: 1.0.0
**Effective Date**: 2026-02-26
**Owner**: Maturion Engineering Leadership (Johan Ras)
**Layer-Down Status**: PUBLIC_API
**Applies To**: All Foreman Instances, All Application Repositories, All Integration Points, All Builders, All QA/Audit Processes

---

## 1. Purpose

This document establishes **Contract Testing** as a mandatory governance requirement for all API and interface integration points across the Maturion platform, specifically including all AIMC (AI Module Coordinator) and consumer module integrations.

Contract testing exists to ensure:
- **Interface compatibility**: All integration contracts are explicitly defined and regression-proofed
- **Breaking-change prevention**: Automated detection of any breaking changes to published API surfaces before merge
- **Consumer confidence**: Consumer modules can rely on stable, versioned provider contracts
- **Integration governance**: No integration point operates without a documented, validated contract

**Canonical Gap Addressed**: Previously, no mandatory requirement existed for contract tests between AIMC and consumer module integrations. Integration failures could only be detected at the expensive E2E testing layer. This canon closes that gap by mandating contract tests at all architecture-defined integration points.

---

## 2. Constitutional Authority

This canon derives authority from and integrates with:

- **LIVING_AGENT_SYSTEM.md v6.2.0** — Supreme governance authority
- **BUILD_PHILOSOPHY.md** — One-Time Build Law: delivered means working 100%
- **FINAL_COMPLETE_WAVE_TEST_PROTOCOL.md** — FCWT integration requirements
- **COMBINED_TESTING_PATTERN.md** — CST/CWT integration testing model
- **ARCHITECTURE canon files** — Defined integration boundaries

---

## 3. Scope

### 3.1 Mandatory Coverage

Contract tests are **mandatory** for all of the following integration categories:

| Category | Examples | Mandatory Contract Tests |
|----------|----------|--------------------------|
| AIMC provider APIs | AIMC outbound endpoints, response shapes | YES — provider contract |
| Consumer module APIs | Module ingestion of AIMC data | YES — consumer contract |
| Cross-module REST/HTTP APIs | Service-to-service calls | YES — Pact or equivalent |
| Internal event/message contracts | Queue schemas, event payloads | YES — schema contract |
| External third-party API adapters | Payments, auth, integrations | YES — adapter contract |
| Configuration-driven schemas | Feature flag interfaces, config schemas | YES — schema contract |

### 3.2 Exclusions

The following are explicitly excluded from contract testing requirements (though still subject to unit/integration testing):

- Internal pure-function utility libraries with no external interface
- Presentation-only UI components with no data contract
- Private implementation details not exposed as integration points

---

## 4. Mandatory Requirements

### REQ-CT-001 — Contract Test Existence for All Integration Points

**Requirement**: Every architecture-defined integration point MUST have at least one contract test covering the nominal request/response shape.

**Evidence Required**: Contract test file present in the codebase; test passes in CI.

**Gate**: Pre-merge. No integration point may be merged to main without a corresponding contract test.

**Priority**: BLOCKING

---

### REQ-CT-002 — AIMC Provider Contract Tests

**Requirement**: All AIMC-provided API surfaces MUST have a provider-side contract test that:
1. Validates each endpoint's response schema against the published contract
2. Verifies all mandatory fields are present and correctly typed
3. Validates error response shapes (4xx, 5xx)
4. Is run as part of the AIMC module's CI pipeline on every PR

**Evidence Required**: Provider contract test suite; CI run showing all contracts PASS.

**Gate**: Pre-merge into AIMC codebase. BLOCKING.

---

### REQ-CT-003 — Consumer Module Contract Tests

**Requirement**: All consumer modules that ingest AIMC data MUST have a consumer-side contract test that:
1. Documents the data shape the consumer expects from AIMC
2. Validates the consumer handles the agreed contract shape correctly
3. Is independently runnable without a live AIMC instance (stub/mock allowed)
4. Is run in the consumer module's CI pipeline on every PR

**Evidence Required**: Consumer contract test file; CI run showing contracts PASS.

**Gate**: Pre-merge into consumer module codebase. BLOCKING.

---

### REQ-CT-004 — Breaking-Change Detection (Automated)

**Requirement**: The CI pipeline for any module exposing an API contract MUST include automated breaking-change detection. Specifically:

1. **Schema diff**: Any change to a response schema is diff'd against the current published contract
2. **Breaking change classification**: Field removals, type changes, and required-to-optional changes are classified as BREAKING
3. **Blocking gate**: Any detected BREAKING change blocks merge until the contract version is incremented and all consumers are notified via layer-down ripple
4. **Non-breaking changes**: Additive changes (new optional fields) are allowed without version bump but must be documented

**Tooling**: OpenAPI schema diff, Pact compatibility checks, JSON Schema diff, or equivalent — the specific tool is builder's choice subject to FM approval, but the gate is mandatory.

**Evidence Required**: Breaking-change detection run result in CI; no BREAKING changes unaddressed.

**Gate**: Pre-merge. BLOCKING for breaking changes.

---

### REQ-CT-005 — Contract Version Management

**Requirement**: All API contracts MUST carry an explicit version identifier. The following versioning rules apply:

1. **MAJOR version bump**: Required for any breaking change (field removal, type change, endpoint removal)
2. **MINOR version bump**: Required for additive changes (new optional field, new endpoint)
3. **PATCH version**: Internal implementation changes with no contract impact
4. **Version in contract file**: The version MUST appear in the contract definition file header
5. **Version in CANON_INVENTORY**: API contract files registered in CANON_INVENTORY MUST reflect the current version

**Evidence Required**: Contract file with explicit version header; version increment recorded in CHANGELOG.

---

### REQ-CT-006 — Contract Test Isolation

**Requirement**: Contract tests MUST be runnable in isolation — without requiring live downstream services, databases, or network access. Acceptable isolation mechanisms include:

1. Recorded interaction stubs (e.g., Pact provider stubs, WireMock, VCR cassettes)
2. In-memory mock providers
3. Snapshot-based contract validation

**Rationale**: Flaky tests caused by live-dependency availability undermine the contract testing gate. Contract tests must be deterministic and fast.

**Evidence Required**: Contract test suite passes in CI without external service dependencies.

---

### REQ-CT-007 — Request Validation Requirements

**Requirement**: Contract tests MUST cover the following request dimensions for each API endpoint:

1. **Nominal request**: Valid payload, expected response shape
2. **Missing required fields**: Returns appropriate validation error (4xx)
3. **Invalid field types**: Returns appropriate validation error (4xx)
4. **Authentication/authorization**: Unauthenticated requests return 401/403

**Evidence Required**: Test cases covering all four dimensions are present and passing.

---

### REQ-CT-008 — Contract Test Coverage Gate

**Requirement**: The following coverage thresholds apply to contract test suites:

| Integration Category | Minimum Endpoint Coverage |
|----------------------|--------------------------|
| AIMC outbound API | 100% of documented endpoints |
| Consumer ingestion paths | 100% of documented ingestion paths |
| Cross-module REST APIs | 100% of public endpoints |
| Event/message contracts | 100% of published event types |

**Evidence Required**: Coverage report from contract test run showing ≥ threshold.

**Gate**: Pre-merge. BLOCKING if below threshold.

---

### REQ-CT-009 — Contract Registry

**Requirement**: A central contract registry MUST exist within each application repository documenting:

1. All integration points the application exposes (provider contracts)
2. All integration points the application consumes (consumer contracts)
3. Current contract version for each
4. Link to the contract test file
5. Date of last validated run

**Format**: A `contracts/README.md` or equivalent documentation file is the minimum acceptable registry.

**Evidence Required**: Registry file present; all contracts listed are current.

---

### REQ-CT-010 — FCWT Contract Verification

**Requirement**: The Final Complete Wave Test (FCWT) MUST include an explicit contract verification step that:

1. Runs the full contract test suite (provider and consumer sides)
2. Confirms no breaking changes have been introduced since last release
3. Records contract test results in FCWT evidence artifacts
4. Confirms contract registry is up to date

**Evidence Required**: FCWT evidence artifact includes contract verification results showing all contracts PASS.

---

## 5. Integration with Gate Workflows

### 5.1 Pre-Merge Gate Integration

Contract test failures are **BLOCKING** pre-merge gates. The merge gate workflow MUST:

1. Run contract tests on every PR touching an integration-point module
2. Fail the gate if any contract test fails
3. Fail the gate if breaking-change detection finds unaddressed BREAKING changes
4. Report contract test results in the gate evidence section of the PR

### 5.2 CANON_INVENTORY Gate

Any PR adding or modifying a contract definition file MUST:

1. Update CANON_INVENTORY.json with the new/updated contract file entry
2. Include a full SHA256 hash (no placeholders)
3. Record the effective_date and version

### 5.3 Ripple Propagation

When a provider-side contract change is merged:

1. Layer-down ripple MUST be dispatched to all registered consumer repositories
2. Consumers MUST validate their consumer contract tests against the new provider version
3. Ripple status MUST be tracked in the governance ripple log

---

## 6. Tooling Guidance

The following tooling patterns are approved and recommended (builder selects subject to FM approval):

| Pattern | Recommended Tooling | Notes |
|---------|--------------------|----|
| Consumer-driven contracts | Pact framework | Industry standard; language-agnostic |
| OpenAPI contract validation | Spectral, openapi-diff | For REST APIs with OpenAPI specs |
| JSON Schema contracts | AJV, jsonschema | For event/message payloads |
| GraphQL contracts | graphql-schema-linter | For GraphQL APIs |
| gRPC contracts | Buf, protoc-gen-validate | For protobuf-based services |

**Minimum tooling requirement**: Any tool that satisfies REQ-CT-001 through REQ-CT-010 is acceptable. The tool MUST be deterministic, runnable in CI, and produce machine-readable pass/fail output.

---

## 7. Responsibility Matrix

| Role | Responsibility |
|------|---------------|
| Builder | Write and maintain contract tests; keep contract registry updated |
| Foreman (FM) | Approve tooling choice; verify contract gate compliance; evidence review |
| QA Agent | Validate contract test coverage during QA phases |
| governance-repo-administrator | Maintain this canon; track compliance across repos; execute ripple on updates |
| CS2 | Approve breaking changes to published API contracts |

---

## 8. Exception Process

If a team cannot comply with a specific requirement (REQ-CT-001 to REQ-CT-010), they MUST:

1. Create a documented exception request referencing the specific requirement
2. Get FM approval for a time-bounded exception (maximum 2 weeks)
3. Get CS2 approval if the exception extends beyond 2 weeks
4. Record the exception in the PR description and in the contract registry
5. Close the exception by the agreed date or escalate to CS2

No permanent exceptions are permitted without CS2 approval.

---

## 9. Enforcement

| Violation | Consequence |
|-----------|-------------|
| Integration point merged without contract test | BLOCKING — revert required |
| Breaking change merged without version bump | BLOCKING — revert + RCA required |
| Contract registry out of date | Merge gate FAIL |
| FCWT missing contract verification | FCWT INVALID — must re-run |
| Consumer merged without consumer contract test | BLOCKING — revert required |

---

## 10. Authority Reference

This document is part of the **Maturion Canonical Governance System**.

**Version**: 1.0.0
**Effective Date**: 2026-02-26
**Supreme Authority**: `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
**Approved By**: CS2 (Johan Ras)
**Maintained By**: governance-repo-administrator

All requirements in this document are **mandatory** unless explicitly noted as advisory. Violations of BLOCKING requirements prevent merge to main.

---

*Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | CONTRACT_TESTING_CANON.md v1.0.0*
