set -e
set -x

npm ci
npm run lint:prettier
npm run lint:eslint
npx license-check
npm audit
npm run build:ci
