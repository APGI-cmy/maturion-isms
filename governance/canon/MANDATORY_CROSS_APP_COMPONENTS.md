# MANDATORY CROSS-APP COMPONENTS — Reference Specification

## Status
**Type**: Canonical Governance Standard  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-02-13  
**Owner**: Governance Repository Administrator  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Maturion Applications, All Repositories, All New Builds

---

## 1. Purpose

This document provides a **single, authoritative specification** listing all mandatory components and patterns that MUST be present in every Maturion application/repository.

This specification serves as:
- **Master checklist** for new app initialization and bootstrapping
- **Audit reference** for completeness verification
- **Governance index** linking to detailed component specifications
- **Bridge document** connecting constitutional canon to architecture completeness

**Foundational Principle**: No application is complete without explicit implementation of all mandatory cross-app components. Missing components constitute governance violations.

---

## 2. Constitutional Authority

This specification derives authority from and integrates with:

- **CONSTITUTION.md** — Governance supremacy and constitutional requirements
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** — Governance as canonical memory
- **ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md** — Architecture completeness criteria
- **BUILD_PHILOSOPHY.md** — QA-first, architecture-driven development
- **LIVING_AGENT_SYSTEM.md** — Living Agent System v6.2.0 framework

---

## 3. Scope

### 3.1 In Scope

This specification covers:
- Universal mandatory components required in ALL applications
- Agent system requirements (contracts, workspace, memory)
- Observability and monitoring requirements
- Compliance and evidence requirements
- Performance measurement standards
- Feedback and learning mechanisms
- Startup and commissioning requirements
- Layer-down propagation rules

### 3.2 Out of Scope

This specification does NOT cover:
- Application-specific business logic or features
- Technology stack or framework selection (unless mandated by governance)
- Implementation details (addressed in architecture documents)
- Operational procedures (addressed in runbooks)

### 3.3 Applicability

Applies to:
- ✅ All new applications and repositories
- ✅ All applications under governed build execution
- ✅ All applications requiring Maturion platform integration
- ⚠️  Existing legacy applications (compliance roadmap required)

Does NOT apply to:
- ❌ Governance repository itself (has specialized requirements)
- ❌ Temporary proof-of-concept repositories (unless promoted to production)

---

## 4. Mandatory Component Categories

Components are organized into eight mandatory categories:

1. **Agent System & Contracts** — Living Agent System integration
2. **Watchdog & Oversight** — Quality integrity and governance monitoring
3. **Performance Measurement** — AI, app, and service performance
4. **Observability & Telemetry** — Health checks, logging, monitoring
5. **Feedback & Learning** — Continuous improvement and learning loops
6. **Compliance & Evidence** — Audit readiness and control traceability
7. **Startup & Commissioning** — Progressive activation and validation
8. **Architecture Completeness** — Deployment and runtime requirements

---

## 5. CATEGORY 1: Agent System & Contracts

### 5.1 Agent Contract File (`.agent`)

**Requirement**: MANDATORY  
**Specification**: `governance/canon/agent-contracts-guidance/.agent.schema.md`  
**Location**: Repository root (`.agent`)

**Required Elements**:
- Agent identity and mission statement
- Governance bindings (minimum Tier-0 mandatory bindings)
- Scope definitions (allowed paths, restricted paths, escalation paths)
- Capabilities and constraints
- Enforcement rules
- LOCKED sections (non-modifiable by agents)

**Validation**: Must pass `.github/scripts/agent-file-validator.sh`

**Related Standards**:
- `AGENT_FILE_BINDING_REQUIREMENTS.md` — Mandatory governance bindings
- `AGENT_FILE_CREATION_POLICY.md` — Creation and approval process
- `AGENT_CONTRACT_PROTECTION_PROTOCOL.md` — LOCKED sections protection

---

### 5.2 Agent Workspace Structure

**Requirement**: MANDATORY  
**Specification**: `LIVING_AGENT_SYSTEM.md` Section 6  
**Location**: `.agent-workspace/[agent-type]/`

**Required Subdirectories**:
```
.agent-workspace/
├── [agent-type]/
│   ├── memory/              # Session memories (≤5 active, archive older)
│   ├── context/             # Long-term context files
│   ├── personal/            # Lessons learned, patterns
│   ├── escalation-inbox/    # CS2 escalations
│   ├── working-contract.md  # Ephemeral (gitignored)
│   └── environment-health.json  # Ephemeral (gitignored)
```

**Memory Management**:
- Keep ≤5 most recent session memories
- Archive older sessions to `memory/.archive/`
- Session memory template: `LIVING_AGENT_SYSTEM.md` Section 11

**Related Standards**:
- `LIVING_AGENT_SYSTEM.md` — Agent lifecycle and workspace
- `FOREMAN_MEMORY_PROTOCOL.md` — FM-specific memory requirements
- `MEMORY_LIFECYCLE_STATE_MACHINE_CONTRACT.md` — Memory state management

---

### 5.3 Wake-Up and Session Closure Protocols

**Requirement**: MANDATORY  
**Specification**: `LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md`  
**Scripts**: `.github/scripts/wake-up-protocol.sh`, `.github/scripts/session-closure.sh`

**Wake-Up Protocol** (7 phases):
1. Self-identification
2. Memory scan (last 5 sessions)
3. Governance discovery and loading
4. Environment health check
5. Drift detection
6. Auto-remediation
7. Working contract generation

**Session Closure Protocol**:
1. Evidence capture
2. Memory rotation
3. Escalation creation (if needed)
4. Session memory file creation
5. Environment cleanup

**Related Standards**:
- `PRE_WORK_GOVERNANCE_SELF_TEST_PROTOCOL.md` — Pre-work validation
- `AGENT_SELF_GOVERNANCE_PROTOCOL.md` — Self-governance checks

---

### 5.4 Agent Class-Specific Requirements

**Requirement**: MANDATORY per agent class  
**Specification**: `GOVERNANCE_AGENT_REQUIREMENTS_MATRIX.md`

**Builder Agents**:
- Build-to-green (BtG) authority
- Test-writing obligation
- Evidence generation requirements
- PR scope control

**Foreman (FM) Agent**:
- Wave planning and issue generation
- Builder supervision and appointment
- Merge gate management
- Learning loop integration

**Governance Liaison Agent**:
- Syntax-only change authority
- CS2 escalation for semantic changes
- Ripple awareness and signaling
- Baseline enforcement

**Related Standards**:
- `AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md` — Gate requirements per class
- `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` — FM authority boundaries
- `BUILDER_FIRST_PR_MERGE_MODEL.md` — Builder PR requirements

---

## 6. CATEGORY 2: Watchdog & Oversight

### 6.1 Watchdog Agent Configuration

**Requirement**: MANDATORY (if repo has autonomous agents)  
**Specification**: `WATCHDOG_AUTHORITY_AND_SCOPE.md`  
**Binding**: Required in `.agent` for repos with watchdog

**Watchdog Responsibilities**:
1. **Governance Alignment Drift** — Monitor canon compliance
2. **Memory Integrity Events** — Verify memory completeness/consistency
3. **Execution Boundaries** — Detect out-of-scope actions
4. **Silent Degradation** — Identify quality decay without explicit failure
5. **Learning Loop Integrity** — Verify failure promotion

**Escalation Triggers**:
- Soft stop: Advisory alert for minor drift
- Hard stop: Constitutional violation requiring immediate halt

**Related Standards**:
- `WATCHDOG_COGNITIVE_OBSERVATION_PROTOCOL.md` — Observation patterns
- `WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md` — Quality integrity monitoring

---

### 6.2 Quality Integrity Watchdog (QIW) Integration

**Requirement**: MANDATORY (for apps with QA automation)  
**Specification**: `WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md` Section 5-7  
**Implementation**: Engine monitoring 5 log channels (build, lint, test, deployment, runtime)

**Required Channels**:
1. Build channel — Compilation and bundling anomalies
2. Lint channel — Code quality and style violations
3. Test channel — Test failures, flaky tests, coverage gaps
4. Deployment simulation channel — Pre-deployment validation
5. Runtime initialization channel — Startup and health checks

**Dashboard Requirements**:
- Real-time status display (green/amber/red)
- Anomaly trends (7-day window)
- QA blocking status
- API endpoint for programmatic access

**Related Standards**:
- `BUILD_INTERVENTION_AND_ALERT_MODEL.md` — Build intervention rules
- `CASCADING_FAILURE_CIRCUIT_BREAKER.md` — Failure containment

---

## 7. CATEGORY 3: Performance Measurement

### 7.1 AI Performance Metrics

**Requirement**: MANDATORY (for apps using AI agents or models)  
**Specification**: Architecture-specific, derived from `COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md`

**Required Measurements**:
- **Model Selection Tracking** — Which model tier used per task
- **Token Consumption** — Input/output tokens per operation
- **Latency Metrics** — Response time per AI operation
- **Error Rates** — AI failures, hallucinations, guardrail violations
- **Cost Tracking** — AI API costs per operation

**Integration Points**:
- Memory Fabric: `/memory/governance/ai-performance/`
- Telemetry: Structured logs with AI operation metadata
- Dashboard: AI performance summary and trends

**Related Standards**:
- `COGNITIVE_HYGIENE_AUTHORITY_MODEL.md` — Model tier boundaries
- `COGNITIVE_HYGIENE_MEMORY_INTEGRATION_MODEL.md` — Memory access patterns

---

### 7.2 Application Performance Metrics

**Requirement**: MANDATORY  
**Specification**: Architecture-specific, framework for all apps

**Required Measurements**:
- **Response Time** — API endpoint latency (p50, p95, p99)
- **Throughput** — Requests per second
- **Error Rates** — 4xx and 5xx response rates
- **Availability** — Uptime percentage
- **Resource Utilization** — CPU, memory, network usage

**Integration Points**:
- Telemetry system (structured logs)
- Health check endpoints
- Dashboard APIs

---

### 7.3 Service Performance Metrics

**Requirement**: MANDATORY (for distributed/microservice apps)  
**Specification**: Architecture-specific, service mesh integration

**Required Measurements**:
- **Service Latency** — Inter-service call latency
- **Dependency Health** — External service availability
- **Circuit Breaker Status** — Failure isolation state
- **Retry Metrics** — Retry attempts and success rates

---

## 8. CATEGORY 4: Observability & Telemetry

### 8.1 Health Check Endpoints

**Requirement**: MANDATORY  
**Specification**: `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` Section 3.9  
**Standard Path**: `/api/health` or `/health`

**Minimum Response**:
```json
{
  "status": "healthy" | "degraded" | "unhealthy",
  "timestamp": "ISO8601",
  "checks": {
    "database": { "status": "healthy", "latency": 15 },
    "external_api": { "status": "healthy", "latency": 120 },
    "configuration": { "status": "healthy" }
  }
}
```

**Initialization Checks**:
- Configuration loaded
- Dependencies available
- Database connectivity
- External service integrations
- Environment variables validated

**Related Standards**:
- `APP_STARTUP_REQUIREMENTS_DECLARATION.md` — Startup validation
- `SYSTEM_COMMISSIONING_AND_PROGRESSIVE_ACTIVATION_PROTOCOL.md` — Activation phases

---

### 8.2 Structured Logging

**Requirement**: MANDATORY  
**Specification**: Architecture-specific, JSON structured logs

**Required Fields**:
- `timestamp` (ISO8601)
- `level` (DEBUG, INFO, WARN, ERROR, CRITICAL)
- `message` (human-readable)
- `context` (operation-specific metadata)
- `trace_id` (for request correlation)
- `agent_id` (if agent-generated)

**Log Categories**:
- Application events
- Agent actions
- Governance operations
- Performance metrics
- Error and exception traces

---

### 8.3 Runtime Telemetry

**Requirement**: MANDATORY  
**Specification**: `MATURION_RUNTIME_EXECUTION_MONITOR_SPEC.md`  
**Integration**: Memory Fabric telemetry paths

**Required Telemetry**:
- Execution state transitions (assigned, in progress, blocked, completed)
- Agent action traces
- Performance metrics
- Error classifications
- Anomaly detection

**Telemetry Standards**:
- Real-time event stream
- State snapshots on demand
- Violation detection
- Forensic analysis support

**Related Standards**:
- Architecture document: `runtime-readiness-check-architecture.md`
- Sandbox telemetry: `maturion/sandbox-observability-telemetry-spec.md`

---

### 8.4 Dashboard APIs

**Requirement**: MANDATORY (for user-facing apps)  
**Specification**: `docs/DASHBOARD_SPEC.md`

**Minimum Endpoints**:
- `/api/[app]/status` — Overall application status
- `/api/[app]/metrics` — Performance metrics summary
- `/api/[app]/health` — Health check aggregation

**Dashboard Integration**:
- Real-time status updates
- Trend visualization
- Alerting integration
- Evidence export for governance

---

## 9. CATEGORY 5: Feedback & Learning

### 9.1 Learning Loop Integration

**Requirement**: MANDATORY  
**Specification**: `LEARNING_LOOP_CATEGORIES_AND_LIFECYCLE.md`

**Learning Categories**:
1. **Tier-0** (Constitutional) — Foundational principle gaps → `maturion/*.md`
2. **Tier-1** (Policy/Canon) — Governance rule gaps → `governance/canon/*.md`
3. **BL** (Bootstrap Learning) — Execution insights → `BOOTSTRAP_EXECUTION_LEARNINGS.md`
4. **FL-CI** (Failure/Continuous Improvement) — Failure patterns → Wave reconciliation

**Required Artifacts**:
- Failure capture mechanism (RCA, incident reports)
- Learning classification (category, severity, promotion trigger)
- Governance promotion process (Tier-1 escalation)
- Learning promotion evidence trail

**Related Standards**:
- `LEARNING_INTAKE_AND_PROMOTION_MODEL.md` — Learning intake process
- `FAILURE_PROMOTION_RULE.md` — When to promote to governance
- `WE_ONLY_FAIL_ONCE_DOCTRINE.md` — Mandatory structural change

---

### 9.2 Feedback Mechanisms

**Requirement**: MANDATORY  
**Specification**: `RIPPLE_INTELLIGENCE_LAYER.md` Section 5.3 (Plane 3)

**Upward Ripple (Layer-Up) Process**:
1. **Detection** — Identify drift, gaps, failures, enhancements
2. **Classification** — Categorize as learning type (Tier-0/1, BL, FL-CI)
3. **Intake** — Submit layer-up proposal to governance-repo-administrator
4. **Validation** — Verify evidence, assess impact
5. **Integration** — Update canon, trigger ripple to consumers
6. **Tracking** — Record in ripple log with issue links

**Layer-Up Triggers**:
- Governance drift detected in application
- Missing or incomplete canonical guidance
- Failure pattern affecting multiple repos
- Enhancement applicable to all apps

**Related Standards**:
- `LAYER_UP_PROTOCOL.md` — Layer-up process and responsibilities
- `GOVERNANCE_ALIGNMENT_MONITORING_PROTOCOL.md` — Drift detection

---

### 9.3 Continuous Improvement Recording

**Requirement**: MANDATORY  
**Specification**: `EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` Section 4  
**Location**: `.agent-admin/improvements/`

**Required per PR**:
- Improvement capture (mandatory, may be "PARKED")
- RCA when stop-and-fix occurred or gate failed
- Learning classification and promotion status
- Evidence trail linking failure → learning → canon update

**Related Standards**:
- `MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md` — Enhancement capture
- `MANDATORY_PROCESS_IMPROVEMENT_REFLECTION_PROTOCOL.md` — Process reflection

---

## 10. CATEGORY 6: Compliance & Evidence

### 10.1 Evidence Artifact Bundle

**Requirement**: MANDATORY  
**Specification**: `EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`  
**Location**: `.agent-admin/`

**Required Subdirectories**:
```
.agent-admin/
├── prehandover/         # Pre-handover proofs
├── gates/               # Gate results (machine-readable JSON)
├── rca/                 # Root cause analyses
├── improvements/        # Continuous improvement captures
└── governance/          # Governance sync state
```

**Mandatory Artifacts per PR**:
1. Prehandover proof (human-readable or JSON)
2. Gate results summary (JSON schema-validated)
3. Continuous improvement capture
4. RCA (when stop-and-fix or gate failure occurred)

**Related Standards**:
- `COMMISSIONING_EVIDENCE_MODEL.md` — Commissioning evidence
- `AUDIT_READINESS_MODEL.md` — Audit trail requirements

---

### 10.2 Compliance Baseline

**Requirement**: MANDATORY  
**Specification**: `COMPLIANCE_AND_STANDARDS_GOVERNANCE.md`  
**Location**: App governance folder or `.architecture/compliance/`

**Required Files**:
- `COMPLIANCE_SCOPE.md` — Which standards apply (ISO 27001, NIST, etc.)
- `CONTROL_MAPPING.md` — Controls mapped to architecture/QA/runtime
- `EVIDENCE_CATALOG.md` — Evidence items and generation sources
- `AUDIT_REPORT.md` — Reproducible audit report

**Mandatory Standards Baseline** (unless explicitly excluded):
- ISO 27001 (Information Security Management)
- ISO 31000 (Risk Management)
- NIST CSF (Identify, Protect, Detect, Respond, Recover)

**Control Traceability Rule**:
Every control MUST map to:
- Architecture (where/how designed)
- QA (how verified pre-deploy)
- Runtime (how monitored in production)
- Evidence (where proof is generated)

**Related Standards**:
- `PLATFORM_READINESS_FOR_GOVERNED_BUILD_EXECUTION.md` — Platform compliance

---

### 10.3 Governance Inventory

**Requirement**: MANDATORY  
**Specification**: `GOVERNANCE_LAYERDOWN_CONTRACT.md` Section 5  
**Location**: Repository root (`GOVERNANCE_INVENTORY.json`)  
**Template**: `GOVERNANCE_INVENTORY.json.template`

**Required Contents**:
- Repository metadata (name, owner, type)
- Agent roster (types, contracts)
- Governance artifacts tracked
- Canon bindings with SHA256 hashes
- Validation history
- Gap summary
- Remediation plans

**Validation**: Must be machine-readable JSON validated against schema

**Related Standards**:
- `CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md` — Inventory integrity
- `GOVERNANCE_ALIGNMENT_MONITORING_PROTOCOL.md` — Alignment verification

---

## 11. CATEGORY 7: Startup & Commissioning

### 11.1 Application Startup Requirements Declaration

**Requirement**: MANDATORY  
**Specification**: `APP_STARTUP_REQUIREMENTS_DECLARATION.md`  
**Location**: `APP_STARTUP_REQUIREMENTS.md` (root or `.architecture/`)

**Required Sections**:
- Commissioning scope (what validates this app)
- Technical validation checks (dependencies, configs, data)
- Security validation checks (secrets, certificates, permissions)
- Operational validation checks (monitoring, logging, alerting)
- Compliance validation checks (controls, evidence, audit)
- Human confirmation checkpoints (authorization gates)
- Success/failure criteria
- Evidence requirements

**Integration**: FM app uses this to orchestrate commissioning

**Related Standards**:
- `SYSTEM_COMMISSIONING_AND_PROGRESSIVE_ACTIVATION_PROTOCOL.md` — Phases
- `ACTIVATION_STATE_MODEL.md` — Activation state progression

---

### 11.2 Progressive Activation Protocol

**Requirement**: MANDATORY  
**Specification**: `SYSTEM_COMMISSIONING_AND_PROGRESSIVE_ACTIVATION_PROTOCOL.md`

**Activation States**:
1. **INSTALLED** — Code deployed, not validated
2. **VALIDATED** — Technical checks passed
3. **COMMISSIONED** — Operational readiness confirmed
4. **ACTIVATED** — Human authorization granted, live traffic enabled

**State Transitions** (unidirectional, irreversible):
```
INSTALLED → VALIDATED → COMMISSIONED → ACTIVATED
```

**Validation Requirements per State**:
- INSTALLED → VALIDATED: Technical validation (health checks, configs)
- VALIDATED → COMMISSIONED: Operational validation (monitoring, evidence)
- COMMISSIONED → ACTIVATED: Human authorization (CS2 approval)

---

### 11.3 Runtime Readiness Verification

**Requirement**: MANDATORY (before ACTIVATED state)  
**Specification**: Architecture document `runtime-readiness-check-architecture.md`

**Required Checks**:
1. **Startup Validation** — Environment, configs, dependencies
2. **Control Plane Check** — FM/governance agent reachability
3. **Stability Probe** — No crashes, memory leaks, deadlocks
4. **State Recovery** — Persistence, clean stop, recovery, idempotency
5. **Telemetry** — Logs, errors, memory fabric, anomaly detection

**Evidence Requirements**:
- Deterministic verdicts (PASS/FAIL)
- Infrastructure gap catalog
- Audit trail of all checks
- Telemetry integration proof

---

## 12. CATEGORY 8: Architecture Completeness

### 12.1 Deployment Target Declaration

**Requirement**: MANDATORY  
**Specification**: `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` Section 3.1

**Required Elements**:
- Target platform (Vercel, AWS, Azure, standalone, etc.)
- Platform version constraints
- Platform-specific configuration
- Deployment entry point
- Platform limitations acknowledged

**Completeness Test**:
- Can deployment target be identified unambiguously?
- Can builder provision environment without research?
- Are platform invariants documented?

---

### 12.2 Environment Variable Requirements

**Requirement**: MANDATORY  
**Specification**: `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` Section 3.3

**Required Artifact**: `.env.example` file in repository root

**Required Documentation**:
- All required environment variables listed
- Optional variables with defaults
- Variable purposes explained
- Value constraints (formats, ranges, enumerations)
- Secrets management approach
- Variable validation timing

---

### 12.3 Build and Runtime Entrypoints

**Requirement**: MANDATORY  
**Specification**: `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` Section 3.2

**Required Documentation**:
- Application entry point files
- Build output locations
- Static asset paths
- Configuration file locations
- Data persistence paths
- Filesystem constraints (read-only, ephemeral, volumes)

---

### 12.4 Dependency Declaration and Management

**Requirement**: MANDATORY  
**Specification**: `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` Section 3.5

**Required Elements**:
- Dependency manifest (`package.json`, `requirements.txt`, etc.)
- Lock file for deterministic builds
- Dependency version constraints
- Security vulnerability scanning
- Update policy

**Validation**: Dependencies checked against GitHub Advisory Database before adding

---

### 12.5 Error Handling and Recovery

**Requirement**: MANDATORY  
**Specification**: `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` Section 3.8

**Required Patterns**:
- Error classification (types, severity, recoverability)
- Error handling strategy per category
- Recovery procedures (retry, fallback, circuit breaker)
- Error propagation (logging, telemetry, alerts)
- User-facing error messages

---

## 13. AI Chat Interface Dual Pattern

### 13.1 Pattern Overview

**Requirement**: MANDATORY (for apps with AI chat interfaces)  
**Specification**: Application-specific, follows governance patterns  
**Evidence**: `evidence-new/wave-execution/WAVE_5.1_SUMMARY.md` (Foreman Office example)

**Dual Pattern Definition**:
- **Front Office**: User-facing chat interface for end-user interactions
- **Back Office**: Admin/operator chat interface for system control and monitoring

### 13.2 Back Office Requirements

**Purpose**: Admin console for system operators and CS2

**Required Components**:
- Two-pane layout (chat left, telemetry/monitoring right)
- Rich chat bubbles (markdown, code blocks, metadata)
- Streaming status updates with icons
- Telemetry panel (real-time metrics, logs, system state)
- Document upload capability (for task briefings, evidence)
- Mobile-responsive design

**Integration**:
- FM or admin agent interaction
- Real-time execution monitoring
- Governance evidence display
- Build/wave status tracking

### 13.3 Front Office Requirements

**Purpose**: End-user interface for application functionality

**Required Components**:
- User-friendly chat interface
- Context-appropriate responses
- Task-specific workflows
- Secure user authentication
- Usage tracking and compliance

**Separation**:
- Clear separation from back office (different routes/permissions)
- No admin capabilities exposed to end users
- No governance operations accessible

---

## 14. Layer-Down Propagation Rules

### 14.1 Governance Ripple Model

**Requirement**: MANDATORY  
**Specification**: `GOVERNANCE_RIPPLE_MODEL.md`

**Layer-Down Trigger Events**:
1. Constitutional canon changes (Tier-0)
2. Policy canon changes (Tier-1)
3. Agent contract updates
4. Merge gate requirement changes
5. Evidence standard updates

**Propagation Process**:
1. Change made in governance repo
2. Ripple scan identifies affected consumers
3. Issues created in consumer repos
4. Ripple log updated atomically with issue creation
5. Consumer repos update and validate
6. Ripple status tracked to completion

**Related Standards**:
- `GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md` — Systematic ripple process
- `CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` — Cross-repo propagation
- `GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md` — Ripple detection and response

---

### 14.2 Consumer Repository Registry

**Requirement**: MANDATORY (in governance repo)  
**Specification**: `GOVERNANCE_RIPPLE_MODEL.md` Section 4  
**Location**: `governance/CONSUMER_REPO_REGISTRY.json`

**Required Fields per Repository**:
- Repository name and owner
- Repository type (application, governance, library)
- Agent roster
- Governance contact
- Layer-down status
- Last sync date

---

### 14.3 Ripple Log Tracking

**Requirement**: MANDATORY (in governance repo)  
**Specification**: `GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md` Section 7  
**Location**: `governance/ripple/ripple-log.md`

**Required per Ripple Event**:
- Source change description
- Target repositories
- Issue numbers created
- Creation timestamp
- Completion status
- Validation evidence

**Automation**: Ripple log MUST be updated atomically with issue creation

---

## 15. Validation and Enforcement

### 15.1 Initialization Completeness Gate

**Specification**: `INITIALIZATION_COMPLETENESS_GATE.md`  
**Enforcement**: PR merge gate for new repositories

**Gate Validation**:
- All mandatory components present
- Agent contract validated
- Evidence structure created
- Governance inventory populated
- Health check endpoints implemented
- Startup requirements declared

### 15.2 Architecture Completeness Validation

**Specification**: `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` Section 10  
**Enforcement**: Pre-implementation validation

**Checklist**:
- Deployment target declared
- Environment variables documented (`.env.example`)
- Build/runtime entrypoints documented
- Dependencies managed and locked
- Error handling patterns defined
- QA strategy complete
- Observability requirements met

### 15.3 Merge Gate Compliance

**Specification**: `MERGE_GATE_INTERFACE_STANDARD.md`  
**Enforcement**: PR merge gates

**Required Gate Contexts**:
1. **Verdict Gate** — Evidence validation, test execution
2. **Alignment Gate** — Governance alignment (CANON_INVENTORY hash validation)
3. **Stop-and-Fix Gate** — RCA enforcement when triggered

**Gate Applicability**: Determined by agent class and PR scope

**Related Standards**:
- `MERGE_GATE_APPLICABILITY_MATRIX.md` — Which gates apply to which agents
- `FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md` — FM gate management authority

---

## 16. Audit Checklist for New Applications

Use this checklist to verify completeness of new applications:

### Agent System
- [ ] `.agent` file created and validated
- [ ] `.agent-workspace/[agent-type]/` structure present
- [ ] Wake-up and session closure scripts accessible
- [ ] Agent class-specific requirements met (Builder/FM/Liaison)

### Watchdog & Oversight
- [ ] Watchdog agent configured (if applicable)
- [ ] Quality Integrity Watchdog integrated (if QA automation)
- [ ] Escalation procedures documented

### Performance Measurement
- [ ] AI performance metrics tracked (if using AI)
- [ ] Application performance metrics tracked
- [ ] Service performance metrics tracked (if distributed)

### Observability & Telemetry
- [ ] Health check endpoint implemented (`/api/health`)
- [ ] Structured logging implemented (JSON logs)
- [ ] Runtime telemetry integrated
- [ ] Dashboard APIs implemented (if user-facing)

### Feedback & Learning
- [ ] Learning loop integration present
- [ ] Layer-up feedback mechanism documented
- [ ] Continuous improvement recording in place

### Compliance & Evidence
- [ ] `.agent-admin/` structure created
- [ ] Compliance baseline documented (`COMPLIANCE_SCOPE.md`, etc.)
- [ ] `GOVERNANCE_INVENTORY.json` created and populated

### Startup & Commissioning
- [ ] `APP_STARTUP_REQUIREMENTS.md` created
- [ ] Progressive activation protocol followed
- [ ] Runtime readiness verification implemented

### Architecture Completeness
- [ ] Deployment target declared
- [ ] `.env.example` file present
- [ ] Build/runtime entrypoints documented
- [ ] Dependencies managed with lock file
- [ ] Error handling patterns defined

### AI Chat Interface (if applicable)
- [ ] Back office interface implemented
- [ ] Front office interface implemented (if user-facing)
- [ ] Clear separation between back/front office

### Layer-Down Propagation
- [ ] Registered in `CONSUMER_REPO_REGISTRY.json`
- [ ] Ripple awareness documented
- [ ] Layer-up process understood

---

## 17. Crosswalk: Mandatory Components → Constitutional/Canonical Sources

This appendix maps each mandatory component category back to its authoritative governance source.

### Agent System & Contracts

| Component | Canonical Source | Type |
|-----------|-----------------|------|
| Agent contract file | `agent-contracts-guidance/.agent.schema.md` | Schema |
| Agent workspace | `LIVING_AGENT_SYSTEM.md` Section 6 | Protocol |
| Wake-up protocol | `LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md` | Protocol |
| Session closure | `LIVING_AGENT_SYSTEM.md` Section 11 | Protocol |
| Agent class requirements | `GOVERNANCE_AGENT_REQUIREMENTS_MATRIX.md` | Matrix |
| Governance bindings | `AGENT_FILE_BINDING_REQUIREMENTS.md` | Standard |

### Watchdog & Oversight

| Component | Canonical Source | Type |
|-----------|-----------------|------|
| Watchdog authority | `WATCHDOG_AUTHORITY_AND_SCOPE.md` | Canon |
| Cognitive observation | `WATCHDOG_COGNITIVE_OBSERVATION_PROTOCOL.md` | Protocol |
| Quality integrity channel | `WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md` | Specification |

### Performance Measurement

| Component | Canonical Source | Type |
|-----------|-----------------|------|
| Cognitive orchestration | `COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md` | Model |
| Performance standards | Architecture-specific | Application |

### Observability & Telemetry

| Component | Canonical Source | Type |
|-----------|-----------------|------|
| Runtime execution monitor | `MATURION_RUNTIME_EXECUTION_MONITOR_SPEC.md` | Specification |
| Health checks | `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` Sec 3.9 | Standard |
| Telemetry | `runtime-readiness-check-architecture.md` | Architecture |
| Sandbox telemetry | `maturion/sandbox-observability-telemetry-spec.md` | Specification |

### Feedback & Learning

| Component | Canonical Source | Type |
|-----------|-----------------|------|
| Learning loop categories | `LEARNING_LOOP_CATEGORIES_AND_LIFECYCLE.md` | Canon |
| Learning intake | `LEARNING_INTAKE_AND_PROMOTION_MODEL.md` | Model |
| Failure promotion | `FAILURE_PROMOTION_RULE.md` | Rule |
| Layer-up protocol | `LAYER_UP_PROTOCOL.md` | Protocol |
| Ripple intelligence | `RIPPLE_INTELLIGENCE_LAYER.md` | Model |
| We only fail once | `WE_ONLY_FAIL_ONCE_DOCTRINE.md` | Doctrine |

### Compliance & Evidence

| Component | Canonical Source | Type |
|-----------|-----------------|------|
| Evidence bundle | `EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` | Standard |
| Compliance governance | `COMPLIANCE_AND_STANDARDS_GOVERNANCE.md` | Policy |
| Audit readiness | `AUDIT_READINESS_MODEL.md` | Model |
| Commissioning evidence | `COMMISSIONING_EVIDENCE_MODEL.md` | Model |
| Governance inventory | `GOVERNANCE_LAYERDOWN_CONTRACT.md` Section 5 | Contract |

### Startup & Commissioning

| Component | Canonical Source | Type |
|-----------|-----------------|------|
| Startup requirements | `APP_STARTUP_REQUIREMENTS_DECLARATION.md` | Contract |
| Progressive activation | `SYSTEM_COMMISSIONING_AND_PROGRESSIVE_ACTIVATION_PROTOCOL.md` | Protocol |
| Activation state model | `ACTIVATION_STATE_MODEL.md` | Model |
| Runtime readiness | `runtime-readiness-check-architecture.md` | Architecture |

### Architecture Completeness

| Component | Canonical Source | Type |
|-----------|-----------------|------|
| Architecture completeness | `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` | Standard |
| Build philosophy | `BUILD_PHILOSOPHY.md` | Philosophy |
| Build tree execution | `BUILD_TREE_EXECUTION_MODEL.md` | Model |

### Layer-Down Propagation

| Component | Canonical Source | Type |
|-----------|-----------------|------|
| Governance ripple model | `GOVERNANCE_RIPPLE_MODEL.md` | Model |
| Ripple checklist | `GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md` | Protocol |
| Ripple detection | `GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md` | Protocol |
| Cross-repo layer-down | `CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` | Protocol |
| Layer-up protocol | `LAYER_UP_PROTOCOL.md` | Protocol |
| Governance alignment | `GOVERNANCE_ALIGNMENT_MONITORING_PROTOCOL.md` | Protocol |

---

## 18. Acceptance Criteria

This specification is considered complete and approved when:

- ✅ All cross-app component requirements enumerated
- ✅ Each component linked to detailed specification (not duplicated)
- ✅ Usable as master checklist for audits and initialization
- ✅ Crosswalk appendix links all components to constitutional/canonical sources
- ✅ Socialized and adopted as gating artifact for new builds
- ✅ Referenced in relevant completeness and architecture gates
- ✅ Added to CANON_INVENTORY.json with proper provenance
- ✅ Added to GOVERNANCE_ARTIFACT_INVENTORY.md

---

## 19. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-13 | Governance Repo Admin | Initial release per issue #[TBD] |

---

## 20. Related Documents

### Constitutional Canon
- `CONSTITUTION.md`
- `GOVERNANCE_PURPOSE_AND_SCOPE.md`
- `BUILD_PHILOSOPHY.md`

### Living Agent System
- `LIVING_AGENT_SYSTEM.md`
- `LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md`
- `AGENT_SELF_GOVERNANCE_PROTOCOL.md`

### Architecture & Completeness
- `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md`
- `APP_STARTUP_REQUIREMENTS_DECLARATION.md`
- `SYSTEM_COMMISSIONING_AND_PROGRESSIVE_ACTIVATION_PROTOCOL.md`

### Compliance & Evidence
- `COMPLIANCE_AND_STANDARDS_GOVERNANCE.md`
- `EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`
- `AUDIT_READINESS_MODEL.md`

### Watchdog & Quality
- `WATCHDOG_AUTHORITY_AND_SCOPE.md`
- `WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md`
- `BUILD_INTERVENTION_AND_ALERT_MODEL.md`

### Learning & Feedback
- `LEARNING_LOOP_CATEGORIES_AND_LIFECYCLE.md`
- `LAYER_UP_PROTOCOL.md`
- `RIPPLE_INTELLIGENCE_LAYER.md`

### Governance Propagation
- `GOVERNANCE_RIPPLE_MODEL.md`
- `GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md`
- `CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md`

---

**Authority**: Living Agent System v6.2.0 | Governance Repository Administrator | CS2 Approved
