THREAT_MODEL_ROUTING_SPEC_v1.0.md

Threat Module — AI Model Routing Specification
Version: 1.0
Aligned with:**

THREAT_TRUE_NORTH_v1.0.md

THREAT_EDGE_FUNCTIONS_v1.1.md

THREAT_WATCHDOG_LOGIC_v1.0.md

Maturion AI Governance Framework

SRMF Safety Rules

ISMS Interoperability Requirements

0. PURPOSE

This document defines exactly how AI models are selected, routed, invoked, validated, and governed within the Threat Module.

It ensures:

deterministic model usage

predictable outputs

strict safety guardrails

full traceability

zero regression

seamless multi-model orchestration across the Maturion ISMS

This is a non-optional core governance document.

1. MODEL ROUTING OVERVIEW

The Threat Module uses 5 AI model classes, each with unique responsibilities:

1. Classification Model
2. TAP Generator Model
3. TTP Mapping Model
4. Drift Forecasting Model
5. Threat Intelligence Narrative Model


All AI operations must:

require human approval

be logged

be deterministic per version

never modify DB directly

run through Foreman routing system

2. MODEL ROUTING PHILOSOPHY

In alignment with True North:

2.1 “AI Does the Work — Humans Approve”

AI performs analysis, recommendations, and pattern detection, but:

cannot auto-apply

cannot auto-publish

cannot override workflows

2.2 “Models are Loosely Coupled; Logic is Tightly Controlled”

Each model can change independently
as long as routing rules remain constant.

2.3 “Low-Cost Default; High-Cost On-Demand”

Where models have heavy compute:

run low-cost by default

escalate to high-cost only when required

3. MODEL INVENTORY

Below is the default model set for v1.0.

3.1 Classification Model

Purpose:

Categorize threat

Suggest subcategory

Validate adversarial vs non-adversarial

Suggest severity baseline

3.2 TAP Generator Model

Purpose:

Build threat actor profile

Analyze capabilities

Suggest actor motivation & targeting preference

3.3 TTP Mapping Model

Purpose:

Suggest MITRE ATT&CK techniques relevant

Identify missing TTPs

Suggest confidence levels

3.4 Drift Forecasting Model

Purpose:

Predict future drift

Detect seasonal anomalies

Detect incident-driven spikes

3.5 Threat Narrative Model

Purpose:

Produce analytical summaries

Generate intelligence briefings

Generate export narratives

4. MODEL ROUTING LOGIC

This section defines the EXACT rules used by Foreman → AI Core to determine which model runs, when, and under what conditions.

4.1 Classification Routing Rules
If threat.category is NULL OR user requests classification:
    Route → Classification Model (Low-cost)
Else if user requests deeper analysis:
    Route → Classification Model (High-cost)

Required Pre-Inputs:

threat basic metadata

user-provided description

TTP references (if any)

facility & process metadata

Output routed to:

classification staging table

AI log

Not allowed:

Auto-write to DB

Override user classification

4.2 TAP Routing Rules
If threat.type = adversarial:
    Always require TAP
If threat.type = non-adversarial:
    TAP optional


Routing logic:

If TAP missing:
    Route → TAP Generator Model (Low-cost first)
If TAP inconsistent or updated:
    Route → TAP Generator Model (High-cost)

Pre-Inputs:

threat description

historical incidents

facility profiles

intelligence signals

user context

Outputs:

actor capability vector

actor sophistication

actor experience rating

Stored in TAP staging table.

4.3 TTP Routing Rules

TTP routing depends on:

threat type

TAP capability

facility type

process criticality

Routing logic:

If no TTPs present:
    Route → TTP Model (Low-cost)  
If analyst requests expansion:
    Route → TTP Model (High-cost)
If drift > 0.5:
    Route → TTP Model (Recompute relevance)

Pre-Inputs:

threat metadata

TAP vector

known TTPs

MITRE library

Outputs:

TTP list

relevance score

ai_confidence

4.4 Drift Routing Rules

Drift model is used more frequently.

Routing logic:

On threat publish:
    Compute baseline drift → Drift Model (Low-cost)

On incident linking:
    Recompute drift → Drift Model (High-cost)

On remote assurance failure event:
    Recompute drift → Drift Model (High-cost)

Daily cron:
    Compute seasonal drift → Drift Model (Low-cost)


Drift must always remain version-specific.

4.5 Narrative / Intelligence Routing Rules

Triggered during:

Export generation

Intelligence dashboard load

Management briefing generation

Routing logic:

If user requests intelligence brief:
    Route → Narrative Model (High-cost)
Else:
    Route → Narrative Model (Low-cost summarizer)


Inputs:

threat classifications

TAP

TTP

drift

incident data

RA/WRAC/PIT alignment

control ecosystem

Outputs:

human-readable summary

actionable insights

risk projection narrative

5. MODEL RUN CONDITIONS
5.1 Synchronous Runs

Used when:

Wizard step requires immediate result

Analyst explicitly requests it

Reviewers require real-time suggestions

5.2 Asynchronous Runs

Used for:

Drift recompute

Intelligence updates

Seasonal patterns

Remote assurance inputs

5.3 Batch Runs

Executed:

Nightly

Weekly

On incident import

6. MODEL GOVERNANCE RULES
6.1 All AI interactions MUST be logged

The following must be stored:

model name

version

input hash

output hash

confidence

model latency

requesting user

acceptance/rejection flag

6.2 No AI can override human decisions

If AI disagrees with human classification:

log discrepancy

store alternative suggestion

6.3 Model Output Must Be Validated

If output malformed:

retry once

fallback to alternative model

notify analyst

6.4 No “Silent Writes” permitted

Models cannot update DB directly.

All updates flow through:

AI Output → Staging → User Approval → Edge Function → DB

7. VECTOR MODEL INTEGRATION

Threat Module uses pgvector for:

TAP capabilities

TTP relevance embeddings

Drift embedding

Intelligence clustering

7.1 Vector Dimensions

Standard: 384 – 768d

7.2 Preprocessing Required:

remove stopwords

normalize text

facility/process context embedding

merge actor/tactic embeddings

8. MODEL SAFETY RULES
8.1 Hallucination Guardrails

If AI produces:

false TTP

non-existent actor capability

impossible drift
→ WATCHDOG triggers red alert.

8.2 Consistency Checks

Model outputs must satisfy:

No negative drift
Confidence <= 1
Valid TTP formats (Txxxx)
Category-subcategory alignment

8.3 Sanitization

All text outputs sanitized for:

PII

PHI

confidential intel leakage

9. MODEL SELECTION MATRIX
ACTION	LOW-COST MODEL	HIGH-COST MODEL	TRIGGER
Classify Threat	✔	✔	User request / missing category
Generate TAP	✔	✔	If adversarial OR missing capability data
Suggest TTPs	✔	✔	If no mappings OR drift high
Compute Drift	✔	✔	Baseline / Incident / Control failures
Generate Intelligence	✔	✔	Export / Management brief
10. MODEL UPGRADE PATH

When upgrading models:

Store old → new version mapping

Update model registry

Recompute embeddings if needed

Trigger partial recompute for TAP, TTP, Drift

Store “model upgrade record”

Foreman sign-off required

11. FAILOVER LOGIC
If model fails:

Retry low-cost version

Switch to backup model

Log failure

Notify Foreman

Provide user with fallback heuristics

12. ACCEPTANCE CRITERIA

Model routing is complete when:

All routing rules implemented

All AI operations logged

All staging flows validated

All safety checks pass

All integration points (TAP/TTP/Drift/Intel) functional

Watchdog monitors model anomalies

Foreman approval granted

✔ END OF THREAT_MODEL_ROUTING_SPEC_v1.0.md