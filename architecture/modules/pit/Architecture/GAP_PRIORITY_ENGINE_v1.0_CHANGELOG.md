# GAP PRIORITY ENGINE v1.0 — CHANGELOG

**Document:** `GAP_PRIORITY_ENGINE_v1.0.md`  
**Location:** `architecture/modules/pit/Architecture/`  
**Maintainer:** Foreman  

---

## Version 1.0 — 2025-12-09

### ✅ Initial Release

**Scope:** Part 1 of 4 — Overview, Inputs, Outputs, Numeric Priority Model

**Changes:**

#### Added
- **Section 0: Purpose**
  - Defined the role of the Gap Priority Engine in the Maturity → PIT workflow
  - Established design principles: transparency, determinism, auditability, flexibility, integration
  - Documented context and integration with existing systems

- **Section 1: Inputs to the Engine**
  - Defined complete input schema for gap objects
  - Categorized inputs into:
    - Core identification (org_id, cycle_id, origin_type, origin_id)
    - Context & hierarchy (domain_name, mps_name, etc.)
    - Maturity metrics (current_level, target_level, gap, numeric_score)
    - Evidence quality indicators (evidence_count, avg_evidence_confidence)
    - Risk & impact factors (criticality, linked_risks, linked_incidents)
    - Regulatory & compliance (regulatory_relevance, compliance_frameworks, audit_flags)
    - Time & history (time_exposed_days, previous_gap, gap_trend)
    - Existing work (existing_pit_tasks with counts)
  - Specified data types and sources for each input field

- **Section 2: Output of the Engine**
  - Defined TypeScript interface for `GapPriorityOutput`
  - Specified priority_score (unbounded upward from 0.00)
  - Defined priority_level enum: low, medium, high, critical
  - Included detailed modifier breakdown for transparency
  - Added recommended_action field: defer, create_task, create_project, escalate
  - Included audit trail fields (calculation_timestamp, calculation_version, explanation)

- **Section 3: Numeric Priority Model**
  - **3.1 Base Priority:** Linear formula `gap / 4` for 0.00-1.00 range
  - **3.2 Modifiers:**
    - **Evidence Confidence Modifier:** Range [0.75, 1.25], inverse relationship (high confidence reduces priority)
    - **Criticality Modifier:** Discrete mapping (low=1.0, medium=1.5, high=2.0, critical=3.0)
    - **Linked Risks Modifier:** Range [1.0, 2.0], based on risk severity and count
    - **Regulatory Relevance Modifier:** Range [1.0, 1.5], with framework overrides
    - **Time Exposed Modifier:** Range [1.0, 2.0], stepped increases at 30/90/180/365 days
    - **Existing Tasks Modifier:** Range [0.5, 1.0], reduces priority if active tasks exist
  - **3.3 Final Priority Calculation:** Multiplicative formula with worked example
  - **3.4 Priority Level Mapping:** Score ranges to discrete levels with PIT handling rules
  - **3.5 Recommended Action Derivation:** Logic for defer/create_task/create_project/escalate decisions
  - **3.6 Explanation Generation:** Template for human-readable justifications

- **Section 4: Implementation Notes**
  - Data sources mapping to Supabase tables
  - Performance requirements (< 100ms per gap, < 5s for 500 criteria)
  - Configuration override mechanism via `gap_priority_config` table
  - Versioning requirements for audit trail

- **Section 5: Next Steps**
  - Outlined remaining parts 2-4 of the Gap Priority Engine specification
  - Part 2: AI Reasoning Layer
  - Part 3: Recommended Handling & PIT Integration Rules
  - Part 4: QA Tests & Validation Requirements

- **References**
  - Linked to PIT Scoring Integration Workflow v1.0
  - Linked to PIT Integration Requirements v1.0
  - Linked to Maturity Scoring Model migration
  - Linked to Maturity Scoring API Contract v1.0

#### Technical Decisions

1. **Multiplicative Modifiers:** Chosen over additive to allow exponential scaling for critical gaps
2. **Clamped Ranges:** Each modifier is bounded to prevent extreme outliers
3. **Evidence Confidence Inversion:** High confidence reduces priority (gap is well-understood, less risky)
4. **Priority Score Unbounded:** Allows scores > 4.0 for extreme cases, triggering special handling
5. **Existing Tasks Reduction:** Active work reduces priority to prevent duplicate efforts
6. **Time Exposure Escalation:** Chronic gaps get automatic priority boost (gap fatigue prevention)

#### Validation

- Reviewed against PIT_SCORING_INTEGRATION_WORKFLOW_v1.0.md for consistency
- Aligned with PIT_INTEGRATION_REQUIREMENTS_v1.0.md event schema
- Verified compatibility with existing scoring model tables
- Confirmed input data availability from current database schema

---

## Future Versions

### Planned for v1.1
- Part 2: AI Reasoning Layer integration
- Part 3: PIT Integration Rules and deduplication logic
- Part 4: QA test specifications and validation requirements

### Planned for v2.0
- Machine learning-based priority prediction
- Historical priority effectiveness analysis
- Organization-specific priority tuning
- Multi-cycle gap trend analysis

---

## Change Review Process

All changes to this specification must:
1. Update the version number (semantic versioning)
2. Add entry to this CHANGELOG
3. Notify PIT implementation team
4. Update dependent documents (PIT_SCORING_INTEGRATION_WORKFLOW, etc.)
5. Trigger QA test review and updates

---

**Document Status:** ✅ Approved for Implementation  
**Approval Date:** 2025-12-09  
**Next Review:** After Part 4 completion or 2025-Q2 (whichever comes first)
