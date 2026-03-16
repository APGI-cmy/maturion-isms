# IAA Session Memory — session-wave18-postmerge-hotfix-20260315-AUDIT

```yaml
session_id: session-wave18-postmerge-hotfix-20260315-AUDIT
date: 2026-03-15
session_type: PHASE_4_FINAL_AUDIT
wave: wave18-postmerge-hotfix
branch: copilot/fix-wave-18-post-merge-hotfixes
issue: maturion-isms#1116
invoking_agent: foreman-v2-agent (Phase 4.3a IAA Final Audit Request)
producing_agent: schema-builder (T-W18P-001), api-builder (T-W18P-002/003/004), mat-specialist (T-W18P-006), foreman-v2-agent (governance artifacts)
producing_agent_class: schema/api/mat-specialist = builder-specialist; foreman = foreman
pr_category: AAWP_MAT (primary) + CANON_GOVERNANCE (T-W18P-006) + PRE_BRIEF_ASSURANCE (T-W18P-007)
checks_executed: 24
checks_passed: 22
checks_failed: 2
merge_gate_parity_result: FAIL (scope-to-diff validation: FAIL-ONLY-ONCE.md in diff, absent from scope)
verdict: REJECTION-PACKAGE
token_reference: IAA-REJECTION-session-wave18postmerge-hotfix-20260315
rejection_artifact: .agent-admin/assurance/iaa-rejection-session-wave18postmerge-hotfix-20260315.md
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING

prior_sessions_reviewed:
  - session-prebrief-wave18-postmerge-hotfix-20260315 (PRE_BRIEF_ISSUED)
  - session-prebrief-wave18-criteria-parsing-20260315 (PRE_BRIEF_ISSUED — Wave 18 Main)
  - session-wave16-full-batch-20260310 (ASSURANCE-TOKEN PASS)
  - session-wave16-orchestration-20260309-R2 (ASSURANCE-TOKEN PASS)
  - session-wave16-orchestration-20260309 (REJECTION-PACKAGE — resolved)

failures_cited:
  - finding: FINDING-1
    check: A-026 / CORE-021 — SCOPE_DECLARATION Exact Match
    detail: ".agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md in git diff but absent from SCOPE_DECLARATION"
    fix_required: "Add FAIL-ONLY-ONCE.md to SCOPE_DECLARATION; commit CORRECTION ADDENDUM per A-030; re-invoke IAA"
  - finding: FINDING-2
    check: OVL-AM-CWT-01 / CORE-021 — CWT PASS Verdict with Scope
    detail: "No explicit CWT PASS declaration with waves/modules/scenarios scope in PREHANDOVER; SB-002 from pre-brief not addressed"
    fix_required: "Add CWT PASS declaration with scope to CORRECTION ADDENDUM per template in REJECTION-PACKAGE artifact"

fail_only_once_rules_applied:
  - rule: A-001
    outcome: PASS — IAA invocation evidence present (pre-brief artifacts committed)
  - rule: A-002
    outcome: PASS — no agent contracts modified in this PR
  - rule: A-026
    outcome: FAIL — FAIL-ONLY-ONCE.md in diff, absent from SCOPE_DECLARATION
  - rule: A-029
    outcome: ADVISORY ONLY — iaa_audit_token uses -PENDING suffix instead of -PASS per A-029; CORE-007 carve-out prevents flagging; recorded as learning note
  - rule: A-030
    outcome: APPLIED — correction addendum path recommended in REJECTION-PACKAGE (PREHANDOVER immutable)
  - rule: A-032
    outcome: PASS — migration DDL read directly; profiles columns verified; no new column violations

checks_passed_detail:
  - CORE-005 Governance block present
  - CORE-006 CANON_INVENTORY alignment (191 canons, 0 bad hashes)
  - CORE-007 No placeholder content (production code clean)
  - CORE-013 IAA invocation evidence present
  - CORE-014 No class exemption claim
  - CORE-015 Session memory present
  - CORE-016 IAA verdict evidenced (First Invocation Exception)
  - CORE-017 No .github/agents/ modifications
  - CORE-018 Evidence artifact sweep (all conditions met)
  - CORE-019 IAA token cross-verification (First Invocation Exception)
  - CORE-020 Zero partial pass rule applied
  - CORE-023 Workflow integrity (deploy-mat-edge-functions.yml valid; Edge Function modified in-place)
  - A-032 Schema column compliance (profiles backfill + policy additions; columns verified)
  - BD-001 Full scope delivered (all 7 T-W18P tasks verified)
  - BD-002 No stub/TODO in production code
  - BD-003 One-time build compliance
  - BD-015 RLS self-check (profiles policies correctly scoped; audit_documents_org_insert_v2 preserved)
  - POLC boundary (foreman: governance only; all code from builder-class agents)
  - OVL-INJ-001 Pre-brief artifact existence
  - Wave 18 tests 15/15 GREEN (confirmed by vitest run)

build_quality_note: "Build quality is STRONG. Both failures are governance ceremony gaps (scope declaration drift + CWT labeling), not quality or security defects. Production code is correct and well-implemented. Resolution should be straightforward (correction addendum)."

learning_notes:
  - "A-026 drift remains a persistent risk in post-merge hotfix waves. The Foreman correctly updated the FAIL-ONLY-ONCE.md (closing INC-W18-CRITERIA-PIPELINE-001) but omitted it from the SCOPE_DECLARATION. For small one-line governance updates in workspace knowledge files, the SCOPE_DECLARATION update step is easy to overlook. Suggestion: add a pre-IAA checklist step that runs `git diff --name-only origin/main...HEAD | sort` and compares to scope before committing the PREHANDOVER."
  - "OVL-AM-CWT-01 is consistently under-applied. This is the second wave in a row where CWT evidence was present in substance (tests GREEN) but the formal CWT PASS declaration with scope was absent. The PREHANDOVER template should have a mandatory CWT PASS section that requires explicit population before the template can be considered complete. A-020 (PREHANDOVER template staleness) should be triggered to ensure the template includes this field."
  - "iaa_audit_token format: the Foreman used IAA-session-...-PENDING (old A-025 pattern) instead of IAA-session-...-PASS (A-029 pattern). CORE-007 carve-out protects this from being flagged as a placeholder, but A-029 is clear: the expected format ends in -PASS. The PREHANDOVER template should have a note prominently stating 'use -PASS suffix, not -PENDING, per A-029 (supersedes A-025).'"
  - "The Foreman pre-brief SB-002 mechanism works correctly — pre-declaring requirements that IAA will check at Phase 4. However, the mechanism only helps if the PREHANDOVER actually addresses those requirements. Consider adding an SB-002-check step in the Foreman's PREHANDOVER self-review protocol."

fail_only_once_updates:
  - "Consider adding A-033: PREHANDOVER template must include a mandatory CWT PASS section with scope fields (waves_covered, modules_covered, scenarios_covered). An empty/absent CWT section is a PREHANDOVER template violation and a mandatory REJECTION-PACKAGE finding. This would encode OVL-AM-CWT-01 directly into the PREHANDOVER ceremony. Recommendation: flag to CS2 and CodexAdvisor for governance encoding."

suggestions_for_improvement: "Two concrete improvements observed this session: (1) The PREHANDOVER template should include a mandatory CWT PASS section with scope fields, preventing OVL-AM-CWT-01 failures without requiring foreman to remember the requirement separately. (2) The foreman's pre-IAA self-check protocol should include a step: run `git diff --name-only origin/main...HEAD | sort > /tmp/diff.txt && diff /tmp/diff.txt <(grep '^\- ' SCOPE_DECLARATION.md | sed 's/^- //' | sort)` to catch scope drift before invoking IAA."
```

## Parking Station Entry

| 2026-03-15 | independent-assurance-agent | session-wave18-postmerge-hotfix-20260315-AUDIT | Phase 3 | PREHANDOVER template should include mandatory CWT PASS section with scope fields to prevent recurring OVL-AM-CWT-01 failures | session-wave18-postmerge-hotfix-20260315-AUDIT.md |
| 2026-03-15 | independent-assurance-agent | session-wave18-postmerge-hotfix-20260315-AUDIT | Phase 3 | Foreman pre-IAA self-check should include scope-vs-diff comparison to catch A-026 drift before invoking IAA | session-wave18-postmerge-hotfix-20260315-AUDIT.md |
| 2026-03-15 | independent-assurance-agent | session-wave18-postmerge-hotfix-20260315-AUDIT | Phase 4 | iaa_audit_token should use -PASS suffix (A-029) not -PENDING (old A-025 pattern); PREHANDOVER template should note this prominently | session-wave18-postmerge-hotfix-20260315-AUDIT.md |
