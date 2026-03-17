# Maturion Agent Container Runner
#
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0
# Purpose:   Container image for deterministic governance agent execution.
#            Provides a reproducible, isolated environment for running
#            Maturion governance agents (IAA, Foreman, etc.) in CI.
#
# STUB — ROADMAP SCAFFOLD
# ──────────────────────────────────────────────────────────────────────────────
# This Dockerfile is a roadmap scaffold. The current agent runner
# (.github/scripts/agent-runner.sh) is a shell stub. Future iterations will:
#
#   1. Replace agent-runner.sh with a call to this container image.
#   2. The container will invoke the Maturion agent bootstrap MCP tool.
#   3. Agents execute within the container for deterministic, reproducible output.
#   4. The container writes artifacts to mounted volumes (allowed paths only):
#        /workspace/.agent-admin/assurance/
#        /workspace/.agent-workspace/
#
# Build:
#   docker build -t maturion-agent-runner .github/runner/
#
# Run (from repo root):
#   docker run --rm \
#     -v "$(pwd):/workspace" \
#     -e MATURION_BOT_TOKEN="$MATURION_BOT_TOKEN" \
#     maturion-agent-runner \
#     --command bootstrap --pr-number 123 --branch copilot/my-branch
# ──────────────────────────────────────────────────────────────────────────────

FROM ubuntu:22.04

LABEL org.opencontainers.image.title="Maturion Agent Runner"
LABEL org.opencontainers.image.description="Container runner for Maturion governance agents"
LABEL org.opencontainers.image.vendor="Maturion"
LABEL org.opencontainers.image.version="0.1.0-stub"

# Minimal runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
      bash \
      curl \
      ca-certificates \
      git \
      jq \
    && rm -rf /var/lib/apt/lists/*

# Install GitHub CLI for artifact commit operations
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
      | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
      | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install -y gh \
    && rm -rf /var/lib/apt/lists/*

# Copy agent runner script
COPY scripts/agent-runner.sh /usr/local/bin/agent-runner.sh
RUN chmod +x /usr/local/bin/agent-runner.sh

# Set working directory (mount repo here when running)
WORKDIR /workspace

# Default entrypoint delegates to agent runner
ENTRYPOINT ["/usr/local/bin/agent-runner.sh"]
CMD ["--help"]
