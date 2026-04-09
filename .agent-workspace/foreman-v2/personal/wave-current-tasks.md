# Wave Current Tasks — Issue 1319

wave: ecap-001-downstream-normalization-20260409
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-ecap-001-20260409.md

**CS2 Authorization**: Issue maturion-isms#1319 opened by @APGI-cmy (CS2 = Johan Ras) and assigned to foreman-v2-agent (Copilot). CS2 comment: "CS@ permission granted for all agent file changes by codex advsior that must be invoked for this task."

**ceremony_admin_appointed**: NO
**ceremony_admin_agent**: N/A
**ceremony_admin_scope**: N/A
**ceremony_admin_return_gate**: Foreman review required before IAA invocation

---

## Active Wave: ecap-001-downstream-normalization-20260409

### Wave Description
ECAP-001 downstream normalization of all four protected agent contracts (Foreman, IAA, Ceremony Admin, CodexAdvisor),
runtime templates, specialist registry, and CI actor-authority allowlist via the FULL governed pathway.

PR #1315 (copilot/ecap-001-full-downstream-implementation) was created via ChatGPT in direct-edit mode and
is blocked by CI gates (agent-contract/actor-authority, POLC boundary validation/builder-involvement).
This wave replays the changes via the governed Foreman → CodexAdvisor → IAA pathway.

### Tasks
- [x] Phase 1 preflight complete (foreman-v2-agent v6.2.0)
- [x] IAA Pre-Brief committed: .agent-admin/assurance/iaa-prebrief-ecap-001-20260409.md
- [x] Foreman delegated to CodexAdvisor-agent for all .github/agents/ modifications
- [x] T-ECAP-001: Update .github/workflows/agent-contract-audit.yml (add johan.ras@apginc.ca to CS2_EMAILS, add 198982749+Copilot@users.noreply.github.com to CODEX_EMAILS, add CS2_NAMES array)
- [x] T-ECAP-002: Create .github/agents/execution-ceremony-admin-agent.md (new protected contract)
- [x] T-ECAP-003: Update .github/agents/CodexAdvisor-agent.md (ECAP administrator_class_coverage + ecap_role_boundary + Step 2.3a)
- [x] T-ECAP-004: Update .github/agents/foreman-v2-agent.md (boundary normalization — compress identity section)
- [x] T-ECAP-005: Update .github/agents/independent-assurance-agent.md (three_role_split, ceremony-admin checks, compress HALT/prohibitions)
- [x] T-ECAP-006: Update governance/canon/AGENT_HANDOVER_AUTOMATION.md (ceremony-admin wave-current-tasks fields documentation)
- [x] T-ECAP-007: Add .agent-workspace knowledge files (specialist-registry, Foreman playbook, IAA checklist, CodexAdvisor rollout note, wave-tasks template)
- [x] Session memory committed
- [x] PREHANDOVER proof committed
- [ ] IAA final audit and token

### IAA Pre-Brief Summary
- Trigger Categories: AGENT_CONTRACT (T-ECAP-002 through T-ECAP-005), CI_WORKFLOW (T-ECAP-001), CANON_GOVERNANCE (T-ECAP-006)
- Qualifying Tasks: T-ECAP-001 through T-ECAP-007
- Delegated builder: CodexAdvisor-agent (agent contract modifications, CS2-authorized)
- CS2 authorization: maturion-isms#1319 (Johan Ras / @APGI-cmy)

### Previous Wave (Closed)
wave: ecap-001-layer-down-implementation (Issue #1305, merged)
