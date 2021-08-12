"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const child_process_1 = require("child_process");
const semver_1 = require("semver");
try {
    // Get input variables
    // const GITHUB_TOKEN = core.getInput('github_token');
    // const NODE_AUTH_TOKEN = core.getInput('npm_token');
    // Set github username and email
    const username = 'github-actions[bot]';
    const email = '41898282+github-actions[bot]@users.noreply.github.com';
    child_process_1.execSync(`git config user.name "${username}"`);
    child_process_1.execSync(`git config user.email "${email}"`);
    // Extract version tag, ignoring leading "v" (e.g. v1.0.0 -> 1.0.0)
    const dirtyTag = github.context.ref.substring('refs/tags/'.length);
    const cleaned = semver_1.clean(dirtyTag);
    if (!cleaned) {
        throw new Error('Could not parse semver tag');
    }
    // Upgrade version in package.json to release tag version
    child_process_1.execSync(`yarn version --new-version ${cleaned}`);
    // Publish to NPM with auth token
    child_process_1.execSync('yarn publish');
    // Push new version to github
    child_process_1.execSync('git push');
}
catch (error) {
    if (error && error instanceof Error) {
        core.setFailed(error.message);
    }
}
//# sourceMappingURL=index.js.map