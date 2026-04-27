#!/usr/bin/env bash
# supabase-mgmt-api.sh — Helper functions for the Supabase Management API
#
# Source this script after setting the following environment variables:
#   SBAPI              — full URL: https://api.supabase.com/v1/projects/{ref}/database/query
#   SUPABASE_ACCESS_TOKEN — Supabase personal access token
#
# Requires: curl, jq (both available on ubuntu-latest GitHub-hosted runners)

# Execute an inline SQL string via the Supabase Management API.
# Prints the JSON response body on success; prints ::error:: to stderr on failure.
# Returns 0 on HTTP 200, non-zero otherwise.
sb_sql() {
  local sql="$1"
  local tmpfile
  tmpfile=$(mktemp)
  local http_code
  http_code=$(curl -sS -o "$tmpfile" -w '%{http_code}' \
    -X POST "$SBAPI" \
    -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    --data-binary "$(jq -n --arg q "$sql" '{"query": $q}')")
  local body
  body=$(cat "$tmpfile")
  rm -f "$tmpfile"
  if [ "$http_code" != "200" ]; then
    echo "::error::Supabase Management API error (HTTP $http_code): $body" >&2
    return 1
  fi
  printf '%s' "$body"
}

# Execute a SQL file via the Supabase Management API.
# Prints the JSON response body on success; prints ::error:: to stderr on failure.
# Returns 0 on HTTP 200, non-zero otherwise.
sb_sql_file() {
  local file="$1"
  local tmpfile
  tmpfile=$(mktemp)
  local http_code
  http_code=$(curl -sS -o "$tmpfile" -w '%{http_code}' \
    -X POST "$SBAPI" \
    -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    --data-binary "$(jq -n --rawfile q "$file" '{"query": $q}')")
  local body
  body=$(cat "$tmpfile")
  rm -f "$tmpfile"
  if [ "$http_code" != "200" ]; then
    echo "::error::Supabase Management API error (HTTP $http_code): $body" >&2
    return 1
  fi
  printf '%s' "$body"
}

# Escape a value for safe embedding in a PostgreSQL SQL string literal.
# Replaces each single quote (') with two single quotes ('') per SQL standard.
sql_escape() {
  printf '%s' "$1" | sed "s/'/''/g"
}
