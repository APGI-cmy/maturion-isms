# Known Technical Debt — MAT Frontend

**Module**: MAT Frontend  
**Date**: 2026-02-18  
**Authority**: Foreman Agent (Stop-and-Fix remediation)  
**Status**: DOCUMENTED (Wave 6 deployment blocker analysis)

---

## TD-001: ESLint v8 Deprecation Warnings

### Issue Description

The MAT frontend currently uses `eslint@8.57.1`, which shows deprecation warnings during `npm install`. Upgrading to ESLint v9 (the current supported version) requires significant configuration migration and is incompatible with the current TypeScript ESLint plugin versions.

### Deprecation Warnings

```
npm warn deprecated eslint@8.57.1: This version is no longer supported
npm warn deprecated glob@7.2.3: Contains widely publicized security vulnerabilities
npm warn deprecated rimraf@3.0.2: No longer supported
npm warn deprecated inflight@1.0.6: Leaks memory
npm warn deprecated @humanwhocodes/config-array@0.13.0: Deprecated
npm warn deprecated @humanwhocodes/object-schema@2.0.3: Deprecated
```

### Root Cause

- **Direct dependency**: `eslint@8.57.1` (in `apps/mat-frontend/package.json`)
- **Transitive dependencies**: glob, rimraf, inflight, @humanwhocodes/* are dependencies of eslint@8
- **Compatibility constraint**: Current TypeScript ESLint plugins (`@typescript-eslint/eslint-plugin@6.14.0`, `@typescript-eslint/parser@6.14.0`) do not support ESLint v9

### Impact Assessment

**Security**: 
- Low risk for production deployment
- ESLint is a dev dependency (not shipped to production)
- Security vulnerabilities in glob/rimraf affect development environment only

**Functionality**:
- ✅ Lint passes with 0 errors, 0 warnings
- ✅ Build succeeds
- ✅ All 127 tests GREEN
- ✅ No production runtime impact

**Governance Compliance**:
- Stop-and-Fix Doctrine: "Warnings are errors" principle
- Acceptable deviation: Documented technical debt with migration plan
- Authority: Foreman decision (Wave 6 deployment unblocked with documentation)

### Migration Path (Future Work)

To resolve these warnings, the following migration is required:

1. **Update TypeScript ESLint plugins**:
   ```bash
   npm install --save-dev \
     @typescript-eslint/eslint-plugin@^8.0.0 \
     @typescript-eslint/parser@^8.0.0
   ```

2. **Update ESLint to v9**:
   ```bash
   npm install --save-dev eslint@^9.16.0
   ```

3. **Migrate configuration**:
   - Convert `.eslintrc.cjs` to `eslint.config.js` (flat config format)
   - Update all plugin references per ESLint v9 migration guide
   - Ref: https://eslint.org/docs/latest/use/configure/migration-guide

4. **Validate no breaking changes**:
   ```bash
   npm run lint   # Must pass
   npm run build  # Must succeed
   npm test       # All 127 tests must pass
   ```

**Estimated Effort**: 2-4 hours (research, migration, testing)  
**Risk Level**: MEDIUM (potential for breaking changes in linting rules)  
**Priority**: P2 (Low - cosmetic warnings, no production impact)

### Decision

**Status**: ACCEPTED as known technical debt  
**Rationale**: 
- ESLint v8 is still functional despite deprecation
- Upgrading requires significant configuration migration
- No production runtime impact (dev dependency only)
- Wave 6 deployment should not be blocked by dev tool deprecation warnings

**Approved By**: Foreman Agent  
**Governance Authority**: Stop-and-Fix Doctrine (documented deviation with migration plan)

### Monitoring

- **Review Date**: Next major dependency update cycle
- **Trigger for Action**: ESLint v8 reaches end-of-security-support
- **Owner**: Future maintenance team

---

## Governance Compliance

**Stop-and-Fix Doctrine Adherence**:
- ✅ Issue identified and analyzed (not ignored)
- ✅ Root cause documented
- ✅ Impact assessed (low risk)
- ✅ Migration path defined
- ✅ Explicit decision documented
- ✅ Monitoring plan established

**Authority**: 
- STOP_AND_FIX_DOCTRINE.md
- FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md (Foreman judgment within boundaries)
- BL-024 Constitutional Sandbox (judgment exercised appropriately)

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-18  
**Next Review**: 2026-06-01 (or when ESLint v8 security support ends)
