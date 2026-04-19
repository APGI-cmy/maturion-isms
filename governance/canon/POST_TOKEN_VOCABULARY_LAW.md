# POST_TOKEN_VOCABULARY_LAW

**Status**: CANONICAL | **Version**: 1.1.0 | **Authority**: CS2  
**Date**: 2026-05-01  
**Amended**: 2026-05-01 — v1.1.0: Added D-10a (awaiting ASSURANCE-TOKEN), D-15 (ASSEMBLY_TIME_ONLY block); expanded detection regex to cover D-01–D-12 and D-15 (regex-detectable patterns); clarified D-13/D-14 are structural and reviewed at Foreman QP / IAA layers; updated Section 4 with explicit ASSEMBLY_TIME_ONLY enforcement rule and ECAP G-6 gate reference; updated Section 5 enforcement table with failure actions for all 3 layers; authority: CS2 — Post-Token Normalization Hardening gap-close.  
**Effective**: 2026-05-01  
**Authority Reference**: CS2 (Johan Ras) — Post-Token Final-State Normalization Hardening

---

## Purpose

This document defines the **canonical boundary** between wording that is lawful **before** final assurance is issued (pre-final wording) and wording that is **required** after final assurance is issued (post-token wording). It is a vocabulary law: the presence of any DENYLIST entry in a committed final-state artifact once the branch claims final assurance is an unconditional auto-fail condition (AAP-17 / ACR-09).

This document is referenced by:
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` §4.3e Check C2 and Check H
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` ACR-09 / ACR-10
- `governance/checklists/execution-ceremony-admin-anti-patterns.md` AAP-17 / AAP-18 / AAP-19

---

## Section 1: Pre-Final-Only Wording (DENYLIST)

The following phrases are **DENYLIST** entries. They are legal in a draft or template before final assurance is issued. They become **unconditionally illegal** in any committed final-state artifact once the branch claims final assurance (ASSURANCE-TOKEN issued, merge permitted, final_state: COMPLETE, Stage 9 unblocked, or equivalent).

| # | Denylist Phrase / Pattern | Notes |
|---|--------------------------|-------|
| D-01 | `to be completed by Foreman after receiving ASSURANCE-TOKEN` | Assembly-time placeholder; must be replaced with actual completion record |
| D-02 | `to be completed by Foreman` (any variant) | Assembly-time placeholder |
| D-03 | `FOREMAN ACTION REQUIRED` | Pre-final action flag; must not persist in committed final-state artifacts |
| D-04 | `paste verbatim raw IAA output here` | Template instruction; must be replaced with actual IAA response |
| D-05 | `paste verbatim` (in any IAA response section) | Template instruction remnant |
| D-06 | `IAA assurance pending (Phase 4)` | Pre-final status; must be replaced with PASS or REJECTION-PACKAGE result |
| D-07 | `IAA assurance pending` (any variant) | Pre-final status |
| D-08 | `pending Phase 4` | Pre-final phase marker |
| D-09 | `Phase 4 pending` | Pre-final phase marker |
| D-10 | `awaiting token` | Pre-final state marker |
| D-10a | `awaiting ASSURANCE-TOKEN` | Pre-final state marker (explicit variant) |
| D-11 | `after receiving token` | Pre-final contingency phrase |
| D-12 | `before committing this proof` | Template assembly instruction |
| D-13 | Blank / empty `IAA Agent Response (verbatim)` field | Field left blank or with only instruction prose — actual IAA response required |
| D-14 | Stage-readiness rows with free-text mixed-status wording (e.g., `IAA pending — TBD`) | Mixed pre/post-final status in a stage-readiness table |
| D-15 | `ASSEMBLY_TIME_ONLY` (surviving template instruction block) | Template block not removed before final committed artifact is produced; any `<!-- ASSEMBLY_TIME_ONLY: ... -->` block surviving in a committed final-state artifact is a hardened defect signal |

> **Detection regex** (case-insensitive — shared constant `PRE_FINAL_REGEX` in `§4.3e` gate script; covers D-01 through D-12 and D-15):  
> `to be completed by Foreman|FOREMAN ACTION REQUIRED|paste verbatim raw IAA|paste verbatim|IAA assurance pending|pending Phase 4|Phase 4 pending|awaiting token|awaiting ASSURANCE-TOKEN|after receiving token|before committing this proof|ASSEMBLY_TIME_ONLY`
>
> **Note:** D-13 (blank / empty "IAA Agent Response (verbatim)" field) and D-14 (mixed-status stage-readiness wording) require structural inspection and are enforced at the Foreman QP checkpoint and IAA review layers rather than by this regex.

---

## Section 2: Post-Token-Only Wording (REPLACEMENT REQUIREMENTS)

Once final assurance is issued, **all** of the following replacement requirements apply to committed final-state artifacts. These are not optional improvements — they are mandatory substitutions for the corresponding DENYLIST entries.

| DENYLIST Entry | Required Post-Token Replacement |
|---------------|--------------------------------|
| D-01 / D-02 / D-03 | `ASSURANCE-TOKEN issued: [token-ref]` — record the actual token reference or completion statement |
| D-04 / D-05 / D-13 | `IAA Agent Response (verbatim): [actual committed response text]` — paste the actual IAA response without modification |
| D-06 / D-07 | One of: `ASSURANCE-TOKEN issued: [ref]` or `REJECTION-PACKAGE issued: [ref] — [summary]` |
| D-08 / D-09 | `Stage X: COMPLETE — [description of completion]` |
| D-10 / D-11 / D-12 | `final_state: COMPLETE` or `merge permitted subject to CS2 approval` |
| D-14 | Stage-readiness rows must show exactly one of two forms: **PRE-TOKEN** (with explicit `[PRE-TOKEN]` marker) or **POST-TOKEN** (with final result, e.g., `Stage 9: COMPLETE — ASSURANCE-TOKEN issued`) |

Additional post-token wording requirements:
- `final_state: COMPLETE` — required in PREHANDOVER proof once PASS is obtained
- `merge permitted subject to CS2 approval` — required wording when releasing the merge gate
- `Stage 9 unblocked upon CS2 merge` — required stage-readiness wording after token

---

## Section 3: Normalization Requirement

**Replacement, not deletion**: Placeholder instruction text must be **replaced with final truth**. Deleting a DENYLIST phrase and leaving a blank field is not acceptable — it creates an empty final-state field which is its own defect (D-13).

**Blank "verbatim response" sections**: A blank `IAA Agent Response (verbatim)` section (or one containing only instruction prose) is not acceptable once a PASS is claimed. The actual verbatim IAA response must be pasted.

**"Pending" wording in stage-readiness tables**: Any `pending`, `TBD`, or equivalent provisional wording in stage-readiness tables must be rewritten to show the definitive final state. Partial completion is not a valid final state.

**ASSEMBLY_TIME_ONLY blocks in templates**: Templates may use `<!-- ASSEMBLY_TIME_ONLY: ... -->` blocks to mark pre-final instruction text. These blocks must be **removed** before the final committed artifact is produced. A committed final-state artifact must not contain any `ASSEMBLY_TIME_ONLY` block.

---

## Section 4: Template Design Rule

Templates that contain pre-final instruction prose must enclose that prose in clearly removable `ASSEMBLY_TIME_ONLY` blocks so that agents and tooling can detect and enforce removal before final handback.

**Required format for template instruction blocks**:
```markdown
<!-- ASSEMBLY_TIME_ONLY: [instruction text here]. This block must be removed and replaced with the actual content before the final artifact is committed. Leaving this block in place in a committed final-state artifact is an AAP-17 violation and will fail §4.3e Check C2. -->
```

**Enforcement**: The `§4.3e` gate script (Check C2 and Check H) scans for the literal string `ASSEMBLY_TIME_ONLY` in all final-state artifacts. Any committed final-state artifact containing this string after final assurance is claimed **will fail the gate**. This makes template misuse conspicuous and machine-detectable.

**Final-state templates** must use substitution fields (e.g., `{actual_iaa_response}`) rather than prose reminders. Prose reminder blocks signal that the document may never have been completed — they are structural tells for the AAP-17 defect pattern.

**What ECAP must do before bundle return**: Search all draft bundle artifacts for `ASSEMBLY_TIME_ONLY` blocks. Any surviving block must be replaced with final content before the bundle is returned to Foreman. This is now enforced at G-6 in the ECAP bundle-checklist.

---

## Section 5: Enforcement Points

| Enforcement Layer | Location | Check | Failure Action |
|------------------|----------|-------|---------------|
| ECAP pre-return gate | `AGENT_HANDOVER_AUTOMATION.md` §4.3e Check C2 | Machine scan: grep `PRE_FINAL_REGEX` (D-01–D-12, D-15 — regex-detectable) against all non-superseded final-state artifacts; **gated behind final-assurance-claimed state** (no-op on pre-token branches); D-13/D-14 reviewed at Foreman QP | BLOCKING — bundle returned to ECAP; IAA must not be invoked |
| ECAP pre-return gate | `AGENT_HANDOVER_AUTOMATION.md` §4.3e Check H | Machine scan: cross-artifact consistency — if any non-superseded artifact claims final assurance, all non-superseded artifacts must be post-token | BLOCKING — bundle returned to ECAP |
| ECAP pre-return gate | `AGENT_HANDOVER_AUTOMATION.md` §4.3e Check I | Machine-assisted: flag "carried forward" claims without declared canonical source reference | BLOCKING — requires Foreman manual parity check before IAA |
| ECAP bundle-checklist | `.agent-workspace/execution-ceremony-admin-agent/knowledge/bundle-checklist.md` G-6 | Pre-assembly gate: no pre-final instruction wording / ASSEMBLY_TIME_ONLY blocks in any bundle artifact | HALT — return to Foreman before bundle assembly continues |
| Foreman QP checkpoint | `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` §14.6 | Human review: Post-Token Normalization Checkpoint (6 checks) in `FOREMAN_ADMIN_READINESS_HANDBACK.template.md` | REJECTED — return bundle to ECAP |
| IAA assurance layer | `INDEPENDENT_ASSURANCE_AGENT_CANON.md` ACR-09 | Binary reject if any denylist phrase (incl. ASSEMBLY_TIME_ONLY) present in final-state artifact while branch claims assurance | REJECTION-PACKAGE — merge blocked |
| IAA assurance layer | `INDEPENDENT_ASSURANCE_AGENT_CANON.md` ACR-10 | Binary reject if cross-artifact inconsistency detected (one artifact PASS, another pending/pre-final) | REJECTION-PACKAGE — merge blocked |
| IAA assurance layer | `INDEPENDENT_ASSURANCE_AGENT_CANON.md` ACR-11 | Binary reject if "carried forward" claim diverges from cited canonical source in ownership/gate authority | REJECTION-PACKAGE — merge blocked |

---

## Section 6: References

- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.5.1 — §4.3e PRE_FINAL_REGEX (shared denylist), Check C2, Check H, Check I
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.7.0 — ACR-09, ACR-10, ACR-11
- `governance/checklists/execution-ceremony-admin-anti-patterns.md` v1.2.0 — AAP-17, AAP-18, AAP-19
- `governance/templates/execution-ceremony-admin/FOREMAN_ADMIN_READINESS_HANDBACK.template.md` — Post-Token Normalization Checkpoint
- `governance/templates/iaa-wave-record.template.md` — §3.2 ASSEMBLY_TIME_ONLY marker
- `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` v1.1.0 — §3.5

---

*Authority: CS2 (Johan Ras) | Version: 1.1.0 | Effective: 2026-05-01 | Amended: 2026-05-01 (v1.1.0)*
