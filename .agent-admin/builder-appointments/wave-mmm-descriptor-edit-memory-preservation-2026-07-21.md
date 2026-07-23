# Builder Appointment — MMM Descriptor Edit Memory Preservation Hotfix

Issue: #1940
Wave: `wave-mmm-descriptor-edit-memory-preservation-2026-07-21`
Builder: `ui-builder`
Status: appointed for bounded implementation

## Scope

Correct the Criteria Management descriptor edit state flow so editing one maturity level never replaces other persisted maturity descriptor values with blanks.

The builder is authorised to:

- seed local descriptor drafts from all persisted descriptor rows before applying the first edit;
- keep Maturion learning consent as metadata/state only, with no descriptor-content mutation;
- preserve the existing save-before-regenerate protection for complete five-level descriptor sets;
- provide an incomplete-record recovery path that preserves all non-empty and user-edited levels while filling only missing levels during regeneration;
- add focused regression tests in the existing MMM domain workflow test suite.

## Explicit prohibitions

Do not:

- hard-code criterion `D001.MPS002.C006`, DCC, RACI wording, screenshots, or a maturity level;
- weaken the five-level save validation;
- modify descriptor relevance/ranking logic;
- modify Supabase schema or descriptor-save edge functions;
- modify workflows, gates, `.github/agents`, Vercel configuration, approval workflow, or unrelated modules.

## Required outcome

A user editing one descriptor can accept or decline Maturion learning without losing any other descriptor text. An incomplete historical criterion can regenerate only its missing levels while retaining the edited level, after which all five descriptors can be saved normally.
