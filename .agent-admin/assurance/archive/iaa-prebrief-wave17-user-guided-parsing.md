# IAA Pre-Brief — Wave 17: User-Guided AI Parsing Instruction System

**Pre-Brief ID**: IAA-PREBRIEF-wave17-user-guided-parsing-20260311
**Wave**: Wave 17 — User-Guided AI Parsing Instruction System
**Design Defect Corrected**: MAT-DES-PARSE-001 — Hardcoded Parsing Strategy
**Branch**: `copilot/implement-user-guided-ai-parsing`
**Date**: 2026-03-11
**Produced by**: independent-assurance-agent v6.2.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (@APGI-cmy)
**wave-current-tasks.md status**: NOT YET UPDATED for Wave 17 (current file references wave-ai-criteria-creation-fix — Foreman must update before first sub-wave handover)

---

## § 0 — Pre-Brief Mode Confirmation

This document is a **PRE-BRIEF artifact only**.

IAA is **NOT** executing Phase 2–4 assurance in this session.
Full assurance (ASSURANCE-TOKEN or REJECTION-PACKAGE) will be issued **per batch PR / combined PR**
at handover when the Foreman invokes IAA with the completed PREHANDOVER proof.

This Pre-Brief declares:
- All trigger categories applicable to Wave 17
- All FFA checks IAA will run at handover
- The required PREHANDOVER proof structure
- Scope blockers and governance conflicts visible now

---

## § 1 — Phase 1 Identity Attestation

> "I am independent-assurance-agent, class: ASSURANCE, version 6.2.0.
> My role: Independent hard-gate assurance for all maturion-isms PRs in scope.
> My class boundary: I do not produce, draft, or contribute to any artifact under review.
> Independence requirement: I must not be the same agent that produced the work under review.
> STOP-AND-FIX mandate: ACTIVE — one fail = REJECTION-PACKAGE, no exceptions.
> No class exceptions: All agent classes subject to IAA without exception.
> Ambiguity rule: Ambiguity resolves to mandatory invocation, never to exempt.
> Active constitutional lock: SELF-MOD-IAA-001 — CONSTITUTIONAL — CANNOT BE OVERRIDDEN.
> Authority: CS2 only (@APGI-cmy). I do not act without it."

**Tier 2 Knowledge**: Knowledge version 2.9.0 — all required files PRESENT.
**FAIL-ONLY-ONCE registry**: A-001 through A-032 ACTIVE.
**PHASE_B_BLOCKING**: Hard gate enforcement ACTIVE — REJECTION-PACKAGE prevents PR open.

---

## § 2 — Wave Scope Review

### Source Context

The wave-current-tasks.md presently references `wave-ai-criteria-creation-fix` (completed,
ASSURANCE-TOKEN issued). Wave 17 is a new wave starting on the same branch after that fix merged.
Foreman MUST update wave-current-tasks.md to reflect Wave 17 scope before invoking IAA
for handover. A stale wave-current-tasks.md will trigger A-026 violation at handover.

### Batch Register

| Batch | Title | Builders | Primary Deliverables | IAA Trigger Categories |
|-------|-------|----------|----------------------|------------------------|
| **A** | Database Schema | schema-builder | Migration: `parsing_instructions TEXT NULL` on `criteria_documents`; CREATE `parsing_instruction_templates` table with RLS; 3 seed templates | **AAWP_MAT + A-032 (MANDATORY)** |
| **B** | AI Gateway | api-builder | Update `apps/mat-ai-gateway/services/parsing.py` — accept `user_instructions` in `ParseRequest`; split system/user layer prompt forwarded to GPT | **AAWP_MAT** |
| **C** | Edge Function | api-builder | Update `supabase/functions/invoke-ai-parse-criteria/index.ts` — accept and forward `user_instructions`; store to `criteria_documents.parsing_instructions` | **AAWP_MAT + A-032** |
| **D** | UI | ui-builder | Create `ParsingInstructionsModal.tsx`; update `CriteriaUpload.tsx`; update `useTriggerAIParsing` hook in `useCriteria.ts` | **AAWP_MAT** |
| **E** | QA | qa-builder | T-W17-QA-001 through T-W17-QA-012 GREEN; regression suite GREEN | **AAWP_MAT** |

### Delivery Mode

IAA will accept either:
1. **Per-batch handover**: One PR per batch (A → B → C → D → E sequentially), each with its own PREHANDOVER proof and IAA invocation, OR
2. **Combined full-batch handover**: Single PR containing all batches, one PREHANDOVER proof, one IAA invocation.

Foreman must declare the delivery mode before handover. IAA will apply checks to whichever mode is used.
Combined delivery: all checks apply simultaneously. IAA will verify end-to-end wiring as a complete unit.

---

## § 3 — Trigger Category Declaration

### 3.1 — Primary Trigger: AAWP_MAT

**ALL batches** are AAWP_MAT category. Wave 17 delivers executable application behaviour across:
- Supabase schema migrations (new table, new column)
- Python AI Gateway service update (new request model field, prompt architecture change)
- Deno Edge Function update (new request forwarding + DB write-back)
- React UI components (new modal, updated hook, updated upload component)
- QA test suite (T-W17-QA-001 through T-W17-QA-012)

**BUILD_DELIVERABLE overlay applies in full** (BD-001 through BD-024 + FFA Summary).

### 3.2 — Secondary Trigger: A-032 SCHEMA COLUMN COMPLIANCE (MANDATORY)

**Applies to: Batch A and Batch C.**

Per FAIL-ONLY-ONCE A-032: IAA MUST read migration DDL directly and cross-check every column name
for any PR containing INSERT/SELECT operations on a named Supabase table.

| Trigger Point | Table | Columns to Verify | A-032 Mandate |
|---------------|-------|-------------------|---------------|
| Batch A migration | `criteria_documents` | `parsing_instructions` (new column — must be `TEXT NULL`, no NOT NULL constraint) | **MANDATORY** — IAA reads DDL directly |
| Batch A migration | `parsing_instruction_templates` | `id`, `name`, `description`, `template_text`, `is_system_default`, `created_at`, `updated_at` (or as designed) | **MANDATORY** — IAA reads DDL directly |
| Batch A seed data | `parsing_instruction_templates` | Every column in INSERT must match DDL exactly | **MANDATORY** |
| Batch C Edge Function | `criteria_documents` | `parsing_instructions` column write-back — column must exist in DDL | **MANDATORY** |

Mocked tests do NOT satisfy A-032. Silent try/catch does NOT exempt. IAA reads the DDL file
directly and cross-references every column referenced in application code.

### 3.3 — Secondary Trigger: OVL-INJ-001 PRE_BRIEF_ASSURANCE

This Pre-Brief artifact (`.agent-admin/assurance/iaa-prebrief-wave17-user-guided-parsing.md`)
satisfies OVL-INJ-001 **once committed to the branch**. Foreman must verify it is committed
before delegating any builder tasks.

### 3.4 — Watchpoint: PROMPT INJECTION SECURITY (BD-017 / BD-018)

**This wave introduces a user-controlled text field (`user_instructions`) that is forwarded
directly into a GPT system/user prompt.** This is a HIGH-RISK surface area.

IAA will apply BD-017 (input validation) and BD-018 (injection vectors) with heightened
scrutiny at handover:

- Is `user_instructions` length-bounded before forwarding to GPT? (e.g., max 2000 chars)
- Is `user_instructions` sanitised or role-restricted to prevent prompt-injection attacks?
- Is the split system/user layer prompt correctly structured so user content cannot override system instructions?
- Are there safeguards against a malicious user injecting instructions that change parsing output in security-relevant ways?

If `user_instructions` is forwarded to GPT without any validation, sanitisation, or structural
containment → **REJECTION-PACKAGE on BD-017/BD-018**.

### 3.5 — Watchpoint: CI_WORKFLOW

If any batch adds or modifies `.github/workflows/` files, the CI_WORKFLOW trigger category
activates and IAA runs the full CI_WORKFLOW overlay in addition to AAWP_MAT.
Foreman must alert IAA if this occurs. If discovered at handover, IAA will re-classify
and apply additional checks per A-022.

### 3.6 — Trigger Category Summary

| Category | Triggered? | Applies To |
|----------|-----------|------------|
| AAWP_MAT (primary) | **YES — ALL BATCHES** | A, B, C, D, E |
| A-032 Schema Column Compliance | **YES — MANDATORY** | Batches A, C |
| PRE_BRIEF_ASSURANCE / OVL-INJ-001 | **YES** | All batches (pre-brief artifact existence) |
| BD-017/BD-018 Prompt Injection Watchpoint | **YES — HEIGHTENED** | Batch B (parsing.py), Batch C (index.ts) |
| CI_WORKFLOW | **WATCHPOINT** | Activates if `.github/workflows/` modified |
| AGENT_CONTRACT | NO | No agent contract changes expected |
| CANON_GOVERNANCE | NO | No governance/canon files expected |
| KNOWLEDGE_GOVERNANCE | NO | No Tier 2 knowledge files expected |
| EXEMPT | NO | Not applicable — wave has executable deliverables |

---

## § 4 — FFA Checks at Handover

IAA will run all applicable checks from the BUILD_DELIVERABLE overlay. Key checks declared
below with Wave 17-specific verification scope.

### 4.1 — Core Invariants (CORE-001 through CORE-022)

All core invariants apply. Key ones for Wave 17:

| Check ID | Wave 17 Application |
|----------|---------------------|
| CORE-007 | No stub/TODO/placeholder in migration DDL, parsing.py, index.ts, React components, or test files |
| CORE-013 | IAA invocation evidence: PREHANDOVER proof must reference expected IAA token in `iaa_audit_token` field |
| CORE-015 | Session memory artifact included in PR bundle |
| CORE-016 | Dedicated IAA token file at `.agent-admin/assurance/iaa-token-session-NNN-wave17-YYYYMMDD.md` |
| CORE-018 | Complete evidence artifact sweep — PREHANDOVER, session memory, iaa_audit_token, token file (PENDING per A-029 architecture at commit time) |
| CORE-019 | First invocation — token file created during this IAA session |
| CORE-022 | `secret:` field prohibited in any agent contract touched — use `secret_env_var:` |

### 4.2 — BD-TIER-1: Delivery Completeness

| Check ID | Wave 17 Specific Verification |
|----------|-------------------------------|
| BD-001 | Cross-ref issue scope against diff: 5 batches declared, all 5 must be present. Missing ANY batch = REJECTION-PACKAGE citing specific absent batch(es). Scope: migration file, parsing.py update, index.ts update, ParsingInstructionsModal.tsx (new), CriteriaUpload.tsx update, useCriteria.ts update, T-W17-QA-001 through T-W17-QA-012 green. |
| BD-002 | No stub/TODO in: migration DDL, seed data INSERT, parsing.py ParseRequest model, GPT prompt construction, Edge Function user_instructions forwarding, modal component, hook update |
| BD-003 | If merged today: user can open modal, select/write parsing instructions, trigger parse, and receive parsed criteria reflecting the custom instructions — end-to-end first time |

### 4.3 — BD-TIER-2: Wiring & Integration Verification

**Critical path for Wave 17** (IAA will trace this chain explicitly):

```
User → CriteriaUpload.tsx (opens modal)
     → ParsingInstructionsModal.tsx (user selects/enters instructions)
     → useTriggerAIParsing hook (in useCriteria.ts)
     → invoke-ai-parse-criteria Edge Function (index.ts)
       [stores user_instructions to criteria_documents.parsing_instructions]
     → AI Gateway /parse endpoint (parsing.py)
       [ParseRequest.user_instructions → split system/user GPT prompt]
     → GPT response → domain/MPS/criteria structured output
     → DB write-back (criteria table)
```

| Check ID | Wave 17 Specific Verification |
|----------|-------------------------------|
| BD-005 | Trace every link in the chain above. Any broken link = REJECTION-PACKAGE citing specific break. |
| BD-006 | `parsing_instruction_templates`: confirmed writer (seed INSERT + any UI creation path) and confirmed reader (template listing in modal). `criteria_documents.parsing_instructions`: confirmed writer (Edge Function write-back) and confirmed reader (any display path or re-parse path). |
| BD-007 | Auth guard on `parsing_instruction_templates` SELECT — must use org-isolation RLS or authenticated user check. Template selection must be scoped to authenticated users only. |
| BD-008 | `parsing_instruction_templates` FK integrity: if FK to `organisations` or similar — application-layer handling declared. |
| BD-009 | Type consistency across layers: `user_instructions: string | null | undefined` in TypeScript hook/Edge Function must match `user_instructions: str | None` in Python ParseRequest model. |
| BD-010 | Supabase client usage: Edge Function must use service role key for write-back to `criteria_documents.parsing_instructions` (same pattern as existing write-back). |

### 4.4 — BD-TIER-3: Test Quality & Zero Debt

| Check ID | Wave 17 Specific Verification |
|----------|-------------------------------|
| BD-011 | T-W17-QA-001 through T-W17-QA-012 all PASS. Test output evidence required in PREHANDOVER proof. |
| BD-012 | No `.skip()`, `.only()`, `test.todo()` or commented-out tests. |
| BD-013 | Tests must assert on actual parsed output reflecting user_instructions — not vacuous pass-regardless tests. Specifically: a test must verify that `user_instructions` reaches the GPT prompt and that custom instructions affect parsing behaviour (mocked GPT response is acceptable; vacuous test that always passes regardless of hook wiring is NOT). |

### 4.5 — BD-TIER-4: Security Review

**Heightened scrutiny for Wave 17** due to user-controlled text entering LLM pipeline.

| Check ID | Wave 17 Specific Verification |
|----------|-------------------------------|
| BD-015 | RLS on `parsing_instruction_templates` table: verify SELECT, INSERT, UPDATE, DELETE policies for authenticated users, service role, and system (IS_SYSTEM_DEFAULT templates must be protected from user modification). A system template modified by a user = security regression. |
| BD-016 | No hardcoded API keys, Supabase service keys, or OpenAI keys in new code. |
| BD-017 | **MANDATORY for Batch B + C**: `user_instructions` input must be validated before forwarding to GPT: (a) max length enforced (e.g., 2000 chars), (b) basic sanitisation applied, (c) structured as a user-role message (not injected into system prompt string directly). |
| BD-018 | **MANDATORY for Batch B**: The GPT prompt construction must structure `user_instructions` as a separate user-layer message. User content must NOT be concatenated into the system prompt string (prevents system prompt override). IAA will read the GPT call construction in parsing.py directly. |
| BD-019 | GDPR/data handling: `parsing_instructions` stored in `criteria_documents` is org-scoped data — confirm org-isolation RLS extends to rows that contain this field (existing `criteria_documents_org_isolation` policy covers this IF the policy is SELECT-on-existing-rows; INSERT/UPDATE org isolation must also be present). |

### 4.6 — BD-TIER-5: Code Quality & Architecture Fitness

| Check ID | Wave 17 Specific Verification |
|----------|-------------------------------|
| BD-020 | `ParsingInstructionsModal.tsx`: clean component structure, no god-component (single responsibility: display templates + free-text input + confirm/cancel). |
| BD-021 | TypeScript strictness: no `any` in modal, hook, or Edge Function TypeScript code. `user_instructions` type must be explicit (`string \| null` or `string \| undefined`). |
| BD-022 | Architecture alignment: split system/user prompt layer in parsing.py matches the architecture declared in the wave scope (not a simple string concatenation workaround). |

### 4.7 — A-032 Column Compliance (Mandatory Pre-Check)

Before any overlay checks, IAA will:
1. Read migration DDL file(s) directly — every line.
2. Cross-check every column referenced in `criteria_documents` INSERT/UPDATE in index.ts against the DDL.
3. Cross-check every column referenced in `parsing_instruction_templates` INSERT in seed files against the DDL.
4. Any column referenced in application code that does NOT exist in migration DDL = immediate REJECTION-PACKAGE.

### 4.8 — OVL-AM-CST-01: CST Checkpoint

Wave 17 introduces a new cross-boundary integration point:
- **Batch A** (schema) feeds **Batch C** (Edge Function write-back to new column)
- **Batch B** (AI Gateway) feeds **Batch C** (Edge Function calls AI Gateway with new field)
- **Batches A+B+C** feed **Batch D** (UI reads templates, sends instructions)
- **Batch E** (QA) must confirm integration, not just unit behaviour

Per `COMBINED_TESTING_PATTERN.md §4.2`: **CST is warranted** at the point all 5 batches converge
before wave completion. If combined delivery (single PR): the test suite run serves as CST
evidence. If sequential per-batch delivery: Foreman must commission an explicit CST after
Batch D before declaring wave QA complete.

### 4.9 — FFA Summary Structure (IAA will produce this at handover)

```
FFA Result:
  FFA-01 Delivery Completeness: [PASS|FAIL] — All 5 batches + 12 QA tests present
  FFA-02 Wiring Verification: [PASS|FAIL] — UI→Hook→EdgeFn→AIGateway→GPT→DB chain
  FFA-03 Integration Fit: [PASS|FAIL] — user_instructions flows end-to-end
  FFA-04 Security: [PASS|FAIL] — Prompt injection mitigation; RLS completeness
  FFA-05 Code Quality: [PASS|ADVISORY|FAIL] — TypeScript strictness; component structure
  FFA-06 One-Time Build: [PASS|FAIL] — User can configure+trigger parse first deployment
  FFA-CARRY-FORWARD: [NONE|ISSUED] — any pre-existing debt visible in touched files
```

---

## § 5 — Required PREHANDOVER Proof Structure

The producing agent(s) MUST commit a PREHANDOVER proof before invoking IAA.
Per A-029 (§4.3b Artifact Immutability): PREHANDOVER proof is committed BEFORE IAA runs and is
READ-ONLY thereafter. The `iaa_audit_token` field must be pre-populated with the expected
token reference in format `IAA-session-NNN-wave17-YYYYMMDD-PASS`.

### 5.1 — Mandatory PREHANDOVER Proof Sections

```markdown
# PREHANDOVER Proof — Wave 17: User-Guided AI Parsing Instruction System

## Delivery Declaration
- wave: "17 — User-Guided AI Parsing Instruction System"
- branch: copilot/implement-user-guided-ai-parsing
- producing_agents: [list all builder agents]
- design_defect_corrected: MAT-DES-PARSE-001

## Scope Compliance (A-026 / A-028)
- scope_declaration_matches_diff: [YES — git diff --name-only origin/main...HEAD listed]
- prior_wave_entries_trimmed: [YES]

## Batch Completion Evidence

### Batch A — Schema
- migration_file: [path to new migration DDL]
- table_created: parsing_instruction_templates
- column_added: criteria_documents.parsing_instructions TEXT NULL
- seed_file: [path to seed data or inline evidence]
- rls_policies: [list all policies created]

### Batch B — AI Gateway
- file_modified: apps/mat-ai-gateway/services/parsing.py
- ParseRequest_user_instructions_field: [CONFIRMED — type: str | None]
- gpt_prompt_architecture: [split system/user layer CONFIRMED]
- prompt_injection_mitigation: [describe validation/sanitisation applied]
- user_instructions_max_length: [value declared here]

### Batch C — Edge Function
- file_modified: supabase/functions/invoke-ai-parse-criteria/index.ts
- user_instructions_forwarded_to_ai_gateway: [CONFIRMED]
- criteria_documents_write_back: parsing_instructions column
- column_existence_verified_in_DDL: [YES — Batch A migration adds it]

### Batch D — UI
- ParsingInstructionsModal_tsx_created: [path]
- CriteriaUpload_tsx_updated: [CONFIRMED]
- useCriteria_ts_useTriggerAIParsing_updated: [CONFIRMED]

### Batch E — QA
- tests_T_W17_QA_001_through_012: [ALL GREEN — evidence: test output paste or file path]
- regression_suite: [GREEN — evidence: test run output]

## A-032 Schema Column Compliance Self-Declaration
- migration_DDL_read_directly: [YES]
- criteria_documents_parsing_instructions_column_exists_in_DDL: [YES]
- parsing_instruction_templates_columns_match_app_code: [YES]
- columns_verified: [list all column names cross-checked]

## Evidence Artifacts
- session_memory_file: [path]
- prehandover_file: [this file path]
- iaa_audit_token: "IAA-session-NNN-wave17-YYYYMMDD-PASS"  ← pre-populated expected reference

## Pre-Brief Artifact
- iaa_prebrief_committed: .agent-admin/assurance/iaa-prebrief-wave17-user-guided-parsing.md
- iaa_prebrief_sha: [SHA of Pre-Brief commit]

## wave-current-tasks.md
- updated_for_wave_17: [YES — SHA: [commit SHA]]

## Git Pre-IAA Commit Gate (A-021)
- git_status: [clean working tree evidence]
- git_log_last_3: [show last 3 commits — must include all Wave 17 deliverables]
```

### 5.2 — PREHANDOVER Commit Sequence

Per A-021: ALL deliverables must be committed and pushed BEFORE invoking IAA.
Per A-029: PREHANDOVER proof is READ-ONLY post-commit — IAA writes token to dedicated file.

Required commit sequence:
1. Commit all Batch A–E deliverables
2. Commit PREHANDOVER proof with pre-populated expected token reference
3. Commit session memory
4. **Verify**: `git status` = clean, `git log` shows all deliverables committed
5. **Then**: invoke IAA

---

## § 6 — Scope Blockers and Governance Conflicts

### 6.1 — wave-current-tasks.md Stale ⚠️

**Current state**: wave-current-tasks.md references `wave-ai-criteria-creation-fix` (completed).
**Required action**: Foreman must update wave-current-tasks.md to declare Wave 17 scope, task IDs,
and batch register BEFORE delegating builder tasks.
**Risk if not corrected**: A-026 violation at handover — stale wave-current-tasks.md = BL-027
merge gate parity failure. REJECTION-PACKAGE will be issued.

### 6.2 — criteria_documents Table — Existing RLS Coverage ⚠️ VERIFY

**Observation**: The existing `criteria_documents` table has SELECT, INSERT, UPDATE, DELETE RLS
policies (from migrations `20260309000002` and `20260309000003`). The new `parsing_instructions`
column will be added to existing rows. IAA will verify at handover that:
- The existing org-isolation policies cover rows containing `parsing_instructions`
- No new RLS policy is required for the new column specifically
- The `criteria_documents_update_org_isolation` policy permits authenticated users to UPDATE
  their own org's records (required for Edge Function write-back of `parsing_instructions`)

If the existing UPDATE policy scope does not cover service-role write-back from the Edge Function,
a new or amended policy will be required. This is a **potential Batch A gap** — schema-builder
must confirm coverage.

### 6.3 — Prompt Injection Surface Area ⚠️ HIGH RISK

**New attack surface**: Wave 17 introduces the first user-controlled text input into the GPT
prompt pipeline. This is categorically new risk not present in Waves 1–16.

IAA declares this a **pre-existing governance gap that Wave 17 must close**. If the implementation
does not include:
- Length validation on `user_instructions`
- Structural separation (user content as user-role message, NOT concatenated into system prompt)
- Rate limiting or abuse prevention at the Edge Function layer

...IAA WILL issue REJECTION-PACKAGE on BD-017/BD-018. The producing agent must design and
implement prompt injection mitigations as part of Batch B and Batch C.

### 6.4 — parsing_instruction_templates RLS — System Template Protection ⚠️

**New governance requirement**: System-default templates (seeded in Batch A) must NOT be
modifiable or deletable by regular authenticated users. The RLS policy must distinguish between:
- `is_system_default = true` rows: SELECT only for authenticated users; no INSERT/UPDATE/DELETE
- `is_system_default = false` rows (user-created): full CRUD within org scope

If schema-builder implements a single permissive RLS policy without this distinction,
IAA will issue REJECTION-PACKAGE on BD-015 (RLS completeness).

### 6.5 — Edge Function Fire-and-Forget Pattern

**Existing pattern**: The Edge Function uses `EdgeRuntime.waitUntil()` fire-and-forget pattern
(from issue #1019 hotfix). The `user_instructions` write-back to `criteria_documents.parsing_instructions`
must be compatible with this pattern. Specifically:
- The write-back should occur BEFORE the async fire-and-forget separation (so it is committed
  even if the AI Gateway call fails), OR
- It must be included in the `waitUntil()` background task with appropriate error handling
  that does not silently swallow failures.

If `user_instructions` is only written back inside the fire-and-forget task and the AI Gateway
call fails, the `parsing_instructions` column will remain NULL with no way to diagnose the
user's intended instructions. IAA will examine this at handover.

### 6.6 — No AGENT_CONTRACT or CANON Changes Expected

Wave 17 is a pure application build wave. No agent contract files or canon governance files
are expected in the diff. If any appear, IAA will re-classify the affected artifact under
AGENT_CONTRACT or CANON_GOVERNANCE categories respectively (A-022 — re-evaluate trigger
categories on every invocation).

---

## § 7 — Qualification Summary

| Task / Batch | Qualifying? | IAA Trigger Category | IAA Required? |
|-------------|------------|---------------------|---------------|
| Batch A — Schema Migration | **YES** | AAWP_MAT + A-032 | **YES — MANDATORY** |
| Batch B — AI Gateway | **YES** | AAWP_MAT + BD-017/BD-018 watchpoint | **YES — MANDATORY** |
| Batch C — Edge Function | **YES** | AAWP_MAT + A-032 | **YES — MANDATORY** |
| Batch D — UI | **YES** | AAWP_MAT | **YES — MANDATORY** |
| Batch E — QA | **YES** | AAWP_MAT | **YES — MANDATORY** |
| MAT-DES-PARSE-001 Design Defect Closure | **YES** | AAWP_MAT | **YES — MANDATORY** |

**Total qualifying tasks**: 6 (covering 5 batches + design defect closure)
**PHASE_A_ADVISORY status**: NOT APPLICABLE — Phase B Blocking is ACTIVE
**Pre-Brief artifact status**: QUALIFYING — all tasks are AAWP_MAT with A-032 secondary trigger

---

## § 8 — IAA Invocation Instructions for Foreman

When ready for handover, invoke IAA as follows:

```
@independent-assurance-agent
Wave 17 — User-Guided AI Parsing Instruction System is ready for assurance review.

Branch: copilot/implement-user-guided-ai-parsing
PREHANDOVER proof: [path]
Session memory: [path]
Pre-Brief artifact: .agent-admin/assurance/iaa-prebrief-wave17-user-guided-parsing.md

Please execute Phase 2–4 assurance per this Pre-Brief.
Expected IAA token: IAA-session-NNN-wave17-YYYYMMDD-PASS
```

IAA will:
1. Load this Pre-Brief artifact
2. Verify PREHANDOVER proof completeness (CORE-018)
3. Execute all declared FFA checks (§ 4 above)
4. Apply A-032 schema column compliance (§ 4.7)
5. Issue ASSURANCE-TOKEN or REJECTION-PACKAGE

---

**Pre-Brief Authority**: CS2 (@APGI-cmy) — issue: "Wave 17 — User-Guided AI Parsing Instruction System"
**IAA Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE — all findings = REJECTION-PACKAGE
**Produced**: 2026-03-11
**Version**: 1.0.0
