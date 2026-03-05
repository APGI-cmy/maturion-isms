# IAA Category Overlays

**Agent**: independent-assurance-agent
**Version**: 3.1.0
**Status**: ACTIVE
**Last Updated**: 2026-03-05
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Orientation Mandate

> **IAA is a quality engineer and senior reviewer — not a file auditor.**
>  
> For BUILD deliverables: 90% of IAA effort goes on whether the build works, is safe, is wired correctly, meets standards, and will deliver a fully functional app first time. 10% goes on ceremony admin (existence checks only — did the agent create the required files? Yes/No. Nothing more).
>  
> For GOVERNANCE changes: 90% of IAA effort goes on whether the governance change aligns with the strategy it serves, whether obvious gaps exist against the intended design, and whether it creates contradictions. 10% goes on ceremony admin (existence checks only).
>  
> **Session numbers, file sequence IDs, version bump history, cross-reference consistency** — these are agent self-maintenance responsibilities. IAA does NOT investigate these. If a version number was not bumped, note it once and move on. Do not spend time on it.
>  
> **The FAIL-ONLY-ONCE and session memory files** are agent learning artifacts. IAA checks only: were they created? Yes/No. That is the complete check. IAA does not audit their content, completeness of notes, prior session references, or sequential numbering. Agents are responsible for maintaining their own learning artifacts.

---

## Universal Ceremony Gate (Applies to ALL Categories — Max 5 Minutes)

Before any category-specific checks, run these existence checks only. Each is binary — exists or does not exist. If it does not exist, state "Create [file]" once and move on.

| Check ID | Check Name | Pass Condition | On Fail |
|----------|-----------|---------------|---------|
| CERT-001 | PREHANDOVER proof exists | File present in PR bundle | State once: "PREHANDOVER proof not found — create it." |
| CERT-002 | Session memory exists | File present in PR bundle | State once: "Session memory not found — create it." |
| CERT-003 | FAIL-ONLY-ONCE attestation declared | Producing agent stated attestation in session memory preamble | State once: "Add fail_only_once_attested declaration to session memory." |
| CERT-004 | IAA audit token field present | `iaa_audit_token` field exists in PREHANDOVER proof | State once: "Add iaa_audit_token field to PREHANDOVER proof." |

**Critical rule**: CERT checks are existence checks only. IAA does NOT audit the content quality of session memories, the sequential correctness of session numbers, the completeness of learning notes, or the history of prior sessions referenced. If CERT-001 through CERT-004 all pass, the ceremony gate is PASSED. Proceed immediately to category-specific checks.

---

## BUILD_DELIVERABLE Overlay — PRIMARY FOCUS

Applied when PR category is `AAWP_MAT`, `MAT_DELIVERABLE`, or any T2 PR delivering executable application behaviour (schema migrations, API endpoints, frontend components, hooks, Supabase operations, integrations, workflows, services).

> **Mindset**: IAA acts as a senior engineer reviewing the delivery. The question is not "did the agent follow the ceremony?" The question is "will this build actually work, be safe, scale, and deliver the intended user outcome — the first time it is deployed?"

### BD-TIER-1 — Delivery Completeness (Blocking)

| Check ID | Check Name | What IAA Does |
|----------|-----------|---------------|
| BD-001 | Full scope delivered | Cross-reference the PR description / issue against the actual diff. Every promised deliverable must be present in the diff. Partial delivery = REJECTION-PACKAGE citing specific missing items. |
| BD-002 | No stub/TODO in production paths | Inspect every new function, hook, endpoint, migration for TODO comments, stub returns, placeholder values, or unimplemented branches in production code paths. Any found = REJECTION-PACKAGE. |
| BD-003 | One-time build compliance | Ask: "If this is merged and deployed today, will the feature work end-to-end without requiring another immediate fix?" If the answer is no due to missing wiring, unimplemented paths, or broken dependencies — REJECTION-PACKAGE. |
| BD-004 | No leftover debt from previous jobs | If the PR touches files that contain known failing tests, known linter errors, or broken wiring from previous waves visible in the diff context — Stop-and-Fix applies. The agent must fix these before handover. REJECTION-PACKAGE if present and unfixed. |

### BD-TIER-2 — Wiring & Integration Verification (Blocking)

| Check ID | Check Name | What IAA Does |
|----------|-----------|---------------|
| BD-005 | End-to-end wiring verified | For every new schema table, API endpoint, hook, or service: trace the complete path from data source to API/hook to UI consumer (or service consumer). Verify all links in the chain exist in the PR diff or in existing code. A broken chain = REJECTION-PACKAGE. |
| BD-006 | Writers and readers confirmed | Every table or data entity introduced must have: at minimum one confirmed writer (INSERT/mutation path) and one confirmed reader (SELECT/query path) wired and tested. Orphaned tables or unread data = REJECTION-PACKAGE. |
| BD-007 | Auth guards applied end-to-end | Every protected route, endpoint, or data operation must have auth verification applied. Missing auth guard on any user-facing protected path = REJECTION-PACKAGE. |
| BD-008 | FK and relational integrity | All FK relationships declared in migrations must have corresponding application-layer enforcement (cascade, restrict, or explicit handling). Dangling FKs with no application logic = REJECTION-PACKAGE. |
| BD-009 | Cross-component integration fit | Does this build fit correctly into what has already been built? Check: does this PR's interfaces match what other components expect? Does it break any existing contracts (API shape, type definitions, event names)? If yes = REJECTION-PACKAGE with specific conflict identified. |
| BD-010 | No orphaned deliverables | No new files, components, endpoints, or migrations that are not referenced or consumed by anything else in the system. Orphans indicate incomplete wiring. REJECTION-PACKAGE with list of orphans. |

### BD-TIER-3 — Test Quality & Zero Debt (Blocking)

| Check ID | Check Name | What IAA Does |
|----------|-----------|---------------|
| BD-011 | 100% test pass rate | All tests in the PR suite pass. Zero failures. A claim of "tests pass" without evidence = REJECTION-PACKAGE. |
| BD-012 | Zero test debt | No `.skip()`, `.only()`, `test.todo()`, commented-out tests, or incomplete test stubs. Every new code path has test coverage. Any test debt = REJECTION-PACKAGE. |
| BD-013 | No test dodging | Tests must assert on the actual intended behaviour. Tests that always pass regardless of implementation correctness (vacuous tests, tests that catch then re-throw, tests with no assertions) = REJECTION-PACKAGE. |
| BD-014 | No deprecation accumulation | No new usage of deprecated APIs, deprecated package versions, or patterns explicitly marked for removal. IAA checks: are there `@deprecated` usages or deprecated packages introduced by this PR? If yes = REJECTION-PACKAGE with specific items listed. |

### BD-TIER-4 — Security Review (Blocking)

| Check ID | Check Name | What IAA Does |
|----------|-----------|---------------|
| BD-015 | RLS policies complete | For any Supabase table created or modified: verify SELECT, INSERT, UPDATE, DELETE policies exist for every relevant role. A table with RLS enabled but incomplete policies = REJECTION-PACKAGE with list of missing policies. |
| BD-016 | No hardcoded secrets or credentials | Inspect diff for API keys, passwords, tokens, connection strings, or other secrets hardcoded in application code, config files, or test fixtures. Any found = immediate REJECTION-PACKAGE. |
| BD-017 | Input validation present | Every user-controlled input entering the system must have validation/sanitisation applied before processing or persistence. Missing = REJECTION-PACKAGE. |
| BD-018 | No obvious injection vectors | Inspect for SQL injection patterns (raw string interpolation into queries), XSS vectors (unescaped user content rendered as HTML), or command injection risks. Any found = REJECTION-PACKAGE. |
| BD-019 | International standards compliance | For any healthcare, financial, or compliance-sensitive module: verify applicable standards are observed (HIPAA data handling, GDPR consent patterns, WCAG accessibility for UI, ISO 27001 for data classification). If standards apply and are not observed = REJECTION-PACKAGE with specific standard and gap identified. |

### BD-TIER-5 — Code Quality & Architecture Fitness (IAA Uses Judgement)

| Check ID | Check Name | What IAA Does |
|----------|-----------|---------------|
| BD-020 | Clean coding structure | Review for: God functions (>50 lines doing multiple things), magic numbers/strings without constants, deeply nested conditionals (>3 levels without extraction), naming that does not reflect intent. IAA flags each specific instance. If severe (multiple violations across the PR) = REJECTION-PACKAGE. If isolated = advisory with specific fix suggested. |
| BD-021 | International coding best practice | Verify: TypeScript strictness (no `any`, no unsafe `as` casts masking type errors), SOLID principles observed, DRY (no copy-paste logic blocks), proper error handling (no silent swallows, no bare `catch (e) {}`). IAA flags violations with specific line references. |
| BD-022 | Architecture alignment | Does the implementation match the architecture document for this wave/feature? If the code diverges from the architecture: (a) improvement = document and accept, (b) mistake = REJECTION-PACKAGE with correction, (c) architecture was wrong = flag for FM/CS2 architecture update. |
| BD-023 | Technology currency | Are the packages, libraries, APIs, and patterns used current? If the PR introduces a package/API with a non-deprecated, actively maintained replacement — IAA flags with recommended replacement. If critical (security vulnerability) = REJECTION-PACKAGE. If advisory = suggestion with upgrade path. |
| BD-024 | Could it be done better — right now | IAA applies engineering judgement: if a materially better approach exists that achieves the same result with less complexity, better performance, or greater maintainability — and the improvement is within scope of this PR — IAA either proposes the improvement for the agent to implement, or if trivially simple and clearly superior, implements it directly. This is IAA's senior-engineer prerogative. |

### BD-TIER-6 — Functional Fitness Assessment (FFA) Summary

After all tier checks, IAA produces a Functional Fitness Assessment statement:

```
FFA Result:
  FFA-01 Delivery Completeness: [PASS|FAIL] — <one line>
  FFA-02 Wiring Verification: [PASS|FAIL] — <one line>
  FFA-03 Integration Fit: [PASS|FAIL] — <one line>
  FFA-04 Security: [PASS|FAIL] — <one line>
  FFA-05 Code Quality: [PASS|ADVISORY|FAIL] — <one line>
  FFA-06 One-Time Build: [PASS|FAIL] — <one line>
  FFA-CARRY-FORWARD: [NONE|ISSUED] — <list any carry-forward mandates>
```

**Carry-Forward Mandate**: If any pre-existing broken state visible in the codebase is outside this PR's scope, IAA issues a Carry-Forward Mandate. The FM must address it before the next wave. Carry-forward items do NOT block this PR but are mandatory for the next handover.

---

## AGENT_CONTRACT Overlay

Applied when PR category is `AGENT_CONTRACT`.

> **Mindset**: IAA checks whether the agent contract correctly serves the governance strategy it is meant to implement. Does this contract enable the agent to do its job correctly and safely?

### Substance Checks (Primary)

| Check ID | Check Name | What IAA Does |
|----------|-----------|---------------|
| OVL-AC-001 | Strategy alignment | Does this agent contract correctly implement the governance intent as defined in LIVING_AGENT_SYSTEM.md and the relevant canon? Are there obvious gaps? Flag specific gaps with reference to the authorising canon. |
| OVL-AC-002 | No contradictions | Does this contract contradict any existing canon, constitutional rule, or other agent contract it is meant to work alongside? Flag specific contradictions with canon reference. |
| OVL-AC-003 | Authority boundaries correct | Are the agent's authority boundaries correctly and unambiguously defined? Ambiguous authority = REJECTION-PACKAGE. |
| OVL-AC-004 | Delegation safety | If this agent delegates to others: are the delegation boundaries safe? Could a builder exploit ambiguity in this contract to exceed its authority? Flag specific exploit paths. |
| OVL-AC-005 | Four-phase structure present | All four phases (Preflight, Induction, Build/Execute, Handover) are complete and substantively populated — not just section headings. Skeleton contract = REJECTION-PACKAGE. |
| OVL-AC-006 | Self-modification prohibition present | Contract explicitly prohibits self-modification. Missing = REJECTION-PACKAGE. |
| OVL-AC-007 | Ripple/cross-agent impact | Does this contract change require corresponding updates in other agent contracts or Tier 2 knowledge files? If yes: are those updates included or flagged? Missing ripple assessment = REJECTION-PACKAGE. |

### Admin Checks (Secondary — Existence Only)

| Check ID | Check Name | Pass Condition |
|----------|-----------|----------------|
| OVL-AC-ADM-001 | PREHANDOVER proof exists | PREHANDOVER proof file is present in the PR bundle. Binary existence check only — IAA does not audit content quality, sequential numbering, or completeness of notes. Pass: file present. Fail: absent → state once "Create PREHANDOVER proof" and move on. Covered by CERT-001. |
| OVL-AC-ADM-002 | Session memory exists | Session memory file is present in the PR bundle. Binary existence check only — IAA does not audit content quality, session numbering correctness, or completeness of prior-session references. Pass: file present. Fail: absent → state once "Create session memory" and move on. Covered by CERT-002. |
| OVL-AC-ADM-003 | Tier 2 stub present | `.agent-workspace/<agent-id>/knowledge/index.md` exists for the agent whose contract is being reviewed. Confirms Tier 2 knowledge infrastructure is in place per `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`. Absence means agent cannot load Tier 2 knowledge at runtime. |
| OVL-AC-ADM-004 | Character count within limit | Contract body ≤ 30,000 characters. If limit is exceeded: IAA flags bloat, identifies inline Tier 2 content (scripts, checklists, templates) as migration targets, and issues REJECTION-PACKAGE with specific items to migrate. See `IAA_AGENT_CONTRACT_AUDIT_STANDARD.md` §6.3 for migration guidance. |

---

## CANON_GOVERNANCE Overlay

Applied when PR category is `CANON_GOVERNANCE`.

> **Mindset**: IAA checks whether the governance change serves the strategic intent it is meant to implement. Is the canon correct, complete, and unambiguous relative to that strategy?

### Substance Checks (Primary)

| Check ID | Check Name | What IAA Does |
|----------|-----------|---------------|
| OVL-CG-001 | Strategy alignment | Does this canon change correctly implement or extend the strategy it serves? Is there an obvious gap between what the strategy requires and what the canon delivers? Flag specific gaps with strategy reference. |
| OVL-CG-002 | No contradictions with existing canon | Does this change contradict any constitutional rule or existing canon? Identify specific contradictions. |
| OVL-CG-003 | Enforcement gap | Is the new rule/policy actually enforceable as written? If the rule cannot be detected or enforced by an agent operating autonomously, flag it as an enforcement gap. |
| OVL-CG-004 | Ripple impact assessed | Does this canon change require corresponding updates in any agent contract, agent knowledge file, or consumer repo? If yes: are those identified and flagged? Missing = REJECTION-PACKAGE. |
| OVL-CG-005 | ISMS layer-down scope | If this is a governance change being applied to maturion-isms: were all ripple-affected agent contracts and knowledge files touched? A governance layer-down that skips any affected file = REJECTION-PACKAGE with list of missed files. |

### Admin Checks (Secondary — Existence Only)

| Check ID | Check Name | Pass Condition |
|----------|-----------|----------------|
| OVL-CG-ADM-001 | CANON_INVENTORY updated | `governance/CANON_INVENTORY.json` reflects the new file state |
| OVL-CG-ADM-002 | Version bump present | Modified canon document has an incremented version number |

---

## CI_WORKFLOW Overlay

Applied when PR category is `CI_WORKFLOW`.

> **Mindset**: IAA checks whether the workflow actually implements its stated policy correctly and will work in practice.

### Substance Checks (Primary)

| Check ID | Check Name | What IAA Does |
|----------|-----------|---------------|
| OVL-CI-001 | Workflow policy correctness | Does the workflow actually implement what it claims to implement? Does the logic match the intent? A workflow that inverts, mismaps, or silently skips its stated policy = REJECTION-PACKAGE. |
| OVL-CI-002 | Merge gate integrity | All required merge gate checks remain present and non-weakened. Any gate removed, softened, or made optional = REJECTION-PACKAGE. |
| OVL-CI-003 | Silent failure risk | Are there code paths where a failure would be swallowed silently (e.g., unguarded `continue-on-error`, missing exit code checks)? Any silent failure path = REJECTION-PACKAGE with specific line. |
| OVL-CI-004 | Environment parity | Does the workflow behave consistently across dev/staging/production? If environments produce different gate outcomes, this must be explicitly stated and justified. |
| OVL-CI-005 | CI evidence present | When any workflow file is modified: PREHANDOVER must include a CI check run URL or log snippet confirming the workflow executed successfully post-change. Claim without evidence = REJECTION-PACKAGE.

---

## KNOWLEDGE_GOVERNANCE Overlay

Applied when PR category is `KNOWLEDGE_GOVERNANCE`.

> **Mindset**: IAA checks whether the Tier 2 knowledge update correctly captures the intended learning or operational rule. Will the agent that reads this file understand what to do?

### Substance Checks (Primary)

| Check ID | Check Name | What IAA Does |
|----------|-----------|---------------|
| OVL-KG-001 | Rule clarity | Is the new rule/learning stated clearly enough that an agent can apply it without ambiguity? A vague rule is not a rule — flag for sharpening with specific suggestion. |
| OVL-KG-002 | Triggered by real incident | Is the new FAIL-ONLY-ONCE rule or learning note traceable to a real incident or confirmed pattern? Rules without incident grounding belong in canon, not in the agent's operational learning registry. |
| OVL-KG-003 | No duplication | Does the new rule duplicate an existing rule? If yes: flag the duplication and recommend consolidation. |
| OVL-KG-004 | Cross-reference consistency | If the new rule references another rule ID, check ID, or file — does that reference actually exist? Dangling references = REJECTION-PACKAGE. |

### Admin Checks (Secondary — Existence Only)

| Check ID | Check Name | Pass Condition |
|----------|-----------|----------------|
| OVL-KG-ADM-001 | PREHANDOVER ceremony complete | Covered by CERT-001 through CERT-004 |
| OVL-KG-ADM-002 | Knowledge version bumped | Modified Tier 2 file has incremented version |
| OVL-KG-ADM-003 | Index.md updated | Agent knowledge index reflects updated file versions |

---

## AGENT_INTEGRITY Overlay

Applied when PR category is `AGENT_INTEGRITY`.

| Check ID | Check Name | What IAA Does |
|----------|-----------|---------------|
| OVL-AI-001 | CS2 authorisation verified | Any change to `governance/quality/agent-integrity/` requires explicit CS2 (@APGI-cmy) written authorisation. Absent = immediate REJECTION-PACKAGE. |
| OVL-AI-002 | Change intent matches governance strategy | Does the agent-integrity change serve the constitutional quality goals? Is it coherent with the existing integrity framework? Flag any divergence.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 2.2.0 | 2026-03-02 | OVL-KG-001 through OVL-KG-005 (KNOWLEDGE_GOVERNANCE overlay added); OVL-AM-008 (end-to-end wiring verification) added to BUILD_DELIVERABLE overlay |
| 3.0.0 | 2026-03-04 | Major restructure: BUILD_DELIVERABLE overlay (BD-001 through BD-024, FFA Summary); AGENT_INTEGRITY overlay (OVL-AI-001, OVL-AI-002); Orientation Mandate section added; AGENT_CONTRACT Admin Checks (OVL-AC-ADM-001 through OVL-AC-ADM-004) added as existence-only stubs |
| 3.1.0 | 2026-03-05 | OVL-AC-ADM-001 through OVL-AC-ADM-004 descriptions completed with full pass conditions per `IAA_AGENT_CONTRACT_AUDIT_STANDARD.md` §5 Step AC-07 alignment; version history table added (governance-liaison-isms session-050 — CS2 directive issue #966) |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Living Agent System**: v6.2.0