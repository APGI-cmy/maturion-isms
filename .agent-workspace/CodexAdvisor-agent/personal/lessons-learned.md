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

