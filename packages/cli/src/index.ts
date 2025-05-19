#!/usr/bin/env node

import { loadAppConfig, ConfigError } from '@no-more-standups/core';

async function main() {
  try {
    console.log('No More Standups CLI');
    console.log('-------------------');

    // Load configuration
    console.log('Loading configuration...');
    const config = await loadAppConfig();
    console.log('Configuration loaded successfully!');

    // Output user info if available
    if (config.user?.name) {
      console.log(`Hello, ${config.user.name}!`);
    } else {
      console.log('Hello, anonymous user!');
    }

    console.log(`Using ${config.llmProvider.provider} model: ${config.llmProvider.model}`);
  } catch (error) {
    if (error instanceof ConfigError) {
      console.error(`Configuration error: ${error.message}`);
      console.error('Please create a valid configuration file at ~/.nms/config.json');
      process.exit(1);
    }

    console.error('An unexpected error occurred:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
