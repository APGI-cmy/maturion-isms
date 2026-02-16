## Pattern: Gold Standard Checklist Construction (Cross-Repo Alignment)
- Observed: 2026-02-11 (Session 001)
- Context: Creating agent contract requirements checklists in consumer repository (maturion-isms) aligned to gold standard established in reference repository (office-app PRs #730 and #733)
- Response: 
  1. Download and analyze reference implementation (office-app checklists)
  2. Identify structural elements: category organization, citation format, appendices
  3. Adapt canonical references to consumer repo governance paths
  4. Preserve gold standard structure exactly (category numbering, comprehensiveness)
  5. Add alignment notes documenting derivation and continuous improvement lineage
  6. Create session memory capturing lessons learned for future cross-repo alignment

## Pattern: Comprehensive Agent Contract Requirements Coverage
- Observed: 2026-02-11 (Session 001)
- Context: Agent contracts need exhaustive, enforceable requirements to prevent gaps
- Response: 8-11 category framework covering:
  - Category 0: Identity & Canonical Bindings
  - Category 1: Authority, Scope & Boundaries
  - Category 2: Governance Loading & Self-Alignment
  - Category 3: Memory, Evidence & Audit
  - Category 4: Ripple, Merge Gates & Alignment
  - Category 5: Escalation & Stop Conditions
  - Category 6: Role-Specific Deliverables & Outputs (or Prohibitions)
  - Category 7: Prohibitions & Guardrails (or Outputs)
  - Category 8: Cross-Repository Layer-Down Protocol (Governance Liaison only)
  - Category 9: Consumer Repository Registry Operations (Governance Liaison only)
  - Category 10: Role-Specific Authority Boundaries (Governance Liaison only)
  - Appendix A: Required Canonical Governance Artifacts (Governance Liaison only)

## Pattern: Explicit Canonical Citation Format
- Observed: 2026-02-11 (Session 001)
- Context: Requirements must be traceable to authoritative source
- Response: Format: `(governance/canon/FILE.md Section X.Y)` or `(governance/canon/FILE.md)`
  - Examples: 
    - `(governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md Section 6.1)`
    - `(governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md)`
  - Every checklist item includes at least one canonical source citation
  - Multiple sources cited when requirement spans multiple canons

## Pattern: Consumer Repository Governance Liaison Role Definition
- Observed: 2026-02-11 (Session 001)
- Context: Governance Liaison in consumer repositories has specific scope/boundaries distinct from canonical governance administrator
- Response: Three explicit boundary categories (8-10):
  - Category 8: HOW to layer down (Cross-Repository Layer-Down Protocol)
  - Category 9: WHERE ripple comes from (Consumer Repository Registry Operations)
  - Category 10: WHAT authority exists (Role-Specific Authority Boundaries - consumer only, no canon authoring)
  - Result: Prevents boundary violations and clarifies consumer vs canonical distinction

## Pattern: PUBLIC_API Canon Enumeration (Appendix A)
- Observed: 2026-02-11 (Session 001)
- Context: Agent contracts must bind to canonical governance, but which artifacts? Incomplete bindings cause failures
- Response: Appendix A enumerates all 102 PUBLIC_API canons in 12 functional categories:
  - Core Identity & Purpose
  - Agent Contract & Recruitment
  - Cross-Repository Layer-Down & Ripple
  - Governance Liaison Role Definition
  - Version Synchronization & Alignment
  - Execution, Testing & Evidence
  - Gate Protocols & Merge Requirements
  - Authority Models & Supervision
  - Repository Initialization & Structure
  - Escalation & Compliance
  - Architecture & Build Requirements
  - Specialized Protocols
  - Includes version tracking, SHA256 verification requirements, PUBLIC_API vs INTERNAL vs OPTIONAL distinction

## Pattern: Alignment Notes for Continuous Improvement Traceability
- Observed: 2026-02-11 (Session 001)
- Context: Governance artifacts evolve through continuous improvement; future maintainers need provenance context
- Response: Include "Alignment Notes" section documenting:
  - Source: Which PR/issue/repository provided gold standard
  - Adaptations: What was changed to fit consumer repository context
  - Structure: What organizational elements were preserved
  - Authority: Which governance protocols authorize this artifact
  - Result: Clear continuous improvement lineage across repositories

## Pattern: REQ-* Requirement Mapping for Systematic Compliance
- Observed: 2026-02-12 (Session 002)
- Context: Gold standard contracts need systematic requirement tracking across all categories
- Response: Add "Living Agent System Requirements Satisfied" section to each category with prefix-based REQ-* identifiers:
  - Category 0: REQ-G-001 to REQ-G-005 (Governance/Identity requirements)
  - Category 1: REQ-A-001 to REQ-A-005 (Appointment/Authority requirements)
  - Category 2: REQ-L-001 to REQ-L-005 (Layer-down requirements)
  - Pattern continues for all categories with semantic prefixes
  - Result: 55 requirements mapped across 11 categories, providing audit trail and compliance verification

## Pattern: Evidence Automation Script Embedding
- Observed: 2026-02-12 (Session 002)
- Context: Layer-down sessions require artifact validation; external tooling creates discoverability issues
- Response: Embed 5-step evidence automation bash script directly in agent contract:
  - Step 1: Collecting Artifact Inventory (file list + SHA256)
  - Step 2: SHA256 Verification Against CANON_INVENTORY
  - Step 3: Generating Evidence Bundle (markdown report)
  - Step 4: Artifact Completeness Check (expected artifacts present)
  - Step 5: Final Validation (pass/fail determination)
  - Script outputs: evidence bundle, artifact list, verification log
  - Result: Self-contained validation tooling with ~168 lines embedded after Escalation Protocol

## Pattern: Validation Hooks as Dedicated Category
- Observed: 2026-02-12 (Session 002)
- Context: Quality control scattered across contract is hard to enforce; need consolidated checkpoints
- Response: Add Category 11 (Validation Hooks) with 5 pre-defined hooks:
  - VH-001: Pre-mission governance validation (5 checks before work)
  - VH-002: Layer-down artifact completeness (5 checks after layer-down)
  - VH-003: CANON_INVENTORY integrity validation (5 checks + degraded mode handling)
  - VH-004: Session contract schema validation (5 checks for memory artifacts)
  - VH-005: Post-mission alignment verification (5 checks after completion)
  - Each hook: purpose, authority, validation checks, actions on failure
  - Result: Clear quality gates throughout agent lifecycle

## Pattern: Consolidated Reference Table for Large Artifact Sets
- Observed: 2026-02-12 (Session 002)
- Context: 102 canonical artifacts in flat list (Appendix A) overwhelming for quick reference
- Response: Add "Consolidated Canonical Governance References" section with structured table:
  - 76 key artifacts organized into 10 functional areas
  - Table columns: Artifact, Role, Category, Required status
  - Functional areas: Constitutional Authority, Agent Contract & Lifecycle, Liaison-Specific, Layer-Down & Ripple, etc.
  - Positioned before Authority References for quick navigation
  - Result: Easy lookup of critical governance artifacts by function

## Pattern: YAML Structure Validation Before Commit
- Observed: 2026-02-12 (Session 002)
- Context: Complex nested YAML (contract, merge_gate_interface, prohibitions) prone to syntax errors
- Response: Programmatic validation workflow:
  1. Extract YAML frontmatter from agent contract markdown
  2. Run Python yaml.safe_load() on extracted YAML
  3. Verify expected sections present (contract, merge_gate_interface, etc.)
  4. Commit only if validation passes
  - Result: Prevents deployment failures from YAML syntax errors


## Pattern: Aspirational vs Actual Repository Structure
- Observed: 2026-02-12 (Session 006)
- Context: Agent contract references paths that don't exist in repository
- Symptoms: References to `.governance-pack/` when repository uses `governance/`
- Root Cause: Agent contract written for future/aspirational structure
- Response: Cross-validate with other agents, check actual filesystem, update all references
- Prevention: When creating agent contracts, validate all paths against actual repository structure

## Pattern: Missing Foundational Governance Artifacts
- Observed: 2026-02-12 (Session 006)
- Context: CANON_INVENTORY.json completely missing despite agent references
- Symptoms: Agent contracts reference inventory but file doesn't exist
- Root Cause: Layer-down completed but inventory not generated
- Response: Build from authoritative evidence (alignment logs with SHA256 hashes)
- Prevention: Governance liaison should generate CANON_INVENTORY.json during layer-down

## Pattern: Character Count Bloat in Agent Files
- Observed: 2026-02-12 (Session 006)
- Context: Agent files approaching 30K GitHub UI selectability limit
- Symptoms: Excessive embedded templates, duplicated documentation
- Root Cause: Embedding full protocols instead of referencing canonical sources
- Response: Use references (e.g., "See PR #748"), externalize to governance/templates/
- Prevention: Target <25K characters (20% buffer), pre-creation character estimation

## Pattern: Cross-Agent Path Consistency Validation
- Observed: 2026-02-12 (Session 006)
- Context: Multiple agents must reference same governance structure
- Symptoms: CodexAdvisor uses `.governance-pack/` while Governance Liaison uses `governance/`
- Root Cause: Agents created at different times with different assumptions
- Response: Check 3+ agents to determine actual vs aspirational structure
- Prevention: Standardize paths in agent factory protocol, validate against actual structure

---

## Pattern: Agent File ID Mismatch Breaks Registration
- Observed: 2026-02-16 (Session 010)
- Context: GitHub Copilot agent discovery requires exact ID consistency
- Symptom: Agent exists in `.github/agents/*.md` but doesn't appear in Copilot agent list
- Diagnosis: Check if frontmatter `id:` matches agent section `id:` matches filename (minus .md)
- Fix: Align all three ID references to be identical
- Prevention: Validate ID consistency in agent file creation/modification workflow

## Pattern: Constitutional Ownership via Git History
- Observed: 2026-02-16 (Session 010)
- Context: When wrong agent creates valid file, establish correct ownership
- Response: CodexAdvisor makes minimal surgical change with proper commit authorship
- Rationale: Git history shows CodexAdvisor as last modifier, establishing authority
- Trade-off: Preserves valid content while correcting constitutional violation
- Authority: Agent-factory ownership demonstrated through commit lineage, not file recreation

## Pattern: Agent Boundary Violation Detection Gap
- Observed: 2026-02-16 (Session 010)
- Context: governance-liaison-isms created foreman file despite authority restriction
- Gap: No pre-commit hook or merge gate enforces AGENT_RECRUITMENT_AND_CONTRACT_AUTHORITY_MODEL.md
- Current state: Manual detection and post-facto correction only
- Recommendation: Implement automated enforcement (pre-commit hook + merge gate)
- Urgency: Medium (violations are rare but constitutionally critical when they occur)
