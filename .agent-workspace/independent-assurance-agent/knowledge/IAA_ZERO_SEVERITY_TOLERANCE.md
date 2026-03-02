# IAA Zero-Severity-Tolerance Policy — Tier 2 Operational Note

**Agent**: independent-assurance-agent
**Version**: 1.0.0
**Status**: ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Effective**: 2026-03-02
**Canon Reference**: `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` §Zero-Severity-Tolerance Rule (v1.1.0)

---

## Purpose

This document operationalises the Zero-Severity-Tolerance Rule from the IAA canon for all agents executing
assurance checks. It provides the prohibited language table, machine-readable decision logic, exception
procedure, and enforcement guidance.

---

## The Rule (Non-Negotiable)

> **Any finding, of any kind, regardless of perceived severity, wording, or delivery size, MUST produce
> a `REJECTION-PACKAGE`. There are no exceptions except an explicit written CS2 waiver.**

This rule is absolute. It cannot be:
- Downgraded by describing a finding as "minor", "trivial", or "cosmetic"
- Soft-passed based on delivery size or complexity
- Waived by any agent, foreman, builder, or governance-admin
- Overridden by "delivery-appropriate depth" calibration (depth applies to evidence format, never to finding tolerance)

---

## Machine-Readable Decision Logic

```
IF finding.exists == TRUE
THEN verdict = REJECTION-PACKAGE
REGARDLESS OF finding.perceived_severity
```

Equivalently:

```
findings = collect_all_findings(pr_artifacts)
IF len(findings) > 0:
    return REJECTION-PACKAGE(findings=findings)
ELSE:
    return ASSURANCE-TOKEN()
```

There is no conditional path that returns `ASSURANCE-TOKEN` when `findings` is non-empty.

---

## Prohibited Language Table

The following terms MUST NOT be used to characterise a finding as passable in any IAA output.
Using these terms to dismiss or downgrade a finding is itself a governance violation (INC-ZST-001).

| Prohibited Term | Reason | Correct Behaviour |
|-----------------|--------|-------------------|
| "minor" | Implies the finding is passable | Issue `REJECTION-PACKAGE` with finding listed |
| "trivial" | Implies the finding is passable | Issue `REJECTION-PACKAGE` with finding listed |
| "cosmetic" | Implies the finding is passable | Issue `REJECTION-PACKAGE` with finding listed |
| "small" | Implies the finding is passable | Issue `REJECTION-PACKAGE` with finding listed |
| "negligible" | Implies the finding is passable | Issue `REJECTION-PACKAGE` with finding listed |
| "low-impact" | Implies the finding is passable | Issue `REJECTION-PACKAGE` with finding listed |
| "acceptable finding" | Explicit bypass of zero-tolerance | Issue `REJECTION-PACKAGE` with finding listed |
| "soft-pass" | Explicit bypass of zero-tolerance | Issue `REJECTION-PACKAGE` with finding listed |
| "can be addressed post-merge" | Defers finding beyond merge gate | Issue `REJECTION-PACKAGE` with finding listed |
| "does not block merge" (for a finding) | Explicit bypass | Issue `REJECTION-PACKAGE` with finding listed |

**Note**: These terms may appear in the `Remediation Required` section of a `REJECTION-PACKAGE` to
describe what the submitting agent needs to fix. The prohibition is against using them to *dismiss*
or *downgrade* a finding's blocking status.

---

## What Constitutes a "Finding"

A finding is any observation that represents a deviation from the expected standard, including:

- Missing required artifact or field
- Incorrect or placeholder content in any delivered artifact
- Process boundary violation (e.g., inline suggestions, BOOTSTRAP DIRECTIVE skip)
- Agent integrity mismatch (contract file hash differs from reference baseline)
- Evidence that does not corroborate the stated gate result
- Any CORE-* or OVL-* check from the Tier 2 checklist that cannot be verified as PASS
- Any deviation from canon-mandated format, structure, or content

A finding does **not** include:
- An observation that a check passed (obviously)
- An informational note with no bearing on any check
- A suggestion parked in the correct location (parking station) — this is correct behaviour

---

## Exception Procedure

The **only** valid exception to Zero-Severity-Tolerance is an explicit written CS2 waiver.

**Waiver requirements**:
1. CS2 (@APGI-cmy) must post an explicit comment on the specific PR naming the specific finding
2. The comment must explicitly state the waiver: e.g., "I waive finding [description] for PR #NNN"
3. The IAA output must quote the waiver verbatim in the `REJECTION-PACKAGE` output
4. Even with a waiver, the `REJECTION-PACKAGE` structure is used — the finding is listed with the waiver quoted
5. CS2 then approves the PR with the REJECTION-PACKAGE + waiver on record

No other party may grant a waiver. A waiver from any party other than CS2 is not valid and does not
permit ASSURANCE-TOKEN to be issued.

---

## FAIL-ONLY-ONCE Breach Pattern: INC-ZST-001

Any IAA output that uses prohibited language to characterise a finding as passable, or that issues
`ASSURANCE-TOKEN` when findings exist, constitutes an INC-ZST-001 breach.

**INC-ZST-001 detection criteria**:
- `ASSURANCE-TOKEN` issued when one or more findings exist in the review
- Any prohibited-language term used to dismiss or downgrade a finding's blocking status
- Finding described as "passable", "acceptable", or "not blocking" without explicit CS2 waiver

**INC-ZST-001 response**:
1. Record in IAA FAIL-ONLY-ONCE registry
2. Retroactively reissue `REJECTION-PACKAGE` for the affected PR
3. Escalate to CS2 for governance breach review

---

## Relationship to Delivery-Appropriate Depth

"Delivery-appropriate depth" (IAA canon §IAA Intelligence-Led Reasoning) means the IAA calibrates
the **quantity and format of expected evidence artifacts** to the delivery scope.

- A trivial syntax-fix PR may require less elaborate phase proof than a core architectural change
- A documentation-only PR may require fewer evidence artifacts than a multi-wave deliverable

**This calibration NEVER affects finding tolerance.** Whether the PR is a single-character fix or
a 50-file architectural change, any finding triggers `REJECTION-PACKAGE`.

The two principles are orthogonal:
- Delivery-appropriate depth → how much evidence is sufficient
- Zero-severity-tolerance → what happens when a finding exists (always: REJECTION-PACKAGE)

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-03-02 | Initial creation — operationalises Zero-Severity-Tolerance Rule from canon v1.1.0 amendment |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
**Canon Reference**: `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` §Zero-Severity-Tolerance Rule
