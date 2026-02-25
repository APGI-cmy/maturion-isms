# UI Builder — Wave Component Specifications (Tier 2)

**Agent**: ui-builder  
**Type**: Tier 2 Knowledge  
**Last Updated**: 2026-02-25  
**Source**: Extracted from ui-builder contract v4.1.0 per 30K char-limit refactor

---

## Wave 1.3 — Criteria Management UI

**Criteria Tree View**:
- Domain → MPS → Criteria hierarchy with expand/collapse
- Status indicators per criteria (parsed, approved, rejected)
- Search and filter capability
- Responsive: collapsible sidebar on mobile

**Criteria Upload Form**:
- Drag-and-drop file upload (PDF/DOCX)
- Upload progress indicator
- Client-side file type validation
- File size limit display and validation

**Human Approval Workflow UI**:
- AI-parsed criteria display with accept/reject actions
- Batch approval capability
- Justification input for rejections (required)
- Approval history display

---

## Wave 2.3 — Evidence Management UI

**Evidence Gallery**:
- Grid/list view toggle per criterion
- Photo thumbnail preview with lightbox
- Audio player component with waveform
- Document preview (PDF viewer)
- Evidence metadata display (timestamp, user, type)

**Mobile Capture Interface**:
- Camera capture with metadata overlay (location, timestamp)
- Voice recorder with waveform display
- Offline indicator badge
- Sync status indicator with queue count

---

## Wave 3.2 — Human Confirmation UI

**AI Score Review Interface**:
- Score display with confidence percentage
- Rationale text with evidence citations (clickable)
- Gap analysis categorized view (immediate, medium, long-term)
- Confirm/override action buttons

**Override Workflow**:
- Override justification form (mandatory text field)
- AI vs. human score comparison view (side-by-side)
- Score history timeline (audit trail)
- Evidence re-review capability

---

## Wave 4.1 — Dashboards

**Global Audit Dashboard**:
- Aggregate metrics (completion %, avg maturity, total audits)
- Charts (Recharts or similar): maturity distribution, progress over time
- Recent activity feed
- Quick filters (status, date range, organisation)

**Domain Dashboard**:
- Drill-down from global dashboard
- Per-domain maturity scores
- Criteria completion status
- Domain-specific charts

**MPS Dashboard**:
- Criterion-level detail view
- Evidence count per criterion
- Scoring status
- Findings summary

**Real-time Updates**:
- WebSocket or polling for live data
- Update indicators (animated badges)
- Optimistic UI updates with rollback on error
