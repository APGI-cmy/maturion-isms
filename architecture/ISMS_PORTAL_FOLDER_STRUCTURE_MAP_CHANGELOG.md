# ISMS Portal Folder Structure Map - Changelog

This file tracks all changes to the ISMS Portal Folder Structure Map architecture document.

---

## Version 1.0 - 2025-12-08

**Status:** Approved by Foreman  
**Type:** Initial Release

### Added

- **Section 0: Design Philosophy**
  - Defined single unified app pattern
  - Established modular internal structure principles
  - Outlined separation of concerns approach
  - Specified True North UI standards alignment
  - Documented shared data model & UI approach
  - Defined AI routing centralization
  - Established Architecture → QA → Build alignment

- **Section 1: Top-Level Monorepo Structure**
  - Defined `apps/isms-portal/` as main application location
  - Specified `packages/` structure for shared code
  - Documented `architecture/` for all documentation
  - Outlined `infrastructure/` for db, pipelines, deployment
  - Added `tools/` for CLI tools and scripts

- **Section 2: ISMS Portal App Structure**
  - Defined top-level `src/` folder organization
  - Specified key directories: app, modules, components, hooks, contexts, lib, integration, layouts, router, styles, types, tests

- **Section 3: ISMS Portal Detailed Folder Map**
  - **3.1:** Defined `/app` global app layer structure
  - **3.2:** Listed all ISMS modules (maturity, risk, wrac, vulnerability, pit, incident, analytics, skills, systems)
  - **3.3:** Created comprehensive module internal structure template
  - **3.4:** Defined shared portal-wide components structure
  - **3.5:** Specified shared hooks organization
  - **3.6:** Outlined global contexts structure
  - **3.7:** Detailed core libraries organization (supabase, ai, utils, api)
  - **3.8:** Created cross-module integration layer structure
  - **3.9:** Defined layout components structure
  - **3.10:** Outlined routing configuration structure
  - **3.11:** Specified global styles organization
  - **3.12:** Defined global type definitions structure
  - **3.13:** Created global test utilities structure

- **Section 4: Shared Packages Structure**
  - **4.1:** Defined `packages/common-ui/` structure
  - **4.2:** Specified `packages/common-data-model/` organization
  - **4.3:** Outlined `packages/ai-client/` structure
  - **4.4:** Documented `packages/utils/` structure

- **Section 5: Architecture Documentation Structure**
  - Defined architecture folder hierarchy
  - Specified core, true-north, build, and modules subdirectories
  - Documented per-module architecture organization

- **Section 6: Infrastructure Structure**
  - **6.1:** Defined `infrastructure/db/` for migrations, schemas, seed data, and edge functions
  - **6.2:** Specified `infrastructure/pipelines/` for ETL and analytics
  - **6.3:** Outlined `infrastructure/deployment/` for CI/CD workflows

- **Section 7: Tools Structure**
  - Defined CLI tools organization
  - Specified utility scripts structure
  - Documented code generators structure

- **Section 8: Module Integration Patterns**
  - **8.1:** Provided Maturity → PIT integration example with code
  - **8.2:** Outlined Risk → Analytics integration pattern

- **Section 9: AI Routing Architecture**
  - **9.1:** Documented AI routing flow diagram
  - **9.2:** Provided AI client integration examples for modules

- **Section 10: QA & Testing Structure**
  - **10.1:** Defined testing hierarchy (unit, integration, E2E, QA suites)
  - **10.2:** Documented QA workflow following Architecture → QA → Build → QA → Release

- **Section 11: File Naming Conventions**
  - Specified conventions for components (PascalCase)
  - Defined utilities & libraries naming (kebab-case)
  - Outlined types naming (kebab-case with .types.ts)
  - Documented hooks naming (camelCase with use prefix)
  - Specified architecture document naming (SCREAMING_SNAKE_CASE)

- **Section 12: Import Aliases**
  - Defined tsconfig.json path aliases
  - Provided usage examples

- **Section 13: Module Scaffolding Template**
  - Documented scaffolding command for new modules

- **Section 14: Migration Path from Legacy Apps**
  - Outlined 8-step migration process from legacy apps

- **Section 15: Versioning & Changelog**
  - Established semantic versioning approach
  - Required changelog tracking
  - Defined approval process

- **Section 16: Enforcement & Compliance**
  - **16.1:** Defined enforcement rules
  - **16.2:** Specified structure validation approach

- **Section 17: Examples & References**
  - **17.1:** Listed reference implementations
  - **17.2:** Documented architecture documentation references

- **Section 18: Summary**
  - Provided key principles summary
  - Emphasized non-negotiable nature of structure

### Notes

- This is the initial comprehensive folder structure map for the ISMS Portal
- Aligns with all True North, Build Philosophy, and Integration Map documents
- Provides the authoritative structure for all future ISMS Portal development
- All Builders must follow this structure for new modules and features
- Structure validation will be enforced via CI/CD

---

**End of Changelog**
