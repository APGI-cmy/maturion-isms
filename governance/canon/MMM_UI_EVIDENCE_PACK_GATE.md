# MMM Live UI Evidence Pack Gate Canon

**Version**: 1.0.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Type**: Canon — Tier 1 Governance Rule (NORMATIVE / MANDATORY)
**Effective Date**: 2026-04-30
**Layer-Down Status**: PUBLIC_API
**Applies To**: All agents producing MMM PREHANDOVER proofs; Foreman QP; IAA final audit
**Issue**: maturion-isms#1523
**Wave**: mmm-ui-evidence-pack-hardening-20260430
**FAIL-ONLY-ONCE Cross-ref**: A-043

---

## 1. Purpose

This canon establishes a **mandatory gate** for all MMM PREHANDOVER proofs that claim any of the following completion states:

- `handover ready`
- `operationally closed`
- `L2 complete` (Deployment Commissioned)
- `L3 complete` (Operationally Closed)
- `deployment commissioned`
- `operational-complete`

**No PREHANDOVER proof MAY use any of the above phrases without a committed, validated Live UI Evidence Pack (LUIEP) artifact.** A PREHANDOVER proof that uses such language without an attached LUIEP artifact is a **HANDOVER BLOCKER** and MUST be rejected by Foreman QP and IAA final audit.

This gate was introduced because static code presence and CI test GREEN status alone cannot confirm that a deployed MMM UI renders correctly, that authentication flows function on the live platform, or that any end-to-end user workflow executes successfully in the live environment. Live UI evidence MUST be gathered and signed off by CS2 (@APGI-cmy) — the only party with authoritative access to confirm live platform behaviour.

---

## 2. Definitions

| Term | Definition |
|------|-----------|
| **Live UI Evidence Pack (LUIEP)** | A structured evidence artifact (committed to the repository) containing the mandatory fields defined in §3 below, confirming that the deployed MMM UI is accessible, renders correctly, and supports at least one confirmed end-to-end workflow on the live platform. |
| **LIVE_RUNTIME evidence** | Evidence gathered by direct browser or HTTP interaction with the live deployed application, not reconstructed from CI logs, static code, or local dev servers. |
| **LIVE_E2E evidence** | Evidence of a complete user journey executed on the live platform — from UI interaction through API call to database persistence and visible UI response — not a CI test run. |
| **L2 (Deployment Commissioned)** | The completion level at which platforms are live, connected, configured, and health endpoints verified. See `modules/MMM/BUILD_PROGRESS_TRACKER.md` §12.3. |
| **L3 (Operationally Closed)** | The completion level at which L1 + L2 are confirmed AND at least one live E2E workflow has been demonstrated with CS2 sign-off. See `modules/MMM/BUILD_PROGRESS_TRACKER.md` §12.3. |
| **Prohibited completion phrases** | Any of: "handover ready", "operationally closed", "L2 complete", "L3 complete", "deployment commissioned", "operational-complete". |

---

## 3. Core Rules

### 3.1 — LUIEP-MANDATORY-FOR-L2-L3 (Rule U-001)

**No PREHANDOVER proof for an MMM wave MAY use prohibited completion phrases without a committed Live UI Evidence Pack artifact.**

- The LUIEP artifact MUST be committed to the repository on the same PR branch as the PREHANDOVER proof before handover.
- The LUIEP artifact MUST be referenced by path in the PREHANDOVER proof.
- Absence of a committed LUIEP artifact when the PREHANDOVER proof uses any prohibited completion phrase is a **HANDOVER BLOCKER**.
- Foreman QP MUST verify LUIEP presence at QP evaluation when any prohibited completion phrase appears in the PREHANDOVER proof.
- IAA MUST verify LUIEP presence at final audit.
- Enforcement: CI gate `preflight/mmm-ui-evidence-pack-gate` running `.github/scripts/validate-mmm-ui-evidence-pack.sh`.
- Violation class: `INC-MMM-LUIEP-MISSING-001`

### 3.2 — LUIEP-CS2-SIGN-OFF-REQUIRED (Rule U-002)

**The LUIEP artifact MUST contain a valid CS2 sign-off date in the `cs2_sign_off` field.**

- `cs2_sign_off: YYYY-MM-DD` (date format) is the REQUIRED value for a validated LUIEP.
- `cs2_sign_off: PENDING` is only valid while the LUIEP is still being prepared; a PREHANDOVER proof using prohibited completion phrases MUST NOT be committed with `cs2_sign_off: PENDING`.
- CS2 (@APGI-cmy) is the **sole authority** to confirm live UI evidence. Live E2E cannot be confirmed by static code review, CI tests, or any agent operating without live platform access.
- Foreman QP MUST check that `cs2_sign_off` is a date (not PENDING) before accepting any PREHANDOVER proof claiming L2 or L3 completion.
- Enforcement: `.github/scripts/validate-mmm-ui-evidence-pack.sh`
- Violation class: `INC-MMM-LUIEP-MISSING-001`

### 3.3 — LUIEP-DEPLOYMENT-URL-CONFIRMED (Rule U-003)

**The LUIEP artifact MUST confirm the live deployment URL.**

- `deployment_url_confirmed: YES` is the REQUIRED value for a validated LUIEP claiming L2 or L3 completion.
- `deployment_url` MUST contain the live URL where the deployed MMM UI is accessible.
- A LUIEP with `deployment_url_confirmed: PENDING` or `deployment_url_confirmed: NOT_APPLICABLE` does NOT satisfy U-003 for L2 or L3 claims.
- `evidence_type` for this field: **LIVE_RUNTIME**
- Enforcement: `.github/scripts/validate-mmm-ui-evidence-pack.sh`
- Violation class: `INC-MMM-LUIEP-MISSING-001`

### 3.4 — LUIEP-SCREENSHOT-REQUIRED (Rule U-004)

**The LUIEP artifact MUST include at least one screenshot reference confirming the live UI.**

- `screenshots_provided: YES` is the REQUIRED value for a validated LUIEP.
- Screenshots MUST be of the live deployed application, not a local dev server or Storybook.
- At minimum, one screenshot MUST show the MMM application rendering in a browser connected to the live deployment URL.
- `evidence_type` for this field: **LIVE_RUNTIME**
- Enforcement: `.github/scripts/validate-mmm-ui-evidence-pack.sh`
- Violation class: `INC-MMM-LUIEP-MISSING-001`

### 3.5 — LUIEP-E2E-WORKFLOW-CONFIRMED (Rule U-005)

**The LUIEP artifact MUST confirm at least one complete end-to-end workflow executed on the live platform.**

- `e2e_workflow_confirmed: YES` is the REQUIRED value for a validated LUIEP claiming L3 completion.
- `e2e_workflow_description` MUST describe the specific workflow demonstrated (e.g. "User registration → media upload → transcription request → result displayed in UI").
- A CI test run does NOT satisfy this requirement; `evidence_type` for this field is **LIVE_E2E**.
- `auth_flow_confirmed: YES` MUST be present — login/signup flow MUST be demonstrated on the live platform before any E2E workflow can be declared confirmed.
- For L2 claims (Deployment Commissioned), `e2e_workflow_confirmed` MAY be `PENDING` — but `deployment_url_confirmed`, `ui_renders_correctly`, and `auth_flow_confirmed` MUST all be `YES`.
- For L3 claims (Operationally Closed), `e2e_workflow_confirmed` MUST be `YES`.
- Enforcement: `.github/scripts/validate-mmm-ui-evidence-pack.sh`
- Violation class: `INC-MMM-LUIEP-MISSING-001`

---

## 4. Live UI Evidence Pack (LUIEP) Field Specification

The LUIEP artifact MUST contain all of the following fields. Each field is classified by its required evidence type.

| Field | Type | Required Values | Evidence Type | Rule |
|-------|------|----------------|---------------|------|
| `deployment_url` | String | Live HTTPS URL | LIVE_RUNTIME | U-003 |
| `deployment_url_confirmed` | Enum | `YES` \| `PENDING` \| `NOT_APPLICABLE` | LIVE_RUNTIME | U-003 |
| `ui_renders_correctly` | Enum | `YES` \| `PENDING` | LIVE_RUNTIME | U-005 (L2/L3 requirement) |
| `auth_flow_confirmed` | Enum | `YES` \| `PENDING` | LIVE_RUNTIME | U-005 |
| `e2e_workflow_confirmed` | Enum | `YES` \| `PENDING` | LIVE_E2E | U-005 |
| `e2e_workflow_description` | String | Description of workflow demonstrated | LIVE_E2E | U-005 |
| `screenshots_provided` | Enum | `YES` \| `NO` | LIVE_RUNTIME | U-004 |
| `cs2_sign_off` | String | `YYYY-MM-DD` date or `PENDING` | LIVE_RUNTIME | U-002 |
| `evidence_pack_version` | String | Semver (e.g. `1.0.0`) | CONFIG | U-001 (LUIEP completeness) |
| `evidence_pack_date` | String | `YYYY-MM-DD` date | CONFIG | U-001 (LUIEP completeness) |

**Evidence Type Key**:
- `LIVE_RUNTIME` — requires direct interaction with the live deployed application (browser or HTTP)
- `LIVE_E2E` — requires a complete user workflow executed on the live platform from UI to database and back
- `CONFIG` — administrative metadata; does not require live evidence

**REQUIRED vs PERMITTED values for L2/L3 claims**:

| Field | L2 (Deployment Commissioned) | L3 (Operationally Closed) |
|-------|------------------------------|--------------------------|
| `deployment_url_confirmed` | MUST be `YES` | MUST be `YES` |
| `ui_renders_correctly` | MUST be `YES` | MUST be `YES` |
| `auth_flow_confirmed` | MUST be `YES` | MUST be `YES` |
| `e2e_workflow_confirmed` | MAY be `PENDING` | MUST be `YES` |
| `screenshots_provided` | MUST be `YES` | MUST be `YES` |
| `cs2_sign_off` | MUST be a date (not `PENDING`) | MUST be a date (not `PENDING`) |

---

## 5. Who Provides Live UI Evidence

CS2 (@APGI-cmy) is the **sole authority** to confirm live UI evidence. This is a non-delegable responsibility because:

1. Live E2E evidence cannot be generated by static code review or CI test output.
2. Live E2E evidence cannot be generated by any agent operating without access to the live deployed platform.
3. Confirmation of a live deployment URL, authentication flow, and end-to-end workflow requires a human operator with platform access and CS2 authority to sign off.

No builder agent, Foreman, or IAA agent MAY claim to have confirmed LIVE_RUNTIME or LIVE_E2E evidence unless CS2 has provided explicit sign-off (date in `cs2_sign_off` field).

---

## 6. Enforcement Mechanism

### 6.1 CI Gate

The CI gate `preflight/mmm-ui-evidence-pack-gate` in `preflight-evidence-gate.yml` MUST run on all PRs that include a PREHANDOVER proof for an MMM wave.

The gate runs `.github/scripts/validate-mmm-ui-evidence-pack.sh`, which:
1. Detects whether the PREHANDOVER proof contains any prohibited completion phrase.
2. If a prohibited phrase is found: locates the referenced LUIEP artifact.
3. Validates that all required LUIEP fields are present and populated with non-PENDING values.
4. Validates that `cs2_sign_off` is a date (not `PENDING`).
5. Validates that `deployment_url_confirmed: YES`, `screenshots_provided: YES`.
6. If any required field is missing or PENDING: the gate FAILS with violation class `INC-MMM-LUIEP-MISSING-001`.

### 6.2 Foreman QP

At every QP evaluation for an MMM PREHANDOVER proof, Foreman MUST:
1. Search the PREHANDOVER proof for any prohibited completion phrase.
2. If found: verify that a committed LUIEP artifact exists at the referenced path.
3. Verify that all five rules (U-001 through U-005) are satisfied by the LUIEP artifact.
4. If any rule fails: issue a QP-FAIL-010 finding with a Builder Referral citing rule IDs and violation class.

### 6.3 IAA Final Audit

At final audit, IAA MUST independently verify:
1. That no prohibited completion phrase appears in the PREHANDOVER proof without a committed LUIEP.
2. That `cs2_sign_off` is a valid date.
3. That `deployment_url_confirmed: YES` and `screenshots_provided: YES`.
4. That `e2e_workflow_confirmed: YES` if the PREHANDOVER proof claims L3 completion.
5. Issue a REJECTION-PACKAGE if any of the above checks fail.

---

## 7. Violation Class

**Violation class**: `INC-MMM-LUIEP-MISSING-001`

This violation class is triggered when:
- A PREHANDOVER proof uses a prohibited completion phrase without a committed LUIEP artifact, OR
- A committed LUIEP artifact has `cs2_sign_off: PENDING` when the PREHANDOVER proof claims L2 or L3 completion, OR
- A committed LUIEP artifact has `deployment_url_confirmed: PENDING` or `deployment_url_confirmed: NOT_APPLICABLE` when the PREHANDOVER proof claims L2 or L3 completion, OR
- A committed LUIEP artifact has `e2e_workflow_confirmed: PENDING` when the PREHANDOVER proof claims L3 completion, OR
- A committed LUIEP artifact has `screenshots_provided: NO` when the PREHANDOVER proof claims L2 or L3 completion.

A violation of class `INC-MMM-LUIEP-MISSING-001` is a **HANDOVER BLOCKER**. The PR MUST NOT be merged until the violation is resolved.

---

## 8. Anti-Regression Obligations

### 8.1 Cross-References

This canon extends the evidence-type discipline established in:
- `governance/canon/TEMPORAL_AND_EVIDENCE_INTEGRITY_CANON.md` — Rules E-001/E-002/E-003 (evidence type classification)
- `governance/canon/TEMPORAL_AND_EVIDENCE_INTEGRITY_CANON.md` — Rules T-001/T-002 (temporal integrity — forward-looking language for PENDING items)
- FAIL-ONLY-ONCE Rules A-040 (TEMPORAL-AUDIT-AT-QP) and A-041 (EVIDENCE-TYPE-CLASSIFICATION-AT-QP)
- FAIL-ONLY-ONCE Rule A-043 (MMM-LUIEP-GATE-MANDATORY)
- `modules/MMM/BUILD_PROGRESS_TRACKER.md` §12.3 — Three-level completion model (L1/L2/L3)

### 8.2 Temporal Integrity (A-040)

All LUIEP status fields for items not yet confirmed MUST use `PENDING` (not past-tense claims). A LUIEP template with pre-populated `YES` values that have not been verified by CS2 on the live platform is a temporal integrity violation per A-040/T-001.

### 8.3 Evidence Type Fidelity (A-041)

No LIVE_RUNTIME or LIVE_E2E field in the LUIEP artifact MAY be satisfied by:
- A merged-PR reference
- CI test output
- Static code review
- A local development server screenshot

Only live deployed platform evidence satisfies LIVE_RUNTIME and LIVE_E2E fields.

---

## 9. Applicability

This canon applies to all MMM PREHANDOVER proofs committed after 2026-04-30. It is enforced:

- at Foreman QP evaluation (Phase 3 Step 3.5);
- at IAA final audit (Phase 4 IAA-FINAL); and
- at the CI gate `preflight/mmm-ui-evidence-pack-gate` in `preflight-evidence-gate.yml`.

**Template**: `modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-template.md`
**Checklist**: `governance/checklists/mmm-ui-evidence-pack-checklist.md`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Living Agent System**: v6.2.0
**Canon ref**: `governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md`
**FAIL-ONLY-ONCE cross-ref**: A-043
**Related checklist**: `governance/checklists/mmm-ui-evidence-pack-checklist.md`
**Related template**: `modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-template.md`
**CI gate script**: `.github/scripts/validate-mmm-ui-evidence-pack.sh`
