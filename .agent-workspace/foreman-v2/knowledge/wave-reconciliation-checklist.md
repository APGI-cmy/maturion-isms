# Wave Reconciliation Checklist

**Version**: 1.0.0
**Date**: 2026-03-18
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Owner**: foreman-v2-agent (primary) / CodexAdvisor-agent (NBR creation steps)
**Status**: ACTIVE

---

## Purpose

This checklist is executed at **wave close** (Phase 4 — Handover) after all wave builders have
delivered and the PREHANDOVER proof has been committed. It ensures every post-wave observation
is captured in the correct governance registry before the PR is opened.

The checklist is a HANDOVER BLOCKER. A PR may not be opened until all items below are confirmed.

---

## When to Execute

Execute this checklist at **every wave close**, immediately before opening the PR. It is part of
Phase 4 and must be completed after the OPOJD gate and before Step 4.5 (PR open).

**Foreman** runs this checklist and records the completion evidence in the PREHANDOVER proof.

---

## Checklist

### Section A — Incident & Niggle Review

> ⚠️ **MANDATORY** — Foreman must answer each question explicitly. "None observed" is a valid
> answer and must still be stated. An unanswered question is a HANDOVER BLOCKER.

**A-1. Post-wave behavioural incidents (niggles)**

Were any post-wave behavioural incidents ("niggles") observed during this wave?
A niggle is any case where a feature appeared to pass review but exhibited incorrect or
incomplete behaviour from the user's perspective after build — even if the tests were GREEN.

- [ ] **YES** → Go to A-2
- [ ] **NO** → State: "No post-wave behavioural incidents observed in this wave."

**A-2. NBR entry creation (required if A-1 = YES)**

For **each** niggle identified in A-1:

- [ ] Assign next sequential NBR ID (NBR-005, NBR-006, etc.) from
  `.agent-workspace/independent-assurance-agent/knowledge/FUNCTIONAL-BEHAVIOUR-REGISTRY.md`
- [ ] Document the niggle fully: symptom, root cause, code area trigger, and permanent check
- [ ] Set status to ACTIVE
- [ ] Commit the updated FUNCTIONAL-BEHAVIOUR-REGISTRY.md before opening this wave's PR
- [ ] Record each NBR ID created in this wave's PREHANDOVER proof under `## Post-Wave NBR Entries`

**Ownership**: NBR entries are created by CodexAdvisor-agent when the niggle is governance-
related, or by Foreman when the niggle is operational/behavioral. If uncertain → delegate to
CodexAdvisor-agent with the incident description.

**A-3. Liveness status verification**

For each component touched by this wave, verify its status in
`.agent-workspace/liveness/last-known-good.md`:

- [ ] Every touched component shows status `OK` or `MONITORING`
- [ ] No touched component shows status `DEGRADED` (if DEGRADED → block wave PR until resolved)
- [ ] If any component status was updated this wave (incident resolved), confirm `last_checked`
  date reflects today's date

**If the liveness file was not updated during the wave but components changed status** →
trigger the `update-liveness.yml` workflow manually before opening this wave's PR.

---

### Section B — NBR Registry Sync Check

**B-1. FUNCTIONAL-BEHAVIOUR-REGISTRY.md current?**

- [ ] Open `.agent-workspace/independent-assurance-agent/knowledge/FUNCTIONAL-BEHAVIOUR-REGISTRY.md`
- [ ] Confirm all ACTIVE entries have non-template incident dates (i.e., no remaining
  `(template — populate on first real incident)` incident date fields for entries that have
  had real incidents)
- [ ] Confirm "Next Sequential ID" at the bottom matches the next available NBR number

**B-2. IAA aware of new NBR entries?**

If new NBR entries were added this wave:

- [ ] New entries will be automatically applied by IAA at Step 3.1 on the next BUILD/AAWP_MAT PR
- [ ] Record new NBR IDs in PREHANDOVER proof section `## Post-Wave NBR Entries`
- [ ] No explicit IAA notification required — IAA reads the registry file directly

**B-3. Token file invalidation audit (if multiple IAA rounds this wave)**

If this wave triggered more than one IAA invocation round (R2, R3, etc.):

- [ ] Identify all superseded IAA token files in `.agent-admin/assurance/` for this session
- [ ] Rename each superseded file with `INVALIDATED-` prefix using `git mv`
- [ ] Add invalidation header to each renamed file per convention
- [ ] See `.agent-admin/assurance/INVALIDATED-PREFIX-CONVENTION.md` for full procedure
- [ ] If single IAA round only → state: "Single IAA round — no token invalidation required."

---

### Section C — Last Known Good Liveness File

**C-1. Liveness file up to date**

- [ ] Open `.agent-workspace/liveness/last-known-good.md`
- [ ] Confirm `Last Updated` header date reflects the most recent manual or automated update
- [ ] Confirm no component shows `UNKNOWN` status (UNKNOWN = unmonitored risk)
- [ ] If any component is newly `DEGRADED` → open an incident entry in the `## Active Incidents`
  section with today's date before closing this wave

**C-2. Automated liveness update workflow available?**

- [ ] Confirm `.github/workflows/update-liveness.yml` is present and active
- [ ] If a component was deployed successfully this wave, the workflow should have fired
  automatically (check Actions tab for run after deployment)
- [ ] If the workflow did not fire, trigger manually:
  `gh workflow run update-liveness.yml -f component=<name> -f status=OK -f notes="<wave> deployment"`

---

### Section D — Wave Evidence Completeness

**D-1. Evidence bundle**

- [ ] PREHANDOVER proof committed (immutable after commit)
- [ ] Session memory committed
- [ ] Post-wave NBR entries committed (if any incidents observed)
- [ ] Liveness status current (via manual check or workflow run)
- [ ] `wave-current-tasks.md` shows all tasks 🟢 DONE
- [ ] Wave Completion Gate in `wave-current-tasks.md` confirmed

---

## Recording Completion

Add the following block to the PREHANDOVER proof under `## Wave Reconciliation Checklist`:

```markdown
## Wave Reconciliation Checklist

**Executed**: [YYYY-MM-DD]
**Executed by**: [agent-id]

### A — Incident & Niggle Review
- A-1 Post-wave incidents: [YES — see NBR entries below / NO — none observed]
- A-2 NBR entries created: [list NBR IDs, or 'none — no incidents']
- A-3 Liveness verification: [PASS — all touched components OK / DEGRADED — list components]

### B — NBR Registry Sync
- B-1 Registry current: [YES / NO — describe gap]
- B-2 IAA awareness: [N/A (no new entries) / RECORDED — NBR-NNN through NBR-NNN]
- B-3 Token file audit: [Single round — N/A / Multi-round — INVALIDATED- prefix applied to: list files]

### C — Last Known Good Liveness File
- C-1 Liveness file: [CURRENT — last updated YYYY-MM-DD / STALE — updated now]
- C-2 Automated workflow: [FIRED automatically / TRIGGERED manually / NOT applicable]

### D — Evidence Completeness
- D-1 Evidence bundle: [COMPLETE / INCOMPLETE — list missing items]

**Checklist verdict: [PASS — proceed to PR open / BLOCKED — [reason]]**
```

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-03-18 | Initial checklist — CS2 mandate from issue #[wave-19-20-retro] closing post-wave registry and liveness automation gaps identified in PR #1142 review |
| 1.1.0 | 2026-03-18 | WAVE-RECONCIL-001 + GOV-CONCERN-B follow-up: added B-3 (token file invalidation audit); added B-3 evidence field; cross-reference to INVALIDATED-PREFIX-CONVENTION.md |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Governed by**: LIVING_AGENT_SYSTEM v6.2.0
**Used by**: foreman-v2-agent (Phase 4), CodexAdvisor-agent (NBR creation)
**See also**: `.agent-workspace/independent-assurance-agent/knowledge/FUNCTIONAL-BEHAVIOUR-REGISTRY.md`
**See also**: `.agent-workspace/liveness/last-known-good.md`
**See also**: `.github/workflows/update-liveness.yml`
