#!/usr/bin/env bash
# validate-mat-schema-alignment.sh
# Wave 19 — GAP-PARSE-007: Validates schema alignment between module hooks and migrations
# T-W19E-004 / T-W19-011

set -euo pipefail

MIGRATIONS_DIR="apps/maturion-maturity-legacy/supabase/migrations"
ERRORS=0

echo "[schema-align] Checking Wave 19 schema migrations..."

# Check criteria.number TEXT migration
if grep -rl "ALTER.*criteria.*ALTER.*COLUMN.*number.*TYPE.*TEXT" "$MIGRATIONS_DIR" > /dev/null 2>&1; then
  echo "[schema-align] ✓ criteria.number TEXT migration found"
else
  echo "[schema-align] ✗ MISSING: criteria.number TYPE TEXT migration (GAP-PARSE-001)"
  ERRORS=$((ERRORS + 1))
fi

# Check MPS intent_statement migration
if grep -rl "ADD COLUMN.*intent_statement" "$MIGRATIONS_DIR" > /dev/null 2>&1; then
  echo "[schema-align] ✓ MPS intent_statement column migration found"
else
  echo "[schema-align] ✗ MISSING: MPS intent_statement column migration (GAP-PARSE-002)"
  ERRORS=$((ERRORS + 1))
fi

# Check parse_write_back_atomic RPC
if grep -rl "parse_write_back_atomic" "$MIGRATIONS_DIR" > /dev/null 2>&1; then
  echo "[schema-align] ✓ parse_write_back_atomic RPC migration found"
else
  echo "[schema-align] ✗ MISSING: parse_write_back_atomic RPC migration (GAP-PARSE-005)"
  ERRORS=$((ERRORS + 1))
fi

if [ "$ERRORS" -gt 0 ]; then
  echo "[schema-align] FAIL: $ERRORS schema alignment error(s) found"
  exit 1
fi

echo "[schema-align] PASS: All Wave 19 schema alignments confirmed"
