# Development Guide

Install all dependencies and build/test the current version with these commands:

```
npm i
npm run bt
```

## Build and Test

To run all tests and required builds, use the shorthand command `bt` to build and test all assets. `bt` is first running a NodeJS test and afterwards bundling the browser assets to execute the browser tests on them.

## Build Setup and Assets

This library is built with `tsc` and `webpack` and outputs the following assets:

- `/dist` folder - for further development in a non-browser environment (e.g. NodeJS/TypeScript context)
- `tsserval.js` - the uncompressed browser javascript source
- `tsserval.min.js` - the compressed browser javascript source
- Additional files (map files, licenses, ...)

## Build Scripts

Various build scripts are available over the `npm run` commands:

- `bt` builds all assets and runs all tests in a smart order (without doing too many things if tests break)
- `build` compiles all sources, tests to /dist and packs them browser-friendly to /lib-web
    - `build:node` compiles all TypeScript sources via `tsc` from /src to /dist and checks circular dependencies on /dist
    - `build:test` compiles all TypeScript tests via `tsc` from /test to /dist-test
    - `bundle` creates browser-friendly assets
        - `bundle:lib` bundles compiled distribution files to a browser-friendly asset via `webpack` from /dist to /lib-web (tsserval.js)
        - `bundle:min` bundles compiled distribution files to a compressed/minified browser-friendly asset via `webpack` from /dist to /lib-web (tsserval.min.js)
        - `bundle:test` bundles compiled test files to a browser-friendly form via `webpack` from /dist-test to /lib-web
- `build:ci` is meant as build command for the pipeline and effectively runs `build` with a step in between, which replaces the runtime version informations in the respective file

## Test Setup

Tests are written in TypeScript and executed in NodeJS and browser environments.

- NodeJS tests are executed with the `mocha` testrunner and `node-ts` as TypeScript environment. Thus, running the NodeJS tests do not require a `build` step as `node-ts` is coping with the TypeScript compilation internally.
- Browser tests are executed with `bt-runner` which uses `chromedriver` to test the bundled assets in compressed and uncompressed variants within the browser environment. The browser tests do not automatically `bundle` new builds, thus a browser build must be triggered before the browser tests.

## Test Scripts

Various test scripts are available over the `npm run` commands:

- `bt` builds all assets and runs all tests in a smart order (without doing too many things if tests break)
- `test` runs all tests, first NodeJS then browser environment
    - `test:node` runs NodeJS tests with `node-ts`
    - `test:web` runs the tests on a browser environment with `bt-runner`
- `test:server` runs a keep-alive version of `bt-runner` which can be used for debugging

## Deployment

Because of the `files` property within the `package.json`, only the respective build assets are published to the package registry. A license check is done before publishing it to the respective package registry.

## Runtime Dependencies

ts-serval only has only one runtime dependency so far, which is `reflect-metadata` to extract the metadata information out of the TypeScript compilation process and make it accessible in the runtime context.

# Common Mistakes
