#!/usr/bin/env python3
"""
apply-migrations-via-api.py — Apply SQL migration files via Supabase Management API.

Replaces direct psql connectivity (which fails from GitHub-hosted runners due to
network reachability of db.<project>.supabase.co:5432). Uses HTTPS to the Supabase
Management API endpoint instead, which is accessible from any GitHub-hosted runner.

Usage:
    python3 .github/scripts/apply-migrations-via-api.py \
        --migrations-dir <path> \
        --tracking-table <table_name> \
        [--seed-entry <filename>]

Required environment variables:
    SUPABASE_ACCESS_TOKEN   — Supabase Management API personal access token
    SUPABASE_PROJECT_REF    — Supabase project reference ID

Exit codes:
    0 — all migrations applied (or already applied)
    1 — one or more migrations failed or required env vars missing
"""
import argparse
import json
import os
import pathlib
import subprocess
import sys


def supabase_exec(api_url: str, access_token: str, sql: str, step: str = "SQL"):
    """Execute SQL via Supabase Management API.

    Returns the parsed JSON response list on success.
    Prints a GitHub Actions error annotation and calls sys.exit(1) on failure.
    """
    body = json.dumps({"query": sql})
    result = subprocess.run(
        [
            "curl", "-s", "-w", "\n%{http_code}",
            "-X", "POST", api_url,
            "-H", f"Authorization: Bearer {access_token}",
            "-H", "Content-Type: application/json",
            "-d", body,
        ],
        capture_output=True,
        text=True,
    )
    lines = result.stdout.rsplit("\n", 1)
    http_code = lines[-1].strip() if len(lines) > 1 else "000"
    response_body = lines[0].strip() if lines else ""

    if http_code not in {"200", "201", "204"}:
        print(
            f"::error::Management API request failed (HTTP {http_code}) in step "
            f"'{step}': {response_body}",
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
            f"::error::Failed to parse Management API response in step '{step}': {exc}",
            file=sys.stderr,
        )
        sys.exit(1)

    if isinstance(parsed, dict) and ("message" in parsed or "error" in parsed):
        msg = parsed.get("message", parsed.get("error", "unknown error"))
        print(f"::error::SQL error in step '{step}': {msg}", file=sys.stderr)
        sys.exit(1)

    return parsed


def _escape_sql_string(value: str) -> str:
    """Escape a string value for safe use in a SQL single-quoted literal."""
    return value.replace("'", "''")


def _validate_identifier(value: str, label: str) -> None:
    """Validate that a value contains only safe identifier/filename characters."""
    import re
    if not re.match(r"^[A-Za-z0-9_\-\.]+$", value):
        print(
            f"::error::Invalid {label} value '{value}' — "
            f"must contain only alphanumeric characters, hyphens, underscores, or dots.",
            file=sys.stderr,
        )
        sys.exit(1)


def get_count(result) -> str:
    """Extract the count value from a Management API query result."""
    if isinstance(result, list) and result:
        row = result[0]
        val = list(row.values())[0] if isinstance(row, dict) else row[0]
        return str(val)
    return "0"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--migrations-dir", required=True, help="Path to SQL migrations directory")
    parser.add_argument("--tracking-table", required=True, help="Idempotency tracking table name")
    parser.add_argument(
        "--seed-entry",
        default=None,
        help="Optional seed migration filename to pre-populate in tracking table",
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
    tracking_table = args.tracking_table

    # Validate tracking table name (used as identifier, not a value)
    import re
    if not re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", tracking_table):
        print(
            f"::error::Invalid tracking_table name '{tracking_table}' — "
            "must be a valid SQL identifier (alphanumeric and underscores only).",
            file=sys.stderr,
        )
        sys.exit(1)

    # Validate migrations directory exists before making any API calls
    migrations_dir = pathlib.Path(args.migrations_dir)
    if not migrations_dir.exists() or not migrations_dir.is_dir():
        print(
            f"::error::Migrations directory does not exist or is not a directory: {migrations_dir}",
            file=sys.stderr,
        )
        sys.exit(1)

    # Create idempotency tracking table
    supabase_exec(
        api_url,
        access_token,
        f"CREATE TABLE IF NOT EXISTS {tracking_table} "
        f"(name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now());",
        f"create {tracking_table}",
    )

    # Optionally seed a required entry (for pre-applied baseline migrations)
    if args.seed_entry:
        _validate_identifier(args.seed_entry, "seed_entry")
        safe_seed = _escape_sql_string(args.seed_entry)
        supabase_exec(
            api_url,
            access_token,
            f"INSERT INTO {tracking_table} (name) VALUES ('{safe_seed}') "
            f"ON CONFLICT DO NOTHING;",
            f"seed {tracking_table}",
        )

    # Collect and sort migration files
    migration_files = sorted(migrations_dir.glob("*.sql"))

    if not migration_files:
        print(f"No .sql files found in {migrations_dir} — nothing to apply.")
        return

    failed_migration = None

    for filepath in migration_files:
        name = filepath.name
        _validate_identifier(name, "migration filename")
        safe_name = _escape_sql_string(name)

        # Check if already applied
        result = supabase_exec(
            api_url,
            access_token,
            f"SELECT COUNT(*)::text AS count FROM {tracking_table} "
            f"WHERE name = '{safe_name}';",
            f"check {name}",
        )
        count = get_count(result)

        if count != "0":
            print(f"Skipping {filepath.name} (already applied)")
            continue

        print(f"Applying {filepath} ...")
        sql_content = filepath.read_text(encoding="utf-8")

        try:
            supabase_exec(api_url, access_token, sql_content, f"apply {name}")
        except SystemExit:
            print(
                f"::error file={filepath}::Migration FAILED: {filepath} "
                f"— see Management API error above",
                file=sys.stderr,
            )
            failed_migration = str(filepath)
            break

        supabase_exec(
            api_url,
            access_token,
            f"INSERT INTO {tracking_table} (name) VALUES ('{safe_name}') "
            f"ON CONFLICT DO NOTHING;",
            f"record {name}",
        )
        print(f"Applied {filepath.name} successfully")

    if failed_migration:
        print(
            f"::error::Migration run FAILED at: {failed_migration}",
            file=sys.stderr,
        )
        sys.exit(1)

    print("All migrations applied (or already applied) successfully.")


if __name__ == "__main__":
    main()
