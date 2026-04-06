# IAA Pre-Brief — Pre-MMM Build Readiness

**Agent**: independent-assurance-agent  
**Contract Version**: 2.3.0 | **Agent Version**: 6.2.0  
**Adoption Phase**: PHASE_B_BLOCKING (hard gate ACTIVE)  
**Wave**: pre-mmm-build-readiness  
**Branch**: copilot/pre-mmm-build-readiness-orchestration  
**Pre-Brief Generated**: 2026-04-06  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Phase**: PHASE_0 — PRE-BRIEF (IAA does NOT assure in this invocation — generates readiness declaration only)

---

## 0. Pre-Brief Invocation Confirmation

This artifact was generated in response to a `[IAA PRE-BRIEF REQUEST]` on the issue:
"Pre-MMM Build Readiness: Orchestrate Layer-Down, Knowledge Upgrade & Governance Compliance"
in repository APGI-cmy/maturion-isms, branch `copilot/pre-mmm-build-readiness-orchestration`.

This is a **PHASE_0 Pre-Brief only**. Phases 2–4 (assurance/verdict) are NOT executed here.
IAA will be re-invoked by Foreman at PREHANDOVER stage for full Phase 2–4 assurance.

---

## 1. Wave Task Classification

### TASK-1: Governance Layer-Down & Canon Propagation
- **Status in wave-current-tasks.md**: COMPLETE — @APGI-cmy confirmed "Ripple Integration — No Drift Detected. No PR required."
- **IAA Classification**: NOT QUALIFYING for this wave — task complete, no PR artifact to assure.
- **Action**: None.

---

### TASK-2: IAA Agent Tier 2/3 Knowledge & QA Coverage
**Scope**:
- Update `.agent-workspace/independent-assurance-agent/knowledge/` overlays, triggers, checklists to incorporate:
  - `PRE_BUILD_STAGE_MODEL_CANON.md` ✅ (confirmed present in `governance/canon/`)
  - `MANDATORY_CROSS_APP_COMPONENTS.md` ✅ (confirmed present in `governance/canon/`)
  - `FAILURE_PROMOTION_RULE.md` ✅ (confirmed present in `governance/canon/`)
  - `WE_ONLY_FAIL_ONCE_DOCTRINE` (embedded in FAILURE_PROMOTION_RULE.md or FAIL-ONLY-ONCE.md)
  - Version references to latest `AGENT_HANDOVER_AUTOMATION.md`
- Add FFA (Functional Fitness Assessment) overlay/checklist entries to enforce pre-build gates for MMM FRS pre-brief and handover QA/alignment
- Confirm target state of `index.md`, overlays, and trigger tables (no stale/missing references)

**IAA Trigger Classification**: `KNOWLEDGE_GOVERNANCE` — **MANDATORY IAA**
- Trigger: Files in `.agent-workspace/independent-assurance-agent/knowledge/` are created or modified
- Rule: iaa-trigger-table.md §Step 6 — KNOWLEDGE_GOVERNANCE: Mandatory. Evidence bundle + PREHANDOVER ceremony required (FAIL-ONLY-ONCE A-015).
- Evidence bundle required: YES per A-015

**Scope Note — AGENT_HANDOVER_AUTOMATION version**:
> ⚠️ **ADVISORY — SCOPE CLARIFICATION REQUIRED**: The issue scope references updating knowledge to
> "latest AGENT_HANDOVER_AUTOMATION.md (v1.1.4)". Current canon version is **v1.1.3** (confirmed
> in `governance/canon/AGENT_HANDOVER_AUTOMATION.md`). v1.1.4 **does not currently exist**.
>
> **If v1.1.4 is NOT being authored in this wave**: TASK-2 must reference v1.1.3 (current) in
> knowledge updates. Do not reference a non-existent version.
>
> **If v1.1.4 IS being authored in this wave**: That constitutes a `CANON_GOVERNANCE` change and
> requires a separate IAA trigger/review of the canon file itself. The PR will be `MIXED`
> (CANON_GOVERNANCE + KNOWLEDGE_GOVERNANCE). IAA must be invoked once for the whole PR.
>
> **Pre-Brief decision**: Use v1.1.3 references in TASK-2 knowledge files unless CS2 separately
> authorises and delivers the v1.1.4 canon amendment. This is NOT a blocker to proceeding —
> it is a scoping clarification. Foreman to confirm with CS2 before executing TASK-2.

---

### TASK-3A: Correct `modules/MMM/module.manifest.json`
**Current state confirmed**: `module_slug: "risk-management"`, `module_name: "Risk Management"`, `canonical_root: "modules/risk-management"` — **IDENTITY MISMATCH with MMM module**

**IAA Trigger Classification**: Standalone, this is a module metadata correction (not in governance/canon, not an agent contract, not CI/workflow, not knowledge governance). If delivered in the **same PR as TASK-2** → `MIXED` → IAA mandatory for the whole PR.

---

### TASK-3B: Correct `modules/MMM/BUILD_PROGRESS_TRACKER.md`
**Current state confirmed**: Says "Risk Management / risk-management" — identity mismatch confirmed.

**IAA Trigger Classification**: Same as TASK-3A. Module documentation correction. In a MIXED PR with TASK-2 → IAA mandatory.

---

### TASK-3C: Rewrite `modules/MMM/02-architecture/architecture.md`
**Current state confirmed**: Contains only `# Risk Management Architecture\nCanonical architecture assets are organized under \`02-architecture/capabilities/\`.` — minimal placeholder with wrong module identity.

**IAA Trigger Classification**: Module documentation correction. In a MIXED PR → IAA mandatory.

---

### TASK-3D: Legacy `modules/MMM/02-architecture/capabilities/` Recommendations
**Legacy directories identified**: `erm-framework`, `risk-assessment`, `threat-module`, `vulnerability-module`, `wrac` (5 subdirectories under legacy capabilities)

**Output artifact**: `.agent-workspace/foreman-v2/personal/mmm-legacy-capabilities-recommendations.md`

**IAA Trigger Classification**: Recommendation document in `.agent-workspace/foreman-v2/personal/` — this is NOT a knowledge governance file (not in `*/knowledge/`). If delivered standalone: EXEMPT. If in same PR as TASK-2: MIXED → IAA mandatory. IAA will review this document as part of the overall PR evidence bundle.

---

## 2. Overall PR Trigger Category

| Trigger | Source Task | Category | IAA Required? |
|---------|-------------|----------|---------------|
| `.agent-workspace/independent-assurance-agent/knowledge/` changes | TASK-2 | KNOWLEDGE_GOVERNANCE | YES — MANDATORY |
| `modules/MMM/` documentation corrections | TASK-3A/3B/3C | (module doc — see note) | Via MIXED rule |
| `.agent-workspace/foreman-v2/personal/` recommendations doc | TASK-3D | (foreman workspace doc) | Via MIXED rule |

**Final PR Category: `MIXED`**
- Dominant trigger: `KNOWLEDGE_GOVERNANCE` (TASK-2)
- TASK-3 artifacts co-travel in same PR → MIXED rule applies → IAA mandatory for entire PR
- Ambiguity rule: If any doubt about TASK-3 classification → MANDATORY per FAIL-ONLY-ONCE A-003

**IAA Required**: **YES — MANDATORY**

---

## 3. FFA Checks IAA Will Run at Handover (Full Assurance Phase 2–4)

The following FAIL-ONLY-ONCE rules and overlay checks will be applied at IAA invocation (PREHANDOVER stage):

### FAIL-ONLY-ONCE Rules (Mandatory)

| Rule | Description | Applies Because |
|------|-------------|-----------------|
| A-001 | IAA invocation evidence must be present for triggering PRs | KNOWLEDGE_GOVERNANCE trigger present |
| A-015 | Tier 2 Knowledge Patches require full PREHANDOVER ceremony — no content-type exemption | KNOWLEDGE_GOVERNANCE trigger |
| A-021 | Commit and push before IAA invocation (CI run evidence required) | All triggering PRs |
| A-022 | Re-evaluate trigger categories on every IAA invocation | Standing rule |
| A-023 | OVL-AC-012 ripple assessment is a standing PREHANDOVER requirement | Standing rule |
| A-026 | SCOPE_DECLARATION.md must be updated to exactly match PR diff | Standing rule |
| A-028 | SCOPE_DECLARATION format compliance — list format, prior-wave entries trimmed | Standing rule |
| A-029 | PREHANDOVER proof is read-only post-commit | Standing rule — §4.3b |
| A-029b | Carry-forward mandate check — confirm no open CFMs from prior waves | Standing rule |

### KNOWLEDGE_GOVERNANCE Overlay Checks (OVL-KG-001 through OVL-KG-005)

Per `iaa-category-overlays.md` §KNOWLEDGE_GOVERNANCE Overlay (v3.6.0):

| Check | Description |
|-------|-------------|
| OVL-KG-001 | All updated knowledge files have version numbers bumped |
| OVL-KG-002 | `index.md` is updated to reflect all changes (no stale entries) |
| OVL-KG-003 | Changed overlays/triggers reference only currently-existing canon files |
| OVL-KG-004 | No existing mandatory checks are weakened or removed |
| OVL-KG-005 | New checks added align with IAA's role as quality engineer (90/10 rule) |

### Additional Checks for This Wave

| Check | Description | Source |
|-------|-------------|--------|
| KG-TASK2-01 | PRE_BUILD_STAGE_MODEL_CANON.md triggers/checks added to overlay — verify against canon source | TASK-2 scope |
| KG-TASK2-02 | MANDATORY_CROSS_APP_COMPONENTS.md triggers/checks added — verify against canon source | TASK-2 scope |
| KG-TASK2-03 | FAILURE_PROMOTION_RULE.md (WE_ONLY_FAIL_ONCE) checks incorporated — non-duplication with existing FAIL-ONLY-ONCE rules | TASK-2 scope |
| KG-TASK2-04 | FFA overlay additions enforce pre-build gates without weakening existing checks (NO-WEAKEN-001) | TASK-2 scope |
| KG-TASK2-05 | Version reference accuracy — knowledge files cite v1.1.3 (current) unless v1.1.4 is separately canonised | TASK-2 scope + Advisory above |
| KG-TASK2-06 | trigger-table.md updated with any new trigger categories — new categories do not create blind spots | TASK-2 scope |
| MMM-TASK3-01 | `modules/MMM/module.manifest.json` — all identity fields correct (module_slug = "mmm" or "MMM", module_name = "MMM", canonical_root = "modules/MMM") | TASK-3A scope |
| MMM-TASK3-02 | `modules/MMM/BUILD_PROGRESS_TRACKER.md` — Module heading, slug references corrected to MMM | TASK-3B scope |
| MMM-TASK3-03 | `modules/MMM/02-architecture/architecture.md` — rewritten as MMM placeholder (no Risk Management identity residue) | TASK-3C scope |
| MMM-TASK3-04 | Legacy capabilities recommendations document present and contains actionable recommendations for all 5 directories: erm-framework, risk-assessment, threat-module, vulnerability-module, wrac | TASK-3D scope |

### Core Invariants (from iaa-core-invariants-checklist.md)
All core invariants will be applied per standard Phase 3 protocol at assurance time.

---

## 4. Required PREHANDOVER Proof Structure

Per `AGENT_HANDOVER_AUTOMATION.md` v1.1.3 + FAIL-ONLY-ONCE A-015 + A-029:

The producing agent (governance-liaison-isms-agent / Foreman) **must commit** a PREHANDOVER proof at:
`.agent-workspace/foreman-v2/memory/PREHANDOVER-session-pre-mmm-build-readiness-20260406.md`
(or equivalent date-stamped name per wave-current-tasks.md D-PREHANDOVER entry)

**Required fields (IAA will check each at invocation)**:

```yaml
session_id: session-pre-mmm-build-readiness-20260406
wave: pre-mmm-build-readiness
branch: copilot/pre-mmm-build-readiness-orchestration
date: 2026-04-06
producing_agents:
  - governance-liaison-isms-agent
  - foreman-v2-agent (orchestrator/proof author)

# === TASK COMPLETION ===
tasks_complete:
  TASK-1: "COMPLETE — @APGI-cmy confirmed No Drift Detected, no PR required"
  TASK-2: "[PASS/FAIL] — IAA knowledge overlays/triggers/checklists updated"
  TASK-3A: "[PASS/FAIL] — modules/MMM/module.manifest.json corrected to MMM"
  TASK-3B: "[PASS/FAIL] — modules/MMM/BUILD_PROGRESS_TRACKER.md corrected to MMM"
  TASK-3C: "[PASS/FAIL] — modules/MMM/02-architecture/architecture.md rewritten as MMM"
  TASK-3D: "[PASS/FAIL] — mmm-legacy-capabilities-recommendations.md produced"

# === ARTIFACT EVIDENCE (git SHA or 'committed') ===
artifacts_committed:
  iaa_knowledge_overlays: "<path> — <git SHA>"
  iaa_knowledge_trigger_table: "<path> — <git SHA>"
  iaa_knowledge_index: "<path> — <git SHA>"
  mmm_module_manifest: "modules/MMM/module.manifest.json — <git SHA>"
  mmm_build_tracker: "modules/MMM/BUILD_PROGRESS_TRACKER.md — <git SHA>"
  mmm_architecture: "modules/MMM/02-architecture/architecture.md — <git SHA>"
  mmm_legacy_recommendations: ".agent-workspace/foreman-v2/personal/mmm-legacy-capabilities-recommendations.md — <git SHA>"

# === SCOPE DECLARATION ===
scope_declaration_updated: "YES — SCOPE_DECLARATION.md updated and matches PR diff"
scope_declaration_format: "list format, prior-wave entries trimmed per A-028"

# === RIPPLE ASSESSMENT (OVL-AC-012 / A-023) ===
ripple_assessment:
  knowledge_governance_ripple: "<did IAA knowledge changes require ripple to other agent knowledge files? YES/NO + justification>"
  mmm_identity_ripple: "<did MMM identity correction require updates to any canon or pointer files? YES/NO + justification>"

# === VERSION REFERENCES ===
agent_handover_automation_version_cited: "v1.1.3"
  # Note: Use v1.1.3 unless CS2 separately delivers v1.1.4 canon amendment in this PR.

# === IAA AUDIT TOKEN ===
iaa_audit_token: "PENDING — IAA invocation reference (populated by IAA at Phase 4)"
  # Per A-029: this field is PENDING before IAA invocation.
  # Per §4.3b: IAA writes its token to dedicated file; PREHANDOVER proof is immutable post-commit.

# === CI EVIDENCE ===
ci_run_evidence: "<CI run URL or SHA — must be committed and CI run initiated before IAA invocation per A-021>"
```

> ⚠️ **A-029 / §4.3b Reminder**: Once the PREHANDOVER proof file is committed, it is **read-only**.
> IAA will NOT edit it. IAA writes its token to a dedicated file:
> `.agent-admin/assurance/iaa-token-session-pre-mmm-build-readiness-YYYYMMDD.md`
> The `iaa_audit_token` field above must contain `"PENDING"` before first commit.

---

## 5. Scope Blockers & Governance Conflicts

### 5.1 — ADVISORY: AGENT_HANDOVER_AUTOMATION v1.1.4 Does Not Exist

| Severity | ADVISORY (non-blocking) |
|----------|------------------------|
| Finding | Issue scope references updating IAA knowledge to "AGENT_HANDOVER_AUTOMATION.md (v1.1.4)" but current canon version is v1.1.3. v1.1.4 has NOT been authored. |
| Risk | If governance-liaison-isms-agent updates knowledge files citing v1.1.4, IAA will FAIL OVL-KG-003 (changed overlays must reference existing canon files). |
| Resolution | **Option A** (preferred): Use v1.1.3 references throughout TASK-2. No canon amendment needed. **Option B**: CS2 separately authors and commits AGENT_HANDOVER_AUTOMATION v1.1.4 as a CANON_GOVERNANCE change (separate IAA invocation) BEFORE TASK-2 knowledge files reference it. |
| Action required | Foreman to confirm with CS2 before governance-liaison-isms-agent executes TASK-2. |

### 5.2 — ADVISORY: MMM Module Identity vs. Risk Management Module Overlap

| Severity | ADVISORY (non-blocking) |
|----------|------------------------|
| Finding | `modules/MMM/module.manifest.json` currently declares `canonical_root: "modules/risk-management"` and references `Maturion/Risk Management` as legacy source. A separate `modules/risk-management/` directory may exist. |
| Risk | Correcting MMM manifest to `canonical_root: "modules/MMM"` may orphan existing pointers from other files (CANONICAL_MODULE_POINTER.md in legacy paths). |
| Resolution | TASK-3A corrections should verify: (1) modules/risk-management/ exists as a separate module or is a legacy stub; (2) the legacy_pointer `Maturion/Risk Management/CANONICAL_MODULE_POINTER.md` is updated if it references risk-management as the canonical root of MMM. |
| Action required | governance-liaison-isms-agent to scope-check before correcting manifest. |

### 5.3 — NO HARD BLOCKERS

No HALT conditions identified. Wave may proceed with the advisories above addressed.

---

## 6. Applicable Canon Sources for TASK-2

The following canon files are confirmed present and should be the source material for TASK-2 knowledge updates:

| Canon File | Path | Status |
|-----------|------|--------|
| PRE_BUILD_STAGE_MODEL_CANON.md | `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` | ✅ PRESENT |
| MANDATORY_CROSS_APP_COMPONENTS.md | `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` | ✅ PRESENT |
| FAILURE_PROMOTION_RULE.md | `governance/canon/FAILURE_PROMOTION_RULE.md` | ✅ PRESENT |
| PRE_BUILD_REALITY_CHECK_CANON.md | `governance/canon/PRE_BUILD_REALITY_CHECK_CANON.md` | ✅ PRESENT (bonus — review for relevance) |
| AGENT_HANDOVER_AUTOMATION.md | `governance/canon/AGENT_HANDOVER_AUTOMATION.md` | ✅ v1.1.3 |
| LIVING_AGENT_SYSTEM.md | `governance/canon/LIVING_AGENT_SYSTEM.md` | ✅ (presumed present per canon inventory) |

---

## 7. FFA Overlay Definition (for TASK-2 Implementation Reference)

> **Note**: This section is IAA's advisory input to TASK-2. It is NOT a binding specification —
> TASK-2 must derive overlay content from canon source files. This is provided to clarify
> what IAA will check at handover.

**New trigger category to consider adding to `iaa-trigger-table.md`**:

| Category | Trigger Condition | IAA Required? |
|----------|------------------|---------------|
| `PRE_BUILD_GOVERNANCE` | Any PR that claims to deliver a pre-build readiness gate, FRS pre-brief, or module stage transition (PRE_BUILD_STAGE_MODEL stages 0→1 or 1→2) | YES — MANDATORY |

**FFA checks IAA expects to find in updated overlays** (cross-referenced to canon sources):

| Check ID (proposed) | Description | Source Canon |
|--------------------|-------------|--------------|
| OVL-PBG-001 | PRE_BUILD_STAGE_MODEL stage gate evidence present for claimed stage | PRE_BUILD_STAGE_MODEL_CANON.md |
| OVL-PBG-002 | MANDATORY_CROSS_APP_COMPONENTS declared/addressed in module pre-build artifacts | MANDATORY_CROSS_APP_COMPONENTS.md |
| OVL-PBG-003 | FAILURE_PROMOTION_RULE applied — no silent suppression of failing gates | FAILURE_PROMOTION_RULE.md |
| OVL-PBG-004 | WE_ONLY_FAIL_ONCE: known failure patterns not re-introduced | FAILURE_PROMOTION_RULE.md + FAIL-ONLY-ONCE.md |
| OVL-PBG-005 | Pre-build evidence bundle complete per stage gate requirements | PRE_BUILD_STAGE_MODEL_CANON.md |

---

## 8. Summary

| Item | Status |
|------|--------|
| TASK-1 | NOT QUALIFYING — complete, no PR |
| TASK-2 | QUALIFYING — KNOWLEDGE_GOVERNANCE — IAA MANDATORY at handover |
| TASK-3A/3B/3C/3D | QUALIFYING (MIXED rule — co-travel with TASK-2) — IAA MANDATORY at handover |
| Overall PR category | MIXED (dominant: KNOWLEDGE_GOVERNANCE) |
| IAA Required at Handover | YES — PHASE_B_BLOCKING |
| Hard Blockers | NONE |
| Advisories | 2 (v1.1.4 non-existence; MMM/risk-management overlap) |
| PREHANDOVER proof structure | DECLARED above (§4) |
| FFA checks declared | YES — A-001, A-015, A-021..A-029b, OVL-KG-001..005, KG-TASK2-01..06, MMM-TASK3-01..04 |

---

**Pre-Brief Status**: COMPLETE  
**Next action**: Foreman to resolve advisory §5.1 (v1.1.4 clarification with CS2), then invoke governance-liaison-isms-agent for TASK-2 and TASK-3. IAA will be re-invoked at PREHANDOVER stage for full assurance.

**Token**: `IAA-PREBRIEF-pre-mmm-build-readiness-20260406` *(Pre-Brief only — no verdict issued in Phase 0)*

---

*Independent Assurance Agent | v6.2.0 | PHASE_B_BLOCKING | Authority: CS2 only*
