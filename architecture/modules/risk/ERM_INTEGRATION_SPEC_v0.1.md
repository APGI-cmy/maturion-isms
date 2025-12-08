# ERM Integration Specification v0.1

## 1. Purpose

Define how the ERM module integrates with:

- Security Risk Management (SRMF)
- Risk Assessment Engine
- PIT (Project Implementation Tracker)
- Maturity Roadmap module
- Incident & Intelligence modules
- External systems (e.g. ERP, BI tools)

---

## 2. Internal Integration Points

### 2.1 Security Risk Management

- Security Risk Assessment uses:
  - ERM likelihood scale.
  - ERM impact scale.
  - ERM heatmap and risk bands.
  - ERM appetite thresholds.
- Security risks are tagged with:
  - `risk_category = Security`.
  - Node in hierarchy (e.g. DMS cyclone → DMS Plant → Blue Area → Jwaneng Mine → Debswana → De Beers group).

### 2.2 Risk Assessment Engine

- ERM provides:
  - Scales
  - Matrices
  - Appetite
  - Governance roles
- Risk Assessment Engine provides back:
  - Inherent risk (score, band, heatmap cell)
  - Residual risk
  - Projected residual risk (after proposed controls)
  - Above/below appetite flags

### 2.3 PIT (Project Implementation Tracker)

- Risks resulting in mitigation projects are:
  - Exported to PIT as projects, milestones, tasks.
- PIT feeds back:
  - Control implementation status.
  - Completion dates.
- ERM/RA engine uses this to:
  - Update control effectiveness.
  - Recalculate residual risk.

### 2.4 Maturity Roadmap

- Maturity levels indicate:
  - Risk management process maturity.
  - Control environment maturity.
- ERM receives:
  - Indicators of maturity improvements over time.
- Maturity module uses ERM data to:
  - Show progress of governance practices.
  - Highlight areas still immature in risk handling.

### 2.5 Incident & Intelligence

- Incidents and security events:
  - Trigger re-assessment of certain risks.
  - Feed into likelihood recalibration.
- Intelligence:
  - Updates threat relevance.
  - May trigger dynamic changes in Likelihood or Impact inputs.

---

## 3. External Integration

### 3.1 Data Warehouse / BI Tools

ERM should support exporting:

- Risk registers (inherent, residual, projected).
- Organisation hierarchy.
- Top risk lists per node and category.
- Time-series risk data.

Formats: CSV, JSON, or direct DB/warehouse connection.

### 3.2 ERP / Asset Management Systems

- To support:
  - Asset values.
  - Maintenance & control uptime data.
  - Operational metrics affecting risk.

Integration is via:

- ETL jobs
- APIs
- Or file-based imports (as interim solution).

### 3.3 HR / Identity Systems

Used for:

- Mapping roles and people to risk owners and control owners.
- Ensuring access rights align with HR organisational data.

---

## 4. Multi-Company Isolation

- Each company’s ERM profile and data is:
  - Logically separated.
  - Access controlled.
- Cross-company analytics:
  - Only on anonymised, aggregated data.
  - No IDs, names, or sensitive process details.

---

## 5. API Interface (High-Level)

The ERM module should expose services such as:

- `GET /erm/profile/{company_id}`
- `POST /erm/profile/{company_id}/import`
- `GET /erm/heatmap/{company_id}`
- `GET /erm/scales/{company_id}`
- `GET /erm/hierarchy/{company_id}`
- `GET /erm/export-bundle/{company_id}`

Detailed API specs can be defined when wiring the backend (e.g. Supabase functions).

---

## 6. Versioning & Compatibility

- When ERM configurations change:
  - Risk Assessment engine must remain compatible.
  - Either by snapshotting old configurations or by controlled re-mapping.
- Integrations must be tested when:
  - New ERM versions are activated.
  - New external systems are linked.

---

## 7. Security & Privacy

- ERM data forms part of sensitive governance information.
- Access must be strictly role-based.
- Cross-company analytics must respect:
  - Privacy laws
  - Internal ethical standards
  - Non-disclosure of sensitive operational detail.

