# AIMC dependencies and graceful degradation

Version: 1.1.0. Effective date: 2026-11-26.

| Dependency | Owner | Current state | Required commissioning evidence |
| --- | --- | --- | --- |
| Governance specialist registration | Governance registry owner | Proposed `course-creator-agent`; issue #2075 | Accepted governance entry and current contract binding |
| AIMC persona and Maturion route | AIMC runtime registry owner | Proposed `course-creator-advisor` / `course-creator` / `document-generation`; no active route verified | Accepted runtime persona/capability mapping plus authenticated Maturion route receipt |
| Tenant, user, role and entitlement context | Platform identity/AIMC | Not connected for this agent | Authorised context envelope and denial tests |
| Provider/model access and budget | AIMC | No agent-specific provider configured | Approved model policy and measured budget enforcement |
| Source/knowledge retrieval | AIMC | Mapped only | Permitted knowledge-plane and source-priority proof |
| Course execution adapter | Course Creator controller owner | Existing prototype; no governed specialist adapter | Idempotent bounded dispatch and exact return receipt |
| Independent reviewer and root-cause route | Maturion/controller | Existing prototype capability; not commissioned for this agent | Role separation, raw evidence and failure-path tests |
| Memory capture/promotion | AIMC memory owner | Local app records exist; central promotion unavailable | Tenant-isolated candidates and governed promotion tests |

When a required dependency is absent, return UNAVAILABLE/DEGRADED with the missing capability and responsible owner. Existing sources, progress and reports may be displayed read-only. Never silently fall back to another provider, use an unregistered specialist, fabricate research, claim AI work ran, or present the bundle as ACTIVE.

The source governance-registry snapshot has zero agents. It is not the AIMC runtime registry. Do not invent a live Maturion entry or treat a persona file as an authenticated principal. The new generic Course Creator persona is distinct from the unchanged legacy ISMS-specific `course-crafter-advisor`. Registration and routing must be accepted together through the authorised owners, and must not modify the upstream Maturion contract as an incidental course change.

The commissioned gate is `scripts/runtime_preflight.py`; authoring validation remains `scripts/validate_bundle.py`. Both may report facts, but producer validation cannot grant runtime authority, attest independent IAA, or turn an inactive route into an active one. Missing executable enforcement remains an explicit dependency until actual commissioning evidence closes it.
