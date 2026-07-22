import test from 'node:test';
import assert from 'node:assert/strict';

import {
  assertEffectivePreviewUrl,
  isAllowedMmmPreviewHost,
  validateConfiguredPreviewUrl,
} from './validate-preview-url.mjs';

test('accepts the MMM Vercel preview host', () => {
  assert.equal(
    isAllowedMmmPreviewHost('maturion-isms-mmm-git-example-rassie-ras-projects.vercel.app'),
    true,
  );
  assert.equal(
    validateConfiguredPreviewUrl(
      'https://maturion-isms-mmm-git-example-rassie-ras-projects.vercel.app/dashboard',
    ).hostname,
    'maturion-isms-mmm-git-example-rassie-ras-projects.vercel.app',
  );
});

test('rejects Vercel login and unrelated Vercel apps', () => {
  assert.throws(
    () => validateConfiguredPreviewUrl('https://vercel.com/login'),
    /must target the MMM Vercel preview host/,
  );
  assert.throws(
    () => validateConfiguredPreviewUrl('https://unrelated-project.vercel.app/dashboard'),
    /must target the MMM Vercel preview host/,
  );
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
