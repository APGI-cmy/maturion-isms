import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '../../../..');
const MIGRATIONS = resolve(ROOT, 'supabase/migrations');

const reconciliations = [
  {
    expected: '20260722102655_pit_stage12_slice4_project_persistence.sql',
    superseded: '20260722090000_pit_stage12_slice4_project_persistence.sql',
    sha256: '806ed2f6491f507ed37a97b62f8396d58701beed1c98ec2e5299238bd03542cb',
  },
  {
    expected: '20260722104224_pit_slice4_privilege_hardening.sql',
    superseded: '20260722105000_pit_slice4_privilege_hardening.sql',
    sha256: '725da4707b7f9b2be63f7aacbbea4d6ab8744418dab4eb23970da602d177faf8',
  },
  {
    expected: '20260723141559_pit_slice4_rpc_only_mutation_boundary.sql',
    superseded: '20260723130000_pit_slice4_rpc_only_mutation_boundary.sql',
    sha256: '036d761f10a1ece210156212cb37c07026bdc1fa0b6c638c6f7a37a86faa5e5e',
  },
  {
    expected: '20260728070417_mmm_rls_private_helper_policy_reconciliation.sql',
    superseded: '20260728094338_mmm_rls_seven_policy_private_helper_alignment.sql',
    sha256: '7cd7725cd7dd5f343126e713272c17b7adf19a4823dcd45f9a76cf0ad0d0aa4f',
  },
] as const;

describe('Issue #1990 migration-baseline reconciliation', () => {
  it.each(reconciliations)(
    'keeps the approved SQL body unchanged at production version $expected',
    ({ expected, superseded, sha256 }) => {
      const expectedPath = resolve(MIGRATIONS, expected);
      expect(existsSync(expectedPath)).toBe(true);
      expect(createHash('sha256').update(readFileSync(expectedPath)).digest('hex')).toBe(sha256);
      expect(existsSync(resolve(MIGRATIONS, superseded))).toBe(false);
    },
  );

  it('contains each production migration version exactly once', () => {
    const files = readdirSync(MIGRATIONS);
    for (const { expected } of reconciliations) {
      expect(files.filter((file) => file === expected)).toHaveLength(1);
    }
  });

  it('does not duplicate or add other Issue #1990 migration bodies', () => {
    const files = readdirSync(MIGRATIONS);
    expect(files.filter((file) => /pit_stage12_slice4_project_persistence|pit_slice4_privilege_hardening|pit_slice4_rpc_only_mutation_boundary|mmm_rls_.*private_helper/i.test(file))).toEqual(
      reconciliations.map(({ expected }) => expected),
    );
  });
});