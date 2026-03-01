# Lessons Learned - governance-liaison-isms

## Session 20260213 - Documentation Consistency and Test Development

### Lesson: Exit Code Capture with Local Variables
- **Context**: When creating shell test scripts that validate exit codes
- **Pattern**: `local var=$(cmd)` captures exit code of `local` builtin, not `cmd` - causes false test results
- **Action**: Always separate declaration and assignment: `local var; var=$(cmd); exitcode=$?`
- **Authority**: Standard bash behavior; discovered during test stub development

### Lesson: Documentation Consistency Prevents Agent Confusion
- **Context**: When documentation shows slightly different commands than actual script implementation
- **Pattern**: Small inconsistencies (e.g., `main` vs `origin/main`, or incomplete regex patterns) cause agent errors
- **Action**: Keep doc command snippets EXACTLY synchronized with script implementation; add explanatory notes
- **Authority**: Learned from BL-027 follow-up cleanup task

### Lesson: Test Stubs Catch Bugs Early
- **Context**: When adding optional test coverage for validation scripts
- **Pattern**: Creating minimal test stubs immediately revealed exit code capture bug that would have been hard to debug later
- **Action**: Even for "optional" tasks, create test stubs early - they pay for themselves immediately
- **Authority**: OPOJD v2.0 improvement suggestions; validated in practice

### Lesson: Code Review Improves Clarity Even for Docs
- **Context**: When completing documentation cleanup tasks
- **Pattern**: Author understands what they wrote, but code review identifies ambiguities (e.g., "space-dash-space" vs "whitespace-dash-whitespace")
- **Action**: Run code_review tool even for documentation-only PRs; address clarity feedback immediately
- **Authority**: STOP_AND_FIX_DOCTRINE.md; validated in session 004

### Lesson: mktemp Guarantees Uniqueness
- **Context**: When creating temporary test directories in shell scripts
- **Pattern**: `$$-$RANDOM` can theoretically collide; `mktemp` is guaranteed unique
- **Action**: Always use `mktemp -d` for temporary directories instead of manual naming schemes
- **Authority**: Code review feedback; standard shell best practice

## Session 20260212 - Initial Contract Drafting

### Lesson: Office-App Gold Standard as Template
- **Context**: When drafting comprehensive agent contracts from checklists
- **Pattern**: Office-app PRs #730, #733, #737 establish proven structure for liaison contracts
- **Action**: Always reference office-app gold standard when creating new liaison contracts; don't start from scratch

### Lesson: Category-by-Category Validation
- **Context**: When ensuring checklist compliance for multi-category requirements
- **Pattern**: Systematic validation (Category 0 → Category 10) prevents missing requirements
- **Action**: Add "Checklist Reference" header to each category section; verify each item before moving to next category

### Lesson: Separate Wake-Up from Self-Alignment
- **Context**: When implementing drift detection and correction protocols
- **Pattern**: Conflating initialization with drift correction causes errors (learned from office-app)
- **Action**: Wake-up protocol detects drift; self-alignment protocol corrects it; never combine these concerns

### Lesson: LOCKED Sections Need Complete Metadata
- **Context**: When creating immutable protocol sections in agent contracts
- **Pattern**: LOCKED sections without metadata (Lock ID, Reason, Authority, Date, Review Frequency) are insufficiently protected
- **Action**: Always include full metadata block per AGENT_CONTRACT_PROTECTION_PROTOCOL.md

### Lesson: PR Failure Analysis is Mandatory
- **Context**: When any PR fails and retry is needed
- **Pattern**: Retry without RCA violates STOP_AND_FIX_DOCTRINE.md (learned from office-app PR #737)
- **Action**: Execute PR Failure Analysis Protocol (LOCKED) before any retry; document in session memory; escalate on 3rd failure

### Lesson: Session Memory Needs Rotation Rules
- **Context**: When implementing session memory per LIVING_AGENT_SYSTEM.md v6.2.0
- **Pattern**: Unbounded memory growth without rotation rules (learned from office-app improvement)
- **Action**: Rotate sessions when >5 exist; move oldest to .archive/; maintain only 5 most recent in memory/

### Lesson: Authority Boundaries Prevent Role Creep
- **Context**: When defining liaison agent responsibilities
- **Pattern**: Without explicit negatives and prohibitions, liaisons attempt code/QA tasks (learned from office-app PR #733)
- **Action**: Include Category 1 (Explicit Negatives), Category 6 (Prohibitions), Category 10 (Role Boundaries) with clear ❌ items

### Lesson: Cross-Repo Learning is Valuable
- **Context**: When implementing governance improvements across repositories
- **Pattern**: Office-app lessons (PRs #730, #733, #737) directly prevented 7 failure modes in maturion-isms
- **Action**: Always document cross-repo learning in session memory RCA section; maintain explicit traceability to source PRs

### Lesson: Comprehensive YAML Frontmatter Enables Validation
- **Context**: When creating agent contracts with machine-parseable metadata
- **Pattern**: Minimal YAML causes gate failures; comprehensive YAML (40+ fields) satisfies checklist Category 0
- **Action**: Include agent.id, agent.class, governance.bindings array, scope details, appointment details, metadata with office_app_lessons

### Lesson: Appendix A Reference vs Inline Enumeration
- **Context**: When incorporating 102 PUBLIC_API canons into liaison contract
- **Pattern**: Inline enumeration creates excessive contract length; reference with categorization provides balance
- **Action**: Create Appendix A reference section with functional categories (12 groups); point to CANON_INVENTORY.json for complete list

---

## Organization-Specific Learning (Maturion ISMS Context)

### Pattern: Consumer Repository Role
- **Context**: maturion-isms is a consumer repository, not canonical governance source
- **Learning**: Liaison can layer down, cannot author canon (Category 10)
- **Action**: All governance flows FROM maturion-foreman-governance TO maturion-isms via layer-down

### Pattern: Self-Alignment Authority (Issue #999)
- **Context**: maturion-isms governance-liaison-isms has unique self-alignment authorization
- **Learning**: May self-align local governance without approval when drift detected
- **Action**: Wake-up protocol detects drift → self-alignment protocol executes → session memory documents

### Pattern: ISMS-Specific Agent Naming
- **Context**: maturion-isms uses repository-specific agent naming (governance-liaison-isms vs generic governance-liaison)
- **Learning**: Repository-bound agents use `-isms` suffix for clear ownership
- **Action**: Agent file named governance-liaison-isms-agent.md; agent.id = governance-liaison-isms

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-12  
**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0

## Session 20260213 - Canonical Module Standardization

### Lesson: Use copy-first migration for governance artifacts
- **Context**: Standardizing legacy module trees to canonical stage lifecycle folders
- **Pattern**: Copying into canonical tree while retaining legacy source avoids destructive risk and preserves audit trail
- **Action**: Keep legacy pointers + `90-legacy-assets` snapshots until owner review authorizes any cleanup

### Lesson: Contract script dependencies must be repository-verified
- **Context**: Wake-up/session-closure protocol references scripts under `.github/scripts/`
- **Pattern**: Contract may require scripts that are absent in consumer repo
- **Action**: Verify script existence at session start; escalate immediately if missing

## Session 20260213 - TRS Stage Governance Upgrade

### Lesson: Governance Can Evolve Without Breaking Existing Work
- **Context**: When inserting new mandatory stage (TRS) in existing module lifecycle
- **Pattern**: Adding intermediate stage between existing stages (FRS → Architecture becomes FRS → TRS → Architecture)
- **Action**: Classify as "moderate breaking change" but provide migration path (existing modules continue, add TRS before next Architecture update)
- **Authority**: GOVERNANCE_RIPPLE_MODEL.md - Evolution without weakening principle

### Lesson: Ripple-Listener Workflow Is Critical Infrastructure
- **Context**: When discovering no automated ripple-listener workflow exists
- **Pattern**: Manual ripple doesn't scale; automated ripple per CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md required
- **Action**: Document gap explicitly, recommend HYBRID approach (manual this cycle, automated next sprint)
- **Authority**: CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md mandatory requirements

### Lesson: Bash Scripting for Repetitive Documentation Tasks
- **Context**: When creating identical structure files across 8 modules
- **Pattern**: Creating BUILD_PROGRESS_TRACKER.md manually would be error-prone and time-consuming
- **Action**: Use bash heredoc with variable substitution in loop to create consistent files efficiently
- **Authority**: DRY principle; pragmatic automation

### Lesson: Code Review Catches Subtle Ambiguities
- **Context**: When gap analysis section said "from App Description/FRS"
- **Pattern**: Slash notation can imply "either/or" when intent is sequential derivation
- **Action**: Clarify derivation chain explicitly: FRS → TRS → Architecture (not shortcuts)
- **Authority**: Code review feedback; governance clarity principle

### Lesson: Documentation-Only Changes Are Still Governance Changes
- **Context**: When updating strategy and policy files without code changes
- **Pattern**: Governance updates have cross-repo ripple impact even without code
- **Action**: Treat documentation governance updates with same rigor as code (code review, ripple planning, evidence)
- **Authority**: GOVERNANCE_RIPPLE_MODEL.md - downward ripple requirement

### Lesson: Unicode Characters Require sed Instead of edit Tool
- **Context**: When trying to update text with special arrows (→) in MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md
- **Pattern**: Edit tool's old_str matching fails with Unicode; sed works reliably
- **Action**: Use sed for updates involving special characters; verify with cat -A before editing
- **Authority**: Tool limitations discovered in practice

### Lesson: Ripple Activation Plans Provide Clear Path Forward
- **Context**: When coordinating governance changes across multiple repositories
- **Pattern**: Comprehensive plan document (RIPPLE_ACTIVATION_PLAN_TRS_UPGRADE.md) centralizes decisions and action items
- **Action**: Create detailed ripple plan including: scope, impact, approaches (automated/manual), escalation path, evidence
- **Authority**: CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md, GOVERNANCE_RIPPLE_MODEL.md

### Lesson: Progress Trackers Enable Lifecycle Visibility
- **Context**: When modules progress through multi-stage lifecycle
- **Pattern**: Without explicit tracking, module status is opaque; BUILD_PROGRESS_TRACKER makes status visible
- **Action**: Create progress tracker template; populate for existing modules; update as stages complete
- **Authority**: MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md determinism principle

## Session 20260213 - Layer-Up Protocol Execution

### Lesson: Layer-Up Is Multi-Phase Process
- **Context**: When executing layer-up for TRS governance upgrade
- **Pattern**: Layer-up protocol has 5 distinct phases with different responsible parties
- **Action**: governance-liaison executes Phase 1 (Detection & Documentation) only; governance-repo-administrator handles Phase 2-5 (Intake, Analysis, Integration, Ripple)
- **Authority**: LAYER_UP_PROTOCOL.md v1.0.0, Section 6

### Lesson: Authority Boundaries Are Strict for Cross-Repository Actions
- **Context**: When needing to create issue in canonical governance repository
- **Pattern**: governance-liaison CANNOT cross repository boundaries even for governance escalation
- **Action**: Create comprehensive documentation locally; escalate to CS2/governance-repo-administrator for cross-repo actions
- **Authority**: governance-liaison-isms contract v2.0.0 - explicit prohibition on cross-repository modifications

### Lesson: Evidence Package Enables Autonomous Downstream Processing
- **Context**: When preparing layer-up request for intake by another agent
- **Pattern**: Comprehensive evidence (SHA256 checksums, impact assessment, breaking change analysis, ripple scope) eliminates need for additional investigation
- **Action**: Create 18k+ character evidence document following LAYER_UP_PROTOCOL template exactly
- **Authority**: LAYER_UP_PROTOCOL.md Appendix B (template)

### Lesson: Issue-Based Escalation Prevents Unauthorized Governance Changes
- **Context**: When governance changes need to propagate to canonical repository
- **Pattern**: Direct PR creation by non-administrators is PROHIBITED; issue-based escalation enforces governance authority
- **Action**: Create layer-up issue (not PR) for governance-repo-administrator intake; await CS2 approval
- **Authority**: LAYER_UP_PROTOCOL.md Section 4.3 (Governance Administrator as Layer-Up Intake Point)

### Lesson: Tool Limitations Require Escalation Strategies
- **Context**: When GitHub MCP tools don't support issue creation in other repositories
- **Pattern**: Tool cannot execute required action; escalation document provides alternative paths
- **Action**: Document 3 resolution paths (human creates issue, governance-repo-administrator monitors, direct PR if authorized)
- **Authority**: Pragmatic escalation; operational flexibility

### Lesson: Breaking Change Classification Guides Ripple Urgency
- **Context**: When assessing TRS stage insertion impact
- **Pattern**: MODERATE BREAKING CHANGE classification (mandatory stage, structure change, but migration path exists)
- **Action**: Classify honestly based on actual impact; document migration path; set HIGH priority
- **Authority**: GOVERNANCE_RIPPLE_MODEL.md - Breaking change handling

### Lesson: Bidirectional Ripple Completes Governance Loop
- **Context**: When understanding layer-up → canon change → layer-down cycle
- **Pattern**: Application learns → Layer-up → Canonical governance improves → Layer-down → All applications benefit
- **Action**: Document expected ripple flow in layer-up request; reference ripple log format
- **Authority**: LAYER_UP_PROTOCOL.md Section 7 (Integration with Governance Ripple)

### Lesson: Session Memory Documents Authority Compliance
- **Context**: When completing layer-up Phase 1 without full process completion
- **Pattern**: ⚠️ PARTIAL outcome requires clear explanation of what's complete vs. what's pending
- **Action**: Document completed phases, pending phases, escalation status, authority compliance in session memory
- **Authority**: LIVING_AGENT_SYSTEM.md v6.2.0 (REQ-ER-003/004 - Session Memory)

---

**Last Updated**: 2026-02-13  
**Total Sessions**: 6  
**Agent**: governance-liaison-isms
## Session 007 - 20260214

**What I Learned:**
- [Lesson to be filled by agent]

**What to Remember:**
- [Key insight to be filled by agent]

---

## Session 008 - 20260214 - Learning Loop: PR #116 Authority Violations → PR #118 Protocol Success

### Lesson: Transparent Error Reporting Is Mandatory
- **Context**: PR #116 was closed due to "test dodging language" and authority violations
- **Pattern**: Minimizing errors or using vague language ("some issues found") violates transparency requirements
- **Action**: Always state exact error counts (e.g., "10 critical errors found → Codex fixed → 0 errors remaining")
- **Authority**: LIVING_AGENT_SYSTEM.md v6.2.0, Session 007 evidence in AGENT_CONTRACT_YAML_FIXES_EVIDENCE.md

### Lesson: Never Modify Agent Contracts Outside Proper Authority
- **Context**: In PR #116, governance-liaison directly edited agent contract files (api-builder.md, foreman-isms-agent.md)
- **Pattern**: Even "trivial" YAML fixes require proper authority escalation to CodexAdvisor
- **Action**: ALWAYS invoke Codex via task tool for ANY agent contract changes; never modify directly
- **Authority**: AGENT_CONTRACT_PROTECTION_PROTOCOL.md, governance-liaison contract prohibition on self-modification

### Lesson: Bootstrap Paradox Solution - Embedded Wake-Up Checklist
- **Context**: How to comply with wake-up protocol requirements before wake-up scripts exist?
- **Pattern**: Embedded wake-up checklist in issue description enables protocol compliance during initial installation
- **Action**: For system installation tasks, embed authority/wake-up checklist directly in issue description
- **Authority**: Session 007 learning; solved bootstrap problem for Living Agent System installation

### Lesson: Learning Loop Requires Explicit Reference to Prior Violations
- **Context**: PR #118 succeeded because it explicitly referenced PR #116 violations as learning source
- **Pattern**: Learning loop activates when failures are documented, analyzed, and referenced in corrective actions
- **Action**: Always document what was fixed, by whom, under what authority, and reference prior violations
- **Authority**: Issue #115 description - learning loop documentation requirements

### Lesson: Scripts and Automation Must Enforce Governance
- **Context**: Agent file validator detects contract schema violations automatically
- **Pattern**: Manual governance checks don't scale; automated validation enforces compliance
- **Action**: Create validators (agent-file-validator.sh) that check and refuse protected file changes
- **Authority**: LIVING_AGENT_SYSTEM.md v6.2.0, automated validation requirements

### Lesson: Codex Invocation Pattern for Contract Changes
- **Context**: When agent contracts need updates, proper authority escalation is required
- **Pattern**: governance-liaison → task tool → CodexAdvisor-agent (documented in evidence)
- **Action**: Use task tool with clear prompt specifying files, errors, and required fixes; Codex creates evidence report
- **Authority**: AGENT_CONTRACT_PROTECTION_PROTOCOL.md, Session 007 successful pattern

### Lesson: Evidence Bundle Proves Compliance
- **Context**: AGENT_CONTRACT_YAML_FIXES_EVIDENCE.md documents who changed what and why
- **Pattern**: Evidence files (with before/after counts, authority chain, checksums) prove protocol compliance
- **Action**: Create comprehensive evidence reports for any protected file changes; include validation results
- **Authority**: EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md, Session 007 evidence

### Lesson: PR Description Must Include Authority References
- **Context**: PR #118 description explicitly states authority chain (CS2 → FM → governance-liaison → Codex)
- **Pattern**: Authority transparency enables audit and prevents violations
- **Action**: Include authority references, canonical citations, and compliance confirmations in all PR descriptions
- **Authority**: LIVING_AGENT_SYSTEM.md v6.2.0, REQ-CR-004 (governance alignment in PR descriptions)

---


## Session 009 - 2026-02-14: Tier-0 to Canon Inventory Terminology Ripple

### Lesson 1: Terminology Consistency is Governance Hygiene
**What**: Legacy "Tier-0" terminology caused confusion because it didn't match technical implementation (CANON_INVENTORY.json)
**Why Critical**: Mixed terminology undermines trust in governance; documentation must align with reality
**How to Apply**: Regular terminology audits; update docs when implementation evolves
**Authority**: This session - ripple evidence in TIER_0_TO_CANON_INVENTORY_RIPPLE_EVIDENCE.md

### Lesson 2: Self-Alignment Authority Enables Efficiency
**What**: Governance Liaison executed terminology ripple under self-alignment authority (REQ-AS-001)
**Why Critical**: No blocking on CS2 for straightforward alignment tasks; clear boundaries prevent overreach
**How to Apply**: Leverage self-alignment for terminology, inventory updates, canon layer-down; ALWAYS escalate for contracts, policy interpretation
**Authority**: GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md Section 4.2

### Lesson 3: Structural vs. Classification Reference Distinction
**What**: "Tier-0" used both as structural binding term AND authority hierarchy descriptor; only replaced structural uses
**Why Critical**: Over-correction can damage governance semantics; classification terms may be intentional
**How to Apply**: Consult canonical guidance (PENDING_CANON_REFERENCES_INTERIM_GUIDANCE.md) to understand replacement scope
**Authority**: Session 009 explore agent analysis, PENDING_CANON_REFERENCES_INTERIM_GUIDANCE.md Section 8.3

### Lesson 4: Process Deviations Accumulate Without Template Updates
**What**: Builder checklist creation step was historically omitted from module lifecycle
**Why Critical**: Recurring process gaps indicate template incompleteness
**How to Apply**: Update BUILD_PROGRESS_TRACKER template when gaps discovered; prevents recurrence
**Authority**: BUILD_PROGRESS_TRACKER v1.2.0 now includes Stage 3.5

### Lesson 5: Evidence-First Execution Ensures Completeness
**What**: Created TIER_0_TO_CANON_INVENTORY_RIPPLE_EVIDENCE.md before finalizing work
**Why Critical**: Comprehensive audit trail catches missing items; validation commands enable verification
**How to Apply**: Create evidence document early in session; use it as checklist for completeness
**Authority**: REQ-ER-001/002, this session success

## Session 010 - 20260214

**What I Learned:**
- [Lesson to be filled by agent]

**What to Remember:**
- [Key insight to be filled by agent]

---

## Session 010 - 20260215

**What I Learned:**
- [Lesson to be filled by agent]

**What to Remember:**
- [Key insight to be filled by agent]

---

## Session 012 - 20260216

**What I Learned:**
- [Lesson to be filled by agent]

**What to Remember:**
- [Key insight to be filled by agent]

---

## Session 012 - 20260216

**What I Learned:**
- [Lesson to be filled by agent]

**What to Remember:**
- [Key insight to be filled by agent]

---

## Session 012 - 20260216

**What I Learned:**
- [Lesson to be filled by agent]

**What to Remember:**
- [Key insight to be filled by agent]

---


## Session 013 - 20260216: CRITICAL - Test Dodging Violation

### Lesson: NEVER Dismiss Errors as "Minor"

**What Happened**: During session 013, dismissed a sed error in session-closure.sh with:
> "There's a minor sed error but the essential steps completed."

**This is TEST DODGING and violates core governance principles.**

### Why This Was Critical

1. **Violates WE_ONLY_FAIL_ONCE_DOCTRINE.md**
   - Every error must be investigated and fixed immediately
   - Dismissed errors become technical debt
   - Pattern: "minor error" → ignored → compounds → harder to fix later

2. **Violates BUILD_PHILOSOPHY.md "Zero Test Debt"**
   - ALL tests/scripts must pass without errors
   - "Good enough" is not acceptable
   - Exit code 0 doesn't mean success if errors appear in output

3. **Creates Technical Debt**
   - Error would occur on every session closure
   - Other agents might work around the bug
   - Reduces confidence in governance infrastructure

4. **Test Dodging Pattern**
   - Phrases like "minor error", "mostly works", "fix it later" are PROHIBITED
   - Must STOP, INVESTIGATE, FIX, DOCUMENT, VERIFY

### The Bug and Fix

**Root Cause**: Line 347 of `.github/scripts/session-closure.sh`:
```bash
# WRONG - | delimiter conflicts with | in pattern
sed -i "s|\[✅ COMPLETE | ⚠️ PARTIAL | ❌ ESCALATED\]|${OUTCOME}|" "$SESSION_FILE"

# CORRECT - Use # delimiter to avoid conflict
sed -i "s#\[✅ COMPLETE | ⚠️ PARTIAL | ❌ ESCALATED\]#${OUTCOME}#" "$SESSION_FILE"
```

### Correct Response Protocol

When encountering ANY error:

1. **STOP** - Do not proceed
2. **INVESTIGATE** - Understand root cause
3. **FIX** - Implement proper fix (not workaround)
4. **TEST** - Verify fix works
5. **DOCUMENT** - Record in session memory

### Key Takeaways

- **No error is "minor"** - All errors indicate problems requiring fixes
- **"Essential steps completed" is insufficient** - ALL steps must complete without error
- **Zero tolerance for technical debt** - Fix immediately, not later
- **Test dodging compounds** - One ignored error leads to more
- **Exit code validation alone is insufficient** - Must verify actual behavior

### Prevention

**Agents must:**
- Adopt zero-tolerance mindset for errors
- Never use dismissive phrases
- Always investigate every error/warning
- Document learnings when errors fixed

**Reviews must:**
- Reject PRs with known errors
- Reject dismissive language about failures
- Require evidence that fixes work
- Verify completeness

### References

- `TEST_DODGING_LEARNING_20260216.md` - Comprehensive incident report
- `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md`
- `BUILD_PHILOSOPHY.md` - One-Time Build Law
- `governance/canon/STOP_AND_FIX_DOCTRINE.md`

**Authority**: This is a CRITICAL learning that must be shared with all agents. Test dodging undermines the entire governance system.

---
## Session 012 - 20260216

**What I Learned:**
- [Lesson to be filled by agent]

**What to Remember:**
- [Key insight to be filled by agent]

---


## Session 014 - 20260216: CRITICAL - Handover Testing Failure

### Lesson: Handover Testing is MANDATORY Before Every Push

**What Happened**: Failed to run handover testing before pushing changes, resulting in POLC boundary gate failure.

**This is TEST DODGING in a different form than the sed error earlier in session 013.**

### Why This Was Critical

1. **Protocol Violation**
   - Handover testing is MANDATORY before every push
   - Skipping tests is explicitly prohibited
   - "I'll let CI test it" is test dodging

2. **Continued Test Dodging Pattern**
   - Session 013: Dismissed sed error as "minor"
   - Session 014: Skipped handover testing entirely
   - Same principle violation: avoiding proper validation

3. **Wasted Resources**
   - CI resources burned on preventable failure
   - Public failure instead of private fix
   - Demonstrates lack of due diligence

4. **Learning Not Applied**
   - Created comprehensive test dodging learning
   - Immediately violated same principle
   - Documentation without behavior change is worthless

### What Is Handover Testing?

**Handover testing** = Running the SAME validation checks that merge gates will run, LOCALLY, BEFORE pushing.

For governance-liaison:
- YAML frontmatter validation
- JSON syntax validation
- Session memory validation
- POLC boundary validation (check ALL Foreman session memory)
- Evidence artifact validation
- Protected files check

### The Solution

**Created**: `.agent-workspace/governance-liaison-isms/handover-test.sh`

**Must run BEFORE every commit/push**:
```bash
.agent-workspace/governance-liaison-isms/handover-test.sh
# Only proceed if ALL tests pass
git add .
git commit -m "..."
git push
```

### The POLC Boundary Issue

Gate failed because it detected session memory file(s) with phrases like:
- "FM implemented feature X"
- "Foreman wrote code"

**Proper language patterns**:
✅ "FM did NOT write production code"
✅ "FM supervised builder implementation"
✅ "Foreman coordinated; builders implemented"

❌ "FM implemented X"
❌ "Foreman wrote code"

### Correct Protocol

**ALWAYS before pushing**:
1. Make changes
2. **Run handover tests** ← MANDATORY
3. Fix any failures
4. Re-run handover tests
5. Only when ALL pass: commit
6. Push
7. Monitor CI (should pass since pre-tested)

### Test Dodging Forms

1. **Form 1**: Dismissing errors as "minor"
2. **Form 2**: Skipping tests (handover testing)
3. **Form 3**: "I'll fix it if it fails" (reactive not proactive)
4. **Form 4**: "It probably works" (assumptions not validation)
5. **Form 5**: "Just a small change" (size doesn't matter)

**All prohibited. Zero tolerance.**

### Key Takeaways

- **Handover testing is MANDATORY** - Never optional, never skippable
- **Test dodging has many forms** - All violate zero-defect principle
- **Learning must change behavior** - Documents alone are worthless
- **Automation beats discipline** - Use scripts to enforce protocol
- **Local testing is faster** - 30 seconds local vs 5-10 min CI wait

### Prevention

**Immediate**:
- Run `.agent-workspace/governance-liaison-isms/handover-test.sh` before EVERY push
- Make it muscle memory
- No exceptions

**Long-term**:
- Add to session closure protocol
- Consider git pre-push hook
- Share pattern with all agents

### References

- `POLC_GATE_FAILURE_RCA_20260216.md` - Full RCA
- `HANDOVER_TESTING_FAILURE_LEARNING_20260216.md` - Comprehensive learning
- `.agent-workspace/governance-liaison-isms/handover-test.sh` - The solution
- `.github/workflows/polc-boundary-gate.yml` - The gate we should have tested

**Authority**: This is CRITICAL learning. Skipping handover testing undermines entire governance system.

---

## Session 016 — 2026-02-24

### AIMC Layer-Down Pattern
When a new strategic canon (like AIMC_STRATEGY.md) is layered down:
1. Verify SHA256 against CANON_INVENTORY.json entry before concluding verification
2. Check governance/aimc/ or equivalent consumer-side directories for pre-existing cross-references
3. Update GOVERNANCE_ARTIFACT_INVENTORY.md total count and add AIMC integration record
4. Consumer artefacts (governance/aimc/*.md) may already have cross-references in place — confirm before adding redundant references

**Authority**: Session 016 AIMC_STRATEGY.md layer-down verification

## Session 025 — 2026-02-28 (no-change ripple for 6644ee51)

1. No-change ripples (no PUBLIC_API files changed) follow the same processing pattern: update sync_state.json, add ripple-log entry, update GOVERNANCE_ARTIFACT_INVENTORY.md — even when no files are layered down.
2. Automated CI (ripple-integration.yml) may create CS2-gated DRAFT PRs for agent contract drift independent of the ripple's specific changes. These are separate work items, not liaison actions.
3. B-04 check is critical: always verify canonical commit not already in ripple-log before processing.

**Authority**: Session 025 no-change ripple 6644ee51 processing

---

### Session-031 (2026-03-01) — CL-3.5/CL-13 Kick-Off

- **Spec-document discipline**: When producing data model specs, remove all actual SQL DDL from code blocks and replace with descriptive language. The spec is for CS2 approval, not for schema-builder execution. SQL belongs in the migration file only.
- **RLS pattern matching**: Always read the existing AIMC migration files (especially `003_ai_knowledge.sql`) before writing RLS design in a new spec. The `current_setting('app.current_organisation_id', true)` pattern with `true` for error-suppression is a critical detail.
- **Deliverable completeness for exit criteria**: When adding new deliverables (D5/D6/D7) to an existing wave, always add corresponding acceptance criteria to the Exit Criteria section AND update the Responsible Agents field.
