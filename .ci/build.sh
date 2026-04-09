set -e
set -x

npm ci
npm run lint:prettier
npm run lint:eslint
npx license-check
npx better-npm-audit audit --exclude 1112706,1113686,1115723
npm run build:ci
