#!/bin/bash

# lint check
npm run lint

if [[ $? -ne 0 ]]; then
echo "lint check error" >&2
exit 1
fi

# run npm test
npm run test

if [[ $? -ne 0 ]]; then
echo "npm test failed" >&2
exit 1
fi

# npm test and check coverage
npm run test:cov

if [[ $? -ne 0 ]]; then
echo "npm test coverage failed" >&2
exit 1
fi

exit 0
