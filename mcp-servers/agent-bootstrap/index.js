#!/usr/bin/env node
/**
 * agent-bootstrap MCP Server
 *
 * Provides a single tool: `agent_bootstrap`
 *
 * ⚠️ CALL THIS FIRST. Skipping is a GOV-BREACH-AIMC-W5-002 POLC violation.
 *
 * Every governed agent MUST call this tool as their absolute first action in
 * every session, before any repo file read, issue body read, or other operation.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { z } = require("zod");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

// Resolve repo root: two levels up from mcp-servers/agent-bootstrap/
const REPO_ROOT = path.resolve(__dirname, "..", "..");

const AGENTS_DIR = path.join(REPO_ROOT, ".github", "agents");

// Dynamically discover all agent contracts at startup — no manual update needed when agents are added
const AGENT_CONTRACT_PATHS = fs
  .readdirSync(AGENTS_DIR)
  .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
  .reduce((map, filename) => {
    const agentId = filename.replace(/\.md$/, "");
    map[agentId] = `.github/agents/${filename}`;
    return map;
  }, {});

const VALID_AGENT_IDS = Object.keys(AGENT_CONTRACT_PATHS).join(", ");

const server = new McpServer({
  name: "agent-bootstrap",
  version: "1.0.0",
});

server.tool(
  "agent_bootstrap",
  "⚠️ CALL THIS FIRST. Skipping is a GOV-BREACH-AIMC-W5-002 POLC violation.\n\n" +
  "Every governed agent MUST call this tool as the absolute first action of every " +
  "session — before reading any repository file, issue body, or performing any other " +
  "operation. Provide your agent_id (from the issue assignee field, issue title, or " +
  "explicit task instruction). The tool returns your full contract file contents, which " +
  "you must read and execute Phase 1 of before proceeding.\n\n" +
  "Valid agent IDs: " + VALID_AGENT_IDS,
  {
    agent_id: z
      .string()
      .describe(
        `Your agent identity. Must be one of the ${Object.keys(AGENT_CONTRACT_PATHS).length} governed agent IDs listed in ` +
        ".github/copilot-instructions.md. Determine this from the issue assignee, " +
        "issue title, or explicit instruction before calling this tool."
      ),
  },
  async ({ agent_id }) => {
    const agentId = agent_id.trim();

    if (!agentId) {
      return {
        content: [
          {
            type: "text",
            text:
              "HALT: 'agent_id' is required but was empty.\n\n" +
              "Determine your agent identity from the issue assignee field, issue title, or " +
              "explicit task instruction, then call agent_bootstrap again with a valid agent_id.\n\n" +
              "Valid agent IDs: " + VALID_AGENT_IDS,
          },
        ],
        isError: true,
      };
    }

    const contractRelPath = AGENT_CONTRACT_PATHS[agentId];
    if (!contractRelPath) {
      return {
        content: [
          {
            type: "text",
            text:
              `HALT: Unrecognized agent_id '${agentId}'.\n\n` +
              "Cannot determine contract file. Escalate to CS2 (@APGI-cmy). Do not proceed.\n\n" +
              "Valid agent IDs: " + VALID_AGENT_IDS,
          },
        ],
        isError: true,
      };
    }

    const contractAbsPath = path.join(REPO_ROOT, contractRelPath);

    let contractContents;
    try {
      contractContents = fs.readFileSync(contractAbsPath, "utf8");
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text:
              `HALT: Agent contract file missing or unreadable: ${contractRelPath}\n\n` +
              `Error: ${err.message}\n\n` +
              "Escalate to CS2 (@APGI-cmy). Do not proceed.",
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text:
            `# Agent Bootstrap — Contract loaded for: ${agentId}\n\n` +
            `Contract file: ${contractRelPath}\n\n` +
            `⚠️ You MUST read this contract in full and complete Phase 1 before any other action.\n\n` +
            `---\n\n` +
            contractContents,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  process.stderr.write(`agent-bootstrap MCP server error: ${err.message}\n`);
  process.exit(1);
});
