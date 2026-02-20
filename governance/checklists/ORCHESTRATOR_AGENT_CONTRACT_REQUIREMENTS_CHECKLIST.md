# Orchestrator Agent Contract Requirements Checklist

**Status:** Reference checklist for orchestrator agent contract drafting  
**Purpose:** One-stop "definition of done" for a compliant orchestrator agent contract  
**Authority:** CS2 (Johan Ras)  
**Derived From:** LIVING_AGENT_SYSTEM.md v6.2.0, ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md v1.0.0

---

## Category 0 — Identity & Canonical Bindings (Component 1: Preflight)

- [ ] **Frontmatter matches baseline**: `agent.id=<orchestrator-id>`, `agent.class=orchestrator`, `agent.version=6.2.0`, `governance.protocol=LIVING_AGENT_SYSTEM`
- [ ] **Consumer mode YAML**: `scope.repositories=[APGI-cmy/maturion-isms]`, `metadata.canonical_home=APGI-cmy/maturion-foreman-governance`, `metadata.this_copy=consumer`
- [ ] **Core mandatory bindings**: Canon Inventory (`governance/CANON_INVENTORY.json`), Orchestrator Architecture (`ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md`), Delegation Protocol (`AGENT_DELEGATION_PROTOCOL.md`), Multi-Embodiment Model (`MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md`)
- [ ] **Constitutional bindings declared**: All 13 Maturion constitutional docs referenced (`Maturion/maturion-identity.md`, `maturion-true-north.md`, `oversight-system.md`, `maturion-self-learning-governance.md`, `maturion-memory-architecture.md`, `guardrails-and-safety-charter.md`, etc.)
- [ ] **Four-component contract pattern**: `metadata.contract_pattern=four_component_canonical` declared in frontmatter
- [ ] **Degraded mode semantics**: `degraded_on_placeholder_hashes: true` in frontmatter

---

## Category 1 — Authority, Scope & Boundaries (Component 1: Preflight)

- [ ] **Orchestrator authority recorded**: Coordinate specialists, synthesize multi-specialist responses, maintain cross-app session continuity, enforce constitutional guardrails (`ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` Section 2.1)
- [ ] **Explicit prohibitions**: Orchestrator does NOT implement domain logic directly (delegates to specialists), bypass validation gates, modify own contract, approve PRs, modify governance/ directory
- [ ] **Authority chain captured**: CS2 → Orchestrator → Specialists; orchestrator coordinates specialists, cannot bypass watchdogs
- [ ] **Authority model**: RAEC (Review-Advise-Escalate-Coordinate)
- [ ] **Scope boundaries**: Cross-app orchestration (MAT, PIT, XDETECT, Builder, Command), specialist coordination, constitutional alignment enforcement

---

## Category 2 — Specialist Registry (Component 1: Preflight)

- [ ] **Specialist registry defined**: Location `.agent-workspace/<orchestrator-id>/knowledge/specialist-registry.md`
- [ ] **Registry format**: For each specialist: id, domain, expertise, apps, routing keywords, status, version, contract path
- [ ] **Registry management protocol**: Add specialist, update specialist, decommission specialist, archive specialist
- [ ] **Initial registry state**: Empty (ready for Phase 3 specialist registration) OR populated with Phase 3 MVP specialists (risk-platform-agent, mat-specialist, criteria-generator-agent)

---

## Category 3 — Delegation Protocol (Component 3: During Process - Orchestration)

- [ ] **Delegation request format implemented**: JSON schema (from, to, task, transparency, context, input, requirements) per `AGENT_DELEGATION_PROTOCOL.md` Section 2
- [ ] **Delegation response format implemented**: JSON schema (status, output, metadata, validation) per `AGENT_DELEGATION_PROTOCOL.md` Section 3
- [ ] **Transparency decision criteria defined**: Transparent vs. invisible delegation rules documented (`AGENT_DELEGATION_PROTOCOL.md` Section 4)
- [ ] **Pre-delegation validation gates**: Guardian (policy/content), Arbiter (knowledge base integrity)
- [ ] **Post-delegation validation gates**: Guardian (output scan), Sentinel (behavioral consistency), Arbiter (memory boundaries)
- [ ] **Error handling protocol**: Specialist unavailable, out-of-scope, watchdog violation handling (`AGENT_DELEGATION_PROTOCOL.md` Section 7)

---

## Category 4 — Validation Gates (Component 3: During Process - Orchestration)

- [ ] **Guardian enforcement**: Cross-tenant leakage prevention, forbidden content blocking, policy compliance validation (`Maturion/oversight-system.md` Section 3)
- [ ] **Sentinel enforcement**: Behavioral drift detection, anomaly monitoring, performance consistency (`Maturion/oversight-system.md` Section 4)
- [ ] **Arbiter enforcement**: Memory boundary protection, knowledge contamination prevention, unauthorized learning blocking (`Maturion/oversight-system.md` Section 5)
- [ ] **Watchdog violation handling**: Block output, log IWMS incident, escalate to CS2, return safe alternative response

---

## Category 5 — Multi-Specialist Chaining (Component 3: During Process - Orchestration)

- [ ] **Chain definition logic**: Complex task requiring multiple specialists in sequence
- [ ] **Chain execution protocol**: Plan chain → Execute steps → Validate at each step → Synthesize final response (`AGENT_DELEGATION_PROTOCOL.md` Section 6.2)
- [ ] **Chain failure handling**: Stop chain, capture partial results, return to user with context, offer retry
- [ ] **Chain validation gates**: Pre-delegation and post-delegation validation at each step
- [ ] **Chain logging**: Log complete chain in session memory (delegation sequence, timings, validations)

---

## Category 6 — Routing Intelligence (Component 3: During Process - Orchestration)

- [ ] **Query analysis**: Intent detection, domain classification, specialist selection
- [ ] **Routing rules defined**: Location `.agent-workspace/<orchestrator-id>/knowledge/routing-rules.md`
- [ ] **Routing logic documented**: Keyword matching, app context, user role, multi-specialist chaining triggers
- [ ] **Fallback logic**: No specialist available → Direct response or escalate
- [ ] **App-context routing**: App → specialist mapping (MAT → mat-specialist, PIT → risk-platform-agent, etc.) per `MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md` Section 6

---

## Category 7 — Session Memory (Component 4: Closure - Quality Assurance)

- [ ] **Session memory protocol**: Template reference for creating session memory files in `.agent-workspace/<orchestrator-id>/memory/session-NNN-YYYYMMDD.md`
- [ ] **Memory rotation**: When >5 sessions exist, move oldest to `.archive/` subdirectory
- [ ] **Delegation log included**: Timestamp, specialist, task, transparency mode, status, execution time, validation results (`AGENT_DELEGATION_PROTOCOL.md` Section 8.1)
- [ ] **Cross-app insights captured**: Learnings from one app applied to another app context
- [ ] **Unified session across apps**: Session ID persists across app switches (MAT → PIT → XDETECT)

---

## Category 8 — Cross-App Context Awareness (Component 2: Induction - Session Initialization)

- [ ] **App context model defined**: Supported apps (MAT, PIT, XDETECT, Maturity Roadmap, Builder, Command) per `MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md` Section 2
- [ ] **App context detection**: Explicit parameter, route-based, session history, default fallback
- [ ] **Embodiment switching**: Risk-Maturion, Builder-Maturion, Command-Maturion based on app context (`MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md` Section 3)
- [ ] **App-specific knowledge loading**: Dynamic loading based on app context (e.g., MAT → mat-workflows.md)
- [ ] **Cross-app session continuity**: Unified session memory, cross-app learning, context awareness across apps

---

## Category 9 — Constitutional Alignment (Component 1: Preflight)

- [ ] **Identity consistency verification**: ONE identity across all apps (no separate mat-maturion, pit-maturion) per `Maturion/maturion-identity.md` Section 3
- [ ] **Unified memory framework**: ONE memory framework across all apps per `Maturion/maturion-identity.md` Section 5
- [ ] **Ethical framework enforcement**: ONE ethical framework (same guardrails in all apps) per `Maturion/maturion-identity.md` Section 6
- [ ] **Risk-oriented worldview**: ISMS ontology (threats, vulnerabilities, controls) per `Maturion/maturion-true-north.md` Section 3.5
- [ ] **Situational awareness check**: App, user, module, operational state known per `Maturion/maturion-true-north.md` Section 3.4
- [ ] **Constitutional bindings documented**: Location `.agent-workspace/<orchestrator-id>/knowledge/constitutional-bindings.md` with all 13 Maturion docs and their behavioral constraints

---

## Category 10 — File Size & Format Compliance

- [ ] **Character limit**: Contract file <30,000 characters (GitHub UI selectability requirement)
- [ ] **Compact formatting**: Use references to canonical documentation instead of duplication
- [ ] **4 mandatory components**: Component 1 (Preflight & Governance Alignment), Component 2 (Induction - Session Initialization), Component 3 (During Process - Orchestration), Component 4 (Closure - Quality Assurance)
- [ ] **Canonical references**: Enumerated list of all canonical governance files, not full descriptions

---

## Category 11 — Governance Sync & Merge Gates (Component 1: Preflight)

- [ ] **Ripple mindset**: Assume non-local impact, surface ripples explicitly
- [ ] **Consumer-mode ripple**: Receive-only ripple events from canonical source
- [ ] **Merge Gate Interface**: Required checks listed: `Merge Gate Interface / merge-gate/verdict`, `Merge Gate Interface / governance/alignment`, `Merge Gate Interface / stop-and-fix/enforcement`
- [ ] **Stop-and-Fix enforcement**: Constitutional violations → halt and escalate

---

## Category 12 — Escalation & Prohibitions (Component 1: Preflight)

- [ ] **Escalation authority**: CS2 (Johan Ras)
- [ ] **Escalation rules**: Constitutional violation → halt_and_escalate, Specialist unavailable → document_and_escalate, Watchdog violation → halt_and_escalate
- [ ] **LOCKED: Self-modification prohibition**: Orchestrator may NEVER modify own contract file; include LOCKED section with Lock ID, Authority (CS2), Review frequency
- [ ] **Consumer-specific prohibitions**: No modification of `governance/` directory (receive-only), no bypassing governance alignment gate, no creating governance canon, no dispatching ripple events

---

## Category 13 — Wake-Up & Knowledge Base (Component 2: Induction)

- [ ] **Wake-up protocol**: Reference to `.github/scripts/wake-up-protocol.sh <orchestrator-id>`
- [ ] **Load order**: Canon Inventory, Orchestrator Architecture, Delegation Protocol, Multi-Embodiment Model, Constitutional Bindings, Specialist Registry, Routing Rules
- [ ] **Knowledge base location**: `.agent-workspace/<orchestrator-id>/knowledge/`
- [ ] **Knowledge base files**: `specialist-registry.md`, `routing-rules.md`, `constitutional-bindings.md`, app-specific knowledge (e.g., `mat-workflows.md`)

---

## Category 14 — Evidence & Quality Metrics (Component 4: Closure)

- [ ] **PREHANDOVER evidence**: Issue PREHANDOVER_PROOF before task completion
- [ ] **Quality metrics logged**: Routing accuracy (>90%), Validation pass rate (>98%), Multi-specialist chain success rate (>85%) per `ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` Section 12
- [ ] **Session memory capture**: Modified files list, actions taken, decisions made, delegation log, cross-app insights
- [ ] **Outcome status**: COMPLETE / PARTIAL / ESCALATED

---

## Usage

**Treat every unchecked item as a blocker for orchestrator contract readiness.**

**Cite the listed source in the contract section that satisfies the item.**

**If a required source is unavailable or hash-mismatched, halt and escalate per Category 12.**

---

**Alignment Notes:**
- Derived from LIVING_AGENT_SYSTEM.md v6.2.0
- Adapted for Orchestrator agent class (cross-app coordination, specialist management)
- All canonical references updated to match maturion-isms governance structure
- Maintains comprehensive category-based organization (Categories 0-14)
- Every checklist item includes explicit canonical source citations
- Consumer repository context: Governance canon flows from APGI-cmy/maturion-foreman-governance
- Four-Component architecture integration (Preflight → Induction → During Process → Closure)
- Enforces Orchestrator-specific constraints (specialist coordination, constitutional alignment, cross-app continuity)

**Version:** 1.0.0  
**Date:** 2026-02-20  
**Authority:** LIVING_AGENT_SYSTEM.md v6.2.0, ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md v1.0.0
