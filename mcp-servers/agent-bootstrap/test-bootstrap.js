#!/usr/bin/env node
/**
 * agent-bootstrap validation script.
 *
 * Validates that the MCP server can start and that basic tool invocation
 * behavior is correct. Exits 0 on success, 1 on any failure.
 *
 * Usage:
 *   node mcp-servers/agent-bootstrap/test-bootstrap.js
 *   npm test  (from inside mcp-servers/agent-bootstrap/)
 */

"use strict";

const fs   = require("fs");
const path = require("path");
const { execSync, spawn } = require("child_process");

let failures = 0;

function ok(label)      { console.log(`  PASS: ${label}`); }
function fail(label, e) {
  console.error(`  FAIL: ${label}${e ? ` — ${e.message || String(e)}` : ""}`);
  failures++;
}

async function main() {
  console.log("agent-bootstrap validation\n");

  // ── 1. npm dependencies resolvable ─────────────────────────────────────────
  console.log("1. Dependency resolution");
  for (const dep of [
    "@modelcontextprotocol/sdk/server/mcp.js",
    "@modelcontextprotocol/sdk/server/stdio.js",
    "zod",
  ]) {
    try   { require(dep); ok(`${dep} resolvable`); }
    catch (e) { fail(`${dep} resolvable`, e); }
  }

  // ── 2. index.js passes Node syntax check ───────────────────────────────────
  console.log("\n2. Syntax check");
  try {
    execSync("node --check index.js", { cwd: __dirname, stdio: "pipe", timeout: 5000 });
    ok("index.js passes --check");
  } catch (e) {
    fail("index.js passes --check", new Error(e.stderr ? e.stderr.toString().trim() : e.message));
  }

  // ── 3. Agent contracts directory has at least one .md file ─────────────────
  console.log("\n3. Agent contracts directory");
  const REPO_ROOT  = path.resolve(__dirname, "..", "..");
  const AGENTS_DIR = path.join(REPO_ROOT, ".github", "agents");
  let agentIds = [];

  try {
    agentIds = fs
      .readdirSync(AGENTS_DIR)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
      .map((f) => f.replace(/\.md$/, ""));
    if (agentIds.length === 0) throw new Error("no .md agent files found");
    ok(`${agentIds.length} contract file(s) found`);
  } catch (e) {
    fail("agent contracts directory readable", e);
  }

  // ── 4. Tool logic: contract lookup ─────────────────────────────────────────
  // Replicate the core lookup logic (same as index.js) to verify correctness
  // without spinning up the full MCP server.
  console.log("\n4. Tool invocation logic");

  const AGENT_CONTRACT_PATHS = agentIds.reduce((map, id) => {
    map[id] = `.github/agents/${id}.md`;
    return map;
  }, {});

  // 4a. Valid agent_id returns readable contract
  if (agentIds.length > 0) {
    const sampleId = agentIds[0];
    try {
      const contractPath = path.join(REPO_ROOT, AGENT_CONTRACT_PATHS[sampleId]);
      const content = fs.readFileSync(contractPath, "utf8");
      if (!content || content.length === 0) throw new Error("contract file is empty");
      ok(`contract lookup succeeds for '${sampleId}'`);
    } catch (e) {
      fail(`contract lookup for '${sampleId}'`, e);
    }
  }

  // 4b. Unknown agent_id correctly rejected
  try {
    const unknownHit = AGENT_CONTRACT_PATHS["__non_existent_agent_99__"];
    if (unknownHit) throw new Error("unexpected hit for unknown agent_id");
    ok("unknown agent_id correctly returns undefined");
  } catch (e) {
    fail("unknown agent_id rejection", e);
  }

  // 4c. "list" discovery mode returns sorted IDs
  try {
    const listOutput = Object.keys(AGENT_CONTRACT_PATHS).sort().map((id) => `- ${id}`).join("\n");
    if (!listOutput.includes("-")) throw new Error("list output is empty");
    ok(`"list" discovery mode returns ${Object.keys(AGENT_CONTRACT_PATHS).length} agent ID(s)`);
  } catch (e) {
    fail('"list" discovery mode output', e);
  }

  // 4d. Required governed agent IDs present — fail if ANY are missing
  try {
    const expected = ["api-builder", "foreman-v2-agent", "qa-builder", "schema-builder", "ui-builder"];
    const missing  = expected.filter((id) => !agentIds.includes(id));
    if (missing.length > 0) {
      throw new Error(`required agent contract(s) missing: ${missing.join(", ")}`);
    }
    ok("all required governed agent IDs present");
  } catch (e) {
    fail("required governed agent IDs present", e);
  }

  // ── 5. MCP server boot check ───────────────────────────────────────────────
  // Spawn the server as a child process and confirm it does not crash within
  // BOOT_WAIT_MS. Then terminate it cleanly.
  console.log("\n5. Server boot check");
  await new Promise((resolve) => {
    const BOOT_WAIT_MS = 1000;
    const child = spawn(process.execPath, ["index.js"], {
      cwd:   __dirname,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let exited = false;

    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });
    child.on("exit", () => { exited = true; });

    // Register error handler before starting the timer to avoid missed errors.
    child.on("error", (err) => {
      clearTimeout(timer);
      fail("server boot check FAIL (spawn error)", err);
      resolve();
    });

    const timer = setTimeout(() => {
      if (exited) {
        fail(
          "server boot check FAIL (server must survive 1 s without crashing)",
          new Error(
            `server exited early.\nstdout: ${stdout || "(none)"}\nstderr: ${stderr || "(none)"}`
          )
        );
        resolve();
      } else {
        // Still running after BOOT_WAIT_MS — boot successful, kill cleanly.
        // Guard against the unlikely case the process exits between the check above
        // and the kill call; ignore ESRCH (no such process) errors.
        try { child.kill("SIGTERM"); } catch (_) { /* already gone — fine */ }
        ok(`server boot check PASS (survived ${BOOT_WAIT_MS} ms without crashing)`);
        resolve();
      }
    }, BOOT_WAIT_MS);
  });

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log();
  if (failures === 0) {
    console.log("All tests passed.");
  } else {
    console.error(`${failures} test(s) FAILED.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
