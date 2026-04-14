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

---

## PIT Specialist Review — T-E-002, T-E-005
**Reviewer**: pit-specialist
**Date**: 2026-04-14

---

### T-E-002: pit-advisor

**Verdict**: PASS

**Domain accuracy**:
The persona is accurate and well-aligned with the PIT (Project Implementation Tracker) domain. Assessment:

- *Core purpose*: Correctly frames PIT as a module for planning, decomposing, scheduling, and tracking implementation of security controls and risk treatment plans. This is an accurate description of the PIT module's function within the Maturion ISMS platform.
- *Task generation from WRAC inputs*: The phrase "Task generation from WRAC, Risk Assessment, Control, Bowtie, Incident, and Audit inputs" is domain-accurate. WRAC (Work Risk Assessment and Control) is correctly identified as a source for task generation. The full list of input sources (RA, Control, Bowtie, Incident, Audit) represents the correct upstream modules that feed implementation work into PIT.
- *Project and task hierarchy*: "Project → Phase → Task → Subtask" hierarchy is explicitly stated and correctly reflects the PIT ontology's structural model. This is precise and accurate.
- *Scheduling and critical path analysis*: Correctly in scope for PIT. Dependency management and critical path analysis are standard PIT capabilities and accurately described.
- *CAPEX/OPEX cost estimation and ROI tracking*: Accurate — cost tracking and return-on-investment analysis for control implementation are documented PIT features.
- *Risk mitigation progress and residual risk trajectory*: Accurate — PIT tracks implementation progress against risk treatment plans; residual risk trajectory is a valid PIT output metric.
- *Watchdog trigger interpretation*: "Watchdog trigger interpretation and escalation recommendations" is accurate. The PIT watchdog mechanism monitors schedule slippage and threshold breaches; this is a documented PIT feature.
- *Evidence review and progress log analysis*: Accurate — PIT manages evidence artefacts attached to tasks; progress logs are a core PIT data structure.
- *Control implementation readiness and completion criteria*: Accurate — PIT tracks control completion status against defined criteria; this is a well-scoped PIT responsibility.
- *Scope boundaries*: The persona explicitly excludes risk assessments and compliance rulings ("those belong to WRAC, RA, and MAT respectively"). This boundary declaration is correct and prevents scope overlap with mat-advisor and risk-platform workflows. This is a positive governance signal.
- *"Measurable, verifiable outcome" requirement*: The instruction that "every recommendation must have a measurable, verifiable outcome" is appropriate for an implementation-tracking advisor and consistent with PIT's evidence-based completion model.
- *PIT ontology reference*: "You reference the PIT ontology in all structural recommendations" — this is a correct grounding instruction ensuring output consistency with the platform's data model.

No domain inaccuracies detected. The persona is appropriately scoped, contains correct technical terminology, and defines clear boundaries against adjacent modules.

**YAML compliance**: PASS
All six required fields present and correctly populated:
- `agentId`: ✅ `pit-advisor`
- `description`: ✅ present and accurate
- `module`: ✅ `pit`
- `version`: ✅ `1.0.0`
- `last_reviewed`: ✅ `2026-02-26`
- `owner`: ✅ `CS2`
- `capability`: ✅ `analysis` (additional field — valid, consistent with APS capability declaration pattern)

**Gaps found**:
1. **No scheduling model reference** — The persona mentions "critical path analysis" but does not specify which scheduling methodology is used (e.g., CPM, Gantt, PERT). For an advisor to give consistent scheduling guidance, the methodology should be explicitly named or referenced to the PIT ontology's scheduling model. Minor gap — non-blocking.
2. **WRAC acronym undefined** — "WRAC" is used without expansion in the persona body. First-use expansion ("Work Risk Assessment and Control (WRAC)") would improve clarity for users unfamiliar with Maturion's module vocabulary. Minor gap — non-blocking.
3. **No escalation path defined** — The persona mentions "escalation recommendations" for watchdog triggers but does not specify the escalation target (e.g., risk-platform-agent, human CS2 owner, or specific ISMS role). This leaves escalation behaviour undefined. Low severity.

Overall: Minor gaps only. Persona is substantively complete and domain-accurate for its stated purpose. Content depth is appropriate and comparable to course-crafter-advisor (T-E-007) as a reference standard.

---

### T-E-005: incident-intelligence-advisor

**Verdict**: PASS

**Domain accuracy**:
The persona is accurate, well-structured, and appropriately scoped for incident analysis and TTP correlation. Assessment:

- *Core purpose*: Correctly frames the module as supporting incident analysis, IOC enrichment, threat correlation, timeline reconstruction, and post-incident reporting. All five functions are legitimate and well-defined incident intelligence capabilities.
- *Incident analysis and severity classification*: Accurate. Severity classification is a standard incident response triage step and appropriate for this advisor.
- *IOC correlation across threat feeds*: "Correlation of IOCs across multiple threat intelligence feeds (MISP, STIX/TAXII, VirusTotal, Shodan)" — accurate and technically precise. MISP and STIX/TAXII are industry-standard threat sharing platforms; VirusTotal and Shodan are standard enrichment sources for IP/domain/hash lookups. This is domain-correct tooling.
- *IOC enrichment*: "IP reputation, domain analysis, file hash lookups, and malware family identification" — accurate, covers the four primary IOC enrichment dimensions used in threat intelligence practice.
- *Attack timeline reconstruction*: "From log data, endpoint telemetry, and network captures" — accurate. These three data source categories are the standard inputs for timeline reconstruction in incident response.
- *MITRE ATT&CK TTP mapping*: Explicitly named and accurate. ATT&CK framework mapping for adversary TTP identification is the industry standard and correctly in scope for an incident intelligence module. "Adversary profile development" is a legitimate output of ATT&CK-aligned analysis.
- *Root cause analysis and impact assessment*: Accurate — both are standard post-incident deliverables.
- *Post-incident report generation*: "Executive summaries, technical deep-dives, lessons-learned sections" — accurate report structure taxonomy. All three output types are appropriate for different stakeholder audiences.
- *Evidence chain-of-custody documentation*: "For regulatory and legal purposes" — accurate and important. Chain-of-custody documentation is a compliance requirement in many regulatory frameworks (GDPR breach notification, NIS2, etc.) and correctly in scope.
- *Containment, eradication, and recovery recommendations*: Accurate — these map directly to the NIST SP 800-61 incident response lifecycle phases (Containment → Eradication → Recovery). Correct domain terminology.
- *Incident pattern trending and recurrence risk*: Accurate — trend analysis for recurrence prevention is a valid post-incident intelligence function.
- *Behavioural constraints*: "Does not speculate beyond observable artefacts" and "traces conclusions back to concrete indicators" — these are appropriate epistemic constraints for an evidence-driven incident analysis advisor. The "deep-search capabilities" reference aligns with the `capability: deep-search` YAML declaration.

**Scope overlap check**:
- *vs. risk-advisor*: Risk-advisor would focus on risk scoring, treatment planning, and risk register management. Incident-intelligence-advisor focuses on forensic analysis, IOC enrichment, and TTP correlation — these are distinct and non-overlapping workflows. No material overlap detected.
- *vs. xdetect-advisor*: XDETECT focuses on anomaly detection and contraband/threat detection within operational environments. Incident-intelligence-advisor operates post-detection, on confirmed incidents requiring analysis. The boundary is detection (XDETECT) vs. analysis (incident-intelligence). No material overlap detected.

No domain inaccuracies detected. The persona is technically precise, uses correct industry-standard terminology, and maintains clean scope boundaries.

**YAML compliance**: PASS
All required fields present and correctly populated:
- `agentId`: ✅ `incident-intelligence-advisor`
- `description`: ✅ present and accurate
- `module`: ✅ `incident-intelligence`
- `version`: ✅ `1.0.0`
- `last_reviewed`: ✅ `2026-02-28`
- `owner`: ✅ `CS2`
- `capability`: ✅ `deep-search` (additional field — valid, aligns with persona body's deep-search capability references)

**Gaps found**:
1. **No incident classification taxonomy defined** — Severity classification is mentioned but no taxonomy is specified (e.g., P1–P4, NIST SP 800-61 severity levels, or a Maturion-specific model). Without a named taxonomy, severity output may be inconsistent across sessions. Minor gap — non-blocking.
2. **ATT&CK version not pinned** — MITRE ATT&CK is referenced without a version (currently v15 as of 2024). New ATT&CK versions add/modify techniques; without version anchoring, TTP mapping may produce inconsistent results over time as the framework evolves. Minor gap — non-blocking, but consistent with the NIST CSF version gap noted in other personas.
3. **No handoff rule for escalation to risk-advisor** — Where incidents have material risk register implications (e.g., new critical vulnerability discovered during incident analysis), there is no defined escalation path to the risk-platform-agent. Low severity — the persona's scope is correctly bounded but a cross-module handoff note would improve workflow clarity.

Overall: Minor gaps only. Persona is substantively complete, technically accurate, and the most detailed persona reviewed in this category. Depth and precision are at a high standard.

---

### Section Summary

| ID | Persona | Verdict | Key Issue |
|----|---------|---------|-----------|
| T-E-002 | pit-advisor | PASS | Minor: WRAC acronym undefined; no scheduling model reference; escalation target unspecified |
| T-E-005 | incident-intelligence-advisor | PASS | Minor: no severity classification taxonomy; ATT&CK version unpinned; no risk-advisor handoff rule |

**Overall section finding**: Both personas PASS. No domain inaccuracies detected in either file. Both personas use correct technical terminology, define appropriate scope boundaries, and include complete YAML front-matter. T-E-005 (incident-intelligence-advisor) is the most technically detailed persona reviewed in this audit wave and should be considered a reference-quality example for the category.

All identified gaps are minor and non-blocking. No immediate remediation required. Recommended to address in the next persona maintenance cycle:
- T-E-002: Expand WRAC acronym; add scheduling methodology reference; specify watchdog escalation target.
- T-E-005: Add severity classification taxonomy reference; pin ATT&CK version; add cross-module handoff note for risk register implications.

**Reviewer sign-off**: pit-specialist | 2026-04-14 | Wave aimc-audit-phase-2-20260414

---

## Maturity Scoring Review — T-E-008
**Reviewer**: maturity-scoring-agent
**Date**: 2026-04-14

### T-E-008: maturity-roadmap-advisor
**Verdict**: PARTIAL
**Domain accuracy**: Largely accurate. The persona correctly covers roadmap generation, remediation planning, control gap prioritisation, phased implementation timelines, quick-win identification, KPI definition, and stakeholder communication. Grounding in ISO 27001 Annex A, NIST CSF, and PCI-DSS is appropriate for ISMS maturity context. The scope boundary with mat-advisor is stated explicitly ("You do not conduct risk assessments directly"). However, the persona does not reference Maturion's Domain→MPS→Criteria scoring model by name — it refers generically to "assessed maturity baseline" and "ISO 27001 Annex A gap analysis outputs" without tying prioritisation logic to the specific three-tier scoring hierarchy used by the platform.
**YAML compliance**: PASS — all required fields present: agentId, description, module, version, last_reviewed, owner. `capability` field is a bonus field, not missing any mandatory key.
**Gaps found**:
- No explicit reference to Maturion's Domain→MPS→Criteria scoring model; gap prioritisation guidance uses generic ISO 27001 framing rather than platform-native scoring tiers.
- No mention of consuming maturity scores from `mat-advisor` or the assessments API (`apps/mat/api/assessments/**`) as input to roadmap generation.
- Scope boundary statement references WRAC/RA modules but not `mat-advisor` by its Maturion agent identity; boundary clarity is partial.
- No reference to PIT integration contract or how roadmap milestones map to PIT project tracking (mentioned in guidance list but no structural detail).
**Scoring model alignment**: PARTIAL — persona references maturity baseline and level progression modelling from current-to-target state, which aligns conceptually with the scoring model intent. However, it does not name Domain→MPS→Criteria tiers, does not reference maturity level descriptors (L1–L5 or equivalent), and does not describe how criteria coverage percentages translate into roadmap priority weights.

### Section Summary
The maturity-roadmap-advisor persona is functionally sound and covers the correct planning domain. YAML front-matter is fully compliant. The primary gap is the absence of explicit alignment to Maturion's Domain→MPS→Criteria scoring model: prioritisation guidance is framework-generic rather than platform-native. Scope boundary with mat-advisor is partially stated but could be tightened. Recommend the persona be updated (outside audit scope) to explicitly reference the scoring model tiers and intake path from mat-advisor scores.
