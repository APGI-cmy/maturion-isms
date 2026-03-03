# Parking Station — Improvement Suggestions Log

**Agent**: CodexAdvisor-agent
**Repository**: APGI-cmy/maturion-isms
**Purpose**: Append-only index of improvement suggestions from agent session handovers. One line per suggestion. Canonical detail in referenced session memory file.
**Pattern**: Per-agent parking station (migrated from global on 2026-03-03 per issue [Propagation][Parking Station]).
**Aggregation**: CI reports aggregate all `.agent-workspace/*/parking-station/suggestions-log.md` files.

---

| Date | Agent | Session | Summary | Detail |
|------|-------|---------|---------|--------|
| 2026-02-21 | CodexAdvisor-agent | session-022 | Automate agent-file compliance verification as a dedicated CI/merge-gate check against non-negotiables checklist | `session-022-20260221.md` |
| 2026-02-21 | CodexAdvisor-agent | session-023 | Add S6-06 parking station append step to session-memory-template.md so all future agents inherit the suggestions-log append behaviour by default | `session-023-20260221.md` |
| 2026-02-23 | CodexAdvisor-agent | session-024 | Add Parking Station section to session-memory-template.md so agents using the template automatically produce the correct suggestions-log.md append line | `session-024-20260223.md` |
| 2026-02-23 | CodexAdvisor-agent | session-025 | Standardise builder Phase 4 session memory with explicit Suggestions for Improvement mandate in §4.2 to match foreman-v2 and CodexAdvisor pattern | `session-025-20260223.md` |
| 2026-02-24 | CodexAdvisor-agent | session-026 | Populate IAA Tier 2 stubs (iaa-core-invariants-checklist.md, iaa-trigger-table.md, iaa-category-overlays.md, session-memory-template.md) from INDEPENDENT_ASSURANCE_AGENT_CANON.md before Phase B activation | `session-026-20260224.md` |
| 2026-02-25 | CodexAdvisor-agent | session-030 | DRAFT-PHASE | Add FAIL-ONLY-ONCE A-001/A-002 as a BLOCKING gate at Phase 4 Step 4.4: before opening any PR touching .github/agents/*.md, verify IAA invoked + PREHANDOVER proof + session memory — if any missing, STOP | `session-030-20260225.md` |
| 2026-02-25 | CodexAdvisor-agent | session-030 | SESSION-END | Add S4-01 gate to agent-file-non-negotiables-checklist.md: evidence bundle completeness (IAA evidence + PREHANDOVER + session memory) is BLOCKING before PR open — prevents same-session A-001 create + A-001 violate pattern | `session-030-20260225.md` |
| 2026-02-25 | CodexAdvisor-agent | session-031 | SESSION-END | Add `wc -c` character count check as an explicit BLOCKING step in Phase 3 Step 3.8 merge gate parity script — prevents contract-not-read-first from silently bypassing the 30K limit check | `session-031-20260225.md` |
| 2026-02-25 | CodexAdvisor-agent | session-031 | SESSION-END | Add A-013 character count check to agent-file-non-negotiables-checklist.md as S1-01a: "run wc -c on target file; confirm ≤ 30,000 — BLOCKING" — makes it a QP gate not just a FAIL-ONLY-ONCE rule | `session-031-20260225.md` |
| 2026-02-25 | CodexAdvisor-agent | session-032 | SESSION-END | Three-peat process violation (PR #546, #553, #557): add mandatory IAA+bundle checklist to Copilot task prompt for agent contract work — moves enforcement from agent-internal (skipped) to task-external (enforced) | `session-032-20260225.md` |
| 2026-02-25 | CodexAdvisor-agent | session-032 | SESSION-END | Add CI pre-merge check for PREHANDOVER proof and session memory presence in branch — makes fourth process violation structurally impossible without CS2 override | `session-032-20260225.md` |
| 2026-02-25 | CodexAdvisor-agent | session-034 | SESSION-END | Fourth consecutive BOOTSTRAP DIRECTIVE violation: CI gate (session-033) is now the structural enforcement layer — validate that preflight-evidence-gate.yml passes with session-034 evidence artifacts | session-034-20260225.md |
| 2026-02-25 | CodexAdvisor-agent | session-034 | SESSION-END | Add PREHANDOVER proof presence check to CI gate alongside session memory check — closes remaining gap in structural enforcement (per session-033 suggestion) | session-034-20260225.md |
| 2026-02-25 | CodexAdvisor-agent | session-036 | SESSION-END | Sixth consecutive BOOTSTRAP DIRECTIVE violation: governance-liaison-isms-agent.md was delivered at 32,538 chars (over 30,000 limit) without char count check — Phase 3.8 merge gate parity check must be executed before every PR open, including against the file being updated by the PR | session-036-20260225.md |
| 2026-02-25 | CodexAdvisor-agent | session-036 | SESSION-END | Enforce character count check A-013 on the governance-liaison-isms-agent.md in the same CI gate as CodexAdvisor — all .github/agents/*.md files should be covered by the char count gate | session-036-20260225.md |
| 2026-03-01 | CodexAdvisor-agent | session-038 | SESSION-END | Post-ASSURANCE-TOKEN ceremony in prehandover-template.md should be cross-referenced in CodexAdvisor Phase 4 Step 4.2 to close self-application loop | session-038-20260301.md |
| 2026-03-02 | CodexAdvisor-agent | session-039 | [DRAFT-PHASE] | iaa-core-invariants-checklist.md: CORE-018 (evidence sweep), CORE-019 (token cross-check), CORE-020 (zero partial pass) added; CORE-016 PENDING clarification per session-083 suggestion | session-039-20260302.md |
| 2026-03-02 | CodexAdvisor-agent | session-039 | [DRAFT-PHASE] | iaa-category-overlays.md: OVL-AC-011/012, OVL-CG-005/006, OVL-CI-005/006, OVL-AM-004-007 added per Wave 13+ gap review | session-039-20260302.md |
| 2026-03-02 | CodexAdvisor-agent | session-039 | [SESSION-END] | FAIL-ONLY-ONCE.md A-016 numbering collision (two rules both labeled A-016) — should be renumbered; second instance should be A-018 — flag for governance review | session-039-20260302.md |
| 2026-03-02 | CodexAdvisor-agent | session-040 | [SESSION-END] | Consider adding INC-ZST-001 to IAA FAIL-ONLY-ONCE.md registry to formally record the zero-severity-tolerance breach pattern | session-040-20260302.md |
| 2026-03-03 | CodexAdvisor-agent | session-041 | DRAFT-PHASE | governance-liaison-isms Phase 3.1 Step 4 had erroneous agent-file-write permission — add cross-check to non-negotiables checklist verifying no agent contract phase body permits .github/agents writes unless agent is CodexAdvisor | session-041-20260303.md |
