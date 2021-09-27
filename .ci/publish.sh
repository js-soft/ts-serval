set -e
set -x

npm set //registry.npmjs.org/:_authToken=${NPM_TOKEN}
npm publish
