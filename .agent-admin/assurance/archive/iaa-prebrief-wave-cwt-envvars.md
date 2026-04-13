# IAA Pre-Brief — Wave CWT-EnvVars

**Pre-Brief Version**: 1.0.0
**Date**: 2026-03-07
**IAA Session**: pre-brief-wave-cwt-envvars-20260307
**Wave Slug**: wave-cwt-envvars
**Branch**: copilot/fix-supabase-env-vars-for-tests
**Issue**: [Foreman] Fix CWT: Pass Supabase env vars to test runner + Setup MAT_E2E_TEST_TOKEN to clear 9 RED tests in FCWT
**Producing Agent**: integration-builder
**Pre-Brief Authority**: CS2 (Johan Ras / @APGI-cmy)
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**Phase 0 Protocol**: EXECUTED

---

## § 0.1 — Confirmed Invocation Mode

This session was triggered by a comment containing `IAA_PRE_BRIEF_PROTOCOL.md §Trigger` in the
wave-current-tasks.md file and the explicit pre-brief request above. **PRE-BRIEF MODE ACTIVE.**
Phases 1–4 assurance are NOT executed this session. Phase 0 only.

---

## § 0.2 — Wave Current Tasks Read

**Source**: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`
**Wave**: Wave CWT-EnvVars
**Session Tag**: session-cwt-envvars-20260307
**CS2 Authorization**: Confirmed — issue opened and assigned by @APGI-cmy directly.

**Tasks declared**:

| # | Task ID | Description | Files Changed |
|---|---------|-------------|---------------|
| 1 | T-CWT-EV-001 | Add `env:` block to CWT `Run Combined Wave Tests` step in deploy-mat-ai-gateway.yml | `.github/workflows/deploy-mat-ai-gateway.yml` |
| 2 | T-CWT-EV-002 | Document CWT env var setup in BUILD_PROGRESS_TRACKER.md (how to generate Supabase JWT, where to add secret, expected result) | `modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md` |

---

## § 0.3 — Task Classification Against Trigger Table

**Trigger table loaded**: `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md` v2.1.0

**Classification decision flow applied per trigger table §Classification Decision Flow**:

### T-CWT-EV-001 — `.github/workflows/deploy-mat-ai-gateway.yml`

```
Step 3 check: Does PR contain any .github/workflows/ changes?
→ YES: Category = CI_WORKFLOW. IAA = MANDATORY.
```

| Field | Value |
|-------|-------|
| Task ID | T-CWT-EV-001 |
| File | `.github/workflows/deploy-mat-ai-gateway.yml` |
| IAA Trigger Category | **CI_WORKFLOW** |
| Qualifying? | **YES — MANDATORY** |
| Rationale | Any `.github/workflows/` file created or modified = CI_WORKFLOW trigger, no exceptions |

---

### T-CWT-EV-002 — `modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md`

```
Step 4 check: Does PR contain AAWP/MAT deliverable artifacts?
→ File matches AAWP/MAT path pattern: modules/mat/ → YES
→ Category = AAWP_MAT. IAA = MANDATORY.

AMBIGUITY RULE check: Could this be doc-only EXEMPT?
→ While content is documentation, it resides in modules/mat/ which is a declared AAWP/MAT path.
→ AMBIGUITY RULE: if any doubt → apply stricter category.
→ Classified: AAWP_MAT (documentation within a qualifying MAT path).
```

| Field | Value |
|-------|-------|
| Task ID | T-CWT-EV-002 |
| File | `modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md` |
| IAA Trigger Category | **AAWP_MAT** |
| Qualifying? | **YES — MANDATORY** |
| Rationale | File is in `modules/mat/` path pattern per trigger table; AMBIGUITY RULE applied — stricter classification retained |

---

### Combined PR Category

| Category | Tasks | Qualifying? |
|----------|-------|-------------|
| **CI_WORKFLOW** | T-CWT-EV-001 | YES — MANDATORY |
| **AAWP_MAT** | T-CWT-EV-002 | YES — MANDATORY |
| **MIXED** | Full PR | YES — both categories active |

**Final PR Category**: **MIXED (CI_WORKFLOW + AAWP_MAT)**
**Primary Trigger**: CI_WORKFLOW (strongest — §4.3b merge gate parity applies)
**IAA Required**: YES — MANDATORY

---

## § 0.4 — FFA Checks at Handover

At assurance invocation, IAA will execute the following checks. The producing agent (integration-builder)
and Foreman must ensure the PREHANDOVER proof addresses each of these explicitly.

### Core Invariants (all PRs — CORE-001 through CORE-022)

The following are active for this wave:

| Check ID | Name | Why Relevant |
|----------|------|-------------|
| CORE-005 | Governance block present | Applied to all PRs |
| CORE-006 | CANON_INVENTORY alignment | Applied to all PRs |
| CORE-007 | No placeholder content | Applied to all PRs — see BD-016 note below |
| CORE-013 | IAA invocation evidence | PREHANDOVER must reference expected IAA token |
| CORE-015 | Session memory present | Session memory file must be on branch |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated token file path must be declared; PREHANDOVER `iaa_audit_token` field pre-populated |
| CORE-017 | No unauthorized `.github/agents/` modifications | PR diff must not include any `.github/agents/` changes |
| CORE-018 | Complete evidence artifact sweep | PREHANDOVER proof, session memory, `iaa_audit_token`, token file path all verified before any overlay check |
| CORE-019 | IAA token cross-verification | First-invocation exception applies on this PR |
| CORE-020 | Zero partial pass rule | Any absent/blank evidence = REJECTION |
| CORE-021 | Zero-severity-tolerance | Any finding = REJECTION-PACKAGE — no softening of findings permitted |

### CI_WORKFLOW Overlay (OVL-CI-001 through OVL-CI-005)

| Check ID | Name | What IAA Will Check |
|----------|------|---------------------|
| OVL-CI-001 | Workflow policy correctness | Does the `env:` block syntax correctly pass `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `MAT_E2E_TEST_TOKEN` to the `pnpm test` runner? Are secret references valid (e.g., `${{ secrets.VITE_SUPABASE_URL }}`), non-empty at runtime, and scoped to the correct step — not spilling into earlier or later steps? |
| OVL-CI-002 | Merge gate integrity | Does the change preserve all existing merge gate checks in the workflow? No existing env block, job dependency, or permissions block may be removed or weakened. |
| OVL-CI-003 | Silent failure risk | Is there any `continue-on-error`, suppressed exit code, or silent swallow around the CWT test step that would hide failure? If the env vars are wrong, does the job fail visibly? |
| OVL-CI-004 | Environment parity | Does the fix apply equally for both `push` to main and `workflow_dispatch` trigger paths? |
| OVL-CI-005 | CI evidence present | **BLOCKING**: PREHANDOVER proof must include a GitHub Actions run URL or log snippet showing the modified workflow executed successfully after the fix was committed. A claim without CI evidence URL = immediate REJECTION-PACKAGE. |

> **⚠️ OVL-CI-005 NOTE**: This check has been a recurring source of REJECTION-PACKAGEs. The producing agent MUST trigger a CI run (push to branch or workflow_dispatch) and capture the run URL BEFORE invoking IAA. A pull-request run URL is acceptable. The URL must reference a run AFTER the env block was added.

### AAWP_MAT / BUILD_DELIVERABLE Overlay (BD checks — for T-CWT-EV-002)

Given T-CWT-EV-002 is documentation-only (no executable code), the following BD checks are
the active FFA subset. BD checks that do not apply to documentation are annotated N/A.

| Check ID | Name | What IAA Will Check |
|----------|------|---------------------|
| BD-001 | Full scope delivered | Does the BUILD_PROGRESS_TRACKER.md update cover all declared documentation goals: (a) how to generate Supabase JWT, (b) where to add GitHub secret, (c) expected result / test outcomes? Partial documentation = REJECTION-PACKAGE citing specific missing items. |
| BD-002 | No stub/TODO in production paths | No placeholder sections, `[TBD]`, `[INSERT HERE]`, or incomplete subsections in the documentation. Any blank section header = REJECTION-PACKAGE. |
| BD-016 | No hardcoded secrets or credentials | **HARD GATE**: The documentation MUST NOT contain any actual JWT tokens, Supabase anon keys, or real credential values — even as examples. Only describe HOW to generate/locate them. Any real-looking credential value = immediate REJECTION-PACKAGE citing §BD-016 + A-024. |
| BD-003 | One-time build compliance | Is the documentation complete enough that a developer reading it can configure the CI secret successfully in a single pass, without requiring follow-up? Incomplete instructions = advisory or REJECTION-PACKAGE depending on severity. |
| FFA-01 | Delivery Completeness | Summary FFA assessment for T-CWT-EV-002 documentation completeness |

---

## § 0.5 — Required PREHANDOVER Proof Structure

The producing agent (integration-builder) and Foreman must deliver a PREHANDOVER proof that satisfies
all of the following before invoking IAA. This structure is defined per A-029 §4.3b.

```
PREHANDOVER Proof — Required Fields:

1. Branch and PR reference
2. Scope Declaration — exact list of files changed (must match `git diff --name-only origin/main...HEAD`)
   Required per A-026. Must include ONLY files in this wave's scope.
   Prior-wave entries must be trimmed (A-028).
3. Task completion evidence:
   - T-CWT-EV-001: Description of env block added; specific lines added (diff or inline)
   - T-CWT-EV-002: Description of BUILD_PROGRESS_TRACKER.md section added
4. SCOPE_DECLARATION.md updated to match PR diff exactly (A-026 check)
5. iaa_audit_token: "IAA-session-cwt-envvars-wave-cwt-envvars-20260307-PASS"
   (pre-populated at commit time — read-only post-commit per A-029 §4.3b)
6. Session memory file path on branch
7. CI evidence — GitHub Actions run URL or log snippet from a run AFTER the env block was committed
   (OVL-CI-005 — non-negotiable; without this IAA will issue REJECTION-PACKAGE before other checks)
8. Pre-IAA Commit Gate evidence: `git status` output (clean working tree) + `git log --oneline -3`
   showing all changes committed and pushed (A-021)
9. No .github/agents/ files in PR diff (declaration + evidence)
10. Security declaration: BUILD_PROGRESS_TRACKER.md contains no hardcoded secret values (BD-016)
```

**IAA Token File** (IAA writes this — NOT the producing agent):
- Path: `.agent-admin/assurance/iaa-token-session-cwt-envvars-wave-cwt-envvars-20260307.md`
- The PREHANDOVER proof `iaa_audit_token` field must contain the expected reference above
- The actual token file is created by IAA during the assurance invocation

---

## § 0.6 — Scope Blockers and Governance Conflicts

The following risks and potential blockers are visible NOW, before any build work begins.
The Foreman and producing agent must address these proactively to avoid REJECTION-PACKAGE.

---

### BLOCKER-1 — OVL-CI-005: CI Evidence Is a Hard Gate

**Status**: PREVENTABLE — act before invoking IAA

The CI_WORKFLOW overlay requires CI evidence (run URL or log snippet) in the PREHANDOVER proof.
This wave modifies a GitHub Actions workflow — therefore OVL-CI-005 applies as a **hard gate**.

**Required action before IAA invocation**:
1. Commit the env block change to the branch
2. Push to GitHub and allow CI to run (or trigger workflow_dispatch)
3. Capture the GitHub Actions run URL for the `cwt` job
4. Include the run URL in the PREHANDOVER proof

Without CI evidence, IAA will issue REJECTION-PACKAGE on OVL-CI-005 before other checks proceed.

---

### BLOCKER-2 — BD-016: No Hardcoded Secrets in T-CWT-EV-002 Documentation

**Status**: PREVENTABLE — design the documentation correctly

The BUILD_PROGRESS_TRACKER.md update must describe HOW to:
- Generate a Supabase JWT service role token
- Add it as a GitHub repository secret named `MAT_E2E_TEST_TOKEN`
- Verify the secret is picked up by the CWT job

It must NOT contain:
- Any actual JWT token values (even example/placeholder ones that look like real tokens)
- Any Supabase URL or anon key values
- Any hardcoded credential strings

IAA applies zero-severity-tolerance (CORE-021) — even a token-shaped example string will fail BD-016.

---

### BLOCKER-3 — A-026/A-028: SCOPE_DECLARATION.md Compliance

**Status**: PREVENTABLE — administrative discipline required

Before invoking IAA, `SCOPE_DECLARATION.md` in the repo root must:
- List exactly and only the files changed in this PR (A-026)
- Use the list format, not narrative paragraphs (A-028)
- Not contain prior-wave entries (A-028)

IAA will run: `git diff --name-only origin/main...HEAD` and compare against SCOPE_DECLARATION.md.
Any mismatch = REJECTION-PACKAGE citing BL-027 merge gate parity failure (A-026).

---

### BLOCKER-4 — A-021: Commit All Changes Before IAA Invocation

**Status**: PREVENTABLE — procedural discipline required

All deliverables (workflow fix, documentation update, PREHANDOVER proof, SCOPE_DECLARATION.md,
session memory) must be committed AND pushed to the branch before IAA is invoked.
A working-tree-only state fails CORE-018.

PREHANDOVER must include `git status` output showing a clean working tree.

---

### ADVISORY-1 — env Block Scope Precision (OVL-CI-001)

**Status**: INFORMATIONAL — check during build

The `env:` block must be added to the **specific step** `Run Combined Wave Tests`, not at the job level.
Adding at the job level would expose these vars to ALL steps including checkout, setup-node, and
pnpm install — which is unnecessary and widens the secret exposure surface.

IAA will verify the env block is scoped correctly at the step level, not the job level.
If scoped at job level, IAA will flag this as an OVL-CI-004 (environment parity / secret exposure scope)
advisory that may escalate to REJECTION-PACKAGE per CORE-021 zero-severity-tolerance.

---

### ADVISORY-2 — Nine Tests: Not All May Pass with Env Vars Alone

**Status**: INFORMATIONAL — scope awareness

The wave-current-tasks.md notes: `T-W13-E2E-1: Live deployment health check (separate /health route fix needed)`.
This suggests T-W13-E2E-1 may NOT turn green from the env var fix alone and may require a separate `/health`
route fix.

IAA will NOT require all 9 tests to pass — that is the Foreman's scope to determine. However:
- T-CWT-EV-001 must demonstrate that the env vars ARE correctly wired (OVL-CI-001)
- Any test that was expected to pass but doesn't (excluding scope exclusions already declared) will
  trigger BD-003 (one-time build compliance) review

If the Foreman has explicitly scoped out T-W13-E2E-1 from this wave, that must be documented in the
PREHANDOVER proof with a rationale. IAA will accept a scoped exclusion with documented rationale.

---

### ADVISORY-3 — No Agent Contract Files in Scope

**Status**: INFORMATIONAL — verify during build

The declared scope contains NO `.github/agents/` file changes. IAA will verify this at invocation.
If any agent contract file is accidentally modified (e.g., by a broad `pnpm install` touching lockfiles
that cascade, or an accidental edit), AGENT_CONTRACT trigger category activates and full AC-01
through AC-07 audit applies. The producing agent must confirm no `.github/agents/` changes.

---

## § 0.7 — Applicable FAIL-ONLY-ONCE Rules for This Wave

The following FAIL-ONLY-ONCE rules are specifically relevant to this wave's scope and history:

| Rule ID | Rule Summary | Why Relevant to This Wave |
|---------|-------------|--------------------------|
| A-021 | Commit before IAA invocation | Recurring failure pattern — CI workflow changes require committed + pushed evidence |
| A-026 | SCOPE_DECLARATION.md exact match | Recurring REJECTION-PACKAGE source in recent waves |
| A-028 | SCOPE_DECLARATION list format, trim prior entries | Companion to A-026 |
| A-029 | §4.3b artifact immutability — PREHANDOVER is read-only post-commit | Governs token reference pre-population |
| A-030 | A-030 re-invocation carve-out | If first invocation results in REJECTION-PACKAGE, correction addendum path applies |
| A-024 | No hardcoded secrets — `secret_env_var:` field naming | Not directly applicable (not an agent contract), but BD-016 enforces the same spirit for documentation |

---

## § 0.8 — Pre-Brief Artifact Summary

| Field | Value |
|-------|-------|
| **Wave** | wave-cwt-envvars |
| **Branch** | copilot/fix-supabase-env-vars-for-tests |
| **Tasks in scope** | T-CWT-EV-001, T-CWT-EV-002 |
| **Qualifying tasks** | 2 of 2 (both qualify — CI_WORKFLOW + AAWP_MAT) |
| **PR category at handover** | MIXED (CI_WORKFLOW + AAWP_MAT) |
| **Primary trigger** | CI_WORKFLOW |
| **Required phases at handover** | Full CORE invariants + OVL-CI overlay + AAWP_MAT/BD overlay |
| **Core checks active** | CORE-005, CORE-006, CORE-007, CORE-013, CORE-015, CORE-016, CORE-017, CORE-018, CORE-019, CORE-020, CORE-021 |
| **Overlay checks active** | OVL-CI-001 through OVL-CI-005 + BD-001, BD-002, BD-003, BD-016, FFA-01 |
| **Scope blockers visible** | 4 (all PREVENTABLE — see §0.6) |
| **Advisories** | 3 |
| **Adoption phase** | PHASE_B_BLOCKING — all verdicts are hard-blocking |
| **IAA token file path** | `.agent-admin/assurance/iaa-token-session-cwt-envvars-wave-cwt-envvars-20260307.md` |
| **Expected PREHANDOVER `iaa_audit_token`** | `IAA-session-cwt-envvars-wave-cwt-envvars-20260307-PASS` |
| **Pre-Brief status** | COMPLETE — IAA standby pending producing agent delivery |

---

## § 0.9 — Governance Verification

> "I am independent-assurance-agent, class: assurance, version 6.2.0.
> CANON_INVENTORY hash check: hashes present, non-null (191 canons loaded — verified at Phase 0 startup).
> IAA canon present: governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md — CONFIRMED.
> Tier 2 knowledge: index.md v2.6.0 loaded. All required files present.
> FAIL-ONLY-ONCE registry: v2.3.0, A-001 through A-030 active.
> Adoption phase: PHASE_B_BLOCKING — Hard gate ACTIVE.
> STOP-AND-FIX mandate: ACTIVE. No class exceptions. Ambiguity resolves to mandatory invocation.
> Pre-Brief mode executed correctly. Phases 1–4 NOT executed — waiting for producing agent delivery."

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0 | **Contract**: 2.2.0
**Pre-Brief Generated**: 2026-03-07
**Next Action**: integration-builder delivers T-CWT-EV-001 + T-CWT-EV-002. Foreman commits PREHANDOVER proof. Foreman invokes IAA for full Phase 2–4 assurance.
