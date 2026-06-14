#!/bin/bash
cd "/run/media/karan/New Volume/Projects/Yatrasetu/backend"
node --experimental-vm-modules node_modules/.bin/jest \
  --config jest.config.cjs \
  --testPathPatterns="ticketValidity.local" \
  --no-coverage \
  --verbose \
  --forceExit \
  > src/utils/__tests__/local-test-stdout.txt \
  2> src/utils/__tests__/local-test-stderr.txt
echo "EXIT_CODE:$?" > src/utils/__tests__/local-test-exit.txt
