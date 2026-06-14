#!/bin/bash
node --experimental-vm-modules node_modules/.bin/jest --config jest.config.cjs --testPathPattern="ticketId.uts" --no-coverage --verbose
echo "EXIT:$?"
