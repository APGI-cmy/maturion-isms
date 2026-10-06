'use strict';

const MANIFEST_PATHS = (prNumber) => [
  `.admin/prs/pr-${prNumber}.json`,
  '.admin/pr.json',
];

const GOVERNANCE_CONTROL_PATTERNS = [
  /^governance\//,
  /^\.github\/workflows\//,
  /^\.github\/scripts\//,
  /^\.github\/agents\//,
  /^\.agent-admin\//,
  /\.agent\.md$/,
];

async function resolveAdminManifest({ getContent, prNumber }) {
  for (const manifestPath of MANIFEST_PATHS(prNumber)) {
    let response;
    try {
      response = await getContent(manifestPath);
    } catch (error) {
      const status = Number(error?.status || error?.response?.status || 0);
      if (status === 404) continue;
      return {
        manifest: null,
        manifestPath: '',
        confirmedAbsent: false,
        failure: `Unable to read PR admin manifest ${manifestPath}: GitHub API request failed${status ? ` (HTTP ${status})` : ''}.`,
      };
    }

    const content = response?.data;
    if (!content || content.type !== 'file' || typeof content.content !== 'string') {
      return {
        manifest: null,
        manifestPath: '',
        confirmedAbsent: false,
        failure: `Invalid or unreadable PR admin manifest ${manifestPath}: GitHub content response did not contain a readable file payload.`,
      };
    }

    let manifest;
    try {
      manifest = JSON.parse(Buffer.from(content.content, 'base64').toString('utf8'));
      if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
        throw new Error('manifest JSON must be an object');
      }
    } catch (error) {
      return {
        manifest: null,
        manifestPath: '',
        confirmedAbsent: false,
        failure: `Invalid or unreadable PR admin manifest ${manifestPath}: ${error.message}.`,
      };
    }

    return { manifest, manifestPath, confirmedAbsent: false, failure: '' };
  }

  return { manifest: null, manifestPath: '', confirmedAbsent: true, failure: '' };
}

function classifyNoManifestFiles(files) {
  const touchesGovernanceControlPaths = (files || []).some((file) =>
    GOVERNANCE_CONTROL_PATTERNS.some((pattern) => pattern.test(String(file || '')))
  );
  return {
    touchesGovernanceControlPaths,
    requiresIaa: touchesGovernanceControlPaths,
    requiresEcap: touchesGovernanceControlPaths,
    prType: touchesGovernanceControlPaths ? 'legacy-governance-control' : 'legacy-no-manifest',
  };
}

module.exports = {
  classifyNoManifestFiles,
  resolveAdminManifest,
};
