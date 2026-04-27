#!/usr/bin/env python3
"""
verify-schema-via-api.py — Verify required DB tables exist via Supabase Management API.

Replaces direct psql-based schema verification (which fails from GitHub-hosted runners
due to network reachability issues with db.<project>.supabase.co:5432). Uses HTTPS to
the Supabase Management API endpoint instead.

Usage:
    python3 .github/scripts/verify-schema-via-api.py \
        --required-tables audits audit_logs criteria mps domains evidence \
        [--warn-tables evidence_submissions]

Required environment variables:
    SUPABASE_ACCESS_TOKEN   — Supabase Management API personal access token
    SUPABASE_PROJECT_REF    — Supabase project reference ID

Exit codes:
    0 — all required tables verified present
    1 — one or more required tables missing or required env vars unset
"""
import argparse
import json
import os
import subprocess
import sys


def supabase_query(api_url: str, access_token: str, sql: str, step: str = "SQL"):
    """Execute SQL via Supabase Management API.

    Returns the parsed JSON response list on success.
    Prints a GitHub Actions error annotation and calls sys.exit(1) on failure.
    """
    body = json.dumps({"query": sql})
    result = subprocess.run(
        [
            "curl", "-sS", "-w", "\n%{http_code}",
            "-X", "POST", api_url,
            "-H", f"Authorization: Bearer {access_token}",
            "-H", "Content-Type: application/json",
            "-d", body,
        ],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        stderr_msg = result.stderr.strip()
        print(
            f"::error::curl exited with code {result.returncode} for {step}"
            + (f": {stderr_msg}" if stderr_msg else ""),
            file=sys.stderr,
        )
        sys.exit(1)

    lines = result.stdout.rsplit("\n", 1)
    http_code = lines[-1].strip() if len(lines) > 1 else "000"
    response_body = lines[0].strip() if lines else ""

    if http_code not in {"200", "201", "204"}:
        print(
            f"::error::Management API connection or query error for {step} — "
            f"check SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF "
            f"(HTTP {http_code}): {response_body}",
            file=sys.stderr,
        )
        sys.exit(1)

    # HTTP 204 No Content — success with no body; return empty result list.
    if http_code == "204":
        return []

    try:
        parsed = json.loads(response_body)
    except json.JSONDecodeError as exc:
        print(
            f"::error::Failed to parse Management API response for {step}: {exc}",
            file=sys.stderr,
        )
        sys.exit(1)

    if isinstance(parsed, dict) and ("message" in parsed or "error" in parsed):
        msg = parsed.get("message", parsed.get("error", "unknown error"))
        print(f"::error::Query error for {step}: {msg}", file=sys.stderr)
        sys.exit(1)

    return parsed


def get_count(result) -> str:
    """Extract scalar COUNT value from a Management API query result."""
    if isinstance(result, list) and result:
        row = result[0]
        val = list(row.values())[0] if isinstance(row, dict) else row[0]
        return str(val)
    return "0"


def _validate_table_name(table_name: str) -> None:
    """Validate that table_name contains only safe SQL identifier characters."""
    import re
    if not re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", table_name):
        print(
            f"::error::Invalid table name '{table_name}' — "
            "must be a valid SQL identifier (alphanumeric and underscores only).",
            file=sys.stderr,
        )
        sys.exit(1)


def check_table_exists(api_url: str, access_token: str, table_name: str) -> bool:
    """Return True if public.<table_name> exists in the Supabase schema."""
    _validate_table_name(table_name)
    result = supabase_query(
        api_url,
        access_token,
        f"SELECT COUNT(*)::text AS count FROM information_schema.tables "
        f"WHERE table_schema='public' AND table_name='{table_name}';",
        f"table public.{table_name}",
    )
    return get_count(result) == "1"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--required-tables",
        nargs="+",
        default=["audits", "audit_logs", "criteria", "mps", "domains", "evidence"],
        help="Tables that MUST exist (hard failure if absent). "
             "Includes public.audits, public.audit_logs, public.criteria, "
             "public.mps, public.domains, public.evidence by default.",
    )
    parser.add_argument(
        "--warn-tables",
        nargs="*",
        default=["evidence_submissions"],
        help="Tables that SHOULD exist (warning only if absent).",
    )
    args = parser.parse_args()

    access_token = os.environ.get("SUPABASE_ACCESS_TOKEN", "")
    project_ref = os.environ.get("SUPABASE_PROJECT_REF", "")

    if not access_token:
        print(
            "::error::SUPABASE_ACCESS_TOKEN environment variable is not set.",
            file=sys.stderr,
        )
        sys.exit(1)
    if not project_ref:
        print(
            "::error::SUPABASE_PROJECT_REF environment variable is not set.",
            file=sys.stderr,
        )
        sys.exit(1)

    api_url = f"https://api.supabase.com/v1/projects/{project_ref}/database/query"

    failed_tables: list[str] = []

    print("--- Checking REQUIRED tables (FAIL on absence) ---")
    for table in args.required_tables:
        try:
            exists = check_table_exists(api_url, access_token, table)
        except SystemExit:
            print(
                f"::error::Management API query failed for public.{table}",
                file=sys.stderr,
            )
            failed_tables.append(f"public.{table}")
            continue

        if exists:
            print(f"PASS: public.{table} verified")
        else:
            print(f"FAIL: public.{table} not found in schema")
            failed_tables.append(f"public.{table}")

    print("--- Checking WARN tables (non-blocking) ---")
    for table in (args.warn_tables or []):
        try:
            exists = check_table_exists(api_url, access_token, table)
        except SystemExit:
            print(f"::warning::Query failed for public.{table} — check secrets")
            continue

        if exists:
            print(f"PASS: public.{table} verified")
        else:
            print(f"WARN: public.{table} not found in schema (non-blocking)")

    if failed_tables:
        print(
            f"::error::schema-verification FAILED — missing required tables: "
            f"{' '.join(failed_tables)}",
            file=sys.stderr,
        )
        sys.exit(1)

    print("PASS: All required schema objects verified")


if __name__ == "__main__":
    main()
