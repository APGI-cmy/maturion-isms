# 📘 ISMS Portal Folder Structure Map v1.0

**Version:** 1.0  
**Status:** Approved by Foreman  
**Scope:** Defines the authoritative folder structure for the unified ISMS Portal application, including all modules, shared packages, integration layers, AI routing, QA, and infrastructure.  
**Last Updated:** 2025-12-08

---

## 0. Design Philosophy

The ISMS Portal follows:

- **Single Unified App Pattern**
- **Modular Internal Structure**
- **Separation of Concerns**
- **True North UI Standards**
- **Shared Data Model & Shared UI**
- **AI Routing Centralization**
- **Architecture → QA → Build alignment**

**All modules** (Maturity, Risk, PIT, Incident, Analytics, Skills, etc.) **live inside the ISMS Portal**, not as standalone apps.

This ensures:

- Consistent navigation
- Shared layout
- Unified authentication & authorization
- Shared user/org context
- AI personalization
- Integrated workflows

---

## 1. Top-Level Monorepo Structure

```
maturion-isms/
│
├── apps/
│   └── isms-portal/           # MAIN APP – all modules live here
│
├── packages/
│   ├── common-ui/             # Shared UI components for all modules
│   ├── common-data-model/     # Shared TS types, domain models
│   ├── ai-client/             # Shared maturion-ai gateway client
│   └── utils/                 # General utilities
│
├── architecture/              # ALL architecture documentation
│
├── infrastructure/
│   ├── db/                    # Supabase migrations, schemas
│   ├── pipelines/             # ETL / analytics pipelines
│   └── deployment/            # CI/CD workflows
│
└── tools/                     # CLI tools, scripts
```

---

## 2. ISMS Portal App Structure

```
apps/isms-portal/
│
├── src/
│   ├── app/
│   ├── modules/
│   ├── components/
│   ├── hooks/
│   ├── contexts/
│   ├── lib/
│   ├── integration/
│   ├── layouts/
│   ├── router/
│   ├── styles/
│   ├── types/
│   └── tests/
│
├── public/
└── package.json
```

Let's break these down.

---

## 3. ISMS Portal – Completed Folder Map (Detailed)

### 3.1 `/app` — Global App Layer

```
src/app/
│
├── App.tsx                    # Global shell
├── providers/                 # Global providers
│   ├── SupabaseProvider.tsx
│   ├── OrgProvider.tsx
│   ├── UserProvider.tsx
│   └── AIProvider.tsx
├── layout/
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── AISidePanel.tsx
│   └── RootLayout.tsx
└── index.tsx
```

This is the global chrome & context layer.

---

### 3.2 `/modules` — ALL ISMS Modules

```
src/modules/
│
├── maturity/
├── risk/
├── wrac/
├── vulnerability/
├── pit/
├── incident/
├── analytics/
├── skills/
└── systems/
```

Each module has the exact same internal structure.

---

### 3.3 Module Internal Structure (applies to ALL modules)

**Template Pattern:**

```
src/modules/{module-name}/
│
├── index.ts                   # Public API exports
│
├── components/                # Module-specific UI components
│   ├── {Module}Shell.tsx      # Module root container
│   ├── {Module}Dashboard.tsx  # Module main dashboard
│   ├── forms/                 # Form components
│   ├── tables/                # Table/grid components
│   ├── cards/                 # Card components
│   └── dialogs/               # Modal/dialog components
│
├── pages/                     # Module pages/routes
│   ├── {Module}HomePage.tsx
│   ├── {Module}DetailPage.tsx
│   └── ...
│
├── hooks/                     # Module-specific hooks
│   ├── use{Module}Data.ts
│   ├── use{Module}Actions.ts
│   └── ...
│
├── contexts/                  # Module-specific contexts
│   └── {Module}Context.tsx
│
├── lib/                       # Module business logic
│   ├── {module}-api.ts        # API client functions
│   ├── {module}-utils.ts      # Utility functions
│   ├── {module}-validation.ts # Validation schemas
│   └── {module}-calculations.ts
│
├── types/                     # Module-specific types
│   ├── {module}.types.ts
│   └── index.ts
│
├── integration/               # Integration with other modules
│   ├── to-pit.ts              # PIT integration
│   ├── to-risk.ts             # Risk integration
│   └── ...
│
├── tests/                     # Module tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── README.md                  # Module documentation
```

**Example (Maturity Module):**

```
src/modules/maturity/
│
├── index.ts
│
├── components/
│   ├── MaturityShell.tsx
│   ├── MaturityDashboard.tsx
│   ├── forms/
│   │   ├── MPSForm.tsx
│   │   ├── CriteriaForm.tsx
│   │   └── EvidenceForm.tsx
│   ├── tables/
│   │   ├── MPSTable.tsx
│   │   └── CriteriaTable.tsx
│   ├── cards/
│   │   ├── DomainCard.tsx
│   │   └── MaturityScoreCard.tsx
│   └── dialogs/
│       ├── ApprovalDialog.tsx
│       └── EvidenceUploadDialog.tsx
│
├── pages/
│   ├── MaturityHomePage.tsx
│   ├── DomainDetailPage.tsx
│   ├── MPSDetailPage.tsx
│   ├── EvidencePage.tsx
│   └── AssessmentPage.tsx
│
├── hooks/
│   ├── useMaturityData.ts
│   ├── useMaturityActions.ts
│   ├── useDomains.ts
│   ├── useMPS.ts
│   └── useEvidence.ts
│
├── contexts/
│   └── MaturityContext.tsx
│
├── lib/
│   ├── maturity-api.ts
│   ├── maturity-utils.ts
│   ├── maturity-validation.ts
│   ├── maturity-calculations.ts
│   └── maturity-scoring.ts
│
├── types/
│   ├── maturity.types.ts
│   ├── domain.types.ts
│   ├── mps.types.ts
│   └── index.ts
│
├── integration/
│   ├── to-pit.ts
│   ├── to-analytics.ts
│   └── to-skills.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── README.md
```

---

### 3.4 `/components` — Shared Portal-Wide Components

```
src/components/
│
├── ui/                        # shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── table.tsx
│   └── ...
│
├── common/                    # Common ISMS components
│   ├── DataTable.tsx          # Reusable data table
│   ├── FormField.tsx          # Standardized form field
│   ├── LoadingSpinner.tsx
│   ├── ErrorBoundary.tsx
│   └── ...
│
├── navigation/                # Navigation components
│   ├── Breadcrumb.tsx
│   ├── ModuleTabs.tsx
│   └── QuickNav.tsx
│
└── ai/                        # AI-related components
    ├── AIAssistantButton.tsx
    ├── AIResponsePanel.tsx
    └── AILoadingIndicator.tsx
```

---

### 3.5 `/hooks` — Shared Hooks

```
src/hooks/
│
├── useAuth.ts                 # Authentication hook
├── useOrg.ts                  # Organization context hook
├── useUser.ts                 # User context hook
├── useSupabase.ts             # Supabase client hook
├── useAI.ts                   # AI routing hook
├── useRLS.ts                  # RLS helper hook
├── usePermissions.ts          # Permission checks
└── useNotifications.ts        # Toast/notification hook
```

---

### 3.6 `/contexts` — Global Contexts

```
src/contexts/
│
├── AuthContext.tsx            # Authentication state
├── OrgContext.tsx             # Current organization
├── UserContext.tsx            # Current user + preferences
├── AIContext.tsx              # AI model routing state
├── ThemeContext.tsx           # Theme/appearance
└── NotificationContext.tsx    # Global notifications
```

---

### 3.7 `/lib` — Core Libraries

```
src/lib/
│
├── supabase/                  # Supabase integration
│   ├── client.ts              # Supabase client init
│   ├── auth.ts                # Auth helpers
│   ├── rls.ts                 # RLS helpers
│   └── storage.ts             # Storage helpers
│
├── ai/                        # AI integration
│   ├── ai-client.ts           # AI gateway client
│   ├── model-routing.ts       # Model selection logic
│   ├── complexity-scoring.ts  # Complexity analysis
│   └── prompt-templates.ts    # Reusable prompts
│
├── utils/                     # General utilities
│   ├── date.ts
│   ├── string.ts
│   ├── validation.ts
│   └── formatting.ts
│
└── api/                       # API utilities
    ├── client.ts              # Base API client
    ├── error-handling.ts      # Error handling
    └── types.ts               # API types
```

---

### 3.8 `/integration` — Cross-Module Integration Layer

```
src/integration/
│
├── index.ts                   # Integration registry
│
├── maturity-to-pit/           # Maturity → PIT integration
│   ├── index.ts
│   ├── task-generation.ts
│   └── progress-sync.ts
│
├── risk-to-wrac/              # Risk → WRAC integration
│   ├── index.ts
│   └── risk-export.ts
│
├── pit-to-analytics/          # PIT → Analytics integration
│   ├── index.ts
│   └── progress-metrics.ts
│
├── vulnerability-to-risk/     # Vulnerability → Risk integration
│   ├── index.ts
│   └── vulnerability-scoring.ts
│
└── README.md                  # Integration patterns doc
```

**Integration Pattern:**

Each integration folder contains:
- **index.ts**: Public API
- **{action}.ts**: Specific integration logic
- **types.ts**: Integration-specific types (if needed)

---

### 3.9 `/layouts` — Layout Components

```
src/layouts/
│
├── RootLayout.tsx             # Main app layout
├── ModuleLayout.tsx           # Standard module layout
├── PublicLayout.tsx           # Public/unauthenticated layout
└── AuthLayout.tsx             # Login/signup layout
```

---

### 3.10 `/router` — Routing Configuration

```
src/router/
│
├── index.tsx                  # Router setup
├── routes.tsx                 # Route definitions
├── guards/                    # Route guards
│   ├── AuthGuard.tsx          # Require authentication
│   ├── RoleGuard.tsx          # Require specific role
│   └── SubscriptionGuard.tsx  # Require subscription
└── module-routes/             # Module-specific routes
    ├── maturity.routes.tsx
    ├── risk.routes.tsx
    ├── pit.routes.tsx
    └── ...
```

---

### 3.11 `/styles` — Global Styles

```
src/styles/
│
├── globals.css                # Global CSS
├── variables.css              # CSS variables
├── theme.css                  # Theme definitions
└── tailwind.css               # Tailwind imports
```

---

### 3.12 `/types` — Global Type Definitions

```
src/types/
│
├── index.ts                   # Type exports
├── user.types.ts              # User types
├── org.types.ts               # Organization types
├── auth.types.ts              # Auth types
├── ai.types.ts                # AI types
├── api.types.ts               # API response types
└── common.types.ts            # Common utility types
```

---

### 3.13 `/tests` — Global Test Utilities

```
src/tests/
│
├── setup.ts                   # Test setup
├── mocks/                     # Mock data
│   ├── users.ts
│   ├── orgs.ts
│   └── ...
├── fixtures/                  # Test fixtures
├── helpers/                   # Test helpers
│   ├── render.tsx             # Custom render
│   └── test-utils.ts
└── e2e/                       # E2E tests
    ├── auth.spec.ts
    └── navigation.spec.ts
```

---

## 4. Shared Packages Structure

### 4.1 `packages/common-ui/`

```
packages/common-ui/
│
├── src/
│   ├── components/            # Reusable components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Table/
│   │   └── ...
│   ├── hooks/                 # Reusable hooks
│   ├── utils/                 # UI utilities
│   └── index.ts               # Public exports
│
├── package.json
└── tsconfig.json
```

---

### 4.2 `packages/common-data-model/`

```
packages/common-data-model/
│
├── src/
│   ├── types/                 # Shared TypeScript types
│   │   ├── user.types.ts
│   │   ├── org.types.ts
│   │   ├── module.types.ts
│   │   └── index.ts
│   ├── schemas/               # Zod validation schemas
│   │   ├── user.schema.ts
│   │   ├── org.schema.ts
│   │   └── index.ts
│   ├── enums/                 # Shared enums
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

---

### 4.3 `packages/ai-client/`

```
packages/ai-client/
│
├── src/
│   ├── client/                # AI gateway client
│   │   ├── AIClient.ts
│   │   └── types.ts
│   ├── routing/               # Model routing logic
│   │   ├── ModelRouter.ts
│   │   ├── complexity.ts
│   │   └── rules.ts
│   ├── prompts/               # Prompt templates
│   │   ├── maturity/
│   │   ├── risk/
│   │   └── common/
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

---

### 4.4 `packages/utils/`

```
packages/utils/
│
├── src/
│   ├── date/                  # Date utilities
│   ├── string/                # String utilities
│   ├── validation/            # Validation utilities
│   ├── formatting/            # Formatting utilities
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

---

## 5. Architecture Documentation Structure

```
architecture/
│
├── ISMS_PORTAL_FOLDER_STRUCTURE_MAP_v1.0.md  # This document
│
├── core/                                      # Core architecture docs
│   ├── Integrated_ISMS_Architecture_v1.1.md
│   ├── INTEGRATED_ISMS_MODULE_INTEGRATION_MAP_v1.0.md
│   └── ...
│
├── true-north/                                # True North standards
│   ├── MATURION_TRUE_NORTH_v1.2.md
│   ├── Maturion_Build_Philosophy_v1.1.md
│   └── ...
│
├── build/                                     # Build documentation
│   ├── SRMF_MASTER_BUILD_REFERENCE_v1.0.md
│   └── ...
│
└── modules/                                   # Per-module architecture
    ├── maturity/
    │   ├── MATURITY_MODULE_ARCHITECTURE_v1.0.md
    │   ├── MATURITY_QA_TEST_SUITE_v1.0.md
    │   ├── MATURITY_BUILDER_TASKS_v1.0.md
    │   ├── MATURITY_MODULE_MIGRATION_MAP_v1.0.md
    │   └── changelog.md
    ├── pit/
    │   └── Architecture/
    │       ├── PIT_ARCHITECTURE_v0.1.md
    │       ├── PIT_DATABASE_SCHEMA_v1.1.md
    │       ├── PIT_FRONTEND_COMPONENT_MAP_v1.1.md
    │       └── ...
    ├── risk/
    ├── wrac/
    ├── vulnerability/
    ├── incident/
    ├── analytics/
    ├── skills/
    └── systems/
```

---

## 6. Infrastructure Structure

### 6.1 `infrastructure/db/`

```
infrastructure/db/
│
├── migrations/                # Supabase migrations
│   ├── 001_initial_schema.sql
│   ├── 002_maturity_tables.sql
│   ├── 003_pit_tables.sql
│   └── ...
│
├── schemas/                   # Schema documentation
│   ├── maturity.schema.md
│   ├── pit.schema.md
│   └── ...
│
├── seed/                      # Seed data
│   ├── users.sql
│   ├── orgs.sql
│   └── ...
│
└── functions/                 # Supabase Edge Functions
    ├── maturity/
    ├── pit/
    └── common/
```

---

### 6.2 `infrastructure/pipelines/`

```
infrastructure/pipelines/
│
├── etl/                       # ETL pipelines
│   ├── maturity-analytics/
│   ├── pit-progress/
│   └── ...
│
├── analytics/                 # Analytics processing
│   ├── dashboards/
│   └── reports/
│
└── scripts/                   # Pipeline scripts
```

---

### 6.3 `infrastructure/deployment/`

```
infrastructure/deployment/
│
├── .github/
│   └── workflows/             # GitHub Actions
│       ├── ci.yml
│       ├── deploy-staging.yml
│       ├── deploy-prod.yml
│       └── test.yml
│
├── docker/                    # Docker configs
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── terraform/                 # Infrastructure as code (if used)
```

---

## 7. Tools Structure

```
tools/
│
├── cli/                       # CLI tools
│   ├── migrate.ts             # Migration runner
│   ├── seed.ts                # Data seeder
│   └── scaffold.ts            # Module scaffolder
│
├── scripts/                   # Utility scripts
│   ├── generate-types.ts      # Type generation
│   ├── lint-fix.ts            # Lint fixer
│   └── test-all.ts            # Test runner
│
└── generators/                # Code generators
    ├── module/                # Module generator
    ├── component/             # Component generator
    └── integration/           # Integration generator
```

---

## 8. Module Integration Patterns

### 8.1 Integration Flow Example: Maturity → PIT

**Trigger:** User approves an MPS action item for implementation

**Integration Steps:**

1. **Maturity Module** calls `integration/maturity-to-pit/task-generation.ts`
2. Integration layer:
   - Transforms MPS data into PIT task format
   - Calls PIT module API via `modules/pit/lib/pit-api.ts`
   - Creates tasks, subtasks, and dependencies
3. **PIT Module** receives tasks and triggers notifications
4. Integration layer updates Maturity MPS with PIT project reference
5. Bi-directional sync established for progress tracking

**Code Pattern:**

```typescript
// src/integration/maturity-to-pit/task-generation.ts
import { createPITTasks } from '@/modules/pit/lib/pit-api';
import { updateMPSPITReference } from '@/modules/maturity/lib/maturity-api';

export async function generatePITTasksFromMPS(
  mpsId: string,
  actionItems: ActionItem[]
) {
  // Transform MPS action items to PIT tasks
  const tasks = transformMPSActionItemsToPITTasks(actionItems);
  
  // Create tasks in PIT module
  const pitProject = await createPITTasks({
    source: 'maturity',
    sourceId: mpsId,
    tasks
  });
  
  // Update MPS with PIT reference
  await updateMPSPITReference(mpsId, pitProject.id);
  
  return pitProject;
}
```

---

### 8.2 Integration Flow Example: Risk → Analytics

**Trigger:** New risk assessment completed

**Integration Steps:**

1. **Risk Module** calls `integration/risk-to-analytics/metrics-sync.ts`
2. Integration layer:
   - Extracts risk metrics (ALE, ARO, severity scores)
   - Formats data for Analytics module
   - Calls Analytics API
3. **Analytics Module** ingests data and updates dashboards
4. Real-time dashboard updates triggered

---

## 9. AI Routing Architecture

### 9.1 AI Routing Flow

```
User Request (Module Component)
    ↓
useAI() hook (src/hooks/useAI.ts)
    ↓
AIContext (src/contexts/AIContext.tsx)
    ↓
AI Client (packages/ai-client/src/client/AIClient.ts)
    ↓
Model Router (packages/ai-client/src/routing/ModelRouter.ts)
    ↓
Complexity Scoring (packages/ai-client/src/routing/complexity.ts)
    ↓
Model Selection (based on routing rules)
    ↓
Maturion AI Gateway API Call
    ↓
Response Processing
    ↓
Return to Module Component
```

### 9.2 AI Client Integration in Modules

**Example: Maturity Module Criteria Evaluation**

```typescript
// src/modules/maturity/components/forms/CriteriaForm.tsx
import { useAI } from '@/hooks/useAI';

function CriteriaForm() {
  const { evaluate, isLoading } = useAI();
  
  const handleEvaluate = async (criteria: string, evidence: string) => {
    const result = await evaluate({
      task: 'criteria-evaluation',
      context: {
        module: 'maturity',
        criteria,
        evidence
      },
      complexity: 'high' // Will route to GPT-5
    });
    
    return result;
  };
  
  // ... rest of component
}
```

---

## 10. QA & Testing Structure

### 10.1 Testing Hierarchy

```
All Tests
├── Unit Tests (src/*/tests/unit/)
│   ├── Module-specific unit tests
│   └── Utility function tests
│
├── Integration Tests (src/*/tests/integration/)
│   ├── Module integration tests
│   └── Cross-module integration tests
│
├── E2E Tests (src/tests/e2e/)
│   ├── Full user journey tests
│   └── Critical path tests
│
└── QA Test Suites (architecture/modules/*/QA/)
    ├── Module-specific QA suites
    └── Acceptance criteria
```

### 10.2 QA Workflow

Following **Architecture → QA → Build → QA → Release** pattern:

1. **Architecture Phase**: Define requirements in architecture docs
2. **QA Phase 1**: Create test suite based on architecture
3. **Build Phase**: Implement features
4. **QA Phase 2**: Execute test suite (must be 100% pass)
5. **Release Phase**: Deploy to production

---

## 11. File Naming Conventions

### 11.1 Components

- **PascalCase** for component files: `MaturityDashboard.tsx`
- **kebab-case** for component folders: `maturity-dashboard/`

### 11.2 Utilities & Libraries

- **kebab-case** for utility files: `maturity-api.ts`, `date-utils.ts`
- **camelCase** for function names

### 11.3 Types

- **kebab-case** with `.types.ts` suffix: `maturity.types.ts`
- **PascalCase** for type names: `MaturityDomain`, `MPSRecord`

### 11.4 Hooks

- **camelCase** with `use` prefix: `useMaturityData.ts`, `useAI.ts`

### 11.5 Architecture Documents

- **SCREAMING_SNAKE_CASE** with version: `MATURITY_MODULE_ARCHITECTURE_v1.0.md`
- **PascalCase** for non-module docs: `Integrated_ISMS_Architecture_v1.1.md`

---

## 12. Import Aliases

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/modules/*": ["src/modules/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/lib/*": ["src/lib/*"],
      "@/types/*": ["src/types/*"],
      "@/integration/*": ["src/integration/*"],
      "@common-ui": ["packages/common-ui/src"],
      "@common-data": ["packages/common-data-model/src"],
      "@ai-client": ["packages/ai-client/src"],
      "@utils": ["packages/utils/src"]
    }
  }
}
```

**Usage Example:**

```typescript
import { MaturityDashboard } from '@/modules/maturity/components/MaturityDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@common-ui';
import { UserSchema } from '@common-data';
import { AIClient } from '@ai-client';
```

---

## 13. Module Scaffolding Template

When creating a new module, use this command:

```bash
pnpm run scaffold:module --name={module-name}
```

This generates the complete module structure following the pattern in **Section 3.3**.

---

## 14. Migration Path from Legacy Apps

For existing legacy apps (e.g., `maturion-maturity-legacy`):

1. **Identify** current structure
2. **Map** files to new module structure (use Migration Map docs)
3. **Create** new module folder under `src/modules/`
4. **Migrate** components, hooks, contexts, pages
5. **Refactor** to align with True North patterns
6. **Integrate** with other modules via `src/integration/`
7. **Test** using QA test suite
8. **Remove** legacy app once fully migrated

---

## 15. Versioning & Changelog

- This document follows semantic versioning: `MAJOR.MINOR.PATCH`
- Changes are tracked in `architecture/ISMS_PORTAL_FOLDER_STRUCTURE_MAP_CHANGELOG.md`
- Major version changes require Foreman approval
- Minor/patch changes can be made by Builders with review

---

## 16. Enforcement & Compliance

### 16.1 Enforcement Rules

- **All new code** must follow this structure
- **No exceptions** without Foreman approval
- **Builder agents** must validate structure before committing
- **CI/CD** validates folder structure on every PR

### 16.2 Structure Validation

A linting rule validates:
- Modules follow template structure
- Imports use correct aliases
- Files are in correct locations
- Naming conventions are followed

---

## 17. Examples & References

### 17.1 Reference Implementations

- **Maturity Module**: See `src/modules/maturity/` (when migrated)
- **PIT Module**: See `architecture/modules/pit/Architecture/`
- **Integration Example**: See `src/integration/maturity-to-pit/`

### 17.2 Documentation References

- **True North**: `architecture/true-north/MATURION_TRUE_NORTH_v1.2.md`
- **Build Philosophy**: `architecture/true-north/Maturion_Build_Philosophy_v1.1.md`
- **Integration Map**: `architecture/core/INTEGRATED_ISMS_MODULE_INTEGRATION_MAP_v1.0.md`
- **ISMS Architecture**: `architecture/core/Integrated_ISMS_Architecture_v1.1.md`

---

## 18. Summary

This folder structure map defines the **authoritative, non-negotiable** structure for the ISMS Portal.

**Key Principles:**

✅ **Single unified app** - All modules in `apps/isms-portal/src/modules/`  
✅ **Consistent structure** - Every module follows the same template  
✅ **Clear separation** - Modules, integration, shared code all separated  
✅ **Shared foundations** - Common UI, data models, AI client in `packages/`  
✅ **Integration layer** - Explicit cross-module integrations in `src/integration/`  
✅ **True North aligned** - Follows all True North standards  
✅ **QA enforced** - Structure validated before every release  

**This is the foundation for building the Maturion ISMS ecosystem.**

---

**End of Document**
