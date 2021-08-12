import * as core from '@actions/core';
import * as github from '@actions/github';
import {execSync} from 'child_process';
import {clean} from 'semver';

try {
  // Get input variables
  // const GITHUB_TOKEN = core.getInput('github_token');
  // const NODE_AUTH_TOKEN = core.getInput('npm_token');

  // Set github username and email
  const username = 'github-actions[bot]';
  const email = '41898282+github-actions[bot]@users.noreply.github.com';
  execSync(`git config user.name "${username}"`);
  execSync(`git config user.email "${email}"`);

  // Extract version tag, ignoring leading "v" (e.g. v1.0.0 -> 1.0.0)
  const dirtyTag = github.context.ref.substring('refs/tags/'.length);
  const cleaned = clean(dirtyTag);
  if (!cleaned) {
    throw new Error('Could not parse semver tag');
  }

  // Upgrade version in package.json to release tag version
  execSync(`yarn version --new-version ${cleaned}`);

  // Publish to NPM with auth token
  execSync('yarn publish');

  // Push new version to github
  execSync('git push');
} catch (error) {
  if (error && error instanceof Error) {
    core.setFailed(error.message);
  }
}
