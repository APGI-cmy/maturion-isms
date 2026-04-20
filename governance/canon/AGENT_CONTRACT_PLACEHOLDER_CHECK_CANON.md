# Agent Contract Placeholder-Check Exception Classes Canon

**Version**: 1.0.0
**Effective Date**: 2026-04-19
**Authority**: CS2 (Johan Ras) — Issue #1349
**Status**: ACTIVE
**Binding Repos**: All repos consuming governance from `APGI-cmy/maturion-foreman-governance`
**Review Cadence**: On canonical change or when a new exception phrase is proposed

---

## 1. Purpose

This canon defines the **bounded, reviewable model** for when placeholder-like terms (`stub`,
`placeholder`, `TBD`, `TODO`) may be ignored in agent-contract validation.

Without a canonical classification model, validation workflows accumulate ad hoc allowlist phrases
that are hard to review, hard to reason about, and easy to over-broaden over time. This creates three
concrete risks:

1. **False positives** — legitimate checker meta-language is flagged as incomplete content
2. **False negatives** — exemptions become too broad and real unresolved content slips through
3. **Review drift** — new exceptions are added without a principled category model

This canon resolves those risks by naming the exception classes, not just the phrases.

---

## 2. Governing Rule

> Placeholder detection may ignore terms only when they appear as **governed meta-language** describing
> validation logic, negative assertions, or checklist/template structure — **never** when they function
> as unresolved content.

This rule is the single test for every exception claim. Reviewers must be able to answer:
- Which canonical exception class justifies this exemption?
- Is the matched text really governed meta-language?
- Would the same exemption accidentally hide real unresolved content elsewhere?

If any of those questions cannot be answered confidently, the exemption must be rejected or narrowed.

---

## 3. Scope

**In scope**:
- Agent-contract files (`.github/agents/*.md`, `.agent`, `.agent.md`)
- Validation workflows and scripts that check agent-contract content for placeholder-like terms
- Consumer repos that inherit this governance and implement their own placeholder-check logic

**Out of scope**:
- Blanket weakening of placeholder detection across other file types
- Exception classes for non-agent-contract artefacts (learning files, build outputs, etc.)
- Broad CI redesign beyond what is needed to bind validation to this canon

---

## 4. Non-Goal

This canon is **not** a general-purpose allowlist for arbitrary placeholder text.

Its purpose is narrow and bounded: define the class model for governed meta-language in
agent-contract validation only. Every exception class in this canon must remain narrow enough
that a single poorly-phrased exemption regex could not accidentally suppress a real defect.

---

## 5. Exception Classes — Permitted Mentions

The following five exception classes define the full set of permitted mentions of placeholder-like
terms in agent-contract content. Workflows must map every exemption to a named class.

### EXC-001 — Governance Condition Descriptions

**What it is**: Text within an agent contract that describes the **state** of a validation condition,
a failure mode, or a governance trigger — not the unresolved status of the contract itself.

**Why it is allowed**: Agent contracts legitimately describe what happens when placeholder hashes,
stub content, or TBD states are detected in the system. The contract is describing the detection
logic, not failing to complete its own content.

**Representative examples** (text that should NOT be flagged):
```
- "CANON_INVENTORY placeholder hashes detected → DEGRADED MODE"
- "Detect degraded alignment state when PUBLIC_API hashes are placeholder/truncated"
- "If TBD state is reached, halt and escalate to CS2"
- "stub markers in canon are treated as incomplete and must be resolved before merge"
```

**What would still be invalid** within this class:
- An agent contract section that says "Procedure: TBD" without being a description of a detection condition
- A phase body that contains "see stub for details" as actual instructions
- Placeholder hashes used as real hash values in CANON_INVENTORY references

---

### EXC-002 — Checker or Output Template Strings

**What it is**: Controlled output messages used by the agent to **report** validation results —
e.g., lines that the agent prints when it detects placeholder content in other artefacts.

**Why it is allowed**: A validator must describe the thing it is detecting. An agent contract section
that says "output: 'No placeholder or stub content allowed'" is a validation template, not an
admission of incomplete content.

**Representative examples** (text that should NOT be flagged):
```
- "echo 'No placeholder/stub/TODO content present'"
- "Checker output template: ❌ stub content detected in contract body"
- "Validation message: TBD values are blocked from merge"
- "Report: 'No TBD or placeholder text found in contract'"
```

**What would still be invalid** within this class:
- A checker string that is left incomplete (`output message: TBD`)
- A validation output template that itself contains unresolved placeholder text

---

### EXC-003 — Negative Assertions

**What it is**: A clause that **asserts the absence** of placeholder content — typically in a
checklist item, compliance statement, or verification output.

**Why it is allowed**: Negative assertions are exactly how agents declare compliance. A checklist
item that reads "No placeholder / stub / TODO content" is passing evidence, not a defect.

**Representative examples** (text that should NOT be flagged):
```
- "No placeholder/stub/TODO content: ✅"
- "✅ No stub markers detected in contract body"
- "Contract has no TBD values in required fields"
- "Confirmed: no placeholder content remaining in this contract"
```

**What would still be invalid** within this class:
- A negative assertion that is itself incomplete: "No TBD content ... [see section below]" where the
  referenced section is missing
- A checklist item that reads "No placeholder content: [to be confirmed]"

---

### EXC-004 — Checklist / Gate Labels

**What it is**: Named labels for checklist items, gate identifiers, or structured review items
where the term `placeholder`, `stub`, or `TBD` is part of the gate's own name or category.

**Why it is allowed**: Gate names and checklist labels are fixed vocabulary. A gate named
`OPOJD-placeholder-check` or a checklist item called `[STUB-DETECTION] Step 3` is referencing a
known governance concept, not leaving content incomplete.

**Representative examples** (text that should NOT be flagged):
```
- "Gate: placeholder-check (EXC-004)"
- "OPOJD checklist item: stub-content-detection"
- "QP gate: TBD-value-scan"
- "Checklist step: [PLACEHOLDER-CHECK] Verify no unresolved content"
```

**What would still be invalid** within this class:
- A checklist item that uses the label as a placeholder for the actual step: "Step: TBD"
- A gate name that is itself left unresolved: "Gate: [placeholder for gate name]"

---

### EXC-005 — Canon / Hash-Validation Terminology

**What it is**: Occurrences of `placeholder` when used as a **governed validation concept**
in hash-validation or canon-integrity logic — specifically the concept of "placeholder hash" as
defined in CANON_INVENTORY integrity requirements.

**Why it is allowed**: The term "placeholder hash" is defined canon vocabulary used in
`AGENT_INDUCTION_PROTOCOL.md`, `CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`, and induction
scripts. Flagging it would create false positives in every agent contract that references
alignment gate logic.

**Representative examples** (text that should NOT be flagged):
```
- "Detect placeholder hashes in CANON_INVENTORY.json"
- "PUBLIC_API hashes — select where value == 'placeholder'"
- "PLACEHOLDER_COUNT=$(jq '... | select(. == \"placeholder\" ...)')"
- "placeholder public_api_hash triggers alignment gate failure"
```

**What would still be invalid** within this class:
- An actual hash field value set to the string `placeholder` in a real CANON_INVENTORY.json entry
- A hash-validation script where the expected hash value is left as `placeholder`

---

## 6. Non-Permitted Cases — What Remains Blocking

The following occurrences of placeholder-like terms are **always blocking** and must never be
covered by any exception class:

| Pattern | Example | Why Blocking |
|---------|---------|--------------|
| Unresolved prose in substantive contract content | "Phase 3 — Build Script: TBD" | Incomplete instruction — agent cannot operate |
| Incomplete procedure or rule text | "Enforcement rule: stub — see later version" | Missing enforcement logic |
| Missing artifact path | "Canonical reference: `governance/canon/TODO.md`" | Broken reference |
| Missing examples | "Example: [placeholder]" | Incomplete documentation |
| Missing enforcement logic | "Gate enforcement: TBD" | Non-functional gate |
| Free-text `TBD` not functioning as governed meta-language | "Authority: TBD" | Unresolved governance binding |
| Stub markers indicating incomplete phase body | "PHASE 2: stub" | Non-operable contract |
| Placeholder values in required YAML fields | `agent_version: placeholder` | Invalid contract structure |

**Key test**: If removing the placeholder text would leave the contract section non-operable,
non-auditable, or with a missing governance binding, the occurrence is blocking.

---

## 7. Workflow Binding Model

### 7.1 Binding Rule

Workflows implementing agent-contract placeholder checks **must** map every exempted match to a
named canonical exception class from this document.

```
PERMITTED: exempt match X because it belongs to EXC-003 (Negative Assertion)
PROHIBITED: exempt match X because the phrase seems benign
```

### 7.2 Exception Phrase Management

When a new phrase is proposed for exemption:

1. **Check existing classes first**: Does the phrase fall under EXC-001 through EXC-005?
   - If yes: implement the exemption, document which class it maps to (in a comment).
   - If no: proceed to step 2.

2. **Canon update required**: If no existing class covers the phrase, a new exception class must
   be added to this document via the standard canon-change pathway (CS2-approved issue, PR, ripple).

3. **Never exempt by phrase accumulation**: Exemptions must not grow by adding arbitrary phrases
   to a grep exclusion pattern without a documented class mapping. This is the key structural
   invariant this canon enforces.

### 7.3 Implementation Pattern

Recommended workflow implementation pattern:

```bash
# Check for placeholder content — map exceptions to named canonical classes

PLACEHOLDER_VIOLATIONS=0

while IFS= read -r line; do
  # Skip lines that match a canonical exception class.
  # EXC-001: governance condition descriptions
  if echo "$line" | grep -qiE "(placeholder|stub|TBD).*(hash|detect|trigger|mode|state|escalat|condition|gate)"; then
    continue
  fi
  # EXC-003: negative assertions
  if echo "$line" | grep -qiE "no (placeholder|stub|TBD|TODO) content"; then
    continue
  fi
  # EXC-005: canon hash-validation terminology
  if echo "$line" | grep -qiE "placeholder.*(hash|api)|(hash|api).*placeholder"; then
    continue
  fi
  # ... (additional classes as needed, with comment citing class ID)

  # Flag remaining occurrences as unresolved content
  echo "VIOLATION: $line"
  PLACEHOLDER_VIOLATIONS=$((PLACEHOLDER_VIOLATIONS + 1))
done < <(grep -niE '(^|[^[:alnum:]_])(placeholder|stub|TBD|TODO)([^[:alnum:]_]|$)' "$CONTRACT_FILE" || true)

if [ "$PLACEHOLDER_VIOLATIONS" -gt 0 ]; then
  echo "❌ $PLACEHOLDER_VIOLATIONS unresolved placeholder(s) in contract"
  exit 1
fi
```

### 7.4 Consumer Repo Inheritance

Consumer repos inheriting this canon must:
- Not define their own parallel exception class model
- If a consumer-specific phrase exemption is unavoidable, it must be:
  - Explicitly mapped to a canonical class, or
  - Documented as a bounded local extension with justification
  - Flagged as a candidate for canonical promotion in the next governance wave

---

## 8. Proof of Operation

This section demonstrates that the canon distinguishes correctly between governed meta-language
and genuine unresolved content.

### 8.1 True Positives — Must Still Fail

These are genuine incomplete contract fragments that must remain blocking:

```
FAIL: "Phase 2 Build Script: TBD — complete before activation"
FAIL: "Authority: placeholder — will bind to canon when determined"  
FAIL: "Enforcement rule: [stub] — not yet defined"
FAIL: "Required artifact path: governance/canon/TODO.md"
FAIL: "agent_version: placeholder"
```

**Why**: None of these are governed meta-language. They represent unresolved content that leaves
the contract non-operable. Exempting them would suppress genuine defect detection.

### 8.2 False Positives Eliminated — Governed Meta-Language

These are legitimate agent-contract expressions that should NOT be flagged:

```
PASS: "CANON_INVENTORY placeholder hashes detected → DEGRADED MODE"  ← EXC-001
PASS: "No placeholder/stub/TODO content: ✅"                          ← EXC-003
PASS: "Detect placeholder or TBD values in hash fields"               ← EXC-005
PASS: "Gate: placeholder-check-enforcement"                           ← EXC-004
PASS: "echo 'No stub content detected in contract body'"              ← EXC-002
PASS: "select(. == 'placeholder' or . == 'TBD')"  (JQ snippet)       ← EXC-005
```

**Why**: Each of these is governed meta-language — it describes validation logic, asserts compliance,
names a gate, or uses defined canon vocabulary. None represent unresolved contract content.

### 8.3 Boundary Cases

The following demonstrate where class boundaries matter:

| Text | Class | Verdict | Reason |
|------|-------|---------|--------|
| `Detect placeholder hashes and escalate` | EXC-001 | PASS | Governance condition description |
| `hash: placeholder` in CANON_INVENTORY | — | FAIL | Actual placeholder value in data field |
| `No TBD content present ✅` | EXC-003 | PASS | Negative assertion |
| `TBD: resolve before PR merge` | — | FAIL | Unresolved content marker |
| `Gate name: placeholder-scan` | EXC-004 | PASS | Gate label using canon vocabulary |
| `Gate enforcement: [to be defined]` | — | FAIL | Missing enforcement logic |

---

## 9. Authority and Change Control

### 9.1 Authority

This canon is established under CS2 authority (Johan Ras) via Issue #1349. All semantic changes
to this canon require:
- A CS2-approved GitHub issue
- A PR with a PREHANDOVER proof
- Layer-down ripple to all consumer repos in `CONSUMER_REPO_REGISTRY.json`

### 9.2 Syntactic Corrections

Typo fixes, formatting corrections, and example clarifications that do not alter the class model or
binding rules may be submitted via PR without a separate CS2 issue, subject to standard merge gate
requirements.

### 9.3 Adding a New Exception Class

A new exception class may only be added via:
1. CS2-approved issue describing the new class and providing evidence it is not covered by existing classes
2. Update to this canon document (via PR with PREHANDOVER proof)
3. Layer-down ripple to all consumer repos
4. Consumer repos must update their workflow implementation to reference the new class

### 9.4 Binding Repos

This canon is binding on:
- `APGI-cmy/maturion-foreman-governance` (source)
- `APGI-cmy/maturion-isms` (primary consumer — initial layer-down target)
- `APGI-cmy/maturion-foreman-office-app`
- `APGI-cmy/PartPulse`
- `APGI-cmy/R_Roster`

All repos listed in `governance/CONSUMER_REPO_REGISTRY.json` are binding consumers.

---

## 10. Related Canon

| Canon | Relationship |
|-------|-------------|
| `AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md` | Defines agent contract change authority |
| `AGENT_CONTRACT_FILE_PROTECTION_POLICY.md` | Defines protected file enforcement for agent contracts |
| `CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md` | Defines placeholder hash detection (EXC-005 source) |
| `AGENT_INDUCTION_PROTOCOL.md` | Uses EXC-001 and EXC-005 terminology in wake-up scripts |
| `FAIL-ONLY-ONCE.md` (per-agent) | A-05: prohibits placeholder hashes in CANON_INVENTORY |
| `UNIVERSAL_FAIL_ONLY_ONCE_POLICY.md` | Universal rule source for placeholder-related invariants |

---

*Authority: CS2 (Johan Ras) — Issue #1349 | Canon: AGENT_CONTRACT_PLACEHOLDER_CHECK_CANON.md v1.0.0*
