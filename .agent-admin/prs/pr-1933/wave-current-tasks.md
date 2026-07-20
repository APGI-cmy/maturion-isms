# Wave Current Tasks — PR #1933

Wave: maturion-thin-core-20260713
Branch: codexadvisor-issue-1932-maturion-thin-core
PR: #1933
Issue: #1932
Status: DRAFT_STOP_AND_FIX

iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-maturion-thin-core-20260712.md
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-maturion-thin-core-20260712.md
IAA_PREFLIGHT_BRIEF_REVIEWED: yes
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: yes

current_substantive_protected_commit: 213f5cb5b94461b19cbd860a706a99e5bdb45042
current_protected_blob: c6a6a086d192eee2e0c872ec268eee767a407637
current_prehandover: .agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-065-20260720.md
prior_iaa_session: session-1283-20260720
prior_iaa_result: REJECTION-PACKAGE
handover_allowed: no

| Task ID | Description | Owner | Status |
|---|---|---|---|
| MAT-T1-1933 | Correct Maturion Tier 1 contract | CodexAdvisor-agent | COMPLETE |
| IAA-RP-01 | Reconcile current protected commit and blob | CodexAdvisor-agent | COMPLETE |
| IAA-RP-02 | Create current immutable PREHANDOVER | CodexAdvisor-agent | COMPLETE |
| IAA-RP-03 | Correct ECAP waiver proof | CS2-directed administration | COMPLETE |
| ADMIN-1933 | Reconcile manifest, scope, tasks and PR body to 11 paths | CodexAdvisor-agent | COMPLETE |
| HOSTED-1933 | Complete hosted checks on frozen post-remediation head | GitHub Actions | IN_PROGRESS |
| IAA-1933-R2 | Perform fresh independent final assurance | independent-assurance-agent | PENDING |

Fresh IAA invocation is prohibited until all hosted checks on the frozen current head are green. The IAA must not modify implementation evidence except its authorised verdict and session memory.