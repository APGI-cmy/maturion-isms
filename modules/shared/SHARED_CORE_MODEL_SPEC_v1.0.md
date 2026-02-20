# SHARED CORE MODEL SPEC v1.0

**Status:** Draft\
**Date:** 2026-02-20\
**Applies To:** Roadmap, MAT, RADAM, PIT

------------------------------------------------------------------------

## 1. Canonical Structure

Domain → MPS → Criteria

Immutable numbering after approval.

------------------------------------------------------------------------

## 2. Evidence Entity

Fields:

-   id
-   criterion_number
-   type (manual \| upload \| interview \| automated)
-   file_path
-   uploaded_by
-   uploaded_at
-   hash (SHA-256)
-   immutable_flag

------------------------------------------------------------------------

## 3. Scoring Engine

Input:

-   Evidence items
-   Transcript excerpts
-   Automated feeds (RADAM)

Output:

-   Proposed level
-   Confidence score
-   Rationale
-   Gaps to next level

Human confirmation required.

------------------------------------------------------------------------

## 4. AI Governance Metadata

Store:

-   model_name
-   model_version
-   prompt_hash
-   scoring_timestamp
-   override_flag
-   override_reason

------------------------------------------------------------------------

## 5. Cross-Module Compatibility

All modules must use this shared schema for:

-   Structure
-   Evidence
-   Scoring
-   PIT export mapping

------------------------------------------------------------------------

End of Document
