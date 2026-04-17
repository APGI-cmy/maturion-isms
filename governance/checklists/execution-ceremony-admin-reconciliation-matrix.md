# Execution Ceremony Admin Reconciliation Matrix

## Status
**Type**: Tier 2 Governance Reference  
**Authority**: CS2 — EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md v1.1.0  
**Version**: 1.0.0  
**Effective Date**: 2026-04-17  
**Owner**: execution-ceremony-admin-agent (responsible for reconciliation) / Foreman QP (verification)  
**Purpose**: Define every cross-artifact truth dependency that ECAP must reconcile before bundle handback. Each row is a binding reconciliation obligation.

---

## How to Use This Matrix

For each row, the `execution-ceremony-admin-agent` MUST:

1. Identify the **truth anchor** — the authoritative source of the correct value.
2. Check every **dependent location** — every other artifact that declares the same value.
3. Verify all dependent locations agree with the truth anchor.
4. Correct any mismatch before bundle handback.

Rows marked with `IAA ACR-*` reference the corresponding admin-ceremony rejection trigger in `INDEPENDENT_ASSURANCE_AGENT_CANON.md §Admin-Ceremony Rejection Triggers`. These are auto-fail if left unresolved.

---

## Matrix Table

| # | Dependency | Truth Anchor | Dependent Locations (must match) | Failure Code | IAA Rejection Trigger |
|---|-----------|-------------|----------------------------------|-------------|----------------------|
| **R01** | **Session ID** | PREHANDOVER proof `session_id` field | Session memory filename (session-NNN suffix), tracker entries referencing session number, wave record session reference, token file session reference | ECAP-RCON-001 | ACR-03 |
| **R02** | **IAA token reference** | Token file (`iaa-token-session-NNN-waveY-YYYYMMDD.md`) path and token ID as issued by IAA | PREHANDOVER proof `iaa_audit_token` field, session memory IAA section (token path), wave record assurance section | ECAP-RCON-002 | ACR-03, ACR-07 |
| **R03** | **Issue number** | GitHub issue number (from PR or task definition) | PREHANDOVER proof `issue` field, session memory issue reference, scope declaration issue/context reference, wave record issue reference | ECAP-RCON-003 | ACR-03 |
| **R04** | **PR number** | GitHub PR number (once PR created) | PREHANDOVER proof `pr` field, session memory PR reference, gate results JSON `pr` field | ECAP-RCON-004 | ACR-03 |
| **R05** | **Wave identifier** | Wave identifier defined in the Foreman's job/wave assignment | PREHANDOVER proof `wave` field, session memory wave reference, tracker entry wave column, wave record filename, token file wave component | ECAP-RCON-005 | ACR-03, ACR-07 |
| **R06** | **Branch name** | Actual working branch (from `git branch --show-current`) | PREHANDOVER proof `branch` field, scope declaration if it includes branch reference | ECAP-RCON-006 | ACR-03 |
| **R07** | **Changed file paths** | `git diff --name-only origin/main...HEAD` (actual diff) | Scope declaration `FILES_CHANGED` count and file list, PREHANDOVER artifact inventory file list, session memory artifact paths | ECAP-RCON-007 | ACR-04, ACR-08 |
| **R08** | **PREHANDOVER ↔ session memory** | PREHANDOVER proof (primary handover artifact) | Session memory must reference the same job, wave, issue, PR, session, and status as the PREHANDOVER proof; session memory artifact paths must match paths declared in PREHANDOVER | ECAP-RCON-008 | ACR-07 |
| **R09** | **PREHANDOVER ↔ token / IAA reference** | PREHANDOVER proof `iaa_audit_token` + `iaa_session_reference` | Token file at declared path must exist; token ID must match; IAA session in token file must match `iaa_session_reference` in PREHANDOVER | ECAP-RCON-009 | ACR-02, ACR-07 |
| **R10** | **Tracker ↔ wave record** | Official wave tracker (if used) | Wave record must not contradict tracker status, wave number, session, or completion state | ECAP-RCON-010 | ACR-07 |
| **R11** | **Scope declaration ↔ actual changed files** | `git diff --name-only origin/main...HEAD` | `governance/scope-declaration.md` `FILES_CHANGED` count and listed files | ECAP-RCON-011 | ACR-04 |
| **R12** | **Session memory ↔ committed artifact paths** | Actual committed files (`git ls-files <path>`) | Session memory "artifacts committed" section — every listed path must resolve to a committed file on the branch | ECAP-RCON-012 | ACR-08 |
| **R13** | **CANON_INVENTORY ↔ file hash / version / amended_date** | Actual file on disk: SHA256 from `sha256sum <file>`, version from file header, date from today | CANON_INVENTORY.json `file_hash_sha256`, `version`, `canonical_version`, `amended_date` for every amended entry | ECAP-RCON-013 | ACR-05 |
| **R14** | **Ripple registry ↔ PUBLIC_API changes** | List of changed files with `layer_down_status: PUBLIC_API` in CANON_INVENTORY | ECAP reconciliation summary ripple assessment block — every qualifying file must appear; status must be COMPLETED / DEFERRED / NOT-APPLICABLE | ECAP-RCON-014 | ACR-06 |
| **R15** | **Final-state status coherence** | The actual outcome of the job (COMPLETE / BLOCKED / PASS) | ALL of: PREHANDOVER `final_state`, session memory final status, gate results JSON `verdict`, wave record completion status — must tell one coherent story | ECAP-RCON-015 | ACR-02, ACR-07 |
| **R16** | **Artifact declared count ↔ actual count** | Actual committed file counts (e.g., number of evidence files, number of changed canon files) | Any declared count in PREHANDOVER proof, session memory, or scope declaration (e.g., "3 canon files amended", "5 artifacts committed") | ECAP-RCON-016 | ACR-07 |
| **R17** | **IAA session reference (assurance round)** | IAA session ID as issued in the token file (`IAA-YYYYMMDD-NNN-RZ` format) | PREHANDOVER `iaa_session_reference` field; if re-invocation round, `iaa_reinvocation_round` must match the `-rZ` suffix on the token filename | ECAP-RCON-017 | ACR-07 |

---

## Reconciliation Verification Procedure

For each row in the matrix:

```bash
# R01 — Session ID
SESSION_ID_PROOF=$(grep "^session_id:" .agent-admin/prehandover/proof-*.md | awk '{print $2}' | head -1)
SESSION_MEMORY_ID=$(ls .agent-workspace/*/memory/session-*.md | grep -oE "session-[0-9]+" | tail -1)
echo "PROOF session: ${SESSION_ID_PROOF} | MEMORY session: ${SESSION_MEMORY_ID}"

# R07 — Scope declaration parity
DECLARED=$(grep "^FILES_CHANGED:" governance/scope-declaration.md | awk '{print $2}')
ACTUAL=$(git diff --name-only origin/main...HEAD | wc -l | tr -d ' ')
echo "Declared: ${DECLARED} | Actual: ${ACTUAL}"

# R13 — CANON_INVENTORY hash check
sha256sum governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md
# Compare with CANON_INVENTORY.json file_hash_sha256 for this file
```

---

## Reconciliation Declaration

The `execution-ceremony-admin-agent` MUST complete this declaration at bundle handback:

```
Cross-Artifact Reconciliation Declaration
==========================================
Wave / Job: ___________________________
ECAP Session: _________________________
Date: _________________________________

Rows verified:
[ ] R01 — Session ID
[ ] R02 — IAA token reference
[ ] R03 — Issue number
[ ] R04 — PR number
[ ] R05 — Wave identifier
[ ] R06 — Branch name
[ ] R07 — Changed file paths
[ ] R08 — PREHANDOVER ↔ session memory
[ ] R09 — PREHANDOVER ↔ token / IAA reference
[ ] R10 — Tracker ↔ wave record
[ ] R11 — Scope declaration ↔ actual changed files
[ ] R12 — Session memory ↔ committed artifact paths
[ ] R13 — CANON_INVENTORY ↔ file hash / version / amended_date
[ ] R14 — Ripple registry ↔ PUBLIC_API changes
[ ] R15 — Final-state status coherence
[ ] R16 — Artifact declared count ↔ actual count
[ ] R17 — IAA session reference (assurance round)

Mismatches found and corrected: _____________________ (or "None")
Rows marked N/A: _____________________ (reason: _______)

RECONCILIATION STATUS: [ ] COMPLETE  [ ] BLOCKED — REASON: _______
```

---

## References

- `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` v1.1.0 — §3.7 (reconciliation duty)
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.6.0 — §Admin-Ceremony Rejection Triggers
- `governance/checklists/execution-ceremony-admin-checklist.md` — Section 5 (token/session/path checks)
- `governance/checklists/execution-ceremony-admin-anti-patterns.md` — auto-fail conditions

---

*Version: 1.0.0 | Effective: 2026-04-17 | Authority: CS2 (Johan Ras)*
