# Maturion Agent Container Runner

**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0  
**Status**: Roadmap scaffold (STUB)  
**Version**: 0.1.0-stub

---

## Purpose

Container image providing a deterministic, isolated environment for running
Maturion governance agents (IAA, Foreman, etc.) in CI.

This directory provides the scaffolding for a future containerised agent runner that
will replace the current shell stub in `.github/scripts/agent-runner.sh`.

---

## Current State (Stub)

The `Dockerfile` in this directory is a **roadmap scaffold**. The live agent execution
mechanism is `.github/scripts/agent-runner.sh`, which generates placeholder governance
artifacts with correct structure and path conventions.

---

## Roadmap

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Shell stub (`agent-runner.sh`) | ✅ CURRENT |
| Phase 2 | Container build + CI integration | 🔲 PLANNED |
| Phase 3 | Live agent invocation via Maturion bootstrap MCP | 🔲 PLANNED |

---

## Build (when implemented)

```bash
# Build context is .github/ so that COPY scripts/agent-runner.sh resolves correctly
docker build -t maturion-agent-runner -f .github/runner/Dockerfile .github/
```

## Run (from repo root, when implemented)

```bash
docker run --rm \
  -v "$(pwd):/workspace" \
  -e MATURION_BOT_TOKEN="$MATURION_BOT_TOKEN" \
  maturion-agent-runner \
  --command bootstrap --pr-number 123 --branch copilot/my-branch
```

---

## Allowed Write Paths

The container (and shell stub) are restricted to writing only to:

- `.agent-admin/assurance/`
- `.agent-workspace/`

The `maturion-iaa-bootstrap.yml` workflow enforces this restriction before committing
any artifacts. Any file outside these paths causes the workflow to fail.

---

## Integration

The container runner is invoked by `.github/workflows/maturion-iaa-bootstrap.yml`
when a PR comment contains one of:

- `/maturion-bootstrap` — full bootstrap
- `/iaa-prebrief` — generate IAA pre-brief artifact only
- `/iaa-token <token>` — commit an IAA audit token file

---

*Authority: CS2 (Johan Ras / @APGI-cmy)*
