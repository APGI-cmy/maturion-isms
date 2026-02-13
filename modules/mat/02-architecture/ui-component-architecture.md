# MANUAL AUDIT TOOL (MAT) – UI COMPONENT ARCHITECTURE v1.0.0

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Module           | MAT – Manual Audit Tool                    |
| Version          | v1.0.0                                     |
| Status           | Approved                                   |
| Classification   | Internal – Architecture                    |
| Owner            | Maturion Platform Team                     |
| Last Updated     | 2025-01-01                                 |
| TRS Requirements | TR-033, TR-034, TR-035, TR-047, TR-048, TR-049, TR-050 |

---

## 1. Component Hierarchy

### Application Shell

```
<App>
  ├── <AuthProvider>         (Supabase Auth context)
  ├── <I18nProvider>         (react-i18next)
  ├── <ThemeProvider>        (Tailwind dark/light mode)
  ├── <QueryProvider>        (TanStack Query)
  ├── <OfflineProvider>      (Online/offline status context)
  ├── <ToastProvider>        (Notification toasts)
  └── <Router>
       ├── /login            → <LoginPage>
       ├── /                 → <DashboardPage>
       ├── /audits/:id       → <AuditPage>
       ├── /audits/:id/execute → <AuditExecutionPage>
       ├── /audits/:id/review  → <ReviewTablePage>
       ├── /audits/:id/report  → <ReportPage>
       └── /settings          → <SettingsPage>
```

### Page Components

**LoginPage**

- `<LoginForm>` – Email/password fields, OAuth buttons
- `<ForgotPasswordLink>` – Password reset flow trigger

**DashboardPage**

- `<GlobalDashboard>` – Aggregated audit metrics and charts
- `<AuditList>` – List of audits with status, search, and filters
- `<CreateAuditButton>` – Opens audit creation wizard

**AuditPage**

- `<AuditHeader>` – Audit title, status, metadata
- `<AuditNavigation>` – Tree navigation for domains/MPS/criteria
- `<AuditContent>` – Selected criteria or domain detail view

**AuditExecutionPage**

- `<AuditNavigation>` – Domain/MPS/Criteria tree
- `<CriteriaModal>` – Full criteria assessment modal
- `<ProgressBar>` – Audit completion progress

**ReviewTablePage**

- `<ReviewTable>` – All criteria with scores, status, evidence counts
- `<BulkActions>` – Bulk confirm, export, filter controls
- `<ReviewFilters>` – Filter by status, domain, maturity level

**ReportPage**

- `<ReportPreview>` – Rendered report preview
- `<ExportControls>` – PDF/Word export buttons
- `<ReportSettings>` – Template selection, branding options

**SettingsPage**

- `<ProfileSettings>` – User profile management
- `<AuditTemplates>` – Template configuration
- `<LanguageSelector>` – i18n language switch
- `<ThemeToggle>` – Dark/light mode toggle

---

## 2. Criteria Modal Component (TR-047)

- **Implementation**: React Portal with focus trap (`@radix-ui/react-dialog` or custom)
- **Tabs/Sections**:
  1. Description – Full criteria statement
  2. Not Used – Checkbox with confirmation dialog (reason + justification required)
  3. Evidence – Sub-tabs for Text, Voice, Photo, Document, Video
  4. Findings – Text editor for findings
  5. Interview – Audio recording + transcript display
- **Unsaved Data Protection**: `beforeunload` event + confirmation prompt on close
- **Responsive**: Full-screen on mobile (< 768px), dialog on desktop
- **Performance**: Lazy-load evidence attachments, render in < 500ms
- **Accessibility**: ARIA dialog role, focus management, Escape to close, Tab navigation within modal
- **Keyboard Navigation**: Tab through sections, Enter to interact, Escape to close

### Component Structure

```
<CriteriaModal>
  ├── <ModalHeader>          (criterion number, title, close button)
  ├── <TabNavigation>        (Description | Not Used | Evidence | Findings | Interview)
  ├── <TabContent>
  │    ├── <DescriptionTab>  (read-only criteria description)
  │    ├── <NotUsedTab>      (checkbox, reason form, justification)
  │    ├── <EvidenceTab>
  │    │    ├── <TextEvidence>     (rich text editor)
  │    │    ├── <VoiceEvidence>    (MediaRecorder controls, transcript)
  │    │    ├── <PhotoEvidence>    (camera capture, file upload, preview)
  │    │    ├── <DocumentEvidence> (file upload, preview, hash display)
  │    │    └── <VideoEvidence>    (file upload, progress, snapshots)
  │    ├── <FindingsTab>     (text editor for findings summary)
  │    └── <InterviewTab>    (recording controls, transcript, segment tagging)
  ├── <AIScoreDisplay>       (maturity level, confidence, rationale, gap analysis)
  ├── <HumanConfirmation>    (confirm/override controls)
  └── <ModalFooter>          (save, cancel, status indicator)
```

---

## 3. Dashboard Components (TR-048)

- **Chart Library**: Recharts (React integration, responsive, accessible)
- **Real-time Updates**: Supabase Realtime subscriptions (max 5-second lag)
- **Drill-down**: Click-through navigation from Global → Domain → MPS → Criterion
- **Virtual Scrolling**: For large data sets (2000+ criteria)
- **Aggregation**: Materialized views / database functions for performance
- **Loading State**: Skeleton loaders during data fetch

### Dashboard Component Structure

```
<GlobalDashboard>
  ├── <AuditSummaryCards>     (total domains, MPS, criteria, evidence)
  ├── <CompletionProgress>    (% completed, outstanding, not used)
  ├── <MaturityDistribution>  (bar/pie chart of maturity levels)
  ├── <StatusBreakdown>       (criteria by status: not started, in progress, etc.)
  ├── <AIMetrics>             (override rate, refusal rate)
  └── <DomainList>            (expandable domain cards with drill-down)

<DomainDashboard>
  ├── <DomainHeader>          (domain title, completion %)
  ├── <MPSList>               (MPS cards with metrics)
  ├── <EvidenceCompleteness>  (evidence coverage indicators)
  └── <FlagsList>             (missing evidence, AI refusals)

<MPSDashboard>
  ├── <MPSHeader>             (MPS title, completion %)
  ├── <CriteriaTable>         (sortable criteria list with status)
  ├── <RatingDistribution>    (maturity level counts)
  └── <ActionsSummary>        (aggregated next actions)
```

---

## 4. Evidence Upload Component (TR-049)

- **Drag-and-Drop**: HTML5 Drag and Drop API with visual drop zone
- **Camera Capture**: `navigator.mediaDevices.getUserMedia()` for photo capture
- **Voice Recording**: MediaRecorder API with start/pause/resume/stop
- **Concurrent Uploads**: 10+ simultaneous files with individual progress bars
- **Resumable Upload**: tus protocol or Supabase resumable upload
- **Client Validation**: File type, size, extension checked before upload
- **Previews**:
  - Images: Thumbnail preview (200×200px)
  - Audio: Waveform visualization
  - Video: First-frame thumbnail
  - Documents: File name, size, type icon
- **Upload Progress**: Per-file progress bar with percentage

### Component Structure

```
<EvidenceUpload>
  ├── <DropZone>              (drag-and-drop area)
  ├── <UploadTypeSelector>    (Text | Voice | Photo | Document | Video)
  ├── <CameraCapture>        (live camera preview, capture button)
  ├── <VoiceRecorder>        (record/pause/stop, waveform, timer)
  ├── <FileSelector>         (file input with multiple selection)
  ├── <UploadQueue>
  │    └── <UploadItem>      (file name, progress bar, status, retry/cancel)
  └── <EvidenceGallery>      (uploaded evidence previews, delete option)
```

---

## 5. Navigation Component (TR-050)

- **Hierarchy**: Tree/accordion for Domain → MPS → Criteria
- **Breadcrumb**: Current location trail (Audit > Domain 1 > MPS 1.1 > Criteria 1.1.1)
- **Status Indicators**: Color-coded badges per criterion status
  - Not Started (gray), In Progress (blue), Submitted (yellow), AI Scored (orange), Confirmed (green), Not Used (strikethrough)
- **Keyboard Navigation**: Arrow keys for tree, Enter to select, Tab to breadcrumb
- **Lazy Loading**: Children loaded on expand (for large audits)
- **Search/Filter**: Text search across criteria titles, filter by status

### Component Structure

```
<AuditNavigation>
  ├── <Breadcrumb>           (clickable path segments)
  ├── <SearchBar>            (search criteria by title/number)
  ├── <FilterControls>       (filter by status, domain, MPS)
  ├── <NavigationTree>
  │    └── <DomainNode>      (expandable)
  │         └── <MPSNode>    (expandable)
  │              └── <CriterionNode>  (clickable → opens modal)
  └── <CompletionSummary>    (mini progress at bottom)
```

---

## 6. Responsive Design (TR-034)

### Breakpoints

| Breakpoint | Width        | Layout                                               |
|------------|--------------|------------------------------------------------------|
| Desktop    | ≥ 1024px     | Side navigation + main content, multi-column         |
| Tablet     | 768–1023px   | Collapsible navigation, single column tables         |
| Mobile     | < 768px      | Bottom navigation, stacked layout, full-screen modals|

### Tailwind Responsive Utilities

- `sm:` (640px+), `md:` (768px+), `lg:` (1024px+), `xl:` (1280px+)
- Touch targets: minimum 44×44px (`min-h-11 min-w-11`)
- No horizontal scrolling (except data tables)
- Images: `srcset` with lazy loading
- Visual regression tests at all three breakpoints

### Viewport-Specific Adaptations

| Component        | Desktop            | Tablet               | Mobile               |
|------------------|--------------------|-----------------------|----------------------|
| Navigation       | Fixed sidebar      | Collapsible drawer    | Bottom tab bar       |
| Criteria Modal   | Dialog (640px)     | Dialog (full width)   | Full-screen sheet    |
| Dashboard Charts | Side-by-side       | Stacked               | Stacked, simplified  |
| Review Table     | Full columns       | Scrollable            | Card view            |
| Evidence Upload  | Drag-drop zone     | Drag-drop + buttons   | Buttons only         |

---

## 7. Accessibility (TR-033)

- **WCAG 2.1 Level AA** compliance
- **ARIA Labels**: All interactive elements have descriptive ARIA labels
- **Keyboard Navigation**: Tab (focus), Enter (activate), Escape (close/cancel), Arrow keys (navigate trees/lists)
- **Color Contrast**: 4.5:1 minimum for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus ring on all interactive elements (2px solid outline)
- **Screen Readers**: Tested with NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
- **axe-core**: Automated accessibility testing in CI pipeline
- **No Color-Only Information**: Status conveyed via icon + color + text label
- **Skip Navigation**: Link to skip to main content
- **Live Regions**: `aria-live="polite"` for dynamic content updates (sync status, progress)

---

## 8. Internationalization (TR-035)

- **Framework**: react-i18next
- **Languages at Launch**: English (en), Afrikaans (af)
- **String Externalization**: All user-facing strings in JSON translation files
  - `public/locales/en/translation.json`
  - `public/locales/af/translation.json`
- **Date/Time**: `Intl.DateTimeFormat` with locale support
- **Number**: `Intl.NumberFormat` with locale support
- **RTL Ready**: CSS logical properties (`margin-inline-start`, `padding-inline-end`) used throughout
- **Runtime Loading**: Translation files loaded at runtime (code-split per locale)
- **Namespace Structure**:

  ```json
  {
    "common": { "save": "Save", "cancel": "Cancel" },
    "audit": { "createNew": "Create New Audit" },
    "criteria": { "modal.title": "Criteria Details" },
    "dashboard": { "title": "Audit Dashboard" },
    "evidence": { "upload": "Upload Evidence" }
  }
  ```

---

## 9. State Management

- **Server State**: TanStack Query for Supabase data (caching, invalidation, optimistic updates)
- **Client State**: Zustand for UI state (navigation, modal, offline queue)
- **Form State**: React Hook Form with Zod validation
- **Offline State**: Custom hook wrapping IndexedDB operations
- **Real-time State**: Supabase Realtime subscriptions managed via TanStack Query integration
