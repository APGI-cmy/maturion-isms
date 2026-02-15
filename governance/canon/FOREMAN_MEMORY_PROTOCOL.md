# FOREMAN MEMORY PROTOCOL

## Status
**Type**: Canonical Governance Protocol  
**Authority**: Supreme - Canonical  
**Version**: 1.0.0  
**Effective Date**: 2026-02-08  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Precedence**: Subordinate to GOVERNANCE_PURPOSE_AND_SCOPE.md  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Foreman (FM) Instances, All Repositories

---

## 1. Purpose

This protocol establishes the **canonical memory management requirements** for Foreman (FM) agents, defining:
- FM memory context structure and boundaries
- Memory lifecycle and retention policies
- Learning loop integration and knowledge capture
- Working context generation and maintenance
- Continuity requirements across waves and sessions
- Memory integrity and corruption detection

**Core Principle**: FM memory enables **autonomous orchestration** by providing continuous learning, pattern recognition, and context-aware decision-making across the complete build execution lifecycle.

**Critical Mandate**: FM MUST maintain **wave-level memory continuity** to ensure architectural consistency, builder supervision quality, and learning accumulation across the entire execution lifecycle.

---

## 2. Constitutional Authority

This protocol derives authority from and implements:
- **LIVING_AGENT_SYSTEM.md** — Agent lifecycle, wake-up, memory management, and session closure
- **AGENT_BASELINE_MANAGEMENT_PROTOCOL.md** — Baseline validation and working contract generation
- **FM_ROLE_CANON.md** — FM role definition, authority, and canonical progress recording (§6.1-6.2)
- **FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md** — FM as managerial authority, POLC framework
- **WAVE_MODEL.md** — Wave lifecycle, phase transitions, and wave closure
- **LEARNING_LOOP_CATEGORIES_AND_LIFECYCLE.md** — Learning intake, categorization, and promotion
- **MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md** — Memory integrity enforcement and corruption detection
- **MEMORY_LIFECYCLE_STATE_MACHINE_CONTRACT.md** — Memory lifecycle state constraints
- **COGNITIVE_HYGIENE_MEMORY_INTEGRATION_MODEL.md** — Memory write authority and proposal workflow
- **MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md** — Mandatory learning and improvement capture

---

## 3. FM Memory Architecture

### 3.1 Memory Hierarchy

FM memory operates across **four hierarchical levels**:

```
┌─────────────────────────────────────────────────────────┐
│ LEVEL 1: CONSTITUTIONAL MEMORY (Read-Only)              │
│ - Canonical governance (CANON_INVENTORY.json)           │
│ - Constitutional rules (BUILD_PHILOSOPHY.md, etc.)      │
│ - Agent baseline contract                               │
│ - Authority: Supreme, Immutable                         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ LEVEL 2: WAVE MEMORY (Read-Write, Wave-Scoped)          │
│ - Wave progress artifact (WAVE_N_IMPLEMENTATION_        │
│    PROGRESS.md)                                          │
│ - Architecture documentation (per wave)                 │
│ - QA suite definition (per wave)                        │
│ - Builder instructions and execution history            │
│ - Authority: FM owns, CS2 audits                        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ LEVEL 3: SESSION MEMORY (Read-Write, Session-Scoped)    │
│ - Session memories (.agent-workspace/foreman/memory/)   │
│ - Working contract (generated per session)              │
│ - Phase-specific context (current phase state)          │
│ - Authority: FM owns, Living Agent System enforces      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ LEVEL 4: LEARNING MEMORY (Read-Write, Cross-Wave)       │
│ - Personal lessons learned                              │
│ - Patterns and anti-patterns catalog                    │
│ - Efficiency improvements                               │
│ - Builder performance observations                      │
│ - Authority: FM proposes, CS2 promotes to canon         │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Memory Boundaries

#### Constitutional Memory (Level 1)
- **Source**: maturion-foreman-governance repository
- **Access**: Read-only via LIVING_AGENT_SYSTEM.md wake-up protocol
- **Refresh**: Every session start (always current)
- **Scope**: Universal (applies to all waves, all sessions)
- **Authority**: CS2 only (FM cannot modify)

#### Wave Memory (Level 2)
- **Source**: Consumer repository execution directory
- **Access**: Read-write within wave scope
- **Retention**: Permanent (archived at wave closure)
- **Scope**: Wave-specific (Wave N data does not pollute Wave N+1)
- **Authority**: FM creates and maintains, CS2 audits

#### Session Memory (Level 3)
- **Source**: `.agent-workspace/foreman/memory/` directory
- **Access**: Read-write within session scope
- **Retention**: Rolling window (last 5 sessions + archive)
- **Scope**: Session-specific (captures single execution context)
- **Authority**: FM creates per LIVING_AGENT_SYSTEM.md §3

#### Learning Memory (Level 4)
- **Source**: `.agent-workspace/foreman/personal/` directory
- **Access**: Read-write, cumulative across waves
- **Retention**: Permanent (never deleted)
- **Scope**: Cross-wave (lessons apply universally)
- **Authority**: FM captures, CS2 promotes to canonical governance

---

## 4. FM Memory Lifecycle

### 4.1 Session Start (Wake-Up Phase)

Per LIVING_AGENT_SYSTEM.md §1, FM MUST perform these memory operations:

#### Step 1: Constitutional Memory Load
```bash
# Load canonical governance
source .github/scripts/load-governance.sh

# Validate baseline
validate_baseline "foreman"

# Load CANON_INVENTORY.json
load_canonical_governance
```

#### Step 2: Wave Memory Load
```bash
# Identify current wave
CURRENT_WAVE=$(detect_current_wave)

# Load wave progress artifact
if [ -f "execution-progress/WAVE_${CURRENT_WAVE}_IMPLEMENTATION_PROGRESS.md" ]; then
  WAVE_CONTEXT=$(cat execution-progress/WAVE_${CURRENT_WAVE}_IMPLEMENTATION_PROGRESS.md)
  echo "✅ Wave ${CURRENT_WAVE} context loaded"
else
  echo "⚠️  Wave ${CURRENT_WAVE} progress artifact not found"
  echo "→ Creating new wave progress artifact..."
  create_wave_progress_artifact $CURRENT_WAVE
fi

# Load wave architecture (if exists)
load_wave_architecture $CURRENT_WAVE

# Load wave QA suite (if exists)
load_wave_qa_suite $CURRENT_WAVE
```

#### Step 3: Session Memory Scan
```bash
# Scan last 5 session memories
LAST_5_SESSIONS=$(find .agent-workspace/foreman/memory \
  -name "session-*.md" -type f | sort -r | head -5)

# Extract key learnings
for SESSION in $LAST_5_SESSIONS; do
  extract_lessons_learned "$SESSION"
  extract_patterns_observed "$SESSION"
  extract_blockers_encountered "$SESSION"
done
```

#### Step 4: Learning Memory Integration
```bash
# Load personal lessons learned
LESSONS=$(cat .agent-workspace/foreman/personal/lessons-learned.md)

# Load pattern catalog
PATTERNS=$(cat .agent-workspace/foreman/personal/patterns.md)

# Load anti-patterns
ANTIPATTERNS=$(cat .agent-workspace/foreman/personal/anti-patterns.md)

# Load efficiency improvements
EFFICIENCY=$(cat .agent-workspace/foreman/personal/efficiency-log.md)
```

#### Step 5: Working Contract Generation
```bash
# Generate session-specific working contract
generate_working_contract \
  --constitutional-memory "$GOVERNANCE" \
  --wave-context "$WAVE_CONTEXT" \
  --session-memories "$LAST_5_SESSIONS" \
  --learning-memory "$LESSONS" \
  --patterns "$PATTERNS" \
  --output ".agent-workspace/foreman/working-contract.md"
```

### 4.2 Working Phase (Execution)

During wave execution, FM MUST maintain memory continuity:

#### Continuous Wave Memory Updates
- Update wave progress artifact at **phase transitions** (architecture → QA → build → validation)
- Record **all builder instructions** with timestamps
- Document **all validation results** with pass/fail status
- Capture **all corrections** and **RCA events**
- Maintain **artifact index** (name → path → status)

#### Session Memory Capture (Continuous)
- Record **decisions made** with rationale
- Document **patterns observed** during execution
- Note **efficiency improvements** discovered
- Flag **governance gaps** for later analysis
- Track **builder performance** observations

#### Learning Memory Accumulation
- Capture **mistakes avoided** from past learnings
- Identify **new patterns** or **pattern violations**
- Note **builder anti-patterns** for supervision improvement
- Document **architectural insights** for future waves

### 4.3 Phase Transitions

At each wave phase transition, FM MUST:

```bash
# Phase Transition Memory Protocol
transition_phase() {
  CURRENT_PHASE=$1
  NEXT_PHASE=$2
  
  # 1. Update wave progress artifact
  echo "## Phase Transition: ${CURRENT_PHASE} → ${NEXT_PHASE}" \
    >> execution-progress/WAVE_${CURRENT_WAVE}_IMPLEMENTATION_PROGRESS.md
  echo "**Timestamp**: $(date -u +%Y-%m-%d\ %H:%M:%S\ UTC)" \
    >> execution-progress/WAVE_${CURRENT_WAVE}_IMPLEMENTATION_PROGRESS.md
  
  # 2. Record phase completion criteria met
  record_phase_completion_evidence $CURRENT_PHASE
  
  # 3. Validate prerequisites for next phase
  validate_next_phase_prerequisites $NEXT_PHASE
  
  # 4. Update working contract with next phase context
  refresh_working_contract
  
  # 5. Commit wave memory state
  git add execution-progress/WAVE_${CURRENT_WAVE}_IMPLEMENTATION_PROGRESS.md
  git commit -m "Phase transition: ${CURRENT_PHASE} → ${NEXT_PHASE}"
}
```

### 4.4 Session Closure (Handover Phase)

Per LIVING_AGENT_SYSTEM.md §3, FM MUST perform:

#### Step 1: Create Session Memory
```bash
# Generate session memory file
create_session_memory \
  --session-id "$SESSION_ID" \
  --wave "$CURRENT_WAVE" \
  --phase "$CURRENT_PHASE" \
  --actions-taken "$ACTIONS" \
  --decisions-made "$DECISIONS" \
  --lessons-learned "$LESSONS" \
  --patterns-observed "$PATTERNS" \
  --blockers-encountered "$BLOCKERS" \
  --output ".agent-workspace/foreman/memory/session-$(date +%Y%m%d-%H%M%S).md"
```

#### Step 2: Update Learning Memory
```bash
# Append new lessons to lessons-learned.md
if [ -n "$NEW_LESSONS" ]; then
  echo "## Session $(date +%Y-%m-%d)" \
    >> .agent-workspace/foreman/personal/lessons-learned.md
  echo "$NEW_LESSONS" \
    >> .agent-workspace/foreman/personal/lessons-learned.md
fi

# Update pattern catalog
if [ -n "$NEW_PATTERNS" ]; then
  update_pattern_catalog "$NEW_PATTERNS"
fi

# Record efficiency improvements
if [ -n "$EFFICIENCY_IMPROVEMENTS" ]; then
  echo "- [$(date +%Y-%m-%d)] $EFFICIENCY_IMPROVEMENTS" \
    >> .agent-workspace/foreman/personal/efficiency-log.md
fi
```

#### Step 3: Rotate Session Memories
```bash
# Keep last 5 sessions, archive older
rotate_session_memories --keep 5 --archive-to ".agent-workspace/foreman/memory/.archive"
```

#### Step 4: Create Escalations (if needed)
```bash
# If blockers remain unresolved
if [ -n "$UNRESOLVED_BLOCKERS" ]; then
  create_escalation_file \
    --type "BLOCKER" \
    --description "$UNRESOLVED_BLOCKERS" \
    --output ".agent-workspace/foreman/escalation-inbox/blocker-$(date +%Y%m%d).md"
fi

# If governance gaps identified
if [ -n "$GOVERNANCE_GAPS" ]; then
  create_escalation_file \
    --type "GOVERNANCE_GAP" \
    --description "$GOVERNANCE_GAPS" \
    --output ".agent-workspace/foreman/escalation-inbox/gap-$(date +%Y%m%d).md"
fi
```

#### Step 5: Archive Working Contract
```bash
# Move working contract to archive
mv .agent-workspace/foreman/working-contract.md \
   .agent-workspace/foreman/memory/.archive/working-contract-$(date +%Y%m%d-%H%M%S).md
```

### 4.5 Wave Closure

At wave completion, FM MUST perform **wave memory finalization**:

```bash
# Wave Closure Memory Protocol
close_wave() {
  WAVE_NUM=$1
  
  # 1. Finalize wave progress artifact
  echo "## Wave Closure" \
    >> execution-progress/WAVE_${WAVE_NUM}_IMPLEMENTATION_PROGRESS.md
  echo "**Closure Timestamp**: $(date -u +%Y-%m-%d\ %H:%M:%S\ UTC)" \
    >> execution-progress/WAVE_${WAVE_NUM}_IMPLEMENTATION_PROGRESS.md
  echo "**Wave Status**: COMPLETE" \
    >> execution-progress/WAVE_${WAVE_NUM}_IMPLEMENTATION_PROGRESS.md
  
  # 2. Generate wave summary
  generate_wave_summary $WAVE_NUM \
    > execution-progress/WAVE_${WAVE_NUM}_SUMMARY.md
  
  # 3. Archive wave artifacts
  mkdir -p .agent-workspace/foreman/memory/.archive/wave-${WAVE_NUM}
  cp execution-progress/WAVE_${WAVE_NUM}*.md \
     .agent-workspace/foreman/memory/.archive/wave-${WAVE_NUM}/
  
  # 4. Extract wave learnings
  extract_wave_learnings $WAVE_NUM \
    >> .agent-workspace/foreman/personal/lessons-learned.md
  
  # 5. Update pattern catalog with wave patterns
  extract_wave_patterns $WAVE_NUM \
    >> .agent-workspace/foreman/personal/patterns.md
  
  # 6. Generate wave closure certification
  certify_wave_closure $WAVE_NUM
}
```

---

## 5. Learning Loop Integration

### 5.1 Learning Categories

Per LEARNING_LOOP_CATEGORIES_AND_LIFECYCLE.md, FM captures learnings in three categories:

#### Category 1: Architectural Learnings (AL)
- **Definition**: Insights about architecture design, completeness, or validation
- **Examples**:
  - "Component X requires explicit error boundary definition"
  - "Database schema must specify cascade delete behavior"
  - "API contracts require explicit timeout configuration"
- **Capture Location**: `.agent-workspace/foreman/personal/lessons-learned.md`
- **Promotion Path**: FM proposes → CS2 reviews → promoted to ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md

#### Category 2: QA Learnings (QL)
- **Definition**: Insights about QA creation, test coverage, or validation effectiveness
- **Examples**:
  - "Integration tests must validate cascade operations"
  - "UI tests require explicit wait conditions for async operations"
  - "Performance tests must include baseline measurements"
- **Capture Location**: `.agent-workspace/foreman/personal/lessons-learned.md`
- **Promotion Path**: FM proposes → CS2 reviews → promoted to QA_POLICY_MASTER.md or QA_CATALOG_ALIGNMENT_GATE_CANON.md

#### Category 3: Builder Supervision Learnings (BSL)
- **Definition**: Insights about builder instruction quality, supervision effectiveness, or delegation patterns
- **Examples**:
  - "Builders require explicit file naming conventions"
  - "Build-to-green instructions must include acceptance criteria"
  - "Validation feedback must reference specific test names"
- **Capture Location**: `.agent-workspace/foreman/personal/lessons-learned.md`
- **Promotion Path**: FM proposes → CS2 reviews → promoted to FM_BUILDER_APPOINTMENT_PROTOCOL.md or BUILDER_FIRST_PR_MERGE_MODEL.md

#### Category 4: Governance Gap Learnings (GGL)
- **Definition**: Identification of missing or ambiguous governance
- **Examples**:
  - "No canon exists for handling external API dependency upgrades"
  - "Ambiguity in STOP_AND_FIX_DOCTRINE.md for cosmetic issues"
  - "WAVE_MODEL.md does not specify sub-wave phase transitions"
- **Capture Location**: `.agent-workspace/foreman/escalation-inbox/gap-YYYYMMDD.md`
- **Promotion Path**: FM escalates → CS2 investigates → new canon created or existing canon clarified

### 5.2 Learning Capture Process

```markdown
## FM Learning Capture Workflow

Session execution
   ↓
Observation made (pattern, mistake, insight, gap)
   ↓
Categorize (AL / QL / BSL / GGL)
   ↓
┌────────────────────────────────────────────────┐
│ If AL/QL/BSL:                                  │
│   → Append to personal/lessons-learned.md      │
│   → Include: Date, Category, Observation,      │
│      Context, Recommendation                   │
│   → At session closure: Review for promotion   │
│      eligibility                               │
└────────────────────────────────────────────────┘
   ↓
┌────────────────────────────────────────────────┐
│ If GGL:                                        │
│   → Create escalation file immediately         │
│   → Include: Gap description, Impact, Current  │
│      workaround, Proposed resolution           │
│   → Flag in session memory for CS2 attention   │
└────────────────────────────────────────────────┘
   ↓
Session closure
   ↓
Review all captured learnings
   ↓
Propose promotable learnings in session memory "Next Session Recommendations"
   ↓
CS2 reviews session memory
   ↓
CS2 promotes approved learnings to canonical governance
```

### 5.3 Learning Promotion Criteria

Per LEARNING_PROMOTION_RULE.md, learnings are promoted when:

✅ **Promotable**:
- Observed in **3+ independent waves or sessions**
- Validates against **constitutional principles** (not exceptions)
- Provides **actionable guidance** (clear, executable)
- Generalizes across **multiple contexts** (not situation-specific)
- Improves **quality, efficiency, or governance alignment**

❌ **Not Promotable**:
- One-time observation (not pattern)
- Situation-specific workaround
- Contradicts existing canonical governance
- Opinion or preference (not evidence-based)
- Adds governance burden without clear benefit

---

## 6. Memory Integrity and Corruption Detection

### 6.1 Memory Integrity Requirements

Per MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md, FM MUST:

✅ **Maintain Integrity**:
- Never modify past session memories (append-only)
- Preserve constitutional memory immutability (read-only)
- Validate wave memory state transitions
- Detect learning memory corruption (invalid format, broken references)
- Ensure working contract generation consistency

❌ **Prohibited**:
- Editing historical session memories
- Overwriting constitutional governance locally
- Creating synthetic memories (fabricated learnings)
- Copying memories from other agent types
- Bypassing memory rotation policy

### 6.2 Corruption Detection

FM MUST detect and escalate these corruption patterns:

#### Pattern 1: Constitutional Memory Drift
- **Detection**: Baseline validation fails at wake-up
- **Symptoms**: Local governance files differ from canonical baseline
- **Response**: Escalate per AGENT_BASELINE_MANAGEMENT_PROTOCOL.md §6

#### Pattern 2: Wave Memory Inconsistency
- **Detection**: Wave progress artifact contradicts git history
- **Symptoms**: Artifacts listed as "complete" but files don't exist
- **Response**: Halt execution, create RCA, escalate to CS2

#### Pattern 3: Session Memory Corruption
- **Detection**: Session memory file format invalid
- **Symptoms**: Missing mandatory sections, broken markdown syntax
- **Response**: Regenerate session memory from git log and session notes

#### Pattern 4: Learning Memory Duplication
- **Detection**: Same learning recorded multiple times
- **Symptoms**: lessons-learned.md contains duplicate entries
- **Response**: Deduplicate, consolidate into single entry

### 6.3 Memory Validation Checklist

```bash
# FM Memory Validation (run at wake-up and session closure)
validate_fm_memory() {
  echo "🔍 Validating FM Memory Integrity"
  
  # 1. Constitutional memory
  validate_baseline "foreman" || escalate_drift
  
  # 2. Wave memory
  validate_wave_progress_artifact $CURRENT_WAVE || halt_and_escalate
  
  # 3. Session memory
  for SESSION in $(ls .agent-workspace/foreman/memory/session-*.md); do
    validate_session_memory_format "$SESSION" || regenerate_session_memory "$SESSION"
  done
  
  # 4. Learning memory
  validate_lessons_format || consolidate_lessons
  validate_patterns_format || regenerate_patterns
  
  # 5. Working contract
  validate_working_contract_freshness || regenerate_working_contract
  
  echo "✅ Memory integrity validated"
}
```

---

## 7. Working Context Generation

### 7.1 Working Contract Structure

Per LIVING_AGENT_SYSTEM.md §4, FM working contract MUST include:

```markdown
# FM Working Contract — Session <timestamp>

## Session Identity
- Agent: Foreman (FM)
- Wave: <current-wave>
- Phase: <current-phase>
- Session ID: <session-id>
- Branch: <branch-name>
- Timestamp: YYYY-MM-DD HH:MM:SS UTC

## Constitutional Memory (Loaded)
- Baseline: foreman.agent v<version> (validated ✅)
- Canonical Governance: <count> artifacts loaded
- Key Canon: BUILD_PHILOSOPHY.md, FM_ROLE_CANON.md, WAVE_MODEL.md, STOP_AND_FIX_DOCTRINE.md

## Wave Context
- Wave Status: <planning|architecture|qa|build|validation|complete>
- Wave Progress Artifact: execution-progress/WAVE_<N>_IMPLEMENTATION_PROGRESS.md
- Artifacts Instructed: <count>
- Artifacts Delivered: <count>
- Builders Appointed: <count>
- QA Status: <red|green|partial>

## Session Context (Last 5 Sessions)
- Session -5: <date> — <summary>
- Session -4: <date> — <summary>
- Session -3: <date> — <summary>
- Session -2: <date> — <summary>
- Session -1: <date> — <summary>

## Learning Memory (Integrated)
- Architectural Learnings: <count>
- QA Learnings: <count>
- Builder Supervision Learnings: <count>
- Governance Gap Learnings: <count>

## Current Mandate
<Extract from wave progress artifact and FM_ROLE_CANON.md>

## Active Escalations
- <escalation-1>: <status>
- <escalation-2>: <status>

## Session Success Criteria
- [ ] <criterion-1>
- [ ] <criterion-2>
- [ ] <criterion-3>

## Personal Reminders (From Learnings)
- ⚠️ <reminder-1>
- ⚠️ <reminder-2>
- ⚠️ <reminder-3>

---
**Authority**: FOREMAN_MEMORY_PROTOCOL.md §7.1  
**Generated**: YYYY-MM-DD HH:MM:SS UTC
```

### 7.2 Context Refresh Triggers

FM MUST refresh working contract when:
- Phase transition occurs
- New builder appointed
- Validation failure requires correction
- Escalation resolved
- Governance gap identified
- 4+ hours elapsed since last refresh

---

## 8. Continuity Requirements

### 8.1 Cross-Session Continuity

FM MUST maintain continuity across sessions within same wave:
- ✅ Wave progress artifact provides authoritative state
- ✅ Session memories provide execution timeline
- ✅ Working contract provides current phase context
- ✅ Learning memory provides accumulated knowledge

**Continuity Validation**:
```bash
# Verify continuity at wake-up
check_continuity() {
  LAST_SESSION=$(ls .agent-workspace/foreman/memory/session-*.md | sort -r | head -1)
  LAST_WAVE=$(grep "^- Wave:" $LAST_SESSION | cut -d' ' -f3)
  CURRENT_WAVE=$(detect_current_wave)
  
  if [ "$LAST_WAVE" != "$CURRENT_WAVE" ]; then
    echo "⚠️ Wave boundary crossed: ${LAST_WAVE} → ${CURRENT_WAVE}"
    echo "→ Starting fresh wave context"
  else
    echo "✅ Wave continuity maintained (Wave ${CURRENT_WAVE})"
  fi
}
```

### 8.2 Cross-Wave Isolation

FM MUST maintain isolation between waves:
- ❌ Wave N memory does NOT pollute Wave N+1
- ❌ Wave N architecture does NOT constrain Wave N+1
- ❌ Wave N builder appointments do NOT carry to Wave N+1
- ✅ Learning memory DOES accumulate cross-wave (lessons persist)

**Wave Boundary Protocol**:
```bash
# At wave closure, prepare for next wave
prepare_next_wave() {
  CLOSED_WAVE=$1
  NEXT_WAVE=$((CLOSED_WAVE + 1))
  
  # Archive closed wave
  archive_wave_memory $CLOSED_WAVE
  
  # Extract learnings (carry forward)
  extract_wave_learnings $CLOSED_WAVE
  
  # Reset wave-specific context (do NOT carry forward)
  reset_builder_appointments
  reset_qa_suite_context
  reset_architecture_context
  
  # Prepare new wave progress artifact
  create_wave_progress_artifact $NEXT_WAVE
}
```

---

## 9. Compliance and Enforcement

### 9.1 Mandatory Requirements

**FM MUST**:
- ✅ Load constitutional memory at every session start
- ✅ Maintain wave progress artifact per FM_ROLE_CANON.md §6.1
- ✅ Create session memory at every session closure
- ✅ Rotate session memories (keep last 5)
- ✅ Capture learnings continuously
- ✅ Validate memory integrity at wake-up and closure
- ✅ Generate fresh working contract each session
- ✅ Finalize wave memory at wave closure

**FM MUST NOT**:
- ❌ Modify constitutional memory (read-only)
- ❌ Edit past session memories (append-only)
- ❌ Skip session memory creation
- ❌ Skip wave progress artifact updates
- ❌ Fabricate synthetic memories
- ❌ Carry wave-specific context across wave boundaries

### 9.2 Audit Trail Requirements

Per AUDIT_READINESS_MODEL.md, FM memory MUST provide:
- Complete session timeline (all sessions recorded)
- Wave execution history (all phases documented)
- Learning accumulation log (all captures timestamped)
- Escalation creation/resolution log
- Memory validation results (pass/fail/remediation)

---

## 10. Integration with Other Governance

### 10.1 Integration Points

| Governance Artifact | Integration |
|---------------------|-------------|
| **LIVING_AGENT_SYSTEM.md** | Memory lifecycle, wake-up, closure protocols |
| **FM_ROLE_CANON.md** | Canonical progress recording (§6.1), wave closure certification (§6.2) |
| **WAVE_MODEL.md** | Wave lifecycle, phase transitions, wave closure |
| **LEARNING_LOOP_CATEGORIES_AND_LIFECYCLE.md** | Learning categorization, capture, promotion |
| **MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md** | Integrity enforcement, corruption detection |
| **MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md** | Learning capture and improvement proposal requirements |

---

## 11. Versioning and Evolution

**Current Version**: 1.0.0 (2026-02-08)

**Version History**:
- **v1.0.0** (2026-02-08) — Initial canonical protocol establishing FM memory architecture, lifecycle, learning loop integration, and Living Agent System v5.0.0 compliance

**Future Evolution**:
- Automated memory integrity validation CI/CD workflows
- Machine-readable memory format for automated analysis
- Memory observability dashboard for CS2
- Predictive pattern detection (ML-based)

---

## 12. Summary

**What is FM memory?**  
Four-level hierarchy: Constitutional (read-only), Wave (wave-scoped), Session (session-scoped), Learning (cross-wave).

**Why does FM need memory?**  
Enables autonomous orchestration, continuous learning, context-aware supervision, and wave-level continuity.

**How is memory managed?**  
Wake-up loads all levels → Working phase maintains continuity → Session closure captures learnings → Wave closure finalizes and archives.

**Learning loop integration?**  
Capture AL/QL/BSL/GGL → Categorize → Store in personal/ → Propose for promotion → CS2 promotes to canon.

**Memory integrity enforcement?**  
Constitutional (immutable), Wave (validated), Session (append-only), Learning (deduplicated). Corruption detection at wake-up and closure.

**Cross-wave continuity?**  
Learning memory persists. Wave-specific context (architecture, QA, builders) does NOT carry forward.

---

**Authority**: GOVERNANCE_PURPOSE_AND_SCOPE.md  
**Version**: 1.0.0  
**Effective**: 2026-02-08  
**Owner**: CS2 (Johan Ras)
