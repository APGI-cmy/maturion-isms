# MAT Frontend - Manual Audit Tool

React 18+ / Vite 5+ / TypeScript frontend application for the MAT (Manual Audit Tool) ISMS compliance platform.

## Features

- ✅ **React 18+** with TypeScript (strict mode)
- ✅ **Vite 5+** for fast development and optimized builds
- ✅ **Tailwind CSS 3+** for styling
- ✅ **React Router** for navigation
- ✅ **Supabase** client for backend integration
- ✅ **PWA Support** with offline mode and service worker
- ✅ **Internationalization** (i18n) ready
- ✅ **Fully Tested** - 71/71 frontend tests passing

## Directory Structure

```
apps/mat-frontend/
├── public/              # Static assets
│   ├── manifest.json    # PWA manifest
│   └── sw.js           # Service worker
├── src/
│   ├── components/      # React components
│   │   ├── audit/      # Audit management components
│   │   ├── criteria/   # Criteria management components
│   │   ├── dashboard/  # Dashboard and analytics components
│   │   ├── evidence/   # Evidence collection components
│   │   ├── layout/     # Layout components
│   │   ├── report/     # Report generation components
│   │   ├── scoring/    # AI scoring components
│   │   └── settings/   # Settings components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities and configuration
│   │   ├── supabase.ts # Supabase client
│   │   ├── i18n.ts     # i18n configuration
│   │   └── env.ts      # Environment configuration
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── tests/              # Test suite (71 tests)
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── package.json        # Dependencies and scripts
```

## Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

## Installation

1. Install dependencies:
```bash
cd apps/mat-frontend
pnpm install
```

2. Create environment configuration:
```bash
cp .env.example .env
```

3. Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Development

### Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
pnpm preview
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Linting

```bash
pnpm lint
```

## Component Overview

### Audit Management
- **AuditCreateForm** - Create new audits
- **AuditList** - List and manage audits
- **AuditStatusBadge** - Display audit status
- **AuditActions** - Audit actions (archive, delete)
- **AuditorAssignment** - Assign auditors to audits

### Criteria Management
- **CriteriaTree** - Hierarchical criteria navigation
- **CriteriaModal** - Criterion details with "Not Used" toggle
- **CriteriaUpload** - Upload criteria documents (PDF, DOCX, XLSX)
- **CriteriaApproval** - Review and approve AI-parsed criteria
- **ParsingProgress** - AI parsing progress indicator
- **ValidationResults** - Coverage and hallucination validation

### Evidence Collection
- **EvidenceCapture** - Multi-format evidence capture (document, photo, video, audio)
- **EvidenceReview** - Review and approve evidence
- **UploadProgress** - Concurrent upload progress tracking
- **InterviewRecorder** - Record criterion/audit interviews
- **VoiceRecorder** - Voice recording component
- **PhotoCapture** - Photo capture component

### Scoring & Review
- **ScoringResults** - Display AI scoring results
- **ScoreConfirmation** - Human score confirmation with override support
- **OverrideLog** - Override history tracking
- **ConfidenceIndicator** - AI confidence visualization
- **MaturitySelector** - 6-level maturity selector (L0-L5)

### Dashboard & Analytics
- **DomainDashboard** - Domain performance drill-down
- **MPSDashboard** - MPS (Maturity Profile Segment) analysis
- **MaturityDistribution** - Maturity distribution visualization

### Reports
- **ReviewTable** - Criteria review table with inline editing
- **ReportGenerator** - Report generation with format selection (PDF, DOCX, XLSX)
- **ExportControls** - Multi-format export controls
- **ReportApproval** - Report approval workflow

### Layout & Common
- **Layout** - Main application layout with navigation
- **ErrorBoundary** - Error boundary for graceful error handling
- **Loading** - Loading indicator
- **OfflineIndicator** - Offline mode indicator

## PWA Features

The application is a Progressive Web App (PWA) with:

- **Offline Mode** - Service worker caches resources for offline access
- **Install Prompt** - Users can install the app on their device
- **Offline Indicator** - Visual feedback when offline
- **Auto-sync** - Changes sync automatically when connection is restored

## Testing

### Test Coverage

- **71 Frontend Tests** - All passing ✅
  - Component structural tests
  - Page existence tests
  - PWA configuration tests
  - Accessibility tests
  - Configuration validation tests

### Running Specific Test Suites

```bash
# Run only frontend scaffolding tests
pnpm test tests/frontend-scaffolding.test.ts

# Run only dashboard tests
pnpm test tests/dashboard-ui.test.ts
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd apps/mat-frontend
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Build Configuration

The production build includes:
- Code splitting (React vendor, Supabase client)
- PWA service worker generation
- Optimized bundle sizes
- Source maps for debugging

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## Accessibility

The application follows WCAG 2.1 AA guidelines:

- ✅ ARIA attributes on interactive elements
- ✅ Keyboard navigation support
- ✅ Semantic HTML
- ✅ Screen reader compatible
- ✅ Focus management

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Build Errors

If you encounter TypeScript errors:
```bash
# Clean and rebuild
rm -rf node_modules dist
pnpm install
pnpm build
```

### Service Worker Issues

If the service worker isn't updating:
```bash
# Clear browser cache and rebuild
pnpm build
```

Then hard refresh the browser (Ctrl+Shift+R / Cmd+Shift+R).

### Test Failures

If tests fail after dependency updates:
```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install
pnpm test
```

## Development Guidelines

### Component Creation

When creating new components:
1. Use TypeScript with strict mode
2. Add proper ARIA attributes
3. Include prop interfaces
4. Add to appropriate test suite
5. Follow existing naming conventions

### State Management

- Use React hooks for local state
- Supabase for data persistence
- Context for global UI state (if needed)

### Styling

- Use Tailwind CSS utility classes
- Follow responsive design principles
- Maintain consistent spacing (use Tailwind scale)
- Use semantic color names from theme

## License

UNLICENSED - Internal use only

## Support

For issues or questions, refer to the main ISMS repository documentation.
