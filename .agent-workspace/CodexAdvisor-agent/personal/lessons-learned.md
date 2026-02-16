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
