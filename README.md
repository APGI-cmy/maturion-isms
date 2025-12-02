# Maturion ISMS Monorepo

This is the main monorepo for Maturion ISMS (Information Security Management System) and SRMF (Security Risk Management Framework) applications.

## Structure

```
/apps
  /global-shell           # ISMS UI shell and navigation
/packages
  /common-ui              # Shared UI components (wizard pattern, layout)
  /common-data-model      # Unified entity models for SRMF entities
/infrastructure
  /vercel                 # Deployment templates
  /db                     # Database schema and migrations
/architecture
  SRMF_MASTER_BUILD_REFERENCE_v1.0.md
  Integrated_ISMS_Architecture_v1.1.md
  INTEGRATED_ISMS_MODULE_INTEGRATION_MAP_v1.0.md
```

## Getting Started

This monorepo uses pnpm workspaces. To get started:

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Test
pnpm test
```

## Requirements

- Node.js >= 18.0.0
- pnpm >= 8.0.0
