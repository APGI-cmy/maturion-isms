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
const { REQUIRED_AGENT_IDS } = require("./agent-ids.js");

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
    const missing  = REQUIRED_AGENT_IDS.filter((id) => !agentIds.includes(id));
    if (missing.length > 0) {
      throw new Error(`required agent contract(s) missing: ${missing.join(", ")}`);
    }
    ok("all required governed agent IDs present");
  } catch (e) {
    fail("required governed agent IDs present", e);
  }

  // ── 5. MCP server boot check ───────────────────────────────────────────────
  // Spawn the server as a child process and confirm it does not crash within
  // BOOT_WAIT_MS.  Then send SIGTERM and verify the process exits cleanly
  // within TERM_WAIT_MS to prevent CI hangs.
  console.log("\n5. Server boot check");
  await new Promise((resolve) => {
    const BOOT_WAIT_MS = 1000;
    const TERM_WAIT_MS = 3000;
    const child = spawn(process.execPath, ["index.js"], {
      cwd:   __dirname,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let exited = false;
    let exitCode = null;
    let exitSignal = null;

    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });
    child.on("exit", (code, signal) => {
      exited    = true;
      exitCode  = code;
      exitSignal = signal;
    });

    // Register error handler before starting the timer to avoid missed errors.
    child.on("error", (err) => {
      clearTimeout(bootTimer);
      fail("server boot check FAIL (spawn error)", err);
      resolve();
    });

    const bootTimer = setTimeout(() => {
      if (exited) {
        fail(
          "server boot check FAIL (server must survive 1 s without crashing)",
          new Error(
            `server exited early.\nstdout: ${stdout || "(none)"}\nstderr: ${stderr || "(none)"}`
          )
        );
        resolve();
        return;
      }

      // Still running after BOOT_WAIT_MS — boot successful, now terminate.
      console.log(`  server PID: ${child.pid}`);
      ok(`server boot check PASS (survived ${BOOT_WAIT_MS} ms without crashing)`);

      try { child.kill("SIGTERM"); } catch (_) { /* already gone — fine */ }

      // Verify the process exits cleanly within TERM_WAIT_MS.
      const termTimer = setTimeout(() => {
        fail(
          "server SIGTERM check FAIL (process did not terminate within timeout)",
          new Error(`PID ${child.pid} still alive after ${TERM_WAIT_MS} ms`)
        );
        try { child.kill("SIGKILL"); } catch (_) {}
        resolve();
      }, TERM_WAIT_MS);

      // If already exited by the time we reach here, fire immediately.
      if (exited) {
        clearTimeout(termTimer);
        if (exitSignal === "SIGTERM" || exitCode === 0) {
          ok(`server SIGTERM check PASS (code=${exitCode} signal=${exitSignal})`);
        } else {
          fail(
            "server SIGTERM check FAIL (non-clean exit)",
            new Error(`exit code=${exitCode} signal=${exitSignal}`)
          );
        }
        resolve();
        return;
      }

      child.once("exit", (code, signal) => {
        clearTimeout(termTimer);
        if (signal === "SIGTERM" || code === 0) {
          ok(`server SIGTERM check PASS (code=${code} signal=${signal})`);
        } else {
          fail(
            "server SIGTERM check FAIL (non-clean exit)",
            new Error(`exit code=${code} signal=${signal}`)
          );
        }
        resolve();
      });
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
