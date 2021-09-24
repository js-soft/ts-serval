set -e
set -x

npm set //nexus.js-soft.com/repository/:_authToken=${NPM_TOKEN}
npm publish
