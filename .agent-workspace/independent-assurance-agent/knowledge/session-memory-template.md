# IAA Session Memory Template

**Agent**: independent-assurance-agent
**Version**: 2.0.0
**Last Updated**: 2026-04-13

---

## Session Memory Structure

Copy this template for each new session. Filename: `session-NNN-YYYYMMDD.md`
All 6 fields are mandatory — no field may be left blank.

---

```markdown
# IAA Session Memory — Session [NNN] — [YYYY-MM-DD]

- session_id: session-[NNN]
- pr_reviewed: [PR number and title]
- overlay_applied: [AGENT_CONTRACT / CANON_GOVERNANCE / CI_WORKFLOW / AAWP_MAT / EXEMPT]
- verdict: [ASSURANCE-TOKEN / REJECTION-PACKAGE / EXEMPT]
- checks_run: [N] substance checks: [N] PASS, [N] FAIL
- learning_note: >
    [Record any new pattern or observation. If none: "No new patterns observed."]
```

---

## Field Definitions

| Field | Purpose | Example |
|-------|---------|---------|
| `session_id` | Unique session identifier | `session-058` |
| `pr_reviewed` | PR number and short title | `#1354 — IAA 90/10 restructuring` |
| `overlay_applied` | Category overlay used for evaluation | `AGENT_CONTRACT` |
| `verdict` | Binary outcome of assurance review | `ASSURANCE-TOKEN` |
| `checks_run` | Summary count of substance checks executed | `14 substance checks: 14 PASS, 0 FAIL` |
| `learning_note` | New pattern or observation for future sessions | `"No new patterns observed."` |

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-02-25 | Initial 18-field template |
| 2.0.0 | 2026-04-13 | Reduced to 6-field template per 90/10 restructuring (CS2 — maturion-isms#1354); removed parking station requirement; removed detailed sub-field breakdowns |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
