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
