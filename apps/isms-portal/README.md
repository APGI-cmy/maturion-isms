# ISMS Portal

The unified MATURION ISMS Portal application containing all security and compliance modules.

## Overview

This is the main ISMS Portal application that consolidates all ISMS modules into a single, unified interface following the architecture defined in `architecture/ISMS_PORTAL_FOLDER_STRUCTURE_MAP_v1.0.md`.

## Structure

```
isms-portal/
├── src/
│   └── modules/
│       └── maturity/          # Maturity assessment module
│           ├── lib/           # Business logic and utilities
│           │   └── scoring.ts # Scoring engine implementation
│           └── tests/         # Module tests
│               └── scoring.test.ts
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vitest.config.ts
```

## Modules

### Maturity Module

The maturity assessment module implements the MATURION ISMS maturity model with support for:

- Evidence-based scoring
- Multi-level maturity assessment (1-5 levels)
- Weighted aggregation across criteria, MPS, domains, and organization
- AI-powered evidence evaluation

#### Scoring Engine

Located in `src/modules/maturity/lib/scoring.ts`, this provides:

**Core Functions:**
- `computeEvidenceConfidence()` - Calculates confidence from base weight, recency, and metadata
- `computeCriterionScore()` - Scores individual criteria based on evidence
- `computeMpsScore()` - Aggregates criterion scores to MPS level
- `computeDomainScore()` - Aggregates MPS scores to domain level
- `computeOrganizationMaturity()` - Computes overall organization maturity
- `getMaturityLevel()` - Maps numeric scores to maturity levels (1-5)

**Maturity Levels:**
1. **Basic** (0.00-0.19) - Initial/ad-hoc processes
2. **Reactive** (0.20-0.39) - Defined but inconsistent processes
3. **Compliant** (0.40-0.59) - Established and documented processes
4. **Proactive** (0.60-0.79) - Measured and controlled processes
5. **Resilient** (0.80-1.00) - Optimized and continuously improving

## Development

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Setup

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:ui

# Run tests once
pnpm test:run
```

### Testing

The module uses [Vitest](https://vitest.dev/) for unit testing. Tests are located in `src/modules/maturity/tests/`.

Example test run:
```bash
cd apps/isms-portal
pnpm test
```

## Architecture Alignment

This application follows the architecture defined in:
- `architecture/ISMS_PORTAL_FOLDER_STRUCTURE_MAP_v1.0.md`
- `architecture/modules/maturity/MATURITY_MODULE_ARCHITECTURE_v1.0.md`
- `architecture/modules/maturity/MATURITY_MODULE_MIGRATION_MAP_v1.0.md`

All modules live within this single unified app rather than as standalone applications, ensuring:
- Consistent navigation and UX
- Shared authentication and authorization
- Unified user/organization context
- Integrated cross-module workflows

## Database Integration

The scoring engine works with the database schema defined in:
- `infrastructure/db/migrations/20250208_scoring_model.sql`

This migration creates all necessary tables for storing:
- Evidence type weights
- Maturity score thresholds
- Scoring configurations (criteria, MPS, domain weights)
- Computed scores at all levels

## Future Development

Additional modules will be added to this application following the same structure:
- Risk Management
- WRAC (Workforce Risk Assessment & Compliance)
- PIT (Process Improvement Tracking)
- Incident Management
- Analytics
- Skills Management
- Systems Inventory

Each module will follow the standardized internal structure with:
- `components/` - UI components
- `pages/` - Route pages
- `hooks/` - Custom React hooks
- `contexts/` - React contexts
- `lib/` - Business logic
- `types/` - TypeScript types
- `integration/` - Cross-module integrations
- `tests/` - Module tests
