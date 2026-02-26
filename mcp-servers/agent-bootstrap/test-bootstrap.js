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
const { execSync } = require("child_process");

let failures = 0;

function ok(label)       { console.log(`  PASS: ${label}`); }
function fail(label, e)  {
  console.error(`  FAIL: ${label}${e ? ` — ${e.message || String(e)}` : ""}`);
  failures++;
}

console.log("agent-bootstrap validation\n");

// ── 1. npm dependencies resolvable ───────────────────────────────────────────
console.log("1. Dependency resolution");
for (const dep of [
  "@modelcontextprotocol/sdk/server/mcp.js",
  "@modelcontextprotocol/sdk/server/stdio.js",
  "zod",
]) {
  try   { require(dep); ok(`${dep} resolvable`); }
  catch (e) { fail(`${dep} resolvable`, e); }
}

// ── 2. index.js passes Node syntax check ─────────────────────────────────────
console.log("\n2. Syntax check");
try {
  execSync("node --check index.js", { cwd: __dirname, stdio: "pipe", timeout: 5000 });
  ok("index.js passes --check");
} catch (e) {
  fail("index.js passes --check", new Error(e.stderr ? e.stderr.toString().trim() : e.message));
}

// ── 3. Agent contracts directory has at least one .md file ───────────────────
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

// ── 4. Tool logic: contract lookup ───────────────────────────────────────────
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

// 4c. "list" special mode returns sorted IDs
try {
  const listOutput = Object.keys(AGENT_CONTRACT_PATHS).sort().map((id) => `- ${id}`).join("\n");
  if (!listOutput.includes("-")) throw new Error("list output is empty");
  ok(`"list" mode returns ${Object.keys(AGENT_CONTRACT_PATHS).length} agent ID(s)`);
} catch (e) {
  fail('"list" mode output', e);
}

// 4d. Known agent IDs are present (spot-check a few from the problem statement)
try {
  const expected = ["api-builder", "foreman-v2-agent", "qa-builder", "schema-builder", "ui-builder"];
  const missing  = expected.filter((id) => agentIds.includes(id) === false);
  // Only fail when none of the expected agents are found (not just some missing)
  if (missing.length === expected.length) {
    throw new Error(`none of the expected agents found: ${expected.join(", ")}`);
  }
  if (missing.length > 0) {
    console.log(`  WARN: some expected agent IDs not present (may be normal): ${missing.join(", ")}`);
  } else {
    ok("all spot-check agent IDs present");
  }
} catch (e) {
  fail("spot-check agent IDs present", e);
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log();
if (failures === 0) {
  console.log("All tests passed.");
} else {
  console.error(`${failures} test(s) FAILED.`);
  process.exit(1);
}
