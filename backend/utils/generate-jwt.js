#!/usr/bin/env node

/**
 * CLI script to generate JWT tokens for testing
 * Usage: node utils/generate-jwt.js --userId=user-123 --secret=test-secret
 */

const jwt = require('jsonwebtoken');

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach((arg) => {
    const [key, value] = arg.split('=');
    args[key.replace('--', '')] = value;
  });
  return args;
}

function main() {
  const args = parseArgs();

  if (!args.userId || !args.secret) {
    console.error(
      'Error: Missing required arguments\nUsage: node generate-jwt.js --userId=<id> --secret=<secret>',
    );
    process.exit(1);
  }

  const payload = {
    sub: args.userId,
    email: `${args.userId}@test.local`,
    name: 'Test User',
  };

  const token = jwt.sign(payload, args.secret, { expiresIn: '1h' });
  const bearerToken = `Bearer ${token}`;

  console.log(bearerToken);
}

main();
