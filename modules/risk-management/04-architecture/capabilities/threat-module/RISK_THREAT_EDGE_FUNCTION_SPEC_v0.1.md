📘 RISK_THREAT_EDGE_FUNCTION_SPEC_v0.1.md

Module: Risk Engine – Threat Module
Version: 0.1
Approved By: Foreman Supervisor
Purpose: Backend function contract definitions (server actions / API endpoints / serverless functions)

0. PRINCIPLES

All edge functions must:

Conform to True North

Fully support QA automation

Fail safe (never silently succeed)

Log every mutation

Prevent regressions

Be pure, stateless, deterministic

Enforce all validation rules

Use Zod schemas for request validation

Use Postgres transactions for multi-table updates

Always return machine- and human-readable errors

Functions must be atomic — one purpose, one responsibility.

1. NAMING CONVENTION

All Threat Module functions are prefixed:

EF_RISK_*


Threat-specific functions use:

EF_RISK_THREAT_*


Categories:

LIST_* – fetch collections

GET_* – fetch a single object

CREATE_* – create new

UPDATE_* – modify

DELETE_* – archive/deprecate

AI_* – AI-based suggested/logic

RUN_* – run processes (QA, recalculation)

LINK_* – cross-module connections

2. INDEX OF ALL EDGE FUNCTIONS
A. Threat Entity Functions

EF_RISK_LIST_THREATS

EF_RISK_GET_THREAT_DETAIL

EF_RISK_CREATE_THREAT

EF_RISK_UPDATE_THREAT

EF_RISK_ARCHIVE_THREAT

B. Characterisation Functions

EF_RISK_GET_THREAT_CHARACTERISATION

EF_RISK_UPDATE_THREAT_CHARACTERISATION

EF_RISK_AI_SUGGEST_CHARACTERISATION

C. Rating & Scoring Functions

EF_RISK_SUBMIT_THREAT_RATING

EF_RISK_APPROVE_THREAT_RATING

EF_RISK_AI_PROPOSE_THREAT_RATING

EF_RISK_RECALCULATE_RATING

D. Data Signal & Dynamic Updating

EF_RISK_COLLECT_DATA_SIGNAL

EF_RISK_LIST_DATA_SIGNALS

EF_RISK_ANALYSE_TRENDS

EF_RISK_LOG_RATING_HISTORY

E. Evidence & Linking

EF_RISK_CREATE_THREAT_EVIDENCE_SNAPSHOT

EF_RISK_LINK_PIT

EF_RISK_LINK_BES

EF_RISK_LINK_UNWANTED_EVENT

F. QA Functions

EF_RISK_RUN_THREAT_QA

EF_RISK_LIST_THREAT_QA_RESULTS

3. FULL SPECIFICATIONS (1–22)
3.1 EF_RISK_LIST_THREATS

Purpose: Fetch filtered threats for org/site/context.

Input (Zod schema)
filters = z.object({
  orgId: z.string().uuid(),
  siteId: z.string().uuid(),
  contextId: z.string().uuid().optional(),
  type: z.enum(['all','adversarial','non_adversarial']).default('all'),
  status: z.enum(['all','active','archived']).default('active'),
  band: z.enum(['all','Low','Moderate','High','Extreme']).default('all'),
  search: z.string().optional(),
});

Output
{
  threats: ThreatRowData[]
}

Failure Conditions

org/site mismatch → ORG_SITE_MISMATCH

invalid filter values → INVALID_FILTER

DB unavailable → DATABASE_ERROR

3.2 EF_RISK_GET_THREAT_DETAIL

Fetch all details for one threat.

Input
{ threatId: UUID }

Output
{
  threat: ThreatDetail,
  characterisation: ThreatCharacterisation,
  rating: ThreatRating | null,
  dataSignals: ThreatDataSignal[],
  links: {
    bes: BESLink[],
    unwantedEvents: UnwantedEventLink[],
    pit: PITLink[]
  }
}

Failure

Not found → THREAT_NOT_FOUND

3.3 EF_RISK_CREATE_THREAT
Input
{
  orgId: UUID,
  siteId: UUID,
  name: string,
  description?: string,
  type: 'adversarial' | 'non_adversarial',
  category: ThreatCategoryEnum
}

Output
{ threatId: UUID }

Validation

name required

type allowed

category allowed

duplicates blocked

3.4 EF_RISK_UPDATE_THREAT

Updates non-characterisation fields.

3.5 EF_RISK_ARCHIVE_THREAT

Soft-delete threat.

3.6 EF_RISK_GET_THREAT_CHARACTERISATION

Input:

{ threatId: UUID }


Output:

{ characterisation: ThreatCharacterisation }

3.7 EF_RISK_UPDATE_THREAT_CHARACTERISATION
Input
{
  threatId: UUID,
  payload: ThreatCharacterisationInput
}

Validation

must include all NIST fields

cannot mix adversarial + non-adversarial descriptors

text must not exceed max length

AI rewrite available but not mandatory

3.8 EF_RISK_AI_SUGGEST_CHARACTERISATION

Uses:

BES

NIST tables

Industry profiles

Incident history

Public domain data

Output:

{
  suggestion: ThreatCharacterisation,
  explanation: string
}

3.9 EF_RISK_SUBMIT_THREAT_RATING
Input
{
  threatId: UUID,
  contextId: UUID,
  ratingType: 'baseline' | 'dynamic',
  scores: {
    capability?: number,
    intent?: number,
    targeting?: number,
    occurrence?: number,
    effects?: number
  },
  justification: string
}

Logic

validate missing dimensions

compute weighted metrics

compute likelihood/severity

apply banding rules

write to threat_rating

log to history

3.10 EF_RISK_APPROVE_THREAT_RATING

Ensures:

approver != submitter

all required fields defined

ratingType = baseline | dynamic

3.11 EF_RISK_AI_PROPOSE_THREAT_RATING

Uses:

incident data

external crime stats

news sentiment

abnormal spikes

trends in related threats

NIST-derived rules

Output:

{
  proposedRating: ThreatRating,
  explanation: string
}

3.12 EF_RISK_RECALCULATE_RATING

Re-runs scoring without AI suggestion.

3.13 EF_RISK_COLLECT_DATA_SIGNAL
Input
{
  threatId: UUID,
  source: DataSourceEnum,
  metricName: string,
  metricValue: number,
  metricWindow: '1m'|'3m'|'6m'|'12m'
}


Writes to threat_data_signal.

3.14 EF_RISK_LIST_DATA_SIGNALS

Output: all signals for a threat.

3.15 EF_RISK_ANALYSE_TRENDS

Computes:

moving averages

standard deviation

spike detection

trend direction

trend strength

“threat shift” triggers

Updates:
threat.trend

3.16 EF_RISK_LOG_RATING_HISTORY

Automatic for every change.

3.17 EF_RISK_CREATE_THREAT_EVIDENCE_SNAPSHOT
Output
{
  evidenceId: UUID,
  file: JSON or PDF
}


Used in:

Maturity

Audits

Evidence-based reviews

3.18 EF_RISK_LINK_PIT

Create relation between Threat → PIT Project/Task.

3.19 EF_RISK_LINK_BES

Threat → Business Environment Scan.

3.20 EF_RISK_LINK_UNWANTED_EVENT

Threat → Unwanted Event.

3.21 EF_RISK_RUN_THREAT_QA

Uses the QA test suite defined in RISK_THREAT_QA_IMPLEMENTATION_PLAN.

Returns:

{
  totalTests: number,
  passed: number,
  failed: number,
  failures: QAFailureEntry[]
}

3.22 EF_RISK_LIST_THREAT_QA_RESULTS

Historical QA tests per context.

4. ERROR CODES (Global, Canonical)
Code	Meaning
INVALID_PAYLOAD	Any schema validation fail
UNAUTHORIZED	User lacks permission
THREAT_NOT_FOUND	Threat ID invalid
INVALID_DIMENSION	Invalid score set
SCORE_OUT_OF_RANGE	>5 or <1
DB_ERROR	Postgres failure
AI_FAILURE	Model returned unusable output
AI_UNCERTAIN	AI cannot produce confident result
PROTECTED_RECORD	Archiving prohibited
DUPLICATE_THREAT	Name + category + site collision
5. LOGGING & AUDIT

All EF_* must log:

actor

org/site/context

previous values

new values

justification

AI explanation (if applicable)

timestamp

Stored under system_audit table (shared).

6. SECURITY REQUIREMENTS

All write functions require elevated permissions

AI suggestions must NEVER auto-apply

Approval must be human

No cross-org data bleed

All inputs sanitized

All outputs filtered by role

7. VERSIONING

This file:
RISK_THREAT_EDGE_FUNCTION_SPEC_v0.1

Next update will include:

Vulnerability edge functions

RCCR (Risk Cause Chain Resolution) edge functions

Asset-based risk scoring

Workflow integration for Threat + Vulnerability → Risk register