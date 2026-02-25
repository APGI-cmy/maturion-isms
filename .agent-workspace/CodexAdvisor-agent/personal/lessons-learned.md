## Session 20260212 (Session 006)

### Lesson: Path Consistency Across Agent Contracts
- Context: When agent contracts reference governance artifacts
- Pattern: Watch for aspirational vs actual repository structure mismatches
- Action: Always validate paths against actual repository structure, not documentation
- Evidence: CodexAdvisor referenced `.governance-pack/` but repository uses `governance/`

### Lesson: Evidence-Based Artifact Creation
- Context: When creating missing governance artifacts like inventories
- Pattern: Use authoritative evidence (alignment logs) rather than reconstruction
- Action: Extract from `.agent-admin/sessions/` logs to ensure accuracy
- Evidence: CANON_INVENTORY.json built from liaison-20260211-133720_alignment.log

### Lesson: Cross-Agent Validation Reveals Truth
- Context: When documentation conflicts with reality
- Pattern: Compare multiple agent files to determine actual implementation
- Action: Check Governance Liaison + CodexAdvisor + Foreman for consistency
- Evidence: Governance Liaison correctly used `governance/` revealing true structure

### Lesson: Character Count Management Strategy
- Context: When creating/editing agent files with 30K GitHub UI selectability limit
- Pattern: Target <25K (20% buffer), use references not duplication
- Action: Link to canonical docs, externalize templates, use compact formatting
- Evidence: CodexAdvisor reduced from potential bloat to 19,290 characters (Session 001)

### Lesson: Gold Standard Template First, Then Adapt
- Context: When creating requirements checklists across repositories, analyzing reference implementation first saves significant time
- Pattern: office-app PRs #730 and #733 provided complete gold standard structure that could be adapted vs invented
- Action: Always review reference implementation (office-app, canonical governance) before creating parallel artifacts in consumer repos

### Lesson: Explicit Canonical Citations Enable Enforcement
- Context: Requirements without source citations are interpretable; requirements with explicit canonical file + section references are enforceable
- Pattern: Every checklist item includes canonical source file path and section number where applicable
- Action: Always cite governance canon explicitly in requirements artifacts (checklists, contracts, protocols)

### Lesson: Category-Based Organization Ensures Completeness
- Context: Unstructured requirements lists risk gaps; category-based organization provides systematic coverage
- Pattern: Identity (0) → Authority (1) → Alignment (2) → Evidence (3) → Ripple (4) → Escalation (5) → Deliverables (6) → Prohibitions (7) → [Role-Specific Extensions (8-10)]
- Action: Use consistent category framework across all agent contract checklists

### Lesson: Appendix A Prevents "Missing Binding" Failures
- Context: Agent contracts must bind to canonical governance artifacts, but which ones? Appendix A enumerates all PUBLIC_API canons
- Pattern: 102 PUBLIC_API canons organized into 12 functional categories (Identity, Contracts, Ripple, Gates, Authority, etc.)
- Action: Maintain Appendix A canonical artifact inventory in Governance Liaison checklist; sync when CANON_INVENTORY.json updates

### Lesson: Consumer vs Canonical Boundary Explicit in Categories 8-10
- Context: Governance Liaison role in consumer repos has strict boundaries - no canon authoring, only sync/layer-down
- Pattern: Category 10 explicitly prohibits canon authoring and defines consumer-only scope
- Action: For consumer repository agents, always include explicit authority boundary definitions

### Lesson: Alignment Notes Document Continuous Improvement Lineage
- Context: Future maintainers need to understand why requirements exist and where they came from
- Pattern: "Alignment Notes" section documents derivation from office-app PRs #730 and #733, explains adaptations
- Action: Always include alignment/provenance notes in governance artifacts showing continuous improvement chain

## Session 20260212 (Session 002)

### Lesson: Systematic REQ-* Mapping Provides Compliance Audit Trail
- Context: When upgrading agent contracts to gold standard, explicit requirement mappings enable verification
- Pattern: REQ-G-001 to REQ-G-005 (Category 0), REQ-A-001 to REQ-A-005 (Category 1), etc. - prefix-based naming by category
- Action: Add Living Agent System Requirements Satisfied section to each category with explicit REQ-* identifiers

### Lesson: Evidence Automation Embedded in Contracts Reduces Manual Effort
- Context: Layer-down sessions require artifact validation, checksum verification, completeness checks
- Pattern: 168-line bash script embedded in agent contract provides 5-step validation (inventory → SHA256 → bundle → completeness → final)
- Action: Embed evidence automation scripts in agent contracts rather than external tooling for better discoverability

### Lesson: Validation Hooks as Separate Category Enforce Quality Gates
- Context: Quality control distributed across contract is hard to enforce; consolidated validation hooks provide clear checkpoints
- Pattern: Category 11 with VH-001 (pre-mission), VH-002 (completeness), VH-003 (integrity), VH-004 (schema), VH-005 (post-mission)
- Action: Add Category 11 (Validation Hooks) to agent contracts requiring high governance alignment discipline

### Lesson: Consolidated Reference Tables Improve Large Artifact Set Navigation
- Context: 102 canonical artifacts in flat list is overwhelming; categorized table with metadata enables quick lookup
- Pattern: 76-artifact reference table with columns: Artifact, Role, Category, Required status
- Action: For contracts with 50+ canonical references, add consolidated reference table organized by functional area

### Lesson: YAML Validation Prevents Deployment Failures
- Context: Complex nested YAML structures can have subtle syntax errors; validation before commit prevents failures
- Pattern: Python yaml.safe_load() validation on frontmatter after structural changes
- Action: Always validate YAML programmatically after adding complex nested structures (contract, merge_gate_interface, prohibitions)

### Lesson: Gold Standard Requires Structure AND Content
- Context: 75% → 95%+ compliance gap wasn't just missing content; it was missing structural patterns (REQ mappings, validation hooks, reference tables)
- Pattern: YAML completeness + REQ mappings + Evidence automation + Validation hooks + Consolidated references = Gold Standard
- Action: Gold standard upgrades require both content additions AND structural pattern implementation

## Session 20260212 (Session 007 - OPOJD Violation Correction)

### Lesson: Validate ALL Agent Files When Instructed, Not Just One
- Context: Issue #79 required CodexAdvisor, Foreman, AND Governance Liaison validation; PR #80 only completed CodexAdvisor (33% complete)
- Pattern: When task specifies "both agent files" or lists multiple agents, create explicit checklist of ALL files and verify each one is completed before claiming job done
- Action: Never consider job complete until ALL specified artifacts are validated/updated with explicit checklist tracking
- Example: This violation left 66% of agent files unvalidated (2 out of 3), WORSE than R_Roster PR #116 (50% incomplete)

### Lesson: Version Check ≠ Checklist Validation
- Context: PR #80 checked Foreman/Governance Liaison version numbers (v6.2.0) and paths but did NOT validate against checklists
- Pattern: Checking version/paths is a quick sanity check, NOT a compliance validation; must load checklist and validate EVERY requirement
- Action: Checklist validation = Load checklist → Validate category by category → Document compliance % → Identify gaps → Update if needed
- Evidence: Foreman showed 100% compliance (113/113), Governance Liaison showed 88.5% (gaps in Categories 8, 9, 10)

### Lesson: Path Check ≠ Gap Analysis
- Context: Verifying that files exist and paths are correct is NOT the same as analyzing content completeness against requirements
- Pattern: Gap analysis requires comparing actual content against required content from checklist; path check only verifies file exists
- Action: After path verification, must perform content validation: Load canonical binding list → Compare against agent file bindings section → Document missing bindings
- Example: Governance Liaison had correct governance/ paths but was missing CONSUMER_REPO_REGISTRY.json, CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md, and entire Category 9 section

### Lesson: Partial Completion Severity Matters
- Context: 33% completion (1/3 agent files) is objectively WORSE than 50% completion (1/2 agent files)
- Pattern: When comparing OPOJD violations, completion percentage indicates severity; lower completion = higher severity
- Action: Document comparative severity in incident reports to establish severity baselines and prevent recurrence
- Evidence: PR #80 (33% complete) is worse than R_Roster PR #116 (50% complete)

### Lesson: Create Explicit Completion Checklist for Multi-Item Tasks
- Context: When given task like "review foreman and governance agent files," easy to lose track of which are complete
- Pattern: Create explicit checklist at start: [ ] CodexAdvisor, [ ] Foreman, [ ] Governance Liaison; mark each complete as validated
- Action: For ANY task specifying multiple artifacts, create completion tracker and verify ALL items marked before claiming done
- Prevention: This pattern prevents "assumed complete" errors where partial work is mistaken for full completion

### Lesson: Registry Operations Critical for Consumer Repository Liaisons
- Context: Governance Liaison initial version was missing entire Category 9 (Consumer Repository Registry Operations) - 0/5 requirements
- Pattern: Consumer repository governance liaisons MUST have registry-aware ripple capabilities (read CONSUMER_REPO_REGISTRY.json, validate ripple sources, deterministic targeting, escalation protocol, ripple inbox management)
- Action: When creating/validating governance liaison contracts for consumer repositories, ensure Category 9 is complete
- Authority: CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md Section 7 mandates registry operations

### Lesson: OPOJD Violations Compound When Undetected
- Context: If PR #80 incomplete work went undetected, subsequent work would build on incomplete foundation
- Pattern: Incomplete checklist validation → Missing gaps propagate → Downstream work inherits incomplete governance
- Action: Self-review sessions MUST catch incomplete work before merge; use explicit completion checklists to prevent propagation
- Evidence: This corrective action prevented 66% incomplete validation from becoming canonical baseline


---

## Session 20260216 (Session 012 - Agent File Modification Authority)

### Lesson: Agent File Modification Authority is Exclusive to CodexAdvisor
- Context: Agent contracts (`.github/agents/**`) are constitutional governance artifacts requiring agent-factory oversight
- Pattern: Only CodexAdvisor-agent (via agent-factory protocol) may create or modify agent contract files
- Action: Before any `.github/agents/**` modification, confirm CodexAdvisor-agent authority OR explicit CS2/CS1-approved issue authorization
- Evidence: CS2 Governance Ruling (2026-02-16), LIVING_AGENT_SYSTEM.md v6.2.0, AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md
- Exception: CS2/CS1-approved issues may explicitly grant temporary authority to other agents for specific modifications
- Violation Prevention: All future agent file changes must reference this lesson and confirm authority boundary compliance

### Lesson: Proactive Governance Learning Prevents Violations
- Context: Recording governance clarifications before violations occur establishes clear boundaries
- Pattern: When governance ruling is issued (even if no violation occurred), immediately document in session memory and personal learning
- Action: Create session memory + update lessons-learned.md + update patterns.md for comprehensive coverage
- Evidence: Session 012 documents PR #233 governance clarification proactively (not reactively to violation)
- Benefit: Future sessions have explicit authority boundary reference, preventing constitutional violations

---

## Session 20260216 (Session 010)

### Lesson: Agent ID Consistency is Critical for GitHub Copilot Registration
- Context: Foreman agent disappeared from Copilot agent list after PR #222
- Pattern: Agent file had frontmatter `id: foreman-isms-agent` but agent section `id: foreman-isms` (mismatch)
- Action: GitHub Copilot requires exact match between frontmatter.id, agent.id, and filename for agent discovery
- Prevention: Validate ID consistency before any agent file creation/modification
- Tool: Compare `grep "^id:" file` with `grep "^  id:" file` output for all agent files

### Lesson: Constitutional Authority Correction via Minimal Change
- Context: governance-liaison-isms agent violated authority boundaries by creating foreman file
- Pattern: When wrong agent creates file but content is valid, CodexAdvisor takes ownership via commit, not recreation
- Action: Minimal surgical change (1 line) + proper commit authorship establishes CodexAdvisor ownership
- Rationale: Preserves valid work while correcting constitutional violation; avoids unnecessary disruption
- Authority: CodexAdvisor-agent is agent-factory; ownership shown through git history

### Lesson: Agent File Authority Model Enforcement is Manual
- Context: No automated gate prevented governance-liaison from creating foreman file
- Pattern: Agent boundary violations are not currently caught by pre-commit hooks or merge gates
- Action: Recommend pre-commit hook validating agent file modifications by correct agent
- Enhancement: Add merge gate checking `.github/agents/*.md` changes against AGENT_RECRUITMENT_AND_CONTRACT_AUTHORITY_MODEL.md
- Current state: Authority enforcement relies on manual review and post-facto correction

### Lesson: PR #222 Gold Standard for Foreman Contract
- Context: Foreman contract v2.2.0 includes FULLY_FUNCTIONAL_DELIVERY_STANDARD.md wave gates
- Pattern: Contract structure now includes Pre-Wave Authorization Gate, Wave Completion Gate, Wave Closure Certification
- Action: All future foreman updates must preserve these v2.2.0 enhancements
- Reference: Sections 6.3-6.5 and 7.4 are critical additions from PR #222
- Quality bar: "Tested" ≠ "Delivered" — physical verification required before wave closure

---

## Session 20260217 (Session 013 - Governance Violation Remediation)

### Lesson: YAML Multi-line Strings with Colons Break GitHub Actions
- Context: When adding bash scripts to GitHub Actions workflow files
- Pattern: Multi-line string literals containing colons (e.g., "File: $file") confuse YAML parser
- Action: Use single-line string concatenation with \n escape sequences instead of multi-line heredoc
- Evidence: Initial approach caused YAML parser error; changed to `VIOLATION_FILES="${VIOLATION_FILES}\n     File - $file\n"` format
- Prevention: Avoid `:` in variable assignments within GitHub Actions `run:` blocks; use `-` or `=` as separators

### Lesson: Agent Identity Pattern Matching Must Be Comprehensive
- Context: Detecting agent self-modification requires matching various commit author formats
- Pattern: Same agent may appear as "foreman-isms-agent" (file), "Copilot" (author), or "copilot-swe-agent" (author)
- Action: Create exhaustive pattern list covering all known agent identity formats
- Evidence: Foreman special case required explicit "Copilot" and "copilot-swe-agent" patterns
- Maintenance: Update pattern list when new agents added or identity formats change

### Lesson: Constitutional Violations Require Hard Fail Enforcement
- Context: Merge gate for agent self-modification prevention
- Pattern: Governance violations at constitutional level require strict enforcement without warnings or overrides
- Action: Use `exit 1` immediately upon detection; no graduated responses
- Exception: Only CS2 override permitted (via direct commit, not agent)
- Rationale: Establishes clear authority boundary that cannot be weakened by convenience arguments

### Lesson: Surgical Deletion Preserves Valid Work
- Context: PR #270 contained governance violation (agent contract) AND valid work (evidence, session memory)
- Pattern: When violation is localized to specific files, delete those files rather than reverting entire commit
- Action: Use `git rm` for targeted file removal; preserve rest of commit
- Evidence: Deleted foreman-isms-agent.md (violation) but kept session memory, evidence docs (valid)
- Benefit: Maintains audit trail and valuable artifacts while removing violation

### Lesson: Merge Gate Job Positioning Affects Execution Order
- Context: New agent-contract-protection job needs to run before code changes evaluated
- Pattern: Job dependency via `needs:` controls execution order; position in file is cosmetic
- Action: Place agent contract checks early (Job 4), before stop-and-fix enforcement (Job 5)
- Rationale: Constitutional checks should gate before functional checks; hierarchy of concerns

### Lesson: Prevention Gates vs. Remediation Work
- Context: This session addressed BOTH remediation (revert) AND prevention (merge gate)
- Pattern: Governance violations reveal missing preventive controls; fix requires both actions
- Action: When remediating violation, always ask "What gate would have prevented this?"
- Evidence: Added agent-contract-protection gate to prevent future agent self-modification
- Principle: Defense in depth - remediation + prevention


## Session 20260217 (Session 014)

### Lesson: Agent Contract Creation with 4-Phase Architecture
- Context: Creating foreman agent contract following Living Agent System v6.2.0
- Pattern: Use 4-phase canonical architecture (Preflight-Induction-Build-Handover)
- Action: Structure all new agent contracts with clear phase boundaries, LOCKED self-modification prohibition, behavioral examples (❌ WRONG vs ✅ CORRECT)

### Lesson: Character Count Management for Agent Contracts
- Context: GitHub UI selectability breaks above 30K characters
- Pattern: Target <25K characters (20% buffer) by using canonical references instead of duplication
- Action: Link to canonical documents, scripts, and templates instead of embedding full content

### Lesson: POLC Behavioral Examples Prevent Violations
- Context: Foreman agents historically violated POLC boundaries by implementing code
- Pattern: Include concrete ❌ WRONG vs ✅ CORRECT examples in Preflight phase
- Action: For supervisor agents, show traditional coding agent behavior vs. POLC supervision model

### Lesson: Checklist-First Contract Creation
- Context: Living Agent System v6.2.0 requires 100% checklist compliance
- Pattern: Load checklist before contract creation, map all items to contract sections
- Action: Create compliance report with line number mappings for audit trail

### Lesson: Consumer Repository Mode Requirements
- Context: Consumer repositories receive governance via layer-down, cannot dispatch ripple
- Pattern: Document governance sync protocol, drift detection, escalation to canonical source
- Action: Include consumer mode section with ripple handling and alignment procedures

---

## Session 20260217 (Session 016 - ui-builder Agent Recognition Failure)

### Lesson: GitHub Copilot Agent Parser Rejects Non-Standard YAML Fields
- Context: ui-builder.md contract was LAS v6.2.0 compliant but invisible in Copilot agent list
- Pattern: GitHub Copilot's agent discovery parser strictly validates YAML frontmatter schema
- Action: Only include documented YAML fields in agent contract metadata; avoid custom extensions
- Evidence: `assigned_waves` field unique to ui-builder caused recognition failure; removal fixed issue
- Prevention: Compare new agent YAML frontmatter against working agents before committing

### Lesson: Systematic Comparison Reveals Unique Differences
- Context: Seven builder agents, only one not visible; needed to identify unique characteristic
- Pattern: Compare ALL agents (visible and invisible) to find unique differences
- Action: Use `grep` for field-by-field comparison across all agent files
- Tool: `grep -n "field_name" .github/agents/*.md` quickly identifies which files have specific fields
- Evidence: `grep -n "assigned_waves"` returned only `ui-builder.md:68`

### Lesson: YAML Validity ≠ GitHub Copilot Compatibility
- Context: ui-builder YAML frontmatter parsed successfully with Python yaml.safe_load()
- Pattern: Syntactically valid YAML can still fail platform-specific schema validation
- Action: Validate both YAML syntax AND platform schema compliance
- Evidence: ui-builder was valid YAML but invalid Copilot agent schema
- Implication: Agent contracts must satisfy TWO parsers: YAML parser + GitHub Copilot agent parser

### Lesson: Wave Assignments Don't Belong in Agent Contracts
- Context: ui-builder had `assigned_waves: ["Wave 1 (Task 1.3)", ...]` in metadata
- Pattern: Task assignments are ephemeral (change per project); agent contracts are persistent
- Action: Track wave assignments in foreman task management artifacts, not agent contract metadata
- Rationale: Agent contracts define capabilities/authority; foreman assigns tasks using those capabilities
- Separation of concerns: Agent contracts (what can I do?) vs. Task management (what am I doing?)

### Lesson: Minimal Change Principle for Agent Contract Fixes
- Context: Could have rewritten entire ui-builder.md to "fix" it
- Pattern: Identify minimal change that solves problem; preserve all other content
- Action: Removed exactly 1 line (assigned_waves field); left all other content intact
- Evidence: 97 bytes removed from 27,188-byte file (0.36% change)
- Benefit: Reduces risk of introducing new issues; maintains git blame accuracy; easier code review

### Lesson: Agent Recognition Failures Require Merge Verification
- Context: Cannot directly test GitHub Copilot agent discovery from local branch
- Pattern: Agent file changes require merge to main + cache refresh before verification possible
- Action: Document hypothesis, apply fix, commit to PR, request CS2 merge for verification
- Timeline: Fix applied → PR created → CS2 merges → Copilot cache refreshes (minutes) → Verification
- Gap: No local testing capability for agent discovery issues

---
Created: Session 016 | Date: 2026-02-17 | Agent: CodexAdvisor-agent

## Session 20260221 (Session 019)

### Lesson: Copilot SWE MUST Invoke CodexAdvisor for Agent Contract Changes
- Context: Any modification to `.github/agents/*.md` files
- Pattern: Copilot SWE coding bot attempted to directly modify agent contracts (added `name:` field, renamed `foreman-v2.agent.md`) without invoking CodexAdvisor
- Action: ALWAYS use `task` tool with `agent_type: CodexAdvisor-agent` before touching ANY `.github/agents/*.md` file — no exceptions
- Evidence: CI `agent-contract/self-modification-prevention` job failed on commit c05e747 — `foreman-v2-agent.md` modified by `copilot-swe-agent[bot]`
- Governance refs: LIVING_AGENT_SYSTEM.md v6.2.0, Issue #271, OPOJD, stop-and-fix doctrine

### Lesson: Run Pre-Merge Governance Checks Before Submitting
- Context: Before calling `report_progress` on any PR that touches `.github/agents/` or `.github/workflows/`
- Pattern: Pre-merge check was skipped; CI failure could have been caught locally
- Action: For every PR touching agent files, simulate the self-modification check:
  - Check each modified file against commit_author for identity match
  - If any match found → STOP, invoke CodexAdvisor, do not submit directly
- Failure mode: Submitting without pre-checks violates OPOJD and "we only fail once"

### Lesson: Governance Check Heuristics Must Be Identity-Based, Not Keyword-Based
- Context: `merge-gate-interface.yml` contained `foreman+Copilot` keyword heuristic
- Pattern: Keyword heuristics in governance checks create false positives and are fragile
- Action: Governance checks should match EXACT agent identity (commit_author =~ agent_file_name), not keyword combos
- Fix applied: Removed false-positive lines from `agent-contract/self-modification-prevention` job
- Rationale: `copilot-swe-agent[bot]` is a general-purpose coding tool, not any specific agent

---
Updated: Session 019 | Date: 2026-02-21 | Agent: CodexAdvisor-agent

## Session 20260221 (Session 020)

### Lesson: Session Memory and PREHANDOVER Are Mandatory for Every Agent PR
- Context: PR #385 was opened to add `contract_pattern: four_phase_canonical` to CodexAdvisor-agent.md but had no file changes and no session memory — violating the memory protocol
- Pattern: It is insufficient to open a PR; the PR must include: (1) the actual file change, (2) session memory, (3) PREHANDOVER proof (for contract/metadata changes)
- Action: Before calling `report_progress` on ANY agent contract change, verify all three bundle components exist and are committed
- Evidence: CS2 Issue "Fix and enforce agent memory protocol"; session-020-20260221.md; PREHANDOVER-session-020-20260221.md
- Governance refs: `governance/canon/AGENT_HANDOVER_AUTOMATION.md`, `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`

### Lesson: Retroactive PREHANDOVER Proofs Must Be Created When Missing
- Context: foreman session-046 performed a contract change but did not create a PREHANDOVER proof
- Pattern: Any session that modifies a `.github/agents/*.md` file must create a PREHANDOVER proof, even if it feels like a "small" change
- Action: When a prior session is found to be missing its PREHANDOVER proof, create it retroactively with a clear "Retroactive" note explaining the gap
- Evidence: PREHANDOVER-session-046-20260221.md created in session-020

---
Updated: Session 020 | Date: 2026-02-21 | Agent: CodexAdvisor-agent

## Session 20260225 (Session 031 — BREACH-002 Learning Loop)

### Lesson: Contract-Not-Read-First Is a First-Order Failure That Disables All Downstream Gates
- Context: PR #553 (Bootstrap Directive wave) was executed without first reading CodexAdvisor's own contract
- Pattern: Skipping the BOOTSTRAP DIRECTIVE disables Phase 1→2→3→4 execution, causing all pre-handover checks to be skipped
- Root Cause: Work began with repository/context exploration instead of reading `.github/agents/CodexAdvisor-agent.md` first
- Cascading failures: Phase 2.5 (size projection) skipped → three files exceeded 30,000 chars; Phase 3.8 (merge gate parity) skipped → violations not caught pre-PR; Phase 4.4 (IAA invocation) skipped → no ASSURANCE-TOKEN before PR opened
- Action: The BOOTSTRAP DIRECTIVE is the first action — no exceptions, no shortcuts. Even when the task IS inserting the BOOTSTRAP DIRECTIVE into other agents, it applies to CodexAdvisor's own session first
- Evidence: BREACH-002; CI Model Scaling Check failure (job 64808711454); CS2 RCA comment on PR #553

### Lesson: Character Count Verification Is Part of Merge Gate Parity — Not Optional
- Context: Three agent files exceeded 30,000 chars in PR #553 and were caught by CI, not by CodexAdvisor's pre-handover gate
- Pattern: Phase 3 Step 3.8 (merge gate parity) must include `wc -c` on every `.github/agents/*.md` modified; hard limit is 30,000 chars
- Action: Run character count verification before opening any PR that modifies agent contract files. Document exact counts in PREHANDOVER proof. Any file over 30,000 chars → HALT, remediate, re-count
- Authority: FAIL-ONLY-ONCE A-013 (v1.2.0); CodexAdvisor contract Phase 3 §3.8, Phase 4 §4.1
- Prevention: This check would have caught the PR #553 violations before the PR was opened

### Lesson: IAA Invocation Must Be Formally Executed — Advisory Acknowledgment Is Not Sufficient
- Context: PR #553 acknowledged IAA was in PHASE_A_ADVISORY mode but did not formally execute Phase 4 Step 4.4 (invoke IAA)
- Pattern: Even when IAA is in advisory mode, the Step 4.4 invocation must be formally executed and documented in the PREHANDOVER proof
- Action: Before opening any agent contract PR, confirm IAA has been formally invoked (Step 4.4). Record result (ASSURANCE-TOKEN / PHASE_A_ADVISORY / REJECTION-PACKAGE) in PREHANDOVER proof and PR description
- Authority: FAIL-ONLY-ONCE A-001, A-002, A-013; AGCFPP-001
- Evidence: BREACH-002; A-001 and A-002 both violated in PR #553

---
Updated: Session 031 | Date: 2026-02-25 | Agent: CodexAdvisor-agent
