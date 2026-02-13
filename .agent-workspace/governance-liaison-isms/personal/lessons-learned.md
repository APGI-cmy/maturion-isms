# Lessons Learned - governance-liaison-isms

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

## Session 003 - 20260213: Documentation Normalization

### Lesson: Authority Boundaries for Documentation
- **Context**: Script comments are documentation, not code logic
- **Pattern**: Initially uncertain about authority for script comment changes
- **Action**: Recognized comments as documentation; proceeded with normalization within governance scope

### Lesson: Parser Regex Consistency
- **Context**: Documentation code examples must match implementation
- **Pattern**: Script comment showed simpler regex than actual parser
- **Action**: Systematic verification of all three locations (comment, code, docs)

### Lesson: Systematic Reference Search
- **Context**: Multiple files referenced base branch (origin/main vs main)
- **Pattern**: Use `grep -r "pattern" --include="*.md" .` to find all instances
- **Action**: Systematic search prevents missing instances during normalization

---

**Last Updated**: 2026-02-13 (Session 003)
