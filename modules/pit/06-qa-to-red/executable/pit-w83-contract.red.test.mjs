import test from 'node:test';
import assert from 'node:assert/strict';

async function loadRequiredContract(modulePath, exportName) {
  try {
    const mod = await import(modulePath);
    assert.equal(typeof mod[exportName], 'function', `Expected export ${exportName} from ${modulePath}`);
    return mod[exportName];
  } catch (error) {
    assert.fail(`Missing required W8.3 contract module (${modulePath}#${exportName}): ${error.message}`);
  }
}

test('PIT-RED-W83-015: end-before-start validation hard-fails and prevents persistence payload', async () => {
  const validateDateRange = await loadRequiredContract(
    '../../../../apps/isms-portal/src/lib/pit/w83-date-validation.ts',
    'validateHierarchyDateRange',
  );

  const result = validateDateRange({
    parentStartDate: '2026-08-01',
    parentEndDate: '2026-08-30',
    startDate: '2026-08-20',
    endDate: '2026-08-10',
    confirmException: false,
  });

  assert.deepEqual(result, {
    valid: false,
    code: 'END_BEFORE_START',
    preventsWrite: true,
  });
});

test('PIT-RED-W83-030: MMM transformation maps Domain→Milestone, MPS→Deliverable, Criterion→Task+', async () => {
  const transformMmmPackageToPitHierarchy = await loadRequiredContract(
    '../../../../apps/isms-portal/src/lib/pit/w83-mmm-transform.ts',
    'transformMmmPackageToPitHierarchy',
  );

  const transformed = transformMmmPackageToPitHierarchy({
    packageId: 'pkg-1',
    domains: [
      {
        id: 'dom-1',
        title: 'Domain 1',
        mps: [
          {
            id: 'mps-1',
            title: 'MPS 1',
            criteria: [
              { id: 'c-1', description: 'Criterion 1' },
              { id: 'c-2', description: 'Criterion 2' },
            ],
          },
        ],
      },
    ],
  });

  assert.equal(transformed.milestones.length, 1, 'Expected one milestone per domain');
  assert.equal(transformed.deliverables.length, 1, 'Expected one deliverable per MPS');
  assert.equal(transformed.tasks.length >= 2, true, 'Expected one or more tasks per criterion');
});
