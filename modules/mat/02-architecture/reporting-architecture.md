# MAT Module — Reporting Architecture

> **Version:** v1.0.0
> **Status:** Draft
> **Module:** MAT (Maturity Assessment Tool)
> **TRS Coverage:** TR-042, TR-043, TR-044
> **Last Updated:** 2025-07-15

---

## 1. Report Generation Engine (TR-042)

### Supported Output Formats

| Format | Library | Use Case |
|--------|---------|----------|
| DOCX | `docx` npm library | Editable audit reports |
| PDF | Puppeteer (HTML-to-PDF) or `@react-pdf/renderer` | Printable audit reports |
| JSON | Native + JSON Schema validation | Machine-readable data exchange |
| XLSX | `exceljs` | Spreadsheet analysis |

### Report Structure

1. **Cover Page**: Audit title, organisation, facility, audit lead, period, generation date
2. **Executive Summary**: AI-generated overview, maturity distribution, key findings
3. **Methodology**: Maturity model definitions (Basic through Resilient)
4. **Domain Reports** (for each domain):
   - Domain overview and completion status
   - MPS reports (for each MPS):
     - MPS overview
     - Criteria reports (for each criterion):
       - Criteria description
       - Findings summary
       - Evidence references (hyperlinked)
       - Maturity rating with AI rationale
       - Immediate recommendations (next maturity level)
       - Medium-term recommendations
       - Long-term resilience recommendations
5. **Not Used Criteria**: List with exclusion reasons
6. **Appendices**: Evidence index, glossary, AI model versions used

### Report Template System

- Configurable templates per organisation stored in database
- Template defines: logo, colors, header/footer text, section ordering
- Default template provided out-of-the-box

### Image Embedding

- Evidence images embedded as Base64 in DOCX and PDF
- Video snapshots embedded as selected by user
- Maximum image dimension: 800×600px in report (auto-scaled)

### Hyperlinks

- Evidence hyperlinks preserved in DOCX and PDF (link to Supabase Storage signed URLs)
- Table of contents with internal hyperlinks

### Large Report Handling (500+ criteria)

- Streaming generation to avoid memory limits
- Chunked processing: generate per-domain sections independently, then merge
- Progress indicator: percentage-based updates via WebSocket or polling
- Async operation: report queued, user notified on completion

### Report Generation Flow

```
1. User clicks "Generate Report" (Lead Auditor only)
2. Frontend sends request to Edge Function
3. Edge Function validates:
   - All criteria have confirmed status
   - Report approval gate check
   - Evidence review completed
4. Edge Function queues report generation job
5. Report generation service:
   a. Fetch all audit data (domains, MPS, criteria, evidence, scores)
   b. Apply report template
   c. Generate DOCX/PDF/JSON (parallel or sequential)
   d. Upload generated files to Supabase Storage
   e. Create report_outputs record
   f. Notify user via Realtime
6. User downloads report from Storage (signed URL)
```

### Performance

- Report generation (≤500 criteria): < 2 minutes
- Large reports (1000+ criteria): < 5 minutes
- Async with progress tracking

---

## 2. Excel Export Engine (TR-043)

### Library: exceljs

### Excel Structure

- **Sheet 1: Summary**
  - Audit metadata (title, organisation, period, etc.)
  - Completion statistics
  - Maturity distribution chart data
- **Sheet 2+: Per-Domain Detail Sheets**
  - Named by domain: "Domain 1 - [Title]"
  - Columns: Criterion Number, Description, Findings Summary, Evidence Links, Maturity Rating, Immediate Recommendations, Future Recommendations
  - Headers formatted (bold, colored, frozen)
  - Column widths auto-sized
  - Borders on all data cells

### Features

- Hyperlinks to evidence preserved in cells
- Conditional formatting: maturity levels color-coded
  - Basic: Red (#FF0000)
  - Reactive: Orange (#FF8C00)
  - Compliant: Yellow (#FFD700)
  - Proactive: Light Green (#90EE90)
  - Resilient: Green (#008000)
- Not Used criteria marked with strikethrough
- File size optimization: shared strings, minimal styling

### Export Availability

- Available before and after report finalization
- Accessible from Review Table page
- Exported to browser as .xlsx download

---

## 3. Pre-Report Review Table (TR-044)

### Table Columns

| Column | Type | Editable | Width |
|--------|------|----------|-------|
| # | Number (hierarchy) | No | 80px |
| Description | Text | No | 300px |
| Findings Summary | Text | Yes | 250px |
| Evidence | Hyperlinks | No | 150px |
| Maturity Rating | Badge | No | 120px |
| Immediate Actions | Text | Yes | 200px |
| Future Actions | Text | Yes | 200px |
| Status | Badge | No | 100px |

### Interaction Features

- **Virtual Scrolling**: Handle 1000+ rows efficiently (react-virtual or tanstack-virtual)
- **Expandable Rows**: Click to expand and see full details (evidence list, AI rationale, gap analysis)
- **Inline Editing**: Click-to-edit findings summaries and recommendations
  - Auto-save on blur (debounced 500ms)
  - Edit logged in audit trail (before/after state)
  - Original AI content preserved alongside user edits
- **Column Sorting**: Sort by any column (ascending/descending)
- **Column Filtering**: Filter by maturity level, status, domain, MPS
- **Search**: Full-text search across criteria descriptions and findings
- **Real-time Updates**: Supabase Realtime subscriptions for multi-user editing

### Export

- "Export to Excel" button generates .xlsx via exceljs
- Available at any time (not just after finalization)

### Review Table Component Structure

```
<ReviewTable>
  ├── <TableToolbar>
  │    ├── <SearchInput>      (full-text search)
  │    ├── <FilterDropdowns>  (maturity, status, domain)
  │    ├── <SortControls>     (column sort)
  │    └── <ExportButton>     (Excel export)
  ├── <VirtualizedTable>
  │    ├── <TableHeader>      (column headers, sort indicators)
  │    └── <TableBody>
  │         └── <ReviewRow>   (expandable, editable)
  │              ├── <CriterionNumber>
  │              ├── <Description>
  │              ├── <FindingsSummary>  (inline edit)
  │              ├── <EvidenceLinks>    (clickable)
  │              ├── <MaturityBadge>    (color-coded)
  │              ├── <ImmediateActions> (inline edit)
  │              ├── <FutureActions>    (inline edit)
  │              └── <ExpandedDetail>   (evidence list, AI rationale)
  └── <TableFooter>
       ├── <TotalCount>
       └── <PaginationInfo>
```

---

## 4. Report Approval Gate

- Only Lead Auditor can approve and publish reports
- Report generation requires Lead Auditor authorization
- Explicit approval step required for publication
- Published reports are immutable (corrections create new version)
- All approval actions logged with timestamp in audit trail
