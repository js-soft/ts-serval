set -e
set -x

npm ci
npm run lint:prettier
npm run lint:eslint
npm run license-check
npm audit
npm run build:ci
