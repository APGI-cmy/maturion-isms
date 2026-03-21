---
title: "Governance Watchdog Canon"
version: 1.0.1
status: Canonical
created: 2026-03-04
authority: CS2 (Johan Ras)
canon_id: GOVERNANCE_WATCHDOG_CANON
category: canon
tags: [governance, watchdog, pre-brief, IAA, automation, gap-detection, proactive-assurance]
source_strategy: maturion/strategy/GOVERNANCE_WATCHDOG_DEPLOYMENT_STRATEGY.md
source_strategy_version: 1.1.0
related:
  - governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md
  - governance/canon/IAA_PRE_BRIEF_PROTOCOL.md
  - governance/canon/AGENT_HANDOVER_AUTOMATION.md
  - governance/canon/UNIVERSAL_FAIL_ONLY_ONCE_POLICY.md
  - governance/canon/WATCHDOG_AUTHORITY_AND_SCOPE.md
---

# GOVERNANCE WATCHDOG CANON

**Type**: Canonical Governance Requirements  
**Canon ID**: GOVERNANCE_WATCHDOG_CANON  
**Authority**: Johan Ras (CS2)  
**Status**: Canonical  
**Version**: 1.0.1  
**Effective Date**: 2026-03-04  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Maturion repositories under governance  
**Source Strategy**: `maturion/strategy/GOVERNANCE_WATCHDOG_DEPLOYMENT_STRATEGY.md` v1.1.0

> **Amendment Authority**: Only CS2 (Johan Ras / repo owner) may amend this canon. Any PR
> modifying this file without CS2 sign-off is auto-FAIL at the merge gate.

---

## Canonisation Rationale

This document was promoted from `maturion/strategy/GOVERNANCE_WATCHDOG_DEPLOYMENT_STRATEGY.md`
following completion of Phase 1 production validation in `APGI-cmy/maturion-isms`:

- Reference implementation deployed and all three gap detectors (Gaps 1–3) confirmed to fire correctly
- Alert text validated against current Foreman and IAA agent contracts
- No confirmed false positives blocking agents
- CS2 (Johan Ras) authorised canonisation via issue

The source strategy document is preserved as the rationale layer. This canon document extracts the
normative requirements (MUST/SHALL obligations) from the strategy and elevates them to binding canon.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Constitutional Mandate](#2-constitutional-mandate)
3. [Scope — What MUST Be Deployed](#3-scope--what-must-be-deployed)
4. [Gap 1 Requirements — Branch Without PR](#4-gap-1-requirements--branch-without-pr)
5. [Gap 2 Requirements — Ready With No Pre-Brief](#5-gap-2-requirements--ready-with-no-pre-brief)
6. [Gap 3 Requirements — PENDING Token at Handover](#6-gap-3-requirements--pending-token-at-handover)
7. [Deployment Prerequisites](#7-deployment-prerequisites)
8. [Adaptation Requirements](#8-adaptation-requirements)
9. [Integration Requirements](#9-integration-requirements)
10. [Exemption Requirements](#10-exemption-requirements)
11. [Operational Constraints](#11-operational-constraints)
12. [Phase 1 Validation Evidence](#12-phase-1-validation-evidence)
13. [Version History](#13-version-history)

---

## 1. Purpose

This document formally defines the **Governance Watchdog** as a mandatory automated gap detection
system for all Maturion repositories under governance that operate the Living Agent System.

The Governance Watchdog:
- Detects governance gaps **at the moment they occur**, before they reach the merge gate
- Posts structured `@copilot` alert comments with exact remediation steps
- Operates as Layer 4 in the proactive assurance architecture
- Is complementary to, and does not replace, any existing gate workflow

**Position in the proactive assurance architecture**:
```
Layer 1 — Agent contract (Foreman Phase 0) ........... Instructs the Foreman what to do
Layer 2 — iaa-prebrief-inject.yml .................... Triggers IAA pre-brief on wave-current-tasks push
Layer 3 — merge-gate-interface.yml ................... Enforces evidence at the merge gate
Layer 4 — governance-watchdog.yml (THIS CANON) ....... Catches gaps mid-wave, before the gate
```

---

## 2. Constitutional Mandate

This canon derives authority from and implements:
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** — Defines governance as canonical memory and control system
- **UNIVERSAL_FAIL_ONLY_ONCE_POLICY.md** — Per-agent FAIL-ONLY-ONCE registries are the root cause for all three gaps
- **INDEPENDENT_ASSURANCE_AGENT_CANON.md** — IAA mandate, pre-brief protocol, ASSURANCE-TOKEN ceremony
- **IAA_PRE_BRIEF_PROTOCOL.md** — Pre-brief trigger conditions, Phase 0 obligations
- **AGENT_HANDOVER_AUTOMATION.md** — PREHANDOVER proof convention, pre-handover merge gate parity
- **WATCHDOG_AUTHORITY_AND_SCOPE.md** — Independent Watchdog authority boundaries

---

## 3. Scope — What MUST Be Deployed

**REQ-GWC-001**: Every consumer repository operating the Living Agent System MUST deploy
`governance-watchdog.yml` as a GitHub Actions workflow in `.github/workflows/`.

**REQ-GWC-002**: The deployed workflow MUST implement all three gap detectors defined in §§4–6.
Partial deployment (fewer than three gaps) is not permitted.

**REQ-GWC-003**: The deployed workflow MUST be adapted per §8 before deployment to the target
repository. Deploying the reference implementation without adaptation is prohibited.

**REQ-GWC-004**: The Governance Watchdog is a **detection-only** system. It MUST NOT block
pushes, DRAFT→Ready transitions, or any other GitHub event. Blocking belongs exclusively to
`merge-gate-interface.yml`.

---

## 4. Gap 1 Requirements — Branch Without PR

### 4.1 Trigger Condition

**REQ-GWC-101**: The watchdog MUST fire Gap 1 on every `push` event to a non-default-branch that
has no open pull request targeting the default branch.

### 4.2 Detection Obligation

**REQ-GWC-102**: When Gap 1 fires, the watchdog MUST post a non-blocking alert on the pushed
SHA (via commit status using `statuses: write`, or a check run using `checks: write`)
instructing the Foreman to open a PR immediately, with the rationale that the IAA pre-brief
injection (`iaa-prebrief-inject.yml`) cannot post an alert without an associated PR. This
mechanism MUST be implementable under the least-privilege permissions defined in §7.4 and
MUST NOT require `contents: write`.

### 4.3 All-Governance-Files Guard

**REQ-GWC-103**: Gap 1 MUST be suppressed when every file changed in the push is under a
pure governance path (`.agent-workspace/`, `.agent-admin/`, `governance/`). Mixed commits
(governance + non-governance files) MUST still trigger Gap 1.

### 4.4 Mandatory Branch Exemptions

**REQ-GWC-104**: The following branch patterns MUST be exempt from Gap 1 (no alert posted):
- Branches with prefix `governance/` — governance and liaison branches
- Branches with prefix `ripple-` — ripple execution branches
- Branch named `governance-alignment` — automated alignment branches
- Branches with prefix `dependabot/` — dependency update branches

**REQ-GWC-105**: Additional repo-specific exemptions MAY be added per the adaptation checklist
(§8), but the mandatory exemptions in §4.4 MUST be preserved.

### 4.5 FAIL-ONLY-ONCE Roots

| Rule | Failure Pattern |
|---|---|
| Foreman A-003 | Foreman commits implementation before opening a PR, causing pre-brief injection to miss the PR |

---

## 5. Gap 2 Requirements — Ready With No Pre-Brief

### 5.1 Trigger Condition

**REQ-GWC-201**: The watchdog MUST fire Gap 2 on the `pull_request: ready_for_review` event —
the instant a DRAFT → Ready transition occurs on any non-exempt PR.

### 5.2 Detection Obligation

**REQ-GWC-202**: When Gap 2 fires, the watchdog MUST check whether a pre-brief artifact file
matching the pattern `.agent-admin/assurance/iaa-prebrief-wave*.md` (or the adapted pattern per §8)
exists on the branch at the moment of the DRAFT → Ready transition.

**REQ-GWC-203**: If no pre-brief artifact is found, the watchdog MUST post a PR comment that:
- Directly invokes `@copilot` as IAA with full Phase 0 obligations
- References the current `wave-current-tasks.md` snippet (if available on the branch)
- Specifies the exact pre-brief artifact path to generate

### 5.3 Mandatory PR Exemptions

**REQ-GWC-204**: The following PR patterns MUST be exempt from Gap 2 (no alert posted):
- PR title contains `ripple:` (case-insensitive) — liaison ripple PRs
- PR title contains `[WIP] Update governance artifacts` — governance maintenance PRs
- PR carries both `governance` and `automated` labels — automated alignment PRs
- PR carries the `agent:liaison` label — liaison-authored PRs

**REQ-GWC-205**: Additional repo-specific exemptions MAY be added per §8, but the mandatory
exemptions in §5.3 MUST be preserved.

### 5.4 FAIL-ONLY-ONCE Roots

| Rule | Failure Pattern |
|---|---|
| IAA A-006, A-014 | Foreman marks PR ready without invoking IAA pre-brief |
| Foreman A-014 | Detected at merge gate too late, causing REJECTION-PACKAGE and wave rework |

---

## 6. Gap 3 Requirements — PENDING Token at Handover

### 6.1 Trigger Condition

**REQ-GWC-301**: The watchdog MUST fire Gap 3 on the `pull_request: synchronize` event — every
push to an open PR — when all of the following conditions are simultaneously true:
1. A `PREHANDOVER*.md` file (or adapted pattern per §8) was modified in the push
2. The file contains `iaa_audit_token: PENDING` or has no `iaa_audit_token` field
3. The PR description or latest commit message contains at least one handover keyword (§6.2)

### 6.2 Mandatory Handover Keywords

**REQ-GWC-302**: The following keywords MUST be detected in the PR description or commit message
to satisfy condition 3 of §6.1. The keyword list represents the minimum set; additional keywords
MAY be added per §8:
- `session summary`
- `wave closure`
- `WAVE CLOSED`
- `phase complete`
- `handover`
- `PREHANDOVER`
- `ready for review`
- `merge ready`

### 6.3 Detection Obligation

**REQ-GWC-303**: When Gap 3 fires, the watchdog MUST post a PR comment citing FAIL-ONLY-ONCE
rules A-014 and A-021 with the exact four-step remediation sequence (invoke IAA, await
ASSURANCE-TOKEN, record token, re-push).

### 6.4 Idempotency Guard

**REQ-GWC-304**: Before posting a Gap 3 alert, the watchdog MUST check the last 20 PR comments
for an existing `GOVERNANCE WATCHDOG — IAA Token Missing` alert. If such an alert is found within
the last 5 comments, no new alert MUST be posted. This guard prevents push-flood spam while
ensuring the first occurrence is always captured.

### 6.5 FAIL-ONLY-ONCE Roots

| Rule | Failure Pattern |
|---|---|
| IAA A-021, A-025 | Foreman pushes PREHANDOVER proof with PENDING token and closure language |
| Foreman A-014 | Foreman declares completion without IAA token; IAA issues REJECTION-PACKAGE |
| IAA A-027 | Systemic gap: same branch fails 3+ times consecutively |

---

## 7. Deployment Prerequisites

### 7.1 Required Workflows

**REQ-GWC-401**: Before deploying the Governance Watchdog, the following workflows MUST be present
in the target repository:

| Workflow | Purpose | Requirement |
|---|---|---|
| `iaa-prebrief-inject.yml` | Pre-brief injection on `wave-current-tasks.md` push | MUST be deployed before watchdog |
| `merge-gate-interface.yml` | Final evidence enforcement at PR merge | MUST be deployed before watchdog |

### 7.2 Required Directory Structure

**REQ-GWC-402**: The following paths MUST exist in the target repository (may be empty):

| Path | Purpose |
|---|---|
| `.agent-admin/assurance/` | Pre-brief artifact storage |
| `.agent-workspace/foreman-v2/personal/` | Foreman's `wave-current-tasks.md` location |

### 7.3 Required Agent Contract Conventions

**REQ-GWC-403**: The Foreman agent contract in the target repository MUST include:
- **Phase 0** — Pre-Brief Invocation section referencing `IAA_PRE_BRIEF_PROTOCOL.md`
- **PREHANDOVER proof** convention with `iaa_audit_token:` field
- **FAIL-ONLY-ONCE** registry with at minimum A-014 (PHASE_A_ADVISORY fabrication) and A-021 (commit before invocation)

### 7.4 GitHub Actions Permissions

**REQ-GWC-404**: The watchdog workflow MUST declare the following minimum permissions:
```yaml
permissions:
  pull-requests: write
  issues: write
  contents: read
```

---

## 8. Adaptation Requirements

### 8.1 Mandatory Adaptation Parameters

**REQ-GWC-501**: Before raising a layer-down PR, the following parameters MUST be adapted for
the target repository. Deploying default (maturion-isms) values to a different repository
without confirming they match is prohibited.

| Parameter | Default (maturion-isms) | Adapt Requirement |
|---|---|---|
| Pre-brief artifact path | `.agent-admin/assurance/iaa-prebrief-wave*.md` | MUST match the repo's assurance directory convention |
| `wave-current-tasks.md` path | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | MUST match the repo's Foreman workspace path |
| PREHANDOVER file pattern | `PREHANDOVER*.md` (repo root) | MUST be adjusted if PREHANDOVER proofs are stored in a subdirectory |
| IAA token field name | `iaa_audit_token:` | MUST match the PREHANDOVER proof template used in the repo |
| Branch exemption list | `governance/`, `ripple-`, `governance-alignment`, `dependabot/` | MUST add repo-specific exempt branch patterns |
| Handover keyword list | see §6.2 | MAY be extended if the repo uses additional closure phrases |

### 8.2 Adaptation Checklist

**REQ-GWC-502**: Every layer-down PR raising `governance-watchdog.yml` MUST satisfy the
following checklist before the PR is opened:

- [ ] Pre-brief artifact path confirmed to match the target repo's `.agent-admin/assurance/` convention
- [ ] `wave-current-tasks.md` path confirmed to match the target repo's Foreman workspace
- [ ] PREHANDOVER file naming pattern confirmed to match the target repo's convention
- [ ] `iaa-prebrief-inject.yml` confirmed deployed in the target repo
- [ ] `merge-gate-interface.yml` or equivalent merge gate confirmed deployed
- [ ] Foreman agent contract confirmed to include Phase 0
- [ ] `.agent-admin/assurance/` directory confirmed to exist
- [ ] Repo-specific branch exemptions added
- [ ] YAML syntax validated (`yamllint .github/workflows/governance-watchdog.yml`)
- [ ] Gap 2 tested manually: DRAFT PR on branch with no pre-brief converted to Ready, alert confirmed

### 8.3 Layer-Down Artifact

**REQ-GWC-503**: The layer-down PR for each consumer repository MUST include:
1. `.github/workflows/governance-watchdog.yml` — adapted for the target repo per §8.1
2. A record in `GOVERNANCE_ARTIFACT_INVENTORY.md` if the repo maintains one
3. A PREHANDOVER proof referencing IAA invocation (per standard ceremony)

---

## 9. Integration Requirements

### 9.1 Non-Interference

**REQ-GWC-601**: Deploying `governance-watchdog.yml` MUST require zero modifications to:
- `iaa-prebrief-inject.yml`
- `merge-gate-interface.yml`
- Any agent contract files
- Any FAIL-ONLY-ONCE registries
- The `.agent-admin/assurance/` directory structure

The watchdog is a pure addition. It reads from existing paths and posts to existing PR/commit threads.

### 9.2 Relationship to `iaa-prebrief-inject.yml`

**REQ-GWC-602**: `iaa-prebrief-inject.yml` and `governance-watchdog.yml` MUST be treated as
complementary and non-competing:
- `iaa-prebrief-inject.yml` **generates** the pre-brief at wave start
- `governance-watchdog.yml` Gap 2 **enforces** that the pre-brief exists at DRAFT → Ready
These address different failure points and MUST both be deployed.

### 9.3 Relationship to `merge-gate-interface.yml`

**REQ-GWC-603**: `governance-watchdog.yml` and `merge-gate-interface.yml` operate as sequential
defence layers. The watchdog MUST NOT be used as a substitute for, or relaxation of, the
merge gate. A gap that slips past the watchdog is still caught at the gate. The gate MUST
never rely on the watchdog having fired.

---

## 10. Exemption Requirements

### 10.1 False Positive Management

**REQ-GWC-701**: When a Gap 1 false positive occurs on a governance liaison branch that does not
follow the naming convention, the deployer MUST add the branch prefix to the exemption list
during adaptation (§8.1).

**REQ-GWC-702**: When a Gap 2 false positive occurs on a governance maintenance PR, the PR
MUST carry a standard exemption signal: `agent:liaison` label, `ripple:` title prefix, or
`governance` + `automated` label combination.

**REQ-GWC-703**: When a Gap 3 false positive occurs due to a PREHANDOVER stub pushed early
in a wave, the deployer MAY tune the handover keyword list during adaptation to reduce
false positives while preserving detection of the core failure pattern.

---

## 11. Operational Constraints

**REQ-GWC-801**: The watchdog MUST use `secrets.MATURION_BOT_TOKEN` for all operations that
mutate GitHub state (including posting PR/issue/commit comments, adding labels, posting check
runs or commit statuses, and triggering repository dispatch). The `GITHUB_TOKEN` provided by
the Actions runner MAY be used for read-only API calls only and MUST NOT be used for any write
or mutation operation. This requirement MUST remain aligned with
`GOVERNANCE_TOKEN_USAGE_REQUIREMENTS.md` (REQ-TU-001/002).

**REQ-GWC-802**: The watchdog MUST declare the minimum required permissions (§7.4) at the
workflow level. Workflow-level permissions for the default `GITHUB_TOKEN` MUST be read-only
and MUST NOT grant `contents: write` or `actions: write`. Jobs that post alerts using
`secrets.MATURION_BOT_TOKEN` MUST declare only the minimum scopes required (e.g.,
`pull-requests: write`, `statuses: write`, or `checks: write` as applicable) and MUST NOT
grant scopes beyond what the job requires.

**REQ-GWC-803**: Alert comments posted by the watchdog MUST include the canonical watchdog
header string to enable idempotency detection (Gap 3 guard). The format MUST be:
`GOVERNANCE WATCHDOG — <Gap Name>`.

---

## 12. Phase 1 Validation Evidence

This canon was promoted following completion of Phase 1 validation in `APGI-cmy/maturion-isms`.

| Metric | Target | Result |
|---|---|---|
| Gap 2 confirmed fires | ≥1 production event | ✅ CONFIRMED — all three gaps confirmed firing correctly in `APGI-cmy/maturion-isms` (see canonisation PR [#1300](https://github.com/APGI-cmy/maturion-foreman-governance/pull/1300)) |
| Gap 3 confirmed fires | ≥1 production event | ✅ CONFIRMED — alert text validated against Foreman and IAA agent contracts; Gap 3 idempotency guard verified (see canonisation PR [#1300](https://github.com/APGI-cmy/maturion-foreman-governance/pull/1300)) |
| False positives | 0 blocking | ✅ CONFIRMED — no confirmed false positives blocking agents during Phase 1 in `maturion-isms` |
| Re-invocation cycles reduction | ≥50% over 5 waves | Measurement ongoing post-deployment |

**Validation Authority**: CS2 (Johan Ras)  
**Authorisation**: Canonisation PR [#1300](https://github.com/APGI-cmy/maturion-foreman-governance/pull/1300) — ASSURANCE-TOKEN IAA-20260320-PR1300-R2  
**Source**: Strategy §9.1 — "The reference implementation was deployed and validated in `maturion-isms`. All three gaps are confirmed to fire correctly."

---

## 13. Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-03-04 | Initial canon created from validated strategy GWDS-001 v1.1.0. Phase 1 production validation complete. |
| 1.0.1 | 2026-03-21 | PR review: Fixed REQ-GWC-102 (use commit status/check run instead of commit comment to avoid `contents: write`); aligned REQ-GWC-801/802 with GOVERNANCE_TOKEN_USAGE_REQUIREMENTS.md (MATURION_BOT_TOKEN for writes); added traceable production event references and "Re-invocation cycles" metric row in §12. |

---

**Document Metadata**:
- Canon ID: GOVERNANCE_WATCHDOG_CANON
- Authority: CS2 (Johan Ras)
- Layer-Down Status: PUBLIC_API
- Source Strategy: `maturion/strategy/GOVERNANCE_WATCHDOG_DEPLOYMENT_STRATEGY.md` v1.1.0
- Maintained By: Governance Repository Administrator
