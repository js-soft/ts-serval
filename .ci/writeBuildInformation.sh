#!/usr/bin/env bash
set -e

if ! command -v jq &>/dev/null; then
    echo "jq could not be found"
    exit 1
fi

sed -i "s/{{dependencies}}/$(jq .dependencies package.json -cr)/" ./dist/ServalBuildInformation.js
sed -i "s/{{version}}/$(jq .version package.json -cr)/" ./dist/ServalBuildInformation.js
sed -i "s/{{build}}/$BITBUCKET_BUILD_NUMBER/" ./dist/ServalBuildInformation.js
sed -i "s/{{commit}}/$(git rev-parse HEAD)/" ./dist/ServalBuildInformation.js
sed -i "s/{{date}}/$(date -u --iso-8601=seconds)/" ./dist/ServalBuildInformation.js
