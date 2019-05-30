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

exit 0
