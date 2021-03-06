# NPM Publish Release Action

Github action to automate publishing of new release to NPM and updating relevant version names.

## Usage

```yaml
name: publish
on:
  release:
    types: [released]
jobs:
  publish:
    name: Publish the release to NPM
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{ github.event.release.target_commitish }}
      - uses: actions/setup-node@v2
        with:
          node-version: lts/*
          registry-url: https://registry.npmjs.org/
      - name: Run publish scripts
        uses: danielhzhang/npm-publish-release@main
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```
