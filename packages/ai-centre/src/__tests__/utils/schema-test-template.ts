/**
 * Schema Test Template Utility
 *
 * Wave 9.1-FU — Gap 3: Schema Test Template Utility
 *
 * Provides reusable helper functions for asserting SQL migration structure
 * in vitest test suites. All assertion functions call vitest `expect()`
 * internally so failures surface as proper test failures.
 *
 * Exports:
 *   readMigrationSQL    — reads a migration file and returns its content
 *   assertColumn        — asserts a column definition is present in SQL
 *   assertIndex         — asserts an index definition is present in SQL
 *   assertCheckConstraint — asserts a CHECK constraint is present with given values
 */

import { expect } from 'vitest';
import * as fs from 'fs';

// ---------------------------------------------------------------------------
// readMigrationSQL
// ---------------------------------------------------------------------------

/**
 * Read a SQL migration file and return its contents as a string.
 *
 * @param migrationPath  Absolute or relative path to the migration file.
 * @returns              The file contents as a UTF-8 string.
 * @throws               If the file does not exist or cannot be read.
 */
export function readMigrationSQL(migrationPath: string): string {
  return fs.readFileSync(migrationPath, 'utf-8');
}

// ---------------------------------------------------------------------------
// assertColumn
// ---------------------------------------------------------------------------

/**
 * Assert that a column with the given name and data type appears in the SQL.
 *
 * Optionally assert NOT NULL or nullable (no NOT NULL) on the column line.
 *
 * @param sql         The SQL string to search.
 * @param columnName  The column name to look for.
 * @param dataType    The expected data type (e.g. 'TEXT', 'TIMESTAMPTZ').
 * @param options     Optional modifiers:
 *                      { notNull: true }  — column must have NOT NULL constraint
 *                      { nullable: true } — column must NOT have NOT NULL constraint
 */
export function assertColumn(
  sql: string,
  columnName: string,
  dataType: string,
  options?: { notNull?: boolean; nullable?: boolean },
): void {
  // Escape the column name and data type for use in a RegExp
  const escapedName = columnName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedType = dataType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Basic check: column name followed by data type (possibly with whitespace in between)
  const basicPattern = new RegExp(`\\b${escapedName}\\b\\s+${escapedType}\\b`, 'i');
  expect(
    sql,
    `Column '${columnName}' with data type '${dataType}' not found in SQL`,
  ).toMatch(basicPattern);

  if (options?.notNull === true) {
    // Column definition line must contain NOT NULL after the data type
    const notNullPattern = new RegExp(
      `\\b${escapedName}\\b\\s+${escapedType}\\b[^,)\\n]*NOT\\s+NULL`,
      'i',
    );
    expect(
      sql,
      `Column '${columnName}' with type '${dataType}' must have NOT NULL constraint`,
    ).toMatch(notNullPattern);
  }

  if (options?.nullable === true) {
    // Find the line(s) containing this column name and verify NOT NULL is absent.
    // Exclude SQL comment lines (-- ...) to avoid false matches in comments.
    const lines = sql.split('\n').filter((line) => !line.trim().startsWith('--'));
    const columnLine = lines.find((line) =>
      new RegExp(`\\b${escapedName}\\b`, 'i').test(line),
    );
    expect(
      columnLine,
      `Column '${columnName}' should be nullable (no NOT NULL constraint on its definition line)`,
    ).not.toMatch(/NOT\s+NULL/i);
  }
}

// ---------------------------------------------------------------------------
// assertIndex
// ---------------------------------------------------------------------------

/**
 * Assert that a named index appears in the SQL.
 *
 * Optionally assert whether the index is partial (has a WHERE clause) or not.
 *
 * @param sql        The SQL string to search.
 * @param indexName  The index name to look for.
 * @param options    Optional modifiers:
 *                     { partial: true }  — index must have a WHERE clause
 *                     { partial: false } — index must NOT have a WHERE clause
 */
export function assertIndex(
  sql: string,
  indexName: string,
  options?: { partial?: boolean },
): void {
  const escapedName = indexName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Index must exist in the SQL
  const indexPattern = new RegExp(`\\b${escapedName}\\b`, 'i');
  expect(sql, `Index '${indexName}' not found in SQL`).toMatch(indexPattern);

  if (options?.partial !== undefined) {
    const lines = sql.split('\n');
    // Locate the specific line(s) containing this index name.
    // Skip SQL comment lines (-- ...) to avoid false semicolon matches in comments.
    const nonCommentLines = lines.filter((line) => !line.trim().startsWith('--'));
    const startIdx = nonCommentLines.findIndex((line) =>
      new RegExp(`\\b${escapedName}\\b`, 'i').test(line),
    );

    let indexDefinition = '';
    if (startIdx !== -1) {
      for (let i = startIdx; i < nonCommentLines.length; i++) {
        indexDefinition += nonCommentLines[i];
        if (nonCommentLines[i].includes(';')) break;
      }
    }

    if (options.partial === true) {
      expect(
        indexDefinition,
        `Index '${indexName}' must be a partial index (must contain a WHERE clause)`,
      ).toMatch(/WHERE/i);
    } else {
      expect(
        indexDefinition,
        `Index '${indexName}' must NOT be a partial index (must not contain a WHERE clause)`,
      ).not.toMatch(/WHERE/i);
    }
  }
}

// ---------------------------------------------------------------------------
// assertCheckConstraint
// ---------------------------------------------------------------------------

/**
 * Assert that a CHECK constraint exists on the named column and that
 * all `allowedValues` appear within that constraint.
 *
 * @param sql           The SQL string to search.
 * @param columnName    The column whose CHECK constraint is verified.
 * @param allowedValues Array of string values that must appear in the constraint.
 */
export function assertCheckConstraint(
  sql: string,
  columnName: string,
  allowedValues: string[],
): void {
  const escapedName = columnName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Verify that a CHECK constraint exists for this column.
  // Accepted patterns:
  //   Inline:       capability TEXT NOT NULL CHECK (capability IN (...))
  //   Table-level:  CONSTRAINT capability_check CHECK (capability IN (...))
  //   ALTER TABLE:  ALTER TABLE ... ADD CONSTRAINT ... CHECK (capability IN (...))
  const hasInlineCheck = new RegExp(`\\b${escapedName}\\b[^;]*CHECK\\s*\\(`, 'is').test(sql);
  const hasTableLevelCheck = new RegExp(
    `CONSTRAINT\\s+\\w+\\s+CHECK\\s*\\([^)]*\\b${escapedName}\\b`,
    'is',
  ).test(sql);
  const hasAlterTableCheck = new RegExp(
    `ALTER\\s+TABLE[^;]*ADD\\s+CONSTRAINT[^;]*CHECK\\s*\\([^)]*\\b${escapedName}\\b`,
    'is',
  ).test(sql);

  expect(
    hasInlineCheck || hasTableLevelCheck || hasAlterTableCheck,
    `No CHECK constraint found for column '${columnName}' in SQL`,
  ).toBe(true);

  // Extract the CHECK constraint block for this column so we validate values
  // within the constraint context rather than against the entire SQL string.
  // This avoids false positives from values that appear in comments or other
  // unrelated parts of the SQL.
  //
  // Strategy: find the segment from where `columnName` appears through the
  // matching CHECK (...) clause.  We walk forward from the `CHECK (` marker,
  // counting parentheses, to capture the full IN-list even when it spans lines.
  const checkStartMatch = sql.match(
    new RegExp(`\\b${escapedName}\\b[^;]*?(CHECK\\s*\\()`, 'is'),
  );

  let checkBlock = sql; // fallback to full SQL if extraction fails
  if (checkStartMatch?.index !== undefined) {
    const checkOpenIdx = sql.indexOf('(', sql.indexOf('CHECK', checkStartMatch.index + checkStartMatch[0].length - checkStartMatch[1].length));
    if (checkOpenIdx !== -1) {
      let depth = 0;
      let closeIdx = checkOpenIdx;
      for (let i = checkOpenIdx; i < sql.length; i++) {
        if (sql[i] === '(') depth++;
        else if (sql[i] === ')') {
          depth--;
          if (depth === 0) { closeIdx = i; break; }
        }
      }
      checkBlock = sql.slice(checkStartMatch.index, closeIdx + 1);
    }
  }

  // Verify each required value appears within the CHECK constraint block
  for (const value of allowedValues) {
    expect(
      checkBlock,
      `CHECK constraint for column '${columnName}' must include value '${value}'`,
    ).toContain(`'${value}'`);
  }
}
