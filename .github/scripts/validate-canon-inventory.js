#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { TextDecoder } = require('util');

function fail(message) {
  throw new Error(message);
}

function isSha256(value) {
  return typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value) && !/^0{64}$/i.test(value);
}

function resolveDeclaredPath(root, declaredPath) {
  if (typeof declaredPath !== 'string' || !declaredPath.trim()) {
    fail('inventory entry has a missing or invalid declared path');
  }
  if (path.isAbsolute(declaredPath) || declaredPath.split(/[\\/]+/).includes('..')) {
    fail(`inventory entry path is not repository-relative: ${declaredPath}`);
  }

  const rootRealPath = fs.realpathSync(root);
  const candidate = path.resolve(rootRealPath, declaredPath);
  if (candidate !== rootRealPath && !candidate.startsWith(`${rootRealPath}${path.sep}`)) {
    fail(`inventory entry path escapes repository root: ${declaredPath}`);
  }
  if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
    fail(`declared canon path is missing or not a file: ${declaredPath}`);
  }

  const realCandidate = fs.realpathSync(candidate);
  if (realCandidate !== rootRealPath && !realCandidate.startsWith(`${rootRealPath}${path.sep}`)) {
    fail(`declared canon path resolves outside repository root: ${declaredPath}`);
  }
  return realCandidate;
}

function normalizeLfUtf8(buffer, declaredPath) {
  if (
    buffer.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))
    || buffer.subarray(0, 2).equals(Buffer.from([0xff, 0xfe]))
    || buffer.subarray(0, 2).equals(Buffer.from([0xfe, 0xff]))
    || buffer.includes(0)
  ) {
    fail(`unsupported encoding for declared canon path: ${declaredPath}`);
  }

  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(buffer);
  } catch {
    fail(`unsupported encoding for declared canon path: ${declaredPath}`);
  }
  return Buffer.from(text.replace(/\r\n?/g, '\n'), 'utf8');
}

function validateInventory(inventory, root) {
  if (!inventory || typeof inventory !== 'object' || Array.isArray(inventory)) {
    fail('CANON_INVENTORY must be a JSON object');
  }
  if (typeof inventory.version !== 'string' || !inventory.version.trim()) {
    fail('CANON_INVENTORY has a missing or invalid version');
  }
  if (!Array.isArray(inventory.canons)) {
    fail('CANON_INVENTORY has a missing or invalid canons array');
  }
  if (
    Object.prototype.hasOwnProperty.call(inventory, 'total_artifacts')
    && (!Number.isInteger(inventory.total_artifacts) || inventory.total_artifacts !== inventory.canons.length)
  ) {
    fail('CANON_INVENTORY total_artifacts does not match canons array length');
  }

  const declaredPaths = new Set();
  for (const [index, entry] of inventory.canons.entries()) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      fail(`CANON_INVENTORY entry ${index} is malformed`);
    }
    if (!isSha256(entry.file_hash_sha256)) {
      fail(`CANON_INVENTORY entry ${index} has a malformed file_hash_sha256`);
    }
    if (declaredPaths.has(entry.path)) {
      fail(`CANON_INVENTORY has a duplicate declared path: ${entry.path}`);
    }
    declaredPaths.add(entry.path);

    const filePath = resolveDeclaredPath(root, entry.path);
    const actualHash = crypto
      .createHash('sha256')
      .update(normalizeLfUtf8(fs.readFileSync(filePath), entry.path))
      .digest('hex');
    if (actualHash.toLowerCase() !== entry.file_hash_sha256.toLowerCase()) {
      fail(`canon content hash mismatch: ${entry.path}`);
    }
  }
  return inventory.canons.length;
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--inventory') args.inventory = argv[++index];
    else if (argv[index] === '--root') args.root = argv[++index];
    else fail(`unsupported argument: ${argv[index]}`);
  }
  if (!args.inventory || !args.root) fail('usage: validate-canon-inventory.js --inventory <path> --root <path>');
  return args;
}

function main(argv) {
  const args = parseArgs(argv);
  let inventory;
  try {
    inventory = JSON.parse(fs.readFileSync(args.inventory, 'utf8'));
  } catch (error) {
    fail(`cannot read valid CANON_INVENTORY JSON: ${error.message}`);
  }
  const count = validateInventory(inventory, args.root);
  console.log(`CANON_INVENTORY LF-normalized UTF-8 hash validation passed (${count} entries).`);
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(`CANON_INVENTORY validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { normalizeLfUtf8, validateInventory };
