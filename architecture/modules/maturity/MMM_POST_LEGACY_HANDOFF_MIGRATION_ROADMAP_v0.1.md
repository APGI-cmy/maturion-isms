# MMM Post-Legacy-Handoff Architecture Stabilization & Governance Migration Roadmap (v0.1)

**Issue:** #1658  
**Status:** Transitional architecture roadmap (no full migration implementation in this issue)

## 1) Transitional baseline (current)

- Current user journey: `Wizard -> Review Framework -> Hard Redirect -> Legacy Workspace`
- Current handoff implementation in `apps/mmm/src/pages/FrameworkReviewPage.tsx`:
  - `window.location.assign(`${normalizedBaseUrl}${legacyWorkspacePath}${frameworkQuery}`)`
- Transitional target route: `/assessment/framework?framework_id=<id>`

## 2) Migration workstreams (future)

1. **Unified SPA Routing Migration**
   - Replace hard redirect with router navigation inside shared app shell.
   - Preserve React context and cross-module state continuity.
2. **Governance Orchestration Migration**
   - Add L1/L2/L3 approvals, governance locks, escalation and controlled unlock flows.
3. **Persistent Situational Awareness Context**
   - Persist organisation, framework, domain, MPS, maturity/evidence/governance state.
4. **Navigation Intelligence Refactor**
   - Add persistent breadcrumbs, hierarchy map, workspace indicators, governance-layer awareness.
5. **Legacy Workspace Conceptual Migration**
   - Evolve route concepts from `/assessment/framework` toward governance-oriented workspace naming.
6. **Dashboard Synchronisation Architecture**
   - Enable live maturity/governance/evidence synchronization and hierarchy rollups.
7. **Publication State Transition Engine**
   - Make publish governance-controlled and state-transition aware.
8. **Evidence Intelligence Integration**
   - Wire evidence into scoring, recommendations, remediation and governance escalation.
9. **PIT Operational Integration**
   - Close remediation loop: maturity gaps -> PIT actions -> evidence validation -> maturity evolution.
10. **Technical Debt Prevention Anchors**
   - Keep explicit TODO anchors in transitional bridge code until migration completion.

## 3) Immediate next step (before major refactor)

Run discovery testing against the reconnected legacy workflow, focusing on:

- workflow continuity and hierarchy clarity
- MPS navigation and criteria usability
- operational orientation and cognitive load
- AI contextual usefulness
- dashboard logic and governance-flow readiness

## 4) Explicitly out of scope for this issue

- full governance orchestration implementation
- complete SPA migration implementation
- dashboard rewrite
- route redesign completion
- evidence intelligence engine implementation
- full contextual AI memory implementation

This issue formalizes architectural intent and migration direction only.
