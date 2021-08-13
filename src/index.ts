import * as core from '@actions/core';
import * as github from '@actions/github';
import {execSync} from 'child_process';
import {clean} from 'semver';

try {
  // Set github username and email
  const username = 'github-actions[bot]';
  const email = '41898282+github-actions[bot]@users.noreply.github.com';
  execSync(`git config user.name "${username}"`, {timeout: 10000});
  execSync(`git config user.email "${email}"`, {timeout: 10000});

  // Extract version tag, ignoring leading "v" (e.g. v1.0.0 -> 1.0.0)
  core.startGroup('Extract release version');
  const rawTag = github.context.ref.substring('refs/tags/'.length);
  const version = clean(rawTag);
  if (!version) {
    throw new Error('Could not parse semver tag');
  }
  core.info(`Parsed semver of this release: ${version}`);
  // Upgrade version in package.json to release tag version
  const versionResult = execSync(`yarn version --new-version ${version}`, {timeout: 10000});
  core.info(versionResult.toString('utf8'));
  core.endGroup();

  // Install dependencies (may be required for prepublishOnly hook)
  core.info('Installing dependencies...');
  execSync('yarn install', {timeout: 600000});
  core.endGroup();

  // Publish to NPM with auth token
  core.startGroup('Publishing...');
  const publishResult = execSync('yarn publish', {timeout: 30000});
  core.info(publishResult.toString('utf8'));
  core.endGroup();

  // Push new version to github
  core.startGroup('Push new semver tag');
  const pushResult = execSync('git push', {timeout: 30000});
  core.info(pushResult.toString('utf8'));
  core.endGroup();
} catch (error) {
  core.error(`Publish workflow failed with error: ${error}`);
  if (error && error instanceof Error) {
    core.setFailed(error.message);
  }
}
