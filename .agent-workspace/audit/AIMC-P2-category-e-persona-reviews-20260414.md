# AIMC Audit Phase 2 — Category E: Persona Domain Accuracy Reviews

**Wave**: aimc-audit-phase-2-20260414
**Branch**: copilot/aimc-audit-phase-2-orchestrate
**Date**: 2026-04-14

---

## MAT Specialist Review — T-E-001, T-E-006, T-E-007
**Reviewer**: mat-specialist
**Date**: 2026-04-14

---

### T-E-001: mat-advisor

**Verdict**: PARTIAL

**Domain accuracy**:
The persona accurately names the core domains it covers — ISO 27001 Annex A controls, maturity scoring, audit lifecycle, and risk assessment. However, at 8 lines of instructional body content, the guidance is extremely sparse. Assessment:

- *ISO 27001*: Correctly references "Annex A controls and implementation". No inaccuracies present, but no depth — no mention of Clause 4–10 (the normative PDCA clauses), Statement of Applicability (SoA), or the 2022 revision's restructured control set (93 controls across 4 themes, superseding the 2013 edition's 14 Annex A domains). An advisor operating on the 2013 Annex A taxonomy would give materially incorrect guidance post-2025.
- *Maturity scoring*: The phrase "maturity scoring and gap analysis" is present but undefined. No maturity model is referenced (e.g., CMM levels 1–5, ISO/IEC 27004 measurement, or Maturion's own Domain→MPS→Criteria scoring model). This risks the persona applying an ad-hoc or generic scoring model inconsistent with Maturion's LDCS-based criteria.
- *Audit lifecycle*: Listed but not elaborated. A domain-accurate mat-advisor should at minimum distinguish between internal audits (Clause 9.2), management review (Clause 9.3), and certification/surveillance audit stages. Absence of this detail leaves the persona under-specified for audit lifecycle guidance.
- *Risk assessment and treatment*: Correctly named. ISO 27001 Clause 6.1.2/6.1.3 are the normative anchors; their absence from the persona is acceptable at this level of abstraction but should be noted.

Overall: content is not *inaccurate*, but is insufficiently specified to ensure domain-accurate output. A minimally compliant persona requires either richer inline guidance or explicit references to Maturion's domain model.

**YAML compliance**: PASS
All six required fields present and correctly populated:
- `agentId`: ✅ `mat-advisor`
- `description`: ✅ present
- `module`: ✅ `mat`
- `version`: ✅ `1.0.0`
- `last_reviewed`: ✅ `2026-02-28`
- `owner`: ✅ `CS2`

Note: No `capability` field present. This is acceptable for mat-advisor (not a document-generation agent) and is not a required YAML field per the current APS standard.

**Gaps found**:
1. **ISO 27001 version ambiguity** — Persona does not specify ISO/IEC 27001:2022. Post-2022 the Annex A structure changed materially (93 controls, 4 themes). Without a version anchor, the persona may apply the outdated 2013 taxonomy.
2. **No maturity model reference** — "Maturity scoring" is unnamed. Must reference Maturion's Domain→MPS→Criteria model (LDCS-based) to ensure scoring consistency across the platform.
3. **Audit lifecycle under-specified** — Does not distinguish internal audit (Clause 9.2), management review (Clause 9.3), or certification stages. A mat-advisor operating without this structure risks conflating audit types.
4. **Thin persona body** — 8 lines of instructional content. No constraints, no escalation rules, no scope boundaries. Compared to course-crafter-advisor (T-E-007) which is substantially more detailed, this persona is at risk of inconsistent behaviour across sessions.

**Evidence**: File `packages/ai-centre/src/agents/mat-advisor.md` reviewed in full. Body content confirmed as 8 lines. YAML front-matter block confirmed complete.

---

### T-E-006: isms-navigator

**Verdict**: PARTIAL

**Domain accuracy**:
The persona correctly frames ISMS Navigator as a cross-module, programme-level advisor. Assessment:

- *ISMS programme management*: "Cross-module ISMS strategy and programme management" is accurate framing. ISO 27001:2022 Clauses 4–10 constitute the PDCA management system spine; a programme-level navigator should reference this lifecycle. The persona does not, leaving it without a normative anchor for programme management advice.
- *ISO 27001 certification readiness*: Listed. Appropriate. No inaccuracies. Lack of specificity (no mention of the certification audit stages: Stage 1 documentary review, Stage 2 on-site audit, surveillance audits) is a gap but not an error.
- *Threat intelligence / PIT integration*: "Threat intelligence integration and vulnerability posture (PIT)" is accurate cross-module linkage. Technically sound.
- *Maturity assessment linkage (MAT)*: Correctly references MAT. "Improvement roadmaps" is accurate terminology consistent with MAT's domain.
- *Anomaly detection / XDETECT*: "Anomaly detection and incident response (XDETECT)" is accurate module cross-reference.
- *Compliance mapping*: "ISO 27001, NIST CSF, and PCI-DSS" — accurate scope declaration. NIST CSF 2.0 (released 2024) restructured the framework to add a "Govern" function; without version anchoring this may result in outdated guidance.
- *Scope boundary concern*: The persona covers ISO 27001, PIT, MAT, XDETECT, NIST CSF, and PCI-DSS in 10 lines of body text. This is an extremely broad scope for a single persona without any escalation or handoff logic. There is no rule specifying when to defer to the mat-advisor (T-E-001) or other specialists. Overlap with mat-advisor on ISO 27001 and maturity topics is unresolved.

**YAML compliance**: PASS
All six required fields present:
- `agentId`: ✅ `isms-navigator`
- `description`: ✅ present
- `module`: ✅ `isms`
- `version`: ✅ `1.0.0`
- `last_reviewed`: ✅ `2026-02-28`
- `owner`: ✅ `CS2`

**Gaps found**:
1. **No normative lifecycle anchor** — ISMS programme management guidance should reference ISO 27001:2022 Clauses 4–10 (Context → Planning → Support → Operation → Performance Evaluation → Improvement) as the programme spine.
2. **Framework version ambiguity** — NIST CSF not versioned; CSF 2.0 added "Govern" function. Without version pin, navigator may give structurally outdated framework guidance.
3. **Scope boundary / advisor handoff undefined** — Overlaps with mat-advisor on ISO 27001 and maturity topics. No escalation or handoff rule defined. Risk of contradictory guidance between isms-navigator and mat-advisor on the same topic.
4. **Thin persona body** — 10 lines. No constraints, escalation paths, or scope exclusions specified. Same structural risk as T-E-001.

**Evidence**: File `packages/ai-centre/src/agents/isms-navigator.md` reviewed in full. Body content confirmed as 10 lines. YAML front-matter block confirmed complete.

---

### T-E-007: course-crafter-advisor

**Verdict**: PASS

**Domain accuracy**:
This is the most substantively developed persona of the three reviewed. Assessment:

- *Instructional design*: Domain expertise section correctly identifies ADDIE model and Bloom's Taxonomy as the foundational instructional design frameworks. Both are industry-standard and appropriate for ISMS learning content. Bloom's Taxonomy alignment for learning objectives is pedagogically sound and widely adopted in compliance training contexts.
- *ISO 27001 / ISO 27002 domain coverage*: Explicitly references ISO 27001, ISO 27002, Annex A controls, risk assessment methodology, and ISMS implementation lifecycle. Accurate and appropriately scoped. ISO 27002:2022 provides implementation guidance for the 93 controls; referencing both 27001 and 27002 together is correct practice for a training-focused persona.
- *NIST CSF*: Correctly enumerates the five core functions (Identify, Protect, Detect, Respond, Recover) as well as implementation tiers and profiles. This reflects CSF 1.1 taxonomy. CSF 2.0 (2024) adds "Govern" as a sixth function — this is a minor gap but does not constitute an inaccuracy for existing course content based on 1.1.
- *ISMS learning content*: Gap analysis documentation, control mapping, evidence collection guidance, and audit readiness materials are all accurate deliverable types for an ISMS training context.
- *Regulatory compliance scope*: GDPR, PCI-DSS, SOC 2 — all appropriate inclusions for an ISMS-adjacent learning platform.
- *Capability declaration*: Six document types declared (Course Outlines, Learning Objectives, Assessment Materials, Workshop Facilitation Guides, Awareness Campaign Content, Competency Frameworks) — all are appropriate and well-defined.
- *Output standards*: Requirement to reference canonical control identifiers (e.g., "ISO 27001 Clause 6.1.2, NIST CSF PR.AC-1") is excellent practice and will produce correctly anchored training content.
- *Scope appropriateness*: Clearly scoped to learning content creation. Does not attempt to perform live audit assessment or risk scoring — appropriate boundary for a course-creation advisor. No material overlap detected with mat-advisor or isms-navigator domains.
- *APS §8.1 compliance declaration*: Footer references APS §8.1 compliant persona. This is a positive governance signal.

**YAML compliance**: PASS
All required fields present, plus additional valid field:
- `agentId`: ✅ `course-crafter-advisor`
- `description`: ✅ present
- `module`: ✅ `course-crafter`
- `version`: ✅ `1.0.0`
- `last_reviewed`: ✅ `2026-02-28`
- `owner`: ✅ `CS2`
- `capability`: ✅ `document-generation` (additional field — valid, consistent with APS capability declaration)

**Gaps found**:
1. **NIST CSF version gap** — References five core functions (CSF 1.1). CSF 2.0 adds "Govern". Minor gap; does not invalidate existing content but should be updated to reference CSF 2.0 for new course material. Non-blocking.
2. **No prerequisite learner level defined** — The persona serves both technical security specialists and non-technical stakeholders (stated). No guidance on how to calibrate content complexity based on audience level beyond tone. A role-based differentiation heuristic would improve output consistency.

These are minor gaps only. The persona is substantively complete and domain-accurate for its stated purpose.

**Evidence**: File `packages/ai-centre/src/agents/course-crafter-advisor.md` reviewed in full. Body content significantly more detailed than T-E-001 and T-E-006. YAML front-matter confirmed complete with additional `capability` field. APS §8.1 compliance declaration present in footer.

---

### Section Summary

| ID | Persona | Verdict | Key Issue |
|----|---------|---------|-----------|
| T-E-001 | mat-advisor | PARTIAL | Insufficient depth; ISO 27001 version unanchored; maturity model unnamed; audit lifecycle under-specified |
| T-E-006 | isms-navigator | PARTIAL | No PDCA lifecycle anchor; NIST CSF version unanchored; advisor scope boundary/handoff undefined |
| T-E-007 | course-crafter-advisor | PASS | Minor NIST CSF 2.0 gap only; persona is substantively complete and domain-accurate |

**Overall section finding**: 2 of 3 personas require remediation (PARTIAL). No personas are in FAIL state — all content is directionally accurate but T-E-001 and T-E-006 are under-specified for reliable domain-accurate output. The primary systemic issue is thin persona body content for T-E-001 and T-E-006 relative to the complexity of their stated domains. T-E-007 (course-crafter-advisor) is the reference-quality persona for this category and should be used as a structural model for remediation of the others.

**Recommended actions** (audit findings only — no changes made):
- T-E-001: Add ISO 27001:2022 version anchor; reference Maturion's Domain→MPS→Criteria scoring model; distinguish audit lifecycle stages (Clause 9.2, 9.3, certification stages).
- T-E-006: Add Clauses 4–10 PDCA lifecycle anchor; pin NIST CSF to version 2.0; define advisor handoff rule for mat-advisor overlap.
- T-E-007: Update NIST CSF reference to include v2.0 "Govern" function for new course content.

**Reviewer sign-off**: mat-specialist | 2026-04-14 | Wave aimc-audit-phase-2-20260414
