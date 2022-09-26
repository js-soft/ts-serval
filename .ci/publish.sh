set -e
set -x

npm set //registry.npmjs.org/:_authToken=${NPM_TOKEN}
npx enhanced-publish --if-possible --use-preid-as-tag
