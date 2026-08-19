set -e

npm ci
npm run build:node
npm run lint:eslint
npm run lint:prettier
npm run cdep
npx license-check
npx better-npm-audit audit
