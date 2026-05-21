# PREHANDOVER Proof — session-make-producer-stop-guidance-explicit-20260521

**Session ID**: session-make-producer-stop-guidance-explicit-20260521
**Date**: 2026-05-21
**Agent Version**: Copilot coding agent (governed, targeted clearance)
**Issue Ref**: maturion-isms#1718 — Inject producer next-action guidance on every Copilot PR push before handover
**PR**: #1735
**Wave**: make-producer-stop-guidance-explicit
**Branch**: copilot/make-producer-stop-guidance-explicit
**Pre-handover HEAD SHA**: CURRENT_HEAD
CURRENT_HEAD_SHA: CURRENT_HEAD

---

## Wave Description

Targeted fix PR addressing three review comments on the producer next-action guidance hardening
work (wave: inject-next-action-guidance, PR #1733 follow-up). All changed files are in
`.github/` supervision scope — no production source code, database, or deployment changes.

ADMIN_PASS: yes
ECAP_REQUIRED: no
ECAP_NOT_REQUIRED: yes — all changed files are .github/ supervision/governance scope
ADMIN_CEREMONY_COMPLIANCE: PASS
HANDOVER_ALLOWED: no (blocked pending IAA final assurance and CodeQL rerun per CS2 comment)

---

## Fixes Included

1. Heredoc indentation — `cat <<'JSON'` with indented delimiter replaced with `printf '%s\n'`
   in the advisory-unavailable branch of `producer-next-action-guidance.yml`.
2. Grammar fix — step name corrected to "advisory unavailable due to rate limit".
3. fetchFile/fetchDirectory short-circuit — `if (advisoryUnavailable) return;` guard added.

---

## Evidence

- workflow Preflight Evidence Gate: success on head b819aa34c2c68e4cdfe9a1ddd6bca3e4fc7df2f4 — actions/runs/26231847057
- local command output: bash .github/scripts/producer-next-action-guidance.test.sh — Passed 17, Failed 0
