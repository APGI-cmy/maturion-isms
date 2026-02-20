# ROADMAP MODULE --- APP DESCRIPTION v2.0

**Status:** Draft\
**Owner:** Johan Ras\
**Date:** 2026-02-20\
**Module Role:** Governance Engine\
**Interoperability:** MAT v2, RADAM, PIT

------------------------------------------------------------------------

## 1. Purpose

The Roadmap Module is the governance backbone of the Maturion ISMS
ecosystem. It defines structured maturity architecture and manages
progression toward resilience.

Core responsibilities:

-   Domain → MPS → Criteria configuration
-   AI-assisted criteria generation (where applicable)
-   Evidence evaluation
-   5-level maturity determination
-   3-tier approval governance
-   Import from MAT audits
-   Integration hooks to RADAM (automation)
-   Integration hooks to PIT (implementation execution)

------------------------------------------------------------------------

## 2. Structural Model (Mandatory)

Hierarchy:

1.  Domain\
2.  MPS (Mini Performance Standard)\
3.  Criteria

Numbering: - Domain: 1 - MPS: 1.1 - Criteria: 1.1.1

Numbering immutable after final approval.

------------------------------------------------------------------------

## 3. Criteria Creation Modes

A)  AI Generated (native configuration)\
B)  Import from MAT\
C)  Document import + AI restructuring

All modes must map to shared core schema.

------------------------------------------------------------------------

## 4. Evidence Model

Each criterion supports:

-   Findings
-   Voice recording
-   Photo capture
-   Video capture
-   File upload
-   Interview transcript
-   RADAM automated feeds (future)

Evidence is immutable after upload.

------------------------------------------------------------------------

## 5. Maturity Model (Shared Engine)

Levels:

1.  Basic\
2.  Reactive\
3.  Compliant\
4.  Proactive\
5.  Resilient

Resilient requires automation validation via RADAM.

------------------------------------------------------------------------

## 6. Governance & Approval

-   Level 1: User approval
-   Level 2: Domain approval (dual responsibility)
-   Level 3: Executive sign-off

Full audit trail mandatory.

------------------------------------------------------------------------

## 7. MAT Integration

Roadmap must:

-   Import structured audits
-   Preserve evidence metadata
-   Preserve AI scoring + confidence
-   Preserve human overrides
-   Preserve transcript anchors
-   Allow re-evaluation

------------------------------------------------------------------------

## 8. PIT Integration Hooks

Roadmap must generate structured implementation plans from findings.

Outputs follow PIT ontology:

Project → Phase → Task → Subtask

Each task must:

-   Reference source criterion number
-   Contain measurable acceptance criteria
-   Suggest owner role
-   Define due window

Until PIT exists:

-   Store draft plan JSON
-   Enable export
-   Enable future API hook

------------------------------------------------------------------------

## 9. AI Governance

-   Confidence scoring mandatory
-   Override tracking mandatory
-   Model version tracking mandatory
-   Watchdog integration
-   ISO 42001 alignment

------------------------------------------------------------------------

## 10. Strategic Position

Roadmap = Governance Brain\
MAT = Audit Execution\
RADAM = Automation Layer\
PIT = Implementation Engine\
Watchdog = AI Oversight

------------------------------------------------------------------------

End of Document
