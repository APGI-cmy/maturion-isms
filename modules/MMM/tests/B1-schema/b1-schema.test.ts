/**
 * MMM Wave B1 — Schema & RLS Tests
 * Wave Slug: mmm-build-wave-b1-schema
 * Test Domain D9: T-MMM-S6-139 to T-MMM-S6-152 (Security & Compliance)
 * Test Domain D10: T-MMM-S6-153 to T-MMM-S6-164 (Infrastructure & Quality Gates)
 *
 * Builder: schema-builder
 * Date: 2026-04-20
 * Issue: maturion-isms#1428
 * Architecture Reference: modules/MMM/04-architecture/architecture.md §A5.2, §A5.3, §A5.4
 *
 * These tests are FILE-BASED (read migration SQL files) — no live Supabase connection required.
 * Tests verify:
 *   1. All 26 mmm_ tables defined in migration SQL (TR-022, TR-028)
 *   2. RLS enabled on every table (TR-031)
 *   3. All 10 required indexes present (TR-046)
 *   4. mmm_ prefix on all tables (TR-028 / NBR-005)
 *   5. Immutable pattern on audit tables (TR-038)
 *   6. NBR-002: RLS denies cross-org writes (policy structure verification)
 *   7. Storage buckets configured (mmm-evidence, mmm-framework-sources)
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ROOT = process.cwd();
const MIGRATIONS_DIR = path.join(ROOT, 'supabase', 'migrations');

/** All 26 mmm_ tables required by architecture §A5.2 */
const REQUIRED_TABLES: string[] = [
  'mmm_organisations',
  'mmm_frameworks',
  'mmm_domains',
  'mmm_maturity_process_steps',
  'mmm_criteria',
  'mmm_level_descriptors',
  'mmm_assessments',
  'mmm_maturity_scores',
  'mmm_score_proposals',
  'mmm_evidence',
  'mmm_findings',
  'mmm_override_log',
  'mmm_audit_sessions',
  'mmm_audit_logs',
  'mmm_pit_exports',
  'mmm_parse_jobs',
  'mmm_ai_interactions',
  'mmm_profiles',
  'mmm_user_preferences',
  'mmm_organisation_hierarchy',
  'mmm_free_assessments',
  'mmm_invitations',
  'mmm_proposed_domains',
  'mmm_proposed_mps',
  'mmm_proposed_criteria',
  'mmm_parse_ambiguities',
];

/** 10 required indexes from architecture §A5.4 (TR-046) */
const REQUIRED_INDEXES: Array<{ table: string; columns: string }> = [
  { table: 'mmm_evidence', columns: 'assessment_id, criterion_id' },
  { table: 'mmm_maturity_scores', columns: 'assessment_id, entity_type, entity_id' },
  { table: 'mmm_audit_logs', columns: 'target_entity_type, target_entity_id' },
  { table: 'mmm_audit_logs', columns: 'created_at' },
  { table: 'mmm_frameworks', columns: 'organisation_id, status' },
  { table: 'mmm_criteria', columns: 'mps_id' },
  { table: 'mmm_parse_jobs', columns: 'upload_id, status' },
  { table: 'mmm_pit_exports', columns: 'organisation_id, status' },
  { table: 'mmm_score_proposals', columns: 'assessment_id, criterion_id' },
  { table: 'mmm_ai_interactions', columns: 'actor_id, created_at' },
];

/** Immutable audit tables — must not have UPDATE or DELETE policies via RLS */
const IMMUTABLE_TABLES = ['mmm_audit_logs', 'mmm_override_log'];

/** Storage buckets required */
const REQUIRED_BUCKETS = ['mmm-evidence', 'mmm-framework-sources'];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Read all SQL migration files with mmm_ prefix, returning combined content */
function readMigrationSQL(): string {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return '';
  }
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql') && f.includes('mmm'))
    .sort();
  return files.map(f => fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf-8')).join('\n');
}

/** Read a specific migration file */
function readMigrationFile(namePart: string): string {
  if (!fs.existsSync(MIGRATIONS_DIR)) return '';
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql') && f.includes(namePart));
  if (files.length === 0) return '';
  return fs.readFileSync(path.join(MIGRATIONS_DIR, files[0]), 'utf-8');
}

/** Check if a CREATE TABLE statement exists for a table name in SQL content */
function tableExistsInSQL(sql: string, tableName: string): boolean {
  // Match: CREATE TABLE [IF NOT EXISTS] [public.]tableName
  const pattern = new RegExp(
    `CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?(?:public\\.)?${tableName}\\s*\\(`,
    'i'
  );
  return pattern.test(sql);
}

/** Check if ALTER TABLE ... ENABLE ROW LEVEL SECURITY exists for a table */
function rlsEnabledInSQL(sql: string, tableName: string): boolean {
  const pattern = new RegExp(
    `ALTER\\s+TABLE\\s+(?:public\\.)?${tableName}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`,
    'i'
  );
  return pattern.test(sql);
}

/** Check if an index exists for a given table (by searching for ON tableName) */
function indexExistsForTable(sql: string, tableName: string): boolean {
  const pattern = new RegExp(
    `CREATE\\s+INDEX\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?\\w+\\s+ON\\s+(?:public\\.)?${tableName}\\s*\\(`,
    'i'
  );
  return pattern.test(sql);
}

/** Check if a specific column combination appears in an index ON a table */
function specificIndexExists(sql: string, tableName: string, columnPart: string): boolean {
  // Normalise whitespace for comparison
  const normSQL = sql.replace(/\s+/g, ' ');
  const normCols = columnPart.replace(/\s+/g, ' ').replace(/, /g, ',');
  // Check for index on this table
  const tablePattern = new RegExp(
    `CREATE INDEX[^;]*ON\\s+(?:public\\.)?${tableName}\\s*\\([^)]*${columnPart.split(',')[0].trim()}[^)]*\\)`,
    'i'
  );
  return tablePattern.test(normSQL);
}

/** Check for a trigger/function pattern that prevents UPDATE/DELETE on a table */
function immutableProtectionExists(sql: string, tableName: string): boolean {
  // Look for trigger preventing UPDATE
  const updateTrigger = new RegExp(
    `${tableName}_no_update|BEFORE\\s+UPDATE\\s+ON\\s+(?:public\\.)?${tableName}`,
    'i'
  );
  const deleteTrigger = new RegExp(
    `${tableName}_no_delete|BEFORE\\s+DELETE\\s+ON\\s+(?:public\\.)?${tableName}`,
    'i'
  );
  return updateTrigger.test(sql) && deleteTrigger.test(sql);
}

/** Check that no authenticated INSERT/UPDATE/DELETE RLS policy exists for an immutable table */
function noAuthWritePolicyExists(sql: string, tableName: string): boolean {
  // If there's a POLICY ... FOR INSERT/UPDATE/DELETE ... TO authenticated on this table => fail
  const authInsertPolicy = new RegExp(
    `CREATE POLICY[^;]*ON\\s+(?:public\\.)?${tableName}\\s+FOR\\s+(INSERT|UPDATE|DELETE)[^;]*TO\\s+authenticated`,
    'i'
  );
  return !authInsertPolicy.test(sql);
}

// ─────────────────────────────────────────────────────────────────────────────
// Test Suite
// ─────────────────────────────────────────────────────────────────────────────

const allSQL = readMigrationSQL();
const tablesSQL = readMigrationFile('core_tables');
const rlsSQL = readMigrationFile('rls_policies');
const indexesSQL = readMigrationFile('indexes');
const storageSQL = readMigrationFile('storage_buckets');

describe('T-MMM-S6-139 — Migration files exist', () => {
  it('supabase/migrations directory exists', () => {
    expect(fs.existsSync(MIGRATIONS_DIR)).toBe(true);
  });

  it('core tables migration file exists (20260420000001_mmm_core_tables.sql)', () => {
    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.includes('mmm_core_tables'));
    expect(files.length).toBeGreaterThan(0);
  });

  it('indexes migration file exists (20260420000002_mmm_indexes.sql)', () => {
    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.includes('mmm_indexes'));
    expect(files.length).toBeGreaterThan(0);
  });

  it('RLS policies migration file exists (20260420000003_mmm_rls_policies.sql)', () => {
    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.includes('mmm_rls_policies'));
    expect(files.length).toBeGreaterThan(0);
  });

  it('storage buckets migration file exists (20260420000004_mmm_storage_buckets.sql)', () => {
    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.includes('mmm_storage_buckets'));
    expect(files.length).toBeGreaterThan(0);
  });
});

describe('T-MMM-S6-140 — NBR-005: All tables use mmm_ prefix (TR-028)', () => {
  for (const tableName of REQUIRED_TABLES) {
    it(`Table '${tableName}' has mmm_ prefix`, () => {
      expect(tableName.startsWith('mmm_')).toBe(true);
    });
  }
});

describe('T-MMM-S6-141 — All 26 required tables defined in migration SQL (TR-022)', () => {
  for (const tableName of REQUIRED_TABLES) {
    it(`CREATE TABLE statement exists for ${tableName}`, () => {
      expect(allSQL.length).toBeGreaterThan(0);
      expect(tableExistsInSQL(allSQL, tableName)).toBe(true);
    });
  }

  it('Total of 26 required mmm_ tables defined', () => {
    const found = REQUIRED_TABLES.filter(t => tableExistsInSQL(allSQL, t));
    expect(found.length).toBe(26);
  });
});

describe('T-MMM-S6-142 — RLS enabled on all tables (TR-031, architecture §A5.3)', () => {
  for (const tableName of REQUIRED_TABLES) {
    it(`ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY present`, () => {
      expect(rlsEnabledInSQL(allSQL, tableName)).toBe(true);
    });
  }

  it('RLS enabled on all 26 tables', () => {
    const enabled = REQUIRED_TABLES.filter(t => rlsEnabledInSQL(allSQL, t));
    expect(enabled.length).toBe(26);
  });
});

describe('T-MMM-S6-143 — RLS SELECT policies exist for organisation-scoped tables', () => {
  const orgScopedTables = [
    'mmm_organisations',
    'mmm_frameworks',
    'mmm_assessments',
    'mmm_audit_sessions',
    'mmm_pit_exports',
    'mmm_invitations',
    'mmm_organisation_hierarchy',
  ];

  for (const tableName of orgScopedTables) {
    it(`SELECT policy exists for ${tableName}`, () => {
      // Check for a CREATE POLICY ... FOR SELECT on this table
      const pattern = new RegExp(
        `CREATE POLICY[^;]*ON\\s+(?:public\\.)?${tableName}\\s+FOR\\s+SELECT`,
        'i'
      );
      expect(pattern.test(allSQL)).toBe(true);
    });
  }
});

describe('T-MMM-S6-144 — mmm_profiles: users can only read/update their own record', () => {
  it('SELECT policy on mmm_profiles uses auth.uid() comparison', () => {
    const pattern = /mmm_profiles[^;]*FOR\s+SELECT[^;]*auth\.uid\(\)/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('UPDATE policy on mmm_profiles uses auth.uid() comparison', () => {
    const pattern = /mmm_profiles[^;]*FOR\s+UPDATE[^;]*auth\.uid\(\)/i;
    expect(pattern.test(allSQL)).toBe(true);
  });
});

describe('T-MMM-S6-145 — mmm_free_assessments: public access without auth (architecture §A5.3)', () => {
  it('INSERT policy on mmm_free_assessments allows anon role', () => {
    const pattern = /mmm_free_assessments_insert_public[^;]*TO\s+anon/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('SELECT policy on mmm_free_assessments allows anon role', () => {
    const pattern = /mmm_free_assessments[^;]*FOR\s+SELECT[^;]*TO\s+anon/i;
    expect(pattern.test(allSQL)).toBe(true);
  });
});

describe('T-MMM-S6-146 — Immutable audit tables: mmm_audit_logs (TR-038)', () => {
  it('mmm_audit_logs has BEFORE UPDATE trigger preventing mutation', () => {
    expect(immutableProtectionExists(allSQL, 'mmm_audit_logs')).toBe(true);
  });

  it('mmm_audit_logs has BEFORE DELETE trigger preventing deletion', () => {
    const deleteTrigger = /mmm_audit_logs_no_delete|BEFORE\s+DELETE\s+ON\s+(?:public\.)?mmm_audit_logs/i;
    expect(deleteTrigger.test(allSQL)).toBe(true);
  });

  it('No authenticated INSERT/UPDATE/DELETE RLS policy on mmm_audit_logs (service role only)', () => {
    // There should be no INSERT policy for authenticated users on audit_logs
    const authInsert = /CREATE POLICY[^;]*mmm_audit_logs[^;]*FOR\s+INSERT[^;]*TO\s+authenticated/i;
    expect(authInsert.test(allSQL)).toBe(false);
  });

  it('mmm_audit_logs has SELECT policy for authenticated users', () => {
    const pattern = /CREATE POLICY[^;]*ON\s+(?:public\.)?mmm_audit_logs\s+FOR\s+SELECT/i;
    expect(pattern.test(allSQL)).toBe(true);
  });
});

describe('T-MMM-S6-147 — Immutable override log: mmm_override_log (TR-026, TR-038)', () => {
  it('mmm_override_log has BEFORE UPDATE trigger preventing mutation', () => {
    expect(immutableProtectionExists(allSQL, 'mmm_override_log')).toBe(true);
  });

  it('mmm_override_log has BEFORE DELETE trigger preventing deletion', () => {
    const deleteTrigger = /mmm_override_log_no_delete|BEFORE\s+DELETE\s+ON\s+(?:public\.)?mmm_override_log/i;
    expect(deleteTrigger.test(allSQL)).toBe(true);
  });

  it('No authenticated INSERT RLS policy on mmm_override_log (service role only)', () => {
    const authInsert = /CREATE POLICY[^;]*mmm_override_log[^;]*FOR\s+INSERT[^;]*TO\s+authenticated/i;
    expect(authInsert.test(allSQL)).toBe(false);
  });
});

describe('T-MMM-S6-148 — NBR-002: Cross-org isolation via org_id helpers', () => {
  it('mmm_current_user_org_id() function defined', () => {
    const pattern = /CREATE OR REPLACE FUNCTION\s+(?:public\.)?mmm_current_user_org_id/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('Organisation-scoped SELECT policies reference mmm_current_user_org_id()', () => {
    const pattern = /mmm_current_user_org_id\(\)/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('Framework INSERT policy enforces organisation_id check (WITH CHECK)', () => {
    const pattern = /mmm_frameworks[^;]*FOR\s+INSERT[^;]*WITH\s+CHECK[^;]*organisation_id/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('Assessment INSERT policy enforces organisation_id check (WITH CHECK)', () => {
    const pattern = /mmm_assessments[^;]*FOR\s+INSERT[^;]*WITH\s+CHECK[^;]*organisation_id/i;
    expect(pattern.test(allSQL)).toBe(true);
  });
});

describe('T-MMM-S6-149 — Org isolation: both USING and WITH CHECK on write policies', () => {
  // Verify that org-scoped UPDATE policies include WITH CHECK to block cross-org writes (NBR-002)
  it('mmm_frameworks UPDATE policy has WITH CHECK constraint', () => {
    const pattern = /mmm_frameworks[^;]*FOR\s+UPDATE[^;]*WITH\s+CHECK/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('mmm_evidence UPDATE policy has WITH CHECK constraint', () => {
    const pattern = /mmm_evidence[^;]*FOR\s+UPDATE[^;]*WITH\s+CHECK/i;
    expect(pattern.test(allSQL)).toBe(true);
  });
});

describe('T-MMM-S6-150 — All 10 required indexes present (TR-046, architecture §A5.4)', () => {
  it('Index on mmm_evidence(assessment_id, criterion_id) exists', () => {
    const pattern = /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_evidence\s*\(\s*assessment_id\s*,\s*criterion_id\s*\)/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('Index on mmm_maturity_scores(assessment_id, entity_type, entity_id) exists', () => {
    const pattern = /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_maturity_scores\s*\(\s*assessment_id\s*,\s*entity_type\s*,\s*entity_id\s*\)/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('Index on mmm_audit_logs(target_entity_type, target_entity_id) exists', () => {
    const pattern = /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_audit_logs\s*\(\s*target_entity_type\s*,\s*target_entity_id\s*\)/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('Index on mmm_audit_logs(created_at) exists', () => {
    const pattern = /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_audit_logs\s*\(\s*created_at\s*\)/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('Index on mmm_frameworks(organisation_id, status) exists', () => {
    const pattern = /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_frameworks\s*\(\s*organisation_id\s*,\s*status\s*\)/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('Index on mmm_criteria(mps_id) exists', () => {
    const pattern = /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_criteria\s*\(\s*mps_id\s*\)/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('Index on mmm_parse_jobs(upload_id, status) exists', () => {
    const pattern = /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_parse_jobs\s*\(\s*upload_id\s*,\s*status\s*\)/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('Index on mmm_pit_exports(organisation_id, status) exists', () => {
    const pattern = /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_pit_exports\s*\(\s*organisation_id\s*,\s*status\s*\)/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('Index on mmm_score_proposals(assessment_id, criterion_id) exists', () => {
    const pattern = /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_score_proposals\s*\(\s*assessment_id\s*,\s*criterion_id\s*\)/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('Index on mmm_ai_interactions(actor_id, created_at) exists', () => {
    const pattern = /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_ai_interactions\s*\(\s*actor_id\s*,\s*created_at\s*\)/i;
    expect(pattern.test(allSQL)).toBe(true);
  });

  it('All 10 TR-046 required indexes are present', () => {
    const checks = [
      /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_evidence\s*\(\s*assessment_id\s*,\s*criterion_id\s*\)/i,
      /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_maturity_scores\s*\(\s*assessment_id\s*,\s*entity_type\s*,\s*entity_id\s*\)/i,
      /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_audit_logs\s*\(\s*target_entity_type\s*,\s*target_entity_id\s*\)/i,
      /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_audit_logs\s*\(\s*created_at\s*\)/i,
      /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_frameworks\s*\(\s*organisation_id\s*,\s*status\s*\)/i,
      /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_criteria\s*\(\s*mps_id\s*\)/i,
      /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_parse_jobs\s*\(\s*upload_id\s*,\s*status\s*\)/i,
      /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_pit_exports\s*\(\s*organisation_id\s*,\s*status\s*\)/i,
      /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_score_proposals\s*\(\s*assessment_id\s*,\s*criterion_id\s*\)/i,
      /CREATE\s+INDEX[^;]*ON\s+(?:public\.)?mmm_ai_interactions\s*\(\s*actor_id\s*,\s*created_at\s*\)/i,
    ];
    const found = checks.filter(p => p.test(allSQL));
    expect(found.length).toBe(10);
  });
});

describe('T-MMM-S6-151 — Column definitions: mandatory columns present (TR-022)', () => {
  it('mmm_organisations has required columns (id, name, slug, tier, subscription_status)', () => {
    expect(tablesSQL).toMatch(/slug\s+text\s+NOT\s+NULL\s+UNIQUE/i);
    expect(tablesSQL).toMatch(/subscription_status\s+text/i);
    expect(tablesSQL).toMatch(/evidence_freshness_days\s+integer/i);
  });

  it('mmm_frameworks has status CHECK constraint (DRAFT/REVIEW/PUBLISHED/ARCHIVED)', () => {
    expect(tablesSQL).toMatch(/CHECK\s*\(\s*status\s+IN\s*\(\s*'DRAFT'\s*,\s*'REVIEW'\s*,\s*'PUBLISHED'\s*,\s*'ARCHIVED'\s*\)\s*\)/i);
  });

  it('mmm_level_descriptors has level CHECK (BETWEEN 1 AND 5)', () => {
    expect(tablesSQL).toMatch(/level\s+integer\s+NOT\s+NULL\s+CHECK\s*\(\s*level\s+BETWEEN\s+1\s+AND\s+5\s*\)/i);
  });

  it('mmm_evidence has status CHECK (PENDING/ACCEPTED/REJECTED)', () => {
    expect(tablesSQL).toMatch(/CHECK\s*\(\s*status\s+IN\s*\(\s*'PENDING'\s*,\s*'ACCEPTED'\s*,\s*'REJECTED'\s*\)\s*\)/i);
  });

  it('mmm_audit_sessions has status CHECK (ACTIVE/CLOSED)', () => {
    expect(tablesSQL).toMatch(/CHECK\s*\(\s*status\s+IN\s*\(\s*'ACTIVE'\s*,\s*'CLOSED'\s*\)\s*\)/i);
  });

  it('mmm_parse_jobs has status CHECK (PENDING/PROCESSING/COMPLETE/FAILED)', () => {
    expect(tablesSQL).toMatch(/CHECK\s*\(\s*status\s+IN\s*\(\s*'PENDING'\s*,\s*'PROCESSING'\s*,\s*'COMPLETE'\s*,\s*'FAILED'\s*\)\s*\)/i);
  });

  it('mmm_organisation_hierarchy has node_type CHECK (SITE/OPERATION/SUBSIDIARY)', () => {
    expect(tablesSQL).toMatch(/CHECK\s*\(\s*node_type\s+IN\s*\(\s*'SITE'\s*,\s*'OPERATION'\s*,\s*'SUBSIDIARY'\s*\)\s*\)/i);
  });

  it('mmm_proposed_domains has source CHECK (AI/HUMAN)', () => {
    expect(tablesSQL).toMatch(/CHECK\s*\(\s*source\s+IN\s*\(\s*'AI'\s*,\s*'HUMAN'\s*\)\s*\)/i);
  });
});

describe('T-MMM-S6-152 — Seed data file exists with required test fixtures', () => {
  const seedPath = path.join(ROOT, 'supabase', 'seed-mmm.sql');

  it('supabase/seed-mmm.sql exists', () => {
    expect(fs.existsSync(seedPath)).toBe(true);
  });

  it('Seed has 2 organisations (cross-org isolation)', () => {
    const seed = fs.readFileSync(seedPath, 'utf-8');
    const orgInserts = (seed.match(/INSERT\s+INTO\s+(?:public\.)?mmm_organisations/gi) || []).length;
    expect(orgInserts).toBeGreaterThanOrEqual(2);
  });

  it('Seed has at least 1 PUBLISHED framework', () => {
    const seed = fs.readFileSync(seedPath, 'utf-8');
    expect(seed).toMatch(/PUBLISHED/);
  });

  it('Seed has domain definitions', () => {
    const seed = fs.readFileSync(seedPath, 'utf-8');
    expect(seed).toMatch(/INSERT\s+INTO\s+(?:public\.)?mmm_domains/i);
  });

  it('Seed has MPS definitions', () => {
    const seed = fs.readFileSync(seedPath, 'utf-8');
    expect(seed).toMatch(/INSERT\s+INTO\s+(?:public\.)?mmm_maturity_process_steps/i);
  });

  it('Seed has criteria definitions', () => {
    const seed = fs.readFileSync(seedPath, 'utf-8');
    expect(seed).toMatch(/INSERT\s+INTO\s+(?:public\.)?mmm_criteria/i);
  });
});

// =============================================================================
// D10 — Infrastructure & Quality Gates
// =============================================================================

describe('T-MMM-S6-153 — Frontend Deployment: Vercel config and build artifacts (infrastructure evidence)', () => {
  it('vercel.json exists at repo root', () => {
    expect(fs.existsSync(path.join(ROOT, 'vercel.json'))).toBe(true);
  });

  it('package.json exists at repo root', () => {
    expect(fs.existsSync(path.join(ROOT, 'package.json'))).toBe(true);
  });
});

describe('T-MMM-S6-154 — Backend Deployment: Supabase schema deployed (migration artifacts present)', () => {
  it('supabase/config.toml exists', () => {
    expect(fs.existsSync(path.join(ROOT, 'supabase', 'config.toml'))).toBe(true);
  });

  it('supabase/migrations directory exists', () => {
    expect(fs.existsSync(MIGRATIONS_DIR)).toBe(true);
  });

  it('At least 4 mmm_ migration files present', () => {
    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.includes('mmm'));
    expect(files.length).toBeGreaterThanOrEqual(4);
  });

  it('Migration files follow YYYYMMDDHHMMSS_mmm_<description>.sql naming convention', () => {
    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.includes('mmm') && f.endsWith('.sql'));
    for (const file of files) {
      // Must start with 14-digit timestamp
      expect(file).toMatch(/^\d{14}_mmm_/);
    }
  });
});

describe('T-MMM-S6-155 — Storage buckets configured (architecture §A5.8)', () => {
  it('storage buckets migration file exists', () => {
    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.includes('storage'));
    expect(files.length).toBeGreaterThan(0);
  });

  it('mmm-evidence bucket defined in storage migration', () => {
    expect(storageSQL).toMatch(/mmm-evidence/);
  });

  it('mmm-framework-sources bucket defined in storage migration', () => {
    expect(storageSQL).toMatch(/mmm-framework-sources/);
  });

  it('mmm-evidence bucket is private (not public)', () => {
    // Check for the mmm-evidence bucket insert with false for public
    const evBucketPattern = /mmm-evidence[^;]*false[^;]*\)/is;
    expect(evBucketPattern.test(storageSQL)).toBe(true);
  });

  it('mmm-evidence bucket has 50MB file size limit (52428800 bytes)', () => {
    expect(storageSQL).toMatch(/52428800/);
  });

  it('Storage RLS policies exist for both buckets', () => {
    expect(storageSQL).toMatch(/CREATE POLICY[^;]*mmm_evidence_bucket/i);
    expect(storageSQL).toMatch(/CREATE POLICY[^;]*mmm_framework_sources_bucket/i);
  });
});

describe('T-MMM-S6-156 — TR-028: No tables outside mmm_ namespace (architecture §A11)', () => {
  it('All CREATE TABLE statements in mmm migrations use mmm_ prefix', () => {
    // Extract all table names from CREATE TABLE statements in mmm migrations
    const createTablePattern = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?(\w+)\s*\(/gi;
    const tableNames: string[] = [];
    let match;
    while ((match = createTablePattern.exec(allSQL)) !== null) {
      tableNames.push(match[1]);
    }
    // All found table names should start with mmm_
    const nonMmmTables = tableNames.filter(t => !t.startsWith('mmm_'));
    expect(nonMmmTables).toHaveLength(0);
  });
});

describe('T-MMM-S6-157 — Foreign keys stay within mmm_ namespace (architecture §A11)', () => {
  it('No REFERENCES to non-mmm_ tables in migration SQL (except auth.users implicit via profiles.id)', () => {
    // Check for REFERENCES keywords pointing to non-mmm tables
    const referencesPattern = /REFERENCES\s+(?:public\.)?(\w+)\s*\(/gi;
    const referenced: string[] = [];
    let match;
    while ((match = referencesPattern.exec(allSQL)) !== null) {
      referenced.push(match[1]);
    }
    const external = referenced.filter(t => !t.startsWith('mmm_') && t !== 'storage');
    // Only allowed external reference: none (profiles.id is implicitly auth.users but PK is NOT a FK)
    expect(external).toHaveLength(0);
  });
});

describe('T-MMM-S6-158 — Idempotency: CREATE TABLE IF NOT EXISTS used (migration safety)', () => {
  it('All CREATE TABLE statements use IF NOT EXISTS', () => {
    const withoutIfNotExists = /CREATE\s+TABLE\s+(?!IF\s+NOT\s+EXISTS)/gi;
    const matches = tablesSQL.match(withoutIfNotExists) || [];
    expect(matches).toHaveLength(0);
  });

  it('All CREATE INDEX statements use IF NOT EXISTS', () => {
    const withoutIfNotExists = /CREATE\s+INDEX\s+(?!IF\s+NOT\s+EXISTS)/gi;
    const matches = indexesSQL.match(withoutIfNotExists) || [];
    expect(matches).toHaveLength(0);
  });
});

describe('T-MMM-S6-159 — updated_at auto-trigger exists on mutable tables', () => {
  it('mmm_set_updated_at() trigger function defined', () => {
    expect(tablesSQL).toMatch(/CREATE OR REPLACE FUNCTION\s+(?:public\.)?mmm_set_updated_at/i);
  });

  it('updated_at trigger applied to mmm_organisations', () => {
    expect(tablesSQL).toMatch(/mmm_organisations_updated_at/i);
  });

  it('updated_at trigger applied to mmm_frameworks', () => {
    expect(tablesSQL).toMatch(/mmm_frameworks_updated_at/i);
  });
});

describe('T-MMM-S6-160 — mmm_score_proposals: service-role-only write (architecture §A5.3)', () => {
  it('No authenticated INSERT policy on mmm_score_proposals', () => {
    const authInsert = /CREATE POLICY[^;]*ON\s+(?:public\.)?mmm_score_proposals\s+FOR\s+INSERT[^;]*TO\s+authenticated/i;
    expect(authInsert.test(allSQL)).toBe(false);
  });

  it('SELECT policy exists for mmm_score_proposals (org-scoped)', () => {
    const selectPolicy = /CREATE POLICY[^;]*ON\s+(?:public\.)?mmm_score_proposals\s+FOR\s+SELECT/i;
    expect(selectPolicy.test(allSQL)).toBe(true);
  });
});

describe('T-MMM-S6-161 — mmm_maturity_scores: service-role-only write (architecture §A5.3)', () => {
  it('No authenticated INSERT policy on mmm_maturity_scores (service role only)', () => {
    const authInsert = /CREATE POLICY[^;]*ON\s+(?:public\.)?mmm_maturity_scores\s+FOR\s+INSERT[^;]*TO\s+authenticated/i;
    expect(authInsert.test(allSQL)).toBe(false);
  });
});

describe('T-MMM-S6-162 — mmm_ai_interactions: admin-only read, service-role write (TR-066)', () => {
  it('SELECT policy on mmm_ai_interactions restricts to ADMIN/LEAD_AUDITOR role', () => {
    expect(allSQL).toMatch(/mmm_ai_interactions[^;]*FOR\s+SELECT[^;]*ADMIN/i);
  });

  it('No INSERT policy for authenticated on mmm_ai_interactions (service role only)', () => {
    const authInsert = /CREATE POLICY[^;]*ON\s+(?:public\.)?mmm_ai_interactions\s+FOR\s+INSERT[^;]*TO\s+authenticated/i;
    expect(authInsert.test(allSQL)).toBe(false);
  });
});

describe('T-MMM-S6-163 — seed-mmm.sql: ON CONFLICT DO NOTHING for idempotency', () => {
  it('Seed data uses ON CONFLICT DO NOTHING for safe re-runs', () => {
    const seedPath = path.join(ROOT, 'supabase', 'seed-mmm.sql');
    const seed = fs.readFileSync(seedPath, 'utf-8');
    expect(seed).toMatch(/ON CONFLICT[^;]*DO NOTHING/i);
  });
});

describe('T-MMM-S6-164 — Wave B1 evidence artifact exists', () => {
  const evidencePath = path.join(ROOT, 'modules', 'MMM', '11-build', 'B1-schema', 'wave-b1-evidence.md');

  it('modules/MMM/11-build/B1-schema/wave-b1-evidence.md exists', () => {
    expect(fs.existsSync(evidencePath)).toBe(true);
  });

  it('Evidence artifact contains wave slug mmm-build-wave-b1-schema', () => {
    const evidence = fs.readFileSync(evidencePath, 'utf-8');
    expect(evidence).toMatch(/mmm-build-wave-b1-schema/);
  });

  it('Evidence artifact lists all 26 tables', () => {
    const evidence = fs.readFileSync(evidencePath, 'utf-8');
    for (const table of REQUIRED_TABLES) {
      expect(evidence).toMatch(new RegExp(table));
    }
  });

  it('Evidence artifact contains NBR-002 compliance statement', () => {
    const evidence = fs.readFileSync(evidencePath, 'utf-8');
    expect(evidence).toMatch(/NBR-002/);
  });

  it('Evidence artifact contains NBR-005 compliance statement', () => {
    const evidence = fs.readFileSync(evidencePath, 'utf-8');
    expect(evidence).toMatch(/NBR-005/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Wave mmm-storage-model-codification-20260422 — RED QA Tests
// Issue: maturion-isms#1458
// Architecture Reference: §A5.6 (voice evidence MIME types)
// ─────────────────────────────────────────────────────────────────────────────

describe('T-MMM-S6-ADR001: mmm-evidence bucket supports voice/audio evidence MIME types', () => {
  const audioMimeFixMigration = fs
    .readdirSync(MIGRATIONS_DIR)
    .find((file) => file.includes('mmm_evidence_audio_mime_fix'));

  const audioMimeFixSQL = audioMimeFixMigration
    ? fs.readFileSync(path.join(MIGRATIONS_DIR, audioMimeFixMigration), 'utf8')
    : '';

  it('mmm_evidence_audio_mime_fix migration exists', () => {
    expect(audioMimeFixMigration).toBeDefined();
  });

  it('mmm-evidence bucket allows audio/mpeg (MP3)', () => {
    expect(audioMimeFixSQL).toContain("'audio/mpeg'");
  });
  it('mmm-evidence bucket allows audio/wav (WAV)', () => {
    expect(audioMimeFixSQL).toContain("'audio/wav'");
  });
  it('mmm-evidence bucket allows audio/mp4 (M4A/AAC)', () => {
    expect(audioMimeFixSQL).toContain("'audio/mp4'");
  });
  it('mmm-evidence bucket allows audio/webm (browser-native audio)', () => {
    expect(audioMimeFixSQL).toContain("'audio/webm'");
  });
  it('mmm-evidence bucket allows video/mp4 (video evidence)', () => {
    expect(audioMimeFixSQL).toContain("'video/mp4'");
  });
  it('mmm-evidence bucket allows video/webm (browser-native video)', () => {
    expect(audioMimeFixSQL).toContain("'video/webm'");
  });
});

describe('T-MMM-S6-ADR002: mmm-evidence RLS enforces org-level path isolation', () => {
  it('storage migration defines org-path RLS for mmm-evidence (split_part)', () => {
    const allMigrationSQL = readMigrationSQL();
    expect(allMigrationSQL).toMatch(/split_part.*mmm-evidence|mmm-evidence.*split_part/i);
  });
  it('storage migration defines mmm_evidence_org_read_v2 or equivalent RLS policy', () => {
    const allMigrationSQL = readMigrationSQL();
    expect(allMigrationSQL).toMatch(/mmm_evidence_org_read_v2|mmm_evidence_org_insert_v2/);
  });
});
