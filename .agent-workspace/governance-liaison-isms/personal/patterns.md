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

## Pattern: Documentation Consistency Enforcement
- **Observed**: 2026-02-13 (Session 003)
- **Context**: Script comments, docs, and templates reference the same behavior
- **Pattern**: Inconsistent phrasing or examples cause agent/developer confusion
- **Response**: Systematic search, define canonical phrasing, update all locations, verify with grep
- **Source**: BL-027 follow-up issue, documentation normalization

## Pattern: Parser Regex Documentation Linkage
- **Observed**: 2026-02-13 (Session 003)
- **Context**: Script has parser regex in code and example in comment
- **Pattern**: Comment example diverges from actual implementation over time
- **Response**: Add explicit line reference in comment; extract exact regex; update comment and docs to match
- **Source**: Session 003 parser regex sync

---

**Last Updated**: 2026-02-13 (Session 003)
