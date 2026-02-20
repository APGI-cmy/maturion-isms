# PIT INTEGRATION CONTRACT v0.1

**Status:** Draft\
**Date:** 2026-02-20\
**Applies To:** Roadmap, MAT

------------------------------------------------------------------------

## 1. Purpose

Defines data contract for sending structured implementation plans to
PIT.

------------------------------------------------------------------------

## 2. Draft Plan Schema

Root object:

-   source_module
-   source_run_id
-   org_id
-   generated_at
-   projects\[\]

Project contains:

-   title
-   objective
-   driver
-   priority
-   estimated_effort
-   estimated_cost_band
-   source_refs\[\]
-   phases\[\]

Tasks must include:

-   title
-   description
-   owner_role_suggestion
-   due_window
-   acceptance_criteria\[\]
-   evidence_required\[\]

All tasks must reference originating criterion number.

------------------------------------------------------------------------

## 3. Sync States

-   not_sent
-   queued
-   sent
-   accepted
-   rejected

------------------------------------------------------------------------

## 4. Governance Requirements

-   Deterministic output
-   Model version stored
-   Prompt hash stored
-   Full traceability to source criteria

------------------------------------------------------------------------

End of Document
