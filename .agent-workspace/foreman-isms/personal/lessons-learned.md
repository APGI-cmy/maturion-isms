## Session 20260211 (Session 001)

### Lesson: Checklist-First Contract Drafting
- Context: When creating gold-standard agent contracts, review requirements checklist BEFORE drafting
- Pattern: Checklist defines "definition of done"; contract structure mirrors checklist categories for traceability
- Action: Always start with checklist analysis, then organize contract sections to match checklist categories exactly

### Lesson: Embed Critical Templates in Contracts
- Context: Agents need to know EXACTLY what format to use for session memory, escalations, evidence bundles
- Pattern: Including templates directly in contract eliminates "what format?" questions and ensures consistency
- Action: Embed session memory template (Category 3.2) and escalation template (Category 5.3) in every agent contract

### Lesson: Explicit Canonical Citations Are Enforceable
- Context: Requirements without authoritative sources are interpretable; requirements with explicit citations are enforceable
- Pattern: Format: `(governance/canon/FILE.md Section X.Y)` provides precise reference
- Action: EVERY category section must include "Authority:" line with canonical file paths and section numbers where applicable

### Lesson: RCA in Initial Session Memory Documents Continuous Improvement
- Context: Gold-standard contracts incorporate lessons from prior implementations (office-app)
- Pattern: RCA section in session-001 memory documents "Prior Mistake → Why Problem → How Avoided → Evidence"
- Action: When creating contracts from lessons learned, include comprehensive RCA documenting 10+ prior mistake categories

### Lesson: Consumer Repository Context Must Be Explicit
- Context: Ambiguity about consumer vs canonical repository leads to boundary violations
- Pattern: Category 7 (Prohibitions) explicitly states "FM MUST NOT modify contract without CS2 approval"
- Action: For consumer repositories, always include explicit authority boundary definitions and consumer-only scope

### Lesson: Category-Mirroring Structure Enables Validation
- Context: Contracts need systematic validation against requirements checklist
- Pattern: Contract section "Category N: [Title]" maps directly to checklist "Category N — [Title]"
- Action: Organize contract to mirror checklist structure exactly; enables item-by-item validation

### Lesson: YAML Frontmatter Completeness Prevents Schema Failures
- Context: Missing required YAML fields cause governance alignment gate failures
- Pattern: Checklist Category 0 enumerates all required fields (agent.id, agent.class, governance.protocol, model tier specification)
- Action: Validate frontmatter against checklist before considering contract complete

### Lesson: Evidence Bundle Automation Requires Specification
- Context: "Provide evidence" is too vague; agents need concrete requirements
- Pattern: Category 3.3 specifies PREHANDOVER proof, exit codes, test results, CI confirmatory role
- Action: Define evidence bundle components explicitly with templates and verification steps

### Lesson: Escalation Taxonomy Prevents Ambiguity
- Context: Generic "escalate when blocked" guidance leads to inconsistent escalations
- Pattern: Escalation template includes type taxonomy (BLOCKER, GOVERNANCE_GAP, AUTHORITY_BOUNDARY, COGNITIVE_LIMIT)
- Action: Provide escalation template with clear type definitions and context requirements

### Lesson: Repository-Specific Agent Naming Improves Clarity
- Context: Multi-repo environments need clear agent identity per repository
- Pattern: `foreman-isms-agent.md` vs `ForemanApp-agent.md` distinguishes ISMS repo from office-app repo
- Action: Use `<agent-class>-<repo>-agent.md` naming convention for clarity across repositories

### Lesson: Balance Completeness with Readability
- Context: Comprehensive contracts can become overwhelming (738 lines)
- Pattern: Use clear section headings, hierarchical structure, and embedded templates to maintain readability
- Action: Organize long contracts with: category sections → subsections → templates → canonical citations

### Lesson: Cross-Repo Learning Must Be Documented
- Context: Lessons from office-app (PRs #730, #737) apply to maturion-isms
- Pattern: Session memory includes "Cross-Repo Learning Captured" section documenting what was adopted
- Action: When implementing gold standards from other repositories, document provenance and adaptations

## Session 20260213 (RED Suite Execution)

### Lesson: QA-to-Red Requires Executable Artifacts, Not Just Planning Documents
- Context: TEST_REGISTRY.json and strategy were merged without corresponding test code
- Pattern: "Compiled" must mean "runnable test code exists" — not just "documented in JSON"
- Action: Every test registry merge must include corresponding .test.ts files that run and fail RED
- RCA: modules/mat/05-build-evidence/RCA_QA_PROCESS_LAPSE.md

### Lesson: Registry + Test Code = Single Atomic Deliverable
- Context: Splitting registry compilation and test scaffolding into separate PRs creates a process gap
- Pattern: Two-phase QA delivery (plan + execute) should be one PR, not two
- Action: Future QA-to-Red tasks must include both registry AND test code in the same deliverable

### Lesson: Merge Gates Must Validate Executable Presence
- Context: Registry PR merged without gate checking for test file existence
- Pattern: Gate should verify: for every entry in TEST_REGISTRY.json, a .test.ts file exists with matching serial ID
- Action: Enhance merge gate to check test code presence alongside registry metadata

### Lesson: Programmatic Test Scaffolding from Registry Is Reliable
- Context: 98 tests scaffolded from TEST_REGISTRY.json using Node.js generator script
- Pattern: Registry JSON → parse → generate .test.ts files ensures 1:1 traceability
- Action: Use registry-driven generation for future modules to prevent manual errors

## Session 20260214 (CST/CWT Omission Correction)

### Lesson: Implementation Plans Must Include Integration Testing Governance
- Context: Implementation plan v1.0.0 omitted CST/CWT requirements from `governance/canon/COMBINED_TESTING_PATTERN.md`
- Root Cause: Derivation chain (App Description → FRS → TRS → Architecture → QA-to-Red → Plan) did not include COMBINED_TESTING_PATTERN.md as a governance input. Wave gates only validated individual test coverage, not cross-subwave/cross-wave integration testing.
- Impact: Without CST/CWT, builders would not provide integration tests at convergence points, FM would not enforce CWT before IBWR, and wave closure could proceed without cross-wave integration assurance.
- Pattern: Every implementation plan derivation chain must explicitly include canonical testing patterns as inputs, not just functional/technical/architecture documents.
- Action: Always include `governance/canon/COMBINED_TESTING_PATTERN.md` in derivation chain. Verify CST convergence checkpoints for concurrent tasks and CWT scope for every wave boundary.
- RCA: The canonical testing hierarchy (Unit → Subwave QA → Wave QA → CST → CWT → E2E) was established in COMBINED_TESTING_PATTERN.md v1.0.0 but was not cross-referenced during plan compilation.
- Preventive: Future implementation plans must checklist-verify: "Does this plan reference COMBINED_TESTING_PATTERN.md? Are CST checkpoints identified for concurrent subwaves? Is CWT scope defined per wave boundary?"
- Governance Reference: `governance/canon/COMBINED_TESTING_PATTERN.md` v1.0.0, BL-025

## Session 20260214 (Session Memory Protocol Oversight)

### Lesson: Cross-Agent Protocol Propagation Must Be Verified
- Context: All 5 builder agent files were created without Session Memory Protocol section, despite it being mandatory per LAS v6.2.0
- Root Cause: Builder compliance checklist did not enumerate Session Memory Protocol as a required section. Foreman contract (Category 3.2) includes it, but the requirement was not propagated to builder validation criteria.
- Pattern: When creating agent contracts for any agent class, EVERY mandatory LAS v6.2.0 section in the Foreman contract must be checked for applicability to the target agent class
- Action: Always verify cross-agent protocol propagation — if Foreman requires session memory, builders require it too (adapted for builder context)
- Preventive: Builder compliance checklists must be validated against Foreman contract Categories 0-7 to ensure no mandatory governance section is omitted

### Lesson: "Minimal" Does Not Mean "Incomplete"
- Context: Builder agent files were designed as "minimal contracts" but omitted a mandatory governance section
- Pattern: Minimal contracts reduce procedural guidance but MUST retain all constitutional/governance-mandatory sections
- Action: When reviewing builder contracts for minimality, verify: "Does this contract contain all LAS v6.2.0 mandatory sections?" Omitting mandatory sections is not minimization — it is non-compliance

### Lesson: Checklist Completeness Is a Recursive Requirement
- Context: The compliance checklist itself was incomplete (missing Session Memory Protocol), causing systematic omission across all 5 builder files
- Pattern: Checklists must be validated against canonical source before use; a gap in the checklist propagates to all artifacts validated by it
- Action: Before using any compliance checklist, verify it against the canonical LAS v6.2.0 requirements list. Checklist gaps are systemic — they affect ALL downstream artifacts

## Session 20260215 (Session 007) — POLC Boundary Violations (PR #183, #190)

### Lesson 1: POLC Boundaries Are Constitutional, Not Procedural
- **Context**: Foreman violated POLC boundaries THREE times (PR #128, #183, #190) by writing production code instead of delegating to builders
- **Pattern**: Feeling pressure to "complete the task" or "just get it done" leads to boundary violations. "Last mile" pressure (96/98 tests) can override procedural guidance when enforcement is absent.
- **Action**: ALWAYS delegate implementation work to builders; NEVER write production code, regardless of urgency, simplicity, or perceived efficiency
- **Why This Matters**: POLC boundaries are constitutional authority limits, not procedural suggestions. Violating them undermines the entire governance model, prevents institutional learning (no builder session memories), and creates single-agent risk (no separation of duties).

### Lesson 2: Warnings Without Enforcement Are Ineffective
- **Context**: Issue #189 explicitly warned against repeating PR #183 failures with comprehensive "What NOT To Do" section. Warning was completely ineffective — PR #190 repeated EXACT SAME PATTERN.
- **Pattern**: Human-readable warnings in issues or documentation can be overlooked, rationalized away, or lost in context during execution. Agents under completion pressure may deprioritize warnings.
- **Action**: Critical constraints must be converted into automated gate checks, not just documented in issues or contracts. Gates provide non-negotiable enforcement.
- **Why This Matters**: "MUST NOT" language without automated enforcement becomes advisory. Gates remove human judgment from enforcement — violations are automatically detected and rejected.

### Lesson 3: Institutional Learning Requires Mandatory Protocols with Gate Enforcement
- **Context**: No session memory was created after PR #183 rejection, leading to zero learning between PR #183 and PR #190. The exact pattern repeated with no institutional memory.
- **Pattern**: "Optional" or "should" language for learning artifacts leads to zero learning capture under time pressure. "MUST" language without enforcement becomes "MAY."
- **Action**: Session memory creation is MANDATORY for every session with gate enforcement before PR merge. Wake-up protocol (loading last 5 session memories) is MANDATORY before any task execution. Post-rejection learning protocol (session memory + lessons + patterns + RCA) is MANDATORY before retry.
- **Why This Matters**: Institutional memory only exists if it's captured and loaded. Optional learning protocols fail when agents are busy or focused on completion.

### Lesson 4: Wake-Up Protocol Must Load Previous Failures
- **Context**: PR #190 repeated PR #183 failures, suggesting session-005-20260215-RCA-WAVE4-FAILURE.md (which documents POLC violations in PR #178, Q9) was not loaded before execution.
- **Pattern**: Starting a session without loading recent memories leads to repeating past mistakes. Past failures inform future decisions only if they're loaded into context.
- **Action**: Wake-up protocol (REQ-AS-005) must ALWAYS be executed; must load last 5 session memories before any work begins. Agent must output confirmation showing which memories were loaded and which warnings/lessons were noted.
- **Why This Matters**: Wake-up protocol is the mechanism for institutional continuity. Without it, every session starts from zero, and failures repeat indefinitely.

---
Captured: 2026-02-15 | Incidents: PR #128, PR #183, PR #190 | Severity: CRITICAL (P0 — BLOCKING) | RCA: modules/mat/05-build-evidence/RCA_WAVE_5_POLC_VIOLATION_REPEAT.md
