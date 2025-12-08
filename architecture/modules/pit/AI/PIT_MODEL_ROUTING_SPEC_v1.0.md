Below is the complete PIT_MODEL_ROUTING_SPEC_v1.0.md, written to the same architectural depth and rigor as the rest of the PIT v1.0 suite.

This document defines how PIT decides which AI model(s) to invoke, for which tasks, under what conditions, using what data, and with what fallback or escalation behaviour.

This is essential for:

Reproducibility

Predictability

Zero Regression

Model explainability

Cost control

Performance optimisation

Future extensibility (e.g., plug-in new models)

Place in:

/Modules/PIT/AI/PIT_MODEL_ROUTING_SPEC_v1.0.md

PIT_MODEL_ROUTING_SPEC_v1.0.md

Project Implementation Tracker — AI Model Routing Specification
Version 1.0
Scope: How PIT selects, routes, and orchestrates AI models across all PIT functions
Linked Modules: WRAC, RA, Controls, Bowtie, Audit, Incident, Remote Assurance, Data Analytics

0. PURPOSE

This document defines the AI Orchestration Layer for PIT.

It ensures that:

PIT selects the correct model for every AI task

PIT uses models efficiently, safely, and predictably

Expensive models are used only when necessary

Lightweight models handle high-frequency tasks

Routing is deterministic yet adaptable

AI behaviour is explainable, auditable, and versioned

This specification guarantees that PIT functions remain stable, scalable, and cost-effective as the ISMS evolves.

1. MODEL ROUTING ARCHITECTURE

PIT uses a three-layer AI routing system:

Layer 1 — Trigger Type
Layer 2 — Complexity & Confidence
Layer 3 — Model Policy Rules


Together, these determine which model is selected:

lightweight (fast, cheap)
standard (balanced)
advanced (high intelligence)
specialized (domain-specific)
vision/audio models (evidence)

2. MODEL CLASSES

For PIT v1.0, model classes are:

2.1 Lightweight Models

Fast, cheap, high-speed processing.
Used for:

Routine summaries

Short text classification

Basic scheduling decisions

Evidence metadata extraction

Examples:

GPT-4.1-mini

GPT-4.1-fast

2.2 Standard Models

Mid-range intelligence, balanced performance.
Used for:

Moderate task generation

WRAC → PIT mapping

Dependency proposals

Cost estimation

Medium-length decisions

Examples:

GPT-4.1

2.3 Advanced Models

High intelligence, expensive.
Used for:

Complex reasoning

Large RA-to-PIT conversions

Bowtie barrier mapping

Multi-risk mitigation design

Project-level WBS generation

Examples:

GPT-4.1-advanced

GPT-5.1 reasoning layer (future)

2.4 Vision Models

Used for:

Evidence validation

CCTV screenshots

Photo-based verifications

Document parsing (PDFs, scanned reports)

Examples:

GPT-4o

GPT-4.1-V

2.5 Audio Models

Used for:

Voice note evidence

Meeting transcript ingestion

Interview logs

Examples:

Whisper v3

2.6 Specialized Models

Reserved for:

Scheduling optimization (future RL model)

Predictive system availability modelling

Control effectiveness prediction

Cost trend forecasting

Examples:

“risk-mitigation-optimizer-v1” (future custom)

“scheduling-rl-agent-v2” (future)

3. ROUTING LOGIC BY PIT FUNCTION

This section specifies exactly which model to invoke for each PIT action.

3.1 Task Generation (WRAC → PIT)

Input:

Control sets

Risk ratings

Project templates

Historical data

Routing:

Complexity	Trigger Conditions	Model
Low	Single control, simple mitigation	GPT-4.1-mini
Medium	Multi-control, single risk	GPT-4.1
High	Multi-control, multi-risk (clusters)	GPT-4.1-advanced

Fallback:
If advanced model confidence < 0.75 → reroute to human approval.

3.2 Subtask Decomposition

Routing:

If ≤ 5 subtasks expected → lightweight
If 6–15 subtasks → standard
If > 15 subtasks OR interdependencies → advanced

3.3 Dependency Suggestion

Routing:

Simple FS/SS → lightweight

Mixed dependency types → standard

Cross-project dependencies → advanced

3.4 Scheduling Optimization (Critical Path)

Routing:

Minor adjustment (< 1-day drift) → lightweight

Multi-task slippage → standard

Multi-WP rescheduling → advanced

Predictive modelling → specialized (future RL agent)

3.5 Cost Forecasting

Routing:

Simple CAPEX/OPEX lookup → lightweight

Multi-vendor estimate → standard

Multi-phase CAPEX rollup → advanced

Predictive trends → specialized

3.6 Evidence Verification (Vision)

Routing:

Evidence Type	Model
Photos	GPT-4o
Screenshots	GPT-4o-mini
Scanned documents	GPT-4o
PDF multi-page	GPT-4.1-V
CCTV frame	GPT-4o (vision)
Voice note	Whisper v3
Video clip	GPT-4.1-V + Whisper

Fallback:
If evidence detection confidence < 0.7 → human review.

3.7 Risk & Control Mapping

Triggered by:

Updated evidence

Control effectiveness

Residual risk recalculations

Routing:

Simple risk → control mapping → lightweight

Multi-risk → multi-control mapping → standard

PUE/Bowtie barrier mapping → advanced

3.8 Watchdog Auto-Fixes

Triggered by:

Schedule drift

Stalled tasks

Evidence overdue

Critical control failure

Routing Based on Severity:

Severity	Model
LOW & MEDIUM	GPT-4.1-mini
HIGH	GPT-4.1
CRITICAL	GPT-4.1-advanced
3.9 Weekly AI Summary

Routing:

Projects < 200 tasks → standard

Projects 200–1000 tasks → advanced

Projects > 1000 tasks → advanced + specialized trend model

3.10 Project-Wide Risk Mitigation Prediction

Future feature.

Routing (v1.0):

Standard model for text-based prediction

Routing (v2.0+):

Specialized model “risk-mitigation-optimizer-v1”

4. MODEL ROUTING FRAMEWORK

Model routing follows a deterministic algorithm:

1. Identify PIT Function
2. Compute Complexity Score (0–100)
3. Compute Confidence Requirement
4. Compute Cost Limit
5. Evaluate Data Requirements (text, vision, audio)
6. Select appropriate model class
7. Log selection in pit_ai_log
8. Execute
9. Validate output
10. Apply fallback if required

5. COMPLEXITY SCORING MODEL

Complexity scoring determines which model class to route to.

Score Variables:

Task count

Linked risks

Linked controls

Linked barriers

Dependency count

Evidence coverage

Cost variance

Historical failures

AI confidence from previous cycles

Output:
0–30     → lightweight
31–60    → standard
61–90    → advanced
91–100   → advanced + specialized

6. FALLBACK & ESCALATION LOGIC
6.1 Low Confidence Output

If model returns <70% confidence:

Re-run using next higher class

Log incident (AI_FALLBACK)

Notify owner if still <70%

6.2 Contradictory Output

If the model contradicts established rules:

Reject output

Reroute to advanced

Raise Watchdog alert

6.3 Budget Exceeded

If monthly model budget exceeds threshold:

Automatic downgrade to standard

Only critical tasks use advanced

6.4 Emergency Overrides

For Severity 1 alerts:

Always use advanced model

Ignore cost restrictions

7. LOGGING & AUDIT TRAIL

All AI interactions are logged in:

pit_ai_log


Each log entry includes:

task_id / project_id

model_name

model_version

input_summary_hash

output_summary_hash

latency

cost_estimate

confidence

fallback_used=true/false

escalated=true/false

This ensures transparency and auditability.

8. PERFORMANCE REQUIREMENTS

Lightweight model latency < 0.5s

Standard model latency < 2s

Advanced model latency < 6s

Vision model latency < 8s for images

Evidence PDF (multi-page) < 12s

Audio transcription < real-time

9. QA REQUIREMENTS

Per PIT_QA_IMPLEMENTATION_PLAN_v1.1.md:

Test all routing branches

Validate confidence scoring

Validate fallback behaviour

Test vision inputs

Verify audit logging

Load test routing performance

Regression tests required for every routing change

10. FUTURE MODEL ROUTING UPGRADES

Planned for PIT v2.0+:

Reinforcement learning scheduling engine

Predictive risk-control failure model

Cross-project intelligence model

Long-context transformer for complex documents

Real-time anomaly detection for Remote Assurance

Multi-agent PIT AI orchestration

✔ END OF PIT_MODEL_ROUTING_SPEC_v1.0.md