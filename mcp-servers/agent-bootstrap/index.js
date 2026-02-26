#!/usr/bin/env node
/**
 * agent-bootstrap MCP Server
 *
 * Provides two tools:
 *   - `agent_bootstrap`            — load an agent contract (REQUIRED FIRST CALL)
 *   - `agent_bootstrap_list_agents` — list all valid governed agent IDs
 *
 * ⚠️ CALL `agent_bootstrap` FIRST. Skipping is a GOV-BREACH-AIMC-W5-002 POLC violation.
 *
 * Every governed agent MUST call `agent_bootstrap` as their absolute first action in
 * every session, before any repo file read, issue body read, or other operation.
 * If you cannot determine your agent_id, call `agent_bootstrap_list_agents` first.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { z } = require("zod");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { REQUIRED_AGENT_IDS } = require("./agent-ids.js");

// Resolve repo root: two levels up from mcp-servers/agent-bootstrap/
const REPO_ROOT = path.resolve(__dirname, "..", "..");

const AGENTS_DIR = path.join(REPO_ROOT, ".github", "agents");

// Dynamically discover all agent contracts at startup — no manual update needed when agents are added
// Safe fallback: if the directory is unreadable, server still starts (tool returns empty valid IDs list)
let AGENT_CONTRACT_PATHS = {};
try {
  AGENT_CONTRACT_PATHS = fs
    .readdirSync(AGENTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .reduce((map, filename) => {
      const agentId = filename.replace(/\.md$/, "");
      map[agentId] = `.github/agents/${filename}`;
      return map;
    }, {});
} catch (err) {
  process.stderr.write(
    `agent-bootstrap: WARNING — could not scan ${AGENTS_DIR}: ${err.message}\n`
  );
}

const VALID_AGENT_IDS = Object.keys(AGENT_CONTRACT_PATHS).join(", ");

// Warn at startup if any required agent contracts are missing from the discovered set.
const missingRequired = REQUIRED_AGENT_IDS.filter((id) => !AGENT_CONTRACT_PATHS[id]);
if (missingRequired.length > 0) {
  process.stderr.write(
    `agent-bootstrap: WARNING — required agent contract(s) not found: ${missingRequired.join(", ")}\n`
  );
}

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
  "Pass agent_id=\"list\" to return all valid agent IDs without loading a contract " +
  "(use this when you cannot determine your identity).\n\n" +
  "Valid agent IDs: " + VALID_AGENT_IDS,
  {
    agent_id: z
      .string()
      .describe(
        `Your agent identity. Must be one of the ${Object.keys(AGENT_CONTRACT_PATHS).length} governed agent IDs listed in ` +
        ".github/copilot-instructions.md. Determine this from the issue assignee, " +
        "issue title, or explicit instruction before calling this tool. " +
        "Pass agent_id=\"list\" to retrieve all valid agent IDs if you cannot determine your identity."
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
              "explicit task instruction, then call agent_bootstrap again with your agent_id.\n\n" +
              "If you cannot determine your identity, use discovery mode: " +
              "call agent_bootstrap(agent_id: \"list\") or agent_bootstrap_list_agents — " +
              "these return all valid IDs so you can identify yourself. " +
              "NOTE: \"list\" is a discovery mode, not a valid agent_id.\n\n" +
              "Valid agent IDs: " + VALID_AGENT_IDS,
          },
        ],
        isError: true,
      };
    }

    // Special discovery mode: return the list of valid agent IDs without loading a contract.
    if (agentId === "list") {
      return {
        content: [
          {
            type: "text",
            text:
              "NOTE: \"list\" is a special discovery mode, not an agent_id. " +
              "Do NOT use \"list\" as your identity.\n\n" +
              "# Governed agent IDs\n\n" +
              "Identify which of these you are, then call " +
              "agent_bootstrap(agent_id: \"<your-id>\") immediately:\n\n" +
              Object.keys(AGENT_CONTRACT_PATHS)
                .sort()
                .map((id) => `- ${id}`)
                .join("\n"),
          },
        ],
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
              "Use discovery mode to see valid IDs: call agent_bootstrap(agent_id: \"list\") " +
              "or agent_bootstrap_list_agents. " +
              "NOTE: \"list\" is a discovery mode, not a valid agent_id.\n\n" +
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

// Second tool: convenience listing of all valid governed agent IDs.
// Useful when agent identity cannot be determined before the first tool call.
server.tool(
  "agent_bootstrap_list_agents",
  "Returns the list of all valid governed agent IDs registered in this repository. " +
  "Call this tool if you cannot determine your agent_id before calling agent_bootstrap. " +
  "NOTE: this is a discovery tool only — do NOT use a returned ID as \"list\"; " +
  "once you identify yourself, call agent_bootstrap(agent_id: \"<your-id>\") immediately.",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text:
            "NOTE: \"list\" is a special discovery mode, not an agent_id. " +
            "Do NOT use \"list\" as your identity.\n\n" +
            "# Governed agent IDs\n\n" +
            "Identify which of these you are, then call " +
            "agent_bootstrap(agent_id: \"<your-id>\") immediately:\n\n" +
            Object.keys(AGENT_CONTRACT_PATHS)
              .sort()
              .map((id) => `- ${id}`)
              .join("\n"),
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
