# Agent File Creation Policy

## Minimal Content Principle
Agent files are **reference-based**, not **content-duplicating**.

## Size Limits
- **Target**: 150-250 lines
- **Maximum**: 300 lines (with justification)
- **Enforcement**: CI gate checks

## Required Sections
1. Mission (2-3 sentences)
2. Governance Bindings (YAML references)
3. Scope (allowed/restricted paths)
4. Capabilities & Constraints
5. Escalation Protocol
6. Self-Governance Check (if applicable)

## Prohibited Content
❌ Constitutional principles (→ reference BUILD_PHILOSOPHY.md)
❌ Detailed protocols (→ reference canon/*.md)
❌ Version history (→ use git)
❌ Authority diagrams (→ reference AGENT_AUTHORITY_MODEL.md)
❌ Governance philosophy recitations

## Templates & Guides
- Schema: `.agent.schema.md`
- Template: `AGENT_CONTRACT.template.md`
- Migration Guide: `AGENT_CONTRACT_MIGRATION_GUIDE.md`
- Onboarding: `AGENT_ONBOARDING_QUICKSTART.md`
