# IAA Wave Record — wave-active-tracker-coherence-20260419

**Agent**: independent-assurance-agent v6.2.0
**Wave**: wave-active-tracker-coherence-20260419
**Issue**: maturion-isms#1412 — Canonize active-wave tracker coherence so final assurance cannot coexist with stale pending task artifacts
**Branch**: copilot/canonize-active-wave-tracker-coherence
**Created**: 2026-04-19
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## PRE-BRIEF

**Generated**: 2026-04-19 (Phase 0 invocation)
**Invoked by**: Foreman (via issue #1412 PRE-BRIEF request)
**Mode**: PRE-BRIEF ONLY — Phases 1–4 NOT executed

---

### Step 0.1 — Mode Confirmation

PRE-BRIEF mode confirmed. Triggered by `action: "PRE-BRIEF"` request on wave `wave-active-tracker-coherence-20260419`. Phase 1–4 assurance phases are NOT executed in this invocation.

---

### Step 0.2 — Qualifying Tasks

Trigger table (`iaa-trigger-table.md` v2.4.0) applied to all declared file changes:

| Task ID | Description | Files Modified | Trigger Category | IAA Required |
|---------|-------------|---------------|-----------------|--------------|
| T1 | New named anti-pattern — active-wave/task tracker contradiction | `governance/checklists/execution-ceremony-admin-anti-patterns.md` | MIXED → CANON_GOVERNANCE (AMBIGUITY RULE: governance/checklists/ not explicitly listed → resolves to mandatory) | YES |
| T2 | New IAA rejection trigger — active-tracker contradiction | `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` | CANON_GOVERNANCE | YES |
| T3 | ECAP/Foreman checklist rows for active tracker normalization before final handback | `governance/checklists/execution-ceremony-admin-checklist.md` | MIXED → MANDATORY (AMBIGUITY RULE) | YES |
| T4 | Definition of "active control artifact" vs "immutable historical archive" | Canon or template (TBD by Foreman) | CANON_GOVERNANCE or MIXED → MANDATORY | YES |
| T5 | Template updates — wave/task tracker expected normalized form | `governance/templates/execution-ceremony-admin/` (template files) | MIXED → MANDATORY (AMBIGUITY RULE) | YES |
| T6 | Proof-of-operation worked examples: (a) PASS + stale active tracker = BLOCKED, (b) PASS + normalized active tracker = ALLOWED | Templates/canon (TBD by Foreman) | MIXED → MANDATORY | YES |
| T7 | FAIL-ONLY-ONCE A-rule candidate (new A-rule for active-tracker coherence) | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | KNOWLEDGE_GOVERNANCE | YES |
| T8 | wave-reconciliation-checklist.md update (possible — active tracker normalization check row) | `.agent-workspace/foreman-v2/knowledge/wave-reconciliation-checklist.md` | KNOWLEDGE_GOVERNANCE | YES |
| T9 | AGENT_HANDOVER_AUTOMATION.md (possible — active tracker gate in §4.3e) | `governance/canon/AGENT_HANDOVER_AUTOMATION.md` | CANON_GOVERNANCE | YES |

**All 9 tasks qualify for IAA. IAA mandatory for the entire wave.**

**Highest trigger**: MIXED (CANON_GOVERNANCE + KNOWLEDGE_GOVERNANCE).
**AMBIGUITY RULE**: Ambiguity about governance/checklists/ and governance/templates/ → resolves to mandatory. No exemption.

---

### Applicable Overlay

```
Qualifying tasks: [T1, T2, T3, T4, T5, T6, T7, T8, T9] — all 9 qualify
Applicable overlay: MIXED → CANON_GOVERNANCE (primary) + KNOWLEDGE_GOVERNANCE (secondary)
Anti-regression obligations: YES — see §Anti-Regression Obligations below
```

---

### Anti-Regression Obligations

**YES** — the following standing obligations apply to this wave:

1. **ACR/AAP numbering continuity** (FAIL-ONLY-ONCE — structural prevention):
   - Current highest ACR = **ACR-14** (in `INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.8.0 and `execution-ceremony-admin-anti-patterns.md` v1.3.0) → **next must be ACR-15**
   - Current highest AAP = **AAP-20** (in `execution-ceremony-admin-anti-patterns.md` v1.3.0) → **next must be AAP-21**
   - New entries MUST NOT reuse, skip, or collide with existing numbers.

2. **IAA FAIL-ONLY-ONCE A-rule continuity**:
   - Current highest IAA A-rule = **A-035** (in `FAIL-ONLY-ONCE.md` v2.7.0) → **next available is A-036**
   - If this wave adds a new IAA FAIL-ONLY-ONCE rule, it MUST be A-036.

3. **Existing ACR-01–ACR-14 non-regression**:
   - New ACR trigger must not weaken, supersede, or contradict existing rejection triggers without explicit CS2 authorization.
   - The active-tracker coherence ACR (ACR-15) must be structured consistently with ACR-01 through ACR-14 table format.

4. **Existing AAP-01–AAP-20 non-regression**:
   - New anti-pattern (AAP-21) must extend the existing table and use the same severity classification system (S1 = Auto-Fail).

5. **CANON_INVENTORY version discrepancy — BLOCKER** (see Scope Blockers):
   - CANON_INVENTORY.json currently records `INDEPENDENT_ASSURANCE_AGENT_CANON.md` at **v1.6.0**, but the file is now **v1.8.0**.
   - This wave WILL bump the canon to v1.9.0. The producing agent MUST update CANON_INVENTORY.json with the new version AND correct SHA256 hash at final commit. Failure = ACR-05 at final audit.

6. **FUNCTIONAL-BEHAVIOUR-REGISTRY (NBR entries)**:
   - **NOT applicable** to this wave — governance-only changes, no BUILD/AAWP_MAT application code.

7. **A-023 / ACR-14 (Ripple/Cross-Agent Assessment)**:
   - PREHANDOVER for this wave MUST contain `## Ripple/Cross-Agent Assessment` section.
   - Must explicitly address downstream impact on: IAA (new ACR trigger loaded at runtime), execution-ceremony-admin-agent (new anti-pattern + checklist rows), Foreman (FAIL-ONLY-ONCE changes + wave-reconciliation checklist), all governed agents (new merge-block conditions at wave close).

---

### PREHANDOVER Structure Requirements

The PREHANDOVER proof for this wave **MUST** contain the following (IAA will verify all at Final Audit):

| Field/Section | Required | Rule Reference |
|---------------|----------|---------------|
| `iaa_audit_token: IAA-session-[NNN]-wave-active-tracker-coherence-20260419-PASS` | YES — pre-populated (NOT PENDING) | A-029 / §4.3b |
| `## Ripple/Cross-Agent Assessment` — non-blank, concrete downstream conclusions | YES | A-023 / ACR-14 / AAP-20 |
| `## Wave Gap Register` | YES | A-020 |
| `## Architecture Ripple/Impact Assessment` | YES | A-020 |
| `gate_set_checked: [list of gates]` — specific gates named and confirmed GREEN | YES | AAP-15 / ACR-12 |
| SCOPE_DECLARATION.md matching actual PR diff exactly | YES | A-026 / ACR-04 |
| No PENDING / in-progress wording in any final-state field | YES | AAP-01 / ACR-02 |
| No pre-final instruction wording (AAP-17 denylist) | YES | AAP-17 / ACR-09 |
| Cross-artifact consistency (PREHANDOVER + session memory + wave record all post-token) | YES | AAP-18 / ACR-10 |
| ECAP reconciliation summary (if ceremony_admin_appointed = true) | YES (see Scope Blocker 2) | ACR-01 |
| PUBLIC_API ripple assessment in ECAP reconciliation (if any PUBLIC_API files changed) | CONDITIONAL | AAP-08 / ACR-06 |
| `## IAA Agent Response (verbatim)` — DO NOT include in PREHANDOVER proof | PROHIBITED | A-029 / §4.3b |

---

### Proof Phases Required

| Phase | Required for This Wave | Notes |
|-------|----------------------|-------|
| Phase 1 — Preflight Proof | YES | Agent identity, capabilities, prohibitions acknowledged |
| Phase 2 — Governance Proof | YES | Canon citations + hash validation for all modified canon files |
| Phase 3 — Working Phase Proof | STRONGLY RECOMMENDED | Substantive rationale for each new ACR/AAP entry and A-rule; required for IAA substance evaluation |
| Phase 4 — Handover Proof (PREHANDOVER) | YES | GREEN state + ECAP bundle + ripple assessment |
| ECAP Ceremony Bundle | YES (if ceremony_admin_appointed = true, see Blocker 2) | ECAP reconciliation summary required; ACR-01 fires if absent |
| Phase 5 — IAA Final Audit | YES — MANDATORY | Foreman invokes IAA at Phase 4 completion via `task(agent_type: "independent-assurance-agent")` |

Wave type = CANON_GOVERNANCE + KNOWLEDGE_GOVERNANCE. Per §Risk-Tiered Ceremony Table: T3 = Three-Phase (1, 2, 4). However, A-015 requires PREHANDOVER + session memory for ALL triggered PRs regardless of tier. Combined requirement: **Full Three-Phase (Preflight + Governance + Handover) + PREHANDOVER proof + session memory + ECAP bundle (if appointed)**.

---

### Scope Blockers

The following must be resolved by the Foreman before executing deliverables or invoking IAA at Final Audit:

| ID | Blocker | Impact if Unresolved | Required Action |
|----|---------|---------------------|----------------|
| **BLOCKER-001** | `wave-current-tasks.md` still reflects `mmm-stage9-builder-checklist-20260419`, NOT this wave | IAA cannot verify `ceremony_admin_appointed` at final audit; PREHANDOVER structure cannot be validated against declared tasks | Foreman must update or create a dedicated wave-current-tasks file for `wave-active-tracker-coherence-20260419` before deliverables commence |
| **BLOCKER-002** | `ceremony_admin_appointed` status unknown for this wave | If execution-ceremony-admin-agent IS appointed and produces bundle, ACR-01 applies (ECAP reconciliation summary required); if NOT appointed, ECAP ceremony is skipped — but IAA must know which path was taken | Foreman must declare `ceremony_admin_appointed: true/false` in the wave-current-tasks update |
| **BLOCKER-003** | CANON_INVENTORY.json records `INDEPENDENT_ASSURANCE_AGENT_CANON.md` at v1.6.0 but file is v1.8.0 (2 versions stale) | When this wave bumps canon to v1.9.0, the producing agent must update CANON_INVENTORY.json with the new hash; failure = ACR-05 at Final Audit | Producing agent must update CANON_INVENTORY.json version and SHA256 hash for IAA canon file as part of this wave's commit bundle |
| **BLOCKER-004** | Numbering reservations must be confirmed before writing | Writing ACR-15, AAP-21, or new A-rules without confirming no parallel wave has already used those numbers creates governance collision | Foreman must confirm no active PR has consumed ACR-15, AAP-21, or A-036 since last canon update (2026-04-19) |
| **BLOCKER-005** | "Active control artifact" vs "immutable historical archive" boundary definition requires CS2 pre-approval | This is a new canonical classification that will alter IAA trigger behavior and produce new merge-block conditions; IAA cannot evaluate it at Final Audit without knowing the approved boundary | Foreman must obtain CS2 pre-authorization on the proposed boundary definition before embedding in canon |

---

### Ceremony Admin Status

**ceremony_admin_appointed**: UNKNOWN — wave-current-tasks.md references a different wave (mmm-stage9). See BLOCKER-001 and BLOCKER-002 above.

**Impact**: If appointed: full ECAP bundle + reconciliation summary required (ACR-01). If not appointed: Foreman owns Phase 4 bundle directly. IAA will apply ACR-01 based on declared appointment status in the wave-current-tasks update.

---

### Summary

```
Qualifying tasks:                9 (T1 through T9) — all mandatory
Applicable overlay:              MIXED → CANON_GOVERNANCE (primary) + KNOWLEDGE_GOVERNANCE (secondary)
Anti-regression obligations:     YES — ACR/AAP/A-rule numbering, CANON_INVENTORY hash, non-regression of existing ACR-01–ACR-14, A-023 ripple assessment
Ceremony admin appointed:        UNKNOWN — Foreman must declare (see BLOCKER-002)
Scope blockers:                  5 (BLOCKER-001 through BLOCKER-005)
FFA (NBR checks) required:       NO — governance-only wave
Proof phases required:           Phase 1 + 2 + 3 (recommended) + 4 + ECAP (if appointed) + Phase 5 (IAA Final Audit)
IAA Final Audit:                 MANDATORY — Foreman invokes via task(agent_type: "independent-assurance-agent")
```

---

## TOKEN

*(To be written by IAA after Final Audit — read-only placeholder)*

---

## REJECTION_HISTORY

*(To be written by IAA if REJECTION-PACKAGE is issued — read-only placeholder)*

---

*IAA Wave Record | independent-assurance-agent v6.2.0 | Authority: CS2 (Johan Ras / @APGI-cmy)*
*Phase 0 PRE-BRIEF generated: 2026-04-19*
