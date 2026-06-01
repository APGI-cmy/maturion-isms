# Monorepo Vercel Deployment Model

| Field | Value |
|---|---|
| Repository | `APGI-cmy/maturion-isms` |
| Artifact Type | Deployment model / operating note |
| Scope | All deployable apps and modules in this monorepo |
| Status | Adopted standard pending Vercel project setting verification |
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

`apps/mmm/package.json` confirms the MMM package name is `@maturion/mmm`.

Recommended Vercel settings:

| Setting | Value |
|---|---|
| Vercel Project | `maturion-isms-mmm` |
| Root Directory | `./` or blank / repository root |
| Install Command | `corepack enable && pnpm install --no-frozen-lockfile` |
| Build Command | `pnpm --filter @maturion/mmm build` |
| Output Directory | `apps/mmm/dist` |
| Framework Preset | Vite |

### ISMS Portal Project

Recommended Vercel settings:

| Setting | Value |
|---|---|
| Vercel Project | ISMS portal project |
| Root Directory | `./` or blank / repository root |
| Install Command | `corepack enable && pnpm install --no-frozen-lockfile` |
| Build Command | `pnpm --filter isms-portal build` |
| Output Directory | `apps/isms-portal/dist` |
| Framework Preset | Vite |

---

## 6. Root `vercel.json` Policy

For a multi-app monorepo, root `vercel.json` must not contain app-specific values such as:

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

Not allowed in root `vercel.json` for the multi-app model:

- one app's install command;
- one app's build command;
- one app's output directory;
- one app's dev command;
- framework setting for only one app when multiple apps exist.

---

## 7. Safe Migration Sequence

Before removing app-specific settings from root `vercel.json`, confirm that each existing Vercel project has its own project-level Build and Output settings.

Recommended sequence:

1. Configure MMM Vercel project with MMM-specific install/build/output settings.
2. Configure ISMS Vercel project with ISMS-specific install/build/output settings.
3. Merge a PR that removes app-specific install/build/output settings from root `vercel.json`.
4. Deploy ISMS and confirm Vercel uses pnpm install.
5. Deploy MMM and confirm it still builds from its own project settings.
6. Repeat the same pattern for future apps/modules.

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

The ISMS Vercel project failed before build because Vercel was still running `npm install`, while the app depends on pnpm workspace packages.

This is a deployment configuration issue, not yet an ISMS runtime build failure.

This cleanup removes app-specific install/build/output settings from root `vercel.json` so app-specific Vercel project settings can take effect.
