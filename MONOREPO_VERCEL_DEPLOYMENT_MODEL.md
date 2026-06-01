# Monorepo Vercel Deployment Model

| Field | Value |
|---|---|
| Repository | `APGI-cmy/maturion-isms` |
| Artifact Type | Deployment model / operating note |
| Scope | All deployable apps and modules in this monorepo |
| Status | Proposed standard for review |
| Date | 2026-06-01 |

---

## 1. Purpose

This repository contains multiple apps and module workstreams. During development, different modules may need their own Vercel projects even though the long-term platform direction may be one integrated Maturion application.

This note defines how Vercel deployment should work for a pnpm workspace monorepo so that MMM, ISMS, and future module apps do not accidentally overwrite or break each other.

---

## 2. Core Principle

Do not hard-code one module app's install, build, or output settings in the root `vercel.json` when multiple Vercel projects deploy from the same monorepo.

The root `vercel.json` should be reserved for shared cross-project behavior only, such as security headers and generic SPA rewrites, unless the repository has exactly one Vercel deployment target.

App-specific deployment settings should live in the relevant Vercel project settings.

---

## 3. Why This Matters

This monorepo uses pnpm workspaces. Workspace packages may be referenced with `workspace:*`.

If Vercel runs `npm install`, deployment can fail with:

```text
Unsupported URL Type "workspace:": workspace:*
```

That failure means Vercel is using npm against a pnpm workspace dependency graph.

The correct install model is to install from the monorepo root using pnpm, then build the selected app by package filter.

---

## 4. Standard Vercel Project Pattern

Each deployable app should have its own Vercel project during modular development.

Each Vercel project should use the repository root as its root directory, then build only the target app.

### Shared settings for app projects

| Setting | Recommended Value |
|---|---|
| Root Directory | `./` or blank / repository root |
| Install Command | `corepack enable && pnpm install --no-frozen-lockfile` |
| Build Command | `pnpm --filter <package-name> build` |
| Output Directory | `<app-path>/dist` |
| Framework Preset | Vite, where the app is Vite-based |

Use `--no-frozen-lockfile` until the lockfile/package-manager version alignment is settled. A later hardening wave may move this to `--frozen-lockfile` once lockfile drift is resolved.

---

## 5. Current Known Projects

### MMM Project

The existing MMM deployment should remain app-specific.

Expected pattern:

| Setting | Value |
|---|---|
| Root Directory | `./` or blank / repository root |
| Install Command | `corepack enable && pnpm install --no-frozen-lockfile` |
| Build Command | `pnpm --filter <mmm-package-name> build` |
| Output Directory | `apps/mmm/dist` |

The exact MMM package filter must be confirmed from `apps/mmm/package.json` before changing MMM project settings.

### ISMS Portal Project

Expected pattern:

| Setting | Value |
|---|---|
| Root Directory | `./` or blank / repository root |
| Install Command | `corepack enable && pnpm install --no-frozen-lockfile` |
| Build Command | `pnpm --filter isms-portal build` |
| Output Directory | `apps/isms-portal/dist` |

---

## 6. Root `vercel.json` Policy

For a multi-app monorepo, root `vercel.json` should not contain app-specific values such as:

```json
{
  "installCommand": "npm install",
  "buildCommand": "cd apps/mmm && npm run build",
  "outputDirectory": "apps/mmm/dist"
}
```

Those values force every Vercel project that reads the root config to behave as the same app.

Recommended root `vercel.json` responsibility:

- shared security headers;
- generic SPA rewrite behavior if safe for all apps;
- repo-wide non-app-specific Vercel behavior.

Not recommended in root `vercel.json`:

- one app's install command;
- one app's build command;
- one app's output directory;
- one app's dev command;
- framework setting for only one app when multiple apps exist.

---

## 7. Safe Migration Sequence

Before removing app-specific settings from root `vercel.json`, confirm that each existing Vercel project has its own project-level Build and Output settings.

Recommended sequence:

1. Confirm MMM package name from `apps/mmm/package.json`.
2. Configure MMM Vercel project with MMM-specific install/build/output settings.
3. Configure ISMS Vercel project with ISMS-specific install/build/output settings.
4. Create a PR that removes app-specific install/build/output settings from root `vercel.json`.
5. Deploy ISMS and confirm Vercel uses pnpm install.
6. Deploy MMM and confirm it still builds from its own project settings.
7. Repeat the same pattern for future apps/modules.

---

## 8. Agent Instructions

Agents working in this repository must not assume that root `vercel.json` belongs to their module.

Before changing Vercel deployment configuration, agents must identify:

- target app path;
- target package name;
- expected output directory;
- workspace dependency requirements;
- whether the change affects other Vercel projects;
- whether project-level Vercel settings are a safer location than root config.

Agents must not replace root deployment settings for one module without considering other module deployments.

---

## 9. Testing Expectations

Any deployment config change should be validated by checking the Vercel build log.

For pnpm monorepo projects, the log should show the intended install command, for example:

```text
Running "install" command: `corepack enable && pnpm install --no-frozen-lockfile`...
```

If the log still shows:

```text
Running "install" command: `npm install`...
```

then either project settings were not applied or root `vercel.json` is still overriding the app-specific settings.

A successful deployment test should record:

- branch deployed;
- Vercel project name;
- install command observed;
- build command observed;
- output directory used;
- whether install reached build;
- whether build passed or failed;
- next failure if any.

---

## 10. Current ISMS Finding

The ISMS Vercel project currently fails before build because Vercel is still running `npm install`, while the app depends on pnpm workspace packages.

This is a deployment configuration issue, not yet an ISMS runtime build failure.

The next cleanup PR should adjust root `vercel.json` so app-specific Vercel project settings can take effect without breaking other module deployments.
