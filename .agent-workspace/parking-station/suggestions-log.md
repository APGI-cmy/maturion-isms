# Parking Station — RETIRED Global Log

> ⚠️ **MIGRATION NOTICE — 2026-03-03**
>
> This global shared suggestions log has been **retired** as of 2026-03-03 per governance issue
> [Propagation][Parking Station] (CS2 authority: Johan Ras).
>
> **All agents now write exclusively to their own per-agent parking station file:**
> `.agent-workspace/<agent-workspace-name>/parking-station/suggestions-log.md` (where `<agent-workspace-name>` is the agent's workspace directory name, which may differ from the agent ID)
>
> **Historical entries have been migrated to per-agent files:**
> - `.agent-workspace/CodexAdvisor-agent/parking-station/suggestions-log.md` (21 entries)
> - `.agent-workspace/api-builder/parking-station/suggestions-log.md` (3 entries)
> - `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` (110 entries — includes foreman-v2 + foreman-v2-agent)
> - `.agent-workspace/governance-liaison-isms/parking-station/suggestions-log.md` (49 entries)
> - `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` (170 entries)
> - `.agent-workspace/integration-builder/parking-station/suggestions-log.md` (1 entry)
> - `.agent-workspace/qa-builder/parking-station/suggestions-log.md` (5 entries)
> - `.agent-workspace/schema-builder/parking-station/suggestions-log.md` (1 entry)
>
> **Unmapped entries (1):** The `copilot` entry (issue-IAA-TIER2, [RESOLUTION] type) is preserved
> below as it has no agent workspace. It is retained here for audit continuity.
>
> **DO NOT APPEND TO THIS FILE.** New suggestions must be written to the agent-specific file.
>
> Planned: future CI/reporting scripts will aggregate from `.agent-workspace/*/parking-station/suggestions-log.md`.

**Repository**: APGI-cmy/maturion-isms
**Status**: RETIRED — see migration notice above
**Migrated**: 2026-03-03 by governance-liaison-isms (session-039)

---

## Unmapped Entries (preserved for audit continuity)

| Date | Agent | Session | Trigger | Summary | Detail |
|------|-------|---------|---------|---------|--------|
| 2026-03-02 | copilot | issue-IAA-TIER2 | [RESOLUTION] | RESOLVED: KNOWLEDGE_GOVERNANCE trigger+overlays added (OVL-KG-001–005), duplicate A-004→A-018 and A-016→A-019 renumbered, CORE-007 PENDING carve-out added — maturion-isms#IAA-TIER2 | N/A |
| 2026-03-02 | foreman-v2-agent | session-086 | [ORCHESTRATION] | INC-IAA-SKIP-002: committed IAA-TIER2 knowledge changes without Phase 4 ceremony — retroactive PREHANDOVER + IAA invocation + A-016 (PHASE-4-BEFORE-REPORT-PROGRESS) locked in | session-086-iaa-tier2-20260302.md |
| 2026-03-02 | foreman-v2-agent | session-086 | [SESSION-END] | S-013: add pre-condition check before report_progress for substantive commits — verify PREHANDOVER proof + IAA invocation complete before publishing | session-086-iaa-tier2-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-085 | [SESSION-END] | CORE-018 wording should explicitly address untracked-but-accessible PENDING ceremony artifacts — clarify "on the PR branch" to include working-tree files for PENDING ceremonies with commit-before-merge mandate | session-085-20260302.md |
| 2026-03-02 | foreman-v2-agent | session-087 | [SESSION-END] | Knowledge version table drift fix: add CI lint check comparing index.md table row version against file Knowledge Version header — prevents silent version drift through multiple increments. Consistent with S-006 extension. | session-087-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-086 | [PHASE-3] | OVL-KG-002/003 first application to foreman-v2 knowledge index — version not bumped and no version history table present; cosmetic fix still requires patch bump per OVL-KG-002 | session-086-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-086 | [PHASE-4] | PREHANDOVER branch name accuracy gap — 'Branch' field said copilot/wave13-mat-deployment-wiring-regression but actual branch is copilot/fix-live-deployment-wiring-regression; no current check covers this; A-020 candidate | session-086-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-087 | Phase 4 | After REJECTION-PACKAGE remediation, session memory action descriptions referencing version numbers that changed during remediation should be updated to reflect the final committed state (session memory post-remediation accuracy) | session-087-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-088 | [PHASE-4] | Foreman PREHANDOVER template v1.1.0 missing overlay v2.1.0 required sections (OVL-AM-004/005/006, OVL-CI-005/006, CORE-016 verbatim section) — template must be updated to v1.2.0 to prevent recurring REJECTION-PACKAGEs | session-088-20260302.md |
| 2026-03-02 | foreman-v2-agent | session-089 | SESSION-END | Add push-checkpoint after each builder task completion to prevent losing entire session work on push failure | session-089-20260302.md |
| 2026-03-02 | foreman-v2-agent | session-089 | SESSION-END | A-017 locked in: general-purpose agent is not an ISMS agent and must never be used for committed-artifact implementation work — delegate only to inducted ISMS specialist agents | session-089-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-090 | [PHASE-4] | Foreman must explicitly acknowledge CI `action_required` state in PREHANDOVER for bot-created PRs — citing wrong CI run URL (Copilot session) instead of deployment workflow run triggers OVL-CI-005 failure | session-090-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-091 | [PHASE-4] | Three consecutive REJECTION-PACKAGEs for PR #789 due to uncommitted working tree fix — Foreman pre-handover checklist needs explicit git status check before IAA invocation | session-091-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-092 | [PHASE-3] | KNOWLEDGE_GOVERNANCE trigger missed by sessions 090/091 for foreman-v2 FAIL-ONLY-ONCE.md — OVL-KG-004 fails (stale index.md shows 2.1.0, file is 2.2.0) — fix: 3-line index.md update + commit + push; A-022 added (re-evaluate trigger categories every invocation) | session-092-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-093 | PHASE-3 | OVL-KG-002 NEW FAILURE: IAA FAIL-ONLY-ONCE.md header not bumped to 1.5.0 in cae9a53 — single-line fix, commit, push, session-094 | session-093-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-093 | PHASE-3 | Pre-commit knowledge file version checklist: add to Foreman prehandover-template.md — header + history + index all three must match before commit | session-093-20260302.md |
| 2026-03-02 | governance-liaison-isms | session-035 | [SESSION-END] | Add NO_DRIFT_CLOSURE_PROCEDURE to CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md clarifying liaison artifact-only updates when ripple results in no-drift | session-035-20260302.md |
| 2026-03-02 | governance-liaison-isms | session-035 | [ALIGNMENT] | ripple-integration.yml no-drift path does not persist canonical_commit update to repo — add commit+push step for no-drift path | session-035-20260302.md |
| 2026-03-02 | governance-liaison-isms | session-035 | [SESSION-END] | GOVERNANCE_ALIGNMENT_INVENTORY.json was absent — should be created automatically by align-governance.sh and updated on every ripple event | session-035-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-086 | [PHASE-3] | Governance-liaison ripple PRs need dedicated PREHANDOVER_PROOF.md with iaa_audit_token and IAA response section — HANDOVER_SUMMARY.md is not sufficient for CORE-016/018 | session-086-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-086 | [PHASE-2] | Consider adding GOVERNANCE_ADMIN/RIPPLE_ADMIN trigger category to trigger table to reduce ambiguity for pure no-drift administrative ripple PRs | session-086-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-086 | [PHASE-3] | governance-liaison-isms contract advisory_phase: PHASE_A_ADVISORY is stale — should be updated to PHASE_B_BLOCKING via CodexAdvisor+IAA+CS2 | session-086-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-087 | [PHASE-4] | Add re_invocation_prior_rejection_reference field to PREHANDOVER_PROOF.md template to explicitly cross-reference prior REJECTION-PACKAGE token in re-invocation ceremonies | session-087-20260302.md |
| 2026-03-02 | foreman-v2-agent | session-090 | [SESSION-END] | POLC gate push trigger produces false positives on main — add event_name guard to polc-boundary-gate.yml checks | session-090-cicd-audit-20260302.md |
| 2026-03-02 | foreman-v2-agent | session-090 | [SESSION-END] | Agent Contract Audit workflow (id 239866721) has 0 runs since 2026-02-28 creation — verify trigger and activation | session-090-cicd-audit-20260302.md |
| 2026-03-02 | foreman-v2-agent | session-090 | [SESSION-END] | CS2 needs to establish POLC gate override protocol for INC-GENERAL-PURPOSE-001 case (PR #789 validated implementation) | session-090-cicd-audit-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-088 | [PHASE-3] | CORE-018 PENDING carve-out: clarify "on the PR branch" to include working-tree untracked files for PENDING ceremony state with commit-before-merge mandate | session-088-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-088 | [PHASE-2] | Consider adding named GOVERNANCE_AUDIT category to IAA trigger table (EXEMPT-classified) to reduce classification time for CI/CD assurance audit sessions | session-088-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-088 | [PHASE-4] | Add explicit post-ceremony commit mandate to Foreman Step 4.3 or PREHANDOVER template — require commit before report_progress after IAA token received | session-088-20260302.md |
| 2026-03-02 | CodexAdvisor-agent | session-040 | [SESSION-END] | Consider adding INC-ZST-001 to IAA FAIL-ONLY-ONCE.md registry to formally record the zero-severity-tolerance breach pattern | session-040-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-088 | [PHASE-4] | Add explicit Ripple Assessment and Drift Evidence sub-sections to PREHANDOVER proof template for CANON_GOVERNANCE PRs — prevents recurring OVL-CG-004/005 failures | session-088-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-088 | [PHASE-4] | index.md structural requirement — add mandatory ## Version History table to Tier 2 index template to prevent OVL-KG-003 failures | session-088-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-088 | [PHASE-3] | OVL-CG-005 clarification — amend to prefer git diff (option b) for prose-only canon changes, SHA256 (option a) for binary/generated files — reduces friction without losing evidence quality | session-088-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-089 | [PHASE-4] | Post-ASSURANCE-TOKEN ceremony automation — auto-populate IAA response in PREHANDOVER proof to eliminate manual copy risk and CORE-016 ceremony failure exposure | session-089-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-089 | [PHASE-4] | OVL-CG-005 update — add explicit before-hash verification command (`git show HEAD~1:<path> \| sha256sum`) to check description in iaa-category-overlays.md | session-089-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-094 | PHASE-4 | ASSURANCE-TOKEN issued for PR #789 Wave 13 — all prior failures resolved; 6-invocation PR complete | session-094-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-094 | PHASE-3 | CANDIDATE A-023: Tier 2 knowledge file version header must match history entry — three-point pre-commit check recommended for Foreman template | session-094-20260302.md |
| 2026-03-02 | foreman-v2-agent | session-091 | [SESSION-END] | CI workflow task sessions should trigger automatic ceremony reminder before report_progress to prevent skipped-ceremony PRs — add CI_WORKFLOW_CREATION domain flag to domain-flag-index.md | session-091-governance-ceremony-gate-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-095 | [PHASE-4] | OVL-CI-005 requires explicit guidance for new workflow additions where GitHub Actions action_required prevents pre-merge execution; PREHANDOVER template missing explicit Environment Parity section (OVL-CI-006 recurring miss — A-020 flag) | session-095-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-096 | [PHASE-4] | OVL-CI-005 needs explicit action_required pattern guidance to prevent future ambiguity on bot-authored PRs; A-020 PREHANDOVER template staleness now 7 sessions outstanding | session-096-20260302.md |
| 2026-03-02 | governance-liaison-isms | session-037 | SESSION-END | Consider adding explicit push: branches-ignore trigger to polc-boundary-gate.yml to complement the if: guard and make the PR-only intent self-documenting | session-037-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-095 | PHASE-4 | governance-liaison PREHANDOVER template lacks OVL-CI-005 (CI Check Run Evidence) and OVL-CI-006 (Environment Parity) required sections — update template before next CI_WORKFLOW PR | session-095-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-095 | PHASE-3 | Post-O-fix hash cascade miss pattern: when a mid-session fix changes a file, ALL SHA256 references across ALL evidence artifacts must be updated atomically before commit — add to pre-commit hash consistency checklist | session-095-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-096 | Phase 4 | Add pre-commit hook to auto-verify SHA256 hash consistency between workflow files and evidence artifacts to prevent O-001-class hash cascade misses | session-096-20260302.md |
| 2026-03-02 | governance-liaison-isms | session-036 | [SESSION-END] | Enhance align-governance.sh to emit richer ripple-log entries for automated-alignment events (trigger, changed_artifacts, issue_ref) to reduce post-hoc documentation gaps by liaison | session-036-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-095 | [PHASE-4] | Liaison/specialist PREHANDOVER templates should include pre-commit reminder to set iaa_invocation_result to PENDING (not NOT_REQUIRED) before committing session memory to branch, preventing CORE-013/A-019 failures | session-095-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-096 | [PHASE-4] | PREHANDOVER template should instruct agents to update SHA256 claims in Files Delivered table when a fix commit modifies a previously-delivered file, preventing stale hash claims on re-invocation | session-096-20260302.md |
| 2026-03-02 | foreman-v2-agent | session-092 | [RESOLUTION] | RESOLVED: ## Environment Parity section added to prehandover-template.md v1.2.0 — OVL-CI-006 / A-020 7-session recurring flag closed via issue #815 | prehandover-template.md |
| 2026-03-02 | independent-assurance-agent | session-097 | [PHASE-4] | S-015 CANDIDATE: IAA knowledge index.md has duplicate FAIL-ONLY-ONCE.md rows (v1.3.0 and v1.5.0) — cleanup pass needed to remove stale v1.3.0 row | session-097-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-097 | [PHASE-4] | S-016 CANDIDATE: Add Tier 2 knowledge file PREHANDOVER ceremony pre-flight reminder to Foreman Phase 4 — governance-ceremony-gate now enforces this path; pre-push reminder reduces ceremony-missing submissions | session-097-20260302.md |
| 2026-03-02 | foreman-v2-agent | session-092 | [SESSION-END] | Recurring pattern: Tier 2 knowledge file changes omit ceremony wrapper on first commit — reinforce A-016 KNOWLEDGE_GOVERNANCE classification at verb-classification stage | session-092-add-env-parity-20260302.md |

| 2026-03-02 | independent-assurance-agent | session-098 | [PHASE-4] | S-017: PREHANDOVER template checklist 'IAA audit token recorded' item should default to unchecked/PENDING to prevent Foreman pre-filling anticipated -PASS tokens before ASSURANCE-TOKEN is issued | session-098-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-098 | [PHASE-4] | S-018: Session memory template iaa_audit_token and delegation result fields need DO-NOT-POPULATE-UNTIL-POST-CEREMONY warning comment to prevent A-017 pre-fill violations | session-098-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-098 | [PHASE-3] | A-023 elevated: pre-filling ceremony artifact token fields with anticipated -PASS before ASSURANCE-TOKEN issued = CORE-007 + potential A-017 breach; Foreman must use PENDING in all fields until Post-ASSURANCE-TOKEN ceremony | session-098-20260302.md |

| 2026-03-02 | independent-assurance-agent | session-099 | Phase 4 | A-023 should include a worked example distinguishing narrative-prose workflow descriptions (acceptable) from iaa_audit_token field pre-fills (breach) to prevent over/under-application | session-099-20260302.md |
| 2026-03-02 | governance-liaison-isms | session-036 | SESSION-END | Add dedicated CI gate for api/ and packages/ai-centre/ TypeScript type-checking separate from mat/frontend gate | session-036-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-097 | PHASE-3 | Add explicit PREHANDOVER creation instruction to liaison/specialist agent Phase 3 to prevent CORE-018 at first AAWP_MAT invocation | session-097-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-097 | PHASE-3 | Add TECHNICAL_FIX alias warning to trigger table — technical fixes to AAWP_MAT paths ARE triggering; TECHNICAL_FIX is not a recognised exempt category | session-097-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-098 | PHASE-4 | Cross-check version numbers in PREHANDOVER narratives against actual package.json content — SHA256 correctness does not guarantee narrative accuracy | session-098-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-098 | PHASE-4 | Governance ceremony sessions should self-verify that all CREATED artifacts listed in HANDOVER_SUMMARY actually exist before sign-off | session-098-20260302.md |
| 2026-03-02 | governance-liaison-isms | session-038 | SESSION-END | Add pre-IAA checklist to verify HANDOVER_SUMMARY file claims match actual files before invoking IAA | session-038-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-099 | PHASE-4 | Liaison agent needs mandatory pre-commit checklist: git status before IAA invocation — uncommitted governance artifacts = immediate A-021 failure | session-099-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-099 | PHASE-4 | When fixing a find-replace-style text error in governance artifacts, use grep -n to locate ALL instances before declaring fix complete | session-099-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-100 | PHASE-4 | Post-ASSURANCE-TOKEN ceremony steps should be automated or checklisted to prevent manual omission after token issuance | session-100-20260302.md |
| 2026-03-02 | independent-assurance-agent | session-100 | PHASE-4 | Multi-invocation PR governance squash policy — CS2 consideration for consolidating governance ceremony commits before merge | session-100-20260302.md |
| 2026-03-03 | CodexAdvisor-agent | session-041 | DRAFT-PHASE | governance-liaison-isms Phase 3.1 Step 4 had erroneous agent-file-write permission — add cross-check to non-negotiables checklist verifying no agent contract phase body permits .github/agents writes unless agent is CodexAdvisor | session-041-20260303.md |

| 2026-03-03 | independent-assurance-agent | session-101 | Phase 4 | PREHANDOVER template needs: IAA verbatim section heading, git object hashes in drift table, ripple assessment section — all missing in session-041; add commit-status checklist gate to prevent A-021 recurrence | session-101-20260303.md |
| 2026-03-03 | independent-assurance-agent | session-101 | Phase 3 | Systematic CORE-012 fix pass needed: SELF-MOD-* id absent from prohibitions YAML array in api-builder, qa-builder, governance-liaison-isms-agent — recommend dedicated Issue #854 for all-agent sweep | session-101-20260303.md |
| 2026-03-03 | independent-assurance-agent | session-102 | Phase 4 | PREHANDOVER template must cover ALL triggered categories (AGENT_CONTRACT + KNOWLEDGE_GOVERNANCE separately) — fix commit modifying FAIL-ONLY-ONCE.md triggered KG overlay checks that were not addressed | session-102-20260303.md |
| 2026-03-03 | independent-assurance-agent | session-102 | Phase 3 | Add PREHANDOVER checklist item for CORE-009: all modified agent files must have parity_required: true and parity_enforcement: BLOCKING in merge_gate_interface — pre-existing builder gap missed in session-101 | session-102-20260303.md |
| 2026-03-03 | independent-assurance-agent | session-103 | Phase 4 | CodexAdvisor must add OVL-AC-011 pre-flight to PREHANDOVER checklist: after every fix commit, re-verify BOTH char counts AND git object hashes for all modified agent files — partial update (hashes only) caused this session's sole failure | session-103-20260303.md |

| 2026-03-03 | independent-assurance-agent | session-104 | Phase 4 | Produce structured 'Post-ASSURANCE-TOKEN ceremony checklist' in ASSURANCE-TOKEN output so CodexAdvisor has explicit task list to complete PENDING → token update ceremony | session-104-20260303.md |
| 2026-03-03 | foreman-v2-agent | session-092 | [SESSION-END] | ripple-integration.yml check-labels job has unreachable issues-path code after retirement — future cleanup candidate (S-015) | session-092-ripple-cleanup-20260303.md |

| 2026-03-03 | independent-assurance-agent | session-101 | [PHASE-4] | Foreman wrote PHASE_A_ADVISORY in PREHANDOVER on 2026-03-03 despite IAA being PHASE_B_BLOCKING since 2026-03-02 — foreman should read IAA adoption phase from IAA knowledge index at Phase 1 (track as foreman S-016) | session-101-20260303.md |
| 2026-03-03 | independent-assurance-agent | session-102 | [PHASE-4] | A-021 pattern persists as most common failure mode (3 consecutive PRs): producing agent must run git-show-HEAD verification on PREHANDOVER after every edit before invoking IAA (track as foreman S-017) | session-102-20260303.md |
| 2026-03-03 | independent-assurance-agent | session-103 | [PHASE-4] | Three-invocation ASSURANCE-TOKEN finally achieved for PR #826 — recommend pre-IAA commit verification script (S-018) to eliminate A-021 pattern systemically rather than through repeated REJECTION-PACKAGEs | session-103-20260303.md |
| 2026-03-03 | CodexAdvisor-agent | session-042 | SESSION-END | Add explicit gate to agent-file-non-negotiables-checklist.md verifying no agent contract file uses `secret:` as a YAML field key — catches secret scanner violations at QP review time before IAA/CI/CS2 | session-042-20260303.md |
| 2026-03-03 | independent-assurance-agent | session-105 | Phase 3/OVL-AC-009 | Add boundary-risk pre-check to CodexAdvisor PREHANDOVER ceremony for bulk renames approaching 30,000-char limit | session-105-20260303.md |
| 2026-03-03 | independent-assurance-agent | session-106 | Phase 3/CORE-021 | Add PREHANDOVER self-consistency sweep to CodexAdvisor remediation checklist: search all delta values across all sections after updating any data table | session-106-20260303.md |
| 2026-03-03 | independent-assurance-agent | session-107 | Phase 4 | CodexAdvisor should add pre-invocation self-check script to verify PREHANDOVER per-file char table programmatically before invoking IAA | session-107-20260303.md |
