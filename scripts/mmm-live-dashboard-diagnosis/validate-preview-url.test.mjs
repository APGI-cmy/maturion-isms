import test from 'node:test';
import assert from 'node:assert/strict';

import {
  assertEffectivePreviewUrl,
  buildVercelBypassHeaders,
  isAllowedMmmPreviewHost,
  validateConfiguredPreviewUrl,
} from './validate-preview-url.mjs';

test('accepts exact MMM production and preview hosts', () => {
  assert.equal(isAllowedMmmPreviewHost('maturion-isms-mmm.vercel.app'), true);
  assert.equal(
    isAllowedMmmPreviewHost(
      'maturion-isms-mmm-git-example-rassie-ras-projects.vercel.app',
    ),
    true,
  );
  assert.equal(
    validateConfiguredPreviewUrl(
      '  https://maturion-isms-mmm-git-example-rassie-ras-projects.vercel.app/dashboard  ',
    ).hostname,
    'maturion-isms-mmm-git-example-rassie-ras-projects.vercel.app',
  );
});

test('rejects Vercel login, unrelated apps, and lookalike project hosts', () => {
  const rejectedUrls = [
    'https://vercel.com/login',
    'https://unrelated-project.vercel.app/dashboard',
    'https://unrelated-maturion-isms-mmm.vercel.app/dashboard',
    'https://maturion-isms-mmm-evil.vercel.app/dashboard',
  ];

  for (const rejectedUrl of rejectedUrls) {
    assert.throws(
      () => validateConfiguredPreviewUrl(rejectedUrl),
      /must target the MMM Vercel preview host/,
    );
  }
});

test('rejects redirect away from the expected MMM application host', () => {
  const expected =
    'https://maturion-isms-mmm-git-example-rassie-ras-projects.vercel.app/dashboard';
  assert.throws(
    () => assertEffectivePreviewUrl(expected, 'https://vercel.com/login'),
    /redirected away from the application host/,
  );
});

test('accepts an effective URL on the same MMM preview host', () => {
  const expected =
    'https://maturion-isms-mmm-git-example-rassie-ras-projects.vercel.app/dashboard';
  const effective = assertEffectivePreviewUrl(
    expected,
    'https://maturion-isms-mmm-git-example-rassie-ras-projects.vercel.app/login',
  );
  assert.equal(effective.hostname, new URL(expected).hostname);
});

test('builds the documented Vercel automation bypass header pair', () => {
  assert.deepEqual(buildVercelBypassHeaders('  secret-value  '), {
    'x-vercel-protection-bypass': 'secret-value',
    'x-vercel-set-bypass-cookie': 'true',
  });
  assert.equal(buildVercelBypassHeaders('   '), undefined);
});
