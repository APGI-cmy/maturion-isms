# Observed Patterns - governance-liaison-isms

## Pattern: Gold-Standard Checklist Compliance
- **Observed**: 2026-02-12 (Session 001)
- **Context**: When creating comprehensive agent contracts from requirements checklists
- **Pattern**: Systematic category-by-category validation (0-10) ensures no requirements missed
- **Response**: Add "Checklist Reference" header to each category; verify items before proceeding
- **Source**: office-app PRs #730, #733 gold standard structure

## Pattern: LOCKED Section Immutability
- **Observed**: 2026-02-12 (Session 001)
- **Context**: When protocols must remain stable across sessions (wake-up, self-alignment, PR failure analysis)
- **Pattern**: LOCKED sections with metadata (Lock ID, Reason, Authority, Date, Review Frequency) prevent drift
- **Response**: Lock critical protocols; include full metadata block; require CS2 approval for changes
- **Source**: AGENT_CONTRACT_PROTECTION_PROTOCOL.md, office-app PR #730

## Pattern: Wake-Up Protocol Detects, Self-Alignment Corrects
- **Observed**: 2026-02-12 (Session 001)
- **Context**: When implementing drift detection and correction
- **Pattern**: Conflation of wake-up and self-alignment causes errors
- **Response**: Separate protocols - wake-up runs PHASE 3 (drift detection), self-alignment runs only when drift detected
- **Source**: office-app PR #737 RCA

## Pattern: PR Failure → RCA → Learning → Prevention
- **Observed**: 2026-02-12 (Session 001)
- **Context**: When PR fails and retry is needed
- **Pattern**: Retry without RCA violates STOP_AND_FIX_DOCTRINE.md and repeats failures
- **Response**: Execute PR Failure Analysis Protocol (5 steps); document in session memory; escalate on 3rd failure
- **Source**: office-app PR #737, STOP_AND_FIX_DOCTRINE.md

## Pattern: Session Memory Rotation
- **Observed**: 2026-02-12 (Session 001)
- **Context**: When implementing LIVING_AGENT_SYSTEM.md v6.2.0 session memory
- **Pattern**: Unbounded memory growth without rotation rules
- **Response**: When >5 sessions exist, move oldest to memory/.archive/; keep 5 most recent in memory/
- **Source**: LIVING_AGENT_SYSTEM.md v6.2.0, office-app improvement

## Pattern: Authority Boundary Explicit Negatives
- **Observed**: 2026-02-12 (Session 001)
- **Context**: When defining liaison agent role to prevent scope creep
- **Pattern**: Without explicit negatives (NOT builder, NOT FM, NOT governance admin), liaisons attempt code/QA tasks
- **Response**: Include Category 1 (Explicit Negatives), Category 6 (Prohibitions), Category 10 (Role Boundaries) with ❌ items
- **Source**: office-app PR #733, GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md Section 3.3

## Pattern: Cross-Repo Learning Transfer
- **Observed**: 2026-02-12 (Session 001)
- **Context**: When implementing improvements derived from other repositories
- **Pattern**: office-app PRs #730, #733, #737 lessons directly applicable to maturion-isms
- **Response**: Document cross-repo learning in session memory RCA section; maintain explicit traceability
- **Source**: office-app PRs #730, #733, #737

## Pattern: Consumer Repository Cannot Author Canon
- **Observed**: 2026-02-12 (Session 001)
- **Context**: When implementing layer-down protocol in consumer repository (maturion-isms)
- **Pattern**: Consumer repositories receive governance; canonical repository (maturion-foreman-governance) authors
- **Response**: Category 10 prohibits canon authoring; all governance flows via layer-down; liaison role is receive-only
- **Source**: CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md Section 1, GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md Section 3.3.3

## Pattern: Comprehensive YAML Frontmatter for Machine Parsing
- **Observed**: 2026-02-12 (Session 001)
- **Context**: When creating agent contracts with metadata validation
- **Pattern**: Minimal YAML causes gate failures; comprehensive YAML (40+ fields) satisfies checklist
- **Response**: Include agent.id, agent.class, governance.bindings array, scope, appointment, metadata with version history
- **Source**: Checklist Category 0, AGENT_FILE_BINDING_REQUIREMENTS.md

## Pattern: Appendix A Reference vs Inline Enumeration
- **Observed**: 2026-02-12 (Session 001)
- **Context**: When incorporating 102 PUBLIC_API canons into contract
- **Pattern**: Inline enumeration creates excessive length; reference with categorization balances completeness and readability
- **Response**: Create Appendix A reference section with 12 functional categories; point to CANON_INVENTORY.json
- **Source**: Checklist Appendix A, office-app PR #733

## Pattern: SHA256 Verification for Layer-Down Integrity
- **Observed**: 2026-02-12 (Session 001)
- **Context**: When layering down canonical governance files
- **Pattern**: File integrity must be verified to prevent corruption or tampering
- **Response**: Category 8 requires SHA256 verification against CANON_INVENTORY.json; record checksums in alignment log
- **Source**: CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md Section 6.3

## Pattern: Ripple Inbox → Processing → Archive
- **Observed**: 2026-02-12 (Session 001)
- **Context**: When receiving and processing governance ripple events
- **Pattern**: Ripple events flow through inbox (receive) → processing (layer-down) → archive (completed)
- **Response**: Category 9 manages ripple inbox at .agent-admin/governance/ripple-inbox/; archive after processing
- **Source**: CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md Section 5

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-12  
**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0

## Pattern: Canonical Module Skeleton Rollout
- **Observed**: 2026-02-13 (Session 003)
- **Context**: Multi-module governance/artifact normalization
- **Pattern**: Deterministic slug mapping + fixed stage directories enables repeatable structure alignment across heterogeneous legacy modules
- **Response**: Standardize on `modules/<slug>/{00..05}` + `module.manifest.json` + legacy pointers
- **Source**: ISMS module canonicalization issue

## Pattern: Missing Protocol Script Escalation
- **Observed**: 2026-02-13 (Session 003)
- **Context**: Mandatory execution hooks absent in repo
- **Pattern**: Contract-required operational scripts can drift from consumer repository state
- **Response**: Record blocker in escalation inbox and continue with manual evidence capture where possible
- **Source**: governance-liaison-isms contract REQ-AS-005 / REQ-EO-005

## Pattern: Module Lifecycle Gap-Filling (TRS Stage Insertion)
- **Observed**: 2026-02-13 (Session 005)
- **Context**: When module lifecycle has gap between FRS (functional) and Architecture (structural)
- **Pattern**: Missing intermediate stage (technical requirements) causes downstream implementation failures
- **Response**: Insert TRS stage (01.5-trs/) to capture technical constraints, performance requirements, integration specs
- **Source**: Issue "Governance Upgrade: Insert TRS Step"; prevents implementation/integration failures

## Pattern: Bash Heredoc for Template Generation
- **Observed**: 2026-02-13 (Session 005)
- **Context**: When creating identical structure files across multiple modules (8 BUILD_PROGRESS_TRACKER.md)
- **Pattern**: Manual creation error-prone and time-consuming
- **Response**: Use bash loop with heredoc and variable substitution to generate consistent files efficiently
- **Source**: DRY principle; pragmatic automation

## Pattern: HYBRID Ripple Activation (Manual → Automated)
- **Observed**: 2026-02-13 (Session 005)
- **Context**: When automated ripple infrastructure (ripple-listener workflow) doesn't exist yet
- **Pattern**: Blocking governance upgrade on infrastructure creates delays
- **Response**: HYBRID approach - manual ripple for this cycle, implement automated ripple for future governance changes
- **Source**: CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md; pragmatic delivery vs long-term infrastructure

## Pattern: Ripple Activation Plan Documents
- **Observed**: 2026-02-13 (Session 005)
- **Context**: When coordinating governance changes across multiple repositories
- **Pattern**: Without comprehensive plan, ripple coordination is chaotic and error-prone
- **Response**: Create detailed ripple plan document (e.g., RIPPLE_ACTIVATION_PLAN_TRS_UPGRADE.md) including: scope, impact, approaches, escalations, evidence
- **Source**: GOVERNANCE_RIPPLE_MODEL.md, CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md

## Pattern: BUILD_PROGRESS_TRACKER for Lifecycle Visibility
- **Observed**: 2026-02-13 (Session 005)
- **Context**: When modules progress through multi-stage lifecycle without visible status tracking
- **Pattern**: Module status opaque without explicit tracker; agents and humans don't know what's done/pending
- **Response**: Create BUILD_PROGRESS_TRACKER.md per module with stage status, artifacts checklist, completion dates, blockers
- **Source**: MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md determinism principle

## Pattern: Unicode Characters → Use sed Instead of edit
- **Observed**: 2026-02-13 (Session 005)
- **Context**: When updating text with special characters (arrows: →) in markdown files
- **Pattern**: edit tool old_str matching fails with Unicode characters; sed handles them reliably
- **Response**: For updates involving special characters, use sed with pattern substitution; verify with cat -A before editing
- **Source**: Tool limitations discovered in practice

## Pattern: Documentation-Only Governance Changes Have Ripple Impact
- **Observed**: 2026-02-13 (Session 005)
- **Context**: When updating strategy/policy files without code changes
- **Pattern**: Governance updates affect multiple repos even without code (cross-repo alignment required)
- **Response**: Treat documentation governance updates with same rigor as code (code review, ripple planning, evidence)
- **Source**: GOVERNANCE_RIPPLE_MODEL.md - downward ripple requirement

## Pattern: Code Review for Derivation Chain Clarity
- **Observed**: 2026-02-13 (Session 005)
- **Context**: When documenting multi-step derivation (App Description → FRS → TRS → Architecture)
- **Pattern**: Slash notation (App Description/FRS) can imply "either/or" when intent is sequential
- **Response**: Make derivation chain explicit and sequential; avoid ambiguous notation in governance docs
- **Source**: Code review feedback; governance clarity principle

---

**Last Updated**: 2026-02-13  
**Total Patterns**: 16  
**Agent**: governance-liaison-isms
