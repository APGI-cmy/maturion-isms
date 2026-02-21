## 🔴 STOP-AND-FIX — Three Defects Must Be Resolved Before Merge

Per `BUILD_PHILOSOPHY.md` and the Zero Test Debt / Fully Functional Delivery Standard, **this PR is not at 100% delivery**. The three gaps identified during review are defects that must be corrected before merge. There is no "non-blocking" in this system.

---

### Defect 1 — Receipt JSON Is Written But Not Committed

**File**: `.github/workflows/ripple-integration.yml`

**Problem**: The "Record layer-down receipt" step writes `.agent-admin/ripple/layer-down-received-<timestamp>.json` **after** `peter-evans/create-pull-request@v6` has already committed and pushed. The receipt file will be silently lost and will never appear in the ripple PR — the audit trail is broken on every execution.

**Required Fix**: Move the "Record layer-down receipt" step to **before** the "Create ripple PR" step. The corrected order must be:

```
1. Checkout
2. Configure Git
3. Resolve issue number
4. Detect agent file gate
5. Run governance alignment
6. Check diff for agent contracts
7. Determine escalation
8. Collect alignment metadata
9. Create escalation document (if CS2 required)
10. *** Record layer-down receipt *** ← MOVE HERE
11. Create ripple PR
12. Enable auto-merge (if eligible)
13. Comment on issue
```

**Acceptance Criterion**: The `layer-down-received-<timestamp>.json` file MUST appear in the changed files of every ripple PR created by this workflow.

---

### Defect 2 — `draft:` Boolean Expression May Silently Fail

**File**: `.github/workflows/ripple-integration.yml`, "Create ripple PR" step

**Problem**: The `draft:` input is set to:
```yaml
draft: ${{ steps.escalation.outputs.require_cs2 == 'true' }}
```
This expression evaluates to the **string** "true" or "false" — not a YAML boolean. `peter-evans/create-pull-request@v6` may not coerce this correctly, causing the CS2 escalation path to silently create a **normal (non-draft) PR**, bypassing the CS2 merge gate entirely.

**Required Fix**: Split into two explicit separate steps, each with a hardcoded `draft: true` or `draft: false`:

```yaml
      - name: Create ripple PR (standard — no agent files)
        if: steps.align.outputs.drift_detected == 'true' && steps.escalation.outputs.require_cs2 == 'false'
        id: create_pr_standard
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.MATURION_BOT_TOKEN || github.token }}
          draft: false
          title: '[Ripple] Propagate governance layer-down'
          branch: ripple/layer-down-${{ github.run_id }}
          # ... (all other fields identical to current step)

      - name: Create ripple PR (DRAFT — CS2 required)
        if: steps.align.outputs.drift_detected == 'true' && steps.escalation.outputs.require_cs2 == 'true'
        id: create_pr_draft
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.MATURION_BOT_TOKEN || github.token }}
          draft: true
          title: '[Ripple][DRAFT — CS2 Required] Propagate governance layer-down'
          branch: ripple/layer-down-${{ github.run_id }}
          # ... (all other fields identical to current step)

      - name: Resolve PR number
        id: pr_number
        run: |
          NUMBER="${{ steps.create_pr_standard.outputs.pull-request-number }}"
          if [ -z "$NUMBER" ]; then
            NUMBER="${{ steps.create_pr_draft.outputs.pull-request-number }}"
          fi
          echo "number=$NUMBER" >> $GITHUB_OUTPUT
```

Replace all subsequent references to `steps.create_pr.outputs.pull-request-number` with `steps.pr_number.outputs.number`.

**Acceptance Criterion**: When a layer-down issue containing "Agent File Detection Gate" in its body is processed via `workflow_dispatch`, the resulting PR MUST be in DRAFT state. Verify before merge.

---

### Defect 3 — Heredoc Leading Whitespace Produces Malformed Escalation Documents

**File**: `.github/workflows/ripple-integration.yml`, "Create escalation document" step

**Problem**: The `cat > $ESCALATION_FILE <<EOF` heredoc is indented inside the `run:` block. Every line in the committed escalation document will be prefixed with leading spaces, so `#` headings will not render as Markdown headings (they must be at column 0). The escalation inbox documents will be malformed.

**Required Fix**: Remove all indentation from the heredoc content lines. The `cat` and `EOF` marker must be at column 0 within the shell script:

```yaml
      - name: Create escalation document
        if: >
          steps.align.outputs.drift_detected == 'true' &&
          steps.escalation.outputs.require_cs2 == 'true'
        run: |
          DATESTAMP=$(date -u +"%Y-%m-%d")
          INBOX=".agent-workspace/governance-liaison/escalation-inbox"
          mkdir -p "$INBOX"
          ESCALATION_FILE="${INBOX}/agent-contract-ripple-escalation-${DATESTAMP}.md"
          cat > "$ESCALATION_FILE" <<EOF
# Escalation: Agent Contract Ripple — CS2 Approval Required

## Type
BLOCKER

## Description
A governance layer-down triggered a ripple that includes changes to
agent contract files (`.github/agents/*.md`).

Per **CS2_AGENT_FILE_AUTHORITY_MODEL.md** and
**AGENT_CONTRACT_PROTECTION_PROTOCOL.md**, only CS2 (Johan Ras) may
approve and merge changes to agent contracts.

**The ripple PR has been created as DRAFT and must not be merged until
CS2 explicitly approves it.**

## Context
- Session: ripple-integration-${{ github.run_id }}
- Triggered by: Issue #${{ steps.issue.outputs.number }}
- Canonical commit: ${{ steps.metadata.outputs.canonical_commit }}
- Canonical version: ${{ steps.metadata.outputs.canonical_version }}
- Files updated: ${{ steps.metadata.outputs.files_updated }}
- Drift report: ${{ steps.metadata.outputs.drift_report }}

## Recommendation
1. CS2 reviews the DRAFT ripple PR
2. CS2 approves and merges after review
3. Move this file to `escalation-archive/` after resolution

## Evidence
- Drift report: `${{ steps.metadata.outputs.drift_report }}`
- Workflow run: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}

---
Created: ${DATESTAMP} | Authority: CS2 | Session: ${{ github.run_id }}
EOF
          echo "Escalation document created: $ESCALATION_FILE"
```

**Acceptance Criterion**: The committed escalation document must be valid Markdown with all `#` headings at column 0 and no leading whitespace on any line.

---

## Merge Gate Checklist

**DO NOT MERGE until all three are verified ✅:**

- [ ] Defect 1 resolved — receipt JSON appears in ripple PR changed files
- [ ] Defect 2 resolved — CS2 path produces a true DRAFT PR (verified via workflow_dispatch test)
- [ ] Defect 3 resolved — escalation document Markdown is valid (headings at column 0)

---
**Authority**: `BUILD_PHILOSOPHY.md` | `FULLY_FUNCTIONAL_DELIVERY_STANDARD.md` | Zero Test Debt Rule
**Priority**: FM_H — delivery gate, not a suggestion