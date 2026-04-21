# Liaison / Non-ECAP Mini-Ceremony Checklist

**Type**: Tier 2 Governance Checklist  
**Version**: 1.0.0  
**Effective Date**: 2026-04-21  
**Authority**: CS2 — admin-ceremony-hardening-20260421  
**Owner**: governance-liaison-isms-agent / any non-ECAP governance ceremony producer  
**Purpose**: Step-by-step execution checklist for completing the Liaison Mini-Ceremony Pack. Ensures ART-level reference coherence in governance-liaison and non-ECAP flows.

---

## Instructions

Complete each section in order. Mark each item `[x]` when confirmed or `[N/A]` with a reason when genuinely not applicable. Items marked `[ ]` (incomplete) render the bundle non-compliant for handover.

Copy the completed liaison mini-ceremony pack template (`governance/templates/liaison-mini-ceremony-pack.md`) to:
```
.agent-workspace/<agent>/memory/liaison-ceremony-<wave>-YYYYMMDD.md
```

---

## Section 1: ART Population (Authoritative Reference Table)

Populate each reference slot from the system-of-record source. Do NOT use memory or prior artifacts.

| # | Reference Slot | System-of-Record Source | Action | Verified (✓/✗) |
|---|---------------|------------------------|--------|----------------|
| 1.1 | Session ID | Session memory filename suffix (e.g., `session-069-20260421.md` → `session-069`) | `ls .agent-workspace/<agent>/memory/session-*.md \| tail -1` | |
| 1.2 | Session date | System date at proof creation time | `date +%Y-%m-%d` | |
| 1.3 | IAA session reference | IAA token file content (if IAA was invoked this session) | `grep "IAA-session-" .agent-admin/assurance/iaa-token-*.md 2>/dev/null \| head -1` | |
| 1.4 | Wave identifier | `wave-current-tasks.md` `Wave:` field | `grep "^Wave:" .agent-workspace/foreman-v2/personal/wave-current-tasks*.md 2>/dev/null` | |
| 1.5 | PR number | GitHub PR number (once PR created) | `gh pr view --json number` or branch PR list | |
| 1.6 | Branch name | Active git branch | `git branch --show-current` | |
| 1.7 | PREHANDOVER file path | Committed file path (or N/A if no PREHANDOVER this session) | `git ls-files .agent-admin/prehandover/proof-*.md 2>/dev/null \| head -1` | |
| 1.8 | Session memory path | Committed session memory path | `git ls-files .agent-workspace/<agent>/memory/session-*.md 2>/dev/null \| tail -1` | |

**Verification command (batch)**:
```bash
echo "Session ID: $(ls .agent-workspace/governance-liaison-isms/memory/session-*.md 2>/dev/null | tail -1 | xargs basename | grep -oE 'session-[0-9]+')"
echo "Date: $(date +%Y-%m-%d)"
echo "Branch: $(git branch --show-current)"
echo "IAA token: $(grep -h 'IAA-session-' .agent-admin/assurance/iaa-token-*.md 2>/dev/null | head -1 || echo 'N/A')"
echo "PREHANDOVER: $(git ls-files .agent-admin/prehandover/proof-*.md 2>/dev/null | head -1 || echo 'N/A')"
```

**ART completion**: `[ ]` All 8 slots populated (or N/A with documented reason for non-applicable slots)

---

## Section 2: 5-Point Spot-Check Verification

| # | Check | Verification Command | Verified (✓/✗) | Notes |
|---|-------|---------------------|----------------|-------|
| 2.1 | Session ID in PREHANDOVER ↔ session memory filename match | `grep "foreman_session\|session:" .agent-admin/prehandover/proof-*.md 2>/dev/null` vs `ls .agent-workspace/governance-liaison-isms/memory/session-*.md \| tail -1` | | |
| 2.2 | IAA token reference in PREHANDOVER ↔ token file content match | `grep "iaa_audit_token:" .agent-admin/prehandover/proof-*.md 2>/dev/null` vs `cat .agent-admin/assurance/iaa-token-*.md 2>/dev/null \| head -5` | | |
| 2.3 | Wave ID in PREHANDOVER ↔ wave record match | `grep "^wave:" .agent-admin/prehandover/proof-*.md 2>/dev/null` vs `grep "^Wave:" .agent-workspace/foreman-v2/personal/wave-current-tasks*.md 2>/dev/null` | | |
| 2.4 | Inventory/completion notes ↔ session number match | `grep -n "session-[0-9]" governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json 2>/dev/null` — verify any references match ART session ID | | |
| 2.5 | PREHANDOVER path self-reference (declared path = `git ls-files` confirmed committed path) | `DECLARED=$(grep "^prehandover_proof:" .agent-admin/prehandover/proof-*.md 2>/dev/null \| awk '{print $2}'); git ls-files --error-unmatch "${DECLARED}"` | | |

**Section 2 completion**: `[ ]` All applicable spot-checks PASS

---

## Section 3: Renumber/Refresh Trigger Check

| # | Check | Verified (✓/✗) | Notes |
|---|-------|----------------|-------|
| 3.1 | Confirm whether any triggering event occurred: session number changed? | | |
| 3.2 | Confirm whether any triggering event occurred: session date changed? | | |
| 3.3 | Confirm whether any triggering event occurred: wave identifier changed or corrected? | | |
| 3.4 | Confirm whether any triggering event occurred: PR number changed or PR created after initial draft? | | |
| 3.5 | Confirm whether any triggering event occurred: branch renamed or conflict-resolution merge modified active truth anchors? | | |
| 3.6 | If any triggering event (3.1–3.5) occurred: `art_refresh_required: YES` set in YAML | | |
| 3.7 | If `art_refresh_required: YES`: ART re-populated from system-of-record sources (not copied) | | |
| 3.8 | If `art_refresh_required: YES`: all active artifact references re-checked and corrected against updated ART | | |
| 3.9 | If `art_refresh_required: YES`: `art_refresh_completed: YES` set in YAML | | |

**Triggering events occurred**: `[ ]` YES — items 3.6–3.9 must all be ✓  
                                 `[ ]` NO  — items 3.6–3.9 are N/A

**Section 3 completion**: `[ ]` Renumber/refresh trigger check COMPLETE

---

## Section 4: Final Declaration

```
Liaison Mini-Ceremony Checklist Final Declaration
=================================================
Wave / Job: ___________________________
Session: ______________________________
Date: _________________________________
Completed By: governance-liaison-isms-agent (or: ____________)

Section 1 — ART Population:               [ ] COMPLETE  [ ] EXCEPTIONS NOTED (see below)
Section 2 — 5-Point Spot-Check:           [ ] COMPLETE  [ ] EXCEPTIONS NOTED (see below)
Section 3 — Renumber/Refresh Trigger:     [ ] COMPLETE  [ ] N/A (no trigger events)

Exceptions declared (if any):
_______________________________________________

ART fully populated from system-of-record:   [ ] YES
All spot-checks PASS (or N/A with reason):   [ ] YES
Renumber/refresh confirmed:                  [ ] YES (no trigger) / [ ] YES (actioned) / [ ] BLOCKED

LIAISON MINI-CEREMONY CHECKLIST STATUS: [ ] COMPLETE  [ ] BLOCKED — REASON: _______
```

---

## References

- `governance/templates/liaison-mini-ceremony-pack.md` v1.0.0 — template to copy and populate
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.7.0 — §4.3f (ART Verification Gate — Check M, Check N)
- `governance/checklists/execution-ceremony-admin-anti-patterns.md` v1.5.0 — AAP-23, AAP-24
- `governance/checklists/execution-ceremony-admin-reconciliation-matrix.md` v1.1.0 — R18
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.11.0 — ACR-17

---

*Version: 1.0.0 | Effective: 2026-04-21 | Authority: CS2 (Johan Ras) — wave admin-ceremony-hardening-20260421*
