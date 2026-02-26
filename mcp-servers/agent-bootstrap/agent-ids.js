"use strict";

/**
 * Required governed agent IDs — single source of truth.
 *
 * Imported by both index.js (startup validation warning) and
 * test-bootstrap.js (test assertion).  Update this list here when
 * a new agent contract becomes mandatory.
 */
const REQUIRED_AGENT_IDS = [
  "api-builder",
  "foreman-v2-agent",
  "qa-builder",
  "schema-builder",
  "ui-builder",
];

module.exports = { REQUIRED_AGENT_IDS };
