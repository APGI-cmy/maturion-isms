# GOVERNANCE RIPPLE MODEL

## Status
Canonical Governance Policy  
Version: v1.1.0  
Authority: Governance Administrator  
Effective Date: 2025-12-22  
Updated: 2026-02-21 (Terminology Clarification: Layering vs. Rippling)  
Required By: GOVERNANCE_PURPOSE_AND_SCOPE.md

---

## TERMINOLOGY CLARIFICATION (2026-02-21)

**IMPORTANT**: This document historically used "ripple" to describe both **cross-repository governance distribution** and **within-repository integration**. As of v1.1.0, terminology is clarified per **ECOSYSTEM_VOCABULARY.md v1.1.0**:

- **Layering Down**: Cross-repo distribution of governance artifacts (Governance → Consumer repos)
- **Layering Up**: Cross-repo propagation of learnings (Consumer repos → Governance)
- **Rippling**: Within-repo integration of layered artifacts (single repository only)

This document now uses **"layering"** for cross-repo flows and reserves **"rippling"** for within-repo integration. Historical sections retain "ripple" in headers for continuity but are clarified inline.

For full definitions, see **ECOSYSTEM_VOCABULARY.md v1.1.0** and **LAYERING_AND_RIPPLING_AUTOMATION_STRATEGY.md**.

---

## 1. Purpose

This document defines the **Governance Layering and Rippling Model** - a bidirectional governance evolution framework that enables governance to adapt and improve while maintaining authority, consistency, and auditability.

The model ensures:
- Governance changes **layer down** to all governed repositories (cross-repo distribution)
- Lessons learned **layer up** from repositories to governance (cross-repo feedback)
- Layered artifacts **ripple** within each repository (intra-repo integration)
- Governance evolves without weakening enforcement
- Governance remains merge-transparent while maintaining rigor
- All evolution is tracked, versioned, and auditable

This model prevents governance stagnation while preserving constitutional authority.

---

## 2. Constitutional Authority

This policy derives authority from:
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** - Governance as canonical memory
- **LEARNING_INTAKE_AND_PROMOTION_MODEL.md** - Learning promotion mandate
- **FAILURE_PROMOTION_RULE.md** - Failure pattern handling
- **VERSIONING_AND_EVOLUTION_GOVERNANCE.md** - Versioning principles
- **GOVERNANCE_COMPLETENESS_MODEL.md** - Completeness requirements
- **LAYER_UP_PROTOCOL.md** - Explicit layer-up (upward layering) mechanism (2026-02-09)
- **GOVERNANCE_ALIGNMENT_MONITORING_PROTOCOL.md** - Alignment monitoring and drift detection (2026-02-09)
- **ECOSYSTEM_VOCABULARY.md v1.1.0** - Canonical definitions of layering and rippling (2026-02-21)
- **LAYERING_AND_RIPPLING_AUTOMATION_STRATEGY.md** - Automation strategy for layering and rippling (2026-02-21)

---

## 3. Core Principles

### 3.1 Bidirectional Layering

Governance must support evolution in **both directions** (cross-repository):

**Downward Layering**: Governance → Consumer Repositories
- New governance rules layer down to all governed repos
- Schema updates layer down to all consumers
- Policy changes layer down to all enforcers
- Gate requirements layer down to all builders
- **Mechanism**: Layer-down issues created in consumer repos with artifact bundles

**Upward Layering**: Consumer Repositories → Governance
- Failure patterns layer up to governance
- Lessons learned layer up to governance
- Enforcement insights layer up to governance
- Practical constraints layer up to governance
- Governance drift escalates to governance
- Governance gaps trigger canon improvements
- **Mechanism**: Layer-up issues created in governance repo with evidence packages

Both directions are **mandatory and continuous**.

**Layer-Up Protocol**: See **LAYER_UP_PROTOCOL.md** for explicit, controlled mechanism for propagating learnings from application repositories back to canonical governance. Layer-up is **mandatory** before any canon changes to detect drift and gather alignment feedback.

### 3.2 Rippling (Within-Repository Integration)

After artifacts are layered down to a consumer repository, **rippling** integrates them within that repository:

**Rippling includes**:
- LOCKED section synchronization in agent contracts
- Cross-reference updates to versioned canon files
- Template synchronization from governance templates
- Schema reference updates
- GOVERNANCE_ALIGNMENT_INVENTORY.json updates
- Contract alignment (rare, requires CS2 approval)

**Rippling scope**: Single repository only. Rippling does NOT trigger cross-repository propagation.

**Rippling automation**: See **LAYERING_AND_RIPPLING_AUTOMATION_STRATEGY.md** for automation boundaries, escalation requirements, and CS2 approval gates.

### 3.3 Evolution Without Weakening

Governance evolution must:
- ✅ Improve clarity and enforceability
- ✅ Add missing rules discovered through practice
- ✅ Remove ambiguity and conflicts
- ✅ Adapt to new contexts and requirements

Governance evolution must NOT:
- ❌ Weaken existing enforcement
- ❌ Create loopholes
- ❌ Reduce auditability
- ❌ Compromise constitutional principles

**Governance evolves to become stronger, never weaker.**

### 3.4 Merge-Transparent Evolution

Governance evolution must:
- ✅ Be versioned and explicit
- ✅ Provide transition periods when appropriate
- ✅ Preserve compliant historical state
- ✅ Remain auditable across versions

Governance evolution must NOT:
- ❌ Retroactively invalidate compliant history
- ❌ Create breaking changes without migration paths
- ❌ Stall delivery unnecessarily
- ❌ Create uncertainty about current requirements

**Static governance is prohibited. Blocking governance is prohibited.**

### 3.5 Authority Hierarchy Preserved

Governance evolution must respect:
1. Johan (Human Owner) - Ultimate authority
2. GOVERNANCE_PURPOSE_AND_SCOPE.md - Constitutional canon
3. Canonical governance policies - Subordinate canon
4. Repository practices - Implementation layer

**Higher authority always prevails during evolution.**

---

## 4. Downward Layering (Governance → Consumer Repositories)

**Note**: This section describes **cross-repository distribution** of governance artifacts (layering down), not within-repository integration (rippling).

### 4.1 What Layers Down

When governance changes, these artifacts must layer down to consumer repositories:

**Canon Updates**:
- New governance rules
- Updated governance policies
- Clarified governance principles
- New governance models

**Schema Updates**:
- New schemas
- Updated schema versions
- New required fields
- Deprecated fields

**Gate Updates**:
- New gate requirements
- Updated gate rules
- New enforcement mechanisms
- Updated failure classifications

**Agent Contract Updates**:
- New agent responsibilities
- Updated agent boundaries
- New separation-of-duties rules
- Updated orchestration models

### 4.2 Layer-Down Mechanisms

**Current Mechanisms** (semi-automated):
1. Governance change committed to governance repo
2. `.github/workflows/governance-ripple-dispatch.yml` triggers on main branch push
3. Workflow reads `CONSUMER_REPO_REGISTRY.json` for enabled consumers
4. Workflow dispatches GitHub repository events to consumer repos
5. Consumer repos receive events and governance-liaisons act on them

**Target Mechanisms** (per LAYERING_AND_RIPPLING_AUTOMATION_STRATEGY.md):
1. Governance change triggers layer-down workflow
2. All enabled consumer repositories receive GitHub issues with:
   - Changed artifact list
   - Version information
   - Integration instructions
   - Rippling protocol reference
3. Governance-liaisons execute rippling within their repos
4. Completion tracked via issue closure

### 4.3 Layer-Down Requirements

Every downward layer-down must:
- ✅ Be versioned explicitly
- ✅ Include change rationale
- ✅ Provide migration guidance (if breaking)
- ✅ Define effective date
- ✅ Document affected repositories
- ✅ Include validation criteria
- ✅ Maintain audit trail
- ✅ **Update governance inventory files** (central `CANON_INVENTORY.json` and consumer `GOVERNANCE_ALIGNMENT_INVENTORY.json`)
- ✅ **Validate inventory coverage** post-propagation using `scripts/sync_repo_inventory.py`

**Inventory Maintenance**: Per `governance/runbooks/GOVERNANCE_INVENTORY_MAINTENANCE.md`, all canon creation, modification, or layer-down events MUST trigger inventory updates to maintain alignment tracking across central and consumer repositories.

### 4.4 Breaking vs Non-Breaking Changes

**Non-Breaking Changes** (immediate layer-down):
- Additive schema fields (optional)
- New governance clarifications
- Additional enforcement (not stricter)
- Documentation improvements

**Breaking Changes** (managed layer-down):
- Required schema field changes
- Stricter enforcement rules
- Removed capabilities
- Changed invariants

**Breaking changes require**:
- Version increment
- Migration period
- Backward compatibility (when possible)
- Explicit approval from Johan

---

## 5. Upward Layering (Consumer Repositories → Governance)

**Note**: This section describes **cross-repository feedback** of learnings and improvements (layering up), not within-repository integration (rippling).

### 5.1 What Layers Up

Consumer repositories generate insights that must layer up to governance:

**Failure Patterns**:
- Repeated gate failures for same cause
- Systematic builder confusion
- Ambiguous governance interpretation
- Enforcement inconsistencies

**Lessons Learned**:
- Missing governance rules discovered
- Unenforced invariants identified
- Practical constraints encountered
- Successful workarounds validated

**Enforcement Insights**:
- Gate mispredictions
- Schema inadequacies
- Policy ambiguities
- Agent boundary violations

**Structural Mismatches**:
- Governance-reality divergence
- Unmaintainable requirements
- Conflicting rules
- Context-specific needs

### 5.2 Layer-Up Triggers

Upward layering is **mandatory** when:

**Governance Gaps**:
- A PR gate failure reveals missing governance rule
- GPCA misprediction occurs
- Gate and governance documentation diverge
- Agent unable to determine correct action

**Repeated Failures**:
- Same failure type occurs ≥3 times
- Same governance question asked ≥3 times
- Same escalation path taken ≥3 times
- Pattern indicates systematic issue

**Learning Qualification**:
- Lesson learned affects multiple repositories
- Lesson learned affects future builds
- Lesson learned requires governance update
- Lesson learned reveals missing invariant

**Constitutional Violations**:
- One-Time Build Law violated due to governance gap
- Separation of duties unclear
- Authority hierarchy ambiguous
- Evidence trail incomplete

### 5.3 Layer-Up Mechanisms

**Layer-Up Protocol** (systematic, via **LAYER_UP_PROTOCOL.md**):
1. **Detection**: Application repository identifies trigger (gap, drift, failure pattern, etc.)
2. **Documentation**: governance-liaison/foreman creates layer-up issue with evidence
3. **Escalation**: Issue created in governance repository with `layer-up` label
4. **Intake**: governance-repo-administrator validates and classifies (CRITICAL/HIGH/MEDIUM/LOW)
5. **Analysis**: governance-repo-administrator drafts governance change with evidence package
6. **Review**: CS2 (Johan) approves or requests changes
7. **Integration**: Governance PR merged, originating layer-up marked INTEGRATED
8. **Layer-Down Back**: Layer-down triggered to propagate improvement to all consumer repositories

**Pre-Canon-Change Layer-Up Scan** (mandatory, via **LAYER_UP_PROTOCOL.md** Section 9.1):
- Before ANY canon changes, governance-repo-administrator MUST scan consumer repositories
- Detect drift, pending layer-up issues, alignment gaps
- Resolve detected issues BEFORE proceeding with new canon changes
- Prevents circular drift and governance-application misalignment

**Future Mechanism** (semi-automated):
1. Repository records failure/learning per schema
2. Automated analysis identifies patterns
3. Layer-up recommendation generated
4. FM or Governance Administrator reviews
5. If approved, governance PR auto-created
6. Human review and approval (CS2 for constitutional changes)
7. Governance updated and layered down

### 5.4 Layer-Up Schema

Upward layering must use structured schema:

**Schema Location**: `governance/schemas/GOVERNANCE_CHANGE_PROPOSAL.schema.md`

**Required Content**:
- Layer-up trigger (failure pattern, lesson learned, etc.)
- Evidence (failure records, PR links, etc.)
- Proposed governance change
- Impact analysis
- Affected repositories
- Migration plan (if breaking)
- Rationale and justification

---

## 6. Evolution Lifecycle

### 6.1 Governance Change Lifecycle

```
1. TRIGGER
   ↓
2. IDENTIFICATION
   ↓
3. ANALYSIS
   ↓
4. PROPOSAL
   ↓
5. REVIEW
   ↓
6. APPROVAL
   ↓
7. IMPLEMENTATION
   ↓
8. PROPAGATION
   ↓
9. VALIDATION
   ↓
10. DOCUMENTATION
```

### 6.2 Change Classification

**Level 1: Clarification** (no approval needed)
- Documentation improvements
- Example additions
- Formatting fixes
- Typo corrections

**Level 2: Non-Breaking Enhancement** (Governance Admin approval)
- Optional schema fields
- Additional guidance
- New templates
- New examples

**Level 3: Breaking Change** (Johan approval required)
- Required schema changes
- Stricter enforcement
- New mandatory rules
- Constitutional modifications

**Level 4: Emergency Fix** (fast-track with retrospective approval)
- Security vulnerabilities
- Critical ambiguities
- Blocking governance defects
- Compliance violations

### 6.3 Change Velocity

**Target Evolution Metrics**:
- Clarifications: < 1 day
- Non-breaking enhancements: < 3 days
- Breaking changes: < 1 week (with migration plan)
- Emergency fixes: < 4 hours

**Evolution must be timely without compromising rigor.**

---

## 7. Merge-Transparent Evolution Rules

### 7.1 Version Compatibility

Governance must support:
- Multiple active versions (during transition)
- Backward compatibility (when possible)
- Forward compatibility (when practical)
- Clear deprecation paths

### 7.2 Transition Management

For breaking changes:

**Transition Period**:
- Minimum 2 weeks for non-emergency changes
- Old and new versions both valid during transition
- Clear cutover date announced
- Migration support provided

**Deprecation Process**:
1. New version announced
2. Transition period begins
3. Both versions valid
4. Migration guidance provided
5. Old version deprecated
6. New version becomes mandatory

### 7.3 Historical Compliance

Governance evolution must:
- ✅ Never retroactively invalidate compliant PRs
- ✅ Preserve audit trail across versions
- ✅ Allow historical analysis under historical rules
- ✅ Document what rules applied when

### 7.4 Emergency Evolution

For critical issues:
- Fast-track approval process
- Immediate propagation
- Retrospective documentation
- Complete audit trail

**Emergency evolution requires post-incident review.**

---

## 8. Layering and Rippling Tracking

**Note**: This section covers tracking for both cross-repo layering and within-repo rippling.

### 8.1 Change Log

All governance changes must be recorded in:

**Location**: `governance/CHANGELOG.md`

**Required Content**:
- Change version
- Change date
- Change type (clarification, enhancement, breaking, emergency)
- Change description
- Affected artifacts
- Migration guidance
- Approval authority
- Effective date

### 8.2 Impact Analysis

Every governance change must include:
- Affected repositories
- Affected agents
- Affected gates
- Affected schemas
- Estimated migration effort
- Risk assessment

### 8.3 Layering and Rippling Tracking

**Downward layering** (layer-down - cross-repo distribution) must be tracked:
- Which repositories received change
- When layer-down occurred
- Validation status
- Completion status
- Outstanding issues
- **Inventory file update status** (central and consumer inventories synchronized)
- **Coverage percentage** post-layer-down (target: 100% for production repos)
- **Layer-down log entries** (automatic updates with issue numbers, timestamps, and status)

**Upward layering** (layer-up - cross-repo feedback) must be tracked:
- Which repository originated layer-up
- What trigger caused layer-up (gap, drift, failure pattern)
- Layer-up issue number in governance repository
- Evidence package preservation
- Governance PR that integrated layer-up
- Subsequent layer-down to propagate improvement
- **Layering log entries** showing bidirectional flow (layer-up → canon change → layer-down)

**Rippling** (within-repo integration) must be tracked:
- LOCKED section synchronization status
- Cross-reference update completion
- Template synchronization status
- GOVERNANCE_ALIGNMENT_INVENTORY.json updates
- Contract alignment (if required)
- CS2 approval (if agent files modified)
- Ripple PR merge status

**Bidirectional Layering Log Format**:
```markdown
[YYYY-MM-DD HH:MM] LAYER_UP from <app-repo> #<issue> → <canon-file> (PROPOSED)
[YYYY-MM-DD HH:MM] LAYER_UP <canon-file> → PR #<pr> (INTEGRATED)
[YYYY-MM-DD HH:MM] PR #<pr> (Layer-Up Origin: <app-repo> #<issue>) → LAYER_DOWN to <consumer-repo> (NOTIFIED) #<issue>
[YYYY-MM-DD HH:MM] <consumer-repo> #<issue> → RIPPLE PR #<pr> (MERGED)
```

**Alignment Monitoring**: See **GOVERNANCE_ALIGNMENT_MONITORING_PROTOCOL.md** for systematic monitoring of governance alignment across all repositories, drift detection, and remediation workflows.

### 8.4 Learning Archive

Upward learning must be archived:
- Original failure/learning records
- Promotion decision rationale
- Resulting governance changes
- Impact assessment
- Effectiveness validation

---

## 9. Governance Quality Metrics

### 9.1 Downward Ripple Metrics

**Propagation Effectiveness**:
- Time from governance change to repository application
- % repositories updated successfully
- Breaking change migration success rate
- Propagation defect rate

**Target**: > 95% successful propagation within SLA

### 9.2 Upward Layering Metrics

**Learning Promotion Rate**:
- % qualified lessons layered up to governance
- Time from lesson learned to governance update
- Layer-up defect rate (incorrectly promoted)
- Layer-up miss rate (should have been promoted)

**Target**: > 90% qualified lessons layered up within 1 week

### 9.3 Evolution Health Metrics

**Governance Agility**:
- Governance change velocity (changes per month)
- Average time to implement change
- % changes that are clarifications vs enhancements vs breaking
- Emergency change rate

**Governance Stability**:
- Breaking change frequency
- Misprediction rate (GPCA vs gates)
- Governance conflict rate
- Retrospective invalidation rate (should be 0%)

**Target**: High agility (responsive) + High stability (non-breaking)

---

## 10. Agent Responsibilities

### 10.1 Governance Administrator

**Downward Layering (Cross-Repo Distribution)**:
- Implement governance changes
- Create layer-down issues in consumer repos (via automation or manually)
- Validate layer-down dispatch success
- Document changes
- **Update central `CANON_INVENTORY.json`** after canon creation/modification
- **Verify consumer repository inventory alignment** post-layer-down
- **Automatically update layering log** with issue numbers, timestamps, and status (atomic with issue creation)

**Upward Layering (Cross-Repo Feedback)**:
- Review layer-up proposals from consumer repos
- Evaluate failure patterns
- Implement promoted changes (with CS2 approval for constitutional changes)
- Maintain governance quality

**Rippling Oversight (Within-Repo Integration)**:
- Verify consumer repos complete rippling after layer-down
- Monitor ripple PR status
- Escalate stuck ripples
- Track ripple completion metrics

**Evolution Management**:
- Track change lifecycle (layer-down → ripple → completion)
- Ensure auditability
- Monitor metrics
- Report to CS2
- **Maintain governance inventory integrity** across central and consumer repos

### 10.2 Foreman (FM)

**Layer-Down Awareness**:
- Receive notifications of governance changes
- Communicate changes to builders
- Validate implementation in active builds

**Layer-Up Execution**:
- Identify lessons learned
- Evaluate layer-up criteria
- Create layer-up proposals to governance
- Validate effectiveness

**Rippling Coordination** (in consumer repos):
- Coordinate builder rippling work
- Manage transition periods
- Ensure merge-transparent integration

### 10.3 Builder Agents

**Layer-Down Response**:
- Apply governance changes in PRs
- Conform to new requirements
- Report layer-down issues
- Validate compliance

**Layer-Up Contribution**:
- Record failures per schema
- Identify lessons learned
- Report governance gaps
- Provide practical feedback

**Rippling Execution** (in consumer repos):
- Execute LOCKED section sync
- Update cross-references
- Synchronize templates
- Update alignment inventory

### 10.4 Governance-Liaison (in consumer repos)

**Layer-Down Reception**:
- Receive layer-down issues
- Review governance changes
- Initiate rippling workflow

**Rippling Management**:
- Execute or delegate rippling
- Create ripple PRs
- Escalate to CS2 (if agent files modified)
- Track ripple completion

**Layer-Up Initiation**:
- Identify layer-up triggers
- Create layer-up issues in governance repo
- Provide evidence packages

### 10.5 CS2 (Johan Ras / Human Owner)

**Authority**:
- Approve breaking changes
- Approve constitutional changes
- Approve agent contract modifications (rippling that affects behavior)
- Resolve governance conflicts
- Override when necessary

**Oversight**:
- Review evolution metrics
- Assess governance health
- Provide strategic direction
- Validate constitutional compliance

---

## 11. Integration with Existing Governance

### 11.1 LEARNING_INTAKE_AND_PROMOTION_MODEL.md

Ripple Model extends:
- Defines promotion triggers more precisely
- Adds downward propagation
- Adds tracking and metrics
- Ensures bidirectional flow

### 11.2 FAILURE_PROMOTION_RULE.md

Ripple Model implements:
- Structured failure promotion
- Pattern detection
- Systematic governance updates
- Continuous improvement

### 11.3 VERSIONING_AND_EVOLUTION_GOVERNANCE.md

Ripple Model complies with:
- Version management
- Breaking change handling
- Historical preservation
- Auditability requirements

### 11.4 GATE_PREDICTIVE_COMPLIANCE_ANALYSIS.md

Ripple Model supports:
- GPCA misprediction handling
- Gate requirement evolution
- Schema evolution
- Predictability maintenance

---

## 12. Governance Invariants

### 12.1 Non-Negotiable Invariants

1. **Bidirectional evolution is mandatory**
2. **Evolution must preserve constitutional authority**
3. **Evolution must not weaken enforcement**
4. **Evolution must remain auditable**
5. **Breaking changes require approval**
6. **Historical compliance must be preserved**
7. **Evolution must be merge-transparent**
8. **All evolution must be versioned**

### 12.2 Prohibited Actions

1. ❌ Retroactive invalidation of compliant history
2. ❌ Unversioned governance changes
3. ❌ Weakening enforcement to "fix" failures
4. ❌ Ignoring qualified lessons learned
5. ❌ Breaking changes without migration plans
6. ❌ Silent governance updates
7. ❌ Static governance (no evolution)

---

## 13. Success Criteria

Governance Ripple Model is successful when:
- ✅ Governance changes propagate reliably
- ✅ Lessons learned promote systematically
- ✅ Governance evolves continuously
- ✅ Evolution remains merge-transparent
- ✅ Historical compliance preserved
- ✅ All evolution auditable
- ✅ Metrics show high agility + high stability

---

## 14. Conclusion

The Governance Ripple Model enables:
- Continuous governance improvement
- Bidirectional learning flow
- Merge-transparent evolution
- Maintained constitutional authority
- Adaptive enforcement
- Auditable governance lifecycle

**Governance defines structure. Practice produces truth. Learning drives evolution.**

---

**End of GOVERNANCE RIPPLE MODEL**

---

**Document Metadata**:
- Policy ID: GOVERNANCE_RIPPLE_MODEL_V1
- Authority: Canonical Governance Policy
- Effective Date: 2025-12-22
- Required By: GOVERNANCE_PURPOSE_AND_SCOPE.md
- Integration: LEARNING_INTAKE_AND_PROMOTION_MODEL.md, GATE_PREDICTIVE_COMPLIANCE_ANALYSIS.md
