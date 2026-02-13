# Escalation - BLOCKER - 2026-02-13

- **Type**: BLOCKER
- **Title**: Mandatory liaison protocol scripts missing in repository
- **Detected By**: governance-liaison-isms
- **Context**:
  - `.github/scripts/wake-up-protocol.sh governance-liaison-isms` failed with `No such file or directory`
  - `.github/scripts/session-closure.sh governance-liaison-isms` failed with `No such file or directory`
- **Impact**:
  - REQ-AS-005 and REQ-EO-005 scripted protocol execution cannot be completed through prescribed automation.
  - Manual fallback evidence and memory records were produced for this session, but canonical script-driven execution is unavailable.
- **Recommendation**:
  1. Restore or add required governance liaison protocol scripts under `.github/scripts/`.
  2. Confirm script interface supports `governance-liaison-isms` argument.
  3. Re-run wake-up/session-closure in next session once scripts are present.
- **Status**: OPEN
