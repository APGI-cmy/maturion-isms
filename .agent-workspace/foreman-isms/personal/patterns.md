## Pattern: Gold-Standard Agent Contract Drafting (Checklist-Driven)
- Observed: 2026-02-11 (Session 001)
- Context: Creating comprehensive agent contract that satisfies all requirements from gold-standard checklist
- Response:
  1. Review requirements checklist first (identify all categories and items)
  2. Organize contract structure to mirror checklist categories exactly
  3. For each category, include:
     - Category title matching checklist
     - Authority citations (canonical sources)
     - Subsections addressing each checklist item
     - Templates where applicable (session memory, escalation)
     - Evidence of satisfaction (section references, examples)
  4. Validate contract against checklist item-by-item
  5. Document traceability: "Checklist Category N Item M → Contract Section N.M"

## Pattern: RCA-Based Continuous Improvement Documentation
- Observed: 2026-02-11 (Session 001)
- Context: Incorporating lessons from prior implementations (office-app PRs #730, #737) into new contract
- Response: Include RCA section in initial session memory with structure:
  - Prior Mistake: [What happened in previous implementation]
  - Why Problem: [Why this was a problem]
  - How Avoided: [How this contract avoids the mistake]
  - Evidence: [Where in contract the avoidance is documented]
  - Result: 10+ mistake categories documented with specific line number references

## Pattern: Template Embedding for Process Consistency
- Observed: 2026-02-11 (Session 001)
- Context: Agents need explicit format guidance for session memory, escalations, evidence bundles
- Response: Embed complete templates in contract sections:
  - Session Memory Template → Category 3.2 (lines 315-372)
  - Escalation Template → Category 5.3 (lines 535-560)
  - Include all required fields with placeholders
  - Provide examples and usage notes
  - Result: Self-contained contract requiring no external template lookups

## Pattern: Explicit Canonical Citation Format
- Observed: 2026-02-11 (Session 001)
- Context: Requirements must be traceable to authoritative governance sources
- Response: Format: `**Authority**: governance/canon/FILE.md Section X.Y`
  - Every category section includes Authority line
  - Multiple sources cited when requirement spans multiple canons
  - Section numbers included where applicable
  - Example: `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md Section 3.2`
  - Result: Enforceable requirements with precise traceability

## Pattern: Consumer Repository Boundary Clarity
- Observed: 2026-02-11 (Session 001)
- Context: Consumer repositories (maturion-isms) receive governance from canonical source (maturion-foreman-governance); must not modify canon
- Response: Explicit prohibitions in Category 7:
  - "FM MUST NOT modify `.github/agents/foreman-isms-agent.md` except via CS2 approval"
  - "Contract changes require: (1) CS2 approval, (2) Governance alignment verification, (3) Ripple impact analysis"
  - Clear distinction: consumer repository = receive and align; canonical repository = author and dispatch
  - Result: Prevents boundary violations and unauthorized canon modifications

## Pattern: Evidence Bundle Specification (PREHANDOVER + CI Confirmatory)
- Observed: 2026-02-11 (Session 001)
- Context: Agent contracts must specify what constitutes acceptable evidence for handovers
- Response: Category 3.3 defines evidence bundle components:
  - PREHANDOVER proof (Execution Bootstrap Protocol)
  - Exit codes captured and verified
  - Test results included
  - CI confirmatory (not diagnostic) verification
  - Result: Consistent handover quality; no ambiguity about evidence requirements

## Pattern: Escalation Taxonomy for Clarity
- Observed: 2026-02-11 (Session 001)
- Context: Generic "escalate when blocked" leads to inconsistent escalations; CS2 needs severity context
- Response: Define escalation types in template:
  - BLOCKER: Critical execution blocker requiring immediate CS2 intervention
  - GOVERNANCE_GAP: Missing or ambiguous governance rule preventing progress
  - AUTHORITY_BOUNDARY: Decision exceeds agent authority level
  - COGNITIVE_LIMIT: Problem complexity exceeds agent cognitive capability
  - Result: CS2 can prioritize responses; agent knows which type to use

## Pattern: YAML Frontmatter Completeness Validation
- Observed: 2026-02-11 (Session 001)
- Context: Missing YAML fields cause governance alignment gate failures
- Response: Checklist Category 0 enumerates required fields:
  - `agent.id` — Agent identifier
  - `agent.class` — Agent class (foreman, builder, liaison)
  - `governance.protocol` — Protocol binding (LIVING_AGENT_SYSTEM)
  - `governance.version` — Protocol version (6.2.0)
  - Model tier specification (model, model_tier, model_tier_level, model_class, model_fallback, temperature)
  - Authority structure (level, scope, platform_actions, required_cognitive_tier, execution_mode)
  - Result: Schema-compliant frontmatter preventing validation failures

## Pattern: Category-Based Organization for Comprehensive Coverage
- Observed: 2026-02-11 (Session 001)
- Context: Unstructured contracts risk gaps; category framework ensures systematic coverage
- Response: 8-category structure (per office-app PR #730 gold standard):
  - Category 0: Identity & Canonical Bindings
  - Category 1: Authority, Scope & Boundaries
  - Category 2: Governance Loading & Self-Alignment
  - Category 3: Memory, Evidence & Audit
  - Category 4: Ripple, Merge Gates & Alignment
  - Category 5: Escalation & Stop Conditions
  - Category 6: Role-Specific Deliverables & Outputs
  - Category 7: Prohibitions & Guardrails
  - Result: No missing aspects; every dimension of agent behavior covered

## Pattern: Repository-Specific Agent Naming Convention
- Observed: 2026-02-11 (Session 001)
- Context: Multi-repo environments (maturion-isms, maturion-foreman-office-app, etc.) need clear agent identity
- Response: Use `<agent-class>-<repo>-agent.md` naming pattern:
  - `foreman-isms-agent.md` for maturion-isms repository
  - `ForemanApp-agent.md` for office-app repository (historical)
  - Future: `foreman-office-app-agent.md` for consistency
  - Result: Immediate clarity about which agent serves which repository

## Pattern: Cross-Repo Learning Documentation
- Observed: 2026-02-11 (Session 001)
- Context: Gold standards established in one repository (office-app) apply to others (maturion-isms)
- Response: Session memory includes "Cross-Repo Learning Captured" section:
  - From office-app PR #730: [list of lessons]
  - From office-app PR #737: [list of lessons]
  - Organization-Specific: [list of adaptations]
  - Result: Clear provenance; future sessions understand derivation and continuous improvement lineage

## Pattern: Governance Bindings Enumeration (Mandatory + Optional)
- Observed: 2026-02-11 (Session 001)
- Context: Agents must bind to canonical governance, but which documents?
- Response: Section 0.2 enumerates all mandatory bindings with:
  - Binding ID (unique identifier)
  - Path (canonical file path)
  - Role (binding purpose)
  - Summary (one-line description)
  - Status (mandatory/optional)
  - Example: 11 bindings from Tier-0 manifest to agent QA boundaries
  - Result: No ambiguity about which governance documents agent must load; prevents selective loading
