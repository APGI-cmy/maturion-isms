# POST-MORTEM PROTOCOL

## Status
**Type**: Canonical Governance Process — Mandatory Enforcement  
**Authority**: Supreme - Canonical  
**Version**: 1.0.0  
**Effective Date**: 2026-02-15  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Precedence**: Complements LEARNING_INTAKE_AND_PROMOTION_MODEL.md, LAYER_UP_PROTOCOL.md, IN_BETWEEN_WAVE_RECONCILIATION.md  
**Applies To**: All Agents (Foreman, Builders, Governance, QA, etc.), All Build Completions  
**Related Canon**: BUILD_PHILOSOPHY.md, FOREMAN_MEMORY_PROTOCOL.md, MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md, WE_ONLY_FAIL_ONCE_DOCTRINE.md

---

## 1. Purpose

This protocol establishes a **universal post-mortem process** for completed builds, requiring all agents (foreman, builders, governance, QA, etc.) to deliver domain-specific lessons learned and improvement reports upon build closure.

This protocol exists to:
- **Close the learning loop** systematically after every build
- **Prevent repeat mistakes** through organizational learning
- **Raise build quality** across all participating repositories
- **Ensure compliance** with international standards and best practices
- **Formalize institutional knowledge** that survives agent sessions
- **Enable gap analysis** for continuous improvement across builds

**Constitutional Principle**: All builds MUST complete with a formal post-mortem that captures learnings, identifies gaps, and promotes qualified learnings to canonical governance.

---

## 2. Constitutional Authority

This protocol derives authority from and complements:
- **BUILD_PHILOSOPHY.md** — One-Time Build Law, learning without regression
- **WE_ONLY_FAIL_ONCE_DOCTRINE.md** — Systematic failure prevention
- **LEARNING_INTAKE_AND_PROMOTION_MODEL.md** — Learning capture and promotion requirements
- **LAYER_UP_PROTOCOL.md** — Mechanism for propagating learnings to governance
- **IN_BETWEEN_WAVE_RECONCILIATION.md** — Wave-level reconciliation and learning
- **FOREMAN_MEMORY_PROTOCOL.md** — Foreman's learning obligations
- **MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md** — Enhancement capture requirements
- **LIVING_AGENT_SYSTEM.md v6.2.0** — Agent memory and session closure protocols

---

## 3. Scope

### 3.1 In Scope

✅ **Covered by this protocol**:
- Post-mortem trigger conditions and timing
- Agent query set and self-report requirements
- Foreman reconciliation process
- Governance up-layer and down-layer processes
- Gap analysis methodology for future builds
- Evidence requirements and artifact locations
- Integration with agent memory systems
- Compliance tracking with international standards
- Post-mortem report structure and schema

### 3.2 Out of Scope

❌ **NOT covered by this protocol**:
- In-progress build monitoring (see IN_BETWEEN_WAVE_RECONCILIATION.md)
- Real-time deviation capture (see BUILD_ARCHAEOLOGY_AND_LEARNING_STRATEGY.md)
- Individual wave reconciliation (see IN_BETWEEN_WAVE_RECONCILIATION.md)
- Governance decision-making authority (escalate to CS2)
- Agent contract modifications (CS2 authority)

---

## 4. Core Principles

### 4.1 Blameless Learning Culture

**Principle**: Post-mortems focus on process improvement and systemic learning, not individual blame.

**Rationale**:
- Psychological safety enables honest reporting
- Systemic analysis reveals root causes
- Individual mistakes are often symptoms of process gaps

**Enforcement**:
- Post-mortem reports MUST be objective and factual
- Personal attribution is PROHIBITED
- Focus on "what" and "why", not "who"

---

### 4.2 Universal Participation

**Principle**: ALL agents that participated in the build MUST contribute to post-mortem.

**Rationale**:
- Each agent has domain-specific insights
- Complete picture requires all perspectives
- Silent agents = lost learnings

**Enforcement**:
- Foreman MUST query all participating agents
- Non-response blocks post-mortem completion
- Agent contracts include post-mortem obligations

---

### 4.3 Evidence-Based Reporting

**Principle**: All post-mortem findings MUST be supported by evidence.

**Rationale**:
- Prevents speculation and opinion
- Enables verification and validation
- Supports traceability and audit

**Enforcement**:
- All findings reference specific evidence
- Evidence artifacts preserved in build evidence bundle
- Unsupported claims are invalid

---

### 4.4 Forward-Looking Improvement

**Principle**: Post-mortems identify actionable improvements for future builds.

**Rationale**:
- Retrospective without improvement is wasted effort
- Concrete actions prevent recurrence
- Version 2 planning requires version 1 learnings

**Enforcement**:
- Each post-mortem MUST include improvement recommendations
- Recommendations MUST be specific and actionable
- Promoted learnings become mandatory for future builds

---

## 5. Post-Mortem Trigger and Timing

### 5.1 Trigger Conditions

Post-mortem process is **MANDATORY** when:
- ✅ All wave gates GREEN
- ✅ Final In-Between Wave Reconciliation (IBWR) complete
- ✅ Build closure certification complete
- ✅ All builder handovers accepted

**Post-mortem starts immediately** after these conditions are met.

---

### 5.2 Canonical Sequence

```
Build Execution → All Gates GREEN → Final IBWR → Build Closure Certification
    ↓
Post-Mortem Initiation (Foreman creates post-mortem issue)
    ↓
Agent Query Phase (All agents respond with self-reports)
    ↓
Foreman Reconciliation (Foreman compiles reconciled report)
    ↓
Governance Up-Layer (Governance canonizes qualified learnings)
    ↓
Cross-Repo Layer-Down (Governance propagates to all repos)
    ↓
Post-Mortem Closure (Evidence archived, learnings official)
```

---

### 5.3 Timing Expectations

| Phase | Owner | Duration | Blocking |
|-------|-------|----------|----------|
| Post-Mortem Issue Creation | Foreman | Immediate | N/A |
| Agent Self-Reports | All Agents | 24-48 hours | Foreman reconciliation |
| Foreman Reconciliation | Foreman | 24-48 hours | Governance up-layer |
| Governance Up-Layer | Governance Admin | 48-72 hours | Cross-repo layer-down |
| Cross-Repo Layer-Down | Governance Admin | Variable | Post-mortem closure |
| Post-Mortem Closure | Foreman | Immediate after layer-down | N/A |

**Total Expected Duration**: 5-10 business days

---

## 6. Agent Query Set

### 6.1 Universal Questions (All Agents)

Foreman MUST ask ALL participating agents the following questions:

1. **Build Experience**:
   - How did you experience this build (positives, negatives)?
   - What worked well in your domain?
   - What was challenging or painful?

2. **Lessons Learned**:
   - What lessons did you learn during this build?
   - What mistakes did you make (that future agents should avoid)?
   - What would you do differently if starting over?

3. **Performance Improvement**:
   - What can you do to improve your performance next time?
   - What tools, templates, or guidance would have helped?
   - What slowed you down unnecessarily?

4. **Build Quality**:
   - What could we have done to produce a better build?
   - What, in the build itself, can be improved upon?
   - If asked to present a version 2, what would you add/change?

5. **Standards Compliance**:
   - In your domain, which international best practices/standards did we NOT comply with?
   - What should we do to achieve compliance?
   - What compliance gaps pose risk?

6. **Process Gaps**:
   - Were there governance, communication, or technical gaps?
   - Was the evidence trail sufficient for full traceability?
   - Was the builder handover protocol effective?

7. **Knowledge Transfer**:
   - Did downstream build waves benefit from upstream lessons?
   - What blockers slowed the build, and how could they be removed in future?
   - Is there anything you wish you had known in advance?

8. **Additional Insights**:
   - Do you have any additional insights not covered above?
   - Are there patterns you observed that foreman should investigate?

---

### 6.2 Role-Specific Questions

#### For Foreman (FM):
- Did you have sufficient visibility into builder progress?
- Were wave planning artifacts adequate?
- Did authority boundaries work as intended?
- What FM-specific learnings emerged?

#### For Builders:
- Were task specifications clear and complete?
- Did you have the right tools and access?
- Were dependencies available when needed?
- Did upstream artifacts meet expectations?

#### For QA Builder:
- Did test specifications align with requirements?
- Were test environments adequate?
- Did gate definitions match QA expectations?
- What test debt issues emerged?

#### For Governance Liaison:
- Was canonical governance current and accurate?
- Did layer-down process work smoothly?
- Were governance gaps discovered during execution?
- What governance improvements are needed?

---

## 7. Agent Self-Report Process

### 7.1 Response Requirements

Each agent MUST:
1. **Respond to ALL questions** in the agent query set
2. **File answers in session memory** (`.agent-workspace/<agent>/memory/session-NNN-YYYYMMDD.md`)
3. **Reference specific evidence** for all findings
4. **Provide concrete recommendations** (not vague suggestions)
5. **Complete within 48 hours** of query

---

### 7.2 Session Memory Format

Agents MUST use the following format in their session memory file:

```markdown
## Post-Mortem Self-Report

### Build Information
- Build: [Build name/identifier]
- Agent Role: [Your role in this build]
- Participation: [What you delivered]

### Build Experience
[Answers to questions 1-3]

### Lessons Learned
[Answers to questions about lessons, mistakes, improvements]

### Build Quality & Standards Compliance
[Answers about quality, version 2, compliance gaps]

### Process & Knowledge Transfer
[Answers about process gaps, handover, knowledge transfer]

### Recommendations
1. [Specific actionable recommendation]
2. [Specific actionable recommendation]
3. [...]

### Evidence References
- [Link/path to evidence artifact 1]
- [Link/path to evidence artifact 2]
- [...]
```

**Template**: `governance/templates/POST_MORTEM_AGENT_REPORT.template.md`

---

### 7.3 Non-Response Handling

If an agent does NOT respond within 48 hours:
1. **Foreman sends reminder** via post-mortem issue
2. **If still no response after 24 hours**: Foreman notes non-response in reconciliation report
3. **If agent is unavailable**: Foreman documents this and proceeds (marks report as incomplete)

**Non-response does NOT block post-mortem**, but incomplete post-mortems MUST be flagged.

---

## 8. Foreman Reconciliation Process

### 8.1 Foreman Responsibilities

After all agent self-reports are received, Foreman MUST:

1. **Review all agent reports** for completeness and consistency
2. **Add foreman's own answers** to all post-mortem questions
3. **Identify cross-cutting themes** across multiple agents
4. **Detect contradictions** and seek clarification
5. **Compile reconciled report** synthesizing all inputs
6. **Categorize learnings** by promotion candidacy
7. **Generate improvement roadmap** for version 2

---

### 8.2 Reconciled Report Contents

Foreman creates: `modules/<repo>/05-build-evidence/POSTMORTEM_LESSONS_LEARNED.md`

**Required sections**:
1. **Executive Summary** — High-level outcomes and key learnings
2. **Build Metrics** — Duration, wave count, issue count, rework instances
3. **Agent Participation Summary** — Who responded, completeness assessment
4. **Lessons Learned by Category**:
   - Architecture lessons
   - QA/Testing lessons
   - Governance lessons
   - Process lessons
   - Technical lessons
5. **Standards Compliance Assessment** — Gaps by domain (ISO, OWASP, WCAG, etc.)
6. **Cross-Cutting Themes** — Patterns observed across agents
7. **Version 2 Recommendations** — Prioritized improvements
8. **Learnings for Promotion** — Candidates for canonical governance
9. **Evidence Index** — Links to all referenced evidence

**Template**: `governance/templates/POST_MORTEM_RECONCILIATION_REPORT.template.md`

---

### 8.3 Learning Categorization

Foreman MUST categorize each learning as:

| Category | Promotion Action | Authority |
|----------|------------------|-----------|
| **PROMOTE_CANON** | Add to canonical governance | Governance Admin + CS2 |
| **PROMOTE_ARCHITECTURE** | Update architecture guidance | Foreman + Architect |
| **PROMOTE_QA** | Update QA standards/gates | QA Lead + Foreman |
| **PROMOTE_TEMPLATE** | Update templates/checklists | Governance Admin |
| **PROMOTE_AGENT_CONTRACT** | Update agent contracts | CS2 + Governance Admin |
| **LOCAL_LEARNING** | Document in build evidence only | Foreman |
| **DISCARD** | Not actionable or already covered | Foreman |

---

## 9. Governance Up-Layer Process

### 9.1 Governance Administrator Responsibilities

After receiving reconciled report, Governance Admin MUST:

1. **Review promotion candidates** in reconciliation report
2. **Validate evidence** for each candidate
3. **Draft canonical updates** (new canon or canon amendments)
4. **Create governance proposal** per LAYER_UP_PROTOCOL.md
5. **Seek CS2 approval** for constitutional changes
6. **Update CANON_INVENTORY.json** and related artifacts
7. **Document provenance** (which build generated this learning)
8. **Create layer-down plan** for cross-repo propagation

---

### 9.2 Canonical Artifacts Created

Governance Admin creates/updates:
- `governance/canon/POST_BUILD_LESSONS_<BUILD_NAME>.md` (if significant learnings)
- OR updates existing canon (e.g., `BOOTSTRAP_EXECUTION_LEARNINGS.md`)
- `governance/memory/canonical-lessons/postmortem-<build-name>.md` (audit trail)
- Updates to `CANON_INVENTORY.json` and `GOVERNANCE_ARTIFACT_INVENTORY.md`
- Entries in `governance/CHANGELOG.md`

---

### 9.3 CS2 Approval Requirements

CS2 approval is **REQUIRED** for:
- New constitutional canon (Tier 0)
- Changes to agent contract requirements
- Changes to protected files list
- Authority boundary modifications
- Enforcement mechanism changes

CS2 approval is **NOT required** for:
- Documentation updates
- Template improvements
- Example additions
- Guidance clarifications
- Schema refinements

---

## 10. Cross-Repo Layer-Down Process

### 10.1 Propagation Requirements

After canonical updates are approved, Governance Admin MUST:

1. **Identify affected repositories** (via CONSUMER_REPO_REGISTRY.json)
2. **Create layer-down issues** in each affected repo
3. **Execute layer-down** per CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md
4. **Track propagation status** in ripple log
5. **Verify receipt** by each governance liaison
6. **Close layer-down issues** when complete

---

### 10.2 Ripple Tracking

All layer-down activity MUST be tracked in `governance/ripple/ripple-log.md`:

```markdown
## Post-Mortem Layer-Down: [Build Name]

**Date**: YYYY-MM-DD
**Source**: POSTMORTEM_LESSONS_LEARNED.md for [build]
**Canonical Updates**: [List of canon files updated]

### Affected Repositories
- [repo-name-1]: Issue #NNN, Status: COMPLETE, Verified: YYYY-MM-DD
- [repo-name-2]: Issue #NNN, Status: IN_PROGRESS, Verified: N/A
- [repo-name-3]: Issue #NNN, Status: PENDING, Verified: N/A
```

---

## 11. Gap Analysis for Future Builds

### 11.1 Gap Analysis Trigger

When a new build begins OR when a subsequent post-mortem occurs, Governance Admin MUST:

1. **Retrieve previous post-mortem reports** for same/similar builds
2. **Compare current vs. previous** learnings
3. **Identify improvement trends** (gaps resolved, mistakes not repeated, new learnings)
4. **Detect regression patterns** (mistakes repeated)
5. **Generate gap analysis report** with actionable insights

---

### 11.2 Gap Analysis Questions

For each new post-mortem, analyze:

1. **Improvement Assessment**:
   - Which gaps from previous builds were resolved?
   - Which mistakes were successfully prevented?
   - What evidence proves improvement?

2. **Regression Assessment**:
   - Which mistakes were repeated?
   - Why did prevention fail?
   - What additional governance is needed?

3. **New Learnings**:
   - What new lessons emerged (not seen before)?
   - What trends are developing?
   - What early warnings should we heed?

4. **Compliance Progress**:
   - Which standards compliance gaps were closed?
   - Which compliance gaps remain?
   - What is the compliance trajectory?

5. **Actionable Recommendations**:
   - What must change before next build?
   - What can improve incrementally?
   - What requires CS2 decision?

---

### 11.3 Gap Analysis Report

Governance Admin creates: `governance/reports/POST_MORTEM_GAP_ANALYSIS_<BUILD_NAME>.md`

**Required sections**:
1. **Comparison Scope** — Which builds are being compared
2. **Improvements Verified** — Specific gaps resolved
3. **Regressions Detected** — Specific mistakes repeated
4. **New Patterns Emerging** — Trends across builds
5. **Compliance Trajectory** — Standards progress
6. **Recommendations for Next Build** — Prioritized actions
7. **Evidence Index** — Supporting documentation

**Template**: `governance/templates/POST_MORTEM_GAP_ANALYSIS.template.md`

---

## 12. Integration with Agent Memory Systems

### 12.1 Agent Memory Requirements

This protocol integrates with LIVING_AGENT_SYSTEM.md v6.2.0 session memory:

**All agents MUST**:
- Include post-mortem self-report in final session memory for the build
- Reference post-mortem in lessons learned section
- Update personal learning files with post-mortem insights
- Archive post-mortem participation in session memory rotation

---

### 12.2 Foreman Memory Requirements

Foreman MUST:
- Store reconciled report in foreman memory system
- Reference post-mortem in build closure certification
- Track post-mortem completion status in build progress artifacts
- Include post-mortem learnings in next build initialization (per "review last 2 builds" protocol)

---

### 12.3 Governance Admin Memory Requirements

Governance Admin MUST:
- Store up-layer proposal and approval in governance memory
- Document canonization decisions with rationale
- Preserve layer-down tracking in ripple log
- Archive gap analysis reports in governance reports directory

---

## 13. Evidence Requirements

### 13.1 Required Evidence Artifacts

Complete post-mortem MUST include:
- ✅ Post-mortem issue (foreman-created)
- ✅ Agent self-reports in session memory files
- ✅ Foreman reconciliation report
- ✅ Governance up-layer proposal (if applicable)
- ✅ CS2 approval (if constitutional changes)
- ✅ Updated CANON_INVENTORY.json
- ✅ Layer-down issues and tracking
- ✅ Gap analysis report (if comparing to previous builds)

---

### 13.2 Evidence Locations

| Artifact | Location | Owner |
|----------|----------|-------|
| Post-Mortem Issue | Application repo issues | Foreman |
| Agent Self-Reports | `.agent-workspace/<agent>/memory/` | Each Agent |
| Reconciled Report | `modules/<repo>/05-build-evidence/` | Foreman |
| Canonical Updates | `governance/canon/` | Governance Admin |
| Gap Analysis | `governance/reports/` | Governance Admin |
| Ripple Log | `governance/ripple/ripple-log.md` | Governance Admin |
| Layer-Down Issues | Consumer repo issues | Governance Admin |

---

## 14. Enforcement and Compliance

### 14.1 Mandatory Compliance

Post-mortem protocol is **MANDATORY** and **NON-NEGOTIABLE**.

**Violations**:
- Skipping post-mortem blocks next build authorization
- Non-participating agents violate agent contract
- Foreman failure to reconcile blocks governance up-layer
- Governance Admin failure to canonize blocks learning loop

---

### 14.2 Verification Requirements

FM MUST verify:
- All agents responded to post-mortem query
- Reconciliation report is complete
- Evidence is preserved and accessible

Governance Admin MUST verify:
- Promoted learnings were canonized
- Layer-down completed to all affected repos
- Gap analysis performed (if applicable)

CS2 MUST verify (audit):
- Post-mortem occurred per protocol
- Constitutional changes were properly approved
- Learning loop closure is evidence-based

---

### 14.3 Escalation Triggers

Escalate to CS2 if:
- Multiple agents refuse to participate
- Foreman cannot complete reconciliation
- Contradictory learnings cannot be resolved
- Promoted learnings contradict existing canon
- Layer-down blocked by consumer repo
- Gap analysis reveals systemic regression

---

## 15. Integration with Existing Protocols

### 15.1 Complements (Not Replaces)

This protocol **complements** existing governance:
- **IN_BETWEEN_WAVE_RECONCILIATION.md** — Wave-level reconciliation (this is build-level)
- **LEARNING_INTAKE_AND_PROMOTION_MODEL.md** — Learning capture (this structures the process)
- **LAYER_UP_PROTOCOL.md** — Mechanism (this defines post-mortem-specific usage)
- **BUILD_ARCHAEOLOGY_AND_LEARNING_STRATEGY.md** — Living document (this is canonical protocol)
- **FOREMAN_MEMORY_PROTOCOL.md** — Foreman memory (this adds post-mortem obligations)

---

### 15.2 Authority Precedence

In case of conflict:
1. **Constitutional canon** (BUILD_PHILOSOPHY.md, LIVING_AGENT_SYSTEM.md)
2. **This protocol** (POST_MORTEM_PROTOCOL.md)
3. **Supporting protocols** (IBWR, LAYER_UP, LEARNING_INTAKE)
4. **Strategy documents** (BUILD_ARCHAEOLOGY_AND_LEARNING_STRATEGY.md)
5. **Templates and examples**

---

## 16. Continuous Improvement

### 16.1 Protocol Evolution

This protocol MUST evolve based on:
- Post-mortem effectiveness feedback
- Agent participation challenges
- Canonization bottlenecks
- Gap analysis insights
- CS2 guidance

---

### 16.2 Version History

| Version | Date | Changes | Authority |
|---------|------|---------|-----------|
| 1.0.0 | 2026-02-15 | Initial canonical protocol | CS2 (Johan Ras) |

---

## 17. Frequently Asked Questions

### Q1: What if an agent left the project before post-mortem?

**A**: Foreman documents agent unavailability in reconciliation report and proceeds with available agent inputs. Post-mortem is marked as incomplete but not blocked.

---

### Q2: What if post-mortem reveals critical security issues?

**A**: Security issues MUST be escalated immediately to CS2, separate from post-mortem process. Post-mortem documents the process gap that allowed the security issue.

---

### Q3: How long are post-mortem artifacts retained?

**A**: Indefinitely. Post-mortem artifacts are permanent audit trail and institutional memory.

---

### Q4: Can post-mortem be skipped for small changes?

**A**: NO. Post-mortem is mandatory for all completed builds, regardless of size. Small builds may have shorter post-mortems, but process cannot be skipped.

---

### Q5: Who decides what gets promoted to canon?

**A**: Foreman proposes candidates in reconciliation report. Governance Admin validates and drafts canonical updates. CS2 approves constitutional changes. (See Section 8.3 and 9.3)

---

### Q6: What if agents disagree on lessons learned?

**A**: Foreman documents disagreement in reconciliation report and seeks clarification. If unresolved, escalate to CS2. Contradictory learnings MUST be reconciled before canonization.

---

### Q7: How does this integrate with agent session closure?

**A**: Post-mortem self-report is part of final session memory for build-participating agents. Session closure protocol includes post-mortem completion check. (See Section 12)

---

### Q8: What if a build never completes (abandoned)?

**A**: Abandoned builds SHOULD still have post-mortem (focusing on "why abandoned"). If impractical, Foreman documents abandonment reason and learning gap in memory.

---

## 18. References

### Canonical Governance
- `BUILD_PHILOSOPHY.md` — Constitutional principles
- `LIVING_AGENT_SYSTEM.md` v6.2.0 — Agent lifecycle and memory
- `WE_ONLY_FAIL_ONCE_DOCTRINE.md` — Failure prevention mandate
- `LEARNING_INTAKE_AND_PROMOTION_MODEL.md` — Learning capture and promotion
- `LAYER_UP_PROTOCOL.md` — Governance feedback mechanism
- `IN_BETWEEN_WAVE_RECONCILIATION.md` — Wave-level reconciliation
- `FOREMAN_MEMORY_PROTOCOL.md` — Foreman learning obligations
- `MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md` — Enhancement capture

### Templates
- `governance/templates/POST_MORTEM_AGENT_REPORT.template.md`
- `governance/templates/POST_MORTEM_RECONCILIATION_REPORT.template.md`
- `governance/templates/POST_MORTEM_GAP_ANALYSIS.template.md`

### Schemas
- `governance/schemas/post_mortem_agent_report.schema.json`

### Examples
- `governance/examples/post-mortem-example/` (future)

---

**END OF CANONICAL PROTOCOL**

**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0 | POST_MORTEM_PROTOCOL.md v1.0.0 | Approved by CS2 (Johan Ras)
