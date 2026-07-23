# MMM Descriptor Edit Memory Preservation and Incomplete-Level Recovery — QA-to-RED

Issue: #1940
Wave: `wave-mmm-descriptor-edit-memory-preservation-2026-07-21`
Status: executable acceptance authority for the bounded hotfix

## Failure being closed

When the first local edit is made for a criterion whose persisted descriptor set is incomplete, `handleDescriptorDraftChange()` currently creates five blank local drafts and writes only the selected level. The remaining persisted values are therefore lost from the UI state. Save then fails because five populated levels are required, while regeneration is blocked because the user has unsaved edits.

## Required executable tests

### T-MMM-DMEM-001 — First edit preserves persisted levels

Given a criterion has persisted descriptor rows for multiple maturity levels and no local draft exists,
when one level is edited,
then the local draft must contain all five level slots,
and every persisted non-edited descriptor must remain unchanged.

### T-MMM-DMEM-002 — Learning consent never mutates descriptor content

Given a descriptor was edited,
when the user selects either `Yes, record it` or `No, just save the edit`,
then only consent state changes,
and all descriptor text values remain byte-for-byte unchanged.

### T-MMM-DMEM-003 — Complete set still blocks destructive regeneration

Given all five descriptors are populated and at least one has an unsaved edit,
when regeneration is requested,
then regeneration remains blocked with the existing save-first warning,
and no descriptor value changes.

### T-MMM-DMEM-004 — Incomplete historical record can recover missing levels

Given fewer than five persisted descriptors exist,
and the user has edited a non-empty level,
when regeneration is requested,
then generated drafts may fill only missing or empty levels,
and every existing non-empty level, including the edited level, must be preserved.

### T-MMM-DMEM-005 — Recovery produces a saveable five-level set

After incomplete-level recovery,
all Basic, Reactive, Compliant, Proactive and Resilient descriptors must be populated,
and the save request must contain exactly five descriptors,
with only genuinely edited levels included in `edited_levels` for learning capture.

### T-MMM-DMEM-006 — Generic implementation

The patch and tests must contain no production branch keyed to:

- `D001.MPS002.C006`;
- `DCC`;
- `RACI`;
- screenshot wording;
- Basic or any other single maturity level.

## Permitted implementation area

- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`

## Non-scope

No descriptor-learning relevance changes, database/schema changes, edge-function changes, workflow/gate changes, approval workflow changes, or unrelated module work.
