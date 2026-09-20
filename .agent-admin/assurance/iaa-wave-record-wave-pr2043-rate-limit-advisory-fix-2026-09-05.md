# IAA Wave Record — wave-pr2043-rate-limit-advisory-fix

- wave_id: wave-pr2043-rate-limit-advisory-fix
- date: 2026-09-05
- pr: 2043
- producing_agent: governance-liaison-isms-agent (class: liaison)
- category: CI_WORKFLOW
- ceremony_admin_appointed: NO

## PRE-BRIEF

Not applicable — post-hoc assurance invocation (Phase 4.4 audit), not a wave-start PRE-BRIEF.

## TOKEN

- verdict: ASSURANCE-TOKEN
- token_reference: IAA-session-2043-20260905-PASS
- PHASE_B_BLOCKING_TOKEN: IAA-session-2043-20260905-PASS
- checks_run: 9
- checks_pass: 9
- checks_fail: 0
- merge_gate_parity: PASS
- adoption_phase: PHASE_B_BLOCKING
- issued: 2026-09-05
- summary: Rate-limit catch branch in .github/workflows/producer-next-action-guidance.yml sticky-comment step changed from core.setFailed to core.warning, restoring parity with the advisory/infrastructure classification established in PR #1735 (commit c9612e2c). Classification lines preserved verbatim; non-rate-limit errors still throw. YAML valid; regression suite 17/17 PASS (incl. case 11 GRAY advisory render, case 16 checkpoint non-zero exit); no external consumers of job outputs; diff confined to one block in one file.

## REJECTION_HISTORY

None.
