#!/bin/bash

#### server ####

# lint check
npm run lint --prefix ./server/
if [[ $? -ne 0 ]]; then
echo "lint check error" >&2
exit 1
fi

# run npm test
npm run test --prefix ./server/

if [[ $? -ne 0 ]]; then
echo "npm test failed" >&2
exit 1
fi

#### ethereum contract ####
# run npm test
npm run test --prefix ./contracts/ethereum/

if [[ $? -ne 0 ]]; then
echo "npm test failed" >&2
exit 1
fi

exit 0
