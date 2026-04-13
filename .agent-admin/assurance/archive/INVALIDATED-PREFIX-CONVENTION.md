# INVALIDATED- Prefix Convention for IAA Token Files

**Version**: 1.0.0
**Date**: 2026-03-18
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Tracking**: GOV-CONCERN-B (parking station follow-up — PR #1144)

---

## Purpose

When an IAA token file in `.agent-admin/assurance/` is superseded by a later invocation round
(R2, R3, etc.), the original file must be marked with the `INVALIDATED-` prefix to prevent
confusion about which token is authoritative. This convention applies to **pre-committed token
files that were later superseded** — it does NOT apply to rejection packages (those are retained
as-is as historical records).

---

## When to Apply the INVALIDATED- Prefix

Apply the `INVALIDATED-` prefix when **all** of the following conditions are true:

1. An IAA token file was committed to the repository.
2. A subsequent IAA invocation (R2, R3, etc.) for the **same PR or session** issued a new,
   superseding token with a different round suffix (e.g., `-R3-`).
3. The original token is no longer the authoritative verdict for that PR or session.

**Do NOT apply** for:
- Rejection packages (`iaa-rejection-*`) — these are retained as historical evidence.
- Tokens for completed and merged PRs — archive as-is; INVALIDATED- prefix is only for
  tokens that could cause merge confusion in an open or draft PR.

---

## How to Invalidate a Token File

1. **Rename** the file using `git mv`:
   ```
   git mv .agent-admin/assurance/iaa-token-<old>.md \
          .agent-admin/assurance/INVALIDATED-iaa-token-<old>.md
   ```

2. **Add an invalidation header** at the top of the renamed file (before the original content):
   ```markdown
   # ⚠️ INVALIDATED — Superseded by <new-token-reference>

   **Invalidation reason**: <reason>
   **Valid token**: `<new-token-ref>` — file: `<new-token-filename>`
   **Invalidated by**: <agent-id> session-NNN (GOV-CONCERN-B or reason, YYYY-MM-DD)
   **Convention**: `INVALIDATED-` prefix per `.agent-admin/assurance/INVALIDATED-PREFIX-CONVENTION.md`

   ---

   ```
   *(then preserve the original file content below the `---` separator)*

3. **Update any PREHANDOVER proof** that referenced the old token reference ID to note the
   supersession, per append-only rules (do not edit original PREHANDOVER proof — add a
   separate addendum note if needed).

4. **Commit** the renamed file as part of the governance cleanup PR.

---

## Naming Pattern

| Before invalidation | After invalidation |
|---|---|
| `iaa-token-session-048-wave048-20260318.md` | `INVALIDATED-iaa-token-session-048-wave048-20260318.md` |
| `iaa-token-session-NNN-waveY-YYYYMMDD.md` | `INVALIDATED-iaa-token-session-NNN-waveY-YYYYMMDD.md` |

The `INVALIDATED-` prefix is always added at the **start** of the filename. The original
filename is preserved in full after the prefix.

---

## Automation Guidance

To avoid manual errors, the Foreman's wave reconciliation checklist
(`.agent-workspace/foreman-v2/knowledge/wave-reconciliation-checklist.md`) should include a
check:

> **B-3 (optional). Token file audit**: If the current wave generated multiple IAA invocation
> rounds (R2, R3, etc.), confirm that any superseded token files in `.agent-admin/assurance/`
> have been renamed with the `INVALIDATED-` prefix before this wave's PR is opened.

CI automation for detecting un-invalidated stale tokens is a planned enhancement. Until
automated: Foreman or CodexAdvisor verifies manually at wave close.

---

## Examples

- `INVALIDATED-iaa-token-session-048-wave048-20260318.md` — original PHASE_A_ADVISORY token
  for session-048, superseded by R3 (`iaa-token-session-048-R3-wave048-20260318.md`) when
  PHASE_B_BLOCKING standard was activated.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Living Agent System**: v6.2.0
**Governed by**: AGENT_HANDOVER_AUTOMATION.md v1.1.3 §4.3b (artifact immutability)
