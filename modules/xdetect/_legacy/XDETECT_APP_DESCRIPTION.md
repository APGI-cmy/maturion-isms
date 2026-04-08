# XDETECT_APP_DESCRIPTION.md

## Status Header (REQUIRED)
- **Application**: XDETECT (“X-detect”)
- **Artifact Type**: App Description (Upstream Authority)
- **Status**: Draft (to be marked **Authoritative** only after approval)
- **Version**: v0.1
- **Owner**: Johan Ras (Product Owner / Human Authority)
- **Authority**: Johan Ras
- **Applies To**: XDETECT application repository (and any downstream FRS/Architecture artifacts)
- **Approval Date**: N/A (Draft)
- **Last Updated**: 2026-02-10
- **Supersedes / Superseded By**: N/A

> Governance note: Per **APP_DESCRIPTION_REQUIREMENT_POLICY.md**, no FRS/Architecture may be treated as authoritative without an authoritative App Description, and downstream artifacts must explicitly derive from this document. fileciteturn13file0L14-L33

---

## 1. Application Identity (REQUIRED)

### 1.1 Purpose Statement
XDETECT is a privacy-preserving, audit-ready **X-ray contraband detection decision-support application**. It ingests full-body X-ray scan images (initially downloaded exports such as JPEG/PNG/TIFF), runs a controlled set of **viewer-equivalent image transforms and detection tests** in the background, and produces:
1) a **triage decision** (e.g., Positive / Negative / Inconclusive),  
2) an **explanatory caricature** (red dot(s) + textual explanation) that avoids exposing the raw X-ray unless necessary, and  
3) a **complete audit trail** suitable for governance, investigation, and later evidentiary needs.

### 1.2 Target Users / Audience
- **Primary**: Screening operators / security officers performing scan review in high-risk industries (e.g., diamond operations).
- **Secondary**: Supervisors / investigators (human escalation path after a hold is triggered).
- **Tertiary**: Compliance / human rights / legal oversight roles (audit and governance review).

### 1.3 Core Value Proposition
- Reduce unnecessary human exposure to sensitive full-body X-ray imagery by default, while still enabling lawful escalation when “reasonable suspicion” is met.
- Standardize detection via consistent, repeatable, logged tests, reducing human variability and fatigue.
- Create a structured learning loop to continuously reduce false positives/negatives with governance controls.

---

## 2. Scope Definition (REQUIRED)

### 2.1 In Scope (v1 Proof of Concept)
**Inputs**
- Single-image ingestion per case, plus optional multi-image sequence support (future-ready).
- Supported formats (initial): JPG/JPEG, PNG, TIFF/TIF. (No hardcoding; must be extensible.)
- Metadata capture: site, scanner device model (optional), operator, timestamp, case ID, etc.

**Core Processing**
- Recreate “viewer-equivalent” functionality by implementing **a fixed, auditable set of transforms/tests**:
  - **4 Display/Transform Modes** (examples—final names may vary): Normal, Invert/Negative, Emboss/Edge-like, Contrast/Enhancement.
  - **4 Object Characteristic Tests** (from checklist logic): shape/edges, density profile, location plausibility, artifact patterning.
  - Total: **16 combinations** executed consistently per image.
- AI detection returns:
  - classification (Diamond / Not-diamond / Unknown + candidate classes),
  - confidence estimate (calibrated probability-like score),
  - localization (bounding region / heatmap),
  - explanations referencing checklist-style characteristics (“why flagged”).

**Outputs**
- **Triage Result**: Positive / Negative / Inconclusive.
- **Privacy-preserving caricature**:
  - simplified rendering + red marker(s) + explanation + confidence
  - hides the raw scan in default workflows.
- **Audit Trail** with immutable logs:
  - transforms executed, parameters, model versions, evidence, human decisions, overrides.

**Human-in-the-loop Controls**
- Operator review of AI decision (accept / reject / escalate).
- Rejection requires structured **questionnaire feedback** (what it actually was, mismatch reasons, etc.).
- Escalation workflow supporting “hold” triggers and handover to supervisors/human process.

**Governance + Learning**
- Captured human feedback feeds a controlled learning dataset:
  - false positive / false negative labels,
  - alternate object class (“peanut”, “prosthesis”, “coin”, etc.),
  - characteristics mismatched.
- Learning is **gated** (no autonomous silent retraining in production without approval and evidence).

### 2.2 Out of Scope (v1 PoC)
- Direct integration with proprietary scanner viewer software (mouse/keyboard automation) as a productized feature.
- Automatic biometric identity profiling (“this is Peter…”) in production.
- Automated arrest decisions, automated body search decisions, or anything beyond triage recommendation.
- Court-admissibility certification program (this is a separate legal and accreditation effort).
- Continuous unsupervised online learning in production.

### 2.3 Scope Boundaries & Constraints
- **Privacy-first**: default UX shows caricature + explanation; raw scan access is permissioned and logged.
- **Human rights constraints**: “reasonable suspicion” thresholds and escalation must be transparent, auditable, and human-authorized.
- **No hardcoding** of formats, device types, or transform names: the system must support extensible capability registration.
- **Explainability**: outputs must provide a human-usable reason trace that maps to the checklist model.

---

## 3. Success Criteria (REQUIRED)

### 3.1 Operational Success Criteria
1. **Reproducibility**: the same image produces the same 16-test pipeline outputs given the same model and parameters.
2. **Audit completeness**: for any decision, an auditor can trace:
   input → transforms/tests → model outputs → explanation → human action(s) → final state.
3. **Privacy reduction**: default workflows do not expose raw X-ray to most roles; access is role-based + logged.
4. **Usable triage**: operators can submit an image and receive a result + caricature within an acceptable time target (PoC target: seconds to low minutes depending on hardware).

### 3.2 Quality Success Criteria (measured over time)
5. **Lower false positives** over time via governed feedback loops.
6. **Lower false negatives** over time via curated training sets and improved models.
7. **Calibration**: confidence scores correlate with actual correctness (monitored and reported).

### 3.3 Governance Success Criteria
8. **Governance lineage**: downstream FRS and Architecture explicitly derive from this App Description, with traceability evidence. fileciteturn13file2L1-L23
9. **Requirements-first compliance**: requirements exist and are approved before architecture/implementation, and are traceable to tests/evidence. fileciteturn13file5L15-L21
10. **QA discipline**: “Gate-Eligible Green” is achieved for build/merge readiness (no test dodging, no test debt). fileciteturn12file11L11-L24

---

## 4. Strategic Context (REQUIRED)

### 4.1 Why XDETECT Exists
Human review of full-body X-ray scans is:
- cognitively demanding and error-prone under fatigue,
- sensitive from a privacy and dignity standpoint,
- vulnerable to inconsistent application of detection criteria.

XDETECT introduces:
- standardized, repeatable transforms/tests,
- consistent AI triage with auditable outputs,
- privacy-preserving workflow patterns,
- governed continuous improvement.

### 4.2 Relationship to Other Systems
- **Standalone PoC**: accepts downloaded/exported images.
- **Future**: can become an add-on product compatible with multiple scanner vendors by integrating at the image-export boundary.
- **Future**: deeper integration with viewer functionality (either via vendor API integration or controlled automation) may be explored only after PoC success and legal/privacy clearance.

---

## 5. High-Level Features (Optional but Recommended)

### 5.1 Core Features
- Case creation (single scan session) and ingestion pipeline.
- Background execution of 16 tests (4 display transforms × 4 object characteristic analyses).
- AI inference with localization + confidence + explanation.
- Caricature generation with red markers and an explanation overlay.
- Role-based access (operator vs supervisor vs auditor).
- Decision handling: Accept AI / Reject AI / Inconclusive / Escalate Hold.
- Rejection questionnaire + feedback capture.
- Exportable reports and evidence bundles (case file + audit trail).

### 5.2 Administrative Features
- Configuration of thresholds per site, per scanner type (without code changes).
- Model registry (versioned models with approvals and deployment history).
- Audit trail viewer and export.
- Feedback dataset management (label review, de-duplication, privacy controls).

---

## 6. Primary Use Cases (Optional)

### UC-1: Operator submits scan image
1. Operator creates a new Case, uploads image(s), adds minimal metadata.
2. System runs the 16-test pipeline and inference.
3. System returns triage result + caricature + explanation + confidence.
4. Operator chooses: Accept / Reject / Mark Inconclusive / Escalate Hold.

### UC-2: Escalation to supervisor (Hold)
1. Operator escalates hold.
2. Supervisor receives notification and reviews caricature + explanation.
3. Supervisor requests raw image access if needed (logged).
4. Supervisor triggers human process (search, interview, etc.), outside app scope; app logs status and outcomes.

### UC-3: Rejection feedback loop
1. Operator/supervisor rejects AI decision.
2. System requires completion of feedback questionnaire:
   - What was it (if known)?
   - Which checklist traits did not match?
   - Was the issue due to image quality, artifacts, transform sensitivity, etc.?
3. Feedback is stored for later review and curated learning.

---

## 7. Non-Functional Priorities (Optional but Strongly Recommended)

### 7.1 Security & Privacy
- RBAC/ABAC enforcement; least-privilege.
- Encryption in transit and at rest.
- Secure storage for raw scans; default restricted visibility.
- Immutable audit logs for critical actions (upload, view raw scan, escalate, override, export).

### 7.2 Audit Readiness & Evidence Integrity
- Every case maintains a complete evidence ledger:
  - original file hash, transform hashes, model ID/version, inference outputs, decisions.
- Export packages include checksums/signatures to verify integrity.

### 7.3 Performance
- Pipeline should be optimized for typical operational load (batch and streaming options).
- Asynchronous job execution supported for heavy inference (queue/worker pattern).

### 7.4 Reliability
- Deterministic reprocessing: re-run pipeline on stored inputs to reproduce outputs.
- Clear degraded-mode behavior (e.g., if inference unavailable, show “Inconclusive” with partial transform outputs).

### 7.5 International Standards Alignment (Intent)
- Align system controls and process controls with ISO 27001-style auditability and ISO 31000-style risk management principles (as applicable).

---

## 8. Governance Alignment (Mandatory Guidance for Foreman/Builders)

### 8.1 Upstream Authority & Lineage
Per **APP_DESCRIPTION_REQUIREMENT_POLICY.md**, downstream artifacts must follow the lineage:
App Description → FRS → Architecture → Build Authorization → Implementation. fileciteturn13file0L21-L33

### 8.2 Requirements Governance Expectations
Requirements must exist before architecture, be traceable, and be verifiable. fileciteturn13file5L38-L47

### 8.3 QA Policy Expectations
The build must reach “Gate-Eligible Green” and must not use test dodging, warning suppression, or test debt. fileciteturn12file11L11-L24 fileciteturn12file11L46-L57

### 8.4 Architecture Artifact Expectations
Architects should use the minimum architecture template structure including the required QA Strategy and traceability mappings. fileciteturn12file3L14-L23 fileciteturn12file0L46-L76

---

## 9. System Concept Model (Domain Concepts)

### 9.1 Core Concepts
- **Case**: a single screening instance containing image(s), metadata, and decisions.
- **Artifact**: any file associated with a case (raw scan, derived image, transform output, exported report).
- **Transform/Test Run**: one deterministic run of a display transform + characteristic analysis.
- **Inference**: AI outputs (classification, confidence, localization, explanations).
- **Decision**: human or AI decision event (accept/reject/escalate).
- **Feedback**: structured rejection questionnaire results and labels.
- **Model Version**: versioned, approved AI model deployed to inference service.
- **Audit Event**: immutable log record of actions and system events.

### 9.2 16-Test Concept (PoC)
- 4 display transforms (T1..T4) × 4 characteristic tests (C1..C4) = 16 combined outputs.
- Outputs must be stored and referenced in audit logs; each output must include parameters and hashes.

---

## 10. JSON Data Schemas (Single-Doc Inclusion)

> These schemas are “seed contracts” for the Foreman/Architect to refine into repository schemas. They intentionally avoid hardcoding scanner-vendor specifics and support extensibility by registration.

### 10.1 Case Schema (Draft)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.org/schemas/xdetect/case.schema.json",
  "title": "XDETECT Case",
  "type": "object",
  "required": ["caseId", "status", "createdAt", "createdBy", "artifacts"],
  "properties": {
    "caseId": { "type": "string", "description": "Unique case identifier" },
    "status": {
      "type": "string",
      "enum": ["DRAFT", "PROCESSING", "READY", "ESCALATED_HOLD", "CLOSED", "ARCHIVED"]
    },
    "createdAt": { "type": "string", "format": "date-time" },
    "createdBy": { "type": "string", "description": "User ID of the creator" },
    "site": { "type": "string" },
    "scanner": {
      "type": "object",
      "description": "Optional scanner metadata; must be extensible",
      "properties": {
        "vendor": { "type": "string" },
        "model": { "type": "string" },
        "serial": { "type": "string" },
        "softwareVersion": { "type": "string" }
      },
      "additionalProperties": true
    },
    "subject": {
      "type": "object",
      "description": "PoC excludes personal identification; future expansion gated",
      "properties": {
        "subjectRef": { "type": "string", "description": "Opaque ref; NOT PII by default" }
      },
      "additionalProperties": false
    },
    "artifacts": {
      "type": "array",
      "items": { "$ref": "#/$defs/artifactRef" }
    },
    "pipelineRuns": {
      "type": "array",
      "items": { "$ref": "#/$defs/pipelineRun" }
    },
    "decisions": {
      "type": "array",
      "items": { "$ref": "#/$defs/decision" }
    },
    "feedback": {
      "type": "array",
      "items": { "$ref": "#/$defs/feedback" }
    }
  },
  "$defs": {
    "artifactRef": {
      "type": "object",
      "required": ["artifactId", "kind", "mimeType", "hashSha256", "uri"],
      "properties": {
        "artifactId": { "type": "string" },
        "kind": {
          "type": "string",
          "enum": ["RAW_SCAN", "DERIVED_TRANSFORM", "CARICATURE", "REPORT_EXPORT", "OTHER"]
        },
        "mimeType": { "type": "string" },
        "originalFilename": { "type": "string" },
        "hashSha256": { "type": "string" },
        "uri": { "type": "string", "description": "Storage URI or internal path reference" },
        "createdAt": { "type": "string", "format": "date-time" },
        "createdBy": { "type": "string" },
        "accessLevel": {
          "type": "string",
          "enum": ["DEFAULT_VISIBLE", "RESTRICTED_RAW", "SUPERVISOR_ONLY"]
        },
        "metadata": { "type": "object", "additionalProperties": true }
      },
      "additionalProperties": false
    },
    "pipelineRun": {
      "type": "object",
      "required": ["runId", "createdAt", "transformMatrix", "modelRef", "outputs"],
      "properties": {
        "runId": { "type": "string" },
        "createdAt": { "type": "string", "format": "date-time" },
        "transformMatrix": {
          "type": "object",
          "description": "Declares the 4x4 execution without hardcoding names",
          "required": ["displayTransforms", "characteristicTests"],
          "properties": {
            "displayTransforms": {
              "type": "array",
              "minItems": 4,
              "items": { "type": "string" }
            },
            "characteristicTests": {
              "type": "array",
              "minItems": 4,
              "items": { "type": "string" }
            }
          },
          "additionalProperties": false
        },
        "modelRef": {
          "type": "object",
          "required": ["modelId", "version"],
          "properties": {
            "modelId": { "type": "string" },
            "version": { "type": "string" },
            "deploymentId": { "type": "string" }
          },
          "additionalProperties": false
        },
        "outputs": {
          "type": "array",
          "items": { "$ref": "#/$defs/testOutput" }
        }
      },
      "additionalProperties": false
    },
    "testOutput": {
      "type": "object",
      "required": ["outputId", "displayTransform", "characteristicTest", "inference"],
      "properties": {
        "outputId": { "type": "string" },
        "displayTransform": { "type": "string" },
        "characteristicTest": { "type": "string" },
        "derivedArtifactId": { "type": "string", "description": "ArtifactId for the derived transform image (optional)" },
        "inference": { "$ref": "#/$defs/inference" }
      },
      "additionalProperties": false
    },
    "inference": {
      "type": "object",
      "required": ["triage", "confidence", "explanations"],
      "properties": {
        "triage": {
          "type": "string",
          "enum": ["POSITIVE", "NEGATIVE", "INCONCLUSIVE"]
        },
        "primaryClass": { "type": "string", "description": "e.g., DIAMOND, COIN, PROSTHESIS, UNKNOWN" },
        "confidence": {
          "type": "number",
          "minimum": 0,
          "maximum": 1,
          "description": "Calibrated probability-like confidence"
        },
        "localization": {
          "type": "array",
          "description": "One or more bounding regions or points",
          "items": {
            "type": "object",
            "required": ["x", "y"],
            "properties": {
              "x": { "type": "number" },
              "y": { "type": "number" },
              "w": { "type": "number" },
              "h": { "type": "number" },
              "label": { "type": "string" }
            },
            "additionalProperties": false
          }
        },
        "explanations": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["code", "text"],
            "properties": {
              "code": { "type": "string", "description": "Checklist/heuristic reference code" },
              "text": { "type": "string" }
            },
            "additionalProperties": false
          }
        },
        "caricatureArtifactId": {
          "type": "string",
          "description": "ArtifactId for privacy-preserving caricature output"
        }
      },
      "additionalProperties": false
    },
    "decision": {
      "type": "object",
      "required": ["decisionId", "createdAt", "actor", "action"],
      "properties": {
        "decisionId": { "type": "string" },
        "createdAt": { "type": "string", "format": "date-time" },
        "actor": {
          "type": "object",
          "required": ["actorType", "actorId"],
          "properties": {
            "actorType": { "type": "string", "enum": ["AI", "HUMAN"] },
            "actorId": { "type": "string" }
          },
          "additionalProperties": false
        },
        "action": {
          "type": "string",
          "enum": ["AI_TRIAGE", "ACCEPT_AI", "REJECT_AI", "MARK_INCONCLUSIVE", "ESCALATE_HOLD", "CLOSE_CASE"]
        },
        "notes": { "type": "string" },
        "requiresRawAccess": { "type": "boolean" },
        "rawAccessGrantedBy": { "type": "string" }
      },
      "additionalProperties": false
    },
    "feedback": {
      "type": "object",
      "required": ["feedbackId", "createdAt", "createdBy", "decisionId", "outcome"],
      "properties": {
        "feedbackId": { "type": "string" },
        "createdAt": { "type": "string", "format": "date-time" },
        "createdBy": { "type": "string" },
        "decisionId": { "type": "string" },
        "outcome": {
          "type": "string",
          "enum": ["FALSE_POSITIVE", "FALSE_NEGATIVE", "UNCERTAIN", "OTHER"]
        },
        "alternativeClass": { "type": "string", "description": "If not a diamond, what was it (if known)" },
        "mismatchReasons": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Checklist traits that mismatched"
        },
        "questionnaire": {
          "type": "object",
          "description": "Extensible Q&A payload",
          "additionalProperties": true
        }
      },
      "additionalProperties": false
    }
  }
}
```

---

## 11. Foreman-Oriented Notes (Practical Guidance for FRS + Architecture)

### 11.1 FRS Derivation Reminder
FRS must explicitly declare derivation from this App Description, including this file name and version, per the alignment checklist. fileciteturn13file11L25-L36

### 11.2 Suggested FRS Sections (Seed)
- Roles & permissions model (operator/supervisor/auditor).
- Case lifecycle, statuses, and required transitions.
- Pipeline execution guarantees (deterministic runs, 16-test matrix, parameterization).
- Output artifacts (raw vs derived vs caricature).
- Human decision and escalation workflow.
- Feedback and learning dataset governance.
- Audit trail completeness and integrity.
- Export package format, including checksums.
- Configuration management and non-hardcoded capability registry.

### 11.3 Suggested Architecture Themes (Seed)
- Upload/ingestion service + storage with hashing and access tiers.
- Async processing worker for transforms/inference (queue-based).
- Model registry service (version + approvals + rollback).
- API + UI separation with strong audit logging middleware.
- Audit event store with immutability constraints.
- Caricature renderer component.
- Admin console for thresholds, transforms, and model deployments.
- Observability: metrics on false positive/negative, throughput, latency, drift signals.

### 11.4 QA Domains (Expectations)
Architecture and build evidence should declare applicable QA domains and produce evidence artifacts per the minimum architecture template. fileciteturn12file0L46-L76

---

## 12. Future Evolution (Optional)

### 12.1 Viewer Integration (Future)
- Explore vendor APIs or controlled integration once PoC value is proven.
- Avoid brittle GUI automation unless strictly sandboxed and governed.

### 12.2 Identity/Profiling (Future, High-Risk)
- If implemented, must be gated behind explicit legal/privacy controls and strong data governance.
- Consider “reference image per subject” with strict retention policies and consent models.

### 12.3 Multi-vendor Productization
- Maintain scanner-agnostic ingestion contracts.
- Offer integration adapters per vendor rather than hardcoded logic.

---

## 13. Guiding Principles (End)
- **Privacy by default, raw access by exception**.
- **Human-in-the-loop for rights-limiting decisions**.
- **Determinism + auditability over cleverness**.
- **Governed learning, not uncontrolled self-modification**.
- **Requirements-first, traceability always**. fileciteturn13file5L15-L21

---

**End of XDETECT App Description**
