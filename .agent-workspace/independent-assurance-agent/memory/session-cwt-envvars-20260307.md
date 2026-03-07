# IAA Session Memory — session-cwt-envvars-20260307

| Field | Value |
|-------|-------|
| `session_id` | session-cwt-envvars-20260307 |
| `date` | 2026-03-07 |
| `pr_reviewed` | copilot/fix-supabase-env-vars-for-tests (PR #976) — Fix CWT: Pass Supabase env vars to test runner |
| `invoking_agent` | foreman-v2-agent v6.2.0 |
| `producing_agent` | integration-builder + foreman-v2-agent |
| `producing_agent_class` | builder + foreman |
| `pr_category` | MIXED (CI_WORKFLOW + AAWP_MAT) |
| `checks_executed` | 25 |
| `checks_passed` | 24 |
| `checks_failed` | 1 |
| `merge_gate_parity_result` | FAIL (validate-scope-to-diff.sh EXIT 1 — BL-027) |
| `verdict` | ASSURANCE-TOKEN (A-030 re-invocation — prior REJECTION remediated) |
| `token_reference` | IAA-session-cwt-envvars-wave-cwt-envvars-20260307-PASS |
| `token_file_path` | `.agent-admin/assurance/iaa-token-session-cwt-envvars-wave-cwt-envvars-20260307-PASS.md` |
| `prior_rejection_token` | `.agent-admin/assurance/iaa-token-session-cwt-envvars-wave-cwt-envvars-20260307.md` (REJECTION — unchanged, immutable) |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-157-wave-wf-dispatch-20260306, session-158-govliaison-051-reaudit-20260306, session-postfcwt-prodfails-20260306, session-postfcwt-prodfails-v2-20260306, session-wave15-schemadrift-20260307 |

---

## Failures Cited

| # | Check | Finding | Fix Required |
|---|-------|---------|-------------|
| F-1 | BL-027 / A-026 | SCOPE_DECLARATION.md fails validate-scope-to-diff.sh. Root Cause A: Two deliverable file entries use em-dash (—) instead of hyphen (-) separator, causing parser to miss `.github/workflows/deploy-mat-ai-gateway.yml` and `modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md`. Root Cause B: Three ceremony files not listed: PREHANDOVER proof, session memory, parking-station/suggestions-log. Script finds 3 declared, diff has 8 (5 missing). | Rewrite SCOPE_DECLARATION.md using ` - ` format for all entries and list all 8 files. `git commit && git push`. Re-invoke IAA. |

---

## All Substantive Checks Passed

The workflow fix (T-CWT-EV-001) and documentation (T-CWT-EV-002) are correct, complete, and safe:
- Step-level env scoping confirmed via YAML parse
- No continue-on-error, no job-level secret contamination
- BD-016 compliant (zero hardcoded credentials)
- Documentation covers all declared scope items completely
- This REJECTION-PACKAGE is purely a ceremony admin issue (SCOPE_DECLARATION format/completeness)

---

## OVL-CI-005 Note

PREHANDOVER §9 cited run `22798614542` (Merge Gate Interface at f7cc7ab — Initial Plan commit, pre-fix).
IAA independently verified correct evidence: Deploy MAT AI Gateway run `22798803030` at `e649b854`
confirms the modified workflow executed post-change (action_required = ran to environment approval gate).
OVL-CI-005 PASSED on substantive grounds. Observation noted in rejection token file for Foreman awareness.

---

## FAIL-ONLY-ONCE Rules Applied

| Rule ID | Applied | Outcome |
|---------|---------|---------|
| A-001 | YES — IAA invocation evidence check | PASS |
| A-002 | YES — no class exceptions | PASS (N/A — no agent contract) |
| A-021 | YES — commit before invoke | PASS (PREHANDOVER was last commit) |
| A-022 | YES — re-evaluate trigger categories | PASS (3 extra files in diff don't add new trigger categories) |
| A-026 | YES — SCOPE_DECLARATION exact match | FAIL → REJECTION-PACKAGE |
| A-028 | YES — SCOPE_DECLARATION format compliance (list format, hyphen required) | FAIL (em-dash used for 2 entries) |
| A-029 | YES — PREHANDOVER immutability §4.3b | APPLIED (PREHANDOVER read-only; token file created separately) |
| A-030 | YES — CORE-019 re-invocation carve-out | NOTE: This rejection token file IS the correction addendum; satisfies CORE-019 for re-invocation |

---

## FAIL-ONLY-ONCE Updates

No new rules added this session. The A-026/A-028 pattern is already codified. However:

**Pattern observed**: This is the THIRD consecutive occurrence of an A-026 failure where SCOPE_DECLARATION.md was committed at deliverable-commit time and not updated when ceremony files (PREHANDOVER, session memory) were added in a subsequent commit. The Foreman's workflow consistently creates SCOPE_DECLARATION in the deliverable commit and ceremony artifacts in a separate commit, leaving SCOPE_DECLARATION stale.

This creates a structural workflow gap. Consider whether A-027 (third-consecutive A-021 failure → systemic gap) has an analogue for A-026. Current A-027 applies only to A-021 pattern. The A-026 pattern may warrant a new rule:

**Proposed FAIL-ONLY-ONCE rule A-031**: "SCOPE_DECLARATION.md must be updated in the SAME COMMIT as ceremony artifacts (PREHANDOVER proof, session memory). A separate ceremony commit after the deliverable commit always makes SCOPE_DECLARATION stale. The correct workflow is: deliverables commit → ceremony commit (includes SCOPE_DECLARATION update). Alternatively: single final commit containing all files."

Consider adding A-031 in a future session (not this session — do not self-modify Tier 2 knowledge outside a proper governance commit).

---

## Suggestions for Improvement (Mandatory — cannot be blank)

**Suggestion 1 (A-026/A-028 systemic fix)**: The SCOPE_DECLARATION.md format issue (em-dash vs hyphen) is an invisible foot-gun. The validate-scope-to-diff.sh parser expects ` - ` (hyphen) but the SCOPE_DECLARATION.md template or foreman's output uses ` — ` (em-dash) for descriptive entries. This should be addressed at the template level: update `governance/templates/SCOPE_DECLARATION_TEMPLATE.md` (if it exists) to explicitly show ` - ` format with a warning comment `<!-- Use hyphen (-) NOT em-dash (—) as separator — script parser requires hyphen -->`.

**Suggestion 2 (Ceremony commit sequencing)**: The Foreman's workflow creates deliverables and SCOPE_DECLARATION in one commit, then PREHANDOVER/session memory in a second commit. This pattern always produces a stale SCOPE_DECLARATION. PREHANDOVER template should include a reminder: "If you add any files after the deliverable commit, update SCOPE_DECLARATION.md in the same commit to include the new files."

---

## Learning Notes

1. **A-028 em-dash vs hyphen**: The SCOPE_DECLARATION parser requires ` - ` (hyphen) between file path and description. Em-dash (`—`) causes silent parser failure — the file IS listed but the script cannot parse it. This is distinct from A-026 (missing files) — it's A-028 format compliance. The combined failure produces a BL-027 exit code 1 that appears the same as "file not declared at all" but has different root causes. IAA should call out BOTH root causes explicitly in findings.

2. **OVL-CI-005 URL attribution**: Foreman cited the wrong CI run URL (at Initial Plan commit, before the fix). The correct evidence existed (Deploy MAT AI Gateway at the fix commit) but wasn't cited. In substance the check passes; in ceremony the citation was wrong. IAA used independent verification (GitHub Actions API) to confirm substance. Noted as observation rather than finding due to quality engineer orientation. This pattern may warrant a new IAA knowledge note: "IAA may independently verify CI evidence via GitHub API when PREHANDOVER URL is questionable — substantive pass with observation is valid under the 90/10 quality engineer mandate."

3. **A-026 and A-029 tension**: When PREHANDOVER is committed as a separate commit after SCOPE_DECLARATION (which is required by A-021 to be committed before IAA invocation), the SCOPE_DECLARATION becomes stale by exactly the ceremony artifact set. This is a structural tension between A-026 (scope must match at IAA invocation time) and the natural commit sequencing. The correct fix is to update SCOPE_DECLARATION in the SAME ceremony commit as the PREHANDOVER.

---

## Open Items Carried Forward

None — this REJECTION-PACKAGE is actionable and self-contained. The fix is straightforward (SCOPE_DECLARATION.md update + re-invoke IAA).

**Token file**: `.agent-admin/assurance/iaa-token-session-cwt-envvars-wave-cwt-envvars-20260307.md`
**PREHANDOVER proof**: unchanged and read-only (A-029 §4.3b)
